-- ==========================================================================
-- BeautyFlow AI - Tablas de Plantillas & Matriz de Envío (Supabase SQL)
-- ==========================================================================

-- 1. TABLA DE PLANTILLAS WHATSAPP HSM (Meta Cloud API)
CREATE TABLE IF NOT EXISTS public.tenant_whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_key VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'UTILITY', -- 'UTILITY', 'MARKETING'
    header_text TEXT,
    body_text TEXT NOT NULL,
    footer_text TEXT,
    buttons JSONB DEFAULT '[]'::jsonb,
    variables JSONB DEFAULT '[]'::jsonb,
    timing_description VARCHAR(255),
    meta_status VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA'
    submitted_to_meta_at TIMESTAMP WITH TIME ZONE,
    approved_by_meta_at TIMESTAMP WITH TIME ZONE,
    meta_template_id VARCHAR(255),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_tenant_wa_template_key UNIQUE (tenant_id, template_key)
);

-- 2. TABLA DE PLANTILLAS EMAIL HTML (SMTP / Resend)
CREATE TABLE IF NOT EXISTS public.tenant_email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_key VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    preheader TEXT,
    category VARCHAR(50) DEFAULT 'TRANSACCIONAL', -- 'TRANSACCIONAL', 'MARKETING', 'REPUTACIÓN'
    headline TEXT,
    body_html TEXT,
    cta_text VARCHAR(100),
    cta_url TEXT,
    accent_color VARCHAR(20) DEFAULT '#FF5A36',
    variables JSONB DEFAULT '[]'::jsonb,
    badge VARCHAR(50) DEFAULT 'Personalizada',
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_tenant_email_template_key UNIQUE (tenant_id, template_key)
);

-- 3. TABLA DE MATRIZ DE REGLAS & HORARIOS DE ENVÍO
CREATE TABLE IF NOT EXISTS public.tenant_dispatch_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- WhatsApp Rules
    wa_confirmation_enabled BOOLEAN DEFAULT TRUE,
    wa_reminder_24h_enabled BOOLEAN DEFAULT TRUE,
    wa_reminder_hours_before INTEGER DEFAULT 24,
    wa_reminder_2h_enabled BOOLEAN DEFAULT TRUE,
    wa_reminder_inminent_hours_before INTEGER DEFAULT 2,
    wa_vip_reactivation_enabled BOOLEAN DEFAULT TRUE,
    wa_vip_inactivity_days INTEGER DEFAULT 35,
    wa_review_request_enabled BOOLEAN DEFAULT TRUE,
    wa_review_hours_after INTEGER DEFAULT 24,
    
    -- Email Rules
    email_confirmation_enabled BOOLEAN DEFAULT TRUE,
    email_reminder_24h_enabled BOOLEAN DEFAULT TRUE,
    email_receipt_enabled BOOLEAN DEFAULT TRUE,
    email_review_request_enabled BOOLEAN DEFAULT TRUE,
    email_birthday_vip_enabled BOOLEAN DEFAULT TRUE,
    
    -- Global Policies & Anti-Disturbance
    preferred_channel VARCHAR(50) DEFAULT 'both', -- 'both', 'whatsapp_first', 'whatsapp_only', 'email_only'
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start VARCHAR(10) DEFAULT '21:00',
    quiet_hours_end VARCHAR(10) DEFAULT '08:00',
    weekend_reminders_enabled BOOLEAN DEFAULT TRUE,
    only_client_booked_confirmation BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_wa_templates_tenant ON public.tenant_whatsapp_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_tenant ON public.tenant_email_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dispatch_rules_tenant ON public.tenant_dispatch_rules(tenant_id);

-- RLS & Políticas
ALTER TABLE public.tenant_whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_dispatch_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all tenant_whatsapp_templates" ON public.tenant_whatsapp_templates FOR ALL USING (true);
CREATE POLICY "Allow public all tenant_email_templates" ON public.tenant_email_templates FOR ALL USING (true);
CREATE POLICY "Allow public all tenant_dispatch_rules" ON public.tenant_dispatch_rules FOR ALL USING (true);
