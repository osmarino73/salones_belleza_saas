-- ==========================================================================
-- SCRIPT SQL: CONFIGURACIÓN DE SUPABASE STORAGE PARA FOTOS DE PERFIL (AVATARS)
-- BeautyFlow AI SaaS - Almacenamiento Profesional de Fotos de Estilistas y Logos
-- ==========================================================================

-- 1. Crear el bucket público 'avatars' en Supabase Storage (si no existe)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB límite máximo por archivo
    ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];

-- 2. Políticas de Seguridad (RLS) para el bucket 'avatars'

-- Política A: Permitir lectura pública de avatares y fotos de perfil (para el portal de reservas y dashboard)
DROP POLICY IF EXISTS "Permitir lectura publica de avatares" ON storage.objects;
CREATE POLICY "Permitir lectura publica de avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Política B: Permitir subida y actualización a usuarios autenticados / clave anon
DROP POLICY IF EXISTS "Permitir subida de avatares" ON storage.objects;
CREATE POLICY "Permitir subida de avatares"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Permitir actualizacion de avatares" ON storage.objects;
CREATE POLICY "Permitir actualizacion de avatares"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Permitir eliminacion de avatares" ON storage.objects;
CREATE POLICY "Permitir eliminacion de avatares"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');

-- 3. Confirmación de columna en tabla public.stylists
-- La columna 'photo_url TEXT' soporta tanto URLs públicas de Storage como DataURLs WebP optimizados.
ALTER TABLE public.stylists 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

COMMENT ON COLUMN public.stylists.photo_url IS 'URL pública del avatar en Supabase Storage o DataURL WebP optimizado (<35KB)';
