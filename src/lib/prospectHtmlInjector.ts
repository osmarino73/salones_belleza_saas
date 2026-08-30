/**
 * BEAUTYFLOW AI - PROSPECT HTML INJECTOR
 * 
 * Inyecta de forma no intrusiva los enlaces de agendamiento en vivo (/reservar/:slug)
 * y el WhatsApp oficial del negocio directamente en los botones y enlaces nativos del HTML,
 * preservando al 100% la estética original sin barras ni widgets flotantes molestos.
 */

export interface ExtractedWebsiteData {
  heroImageUrl?: string;
  logoIcon?: string;
  heroEyebrow?: string;
  slogan?: string;
  titleAccent?: string;
  navbarTagline?: string;
  subtitle?: string;
  aboutImageUrl?: string;
  aboutBadgeText?: string;
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutTitleAccent?: string;
  aboutDescription?: string;
  aboutYearsExp?: string;
  aboutClientsCount?: string;
  aboutStat3Text?: string;
  aboutRatingText?: string;
  showAboutSection?: boolean;
}

/**
 * Extrae automáticamente los datos iniciales de la Cabecera (Hero) y de la Sección Sobre Nosotros
 * leyendo directamente la estructura HTML nativa de la plantilla.
 */
export function extractWebsiteDataFromHtml(html: string): ExtractedWebsiteData {
  if (!html) return {};
  const result: ExtractedWebsiteData = {};

  try {
    // 1. Extraer Hero Image
    const heroImgMatch = html.match(/(?:hero-main-img-box|model-image-frame|hero-image-box|hero-bg-cover|hero-photo|hero-img-wrap|hero-image)[^>]*>\s*<img\b[^>]*src=["']([^"']+)["']/i)
      || html.match(/<header\b[^>]*>\s*[\s\S]*?<img\b[^>]*src=["']([^"']+)["']/i)
      || html.match(/background(?:-image)?:\s*url\(['"]?([^'")]+)['"]?\)/i);
    if (heroImgMatch && heroImgMatch[1]) {
      result.heroImageUrl = heroImgMatch[1];
    }

    // 2. Extraer Logo Icon
    const logoMatch = html.match(/<(?:div|span|a)\b[^>]*class=["'][^"']*(?:logo-silhouette-box|logo-box|logo-icon|logo-symbol|brand-icon)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|a)>/i);
    if (logoMatch && logoMatch[1]) {
      const imgInLogo = logoMatch[1].match(/<img\b[^>]*src=["']([^"']+)["']/i);
      if (imgInLogo) {
        result.logoIcon = imgInLogo[1];
      } else {
        const textLogo = logoMatch[1].replace(/<[^>]*>/g, '').trim();
        if (textLogo) result.logoIcon = textLogo;
      }
    }

    // 2.5 Extraer Lema / Subtítulo del Logo en el Navbar
    const taglineMatch = html.match(/<(?:span|div|p|small)\b[^>]*class=["'][^"']*(?:brand-tagline|brand-subtitle|logo-subtitle|brand-desc|logo-desc|brand-tag)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|p|small)>/i);
    if (taglineMatch && taglineMatch[1]) {
      result.navbarTagline = taglineMatch[1].replace(/<[^>]*>/g, '').trim();
    }

    // 3. Extraer Hero Eyebrow
    const eyebrowMatch = html.match(/<(?:div|span|p)\b[^>]*class=["'][^"']*(?:hero-script-eyebrow|hero-eyebrow|badge-hero|hero-badge|script-eyebrow|hero-tag)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|p)>/i);
    if (eyebrowMatch && eyebrowMatch[1]) {
      result.heroEyebrow = eyebrowMatch[1].replace(/<[^>]*>/g, '').trim();
    }

    // 4. Extraer Hero Slogan / H1 y Acento
    const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      const h1Content = h1Match[1];
      const accentMatch = h1Content.match(/<(?:span|em|i)\b[^>]*class=["'][^"']*(?:magenta-accent|accent-gold|accent|highlight)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|em|i)>/i)
        || h1Content.match(/<(?:span|em|i)\b[^>]*>([\s\S]*?)<\/(?:span|em|i)>/i);
      
      if (accentMatch) {
        result.titleAccent = accentMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const mainTitle = h1Content.replace(accentMatch[0], '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        if (mainTitle) result.slogan = mainTitle;
      } else {
        result.slogan = h1Content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }
    }

    // 5. Extraer Hero Subtitle
    const subMatch = html.match(/<p\b[^>]*class=["'][^"']*(?:hero-subtitle|hero-desc|hero-description|lead-text)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)
      || html.match(/<header\b[^>]*>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i);
    if (subMatch && subMatch[1]) {
      result.subtitle = subMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // 6. Extraer Datos de la Sección Sobre Nosotros
    const aboutSecMatch = html.match(/<section\b[^>]*?(?:id=["'][^"']*(?:nosotros|about|historia|experiencia)[^"']*|class=["'][^"']*(?:about|nosotros|historia|story|experience)[^"']*)[^>]*>([\s\S]*?)<\/section>/i)
      || html.match(/<section\b[^>]*>([\s\S]*?(?:Sobre\s+Nosotros|Nuestra\s+Historia|Nuestra\s+Pasi[oó]n|Experiencia)[\s\S]*?)<\/section>/i);

    if (aboutSecMatch && aboutSecMatch[1]) {
      const aboutBody = aboutSecMatch[1];
      result.showAboutSection = true;

      // Foto de Sobre Nosotros
      const aboutImgMatch = aboutBody.match(/<img\b[^>]*src=["']([^"']+)["']/i);
      if (aboutImgMatch && aboutImgMatch[1]) {
        result.aboutImageUrl = aboutImgMatch[1];
      }

      // Badge VIP
      const badgeMatch = aboutBody.match(/<(?:div|span|p|strong|a)\b[^>]*class=["'][^"']*(?:vip|badge|gold|experience|curly|tag|curls)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|p|strong|a)>/i);
      if (badgeMatch && badgeMatch[1]) {
        result.aboutBadgeText = badgeMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Eyebrow Sobre Nosotros
      const aboutEyebrowMatch = aboutBody.match(/<(?:div|span|p|em|h5|h6)\b[^>]*class=["'][^"']*(?:section-subtitle|about-eyebrow|script-eyebrow|eyebrow|subtitle)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|p|em|h5|h6)>/i);
      if (aboutEyebrowMatch && aboutEyebrowMatch[1]) {
        result.aboutEyebrow = aboutEyebrowMatch[1].replace(/<[^>]*>/g, '').trim();
      }

      // Título Sobre Nosotros
      const aboutTitleMatch = aboutBody.match(/<(?:h2|h3|h4)\b[^>]*>([\s\S]*?)<\/(?:h2|h3|h4)>/i);
      if (aboutTitleMatch && aboutTitleMatch[1]) {
        const titleInner = aboutTitleMatch[1];
        const accentAboutMatch = titleInner.match(/<(?:span|em|i)\b[^>]*class=["'][^"']*(?:accent-gold|magenta-accent|accent|highlight)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|em|i)>/i)
          || titleInner.match(/<(?:span|em|i)\b[^>]*>([\s\S]*?)<\/(?:span|em|i)>/i);
        
        if (accentAboutMatch) {
          result.aboutTitleAccent = accentAboutMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          const cleanMain = titleInner.replace(accentAboutMatch[0], '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          if (cleanMain) result.aboutTitle = cleanMain;
        } else {
          result.aboutTitle = titleInner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        }
      }

      // Descripción Sobre Nosotros (primer párrafo <p> en la sección)
      const aboutDescMatch = aboutBody.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
      if (aboutDescMatch && aboutDescMatch[1]) {
        result.aboutDescription = aboutDescMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Métricas (años, clientes, productos limpios/especialidad, calificación)
      const metricItemMatches = [...aboutBody.matchAll(/<(?:div|li|article)\b[^>]*class=["'][^"']*(?:metric-item|stat-item|stat-card|about-stat|metric-card|stat-box)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|li|article)>/gi)];
      let rawStatValues: string[] = [];

      if (metricItemMatches.length > 0) {
        rawStatValues = metricItemMatches.map(m => {
          const firstTagMatch = m[1].match(/<(?:strong|span|h4|h3|h2|b|p|div)\b[^>]*>([\s\S]*?)<\/(?:strong|span|h4|h3|h2|b|p|div)>/i);
          return (firstTagMatch ? firstTagMatch[1] : m[1]).replace(/<[^>]*>/g, '').trim();
        });
      } else {
        const directStatMatches = [...aboutBody.matchAll(/<(?:span|div|strong|h4|h3|h2|p|b)\b[^>]*class=["'][^"']*(?:stat-num|stat-number|stat-value|metric-value|metric-number|stat-count|counter|number)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|strong|h4|h3|h2|p|b)>/gi)];
        rawStatValues = directStatMatches.map(m => m[1].replace(/<[^>]*>/g, '').trim());
      }

      if (rawStatValues.length >= 4) {
        result.aboutYearsExp = rawStatValues[0];
        result.aboutClientsCount = rawStatValues[1];
        result.aboutStat3Text = rawStatValues[2];
        result.aboutRatingText = rawStatValues[3];
      } else if (rawStatValues.length === 3) {
        result.aboutYearsExp = rawStatValues[0];
        result.aboutClientsCount = rawStatValues[1];
        result.aboutRatingText = rawStatValues[2];
      } else if (rawStatValues.length === 2) {
        result.aboutYearsExp = rawStatValues[0];
        result.aboutClientsCount = rawStatValues[1];
      } else if (rawStatValues.length === 1) {
        result.aboutYearsExp = rawStatValues[0];
      }
    }
  } catch (err) {
    console.warn('Error extracting website data from HTML:', err);
  }

  return result;
}

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
  navbarTagline?: string;
  subtitle?: string;
  aboutImageUrl?: string;
  aboutBadgeText?: string;
  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutTitleAccent?: string;
  aboutDescription?: string;
  aboutYearsExp?: string;
  aboutClientsCount?: string;
  aboutStat3Text?: string;
  aboutRatingText?: string;
  showAboutSection?: boolean;
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
    navbarTagline,
    subtitle,
    aboutImageUrl,
    aboutBadgeText,
    aboutEyebrow,
    aboutTitle,
    aboutTitleAccent,
    aboutDescription,
    aboutYearsExp,
    aboutClientsCount,
    aboutStat3Text,
    aboutRatingText,
    showAboutSection = true,
    liveServices,
    liveStylists
  } = options;
  const cleanPhone = phoneWhatsapp.replace(/\D/g, '') || '573000000000';
  const bookingUrl = `/reservar/${slug}`;

  let processed = html;

  // 1. Inyectar únicamente soporte técnico limpio y estilos para elementos dinámicos
  const resetCss = `
<style id="beautyflow-prospect-reset">
  /* Soporte técnico no invasivo para evitar desbordamiento horizontal y mejorar el tap móvil */
  html, body {
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Ajustes universales sutiles para imágenes dinámicas */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Estilos para el botón dinámico de Catálogo Extendido si aplica */
  .btn-view-all-services {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .btn-view-all-services:hover {
    transform: translateY(-2px);
  }

  /* Estilos para el banner promocional de primera visita si está habilitado */
  .btn-promo-discount {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .btn-promo-discount:hover {
    transform: translateY(-2px);
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

  // Extraer valores base nativos para comparación de no-invasión
  const baseline = extractWebsiteDataFromHtml(html);

  // 1.15 Inyección Dinámica de Marca (Nombre, Acento y Lema) en el Navbar
  const isNavbarBrandChanged = (slogan && slogan !== baseline.slogan) || (titleAccent && titleAccent !== baseline.titleAccent);
  if (isNavbarBrandChanged) {
    const brandTitleRegex = /(<(?:span|div|h2|h3|h4|a)\b[^>]*class=["'][^"']*(?:brand-title|brand-name|logo-text|logo-title|logo-name|brand-logo-text)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:span|div|h2|h3|h4|a)>)/gi;
    if (brandTitleRegex.test(processed)) {
      processed = processed.replace(brandTitleRegex, (_match: string, openTag: string, innerContent: string, closeTag: string) => {
        let newBrandInner = innerContent;
        if (/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i.test(newBrandInner)) {
          if (titleAccent) {
            newBrandInner = newBrandInner.replace(/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i, `$1${titleAccent}$3`);
          }
          if (slogan) {
            newBrandInner = newBrandInner.replace(/^([^<]+)/, `${slogan} `);
          }
        } else {
          if (slogan && titleAccent) {
            newBrandInner = `${slogan} <span>${titleAccent}</span>`;
          } else if (slogan) {
            newBrandInner = slogan;
          }
        }
        return `${openTag}${newBrandInner}${closeTag}`;
      });
    }
  }

  // Inyección Dinámica del Lema / Subtítulo del Logo en el Navbar
  if (navbarTagline && navbarTagline !== baseline.navbarTagline) {
    processed = processed.replace(
      /(<(?:span|div|p|small)\b[^>]*class=["'][^"']*(?:brand-tagline|brand-subtitle|logo-subtitle|brand-desc|logo-desc|brand-tag)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:span|div|p|small)>)/gi,
      `$1${navbarTagline}$3`
    );
  }

  // 1.2 Inyección Dinámica de Saludo Superior (Eyebrow) (solo si fue modificado)
  if (heroEyebrow && heroEyebrow !== baseline.heroEyebrow) {
    processed = processed.replace(
      /(<(?:div|span|p)\b[^>]*class=["'][^"']*(?:hero-script-eyebrow|hero-eyebrow|badge-hero|hero-badge|script-eyebrow)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p)>)/i,
      `$1${heroEyebrow}$3`
    );
  }

  // 1.3 Inyección Dinámica de Foto Principal del Hero / Header
  if (heroImageUrl && heroImageUrl !== baseline.heroImageUrl) {
    processed = processed.replace(
      /(<div\b[^>]*class=["'][^"']*(?:hero-main-img-box|model-image-frame|hero-image-box|hero-bg-cover|hero-photo|hero-img-wrap)[^"']*["'][^>]*>\s*<img\b[^>]*src=["'])([^"']*)(["'][^>]*>)/i,
      `$1${heroImageUrl}$3`
    );
  }

  // 1.4 Inyección Fiel de Título y Acento en el Hero H1 (Preservando 100% las fuentes, cursivas y maquetación nativa)
  const isTitleAccentChanged = titleAccent && titleAccent !== baseline.titleAccent;
  const isSloganChanged = slogan && slogan !== baseline.slogan;

  if (isTitleAccentChanged || isSloganChanged) {
    if (/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/i.test(processed)) {
      processed = processed.replace(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/i, (_match: string, h1Open: string, h1Inner: string, h1Close: string) => {
        let updatedH1Inner = h1Inner;

        // Si cambió el acento destacado y el H1 contiene un elemento hijo (span/em/i), actualizar SOLO su texto interior
        if (isTitleAccentChanged) {
          if (/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i.test(updatedH1Inner)) {
            updatedH1Inner = updatedH1Inner.replace(/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i, `$1${titleAccent}$3`);
          } else {
            updatedH1Inner += ` <span class="magenta-accent accent-gold">${titleAccent}</span>`;
          }
        }

        // Si cambió el título principal
        if (isSloganChanged) {
          if (/^([^<]+)/.test(updatedH1Inner)) {
            updatedH1Inner = updatedH1Inner.replace(/^([^<]+)/, `${slogan} `);
          }
        }

        return `${h1Open}${updatedH1Inner}${h1Close}`;
      });
    }
  }

  // 1.5 Inyección Dinámica de Subtítulo Descriptivo (solo si fue modificado)
  if (subtitle && subtitle !== baseline.subtitle) {
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

  // 1.7 Inyección y Actualización de la Sección Sobre Nosotros (Preservando 100% el diseño y fuentes originales)
  const aboutSectionRegex = /(<section\b[^>]*?(?:id=["'](?:nosotros|about|sobre-nosotros|historia|nuestro-salon|quienes-somos)["']|class=["'][^"']*(?:about-section|sobre-nosotros|about-container|story-section|quienes-somos)[^"']*)[^>]*>)([\s\S]*?)(<\/section>)/i;
  
  if (!showAboutSection) {
    // Si la administradora decidió ocultar la sección Sobre Nosotros
    processed = processed.replace(aboutSectionRegex, '');
    processed = processed.replace(/<li\b[^>]*>\s*<a\b[^>]*href=["']#(?:nosotros|about|sobre-nosotros|historia|nuestro-salon|quienes-somos)["'][^>]*>[\s\S]*?<\/a>\s*<\/li>/gi, '');
    processed = processed.replace(/<a\b[^>]*href=["']#(?:nosotros|about|sobre-nosotros|historia|nuestro-salon|quienes-somos)["'][^>]*>[\s\S]*?<\/a>/gi, '');
  } else if (aboutSectionRegex.test(processed)) {
    processed = processed.replace(
      aboutSectionRegex,
      (match, sectionOpen, sectionBody, sectionClose) => {
        let updatedBody = sectionBody;

        // 1. Actualizar Foto de la Sección Sobre Nosotros (solo si cambió)
        if (aboutImageUrl && aboutImageUrl !== baseline.aboutImageUrl) {
          updatedBody = updatedBody.replace(
            /(<img\b[^>]*src=["'])([^"']*)(["'][^>]*>)/i,
            `$1${aboutImageUrl}$3`
          );
        }

        // 2. Actualizar Badge VIP sobre la Foto (solo si cambió)
        if (aboutBadgeText && aboutBadgeText !== baseline.aboutBadgeText) {
          const badgeRegex = /(<(?:div|span|p|strong)\b[^>]*class=["'][^"']*(?:vip-badge|badge-gold|badge-experience|about-badge|experience-badge|badge|curly|curls)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p|strong)>)/i;
          if (badgeRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(badgeRegex, `$1${aboutBadgeText}$3`);
          }
        }

        // 3. Actualizar Eyebrow / Saludo Superior (solo si cambió)
        if (aboutEyebrow && aboutEyebrow !== baseline.aboutEyebrow) {
          const eyebrowRegex = /(<(?:div|span|p|em)\b[^>]*class=["'][^"']*(?:section-subtitle|about-eyebrow|script-eyebrow|eyebrow)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p|em)>)/i;
          if (eyebrowRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(eyebrowRegex, `$1${aboutEyebrow}$3`);
          }
        }

        // 4. Actualizar Título Principal & Acento (Preservando 100% las etiquetas, fuentes y clases nativas)
        const isAboutTitleChanged = aboutTitle && aboutTitle !== baseline.aboutTitle;
        const isAboutAccentChanged = aboutTitleAccent && aboutTitleAccent !== baseline.aboutTitleAccent;

        if (isAboutTitleChanged || isAboutAccentChanged) {
          const titleRegex = /(<(?:h2|h3|h4)\b[^>]*>)([\s\S]*?)(<\/(?:h2|h3|h4)>)/i;
          if (titleRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(titleRegex, (_tMatch: string, tOpen: string, tInner: string, tClose: string) => {
              let newInner = tInner;
              if (isAboutAccentChanged) {
                if (/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i.test(newInner)) {
                  newInner = newInner.replace(/(<(?:span|em|i)\b[^>]*>)([\s\S]*?)(<\/(?:span|em|i)>)/i, `$1${aboutTitleAccent}$3`);
                }
              }
              if (isAboutTitleChanged) {
                if (/^([^<]+)/.test(newInner)) {
                  newInner = newInner.replace(/^([^<]+)/, `${aboutTitle} `);
                }
              }
              return `${tOpen}${newInner}${tClose}`;
            });
          }
        }

        // 5. Actualizar Párrafo Descriptivo (solo si cambió)
        if (aboutDescription && aboutDescription !== baseline.aboutDescription) {
          const pRegex = /(<p\b[^>]*>)([\s\S]*?)(<\/p>)/i;
          if (pRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(pRegex, `$1${aboutDescription}$3`);
          }
        }

        // 6. Actualizar Métricas / Estadísticas Dinámicas (Años Exp., Clientas, Productos Limpios / Especialidad, Calificación ★)
        const hasCustomStats = Boolean(
          aboutYearsExp || aboutClientsCount || aboutStat3Text || aboutRatingText
        );

        if (hasCustomStats) {
          // Si el HTML contiene tarjetas individuales de métricas (ej. <div class="metric-item"><strong>+8</strong><span>Años Exp.</span></div>)
          const metricItemRegex = /(<(?:div|li|article)\b[^>]*class=["'][^"']*(?:metric-item|stat-item|stat-card|about-stat|metric-card|stat-box)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|li|article)>)/gi;

          if (metricItemRegex.test(updatedBody)) {
            updatedBody = updatedBody.replace(metricItemRegex, (wholeItem: string, openTag: string, itemInner: string, closeTag: string) => {
              let updatedInner = itemInner;
              const textUpper = itemInner.toUpperCase();

              if ((textUpper.includes('AÑO') || textUpper.includes('EXP')) && aboutYearsExp) {
                updatedInner = updatedInner.replace(/(<(?:strong|span|h4|h3|h2|b|p|div)\b[^>]*>)([\s\S]*?)(<\/(?:strong|span|h4|h3|h2|b|p|div)>)/i, `$1${aboutYearsExp}$3`);
              } else if ((textUpper.includes('CLIENT') || textUpper.includes('FELICES') || textUpper.includes('ATENDID')) && aboutClientsCount) {
                updatedInner = updatedInner.replace(/(<(?:strong|span|h4|h3|h2|b|p|div)\b[^>]*>)([\s\S]*?)(<\/(?:strong|span|h4|h3|h2|b|p|div)>)/i, `$1${aboutClientsCount}$3`);
              } else if ((textUpper.includes('PRODUCT') || textUpper.includes('LIMPIO') || textUpper.includes('ORG') || textUpper.includes('CALIDAD') || textUpper.includes('BOTANIC')) && aboutStat3Text) {
                updatedInner = updatedInner.replace(/(<(?:strong|span|h4|h3|h2|b|p|div)\b[^>]*>)([\s\S]*?)(<\/(?:strong|span|h4|h3|h2|b|p|div)>)/i, `$1${aboutStat3Text}$3`);
              } else if ((textUpper.includes('CALIFICACI') || textUpper.includes('ESTRELLA') || textUpper.includes('★') || textUpper.includes('RATING') || textUpper.includes('PUNTUAC')) && aboutRatingText) {
                updatedInner = updatedInner.replace(/(<(?:strong|span|h4|h3|h2|b|p|div)\b[^>]*>)([\s\S]*?)(<\/(?:strong|span|h4|h3|h2|b|p|div)>)/i, `$1${aboutRatingText}$3`);
              }

              return `${openTag}${updatedInner}${closeTag}`;
            });
          } else {
            // Fallback para plantillas que usan clases directas tipo stat-number, metric-number, etc.
            let statIdx = 0;
            const statValuesMap = [
              aboutYearsExp,
              aboutClientsCount,
              aboutStat3Text,
              aboutRatingText
            ].filter(v => v !== undefined && v !== '');

            if (statValuesMap.length > 0) {
              updatedBody = updatedBody.replace(
                /(<(?:span|div|strong|h4|h3|h2|p|b)\b[^>]*class=["'][^"']*(?:stat-num|stat-number|stat-value|metric-value|metric-number|stat-count|counter|number)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:span|div|strong|h4|h3|h2|p|b)>)/gi,
                (wholeMatch: string, openTag: string, _currentVal: string, closeTag: string) => {
                  const assignedVal = statValuesMap[statIdx];
                  statIdx++;
                  if (assignedVal !== undefined && assignedVal !== '') {
                    return `${openTag}${assignedVal}${closeTag}`;
                  }
                  return wholeMatch;
                }
              );
            }
          }
        }

        return `${sectionOpen}${updatedBody}${sectionClose}`;
      }
    );
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

        // El encabezado nativo (section-header) se preserva 100% intacto con sus clases y colores originales

        // Función auxiliar para actualizar una tarjeta individual respetando 100% la maquetación nativa
        const processSingleCard = (cardOpen: string, cardInner: string, cardClose: string): string => {
          const idx = cardIndex++;
          let inner = cardInner;

          // 1. Extraer el nombre nativo del servicio de la tarjeta
          const titleMatch = inner.match(/<(?:h[1-6]|div|span|p)\b[^>]*class=["'][^"']*(?:service-title|service-title-text|title|service-name|name)[^"']*["'][^>]*>([\s\S]*?)<\/(?:h[1-6]|div|span|p)>/i)
            || inner.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
          const nativeTitle = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : `servicio-${idx + 1}`;

          // 2. Buscar si existe un servicio en base de datos que coincida por nombre (evitando sobreescrituras ciegas por índice)
          const normNative = nativeTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          const matchingSrv = liveServices ? liveServices.find(s => {
            const normSrv = s.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
            return normSrv === normNative || normSrv.includes(normNative) || normNative.includes(normSrv);
          }) : null;

          if (matchingSrv) {
            // Actualizar precio si fue modificado en base de datos
            const priceVal = matchingSrv.price_cop || matchingSrv.price || matchingSrv.price_usd;
            if (priceVal) {
              const formattedPrice = `$${priceVal.toLocaleString('es-CO')} COP`;
              inner = inner.replace(/(<(?:div|span|p)\b[^>]*class=["'][^"']*(?:price|precio|card-price|service-price)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|span|p)>)/i, `$1${formattedPrice}$3`);
            }

            // Actualizar imagen solo si tiene una foto propia cargada
            if (matchingSrv.image_url) {
              inner = inner.replace(/<img\b[^>]*src=["'][^"']*["'][^>]*>/i, (imgTag: string) => {
                return imgTag.replace(/src=["'][^"']*["']/i, `src="${matchingSrv.image_url}"`);
              });
            }
          }

          // 3. Generar enlace de agendamiento directo al servicio
          const cleanServiceParam = nativeTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const srvBookingUrl = `${bookingUrl}?service=${encodeURIComponent(cleanServiceParam)}`;

          // 4. Eliminar ÚNICAMENTE la pastilla de técnica/ingrediente de forma segura (sin tocar duración, precio ni imagen)
          inner = inner.replace(/<(?:div|span|p|li)\b[^>]*>[^<]*(?:Caída\s+Natural|Mantecas\s+Naturales|Exfoliaci[oó]n\s*&\s*Estimulaci[oó]n|Prote[ií]nas\s*&\s*Aceites|Mano\s+Alzada|Fitagem\s*&\s*Duraci[oó]n|Lavado\s+Bot[aá]nico)[^<]*<\/(?:div|span|p|li)>/gi, '');

          // 5. Asignar el enlace respectivo de agendamiento directamente al botón/enlace nativo de la tarjeta
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

          // Si la tarjeta tiene pill/badge de acción, enlazarlo suavemente
          if (!linkInjected && /(<span\b[^>]*class=["'][^"']*(?:service-tag-pill|tag-pill|card-badge|btn-tag)[^"']*["'][^>]*>)([\s\S]*?)(<\/span>)/i.test(inner)) {
            inner = inner.replace(/(<span\b[^>]*class=["'][^"']*(?:service-tag-pill|tag-pill|card-badge|btn-tag)[^"']*["'][^>]*>)([\s\S]*?)(<\/span>)/i, `<a href="${srvBookingUrl}" style="text-decoration: none;" class="service-tag-link">$1$2$3</a>`);
            linkInjected = true;
          }

          // Si el contenedor de imagen/avatar no está dentro de un enlace, enlazarlo para máxima facilidad táctil en móviles
          if (/<div\b[^>]*class=["'][^"']*(?:service-avatar-wrap|service-img-wrap|service-photo|service-image)[^"']*["'][^>]*>/i.test(inner) && !inner.includes('service-img-link')) {
            inner = inner.replace(
              /(<(?:div|figure)\b[^>]*class=["'][^"']*(?:service-avatar-wrap|service-img-wrap|service-photo|service-image)[^"']*["'][^>]*>)([\s\S]*?)(<\/(?:div|figure)>)/i,
              `<a href="${srvBookingUrl}" class="service-img-link" style="text-decoration: none; display: block; cursor: pointer;">$1$2$3</a>`
            );
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

        // 7. Si hay más servicios registrados que los mostrados en portada, agregar botón centrado "Ver todos los servicios" mimetizado con la identidad del proyecto
        if (liveServices && liveServices.length > cardIndex && !updatedSectionBody.includes('btn-view-all-services')) {
          const isDefaultPink = !primaryColor || primaryColor === '#d92672' || primaryColor === '#c82d5a';
          const btnBg = isDefaultPink ? 'linear-gradient(135deg, #e5a95d 0%, #c48b47 100%)' : primaryColor;
          const btnTextColor = isDefaultPink ? '#0d0d11' : '#ffffff';
          const btnShadow = isDefaultPink ? '0 8px 24px rgba(229, 169, 93, 0.28)' : '0 8px 24px rgba(0,0,0,0.15)';

          const viewAllBtnHtml = `
          <div class="view-all-services-container" style="margin-top: 40px; margin-bottom: 16px; text-align: center; width: 100%; display: flex; justify-content: center;">
            <a href="${bookingUrl}" class="btn-view-all-services btn-card btn-primary" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 34px; border-radius: 12px; background: ${btnBg}; color: ${btnTextColor}; font-family: inherit; font-size: 0.95rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; box-shadow: ${btnShadow}; border: 1px solid rgba(255, 255, 255, 0.15); transition: all 0.3s ease; cursor: pointer;">
              <span>Ver todos los servicios (${liveServices.length})</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
    /href=["'](#reserva|#reservas|#agendar|#cita|#citas|#reservar|#booking|#agenda)["']/gi,
    `href="${bookingUrl}"`
  );

  // 4. Reemplazar enlaces <a> y botones según la Regla de Oro:
  // - TODO lo que indique "Reservar" / "Agendar" / "Cita" / "Turno" / "Book" -> /reservar/:slug (o con ?service= / ?stylistId=)
  // - ÚNICAMENTE iconos o textos que explícitamente digan "WhatsApp" o sean el botón flotante verde -> WhatsApp (https://wa.me/:telefono)
  processed = processed.replace(
    /<a\b([^>]*?)>(.*?)<\/a>/gis,
    (fullTag, attrs, innerHtml) => {
      // 1. Si ya es un enlace con parámetro específico de agendador (?service= o ?stylistId=) o ya apunta a /reservar/, conservarlo
      if (attrs.includes('?service=') || attrs.includes('?stylistId=') || attrs.includes(`/reservar/`)) {
        return fullTag;
      }

      const textOnly = innerHtml.replace(/<[^>]*>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const combinedAttrs = attrs.toLowerCase();

      // 2. Comprobar si es un elemento dedicado exclusivamente a WhatsApp:
      const isFloatingWhatsApp = /(?:whatsapp-float|wa-floating|btn-whatsapp-float|floating-wa|wa-btn-floating|whatsapp-btn|wa-floating-btn)/i.test(combinedAttrs);
      const hasWhatsAppIcon = /(?:fa-whatsapp|fab fa-whatsapp|fa-brands fa-whatsapp|lucide-whatsapp|whatsapp-icon|icono-wa|ri-whatsapp)/i.test(innerHtml) || /(?:fa-whatsapp|fab fa-whatsapp|fa-brands fa-whatsapp)/i.test(combinedAttrs);
      const textExplicitlySaysWhatsApp = /\bwhatsapp\b/i.test(textOnly);

      // 3. Comprobar si es un botón o enlace de Agendamiento / Reserva:
      const hasBookingText = /(?:agendar|agend[aáeé]|reservar|reserv[aáeé]|reservas|cita|citas|separar\s*cita|pedir\s*cita|solicitar\s*cita|sacar\s*cita|turno|turnos|book|booking|agendamiento)/i.test(textOnly);
      const hasBookingClass = /(?:btn-header|btn-primary|btn-booking|btn-reserve|btn-agendar|btn-hero|btn-cita|btn-agendar-cita|cta-book|btn-card)/i.test(combinedAttrs);
      const hasBookingHash = /href=["']#(?:reserva|reservas|agendar|cita|citas|reservar|booking|agenda)["']/i.test(combinedAttrs);

      // REGLA FUNDAMENTAL: Todo lo que diga reservar/agendar o tenga clase de botón de agendar DEBE llevar a /reservar/:slug
      if ((hasBookingText || hasBookingClass || hasBookingHash) && !isFloatingWhatsApp) {
        let newAttrs = attrs;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${bookingUrl}"`);
        } else {
          newAttrs += ` href="${bookingUrl}"`;
        }
        // Quitar target="_blank" para navegación fluida en el agendador SaaS
        newAttrs = newAttrs.replace(/\s*target=["'][^"']*["']/gi, '');
        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      // Si es un ícono o texto que explícitamente dice WhatsApp (o el botón flotante de WhatsApp):
      if (isFloatingWhatsApp || textExplicitlySaysWhatsApp || (hasWhatsAppIcon && !hasBookingText)) {
        let newAttrs = attrs;
        const targetWaUrl = `https://wa.me/${cleanPhone}`;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, (match: string) => {
            if (/wa\.me|whatsapp\.com/i.test(match)) {
              return match; // Se normalizará en el paso 5 con el teléfono limpio
            }
            return `href="${targetWaUrl}"`;
          });
        } else {
          newAttrs += ` href="${targetWaUrl}"`;
        }
        // Asegurar target="_blank" para abrir WhatsApp en nueva pestaña
        if (!/target=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs += ' target="_blank" rel="noopener noreferrer"';
        }
        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      // 4. Si es enlace a la sección de Servicios (e.g. "Ver Servicios", "Servicios", href="#servicios")
      const isServicesAnchor = /(?:ver\s+servicios|nuestros\s+servicios|conoce\s+nuestros\s+servicios|carta\s+de\s+servicios|ver\s+carta|cat[aá]logo|ver\s+tratamientos)/i.test(textOnly) ||
        /href=["']#(?:servicios|services|menu|carta|catalogo|tratamientos)["']/i.test(combinedAttrs);

      if (isServicesAnchor) {
        let newAttrs = attrs;
        if (/href=["'][^"']*["']/i.test(newAttrs)) {
          newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, 'href="#servicios"');
        } else {
          newAttrs += ' href="#servicios"';
        }
        return `<a${newAttrs}>${innerHtml}</a>`;
      }

      // 5. Exclusiones de otros enlaces externos o contactos (tel:, mailto:, redes sociales, maps)
      if (/tel:|mailto:|maps\.google|goo\.gl\/maps|instagram\.com|facebook\.com|tiktok\.com|twitter\.com|x\.com|youtube\.com/i.test(combinedAttrs)) {
        return fullTag;
      }

      return fullTag;
    }
  );

  // 4.05 Convertir cualquier <button> que contenga texto o clase de agendamiento en <a> hacia bookingUrl
  processed = processed.replace(
    /<button\b([^>]*?)>(.*?)<\/button>/gis,
    (fullBtnTag, attrs, innerHtml) => {
      // Si es el toggle del menú móvil, no tocar
      if (/menu-toggle|nav-toggle|hamburger|navbar-toggler/i.test(attrs)) {
        return fullBtnTag;
      }
      const textOnly = innerHtml.replace(/<[^>]*>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const combinedAttrs = attrs.toLowerCase();

      const hasBookingText = /(?:agendar|agend[aáeé]|reservar|reserv[aáeé]|reservas|cita|citas|separar\s*cita|pedir\s*cita|solicitar\s*cita|sacar\s*cita|turno|turnos|book|booking)/i.test(textOnly);
      const hasBookingClass = /(?:btn-header|btn-primary|btn-booking|btn-reserve|btn-agendar|btn-hero|btn-cita|btn-card)/i.test(combinedAttrs);

      if (hasBookingText || hasBookingClass) {
        return `<a href="${bookingUrl}" ${attrs} style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">${innerHtml}</a>`;
      }

      return fullBtnTag;
    }
  );

  // 4.1 REGLA ESTRICTA DE FOOTER: Todo botón o CTA de reserva/agendamiento en el Footer conduce a /reservar/:slug
  // Procesa enlaces o botones dentro de etiquetas <footer>
  processed = processed.replace(
    /(<footer\b[^>]*>)([\s\S]*?)(<\/footer>)/gis,
    (fullFooter, footerOpen, footerContent, footerClose) => {
      let updatedFooter = footerContent;

      // Convertir botones/links de reserva y newsletters en el footer hacia bookingUrl
      updatedFooter = updatedFooter.replace(
        /<a\b([^>]*?)>(.*?)<\/a>/gis,
        (tag: string, attrs: string, content: string) => {
          const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          const combinedAttrs = attrs.toLowerCase();

          // Excluir WhatsApp si dice explícitamente WhatsApp o tiene icono de WhatsApp y no dice agendar/reservar
          const isWhatsApp = /\bwhatsapp\b/i.test(textOnly) || /(?:fa-whatsapp|fab fa-whatsapp|fa-brands fa-whatsapp|whatsapp-icon)/i.test(content) || /(?:wa\.me|api\.whatsapp\.com)/i.test(combinedAttrs);
          if (isWhatsApp && !/(?:agendar|reservar|cita|turno)/i.test(textOnly)) {
            return tag;
          }

          // Excluir redes sociales o contacto telefónico
          if (/instagram\.com|facebook\.com|tiktok\.com|twitter\.com|tel:|mailto:|maps\.google/i.test(combinedAttrs)) {
            return tag;
          }

          // Si es un botón o link de acción en footer (agendar, newsletter, reservar)
          if (/(?:btn|button|cta|agendar|reservar|cita|turno|suscrib|newsletter)/i.test(combinedAttrs) || /(?:agendar|reservar|cita|turno|separar)/i.test(textOnly)) {
            let newAttrs = attrs;
            if (/href=["'][^"']*["']/i.test(newAttrs)) {
              newAttrs = newAttrs.replace(/href=["'][^"']*["']/i, `href="${bookingUrl}"`);
            } else {
              newAttrs += ` href="${bookingUrl}"`;
            }
            newAttrs = newAttrs.replace(/\s*target=["'][^"']*["']/gi, '');
            return `<a${newAttrs}>${content}</a>`;
          }
          return tag;
        }
      );

      // Convertir <button> dentro del footer en enlace estilizado a bookingUrl si es de agendamiento
      updatedFooter = updatedFooter.replace(
        /<button\b([^>]*?)>(.*?)<\/button>/gis,
        (btnTag: string, attrs: string, content: string) => {
          const textOnly = content.replace(/<[^>]*>/g, ' ').toLowerCase();
          if (/(?:btn|button|agendar|reservar)/i.test(attrs) || /(?:agendar|reservar|cita|turno|separar)/i.test(textOnly)) {
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
    /https:\/\/wa\.me\/(?:\+?\d+)?(\?[^"'\s>]*)?/gi,
    (_match, queryString) => {
      const qs = queryString ? queryString : '';
      return `https://wa.me/${cleanPhone}${qs}`;
    }
  );

  processed = processed.replace(
    /https:\/\/api\.whatsapp\.com\/send\?(?:phone=\+?\d+&?)?(?:&?text=([^"'\s>]*))?/gi,
    (_match, textParam) => {
      const text = textParam ? `?text=${textParam}` : '';
      return `https://wa.me/${cleanPhone}${text}`;
    }
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
