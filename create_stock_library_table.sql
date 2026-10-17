-- ==============================================================================
-- MIGRACIÓN SQL PARA KOWY (kowy.app): BIBLIOTECA DE IMÁGENES MULTIMEDIA CDN
-- Almacenamiento Centralizado en Supabase & Cloudflare R2 para Salones y Barberías
-- ==============================================================================

-- 1. TABLA PRINCIPAL DE IMÁGENES DE BIBLIOTECA STOCK
CREATE TABLE IF NOT EXISTS public.stock_library_images (
  id text PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para búsqueda ultra-rápida por categoría y estado
CREATE INDEX IF NOT EXISTS idx_stock_library_category ON public.stock_library_images(category);
CREATE INDEX IF NOT EXISTS idx_stock_library_active ON public.stock_library_images(is_active);
CREATE INDEX IF NOT EXISTS idx_stock_library_created_at ON public.stock_library_images(created_at DESC);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.stock_library_images ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública: cualquier cliente o salón puede ver las imágenes activas
DROP POLICY IF EXISTS "Lectura pública de imágenes de biblioteca" ON public.stock_library_images;
CREATE POLICY "Lectura pública de imágenes de biblioteca"
  ON public.stock_library_images FOR SELECT
  USING (is_active = true);

-- Política de gestión total para Superadmin y plataforma Kowy
DROP POLICY IF EXISTS "Gestión total de imágenes de biblioteca" ON public.stock_library_images;
CREATE POLICY "Gestión total de imágenes de biblioteca"
  ON public.stock_library_images FOR ALL
  USING (true);

-- 3. BUCKET DE SUPABASE STORAGE PARA SUBIDA DIRECTA DE FOTOS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('stock-images', 'stock-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso para el bucket 'stock-images'
DROP POLICY IF EXISTS "Acceso público de lectura a stock-images" ON storage.objects;
CREATE POLICY "Acceso público de lectura a stock-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stock-images');

DROP POLICY IF EXISTS "Subida pública a stock-images" ON storage.objects;
CREATE POLICY "Subida pública a stock-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stock-images');

DROP POLICY IF EXISTS "Actualización y borrado en stock-images" ON storage.objects;
CREATE POLICY "Actualización y borrado en stock-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'stock-images');

DROP POLICY IF EXISTS "Eliminación en stock-images" ON storage.objects;
CREATE POLICY "Eliminación en stock-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'stock-images');

-- 4. RECARGAR CACHÉ DE POSTGREST
NOTIFY pgrst, 'reload schema';
