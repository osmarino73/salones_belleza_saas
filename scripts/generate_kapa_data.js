import fs from 'fs';
import path from 'path';

const htmlRaw = fs.readFileSync('document/kapa_spa/index.html', 'utf8');
const css = fs.readFileSync('document/kapa_spa/styles.css', 'utf8');
let html = htmlRaw.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);

const CDN_IMAGE_MAP = {
  hero_spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  service_facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  about_massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  service_jacuzzi: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
  specialist_elena: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
  specialist_valeria: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  specialist_camila: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80'
};

for (const [key, url] of Object.entries(CDN_IMAGE_MAP)) {
  html = html.split(`assets/images/${key}.jpg`).join(url);
}

const businessJson = JSON.parse(fs.readFileSync('document/kapa_spa/DATOS_NEGOCIO.json', 'utf8'));

const code = `import { ProspectSite } from '../types';

export const KAPA_SPA_SITE_DATA: ProspectSite = ${JSON.stringify({
  id: 'ps-kapa-spa-101',
  slug: 'kapa-spa',
  business_name: 'Kapa Spa',
  phone_whatsapp: '+573244519640',
  address: 'Cra. 92 #97-10',
  city: 'Apartadó',
  country: 'Colombia',
  google_maps_url: 'https://www.google.com/maps/place/Kapa+Spa/@7.8837627,-76.6367651,16z',
  raw_html: html,
  category: 'spa',
  status: 'prospecto',
  views_count: 14,
  business_data: businessJson.negocio,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}, null, 2)};
`;

fs.writeFileSync('src/lib/kapaSpaSiteData.ts', code, 'utf8');
console.log('Successfully generated src/lib/kapaSpaSiteData.ts');
