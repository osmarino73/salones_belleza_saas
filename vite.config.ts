import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function localFramesUploadPlugin() {
  return {
    name: 'local-frames-upload',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/upload-frames' && req.method === 'POST') {
          try {
            // Leer cuerpo JSON
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const { slug, files } = JSON.parse(body || '{}');

            if (!slug || !files || !Array.isArray(files)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Faltan parámetros requeridos (slug o files).' }));
              return;
            }

            // Cargar credenciales R2
            let r2Acc = process.env.R2_ACCOUNT_ID;
            let r2Key = process.env.R2_ACCESS_KEY_ID;
            let r2Sec = process.env.R2_SECRET_ACCESS_KEY;
            let r2Bkt = process.env.R2_BUCKET_NAME || 'kowy-frames';

            const envLocalPath = path.resolve(process.cwd(), '.env.local');
            if (fs.existsSync(envLocalPath)) {
              const content = fs.readFileSync(envLocalPath, 'utf-8');
              for (const line of content.split('\n')) {
                const [k, v] = line.split('=');
                if (k && v) {
                  const val = v.trim().replace(/^['"]|['"]$/g, '');
                  if (k.trim() === 'R2_ACCOUNT_ID') r2Acc = val;
                  if (k.trim() === 'R2_ACCESS_KEY_ID') r2Key = val;
                  if (k.trim() === 'R2_SECRET_ACCESS_KEY') r2Sec = val;
                  if (k.trim() === 'R2_BUCKET_NAME') r2Bkt = val;
                }
              }
            }

            const s3 = new S3Client({
              region: 'auto',
              endpoint: `https://${r2Acc}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: r2Key || '',
                secretAccessKey: r2Sec || '',
              },
            });

            const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
            let uploadedCount = 0;

            await Promise.all(
              files.map(async (file: any) => {
                const rawPath = String(file.relativePath || file.name || '').replace(/^\/+/, '');
                const cleanRelative = rawPath
                  .replace(/^(?:public\/)?frames\//i, '')
                  .replace(/^[^\/]+\/(?:public\/)?frames\//i, '');

                const r2KeyName = `frames/${cleanSlug}/${cleanRelative}`;
                const buffer = Buffer.from(file.dataBase64, 'base64');
                const contentType = cleanRelative.endsWith('.webp')
                  ? 'image/webp'
                  : cleanRelative.endsWith('.png')
                  ? 'image/png'
                  : 'image/jpeg';

                await s3.send(
                  new PutObjectCommand({
                    Bucket: r2Bkt,
                    Key: r2KeyName,
                    Body: buffer,
                    ContentType: contentType,
                    CacheControl: 'public, max-age=31536000, immutable',
                  })
                );
                uploadedCount++;
              })
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, uploadedCount, slug: cleanSlug }));
          } catch (err: any) {
            console.error('Error en middleware local de subida:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Error interno' }));
          }
          return;
        }
        if (req.url === '/api/r2-upload' && req.method === 'POST') {
          try {
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }
            const bodyData = JSON.parse(body || '{}');
            const { base64, fileData, filename, folder = 'services', contentType = 'image/webp' } = bodyData;
            const rawData = base64 || fileData;

            if (!rawData) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Falta el contenido de la imagen (base64 o fileData).' }));
              return;
            }

            let r2Acc = process.env.R2_ACCOUNT_ID || '18113006866e0a5d3dfc002d8d1fabab';
            let r2Key = process.env.R2_ACCESS_KEY_ID || '7883d5ec59ed83172ade90478cc1409b';
            let r2Sec = process.env.R2_SECRET_ACCESS_KEY || '0c89f4bcbefbde8699b99caf71c1df25875bb44b56a802bbce5150ab6a38c724';
            let r2Bkt = process.env.R2_BUCKET_NAME || 'kowy-frames';
            let r2Cdn = (process.env.VITE_R2_CDN_URL || 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev').replace(/\/+$/, '');

            const s3 = new S3Client({
              region: 'auto',
              endpoint: `https://${r2Acc}.r2.cloudflarestorage.com`,
              credentials: {
                accessKeyId: r2Key,
                secretAccessKey: r2Sec,
              },
            });

            const cleanBase64 = String(rawData).replace(/^data:image\/[a-z0-9-+.]+;base64,/i, '').trim();
            const buffer = Buffer.from(cleanBase64, 'base64');
            const safeFolder = String(folder || 'services').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'services';
            const cleanName = String(filename || 'service_image')
              .replace(/\.[^/.]+$/, '')
              .replace(/[^a-zA-Z0-9_-]/g, '_')
              .toLowerCase();
            const extension = contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'webp';
            const key = `${safeFolder}/${Date.now()}_${cleanName || 'item'}.${extension}`;

            await s3.send(
              new PutObjectCommand({
                Bucket: r2Bkt,
                Key: key,
                Body: buffer,
                ContentType: contentType,
                CacheControl: 'public, max-age=31536000, immutable',
              })
            );

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, url: `${r2Cdn}/${key}`, key, bucket: r2Bkt }));
            return;
          } catch (err: any) {
            console.error('Error en middleware local r2-upload:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Error interno' }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localFramesUploadPlugin()],
  server: {
    port: 3000,
    open: true,
  },
});
