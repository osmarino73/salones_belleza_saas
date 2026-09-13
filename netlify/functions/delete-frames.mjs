import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

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
    const { slug } = JSON.parse(event.body || '{}');

    if (!slug || typeof slug !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'El parámetro "slug" es requerido.' }),
      };
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/^-+|-+$/g, '');
    const prefix = `frames/${cleanSlug}/`;
    let totalDeleted = 0;
    let continuationToken = undefined;

    // Listar y borrar en lotes de hasta 1000 objetos
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
      }

      continuationToken = listRes.NextContinuationToken;
    } while (continuationToken);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        slug: cleanSlug,
        prefix,
        deletedCount: totalDeleted,
        message: totalDeleted > 0
          ? `Se eliminaron ${totalDeleted} archivos en Cloudflare R2 para "${cleanSlug}".`
          : `No se encontraron archivos en R2 bajo el prefijo "${prefix}".`
      }),
    };
  } catch (error) {
    console.error('Error eliminando frames de R2:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'Error interno al eliminar fotogramas de Cloudflare R2.',
      }),
    };
  }
}
