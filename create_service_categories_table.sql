-- ==============================================================================
-- MIGRACIÓN BEAUTYFLOW AI: TABLA SERVICE_CATEGORIES Y POLÍTICAS RLS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  icon VARCHAR(50) DEFAULT '✨',
  description TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_categories_tenant ON service_categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_service_categories_slug ON service_categories(slug);

-- Habilitar RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_categories' AND policyname = 'Allow public read service_categories'
  ) THEN
    CREATE POLICY "Allow public read service_categories" 
    ON service_categories FOR SELECT 
    TO anon, authenticated 
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_categories' AND policyname = 'Allow public insert service_categories'
  ) THEN
    CREATE POLICY "Allow public insert service_categories" 
    ON service_categories FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_categories' AND policyname = 'Allow public update service_categories'
  ) THEN
    CREATE POLICY "Allow public update service_categories" 
    ON service_categories FOR UPDATE 
    TO anon, authenticated 
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_categories' AND policyname = 'Allow public delete service_categories'
  ) THEN
    CREATE POLICY "Allow public delete service_categories" 
    ON service_categories FOR DELETE 
    TO anon, authenticated 
    USING (true);
  END IF;
END $$;
