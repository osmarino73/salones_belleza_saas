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
    // Eliminar prefijos de Google Maps y botones de copiado
    a = a.replace(/^(Copiar dirección|Dirección|Address|Ubicación):\s*/i, '').trim();
    // Eliminar estados pegados como "Abierto", "Cerrado", "Cierra a las...", "Open", "Closed"
    a = a.replace(/\s*(·|•)?\s*(Abierto|Cerrado|Cierra|Abre|Open|Closed)[\s\S]*$/i, '').trim();
    // Eliminar teléfonos pegados al final de la dirección
    a = a.replace(/\s*(·|•)\s*(?:\+?57)?\s*(?:3\d{2}|60[1-8])[\s.-]?\d{3}[\s.-]?\d{4}$/i, '').trim();
    return a;
  }

  function cleanCategoryString(rawCategory, businessName = '') {
    if (!rawCategory) return '';
    let cat = clean(rawCategory);
    // Eliminar patrones de calificación y reseñas como "4,7(191)", "4.7 (191)", "5.0 (5)"
    cat = cat.replace(/\d[.,]\d\s*\(\d+[\d.,]*\)/g, '').trim();
    cat = cat.replace(/\b\d[.,]\d\b/g, '').trim();
    // Eliminar separadores al inicio y final
    cat = cat.replace(/^[·•|\s-]+|[·•|\s-]+$/g, '').trim();
    // Si contiene el nombre del negocio duplicado, removerlo
    if (businessName) {
      const escapedName = businessName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      cat = cat.replace(new RegExp('^' + escapedName + '\\s*', 'i'), '').trim();
      cat = cat.replace(new RegExp('\\s*' + escapedName + '$', 'i'), '').trim();
    }
    cat = cat.replace(/^[·•|\s-]+|[·•|\s-]+$/g, '').trim();
    return cat;
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

  function extractPhoneFromDetailPanel() {
    // 1. Comprobar botón con data-item-id de teléfono exacto o enlace tel:
    const phoneTelBtn = document.querySelector('[data-item-id^="phone:tel:"], a[href^="tel:"]');
    if (phoneTelBtn) {
      const dataId = phoneTelBtn.getAttribute('data-item-id') || '';
      if (dataId.startsWith('phone:tel:')) {
        const raw = clean(dataId.replace('phone:tel:', ''));
        if (raw) return raw;
      }
      const href = phoneTelBtn.getAttribute('href') || '';
      if (href.startsWith('tel:')) {
        const raw = clean(href.replace('tel:', ''));
        if (raw) return raw;
      }
    }

    // 2. Comprobar botones de teléfono por data-item-id, tooltip o aria-label
    const phoneBtn = document.querySelector(
      'button[data-item-id*="phone"], [data-tooltip*="teléfono" i], [data-tooltip*="phone" i], button[aria-label*="teléfono" i], button[aria-label*="phone" i], button[aria-label*="llamar" i]'
    );
    if (phoneBtn) {
      const textEl = phoneBtn.querySelector('div.Io6YTe, div.fontBodyMedium, span.UsdlK') || phoneBtn;
      const textPhone = extractPhoneFromText(textEl.textContent);
      if (textPhone) return textPhone;

      const aria = phoneBtn.getAttribute('aria-label') || '';
      const ariaPhone = extractPhoneFromText(aria);
      if (ariaPhone) return ariaPhone;
    }

    // 3. Búsqueda de respaldo en contenedores de texto del panel
    const candidates = document.querySelectorAll('div.Io6YTe, div.fontBodyMedium, button.CsEnBe, button.R8qRAd');
    for (const el of candidates) {
      const text = clean(el.textContent);
      if (text.includes('http') || text.includes('www.') || text.includes('#') || /\b(calle|cra|carrera|cl\b)/i.test(text)) continue;
      const found = extractPhoneFromText(text);
      if (found) return found;
    }

    return '';
  }

  function extractAddressFromDetailPanel() {
    const addressBtn = document.querySelector(
      'button[data-item-id="address"], [data-item-id="address"], button[aria-label*="Dirección:" i], button[aria-label*="Address:" i]'
    );
    if (addressBtn) {
      const textEl = addressBtn.querySelector('div.Io6YTe, div.fontBodyMedium') || addressBtn;
      let raw = clean(textEl.textContent);
      raw = cleanAddress(raw);
      if (raw && !/^(copiar dirección|cómo llegar|dirección)$/i.test(raw)) {
        return raw;
      }
      const aria = addressBtn.getAttribute('aria-label') || '';
      const cleanedAria = cleanAddress(aria.replace(/^(Dirección|Address|Copiar dirección):\s*/i, ''));
      if (cleanedAria) return cleanedAria;
    }

    const candidates = document.querySelectorAll('div.Io6YTe, div.fontBodyMedium');
    const addressKeywordsRegex = /\b(calle|cl\.?|carrera|cra\.?|cr\.?|av\.?|avenida|diagonal|diag\.?|transversal|tv\.?|circunvalar|manzana|mz\.?|autopista|km|#|\d{1,5}\s*#|\d{2,}\s*-\s*\d+)/i;
    for (const el of candidates) {
      const text = clean(el.textContent);
      if (addressKeywordsRegex.test(text) && !text.includes('http') && !/^(lunes|martes|miércoles|jueves|viernes|sábado|domingo)/i.test(text)) {
        return cleanAddress(text);
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
    category = cleanCategoryString(category, name);

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

    // 4. Dirección exacta
    let address = extractAddressFromDetailPanel();

    // 5. Horario
    let schedule = '';
    const scheduleBtn = document.querySelector(
      'button[data-item-id="oh"] div.Io6YTe, button[data-item-id="oh"], [data-item-id="oh"] div.Io6YTe, button[aria-label*="Horario"] div.Io6YTe'
    );
    if (scheduleBtn) {
      schedule = clean(scheduleBtn.textContent);
    }

    // 6. Teléfono exacto (evita strings como 'Copiar número de teléfono')
    let phone = extractPhoneFromDetailPanel();

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

    // 10. Servicios Reales de la Ficha
    const services = (typeof extractRealServicesFromDOM === 'function') ? extractRealServicesFromDOM() : [];

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
      googleMapsUrl,
      services
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

  function extractPhoneFromText(text) {
    if (!text) return '';
    const cleanTxt = clean(text);

    // 1. Universal International con +57 o código de país explícito
    const intlMatch = cleanTxt.match(/\+57[\s.-]?(?:\(?\d{1,3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);
    if (intlMatch) return intlMatch[0].trim();

    const genericIntl = cleanTxt.match(/\+(?:[0-9][\s.-]?){8,14}[0-9]/);
    if (genericIntl && !genericIntl[0].includes('6 p. m.') && !genericIntl[0].includes('12:')) {
      return genericIntl[0].trim();
    }

    // 2. Celular Colombiano: 300 123 4567, 312-345-6789, 3101234567, (312) 345 6789
    const celMatch = cleanTxt.match(/(?:(?:\+?57)[\s.-]?)?(?:\(?3\d{2}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b3\d{9}\b)/);
    if (celMatch && !celMatch[0].includes('6 p. m.') && !celMatch[0].includes('12:') && !celMatch[0].includes('202')) {
      return celMatch[0].trim();
    }

    // 3. Fijos de Colombia con código de área (ej: 604 828 3131, (604) 444 5555, (601) 234 5678)
    const fixMatch = cleanTxt.match(/(?:(?:\+?57)[\s.-]?)?(?:\(?60[1-8]\)?[\s.-]?\d{3}[\s.-]?\d{4}|\b60[1-8]\d{7}\b)/);
    if (fixMatch) return fixMatch[0].trim();

    // 4. Fijo antiguo con prefijo 03 o regional (ej: (4) 828 3131, 034 828 3131)
    const oldFixMatch = cleanTxt.match(/(?:\(?0?3[1-8]\)?|\(?0?[1-8]\)?)[\s.-]?\d{3}[\s.-]?\d{4}/);
    if (oldFixMatch && !oldFixMatch[0].includes('6 p. m.') && !oldFixMatch[0].includes('12:')) {
      return oldFixMatch[0].trim();
    }

    // 5. Formato estándar de 10 dígitos (ej: 3123456789 o 6048283131)
    const tenMatch = cleanTxt.match(/(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
    if (tenMatch && !tenMatch[0].includes('6 p. m.') && !tenMatch[0].includes('12:') && !tenMatch[0].includes('202')) {
      return tenMatch[0].trim();
    }

    // 6. Número local de 7 dígitos (ej: 444 5555 o 828-3131)
    const sevenMatch = cleanTxt.match(/\b[2-9]\d{2}[\s.-]?\d{4}\b/);
    if (sevenMatch && !sevenMatch[0].includes(':')) return sevenMatch[0].trim();

    return '';
  }

  function extractAddressAndPhone(card) {
    let address = '';
    let phone = '';
    let category = '';

    const cardName = extractName(card);

    // Botones con selectores directos si existen
    const addressBtn = card.querySelector('button[data-item-id="address"], [aria-label*="Dirección:" i]');
    if (addressBtn) {
      const textEl = addressBtn.querySelector('div.Io6YTe, div.fontBodyMedium') || addressBtn;
      address = cleanAddress(textEl.textContent || addressBtn.getAttribute('aria-label'));
    }

    const phoneBtn = card.querySelector(
      'button[data-item-id*="phone"], [data-tooltip*="teléfono" i], [data-tooltip*="phone" i], a[href^="tel:"]'
    );
    if (phoneBtn) {
      if (phoneBtn.tagName?.toLowerCase() === 'a' && phoneBtn.href?.startsWith('tel:')) {
        phone = clean(phoneBtn.href.replace('tel:', ''));
      } else {
        const textEl = phoneBtn.querySelector('div.Io6YTe, div.fontBodyMedium') || phoneBtn;
        phone = extractPhoneFromText(textEl.textContent) || extractPhoneFromText(phoneBtn.getAttribute('aria-label'));
      }
    }

    // Líneas de texto secundarias en la tarjeta de Google Maps (div.W4Efsd)
    const textContainers = card.querySelectorAll('div.W4Efsd, .fontBodyMedium');
    const rawLines = [];

    textContainers.forEach(el => {
      const txt = clean(el.innerText || el.textContent);
      if (txt && !rawLines.includes(txt)) {
        rawLines.push(txt);
      }
    });

    const addressKeywordsRegex = /\b(calle|cl\.?|carrera|cra\.?|cr\.?|av\.?|avenida|diagonal|diag\.?|transversal|tv\.?|circunvalar|manzana|mz\.?|barrio|piso|local|autopista|km|apartad[oó]|medell[ií]n|bogot[aá]|cali|barranquilla|cartagena|pereira|bucaramanga|colombia|#|n°|no\.|\d{1,5}\s*#|\d{2,}\s*-\s*\d+)/i;

    for (const line of rawLines) {
      if (!phone) {
        const found = extractPhoneFromText(line);
        if (found) phone = clean(found);
      }

      const parts = line.split(/[·•|\n]/).map(p => clean(p)).filter(Boolean);

      for (let i = 0; i < parts.length; i++) {
        let part = parts[i];

        // Omitir clasificaciones numéricas puras como "4.7 (191)"
        if (/^\d[.,]\d(\s*\(\d+[\d.,]*\))?$/.test(part) || /^\(\d+[\d.,]*\)$/.test(part)) {
          continue;
        }

        // Omitir estados de apertura/cierre
        if (/^(abierto|cerrado|cierra|abre|open|closed|horario|24 horas)/i.test(part)) {
          continue;
        }

        // Omitir citas/opiniones entre comillas
        if (/^"[^"]+"$/.test(part)) {
          continue;
        }

        // Omitir atributos de servicio generales
        if (/^(servicios en el lugar|entrega a domicilio|para llevar|citas online|clases online)/i.test(part)) {
          continue;
        }

        // Extraer teléfono si aún no se tiene
        if (!phone) {
          const partPhone = extractPhoneFromText(part);
          if (partPhone) {
            phone = clean(partPhone);
            continue;
          }
        }

        // Extraer dirección si coincide con patrones urbanos
        if (!address && addressKeywordsRegex.test(part)) {
          address = cleanAddress(part);
          continue;
        }

        // Extraer categoría limpia (no debe tener números, longitud entre 3 y 45 caracteres)
        if (!category && !/\d/.test(part) && part.length >= 3 && part.length <= 45 && !addressKeywordsRegex.test(part)) {
          category = cleanCategoryString(part, cardName);
        }
      }
    }

    if (category) {
      category = cleanCategoryString(category, cardName);
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
    if (!rawPhone || !clean(rawPhone) || /no visible|no registrado|sin teléfono/i.test(rawPhone)) {
      return {
        formatted: 'No visible en Google Maps',
        international: '',
        link: '',
        isWhatsApp: false
      };
    }

    const digits = rawPhone.replace(/\D/g, '');
    if (!digits || digits.length < 7) {
      return {
        formatted: 'No visible en Google Maps',
        international: '',
        link: '',
        isWhatsApp: false
      };
    }

    let international = '';
    let formatted = rawPhone;
    let isWhatsApp = false;

    // Caso 1: Celular de Colombia (10 dígitos empezando en 3 o prefijo +573...)
    if (digits.startsWith('57') && digits.length >= 12 && digits.charAt(2) === '3') {
      international = `+${digits.slice(0, 12)}`;
      const core = digits.slice(2, 12);
      formatted = `(+57) ${core.slice(0, 3)} ${core.slice(3, 6)} ${core.slice(6)}`;
      isWhatsApp = true;
    } else if (digits.length === 10 && digits.startsWith('3')) {
      international = `+57${digits}`;
      formatted = `(+57) ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
      isWhatsApp = true;
    } 
    // Caso 2: Fijo de Colombia con prefijo 60 (ej: 604 828 3131 o 57604...) -> ES FIJO, NO TIENE WHATSAPP
    else if (digits.startsWith('5760') && digits.length >= 12) {
      international = `+${digits.slice(0, 12)}`;
      const code = digits.slice(2, 5);
      const local = digits.slice(5, 12);
      formatted = `(${code}) ${local.slice(0, 3)} ${local.slice(3)}`;
      isWhatsApp = false;
    } else if (digits.length === 10 && digits.startsWith('60')) {
      international = `+57${digits}`;
      const code = digits.slice(0, 3);
      const local = digits.slice(3);
      formatted = `(${code}) ${local.slice(0, 3)} ${local.slice(3)}`;
      isWhatsApp = false;
    }
    // Caso 3: Número local de 7 dígitos (fijo Medellín/Urabá código 604) -> NO TIENE WHATSAPP
    else if (digits.length === 7) {
      international = `+57604${digits}`;
      formatted = `(604) ${digits.slice(0, 3)} ${digits.slice(3)}`;
      isWhatsApp = false;
    }
    // Caso 4: Otros números internacionales o de longitud >= 10
    else if (digits.length >= 10) {
      if (rawPhone.trim().startsWith('+')) {
        international = `+${digits}`;
      } else {
        international = `+57${digits}`;
      }
      formatted = international;
      isWhatsApp = digits.startsWith('3') || (digits.startsWith('573') && digits.length >= 12);
    } else {
      formatted = rawPhone;
      international = `+57${digits}`;
      isWhatsApp = false;
    }

    const waNumber = isWhatsApp ? international.replace(/\D/g, '') : '';
    const link = waNumber ? `https://wa.me/${waNumber}` : '';

    return {
      formatted: formatted || international || 'No visible en Google Maps',
      international: waNumber ? international : '',
      link,
      isWhatsApp
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
    if (/peluquer|sal[oó]n de belleza|hair|estilist|balayage|peinado/i.test(combined)) return 'salon';
    
    if (categoryText && categoryText.trim().length > 1) {
      return categoryText.toLowerCase().trim().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    }
    return 'general';
  }

  function getRubroName(categoryText, catKey) {
    if (categoryText && categoryText.trim().length > 1) {
      return categoryText.trim();
    }
    const map = {
      salon: 'Salón de Belleza & Peluquería',
      barberia: 'Barbería & Peluquería Masculina',
      spa: 'Spa & Centro de Masajes',
      nails: 'Nails Bar & Manicura',
      cejas_pestanas: 'Estudio de Cejas & Pestañas',
      estetica: 'Centro de Estética',
      dental: 'Clínica Odontológica'
    };
    return map[catKey] || 'Negocio Local';
  }

  function generateSlogan(rubro, name, ciudad) {
    if (name && ciudad) {
      return `${name} — ${rubro} en ${ciudad}`;
    }
    return `${name} — ${rubro}`;
  }

  // Extraer chips o etiquetas de servicios reales de la ficha de Google Maps si están presentes
  function extractRealServicesFromDOM() {
    const realServices = [];
    const serviceElements = document.querySelectorAll(
      'div.iP2tbe, div[aria-label*="Servicios" i] div.k77Iif, div[aria-label*="Services" i] div.k77Iif, div.G8Q6sf div.fontBodyMedium, div.m6QErb button.uEubGf'
    );
    
    const seen = new Set();
    serviceElements.forEach(el => {
      const text = clean(el.textContent);
      if (text && text.length > 2 && text.length < 80 && !seen.has(text.toLowerCase())) {
        seen.add(text.toLowerCase());
        if (!/^(todos|servicios|services|resumen|opiniones|fotos|acerca de|informaci[oó]n|llamar|c[oó]mo llegar|guardar|compartir)$/i.test(text)) {
          realServices.push({
            titulo: text,
            descripcion: `Servicio ofrecido por el negocio según su ficha de Google Maps.`
          });
        }
      }
    });

    return realServices;
  }

  // =========================================================================
  // 5. CONSTRUCTOR DEL ESQUEMA OFICIAL DATOS_NEGOCIO.json (SOLO DATOS REALES)
  // =========================================================================

  function buildBusinessJsonObject(p, index = 1) {
    const rawCategory = cleanCategoryString(p.category || '', p.name);
    const catKey = detectCategoryKey(rawCategory, p.name);
    const rubro = getRubroName(rawCategory, catKey);
    const phoneData = normalizePhone(p.phone);
    const loc = parseLocation(p.address, p.plusCode);
    const eslogan = generateSlogan(rubro, p.name, loc.ciudad);

    const waNumber = phoneData.isWhatsApp ? phoneData.international.replace(/\D/g, '') : '';
    const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola ${p.name}, quisiera solicitar información.`)}` : '';

    const horarioAtencion = p.schedule || 'No especificado en Google Maps';
    const domServices = (typeof extractRealServicesFromDOM === 'function') ? extractRealServicesFromDOM() : [];
    const realServices = (p.services && p.services.length > 0) ? p.services : domServices;

    const hasBooking = p.booking?.hasBookingSystem === true;
    const noBooking = p.booking?.hasBookingSystem === false;

    return {
      id: p.id || `lead-${Date.now()}-${index}`,
      status: p.status || 'nuevo',
      negocio: {
        nombre: p.name || 'Negocio Local',
        rubro: rubro,
        categoria: catKey,
        eslogan: eslogan,
        calificacion: p.rating || '5.0',
        resenas: p.reviews || '0',
        contacto: {
          telefono_principal: phoneData.formatted,
          whatsapp: {
            numero: phoneData.isWhatsApp ? phoneData.international : '',
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
          estado: hasBooking ? 'CON RESERVAS' : noBooking ? 'SIN RESERVAS' : 'REVISAR',
          oportunidad_saas: noBooking ? 'ALTA (Lead Calificado)' : hasBooking ? 'BAJA (Ya tiene reservas)' : 'MEDIA',
          motivo_auditoria: p.booking?.reason || (p.website ? 'Sitio web analizado.' : 'Sin sitio web (Oportunidad alta).')
        },
        servicios: realServices,
        especialistas: []
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
    const existsIdx = saved.findIndex(x => `${x.name}|${x.phone}|${x.address}|${x.website}`.toLowerCase() === key);
    const fullJson = buildBusinessJsonObject(p, saved.length + 1);
    const item = {
      id: fullJson.id,
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
    };
    if (existsIdx >= 0) {
      item.id = saved[existsIdx].id || item.id;
      saved[existsIdx] = item;
      await chrome.storage.local.set({ [STORAGE_KEY]: saved });
      return false;
    } else {
      saved.push(item);
      await chrome.storage.local.set({ [STORAGE_KEY]: saved });
      return true;
    }
  }

  let currentScannedList = [];
  let isScanning = false;
  let shouldCancelScan = false;

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

      <!-- Barra de Acciones Principales con Selector de Límite -->
      <div class="mrp-toolbar" style="display: flex; gap: 6px; padding: 10px 14px; background: #131b2e; align-items: center;">
        <button id="mrp-extract-active" style="flex: 1.2; background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 800; padding: 8px 6px; font-size: 11px; border-radius: 6px; cursor: pointer; border: 0;" title="Extraer el negocio abierto en pantalla actualmente">📍 Extraer Actual</button>
        <button id="mrp-scan" style="flex: 1.5; background: linear-gradient(135deg, #FF5A36, #e11d48); color: #fff; font-weight: 800; padding: 8px 6px; font-size: 11px; border-radius: 6px; cursor: pointer; border: 0;" title="Escanear y auditar búsqueda">⚡ Analizar</button>
        <select id="mrp-limit" style="flex: 0.9; background: #1e293b; color: #38bdf8; border: 1px solid rgba(56,189,248,0.4); border-radius: 6px; padding: 7px 4px; font-size: 11px; font-weight: bold; cursor: pointer;" title="Selecciona la cantidad de prospectos a analizar">
          <option value="25">25 leads</option>
          <option value="50" selected>50 leads</option>
          <option value="100">100 leads</option>
          <option value="999">Todos</option>
        </select>
      </div>

      <div class="mrp-subtoolbar" style="display: flex; gap: 6px; padding: 6px 14px; background: #0b0e17; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <button id="mrp-save-all" style="flex: 1; font-size: 10.5px; background: #065f46; color: #34d399; border: 1px solid rgba(52,211,153,0.3); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;" title="Guardar todos los prospectos escaneados">💾 Guardar</button>
        <button id="mrp-copy-bundle" style="flex: 1; font-size: 10.5px; background: #2563eb; color: #fff; border: 1px solid rgba(37,99,235,0.5); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;" title="Copiar bundle JSON para importar directo en el CRM">📋 Copiar Bundle</button>
        <button id="mrp-export-bundle" style="flex: 1; font-size: 10.5px; background: #1e293b; color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;" title="Exportar bundle JSON para Homepage Studio">📦 Descargar</button>
        <button id="mrp-open" style="flex: 1; font-size: 10.5px; background: #1e293b; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px; cursor: pointer; font-weight: bold;">📋 Ver (<span id="mrp-count">0</span>)</button>
      </div>

      <div id="mrp-results"></div>
      <div id="mrp-note">Genera DATOS_NEGOCIO.json 100% compatible con BeautyFlow Homepage Studio y CRM Z-Control.</div>
    `;
    document.documentElement.appendChild(root);

    root.querySelector('#mrp-close').onclick = () => root.remove();
    root.querySelector('#mrp-scan').onclick = () => {
      if (isScanning) {
        shouldCancelScan = true;
        setStatus('Deteniendo escaneo tras el negocio actual...');
      } else {
        scan();
      }
    };
    root.querySelector('#mrp-extract-active').onclick = extractAndShowActivePlace;
    root.querySelector('#mrp-open').onclick = () => chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    root.querySelector('#mrp-copy-bundle').onclick = handleCopyBundle;
    root.querySelector('#mrp-export-bundle').onclick = handleExportBundle;
    root.querySelector('#mrp-save-all').onclick = handleSaveAllScanned;
    updateCount();
  }

  async function handleCopyBundle(e) {
    if (!currentScannedList.length) {
      alert('Primero realiza un escaneo o extrae un negocio.');
      return;
    }
    const bundle = currentScannedList.map((p, idx) => buildBusinessJsonObject(p, idx + 1));
    await copyToClipboard(JSON.stringify(bundle, null, 2), e.target, '¡Bundle Copiado! ✓');
  }

  async function handleSaveAllScanned() {
    if (!currentScannedList.length) {
      alert('Primero realiza un escaneo o extrae un negocio.');
      return;
    }
    let count = 0;
    for (const p of currentScannedList) {
      const added = await saveProspect(p);
      if (added) count++;
    }
    await updateCount();
    const btn = document.querySelector('#mrp-save-all');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = `✓ ${currentScannedList.length} Guardados`;
      btn.style.background = '#059669';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '#065f46';
      }, 2200);
    }
  }

  function handleExportBundle() {
    if (!currentScannedList.length) {
      alert('Primero realiza un escaneo o extrae un negocio.');
      return;
    }
    const bundle = currentScannedList.map((p, idx) => buildBusinessJsonObject(p, idx + 1));
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
    const row = renderProspectRow(p, businessJson, slugName);
    row.style.border = '1px solid #10b981';
    row.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.2)';

    results.appendChild(row);
    setStatus(`✓ Datos extraídos con éxito de "${p.name}"`);
  }

  // =========================================================================
  // 9. ESCANEO DE LISTA COMPLETA CON INSPECCIÓN PROFUNDA Y NAVEGACIÓN BLINDADA
  // =========================================================================

  async function checkWebsiteWithTimeout(url, timeoutMs = 3000) {
    if (!url) return { hasBookingSystem: false, confidence: 'high', reason: 'Sin sitio web.' };
    try {
      const timeoutPromise = new Promise(resolve => 
        setTimeout(() => resolve({ hasBookingSystem: false, confidence: 'unknown', reason: 'Tiempo de respuesta agotado.' }), timeoutMs)
      );
      const checkPromise = chrome.runtime.sendMessage({ type: 'CHECK_WEBSITE', url }).catch(() => ({
        hasBookingSystem: false, confidence: 'unknown', reason: 'Revisión manual'
      }));
      return await Promise.race([checkPromise, timeoutPromise]);
    } catch {
      return { hasBookingSystem: false, confidence: 'unknown', reason: 'Revisión manual' };
    }
  }

  async function closeDetailAndReturnToFeed() {
    // Intentar clic en todas las variantes del botón Volver / Atrás en Google Maps
    const backBtn = document.querySelector(
      'button[aria-label*="Volver" i], button[aria-label*="Atrás" i], button[aria-label*="Back" i], button[aria-label*="Regresar" i], button[jsaction*="back" i], button[jsaction*="navigationRail.back" i], button.hV10qc, button.VfPpkd-icon-LgbsSe'
    );
    if (backBtn) {
      backBtn.click();
      await sleep(180);
    }

    // Esperar a que el feed de búsqueda esté visible nuevamente
    for (let w = 0; w < 12; w++) {
      if (document.querySelector('div[role="feed"], div.Nv2PK')) break;
      await sleep(60);
    }
  }

  async function analyzeBusinessCard(card) {
    let p = extractBusinessFromCard(card);
    if (!p.name || /^resultados\b/i.test(p.name)) return null;

    // Detectar si es anuncio patrocinado
    const isAd = !!(card.querySelector('.k8bI9b, [aria-label*="patrocinado" i]') || /patrocinado/i.test(card.textContent || ''));

    // Inspección profunda: Si no hay teléfono o falta dirección
    if (!isAd && (!p.phone || !p.address || p.address.length < 10)) {
      const clickTarget = card.querySelector('a.hfpxzc, a[href*="/maps/place/"], .qBF1Pd, [role="heading"]') || card;
      if (clickTarget) {
        clickTarget.click();
        let opened = false;
        for (let wait = 0; wait < 15; wait++) {
          await sleep(70);
          const currentH1 = extractPlaceNameFromDOM();
          if (currentH1 && (currentH1.toLowerCase().includes(p.name.slice(0, 8).toLowerCase()) || p.name.toLowerCase().includes(currentH1.slice(0, 8).toLowerCase()))) {
            opened = true;
            break;
          }
          if (document.querySelector('button[data-item-id^="phone:tel:"], button[data-item-id="address"]')) {
            opened = true;
            break;
          }
        }

        if (opened) {
          await sleep(100);
          const detailed = extractSinglePlaceFromDOM();
          if (detailed && detailed.name) {
            p = {
              ...p,
              name: detailed.name || p.name,
              category: detailed.category || p.category,
              rating: detailed.rating || p.rating,
              reviews: detailed.reviews || p.reviews,
              phone: detailed.phone || p.phone,
              address: detailed.address || p.address,
              schedule: detailed.schedule || p.schedule,
              website: detailed.website || p.website,
              googleMapsUrl: detailed.googleMapsUrl || p.googleMapsUrl,
              services: (detailed.services && detailed.services.length > 0) ? detailed.services : (p.services || [])
            };
          }

          await closeDetailAndReturnToFeed();
        }
      }
    }

    if (!p.website) {
      return { ...p, booking: { hasBookingSystem: false, confidence: 'high', reason: 'Sin sitio web (Oportunidad alta).' } };
    }

    const bookingResult = await checkWebsiteWithTimeout(p.website, 3000);
    return { ...p, booking: bookingResult };
  }

  async function loadMoreResults(targetCount = 50) {
    const feed = document.querySelector('div[role="feed"]');
    if (!feed) return;

    let stableRounds = 0;
    let lastCount = findCards().length;
    const maxRounds = Math.min(Math.ceil(targetCount / 8) + 2, 30);

    for (let round = 0; round < maxRounds && lastCount < targetCount && stableRounds < 3; round++) {
      feed.scrollTop = feed.scrollHeight;
      feed.dispatchEvent(new Event('scroll', { bubbles: true }));
      await sleep(350);
      const count = findCards().length;
      if (count <= lastCount) stableRounds++;
      else stableRounds = 0;
      lastCount = count;
    }
  }

  function renderProspectRow(p, businessJson, slugName) {
    const row = document.createElement('div');
    row.className = 'mrp-row';

    const hasWa = !!businessJson.negocio.contacto.whatsapp.numero;
    const phoneVal = businessJson.negocio.contacto.telefono_principal;
    const phoneHtml = hasWa
      ? `<span class="mrp-phone-val" style="color:#38bdf8;font-weight:bold;">${escapeHtml(phoneVal)} 🟢 WA</span>`
      : (phoneVal && phoneVal !== 'No visible en Google Maps')
        ? `<span class="mrp-phone-val" style="color:#94a3b8;font-weight:bold;">${escapeHtml(phoneVal)} ☎️ Fijo</span>`
        : `<span class="mrp-phone-val" style="color:#f59e0b;font-style:italic;">No visible en Maps</span>`;

    row.innerHTML = `
      <div class="mrp-row-title">${escapeHtml(p.name)} <span style="font-size:11px;color:#d97706;font-weight:bold;">★ ${escapeHtml(businessJson.negocio.calificacion)} (${escapeHtml(businessJson.negocio.resenas)})</span></div>
      <div class="mrp-row-data" style="color:#059669;font-weight:bold;">📂 ${escapeHtml(businessJson.negocio.rubro)}</div>
      <div class="mrp-row-data">📍 <strong>Dirección:</strong> ${escapeHtml(businessJson.negocio.ubicacion.direccion)}</div>
      <div class="mrp-row-data">🏙️ <strong>Ciudad:</strong> ${escapeHtml(businessJson.negocio.ubicacion.ciudad)}</div>
      <div class="mrp-row-data">📞 <strong>Tel / WA:</strong> <span class="mrp-phone-wrapper">${phoneHtml}</span> <button class="mrp-btn-edit-phone" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#cbd5e1;border-radius:4px;padding:1px 6px;cursor:pointer;font-size:10px;margin-left:4px;" title="Editar o ingresar número manualmente">✏️</button></div>
      ${p.schedule ? `<div class="mrp-row-data">⏰ <strong>Horario:</strong> ${escapeHtml(p.schedule)}</div>` : ''}
      <div class="mrp-row-data">🌐 <strong>Web:</strong> ${p.website ? `<a href="${escapeAttr(p.website)}" target="_blank" rel="noopener">${escapeHtml(p.website)}</a>` : '<span style="color:#ef4444;font-weight:bold;">Sin sitio web</span>'}</div>
      <div class="mrp-row-data" style="margin-top:4px;"><strong>Estado:</strong> <span style="font-weight:bold;color:${p.booking?.hasBookingSystem ? '#16a34a' : '#d97706'}">${p.booking?.hasBookingSystem === true ? '✅ CON RESERVAS' : '🔥 SIN RESERVAS (OPORTUNIDAD)'}</span></div>
      
      <div class="mrp-actions-grid" style="margin-top: 10px;">
        <button class="mrp-btn-copy-json" title="Copiar DATOS_NEGOCIO.json al portapapeles">📋 Copiar JSON</button>
        <button class="mrp-btn-dl-json" title="Descargar archivo DATOS_NEGOCIO.json">📥 Descargar JSON</button>
        <button class="mrp-btn-save" title="Guardar en lista de prospectos">💾 Guardar</button>
      </div>
    `;

    const copyBtn = row.querySelector('.mrp-btn-copy-json');
    copyBtn.onclick = () => {
      const currentJson = buildBusinessJsonObject(p);
      copyToClipboard(JSON.stringify(currentJson, null, 2), copyBtn);
    };

    const dlBtn = row.querySelector('.mrp-btn-dl-json');
    dlBtn.onclick = () => {
      const currentJson = buildBusinessJsonObject(p);
      downloadJson(`DATOS_NEGOCIO_${slugName}.json`, currentJson);
    };

    const saveBtn = row.querySelector('.mrp-btn-save');
    saveBtn.onclick = async () => {
      const added = await saveProspect(p);
      saveBtn.textContent = added ? 'Guardado ✓' : 'Actualizado ✓';
      saveBtn.style.background = '#059669';
      await updateCount();
    };

    const editBtn = row.querySelector('.mrp-btn-edit-phone');
    if (editBtn) {
      editBtn.onclick = async () => {
        const input = prompt(`Ingresa el WhatsApp o Teléfono para "${p.name}" (ej: 3123456789 o 6048283131):`, p.phone || '');
        if (input !== null) {
          p.phone = clean(input);
          const updatedJson = buildBusinessJsonObject(p);
          const wrapper = row.querySelector('.mrp-phone-wrapper');
          if (wrapper) {
            const hasWaNow = !!updatedJson.negocio.contacto.whatsapp.numero;
            const phoneValNow = updatedJson.negocio.contacto.telefono_principal;
            wrapper.innerHTML = hasWaNow
              ? `<span class="mrp-phone-val" style="color:#38bdf8;font-weight:bold;">${escapeHtml(phoneValNow)} 🟢 WA</span>`
              : (phoneValNow && phoneValNow !== 'No visible en Google Maps')
                ? `<span class="mrp-phone-val" style="color:#94a3b8;font-weight:bold;">${escapeHtml(phoneValNow)} ☎️ Fijo</span>`
                : `<span class="mrp-phone-val" style="color:#f59e0b;font-style:italic;">No visible en Maps</span>`;
          }
          await saveProspect(p);
          await updateCount();
        }
      };
    }

    return row;
  }

  async function scan() {
    createPanel();
    const results = document.querySelector('#mrp-results');
    results.innerHTML = '';
    currentScannedList = [];

    const limitSelect = document.querySelector('#mrp-limit');
    const selectedLimit = limitSelect ? parseInt(limitSelect.value, 10) || 50 : 50;

    const scanBtn = document.querySelector('#mrp-scan');
    if (scanBtn) {
      scanBtn.textContent = '⏹️ Detener';
      scanBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    }

    isScanning = true;
    shouldCancelScan = false;

    try {
      let cards = findCards();
      setStatus(`Detectando resultados en Google Maps...`);

      await loadMoreResults(selectedLimit);
      const allCards = findCards();
      if (!allCards.length) {
        if (isPlaceDetailOpen()) {
          extractAndShowActivePlace();
          return;
        }
        results.innerHTML = '<div class="mrp-empty">No se encontraron negocios. Realiza una búsqueda (ej: salones, spas, odontología) o abre un lugar.</div>';
        return;
      }

      const totalTarget = Math.min(allCards.length, selectedLimit);
      setStatus(`Analizando ${totalTarget} negocios (límite: ${selectedLimit >= 900 ? 'Todos' : selectedLimit})...`);
      let noBooking = 0;
      let withRealPhone = 0;

      for (let i = 0; i < totalTarget; i++) {
        if (shouldCancelScan) {
          setStatus(`Escaneo detenido por el usuario (${currentScannedList.length} guardados)`);
          break;
        }

        try {
          // Re-consultar tarjetas para tener nodos DOM frescos y conectados al documento
          const currentCards = findCards();
          let card = currentCards[i];
          if (!card) {
            // Si el índice supera las tarjetas visibles, hacer scroll suave en el feed
            const feed = document.querySelector('div[role="feed"]');
            if (feed) {
              feed.scrollTop = feed.scrollHeight;
              await sleep(350);
            }
            const reloadedCards = findCards();
            if (!reloadedCards[i]) break;
            card = reloadedCards[i];
          }

          // Scroll hacia la tarjeta para asegurar visibilidad e interactividad en Google Maps
          try {
            card.scrollIntoView({ block: 'center', behavior: 'smooth' });
          } catch {}
          await sleep(100);

          setStatus(`Extrayendo ${i + 1}/${totalTarget}...`);
          const p = await analyzeBusinessCard(card);
          if (!p || !p.name || /^resultados\b/i.test(p.name)) continue;

          currentScannedList.push(p);
          const businessJson = buildBusinessJsonObject(p);

          if (businessJson.negocio.contacto.whatsapp.numero) {
            withRealPhone++;
          }

          const slugName = (p.name || 'negocio')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

          const row = renderProspectRow(p, businessJson, slugName);
          results.appendChild(row);

          if (p.booking && p.booking.hasBookingSystem === false) noBooking++;
          setStatus(`Analizado ${i + 1}/${totalTarget}: "${p.name}" (${p.phone ? '📞 ' + p.phone : 'Sin tel.'})`);
          await sleep(60);
        } catch (cardErr) {
          console.warn(`Aviso: Error procesando negocio ${i + 1}:`, cardErr);
          // Si por algún motivo la ficha quedó abierta, asegurar regreso al feed antes del siguiente negocio
          if (isPlaceDetailOpen()) {
            await closeDetailAndReturnToFeed();
          }
        }
      }

      setStatus(`✓ ${currentScannedList.length} negocios procesados (${withRealPhone} con WhatsApp real, ${noBooking} sin reservas)`);
    } catch (err) {
      console.error('Error durante el escaneo de prospectos:', err);
      setStatus(`Error durante el análisis: ${err.message || 'Revisar consola'}`);
    } finally {
      isScanning = false;
      shouldCancelScan = false;
      if (scanBtn) {
        scanBtn.textContent = '⚡ Analizar Búsqueda';
        scanBtn.style.background = 'linear-gradient(135deg, #FF5A36, #e11d48)';
      }
    }
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
