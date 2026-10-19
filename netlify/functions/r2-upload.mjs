import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '18113006866e0a5d3dfc002d8d1fabab';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '7883d5ec59ed83172ade90478cc1409b';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '0c89f4bcbefbde8699b99caf71c1df25875bb44b56a802bbce5150ab6a38c724';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'kowy-frames';
const R2_PUBLIC_URL = (process.env.VITE_R2_CDN_URL || 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev').replace(/\/+$/, '');

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
    let bodyData = {};
    if (event.body) {
      try {
        bodyData = JSON.parse(event.body);
      } catch (parseErr) {
        // En caso de que venga con base64 encoding de netlify
        if (event.isBase64Encoded) {
          const decoded = Buffer.from(event.body, 'base64').toString('utf-8');
          bodyData = JSON.parse(decoded);
        }
      }
    }

    const { base64, fileData, filename, folder = 'services', contentType = 'image/webp' } = bodyData;
    const rawData = base64 || fileData;

    if (!rawData) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Falta el contenido de la imagen (base64 o fileData requerido).' }),
      };
    }

    // Limpiar base64 si incluye el prefijo data:...;base64,
    const cleanBase64 = String(rawData).replace(/^data:image\/[a-z0-9-+.]+;base64,/i, '').trim();
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Sanitizar nombre y carpeta
    const safeFolder = String(folder || 'services').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'services';
    const cleanName = String(filename || 'service_image')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    const extension = contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'webp';
    const key = `${safeFolder}/${Date.now()}_${cleanName || 'item'}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    await s3.send(command);

    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        key: key,
        bucket: R2_BUCKET_NAME,
      }),
    };
  } catch (err) {
    console.error('Error al subir a Cloudflare R2:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err?.message || 'Error interno al subir archivo a R2',
      }),
    };
  }
}
