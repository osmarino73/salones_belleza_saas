-- ============================================================================
-- BEAUTYFLOW AI / KOWY - MIGRACIÓN COLUMNA OWNER_EMAIL
-- Vincula el correo del dueño o administradora directamente con su Tenant y Prospect Site
-- ============================================================================

-- 1. Añadir columna owner_email a public.tenants si no existe
ALTER TABLE public.tenants 
  ADD COLUMN IF NOT EXISTS owner_email TEXT;

-- 2. Añadir columna owner_email a public.prospect_sites si no existe
ALTER TABLE public.prospect_sites 
  ADD COLUMN IF NOT EXISTS owner_email TEXT;

-- 3. Crear índices para acelerar búsquedas de login y vinculación de salones
CREATE INDEX IF NOT EXISTS idx_tenants_owner_email ON public.tenants(owner_email);
CREATE INDEX IF NOT EXISTS idx_prospect_sites_owner_email ON public.prospect_sites(owner_email);

-- 4. Actualizar owner_email en tenants a partir de estilistas dueñas existentes (si aplica)
UPDATE public.tenants t
SET owner_email = s.email
FROM public.stylists s
WHERE s.tenant_id = t.id 
  AND (s.is_owner = TRUE OR s.role = 'admin') 
  AND s.email IS NOT NULL
  AND t.owner_email IS NULL;

-- 5. Notificar a PostgREST para recargar la caché del esquema inmediatamente
NOTIFY pgrst, 'reload schema';
