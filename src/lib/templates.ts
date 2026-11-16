import { newBlock, uid, type Block, type CellBlock, type Design, type RowB, type Settings } from './mailing';

export interface Template {
  id: string;
  name: string;
  desc: string;
  design: Design;
}

type Over = Record<string, unknown>;
type Simple = Exclude<Block['type'], 'row'>;

const mk = (type: Simple, over: Over = {}, accent = '#674CC4'): Block =>
  ({ ...newBlock(type, accent), ...over }) as Block;
const cb = (type: CellBlock['type'], over: Over = {}, accent = '#674CC4'): CellBlock =>
  mk(type, over, accent) as CellBlock;
const row = (cells: CellBlock[][], over: Over = {}): RowB =>
  ({ id: uid(), type: 'row', cols: cells.length as 1 | 2 | 3, bg: '', cells, ...over });

const base = (accent: string, extra: Partial<Settings> = {}): Settings => ({
  bg: '#F3F0FF', contentBg: '#FFFFFF', font: 'sans', width: 600, accent, ...extra,
});

export const TEMPLATES: Template[] = [
  {
    id: 'en-blanco',
    name: 'En blanco',
    desc: 'Empieza desde cero',
    design: {
      subject: 'Asunto de tu correo',
      preheader: '',
      settings: base('#674CC4'),
      blocks: [mk('header', { text: 'Tu Marca' }), mk('heading', { text: 'Escribe tu título' }), mk('text'), mk('footer')],
    },
  },
  {
    id: 'promocion',
    name: 'Promoción / Oferta',
    desc: 'Descuento con llamada a la acción',
    design: {
      subject: '{{nombre}}, 30% de descuento solo esta semana',
      preheader: 'Aprovecha antes de que termine la oferta',
      settings: base('#E11D48', { bg: '#FFF1F2' }),
      blocks: [
        mk('header', { text: 'Tu Marca', bg: '#E11D48' }, '#E11D48'),
        mk('spacer', { height: 12 }),
        mk('heading', { text: '30% DE DESCUENTO', align: 'center', color: '#E11D48' }),
        mk('text', { text: 'Hola **{{nombre}}**, por tiempo limitado tienes un descuento exclusivo en todos nuestros productos y servicios.', align: 'center' }),
        mk('button', { text: 'Quiero mi descuento', url: 'https://banamailing.com', bg: '#E11D48' }, '#E11D48'),
        mk('divider'),
        row([
          [cb('heading', { text: 'Envío rápido', size: 3, color: '#E11D48' }), cb('text', { text: 'Recibe tu pedido en 24 a 48 horas.', size: 15 })],
          [cb('heading', { text: 'Garantía', size: 3, color: '#E11D48' }), cb('text', { text: '30 días para cambios y devoluciones.', size: 15 })],
        ]),
        mk('footer', { text: 'Tu Empresa · Lima, Perú\nOferta válida hasta el {{fecha}}.' }),
      ],
    },
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    desc: 'Boletín de novedades con secciones',
    design: {
      subject: 'Novedades del mes en {{empresa}}',
      preheader: 'Lo más importante de este mes, en 2 minutos',
      settings: base('#674CC4'),
      blocks: [
        mk('header', { text: 'Boletín mensual' }),
        mk('heading', { text: 'Lo que pasó este mes', size: 2 }),
        mk('text', { text: 'Hola {{nombre}}, te compartimos las novedades más relevantes y consejos prácticos para tu negocio.' }),
        mk('image', { alt: 'Imagen destacada' }),
        row([
          [cb('heading', { text: '1. Nuevo servicio', size: 3 }), cb('text', { text: 'Describe aquí la primera noticia con un par de líneas claras y directas.', size: 15 }), cb('button', { text: 'Leer más', align: 'left' })],
          [cb('heading', { text: '2. Consejo del mes', size: 3 }), cb('text', { text: 'Comparte un consejo útil que tus lectores puedan aplicar hoy mismo.', size: 15 }), cb('button', { text: 'Ver consejo', align: 'left' })],
        ]),
        mk('divider'),
        mk('social'),
        mk('footer'),
      ],
    },
  },
  {
    id: 'bienvenida',
    name: 'Bienvenida',
    desc: 'Primer correo para nuevos clientes',
    design: {
      subject: 'Bienvenido(a) a {{empresa}}, {{nombre}}',
      preheader: 'Te contamos cómo empezar en 3 pasos',
      settings: base('#16A34A', { bg: '#F0FDF4' }),
      blocks: [
        mk('header', { text: 'Tu Marca', bg: '#16A34A' }, '#16A34A'),
        mk('heading', { text: '¡Bienvenido(a), {{nombre}}!', color: '#16A34A', align: 'center' }),
        mk('text', { text: 'Nos alegra tenerte con nosotros. Estos son los 3 pasos para sacarle el máximo provecho a tu cuenta.', align: 'center' }),
        row([
          [cb('heading', { text: '1. Configura', size: 3, color: '#16A34A', align: 'center' }), cb('text', { text: 'Completa tu perfil y tus datos de contacto.', size: 14, align: 'center' })],
          [cb('heading', { text: '2. Explora', size: 3, color: '#16A34A', align: 'center' }), cb('text', { text: 'Conoce las herramientas disponibles.', size: 14, align: 'center' })],
          [cb('heading', { text: '3. Crece', size: 3, color: '#16A34A', align: 'center' }), cb('text', { text: 'Lanza tu primera campaña.', size: 14, align: 'center' })],
        ]),
        mk('button', { text: 'Comenzar ahora', bg: '#16A34A', url: 'https://banamailing.com' }, '#16A34A'),
        mk('text', { text: '¿Dudas? Responde este correo y te ayudamos.', size: 14, align: 'center', color: '#6B7280' }),
        mk('footer'),
      ],
    },
  },
  {
    id: 'evento',
    name: 'Invitación a evento',
    desc: 'Webinar, taller o lanzamiento',
    design: {
      subject: 'Estás invitado(a): Webinar gratuito',
      preheader: 'Cupos limitados, reserva el tuyo',
      settings: base('#0F172A', { bg: '#E2E8F0', font: 'georgia' }),
      blocks: [
        mk('header', { text: 'WEBINAR EN VIVO', bg: '#0F172A' }, '#0F172A'),
        mk('heading', { text: 'Cómo duplicar tus ventas con email marketing', align: 'center' }),
        mk('text', { text: 'Hola {{nombre}}, te invitamos a una sesión práctica con casos reales y plantillas que puedes usar desde el primer día.', align: 'center' }),
        row([
          [cb('heading', { text: 'Fecha', size: 3, color: '#0F172A' }), cb('text', { text: 'Jueves 20\n7:00 p. m. (hora Lima)', size: 15 })],
          [cb('heading', { text: 'Lugar', size: 3, color: '#0F172A' }), cb('text', { text: 'Online por Zoom\nGratis, con cupos limitados', size: 15 })],
        ]),
        mk('button', { text: 'Reservar mi cupo', bg: '#0F172A', url: 'https://banamailing.com' }, '#0F172A'),
        mk('footer'),
      ],
    },
  },
  {
    id: 'cobranza',
    name: 'Recordatorio de pago',
    desc: 'Aviso de cobranza cordial',
    design: {
      subject: 'Recordatorio de pago pendiente — {{empresa}}',
      preheader: 'Tu pago vence pronto',
      settings: base('#2563EB', { bg: '#EFF6FF' }),
      blocks: [
        mk('header', { text: 'Tu Empresa', bg: '#2563EB' }, '#2563EB'),
        mk('heading', { text: 'Recordatorio de pago', size: 2 }),
        mk('text', { text: 'Estimado(a) {{nombre}},\n\nTe recordamos que tienes un pago pendiente por **{{monto}}** con vencimiento el {{fecha}}.\n\nSi ya realizaste el pago, por favor ignora este mensaje.' }),
        mk('button', { text: 'Pagar ahora', bg: '#2563EB', url: 'https://banamailing.com' }, '#2563EB'),
        mk('text', { text: 'Gracias por tu confianza.', size: 14, color: '#6B7280' }),
        mk('footer', { text: 'Tu Empresa · Lima, Perú' }),
      ],
    },
  },
  {
    id: 'catalogo',
    name: 'Catálogo de productos',
    desc: 'Tres productos destacados',
    design: {
      subject: 'Lo nuevo en {{empresa}}: mira nuestros destacados',
      preheader: 'Tres productos que te van a encantar',
      settings: base('#EA580C', { bg: '#FFF7ED' }),
      blocks: [
        mk('header', { text: 'Tu Tienda', bg: '#EA580C' }, '#EA580C'),
        mk('heading', { text: 'Nuevos productos', align: 'center', size: 2 }),
        mk('text', { text: 'Hola {{nombre}}, descubre lo más nuevo de nuestra colección.', align: 'center' }),
        row([
          [cb('image', { alt: 'Producto 1' }), cb('heading', { text: 'Producto 1', size: 3, align: 'center' }), cb('text', { text: 'S/ 99.00', size: 15, align: 'center', color: '#EA580C' }), cb('button', { text: 'Comprar', bg: '#EA580C', align: 'center' })],
          [cb('image', { alt: 'Producto 2' }), cb('heading', { text: 'Producto 2', size: 3, align: 'center' }), cb('text', { text: 'S/ 129.00', size: 15, align: 'center', color: '#EA580C' }), cb('button', { text: 'Comprar', bg: '#EA580C', align: 'center' })],
          [cb('image', { alt: 'Producto 3' }), cb('heading', { text: 'Producto 3', size: 3, align: 'center' }), cb('text', { text: 'S/ 149.00', size: 15, align: 'center', color: '#EA580C' }), cb('button', { text: 'Comprar', bg: '#EA580C', align: 'center' })],
        ]),
        mk('divider'),
        mk('social'),
        mk('footer'),
      ],
    },
  },
  {
    id: 'gracias',
    name: 'Agradecimiento',
    desc: 'Post-compra o post-evento',
    design: {
      subject: 'Gracias, {{nombre}}',
      preheader: 'Tu opinión nos importa',
      settings: base('#7C3AED', { bg: '#F5F3FF', font: 'trebuchet' }),
      blocks: [
        mk('header', { text: 'Tu Marca', bg: '#7C3AED' }, '#7C3AED'),
        mk('spacer', { height: 16 }),
        mk('heading', { text: 'Gracias por tu confianza', align: 'center', color: '#7C3AED' }),
        mk('text', { text: 'Hola **{{nombre}}**, queremos agradecerte por elegirnos. Si tienes un minuto, cuéntanos cómo fue tu experiencia: nos ayuda a mejorar.', align: 'center' }),
        mk('button', { text: 'Dejar mi opinión', bg: '#7C3AED', url: 'https://banamailing.com' }, '#7C3AED'),
        mk('spacer', { height: 12 }),
        mk('footer'),
      ],
    },
  },
  {
    id: 'oferta-oscura',
    name: 'Oferta relámpago',
    desc: 'Estilo oscuro, alto contraste',
    design: {
      subject: '⚡ Solo hoy: hasta 50% de descuento',
      preheader: 'Termina esta noche',
      settings: base('#FACC15', { bg: '#0B0B0F', contentBg: '#18181B', font: 'verdana' }),
      blocks: [
        mk('header', { text: 'OFERTA RELÁMPAGO', bg: '#FACC15', color: '#18181B' }, '#FACC15'),
        mk('heading', { text: 'HASTA 50% OFF', align: 'center', color: '#FACC15' }),
        mk('text', { text: 'Solo por hoy, **{{nombre}}**. Aprovecha antes de que se agote.', align: 'center', color: '#E4E4E7' }),
        mk('button', { text: 'Ver ofertas', bg: '#FACC15', color: '#18181B', url: 'https://banamailing.com' }, '#FACC15'),
        mk('divider', { color: '#3F3F46' }),
        mk('footer', { color: '#A1A1AA', text: 'Tu Empresa · Lima, Perú' }),
      ],
    },
  },
  {
    id: 'anuncio',
    name: 'Anuncio / Comunicado',
    desc: 'Aviso importante a tus clientes',
    design: {
      subject: 'Aviso importante de {{empresa}}',
      preheader: 'Lee este comunicado',
      settings: base('#0891B2', { bg: '#ECFEFF' }),
      blocks: [
        mk('header', { text: 'Comunicado', bg: '#0891B2', align: 'left' }, '#0891B2'),
        mk('heading', { text: 'Cambios en nuestro horario de atención', size: 2 }),
        mk('text', { text: 'Estimado(a) {{nombre}},\n\nTe informamos que a partir del **{{fecha}}** nuestro horario de atención será de lunes a viernes, de 9:00 a. m. a 6:00 p. m.\n\nGracias por tu comprensión.' }),
        mk('button', { text: 'Más información', bg: '#0891B2', align: 'left', url: 'https://banamailing.com' }, '#0891B2'),
        mk('footer'),
      ],
    },
  },
];

export function cloneDesign(d: Design): Design {
  const copy = JSON.parse(JSON.stringify(d)) as Design;
  // ids nuevos para evitar colisiones entre bloques de plantillas
  const fresh = (b: Block) => {
    b.id = Math.random().toString(36).slice(2, 10);
    if (b.type === 'row') b.cells.forEach(col => col.forEach(fresh));
  };
  copy.blocks.forEach(fresh);
  return copy;
}
