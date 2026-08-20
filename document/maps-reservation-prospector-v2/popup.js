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

function normalizeBusinessData(p) {
  if (p.business_data && p.business_data.negocio) {
    return p.business_data;
  }

  const name = p.name || 'Negocio Local';
  const phone = p.phone || '';
  const digits = phone.replace(/\D/g, '');
  let intPhone = '';

  if (digits.startsWith('57') && digits.length >= 12) {
    intPhone = `+${digits}`;
  } else if (digits.length === 10 && digits.startsWith('3')) {
    intPhone = `+57${digits}`;
  } else if (digits.length > 8) {
    intPhone = `+57${digits}`;
  } else {
    intPhone = `+57${digits || '3000000000'}`;
  }

  const loc = parseLocation(p.address, p.plusCode);

  return {
    negocio: {
      nombre: name,
      rubro: p.category || 'Spa, Centro de Masajes & Bienestar',
      categoria: 'spa',
      eslogan: `Look & Siente Lo Mejor de Ti en ${name}`,
      calificacion: p.rating || '5.0',
      resenas: p.reviews || '1',
      contacto: {
        telefono_principal: phone || intPhone,
        whatsapp: {
          numero: intPhone,
          link: `https://wa.me/${intPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${name}, quisiera cotizar una cita.`)}`
        }
      },
      ubicacion: {
        direccion: p.address || '',
        ciudad: loc.ciudad,
        departamento_pais: loc.departamento_pais,
        google_maps_url: p.googleMapsUrl || 'https://maps.google.com'
      },
      horario_atencion: 'Lunes a Sábado: 8:00 AM – 7:00 PM',
      sitio_web: p.website || '',
      sistema_reservas: {
        estado: p.bookingStatus || 'SIN RESERVAS'
      },
      servicios: [
        { titulo: 'Limpieza Facial Profunda Ultrasónica', descripcion: 'Higiene cutánea con espátula ultrasónica y fototerapia.', precio_cop: 95000, duracion_minutos: 60 },
        { titulo: 'Masaje Relajante con Piedras Calientes', descripcion: 'Terapia geotermal con aceites aromáticos.', precio_cop: 120000, duracion_minutos: 60 },
        { titulo: 'Exfoliación Corporal & Chocolaterapia', descripcion: 'Renovación epidérmica completa con envoltura de cacao.', precio_cop: 140000, duracion_minutos: 75 },
        { titulo: 'Circuito Hidroterapia & Jacuzzi', descripcion: 'Sesión de relajación térmica con sauna y tina.', precio_cop: 80000, duracion_minutos: 45 }
      ],
      especialistas: [
        { nombre: 'Elena Gómez', rol: 'Terapeuta Holística & Masajes', especialidades: ['masajes', 'corporal'] },
        { nombre: 'Valeria Ríos', rol: 'Cosmiatra & Especialista en Piel', especialidades: ['facial', 'peeling'] }
      ]
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
    item.innerHTML = `
      <div class="item-header">
        <div class="name">${esc(p.name)} ${p.rating ? `<span class="rating-badge">★ ${esc(businessObj.negocio.calificacion)} (${esc(businessObj.negocio.resenas)})</span>` : ''}</div>
        <button class="btn-delete" title="Eliminar este prospecto">×</button>
      </div>
      <div class="meta meta-category">📂 ${esc(businessObj.negocio.rubro || p.category || 'Salón & Spa')}</div>
      <div class="meta">📍 ${esc(businessObj.negocio.ubicacion.direccion || p.address || 'Sin dirección')}</div>
      <div class="meta">🏙️ ${esc(businessObj.negocio.ubicacion.ciudad)} (${esc(businessObj.negocio.ubicacion.departamento_pais)})</div>
      <div class="meta meta-phone">📞 ${esc(businessObj.negocio.contacto.whatsapp.numero || p.phone || 'Sin teléfono')}</div>
      <div class="meta">🌐 ${p.website ? `<a href="${esc(p.website)}" target="_blank">${esc(p.website)}</a>` : '<span style="color:#ef4444;">Sin sitio web</span>'}</div>
      <div class="meta status-badge-container">
        <span class="status-badge ${p.bookingStatus === 'CON RESERVAS' ? 'status-ok' : 'status-lead'}">
          ${esc(p.bookingStatus || 'SIN RESERVAS (OPORTUNIDAD)')}
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

// Exportar todos a JSON (Bundle para SaaS Homepage Studio)
document.querySelector('#export-json').onclick = async () => {
  const data = await get();
  if (!data.length) {
    alert('No hay prospectos guardados para exportar.');
    return;
  }
  const bundle = data.map(p => normalizeBusinessData(p));
  downloadJson(`DATOS_NEGOCIOS_BUNDLE_${new Date().toISOString().slice(0, 10)}.json`, bundle);
};

// Exportar CSV
document.querySelector('#export').onclick = async () => {
  const data = await get();
  if (!data.length) {
    alert('No hay prospectos para exportar.');
    return;
  }
  const header = ['nombre', 'categoria_rubro', 'calificacion', 'resenas', 'telefono_whatsapp', 'direccion', 'ciudad', 'sitio_web', 'estado_reservas', 'maps_url', 'fecha_guardado'];
  const rows = data.map(p => {
    const b = normalizeBusinessData(p);
    return [
      p.name,
      b.negocio.rubro,
      b.negocio.calificacion,
      b.negocio.resenas,
      b.negocio.contacto.whatsapp.numero,
      b.negocio.ubicacion.direccion,
      b.negocio.ubicacion.ciudad,
      p.website,
      p.bookingStatus,
      p.googleMapsUrl,
      p.savedAt
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
