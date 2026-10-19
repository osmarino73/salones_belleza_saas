export type SubscriptionPlan = 'free' | 'inicio' | 'crecimiento' | 'pro_ia';

export interface PlanFeatureConfig {
  id: SubscriptionPlan;
  name: string;
  badge: string;
  price_cop: number;
  price_label: string;
  max_stylists: number;
  max_monthly_appointments: number;
  extra_stylist_price_cop?: number;
  extra_stylist_price_label?: string;
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
    max_monthly_appointments: 25,
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
    description: 'Página web profesional con agendador interactivo para 1 profesional (hasta 25 citas/mes) y botón de WhatsApp.'
  },
  inicio: {
    id: 'inicio',
    name: 'Plan Inicio',
    badge: '🚀 Plan Inicio',
    price_cop: 29000,
    price_label: '$29.000 COP / mes',
    max_stylists: 3,
    max_monthly_appointments: 999999,
    extra_stylist_price_cop: 10000,
    extra_stylist_price_label: '+$10.000 COP / mes c/u',
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
    description: 'Agendador interactivo ilimitado 24/7 y control de citas del día para hasta 3 colaboradores (+ extras por $10k/mes c/u).'
  },
  crecimiento: {
    id: 'crecimiento',
    name: 'Plan Crecimiento',
    badge: '📈 Plan Crecimiento',
    price_cop: 120000,
    price_label: '$120.000 COP / mes',
    max_stylists: 9999,
    max_monthly_appointments: 999999,
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
    max_monthly_appointments: 999999,
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

export function checkMonthlyBookingLimit(
  monthlyAppointmentsCount: number,
  plan?: string
): {
  allowed: boolean;
  max: number;
  current: number;
  remaining: number;
  isFreePlan: boolean;
  message?: string;
} {
  const config = getPlanConfig(plan);
  const isFree = config.id === 'free';
  const max = config.max_monthly_appointments;
  const current = Math.max(0, monthlyAppointmentsCount || 0);
  const remaining = Math.max(0, max - current);
  const allowed = !isFree || current < max;

  return {
    allowed,
    max,
    current,
    remaining,
    isFreePlan: isFree,
    message: !allowed
      ? `Has alcanzado el límite de ${max} citas mensuales de tu ${config.name}. Pasa al Plan Inicio ($29.000 COP/mes) para tener agendamiento 100% ilimitado o tus clientes pueden contactarte por WhatsApp.`
      : undefined
  };
}

export function canAddMoreStylists(currentCount: number, plan?: string, tenantMaxStylists?: number): { allowed: boolean; max: number; message?: string } {
  const config = getPlanConfig(plan);
  const effectiveMax = typeof tenantMaxStylists === 'number' && tenantMaxStylists > config.max_stylists
    ? tenantMaxStylists
    : config.max_stylists;

  if (currentCount >= effectiveMax) {
    const isFree = config.id === 'free';
    const isInicio = config.id === 'inicio';
    return {
      allowed: false,
      max: effectiveMax,
      message: isFree
        ? `Has alcanzado el límite de ${effectiveMax} profesional de tu ${config.name}. Pasa al Plan Inicio ($29.000 COP/mes) para habilitar hasta 3 colaboradores o al Plan Crecimiento para ilimitados.`
        : isInicio
        ? `Has alcanzado el límite de ${effectiveMax} colaboradores de tu ${config.name}. Puedes agregar colaboradores extra por solo $10.000 COP/mes cada uno o pasarte al Plan Crecimiento para tener acceso ilimitado.`
        : `Has alcanzado el límite de ${effectiveMax} profesional(es) de tu ${config.name}. Pásate al Plan Crecimiento para tener colaboradoras ilimitadas.`
    };
  }
  return { allowed: true, max: effectiveMax };
}

export function getUpgradeWhatsAppUrl(requiredPlan: SubscriptionPlan, salonName?: string, featureName?: string): string {
  const phone = '573226334341';
  const planInfo = PLAN_CONFIGS[requiredPlan];
  const msg = encodeURIComponent(
    `Hola Kowy! 👋 Mi salón es "${salonName || 'mi negocio'}" y me gustaría activar el ${planInfo.name} (${planInfo.price_label}) para desbloquear ${featureName || 'todas las funciones avanzadas'}. ¿Cómo puedo activarlo?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

export function getExtraCollaboratorWhatsAppUrl(salonName?: string): string {
  const phone = '573226334341';
  const msg = encodeURIComponent(
    `Hola Kowy! 👋 Mi salón es "${salonName || 'mi negocio'}". Estamos en el Plan Inicio y queremos sumar 1 colaborador adicional por +$10.000 COP/mes. ¿Cómo podemos activarlo?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

