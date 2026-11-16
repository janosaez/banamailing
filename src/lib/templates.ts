import { newBlock, type Block, type Design, type Settings } from './mailing';

export interface Template {
  id: string;
  name: string;
  desc: string;
  design: Design;
}

type Over = Record<string, unknown>;
const mk = (type: Block['type'], over: Over = {}, accent = '#674CC4'): Block =>
  ({ ...newBlock(type, accent), ...over }) as Block;

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
        mk('text', { text: 'Hola {{nombre}}, por tiempo limitado tienes un descuento exclusivo en todos nuestros productos y servicios.', align: 'center' }),
        mk('button', { text: 'Quiero mi descuento', url: 'https://banamailing.com', bg: '#E11D48' }, '#E11D48'),
        mk('divider'),
        mk('columns', { leftTitle: 'Envío rápido', leftText: 'Recibe tu pedido en 24 a 48 horas.', rightTitle: 'Garantía', rightText: '30 días para cambios y devoluciones.', accent: '#E11D48' }, '#E11D48'),
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
        mk('heading', { text: '1. Nuevo servicio', size: 3 }),
        mk('text', { text: 'Describe aquí la primera noticia con un par de líneas claras y directas.' }),
        mk('heading', { text: '2. Consejo del mes', size: 3 }),
        mk('text', { text: 'Comparte un consejo útil que tus lectores puedan aplicar hoy mismo.' }),
        mk('button', { text: 'Leer más' }),
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
        mk('columns', { leftTitle: '1. Configura', leftText: 'Completa tu perfil y tus datos de contacto.', rightTitle: '2. Explora', rightText: 'Conoce las herramientas disponibles.', accent: '#16A34A' }, '#16A34A'),
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
        mk('columns', { leftTitle: 'Fecha', leftText: 'Jueves 20\n7:00 p. m. (hora Lima)', rightTitle: 'Lugar', rightText: 'Online por Zoom\nGratis, con cupos limitados', accent: '#0F172A' }, '#0F172A'),
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
        mk('text', { text: 'Estimado(a) {{nombre}},\n\nTe recordamos que tienes un pago pendiente por {{monto}} con vencimiento el {{fecha}}.\n\nSi ya realizaste el pago, por favor ignora este mensaje.' }),
        mk('button', { text: 'Pagar ahora', bg: '#2563EB', url: 'https://banamailing.com' }, '#2563EB'),
        mk('text', { text: 'Gracias por tu confianza.', size: 14, color: '#6B7280' }),
        mk('footer', { text: 'Tu Empresa · Lima, Perú' }),
      ],
    },
  },
];

export function cloneDesign(d: Design): Design {
  const copy = JSON.parse(JSON.stringify(d)) as Design;
  // ids nuevos para evitar colisiones entre bloques de plantillas
  copy.blocks.forEach(b => { b.id = Math.random().toString(36).slice(2, 10); });
  return copy;
}
