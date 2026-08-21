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
  currency?: string;
  liveServices?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
    price_cop?: number;
    price_usd?: number;
    duration_minutes?: number;
    image_url?: string;
  }>;
  liveStylists?: Array<{
    id: string;
    name: string;
    specialty?: string;
    photo_url?: string;
    rating?: number;
  }>;
}

export function injectProspectLinks(html: string, options: InjectProspectOptions): string {
  if (!html) return '';

  const { slug, businessName, phoneWhatsapp, currency = 'COP', liveServices, liveStylists } = options;
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

  // 2. Inyección Dinámica de Servicios Reales (si existen en Supabase para este salón)
  if (liveServices && liveServices.length > 0) {
    const servicesGridRegex = /(<div\b[^>]*class=["'][^"']*(?:services-grid|servicios-grid|grid-services|services-container)[^"']*["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/div>|<\/section>)/i;
    
    if (servicesGridRegex.test(processed)) {
      const liveCardsHtml = liveServices.map((srv, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const priceNum = srv.price_cop ?? srv.price ?? srv.price_usd ?? 0;
        const formattedPrice = currency === 'COP'
          ? `$${priceNum.toLocaleString()} COP`
          : `$${priceNum} ${currency}`;
        const serviceImg = srv.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
        const serviceBookingLink = `${bookingUrl}?serviceId=${srv.id}`;

        return `
        <div class="service-card" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: 20px; overflow: hidden; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.06); transition: transform 0.3s ease;">
          <div style="position: relative; height: 200px; width: 100%; overflow: hidden;">
            <img src="${serviceImg}" alt="${srv.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 999px; backdrop-filter: blur(4px);">
              ${srv.duration_minutes || 60} min
            </span>
          </div>
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="font-size: 11px; font-weight: 800; color: #d92672; text-transform: uppercase; letter-spacing: 0.5px;">#${numStr} • Servicio</span>
              <h3 style="font-size: 18px; font-weight: 900; color: #1e1b4b; margin: 4px 0 8px 0; line-height: 1.25;">${srv.name}</h3>
              <p style="font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.5;">${srv.description || 'Tratamiento profesional de alta gama con productos prémium garantizados.'}</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f1f5f9;">
              <span style="font-size: 16px; font-weight: 900; color: #0f172a;">${formattedPrice}</span>
              <a href="${serviceBookingLink}" style="background: linear-gradient(135deg, #d92672 0%, #be185d 100%); color: #fff; text-decoration: none; font-size: 12px; font-weight: 800; padding: 8px 18px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 4px 14px rgba(217,38,114,0.35);">
                Agendar
              </a>
            </div>
          </div>
        </div>`;
      }).join('');

      processed = processed.replace(
        servicesGridRegex,
        `$1\n${liveCardsHtml}\n</div>\n$3`
      );
    }
  }

  // 3. Reemplazar enlaces y botones de agendamiento nativos (#reserva, #reservas, #agendar, etc.)
  processed = processed.replace(
    /href=["'](#reserva|#reservas|#agendar|#cita|#citas|#reservar)["']/gi,
    `href="${bookingUrl}"`
  );

  // 4. Reemplazar enlaces <a> cuyo contenido o atributos indiquen agendamiento
  // IMPORTANTE: Tanto el botón del Header / Menú Superior como el del Hero / Footer
  // se transforman en enlaces directos a /reservar/:slug.
  processed = processed.replace(
    /<a\b([^>]*?)>(.*?)<\/a>/gis,
    (fullTag, attrs, innerHtml) => {
      // Excluir explícitamente el botón flotante fijo de WhatsApp
      if (attrs.includes('wa-floating') || attrs.includes('btn-whatsapp-float')) {
        return fullTag;
      }

      // Si el texto interno o atributos contienen palabras clave de agendamiento
      const isBookingButton = /(?:Agendar|Reservar|Pedir|Solicitar)\s+(?:Cita|Turno|Online)|Agenda\s+tu\s+Cita|Agendar\s+mi\s+cita|btn-header-book|btn-pill-magenta|vip-booking|btn-white-book/i.test(innerHtml) ||
        /btn-header-book|btn-pill-magenta|btn-white-book/i.test(attrs);

      if (isBookingButton) {
        // Reemplazar o actualizar href
        let newAttrs = attrs;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${bookingUrl}"`);
        } else {
          newAttrs += ` href="${bookingUrl}"`;
        }
        // Remover target="_blank" si lo tenía para abrir en la misma app
        newAttrs = newAttrs.replace(/target=["']_blank["']/i, '');

        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      return fullTag;
    }
  );

  // 5. Normalizar todos los enlaces de WhatsApp restantes (wa.me o api.whatsapp.com) con el teléfono oficial del negocio
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
