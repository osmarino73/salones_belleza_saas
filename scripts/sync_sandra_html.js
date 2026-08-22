import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const url = 'https://ascskenpfcnyejaamjlb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY3NrZW5wZmNueWVqYWFtamxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4ODQxNzQsImV4cCI6MjEwMjQ2MDE3NH0.fWK-nu3qEyBXH-r8n2GScQ21Lu2n93C6NUipar6ldP4';
const supabase = createClient(url, key);

async function syncLocalToSupabase() {
  const localHtmlPath = 'C:/Users/Rio Belen/negocios_locales/sandra_colors/index.html';
  const imgPath = 'C:/Users/Rio Belen/negocios_locales/sandra_colors/modelo1.webp';
  
  const localHtml = fs.readFileSync(localHtmlPath, 'utf8');
  const imgBuf = fs.readFileSync(imgPath);
  const base64Img = `data:image/webp;base64,${imgBuf.toString('base64')}`;
  
  // Reemplazar la ruta local ./modelo1.webp o ./assets/modelo1.webp por el Base64 incrustado autónomo
  const processedHtml = localHtml.replace(/src=["']\.\/(?:assets\/)?modelo1\.webp["']/g, `src="${base64Img}"`);

  const { error } = await supabase
    .from('prospect_sites')
    .update({ raw_html: processedHtml })
    .ilike('business_name', '%sandra%');

  if (error) {
    console.error('Error actualizando Supabase:', error.message);
  } else {
    console.log('✅ HTML y Fotografía del Hero a Pantalla Completa sincronizados con éxito en Supabase.');
  }
}

syncLocalToSupabase();
