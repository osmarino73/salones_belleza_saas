const KEY = 'prospects';

async function get() {
  const d = await chrome.storage.local.get({ [KEY]: [] });
  return Array.isArray(d[KEY]) ? d[KEY] : [];
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function clean(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function parseLocation(addressText, plusCodeText = '') {
  const raw = `${addressText || ''} ${plusCodeText || ''}`.trim();
  let ciudad = 'Medellín';
  let departamento_pais = 'Antioquia, Colombia';

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
    { key: 'monteria', city: 'Montería', dept: 'Córdoba, Colombia' },
    { key: 'cucuta', city: 'Cúcuta', dept: 'Norte de Santander, Colombia' },
    { key: 'ibague', city: 'Ibagué', dept: 'Tolima, Colombia' },
    { key: 'villavicencio', city: 'Villavicencio', dept: 'Meta, Colombia' }
  ];

  for (const item of cityMap) {
    if (lower.includes(item.key)) {
      return { ciudad: item.city, departamento_pais: item.dept };
    }
  }

  return { ciudad, departamento_pais };
}

function cleanCategoryString(rawCategory, businessName = '') {
  if (!rawCategory) return '';
  let cat = clean(rawCategory);
  cat = cat.replace(/\d[.,]\d\s*\(\d+[\d.,]*\)/g, '').trim();
  cat = cat.replace(/\b\d[.,]\d\b/g, '').trim();
  cat = cat.replace(/^[·•|\s-]+|[·•|\s-]+$/g, '').trim();
  if (businessName) {
    const escapedName = businessName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cat = cat.replace(new RegExp('^' + escapedName + '\\s*', 'i'), '').trim();
    cat = cat.replace(new RegExp('\\s*' + escapedName + '$', 'i'), '').trim();
  }
  cat = cat.replace(/^[·•|\s-]+|[·•|\s-]+$/g, '').trim();
  return cat;
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

  // Celular colombiano: empieza en 3
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
  // Fijo de Colombia: empieza en 60 -> NO ES WHATSAPP
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
  // Fijo 7 dígitos
  else if (digits.length === 7) {
    international = `+57604${digits}`;
    formatted = `(604) ${digits.slice(0, 3)} ${digits.slice(3)}`;
    isWhatsApp = false;
  }
  // Otros números internacionales
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

function normalizeBusinessData(p, index = 1) {
  const name = p.name || (p.negocio && p.negocio.nombre) || 'Negocio Local';
  const rawCat = cleanCategoryString(p.category || (p.negocio && p.negocio.rubro) || '', name);
  const rawPhone = p.phone || (p.negocio && p.negocio.contacto && (p.negocio.contacto.telefono_principal || (p.negocio.contacto.whatsapp && p.negocio.contacto.whatsapp.numero))) || '';
  const phoneData = normalizePhone(rawPhone);
  const rawAddress = p.address || (p.negocio && p.negocio.ubicacion && p.negocio.ubicacion.direccion) || '';
  const loc = parseLocation(rawAddress, p.plusCode);
  const catKey = detectCategoryKey(rawCat, name);
  const rubro = getRubroName(rawCat, catKey);
  const eslogan = generateSlogan(rubro, name, loc.ciudad);

  const waNumber = phoneData.isWhatsApp ? phoneData.international.replace(/\D/g, '') : '';
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(`Hola ${name}, quisiera solicitar información.`)}` : '';

  const bookingStatus = p.bookingStatus || (p.negocio && p.negocio.sistema_reservas && p.negocio.sistema_reservas.estado) || (p.booking?.hasBookingSystem ? 'CON RESERVAS' : 'SIN RESERVAS');
  const isNoBooking = bookingStatus === 'SIN RESERVAS';

  return {
    id: p.id || (p.negocio && p.negocio.id) || `lead-${Date.now()}-${index}`,
    status: p.status || 'nuevo',
    negocio: {
      nombre: name,
      rubro: rubro,
      categoria: catKey,
      eslogan: eslogan,
      calificacion: p.rating || (p.negocio && p.negocio.calificacion) || '5.0',
      resenas: p.reviews || (p.negocio && p.negocio.resenas) || '0',
      contacto: {
        telefono_principal: phoneData.formatted,
        whatsapp: {
          numero: phoneData.isWhatsApp ? phoneData.international : '',
          link: waLink
        }
      },
      ubicacion: {
        direccion: rawAddress || 'Dirección no visible en Google Maps',
        ciudad: loc.ciudad,
        departamento_pais: loc.departamento_pais,
        google_maps_url: p.googleMapsUrl || (p.negocio && p.negocio.ubicacion && p.negocio.ubicacion.google_maps_url) || 'https://maps.google.com'
      },
      horario_atencion: p.schedule || (p.negocio && p.negocio.horario_atencion) || 'No especificado en Google Maps',
      sitio_web: p.website || (p.negocio && p.negocio.sitio_web) || '',
      sistema_reservas: {
        estado: bookingStatus,
        oportunidad_saas: isNoBooking ? 'ALTA (Lead Calificado)' : 'MEDIA',
        motivo_auditoria: p.website ? 'Sitio web analizado.' : 'Sin sitio web (Oportunidad alta).'
      },
      servicios: (p.services && p.services.length > 0) ? p.services : (p.negocio && p.negocio.servicios) || [],
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

async function copyToClipboard(text, btnElement) {
  try {
    await navigator.clipboard.writeText(text);
    if (btnElement) {
      const original = btnElement.textContent;
      btnElement.textContent = '¡Copiado! ✓';
      btnElement.style.background = '#10b981';
      btnElement.style.color = '#fff';
      setTimeout(() => {
        btnElement.textContent = original;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2000);
    }
  } catch {
    alert('No se pudo copiar automáticamente.');
  }
}

async function deleteProspect(index) {
  const data = await get();
  data.splice(index, 1);
  await chrome.storage.local.set({ [KEY]: data });
  render();
}

async function render() {
  const data = await get();
  document.querySelector('#count').textContent = `${data.length} prospectos guardados`;
  const list = document.querySelector('#list');
  if (!data.length) {
    list.innerHTML = '<div class="empty">Aún no hay prospectos guardados.<br>Haz una búsqueda en Google Maps o abre un negocio y presiona "📍 Extraer Lugar Actual".</div>';
    return;
  }

  list.innerHTML = '';

  data.forEach((p, idx) => {
    const businessObj = normalizeBusinessData(p);
    const slugName = (p.name || 'negocio')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    const item = document.createElement('div');
    item.className = 'item';

    const hasWa = !!businessObj.negocio.contacto.whatsapp.numero;
    const phoneVal = businessObj.negocio.contacto.telefono_principal;
    const phoneBadge = hasWa
      ? `<span style="color:#10b981;font-weight:bold;margin-left:4px;">🟢 WA</span>`
      : (phoneVal && phoneVal !== 'No visible en Google Maps'
        ? `<span style="color:#94a3b8;font-size:11px;margin-left:4px;">☎️ Fijo</span>`
        : `<span style="color:#f59e0b;font-style:italic;font-size:11px;margin-left:4px;">Sin teléfono</span>`);

    item.innerHTML = `
      <div class="item-header">
        <div class="name">${esc(p.name)} ${p.rating ? `<span class="rating-badge">★ ${esc(businessObj.negocio.calificacion)} (${esc(businessObj.negocio.resenas)})</span>` : ''}</div>
        <button class="btn-delete" title="Eliminar este prospecto">×</button>
      </div>
      <div class="meta meta-category">📂 ${esc(businessObj.negocio.rubro || 'Comercio / Servicios')}</div>
      <div class="meta">📍 ${esc(businessObj.negocio.ubicacion.direccion || 'Sin dirección')}</div>
      <div class="meta">🏙️ ${esc(businessObj.negocio.ubicacion.ciudad)} (${esc(businessObj.negocio.ubicacion.departamento_pais)})</div>
      <div class="meta meta-phone">📞 <strong>${esc(phoneVal)}</strong> ${phoneBadge}</div>
      <div class="meta">🌐 ${p.website ? `<a href="${esc(p.website)}" target="_blank">${esc(p.website)}</a>` : '<span style="color:#ef4444;">Sin sitio web</span>'}</div>
      <div class="meta status-badge-container">
        <span class="status-badge ${businessObj.negocio.sistema_reservas.estado === 'CON RESERVAS' ? 'status-ok' : 'status-lead'}">
          ${businessObj.negocio.sistema_reservas.estado === 'CON RESERVAS' ? '✅ CON RESERVAS' : '🔥 SIN RESERVAS (OPORTUNIDAD)'}
        </span>
      </div>

      <div class="item-actions">
        <button class="btn-copy-json" title="Copiar DATOS_NEGOCIO.json al portapapeles">📋 Copiar JSON</button>
        <button class="btn-download-json" title="Descargar DATOS_NEGOCIO.json">📥 Descargar JSON</button>
      </div>
    `;

    item.querySelector('.btn-copy-json').onclick = (e) => {
      copyToClipboard(JSON.stringify(businessObj, null, 2), e.target);
    };

    item.querySelector('.btn-download-json').onclick = () => {
      downloadJson(`DATOS_NEGOCIO_${slugName}.json`, businessObj);
    };

    item.querySelector('.btn-delete').onclick = () => {
      deleteProspect(idx);
    };

    list.appendChild(item);
  });
}

function csvCell(v) {
  return `"${String(v || '').replace(/"/g, '""')}"`;
}

// Copiar todos a JSON (Bundle para CRM Z-Control)
const copyBundleBtn = document.querySelector('#copy-bundle');
if (copyBundleBtn) {
  copyBundleBtn.onclick = async (e) => {
    const data = await get();
    if (!data.length) {
      alert('No hay prospectos guardados para copiar.');
      return;
    }
    const bundle = data.map((p, idx) => normalizeBusinessData(p, idx + 1));
    await copyToClipboard(JSON.stringify(bundle, null, 2), e.target);
  };
}

// Exportar todos a JSON (Bundle para SaaS Homepage Studio y CRM)
document.querySelector('#export-json').onclick = async () => {
  const data = await get();
  if (!data.length) {
    alert('No hay prospectos guardados para exportar.');
    return;
  }
  const bundle = data.map((p, idx) => normalizeBusinessData(p, idx + 1));
  downloadJson(`DATOS_NEGOCIOS_BUNDLE_${new Date().toISOString().slice(0, 10)}.json`, bundle);
};

// Exportar CSV
document.querySelector('#export').onclick = async () => {
  const data = await get();
  if (!data.length) {
    alert('No hay prospectos para exportar.');
    return;
  }
  const header = ['nombre', 'categoria_rubro', 'calificacion', 'resenas', 'telefono_principal', 'whatsapp_numero', 'direccion', 'ciudad', 'sitio_web', 'estado_reservas', 'maps_url', 'fecha_guardado'];
  const rows = data.map((p, idx) => {
    const b = normalizeBusinessData(p, idx + 1);
    return [
      p.name,
      b.negocio.rubro,
      b.negocio.calificacion,
      b.negocio.resenas,
      b.negocio.contacto.telefono_principal,
      b.negocio.contacto.whatsapp.numero,
      b.negocio.ubicacion.direccion,
      b.negocio.ubicacion.ciudad,
      p.website,
      b.negocio.sistema_reservas.estado,
      b.negocio.ubicacion.google_maps_url,
      p.savedAt || new Date().toISOString()
    ].map(csvCell).join(',');
  });

  const blob = new Blob(['\ufeff' + [header.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prospectos-google-maps-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

document.querySelector('#clear').onclick = async () => {
  if (confirm('¿Vaciar todos los prospectos guardados?')) {
    await chrome.storage.local.set({ [KEY]: [] });
    render();
  }
};

render();
