-- ==========================================================================
-- BeautyFlow AI - Migración: Soporte Omnicanal Meta Suite (Instagram & Messenger)
-- Tabla: tenant_ai_settings
-- ==========================================================================

-- 1. Añadir columnas de Instagram Direct
ALTER TABLE public.tenant_ai_settings 
ADD COLUMN IF NOT EXISTS instagram_username VARCHAR(100),
ADD COLUMN IF NOT EXISTS instagram_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS instagram_status VARCHAR(50) DEFAULT 'disconnected';

-- 2. Añadir columnas de Facebook Messenger
ALTER TABLE public.tenant_ai_settings 
ADD COLUMN IF NOT EXISTS messenger_page_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS messenger_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS messenger_status VARCHAR(50) DEFAULT 'disconnected';

-- 3. Confirmación
COMMENT ON COLUMN public.tenant_ai_settings.instagram_username IS 'Handle o cuenta de Instagram conectada (ej. @studioglamour)';
COMMENT ON COLUMN public.tenant_ai_settings.messenger_page_name IS 'Nombre de la Fanpage de Facebook conectada';
