/**
 * BEAUTYFLOW AI - PROSPECT FOLDER IMPORTER CLI
 * 
 * Permite empaquetar e importar cualquier carpeta de negocio generada (ej. document/luxus_beauty_spa)
 * a BeautyFlow AI.
 * 
 * Uso:
 *   node scripts/import_prospect_folder.js document/luxus_beauty_spa
 *   node scripts/import_prospect_folder.js --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitizeSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const CDN_IMAGE_MAP = {
  // Spas & Masajes
  hero_spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  service_facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  about_massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  service_jacuzzi: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
  hero_salon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  hero_barber: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  hero_nails: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
  // Especialistas
  specialist_elena: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
  specialist_valeria: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  specialist_camila: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80'
};

function getCdnUrlForImagePath(imgPath, category = 'spa') {
  const lower = imgPath.toLowerCase();
  for (const [key, url] of Object.entries(CDN_IMAGE_MAP)) {
    if (lower.includes(key)) return url;
  }
  if (lower.includes('facial')) return CDN_IMAGE_MAP.service_facial;
  if (lower.includes('massage') || lower.includes('masaje') || lower.includes('piedras')) return CDN_IMAGE_MAP.about_massage;
  if (lower.includes('jacuzzi') || lower.includes('hidro')) return CDN_IMAGE_MAP.service_jacuzzi;
  if (lower.includes('specialist') || lower.includes('terapeuta') || lower.includes('estilista')) return CDN_IMAGE_MAP.specialist_valeria;
  if (category === 'spa') return CDN_IMAGE_MAP.hero_spa;
  if (category === 'barberia') return CDN_IMAGE_MAP.hero_barber;
  if (category === 'nails') return CDN_IMAGE_MAP.hero_nails;
  return CDN_IMAGE_MAP.hero_salon;
}

function buildStandaloneHtml(folderPath, category = 'spa') {
  const indexHtmlPath = path.join(folderPath, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`No se encontró index.html en ${folderPath}`);
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  const stylesPath = path.join(folderPath, 'styles.css');

  // Inyectar CSS dentro del <style>
  if (fs.existsSync(stylesPath)) {
    const css = fs.readFileSync(stylesPath, 'utf8');
    if (html.includes('<link rel="stylesheet" href="styles.css">')) {
      html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }
  }

  // Reemplazar rutas locales src="assets/images/..." con la URL CDN contextual exacta
  html = html.replace(/src=["'](assets\/images\/[^"']+)["']/gi, (match, p1) => {
    const cdnUrl = getCdnUrlForImagePath(p1, category);
    return `src="${cdnUrl}"`;
  });

  // Reemplazar fondos CSS url("assets/images/...")
  html = html.replace(/url\(["']?(assets\/images\/[^)"']+)["']?\)/gi, (match, p1) => {
    const cdnUrl = getCdnUrlForImagePath(p1, category);
    return `url("${cdnUrl}")`;
  });

  // Reemplazar cualquier Base64 residual pesado
  html = html.replace(/src=["']data:image\/[^"']+["']/gi, `src="${CDN_IMAGE_MAP.hero_spa}"`);
  html = html.replace(/url\(["']?data:image\/[^)"']+["']?\)/gi, `url("${CDN_IMAGE_MAP.hero_spa}")`);

  return html;
}

function processFolder(folderPath) {
  const resolvedPath = path.resolve(process.cwd(), folderPath);
  console.log(`\n📦 Procesando carpeta: ${resolvedPath}`);

  const jsonPath = path.join(resolvedPath, 'DATOS_NEGOCIO.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ No se encontró DATOS_NEGOCIO.json en ${resolvedPath}`);
    return null;
  }

  const rawJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const negocio = rawJson.negocio || rawJson;

  const standaloneHtml = buildStandaloneHtml(resolvedPath);
  const slug = sanitizeSlug(negocio.nombre || path.basename(resolvedPath));

  // Detectar categoría
  const rubroText = ((negocio.rubro || '') + ' ' + (negocio.nombre || '')).toLowerCase();
  let category = 'salon';
  if (rubroText.includes('barber')) category = 'barberia';
  else if (rubroText.includes('spa') || rubroText.includes('relax')) category = 'spa';
  else if (rubroText.includes('nail') || rubroText.includes('uña')) category = 'nails';
  else if (rubroText.includes('estetic') || rubroText.includes('facial')) category = 'estetica';

  const prospectSite = {
    id: `ps-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    slug,
    business_name: negocio.nombre,
    phone_whatsapp: negocio.contacto?.whatsapp?.numero || negocio.contacto?.telefono_principal || '+573000000000',
    address: negocio.ubicacion?.direccion || '',
    city: negocio.ubicacion?.ciudad || 'Medellín',
    country: 'Colombia',
    google_maps_url: negocio.ubicacion?.google_maps_url || '',
    category,
    status: 'prospecto',
    views_count: 0,
    raw_html: standaloneHtml,
    business_data: negocio,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log(`✅ Sitio Gancho compilado con éxito:`);
  console.log(`   - Nombre: ${prospectSite.business_name}`);
  console.log(`   - Slug: /sitio/${prospectSite.slug}`);
  console.log(`   - WhatsApp: ${prospectSite.phone_whatsapp}`);
  console.log(`   - Servicios: ${negocio.servicios ? negocio.servicios.length : 0}`);
  console.log(`   - Especialistas: ${negocio.especialistas ? negocio.especialistas.length : 0}`);
  console.log(`   - Tamaño HTML: ${(standaloneHtml.length / 1024).toFixed(1)} KB`);

  return prospectSite;
}

// CLI Execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Uso: node scripts/import_prospect_folder.js <ruta_carpeta>');
  console.log('Ejemplo: node scripts/import_prospect_folder.js document/luxus_beauty_spa');
  process.exit(0);
}

if (args[0] === '--all') {
  const documentDir = path.join(process.cwd(), 'document');
  if (fs.existsSync(documentDir)) {
    const items = fs.readdirSync(documentDir);
    for (let item of items) {
      const fullPath = path.join(documentDir, item);
      if (fs.statSync(fullPath).isDirectory() && item !== 'maps-reservation-prospector-v2') {
        processFolder(fullPath);
      }
    }
  }
} else {
  processFolder(args[0]);
}
