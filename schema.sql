-- ==========================================================================
-- BeautyFlow AI - Schema Maestro de Base de Datos (PostgreSQL / Supabase)
-- Plataforma SaaS Multi-Tenant para Salones de Belleza, Barberías y Spas
-- ==========================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Función para actualización automática de updated_at
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================================
-- 1. TABLA DE SALONES / TENANTS (Multi-Tenant Core)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    whatsapp_number VARCHAR(50) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    plan_tier VARCHAR(50) DEFAULT 'pro_ia', -- 'basic', 'pro_ia', 'vip_360'
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Colombia',
    logo_url TEXT,
    business_hours JSONB DEFAULT '{"lun_vie": "08:00 - 20:00", "sab": "08:00 - 21:00", "dom": "Cerrado"}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 2. TABLA DE ESTILISTAS / EQUIPO
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.stylists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(150) NOT NULL, -- 'Master Colorista', 'Barber', 'Nails', 'Spa'
    phone VARCHAR(50),
    email VARCHAR(255),
    photo_url TEXT,
    service_commission_pct NUMERIC(5,2) DEFAULT 45.00, -- 45% en servicios
    product_commission_pct NUMERIC(5,2) DEFAULT 10.00, -- 10% en venta de retail
    rating NUMERIC(3,2) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 0,
    working_hours JSONB DEFAULT '{"dias": ["Mar", "Mie", "Jue", "Vie", "Sab"], "inicio": "09:00", "fin": "19:00"}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 3. TABLA DE CATÁLOGO DE SERVICIOS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Color', 'Corte', 'Keratina', 'Nails', 'Barberia', 'Spa'
    price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    requires_patch_test BOOLEAN DEFAULT FALSE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 4. TABLA DE INVENTARIO & PRODUCTOS RETAIL (Ventas en Salón)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(150), -- 'Olaplex', 'L''Oréal', 'Kérastase', 'Moroccanoil'
    sku VARCHAR(100),
    category VARCHAR(100) DEFAULT 'retail', -- 'shampoo', 'mascarilla', 'oleo', 'cera'
    price NUMERIC(10,2) NOT NULL,
    cost_price NUMERIC(10,2) DEFAULT 0.00,
    stock_quantity INTEGER DEFAULT 0,
    min_stock_alert INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 5. TABLA DE CLIENTES (CRM 360°)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone_whatsapp VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    birth_date DATE,
    status VARCHAR(50) DEFAULT 'frecuente', -- 'vip', 'frecuente', 'nuevo', 'en_riesgo'
    total_spent_usd NUMERIC(10,2) DEFAULT 0.00,
    visits_count INTEGER DEFAULT 0,
    preferred_stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    allergies TEXT,
    notes TEXT,
    last_visit_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_tenant_client_phone UNIQUE (tenant_id, phone_whatsapp)
);

-- ==========================================================================
-- 6. TABLA DE FÓRMULAS DE COLORIMETRÍA & TINTES (CRM Capilar)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.color_formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    stylist_name VARCHAR(255),
    formula_text TEXT NOT NULL, -- ej: "Majirel 7.1 (30g) + 8.2 (15g) + 20 Vol (45ml)"
    brand VARCHAR(100) DEFAULT 'L''Oréal Majirel',
    developer_volume VARCHAR(50) DEFAULT '20 Vol', -- '10 Vol', '20 Vol', '30 Vol', '40 Vol'
    exposure_minutes INTEGER DEFAULT 35,
    plex_used BOOLEAN DEFAULT TRUE,
    porosity_level VARCHAR(50) DEFAULT 'media', -- 'baja', 'media', 'alta'
    scalp_condition VARCHAR(100) DEFAULT 'Normal',
    diagnostic_notes TEXT,
    before_photo_url TEXT,
    after_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 7. TABLA DE CITAS & AGENDAMIENTO
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50) NOT NULL,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    stylist_name VARCHAR(255) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time VARCHAR(50) NOT NULL, -- '02:00 PM'
    duration_minutes INTEGER DEFAULT 60,
    price_usd NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmada_wa', -- 'pendiente', 'confirmada_wa', 'en_atencion', 'cobrada', 'no_show', 'cancelada'
    booked_via VARCHAR(50) DEFAULT 'whatsapp_ia', -- 'whatsapp_ia', 'web_widget', 'reception_pos'
    wa_reminder_24h_sent BOOLEAN DEFAULT FALSE,
    wa_reminder_2h_sent BOOLEAN DEFAULT FALSE,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_amount NUMERIC(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 8. TABLA DE TRANSACCIONES POS & LIQUIDACIÓN DE COMISIONES
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    stylist_name VARCHAR(255),
    service_subtotal NUMERIC(10,2) DEFAULT 0.00,
    retail_subtotal NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'card', -- 'cash', 'card', 'nequi_transfer', 'wa_link'
    stylist_commission_earned NUMERIC(10,2) NOT NULL,
    salon_net_earned NUMERIC(10,2) NOT NULL,
    is_settled BOOLEAN DEFAULT FALSE, -- Si ya fue pagada la comisión semanal al estilista
    settled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 9. TABLA DE LOGS DE WHATSAPP IA & RECORDATORIOS AUTOMÁTICOS
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    phone_number VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL, -- 'inbound', 'outbound'
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'audio', 'reminder_24h', 'reminder_2h'
    content TEXT NOT NULL,
    audio_transcript TEXT,
    ai_intent VARCHAR(100), -- 'booking_inquiry', 'pricing', 'reschedule', 'confirmation'
    status VARCHAR(50) DEFAULT 'delivered', -- 'sent', 'delivered', 'read', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- 10. TABLA DE LEADS DE LA LANDING B2B (Solicitudes de Web Gratis)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.landing_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    city_country VARCHAR(150),
    business_type VARCHAR(100), -- 'salon', 'barberia', 'spa_nails', 'multisede'
    status VARCHAR(50) DEFAULT 'nuevo', -- 'nuevo', 'contactado', 'demo_entregada', 'cliente_activo'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================================
-- ÍNDICES PARA ALTO RENDIMIENTO (Queries instantáneas)
-- ==========================================================================
CREATE INDEX IF NOT EXISTS idx_stylists_tenant ON public.stylists(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant ON public.services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_tenant_phone ON public.clients(tenant_id, phone_whatsapp);
CREATE INDEX IF NOT EXISTS idx_color_formulas_client ON public.color_formulas(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_date ON public.appointments(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_stylist ON public.appointments(stylist_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_tenant ON public.pos_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_tenant ON public.whatsapp_logs(tenant_id);

-- ==========================================================================
-- SEGURIDAD ROW LEVEL SECURITY (RLS) & POLÍTICAS
-- ==========================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_leads ENABLE ROW LEVEL SECURITY;

-- Políticas universales para demo y cliente Supabase API
CREATE POLICY "Allow public all tenants" ON public.tenants FOR ALL USING (true);
CREATE POLICY "Allow public all stylists" ON public.stylists FOR ALL USING (true);
CREATE POLICY "Allow public all services" ON public.services FOR ALL USING (true);
CREATE POLICY "Allow public all products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public all clients" ON public.clients FOR ALL USING (true);
CREATE POLICY "Allow public all color_formulas" ON public.color_formulas FOR ALL USING (true);
CREATE POLICY "Allow public all appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow public all pos_transactions" ON public.pos_transactions FOR ALL USING (true);
CREATE POLICY "Allow public all whatsapp_logs" ON public.whatsapp_logs FOR ALL USING (true);
CREATE POLICY "Allow public all landing_leads" ON public.landing_leads FOR ALL USING (true);

-- ==========================================================================
-- DATOS SEMILLA (SEED DATA)
-- ==========================================================================

-- Salón Principal
INSERT INTO public.tenants (id, name, slug, phone, whatsapp_number, plan_tier, address, city, country)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Studio Glamour Spa',
    'studioglamour',
    '+57 300 900 8000',
    '+57 300 900 8000',
    'pro_ia',
    'Carrera 43A # 1-50, El Poblado',
    'Medellín',
    'Colombia'
) ON CONFLICT (id) DO NOTHING;

-- Estilistas
INSERT INTO public.stylists (id, tenant_id, name, specialty, photo_url, service_commission_pct, product_commission_pct, rating, reviews_count)
VALUES 
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Sofía Restrepo', 'Master Colorista & Balayage', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 45, 10, 4.9, 128),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Carlos Morales', 'Estilista Capilar & Barber', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80', 45, 10, 4.8, 95),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Laura Valencia', 'Especialista en Nails & Spa', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', 50, 10, 5.0, 82)
ON CONFLICT (id) DO NOTHING;

-- Servicios
INSERT INTO public.services (id, tenant_id, name, category, price, duration_minutes, requires_patch_test, description)
VALUES 
('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Balayage Rubio Cenizo + Olaplex', 'Color', 110.00, 120, true, 'Técnica a mano alzada, incluye matizado violeta, brushing y tratamiento protector Olaplex.'),
('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', 'Corte Bob en Capas + Hidratación', 'Corte', 45.00, 60, false, 'Diagnóstico de morfología facial, corte y mascarilla hidratante profunda.'),
('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000001', 'Keratina Orgánica Antifrizz', 'Keratina', 75.00, 90, false, 'Alisado termoactivo sin formol, brillo espejo por 4 meses.'),
('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000001', 'Uñas Esculpidas en Poligel + Nail Art', 'Nails', 55.00, 75, false, 'Manicura rusa combinada, extensión con molde y diseño a mano alzada.')
ON CONFLICT (id) DO NOTHING;

-- Productos Retail
INSERT INTO public.products (tenant_id, name, brand, category, price, cost_price, stock_quantity)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Olaplex Nº 3 Hair Perfector', 'Olaplex', 'Tratamiento', 32.00, 18.00, 14),
('00000000-0000-0000-0000-000000000001', 'Shampoo Matizador Violeta 300ml', 'L''Oréal Professionnel', 'Shampoo', 24.00, 12.50, 8),
('00000000-0000-0000-0000-000000000001', 'Óleo Reconstructor Elixir Ultime', 'Kérastase', 'Óleo', 48.00, 28.00, 6)
ON CONFLICT DO NOTHING;

-- Clientes
INSERT INTO public.clients (id, tenant_id, full_name, phone_whatsapp, email, status, total_spent_usd, visits_count, allergies)
VALUES 
('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000001', 'María Fernanda López', '+57 312 456 7890', 'maria@ejemplo.com', 'vip', 890.00, 8, 'Ninguna. Prueba de parche OK.'),
('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000001', 'Camila Mendoza', '+57 310 889 4433', 'camila.mendoza@gmail.com', 'frecuente', 340.00, 4, 'Ninguna reportada.'),
('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000001', 'Andrés Felipe Castro', '+57 301 223 9988', 'andres.castro@gmail.com', 'frecuente', 210.00, 5, 'Piel sensible a la navaja.')
ON CONFLICT (id) DO NOTHING;

-- Fórmulas de Colorimetría
INSERT INTO public.color_formulas (tenant_id, client_id, stylist_name, formula_text, developer_volume, exposure_minutes, plex_used, diagnostic_notes)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'Sofía Restrepo', 'L''Oréal Majirel 7.1 (30g) + 8.2 (15g) + 20 Vol (45ml)', '20 Vol', 38, true, 'Porosidad media en medios y puntas. Fondo de decoloración 8. Matizado violeta suave.')
ON CONFLICT DO NOTHING;

-- Citas de Hoy
INSERT INTO public.appointments (tenant_id, client_id, client_name, client_phone, stylist_name, service_name, date, time, duration_minutes, price_usd, status, wa_reminder_24h_sent, wa_reminder_2h_sent)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000031', 'María Fernanda López', '+57 312 456 7890', 'Sofía Restrepo', 'Balayage Rubio Cenizo + Olaplex', CURRENT_DATE, '02:00 PM', 120, 110.00, 'en_atencion', true, true),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000032', 'Camila Mendoza', '+57 310 889 4433', 'Sofía Restrepo', 'Corte Bob en Capas + Brushing', CURRENT_DATE, '04:30 PM', 60, 45.00, 'confirmada_wa', true, false),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000033', 'Andrés Felipe Castro', '+57 301 223 9988', 'Carlos Morales', 'Fade Clásico + Ritual Barba', CURRENT_DATE, '02:30 PM', 45, 35.00, 'en_atencion', true, true)
ON CONFLICT DO NOTHING;

-- ==========================================================================
-- 11. TABLA DE CONFIGURACIÓN DEL AGENTE IA POR NEGOCIO (Multi-Tenant)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.tenant_ai_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) DEFAULT 'Flowy',
    agent_avatar_url TEXT,
    personality_tone VARCHAR(100) DEFAULT 'elegante_calido',
    language VARCHAR(10) DEFAULT 'es',
    system_prompt_custom TEXT DEFAULT 'Eres el asistente virtual oficial del salón. Tu misión es dar la bienvenida, resolver dudas, compartir tarifas y agendar citas con calidez, elegancia y precisión.',
    business_bio TEXT DEFAULT 'Salón de belleza premium especializado en colorimetría, corte, estética capilar, uñas y spa.',
    address_instructions TEXT,
    cancellation_policy TEXT DEFAULT 'Puedes cancelar o reprogramar tu cita con al menos 4 horas de anticipación sin penalidad.',
    faqs JSONB DEFAULT '[
        {"pregunta": "¿Aceptan mascotas?", "respuesta": "¡Sí! Somos un espacio Pet Friendly."},
        {"pregunta": "¿Tienen parqueadero?", "respuesta": "Sí, contamos con parqueadero gratuito para clientes."},
        {"pregunta": "¿Qué métodos de pago reciben?", "respuesta": "Aceptamos efectivo, tarjetas de débito/crédito, transferencias y pagos digitales."}
    ]'::jsonb,
    booking_enabled BOOLEAN DEFAULT TRUE,
    requires_deposit BOOLEAN DEFAULT FALSE,
    deposit_type VARCHAR(20) DEFAULT 'fixed',
    deposit_value NUMERIC(10,2) DEFAULT 0.00,
    payment_instructions TEXT DEFAULT 'Para confirmar tu cita con abono, puedes transferir a nuestras cuentas autorizadas y enviarnos el comprobante.',
    zernio_channel_id VARCHAR(255),
    whatsapp_phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    human_takeover_active BOOLEAN DEFAULT FALSE,
    human_takeover_until TIMESTAMP WITH TIME ZONE,
    human_takeover_timeout_minutes INTEGER DEFAULT 120,
    send_reminder_whatsapp BOOLEAN DEFAULT TRUE,
    reminder_hours_before INTEGER DEFAULT 2,
    reminder_custom_message TEXT DEFAULT '✨ Te recordamos tu cita de belleza hoy a las {HORA} con {ESTILISTA} para tu {SERVICIO}. Te esperamos en {DIRECCION}.',
    send_followup_review BOOLEAN DEFAULT TRUE,
    followup_days_after INTEGER DEFAULT 1,
    google_maps_review_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_tenant ON public.tenant_ai_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_whatsapp ON public.tenant_ai_settings(whatsapp_phone_number);
CREATE INDEX IF NOT EXISTS idx_tenant_ai_settings_zernio ON public.tenant_ai_settings(zernio_channel_id);

ALTER TABLE public.tenant_ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all tenant_ai_settings" ON public.tenant_ai_settings FOR ALL USING (true);

-- Configuración Inicial IA para Salón Demo
INSERT INTO public.tenant_ai_settings (tenant_id, agent_name, personality_tone, whatsapp_phone_number, system_prompt_custom)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Flowy', 'elegante_calido', '+573001234567', 'Eres Flowy, la asesora de belleza y agendamiento con IA de Luxe Hair & Spa Studio. Siempre confirma con la clienta el servicio y estilista preferido.')
ON CONFLICT (tenant_id) DO NOTHING;

