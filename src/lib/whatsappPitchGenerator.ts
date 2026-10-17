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
  // Términos para el Paso 2 (Oferta Patrocinada $89k con Cierre Nequi/Bancolombia)
  targetClientsWord: string;
  roleSingular: string;
  collaboratorsWord: string;
  physicalSpots: string;
  establishmentWord: string;
}

export const NICHE_CONFIGS: Record<BusinessNiche, NicheCopyConfig> = {
  barberia: {
    id: 'barberia',
    label: 'Barbería / Barber Shop',
    emoji: '💈',
    badgeLabel: 'Barbería',
    catalogPhrase: 'catálogo de cortes y sistema de reservas online:',
    teamPhrase: 'barberos y servicios son 100% editables',
    painQuestion: '¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?',
    targetClientsWord: 'clientes',
    roleSingular: 'barbero',
    collaboratorsWord: 'barberos',
    physicalSpots: 'espejos y mostrador',
    establishmentWord: 'barbería'
  },
  salon: {
    id: 'salon',
    label: 'Salón de Belleza / Peluquería',
    emoji: '✨',
    badgeLabel: 'Salón de Belleza',
    catalogPhrase: 'catálogo de servicios y sistema de reservas online:',
    teamPhrase: 'estilistas y servicios son 100% editables',
    painQuestion: '¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?',
    targetClientsWord: 'clientas',
    roleSingular: 'estilista',
    collaboratorsWord: 'estilistas',
    physicalSpots: 'tocadores y mostrador',
    establishmentWord: 'salón'
  },
  nails: {
    id: 'nails',
    label: 'Nail Bar / Estudio de Uñas',
    emoji: '💅',
    badgeLabel: 'Studio de Uñas',
    catalogPhrase: 'catálogo de diseños de uñas y sistema de reservas online:',
    teamPhrase: 'manicuristas y servicios son 100% editables',
    painQuestion: '¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?',
    targetClientsWord: 'clientas',
    roleSingular: 'manicurista',
    collaboratorsWord: 'manicuristas',
    physicalSpots: 'mesas de manicure y mostrador',
    establishmentWord: 'estudio'
  },
  spa: {
    id: 'spa',
    label: 'Spa & Centro de Relajación',
    emoji: '🧖‍♀️',
    badgeLabel: 'Spa & Bienestar',
    catalogPhrase: 'carta de tratamientos y sistema de reservas online:',
    teamPhrase: 'especialistas y tratamientos son 100% editables',
    painQuestion: '¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?',
    targetClientsWord: 'clientes y pacientes',
    roleSingular: 'especialista',
    collaboratorsWord: 'terapeutas y especialistas',
    physicalSpots: 'recepción y cabinas',
    establishmentWord: 'spa'
  },
  estetica: {
    id: 'estetica',
    label: 'Clínica Estética & Cuidado Facial / Corporal',
    emoji: '🪄',
    badgeLabel: 'Estética & Facial',
    catalogPhrase: 'carta de procedimientos y sistema de reservas online:',
    teamPhrase: 'profesionales y protocolos son 100% editables',
    painQuestion: '¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?',
    targetClientsWord: 'pacientes y clientas',
    roleSingular: 'profesional',
    collaboratorsWord: 'especialistas y cosmetólogas',
    physicalSpots: 'recepción y cabinas',
    establishmentWord: 'clínica'
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
  const resolvedPainQuestion = cfg.painQuestion.replace(/\{businessName\}/g, cleanName);

  return `¡Hola equipo de ${cleanName}! 👋${cfg.emoji}
Vimos su perfil en Google Maps y les preparamos un demo de cómo se vería su página web con ${cfg.catalogPhrase}
👉 ${siteUrl}

(Todo el contenido, ${cfg.teamPhrase}).

"${resolvedPainQuestion}"`;
}

/**
 * Genera el mensaje de WhatsApp Paso 2 (Respuesta al Interés + Oferta 14 Días Gratis Plan Inicio $29k)
 */
export function generateStep2Pitch({
  businessName,
  category,
  customNiche
}: Omit<PitchOptions, 'slug'>): string {
  const niche = customNiche || detectBusinessNiche(businessName, category);
  const cfg = NICHE_CONFIGS[niche] || NICHE_CONFIGS.salon;
  const cleanName = businessName?.trim() || 'su negocio';

  return `¡Qué bueno que les guste! 🚀 El nivel y la calidad de ${cleanName} merecen ese estatus ante cualquier cliente que las busque en Google.

Queremos que lo prueben en el día a día sin riesgo:

🎁 Les activamos 14 DÍAS DE PRUEBA 100% GRATIS (2 semanas completas) en el Plan Inicio.
Cero cobro por desarrollo web, cero cobro por hosting ni costos ocultos.

Durante sus 14 días de prueba disfrutan:
🌐 Su página web oficial activa con fotos y catálogo de servicios.
📅 Sistema interactivo de agendamiento 24/7 para hasta 3 ${cfg.collaboratorsWord}.
📲 Enlace directo de reservas para la bio de su Instagram, TikTok y WhatsApp.
📊 Panel de control para gestionar sus citas y turnos del día sin llamadas.

Si tras los 14 días les encanta el sistema, continúan por solo $29.000 COP al mes (sin contratos ni permanencia). Si no, no pagan absolutamente nada.

¿A qué correo electrónico les creamos el acceso administrativo para dejársela activa hoy mismo? ⚡`;
}

/**
 * Genera el mensaje de WhatsApp Paso 3 / Alternativa de Estatus Makloz Tech
 * Enfocado en estatus de marca, $0 hosting y 14 días gratis en Plan Inicio ($29.000/mes)
 */
export function generateMaklozTechPitch({
  businessName,
  ownerName
}: {
  businessName: string;
  ownerName?: string;
}): string {
  const cleanName = businessName?.trim() || 'su negocio';
  const greeting = ownerName?.trim() ? `¡Hola ${ownerName.trim()}! 👋` : '¡Hola! 👋';

  return `${greeting}

El trabajo y la calidad que tienen en ${cleanName} merecen verse con otro estatus.

Cuando un cliente te busca en Google y encuentra tu propia *Página Web Oficial*, la percepción de tu marca cambia por completo: generas confianza inmediata, prestigio y agendamientos automáticos 🌟.

Para apoyarlos, no les cobramos desarrollo ni hosting:
🎁 Les habilitamos *14 Días de Prueba 100% Gratis* en el Plan Inicio con su web y agendador interactivo listo para operar.

Lo prueban sin pagar un solo peso. Si ven que les ahorra tiempo y les llena la agenda, continúan por solo *$29.000 COP al mes* (menos de $1.000 al día) 💡.

¿A qué correo te activo tus accesos para que lo empiecen a usar hoy mismo? ⚡`;
}

/**
 * Generador Universal según el paso (1, 2 o 3)
 */
export function generateWhatsAppPitch(
  opts: PitchOptions & { step: 1 | 2 | 3; ownerName?: string }
): string {
  if (opts.step === 1) return generateStep1Pitch(opts);
  if (opts.step === 2) return generateStep2Pitch(opts);
  return generateMaklozTechPitch({ businessName: opts.businessName, ownerName: opts.ownerName });
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

  return `¡Hola ${tenantName}! 🎉 Ya activamos tu acceso de administración a tu plataforma Kowy.app (Plan Inicio - 14 Días de Prueba Gratis).

🌐 Tu Panel de Administración:
👉 ${loginUrl}

👤 Usuario / Correo: ${ownerEmail}
🔑 Contraseña Temporal: ${tempPass}

✨ Enlaces Oficiales de tu Negocio:
🌐 Tu Página Web Oficial: ${siteUrl}
📅 Tu Agendador de Citas Online: ${bookingUrl}

📱 Próximos pasos recomendados:
1. Ingresa a tu panel con tu correo y clave temporal.
2. Revisa tus ${cfg.collaboratorsWord} (hasta 3 incluidas en tu Plan Inicio) y catálogo de servicios.
3. Comparte tu enlace de agendamiento (${bookingUrl}) en tu perfil de Instagram, TikTok y estados de WhatsApp.

Tienes 14 días de prueba 100% bonificada para disfrutar tu sistema. ¡Muchos éxitos y bienvenida a la familia Kowy! 🚀${cfg.emoji}`;
}
