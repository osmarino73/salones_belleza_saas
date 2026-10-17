-- ==============================================================================
-- SCHEMA SQL DE SUPABASE PARA KEWE.APP (SALONES, BARBERÍAS, NAILS & SPAS)
-- Módulo de Prospección en Campo, Editor Web y Biblioteca de Recursos Visuales
-- ==============================================================================

-- 1. TABLA DE AGENTES DE CAMPO (ASESORES COMERCIALES EN CALLE)
create table if not exists public.agentes_campo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nombre text not null,
  email text unique not null,
  telefono text,
  estado text check (estado in ('activo', 'inactivo')) default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_kewe_agentes_email on public.agentes_campo(email);
create index if not exists idx_kewe_agentes_user_id on public.agentes_campo(user_id);
create index if not exists idx_kewe_agentes_estado on public.agentes_campo(estado);

alter table public.agentes_campo enable row level security;

create policy "Lectura de agentes para usuarios del sistema"
  on public.agentes_campo for select
  using (true);

create policy "SuperAdmin gestion total de agentes de campo"
  on public.agentes_campo for all
  using (true);


-- 2. TABLA DE SITIOS PROSPECTOS (DEMOS EN VIVO CREADAS POR AGENTES DE CAMPO)
create table if not exists public.prospect_sites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_name text not null,
  phone_whatsapp text not null,
  address text,
  city text,
  google_maps_url text,
  raw_html text not null,
  category text check (category in ('barberia', 'peluqueria_damas', 'unas_nails', 'pestanas_cejas', 'spa_estetica', 'otro')) default 'barberia',
  status text check (status in ('prospecto', 'contactado', 'reclamado', 'cliente_pago')) default 'prospecto',
  claimed_tenant_id uuid references auth.users(id),
  primary_color text default '#d97706',
  business_data jsonb default '{}'::jsonb,
  created_by uuid references auth.users(id),
  creator_email text,
  views_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_kewe_prospect_slug on public.prospect_sites(slug);
create index if not exists idx_kewe_prospect_status on public.prospect_sites(status);
create index if not exists idx_kewe_prospect_creator on public.prospect_sites(creator_email);

alter table public.prospect_sites enable row level security;

create policy "Prospectos accesibles publicamente por slug" 
  on public.prospect_sites for select 
  using (true);

create policy "Agentes y admin gestionan prospectos" 
  on public.prospect_sites for all 
  using (true);


-- 3. TABLA DE PLANTILLAS OPTIMIZADAS PARA BELLEZA Y CUIDADO PERSONAL
create table if not exists public.prospect_templates (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  hero_image_url text not null,
  preview_image_url text not null,
  primary_color text default '#f59e0b',
  design_md text not null,
  html_template text not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create index if not exists idx_kewe_templates_category on public.prospect_templates(category);
create index if not exists idx_kewe_templates_active on public.prospect_templates(is_active);

alter table public.prospect_templates enable row level security;

create policy "Plantillas accesibles publicamente para lectura"
  on public.prospect_templates for select
  using (true);

create policy "Plantillas administrables por usuarios autenticados"
  on public.prospect_templates for all
  using (true);


-- 4. TABLA DE BIBLIOTECA DE IMÁGENES OPTIMIZADAS (STOCK BEAUTY)
create table if not exists public.stock_beauty_images (
  id text primary key,
  title text not null,
  category text not null,
  category_label text not null,
  image_type text not null default 'servicio', -- 'servicio', 'hero_desktop', 'hero_mobile', 'banner_catalogo', 'story'
  image_url text not null,
  thumbnail_url text not null,
  tags text[] default array[]::text[],
  created_at timestamptz default now()
);

create index if not exists idx_kewe_stock_category on public.stock_beauty_images(category);
create index if not exists idx_kewe_stock_type on public.stock_beauty_images(image_type);

alter table public.stock_beauty_images enable row level security;

create policy "Imagenes stock accesibles publicamente"
  on public.stock_beauty_images for select
  using (true);

create policy "Admin gestiona imagenes stock"
  on public.stock_beauty_images for all
  using (true);
