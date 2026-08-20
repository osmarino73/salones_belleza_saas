(() => {
  'use strict';

  const ROOT_ID = 'mrp-root';
  const BADGE_CLASS = 'mrp-badge';
  const STORAGE_KEY = 'prospects';

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function clean(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  function isGoogleInternal(href) {
    try {
      const u = new URL(href, location.href);
      return /(^|\.)google\./i.test(u.hostname) && (/\/maps/i.test(u.pathname) || /\/search/i.test(u.pathname));
    } catch { return true; }
  }

  function cleanAddress(raw) {
    if (!raw) return '';
    let a = clean(raw);
    // Eliminar estados pegados como "Abierto", "Cerrado", "Cierra a las...", "Open", "Closed"
    a = a.replace(/\s*(Abierto|Cerrado|Cierra|Abre|Open|Closed)[\s\S]*$/i, '').trim();
    // Eliminar prefijos de Google Maps
    a = a.replace(/^(Dirección|Address):\s*/i, '').trim();
    return a;
  }

  // =========================================================================
  // 1. EXTRACTORES DE PANELES DE DETALLE (LUGAR INDIVIDUAL ABIERTO)
  // =========================================================================

  function isPlaceDetailOpen() {
    return !!(
      document.querySelector('h1.DUwDvf, button[data-item-id="address"], button[data-item-id*="phone"]') ||
      (window.location.href.includes('/maps/place/') && !window.location.href.includes('/place//'))
    );
  }

  function extractPlaceNameFromDOM() {
    // 1. Selector exclusivo de Google Maps para el título del negocio abierto
    const placeH1 = document.querySelector('h1.DUwDvf, div.TIHn2 h1, div.lMbq3e h1, div.bJzEAu h1, div[role="region"] h1.DUwDvf');
    if (placeH1) {
      const txt = clean(placeH1.textContent);
      if (txt && !/^resultados\b/i.test(txt)) {
        return txt;
      }
    }

    // 2. Buscar en todos los H1 del documento excluyendo la palabra "Resultados"
    const allH1 = document.querySelectorAll('h1');
    for (const h1 of allH1) {
      const txt = clean(h1.textContent);
      if (txt && !/^resultados\b/i.test(txt) && !/^filtros\b/i.test(txt) && txt.length > 1) {
        return txt;
      }
    }

    // 3. Fallback: Parsear nombre desde la URL de Google Maps
    // Ej: https://www.google.com/maps/place/Kapa+Spa/@... -> "Kapa Spa"
    const urlMatch = window.location.href.match(/\/maps\/place\/([^/@?]+)/i);
    if (urlMatch && urlMatch[1]) {
      const decoded = decodeURIComponent(urlMatch[1].replace(/\+/g, ' ')).trim();
      if (decoded && !/^resultados\b/i.test(decoded)) {
        return decoded;
      }
    }

    // 4. Etiqueta aria-label del panel de lugar
    const regionEl = document.querySelector('div[role="region"][aria-label], div[role="main"][aria-label]');
    if (regionEl) {
      const aria = clean(regionEl.getAttribute('aria-label'));
      if (aria && !/^resultados\b/i.test(aria) && !/^google\b/i.test(aria)) {
        return aria.replace(/\s*-\s*Google Maps.*$/i, '').trim();
      }
    }

    return '';
  }

  function extractSinglePlaceFromDOM() {
    const name = extractPlaceNameFromDOM();
    if (!name) return null;

    // 2. Categoría (Buscar en botones de categoría del panel)
    let category = '';
    const catEl = document.querySelector('button.DkEaL, button[jsaction*="category"], span.YhemCb, [jsaction*="pane.rating.category"], div.LBgpqf button');
    if (catEl) {
      category = clean(catEl.textContent);
    }

    // 3. Calificación y Reseñas
    let rating = '';
    let reviews = '';

    const ratingEl = document.querySelector('div.F7nice span[aria-hidden="true"], span.ceNzKf, div.fontDisplayLarge');
    if (ratingEl) {
      const rTxt = clean(ratingEl.textContent).replace(',', '.');
      if (/^\d[.,]\d$/.test(rTxt) || /^\d$/.test(rTxt)) rating = rTxt;
    }

    const reviewsEl = document.querySelector('div.F7nice span:last-child, button[jsaction*="pane.rating.moreReviews"], button[aria-label*="reseñas" i], button[aria-label*="reviews" i]');
    if (reviewsEl) {
      const match = (reviewsEl.textContent || reviewsEl.getAttribute('aria-label') || '').match(/\b\d+[\d.,]*\b/);
      if (match) reviews = match[0].replace(/[.,]/g, '');
    }

    // 4. Dirección (Buscar directamente en todo el documento)
    let address = '';
    const addressBtn = document.querySelector(
      'button[data-item-id="address"] div.Io6YTe, button[data-item-id="address"], [data-item-id="address"] div.Io6YTe, button[aria-label*="Dirección:"] div.Io6YTe, button[aria-label*="Address:"] div.Io6YTe'
    );
    if (addressBtn) {
      address = clean(addressBtn.getAttribute('aria-label')?.replace(/^(Dirección|Address):\s*/i, '') || addressBtn.textContent);
    }

    // 5. Horario
    let schedule = '';
    const scheduleBtn = document.querySelector(
      'button[data-item-id="oh"] div.Io6YTe, button[data-item-id="oh"], [data-item-id="oh"] div.Io6YTe, button[aria-label*="Horario"] div.Io6YTe'
    );
    if (scheduleBtn) {
      schedule = clean(scheduleBtn.textContent);
    }

    // 6. Teléfono
    let phone = '';
    const phoneBtn = document.querySelector(
      'button[data-item-id*="phone"] div.Io6YTe, button[data-item-id*="phone"], [data-item-id*="phone"] div.Io6YTe, button[aria-label*="Teléfono:"] div.Io6YTe, a[href^="tel:"]'
    );
    if (phoneBtn) {
      if (phoneBtn.tagName?.toLowerCase() === 'a' && phoneBtn.href?.startsWith('tel:')) {
        phone = clean(phoneBtn.href.replace('tel:', ''));
      } else {
        phone = clean(phoneBtn.getAttribute('aria-label')?.replace(/^(Teléfono|Phone):\s*/i, '') || phoneBtn.textContent);
      }
    }

    // 7. Plus Code / Ciudad auxiliar
    let plusCode = '';
    const plusCodeBtn = document.querySelector(
      'button[data-item-id="oloc"] div.Io6YTe, button[data-item-id="oloc"], [data-item-id="oloc"] div.Io6YTe'
    );
    if (plusCodeBtn) {
      plusCode = clean(plusCodeBtn.textContent);
    }

    // 8. Sitio Web
    let website = '';
    const webBtn = document.querySelector('a[data-item-id="authority"], a[aria-label*="Sitio web" i], a[aria-label*="Website" i]');
    if (webBtn?.href && !isGoogleInternal(webBtn.href)) {
      website = webBtn.href;
    }

    // 9. URL Google Maps
    const googleMapsUrl = window.location.href.split('?')[0];

    // Limpieza
    address = cleanAddress(address);

    return {
      name,
      category,
      rating: rating || '5.0',
      reviews: reviews || '1',
      phone,
      address,
      schedule,
      plusCode,
      website,
      googleMapsUrl
    };
  }

  // =========================================================================
  // 2. EXTRACTORES DE TARJETAS DE BÚSQUEDA (FEED DE LISTA)
  // =========================================================================

  function extractName(card) {
    const headline = card.querySelector('.qBF1Pd, .fontHeadlineSmall, [role="heading"]');
    if (headline) {
      const txt = clean(headline.textContent);
      if (txt && !/^resultados\b/i.test(txt)) return txt;
    }
    const link = card.querySelector('a.hfpxzc, a[href*="/maps/place/"]');
    if (link) {
      const aria = clean(link.getAttribute('aria-label'));
      if (aria && !/^resultados\b/i.test(aria)) return aria.replace(/\s*-\s*Google Maps.*$/i, '').trim();
      const text = clean(link.textContent);
      if (text && !/^resultados\b/i.test(text)) return text.split('\n')[0].trim();
    }
    return '';
  }

  function extractGoogleMapsUrl(card) {
    const link = card.querySelector('a.hfpxzc, a[href*="/maps/place/"], a[href*="maps.google."]');
    if (link?.href) {
      return link.href.split('&')[0];
    }
    if (window.location.href.includes('/maps/place/')) {
      return window.location.href.split('?')[0];
    }
    return '';
  }

  function extractWebsite(card) {
    const preferred = card.querySelector('a[data-value="Sitio web"], a[data-item-id="authority"][href], a[aria-label*="Sitio web" i][href], a[aria-label*="Website" i][href]');
    if (preferred?.href && !isGoogleInternal(preferred.href)) return preferred.href;

    for (const a of card.querySelectorAll('a[href]')) {
      const href = a.href;
      const label = `${a.getAttribute('aria-label') || ''} ${a.textContent || ''}`.toLowerCase();
      if (!href || isGoogleInternal(href)) continue;
      if (label.includes('website') || label.includes('sitio web') || a.classList.contains('lcr4fd')) return href;
    }
    return '';
  }

  function extractRatingAndReviews(card) {
    let rating = '';
    let reviews = '';

    const ratingEl = card.querySelector('span.MW4etd, span[aria-hidden="true"]');
    if (ratingEl) {
      const txt = clean(ratingEl.textContent);
      if (/^\d[.,]\d$/.test(txt)) rating = txt.replace(',', '.');
    }

    const reviewsEl = card.querySelector('span.UY7F9, span[aria-label*="reseñas" i], span[aria-label*="reviews" i]');
    if (reviewsEl) {
      const match = (reviewsEl.textContent || '').match(/\b\d+[\d.,]*\b/);
      if (match) reviews = match[0].replace(/[.,]/g, '');
    }

    if (!rating || !reviews) {
      const allText = card.textContent || '';
      const comboMatch = allText.match(/(\d[.,]\d)\s*\(\s*(\d+[\d.,]*)\s*\)/);
      if (comboMatch) {
        if (!rating) rating = comboMatch[1].replace(',', '.');
        if (!reviews) reviews = comboMatch[2].replace(/[.,]/g, '');
      }
    }

    return { rating: rating || '5.0', reviews: reviews || '1' };
  }

  function extractAddressAndPhone(card) {
    let address = '';
    let phone = '';
    let category = '';

    const addressBtn = card.querySelector('button[data-item-id="address"], [aria-label*="Dirección:" i]');
    if (addressBtn) {
      address = clean(addressBtn.getAttribute('aria-label')?.replace(/^(Dirección|Address):\s*/i, '') || addressBtn.textContent);
    }

    const phoneBtn = card.querySelector('button[data-item-id*="phone"], a[href^="tel:"], [aria-label*="Teléfono:" i]');
    if (phoneBtn) {
      if (phoneBtn.tagName?.toLowerCase() === 'a' && phoneBtn.href?.startsWith('tel:')) {
        phone = clean(phoneBtn.href.replace('tel:', ''));
      } else {
        phone = clean(phoneBtn.getAttribute('aria-label')?.replace(/^(Teléfono|Phone):\s*/i, '') || phoneBtn.textContent);
      }
    }

    const textContainers = card.querySelectorAll('div.W4Efsd, .fontBodyMedium');
    const rawLines = [];

    textContainers.forEach(el => {
      const txt = clean(el.innerText || el.textContent);
      if (txt && !rawLines.includes(txt)) {
        rawLines.push(txt);
      }
    });

    const addressKeywordsRegex = /\b(calle|cl\.?|carrera|cra\.?|cr\.?|av\.?|avenida|diagonal|diag\.?|transversal|tv\.?|circunvalar|manzana|mz\.?|barrio|piso|local|autopista|km|apartad[oó]|medell[ií]n|bogot[aá]|cali|barranquilla|cartagena|pereira|bucaramanga|colombia|#|n°|no\.|\d{1,5}\s*#|\d{2,}\s*-\s*\d+)/i;
    const phoneRegex = /(?:\+?57\s?)?(?:3\d{2}[\s.-]?\d{3,4}[\s.-]?\d{3,4}|(?:60\d|\(?0\d{1,2}\)?|\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}|\b3\d{9}\b)/;

    for (const line of rawLines) {
      if (!phone) {
        const phoneMatch = line.match(phoneRegex);
        if (phoneMatch && !phoneMatch[0].includes('6 p. m.') && !phoneMatch[0].includes('12:')) {
          phone = clean(phoneMatch[0]);
        }
      }

      const parts = line.split(/[·•\n]/).map(p => clean(p)).filter(Boolean);

      for (let i = 0; i < parts.length; i++) {
        let part = parts[i];

        if (/^(abierto|cerrado|cierra|abre|open|closed|horario|24 horas)/i.test(part)) {
          continue;
        }

        if (/^"[^"]+"$/.test(part) || /^\d[.,]\d\s*\(\d+\)/.test(part)) {
          continue;
        }

        if (!address && addressKeywordsRegex.test(part)) {
          address = cleanAddress(part);
          if (i > 0 && !category && !addressKeywordsRegex.test(parts[i - 1])) {
            category = parts[i - 1];
          }
        } else if (!category && !address && part.length < 40 && !/\d/.test(part)) {
          category = part;
        }
      }
    }

    address = cleanAddress(address);
    return { address, phone, category };
  }

  // =========================================================================
  // 3. PARSEO DE CIUDAD, DEPARTAMENTO Y TELÉFONO
  // =========================================================================

  function parseLocation(addressText, plusCodeText = '') {
    const raw = `${addressText || ''} ${plusCodeText || ''}`.trim();
    let ciudad = 'Medellín';
    let departamento_pais = 'Antioquia, Colombia';

    // 1. Detección por partes separadas por coma (ej: "Cra. 92 #97-10, Apartadó, Antioquia")
    if (addressText && addressText.includes(',')) {
      const parts = addressText.split(',').map(s => clean(s)).filter(Boolean);
      if (parts.length >= 3) {
        ciudad = parts[1];
        departamento_pais = `${parts[2]}, Colombia`;
        return { ciudad, departamento_pais };
      } else if (parts.length === 2) {
        if (/antioquia|cundinamarca|valle|atlantico|bolivar|santander|risaralda|caldas/i.test(parts[1])) {
          ciudad = parts[0];
          departamento_pais = `${parts[1]}, Colombia`;
          return { ciudad, departamento_pais };
        } else {
          ciudad = parts[1];
          departamento_pais = 'Colombia';
          return { ciudad, departamento_pais };
        }
      }
    }

    // 2. Detección por palabras clave en dirección o plus code
    const lower = raw.toLowerCase();
    const cityMap = [
      { key: 'apartad', city: 'Apartadó', dept: 'Antioquia, Colombia' },
      { key: 'turbo', city: 'Turbo', dept: 'Antioquia, Colombia' },
      { key: 'carepa', city: 'Carepa', dept: 'Antioquia, Colombia' },
      { key: 'chigorod', city: 'Chigorodó', dept: 'Antioquia, Colombia' },
      { key: 'medell', city: 'Medellín', dept: 'Antioquia, Colombia' },
      { key: 'envigado', city: 'Envigado', dept: 'Antioquia, Colombia' },
      { key: 'itagui', city: 'Itagüí', dept: 'Antioquia, Colombia' },
      { key: 'itagüí', city: 'Itagüí', dept: 'Antioquia, Colombia' },
      { key: 'sabaneta', city: 'Sabaneta', dept: 'Antioquia, Colombia' },
      { key: 'bello', city: 'Bello', dept: 'Antioquia, Colombia' },
      { key: 'rionegro', city: 'Rionegro', dept: 'Antioquia, Colombia' },
      { key: 'bogot', city: 'Bogotá', dept: 'Cundinamarca, Colombia' },
      { key: 'cali', city: 'Cali', dept: 'Valle del Cauca, Colombia' },
      { key: 'barranquilla', city: 'Barranquilla', dept: 'Atlántico, Colombia' },
      { key: 'cartagena', city: 'Cartagena', dept: 'Bolívar, Colombia' },
      { key: 'bucaramanga', city: 'Bucaramanga', dept: 'Santander, Colombia' },
      { key: 'pereira', city: 'Pereira', dept: 'Risaralda, Colombia' },
      { key: 'manizales', city: 'Manizales', dept: 'Caldas, Colombia' },
      { key: 'armenia', city: 'Armenia', dept: 'Quindío, Colombia' },
      { key: 'santa marta', city: 'Santa Marta', dept: 'Magdalena, Colombia' },
      { key: 'monteria', city: 'Montería', dept: 'Córdoba, Colombia' },
      { key: 'montería', city: 'Montería', dept: 'Córdoba, Colombia' },
      { key: 'cucuta', city: 'Cúcuta', dept: 'Norte de Santander, Colombia' },
      { key: 'cúcuta', city: 'Cúcuta', dept: 'Norte de Santander, Colombia' },
      { key: 'ibague', city: 'Ibagué', dept: 'Tolima, Colombia' },
      { key: 'ibagué', city: 'Ibagué', dept: 'Tolima, Colombia' },
      { key: 'villavicencio', city: 'Villavicencio', dept: 'Meta, Colombia' }
    ];

    for (const item of cityMap) {
      if (lower.includes(item.key)) {
        return { ciudad: item.city, departamento_pais: item.dept };
      }
    }

    return { ciudad, departamento_pais };
  }

  function normalizePhone(rawPhone) {
    if (!rawPhone) {
      return {
        formatted: '',
        international: '+573000000000',
        link: 'https://wa.me/573000000000'
      };
    }

    const digits = rawPhone.replace(/\D/g, '');
    let international = '';
    let formatted = rawPhone;

    if (digits.startsWith('57') && digits.length >= 12) {
      international = `+${digits}`;
    } else if (digits.length === 10 && digits.startsWith('3')) {
      international = `+57${digits}`;
      formatted = `(+57) ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length === 10 && digits.startsWith('60')) {
      international = `+57${digits}`;
      formatted = `(+57) ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length === 7) {
      international = `+57604${digits}`;
      formatted = `(604) ${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length > 8) {
      international = `+57${digits}`;
    } else {
      international = `+57${digits || '3000000000'}`;
    }

    const pureDigits = international.replace(/\D/g, '');
    const link = `https://wa.me/${pureDigits}`;

    return {
      formatted: formatted || international,
      international,
      link
    };
  }

  // =========================================================================
  // 4. CATEGORIZACIÓN & GENERADOR DE SERVICIOS / ESPECIALISTAS
  // =========================================================================

  function detectCategoryKey(categoryText, nameText) {
    const combined = `${categoryText || ''} ${nameText || ''}`.toLowerCase();
    if (/dent|odontol|ortodon|sonrisa|implante|dient/i.test(combined)) return 'dental';
    if (/barber|barba|corte\s+caballero|fade|barberia/i.test(combined)) return 'barberia';
    if (/spa|masaje|relaj|sauna|hidroterap|bienestar|holistic/i.test(combined)) return 'spa';
    if (/nail|uña|manicur|pedicur|acrilic|polygel/i.test(combined)) return 'nails';
    if (/ceja|pestaña|brow|lash|microblad|laminad/i.test(combined)) return 'cejas_pestanas';
    if (/est[eé]tic|facial|corporal|dermo|peeling|laser|depila|cosmiatr/i.test(combined)) return 'estetica';
    return 'salon';
  }

  function getRubroName(catKey) {
    const map = {
      salon: 'Salón de Belleza, Peluquería & Colorimetría',
      barberia: 'Barbería & Grooming Masculino VIP',
      spa: 'Spa, Centro de Masajes & Bienestar',
      nails: 'Nails Bar, Manicura Rusa & Pedicura Spa',
      cejas_pestanas: 'Estudio de Cejas, Pestañas & Mirada',
      estetica: 'Centro de Estética Avanzada & Cuidado Facial',
      dental: 'Clínica Odontológica & Estética Dental'
    };
    return map[catKey] || 'Salón de Belleza & Estética Integral';
  }

  function generateSlogan(catKey, name) {
    const map = {
      salon: 'Look & Siente Lo Mejor de Ti con Estilismo de Alta Gama',
      barberia: 'Cortes Clásicos, Barbas Impecables y Estilo de Alto Nivel',
      spa: 'Tu Espacio de Paz, Desconexión y Belleza Holística',
      nails: 'Diseños Exclusivos, Perfección y Cuidado Superior para tus Uñas',
      cejas_pestanas: 'La Mirada que Cautiva con Técnicas de Precisión y Belleza Natural',
      estetica: 'Tecnología y Cuidado Experto para Resaltar tu Belleza Natural',
      dental: 'Tu Mejor Sonrisa con Tecnología de Vanguardia y Atención Humana'
    };
    return map[catKey] || `La Mejor Experiencia de Belleza y Estilo en ${name}`;
  }

  function generateServicesForCategory(catKey) {
    const servicesByCat = {
      salon: [
        { titulo: 'Cortes & Peinados de Vanguardia', descripcion: 'Diseño de corte personalizado, visagismo y cepillado profesional con acabado brillante.', precio_cop: 45000, duracion_minutos: 45 },
        { titulo: 'Colorimetría & Balayage Europeo', descripcion: 'Iluminación, babylights, contouring y reconstrucción capilar profunda con Olaplex.', precio_cop: 180000, duracion_minutos: 120 },
        { titulo: 'Keratina & Alisado Orgánico', descripcion: 'Alisado termoactivo libre de formol con brillo espejo y sedosidad duradera.', precio_cop: 160000, duracion_minutos: 90 },
        { titulo: 'Tratamiento Reparador & Nutrición', descripcion: 'Hidratación intensiva con aminoácidos y sellado de puntas.', precio_cop: 85000, duracion_minutos: 45 }
      ],
      barberia: [
        { titulo: 'Corte Clásico & Degradado (Fade)', descripcion: 'Corte de precisión a tijera y máquina con asesoría de estilo y peinado.', precio_cop: 30000, duracion_minutos: 35 },
        { titulo: 'Ritual de Barba & Toalla Caliente', descripcion: 'Perfilado de barba a navaja, aceites esenciales hidratantes y vapor ozono.', precio_cop: 25000, duracion_minutos: 30 },
        { titulo: 'Combo Caballero VIP (Corte + Barba)', descripcion: 'Experiencia completa de corte, arreglo de barba, toalla caliente y bebida de cortesía.', precio_cop: 50000, duracion_minutos: 55 },
        { titulo: 'Limpieza Facial Express Masculina', descripcion: 'Exfoliación profunda, extracción de impurezas y mascarilla descongestiva.', precio_cop: 35000, duracion_minutos: 30 }
      ],
      spa: [
        { titulo: 'Limpieza Facial Profunda Ultrasónica', descripcion: 'Higiene cutánea con espátula ultrasónica, vapor ozono, peeling suave y fototerapia.', precio_cop: 95000, duracion_minutos: 60 },
        { titulo: 'Masaje Relajante con Piedras Calientes', descripcion: 'Terapia geotermal con aceites aromáticos para aliviar contracturas y estrés.', precio_cop: 120000, duracion_minutos: 60 },
        { titulo: 'Exfoliación Corporal & Chocolaterapia', descripcion: 'Renovación epidérmica completa con envoltura de cacao nutritivo y regadera suiza.', precio_cop: 140000, duracion_minutos: 75 },
        { titulo: 'Circuito Hidroterapia & Jacuzzi', descripcion: 'Sesión de relajación térmica con sauna finlandés y tina de hidromasaje.', precio_cop: 80000, duracion_minutos: 45 }
      ],
      nails: [
        { titulo: 'Manicura Rusa & Semipermanente', descripcion: 'Técnica de cutícula combinada con torno y esmaltado de alta duración (+21 días).', precio_cop: 55000, duracion_minutos: 60 },
        { titulo: 'Pedicura Spa & Exfoliación Podal', descripcion: 'Tratamiento completo con sales marinas, mascarilla hidratante y torno podológico.', precio_cop: 60000, duracion_minutos: 50 },
        { titulo: 'Estructuras en Acrílico / Polygel', descripcion: 'Uñas esculpidas con molde o tips, encapsulados y arquitectura perfecta.', precio_cop: 110000, duracion_minutos: 90 },
        { titulo: 'Diseño Nail Art & Cristales Swarovski', descripcion: 'Mano alzada, baby boomer, efectos cromados y pedrería de lujo.', precio_cop: 30000, duracion_minutos: 30 }
      ],
      cejas_pestanas: [
        { titulo: 'Diseño de Cejas & Henna Brow', descripcion: 'Visagismo con hilo árabe y tintura orgánica con efecto sombreado natural.', precio_cop: 40000, duracion_minutos: 40 },
        { titulo: 'Lifting de Pestañas & Laminado de Cejas', descripcion: 'Elevación y nutrición con keratina para pestañas y cejas peinadas fijas.', precio_cop: 80000, duracion_minutos: 60 },
        { titulo: 'Extensiones Pelo a Pelo / Volumen Ruso', descripcion: 'Colocación milimétrica de fibras premium para una mirada impactante.', precio_cop: 120000, duracion_minutos: 90 },
        { titulo: 'Micropigmentación Microblading VIP', descripcion: 'Diseño pelo a pelo semipermanente con pigmentos hipoalergénicos biocompatibles.', precio_cop: 280000, duracion_minutos: 120 }
      ],
      estetica: [
        { titulo: 'Limpieza Facial Profunda & Hidropeel', descripcion: 'Extracción al vacío, infusión de sueros antioxidantes y máscara LED.', precio_cop: 95000, duracion_minutos: 60 },
        { titulo: 'Radiofrecuencia Facial Anti-Edad', descripcion: 'Estimulación de colágeno y elastina para tensar la piel y definir el óvalo facial.', precio_cop: 130000, duracion_minutos: 60 },
        { titulo: 'Depilación Láser Diodo Zona VIP', descripcion: 'Eliminación definitiva del vello con cabezal frío indoloro de última generación.', precio_cop: 110000, duracion_minutos: 45 },
        { titulo: 'Moldeo Corporal & Drenaje Linfático', descripcion: 'Protocolo reductor con maderoterapia, vacumterapia y drenaje especializado.', precio_cop: 140000, duracion_minutos: 60 }
      ],
      dental: [
        { titulo: 'Limpieza Dental con Ultrasonido & Profilaxis', descripcion: 'Eliminación de sarro, pulido dental y aplicación tópica de flúor preventivo.', precio_cop: 90000, duracion_minutos: 45 },
        { titulo: 'Blanqueamiento Dental LED en Consultorio', descripcion: 'Aclaramiento dental de alta potencia hasta 4 tonos en una sola sesión.', precio_cop: 250000, duracion_minutos: 60 },
        { titulo: 'Diseño de Sonrisa en Resina de Alta Estética', descripcion: 'Carillas directas microhíbridas con armonización dental personalizada.', precio_cop: 650000, duracion_minutos: 90 },
        { titulo: 'Valoración Odontológica & Escáner Digital', descripcion: 'Diagnóstico integral con cámara intraoral y plan de tratamiento detallado.', precio_cop: 50000, duracion_minutos: 30 }
      ]
    };
    return servicesByCat[catKey] || servicesByCat.salon;
  }

  function generateSpecialistsForCategory(catKey) {
    const specialistsByCat = {
      salon: [
        { nombre: 'Emma Styles', rol: 'Master Colorista & Balayage', especialidades: ['color', 'keratina'] },
        { nombre: 'Alex Carter', rol: 'Master Stylist & Cortes', especialidades: ['corte', 'peinado'] },
        { nombre: 'Jessica Moore', rol: 'Especialista en Piel & Keratinas', especialidades: ['keratina', 'spa'] }
      ],
      barberia: [
        { nombre: 'Carlos "Barber" Silva', rol: 'Master Barber & Fade Expert', especialidades: ['corte', 'barba'] },
        { nombre: 'David Miller', rol: 'Especialista en Barba & Ritual Spa', especialidades: ['barba', 'facial'] }
      ],
      spa: [
        { nombre: 'Elena Gómez', rol: 'Terapeuta Holística & Masajes', especialidades: ['masajes', 'corporal'] },
        { nombre: 'Valeria Ríos', rol: 'Cosmiatra & Especialista en Piel', especialidades: ['facial', 'peeling'] }
      ],
      nails: [
        { nombre: 'Mariana Nails', rol: 'Master Educator & Polygel', especialidades: ['acrilico', 'polygel'] },
        { nombre: 'Sofia Díaz', rol: 'Especialista en Manicura Rusa & Nail Art', especialidades: ['semipermanente', 'nailart'] }
      ],
      cejas_pestanas: [
        { nombre: 'Camila Brow', rol: 'Master Artist en Microblading', especialidades: ['cejas', 'microblading'] },
        { nombre: 'Valentina Lashes', rol: 'Especialista en Mirada & Extensiones', especialidades: ['pestañas', 'lifting'] }
      ],
      estetica: [
        { nombre: 'Dra. Marcela Restrepo', rol: 'Médica Estética & Cuidado Dermo-Facial', especialidades: ['facial', 'laser'] },
        { nombre: 'Laura Montoya', rol: 'Cosmiatra & Tecnologías Corporales', especialidades: ['corporal', 'peeling'] }
      ],
      dental: [
        { nombre: 'Dra. Laura Morales', rol: 'Especialista en Estética Dental', especialidades: ['estetica', 'blanqueamiento'] },
        { nombre: 'Dr. Andrés Gómez', rol: 'Ortodoncista & Odontología Integral', especialidades: ['diagnostico', 'profilaxis'] }
      ]
    };
    return specialistsByCat[catKey] || specialistsByCat.salon;
  }

  // =========================================================================
  // 5. CONSTRUCTOR DEL ESQUEMA OFICIAL DATOS_NEGOCIO.json
  // =========================================================================

  function buildBusinessJsonObject(p) {
    const catKey = detectCategoryKey(p.category, p.name);
    const rubro = getRubroName(catKey);
    const eslogan = generateSlogan(catKey, p.name);
    const phoneData = normalizePhone(p.phone);
    const loc = parseLocation(p.address, p.plusCode);
    const services = generateServicesForCategory(catKey);
    const specialists = generateSpecialistsForCategory(catKey);

    const waNumber = phoneData.international.replace(/\D/g, '');
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola ${p.name}, quisiera cotizar una cita.`)}`;

    let horarioAtencion = 'Lunes a Sábado: 8:00 AM – 7:00 PM';
    if (p.schedule) {
      horarioAtencion = p.schedule;
    }

    return {
      negocio: {
        nombre: p.name || 'Negocio Local',
        rubro,
        categoria: catKey,
        eslogan,
        calificacion: p.rating || '5.0',
        resenas: p.reviews || '1',
        contacto: {
          telefono_principal: phoneData.formatted || phoneData.international,
          whatsapp: {
            numero: phoneData.international,
            link: waLink
          }
        },
        ubicacion: {
          direccion: p.address || 'Dirección no visible en Google Maps',
          ciudad: loc.ciudad,
          departamento_pais: loc.departamento_pais,
          google_maps_url: p.googleMapsUrl || window.location.href
        },
        horario_atencion: horarioAtencion,
        sitio_web: p.website || '',
        sistema_reservas: {
          estado: p.booking?.hasBookingSystem === true ? 'CON RESERVAS' : p.booking?.hasBookingSystem === false ? 'SIN RESERVAS' : 'REVISAR',
          oportunidad_saas: p.booking?.hasBookingSystem === false ? 'ALTA (Lead Calificado)' : 'MEDIA',
          motivo_auditoria: p.booking?.reason || 'Sin auditoría'
        },
        servicios: services,
        especialistas: specialists
      }
    };
  }

  function downloadJson(filename, obj) {
    const str = JSON.stringify(obj, null, 2);
    const blob = new Blob([str], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function copyToClipboard(text, btnElement, successLabel = '¡JSON Copiado! ✓') {
    try {
      await navigator.clipboard.writeText(text);
      if (btnElement) {
        const original = btnElement.textContent;
        btnElement.textContent = successLabel;
        btnElement.style.background = '#10b981';
        btnElement.style.color = '#ffffff';
        setTimeout(() => {
          btnElement.textContent = original;
          btnElement.style.background = '';
          btnElement.style.color = '';
        }, 2200);
      }
    } catch (err) {
      alert('No se pudo copiar automáticamente. Por favor copia manualmente.');
    }
  }

  // =========================================================================
  // 6. BUSCADOR DE TARJETAS EN FEED
  // =========================================================================

  function findCards() {
    const feedItems = document.querySelectorAll('div[role="feed"] > div > div[jsaction], div.Nv2PK, div.THOPZb');
    if (feedItems.length > 0) {
      const valid = [];
      feedItems.forEach(item => {
        if (item.querySelector('a[href*="/maps/place/"], .qBF1Pd, .fontHeadlineSmall')) {
          valid.push(item);
        }
      });
      if (valid.length > 0) return valid;
    }

    const anchors = [...document.querySelectorAll('a[href*="/maps/place/"]')];
    const cards = [];
    const seen = new Set();

    for (const anchor of anchors) {
      let card = anchor.closest('div.Nv2PK') || anchor.closest('[role="article"]');
      if (!card) {
        let node = anchor;
        for (let i = 0; i < 7 && node?.parentElement; i++, node = node.parentElement) {
          if (node.querySelector('.qBF1Pd, .fontHeadlineSmall, div.W4Efsd')) {
            card = node;
            break;
          }
        }
      }
      if (!card || seen.has(card)) continue;
      seen.add(card);
      cards.push(card);
    }
    return cards;
  }

  function extractBusinessFromCard(card) {
    const name = extractName(card);
    const { address, phone, category } = extractAddressAndPhone(card);
    const website = extractWebsite(card);
    const { rating, reviews } = extractRatingAndReviews(card);
    const googleMapsUrl = extractGoogleMapsUrl(card);

    return {
      name: clean(name),
      category: clean(category),
      rating: clean(rating),
      reviews: clean(reviews),
      phone: clean(phone),
      address: clean(address),
      website: clean(website),
      googleMapsUrl: clean(googleMapsUrl)
    };
  }

  async function getSaved() {
    const data = await chrome.storage.local.get({ [STORAGE_KEY]: [] });
    return Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
  }

  async function saveProspect(p) {
    const saved = await getSaved();
    const key = `${p.name}|${p.phone}|${p.address}|${p.website}`.toLowerCase();
    const exists = saved.some(x => `${x.name}|${x.phone}|${x.address}|${x.website}`.toLowerCase() === key);
    if (!exists) {
      const fullJson = buildBusinessJsonObject(p);
      saved.push({
        name: p.name,
        category: p.category || '',
        rating: p.rating || '',
        reviews: p.reviews || '',
        phone: p.phone || '',
        address: p.address || '',
        website: p.website || '',
        googleMapsUrl: p.googleMapsUrl || '',
        bookingStatus: p.booking?.hasBookingSystem === true ? 'CON RESERVAS' : p.booking?.hasBookingSystem === false ? 'SIN RESERVAS' : 'REVISAR',
        business_data: fullJson,
        savedAt: new Date().toISOString()
      });
      await chrome.storage.local.set({ [STORAGE_KEY]: saved });
    }
    return !exists;
  }

  let currentScannedList = [];

  // =========================================================================
  // 7. INTERFAZ VISUAL DEL PANEL FLOTANTE
  // =========================================================================

  function createPanel() {
    if (document.getElementById(ROOT_ID)) return;
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = `
      <div class="mrp-header">
        <div>
          <strong>Maps Prospector AI v2.0</strong>
          <span id="mrp-status">Listo para extraer Homepage JSON</span>
        </div>
        <button id="mrp-close" title="Cerrar">×</button>
      </div>

      <!-- Barra de Acciones Principales -->
      <div class="mrp-toolbar">
        <button id="mrp-extract-active" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 800;" title="Extraer el negocio abierto en pantalla actualmente">📍 Extraer Lugar Actual</button>
        <button id="mrp-scan">⚡ Analizar Búsqueda</button>
      </div>

      <div class="mrp-subtoolbar" style="display: flex; gap: 6px; padding: 6px 14px; background: #0b0e17; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <button id="mrp-export-bundle" style="flex: 1; font-size: 10.5px; background: #1e293b; color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;">📦 Exportar Bundle JSON</button>
        <button id="mrp-open" style="flex: 1; font-size: 10.5px; background: #1e293b; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;">📋 Prospectos (<span id="mrp-count">0</span>)</button>
      </div>

      <div id="mrp-results"></div>
      <div id="mrp-note">Genera DATOS_NEGOCIO.json 100% compatible con BeautyFlow Homepage Studio.</div>
    `;
    document.documentElement.appendChild(root);

    root.querySelector('#mrp-close').onclick = () => root.remove();
    root.querySelector('#mrp-scan').onclick = scan;
    root.querySelector('#mrp-extract-active').onclick = extractAndShowActivePlace;
    root.querySelector('#mrp-open').onclick = () => chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    root.querySelector('#mrp-export-bundle').onclick = handleExportBundle;
    updateCount();
  }

  function handleExportBundle() {
    if (!currentScannedList.length) {
      alert('Primero realiza un escaneo o extrae un negocio.');
      return;
    }
    const bundle = currentScannedList.map(p => buildBusinessJsonObject(p));
    downloadJson(`DATOS_NEGOCIOS_BUNDLE_${new Date().toISOString().slice(0, 10)}.json`, bundle);
  }

  async function updateCount() {
    const saved = await getSaved();
    const el = document.querySelector('#mrp-count');
    if (el) el.textContent = saved.length;
  }

  function setStatus(text) {
    const el = document.querySelector('#mrp-status');
    if (el) el.textContent = text;
  }

  // =========================================================================
  // 8. ACCIÓN: EXTRAER NEGOCIO ABIERTO EN PANTALLA
  // =========================================================================

  async function extractAndShowActivePlace() {
    createPanel();
    const results = document.querySelector('#mrp-results');
    setStatus('Extrayendo negocio activo en pantalla...');

    const p = extractSinglePlaceFromDOM();
    if (!p || !p.name || /^resultados\b/i.test(p.name)) {
      setStatus('No se detectó el negocio abierto. Haz clic sobre el lugar.');
      results.innerHTML = `
        <div class="mrp-empty">
          ⚠️ Abre o haz clic en un negocio específico en Google Maps para extraer sus datos exactos en 1 clic.
        </div>
      `;
      return;
    }

    currentScannedList = [p];
    const businessJson = buildBusinessJsonObject(p);

    const slugName = (p.name || 'negocio')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    results.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'mrp-row';
    row.style.border = '1px solid #10b981';
    row.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';

    row.innerHTML = `
      <div style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px;">
        ✨ LUGAR ACTIVO EN PANTALLA
      </div>
      <div class="mrp-row-title">${escapeHtml(p.name)} <span style="font-size:11px;color:#d97706;font-weight:bold;">★ ${escapeHtml(businessJson.negocio.calificacion)} (${escapeHtml(businessJson.negocio.resenas)})</span></div>
      <div class="mrp-row-data" style="color:#059669;font-weight:bold;">📂 ${escapeHtml(businessJson.negocio.rubro)}</div>
      <div class="mrp-row-data">📍 <strong>Dirección:</strong> ${escapeHtml(businessJson.negocio.ubicacion.direccion)}</div>
      <div class="mrp-row-data">🏙️ <strong>Ciudad:</strong> <span style="color:#f59e0b;font-weight:bold;">${escapeHtml(businessJson.negocio.ubicacion.ciudad)} (${escapeHtml(businessJson.negocio.ubicacion.departamento_pais)})</span></div>
      <div class="mrp-row-data">📞 <strong>WhatsApp / Tel:</strong> <span style="color:#38bdf8;font-weight:bold;">${escapeHtml(businessJson.negocio.contacto.whatsapp.numero)}</span></div>
      ${p.schedule ? `<div class="mrp-row-data">⏰ <strong>Horario:</strong> ${escapeHtml(p.schedule)}</div>` : ''}
      <div class="mrp-row-data">🌐 <strong>Web:</strong> ${p.website ? `<a href="${escapeAttr(p.website)}" target="_blank" rel="noopener">${escapeHtml(p.website)}</a>` : '<span style="color:#ef4444;font-weight:bold;">Sin sitio web</span>'}</div>
      
      <div class="mrp-actions-grid" style="margin-top: 12px;">
        <button class="mrp-btn-copy-json" style="padding: 9px 4px;" title="Copiar DATOS_NEGOCIO.json al portapapeles">📋 Copiar JSON</button>
        <button class="mrp-btn-dl-json" style="padding: 9px 4px;" title="Descargar archivo DATOS_NEGOCIO.json">📥 Descargar JSON</button>
        <button class="mrp-btn-save" style="padding: 9px 4px;" title="Guardar en lista de prospectos">💾 Guardar</button>
      </div>
    `;

    const copyBtn = row.querySelector('.mrp-btn-copy-json');
    copyBtn.onclick = () => {
      copyToClipboard(JSON.stringify(businessJson, null, 2), copyBtn);
    };

    const dlBtn = row.querySelector('.mrp-btn-dl-json');
    dlBtn.onclick = () => {
      downloadJson(`DATOS_NEGOCIO_${slugName}.json`, businessJson);
    };

    const saveBtn = row.querySelector('.mrp-btn-save');
    saveBtn.onclick = async () => {
      const added = await saveProspect(p);
      saveBtn.textContent = added ? 'Guardado ✓' : 'Ya guardado';
      saveBtn.style.background = '#059669';
      await updateCount();
    };

    results.appendChild(row);
    setStatus(`✓ Datos extraídos con éxito de "${p.name}"`);
  }

  // =========================================================================
  // 9. ESCANEO DE LISTA COMPLETA
  // =========================================================================

  async function analyzeBusinessCard(card) {
    const p = extractBusinessFromCard(card);
    if (!p.name || /^resultados\b/i.test(p.name)) return null;

    if (!p.website) {
      return { ...p, booking: { hasBookingSystem: false, confidence: 'high', reason: 'Sin sitio web (Oportunidad alta).' } };
    }

    try {
      const result = await chrome.runtime.sendMessage({ type: 'CHECK_WEBSITE', url: p.website });
      return { ...p, booking: result };
    } catch {
      return { ...p, booking: { hasBookingSystem: false, confidence: 'unknown', reason: 'Revisión manual' } };
    }
  }

  async function loadMoreResults() {
    const feed = document.querySelector('div[role="feed"]');
    if (!feed) return;

    let stableRounds = 0;
    let lastCount = findCards().length;

    for (let round = 0; round < 30 && stableRounds < 3; round++) {
      feed.scrollTop = feed.scrollHeight;
      feed.dispatchEvent(new Event('scroll', { bubbles: true }));
      await sleep(400);
      const count = findCards().length;
      if (count <= lastCount) stableRounds++;
      else stableRounds = 0;
      lastCount = count;
    }
  }

  async function scan() {
    createPanel();
    const results = document.querySelector('#mrp-results');
    results.innerHTML = '';
    currentScannedList = [];
    let cards = findCards();
    setStatus(`${cards.length} resultados iniciales`);

    await loadMoreResults();
    const allCards = findCards();
    if (!allCards.length) {
      if (isPlaceDetailOpen()) {
        extractAndShowActivePlace();
        return;
      }
      results.innerHTML = '<div class="mrp-empty">No se encontraron negocios. Realiza una búsqueda (ej: salones, spas, odontología) o abre un lugar.</div>';
      return;
    }

    setStatus(`Extrayendo ${allCards.length} negocios...`);
    let noBooking = 0;

    for (let i = 0; i < allCards.length; i++) {
      setStatus(`Analizando ${i + 1}/${allCards.length}`);
      const p = await analyzeBusinessCard(allCards[i]);
      if (!p || !p.name || /^resultados\b/i.test(p.name)) continue;

      currentScannedList.push(p);
      const businessJson = buildBusinessJsonObject(p);

      const slugName = (p.name || 'negocio')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const row = document.createElement('div');
      row.className = 'mrp-row';
      row.innerHTML = `
        <div class="mrp-row-title">${escapeHtml(p.name)} <span style="font-size:11px;color:#d97706;font-weight:bold;">★ ${escapeHtml(businessJson.negocio.calificacion)} (${escapeHtml(businessJson.negocio.resenas)})</span></div>
        <div class="mrp-row-data" style="color:#059669;font-weight:bold;">📂 ${escapeHtml(businessJson.negocio.rubro)}</div>
        <div class="mrp-row-data">📍 <strong>Dirección:</strong> ${escapeHtml(businessJson.negocio.ubicacion.direccion)}</div>
        <div class="mrp-row-data">🏙️ <strong>Ciudad:</strong> ${escapeHtml(businessJson.negocio.ubicacion.ciudad)}</div>
        <div class="mrp-row-data">📞 <strong>WhatsApp:</strong> <span style="color:#38bdf8;font-weight:bold;">${escapeHtml(businessJson.negocio.contacto.whatsapp.numero)}</span></div>
        <div class="mrp-row-data">🌐 <strong>Web:</strong> ${p.website ? `<a href="${escapeAttr(p.website)}" target="_blank" rel="noopener">${escapeHtml(p.website)}</a>` : '<span style="color:#ef4444;font-weight:bold;">Sin sitio web</span>'}</div>
        <div class="mrp-row-data" style="margin-top:4px;"><strong>Estado:</strong> <span style="font-weight:bold;color:${p.booking?.hasBookingSystem ? '#16a34a' : '#d97706'}">${p.booking?.hasBookingSystem === true ? '✅ CON RESERVAS' : '🔥 SIN RESERVAS (OPORTUNIDAD)'}</span></div>
        
        <div class="mrp-actions-grid">
          <button class="mrp-btn-copy-json" title="Copiar DATOS_NEGOCIO.json al portapapeles">📋 Copiar JSON</button>
          <button class="mrp-btn-dl-json" title="Descargar archivo DATOS_NEGOCIO.json">📥 Descargar JSON</button>
          <button class="mrp-btn-save" title="Guardar en lista de prospectos">💾 Guardar</button>
        </div>
      `;

      const copyBtn = row.querySelector('.mrp-btn-copy-json');
      copyBtn.onclick = () => {
        copyToClipboard(JSON.stringify(businessJson, null, 2), copyBtn);
      };

      const dlBtn = row.querySelector('.mrp-btn-dl-json');
      dlBtn.onclick = () => {
        downloadJson(`DATOS_NEGOCIO_${slugName}.json`, businessJson);
      };

      const saveBtn = row.querySelector('.mrp-btn-save');
      saveBtn.onclick = async () => {
        const added = await saveProspect(p);
        saveBtn.textContent = added ? 'Guardado ✓' : 'Ya guardado';
        saveBtn.style.background = '#059669';
        await updateCount();
      };

      results.appendChild(row);
      if (p.booking && p.booking.hasBookingSystem === false) noBooking++;
      await sleep(30);
    }

    setStatus(`${currentScannedList.length} negocios procesados (${noBooking} sin reservas)`);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === 'TOGGLE_PANEL') {
      createPanel();
      if (message.scan) scan();
    }
  });

  const observer = new MutationObserver(() => {
    if (document.querySelector('#mrp-root')) return;
    if (document.querySelector('a[href*="/maps/place/"], div.Nv2PK, h1.DUwDvf')) {
      createPanel();
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true });

  createPanel();
})();
