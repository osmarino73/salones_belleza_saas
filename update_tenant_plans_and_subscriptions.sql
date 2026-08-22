-- ============================================================================
-- BEAUTYFLOW AI - GESTIÓN Y CONTROL DE PLANES SAAS EN SUPABASE
-- Actualiza la tabla public.tenants con los 6 Planes Oficiales en $ COP
-- ============================================================================

-- 1. Añadir columnas de gestión de planes y suscripciones a 'tenants'
ALTER TABLE public.tenants 
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'crecimiento',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '30 days'),
  ADD COLUMN IF NOT EXISTS subscription_price_cop NUMERIC DEFAULT 120000,
  ADD COLUMN IF NOT EXISTS max_stylists INT DEFAULT 999,
  ADD COLUMN IF NOT EXISTS has_pos_access BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS has_ai_whatsapp BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_omnichannel BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_meta_ads BOOLEAN DEFAULT false;

-- 2. Asegurar que los tenants existentes tengan valores por defecto consistentes
UPDATE public.tenants
SET 
  plan_tier = COALESCE(plan_tier, 'crecimiento'),
  subscription_status = COALESCE(subscription_status, 'trial'),
  trial_ends_at = COALESCE(trial_ends_at, timezone('utc'::text, now() + interval '30 days')),
  subscription_price_cop = COALESCE(subscription_price_cop, 120000),
  max_stylists = CASE WHEN plan_tier = 'inicio' THEN 4 ELSE 999 END,
  has_pos_access = CASE WHEN plan_tier IN ('free', 'inicio') THEN false ELSE true END,
  has_ai_whatsapp = CASE WHEN plan_tier IN ('pro_ia', 'escala', 'agencia') THEN true ELSE false END,
  has_omnichannel = CASE WHEN plan_tier IN ('pro_ia', 'escala', 'agencia') THEN true ELSE false END,
  has_meta_ads = CASE WHEN plan_tier IN ('escala', 'agencia') THEN true ELSE false END
WHERE plan_tier IS NULL OR subscription_status IS NULL;

-- 3. Índices para búsquedas de suscripciones activas y alertas de vencimiento
CREATE INDEX IF NOT EXISTS idx_tenants_plan_tier ON public.tenants(plan_tier);
CREATE INDEX IF NOT EXISTS idx_tenants_subscription_status ON public.tenants(subscription_status);
CREATE INDEX IF NOT EXISTS idx_tenants_trial_ends_at ON public.tenants(trial_ends_at);

-- 4. Comentario explicativo
COMMENT ON COLUMN public.tenants.plan_tier IS 'free ($0), inicio ($50k COP), crecimiento ($120k COP), pro_ia ($240k COP), escala ($720k COP), agencia ($1.44M COP)';
