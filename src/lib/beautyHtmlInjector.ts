import { BeautySpecialtyService } from './beautySpecialties';
import { PLANTILLA_BARBERIA_HTML, PLANTILLA_BARBERIA_SERVICES, PLANTILLA_BARBERIA_TEAM } from './templates/plantillaBarberia';
import { PLANTILLA_SALON_FEMENINO_HTML, PLANTILLA_SALON_FEMENINO_SERVICES, PLANTILLA_SALON_FEMENINO_TEAM } from './templates/plantillaSalonFemenino';
import { PLANTILLA_NAILS_HTML, PLANTILLA_NAILS_SERVICES, PLANTILLA_NAILS_TEAM } from './templates/plantillaNails';
import { CRIS_BARBERSHOP_SITE_DATA } from './crisBarbershopSiteData';
import { FANTASTIC_MONTERIA_SITE_DATA } from './fantasticMonteriaSiteData';
import { MILENA_GOMEZ_SITE_DATA } from './milenaGomezSiteData';
import { KAPA_SPA_SITE_DATA } from './kapaSpaSiteData';
import { SANUS_SPA_SITE_DATA } from './sanusSpaSiteData';

export interface InjectBeautyHtmlParams {
  slug: string;
  category?: string;
  businessName: string;
  phoneWhatsapp: string;
  address?: string;
  city?: string;
  primaryColor?: string;
  visualTemplateId?: string;
  heroImage?: string;
  heroMobileImage?: string;
  bannerUrl?: string;
  headline?: string;
  subheadline?: string;
  heroBadge?: string;
  aboutImageUrl?: string;
  scheduleText?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutP1?: string;
  aboutP2?: string;
  metric1Val?: string;
  metric1Label?: string;
  metric2Val?: string;
  metric2Label?: string;
  metric3Val?: string;
  metric3Label?: string;
  metric4Val?: string;
  metric4Label?: string;
  services?: BeautySpecialtyService[];
  team?: any[];
  gpsCoordinates?: string;
}

export function injectBeautyHtml(params: InjectBeautyHtmlParams): string {
  const {
    slug,
    category = 'barberia',
    businessName,
    phoneWhatsapp,
    address = 'Calle Central # 10-20',
    city = 'Apartadó',
    primaryColor,
    heroImage,
    heroMobileImage,
    aboutImageUrl,
    headline,
    subheadline,
    heroBadge,
    scheduleText = 'Lunes a Sábado: 8:30 AM - 8:30 PM',
    aboutTitle,
    aboutDescription,
    aboutP1,
    aboutP2,
    metric1Val,
    metric1Label,
    metric2Val,
    metric2Label,
    metric3Val,
    metric3Label,
    metric4Val,
    metric4Label,
    services = [],
    team = [],
    gpsCoordinates
  } = params;

  const cleanPhone = phoneWhatsapp.replace(/\D/g, '') || '573000000000';
  const digitsOnly = cleanPhone.replace(/^57/, '');
  const phoneDisplay = digitsOnly.length === 10
    ? `(+57) ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 6)} ${digitsOnly.substring(6)}`
    : `+${cleanPhone}`;
  const cat = (category || '').toLowerCase();

  // Cálculo de query satelital precisa: si hay GPS usamos coordenadas exactas, sino dirección
  const cleanGps = gpsCoordinates && gpsCoordinates.trim()
    ? gpsCoordinates.trim().replace(/\s+/g, '')
    : null;
  const activeMapQuery = cleanGps
    ? encodeURIComponent(cleanGps)
    : encodeURIComponent(`${address}, ${city}, Colombia`);

  // 1. =========================================================================
  // RAMA 1: BARBERÍA DE ALTA GAMA (Legend Dark & Amber Gold - plantillaBarberia.ts)
  // =========================================================================
  if (cat.includes('barber') || params.visualTemplateId === 'dark-luxury-gold') {
    let html = PLANTILLA_BARBERIA_HTML;

    // Servicios a renderizar: máximo 8 servicios en la landing (los del intake o catálogo oficial)
    const rawServices = (services && services.length > 0) ? services : PLANTILLA_BARBERIA_SERVICES;
    const effectiveServices = rawServices.slice(0, 8);

    const servicesCardsHtml = effectiveServices.map((s) => {
      const saasBookingUrl = `/reservar/${slug}?service=${encodeURIComponent(s.titulo)}`;
      const durationText = s.duracion_texto || (s.duracion_min ? `${s.duracion_min} mins` : '45 mins');
      const priceText = `$${s.precio_cop.toLocaleString('es-CO')}`;
      const badgePill = s.etiqueta
        ? `<span class="service-badge-pill" style="color: var(--amber-gold);"><i class="fa-solid fa-star"></i> ${s.etiqueta}</span>`
        : `<span class="service-badge-pill"><i class="fa-solid fa-check"></i> Perfilado Navaja</span>`;

      return `
          <!-- Servicio Card -->
          <article class="service-card-legend">
            <div class="service-img-wrapper">
              <img src="${s.imagen_url}" alt="${s.titulo}" loading="lazy" />
            </div>
            <div class="service-body">
              <div>
                <h3 class="service-name">${s.titulo}</h3>
                <div class="service-badges-wrap">
                  <span class="service-badge-pill"><i class="fa-regular fa-clock"></i> ${durationText}</span>
                  ${badgePill}
                </div>
              </div>
              <div class="service-price-block">
                <span class="service-price-val">${priceText}</span>
                <span class="service-price-curr">COP</span>
              </div>
              <a href="${saasBookingUrl}" class="btn-card-book">
                <i class="fa-regular fa-calendar-check"></i> Agendar Cita
              </a>
            </div>
          </article>`;
    }).join('\n');

    // Barberos / Especialistas a renderizar
    const rawTeam = (team && team.length > 0) ? team : PLANTILLA_BARBERIA_TEAM;
    const teamCardsHtml = rawTeam.map((member: any) => {
      const memberName = member.name || member.nombre || 'Master Barbero';
      const memberRole = member.specialty || member.cargo || member.rol || 'Master Barber';
      const memberPhoto = member.photo_url || member.foto_url || member.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80';
      const memberRating = member.rating || member.calificacion || 5.0;
      const memberBadge = member.badge || (member.role === 'admin' ? 'Master' : 'Pro');
      const bookingUrl = `/reservar/${slug}`;

      return `
          <!-- Barbero Card -->
          <div class="team-card">
            <div class="team-photo-box">
              <img src="${memberPhoto}" alt="${memberName}" class="team-avatar" loading="lazy" />
              <span class="team-badge">${memberBadge}</span>
            </div>
            <div class="team-info">
              <h4 class="team-name">${memberName}</h4>
              <span class="team-role">${memberRole}</span>
              <div class="team-rating">⭐⭐⭐⭐⭐ (${Number(memberRating).toFixed(1)})</div>
              <a href="${bookingUrl}" class="btn-team-book">Agendar Cita</a>
            </div>
          </div>`;
    }).join('\n');

    const activeDesktopHero = heroImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp';
    const activeMobileHero = heroMobileImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp';
    const activeAboutImage = aboutImageUrl || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80';

    const activeHeadline = headline || `MÁS QUE UN CORTE. <br /><span class="accent-gold">UN ESTILO DE VIDA.</span>`;
    const activeSubheadline = subheadline || `Cortes de precisión, degradados skin fade impecables y perfilado de barba con toalla caliente diseñados por barberos maestros en ${city}.`;
    const activeBadge = heroBadge || `<i class="fa-solid fa-scissors"></i> <span>CLUB MASCULINO VIP &bull; ${city.toUpperCase()}</span>`;

    const activeAboutTitle = aboutTitle || 'PRECISIÓN. ESTILO. CONFIANZA TOTAL.';
    const activeAboutDescription = aboutDescription || `En ${businessName} creemos que un gran corte es mucho más que un servicio: es una declaración de identidad. Combinamos la tradición del afeitado clásico con las últimas tendencias de degradados para que luzcas imponente.`;
    const activeMetric1Val = metric1Val || '8+';
    const activeMetric1Label = metric1Label || 'Años Exp.';
    const activeMetric2Val = metric2Val || '20K+';
    const activeMetric2Label = metric2Label || 'Cortes Realizados';
    const activeMetric3Val = metric3Val || '4';
    const activeMetric3Label = metric3Label || 'Master Barberos';
    const activeMetric4Val = metric4Val || '4.9';
    const activeMetric4Label = metric4Label || 'Calificación';

    html = html
      .split('{{BUSINESS_NAME}}').join(businessName)
      .split('{{BUSINESS_NAME_URI}}').join(encodeURIComponent(businessName))
      .split('{{CITY}}').join(city)
      .split('{{CITY_URI}}').join(encodeURIComponent(city))
      .split('{{PHONE_WHATSAPP}}').join(cleanPhone)
      .split('{{PHONE_DISPLAY}}').join(phoneDisplay)
      .split('{{ADDRESS}}').join(address)
      .split('{{SLUG}}').join(slug)
      .split('{{PRIMARY_COLOR}}').join(primaryColor || '#e5a854')
      .split('{{HERO_IMAGE_DESKTOP}}').join(activeDesktopHero)
      .split('{{HERO_IMAGE_MOBILE}}').join(activeMobileHero)
      .split('{{ABOUT_IMAGE_URL}}').join(activeAboutImage)
      .split('{{HEADLINE}}').join(activeHeadline)
      .split('{{SUBHEADLINE}}').join(activeSubheadline)
      .split('{{HERO_BADGE}}').join(activeBadge)
      .split('{{ABOUT_TITLE}}').join(activeAboutTitle)
      .split('{{ABOUT_DESCRIPTION}}').join(activeAboutDescription)
      .split('{{METRIC_1_VAL}}').join(activeMetric1Val)
      .split('{{METRIC_1_LABEL}}').join(activeMetric1Label)
      .split('{{METRIC_2_VAL}}').join(activeMetric2Val)
      .split('{{METRIC_2_LABEL}}').join(activeMetric2Label)
      .split('{{METRIC_3_VAL}}').join(activeMetric3Val)
      .split('{{METRIC_3_LABEL}}').join(activeMetric3Label)
      .split('{{METRIC_4_VAL}}').join(activeMetric4Val)
      .split('{{METRIC_4_LABEL}}').join(activeMetric4Label)
      .split('{{SCHEDULE_TEXT}}').join(scheduleText || 'Lunes a Sábado: 8:30 AM – 8:30 PM')
      .split('{{MAP_QUERY}}').join(activeMapQuery)
      .split('{{SERVICES_GRID}}').join(servicesCardsHtml)
      .split('{{TEAM_GRID}}').join(teamCardsHtml);

    if (aboutImageUrl) {
      html = html.replace(/(<div class="salon-image-showcase">[\s\S]*?<img\s+src=")[^"]*(")/i, `$1${aboutImageUrl}$2`);
    }

    const effectiveBarberColor = (primaryColor && primaryColor !== '#d92672' && primaryColor !== '#c82d5a')
      ? primaryColor
      : '#e5a854';

    if (effectiveBarberColor && effectiveBarberColor !== '#e5a854') {
      const colorOverride = `
  <style id="custom-theme-color-preview">
    :root {
      --amber-gold: ${effectiveBarberColor} !important;
      --amber-gold-hover: ${effectiveBarberColor} !important;
      --gold-subtle: ${effectiveBarberColor}26 !important;
      --border-gold: ${effectiveBarberColor}40 !important;
      --shadow-gold: 0 10px 24px ${effectiveBarberColor}40 !important;
      --color-accent: ${effectiveBarberColor} !important;
      --accent-gold: ${effectiveBarberColor} !important;
      --color-gold: ${effectiveBarberColor} !important;
    }
    .btn-header-cta,
    .btn-legend-gold,
    .btn-card-book,
    .btn-team-book,
    .btn-footer-reserve,
    .experience-floating-badge {
      background: ${effectiveBarberColor} !important;
      border-color: ${effectiveBarberColor} !important;
      color: #ffffff !important;
    }
    .nav-link.active::after,
    .brand-name span,
    .section-title-display span.text-gold,
    .hero-title span.accent-gold,
    .eyebrow-gold,
    .eyebrow-pill,
    .brand-subtitle,
    .benefit-icon-ring,
    .service-price-val,
    .metric-item strong,
    .team-role {
      color: ${primaryColor} !important;
    }
  </style>`;
      html = html.replace('</head>', `${colorOverride}\n</head>`);
    }

    return html;
  }

  // 2. =========================================================================
  // RAMA 2: SALÓN FEMENINO & COLORIMETRÍA (plantillaSalonFemenino.ts)
  // =========================================================================
  if (cat.includes('salon') || cat.includes('peluqueria') || cat.includes('color') || cat.includes('balayage') || cat.includes('femenin') || params.visualTemplateId === 'salon-femenino-colorimetria' || params.visualTemplateId === 'ruby-velvet' || params.visualTemplateId === 'monochrome-minimal') {
    let html = PLANTILLA_SALON_FEMENINO_HTML;

    // Servicios a renderizar: catálogo oficial o personalizado del salón
    const rawServices = (services && services.length > 0) ? services : PLANTILLA_SALON_FEMENINO_SERVICES;
    const effectiveServices = rawServices.slice(0, 8);

    const servicesCardsHtml = effectiveServices.map((s) => {
      const saasBookingUrl = `/reservar/${slug}?service=${encodeURIComponent(s.titulo)}`;
      const priceText = `$${s.precio_cop.toLocaleString('es-CO')}`;
      const tagText = s.etiqueta || s.categoria || 'SERVICIO EXCLUSIVO';

      return `
        <!-- Servicio Card -->
        <article class="service-card">
          <div class="service-card-img">
            <img src="${s.imagen_url}" alt="${s.titulo}" loading="lazy" />
          </div>
          <div class="service-card-gradient"></div>
          <div class="service-card-content">
            <span class="service-card-tag">${tagText}</span>
            <h3 class="service-card-title">${s.titulo}</h3>
            <div class="service-card-footer">
              <div class="service-card-price">${priceText}</div>
              <a href="${saasBookingUrl}" class="btn-card-book-minimal">
                Agendar <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </article>`;
    }).join('\n');

    const activeDesktopHero = heroImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792079931885_Stylist_blow-drying_client_hair_2K_20261015104423.webp';
    const activeMobileHero = heroMobileImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792083289211_Stylist_cutting_client_hair_20261015115430.webp';
    const activeAboutImage = aboutImageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';

    const activeHeadline = headline || `Donde Tu Belleza Encuentra Su <em>Máxima Expresión.</em>`;
    const activeSubheadline = subheadline || `Balayage de autor, alisados orgánicos, tratamientos faciales Dermo Glow y estética integral en ${city}.`;
    const activeBadge = heroBadge || `Sanctuary of Beauty`;

    const activeAboutTitle = aboutTitle || `Un Espacio Exclusivo Pensado <em>Para Ti.</em>`;
    const activeAboutDescription = aboutDescription || (params.aboutP1 ? `${params.aboutP1} ${params.aboutP2 || ''}`.trim() : `En ${businessName} fusionamos las últimas tendencias en estética capilar, colorimetría avanzada y cuidado facial con un servicio cálido e individualizado para potenciar tu brillo natural en ${city}.`);
    const activeMetric1Val = metric1Val || '+8 Años';
    const activeMetric1Label = metric1Label || 'Experiencia Profesional';
    const activeMetric2Val = metric2Val || '4.8K+';
    const activeMetric2Label = metric2Label || 'Clientas Felices';
    const activeMetric3Val = metric3Val || '100%';
    const activeMetric3Label = metric3Label || 'Productos Biocompatibles';
    const activeMetric4Val = metric4Val || '5.0 ★';
    const activeMetric4Label = metric4Label || 'Calificación Excelente';

    // Especialistas / Profesionales Salón Femenino a renderizar
    const rawTeam = (team && team.length > 0) ? team : PLANTILLA_SALON_FEMENINO_TEAM;
    const teamCardsHtml = rawTeam.map((member: any) => {
      const memberName = member.name || member.nombre || 'Master Stylist';
      const memberRole = member.specialty || member.cargo || member.rol || 'Estilista Profesional';
      const memberPhoto = member.photo_url || member.foto_url || member.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
      const memberRating = member.rating || member.calificacion || 5.0;
      const bookingUrl = `/reservar/${slug}?specialist=${encodeURIComponent(memberName)}`;

      return `
          <!-- Profesional Card -->
          <article class="team-card">
            <div class="team-card-img">
              <img src="${memberPhoto}" alt="${memberName}" loading="lazy">
            </div>
            <div class="team-card-gradient"></div>
            <div class="team-card-content">
              <div class="team-card-accent-line"></div>
              <h3 class="team-name">${memberName}</h3>
              <p class="team-role">${memberRole}</p>
              <div class="team-rating">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                <span style="color: var(--text-secondary); margin-left: 4px;">(${Number(memberRating).toFixed(1)})</span>
              </div>
              <a href="${bookingUrl}" class="btn-card-book-minimal">
                Agendar con ${memberName.split(' ')[0]} <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </article>`;
    }).join('\n');

    html = html
      .split('{{BUSINESS_NAME}}').join(businessName)
      .split('{{BUSINESS_NAME_URI}}').join(encodeURIComponent(businessName))
      .split('{{CITY}}').join(city)
      .split('{{CITY_URI}}').join(encodeURIComponent(city))
      .split('{{PHONE_WHATSAPP}}').join(cleanPhone)
      .split('{{PHONE_DISPLAY}}').join(phoneDisplay)
      .split('{{ADDRESS}}').join(address)
      .split('{{ADDRESS_URI}}').join(encodeURIComponent(address))
      .split('{{SLUG}}').join(slug)
      .split('{{PRIMARY_COLOR}}').join(primaryColor || '#cbb39c')
      .split('{{HERO_IMAGE_DESKTOP}}').join(activeDesktopHero)
      .split('{{HERO_IMAGE_MOBILE}}').join(activeMobileHero)
      .split('{{ABOUT_IMAGE_URL}}').join(activeAboutImage)
      .split('{{HEADLINE}}').join(activeHeadline)
      .split('{{SUBHEADLINE}}').join(activeSubheadline)
      .split('{{HERO_BADGE}}').join(activeBadge)
      .split('{{ABOUT_TITLE}}').join(activeAboutTitle)
      .split('{{ABOUT_DESCRIPTION}}').join(activeAboutDescription)
      .split('{{METRIC_1_VAL}}').join(activeMetric1Val)
      .split('{{METRIC_1_LABEL}}').join(activeMetric1Label)
      .split('{{METRIC_2_VAL}}').join(activeMetric2Val)
      .split('{{METRIC_2_LABEL}}').join(activeMetric2Label)
      .split('{{METRIC_3_VAL}}').join(activeMetric3Val)
      .split('{{METRIC_3_LABEL}}').join(activeMetric3Label)
      .split('{{METRIC_4_VAL}}').join(activeMetric4Val)
      .split('{{METRIC_4_LABEL}}').join(activeMetric4Label)
      .split('{{SCHEDULE_TEXT}}').join(scheduleText || 'Lunes a Sábado: 8:00 AM – 7:00 PM')
      .split('{{MAP_QUERY}}').join(activeMapQuery)
      .split('{{SERVICES_GRID}}').join(servicesCardsHtml)
      .split('{{TEAM_GRID}}').join(teamCardsHtml);

    if (primaryColor) {
      const colorOverride = `
  <style id="custom-theme-color-preview">
    :root {
      --color-accent: ${primaryColor} !important;
      --color-accent-hover: ${primaryColor} !important;
      --color-accent-glow: ${primaryColor}38 !important;
      --border-accent: ${primaryColor}55 !important;
    }
    .btn-primary,
    .btn-header-cta {
      background: ${primaryColor} !important;
      color: #ffffff !important;
    }
    .section-script-eyebrow,
    .hero-script-tag,
    .brand-subtitle,
    .metric-number,
    .service-card-price,
    .service-card-tag,
    .team-role,
    .info-icon,
    .pillar-icon-box,
    .nav-links a:hover,
    .btn-hero-minimal-link:hover,
    .btn-card-book-minimal:hover {
      color: ${primaryColor} !important;
    }
    .section-title em,
    .hero-title em {
      color: ${primaryColor} !important;
    }
  </style>`;
      html = html.replace('</head>', `${colorOverride}\n</head>`);
    }

    return html;
  }

  // 3. =========================================================================
  // RAMA 3: NAIL STUDIO, UÑAS & SPA (plantillaNails.ts - Plantilla Base 3: Rose Gold & Blush)
  // =========================================================================
  if (cat.includes('unas') || cat.includes('uñas') || cat.includes('nail') || cat.includes('manicura') || cat.includes('pedicura') || params.visualTemplateId === 'rose-gold-blush' || params.visualTemplateId === 'caramel-mocca') {
    let html = PLANTILLA_NAILS_HTML;

    // Servicios a renderizar: catálogo oficial o personalizado de Nails
    const rawServices = (services && services.length > 0) ? services : PLANTILLA_NAILS_SERVICES;
    const effectiveServices = rawServices.slice(0, 8);

    const servicesCardsHtml = effectiveServices.map((s) => {
      const saasBookingUrl = `/reservar/${slug}?service=${encodeURIComponent(s.titulo)}`;
      const priceText = `$${s.precio_cop.toLocaleString('es-CO')}`;

      return `
        <!-- Servicio Card -->
        <article class="service-card">
          <img src="${s.imagen_url}" alt="${s.titulo}" class="service-card-img" loading="lazy">
          <div class="service-card-overlay"></div>
          <div class="service-card-content">
            <div class="service-card-accent-line"></div>
            <h3 class="service-card-title">${s.titulo}</h3>
            <p class="service-card-desc">${s.descripcion}</p>
            <div class="service-card-footer">
              <span class="service-card-price">${priceText}</span>
              <a href="${saasBookingUrl}" class="btn-card-book-minimal">
                AGENDAR <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </article>`;
    }).join('\n');

    const activeDesktopHero = heroImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp';
    const activeMobileHero = heroMobileImage || 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792160934258_Complete_image_leaving_lower_third_20261016092835.webp';
    const activeAboutImage = aboutImageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80';

    const activeHeadline = headline || `El diseño y la elegancia<br><em>que tus manos merecen en ${city}.</em>`;
    const activeSubheadline = subheadline || `Manicura rusa, extensiones acrílicas esculpidas, kapping nivelador y spa de pedicura con acabados impecables en ${city}.`;
    const activeBadge = heroBadge || `Nail Spa &amp; Esthetic`;

    const activeAboutTitle = aboutTitle || `El Arte de Cuidar<br><em>Tus Manos y Pies.</em>`;
    const activeAboutDescription = aboutDescription || `En ${businessName} entendemos las uñas como una extensión de tu elegancia y personalidad. Combinamos técnicas europeas de manicura rusa con productos biocompatibles de máxima durabilidad en ${city}.`;
    const activeMetric1Val = metric1Val || '+7 Años';
    const activeMetric1Label = metric1Label || 'Experiencia';
    const activeMetric2Val = metric2Val || '5.2K+';
    const activeMetric2Label = metric2Label || 'Sets Realizados';
    const activeMetric3Val = metric3Val || '100%';
    const activeMetric3Label = metric3Label || 'Bioseguridad';
    const activeMetric4Val = metric4Val || '5.0 ★';
    const activeMetric4Label = metric4Label || 'Calificación';

    
    // Especialistas / Artistas Nails a renderizar
    const rawTeam = (team && team.length > 0) ? team : PLANTILLA_NAILS_TEAM;
    const teamCardsHtml = rawTeam.map((member: any) => {
      const memberName = member.name || member.nombre || 'Master Nail Artist';
      const memberRole = member.specialty || member.cargo || member.rol || 'Especialista en Uñas';
      const memberPhoto = member.photo_url || member.foto_url || member.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80';
      const memberRating = member.rating || member.calificacion || 5.0;
      const bookingUrl = `/reservar/${slug}?specialist=${encodeURIComponent(memberName)}`;

      return `
            <div class="team-card">
              <img src="${memberPhoto}" alt="${memberName}" class="team-card-img" loading="lazy">
              <div class="team-card-overlay"></div>
              <div class="team-card-content">
                <div class="team-card-accent-line"></div>
                <h3 class="team-name">${memberName}</h3>
                <span class="team-role">${memberRole}</span>
                <div class="team-rating">
                  ★★★★★ <span>${Number(memberRating).toFixed(1)}</span>
                </div>
                <div class="team-card-footer">
                  <a href="${bookingUrl}" class="btn-card-book-minimal">
                    AGENDAR CON ${memberName.split(' ')[0].toUpperCase()} <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>`;
    }).join('\n');

    html = html
      .split('{{BUSINESS_NAME}}').join(businessName)
      .split('{{BUSINESS_NAME_URI}}').join(encodeURIComponent(businessName))
      .split('{{CITY}}').join(city)
      .split('{{CITY_URI}}').join(encodeURIComponent(city))
      .split('{{PHONE_WHATSAPP}}').join(cleanPhone)
      .split('{{PHONE_DISPLAY}}').join(phoneDisplay)
      .split('{{ADDRESS}}').join(address)
      .split('{{SLUG}}').join(slug)
      .split('{{PRIMARY_COLOR}}').join(primaryColor || '#d87d7d')
      .split('{{MAP_QUERY}}').join(activeMapQuery)
      .split('{{ADDRESS_URI}}').join(encodeURIComponent(address))
      .split('{{HERO_IMAGE_DESKTOP}}').join(activeDesktopHero)
      .split('{{HERO_IMAGE_MOBILE}}').join(activeMobileHero)
      .split('{{ABOUT_IMAGE_URL}}').join(activeAboutImage)
      .split('{{HEADLINE}}').join(activeHeadline)
      .split('{{SUBHEADLINE}}').join(activeSubheadline)
      .split('{{HERO_BADGE}}').join(activeBadge)
      .split('{{ABOUT_TITLE}}').join(activeAboutTitle)
      .split('{{ABOUT_DESCRIPTION}}').join(activeAboutDescription)
      .split('{{METRIC_1_VAL}}').join(activeMetric1Val)
      .split('{{METRIC_1_LABEL}}').join(activeMetric1Label)
      .split('{{METRIC_2_VAL}}').join(activeMetric2Val)
      .split('{{METRIC_2_LABEL}}').join(activeMetric2Label)
      .split('{{METRIC_3_VAL}}').join(activeMetric3Val)
      .split('{{METRIC_3_LABEL}}').join(activeMetric3Label)
      .split('{{METRIC_4_VAL}}').join(activeMetric4Val)
      .split('{{METRIC_4_LABEL}}').join(activeMetric4Label)
      .split('{{SCHEDULE_TEXT}}').join(scheduleText || 'Lunes a Sábado: 8:00 AM – 7:00 PM')
      .split('{{SERVICES_GRID}}').join(servicesCardsHtml)
      .split('{{TEAM_GRID}}').join(teamCardsHtml);

    if (primaryColor) {
      const colorOverride = `
  <style id="custom-theme-color-preview">
    :root {
      --color-accent: ${primaryColor} !important;
      --color-accent-hover: ${primaryColor} !important;
      --color-accent-soft: ${primaryColor}24 !important;
    }
    .btn-hero-primary,
    .btn-primary-glow,
    .btn-footer-reserve,
    .btn-header-cta {
      background: ${primaryColor} !important;
      color: #ffffff !important;
    }
    .hero-script-tag,
    .service-card-price,
    .btn-card-book-minimal,
    .nav-link:hover,
    .service-card-accent-line {
      color: ${primaryColor} !important;
      border-color: ${primaryColor} !important;
    }
  </style>`;
      html = html.replace('</head>', `${colorOverride}\n</head>`);
    }

    return html;
  }

  // 4. =========================================================================
  // RAMA 4: SPA, FACIALES, BIENESTAR & ESTÉTICA (milena_gomez_salon_standalone.html / sanus_spa)
  // =========================================================================
  let html = MILENA_GOMEZ_SITE_DATA.raw_html;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${businessName} | Centro de Estética & Spa en ${city}</title>`);
  html = html.split('Milena Gómez salon').join(businessName);
  html = html.split('Milena Gómez').join(businessName);
  html = html.split('milena-gomez-salon').join(slug);
  html = html.split('/reservar/milena-gomez-salon').join(`/reservar/${slug}`);
  html = html.split('573128867937').join(cleanPhone);
  if (address) html = html.split('Cl. 101 #97/56').join(address);
  if (city) html = html.split('Apartadó').join(city);

  return html;
}
