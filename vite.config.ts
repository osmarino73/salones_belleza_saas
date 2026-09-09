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
