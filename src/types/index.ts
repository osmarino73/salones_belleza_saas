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
  service_categories?: ('color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa')[]; // Categorías que domina
  is_active: boolean;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  category: 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa';
  duration_minutes: number;
  price_usd?: number;
  price?: number;
  price_cop?: number;
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
  views_count: number;
  created_at: string;
  updated_at?: string;
}

