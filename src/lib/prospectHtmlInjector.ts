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
  primaryColor?: string;
  showTeamSection?: boolean;
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
    show_on_web?: boolean;
  }>;
}

export function injectProspectLinks(html: string, options: InjectProspectOptions): string {
  if (!html) return '';

  const {
    slug,
    businessName,
    phoneWhatsapp,
    currency = 'COP',
    primaryColor,
    showTeamSection = true,
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

  // 1. Inyectar regla CSS suave solo para que el contenedor general no sea negro/blanco transparente
  const resetCss = `
<style id="beautyflow-prospect-reset">
  .prospect-site-wrapper { 
    background-color: var(--soft-pink-bg, #fbf2f6);
  }
  .hero-floating-pill strong {
    color: var(--deep-navy, #190d2e) !important;
    display: block !important;
    font-size: 0.88rem !important;
    font-weight: 800 !important;
  }
  .hero-floating-pill span {
    color: #64748b !important;
  }

  /* NORMALIZACIÓN Y ESTILOS DE ALTO CONTRASTE PARA TARJETAS DE SERVICIOS */
  .glow-service-card {
    background: #ffffff !important;
    border-radius: 20px !important;
    padding: 16px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(225, 29, 72, 0.1) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }
  .glow-service-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 16px 36px rgba(225, 29, 72, 0.12) !important;
  }
  .glow-service-card .card-photo-box {
    position: relative !important;
    overflow: hidden !important;
    aspect-ratio: 1 / 1 !important;
    border-radius: 14px !important;
    margin-bottom: 14px !important;
  }
  .glow-service-card .card-photo-box img,
  .services-four-grid .card-photo-box img,
  .services-grid .card-photo-box img,
  .services-four-grid img,
  .services-grid img,
  .servicios-grid img,
  .grid-services img {
    width: 100% !important;
    height: 100% !important;
    aspect-ratio: 1 / 1 !important;
    object-fit: cover !important;
    object-position: center !important;
    display: block !important;
    border-radius: 14px !important;
  }
  .glow-service-card .card-num-badge {
    position: absolute !important;
    top: 10px !important;
    left: 10px !important;
    background: rgba(15, 23, 42, 0.8) !important;
    color: #ffffff !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    padding: 3px 8px !important;
    border-radius: 8px !important;
    backdrop-filter: blur(6px) !important;
    z-index: 2 !important;
  }
  .glow-service-card .card-service-title {
    font-size: 17px !important;
    font-weight: 800 !important;
    color: #1e1b4b !important;
    margin: 0 0 6px 0 !important;
    line-height: 1.3 !important;
  }
  .glow-service-card .pink-divider-dash {
    width: 32px !important;
    height: 3px !important;
    background: linear-gradient(90deg, #e11d48, #d946ef) !important;
    border-radius: 999px !important;
    margin-bottom: 10px !important;
  }
  .glow-service-card .card-service-desc {
    font-size: 13px !important;
    color: #475569 !important;
    margin: 0 0 16px 0 !important;
    line-height: 1.5 !important;
  }
  .glow-service-card .price-pill-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    width: 100% !important;
    background: linear-gradient(135deg, #e11d48, #d946ef) !important;
    color: #ffffff !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    padding: 10px 16px !important;
    border-radius: 999px !important;
    text-decoration: none !important;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.28) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
  .glow-service-card .price-pill-btn:hover {
    transform: scale(1.02) !important;
    box-shadow: 0 6px 18px rgba(225, 29, 72, 0.38) !important;
  }

  /* OPTIMIZACIÓN MÓVIL HERO (OPCIÓN A: FOTO NÍTIDA Y VIBRANTE) */
  @media (max-width: 768px) {
    .hero-fullwidth-section {
      padding-top: 24px !important;
      padding-bottom: 40px !important;
      min-height: auto !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .hero-bg-cover {
      position: relative !important;
      width: 100% !important;
      height: 320px !important;
      margin-top: 24px !important;
      border-radius: 24px !important;
      overflow: hidden !important;
      box-shadow: 0 12px 32px rgba(225, 29, 72, 0.15) !important;
      order: 2 !important;
    }
    .hero-bg-img {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center top !important;
      opacity: 1 !important;
      display: block !important;
    }
    .hero-bg-overlay {
      background: linear-gradient(180deg, transparent 60%, rgba(24, 21, 40, 0.3) 100%) !important;
    }
    .hero-content-wrapper {
      order: 1 !important;
      position: relative !important;
      z-index: 5 !important;
    }
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
      /(<(?:div|span|a)\b[^>]*class=["'][^"']*(?:logo-silhouette-box|logo-box|logo-icon|logo-symbol|brand-icon)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|a)>)/i,
      `$1${iconInnerHtml}$3`
    );
  }

  // 1.2 Inyección Dinámica de Saludo Superior (Eyebrow)
  if (heroEyebrow) {
    processed = processed.replace(
      /(<(?:div|span|p)\b[^>]*class=["'][^"']*(?:hero-script-eyebrow|hero-eyebrow|badge-hero|hero-badge|script-eyebrow)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p)>)/i,
      `$1${heroEyebrow}$3`
    );
  }

  // 1.3 Inyección Dinámica de Foto Principal del Hero / Header
  if (heroImageUrl) {
    processed = processed.replace(
      /(<div\b[^>]*class=["'][^"']*(?:hero-main-img-box|model-image-frame|hero-image-box|hero-bg-cover|hero-photo|hero-img-wrap)[^"']*["'][^>]*>\s*<img\b[^>]*src=["'])([^"']*)(["'][^>]*>)/i,
      `$1${heroImageUrl}$3`
    );
  }

  // 1.4 Inyección Dinámica de Nombre / Título y Acento Fucsia
  if (slogan || titleAccent) {
    const mainTitleName = slogan || businessName;
    const accentText = titleAccent ? `<span class="magenta-accent">${titleAccent}</span>` : '';
    
    if (/(<h1\b[^>]*class=["'][^"']*(?:hero-main-title|hero-title|main-title)[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i.test(processed)) {
      processed = processed.replace(
        /(<h1\b[^>]*class=["'][^"']*(?:hero-main-title|hero-title|main-title)[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i,
        `$1\n            ${mainTitleName}\n            ${accentText}\n          $3`
      );
    } else {
      // Fallback a cualquier primer <h1> dentro del documento
      processed = processed.replace(
        /(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/i,
        `$1\n            ${mainTitleName}\n            ${accentText}\n          $3`
      );
    }
  }

  // 1.5 Inyección Dinámica de Subtítulo Descriptivo
  if (subtitle) {
    if (/(<p\b[^>]*class=["'][^"']*(?:hero-subtitle|hero-desc|hero-description|lead-text)[^"']*["'][^>]*>)([\s\S]*?)(<\/p>)/i.test(processed)) {
      processed = processed.replace(
        /(<p\b[^>]*class=["'][^"']*(?:hero-subtitle|hero-desc|hero-description|lead-text)[^"']*["'][^>]*>)([\s\S]*?)(<\/p>)/i,
        `$1${subtitle}$3`
      );
    }
  }

  // 2. Inyección Dinámica de Servicios Reales (si existen en Supabase para este salón)
  if (liveServices && liveServices.length > 0) {
    // Expresión regular robusta que busca la cuadrícula completa de servicios y su contenido completo
    const servicesGridRegex = /(<div\b[^>]*class=["'][^"']*(?:services-four-grid|services-grid|servicios-grid|grid-services|services-container)[^"']*["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/section>|(?=<section\b|<footer\b))/i;
    
    if (servicesGridRegex.test(processed)) {
      // Filtrar únicamente los marcados como destacados para la portada web (is_featured === true o !== false por defecto)
      const featuredServices = liveServices.filter(s => s.is_featured === true || (s.is_featured !== false && s.is_featured !== undefined));
      // Si todos fueron desmarcados o no hay destacados, mostrar los que queden con is_featured activo
      const displayServices = (featuredServices.length > 0 ? featuredServices : liveServices).slice(0, 6);

      const liveCardsHtml = displayServices.map((srv, idx) => {
        const numStr = String(idx + 1).padStart(2, '0');
        const serviceImg = srv.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';

        return `
        <!-- Card ${numStr} Dinámica (Diseño Original) -->
        <div class="glow-service-card">
          <div class="card-photo-box">
            <span class="card-num-badge">${numStr}</span>
            <img src="${serviceImg}" alt="${srv.name}">
          </div>
          <div class="card-info-body">
            <h3 class="card-service-title">${srv.name}</h3>
            <div class="pink-divider-dash"></div>
            <p class="card-service-desc">${srv.description || 'Tratamiento profesional de alta gama con asesoría personalizada.'}</p>
          </div>
        </div>`;
      }).join('\n');

      // Botón "Ver todos los servicios" si el negocio tiene más servicios registrados que los mostrados en portada
      // Alineado idénticamente con el estilo, color (#c82d5a) y border-radius del botón del Header
      const viewAllButtonHtml = liveServices.length > displayServices.length ? `
      <div class="view-all-services-container" style="text-align: center; margin-top: 40px; width: 100%; grid-column: 1 / -1;">
        <a href="${bookingUrl}" class="btn-view-all-services" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: 15px; padding: 13px 32px; border-radius: 12px; background-color: #c82d5a; color: #ffffff; box-shadow: 0 4px 14px rgba(200, 45, 90, 0.25); transition: all 0.2s ease;">
          Ver todos los servicios (${liveServices.length})
        </a>
      </div>` : '';

      processed = processed.replace(
        servicesGridRegex,
        (match, p1, p2, p3) => {
          if (p3.includes('</section>')) {
            return `${p1}\n${liveCardsHtml}\n</div>\n${viewAllButtonHtml}\n</div>\n</section>`;
          }
          return `${p1}\n${liveCardsHtml}\n</div>\n${viewAllButtonHtml}\n</div>\n</section>`;
        }
      );
    }
  }

  // 2.5 Inyección y Control de Visibilidad de la Sección de Equipo / Especialistas
  const teamSectionRegex = /(<section\b[^>]*?(?:id=["'](?:nosotros|equipo)["']|class=["'][^"']*(?:team-section|stylists-section|nosotros-section)[^"']*)[^>]*>)([\s\S]*?)(<\/section>)/i;
  
  if (!showTeamSection) {
    // Si la administradora decidió ocultar la sección de Nosotros
    processed = processed.replace(teamSectionRegex, '');
    // Ocultar también el enlace "Nosotros" en el menú de navegación si existe
    processed = processed.replace(/<li\b[^>]*>\s*<a\b[^>]*href=["']#(?:nosotros|equipo)["'][^>]*>[\s\S]*?<\/a>\s*<\/li>/gi, '');
  } else if (liveStylists && liveStylists.length > 0) {
    // Filtrar colaboradoras marcadas para mostrar en la web (show_on_web !== false) y limitar a un máximo de 4
    const webStylists = liveStylists.filter(s => s.show_on_web !== false).slice(0, 4);

    if (webStylists.length > 0) {
      const teamGridRegex = /(<div\b[^>]*class=["'][^"']*(?:team-grid|stylists-grid|team-container|grid-team)[^"']*["'][^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>|<\/div>\s*<\/section>)/i;

      if (teamGridRegex.test(processed)) {
        const liveTeamCardsHtml = webStylists.map((sty) => {
          const avatarUrl = sty.photo_url || 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=500&q=80';
          const stylistBookingLink = `${bookingUrl}?stylistId=${sty.id}`;
          const ratingStars = '⭐'.repeat(Math.round(sty.rating || 5));

          return `
          <!-- Card de Especialista Dinámica -->
          <div class="team-card">
            <div class="team-photo-box" style="position: relative; width: 110px; height: 110px; margin: 0 auto 16px;">
              <img src="${avatarUrl}" alt="${sty.name}" class="team-avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
            </div>
            <div class="team-info">
              <h3 class="team-name" style="font-size: 18px; font-weight: 800; margin-bottom: 4px;">${sty.name}</h3>
              <span class="team-role" style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 8px;">${sty.specialty || 'Especialista en Belleza'}</span>
              <div class="team-rating" style="font-size: 11px; margin-bottom: 12px;">${ratingStars} (${(sty.rating || 5).toFixed(1)})</div>
              <a href="${stylistBookingLink}" class="btn-team-book" style="display: inline-block; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 999px; text-decoration: none;">
                Agendar Cita
              </a>
            </div>
          </div>`;
        }).join('\n');

        processed = processed.replace(
          teamGridRegex,
          `$1\n${liveTeamCardsHtml}\n</div>\n</div>\n</section>`
        );
      }
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

  // 5. Normalizar todos los enlaces de WhatsApp (wa.me o api.whatsapp.com) con el teléfono oficial del negocio
  processed = processed.replace(
    /https:\/\/(?:wa\.me|api\.whatsapp\.com\/send\?phone=)[/0-9]+/gi,
    `https://wa.me/${cleanPhone}`
  );

  processed = processed.replace(
    /href=["']https:\/\/wa\.me\/\??text=/gi,
    `href="https://wa.me/${cleanPhone}?text=`
  );

  // 6. Actualizar textos de teléfono visibles en el pie de página o barra de contacto
  if (cleanPhone && cleanPhone.length >= 10) {
    const formattedTel = cleanPhone.startsWith('57') && cleanPhone.length === 12
      ? `(+57) ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 8)} ${cleanPhone.slice(8)}`
      : cleanPhone;
    
    // Reemplazar patrones de teléfonos antiguos por el nuevo número del negocio
    processed = processed.replace(
      /(?:\(\+57\)\s*\d{3}\s*\d{3}\s*\d{4}|\+57\s*\d{3}\s*\d{3}\s*\d{4})/g,
      formattedTel
    );
  }

  return processed;
}
