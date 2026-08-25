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
  /* Ajustes universales sutiles para imágenes de catálogo sin romper estilos originales */
  .services-5-grid img,
  .services-four-grid img,
  .services-grid img,
  .servicios-grid img,
  .grid-services img {
    max-width: 100%;
    object-fit: cover !important;
    display: block !important;
  }

  /* EN PC Y TABLET (> 768px): LA CABECERA PERMANECE SIEMPRE FIJA Y VISIBLE */
  @media (min-width: 769px) {
    header, nav, .main-header, .site-header, .navbar, .header, .top-nav, .navigation, .topbar, .top-bar {
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
    }
  }

  /* PAQUETE INTEGRAL DE OPTIMIZACIÓN MOBILE-FIRST (>90% DE USUARIOS EN SMARTPHONES) */
  @media (max-width: 768px) {
    /* En móvil: Ocultar la barra superior para mantener el Hero 100% limpio e inmersivo */
    .topbar, .top-bar, header, nav, .main-header, .site-header, .navbar, .header {
      display: none !important;
    }

    /* Prevención de desbordamiento horizontal en todo el sitio */
    html, body, .prospect-site-wrapper {
      overflow-x: hidden !important;
      width: 100% !important;
      -webkit-tap-highlight-color: transparent !important;
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
      opacity: 1 !important;
      display: block !important;
    }

    /* Sin degradados ni capas oscuras: Fotografía 100% pura y limpia */
    .hero-bg-overlay,
    .hero-overlay,
    .hero-fullwidth-section::after,
    .hero-section::after,
    .hero::after,
    section[id*="inicio"]::after,
    section[class*="hero"]::after {
      display: none !important;
      background: none !important;
    }

    /* Contenedor de Textos: 100% Limpio y Transparente (Sin cajas anidadas oscuras ni bordes artificiales) */
    .hero-content-wrapper,
    .hero-text-content,
    .hero-container,
    .hero-content,
    .hero-text-block {
      width: 100% !important;
      max-width: 100% !important;
      text-align: center !important;
      padding: 0 16px !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 500 !important;
      pointer-events: auto !important;
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      box-sizing: border-box !important;
    }

    /* Saludo / Eyebrow */
    .hero-script-eyebrow,
    .hero-eyebrow,
    .script-eyebrow,
    .hero-badge {
      font-size: 0.88rem !important;
      letter-spacing: 1.5px !important;
      text-transform: uppercase !important;
      font-weight: 700 !important;
      color: rgba(255, 255, 255, 0.9) !important;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7) !important;
      margin-bottom: 6px !important;
      display: inline-block !important;
    }

    /* Escala elegante del título H1 con máxima nitidez y contraste */
    .hero-title,
    .hero-main-title,
    .hero-content-wrapper h1,
    .hero-text-block h1 {
      font-size: 2.1rem !important;
      line-height: 1.16 !important;
      font-weight: 800 !important;
      color: #ffffff !important;
      text-shadow: 0 3px 16px rgba(0, 0, 0, 0.8) !important;
      margin-bottom: 10px !important;
    }

    /* Subtítulo nítido y legible */
    .hero-desc,
    .hero-subtitle,
    .hero-description,
    .hero-content-wrapper p,
    .hero-text-block p {
      font-size: 0.88rem !important;
      line-height: 1.55 !important;
      color: rgba(241, 245, 249, 0.92) !important;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8) !important;
      max-width: 325px !important;
      margin: 0 auto 16px auto !important;
    }

    /* Botones CTA apilados verticalmente dentro del Hero */
    .hero-actions,
    .hero-ctas {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 12px !important;
      width: 100% !important;
      margin: 0 auto !important;
      position: relative !important;
      z-index: 510 !important;
      pointer-events: auto !important;
    }

    .hero-actions a,
    .hero-ctas a,
    .btn-primary,
    .btn-secondary {
      width: 100% !important;
      max-width: 290px !important;
      min-height: 48px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      box-sizing: border-box !important;
      position: relative !important;
      z-index: 520 !important;
      pointer-events: auto !important;
      cursor: pointer !important;
      touch-action: manipulation !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      font-size: 15px !important;
      font-weight: 700 !important;
      letter-spacing: 0.4px !important;
      text-decoration: none !important;
      gap: 8px !important;
      border-radius: 12px !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
    }

    /* Botón Primario (Agendar Cita): Máxima Luminosidad y Nitidez */
    .hero-actions a:first-child,
    .hero-ctas a:first-child,
    .btn-primary {
      color: #ffffff !important;
      font-weight: 800 !important;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35) !important;
    }

    /* Botón Secundario (Explorar / Ver Servicios): Cristalino de Alto Contraste */
    .hero-actions a:nth-child(2),
    .hero-ctas a:nth-child(2),
    .btn-secondary,
    .btn-outline {
      background: rgba(255, 255, 255, 0.12) !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      border: 1.5px solid rgba(255, 255, 255, 0.4) !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
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

  // 2. Inyección y Actualización de Servicios (Preservando al 100% el diseño original, precios, tiempos y asignando el link respectivo al botón nativo)
  // Busca la sección de servicios completa
  const servicesSectionRegex = /(<section\b[^>]*?(?:id=["'](?:servicios|services|menu|carta|catalogo)["']|class=["'][^"']*(?:services|servicios|menu|carta|catalogo)[^"']*)[^>]*>)([\s\S]*?)(<\/section>)/i;
  
  if (servicesSectionRegex.test(processed)) {
    processed = processed.replace(
      servicesSectionRegex,
      (match, sectionOpen, sectionBody, sectionClose) => {
        let cardIndex = 0;
        let updatedSectionBody = sectionBody;

        // Asegurar que la sección siempre tenga id="servicios" para que los botones ancla funcionen
        let normalizedSectionOpen = sectionOpen;
        if (/id=["'][^"']*["']/i.test(normalizedSectionOpen)) {
          normalizedSectionOpen = normalizedSectionOpen.replace(/id=["'][^"']*["']/i, 'id="servicios"');
        } else {
          normalizedSectionOpen = normalizedSectionOpen.replace('<section', '<section id="servicios"');
        }

        // Función auxiliar para actualizar una tarjeta individual
        const processSingleCard = (cardOpen: string, cardInner: string, cardClose: string): string => {
          const idx = cardIndex++;
          let inner = cardInner;

          // Si hay liveServices de base de datos, sincronizar datos
          const srv = (liveServices && liveServices.length > idx) ? liveServices[idx] : null;
          if (srv) {
            const serviceImg = srv.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
            
            // 1. Actualizar imagen
            inner = inner.replace(/<img\b[^>]*src=["'][^"']*["'][^>]*>/i, (imgTag: string) => {
              let updated = imgTag.replace(/src=["'][^"']*["']/i, `src="${serviceImg}"`);
              updated = updated.replace(/alt=["'][^"']*["']/i, `alt="${srv.name}"`);
              return updated;
            });

            // 2. Actualizar título del servicio
            inner = inner.replace(/(<(?:h[1-6]|div|span)\b[^>]*class=["'][^"']*(?:service-title|service-title-text|title|service-name|name)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:h[1-6]|div|span)>)/i, `$1${srv.name}$3`);
            if (!inner.includes(srv.name)) {
              inner = inner.replace(/(<h[1-6]\b[^>]*>)([\s\S]*?)(<\/h[1-6]>)/i, `$1${srv.name}$3`);
            }

            // 3. Actualizar descripción
            if (srv.description) {
              inner = inner.replace(/(<(?:p|span|div)\b[^>]*class=["'][^"']*(?:service-desc|service-desc-text|desc|description)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:p|span|div)>)/i, `$1${srv.description}$3`);
            }

            // 4. Actualizar precio si la tarjeta lo muestra
            const priceVal = srv.price_cop || srv.price || srv.price_usd;
            if (priceVal) {
              const formattedPrice = `$${priceVal.toLocaleString('es-CO')} COP`;
              inner = inner.replace(/(<(?:div|span|p)\b[^>]*class=["'][^"']*(?:price|precio|card-price|service-price)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p)>)/i, `$1${formattedPrice}$3`);
            }

            // 5. Actualizar duración si la tarjeta la muestra
            if (srv.duration_minutes) {
              const durationText = `${srv.duration_minutes} mins`;
              inner = inner.replace(/(<(?:span|div|p)\b[^>]*class=["'][^"']*(?:duration|duracion|time)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:span|div|p)>)/i, `$1${durationText}$3`);
            }
          }

          // Extraer nombre del servicio de la tarjeta para el enlace si no viene de liveServices
          const titleMatch = inner.match(/<(?:h[1-6]|div|span|p)\b[^>]*class=["'][^"']*(?:service-title|service-title-text|title|service-name|name)[^"']*["'][^>]*>([\s\S]*?)<\/(?:h[1-6]|div|span|p)>/i) || inner.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
          const extractedTitle = srv?.name || (titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : `servicio-${idx + 1}`);
          const cleanServiceParam = extractedTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const srvBookingUrl = `${bookingUrl}?service=${encodeURIComponent(cleanServiceParam)}`;

          // 6. Asignar el enlace respectivo de agendamiento directamente al botón/enlace nativo de la tarjeta
          let linkInjected = false;

          // Si la tarjeta contiene enlaces <a>
          if (/<a\b[^>]*>/i.test(inner)) {
            inner = inner.replace(/<a\b([^>]*?)>([\s\S]*?)<\/a>/gi, (fullATag, attrs, aContent) => {
              // Excluir si es un link de redes o whatsapp flotante
              if (/wa-floating|btn-whatsapp-float|whatsapp-float/i.test(attrs)) {
                return fullATag;
              }
              let newAttrs = attrs;
              if (/href=["'][^"']*["']/i.test(newAttrs)) {
                newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${srvBookingUrl}"`);
              } else {
                newAttrs += ` href="${srvBookingUrl}"`;
              }
              // Eliminar target="_blank" para abrir fluidamente el agendador SaaS
              newAttrs = newAttrs.replace(/target=["']_blank["']/i, '');
              linkInjected = true;
              return `<a${newAttrs}>${aContent}</a>`;
            });
          }

          // Si la tarjeta contiene elementos <button> para agendar, convertirlos a <a> con el enlace respectivo
          if (!linkInjected && /<button\b[^>]*>/i.test(inner)) {
            inner = inner.replace(/<button\b([^>]*?)>([\s\S]*?)<\/button>/gi, (_btnTag, attrs, btnContent) => {
              linkInjected = true;
              return `<a href="${srvBookingUrl}" ${attrs} style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">${btnContent}</a>`;
            });
          }

          // Fallback de seguridad: si la tarjeta no tenía ningún botón o enlace, insertar botón sutil con el link
          if (!linkInjected) {
            const fallbackBtnHtml = `
            <div class="card-btn-wrap" style="margin-top: 14px; text-align: center; width: 100%;">
              <a href="${srvBookingUrl}" class="btn-card-book" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px 14px; border-radius: 10px; background: #e5a950; color: #0d1117; font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; box-shadow: 0 4px 12px rgba(229,169,80,0.25); transition: all 0.2s ease;">
                <span>Agendar Cita</span>
              </a>
            </div>`;
            inner = inner + fallbackBtnHtml;
          }

          return `${cardOpen}${inner}${cardClose}`;
        };

        // Si las tarjetas usan la etiqueta semántica <article ...>...</article>
        if (/<article\b[^>]*>/i.test(updatedSectionBody)) {
          updatedSectionBody = updatedSectionBody.replace(
            /(<article\b[^>]*>)([\s\S]*?)(<\/article>)/gi,
            (_m: string, cOpen: string, cInner: string, cClose: string) => processSingleCard(cOpen, cInner, cClose)
          );
        } else {
          // Si las tarjetas usan <div class="...card..."> o <li class="...card...">
          const divCardRegex = /(<(?:div|li)\b[^>]*class=["'][^"']*(?:service-circular-card|service-card|glow-service-card|services-item|servicio-card|popular-card|menu-card|service-box|item-service|card)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|li)>)/gi;
          updatedSectionBody = updatedSectionBody.replace(
            divCardRegex,
            (_m: string, cOpen: string, cInner: string, cClose: string) => processSingleCard(cOpen, cInner, cClose)
          );
        }

        // 7. Si hay más servicios registrados que los mostrados en portada, agregar botón centrado "Ver todos los servicios"
        if (liveServices && liveServices.length > cardIndex && !updatedSectionBody.includes('btn-view-all-services')) {
          const promoColor = primaryColor || '#c82d5a';
          const viewAllBtnHtml = `
          <div style="margin-top: 36px; text-align: center; width: 100%;">
            <a href="${bookingUrl}" class="btn-view-all-services" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; border-radius: 999px; background: ${promoColor}; color: #ffffff; font-size: 0.92rem; font-weight: 700; text-decoration: none; box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: transform 0.2s ease;">
              Ver todos los servicios (${liveServices.length}) →
            </a>
          </div>`;
          updatedSectionBody = updatedSectionBody + viewAllBtnHtml;
        }

        return `${normalizedSectionOpen}${updatedSectionBody}${sectionClose}`;
      }
    );
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

  // 4. Reemplazar enlaces <a> cuyo contenido, clase o atributos indiquen agendamiento
  // IMPORTANTE: Tanto el botón del Header / Menú Superior como el del Hero / Footer y botones de CTA
  // se transforman en enlaces directos a /reservar/:slug sin sobreescribir enlaces específicos de servicios (?service=) o especialistas (?stylistId=).
  processed = processed.replace(
    /<a\b([^>]*?)>(.*?)<\/a>/gis,
    (fullTag, attrs, innerHtml) => {
      // Excluir explícitamente el botón flotante fijo de WhatsApp o redes sociales externas
      if (
        attrs.includes('wa-floating') || 
        attrs.includes('btn-whatsapp-float') ||
        attrs.includes('whatsapp-float') ||
        attrs.includes('whatsapp-btn') ||
        /instagram\.com|facebook\.com|tiktok\.com|twitter\.com|x\.com/i.test(attrs)
      ) {
        return fullTag;
      }

      // Si el enlace ya tiene un parámetro específico como ?service= o ?stylistId=, NO sobreescribirlo
      if (attrs.includes('?service=') || attrs.includes('?stylistId=')) {
        return fullTag;
      }

      // Si es enlace a la sección de Servicios (e.g. "Ver Servicios", "Servicios", href="#servicios", href="#services")
      const isServicesAnchor = /ver\s+servicios|nuestros\s+servicios|conoce\s+nuestros\s+servicios|carta\s+de\s+servicios|ver\s+carta|cat[aá]logo/i.test(innerHtml) ||
        /href=["']#(?:servicios|services|menu|carta|catalogo)["']/i.test(attrs);

      if (isServicesAnchor) {
        let newAttrs = attrs;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, 'href="#servicios"');
        } else {
          newAttrs += ' href="#servicios"';
        }
        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      // Detectar si el texto, clase, id o href indica agendamiento
      const combined = `${attrs} ${innerHtml}`.toLowerCase();
      const isBookingButton = 
        /agend|reserv|turno|cita|separar|book|solicitar\s+cita|pedir\s+cita/i.test(combined) ||
        /btn-header|btn-primary|btn-booking|btn-pill|btn-card|btn-book|btn-reserve/i.test(attrs) ||
        /text=.*(?:agendar|reservar|cita|turno|tratamiento)/i.test(attrs);

      // Excluir si es el enlace de soporte / contacto del topbar que explícitamente solo pide información
      const isPureInfo = /solicitar\s+informaci[oó]n|chatear\s+con\s+recepci[oó]n/i.test(combined) && !/agend|reserv|cita|turno/i.test(innerHtml);

      if (isBookingButton && !isPureInfo) {
        // Reemplazar o actualizar href hacia la página de agendamiento
        let newAttrs = attrs;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${bookingUrl}"`);
        } else {
          newAttrs += ` href="${bookingUrl}"`;
        }
        // Remover target="_blank" para abrir dentro de la misma aplicación
        newAttrs = newAttrs.replace(/target=["']_blank["']/i, '');

        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      return fullTag;
    }
  );

  // 4.1 REGLA ESTRICTA DE FOOTER: Todo botón o CTA dentro del Footer conduce a /reservar/:slug
  // Procesa enlaces o botones dentro de etiquetas <footer>
  processed = processed.replace(
    /(<footer\b[^>]*>)([\s\S]*?)(<\/footer>)/gis,
    (fullFooter, footerOpen, footerContent, footerClose) => {
      let updatedFooter = footerContent;

      // Convertir botones/links de reserva y newsletters en el footer hacia bookingUrl
      updatedFooter = updatedFooter.replace(
        /<a\b([^>]*?)>(.*?)<\/a>/gis,
        (tag: string, attrs: string, content: string) => {
          // Excluir redes sociales o WhatsApp
          if (/instagram\.com|facebook\.com|tiktok\.com|wa\.me|api\.whatsapp\.com/i.test(attrs)) {
            return tag;
          }
          // Si es un botón o link de acción en footer (agendar, newsletter, reservar)
          if (/(?:btn|button|cta|agendar|reservar|cita|turno|suscrib|newsletter)/i.test(attrs) || /(?:Agendar|Reservar|Cita|Turno|Suscribir|Enviar)/i.test(content)) {
            let newAttrs = attrs;
            if (/href=["'][^"']*["']/i.test(newAttrs)) {
              newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${bookingUrl}"`);
            } else {
              newAttrs += ` href="${bookingUrl}"`;
            }
            newAttrs = newAttrs.replace(/target=["']_blank["']/i, '');
            return `<a${newAttrs}>${content}</a>`;
          }
          return tag;
        }
      );

      // Convertir <button> dentro del footer en enlace estilizado a bookingUrl
      updatedFooter = updatedFooter.replace(
        /<button\b([^>]*?)>(.*?)<\/button>/gis,
        (btnTag: string, attrs: string, content: string) => {
          if (/(?:btn|button|newsletter|submit|agendar|reservar)/i.test(attrs) || /(?:Agendar|Reservar|Suscrib|Enviar|Unirme)/i.test(content)) {
            return `<a href="${bookingUrl}" ${attrs} style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">${content}</a>`;
          }
          return btnTag;
        }
      );

      return `${footerOpen}${updatedFooter}${footerClose}`;
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

  // 7. Inyectar Script Técnico Ligero para Navegación Táctil Móvil y Compatibilidad en Iframes
  const interactionScript = `
<script id="beautyflow-interaction-script">
  (function() {
    function initInteractions() {
      document.addEventListener('click', function(e) {
        var target = e.target && e.target.closest ? e.target.closest('a') : null;
        if (!target) return;
        var href = target.getAttribute('href');
        if (!href) return;

        // 1. Desplazamiento suave garantizado a la sección de servicios
        if (href === '#servicios' || href === '#services' || href.startsWith('#serv') || href.startsWith('#menu') || href.startsWith('#carta')) {
          e.preventDefault();
          var srvSec = document.getElementById('servicios') || document.getElementById('services') || document.querySelector('.services-section, .servicios-section, .services-grid, [class*="service"]');
          if (srvSec) {
            srvSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }

        // 2. Navegación segura hacia el Agendador SaaS (/reservar/:slug)
        if (href.indexOf('/reservar/') !== -1) {
          // Si está embebido en iframe de previsualización (Dashboard / Studio)
          if (window.self !== window.top) {
            e.preventDefault();
            try {
              window.top.location.href = href;
            } catch (err) {
              window.open(href, '_top');
            }
          }
        }
      }, { passive: false });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initInteractions);
    } else {
      initInteractions();
    }
  })();
</script>
`;

  if (processed.includes('</body>')) {
    processed = processed.replace('</body>', `${interactionScript}</body>`);
  } else {
    processed += interactionScript;
  }

  return processed;
}
