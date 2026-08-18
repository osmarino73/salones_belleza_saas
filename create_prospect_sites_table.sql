-- ============================================================================
-- BEAUTYFLOW AI - SUPERADMIN & PROSPECT SITES (LEAD ENGINE)
-- Permite almacenar sitios web gancho creados para prospectos de Google Maps
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.prospect_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  address TEXT,
  city TEXT DEFAULT 'Medellín',
  country TEXT DEFAULT 'Colombia',
  google_maps_url TEXT,
  raw_html TEXT NOT NULL,
  category TEXT DEFAULT 'salon', -- salon, barberia, spa, estetica, nails
  status TEXT DEFAULT 'prospecto', -- prospecto, contactado, reclamado, cliente_pago
  claimed_tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  business_data JSONB, -- Estructura DATOS_NEGOCIO.json (servicios, especialistas, contacto, horario, etc.)
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Asegurar columna en caso de existir previamente
ALTER TABLE public.prospect_sites ADD COLUMN IF NOT EXISTS business_data JSONB;

-- Índices para búsquedas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_prospect_sites_slug ON public.prospect_sites(slug);
CREATE INDEX IF NOT EXISTS idx_prospect_sites_status ON public.prospect_sites(status);
CREATE INDEX IF NOT EXISTS idx_prospect_sites_phone ON public.prospect_sites(phone_whatsapp);

-- Habilitar RLS
ALTER TABLE public.prospect_sites ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso Público y Superadmin
DROP POLICY IF EXISTS "Public read prospect sites" ON public.prospect_sites;
CREATE POLICY "Public read prospect sites"
  ON public.prospect_sites FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public insert prospect sites" ON public.prospect_sites;
CREATE POLICY "Public insert prospect sites"
  ON public.prospect_sites FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update prospect sites" ON public.prospect_sites;
CREATE POLICY "Public update prospect sites"
  ON public.prospect_sites FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Public delete prospect sites" ON public.prospect_sites;
CREATE POLICY "Public delete prospect sites"
  ON public.prospect_sites FOR DELETE
  USING (true);
