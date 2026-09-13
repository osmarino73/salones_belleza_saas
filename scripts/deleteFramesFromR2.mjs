#!/usr/bin/env node

/**
 * Script de Eliminación de Fotogramas de Cloudflare R2 por Slug
 * Uso:
 *   npm run delete:frames <slug> [--version=v2]
 * Ejemplo:
 *   npm run delete:frames sanus-spa
 *   npm run delete:frames sanus-spa --version=v1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 1. Cargar variables de entorno desde .env y .env.local de forma nativa
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

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '18113006866e0a5d3dfc002d8d1fabab';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '7883d5ec59ed83172ade90478cc1409b';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '0c89f4bcbefbde8699b99caf71c1df25875bb44b56a802bbce5150ab6a38c724';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kowy-frames';

const args = process.argv.slice(2);
const slug = args[0];
const versionArg = args.find(a => a.startsWith('--version=') || a.startsWith('-v='));
const version = versionArg ? versionArg.split('=')[1].trim().toLowerCase() : null;

if (!slug) {
  console.log('\n❌ Error: Debes especificar el slug del negocio a eliminar.');
  console.log('Uso: npm run delete:frames <slug> [--version=v2]');
  process.exit(1);
}

const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/^-+|-+$/g, '');
const versionPrefix = version ? `${version}/` : '';
const prefix = `frames/${cleanSlug}/${versionPrefix}`;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function main() {
  console.log(`\n🗑️  Iniciando eliminación en Cloudflare R2...`);
  console.log(`   Bucket:  ${R2_BUCKET_NAME}`);
  console.log(`   Prefijo: ${prefix}`);

  let totalDeleted = 0;
  let continuationToken = undefined;

  do {
    const listRes = await s3.send(
      new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    const objects = listRes.Contents || [];
    if (objects.length > 0) {
      const deleteParams = {
        Bucket: R2_BUCKET_NAME,
        Delete: {
          Objects: objects.map((obj) => ({ Key: obj.Key })),
          Quiet: true,
        },
      };

      await s3.send(new DeleteObjectsCommand(deleteParams));
      totalDeleted += objects.length;
      process.stdout.write(`   ✓ Eliminados ${totalDeleted} archivos...\r`);
    }

    continuationToken = listRes.NextContinuationToken;
  } while (continuationToken);

  if (totalDeleted > 0) {
    console.log(`\n\n✅ Éxito: Se eliminaron ${totalDeleted} fotogramas de Cloudflare R2 para "${cleanSlug}".`);
  } else {
    console.log(`\nℹ️  No se encontraron archivos en Cloudflare R2 bajo el prefijo "${prefix}".`);
  }
}

main().catch((err) => {
  console.error('\n❌ Error eliminando archivos de R2:', err.message);
  process.exit(1);
});
