import type { APIRoute } from 'astro';
import { LIMITS, SAMPLE_VARS, applyVars, renderEmail, renderText, sanitizeDesign } from '../../lib/mailing';

export const prerender = false;

const WINDOW_SECONDS = 600; // 1 correo cada 10 minutos

const env = (k: string): string | undefined =>
  ((import.meta as any).env?.[k] as string | undefined) ?? (typeof process !== 'undefined' ? process.env[k] : undefined);

const json = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

async function sha(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function redis(cmd: (string | number)[]): Promise<any> {
  const url = env('UPSTASH_REDIS_REST_URL');
  const token = env('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) throw new Error('redis-not-configured');
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error('redis-error');
  return (await r.json()).result;
}

/** Intenta tomar el "candado" de 10 min. Devuelve null si lo logró, o los segundos que faltan. */
async function lock(key: string): Promise<number | null> {
  const ok = await redis(['SET', key, '1', 'NX', 'EX', WINDOW_SECONDS]);
  if (ok === 'OK') return null;
  const ttl = Number(await redis(['TTL', key]));
  return ttl > 0 ? ttl : WINDOW_SECONDS;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) throw new Error('turnstile-not-configured');
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!r.ok) return false;
  return (await r.json()).success === true;
}

const EMAIL_RE = /^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,24}$/i;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // 1) Solo desde nuestro propio sitio (mitiga CSRF / uso desde otros orígenes)
  const origin = request.headers.get('origin');
  const reqHost = new URL(request.url).host;
  if (!origin || new URL(origin).host !== reqHost) return json(403, { error: 'Origen no permitido.' });

  // 2) Tamaño y formato
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json(415, { error: 'Formato no válido.' });
  const raw = await request.text();
  if (raw.length > LIMITS.payloadBytes) return json(413, { error: 'El correo es demasiado grande.' });
  let body: any;
  try { body = JSON.parse(raw); } catch { return json(400, { error: 'Solicitud no válida.' }); }

  // 3) Destinatario único y validado
  const to = typeof body?.to === 'string' ? body.to.trim().toLowerCase() : '';
  if (!to || to.length > 254 || !EMAIL_RE.test(to)) return json(400, { error: 'Ingresa un correo válido.' });

  // 4) Diseño sanitizado (jamás se acepta HTML del cliente)
  const design = sanitizeDesign(body?.design);
  if (!design || design.blocks.length === 0) return json(400, { error: 'Diseño no válido.' });
  if (!design.subject) return json(400, { error: 'Escribe un asunto para tu correo.' });
  if (design.blocks.some(b => b.type === 'button' && !b.url)) return json(400, { error: 'Hay un botón sin enlace https válido.' });

  // 5) Configuración del servidor (falla cerrado si falta algo)
  const apiKey = env('RESEND_API_KEY');
  const from = env('MAIL_FROM');
  if (!apiKey || !from || !env('UPSTASH_REDIS_REST_URL') || !env('UPSTASH_REDIS_REST_TOKEN') || !env('TURNSTILE_SECRET_KEY')) {
    return json(503, { error: 'El envío de pruebas aún no está disponible. Inténtalo más tarde.' });
  }

  const ip = clientAddress || request.headers.get('x-real-ip') || (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

  try {
    // 6) Captcha
    const token = typeof body?.token === 'string' ? body.token : '';
    if (!token || token.length > 4096 || !(await verifyTurnstile(token, ip))) {
      return json(400, { error: 'No pudimos verificar que eres una persona. Recarga el captcha e inténtalo de nuevo.' });
    }

    // 7) Límite: 1 correo cada 10 min por IP y por destinatario
    const ipKey = `rl:ip:${await sha(ip)}`;
    const toKey = `rl:to:${await sha(to)}`;
    const waitIp = await lock(ipKey);
    if (waitIp !== null) return json(429, { error: 'Solo puedes enviar 1 prueba cada 10 minutos.', retryAfter: waitIp }, { 'Retry-After': String(waitIp) });
    const waitTo = await lock(toKey);
    if (waitTo !== null) {
      await redis(['DEL', ipKey]);
      return json(429, { error: 'Ese correo ya recibió una prueba hace poco. Intenta en unos minutos.', retryAfter: waitTo }, { 'Retry-After': String(waitTo) });
    }

    // 8) Tope diario global (protege la cuota y la reputación del dominio)
    const cap = Math.max(1, Number(env('MAIL_DAILY_CAP') ?? 80));
    const dayKey = `rl:day:${new Date().toISOString().slice(0, 10)}`;
    const count = Number(await redis(['INCR', dayKey]));
    if (count === 1) await redis(['EXPIRE', dayKey, 90_000]);
    if (count > cap) {
      await redis(['DEL', ipKey]); await redis(['DEL', toKey]);
      return json(429, { error: 'Alcanzamos el máximo diario de pruebas. Vuelve mañana o solicita una demo.' });
    }

    // 9) Render del servidor y envío
    const note = 'Correo de prueba generado en banamailing.com a pedido de quien ingresó esta dirección. Si no lo solicitaste, ignóralo.';
    const html = renderEmail(design, { vars: SAMPLE_VARS, testFooter: true });
    const text = renderText(design, SAMPLE_VARS, note);
    const subject = `[Prueba] ${applyVars(design.subject, SAMPLE_VARS)}`.slice(0, 160);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject, html, text, reply_to: 'banamailing@gmail.com' }),
    });
    if (!res.ok) {
      await redis(['DEL', ipKey]); await redis(['DEL', toKey]);
      await redis(['DECR', dayKey]);
      return json(502, { error: 'No pudimos enviar el correo. Inténtalo de nuevo en un momento.' });
    }
    return json(200, { ok: true, retryAfter: WINDOW_SECONDS });
  } catch {
    return json(503, { error: 'Servicio temporalmente no disponible. Inténtalo más tarde.' });
  }
};

// Cualquier otro método
export const ALL: APIRoute = () => json(405, { error: 'Método no permitido.' }, { Allow: 'POST' });
