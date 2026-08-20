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

  // 1. Inyectar regla CSS suave solo para que el contenedor general no sea negro/blanco transparente, pero respetando 100% los estilos de botones, badges y gradientes del HTML
  const resetCss = `
<style id="beautyflow-prospect-reset">
  .prospect-site-wrapper { 
    background-color: var(--soft-pink-bg, #fbf2f6);
  }
</style>
`;
  if (processed.includes('</head>')) {
    processed = processed.replace('</head>', `${resetCss}</head>`);
  } else {
    processed = resetCss + processed;
  }

  // 2. Reemplazar enlaces y botones de agendamiento nativos (#reserva, #reservas, #agendar, etc.)
  processed = processed.replace(
    /href=["'](#reserva|#reservas|#agendar|#cita|#citas|#reservar)["']/gi,
    `href="${bookingUrl}"`
  );

  // 3. Reemplazar enlaces <a> cuyo texto contenga 'Agendar Cita', 'Reservar Cita', 'Pedir Cita', etc.
  // IMPORTANTE: Incluso si en el HTML original tenían enlace a WhatsApp ("wa.me" o similar), 
  // si es un botón de agendamiento, se redirige al flujo de reserva online (/reservar/:slug).
  // Excluimos explícitamente el botón flotante (wa-floating-button o similar con tooltip/chat).
  processed = processed.replace(
    /<a\s+([^>]*?)href=["']([^"']*)["']([^>]*?)>((?:(?!wa-floating)[\s\S])*?)(Agendar\s+Cita|Reservar\s+Cita|Pedir\s+Cita|Solicitar\s+Turno|Agendar\s+Online|Reservar\s+Turno|Agenda\s+tu\s+Cita|Agendar\s+mi\s+cita)((?:(?!wa-floating)[\s\S])*?)<\/a>/gi,
    (match, beforeHref, oldHref, afterHref, textBefore, actionText, textAfter) => {
      // Si es una clase flotante de WhatsApp, mantener WhatsApp
      if (match.includes('wa-floating') || match.includes('btn-whatsapp-float')) {
        return match;
      }
      return `<a ${beforeHref}href="${bookingUrl}"${afterHref}>${textBefore}${actionText}${textAfter}</a>`;
    }
  );

  // 4. Normalizar todos los enlaces de WhatsApp restantes (wa.me o api.whatsapp.com) con el teléfono oficial del negocio
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
