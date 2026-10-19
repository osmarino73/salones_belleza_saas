import { supabase } from '../lib/supabase';
import { uploadStockImageBlob } from '../lib/beautyImageLibrary';

interface R2UploadResponse {
  success: boolean;
  url: string | null;
  key?: string;
  error?: string;
}

/**
 * Convierte un Blob o File a cadena Base64
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

/**
 * Sube una imagen directamente a Cloudflare R2 utilizando la arquitectura dual:
 * 1. Intenta invocar la Edge Function 'r2-upload' de Supabase
 * 2. Si no responde o no está disponible, utiliza el endpoint serverless '/api/r2-upload'
 * 3. Si Cloudflare R2 falla por red, aplica fallback transparente a Supabase Storage
 */
export async function uploadImageToR2(
  data: string | Blob,
  filename: string = 'service',
  folder: string = 'services'
): Promise<{ url: string | null; error?: string; source?: 'r2-edge' | 'r2-api' | 'supabase-fallback' }> {
  let base64String = '';
  let blobData: Blob | null = null;

  try {
    if (typeof data === 'string') {
      base64String = data;
      // Si recibimos base64, podemos recrear el blob en caso de fallback
      const clean = data.replace(/^data:image\/[a-z0-9-+.]+;base64,/i, '').trim();
      const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
      blobData = new Blob([bytes], { type: 'image/webp' });
    } else {
      blobData = data;
      base64String = await blobToBase64(data);
    }

    // 1. Intentar primero con la Edge Function de Supabase 'r2-upload'
    try {
      if (supabase && (supabase as any).functions) {
        const { data: edgeRes, error: edgeErr } = await (supabase as any).functions.invoke('r2-upload', {
          body: {
            base64: base64String,
            filename,
            folder,
            contentType: 'image/webp',
          },
        });

        if (!edgeErr && edgeRes?.success && edgeRes?.url) {
          return { url: edgeRes.url, source: 'r2-edge' };
        }
      }
    } catch (edgeCallErr) {
      console.warn('Edge Function r2-upload no disponible, probando API serverless:', edgeCallErr);
    }

    // 2. Intentar con el endpoint serverless '/api/r2-upload' de Netlify
    try {
      const apiRes = await fetch('/api/r2-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64String,
          filename,
          folder,
          contentType: 'image/webp',
        }),
      });

      if (apiRes.ok) {
        const apiData: R2UploadResponse = await apiRes.json();
        if (apiData.success && apiData.url) {
          return { url: apiData.url, source: 'r2-api' };
        }
      }
    } catch (apiErr) {
      console.warn('Fallo en endpoint /api/r2-upload, recurriendo a Supabase Storage:', apiErr);
    }

    // 3. Fallback seguro a Supabase Storage (para garantizar que nunca falle la experiencia del usuario)
    if (blobData) {
      console.info('Aplicando fallback a Supabase Storage...');
      const fallbackRes = await uploadStockImageBlob(blobData, filename);
      if (fallbackRes.url) {
        return { url: fallbackRes.url, source: 'supabase-fallback' };
      }
    }

    return { url: null, error: 'No fue posible subir la imagen a R2 ni a Supabase Storage' };
  } catch (err: any) {
    console.error('Error general en uploadImageToR2:', err);
    return { url: null, error: err?.message || 'Error desconocido' };
  }
}
