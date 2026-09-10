#!/usr/bin/env node

/**
 * Script de Subida Automatizada de Frames a Cloudflare R2
 * Uso:
 *   npm run upload:frames <slug> [ruta-carpeta-frames]
 * Ejemplo:
 *   npm run upload:frames sanus-spa
 *   npm run upload:frames sanus-spa "C:\Users\Rio Belen\negocios_locales\sanus_spa\public\frames"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Cargar variables de entorno desde .env y .env.local de forma nativa sin dependencias extra
function loadEnv() {
  const envPaths = [path.join(projectRoot, '.env.local'), path.join(projectRoot, '.env')];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      }
    }
  }
}

loadEnv();

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kowy-frames';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.VITE_R2_CDN_URL;

// 2. Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
const slug = args[0];
const versionArg = args.find(a => a.startsWith('--version=') || a.startsWith('-v='));
const version = versionArg ? versionArg.split('=')[1].trim().toLowerCase() : null;
// El segundo argumento es la carpeta origen (excluyendo si era un flag --version)
let sourceFramesFolder = args.slice(1).find(a => !a.startsWith('--version=') && !a.startsWith('-v='));

if (!slug) {
  console.log('\n❌ Error: Debes especificar el slug del negocio.');
  console.log('📌 Uso:');
  console.log('   npm run upload:frames <slug> [carpeta-local-frames] [--version=v2]\n');
  console.log('💡 Ejemplos:');
  console.log('   npm run upload:frames sanus-spa');
  console.log('   npm run upload:frames sanus-spa --version=v2');
  console.log('   npm run upload:frames sanus-spa "C:\\Users\\Rio Belen\\negocios_locales\\sanus_spa\\public\\frames" --version=v2\n');
  process.exit(1);
}

// 3. Resolver la carpeta de origen de los frames
if (!sourceFramesFolder) {
  const defaultLocal = path.join(projectRoot, 'public', 'frames', slug);
  const fallbackDoc = path.join(projectRoot, 'document', slug.replace(/-/g, '_'), 'public', 'frames');
  const fallbackNegocios = path.resolve(projectRoot, '..', 'negocios_locales', slug.replace(/-/g, '_'), 'public', 'frames');
  const fallbackNegociosHyphen = path.resolve(projectRoot, '..', 'negocios_locales', slug, 'public', 'frames');

  if (fs.existsSync(defaultLocal)) {
    sourceFramesFolder = defaultLocal;
  } else if (fs.existsSync(fallbackDoc)) {
    sourceFramesFolder = fallbackDoc;
  } else if (fs.existsSync(fallbackNegocios)) {
    sourceFramesFolder = fallbackNegocios;
  } else if (fs.existsSync(fallbackNegociosHyphen)) {
    sourceFramesFolder = fallbackNegociosHyphen;
  }
}

if (!sourceFramesFolder || !fs.existsSync(sourceFramesFolder)) {
  console.log(`\n❌ Error: No se encontró la carpeta de frames para "${slug}".`);
  console.log(`Buscado en: ${sourceFramesFolder || 'public/frames/' + slug}`);
  console.log('Por favor indica la ruta exacta como segundo argumento.\n');
  process.exit(1);
}

// 4. Validar credenciales de Cloudflare R2
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.log('\n⚠️ ADVERTENCIA: Faltan credenciales de Cloudflare R2 en tu archivo .env o .env.local:');
  console.log('   - R2_ACCOUNT_ID');
  console.log('   - R2_ACCESS_KEY_ID');
  console.log('   - R2_SECRET_ACCESS_KEY');
  console.log('   - R2_BUCKET_NAME (opcional, por defecto "kowy-frames")');
  console.log('   - R2_PUBLIC_URL (ej. https://pub-xxxx.r2.dev o https://cdn.kowy.app)\n');
  console.log('📌 Crea o edita tu archivo .env.local con estas variables antes de subir.');
  process.exit(1);
}

// 5. Inicializar cliente S3 para Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
});

// 6. Recorrer y recopilar todos los archivos WebP a subir
function collectFiles(dir, baseDir = '') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(collectFiles(fullPath, relPath));
    } else if (file.toLowerCase().endsWith('.webp')) {
      results.push({ fullPath, relPath, size: stat.size });
    }
  }
  return results;
}

const filesToUpload = collectFiles(sourceFramesFolder);

if (filesToUpload.length === 0) {
  console.log(`\n❌ Error: No se encontraron archivos .webp en la carpeta: ${sourceFramesFolder}`);
  process.exit(1);
}

console.log(`\n🚀 Iniciando subida a Cloudflare R2...`);
console.log(`📁 Carpeta local: ${sourceFramesFolder}`);
console.log(`🏢 Negocio (Slug): ${slug}`);
console.log(`🪣 Bucket R2:     ${R2_BUCKET_NAME}`);
console.log(`📦 Total archivos: ${filesToUpload.length} fotogramas WebP\n`);

// 7. Ejecutar subida en lotes concurrentes (máximo 8 conexiones paralelas)
const CONCURRENCY = 8;
let completed = 0;
let errorsCount = 0;

async function uploadSingleFile(fileItem) {
  const versionPrefix = version ? `${version.replace(/[^a-z0-9-_]/g, '')}/` : '';
  const r2Key = `frames/${slug}/${versionPrefix}${fileItem.relPath}`;
  const fileBuffer = fs.readFileSync(fileItem.fullPath);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable'
  });

  try {
    await s3Client.send(command);
    completed++;
    const kb = (fileItem.size / 1024).toFixed(1);
    const pct = Math.round((completed / filesToUpload.length) * 100);
    process.stdout.write(`\r⏳ Progreso: [${completed}/${filesToUpload.length}] (${pct}%) - Subido: ${r2Key} (${kb} KB)`);
  } catch (err) {
    errorsCount++;
    console.error(`\n❌ Error subiendo ${r2Key}:`, err.message);
  }
}

async function runQueue() {
  const queue = [...filesToUpload];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) {
        await uploadSingleFile(item);
      }
    }
  });

  await Promise.all(workers);
}

const startTime = Date.now();

runQueue().then(() => {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n✨ ¡Subida completada en ${duration}s!`);
  console.log(`✅ Archivos subidos con éxito: ${completed}`);
  if (errorsCount > 0) {
    console.log(`⚠️ Archivos con errores:      ${errorsCount}`);
  }

  if (R2_PUBLIC_URL) {
    const cleanUrl = R2_PUBLIC_URL.replace(/\/+$/, '');
    console.log('\n🌐 Enlaces públicos generados en tu CDN:');
    console.log(`   Poster Desktop: ${cleanUrl}/frames/${slug}/desktop/poster.webp`);
    console.log(`   Poster Mobile:  ${cleanUrl}/frames/${slug}/mobile/poster.webp`);
    console.log(`   Ruta base CDN:  ${cleanUrl}/frames/${slug}/`);
  }
  console.log('\n🎉 Tu landing page ahora servirá los frames directamente desde Cloudflare R2 con 0 latencia y 0 consumo en GitHub.\n');
}).catch(err => {
  console.error('\n❌ Error fatal en el proceso de subida:', err);
  process.exit(1);
});
