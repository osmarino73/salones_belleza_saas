-- ==========================================================================
-- BeautyFlow AI - Migración: Módulo de Caja POS, Turnos y Ventas
-- Tablas: cash_shifts, cash_movements, pos_sales, pos_sale_items
-- ==========================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Turnos de Caja (Aperturas y Cierres)
CREATE TABLE IF NOT EXISTS public.cash_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    opened_by_name VARCHAR(100) NOT NULL,
    opened_by_email VARCHAR(150),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    initial_amount_cop NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    opening_notes TEXT,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed'
    closed_by_name VARCHAR(100),
    closed_at TIMESTAMP WITH TIME ZONE,
    closing_notes TEXT,
    expected_cash_cop NUMERIC(15,2) DEFAULT 0.00,
    actual_cash_cop NUMERIC(15,2) DEFAULT 0.00,
    difference_cash_cop NUMERIC(15,2) DEFAULT 0.00,
    total_sales_cop NUMERIC(15,2) DEFAULT 0.00,
    total_cash_sales_cop NUMERIC(15,2) DEFAULT 0.00,
    total_card_sales_cop NUMERIC(15,2) DEFAULT 0.00,
    total_digital_sales_cop NUMERIC(15,2) DEFAULT 0.00,
    total_expenses_cop NUMERIC(15,2) DEFAULT 0.00,
    total_incomes_cop NUMERIC(15,2) DEFAULT 0.00,
    total_commissions_cop NUMERIC(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Movimientos de Caja Chica (Gastos / Entradas)
CREATE TABLE IF NOT EXISTS public.cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES public.cash_shifts(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- 'expense', 'income'
    category VARCHAR(50) DEFAULT 'otro',
    amount_cop NUMERIC(15,2) NOT NULL,
    description TEXT NOT NULL,
    created_by_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Ventas POS
CREATE TABLE IF NOT EXISTS public.pos_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES public.cash_shifts(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    sale_number VARCHAR(50) NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(50),
    subtotal_cop NUMERIC(15,2) NOT NULL,
    discount_amount_cop NUMERIC(15,2) DEFAULT 0.00,
    deposit_deducted_cop NUMERIC(15,2) DEFAULT 0.00,
    extra_charge_amount_cop NUMERIC(15,2) DEFAULT 0.00,
    extra_charge_concept TEXT,
    tip_amount_cop NUMERIC(15,2) DEFAULT 0.00,
    total_cop NUMERIC(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'efectivo', 'nequi', 'daviplata', 'tarjeta', 'transferencia', 'mixto'
    payment_breakdown JSONB DEFAULT '{}'::jsonb,
    cash_received_cop NUMERIC(15,2) DEFAULT 0.00,
    change_returned_cop NUMERIC(15,2) DEFAULT 0.00,
    total_commissions_cop NUMERIC(15,2) DEFAULT 0.00,
    receipt_sent_wa BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Ítems de Ventas POS
CREATE TABLE IF NOT EXISTS public.pos_sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES public.pos_sales(id) ON DELETE CASCADE,
    item_id UUID,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'service', 'retail'
    quantity INTEGER DEFAULT 1,
    unit_price_cop NUMERIC(15,2) NOT NULL,
    total_cop NUMERIC(15,2) NOT NULL,
    stylist_id UUID REFERENCES public.stylists(id) ON DELETE SET NULL,
    stylist_name VARCHAR(100),
    commission_pct NUMERIC(5,2) DEFAULT 0.00,
    commission_amount_cop NUMERIC(15,2) DEFAULT 0.00
);

-- 6. Índices para Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_cash_shifts_tenant ON public.cash_shifts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pos_sales_shift ON public.pos_sales(shift_id);
CREATE INDEX IF NOT EXISTS idx_pos_sale_items_sale ON public.pos_sale_items(sale_id);
