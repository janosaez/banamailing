// Motor de correos de BanaMailing: tipos, sanitización y render.
// Se usa tanto en el editor (vista previa) como en el servidor (envío de prueba).
// El servidor NUNCA acepta HTML del cliente: recibe el diseño en JSON, lo sanitiza y lo renderiza.
// El formato de texto se guarda como mini-markdown (**negrita**, *cursiva*, [texto](https://enlace)).

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

export interface HeaderB { id: string; type: 'header'; text: string; align: Align; bg: string; color: string }
export interface HeadingB { id: string; type: 'heading'; text: string; size: 1 | 2 | 3; align: Align; color: string }
export interface TextB { id: string; type: 'text'; text: string; size: number; align: Align; color: string }
export interface ImageB { id: string; type: 'image'; src: string; alt: string; link: string; width: number; align: Align }
export interface ButtonB { id: string; type: 'button'; text: string; url: string; bg: string; color: string; align: Align; radius: number }
export interface DividerB { id: string; type: 'divider'; color: string; thickness: number }
export interface SpacerB { id: string; type: 'spacer'; height: number }
export interface ColumnsB { id: string; type: 'columns'; leftTitle: string; leftText: string; rightTitle: string; rightText: string; color: string; accent: string }
export interface SocialB { id: string; type: 'social'; align: Align; items: { net: string; url: string }[] }
export interface FooterB { id: string; type: 'footer'; text: string; color: string }
export type CellBlock = HeadingB | TextB | ImageB | ButtonB | DividerB | SpacerB;
export interface RowB { id: string; type: 'row'; cols: 1 | 2 | 3; bg: string; cells: CellBlock[][] }
export type Block = HeaderB | CellBlock | ColumnsB | SocialB | FooterB | RowB;

export const CELL_TYPES = ['heading', 'text', 'image', 'button', 'divider', 'spacer'] as const;
export const isCellType = (t: string): boolean => (CELL_TYPES as readonly string[]).includes(t);

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
  cellBlocks: 6,
  text: 2000,
  short: 200,
  url: 500,
  subject: 120,
  preheader: 140,
  socials: 8,
  payloadBytes: 80_000,
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

const optColor = (v: unknown): string =>
  typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : '';

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

// ---------- formato de texto: mini-markdown seguro ----------
const nl2br = (s: string) => s.replace(/\r?\n/g, '<br>');

/** Texto con formato → HTML. Primero se escapa TODO; solo después se reconocen las marcas. */
export function inlineHtml(raw: string, accent: string): string {
  let h = esc(raw);
  h = h.replace(/\[([^\]\n]{1,200})\]\((https:\/\/[^\s)<>]{1,400})\)/g,
    (_m, t: string, u: string) => `<a href="${u}" target="_blank" rel="noopener noreferrer nofollow" style="color:${accent};text-decoration:underline;">${t}</a>`);
  h = h.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(^|[^*])\*([^*\s][^*\n]*?)\*(?!\*)/g, '$1<em>$2</em>');
  return nl2br(h);
}

/** Texto con formato → texto plano (para la parte text/plain del correo). */
export function mdToPlain(raw: string): string {
  return raw
    .replace(/\[([^\]\n]{1,200})\]\((https:\/\/[^\s)<>]{1,400})\)/g, '$1 ($2)')
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\s][^*\n]*?)\*(?!\*)/g, '$1$2');
}

// ---------- sanitización (servidor y cliente) ----------
class Invalid extends Error {}

function sanitizeBlock(raw: unknown, settings: Settings, inCell: boolean): Block {
  if (!raw || typeof raw !== 'object') throw new Invalid();
  const b = raw as Record<string, any>;
  const id = typeof b.id === 'string' && /^[a-z0-9]{1,16}$/i.test(b.id) ? b.id : uid();
  if (inCell && !isCellType(b.type)) throw new Invalid();
  switch (b.type) {
    case 'header':
      return { id, type: 'header', text: oneLine(b.text, LIMITS.short), align: align(b.align, 'center'), bg: color(b.bg, settings.accent), color: color(b.color, '#FFFFFF') };
    case 'heading':
      return { id, type: 'heading', text: str(b.text, LIMITS.short), size: [1, 2, 3].includes(b.size) ? b.size : 1, align: align(b.align), color: color(b.color, '#1C1C1C') };
    case 'text':
      return { id, type: 'text', text: str(b.text, LIMITS.text), size: clamp(b.size, 12, 22, 16), align: align(b.align), color: color(b.color, '#374151') };
    case 'image':
      return { id, type: 'image', src: safeUrl(b.src), alt: oneLine(b.alt, LIMITS.short), link: safeUrl(b.link), width: clamp(b.width, 20, 100, 100), align: align(b.align, 'center') };
    case 'button':
      return { id, type: 'button', text: oneLine(b.text, 60), url: safeUrl(b.url, { allowMail: true }), bg: color(b.bg, settings.accent), color: color(b.color, '#FFFFFF'), align: align(b.align, 'center'), radius: clamp(b.radius, 0, 40, 8) };
    case 'divider':
      return { id, type: 'divider', color: color(b.color, '#E5E7EB'), thickness: clamp(b.thickness, 1, 8, 1) };
    case 'spacer':
      return { id, type: 'spacer', height: clamp(b.height, 4, 120, 24) };
    case 'columns':
      return { id, type: 'columns', leftTitle: oneLine(b.leftTitle, LIMITS.short), leftText: str(b.leftText, 600), rightTitle: oneLine(b.rightTitle, LIMITS.short), rightText: str(b.rightText, 600), color: color(b.color, '#374151'), accent: color(b.accent, settings.accent) };
    case 'social': {
      const items = (Array.isArray(b.items) ? b.items : []).slice(0, LIMITS.socials)
        .map((it: any) => ({ net: typeof it?.net === 'string' && it.net in SOCIALS ? it.net : '', url: safeUrl(it?.url) }))
        .filter((it: { net: string; url: string }) => it.net && it.url);
      return { id, type: 'social', align: align(b.align, 'center'), items };
    }
    case 'footer':
      return { id, type: 'footer', text: str(b.text, 600), color: color(b.color, '#6B7280') };
    case 'row': {
      const cols = ([1, 2, 3].includes(b.cols) ? b.cols : 2) as 1 | 2 | 3;
      const src = Array.isArray(b.cells) ? b.cells : [];
      const cells: CellBlock[][] = [];
      for (let c = 0; c < cols; c++) {
        const col = Array.isArray(src[c]) ? src[c] : [];
        if (col.length > LIMITS.cellBlocks) throw new Invalid();
        cells.push(col.map((x: unknown) => sanitizeBlock(x, settings, true) as CellBlock));
      }
      return { id, type: 'row', cols, bg: optColor(b.bg), cells };
    }
    default:
      throw new Invalid(); // tipo desconocido: rechazar todo el diseño
  }
}

export function sanitizeDesign(input: unknown): Design | null {
  try {
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
    const blocks = d.blocks.map((x: unknown) => sanitizeBlock(x, settings, false));
    return { subject: oneLine(d.subject, LIMITS.subject), preheader: oneLine(d.preheader, LIMITS.preheader), settings, blocks };
  } catch {
    return null;
  }
}

/** Todos los bloques, incluidos los que están dentro de filas. */
export function allBlocks(d: Design): Block[] {
  const out: Block[] = [];
  for (const b of d.blocks) {
    out.push(b);
    if (b.type === 'row') for (const col of b.cells) out.push(...col);
  }
  return out;
}

// ---------- render a HTML de correo (tablas + estilos en línea) ----------
export interface RenderOpts {
  editor?: boolean;                 // añade data-bid, data-edit y placeholders visibles
  vars?: Record<string, string>;    // variables de personalización
  testFooter?: boolean;             // aviso legal de correo de prueba
  cell?: boolean;                   // (interno) dentro de una celda de fila
  cols?: number;                    // (interno) nº de columnas de la fila
}

function wrap(b: Block, inner: string, o: RenderOpts, pad = '12px 32px'): string {
  const attr = o.editor ? ` data-bid="${b.id}"` : '';
  return `<tr><td${attr}><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:${o.cell ? '8px 10px' : pad};">${inner}</td></tr></table></td></tr>`;
}

export function renderBlock(b: Block, d: Design, o: RenderOpts): string {
  const vars = o.vars ?? {};
  const v = (t: string) => applyVars(t, vars);
  const font = FONTS[d.settings.font];
  const ed = (kind: 'rich' | 'plain' | 'line') => (o.editor ? ` data-edit="${kind}"` : '');
  const nbsp = o.editor ? '&nbsp;' : '';
  switch (b.type) {
    case 'header':
      return `<tr><td${o.editor ? ` data-bid="${b.id}"` : ''} style="background:${b.bg};padding:22px 32px;text-align:${b.align};"><span${ed('line')} style="font-family:${font};font-size:22px;font-weight:700;color:${b.color};letter-spacing:-0.5px;">${esc(v(b.text)) || nbsp}</span></td></tr>`;
    case 'heading': {
      const sz = b.size === 1 ? 30 : b.size === 2 ? 24 : 19;
      const small = o.cell ? Math.round(sz * 0.8) : sz;
      return wrap(b, `<h${b.size}${ed('plain')} style="margin:0;font-family:${font};font-size:${small}px;line-height:1.25;font-weight:700;color:${b.color};text-align:${b.align};">${nl2br(esc(v(b.text))) || nbsp}</h${b.size}>`, o);
    }
    case 'text':
      return wrap(b, `<p${ed('rich')} style="margin:0;font-family:${font};font-size:${o.cell ? Math.min(b.size, 16) : b.size}px;line-height:1.65;color:${b.color};text-align:${b.align};">${inlineHtml(v(b.text), d.settings.accent) || nbsp}</p>`, o);
    case 'image': {
      if (!b.src) {
        if (!o.editor) return '';
        return wrap(b, `<div style="border:2px dashed #C4B5FD;border-radius:10px;padding:30px 10px;text-align:center;font-family:${font};font-size:13px;color:#7C6BD6;background:#F8F6FF;">Imagen — pega su enlace https en el panel derecho</div>`, o);
      }
      const colW = o.cell ? Math.round((d.settings.width - 44) / (o.cols ?? 1) - 20) : d.settings.width - 64;
      const img = `<img src="${esc(b.src)}" alt="${esc(b.alt)}" width="${Math.round(colW * b.width / 100)}" style="display:block;max-width:100%;height:auto;border:0;border-radius:8px;${b.align === 'center' ? 'margin:0 auto;' : b.align === 'right' ? 'margin-left:auto;' : ''}">`;
      return wrap(b, b.link ? `<a href="${esc(b.link)}" target="_blank" rel="noopener noreferrer nofollow">${img}</a>` : img, o);
    }
    case 'button': {
      const label = esc(v(b.text)) || (o.editor ? 'Botón' : '');
      const href = b.url ? esc(b.url) : '#';
      return wrap(b, `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${b.align}" style="margin:${b.align === 'center' ? '0 auto' : '0'};${b.align === 'right' ? 'margin-left:auto;' : ''}"><tr><td style="background:${b.bg};border-radius:${b.radius}px;"><a${ed('line')} href="${href}" target="_blank" rel="noopener noreferrer nofollow" style="display:inline-block;padding:13px 28px;font-family:${font};font-size:16px;font-weight:700;color:${b.color};text-decoration:none;border-radius:${b.radius}px;">${label}</a></td></tr></table>`, o, '14px 32px');
    }
    case 'divider':
      return wrap(b, `<div style="border-top:${b.thickness}px solid ${b.color};font-size:0;line-height:0;">&nbsp;</div>`, o, '8px 32px');
    case 'spacer':
      return `<tr><td${o.editor ? ` data-bid="${b.id}"` : ''} style="height:${b.height}px;line-height:${b.height}px;font-size:0;">&nbsp;</td></tr>`;
    case 'columns': { // formato antiguo (se conserva para diseños guardados)
      const col = (t: string, x: string) => `<td class="col" width="50%" valign="top" style="padding:0 10px;font-family:${font};"><div style="font-size:17px;font-weight:700;color:${b.accent};margin-bottom:6px;">${esc(v(t))}</div><div style="font-size:15px;line-height:1.6;color:${b.color};">${inlineHtml(v(x), d.settings.accent)}</div></td>`;
      return wrap(b, `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${col(b.leftTitle, b.leftText)}${col(b.rightTitle, b.rightText)}</tr></table>`, o, '12px 22px');
    }
    case 'social': {
      const links = b.items.map(it => `<a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer nofollow" style="display:inline-block;margin:3px 4px;padding:7px 14px;border:1px solid ${d.settings.accent};border-radius:999px;font-family:${font};font-size:13px;font-weight:600;color:${d.settings.accent};text-decoration:none;">${esc(SOCIALS[it.net])}</a>`).join('');
      if (!links && !o.editor) return '';
      return wrap(b, `<div style="text-align:${b.align};font-family:${font};font-size:13px;color:#9CA3AF;">${links || 'Redes sociales — agrega enlaces en el panel derecho'}</div>`, o);
    }
    case 'footer':
      return wrap(b, `<p${ed('rich')} style="margin:0;font-family:${font};font-size:12px;line-height:1.6;color:${b.color};text-align:center;">${inlineHtml(v(b.text), d.settings.accent) || nbsp}</p>`, o, '18px 32px');
    case 'row': {
      const pct = Math.floor(100 / b.cols);
      const cells = b.cells.map((col, ci) => {
        const inner = col.map(c => renderBlock(c, d, { ...o, cell: true, cols: b.cols })).join('')
          || (o.editor ? `<tr><td style="padding:22px 10px;border:2px dashed #C4B5FD;border-radius:8px;text-align:center;font-family:${font};font-size:12px;color:#7C6BD6;background:#F8F6FF;">Arrastra un bloque aquí</td></tr>` : '<tr><td></td></tr>');
        return `<td class="col" width="${pct}%" valign="top"${o.editor ? ` data-cell="${b.id}|${ci}"` : ''} style="width:${pct}%;padding:0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table></td>`;
      }).join('');
      return `<tr><td${o.editor ? ` data-bid="${b.id}"` : ''} style="${b.bg ? `background:${b.bg};` : ''}padding:4px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>`;
    }
  }
}

const EDITOR_CSS = `
[data-bid]{cursor:pointer}
[data-bid]:hover{outline:1px dashed #A78BFA;outline-offset:-1px}
[data-bid].sel{outline:2px solid #674CC4!important;outline-offset:-2px}
[data-edit][contenteditable=true]{outline:none;cursor:text;min-width:20px}
[data-cell]{min-height:40px}
[data-cell].dropping{outline:2px dashed #674CC4;outline-offset:-3px;background:rgba(103,76,196,.06)}
.bld-ovl{position:absolute;z-index:50;display:flex;width:max-content;white-space:nowrap;gap:1px;background:#674CC4;border-radius:7px;padding:2px;box-shadow:0 4px 14px rgba(0,0,0,.25);font-family:Arial,sans-serif;user-select:none}
.bld-ovl button,.bld-ovl span{all:unset;box-sizing:border-box;min-width:26px;height:26px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700;cursor:pointer;border-radius:5px;padding:0 6px}
.bld-ovl button:hover,.bld-ovl span:hover{background:rgba(255,255,255,.22)}
.bld-ovl .sep{width:1px;min-width:1px;padding:0;background:rgba(255,255,255,.35);margin:3px 2px;cursor:default}
.bld-ovl .sep:hover{background:rgba(255,255,255,.35)}
.bld-ovl .grip{cursor:grab}
.bld-line{position:absolute;z-index:60;height:4px;background:#674CC4;border-radius:2px;pointer-events:none;box-shadow:0 0 0 2px rgba(103,76,196,.25)}
`;

export function renderEmail(d: Design, o: RenderOpts = {}): string {
  const s = d.settings;
  const body = d.blocks.map(b => renderBlock(b, d, o)).join('\n');
  const vars = o.vars ?? {};
  const pre = d.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(applyVars(d.preheader, vars))}${'&nbsp;&zwnj;'.repeat(40)}</div>`
    : '';
  const testNote = o.testFooter
    ? `<tr><td style="padding:16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#6B7280;text-align:center;">Correo de <strong>prueba</strong> generado en <a href="${SITE}/arma-tu-mailing" style="color:#674CC4;">banamailing.com</a> a pedido de quien ingresó esta dirección. BanaMailing no es el autor del contenido. Si no lo solicitaste, ignóralo: no recibirás más mensajes.</td></tr>`
    : '';
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(applyVars(d.subject, vars))}</title>
<style>img{-ms-interpolation-mode:bicubic}@media(max-width:620px){.wrap{width:100%!important}.col{display:block!important;width:100%!important}}${o.editor ? EDITOR_CSS : ''}</style></head>
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
  const t = (s: string) => mdToPlain(applyVars(s, vars));
  const out: string[] = [];
  const one = (b: Block) => {
    switch (b.type) {
      case 'header': case 'heading': case 'text': case 'footer':
        if (b.text) out.push(t(b.text));
        break;
      case 'button':
        if (b.text) out.push(`${t(b.text)}: ${b.url}`);
        break;
      case 'columns':
        out.push(`${t(b.leftTitle)}\n${t(b.leftText)}`, `${t(b.rightTitle)}\n${t(b.rightText)}`);
        break;
      case 'social':
        for (const it of b.items) out.push(`${SOCIALS[it.net]}: ${it.url}`);
        break;
      case 'row':
        for (const col of b.cells) col.forEach(one);
        break;
      default:
    }
  };
  d.blocks.forEach(one);
  out.push('--', testNote);
  return out.join('\n\n');
}

export function newBlock(type: Exclude<Block['type'], 'row'>, accent = '#674CC4'): Block {
  const id = uid();
  switch (type) {
    case 'header': return { id, type, text: 'Tu Marca', align: 'center', bg: accent, color: '#FFFFFF' };
    case 'heading': return { id, type, text: 'Escribe tu título aquí', size: 1, align: 'left', color: '#1C1C1C' };
    case 'text': return { id, type, text: 'Hola {{nombre}}, escribe aquí el mensaje de tu correo. Puedes usar **negrita**, *cursiva* y enlaces, además de variables de personalización.', size: 16, align: 'left', color: '#374151' };
    case 'image': return { id, type, src: '', alt: 'Descripción de la imagen', link: '', width: 100, align: 'center' };
    case 'button': return { id, type, text: 'Haz clic aquí', url: 'https://', bg: accent, color: '#FFFFFF', align: 'center', radius: 8 };
    case 'divider': return { id, type, color: '#E5E7EB', thickness: 1 };
    case 'spacer': return { id, type, height: 24 };
    case 'columns': return { id, type, leftTitle: 'Beneficio 1', leftText: 'Describe aquí el primer beneficio.', rightTitle: 'Beneficio 2', rightText: 'Describe aquí el segundo beneficio.', color: '#374151', accent };
    case 'social': return { id, type, align: 'center', items: [{ net: 'facebook', url: 'https://facebook.com/' }, { net: 'instagram', url: 'https://instagram.com/' }] };
    case 'footer': return { id, type, text: 'Tu Empresa · Lima, Perú\nRecibes este correo porque te suscribiste a nuestras novedades.', color: '#6B7280' };
  }
}

export function newRow(cols: 1 | 2 | 3, accent = '#674CC4'): RowB {
  return { id: uid(), type: 'row', cols, bg: '', cells: Array.from({ length: cols }, () => {
    const t = newBlock('text', accent) as TextB;
    t.text = 'Escribe aquí tu contenido.';
    return [t];
  }) };
}
