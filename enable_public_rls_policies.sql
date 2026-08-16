-- ==========================================================================
-- BeautyFlow AI - Políticas de RLS Permisivas para Registro y Operación
-- Ejecuta este script en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- ==========================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Habilitar RLS y Políticas en tenants
ALTER TABLE IF EXISTS public.tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on tenants" ON public.tenants;
CREATE POLICY "Allow public all on tenants" ON public.tenants FOR ALL USING (true) WITH CHECK (true);

-- 3. Habilitar RLS y Políticas en stylists
ALTER TABLE IF EXISTS public.stylists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on stylists" ON public.stylists;
CREATE POLICY "Allow public all on stylists" ON public.stylists FOR ALL USING (true) WITH CHECK (true);

-- 4. Habilitar RLS y Políticas en services
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on services" ON public.services;
CREATE POLICY "Allow public all on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- 5. Habilitar RLS y Políticas en tenant_ai_settings
ALTER TABLE IF EXISTS public.tenant_ai_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on tenant_ai_settings" ON public.tenant_ai_settings;
CREATE POLICY "Allow public all on tenant_ai_settings" ON public.tenant_ai_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Habilitar RLS y Políticas en clients
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on clients" ON public.clients;
CREATE POLICY "Allow public all on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);

-- 7. Habilitar RLS y Políticas en appointments
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on appointments" ON public.appointments;
CREATE POLICY "Allow public all on appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

-- 8. Habilitar RLS y Políticas en products
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on products" ON public.products;
CREATE POLICY "Allow public all on products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 9. Habilitar RLS y Políticas en color_formulas
ALTER TABLE IF EXISTS public.color_formulas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all on color_formulas" ON public.color_formulas;
CREATE POLICY "Allow public all on color_formulas" ON public.color_formulas FOR ALL USING (true) WITH CHECK (true);
