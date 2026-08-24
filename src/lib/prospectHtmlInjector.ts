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
  showFirstVisitDiscount?: boolean;
  firstVisitDiscountPct?: number;
  firstVisitDiscountTitle?: string;
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
    showFirstVisitDiscount = false,
    firstVisitDiscountPct = 15,
    firstVisitDiscountTitle,
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

  // 1. Inyectar únicamente soporte técnico limpio (Smart Hide Navbar) sin alterar fuentes, colores ni tipografía del HTML de referencia
  const resetCss = `
<style id="beautyflow-prospect-reset">
  /* SMART HIDE NAVBAR (DESLIZAMIENTO SUAVE) */
  header, nav, .main-header, .site-header, .navbar, .header, .top-nav, .navigation {
    position: sticky !important;
    top: 0 !important;
    z-index: 1000 !important;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, background-color 0.3s ease !important;
    will-change: transform;
  }
  .nav-hidden {
    transform: translateY(-105%) !important;
    pointer-events: none !important;
  }

  /* ESTILOS Y ESTRUCTURA DE LAS TARJETAS DE SERVICIOS DINÁMICAS */
  .glow-service-card {
    background: #ffffff !important;
    border-radius: 20px !important;
    padding: 16px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(200, 45, 90, 0.1) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }
  .glow-service-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 16px 36px rgba(200, 45, 90, 0.12) !important;
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
    background: linear-gradient(90deg, #c82d5a, #e11d48) !important;
    border-radius: 999px !important;
    margin-bottom: 10px !important;
  }
  .glow-service-card .card-service-desc {
    font-size: 13px !important;
    color: #475569 !important;
    margin: 0 0 8px 0 !important;
    line-height: 1.5 !important;
  }

  /* PAQUETE INTEGRAL DE OPTIMIZACIÓN MOBILE-FIRST (>90% DE USUARIOS EN SMARTPHONES) */
  @media (max-width: 768px) {
    /* Prevención de desbordamiento horizontal en todo el sitio */
    html, body, .prospect-site-wrapper {
      overflow-x: hidden !important;
      width: 100% !important;
      -webkit-tap-highlight-color: transparent !important;
    }

    /* BARRA SUPERIOR MÓVIL 100% TRANSPARENTE SOBRE LA FOTO (LIMPIA, SIN FONDOS NI PÍLDORAS) */
    .topbar, .top-bar {
      display: none !important;
    }

    header, nav, .main-header, .site-header, .navbar, .header {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: auto !important;
      min-height: unset !important;
      padding: 16px 20px !important;
      background: transparent !important;
      background-color: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      border: none !important;
      border-bottom: none !important;
      box-shadow: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 100 !important;
      box-sizing: border-box !important;
    }

    /* Contenedor del Logo y Nombre del Negocio Centrado sobre la Foto */
    .brand-logo, .logo, .navbar .brand-logo, header .brand-logo {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      margin: 0 auto !important;
      text-decoration: none !important;
    }

    .brand-icon, .logo-silhouette-box, .logo-icon {
      width: 40px !important;
      height: 40px !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: #ffffff !important;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08) !important;
      flex-shrink: 0 !important;
    }

    .brand-text, .logo-text {
      display: flex !important;
      flex-direction: column !important;
      text-align: left !important;
    }

    .brand-title, .logo-title, .brand-name {
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      line-height: 1.1 !important;
      letter-spacing: 0.5px !important;
    }

    .brand-subtitle, .logo-subtitle {
      font-size: 0.65rem !important;
      letter-spacing: 2px !important;
      text-transform: uppercase !important;
      font-weight: 700 !important;
    }

    /* Ocultar elementos redundantes en móvil */
    .nav-links, 
    .menu-toggle,
    .mobile-toggle,
    button[id*="menu"],
    button[class*="menu"],
    header a[class*="btn"], 
    nav a[class*="btn"], 
    .navbar a[class*="btn"], 
    .header a[class*="btn"],
    .btn-header,
    .btn-pill-magenta,
    .navbar .btn-header {
      display: none !important;
    }

    /* HERO MÓVIL INMERSIVO: FOTO EN EL FONDO CON ROSTRO ARRIBA Y TEXTO DEL MEDIO HACIA ABAJO */
    .hero-fullwidth-section,
    .hero-section,
    .hero,
    section[id*="inicio"],
    section[class*="hero"] {
      min-height: 90vh !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-end !important;
      padding: 20px 16px 40px 16px !important;
      position: relative !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
    }

    /* Fotografía de la Modelo en el Fondo: Rostro arriba completamente libre */
    .hero-bg-cover,
    .hero-main-img-box,
    .model-image-frame,
    .hero-image-container,
    .hero-media-wrapper {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border-radius: 0 !important;
      border: none !important;
      box-shadow: none !important;
      z-index: 1 !important;
    }

    .hero-bg-img,
    .hero-bg-cover img,
    .hero-main-img-box img,
    .model-image-frame img,
    .hero-image-container img,
    .hero-media-wrapper img {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center 5% !important;
      opacity: 0.95 !important;
      display: block !important;
    }

    /* Máscara de Fusión: Transparente arriba (deja ver el rostro libre) y degradado suave abajo (para leer el texto) */
    .hero-bg-overlay,
    .hero-overlay {
      position: absolute !important;
      inset: 0 !important;
      display: block !important;
      background: linear-gradient(
        180deg, 
        rgba(253, 250, 249, 0.05) 0%, 
        rgba(253, 250, 249, 0.25) 40%, 
        rgba(251, 243, 242, 0.88) 70%, 
        rgba(251, 243, 242, 0.98) 100%
      ) !important;
      z-index: 2 !important;
    }

    /* Contenedor de Textos: Centrado y ubicado del Medio hacia Abajo */
    .hero-content-wrapper,
    .hero-text-content,
    .hero-container,
    .hero-content,
    .hero-text-block {
      width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
      padding: 0 !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 10 !important;
    }

    /* Escala elegante del título H1 con sombra de legibilidad */
    .hero-title,
    .hero-main-title,
    .hero-content-wrapper h1,
    .hero-text-block h1 {
      font-size: 2rem !important;
      line-height: 1.18 !important;
      margin-bottom: 8px !important;
      text-shadow: 0 1px 12px rgba(255, 255, 255, 0.9) !important;
    }

    /* Subtítulo */
    .hero-desc,
    .hero-subtitle,
    .hero-description,
    .hero-content-wrapper p,
    .hero-text-block p {
      font-size: 0.86rem !important;
      line-height: 1.5 !important;
      max-width: 310px !important;
      margin: 0 auto 16px auto !important;
      text-shadow: 0 1px 8px rgba(255, 255, 255, 0.8) !important;
    }

    /* Botones CTA apilados verticalmente dentro del Hero */
    .hero-actions,
    .hero-ctas {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 10px !important;
      width: 100% !important;
      margin: 0 auto !important;
    }

    .hero-actions a,
    .hero-ctas a,
    .btn-primary,
    .btn-secondary {
      width: 100% !important;
      max-width: 290px !important;
      min-height: 46px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      box-sizing: border-box !important;
    }

    /* Cuadrícula de Servicios Móvil: 2 columnas balanceadas o 1 columna fluida */
    .services-four-grid,
    .services-grid,
    .servicios-grid,
    .grid-services,
    .services-5-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 12px !important;
      padding: 0 4px !important;
    }

    .glow-service-card {
      padding: 12px !important;
      border-radius: 16px !important;
    }

    .glow-service-card .card-service-title {
      font-size: 14px !important;
      margin-bottom: 4px !important;
    }

    .glow-service-card .card-service-desc {
      font-size: 11px !important;
      line-height: 1.4 !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      overflow: hidden !important;
    }

    /* Botones CTA táctiles cómodos para el pulgar */
    .btn-view-all-services,
    .btn-promo-discount,
    .hero-actions a,
    .hero-ctas a {
      min-height: 46px !important;
      padding: 12px 20px !important;
      font-size: 14px !important;
      border-radius: 12px !important;
    }
  }

  @media (max-width: 480px) {
    /* En pantallas muy compactas (360px - 400px), 2 columnas de servicios ultra optimizadas */
    .services-four-grid,
    .services-grid,
    .servicios-grid,
    .grid-services {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    
    .glow-service-card {
      padding: 10px !important;
    }
    
    .glow-service-card .card-photo-box {
      margin-bottom: 8px !important;
      border-radius: 10px !important;
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

  // 1.15 Inyección Dinámica del Nombre / Slogan en el Navbar (solo si fue modificado específicamente)
  if (slogan) {
    processed = processed.replace(
      /(<(?:span|div|h2|h3|h4|a)\b[^>]*class=["'][^"']*(?:brand-name|logo-text|logo-title|brand-title|logo-name|brand-logo-text)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:span|div|h2|h3|h4|a)>)/gi,
      `$1${slogan}$3`
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

  // 1.4 Inyección Dinámica de Nombre / Título y Acento Fucsia en el Hero H1 (SOLO si el usuario configuró explícitamente titleAccent o un slogan personalizado que no sea el fallback del negocio)
  if (titleAccent) {
    const mainTitleName = slogan || '';
    const accentText = `<span class="magenta-accent accent-gold">${titleAccent}</span>`;
    
    if (/(<h1\b[^>]*class=["'][^"']*(?:hero-main-title|hero-title|main-title)[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i.test(processed)) {
      processed = processed.replace(
        /(<h1\b[^>]*class=["'][^"']*(?:hero-main-title|hero-title|main-title)[^"']*["'][^>]*>)([\s\S]*?)(<\/h1>)/i,
        `$1\n            ${mainTitleName ? mainTitleName + '\n' : ''}${accentText}\n          $3`
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

  // 1.6 Inyección Condicional del Banner de Descuento por Primera Cita
  const discountBannerRegex = /(<section\b[^>]*?(?:id=["'](?:descuento|promo|oferta|first-visit-banner|cta|promocion)["']|class=["'][^"']*(?:promo-section|discount-section|first-visit-banner|cta-section|offer-section|cta-banner|banner-promo|first-visit-promo-section)[^"']*)[^>]*>[\s\S]*?<\/section>)/gi;
  
  if (showFirstVisitDiscount) {
    const discountPct = firstVisitDiscountPct || 15;
    const discountHeading = firstVisitDiscountTitle || `¡Obtén un ${discountPct}% OFF en tu Primera Visita!`;
    const promoColor = primaryColor || '#c82d5a';

    const discountSectionHtml = `
    <!-- Sección de Descuento por Primera Visita -->
    <section class="first-visit-promo-section" style="padding: 40px 20px; background: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(251,242,246,0.9) 100%);">
      <div style="max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px 28px; box-shadow: 0 14px 40px rgba(0,0,0,0.06); border: 1px solid rgba(200,45,90,0.12); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: ${promoColor}; opacity: 0.08; border-radius: 50%;"></div>
        <span style="background: rgba(200,45,90,0.1); color: ${promoColor}; font-size: 12px; font-weight: 800; padding: 6px 16px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px;">
          🎁 Regalo Exclusivo de Bienvenida
        </span>
        <h2 style="font-size: 26px; font-weight: 800; color: #190d2e; margin: 0; line-height: 1.25;">
          ${discountHeading}
        </h2>
        <p style="font-size: 14px; color: #64748b; max-width: 580px; margin: 0; line-height: 1.5;">
          Agenda tu cita hoy de forma online y recibe un <strong>${discountPct}% de descuento automático</strong> en cualquier servicio capilar o tratamiento de nuestro salón.
        </p>
        <div style="margin-top: 8px;">
          <a href="${bookingUrl}" class="btn-promo-discount" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; padding: 13px 32px; border-radius: 12px; background-color: ${promoColor}; color: #ffffff; box-shadow: 0 4px 16px rgba(200,45,90,0.3); transition: transform 0.2s ease;">
            Agendar con ${discountPct}% OFF ✨
          </a>
        </div>
      </div>
    </section>
    `;

    if (discountBannerRegex.test(processed)) {
      processed = processed.replace(discountBannerRegex, discountSectionHtml);
    } else {
      // Inyectar justo antes de la sección de servicios
      const beforeServicesRegex = /(<section\b[^>]*?(?:id=["'](?:servicios|services)["']|class=["'][^"']*(?:services-section|servicios-section)[^"']*)[^>]*>)/i;
      if (beforeServicesRegex.test(processed)) {
        processed = processed.replace(beforeServicesRegex, `${discountSectionHtml}\n$1`);
      }
    }
  } else {
    // Si está desactivado, eliminar cualquier sección de descuento / oferta residual del HTML maquetado
    processed = processed.replace(discountBannerRegex, '');
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
