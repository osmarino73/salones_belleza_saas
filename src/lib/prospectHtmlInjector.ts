/**
 * BEAUTYFLOW AI - PROSPECT HTML INJECTOR
 * 
 * Inyecta de forma no intrusiva los enlaces de agendamiento en vivo (/reservar/:slug)
 * y el WhatsApp oficial del negocio directamente en los botones y enlaces nativos del HTML,
 * preservando al 100% la estética original sin barras ni widgets flotantes molestos.
 */

export interface InjectProspectOptions {
  slug: string;
  businessName: string;
  phoneWhatsapp: string;
}

export function injectProspectLinks(html: string, options: InjectProspectOptions): string {
  if (!html) return '';

  const { slug, businessName, phoneWhatsapp } = options;
  const cleanPhone = phoneWhatsapp.replace(/\D/g, '') || '573000000000';
  const bookingUrl = `/reservar/${slug}`;

  let processed = html;

  // 1. Reemplazar enlaces y botones de agendamiento nativos (#reserva, #reservas, #agendar, etc.)
  processed = processed.replace(
    /href=["'](#reserva|#reservas|#agendar|#cita|#citas)["']/gi,
    `href="${bookingUrl}"`
  );

  // 2. Reemplazar botones o enlaces que digan "Agendar Cita" o "Reservar Cita" que no tengan link externo
  processed = processed.replace(
    /<a\s+([^>]*?)href=["'](#|javascript:void\(0\);?|#contacto)?["']([^>]*?)>(.*?)(Agendar\s+Cita|Reservar\s+Cita|Pedir\s+Cita|Solicitar\s+Turno|Agendar\s+Online)(.*?)<\/a>/gi,
    `<a $1href="${bookingUrl}"$3>$4$5$6</a>`
  );

  // 3. Normalizar todos los enlaces de WhatsApp (wa.me o api.whatsapp.com) con el teléfono oficial del negocio
  processed = processed.replace(
    /https:\/\/(wa\.me|api\.whatsapp\.com\/send\?phone=)[/0-9]+/gi,
    `https://wa.me/${cleanPhone}`
  );

  processed = processed.replace(
    /href=["']https:\/\/wa\.me\/\??text=/gi,
    `href="https://wa.me/${cleanPhone}?text=`
  );

  return processed;
}
