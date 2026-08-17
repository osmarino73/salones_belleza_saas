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
  created_at: string;
}

export interface Stylist {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  photo_url: string;
  rating: number;
  reviews_count: number;
  commission_service_pct: number;
  commission_retail_pct: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  category: 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa';
  duration_minutes: number;
  price_usd: number;
  requires_patch_test: boolean;
  description: string;
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
  date: string;
  time: string;
  duration_minutes: number;
  price_usd: number;
  status: 'pendiente' | 'confirmada_wa' | 'en_atencion' | 'cobrada' | 'no_show';
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

