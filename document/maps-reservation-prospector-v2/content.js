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

  // Extraer Nombre del Negocio
  function extractName(card) {
    // 1. Selector principal en Google Maps 2024-2026
    const headline = card.querySelector('.qBF1Pd, .fontHeadlineSmall, [role="heading"]');
    if (headline && clean(headline.textContent)) {
      return clean(headline.textContent);
    }

    // 2. Etiqueta aria-label del enlace al lugar
    const link = card.querySelector('a.hfpxzc, a[href*="/maps/place/"]');
    if (link) {
      const aria = clean(link.getAttribute('aria-label'));
      if (aria) return aria.replace(/\s*-\s*Google Maps.*$/i, '').trim();
      const text = clean(link.textContent);
      if (text) return text.split('\n')[0].trim();
    }
    return '';
  }

  // Extraer Sitio Web
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

  // Extraer Calificación y Reseñas
  function extractRatingAndReviews(card) {
    const ratingEl = card.querySelector('span.MW4etd, span[aria-hidden="true"]');
    let rating = ratingEl ? clean(ratingEl.textContent) : '';
    if (!/^\d[.,]\d$/.test(rating)) {
      const match = (card.textContent || '').match(/\b([1-5][.,]\d)\b/);
      rating = match ? match[1] : '';
    }

    const reviewsEl = card.querySelector('span.UY7F9, span[aria-label*="reseñas" i], span[aria-label*="reviews" i]');
    let reviews = reviewsEl ? clean(reviewsEl.textContent).replace(/[()]/g, '') : '';
    if (!reviews) {
      const match = (card.textContent || '').match(/\(([0-9.,]+)\)/);
      reviews = match ? match[1] : '';
    }

    return { rating, reviews };
  }

  // Extraer Dirección y Teléfono de los contenedores de texto de Google Maps
  function extractAddressAndPhone(card) {
    let address = '';
    let phone = '';
    let category = '';

    // 1. Revisar si hay botones directos de datos
    const addressBtn = card.querySelector('button[data-item-id="address"], [aria-label*="Dirección:" i], [aria-label*="Address:" i]');
    if (addressBtn) {
      address = clean(addressBtn.getAttribute('aria-label')?.replace(/^(Dirección|Address):\s*/i, '') || addressBtn.textContent);
    }

    const phoneBtn = card.querySelector('button[data-item-id*="phone"], a[href^="tel:"], [aria-label*="Teléfono:" i], [aria-label*="Phone:" i]');
    if (phoneBtn) {
      if (phoneBtn.tagName.toLowerCase() === 'a' && phoneBtn.href.startsWith('tel:')) {
        phone = clean(phoneBtn.href.replace('tel:', ''));
      } else {
        phone = clean(phoneBtn.getAttribute('aria-label')?.replace(/^(Teléfono|Phone):\s*/i, '') || phoneBtn.textContent);
      }
    }

    // 2. Extraer todas las líneas de texto secundarias (div.W4Efsd, fontBodyMedium)
    const textContainers = card.querySelectorAll('div.W4Efsd, .fontBodyMedium');
    const rawLines = [];

    textContainers.forEach(el => {
      const txt = clean(el.textContent);
      if (txt && !rawLines.includes(txt)) {
        rawLines.push(txt);
      }
    });

    // Regex para identificar direcciones en Colombia / Latam
    const addressKeywordsRegex = /\b(calle|cl\.?|carrera|cra\.?|cr\.?|av\.?|avenida|diagonal|diag\.?|transversal|tv\.?|circunvalar|manzana|mz\.?|barrio|piso|local|autopista|km|apartad[oó]|medell[ií]n|bogot[aá]|cali|barranquilla|cartagena|pereira|bucaramanga|colombia|#|n°|no\.|\d{1,5}\s*#|\d{2,}\s*-\s*\d+)/i;
    
    // Regex para números telefónicos (Celulares colombianos 3XX, fijos 60X o con código de país +57)
    const phoneRegex = /(?:\+?57\s?)?(?:3\d{2}[-.\s]?\d{3}[-.\s]?\d{4}|(?:60\d|\(?0\d{1,2}\)?|\(?\d{3}\)?)[-.\s]?\d{3}[-.\s]?\d{4}|\b3\d{9}\b)/;

    for (const line of rawLines) {
      // Buscar teléfono en la línea si aún no lo tenemos
      if (!phone) {
        const phoneMatch = line.match(phoneRegex);
        if (phoneMatch && !phoneMatch[0].includes('6 p. m.') && !phoneMatch[0].includes('12:')) {
          phone = clean(phoneMatch[0]);
        }
      }

      // Dividir por punto medio de Google Maps ('·' o '•')
      const parts = line.split(/[·•]/).map(p => clean(p)).filter(Boolean);

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Ignorar horarios y estados como "Abierto", "Cierra a las...", "Cerrado"
        if (/^(abierto|cerrado|cierra|abre|open|closed|horario|24 horas)/i.test(part)) {
          continue;
        }

        // Ignorar textos de reseñas como "5,0 (44)" o citas entre comillas
        if (/^"[^"]+"$/.test(part) || /^\d[.,]\d\s*\(\d+\)/.test(part)) {
          continue;
        }

        // Si parece una dirección
        if (!address && addressKeywordsRegex.test(part)) {
          address = part;
          // La categoría suele ser la parte anterior
          if (i > 0 && !category && !addressKeywordsRegex.test(parts[i - 1])) {
            category = parts[i - 1];
          }
        } else if (!category && !address && part.length < 40 && !/\d/.test(part)) {
          category = part;
        }
      }
    }

    // Fallback: si no encontró dirección por palabras clave pero hay una línea que no es categoría ni horario
    if (!address) {
      for (const line of rawLines) {
        const parts = line.split(/[·•]/).map(p => clean(p)).filter(Boolean);
        for (const part of parts) {
          if (!/^(abierto|cerrado|cierra|abre|open|closed|horario)/i.test(part) && 
              !category.includes(part) && 
              part.length > 8 && 
              /\d/.test(part) && 
              !part.includes(phone)) {
            address = part;
            break;
          }
        }
        if (address) break;
      }
    }

    return { address, phone, category };
  }

  // Buscar todas las tarjetas de negocios visibles en Google Maps
  function findCards() {
    // 1. Selector directo de items de lista en Google Maps
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

    // 2. Fallback por enlaces
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

  function extractBusiness(card) {
    const name = extractName(card);
    const { address, phone, category } = extractAddressAndPhone(card);
    const website = extractWebsite(card);
    const { rating, reviews } = extractRatingAndReviews(card);

    return {
      name: clean(name),
      category: clean(category),
      rating: clean(rating),
      reviews: clean(reviews),
      phone: clean(phone),
      address: clean(address),
      website: clean(website)
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
      saved.push({
        name: p.name,
        category: p.category || '',
        rating: p.rating || '',
        reviews: p.reviews || '',
        phone: p.phone || '',
        address: p.address || '',
        website: p.website || '',
        bookingStatus: p.booking?.hasBookingSystem === true ? 'CON RESERVAS' : p.booking?.hasBookingSystem === false ? 'SIN RESERVAS' : 'REVISAR',
        savedAt: new Date().toISOString()
      });
      await chrome.storage.local.set({ [STORAGE_KEY]: saved });
    }
    return !exists;
  }

  function createPanel() {
    if (document.getElementById(ROOT_ID)) return;
    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.innerHTML = `
      <div class="mrp-header">
        <div>
          <strong>Maps Prospector</strong>
          <span id="mrp-status">Listo para analizar</span>
        </div>
        <button id="mrp-close" title="Cerrar">×</button>
      </div>
      <div class="mrp-toolbar">
        <button id="mrp-scan">⚡ Analizar resultados</button>
        <button id="mrp-open">📋 Prospectos <span id="mrp-count">0</span></button>
      </div>
      <div id="mrp-results"></div>
      <div id="mrp-note">Detección de reservas y extracción de datos potenciada para Google Maps.</div>
    `;
    document.documentElement.appendChild(root);

    root.querySelector('#mrp-close').onclick = () => root.remove();
    root.querySelector('#mrp-scan').onclick = scan;
    root.querySelector('#mrp-open').onclick = () => chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    updateCount();
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

  function addBadge(card, state, title) {
    card.querySelector(`.${BADGE_CLASS}`)?.remove();
    const badge = document.createElement('div');
    badge.className = `${BADGE_CLASS} mrp-${state}`;
    badge.textContent = state === 'no-booking' ? 'SIN RESERVAS' : state === 'booking' ? 'CON RESERVAS' : 'REVISAR';
    badge.title = title || '';
    card.style.position = card.style.position || 'relative';
    card.appendChild(badge);
  }

  async function analyzeBusiness(card) {
    const p = extractBusiness(card);
    if (!p.name) return null;

    if (!p.website) {
      addBadge(card, 'no-booking', 'No tiene sitio web configurado.');
      return { ...p, booking: { hasBookingSystem: false, confidence: 'high', reason: 'Sin sitio web (Oportunidad alta).' } };
    }

    addBadge(card, 'checking', 'Consultando sitio web...');
    try {
      const result = await chrome.runtime.sendMessage({ type: 'CHECK_WEBSITE', url: p.website });
      if (!result?.ok || result.confidence === 'unknown') {
        addBadge(card, 'review', result?.reason || 'No fue posible verificar.');
      } else if (result.hasBookingSystem) {
        addBadge(card, 'booking', result.reason);
      } else {
        addBadge(card, 'no-booking', result.reason);
      }
      return { ...p, booking: result };
    } catch {
      addBadge(card, 'review', 'Verificación manual requerida');
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
      await sleep(500);
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
    let cards = findCards();
    setStatus(`${cards.length} resultados iniciales`);

    await loadMoreResults();
    const allCards = findCards();
    if (!allCards.length) {
      results.innerHTML = '<div class="mrp-empty">No se encontraron negocios. Realiza una búsqueda (ej: odontología, salones) y vuelve a analizar.</div>';
      return;
    }
    setStatus(`Analizando ${allCards.length} negocios...`);
    let noBooking = 0;

    for (let i = 0; i < allCards.length; i++) {
      setStatus(`Analizando ${i + 1}/${allCards.length}`);
      const p = await analyzeBusiness(allCards[i]);
      if (!p) continue;

      const row = document.createElement('div');
      row.className = 'mrp-row';
      row.innerHTML = `
        <div class="mrp-row-title">${escapeHtml(p.name)} ${p.rating ? `<span style="font-size:11px;color:#d97706;font-weight:bold;">★ ${escapeHtml(p.rating)} (${escapeHtml(p.reviews || '0')})</span>` : ''}</div>
        ${p.category ? `<div class="mrp-row-data" style="color:#059669;font-weight:bold;">📂 ${escapeHtml(p.category)}</div>` : ''}
        <div class="mrp-row-data">📍 <strong>Dirección:</strong> ${escapeHtml(p.address || 'Dirección no visible en lista')}</div>
        <div class="mrp-row-data">📞 <strong>Teléfono:</strong> ${p.phone ? `<span style="color:#2563eb;font-weight:bold;">${escapeHtml(p.phone)}</span>` : '<span style="color:#9ca3af;">No disponible en lista</span>'}</div>
        <div class="mrp-row-data">🌐 <strong>Web:</strong> ${p.website ? `<a href="${escapeAttr(p.website)}" target="_blank" rel="noopener">${escapeHtml(p.website)}</a>` : '<span style="color:#ef4444;font-weight:bold;">Sin sitio web</span>'}</div>
        <div class="mrp-row-data" style="margin-top:4px;"><strong>Estado:</strong> <span style="font-weight:bold;color:${p.booking?.hasBookingSystem ? '#16a34a' : '#d97706'}">${p.booking?.hasBookingSystem === true ? '✅ CON RESERVAS' : p.booking?.hasBookingSystem === false ? '🔥 SIN RESERVAS (OPORTUNIDAD)' : '⚠️ REVISAR'}</span></div>
        <div class="mrp-row-actions"><button class="mrp-save">Guardar prospecto</button></div>
      `;
      row.querySelector('.mrp-save').onclick = async () => {
        const added = await saveProspect(p);
        row.querySelector('.mrp-save').textContent = added ? 'Guardado ✓' : 'Ya estaba guardado';
        await updateCount();
      };
      results.appendChild(row);

      if (p.booking && p.booking.hasBookingSystem === false) noBooking++;
      await sleep(50);
    }

    setStatus(`${noBooking} prospectos sin reservas detectados`);
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
    if (document.querySelector('a[href*="/maps/place/"], div.Nv2PK')) {
      createPanel();
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true });

  createPanel();
})();
