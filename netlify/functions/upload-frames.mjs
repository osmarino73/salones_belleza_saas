import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '18113006866e0a5d3dfc002d8d1fabab';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '7883d5ec59ed83172ade90478cc1409b';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '0c89f4bcbefbde8699b99caf71c1df25875bb44b56a802bbce5150ab6a38c724';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kowy-frames';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { slug, files } = JSON.parse(event.body || '{}');

    if (!slug || !files || !Array.isArray(files) || files.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Faltan parámetros requeridos (slug y lista de files).' }),
      };
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    let uploadedCount = 0;

    // Subir los archivos del lote en paralelo a Cloudflare R2
    await Promise.all(
      files.map(async (file) => {
        const rawPath = String(file.relativePath || file.name || '').replace(/^\/+/, '');
        // Eliminar prefijos repetidos tipo 'public/frames/' o 'frames/' si vienen del selector de carpeta
        const cleanRelative = rawPath
          .replace(/^(?:public\/)?frames\//i, '')
          .replace(/^[^\/]+\/(?:public\/)?frames\//i, '');

        const r2Key = `frames/${cleanSlug}/${cleanRelative}`;
        const buffer = Buffer.from(file.dataBase64, 'base64');
        const contentType = cleanRelative.endsWith('.webp')
          ? 'image/webp'
          : cleanRelative.endsWith('.png')
          ? 'image/png'
          : 'image/jpeg';

        await s3.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: r2Key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
          })
        );
        uploadedCount++;
      })
    );

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        uploadedCount,
        slug: cleanSlug,
      }),
    };
  } catch (error) {
    console.error('Error subiendo frames a R2:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'Error interno al subir fotogramas a Cloudflare R2.',
      }),
    };
  }
}
