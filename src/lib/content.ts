// Contenido SEO de BanaMailing: páginas de servicio (/slug) y artículos del blog (/blog/slug).
// El HTML dentro de los textos es propio (confiable) y se renderiza con set:html.

export interface Section { h2: string; p?: string[]; ul?: string[]; ol?: string[]; }
export interface Faq { q: string; a: string; }
export interface Entry {
  slug: string;
  title: string;        // <title>
  description: string;  // meta description
  h1: string;
  lead: string;
  eyebrow: string;
  sections: Section[];
  faqs: Faq[];
  related: string[];    // slugs de otros contenidos
  date?: string;        // solo blog (ISO)
  readMin?: number;     // solo blog
  summary?: string;     // tarjeta del blog
}

export const BLOG_URL = '/2025/03/03/blog-email-marketing/';

export const services: Entry[] = [
  {
    slug: 'correos-masivos-peru',
    title: 'Correos Masivos en Perú | Envío Segmentado — BanaMailing',
    description: 'Servicio de correos masivos en Perú con envíos segmentados, alta entregabilidad y reportes de aperturas y clics. Pide tu demo gratis con BanaMailing.',
    eyebrow: 'Servicio de correos masivos',
    h1: 'Correos masivos en Perú que sí llegan a la bandeja de entrada',
    lead: 'Enviar un correo a miles de personas es fácil. Lograr que llegue a la bandeja principal, que lo abran y que hagan clic es lo difícil. En BanaMailing hacemos <strong>correos masivos en Perú</strong> desde 2004, con infraestructura propia, listas segmentadas y medición real de resultados.',
    sections: [
      {
        h2: '¿Qué es el servicio de correos masivos?',
        p: [
          'Un servicio de correos masivos (también llamado <strong>mailing masivo</strong> o email marketing) permite enviar el mismo mensaje, o variantes personalizadas, a una base grande de contactos de forma ordenada. A diferencia de enviar desde Gmail u Outlook, un servicio profesional cuida la reputación del remitente, evita bloqueos y mide cada envío.',
          'Lo usan empresas que necesitan comunicar promociones, lanzamientos, novedades, cobranzas amistosas o invitaciones a eventos sin depender de redes sociales ni de anuncios pagados.',
        ],
      },
      {
        h2: 'Cómo hacemos que tus correos lleguen',
        ul: [
          '<strong>Infraestructura de envío profesional:</strong> trabajamos con PowerMTA y AMS Enterprise, plataformas pensadas para mailing masivo.',
          '<strong>Autenticación del dominio:</strong> configuramos SPF, DKIM y DMARC para que los proveedores de correo confíen en tu remitente. Te explicamos cómo funciona en <a href="/blog/como-evitar-que-tus-correos-lleguen-a-spam">nuestra guía para evitar el spam</a>.',
          '<strong>Listas limpias y segmentadas:</strong> enviar a quien corresponde reduce rebotes y quejas. Mira <a href="/segmentacion-de-bases-de-datos-de-correo">cómo segmentamos las bases de correos</a>.',
          '<strong>Envío gradual y monitoreado:</strong> cuidamos el ritmo de envío para proteger la reputación de la IP.',
        ],
      },
      {
        h2: 'Qué incluye cada campaña',
        ul: [
          'Diseño del flyer o plantilla en HTML, adaptada a celulares.',
          'Revisión del asunto, el texto y los enlaces antes de enviar.',
          'Envío con seguimiento de aperturas, clics y rebotes.',
          'Enlaces con parámetros UTM para medir las visitas y ventas en Google Analytics.',
          'Reporte final con resultados y recomendaciones. Más detalle en <a href="/reportes-y-estadisticas-de-email-marketing">reportes y estadísticas</a>.',
        ],
      },
      {
        h2: 'Prueba antes de contratar',
        p: [
          'Puedes armar tu propio diseño gratis con nuestro <a href="/arma-tu-mailing">editor de correos con plantillas</a> y enviarte una prueba. También puedes <a href="/#demo">pedir una demo de campaña gratuita</a> y ver cómo quedaría tu envío antes de decidir.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cuántos correos puedo enviar en una campaña?', a: 'Depende del plan y de la calidad de tu base. Trabajamos desde campañas pequeñas hasta envíos de gran volumen; en la sección de planes y en la demo definimos la cantidad que mejor se ajusta a tu objetivo.' },
      { q: '¿Cómo evitan que mis correos lleguen a spam?', a: 'Autenticamos el dominio con SPF, DKIM y DMARC, enviamos desde infraestructura profesional, cuidamos el ritmo de envío y trabajamos con listas segmentadas y limpias.' },
      { q: '¿Puedo medir los resultados?', a: 'Sí. Medimos aperturas, clics y rebotes, y con enlaces UTM puedes ver en Google Analytics cuántas visitas y conversiones generó cada campaña.' },
      { q: '¿Incluye el diseño del correo?', a: 'Sí, diseñamos el flyer o plantilla de tu campaña. También puedes crear el tuyo con nuestro editor gratuito.' },
    ],
    related: ['email-marketing-profesional', 'segmentacion-de-bases-de-datos-de-correo', 'reportes-y-estadisticas-de-email-marketing'],
  },
  {
    slug: 'email-marketing-profesional',
    title: 'Email Marketing Profesional en Perú | BanaMailing',
    description: 'Agencia de email marketing profesional en Perú: estrategia, diseño, envío y análisis de campañas con más de 20 años de experiencia. Solicita tu demo.',
    eyebrow: 'Email marketing profesional',
    h1: 'Email marketing profesional para empresas en Perú',
    lead: 'El email marketing sigue siendo uno de los canales con mejor retorno porque llega a personas que ya conocen tu marca. En BanaMailing lo trabajamos como un proceso completo: <strong>estrategia, diseño, envío y análisis</strong>, con más de 20 años de experiencia en el mercado peruano.',
    sections: [
      {
        h2: 'Más que enviar correos: una estrategia',
        p: [
          'El <strong>email marketing profesional</strong> parte de un objetivo claro (vender, captar, fidelizar, cobrar, informar) y de saber a quién le hablas. Define el mensaje, el momento y la frecuencia correctos para cada grupo de tu base de datos.',
          'Por eso antes de cada campaña revisamos tu objetivo, tu público y tus resultados anteriores. Así evitamos enviar a todos lo mismo y mejoramos con cada envío.',
        ],
      },
      {
        h2: 'Cómo trabajamos',
        ol: [
          '<strong>Diagnóstico:</strong> entendemos tu negocio, tu base y tu meta.',
          '<strong>Diseño:</strong> creamos plantillas claras, con un llamado a la acción visible y optimizadas para celular.',
          '<strong>Segmentación:</strong> ordenamos los contactos por interés, ubicación o historial. Lo detallamos en <a href="/segmentacion-de-bases-de-datos-de-correo">segmentación de bases de correos</a>.',
          '<strong>Envío:</strong> usamos PowerMTA y AMS Enterprise con dominios autenticados (SPF, DKIM y DMARC).',
          '<strong>Medición y mejora:</strong> analizamos aperturas, clics y conversiones con Google Analytics y UTM, y aplicamos remarketing y personalización en las siguientes campañas.',
        ],
      },
      {
        h2: 'Para qué tipo de empresas funciona',
        ul: [
          'Comercios y tiendas que anuncian promociones o catálogos.',
          'Empresas de servicios que necesitan captar y dar seguimiento a prospectos.',
          'Instituciones educativas, clínicas y asociaciones que comunican novedades y eventos.',
          'Áreas de cobranzas que envían recordatorios de pago de forma cordial.',
        ],
      },
      {
        h2: 'Empieza sin riesgo',
        p: [
          'Conoce nuestra experiencia en <a href="/nosotros">Nosotros</a> y en <a href="/expertos-en-email-marketing">expertos en email marketing</a>. Luego prueba nuestro <a href="/arma-tu-mailing">editor gratuito</a> o <a href="/contacto">habla con un asesor</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿El email marketing todavía funciona?', a: 'Sí. Es un canal propio: no dependes de un algoritmo ni de pagar por cada alcance, y llega a personas que ya dieron su correo o conocen tu marca.' },
      { q: '¿Qué diferencia hay con enviar desde Gmail o Outlook?', a: 'Un servicio profesional cuida la reputación del remitente, evita bloqueos por envío masivo, segmenta y mide resultados. Desde un correo personal no hay seguimiento ni control de entregabilidad.' },
      { q: '¿Puedo empezar con una campaña de prueba?', a: 'Claro. Puedes pedir una demo gratis o armar tu diseño en el editor y enviarte una prueba.' },
    ],
    related: ['correos-masivos-peru', 'reportes-y-estadisticas-de-email-marketing', 'segmentacion-de-bases-de-datos-de-correo'],
  },
  {
    slug: 'segmentacion-de-bases-de-datos-de-correo',
    title: 'Segmentación de Bases de Correos en Perú | BanaMailing',
    description: 'Segmentación avanzada de bases de datos de correo en Perú: envía el mensaje correcto a cada grupo, reduce rebotes y mejora aperturas y clics.',
    eyebrow: 'Segmentación avanzada',
    h1: 'Segmentación de bases de datos de correo en Perú',
    lead: 'Mandar el mismo correo a toda tu lista es la forma más rápida de perder aperturas y de acabar en spam. La <strong>segmentación de bases de correos</strong> divide tus contactos en grupos con intereses parecidos para que cada persona reciba algo que le importa.',
    sections: [
      {
        h2: '¿Por qué segmentar?',
        ul: [
          '<strong>Más aperturas y clics:</strong> un mensaje relevante se abre más.',
          '<strong>Menos bajas y quejas:</strong> quien recibe lo que le interesa no marca tu correo como spam.',
          '<strong>Mejor reputación del remitente:</strong> menos rebotes y quejas ayudan a que tus próximos envíos lleguen a la bandeja principal.',
          '<strong>Campañas más rentables:</strong> inviertes el envío donde hay posibilidad de respuesta.',
        ],
      },
      {
        h2: 'Criterios de segmentación que usamos',
        ul: [
          '<strong>Comportamiento:</strong> quién abrió, quién hizo clic y quién no respondió.',
          '<strong>Tipo de cliente:</strong> prospectos, clientes nuevos, clientes frecuentes o inactivos.',
          '<strong>Interés o producto:</strong> categorías de compra o servicios consultados.',
          '<strong>Ubicación e industria:</strong> útil en campañas B2B y locales.',
          '<strong>Etapa en el proceso:</strong> desde el primer contacto hasta la recompra.',
        ],
      },
      {
        h2: 'Limpieza y cuidado de la base',
        p: [
          'Una base grande pero sucia hace más daño que una pequeña y limpia. Antes de enviar depuramos direcciones inválidas o duplicadas y separamos los contactos que ya no interactúan. También respetamos el pedido de baja de quien no quiere recibir más correos.',
          'Consejo clave: usa solo contactos que hayan dado su consentimiento o con quienes tengas una relación comercial. Te lo explicamos en nuestro artículo sobre <a href="/blog/ley-spam-peru-correo-comercial">la ley del correo comercial en Perú</a>.',
        ],
      },
      {
        h2: 'Segmenta y mide',
        p: [
          'Cada segmento se mide por separado para saber qué mensaje funciona con quién. Los resultados llegan en <a href="/reportes-y-estadisticas-de-email-marketing">reportes y estadísticas</a> y alimentan la siguiente campaña con remarketing y personalización. Si buscas el servicio completo de envío, mira <a href="/correos-masivos-peru">correos masivos en Perú</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿Ustedes venden bases de datos de correos?', a: 'No. Trabajamos con las bases de contactos de tu empresa, con consentimiento o relación comercial previa, y las ordenamos y depuramos para mejorar los resultados.' },
      { q: '¿Cuántos segmentos conviene tener?', a: 'Empieza con 3 a 5 grupos simples (por ejemplo prospectos, clientes y clientes inactivos) y afina a medida que midas resultados.' },
      { q: '¿Qué hago con los contactos que nunca abren?', a: 'Se les envía una campaña de reactivación y, si siguen sin responder, se retiran de los envíos habituales para proteger tu reputación.' },
    ],
    related: ['correos-masivos-peru', 'email-marketing-profesional', 'reportes-y-estadisticas-de-email-marketing'],
  },
  {
    slug: 'reportes-y-estadisticas-de-email-marketing',
    title: 'Reportes y Estadísticas de Email Marketing | BanaMailing',
    description: 'Mide aperturas, clics, rebotes y conversiones de tus campañas de email marketing en Perú con reportes claros y enlaces UTM en Google Analytics.',
    eyebrow: 'Reportes y estadísticas',
    h1: 'Reportes y estadísticas de email marketing',
    lead: 'Lo que no se mide no se mejora. Cada campaña de BanaMailing termina con un <strong>reporte claro</strong> de aperturas, clics y rebotes, y con enlaces UTM para ver en Google Analytics cuántas visitas y ventas generó tu correo.',
    sections: [
      {
        h2: 'Qué medimos en cada campaña',
        ul: [
          '<strong>Tasa de apertura:</strong> qué porcentaje abrió el correo. Depende mucho del asunto y de la reputación del remitente.',
          '<strong>Tasa de clics (CTR):</strong> quiénes hicieron clic en tus enlaces o botones.',
          '<strong>Rebotes:</strong> correos que no pudieron entregarse, por dirección inexistente o buzón lleno.',
          '<strong>Bajas y quejas:</strong> señal de que el mensaje o la segmentación necesitan ajustes.',
          '<strong>Conversiones:</strong> acciones valiosas posteriores al clic, como una compra, una cotización o un formulario enviado.',
        ],
      },
      {
        h2: 'Google Analytics con UTM',
        p: [
          'Añadimos parámetros UTM a los enlaces de tu campaña. Gracias a ellos, Google Analytics sabe que la visita vino de ese correo y no de otro canal. Así puedes comparar campañas, asuntos y segmentos con datos y no con intuición.',
        ],
      },
      {
        h2: 'Del reporte a la mejora',
        ol: [
          'Revisamos qué asuntos y piezas funcionaron mejor.',
          'Identificamos los segmentos que más respondieron.',
          'Ajustamos horarios, frecuencia y llamados a la acción.',
          'Aplicamos remarketing y personalización en el siguiente envío.',
        ],
      },
      {
        h2: 'Aprende a leer tus métricas',
        p: [
          'Si quieres entender cada número, lee nuestra guía de <a href="/blog/metricas-de-email-marketing-que-debes-medir">métricas de email marketing que debes medir</a>. Para pedir tu primera campaña con reporte incluido, <a href="/contacto">escríbenos</a> o conoce el servicio de <a href="/correos-masivos-peru">correos masivos en Perú</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cuándo recibo el reporte?', a: 'Tras el envío se empiezan a registrar los resultados; el reporte final se comparte cuando la campaña completa su ciclo de aperturas y clics.' },
      { q: '¿Qué es una buena tasa de apertura?', a: 'Varía según el sector y la calidad de la base. Lo importante es compararte con tus propias campañas anteriores y mejorar con cada envío.' },
      { q: '¿Puedo ver las ventas que generó el correo?', a: 'Sí, si tu sitio tiene Google Analytics. Con los enlaces UTM puedes ver visitas y conversiones atribuidas a cada campaña.' },
    ],
    related: ['correos-masivos-peru', 'segmentacion-de-bases-de-datos-de-correo', 'email-marketing-profesional'],
  },
];

export const posts: Entry[] = [
  {
    slug: 'como-evitar-que-tus-correos-lleguen-a-spam',
    title: 'Cómo evitar que tus correos lleguen a spam (SPF, DKIM y DMARC)',
    description: 'Guía práctica para que tus correos masivos lleguen a la bandeja de entrada: SPF, DKIM, DMARC, reputación, limpieza de listas y buenas prácticas de contenido.',
    eyebrow: 'Entregabilidad',
    h1: 'Cómo evitar que tus correos lleguen a spam',
    lead: 'Si tus campañas terminan en la carpeta de spam, nadie las verá por buena que sea la oferta. Esta guía resume qué miran los proveedores de correo y qué puedes hacer para llegar a la bandeja principal.',
    date: '2026-11-16', readMin: 5,
    summary: 'SPF, DKIM, DMARC, reputación y listas limpias: lo esencial para llegar a la bandeja de entrada.',
    sections: [
      {
        h2: 'Por qué un correo termina en spam',
        p: [
          'Gmail, Outlook y otros proveedores analizan quién envía el mensaje, cómo reacciona la gente y qué contiene. Si algo despierta dudas (remitente sin autenticar, muchas quejas, enlaces sospechosos), lo mandan a spam o lo bloquean.',
          'La buena noticia: casi todo se puede controlar.',
        ],
      },
      {
        h2: '1. Autentica tu dominio: SPF, DKIM y DMARC',
        ul: [
          '<strong>SPF:</strong> lista qué servidores pueden enviar correos en nombre de tu dominio.',
          '<strong>DKIM:</strong> firma cada correo para demostrar que no fue alterado.',
          '<strong>DMARC:</strong> indica qué hacer si SPF o DKIM fallan y te envía reportes sobre quién usa tu dominio.',
        ],
      },
      {
        h2: '2. Cuida la reputación del remitente',
        p: [
          'Tu dominio y la IP desde la que envías acumulan reputación. Los picos repentinos de volumen, muchas quejas o rebotes la dañan. Por eso un envío masivo se hace de forma gradual y desde infraestructura profesional como la que usamos en <a href="/correos-masivos-peru">nuestro servicio de correos masivos</a>.',
        ],
      },
      {
        h2: '3. Limpia y segmenta tu lista',
        ul: [
          'Elimina direcciones inválidas y duplicadas.',
          'No envíes a contactos que nunca dieron su consentimiento.',
          'Retira a quienes llevan mucho tiempo sin abrir.',
          'Segmenta para enviar contenido relevante: <a href="/blog/como-segmentar-tu-base-de-correos">guía de segmentación</a>.',
        ],
      },
      {
        h2: '4. Cuida el contenido',
        ul: [
          'Asunto honesto, sin mayúsculas ni signos excesivos.',
          'Equilibrio entre texto e imágenes: evita correos que sean una sola imagen.',
          'Pocos enlaces y siempre a dominios confiables.',
          'Enlace de baja visible y fácil de usar.',
          'Nombre y correo de remitente reconocibles.',
        ],
      },
      {
        h2: '5. Mide y reacciona',
        p: [
          'Revisa rebotes, quejas y aperturas en cada campaña. Si la apertura cae de golpe, algo cambió: puede ser el asunto, la lista o la reputación. Aprende a leerlo en <a href="/blog/metricas-de-email-marketing-que-debes-medir">métricas de email marketing</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿Qué pasa si no configuro SPF, DKIM y DMARC?', a: 'Los proveedores desconfían más de tu dominio y aumenta la probabilidad de que tus correos vayan a spam o sean rechazados, sobre todo en envíos masivos.' },
      { q: '¿Puedo probar cómo se ve mi correo antes de enviarlo?', a: 'Sí. Con nuestro editor gratuito puedes diseñar y enviarte una prueba: <a href="/arma-tu-mailing">Arma tu mailing</a>.' },
    ],
    related: ['correos-masivos-peru', 'como-segmentar-tu-base-de-correos', 'ley-spam-peru-correo-comercial'],
  },
  {
    slug: 'como-segmentar-tu-base-de-correos',
    title: 'Cómo segmentar tu base de correos para vender más',
    description: 'Aprende a segmentar tu lista de correos paso a paso: criterios, ejemplos y errores comunes para aumentar aperturas, clics y ventas con email marketing.',
    eyebrow: 'Segmentación',
    h1: 'Cómo segmentar tu base de correos para vender más',
    lead: 'Segmentar es dividir tu lista en grupos para enviar a cada uno el mensaje adecuado. Es la mejora más simple y rentable que puedes hacer en tus campañas de email marketing.',
    date: '2026-11-16', readMin: 4,
    summary: 'Criterios, ejemplos y errores comunes para enviar el mensaje correcto a cada grupo.',
    sections: [
      {
        h2: 'Paso 1: define el objetivo de la campaña',
        p: ['No es lo mismo anunciar una promoción, reactivar clientes o invitar a un evento. El objetivo determina a quién escribirle y qué decirle.'],
      },
      {
        h2: 'Paso 2: elige criterios simples',
        ul: [
          '<strong>Tipo de contacto:</strong> prospecto, cliente nuevo, cliente recurrente.',
          '<strong>Interés:</strong> producto o servicio que consultó o compró.',
          '<strong>Actividad:</strong> abrió, hizo clic o lleva meses sin responder.',
          '<strong>Ubicación o sector:</strong> especialmente útil para B2B.',
        ],
      },
      {
        h2: 'Paso 3: adapta el mensaje',
        p: [
          'Cambia el asunto, la oferta y el llamado a la acción según el grupo. A un cliente frecuente puedes ofrecerle un beneficio de fidelidad; a un prospecto, una guía o una demo.',
          'Con nuestro <a href="/arma-tu-mailing">editor de correos</a> puedes crear una versión para cada segmento en pocos minutos.',
        ],
      },
      {
        h2: 'Errores comunes',
        ul: [
          'Enviar lo mismo a toda la base.',
          'Crear demasiados segmentos y no poder atenderlos.',
          'No limpiar contactos inactivos o con rebote.',
          'No medir cada segmento por separado.',
        ],
      },
      {
        h2: 'Siguiente paso',
        p: [
          'Si quieres que ordenemos tu base y diseñemos las campañas, revisa nuestro servicio de <a href="/segmentacion-de-bases-de-datos-de-correo">segmentación de bases de correos</a> o <a href="/contacto">escríbenos</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿Cuántos contactos necesito para segmentar?', a: 'Puedes segmentar con cualquier tamaño de lista. Con bases pequeñas conviene usar pocos grupos simples.' },
      { q: '¿Cada cuánto debo revisar mis segmentos?', a: 'Al menos una vez al trimestre, o después de cada campaña importante, para actualizar quién está activo y quién no.' },
    ],
    related: ['segmentacion-de-bases-de-datos-de-correo', 'metricas-de-email-marketing-que-debes-medir', 'como-evitar-que-tus-correos-lleguen-a-spam'],
  },
  {
    slug: 'metricas-de-email-marketing-que-debes-medir',
    title: 'Métricas de email marketing que debes medir en tus campañas',
    description: 'Tasa de apertura, CTR, rebotes, bajas y conversiones: qué significa cada métrica de email marketing, cómo medirla con UTM y cómo usarla para mejorar.',
    eyebrow: 'Métricas',
    h1: 'Métricas de email marketing que debes medir',
    lead: 'Un reporte lleno de números no sirve si no sabes qué hacer con ellos. Estas son las métricas clave del email marketing, qué te dicen y cómo actuar en cada caso.',
    date: '2026-11-16', readMin: 5,
    summary: 'Aperturas, clics, rebotes, bajas y conversiones: qué significan y cómo actuar.',
    sections: [
      {
        h2: 'Tasa de apertura',
        p: ['Porcentaje de destinatarios que abrió el correo. Te habla del asunto, del nombre del remitente y de la reputación. Si baja, prueba otros asuntos y revisa si estás llegando a spam (<a href="/blog/como-evitar-que-tus-correos-lleguen-a-spam">cómo evitarlo</a>).'],
      },
      {
        h2: 'Tasa de clics (CTR)',
        p: ['Porcentaje que hizo clic en algún enlace. Habla del contenido y del llamado a la acción. Un botón claro y un solo objetivo por correo suelen mejorar el CTR.'],
      },
      {
        h2: 'Rebotes',
        ul: [
          '<strong>Duros:</strong> direcciones que no existen. Hay que eliminarlas de la lista.',
          '<strong>Blandos:</strong> problemas temporales, como buzón lleno.',
        ],
      },
      {
        h2: 'Bajas y quejas',
        p: ['Si suben, probablemente envías con demasiada frecuencia o a gente que no espera tu correo. Es una señal para segmentar mejor (<a href="/blog/como-segmentar-tu-base-de-correos">guía</a>).'],
      },
      {
        h2: 'Conversiones y UTM',
        p: [
          'La conversión es la acción final: compra, cotización, registro. Para medirla, agrega parámetros UTM a los enlaces del correo y revisa los resultados en Google Analytics. Así sabrás qué campaña, qué asunto y qué segmento generaron negocio.',
        ],
      },
      {
        h2: 'Cómo usar las métricas',
        ol: [
          'Compara cada campaña con las anteriores, no con promedios ajenos.',
          'Cambia una sola cosa a la vez (asunto, hora, botón) para saber qué funcionó.',
          'Elimina rebotes duros tras cada envío.',
          'Usa los resultados para segmentar y personalizar el siguiente correo.',
        ],
      },
      {
        h2: 'Quieres reportes listos',
        p: ['En nuestro servicio de <a href="/reportes-y-estadisticas-de-email-marketing">reportes y estadísticas</a> te entregamos estas métricas ordenadas y con recomendaciones.'],
      },
    ],
    faqs: [
      { q: '¿Qué es el UTM?', a: 'Son etiquetas que se agregan al final de un enlace para que Google Analytics identifique de qué campaña, medio y fuente llegó cada visita.' },
      { q: '¿La tasa de apertura es 100% exacta?', a: 'No del todo: algunos programas de correo bloquean imágenes o precargan el contenido. Úsala como tendencia y apóyate en clics y conversiones.' },
    ],
    related: ['reportes-y-estadisticas-de-email-marketing', 'como-segmentar-tu-base-de-correos', 'como-evitar-que-tus-correos-lleguen-a-spam'],
  },
  {
    slug: 'ley-spam-peru-correo-comercial',
    title: 'Ley del correo comercial y spam en Perú: qué debes saber',
    description: 'Qué dicen las normas peruanas sobre el correo comercial y los datos personales, y buenas prácticas de consentimiento y baja para tus campañas de email.',
    eyebrow: 'Buenas prácticas',
    h1: 'Ley del correo comercial y spam en Perú: qué debes saber',
    lead: 'Enviar correos comerciales en Perú implica respetar reglas sobre consentimiento y datos personales. Esta es una guía general para hacerlo bien; no reemplaza la asesoría de un abogado.',
    date: '2026-11-16', readMin: 4,
    summary: 'Consentimiento, baja y datos personales: lo básico para enviar correos comerciales con tranquilidad.',
    sections: [
      {
        h2: 'Normas que conviene conocer',
        ul: [
          '<strong>Ley N.° 28493</strong>, que regula el uso del correo electrónico comercial no solicitado (spam).',
          '<strong>Ley N.° 29733</strong>, de Protección de Datos Personales, y su reglamento.',
        ],
        p: ['Revisa siempre el texto vigente y consulta con un asesor legal para tu caso concreto.'],
      },
      {
        h2: 'Buenas prácticas que reducen riesgos',
        ul: [
          '<strong>Consentimiento:</strong> envía a quienes aceptaron recibir tus comunicaciones o con quienes tienes una relación comercial.',
          '<strong>Identificación clara:</strong> que se sepa quién escribe y cómo contactarte.',
          '<strong>Asunto veraz:</strong> que refleje el contenido del correo.',
          '<strong>Baja sencilla:</strong> un enlace visible para dejar de recibir correos, atendido de inmediato.',
          '<strong>Origen de los datos:</strong> evita bases compradas o de origen desconocido.',
        ],
      },
      {
        h2: 'Beneficio extra: mejor entregabilidad',
        p: [
          'Cumplir estas prácticas no solo reduce riesgos: también baja quejas y rebotes, y eso mejora la reputación de tu remitente. Lo explicamos en <a href="/blog/como-evitar-que-tus-correos-lleguen-a-spam">cómo evitar que tus correos lleguen a spam</a>.',
        ],
      },
      {
        h2: 'Cómo te ayudamos',
        p: [
          'En BanaMailing trabajamos con las bases de tu empresa, incluimos enlace de baja y cuidamos la reputación del envío. Conoce el <a href="/correos-masivos-peru">servicio de correos masivos</a> o <a href="/contacto">habla con un asesor</a>.',
        ],
      },
    ],
    faqs: [
      { q: '¿Necesito permiso para enviar correos masivos?', a: 'Lo recomendable es contar con el consentimiento de los destinatarios o una relación comercial previa, y ofrecer siempre una forma simple de darse de baja. Consulta con un asesor legal tu caso específico.' },
      { q: '¿Puedo comprar una base de correos?', a: 'No lo recomendamos: suele tener origen dudoso, genera quejas y rebotes, y daña la reputación de tu dominio.' },
    ],
    related: ['correos-masivos-peru', 'segmentacion-de-bases-de-datos-de-correo', 'como-evitar-que-tus-correos-lleguen-a-spam'],
  },
];

export const all = [...services.map(s => ({ ...s, kind: 'service' as const })), ...posts.map(p => ({ ...p, kind: 'post' as const }))];
export const hrefOf = (e: { slug: string; kind?: string }, kind = e.kind) => (kind === 'post' ? `/blog/${e.slug}` : `/${e.slug}`);
export const findBySlug = (slug: string) => all.find(e => e.slug === slug);
