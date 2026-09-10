// =====================================================================
// GENERADOR DE MENSAJES PERSUASIVOS DE WHATSAPP ADAPTADOS POR NICHO
// Para Prospección B2B y Conversión en Frío Kowy (kowy.app)
// =====================================================================

export type BusinessNiche = 'barberia' | 'salon' | 'spa' | 'estetica' | 'nails';

export interface NicheCopyConfig {
  id: BusinessNiche;
  label: string;
  emoji: string;
  badgeLabel: string;
  // Términos para el Paso 1 (Gancho Visual y Demo)
  catalogPhrase: string;
  teamPhrase: string;
  painQuestion: string;
  // Términos para el Paso 2 (Oferta Patrocinada $89k con Cierre Nequi/Daviplata)
  targetClientsWord: string;
  roleSingular: string;
  collaboratorsWord: string;
  physicalSpots: string;
}

export const NICHE_CONFIGS: Record<BusinessNiche, NicheCopyConfig> = {
  barberia: {
    id: 'barberia',
    label: 'Barbería / Barber Shop',
    emoji: '💈',
    badgeLabel: 'Barbería',
    catalogPhrase: 'catálogo de cortes y sistema de reservas online:',
    teamPhrase: 'barberos y servicios son 100% editables',
    painQuestion: '¿Les gustaría que sus clientes agenden turnos solos sin tener que responder tantos chats de WhatsApp?',
    targetClientsWord: 'clientes',
    roleSingular: 'barbero',
    collaboratorsWord: 'barberos',
    physicalSpots: 'el mostrador y los espejos'
  },
  salon: {
    id: 'salon',
    label: 'Salón de Belleza / Peluquería',
    emoji: '✨',
    badgeLabel: 'Salón de Belleza',
    catalogPhrase: 'catálogo de servicios y sistema de reservas online:',
    teamPhrase: 'estilistas y servicios son 100% editables',
    painQuestion: '¿Les gustaría que sus clientas agenden citas solas 24/7 sin tener que responder tantos chats de WhatsApp mientras están atendiendo?',
    targetClientsWord: 'clientas',
    roleSingular: 'estilista',
    collaboratorsWord: 'estilistas',
    physicalSpots: 'el mostrador y los tocadores'
  },
  nails: {
    id: 'nails',
    label: 'Nail Bar / Estudio de Uñas',
    emoji: '💅',
    badgeLabel: 'Studio de Uñas',
    catalogPhrase: 'catálogo de diseños de uñas y sistema de reservas online:',
    teamPhrase: 'manicuristas y servicios son 100% editables',
    painQuestion: '¿Les gustaría que sus clientas agenden sus citas solas viendo los diseños y horarios sin saturarles el WhatsApp?',
    targetClientsWord: 'clientas',
    roleSingular: 'manicurista',
    collaboratorsWord: 'manicuristas',
    physicalSpots: 'el mostrador y las mesas de manicure'
  },
  spa: {
    id: 'spa',
    label: 'Spa & Centro de Relajación',
    emoji: '🧖‍♀️',
    badgeLabel: 'Spa & Bienestar',
    catalogPhrase: 'carta de tratamientos y sistema de reservas online:',
    teamPhrase: 'especialistas y tratamientos son 100% editables',
    painQuestion: '¿Les gustaría que sus clientes o pacientes reserven sus citas y valoraciones automáticamente sin tener que responder tantos chats de WhatsApp?',
    targetClientsWord: 'clientes y pacientes',
    roleSingular: 'especialista',
    collaboratorsWord: 'terapeutas y especialistas',
    physicalSpots: 'la recepción y las cabinas'
  },
  estetica: {
    id: 'estetica',
    label: 'Clínica Estética & Cuidado Facial / Corporal',
    emoji: '🪄',
    badgeLabel: 'Estética & Facial',
    catalogPhrase: 'carta de procedimientos y sistema de reservas online:',
    teamPhrase: 'profesionales y protocolos son 100% editables',
    painQuestion: '¿Les gustaría que sus pacientes reserven sus valoraciones y citas automáticamente sin tener que responder tantos chats de WhatsApp?',
    targetClientsWord: 'pacientes y clientas',
    roleSingular: 'profesional',
    collaboratorsWord: 'especialistas y cosmetólogas',
    physicalSpots: 'la recepción y las cabinas'
  }
};

/**
 * Detecta inteligentemente el nicho del negocio combinando el campo category
 * y las palabras clave de su nombre o servicios.
 */
export function detectBusinessNiche(
  businessName?: string,
  explicitCategory?: string
): BusinessNiche {
  // 1. Si la categoría explícita ya es un nicho conocido
  const catLower = (explicitCategory || '').toLowerCase().trim();
  if (catLower === 'barberia' || catLower === 'barber') return 'barberia';
  if (catLower === 'nails' || catLower === 'unas' || catLower === 'uñas') return 'nails';
  if (catLower === 'spa') return 'spa';
  if (catLower === 'estetica' || catLower === 'clinica') return 'estetica';
  if (catLower === 'salon' || catLower === 'peluqueria') return 'salon';

  // 2. Detección por palabras clave en el nombre del negocio
  const name = (businessName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remover tildes para búsqueda precisa

  // Patrones Barbería
  if (/\b(barber|barberia|barbershop|corte hombre|fade|barbero|shave)\b/.test(name)) {
    return 'barberia';
  }

  // Patrones Uñas / Nails
  if (/\b(nail|nails|unas|manicure|pedicure|acrilic|esmalte|acripie)\b/.test(name)) {
    return 'nails';
  }

  // Patrones Spa / Bienestar
  if (/\b(spa|hidroterapia|masaje|relajacion|wellness|sauna|termal)\b/.test(name)) {
    return 'spa';
  }

  // Patrones Estética / Facial / Cejas / Pestañas
  if (/\b(estetica|facial|cejas|pestanas|lashes|brows|dermo|skin|cosmetolog|microblading)\b/.test(name)) {
    return 'estetica';
  }

  // Por defecto es salón de belleza / peluquería
  return 'salon';
}

export interface PitchOptions {
  businessName: string;
  slug: string;
  origin?: string;
  category?: string;
  customNiche?: BusinessNiche;
}

/**
 * Genera el mensaje de WhatsApp Paso 1 (Gancho Visual + Demo + Dolor agudo del Nicho)
 */
export function generateStep1Pitch({
  businessName,
  slug,
  origin = typeof window !== 'undefined' ? window.location.origin : 'https://kowy.app',
  category,
  customNiche
}: PitchOptions): string {
  const niche = customNiche || detectBusinessNiche(businessName, category);
  const cfg = NICHE_CONFIGS[niche] || NICHE_CONFIGS.salon;
  const siteUrl = `${origin}/sitio/${slug}`;
  const cleanName = businessName?.trim() || 'su negocio';

  return `¡Hola equipo de ${cleanName}! 👋${cfg.emoji}
Vimos su perfil en Google Maps y les preparamos un demo de cómo se vería su página web con ${cfg.catalogPhrase}
👉 ${siteUrl}

(Todo el contenido, ${cfg.teamPhrase}).

"${cfg.painQuestion}"`;
}

/**
 * Genera el mensaje de WhatsApp Paso 2 (Respuesta al Interés + Cierre Nequi/Daviplata $89k)
 */
export function generateStep2Pitch({
  businessName,
  category,
  customNiche
}: Omit<PitchOptions, 'slug'>): string {
  const niche = customNiche || detectBusinessNiche(businessName, category);
  const cfg = NICHE_CONFIGS[niche] || NICHE_CONFIGS.salon;

  return `¡Qué bueno que les guste! 🚀 La armamos pensando en que no pierdan ${cfg.targetClientsWord} por responder tarde al WhatsApp.

Justo hoy abrimos cupos de lanzamiento en su zona. Por un pago único de activación de $89.000 COP (vía Nequi o Daviplata), se llevan:

🌐 Web oficial activa por 1 año: Optimizada para móviles, con dominio, hosting rápido y botón directo a su WhatsApp.

📲 1 mes gratis de agenda y reservas: Sus ${cfg.targetClientsWord} eligen ${cfg.roleSingular} y horario; ustedes controlan la agenda desde el celular.

🖨️ Material QR listo para imprimir: Afiches y tarjetas para ${cfg.physicalSpots}.

Sin contratos forzados: si después del mes gratis deciden no seguir con la app de citas, su página web sigue funcionando todo el año sin costo adicional.

¿Les comparto los datos de Nequi/Daviplata para dejarles el acceso administrativo activo hoy mismo? ⚡`;
}

/**
 * Generador Universal según el paso (1 o 2)
 */
export function generateWhatsAppPitch(
  opts: PitchOptions & { step: 1 | 2 }
): string {
  return opts.step === 1 ? generateStep1Pitch(opts) : generateStep2Pitch(opts);
}

/**
 * Mensaje de bienvenida con credenciales tras activar la cuenta (Paso 3)
 */
export function generateWelcomeCredentialsPitch({
  tenantName,
  ownerEmail,
  tempPass,
  slug,
  origin = typeof window !== 'undefined' ? window.location.origin : 'https://kowy.app',
  category,
  customNiche
}: {
  tenantName: string;
  ownerEmail: string;
  tempPass: string;
  slug: string;
  origin?: string;
  category?: string;
  customNiche?: BusinessNiche;
}): string {
  const niche = customNiche || detectBusinessNiche(tenantName, category);
  const cfg = NICHE_CONFIGS[niche] || NICHE_CONFIGS.salon;
  const loginUrl = `${origin}/login`;
  const siteUrl = `${origin}/sitio/${slug}`;
  const bookingUrl = `${origin}/reservar/${slug}`;

  return `¡Hola ${tenantName}! 🎉 Ya activamos tu acceso de administración a tu plataforma Kowy.app (Plan Crecimiento 1 Mes Incluido).

🌐 Tu Panel de Administración:
👉 ${loginUrl}

👤 Usuario / Correo: ${ownerEmail}
🔑 Contraseña Temporal: ${tempPass}

✨ Enlaces Oficiales de tu Negocio:
🌐 Tu Página Web Oficial: ${siteUrl}
📅 Tu Agendador de Citas Online: ${bookingUrl}

📱 Próximos pasos recomendados:
1. Ingresa a tu panel con tu correo y clave temporal.
2. Revisa tus ${cfg.collaboratorsWord} y catálogo de servicios.
3. Comparte tu enlace de agendamiento (${bookingUrl}) en tu perfil de Instagram y estados de WhatsApp.

¡Muchos éxitos y bienvenida a la familia Kowy! 🚀${cfg.emoji}`;
}
