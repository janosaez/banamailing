// Motor de correos de BanaMailing: tipos, sanitización y render.
// Se usa tanto en el editor (vista previa) como en el servidor (envío de prueba).
// El servidor NUNCA acepta HTML del cliente: recibe el diseño en JSON, lo sanitiza y lo renderiza.

export const SITE = 'https://banamailing.com';

export const FONTS: Record<string, string> = {
  sans: "Arial, Helvetica, sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  trebuchet: "'Trebuchet MS', Helvetica, sans-serif",
  tahoma: "Tahoma, Geneva, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

export const SOCIALS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  web: 'Sitio web',
};

export type Align = 'left' | 'center' | 'right';

export type Block =
  | { id: string; type: 'header'; text: string; align: Align; bg: string; color: string }
  | { id: string; type: 'heading'; text: string; size: 1 | 2 | 3; align: Align; color: string }
  | { id: string; type: 'text'; text: string; size: number; align: Align; color: string }
  | { id: string; type: 'image'; src: string; alt: string; link: string; width: number; align: Align }
  | { id: string; type: 'button'; text: string; url: string; bg: string; color: string; align: Align; radius: number }
  | { id: string; type: 'divider'; color: string; thickness: number }
  | { id: string; type: 'spacer'; height: number }
  | { id: string; type: 'columns'; leftTitle: string; leftText: string; rightTitle: string; rightText: string; color: string; accent: string }
  | { id: string; type: 'social'; align: Align; items: { net: string; url: string }[] }
  | { id: string; type: 'footer'; text: string; color: string };

export interface Settings {
  bg: string;        // fondo exterior
  contentBg: string; // fondo del cuerpo del correo
  font: string;      // clave de FONTS
  width: number;     // 480–700
  accent: string;    // color de acento
}

export interface Design {
  subject: string;
  preheader: string;
  settings: Settings;
  blocks: Block[];
}

export const LIMITS = {
  blocks: 30,
  text: 2000,
  short: 200,
  url: 500,
  subject: 120,
  preheader: 140,
  socials: 8,
  payloadBytes: 60_000,
};

export const SAMPLE_VARS: Record<string, string> = {
  nombre: 'María',
  empresa: 'Tu Empresa',
  fecha: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }),
  monto: 'S/ 250.00',
};

// ---------- utilidades ----------
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const clamp = (n: unknown, min: number, max: number, def: number): number => {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : def;
  return Math.min(max, Math.max(min, Math.round(v)));
};

const str = (v: unknown, max: number): string =>
  (typeof v === 'string' ? v : '').replace(/\u0000/g, '').slice(0, max);

const oneLine = (v: unknown, max: number): string => str(v, max).replace(/[\r\n\t]+/g, ' ').trim();

const color = (v: unknown, def: string): string =>
  typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : def;

const align = (v: unknown, def: Align = 'left'): Align =>
  v === 'left' || v === 'center' || v === 'right' ? v : def;

/** Solo https (y mailto/tel en botones). Todo lo demás se descarta. */
export function safeUrl(v: unknown, opts: { allowMail?: boolean } = {}): string {
  const raw = str(v, LIMITS.url).trim();
  if (!raw) return '';
  if (/[\s<>"'`\u0000-\u001f]/.test(raw)) return '';
  if (/^https:\/\/[^/?#]+\.[^/?#]+/i.test(raw)) {
    try { return new URL(raw).toString(); } catch { return ''; }
  }
  if (raw.startsWith('/images/')) return SITE + raw; // recursos propios del sitio
  if (opts.allowMail && /^(mailto:[^\s@]+@[^\s@]+|tel:\+?[0-9]{6,15})$/i.test(raw)) return raw;
  return '';
}

/** Reemplaza {{variables}} permitidas; las desconocidas se dejan vacías. */
export function applyVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*([a-z_]{1,20})\s*\}\}/gi, (_, k: string) => vars[k.toLowerCase()] ?? '');
}

// ---------- sanitización (servidor y cliente) ----------
export function sanitizeDesign(input: unknown): Design | null {
  if (!input || typeof input !== 'object') return null;
  const d = input as Record<string, any>;
  const s = (d.settings ?? {}) as Record<string, any>;
  const settings: Settings = {
    bg: color(s.bg, '#F3F0FF'),
    contentBg: color(s.contentBg, '#FFFFFF'),
    font: typeof s.font === 'string' && s.font in FONTS ? s.font : 'sans',
    width: clamp(s.width, 480, 700, 600),
    accent: color(s.accent, '#674CC4'),
  };
  if (!Array.isArray(d.blocks) || d.blocks.length > LIMITS.blocks) return null;

  const blocks: Block[] = [];
  for (const raw of d.blocks) {
    if (!raw || typeof raw !== 'object') return null;
    const b = raw as Record<string, any>;
    const id = typeof b.id === 'string' && /^[a-z0-9]{1,16}$/i.test(b.id) ? b.id : uid();
    switch (b.type) {
      case 'header':
        blocks.push({ id, type: 'header', text: oneLine(b.text, LIMITS.short), align: align(b.align, 'center'), bg: color(b.bg, settings.accent), color: color(b.color, '#FFFFFF') });
        break;
      case 'heading':
        blocks.push({ id, type: 'heading', text: str(b.text, LIMITS.short), size: [1, 2, 3].includes(b.size) ? b.size : 1, align: align(b.align), color: color(b.color, '#1C1C1C') });
        break;
      case 'text':
        blocks.push({ id, type: 'text', text: str(b.text, LIMITS.text), size: clamp(b.size, 12, 22, 16), align: align(b.align), color: color(b.color, '#374151') });
        break;
      case 'image':
        blocks.push({ id, type: 'image', src: safeUrl(b.src), alt: oneLine(b.alt, LIMITS.short), link: safeUrl(b.link), width: clamp(b.width, 20, 100, 100), align: align(b.align, 'center') });
        break;
      case 'button':
        blocks.push({ id, type: 'button', text: oneLine(b.text, 60), url: safeUrl(b.url, { allowMail: true }), bg: color(b.bg, settings.accent), color: color(b.color, '#FFFFFF'), align: align(b.align, 'center'), radius: clamp(b.radius, 0, 40, 8) });
        break;
      case 'divider':
        blocks.push({ id, type: 'divider', color: color(b.color, '#E5E7EB'), thickness: clamp(b.thickness, 1, 8, 1) });
        break;
      case 'spacer':
        blocks.push({ id, type: 'spacer', height: clamp(b.height, 4, 120, 24) });
        break;
      case 'columns':
        blocks.push({ id, type: 'columns', leftTitle: oneLine(b.leftTitle, LIMITS.short), leftText: str(b.leftText, 600), rightTitle: oneLine(b.rightTitle, LIMITS.short), rightText: str(b.rightText, 600), color: color(b.color, '#374151'), accent: color(b.accent, settings.accent) });
        break;
      case 'social': {
        const items = (Array.isArray(b.items) ? b.items : []).slice(0, LIMITS.socials)
          .map((it: any) => ({ net: typeof it?.net === 'string' && it.net in SOCIALS ? it.net : '', url: safeUrl(it?.url) }))
          .filter((it: { net: string; url: string }) => it.net && it.url);
        blocks.push({ id, type: 'social', align: align(b.align, 'center'), items });
        break;
      }
      case 'footer':
        blocks.push({ id, type: 'footer', text: str(b.text, 600), color: color(b.color, '#6B7280') });
        break;
      default:
        return null; // tipo desconocido: rechazar todo el diseño
    }
  }
  return {
    subject: oneLine(d.subject, LIMITS.subject),
    preheader: oneLine(d.preheader, LIMITS.preheader),
    settings,
    blocks,
  };
}

// ---------- render a HTML de correo (tablas + estilos en línea) ----------
const nl2br = (s: string) => esc(s).replace(/\r?\n/g, '<br>');

export interface RenderOpts {
  editor?: boolean;                 // añade data-bid y placeholders visibles
  selectedId?: string | null;
  vars?: Record<string, string>;    // variables de personalización
  testFooter?: boolean;             // aviso legal de correo de prueba
}

function wrapBlock(b: Block, inner: string, o: RenderOpts, pad = '12px 32px'): string {
  const sel = o.editor && o.selectedId === b.id ? 'outline:2px solid #674CC4;outline-offset:-2px;' : '';
  const attr = o.editor ? ` data-bid="${b.id}" style="cursor:pointer;${sel}"` : '';
  return `<tr><td${attr}><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${pad};">${inner}</td></tr></table></td></tr>`;
}

export function renderBlock(b: Block, d: Design, o: RenderOpts): string {
  const v = (t: string) => applyVars(t, o.vars ?? {});
  const font = FONTS[d.settings.font];
  switch (b.type) {
    case 'header':
      return `<tr><td${o.editor ? ` data-bid="${b.id}"` : ''} style="background:${b.bg};padding:22px 32px;text-align:${b.align};${o.editor ? 'cursor:pointer;' : ''}${o.editor && o.selectedId === b.id ? 'outline:2px solid #674CC4;outline-offset:-2px;' : ''}"><span style="font-family:${font};font-size:22px;font-weight:700;color:${b.color};letter-spacing:-0.5px;">${esc(v(b.text)) || (o.editor ? '&nbsp;' : '')}</span></td></tr>`;
    case 'heading': {
      const sz = b.size === 1 ? 30 : b.size === 2 ? 24 : 19;
      return wrapBlock(b, `<h${b.size} style="margin:0;font-family:${font};font-size:${sz}px;line-height:1.25;font-weight:700;color:${b.color};text-align:${b.align};">${nl2br(v(b.text)) || (o.editor ? '&nbsp;' : '')}</h${b.size}>`, o);
    }
    case 'text':
      return wrapBlock(b, `<p style="margin:0;font-family:${font};font-size:${b.size}px;line-height:1.65;color:${b.color};text-align:${b.align};">${nl2br(v(b.text)) || (o.editor ? '&nbsp;' : '')}</p>`, o);
    case 'image': {
      if (!b.src) {
        if (!o.editor) return '';
        return wrapBlock(b, `<div style="border:2px dashed #C4B5FD;border-radius:10px;padding:34px 12px;text-align:center;font-family:${font};font-size:13px;color:#7C6BD6;background:#F8F6FF;">Imagen — pega su enlace https en el panel derecho</div>`, o);
      }
      const img = `<img src="${esc(b.src)}" alt="${esc(b.alt)}" width="${Math.round((d.settings.width - 64) * b.width / 100)}" style="display:block;max-width:100%;height:auto;border:0;border-radius:8px;${b.align === 'center' ? 'margin:0 auto;' : b.align === 'right' ? 'margin-left:auto;' : ''}">`;
      return wrapBlock(b, b.link ? `<a href="${esc(b.link)}" target="_blank" rel="noopener noreferrer nofollow">${img}</a>` : img, o);
    }
    case 'button': {
      const label = esc(v(b.text)) || 'Botón';
      const href = b.url ? esc(b.url) : '#';
      return wrapBlock(b, `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${b.align}" style="margin:${b.align === 'center' ? '0 auto' : '0'};${b.align === 'right' ? 'margin-left:auto;' : ''}"><tr><td style="background:${b.bg};border-radius:${b.radius}px;"><a href="${href}" target="_blank" rel="noopener noreferrer nofollow" style="display:inline-block;padding:13px 28px;font-family:${font};font-size:16px;font-weight:700;color:${b.color};text-decoration:none;border-radius:${b.radius}px;">${label}</a></td></tr></table>`, o, '14px 32px');
    }
    case 'divider':
      return wrapBlock(b, `<div style="border-top:${b.thickness}px solid ${b.color};font-size:0;line-height:0;">&nbsp;</div>`, o, '8px 32px');
    case 'spacer':
      return `<tr><td${o.editor ? ` data-bid="${b.id}"` : ''} style="height:${b.height}px;line-height:${b.height}px;font-size:0;${o.editor ? 'cursor:pointer;' : ''}${o.editor && o.selectedId === b.id ? 'outline:2px dashed #674CC4;outline-offset:-2px;' : ''}">&nbsp;</td></tr>`;
    case 'columns': {
      const col = (t: string, x: string) => `<td width="50%" valign="top" style="padding:0 10px;font-family:${font};"><div style="font-size:17px;font-weight:700;color:${b.accent};margin-bottom:6px;">${esc(v(t))}</div><div style="font-size:15px;line-height:1.6;color:${b.color};">${nl2br(v(x))}</div></td>`;
      return wrapBlock(b, `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${col(b.leftTitle, b.leftText)}${col(b.rightTitle, b.rightText)}</tr></table>`, o, '12px 22px');
    }
    case 'social': {
      const links = b.items.map(it => `<a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer nofollow" style="display:inline-block;margin:3px 4px;padding:7px 14px;border:1px solid ${d.settings.accent};border-radius:999px;font-family:${font};font-size:13px;font-weight:600;color:${d.settings.accent};text-decoration:none;">${esc(SOCIALS[it.net])}</a>`).join('');
      if (!links && !o.editor) return '';
      return wrapBlock(b, `<div style="text-align:${b.align};font-family:${font};font-size:13px;color:#9CA3AF;">${links || 'Redes sociales — agrega enlaces en el panel derecho'}</div>`, o);
    }
    case 'footer':
      return wrapBlock(b, `<p style="margin:0;font-family:${font};font-size:12px;line-height:1.6;color:${b.color};text-align:center;">${nl2br(v(b.text)) || (o.editor ? '&nbsp;' : '')}</p>`, o, '18px 32px');
  }
}

export function renderEmail(d: Design, o: RenderOpts = {}): string {
  const s = d.settings;
  const body = d.blocks.map(b => renderBlock(b, d, o)).join('\n');
  const pre = d.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(applyVars(d.preheader, o.vars ?? {}))}${'&nbsp;&zwnj;'.repeat(40)}</div>`
    : '';
  const testNote = o.testFooter
    ? `<tr><td style="padding:16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6B7280;text-align:center;">Correo de <strong>prueba</strong> generado en <a href="${SITE}/arma-tu-mailing" style="color:#674CC4;">banamailing.com</a> a pedido de quien ingresó esta dirección. BanaMailing no es el autor del contenido. Si no lo solicitaste, ignóralo: no recibirás más mensajes.</td></tr>`
    : '';
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(applyVars(d.subject, o.vars ?? {}))}</title>
<style>img{-ms-interpolation-mode:bicubic}@media(max-width:620px){.wrap{width:100%!important}}</style></head>
<body style="margin:0;padding:0;background:${s.bg};">${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${s.bg};"><tr><td align="center" style="padding:24px 10px;">
<table role="presentation" class="wrap" width="${s.width}" cellpadding="0" cellspacing="0" border="0" style="width:${s.width}px;max-width:100%;background:${s.contentBg};border-radius:12px;overflow:hidden;">
${body}
</table>
<table role="presentation" width="${s.width}" cellpadding="0" cellspacing="0" border="0" style="max-width:100%;">${testNote}</table>
</td></tr></table></body></html>`;
}

/** Versión texto plano (mejora la entregabilidad). */
export function renderText(d: Design, vars: Record<string, string>, testNote: string): string {
  const out: string[] = [];
  for (const b of d.blocks) {
    switch (b.type) {
      case 'header': case 'heading': case 'text': case 'footer':
        if (b.text) out.push(applyVars(b.text, vars));
        break;
      case 'button':
        if (b.text) out.push(`${applyVars(b.text, vars)}: ${b.url}`);
        break;
      case 'columns':
        out.push(`${applyVars(b.leftTitle, vars)}\n${applyVars(b.leftText, vars)}`, `${applyVars(b.rightTitle, vars)}\n${applyVars(b.rightText, vars)}`);
        break;
      case 'social':
        for (const it of b.items) out.push(`${SOCIALS[it.net]}: ${it.url}`);
        break;
      default:
    }
  }
  out.push('--', testNote);
  return out.join('\n\n');
}

export function newBlock(type: Block['type'], accent = '#674CC4'): Block {
  const id = uid();
  switch (type) {
    case 'header': return { id, type, text: 'Tu Marca', align: 'center', bg: accent, color: '#FFFFFF' };
    case 'heading': return { id, type, text: 'Escribe tu título aquí', size: 1, align: 'left', color: '#1C1C1C' };
    case 'text': return { id, type, text: 'Hola {{nombre}}, escribe aquí el mensaje de tu correo. Puedes usar saltos de línea y variables de personalización.', size: 16, align: 'left', color: '#374151' };
    case 'image': return { id, type, src: '', alt: 'Descripción de la imagen', link: '', width: 100, align: 'center' };
    case 'button': return { id, type, text: 'Haz clic aquí', url: 'https://', bg: accent, color: '#FFFFFF', align: 'center', radius: 8 };
    case 'divider': return { id, type, color: '#E5E7EB', thickness: 1 };
    case 'spacer': return { id, type, height: 24 };
    case 'columns': return { id, type, leftTitle: 'Beneficio 1', leftText: 'Describe aquí el primer beneficio.', rightTitle: 'Beneficio 2', rightText: 'Describe aquí el segundo beneficio.', color: '#374151', accent };
    case 'social': return { id, type, align: 'center', items: [{ net: 'facebook', url: 'https://facebook.com/' }, { net: 'instagram', url: 'https://instagram.com/' }] };
    case 'footer': return { id, type, text: 'Tu Empresa · Lima, Perú\nRecibes este correo porque te suscribiste a nuestras novedades.', color: '#6B7280' };
  }
}
