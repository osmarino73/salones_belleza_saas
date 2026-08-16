-- ==========================================================================
-- BeautyFlow AI - Migración: Configuración del Agente IA por Negocio (Multi-Tenant)
-- Tabla: tenant_ai_settings
-- ==========================================================================

-- 1. Habilitar extensión UUID por seguridad
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Función genérica para actualización de updated_at
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear Tabla tenant_ai_settings
CREATE TABLE IF NOT EXISTS public.tenant_ai_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Identidad y Personalidad del Agente
    agent_name VARCHAR(100) DEFAULT 'Flowy',
    agent_avatar_url TEXT,
    personality_tone VARCHAR(100) DEFAULT 'elegante_calido', -- 'elegante_calido', 'profesional_formal', 'cercano_juvenil'
    language VARCHAR(10) DEFAULT 'es',
    
    -- Contexto del Negocio e Instrucciones Personalizadas (Prompt)
    system_prompt_custom TEXT DEFAULT 'Eres el asistente virtual oficial del salón. Tu misión es dar la bienvenida, resolver dudas, compartir tarifas y agendar citas con calidez, elegancia y precisión.',
    business_bio TEXT DEFAULT 'Salón de belleza premium especializado en colorimetría, corte, estética capilar, uñas y spa.',
    address_instructions TEXT,
    cancellation_policy TEXT DEFAULT 'Puedes cancelar o reprogramar tu cita con al menos 4 horas de anticipación sin penalidad.',
    faqs JSONB DEFAULT '[
        {"pregunta": "¿Aceptan mascotas?", "respuesta": "¡Sí! Somos un espacio Pet Friendly."},
        {"pregunta": "¿Tienen parqueadero?", "respuesta": "Sí, contamos con parqueadero gratuito para clientes."},
        {"pregunta": "¿Qué métodos de pago reciben?", "respuesta": "Aceptamos efectivo, tarjetas de débito/crédito, transferencias y pagos digitales."}
    ]'::jsonb,

    -- Políticas de Reserva y Abonos (Depósitos)
    booking_enabled BOOLEAN DEFAULT TRUE,
    requires_deposit BOOLEAN DEFAULT FALSE,
    deposit_type VARCHAR(20) DEFAULT 'fixed',
    deposit_value NUMERIC(10,2) DEFAULT 0.00,
    payment_instructions TEXT DEFAULT 'Para confirmar tu cita con abono, puedes transferir a nuestras cuentas autorizadas y enviarnos el comprobante.',
    
    -- Conectividad con Zernio & WhatsApp
    zernio_channel_id VARCHAR(255),
    whatsapp_phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    human_takeover_active BOOLEAN DEFAULT FALSE,
    human_takeover_until TIMESTAMP WITH TIME ZONE,
    human_takeover_timeout_minutes INTEGER DEFAULT 120,
    
    -- Automatización de Recordatorios & Fidelización
    send_reminder_whatsapp BOOLEAN DEFAULT TRUE,
    reminder_hours_before INTEGER DEFAULT 2,
    reminder_custom_message TEXT DEFAULT '✨ Te recordamos tu cita de belleza hoy a las {HORA} con {ESTILISTA} para tu {SERVICIO}. Te esperamos en {DIRECCION}.',
    send_followup_review BOOLEAN DEFAULT TRUE,
    followup_days_after INTEGER DEFAULT 1,
    google_maps_review_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at automático
DROP TRIGGER IF EXISTS update_tenant_ai_settings_modtime ON public.tenant_ai_settings;
CREATE TRIGGER update_tenant_ai_settings_modtime
BEFORE UPDATE ON public.tenant_ai_settings
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_tenant ON public.tenant_ai_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_whatsapp ON public.tenant_ai_settings(whatsapp_phone_number);
CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_zernio ON public.tenant_ai_settings(zernio_channel_id);

-- RLS y Políticas
ALTER TABLE public.tenant_ai_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public all tenant_ai_settings" ON public.tenant_ai_settings;
CREATE POLICY "Allow public all tenant_ai_settings" ON public.tenant_ai_settings FOR ALL USING (true);
