-- ==========================================================================
-- SCRIPT DE MIGRACIÓN: DISPONIBILIDAD Y BLOQUEO DE DÍAS POR ESTILISTA
-- BeautyFlow AI SaaS - Soporte para Vacaciones, Días Libres y Horarios
-- ==========================================================================

-- 1. Agregar columnas de disponibilidad directa en la tabla 'stylists'
ALTER TABLE public.stylists 
ADD COLUMN IF NOT EXISTS working_days JSONB DEFAULT '[1, 2, 3, 4, 5, 6]'::jsonb,
ADD COLUMN IF NOT EXISTS blocked_dates JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS blocked_slots JSONB DEFAULT '[]'::jsonb;

-- Comentarios explicativos
COMMENT ON COLUMN public.stylists.working_days IS 'Días semanales de trabajo: 0=Domingo, 1=Lunes, ..., 6=Sábado';
COMMENT ON COLUMN public.stylists.blocked_dates IS 'Array de strings con fechas YYYY-MM-DD bloqueadas para citas';
COMMENT ON COLUMN public.stylists.blocked_slots IS 'Array JSON con objetos detallados de bloqueo: id, date, reason, full_day, start_time, end_time';

-- 2. Crear tabla normalizada 'stylist_blocked_slots' (Para consultas SQL directas desde n8n / Flowy IA)
CREATE TABLE IF NOT EXISTS public.stylist_blocked_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    stylist_id UUID NOT NULL REFERENCES public.stylists(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    reason VARCHAR(255) DEFAULT 'Vacaciones / Día Libre',
    full_day BOOLEAN DEFAULT TRUE,
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda ultrarrápida de disponibilidad en la Agenda y Bot
CREATE INDEX IF NOT EXISTS idx_stylist_blocked_date ON public.stylist_blocked_slots (stylist_id, date);
CREATE INDEX IF NOT EXISTS idx_stylist_blocked_tenant ON public.stylist_blocked_slots (tenant_id);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.stylist_blocked_slots ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS públicas y autenticadas
DROP POLICY IF EXISTS "Permitir lectura publica de bloqueos" ON public.stylist_blocked_slots;
CREATE POLICY "Permitir lectura publica de bloqueos"
ON public.stylist_blocked_slots
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Permitir insercion y gestion de bloqueos" ON public.stylist_blocked_slots;
CREATE POLICY "Permitir insercion y gestion de bloqueos"
ON public.stylist_blocked_slots
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Notificación de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Columnas y tabla de disponibilidad de estilistas creadas exitosamente.';
END $$;
