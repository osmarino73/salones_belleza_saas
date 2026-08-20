-- ==============================================================================
-- MIGRACIÓN BEAUTYFLOW AI: SOPORTE DE IMÁGENES DE REFERENCIA EN SERVICIOS
-- ==============================================================================

-- 1. Asegurar que la columna image_url existe en la tabla de services
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url TEXT DEFAULT NULL;
    RAISE NOTICE 'Columna image_url agregada exitosamente a la tabla services';
  ELSE
    RAISE NOTICE 'La columna image_url ya existe en services';
  END IF;
END $$;

-- 2. Asegurar políticas RLS para lectura y escritura pública/autenticada
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Allow public read services'
  ) THEN
    CREATE POLICY "Allow public read services" 
    ON services FOR SELECT 
    TO anon, authenticated 
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Allow public insert services'
  ) THEN
    CREATE POLICY "Allow public insert services" 
    ON services FOR INSERT 
    TO anon, authenticated 
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Allow public update services'
  ) THEN
    CREATE POLICY "Allow public update services" 
    ON services FOR UPDATE 
    TO anon, authenticated 
    USING (true)
    WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Allow public delete services'
  ) THEN
    CREATE POLICY "Allow public delete services" 
    ON services FOR DELETE 
    TO anon, authenticated 
    USING (true);
  END IF;
END $$;

-- 3. Verificación de prueba
COMMENT ON COLUMN services.image_url IS 'URL o DataURI WebP de la fotografía de referencia ilustrativa del servicio de belleza';
