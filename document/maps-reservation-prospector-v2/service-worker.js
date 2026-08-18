
const MAX_HTML_BYTES = 1500000;

const BOOKING_PATTERNS = [
  /book\s*(now|online|appointment|a\s*appointment)?/i,
  /reserve\s*(now|online|a\s*table|an?\s*appointment)?/i,
  /reservation/i,
  /appointment/i,
  /schedule\s*(online|now|an?\s*appointment)?/i,
  /reservar|reserva|cita|agendar|agenda\s*tu\s*cita|pedir\s*cita|turno/i,
  /booksy|fresha|treatwell|mindbody|squareup|square\s*appointments|setmore|simplybook|calendly|acuity\s*scheduling|vagaro|boulevard|phorest/i
];

const BOOKING_URL_HINTS = [
  'book', 'booking', 'reserve', 'reservation', 'appointment', 'appointments',
  'schedule', 'cita', 'reservar', 'reserva', 'agendar', 'agenda',
  'booksy', 'fresha', 'treatwell', 'mindbody', 'setmore', 'simplybook',
  'calendly', 'acuityscheduling', 'vagaro', 'boulevard', 'phorest'
];

function normalizeUrl(value) {
  try {
    const u = new URL(value);
    if (!['http:', 'https:'].includes(u.protocol)) return '';
    u.hash = '';
    return u.href;
  } catch {
    return '';
  }
}

function stripHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .slice(0, 400000);
}

function hasBookingSignals(html, finalUrl) {
  const text = stripHtml(html);
  const lowerHtml = html.toLowerCase();
  const urls = [];
  const hrefRe = /(?:href|action)\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = hrefRe.exec(html)) && urls.length < 500) urls.push(m[1]);

  let score = 0;
  const reasons = [];

  for (const p of BOOKING_PATTERNS) {
    if (p.test(text) || p.test(html)) {
      score += 2;
      reasons.push('texto');
      break;
    }
  }

  const hasBookingUrl = urls.some(raw => {
    try {
      const absolute = new URL(raw, finalUrl).href.toLowerCase();
      return BOOKING_URL_HINTS.some(h => absolute.includes(h));
    } catch { return false; }
  });
  if (hasBookingUrl) {
    score += 3;
    reasons.push('enlace');
  }

  // Common embedded booking providers / widgets.
  const providerSignal = [
    'booksy.com', 'fresha.com', 'treatwell.', 'mindbodyonline.com',
    'square.site', 'squareup.com', 'setmore.com', 'simplybook.me',
    'calendly.com', 'acuityscheduling.com', 'vagaro.com',
    'boulevard.io', 'phorest.com'
  ].some(x => lowerHtml.includes(x));
  if (providerSignal) {
    score += 4;
    reasons.push('proveedor');
  }

  // Reservation-related forms or iframes are stronger than generic text.
  if (/<(?:form|iframe)\b[^>]*(?:book|reserv|appoint|cita|agenda|schedule)/i.test(html)) {
    score += 4;
    reasons.push('formulario/widget');
  }

  return {
    hasBookingSystem: score >= 3,
    score,
    reasons: [...new Set(reasons)]
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'OPEN_POPUP') {
    if (chrome.action?.openPopup) {
      chrome.action.openPopup().catch(() => {});
    }
    return;
  }
  if (message?.type !== 'CHECK_WEBSITE') return;

  const url = normalizeUrl(message.url);
  if (!url) {
    sendResponse({ ok: false, error: 'URL no válida.' });
    return;
  }

  (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
        headers: { 'Accept': 'text/html,application/xhtml+xml' }
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        sendResponse({
          ok: true,
          url,
          finalUrl: response.url || url,
          reachable: false,
          hasBookingSystem: false,
          confidence: 'unknown',
          reason: `El sitio respondió HTTP ${response.status}.`
        });
        return;
      }

      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        sendResponse({
          ok: true, url, finalUrl: response.url || url,
          reachable: true, hasBookingSystem: false,
          confidence: 'unknown',
          reason: 'La URL no devolvió una página HTML.'
        });
        return;
      }

      const reader = response.body?.getReader();
      let html = '';
      if (reader) {
        const decoder = new TextDecoder();
        while (html.length < MAX_HTML_BYTES) {
          const {value, done} = await reader.read();
          if (done) break;
          html += decoder.decode(value, {stream: true});
          if (html.length >= MAX_HTML_BYTES) {
            try { await reader.cancel(); } catch {}
            break;
          }
        }
      } else {
        html = await response.text();
      }

      const result = hasBookingSignals(html.slice(0, MAX_HTML_BYTES), response.url || url);
      sendResponse({
        ok: true,
        url,
        finalUrl: response.url || url,
        reachable: true,
        hasBookingSystem: result.hasBookingSystem,
        confidence: result.score >= 6 ? 'high' : result.score >= 3 ? 'medium' : 'low',
        reason: result.reasons.length ? `Señales: ${result.reasons.join(', ')}.` : 'No se encontraron señales de reserva en el HTML.'
      });
    } catch (error) {
      sendResponse({
        ok: true, url,
        reachable: false,
        hasBookingSystem: false,
        confidence: 'unknown',
        reason: error?.name === 'AbortError' ? 'Tiempo de espera agotado.' : 'No fue posible consultar el sitio.'
      });
    } finally {
      clearTimeout(timer);
    }
  })();

  return true;
});
