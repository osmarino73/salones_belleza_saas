const KEY = 'prospects';

async function get() {
  const d = await chrome.storage.local.get({ [KEY]: [] });
  return Array.isArray(d[KEY]) ? d[KEY] : [];
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function render() {
  const data = await get();
  document.querySelector('#count').textContent = `${data.length} prospectos guardados`;
  const list = document.querySelector('#list');
  if (!data.length) {
    list.innerHTML = '<div class="empty">Aún no hay prospectos guardados. Realiza una búsqueda en Google Maps y presiona "Guardar prospecto".</div>';
    return;
  }

  list.innerHTML = data.map(p => `
    <div class="item" style="border-bottom:1px solid #e5e7eb;padding:8px 0;">
      <div class="name" style="font-weight:bold;font-size:13px;">${esc(p.name)} ${p.rating ? `<span style="font-size:11px;color:#d97706;">★ ${esc(p.rating)} (${esc(p.reviews || '0')})</span>` : ''}</div>
      ${p.category ? `<div class="meta" style="color:#059669;font-weight:600;font-size:11px;">📂 ${esc(p.category)}</div>` : ''}
      <div class="meta" style="font-size:11px;color:#4b5563;">📍 ${esc(p.address || 'Sin dirección')}</div>
      <div class="meta" style="font-size:11px;color:#2563eb;font-weight:600;">📞 ${esc(p.phone || 'Sin teléfono')}</div>
      <div class="meta" style="font-size:11px;">🌐 ${p.website ? `<a href="${esc(p.website)}" target="_blank" style="color:#1d4ed8;">${esc(p.website)}</a>` : '<span style="color:#ef4444;">Sin sitio web</span>'}</div>
      <div class="meta" style="font-size:10px;font-weight:bold;margin-top:2px;">Estado: <span style="color:${p.bookingStatus === 'CON RESERVAS' ? '#16a34a' : '#d97706'}">${esc(p.bookingStatus || 'SIN RESERVAS')}</span></div>
    </div>`).join('');
}

function csvCell(v) {
  return `"${String(v || '').replace(/"/g, '""')}"`;
}

document.querySelector('#export').onclick = async () => {
  const data = await get();
  if (!data.length) {
    alert('No hay prospectos para exportar.');
    return;
  }
  const header = ['nombre', 'categoria', 'calificacion', 'resenas', 'telefono', 'direccion', 'sitio_web', 'estado_reservas', 'fecha_guardado'];
  const rows = data.map(p => [
    p.name,
    p.category,
    p.rating,
    p.reviews,
    p.phone,
    p.address,
    p.website,
    p.bookingStatus,
    p.savedAt
  ].map(csvCell).join(','));

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
