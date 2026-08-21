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
  heroImageUrl?: string;
  logoIcon?: string;
  heroEyebrow?: string;
  slogan?: string;
  titleAccent?: string;
  subtitle?: string;
  liveServices?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
    price_cop?: number;
    price_usd?: number;
    duration_minutes?: number;
    image_url?: string;
    is_featured?: boolean;
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

  const {
    slug,
    businessName,
    phoneWhatsapp,
    currency = 'COP',
    heroImageUrl,
    logoIcon,
    heroEyebrow,
    slogan,
    titleAccent,
    subtitle,
    liveServices,
    liveStylists
  } = options;
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

  // 1.1 Inyección Dinámica de Icono/Logo de Cabecera (Emoji o Imagen URL / Base64)
  if (logoIcon) {
    const isImg = logoIcon.startsWith('http') || logoIcon.startsWith('data:image/');
    const iconInnerHtml = isImg
      ? `<img src="${logoIcon}" alt="Logo" style="width: 28px; height: 28px; object-fit: contain; border-radius: 6px;" />`
      : `<span style="font-size: 22px; display: inline-flex; align-items: center; justify-content: center; line-height: 1;">${logoIcon}</span>`;

    processed = processed.replace(
      /(<div\b[^>]*class=["'][^"']*logo-silhouette-box[^"']*["'][^>]*>)([\s\S]*?)(<\/div>)/i,
      `$1${iconInnerHtml}$3`
    );
  }

  // 1.2 Inyección Dinámica de Saludo Superior (Eyebrow)
  if (heroEyebrow) {
    processed = processed.replace(
      /(<div\b[^>]*class=["'][^"']*hero-script-eyebrow[^"']*["'][^>]*>)([\s\S]*?)(<\/div>)/i,
      `$1${heroEyebrow}$3`
    );
  }

  // 1.3 Inyección Dinámica de Foto Principal del Hero / Header
  if (heroImageUrl) {
    processed = processed.replace(
      /(<div\b[^>]*class=["'][^"']*model-image-frame[^"']*["'][^>]*>\s*<img\b[^>]*src=["'])([^"']*)(["'][^>]*>)/i,
      `$1${heroImageUrl}$3`
    );
  }

  // 1.4 Inyección Dinámica de Nombre / Título y Acento Fucsia
  if (slogan || titleAccent) {
    const mainTitleName = slogan || businessName;
    const accentText = titleAccent ? `<span class="magenta-accent">${titleAccent}</span>` : '';
    processed = processed.replace(
      /(<h1\b[^>]*class=["'][^"']*hero-main-title[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i,
      `$1\n            ${mainTitleName}\n            ${accentText}\n          $3`
    );
  }

  // 1.5 Inyección Dinámica de Subtítulo Descriptivo
  if (subtitle) {
    processed = processed.replace(
      /(<p\b[^>]*class=["'][^"']*hero-subtitle[^"']*["'][^>]*>)([\s\S]*?)(<\/p>)/i,
      `$1${subtitle}$3`
    );
  }

  // 2. Inyección Dinámica de Servicios Reales (si existen en Supabase para este salón)
  if (liveServices && liveServices.length > 0) {
    const servicesGridRegex = /(<div\b[^>]*class=["'][^"']*(?:services-four-grid|services-grid|servicios-grid|grid-services|services-container)[^"']*["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/section>|<\/div>\s*<\/div>\s*<\/section>)/i;
    
    if (servicesGridRegex.test(processed)) {
      // Priorizar los marcados como destacados (is_featured !== false) y limitar a un máximo de 6 para la portada
      const featuredServices = liveServices.filter(s => s.is_featured !== false);
      const displayServices = (featuredServices.length > 0 ? featuredServices : liveServices).slice(0, 6);

      const liveCardsHtml = displayServices.map((srv, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const priceNum = srv.price_cop ?? srv.price ?? srv.price_usd ?? 0;
        const formattedPrice = currency === 'COP'
          ? `$${priceNum.toLocaleString()} COP`
          : `$${priceNum} ${currency}`;
        const serviceImg = srv.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
        const serviceBookingLink = `${bookingUrl}?serviceId=${srv.id}`;

        return `
        <!-- Card ${numStr} Dinámica -->
        <div class="glow-service-card">
          <div class="card-photo-box">
            <span class="card-num-badge">${numStr}</span>
            <img src="${serviceImg}" alt="${srv.name}">
          </div>
          <div class="card-info-body">
            <h3 class="card-service-title">${srv.name}</h3>
            <div class="pink-divider-dash"></div>
            <p class="card-service-desc">${srv.description || 'Tratamiento profesional garantizado de alta gama con asesoría personalizada.'}</p>
            <div>
              <a href="${serviceBookingLink}" class="price-pill-btn" style="text-decoration: none; display: inline-block;">
                ${formattedPrice} • Agendar
              </a>
            </div>
          </div>
        </div>`;
      }).join('\n');

      // Botón "Ver Catálogo Completo" si hay más servicios
      const viewAllButtonHtml = liveServices.length > displayServices.length ? `
      <div style="text-align: center; margin-top: 28px; width: 100%;">
        <a href="${bookingUrl}" class="btn-pill-magenta" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 999px; box-shadow: 0 8px 24px rgba(217,38,114,0.35);">
          ✨ Ver Todos los Servicios (${liveServices.length}) & Reservar Online
        </a>
      </div>` : '';

      processed = processed.replace(
        servicesGridRegex,
        `$1\n${liveCardsHtml}\n</div>\n${viewAllButtonHtml}\n</section>`
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
