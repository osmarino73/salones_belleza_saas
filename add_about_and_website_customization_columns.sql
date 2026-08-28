-- ==========================================================================
-- BeautyFlow AI / Kowy - Migración SQL: Columnas de Personalización Web
-- Header & Sección "Sobre Nosotros" en public.tenants
-- ==========================================================================

-- 1. Columnas de Cabecera / Hero
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS logo_icon VARCHAR(255) DEFAULT '🪄',
ADD COLUMN IF NOT EXISTS hero_eyebrow VARCHAR(255) DEFAULT 'Bienvenidas a ❤️',
ADD COLUMN IF NOT EXISTS slogan TEXT,
ADD COLUMN IF NOT EXISTS title_accent VARCHAR(255) DEFAULT 'Centro de Estética',
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS primary_color VARCHAR(50) DEFAULT '#d92672',
ADD COLUMN IF NOT EXISTS show_team_section BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS show_first_visit_discount BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS first_visit_discount_pct INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS first_visit_discount_title TEXT;

-- 2. Columnas de la Sección "Sobre Nosotros"
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS about_image_url TEXT,
ADD COLUMN IF NOT EXISTS about_badge_text VARCHAR(255) DEFAULT 'VIP EXPERIENCIA SALÓN',
ADD COLUMN IF NOT EXISTS about_eyebrow VARCHAR(255) DEFAULT 'Sobre Nosotros',
ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'CUIDADO. DEFINICIÓN.',
ADD COLUMN IF NOT EXISTS about_title_accent TEXT DEFAULT 'PASIÓN POR TU BELLEZA.',
ADD COLUMN IF NOT EXISTS about_description TEXT,
ADD COLUMN IF NOT EXISTS about_years_exp VARCHAR(50) DEFAULT '+8',
ADD COLUMN IF NOT EXISTS about_clients_count VARCHAR(50) DEFAULT '+3.5K',
ADD COLUMN IF NOT EXISTS about_rating_text VARCHAR(50) DEFAULT '5.0',
ADD COLUMN IF NOT EXISTS show_about_section BOOLEAN DEFAULT TRUE;

-- 3. Actualizar comentarios de documentación
COMMENT ON COLUMN public.tenants.about_image_url IS 'URL de la fotografía del espacio físico/salón para la sección Sobre Nosotros';
COMMENT ON COLUMN public.tenants.about_badge_text IS 'Texto del badge flotante sobre la foto de Sobre Nosotros (ej. VIP EXPERIENCIA CURLY)';
COMMENT ON COLUMN public.tenants.about_title IS 'Título principal de la sección Sobre Nosotros';
COMMENT ON COLUMN public.tenants.about_title_accent IS 'Texto destacado o en cursiva dorada del título de Sobre Nosotros';
COMMENT ON COLUMN public.tenants.about_description IS 'Párrafo descriptivo con la historia y propuesta de valor del negocio';
COMMENT ON COLUMN public.tenants.show_about_section IS 'Controla si la sección Sobre Nosotros está visible en la web pública';
