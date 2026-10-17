-- ==============================================================================
-- MIGRACIÓN SQL PARA KOWY (kowy.app): MÓDULO DE AGENTES DE CAMPO & GPS
-- Fuerza Comercial en Calle con Prospección Móvil y Activación B2B
-- ==============================================================================

-- 1. TABLA DE AGENTES DE CAMPO (ASESORES COMERCIALES EN CALLE)
CREATE TABLE IF NOT EXISTS public.agentes_campo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  telefono text,
  zona text,
  estado text CHECK (estado IN ('activo', 'inactivo')) DEFAULT 'activo',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kowy_agentes_email ON public.agentes_campo(email);
CREATE INDEX IF NOT EXISTS idx_kowy_agentes_user_id ON public.agentes_campo(user_id);
CREATE INDEX IF NOT EXISTS idx_kowy_agentes_estado ON public.agentes_campo(estado);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.agentes_campo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura de agentes para usuarios del sistema" ON public.agentes_campo;
CREATE POLICY "Lectura de agentes para usuarios del sistema"
  ON public.agentes_campo FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Gestion total de agentes de campo" ON public.agentes_campo;
CREATE POLICY "Gestion total de agentes de campo"
  ON public.agentes_campo FOR ALL
  USING (true);

-- 3. AÑADIR COLUMNAS DE GEOLOCALIZACIÓN Y AGENTE CREADOR A PROSPECT_SITES
ALTER TABLE public.prospect_sites 
  ADD COLUMN IF NOT EXISTS gps_coordinates text,
  ADD COLUMN IF NOT EXISTS creator_agent_id uuid REFERENCES public.agentes_campo(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_kowy_prospect_creator_agent ON public.prospect_sites(creator_agent_id);

-- 4. RECARGAR CACHÉ DE POSTGREST
NOTIFY pgrst, 'reload schema';
