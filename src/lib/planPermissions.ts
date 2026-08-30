export type SubscriptionPlan = 'free' | 'inicio' | 'crecimiento' | 'pro_ia';

export interface PlanFeatureConfig {
  id: SubscriptionPlan;
  name: string;
  badge: string;
  price_cop: number;
  price_label: string;
  max_stylists: number;
  can_use_booking_saas: boolean;
  can_use_pos: boolean;
  can_use_commissions: boolean;
  can_use_inventory: boolean;
  can_use_stylist_portal: boolean;
  can_use_color_crm: boolean;
  can_use_loyalty_reactivation: boolean;
  can_use_templates: boolean;
  can_use_ai_whatsapp: boolean;
  can_use_automatic_reminders: boolean;
  description: string;
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanFeatureConfig> = {
  free: {
    id: 'free',
    name: 'Plan Gratuito',
    badge: '🌐 Plan Gratuito',
    price_cop: 0,
    price_label: '$0 COP (De por vida)',
    max_stylists: 1,
    can_use_booking_saas: false,
    can_use_pos: false,
    can_use_commissions: false,
    can_use_inventory: false,
    can_use_stylist_portal: false,
    can_use_color_crm: false,
    can_use_loyalty_reactivation: false,
    can_use_templates: false,
    can_use_ai_whatsapp: false,
    can_use_automatic_reminders: false,
    description: 'Página web profesional completa con catálogo de fotos, dirección en Google Maps y botón de WhatsApp.'
  },
  inicio: {
    id: 'inicio',
    name: 'Plan Inicio',
    badge: '🚀 Plan Inicio',
    price_cop: 50000,
    price_label: '$50.000 COP / mes',
    max_stylists: 4,
    can_use_booking_saas: true,
    can_use_pos: false,
    can_use_commissions: false,
    can_use_inventory: false,
    can_use_stylist_portal: false,
    can_use_color_crm: false,
    can_use_loyalty_reactivation: false,
    can_use_templates: false,
    can_use_ai_whatsapp: false,
    can_use_automatic_reminders: false,
    description: 'Agendador interactivo 24/7 y control de citas del día para hasta 4 colaboradoras.'
  },
  crecimiento: {
    id: 'crecimiento',
    name: 'Plan Crecimiento',
    badge: '📈 Plan Crecimiento',
    price_cop: 120000,
    price_label: '$120.000 COP / mes',
    max_stylists: 9999,
    can_use_booking_saas: true,
    can_use_pos: true,
    can_use_commissions: true,
    can_use_inventory: true,
    can_use_stylist_portal: true,
    can_use_color_crm: true,
    can_use_loyalty_reactivation: false,
    can_use_templates: false,
    can_use_ai_whatsapp: false,
    can_use_automatic_reminders: false,
    description: 'Colaboradoras ilimitadas, App móvil para estilistas (/colaborador), Caja POS, liquidación automática de comisiones y CRM.'
  },
  pro_ia: {
    id: 'pro_ia',
    name: 'Plan Pro Flow IA',
    badge: '🤖 Plan Pro Flow IA',
    price_cop: 240000,
    price_label: '$240.000 COP / mes',
    max_stylists: 9999,
    can_use_booking_saas: true,
    can_use_pos: true,
    can_use_commissions: true,
    can_use_inventory: true,
    can_use_stylist_portal: true,
    can_use_color_crm: true,
    can_use_loyalty_reactivation: true,
    can_use_templates: true,
    can_use_ai_whatsapp: true,
    can_use_automatic_reminders: true,
    description: 'Automatización total con recepcionista IA en WhatsApp 24/7, recordatorios anti-plantón, centro de plantillas y radar de reactivación.'
  }
};

export function normalizePlan(plan?: string): SubscriptionPlan {
  if (!plan) return 'crecimiento'; // Default para salones activos existentes
  const clean = plan.toLowerCase().trim();
  if (clean === 'free' || clean === 'gratis' || clean === 'gratuito') return 'free';
  if (clean === 'inicio' || clean === 'starter' || clean === 'basico') return 'inicio';
  if (clean === 'crecimiento' || clean === 'growth' || clean === 'pro') return 'crecimiento';
  if (clean === 'pro_ia' || clean === 'ia' || clean === 'elite' || clean === 'empire') return 'pro_ia';
  return 'crecimiento';
}

export function getPlanConfig(plan?: string): PlanFeatureConfig {
  return PLAN_CONFIGS[normalizePlan(plan)];
}

export function canAddMoreStylists(currentCount: number, plan?: string): { allowed: boolean; max: number; message?: string } {
  const config = getPlanConfig(plan);
  if (currentCount >= config.max_stylists) {
    return {
      allowed: false,
      max: config.max_stylists,
      message: `Has alcanzado el límite de ${config.max_stylists} profesional(es) de tu ${config.name}. Pásate al Plan Crecimiento para tener colaboradoras ilimitadas.`
    };
  }
  return { allowed: true, max: config.max_stylists };
}

export function getUpgradeWhatsAppUrl(requiredPlan: SubscriptionPlan, salonName?: string, featureName?: string): string {
  const phone = '573114195123';
  const planInfo = PLAN_CONFIGS[requiredPlan];
  const msg = encodeURIComponent(
    `Hola Kowy! 👋 Mi salón es "${salonName || 'mi negocio'}" y me gustaría activar el ${planInfo.name} (${planInfo.price_label}) para desbloquear ${featureName || 'todas las funciones avanzadas'}. ¿Cómo puedo activarlo?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}
