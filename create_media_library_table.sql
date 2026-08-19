-- ============================================================================
-- BEAUTYFLOW AI - MEDIA LIBRARY & STOCK ASSETS
-- Permite almacenar fotos y activos multimedia personalizados y de stock
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- hero_salon, hero_spa, hero_barber, hero_nails, color, cortes, keratina, nails, spa_facial, barberia, maquillaje, especialistas
  tags TEXT[] DEFAULT '{}',
  is_custom BOOLEAN DEFAULT true,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_media_library_category ON public.media_library(category);
CREATE INDEX IF NOT EXISTS idx_media_library_tenant ON public.media_library(tenant_id);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read media library" ON public.media_library;
CREATE POLICY "Public read media library"
  ON public.media_library FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public insert media library" ON public.media_library;
CREATE POLICY "Public insert media library"
  ON public.media_library FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete media library" ON public.media_library;
CREATE POLICY "Public delete media library"
  ON public.media_library FOR DELETE
  USING (true);
