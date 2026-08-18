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

function buildStandaloneHtml(folderPath) {
  const indexHtmlPath = path.join(folderPath, 'index.html');
  const standalonePath = path.join(folderPath, 'luxus_beauty_spa_standalone.html');

  // Si ya existe un standalone.html
  if (fs.existsSync(standalonePath)) {
    return fs.readFileSync(standalonePath, 'utf8');
  }

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`No se encontró index.html en ${folderPath}`);
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  const stylesPath = path.join(folderPath, 'styles.css');

  // Inyectar CSS
  if (fs.existsSync(stylesPath)) {
    const css = fs.readFileSync(stylesPath, 'utf8');
    if (html.includes('<link rel="stylesheet" href="styles.css">')) {
      html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
    } else if (html.includes('</head>')) {
      html = html.replace('</head>', `<style>\n${css}\n</style>\n</head>`);
    }
  }

  // Embeber imágenes en Base64
  const imgDir = path.join(folderPath, 'assets', 'images');
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    for (let file of files) {
      const ext = path.extname(file).replace('.', '').toLowerCase();
      const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      const imgPath = path.join(imgDir, file);
      const base64 = fs.readFileSync(imgPath).toString('base64');
      const dataUri = `data:${mime};base64,${base64}`;
      const relativePath = `assets/images/${file}`;
      html = html.split(relativePath).join(dataUri);
    }
  }

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
