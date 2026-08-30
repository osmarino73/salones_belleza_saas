export type PlanTier = 'free' | 'inicio' | 'crecimiento' | 'pro_ia' | 'escala' | 'agencia';

export interface PlanFeatureConfig {
  id: PlanTier;
  name: string;
  price_cop: number;
  max_stylists: number;
  has_booking_online: boolean;
  has_stylist_app: boolean;
  has_pos_cash_register: boolean;
  has_commission_liquidation: boolean;
  has_whatsapp_ai: boolean;
  has_omnichannel: boolean;
  has_meta_ads_funnels: boolean;
  has_dedicated_support: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  is_active: boolean;
  plan: 'basic' | 'pro_ai' | 'vip_360';
  plan_tier?: PlanTier;
  subscription_status?: 'trial' | 'active' | 'past_due' | 'cancelled';
  subscription_price_cop?: number;
  trial_started_at?: string;
  trial_ends_at?: string;
  max_stylists?: number;
  has_pos_access?: boolean;
  has_ai_whatsapp?: boolean;
  has_omnichannel?: boolean;
  has_meta_ads?: boolean;
  owner_email?: string;
  currency?: 'COP' | 'USD' | 'MXN' | 'EUR';
  business_hours?: { summary?: string; open?: string; close?: string };
  hero_image_url?: string;
  logo_icon?: string; // Emoji o icono (ej. '✨', '✂️', '🪄', '👑', '💅', '🧖‍♀️')
  hero_eyebrow?: string; // Saludo superior (ej. 'Bienvenidas a ❤️')
  slogan?: string; // Nombre o título principal
  title_accent?: string; // Subtítulo fucsia/dorado (ej. 'Centro de Estética' o 'Urabá')
  navbar_tagline?: string; // Lema o subtítulo de la barra de navegación (ej. 'Especialistas en Rizos • Apartadó')
  subtitle?: string; // Párrafo descriptivo de servicios
  primary_color?: string; // Color hexadecimal principal de la marca (ej. '#d92672')
  show_team_section?: boolean; // Controla si se muestra u oculta la sección Nosotros/Equipo en la web
  show_first_visit_discount?: boolean; // Controla si se muestra el banner de descuento por primera visita (por defecto false)
  first_visit_discount_pct?: number; // Porcentaje de descuento (ej. 10, 15, 20)
  first_visit_discount_title?: string; // Texto personalizado del descuento
  about_image_url?: string; // Fotografía del salón / espacio para la sección Sobre Nosotros
  about_badge_text?: string; // Badge VIP sobre la foto (ej. 'VIP EXPERIENCIA CURLY')
  about_eyebrow?: string; // Saludo superior de la sección (ej. 'Sobre Nosotros')
  about_title?: string; // Título principal de la sección (ej. 'CUIDADO. DEFINICIÓN.')
  about_title_accent?: string; // Acento destacado (ej. 'PASIÓN POR TUS RIZOS.')
  about_description?: string; // Párrafo descriptivo o historia del negocio
  about_years_exp?: string; // Métricas rápidas (ej. '+8')
  about_clients_count?: string; // Métricas rápidas (ej. '+3.5K')
  about_stat3_text?: string; // Métrica 3 (ej. '100%' o 'Productos Limpios')
  about_rating_text?: string; // Calificación (ej. '5.0')
  show_about_section?: boolean; // Controla si se muestra u oculta la sección Sobre Nosotros
  created_at: string;
}

export interface BlockedSlot {
  id: string;
  stylist_id: string;
  date: string; // 'YYYY-MM-DD'
  reason: string; // 'Vacaciones', 'Cita Médica', 'Día Libre', 'Capacitación', 'Personal'
  full_day: boolean;
  start_time?: string;
  end_time?: string;
  created_at?: string;
}

export interface Stylist {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  phone_whatsapp?: string;
  role?: 'admin' | 'colaborador';
  is_owner?: boolean;
  attends_clients?: boolean; // True si atiende clientes y aparece en reservas
  show_on_web?: boolean; // True si se muestra en la página web pública (hasta 4 max)
  specialty: string;
  photo_url: string;
  rating: number;
  reviews_count: number;
  commission_service_pct: number;
  commission_retail_pct: number;
  working_days?: number[]; // [0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab]
  blocked_dates?: string[]; // ['2026-08-25', '2026-08-26']
  blocked_slots?: BlockedSlot[];
  service_ids?: string[]; // IDs de servicios específicos que atiende
  service_categories?: string[]; // Categorías que domina (slugs de ServiceCategory)
  is_active: boolean;
}

export interface ServiceCategory {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  icon?: string; // Emoji o icono (ej. '🎨', '✂️', '💅', '🧖‍♀️', '💈')
  description?: string;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  category: string; // 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa' o categoría personalizada
  duration_minutes: number;
  price_usd?: number;
  price?: number;
  price_cop?: number;
  image_url?: string;
  requires_patch_test: boolean;
  description: string;
  is_featured?: boolean;
}

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  brand: string;
  category: string;
  price_usd: number;
  cost_price_usd?: number;
  stock_quantity: number;
  min_stock_alert?: number;
  sku?: string;
  created_at: string;
}

export interface ColorFormula {
  id: string;
  client_id: string;
  stylist_id: string;
  stylist_name?: string;
  formula_text: string;
  developer_volume: string;
  exposure_minutes: number;
  plex_used: boolean;
  porosity_level: 'baja' | 'media' | 'alta';
  diagnostic_notes: string;
  created_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  full_name: string;
  phone_whatsapp: string;
  email?: string;
  birthday?: string;
  status: 'vip' | 'frecuente' | 'nuevo' | 'en_riesgo';
  total_spent_usd: number;
  visits_count: number;
  preferred_stylist_id?: string;
  allergies?: string;
  formulas?: ColorFormula[];
  last_visit_at?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  stylist_id: string;
  stylist_name: string;
  service_id: string;
  service_name: string;
  service_ids?: string[];
  services_summary?: string;
  date: string;
  time: string;
  duration_minutes: number;
  price_usd: number;
  price_cop?: number;
  status: 'pendiente' | 'confirmada_wa' | 'en_atencion' | 'completada' | 'cobrada' | 'no_show';
  wa_reminder_24h_sent: boolean;
  wa_reminder_2h_sent: boolean;
  notes?: string;
  created_at: string;
}

export interface DashboardMetrics {
  total_month_revenue_usd: number;
  revenue_trend_pct: number;
  today_revenue_usd: number;
  today_appointments_count: number;
  confirmed_wa_pct: number;
  ai_scheduled_count: number;
  pending_commissions_usd: number;
  monthly_goal_usd: number;
  monthly_goal_progress_pct: number;
}

export interface TenantAISettings {
  id: string;
  tenant_id: string;
  agent_name: string;
  agent_avatar_url?: string;
  personality_tone: 'elegante_calido' | 'profesional_formal' | 'cercano_juvenil';
  language: string;
  system_prompt_custom: string;
  business_bio: string;
  address_instructions?: string;
  cancellation_policy: string;
  faqs: Array<{ pregunta: string; respuesta: string }>;
  booking_enabled: boolean;
  requires_deposit: boolean;
  deposit_type: 'fixed' | 'percentage';
  deposit_value: number;
  payment_instructions?: string;
  zernio_channel_id?: string;
  whatsapp_phone_number?: string;
  zernio_connected?: boolean;
  zernio_status?: 'disconnected' | 'connecting' | 'connected' | 'error';
  zernio_connection_mode?: 'coexistence' | 'cloud_api';
  instagram_username?: string;
  instagram_connected?: boolean;
  instagram_status?: 'disconnected' | 'connecting' | 'connected' | 'error';
  messenger_page_name?: string;
  messenger_connected?: boolean;
  messenger_status?: 'disconnected' | 'connecting' | 'connected' | 'error';
  is_active: boolean;
  human_takeover_active: boolean;
  human_takeover_until?: string;
  human_takeover_timeout_minutes: number;
  send_reminder_whatsapp: boolean;
  reminder_hours_before: number;
  reminder_custom_message: string;
  send_followup_review: boolean;
  followup_days_after: number;
  google_maps_review_url?: string;
  created_at: string;
  updated_at: string;
}

// =========================================================================
// POS & CAJA REGISTRADORA TYPES
// =========================================================================

export interface CashShift {
  id: string;
  tenant_id: string;
  opened_by_name: string;
  opened_by_email?: string;
  opened_at: string;
  initial_amount_cop: number;
  opening_notes?: string;
  status: 'open' | 'closed';
  closed_by_name?: string;
  closed_at?: string;
  closing_notes?: string;
  expected_cash_cop?: number;
  actual_cash_cop?: number;
  difference_cash_cop?: number;
  total_sales_cop?: number;
  total_cash_sales_cop?: number;
  total_card_sales_cop?: number;
  total_digital_sales_cop?: number; // Nequi, Daviplata, Transferencia
  total_expenses_cop?: number;
  total_incomes_cop?: number;
  total_commissions_cop?: number;
}

export interface CashMovement {
  id: string;
  shift_id: string;
  tenant_id: string;
  type: 'expense' | 'income'; // Gasto o Entrada extra de efectivo
  category: 'insumos' | 'servicios' | 'cafe_alimentos' | 'domicilios' | 'propinas' | 'otro';
  amount_cop: number;
  description: string;
  created_by_name: string;
  created_at: string;
}

export interface PosSaleItem {
  id: string;
  item_id: string;
  name: string;
  type: 'service' | 'retail';
  quantity: number;
  unit_price_cop: number;
  total_cop: number;
  stylist_id?: string;
  stylist_name?: string;
  commission_pct?: number;
  commission_amount_cop?: number;
}

export interface PosSale {
  id: string;
  shift_id: string;
  tenant_id: string;
  sale_number: string;
  client_id?: string;
  client_name: string;
  client_phone?: string;
  items: PosSaleItem[];
  subtotal_cop: number;
  discount_amount_cop: number;
  deposit_deducted_cop: number;
  extra_charge_amount_cop?: number;
  extra_charge_concept?: string;
  tip_amount_cop: number;
  total_cop: number;
  payment_method: 'efectivo' | 'nequi' | 'daviplata' | 'tarjeta' | 'transferencia' | 'mixto';
  payment_breakdown?: {
    cash_cop?: number;
    nequi_daviplata_cop?: number;
    card_cop?: number;
    transfer_cop?: number;
  };
  cash_received_cop?: number;
  change_returned_cop?: number;
  total_commissions_cop: number;
  receipt_sent_wa?: boolean;
  notes?: string;
  created_at: string;
}

export interface BusinessServiceItem {
  titulo: string;
  descripcion: string;
  precio_cop?: number;
  duracion_minutos?: number;
  [key: string]: any;
}

export interface BusinessSpecialistItem {
  nombre: string;
  rol: string;
  especialidades?: string[];
  [key: string]: any;
}

export interface BusinessContactData {
  telefono_principal?: string;
  whatsapp?: {
    numero: string;
    link?: string;
  };
  [key: string]: any;
}

export interface BusinessDataPayload {
  nombre: string;
  rubro?: string;
  eslogan?: string;
  contacto?: BusinessContactData;
  ubicacion?: {
    google_maps_url?: string;
    direccion?: string;
    ciudad?: string;
    [key: string]: any;
  };
  horario_atencion?: string;
  servicios?: BusinessServiceItem[];
  especialistas?: BusinessSpecialistItem[];
  [key: string]: any;
}

export interface ProspectSite {
  id: string;
  slug: string;
  business_name: string;
  phone_whatsapp: string;
  address?: string;
  city?: string;
  country?: string;
  google_maps_url?: string;
  raw_html: string;
  category?: 'salon' | 'barberia' | 'spa' | 'estetica' | 'nails';
  status: 'prospecto' | 'contactado' | 'reclamado' | 'cliente_pago';
  claimed_tenant_id?: string;
  business_data?: BusinessDataPayload;
  created_by?: string;
  creator_email?: string;
  views_count: number;
  created_at: string;
  updated_at?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'hero_salon' | 'hero_spa' | 'hero_barber' | 'hero_nails' | 'color' | 'cortes' | 'keratina' | 'nails' | 'spa_facial' | 'barberia' | 'maquillaje' | 'especialistas' | 'general';
  tags: string[];
  is_custom?: boolean;
  tenant_id?: string;
  created_at?: string;
}

export interface StudioThemeConfig {
  presetName: 'rose_gold' | 'dark_gold' | 'botanical_sage' | 'pastel_pink' | 'cyber_neon' | 'minimal_white' | 'custom';
  primaryColor: string;      // Ej. #FF5A36, #ec4899, #d97706
  accentColor: string;       // Ej. #f43f5e, #a855f7, #10b981
  backgroundColor: string;   // Ej. #090B10, #0B130E, #FFFFFF
  surfaceColor: string;       // Ej. #141926, #121F17, #F8FAFC
  textColor: string;          // Ej. #F8FAFC, #0F172A
  mutedColor: string;         // Ej. #94A3B8, #64748B
  fontFamily: 'serif_luxury' | 'modern_sans' | 'clean_minimal' | 'bold_display';
  borderRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-none';
  glassmorphism: boolean;
}

export interface StudioServiceItem {
  id: string;
  titulo: string;
  descripcion: string;
  precio_cop: number;
  duracion_minutos: number;
  imagen_url: string;
  badge?: string;
}

export interface StudioSpecialistItem {
  id: string;
  nombre: string;
  rol: string;
  avatar_url: string;
  especialidad: string;
}

export interface HomepageStudioState {
  businessName: string;
  slogan: string;
  rubroDescription: string;
  category: 'salon' | 'barberia' | 'spa' | 'estetica' | 'nails';
  phoneWhatsapp: string;
  phoneCall: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  scheduleSummary: string;
  heroImageUrl: string;
  referenceImageUrl?: string;
  theme: StudioThemeConfig;
  services: StudioServiceItem[];
  specialists: StudioSpecialistItem[];
}

