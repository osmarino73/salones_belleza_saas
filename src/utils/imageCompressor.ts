/**
 * Client-side image compressor & optimizer using HTML5 Canvas.
 * Converts heavy images (e.g. 5MB-10MB mobile uploads) to ultra-light WebP/JPEG avatars (~20KB-40KB).
 */

export interface CompressionResult {
  dataUrl: string;
  blob: Blob;
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  reductionPct: number; // e.g. 95
  width: number;
  height: number;
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  mimeType?: 'image/webp' | 'image/jpeg';
  cropSquare?: boolean;
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.82,
    mimeType = 'image/webp',
    cropSquare = true
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let srcX = 0;
        let srcY = 0;
        let srcW = img.width;
        let srcH = img.height;

        // If cropSquare is enabled, perform center-crop to 1:1 aspect ratio
        if (cropSquare) {
          const minDim = Math.min(srcW, srcH);
          srcX = (srcW - minDim) / 2;
          srcY = (srcH - minDim) / 2;
          srcW = minDim;
          srcH = minDim;
        }

        // Calculate target dimensions
        let destW = srcW;
        let destH = srcH;

        if (destW > maxWidth || destH > maxHeight) {
          const ratio = Math.min(maxWidth / destW, maxHeight / destH);
          destW = Math.round(destW * ratio);
          destH = Math.round(destH * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = destW;
        canvas.height = destH;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de imagen canvas.'));
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, destW, destH);

        // Convert to dataUrl and Blob
        const outputMime = mimeType === 'image/webp' && isWebpSupported() ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al generar blob optimizado.'));
              return;
            }
            const originalSize = file.size;
            const compressedSize = blob.size;
            const reductionPct = Math.round(((originalSize - compressedSize) / originalSize) * 100);

            resolve({
              dataUrl,
              blob,
              originalSize,
              compressedSize,
              reductionPct: Math.max(0, reductionPct),
              width: destW,
              height: destH
            });
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => reject(new Error('No se pudo cargar la imagen seleccionada.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo del dispositivo.'));
    reader.readAsDataURL(file);
  });
}

function isWebpSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
