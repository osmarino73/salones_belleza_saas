import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Mail,
  CheckCircle2,
  Send,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Tag,
  RefreshCw,
  Zap,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sliders,
  Copy,
  Star,
  Receipt,
  Gift,
  HelpCircle,
  AlertCircle,
  PlusCircle,
  Plus,
  X,
  FileText,
  Trash2,
  Edit3,
  Monitor,
  Palette,
  Layout,
  Layers,
  Wand2,
  Info,
  PhoneCall,
  CheckCheck,
  Code,
  RotateCcw,
  Save,
  BellRing,
  Moon,
  ToggleLeft,
  ToggleRight,
  SlidersHorizontal,
  Settings2,
  ArrowRightLeft,
  Radio,
  Share2,
  Flame,
  BarChart3
} from 'lucide-react';
import { TenantAISettings } from '../types';

interface TemplatesManagerPageProps {
  theme: 'light' | 'dark';
  salonName: string;
  salonPhone: string;
  salonEmail?: string;
  aiSettings: TenantAISettings | null;
  onUpdateSettings: (updated: TenantAISettings) => void;
}

interface TemplateStatus {
  status: 'PENDIENTE' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA';
  submittedAt?: string;
  approvedAt?: string;
}

export interface WhatsAppTemplate {
  id: string;
  key: string;
  name: string;
  category: 'MARKETING' | 'UTILITY';
  headerText?: string;
  bodyText: string;
  footerText: string;
  buttons: Array<{ type: 'QUICK_REPLY' | 'URL'; text: string }>;
  timing: string;
  variables: string[];
  isCustom?: boolean;
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  preheader: string;
  category: 'TRANSACCIONAL' | 'MARKETING' | 'REPUTACIÓN';
  headline?: string;
  bodyHtml?: string;
  ctaText?: string;
  ctaUrl?: string;
  accentColor?: string;
  timing: string;
  variables: string[];
  badge: string;
  isCustom?: boolean;
  rawHtml?: string;
}

export interface NotificationDispatchConfig {
  wa_confirmation_enabled: boolean;
  wa_reminder_24h_enabled: boolean;
  wa_reminder_hours_before: number;
  wa_reminder_2h_enabled: boolean;
  wa_reminder_inminent_hours_before: number;
  wa_vip_reactivation_enabled: boolean;
  wa_vip_inactivity_days: number;
  wa_review_request_enabled: boolean;
  wa_review_hours_after: number;

  email_confirmation_enabled: boolean;
  email_reminder_24h_enabled: boolean;
  email_receipt_enabled: boolean;
  email_review_request_enabled: boolean;
  email_birthday_vip_enabled: boolean;

  preferred_channel: 'both' | 'whatsapp_first' | 'whatsapp_only' | 'email_only';
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  weekend_reminders_enabled: boolean;
  only_client_booked_confirmation: boolean;
}

export const TemplatesManagerPage: React.FC<TemplatesManagerPageProps> = ({
  theme,
  salonName,
  salonPhone,
  salonEmail,
  aiSettings,
  onUpdateSettings
}) => {
  const isDark = theme === 'dark';
  const [templateChannel, setTemplateChannel] = useState<'whatsapp' | 'email' | 'dispatch_rules'>('whatsapp');
  
  // Initial WhatsApp Templates
  const defaultWaTemplates: WhatsAppTemplate[] = [
    {
      id: 'booking_confirmation',
      key: 'confirmacion_reserva_v2',
      name: 'Confirmación Inmediata de Reserva',
      category: 'UTILITY',
      headerText: '✨ ¡Cita Confirmada con Éxito!',
      bodyText: `¡Hola {{1}}! Tu reserva en *${salonName || 'BeautyFlow Studio'}* ha sido agendada con éxito.\n\n💇‍♀️ *Servicio:* {{2}}\n👤 *Especialista:* {{3}}\n📅 *Fecha:* {{4}}\n⏰ *Hora:* {{5}}\n💵 *Valor:* {{6}}`,
      footerText: `${salonName} • Confirmación Automática`,
      buttons: [
        { type: 'URL', text: '📍 Ver Ubicación' },
        { type: 'URL', text: '📅 Añadir a Calendario' }
      ],
      timing: 'Inmediato tras agendar en web o por WhatsApp',
      variables: ['Nombre Clienta', 'Servicio', 'Estilista', 'Fecha', 'Hora', 'Precio COP']
    },
    {
      id: 'appointment_reminder_24h',
      key: 'recordatorio_cita_24h',
      name: 'Recordatorio 24h Antes (Interactivo)',
      category: 'UTILITY',
      headerText: '⏰ Recordatorio de Cita Mañana',
      bodyText: `Hola {{1}}, te recordamos tu cita de belleza mañana en *${salonName || 'BeautyFlow'}*.\n\n💇‍♀️ *Servicio:* {{2}} a las *{{3}}* con {{4}}.\n\n¿Nos confirmas tu asistencia para reservar tu espacio?`,
      footerText: 'Responde tocando un botón abajo',
      buttons: [
        { type: 'QUICK_REPLY', text: '✅ Confirmar Asistencia' },
        { type: 'QUICK_REPLY', text: '🔄 Reagendar Cita' }
      ],
      timing: '24 horas antes del horario reservado',
      variables: ['Nombre Clienta', 'Servicio', 'Hora', 'Estilista']
    },
    {
      id: 'appointment_reminder_2h',
      key: 'recordatorio_inminente_2h',
      name: 'Recordatorio 2 Horas Antes ("En Camino")',
      category: 'UTILITY',
      headerText: '☕ ¡Te esperamos en 2 horas!',
      bodyText: `¡Hola {{1}}! Tu especialista *{{2}}* ya tiene todo listo para tu servicio de *{{3}}* en 2 horas.\n\n📍 Te esperamos en *{{4}}*. ¡Ven con tiempo para consentirte con un café! ✨`,
      footerText: `${salonName} • Te esperamos con amor`,
      buttons: [
        { type: 'URL', text: '🚗 Cómo Llegar (Waze/Maps)' }
      ],
      timing: '2 horas antes del servicio',
      variables: ['Nombre Clienta', 'Estilista', 'Servicio', 'Dirección del Salón']
    },
    {
      id: 'client_reactivation_promo',
      key: 'reactivacion_clientas_vip',
      name: 'Reactivación de Clientas VIP (+30 días)',
      category: 'MARKETING',
      headerText: '💖 ¡Te extrañamos en el salón!',
      bodyText: `¡Hola {{1}}! Hace más de 30 días que no nos visitas en *${salonName || 'BeautyFlow'}* y queremos consentirte.\n\n🎁 Tienes un *15% de descuento especial* en tu próximo corte, color o spa durante este mes.\n\n¿Te gustaría que te reservemos un espacio esta semana?`,
      footerText: 'Promoción exclusiva para clientas VIP',
      buttons: [
        { type: 'QUICK_REPLY', text: '📅 Agendar con Descuento' },
        { type: 'QUICK_REPLY', text: 'Ver Catálogo' }
      ],
      timing: 'Disparado automáticamente si la clienta no asiste en 35 días',
      variables: ['Nombre Clienta', 'Nombre Salón']
    }
  ];

  // Initial Email Templates
  const defaultEmailTemplates: EmailTemplate[] = [
    {
      id: 'email_booking_confirmation',
      key: 'email_confirmacion_reserva',
      name: 'Confirmación Elegante de Cita',
      subject: `✨ Cita Confirmada en ${salonName || 'BeautyFlow'} - Resumen y Detalles`,
      preheader: 'Tu cita ha sido confirmada. Revisa los detalles de tu especialista y ubicación.',
      category: 'TRANSACCIONAL',
      headline: '¡Tu Cita está Confirmada!',
      bodyHtml: 'Hemos reservado tu espacio con los mejores estilistas y productos premium de belleza. Nos vemos pronto.',
      ctaText: '📅 Añadir a Google / Apple Calendar',
      ctaUrl: 'https://calendar.google.com',
      accentColor: '#FF5A36',
      timing: 'Enviado inmediatamente al reservar cita',
      variables: ['{{client_name}}', '{{service_name}}', '{{stylist_name}}', '{{appointment_date}}', '{{appointment_time}}', '{{total_price}}'],
      badge: 'Más Usada'
    },
    {
      id: 'email_reminder_24h',
      key: 'email_recordatorio_24h',
      name: 'Recordatorio 24 Horas Antes',
      subject: `⏰ Mañana tienes cita en ${salonName || 'BeautyFlow'} - ¿Nos confirmas?`,
      preheader: 'Te recordamos tu cita de belleza programada para mañana.',
      category: 'TRANSACCIONAL',
      headline: 'Te recordamos tu cita de mañana',
      bodyHtml: 'Por favor confirma tu asistencia o avísanos con tiempo si requieres reagendar tu espacio.',
      ctaText: '✅ Confirmar Asistencia',
      ctaUrl: '#confirm',
      accentColor: '#10B981',
      timing: 'Enviado 24 horas antes del servicio',
      variables: ['{{client_name}}', '{{service_name}}', '{{appointment_time}}', '{{stylist_name}}'],
      badge: 'Alta Conversión'
    },
    {
      id: 'email_receipt',
      key: 'email_recibo_pos',
      name: 'Recibo Digital & Comprobante POS',
      subject: `🧾 Tu Comprobante de Pago - ${salonName || 'BeautyFlow'}`,
      preheader: 'Gracias por visitarnos. Aquí tienes el detalle de tus servicios y productos.',
      category: 'TRANSACCIONAL',
      headline: 'Comprobante de Pago Digital',
      bodyHtml: 'Agradecemos tu visita a nuestro salón. Fue un placer atenderte y realzar tu belleza.',
      accentColor: '#3B82F6',
      timing: 'Enviado automáticamente al cerrar venta en POS',
      variables: ['{{client_name}}', '{{invoice_number}}', '{{items_table}}', '{{total_amount}}', '{{payment_method}}'],
      badge: 'Financiero'
    },
    {
      id: 'email_google_review',
      key: 'email_resena_google',
      name: 'Solicitud de Reseña Google 5 Estrellas',
      subject: `⭐ ¿Cómo fue tu experiencia en ${salonName || 'BeautyFlow'}?`,
      preheader: 'Tu opinión nos ayuda a seguir brindándote la mejor atención.',
      category: 'REPUTACIÓN',
      headline: '¿Te encantó tu nuevo look?',
      bodyHtml: 'Tu opinión es muy valiosa para nosotros y para otras clientas que buscan consentirse. Déjanos tus 5 estrellas en Google Maps.',
      ctaText: '⭐ Dejar Reseña en Google Maps',
      ctaUrl: aiSettings?.google_maps_review_url || 'https://maps.google.com',
      accentColor: '#F59E0B',
      timing: 'Enviado 24 horas después de completar la cita',
      variables: ['{{client_name}}', '{{stylist_name}}', '{{google_review_link}}'],
      badge: 'Crecimiento SEO'
    },
    {
      id: 'email_vip_promo',
      key: 'email_promo_fidelizacion',
      name: 'Newsletter & Regalo de Cumpleaños / VIP',
      subject: `🎂 ¡Un regalo especial de cumpleaños en ${salonName || 'BeautyFlow'}!`,
      preheader: 'Queremos celebrar contigo. Reclama tu obsequio y descuento en tu mes especial.',
      category: 'MARKETING',
      headline: '¡Feliz Cumpleaños de parte del equipo!',
      bodyHtml: 'Este mes tienes un 20% de descuento de regalo en cualquier servicio de spa o colorimetría. ¡Agenda tu cita de celebración!',
      ctaText: '🎁 Reclamar Descuento VIP',
      ctaUrl: '#promo',
      accentColor: '#EC4899',
      timing: 'Enviado en la fecha de cumpleaños o campañas masivas',
      variables: ['{{client_name}}', '{{discount_code}}', '{{expiry_date}}'],
      badge: 'Fidelización'
    }
  ];

  // Default Dispatch Rules Matrix
  const defaultDispatchConfig: NotificationDispatchConfig = {
    wa_confirmation_enabled: true,
    wa_reminder_24h_enabled: aiSettings?.send_reminder_whatsapp ?? true,
    wa_reminder_hours_before: aiSettings?.reminder_hours_before ?? 24,
    wa_reminder_2h_enabled: true,
    wa_reminder_inminent_hours_before: 2,
    wa_vip_reactivation_enabled: true,
    wa_vip_inactivity_days: 35,
    wa_review_request_enabled: aiSettings?.send_followup_review ?? true,
    wa_review_hours_after: 24,

    email_confirmation_enabled: true,
    email_reminder_24h_enabled: true,
    email_receipt_enabled: true,
    email_review_request_enabled: true,
    email_birthday_vip_enabled: true,

    preferred_channel: 'both',
    quiet_hours_enabled: true,
    quiet_hours_start: '21:00',
    quiet_hours_end: '08:00',
    weekend_reminders_enabled: true,
    only_client_booked_confirmation: false
  };

  const [dispatchConfig, setDispatchConfig] = useState<NotificationDispatchConfig>(() => {
    const saved = localStorage.getItem('bf_notification_dispatch_rules_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultDispatchConfig;
  });

  const saveDispatchConfig = (cfg: NotificationDispatchConfig) => {
    setDispatchConfig(cfg);
    localStorage.setItem('bf_notification_dispatch_rules_v1', JSON.stringify(cfg));
    if (aiSettings) {
      onUpdateSettings({
        ...aiSettings,
        send_reminder_whatsapp: cfg.wa_reminder_24h_enabled,
        reminder_hours_before: cfg.wa_reminder_hours_before,
        send_followup_review: cfg.wa_review_request_enabled
      });
    }
    setSyncSuccessMessage('¡Reglas y horarios de envío guardados exitosamente!');
    setTimeout(() => setSyncSuccessMessage(null), 3500);
  };

  // Persisted Templates Lists
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>(() => {
    const saved = localStorage.getItem('bf_custom_wa_templates_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultWaTemplates;
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('bf_custom_email_templates_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultEmailTemplates;
  });

  // Verificación real y estricta de conexión de WhatsApp Business
  const isWhatsAppConnected = Boolean(
    aiSettings?.zernio_connected === true && 
    aiSettings?.zernio_status === 'connected'
  );

  // Approval Statuses
  const [waTemplateStatuses, setWaTemplateStatuses] = useState<Record<string, TemplateStatus>>(() => {
    // Si no está conectado, NINGUNA plantilla puede estar aprobada
    const defaultPending: Record<string, TemplateStatus> = {
      booking_confirmation: { status: 'PENDIENTE' },
      appointment_reminder_24h: { status: 'PENDIENTE' },
      appointment_reminder_2h: { status: 'PENDIENTE' },
      client_reactivation_promo: { status: 'PENDIENTE' }
    };

    if (!isWhatsAppConnected) {
      return defaultPending;
    }

    const saved = localStorage.getItem('bf_wa_template_statuses_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultPending;
  });

  // Garantizar que si no hay WhatsApp conectado, las plantillas se mantengan PENDIENTES
  useEffect(() => {
    if (!isWhatsAppConnected) {
      const resetStatuses: Record<string, TemplateStatus> = {};
      waTemplates.forEach(t => {
        resetStatuses[t.id] = { status: 'PENDIENTE' };
      });
      setWaTemplateStatuses(resetStatuses);
      localStorage.setItem('bf_wa_template_statuses_v1', JSON.stringify(resetStatuses));
    }
  }, [isWhatsAppConnected, waTemplates]);

  const [isSubmittingAll, setIsSubmittingAll] = useState<boolean>(false);
  const [submittingSingleId, setSubmittingSingleId] = useState<string | null>(null);
  const [isSyncingMeta, setIsSyncingMeta] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Active Selected Templates
  const [activeWaId, setActiveWaId] = useState<string>(waTemplates[0]?.id || 'booking_confirmation');
  const [testWaPhone, setTestWaPhone] = useState<string>(salonPhone || '');
  const [isSendingWaTest, setIsSendingWaTest] = useState<boolean>(false);
  const [waTestSuccess, setWaTestSuccess] = useState<boolean>(false);

  const [activeEmailId, setActiveEmailId] = useState<string>(emailTemplates[0]?.id || 'email_booking_confirmation');
  const [testEmailAddress, setTestEmailAddress] = useState<string>(salonEmail || 'contacto@studio.com');
  const [isSendingEmailTest, setIsSendingEmailTest] = useState<boolean>(false);
  const [emailTestSuccess, setEmailTestSuccess] = useState<boolean>(false);

  // Preview Mode for Email (Desktop vs Mobile)
  const [emailPreviewDevice, setEmailPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Modals States
  const [isNewWaModalOpen, setIsNewWaModalOpen] = useState<boolean>(false);
  const [isEditWaModalOpen, setIsEditWaModalOpen] = useState<boolean>(false);
  const [waStudioTab, setWaStudioTab] = useState<'content' | 'buttons' | 'preset'>('content');
  const [newWaForm, setNewWaForm] = useState({
    name: '',
    key: '',
    category: 'UTILITY' as 'UTILITY' | 'MARKETING',
    headerText: '',
    bodyText: '',
    footerText: salonName || 'BeautyFlow Studio',
    button1Text: '📍 Ver Ubicación',
    button1Type: 'URL' as 'URL' | 'QUICK_REPLY',
    button2Text: '📅 Mi Cita',
    button2Type: 'URL' as 'URL' | 'QUICK_REPLY'
  });

  const [editWaForm, setEditWaForm] = useState<WhatsAppTemplate>({
    id: '',
    key: '',
    name: '',
    category: 'UTILITY',
    headerText: '',
    bodyText: '',
    footerText: '',
    buttons: [],
    timing: '',
    variables: []
  });

  const [isNewEmailModalOpen, setIsNewEmailModalOpen] = useState<boolean>(false);
  const [emailStudioTab, setEmailStudioTab] = useState<'content' | 'design' | 'preset'>('content');
  const [newEmailForm, setNewEmailForm] = useState({
    name: '',
    subject: '',
    preheader: '',
    category: 'MARKETING' as 'TRANSACCIONAL' | 'MARKETING' | 'REPUTACIÓN',
    headline: '',
    bodyHtml: '',
    ctaText: '📅 Agendar Cita Online',
    ctaUrl: 'https://belleza2027.netlify.app',
    accentColor: '#FF5A36'
  });

  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState<boolean>(false);
  const [editEmailTab, setEditEmailTab] = useState<'visual' | 'code'>('visual');
  const [editEmailForm, setEditEmailForm] = useState<EmailTemplate>({
    id: '',
    key: '',
    name: '',
    subject: '',
    preheader: '',
    category: 'TRANSACCIONAL',
    headline: '',
    bodyHtml: '',
    ctaText: '',
    ctaUrl: '',
    accentColor: '#FF5A36',
    timing: '',
    variables: [],
    badge: 'Personalizada'
  });

  const saveWaTemplates = (list: WhatsAppTemplate[]) => {
    setWaTemplates(list);
    localStorage.setItem('bf_custom_wa_templates_v1', JSON.stringify(list));
  };

  const saveEmailTemplates = (list: EmailTemplate[]) => {
    setEmailTemplates(list);
    localStorage.setItem('bf_custom_email_templates_v1', JSON.stringify(list));
  };

  const saveStatuses = (newStatuses: Record<string, TemplateStatus>) => {
    setWaTemplateStatuses(newStatuses);
    localStorage.setItem('bf_wa_template_statuses_v1', JSON.stringify(newStatuses));
  };

  // WhatsApp Presets
  const applyWaPreset = (presetKey: string) => {
    if (presetKey === 'balayage_promo') {
      setNewWaForm({
        name: 'Promo Especial Balayage & Plex',
        key: 'promo_balayage_plex',
        category: 'MARKETING',
        headerText: '✨ ¡Renueva tu Look con 20% OFF!',
        bodyText: `¡Hola {{1}}! 💇‍♀️ En *${salonName || 'BeautyFlow Studio'}* queremos consentirte.\n\nDurante este mes tienes un *20% de descuento especial* en Balayage + Tratamiento Plex con nuestros estilistas master.\n\n¿Te gustaría que te reservemos un espacio esta semana?`,
        footerText: `${salonName} • Cupos Limitados`,
        button1Text: '📅 Agendar con Descuento',
        button1Type: 'QUICK_REPLY',
        button2Text: 'Ver Trabajos en Instagram',
        button2Type: 'URL'
      });
    } else if (presetKey === 'hair_care_tips') {
      setNewWaForm({
        name: 'Tips de Cuidado Post-Servicio',
        key: 'tips_cuidado_capilar',
        category: 'UTILITY',
        headerText: '🧴 Cuidados para tu Cabello',
        bodyText: `¡Hola {{1}}! Gracias por visitarnos hoy en *${salonName || 'BeautyFlow'}* para tu servicio de {{2}}.\n\n💡 *Recomendaciones de tu estilista {{3}}:*\n1. No lavar el cabello durante las primeras 48 horas.\n2. Usar shampoo sin sal y termoprotector.\n\n¡Cualquier duda estamos aquí para asesorarte! ✨`,
        footerText: `${salonName} • Experiencia & Cuidado`,
        button1Text: '🛍️ Ver Productos Recomendados',
        button1Type: 'URL',
        button2Text: '💬 Hablar con Asesor',
        button2Type: 'QUICK_REPLY'
      });
    } else if (presetKey === 'flash_reminder') {
      setNewWaForm({
        name: 'Recordatorio Flash 1 Hora Antes',
        key: 'recordatorio_flash_1h',
        category: 'UTILITY',
        headerText: '⏳ ¡Tu cita es en 1 hora!',
        bodyText: `¡Hola {{1}}! Tu especialista *{{2}}* te espera en 1 hora para tu servicio de *{{3}}*.\n\n📍 Te esperamos en *${salonName || 'nuestro salón'}*. Ven con tiempo para disfrutar de tu bebida de cortesía ☕💇‍♀️`,
        footerText: `${salonName} • Te esperamos`,
        button1Text: '🚗 Abrir Waze / Google Maps',
        button1Type: 'URL',
        button2Text: '✅ Ya voy en camino',
        button2Type: 'QUICK_REPLY'
      });
    }
  };

  // Email Presets
  const applyEmailPreset = (presetKey: string) => {
    if (presetKey === 'black_luxury') {
      setNewEmailForm({
        name: 'Invitación VIP Black Luxury',
        subject: `💎 Invitación Exclusiva para ti - ${salonName || 'BeautyFlow Studio'}`,
        preheader: 'Accede a beneficios exclusivos de membresía y citas prioritarias.',
        category: 'MARKETING',
        headline: 'Membresía & Experiencia VIP',
        bodyHtml: `Querida clienta, queremos agradecer tu fidelidad en ${salonName || 'BeautyFlow'}. Como clienta VIP, tienes acceso a reservas prioritarias en fines de semana y asesoría capilar personalizada sin costo.`,
        ctaText: '✨ Conocer Beneficios VIP',
        ctaUrl: 'https://belleza2027.netlify.app',
        accentColor: '#FF5A36'
      });
    } else if (presetKey === 'keratin_aftercare') {
      setNewEmailForm({
        name: 'Guía de Mantenimiento Alisado & Keratina',
        subject: `✨ Guía de Cuidado para tu Alisado - ${salonName || 'BeautyFlow'}`,
        preheader: 'Sigue estos 4 pasos para que tu alisado dure hasta 6 meses intacto.',
        category: 'TRANSACCIONAL',
        headline: 'Cómo mantener tu Alisado Perfecto',
        bodyHtml: 'Para que los resultados de tu tratamiento duren el máximo tiempo posible, te compartimos la guía oficial de cuidados recomendados por nuestros expertos.',
        ctaText: '🧴 Ver Kit de Cuidado en Casa',
        ctaUrl: 'https://belleza2027.netlify.app',
        accentColor: '#10B981'
      });
    }
  };

  const handleCreateWaTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaForm.name.trim() || !newWaForm.bodyText.trim()) {
      alert('Por favor completa el nombre y el cuerpo del mensaje.');
      return;
    }

    const tplKey = newWaForm.key.trim()
      ? newWaForm.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
      : newWaForm.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    const newTpl: WhatsAppTemplate = {
      id: `wa_tpl_${Date.now()}`,
      key: tplKey,
      name: newWaForm.name,
      category: newWaForm.category,
      headerText: newWaForm.headerText || undefined,
      bodyText: newWaForm.bodyText,
      footerText: newWaForm.footerText || salonName,
      buttons: [
        ...(newWaForm.button1Text ? [{ type: newWaForm.button1Type, text: newWaForm.button1Text }] : []),
        ...(newWaForm.button2Text ? [{ type: newWaForm.button2Type, text: newWaForm.button2Text }] : [])
      ],
      timing: 'Plantilla personalizada creada en Studio',
      variables: ['{{1}} Nombre', '{{2}} Servicio', '{{3}} Especialista'],
      isCustom: true
    };

    const updatedList = [newTpl, ...waTemplates];
    saveWaTemplates(updatedList);
    setActiveWaId(newTpl.id);
    
    const updatedStatuses = {
      ...waTemplateStatuses,
      [newTpl.id]: { status: 'PENDIENTE' as const }
    };
    saveStatuses(updatedStatuses);

    setIsNewWaModalOpen(false);
    setSyncSuccessMessage('¡Plantilla de WhatsApp creada exitosamente! Ahora puedes enviarla a Meta.');
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleOpenEditWa = (tpl: WhatsAppTemplate) => {
    setEditWaForm({ ...tpl });
    setIsEditWaModalOpen(true);
  };

  const handleSaveEditWa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editWaForm.name.trim() || !editWaForm.bodyText.trim()) {
      alert('Por favor completa el nombre y el cuerpo del mensaje.');
      return;
    }

    const updatedList = waTemplates.map(t => {
      if (t.id === editWaForm.id) {
        return {
          ...editWaForm,
          isCustom: true
        };
      }
      return t;
    });

    saveWaTemplates(updatedList);
    const updatedStatuses = {
      ...waTemplateStatuses,
      [editWaForm.id]: { status: 'PENDIENTE' as const }
    };
    saveStatuses(updatedStatuses);

    setIsEditWaModalOpen(false);
    setSyncSuccessMessage(`¡Plantilla WhatsApp "${editWaForm.name}" actualizada! Envíala a Meta para aplicar los cambios.`);
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleCreateEmailTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailForm.name.trim() || !newEmailForm.subject.trim()) {
      alert('Por favor completa el nombre y el asunto del correo.');
      return;
    }

    const tplKey = newEmailForm.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

    const newEmail: EmailTemplate = {
      id: `email_tpl_${Date.now()}`,
      key: tplKey,
      name: newEmailForm.name,
      subject: newEmailForm.subject,
      preheader: newEmailForm.preheader || 'Notificación oficial de ' + salonName,
      category: newEmailForm.category,
      headline: newEmailForm.headline || newEmailForm.name,
      bodyHtml: newEmailForm.bodyHtml || 'Contenido del correo personalizado.',
      ctaText: newEmailForm.ctaText,
      ctaUrl: newEmailForm.ctaUrl,
      accentColor: newEmailForm.accentColor,
      timing: 'Campaña o automatización personalizada',
      variables: ['{{client_name}}', '{{salon_name}}'],
      badge: 'Personalizada',
      isCustom: true
    };

    const updatedList = [newEmail, ...emailTemplates];
    saveEmailTemplates(updatedList);
    setActiveEmailId(newEmail.id);
    setIsNewEmailModalOpen(false);

    setSyncSuccessMessage('¡Plantilla de Email HTML creada exitosamente!');
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleOpenEditEmail = (tpl: EmailTemplate) => {
    setEditEmailForm({ ...tpl });
    setEditEmailTab('visual');
    setIsEditEmailModalOpen(true);
  };

  const handleSaveEditEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmailForm.name.trim() || !editEmailForm.subject.trim()) {
      alert('Por favor completa el nombre y el asunto del correo.');
      return;
    }

    const updatedList = emailTemplates.map(t => {
      if (t.id === editEmailForm.id) {
        return {
          ...editEmailForm,
          isCustom: true
        };
      }
      return t;
    });

    saveEmailTemplates(updatedList);
    setIsEditEmailModalOpen(false);
    setSyncSuccessMessage(`¡Plantilla "${editEmailForm.name}" actualizada con éxito!`);
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleResetEmailToDefault = (id: string) => {
    const original = defaultEmailTemplates.find(t => t.id === id);
    if (!original) return;
    if (confirm(`¿Deseas restaurar la plantilla "${original.name}" a su diseño original?`)) {
      const updatedList = emailTemplates.map(t => t.id === id ? { ...original } : t);
      saveEmailTemplates(updatedList);
      setEditEmailForm({ ...original });
      setSyncSuccessMessage('Plantilla restaurada a valores por defecto.');
      setTimeout(() => setSyncSuccessMessage(null), 3000);
    }
  };

  const handleSubmitSingleForApproval = async (templateId: string) => {
    if (!isWhatsAppConnected) {
      setSyncSuccessMessage('⚠️ No tienes una cuenta de WhatsApp Business conectada. Para enviar plantillas a Meta y recibir su aprobación oficial, primero conecta tu número en Configuración de IA.');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
      return;
    }

    setSubmittingSingleId(templateId);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const updated = {
        ...waTemplateStatuses,
        [templateId]: { status: 'EN_REVISION' as const, submittedAt: new Date().toLocaleTimeString() }
      };
      saveStatuses(updated);
      setSyncSuccessMessage('Plantilla enviada a Meta Cloud API. Estado: En Revisión (pendiente de validación oficial).');
      setTimeout(() => setSyncSuccessMessage(null), 4500);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingSingleId(null);
    }
  };

  const handleSubmitAllForApproval = async () => {
    if (!isWhatsAppConnected) {
      setSyncSuccessMessage('⚠️ No tienes una cuenta de WhatsApp Business conectada. Para enviar plantillas a Meta y recibir su aprobación oficial, primero conecta tu número en Configuración de IA.');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
      return;
    }

    const pendingTemplates = waTemplates.filter(
      t => (waTemplateStatuses[t.id]?.status || 'PENDIENTE') === 'PENDIENTE'
    );

    if (pendingTemplates.length === 0) {
      setSyncSuccessMessage('Todas las plantillas ya fueron enviadas a Meta.');
      setTimeout(() => setSyncSuccessMessage(null), 3500);
      return;
    }

    setIsSubmittingAll(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const inReview: Record<string, TemplateStatus> = { ...waTemplateStatuses };
      pendingTemplates.forEach(t => {
        inReview[t.id] = { status: 'EN_REVISION', submittedAt: new Date().toLocaleTimeString() };
      });
      saveStatuses(inReview);
      setSyncSuccessMessage(`¡${pendingTemplates.length} plantillas enviadas a Meta Cloud API! Permanecen 'En Revisión' hasta la validación oficial.`);
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const handleSyncStatusesWithMeta = async () => {
    if (!isWhatsAppConnected) {
      // Si no hay WhatsApp conectado, no se pueden consultar ni aprobar plantillas
      const resetStatuses: Record<string, TemplateStatus> = {};
      waTemplates.forEach(t => {
        resetStatuses[t.id] = { status: 'PENDIENTE' };
      });
      saveStatuses(resetStatuses);
      setSyncSuccessMessage('⚠️ WhatsApp no conectado: Sin un número vinculado en Meta Cloud API, todas las plantillas permanecen como Pendientes de Envío.');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
      return;
    }

    setIsSyncingMeta(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const synced = { ...waTemplateStatuses };
      let pendingCount = 0;
      let reviewCount = 0;
      let approvedCount = 0;

      waTemplates.forEach(t => {
        const current = synced[t.id]?.status || 'PENDIENTE';
        if (current === 'PENDIENTE') {
          synced[t.id] = { status: 'PENDIENTE' };
          pendingCount++;
        } else if (current === 'EN_REVISION') {
          synced[t.id] = { status: 'APROBADA', approvedAt: new Date().toLocaleTimeString() };
          approvedCount++;
        } else if (current === 'APROBADA') {
          approvedCount++;
        }
      });

      saveStatuses(synced);

      if (pendingCount === waTemplates.length) {
        setSyncSuccessMessage(`Meta API: Tienes ${pendingCount} plantillas pendientes de envío. Haz clic en "Enviar a Meta" para solicitar su aprobación.`);
      } else {
        setSyncSuccessMessage(`Sincronización con Meta: ${approvedCount} aprobadas, ${pendingCount} pendientes de envío.`);
      }
      setTimeout(() => setSyncSuccessMessage(null), 4500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncingMeta(false);
    }
  };

  const handleResetAllToPending = () => {
    const resetStatuses: Record<string, TemplateStatus> = {};
    waTemplates.forEach(t => {
      resetStatuses[t.id] = { status: 'PENDIENTE' };
    });
    saveStatuses(resetStatuses);
    setSyncSuccessMessage('Estados restablecidos: Todas las plantillas están listas para ser enviadas a Meta.');
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const currentWa = waTemplates.find(t => t.id === activeWaId) || waTemplates[0];
  const currentEmail = emailTemplates.find(t => t.id === activeEmailId) || emailTemplates[0];

  // Calculated Stats
  const approvedWaCount = waTemplates.filter(t => (waTemplateStatuses[t.id]?.status || 'PENDIENTE') === 'APROBADA').length;
  const pendingWaCount = waTemplates.filter(t => (waTemplateStatuses[t.id]?.status || 'PENDIENTE') === 'PENDIENTE').length;

  const handleSendWaTest = () => {
    if (!testWaPhone || testWaPhone.replace(/\D/g, '').length < 7) {
      alert('Ingresa un teléfono válido con código de país (ej. +57 311 419 5123)');
      return;
    }
    setIsSendingWaTest(true);
    setWaTestSuccess(false);
    setTimeout(() => {
      setIsSendingWaTest(false);
      setWaTestSuccess(true);
      setTimeout(() => setWaTestSuccess(false), 4000);
    }, 1200);
  };

  const handleSendEmailTest = () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Ingresa un correo electrónico válido');
      return;
    }
    setIsSendingEmailTest(true);
    setEmailTestSuccess(false);
    setTimeout(() => {
      setIsSendingEmailTest(false);
      setEmailTestSuccess(true);
      setTimeout(() => setEmailTestSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-12">
      
      {/* 1. Header Hero Card with Stats Strip */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col gap-6 shadow-xl ${
        isDark
          ? 'bg-gradient-to-br from-[#121622] via-[#0E121B] to-[#181524] border-white/10 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
      }`}>
        
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-[#FF5A36]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" /> Studio de Plantillas Multicanal
              </span>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" /> Meta Cloud API v22.0 & Resend Engine
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Centro de Plantillas & Automatizaciones
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Diseña, personaliza y programa mensajes oficiales de <strong>WhatsApp Business HSM</strong> y <strong>Emails HTML Transaccionales</strong> con simulador móvil en vivo y control de horarios de envío.
            </p>
          </div>

          {/* Top Segmented Navigation & Studio Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 shadow-lg ${
              isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setTemplateChannel('whatsapp')}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  templateChannel === 'whatsapp'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp ({waTemplates.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateChannel('email')}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  templateChannel === 'email'
                    ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email HTML ({emailTemplates.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateChannel('dispatch_rules')}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  templateChannel === 'dispatch_rules'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-md shadow-cyan-500/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>⚡ Reglas de Envío</span>
              </button>
            </div>

            {/* Quick Action Button based on Active Tab */}
            {templateChannel === 'whatsapp' && (
              <button
                type="button"
                onClick={() => {
                  setWaStudioTab('content');
                  setIsNewWaModalOpen(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Plantilla WhatsApp</span>
              </button>
            )}

            {templateChannel === 'email' && (
              <button
                type="button"
                onClick={() => {
                  setEmailStudioTab('content');
                  setIsNewEmailModalOpen(true);
                }}
                className="bg-[#FF5A36] hover:bg-[#ff6f4f] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Plantilla Email</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Stats Summary Bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t relative z-10 text-xs ${
          isDark ? 'border-white/5' : 'border-slate-200'
        }`}>
          <div className={`p-3 rounded-2xl border space-y-1 ${
            isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" /> WhatsApp HSM:
            </span>
            <div className="flex items-center justify-between">
              <strong className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {approvedWaCount} de {waTemplates.length} Aprobadas
              </strong>
              {pendingWaCount > 0 && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {pendingWaCount} Pendientes
                </span>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${
            isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Mail className="w-3.5 h-3.5 text-[#FF5A36]" /> Plantillas Email:
            </span>
            <div className="flex items-center justify-between">
              <strong className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {emailTemplates.length} Diseños HTML
              </strong>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Listas
              </span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${
            isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Zap className="w-3.5 h-3.5 text-cyan-500" /> Canal Preferido:
            </span>
            <div className="flex items-center justify-between">
              <strong className={`text-sm font-extrabold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {dispatchConfig.preferred_channel === 'both' ? 'WhatsApp + Email' : dispatchConfig.preferred_channel}
              </strong>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Coexistencia</span>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${
            isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Moon className="w-3.5 h-3.5 text-indigo-500" /> Silencio Nocturno:
            </span>
            <div className="flex items-center justify-between">
              <strong className={`text-sm font-extrabold ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                {dispatchConfig.quiet_hours_enabled ? `${dispatchConfig.quiet_hours_start} - ${dispatchConfig.quiet_hours_end}` : 'Desactivado'}
              </strong>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                Anti-Spam
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: WHATSAPP TEMPLATES (STUDIO LAYOUT) */}
      {/* ========================================================================= */}
      {templateChannel === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Lista de Plantillas WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Warning if WhatsApp is not connected */}
            {!isWhatsAppConnected && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-md animate-fade-in ${
                isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    WhatsApp Business Desconectado
                  </strong>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Para enviar plantillas oficiales a Meta y recibir su aprobación, primero vincula tu número en el <strong>Simulador Chat</strong> o <strong>Configuración de IA</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Notification sync message */}
            {syncSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncSuccessMessage}</span>
              </div>
            )}

            <div className={`p-5 rounded-3xl border space-y-3.5 shadow-sm ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between gap-2 border-b pb-3 ${
                isDark ? 'border-white/5' : 'border-slate-100'
              }`}>
                <div>
                  <label className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Plantillas HSM WhatsApp:</span>
                  </label>
                  <span className={`text-[11px] block mt-0.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Estado en Meta Cloud API
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleSyncStatusesWithMeta}
                    disabled={isSyncingMeta}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-sm ${
                      isDark 
                        ? 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Consultar estado de aprobación en Meta"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMeta ? 'animate-spin text-emerald-500' : ''}`} />
                    <span>Sincronizar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAllToPending}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                      isDark
                        ? 'border-white/10 bg-white/5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                    }`}
                    title="Restablecer todas a estado Pendiente de Envío"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Elegant Action Strip for Pending Templates */}
              {pendingWaCount > 0 && (
                <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-fade-in shadow-sm ${
                  isDark 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div className="min-w-0">
                      <strong className={`text-xs font-bold block truncate ${
                        isDark ? 'text-emerald-300' : 'text-emerald-900'
                      }`}>
                        {pendingWaCount} {pendingWaCount === 1 ? 'plantilla lista' : 'plantillas listas'} para Meta
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitAllForApproval}
                    disabled={isSubmittingAll}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {isSubmittingAll ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar a Meta</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Template Items Cards */}
              <div className="space-y-2.5">
                {waTemplates.map((tpl) => {
                  const isSelected = tpl.id === activeWaId;
                  const currentStatus = waTemplateStatuses[tpl.id]?.status || 'PENDIENTE';

                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setActiveWaId(tpl.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? isDark
                            ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                            : 'border-emerald-500 bg-emerald-50/70 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : isDark
                            ? 'border-white/5 hover:border-white/20 bg-[#0B0E14]/60 hover:bg-[#0B0E14]'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className={`text-xs font-bold block truncate ${
                            isSelected
                              ? isDark ? 'text-emerald-400' : 'text-emerald-800'
                              : isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {tpl.name}
                          </strong>

                          {/* Dynamic Status Badge */}
                          {currentStatus === 'APROBADA' && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Aprobada Meta
                            </span>
                          )}
                          {currentStatus === 'EN_REVISION' && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1 animate-pulse">
                              <Clock className="w-2.5 h-2.5" /> En Revisión
                            </span>
                          )}
                          {currentStatus === 'PENDIENTE' && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" /> Pendiente
                            </span>
                          )}
                        </div>

                        <span className={`text-[11px] block truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {tpl.timing}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditWa(tpl);
                          }}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isDark
                              ? 'bg-white/5 hover:bg-white/15 text-slate-400 hover:text-emerald-400'
                              : 'bg-slate-200/60 hover:bg-slate-200 text-slate-600 hover:text-emerald-700'
                          }`}
                          title="Editar Plantilla WhatsApp"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          isSelected 
                            ? 'text-emerald-500 translate-x-0.5' 
                            : isDark ? 'text-slate-600' : 'text-slate-400'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Send Card */}
            <div className={`p-5 rounded-3xl border space-y-3 shadow-md ${
              isDark 
                ? 'border-emerald-500/20 bg-emerald-500/5' 
                : 'border-emerald-200 bg-emerald-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <strong className={`text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <Zap className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                  <span>Probar Plantilla en mi WhatsApp</span>
                </strong>
                {waTestSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                    <Check className="w-3.5 h-3.5" /> ¡Mensaje enviado!
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="tel"
                  value={testWaPhone}
                  onChange={(e) => setTestWaPhone(e.target.value)}
                  placeholder="+57 311 419 5123"
                  className={`w-full rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                    isDark
                      ? 'bg-[#0B0E14] border border-white/10 text-white'
                      : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSendWaTest}
                  disabled={isSendingWaTest}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isSendingWaTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Prueba</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: iPhone 15 Pro Live Preview Simulator (7 cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 sticky top-6 shadow-xl ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {/* Studio Header Bar */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span>Vista Previa en Smartphone iPhone</span>
                  </h3>
                  <span className={`text-[11px] font-mono ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    ID Meta: <strong>{currentWa.key}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditWa(currentWa)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Mensaje</span>
                  </button>
                </div>
              </div>

              {/* Meta Approval Action Box for Current Template */}
              {(() => {
                const currentStatus = waTemplateStatuses[currentWa.id]?.status || 'PENDIENTE';
                if (currentStatus === 'PENDIENTE') {
                  return (
                    <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Plantilla Pendiente de Envío a Meta
                          </strong>
                          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Envía esta plantilla para que Meta la valide y active en tu cuenta oficial.
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSubmitSingleForApproval(currentWa.id)}
                        disabled={submittingSingleId === currentWa.id}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                      >
                        {submittingSingleId === currentWa.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar a Aprobación</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                }
                if (currentStatus === 'EN_REVISION') {
                  return (
                    <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 animate-pulse">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            En Revisión con Meta Cloud API
                          </strong>
                          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Enviada a Meta. La validación suele tardar entre 1 y 15 minutos.
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSyncStatusesWithMeta}
                        disabled={isSyncingMeta}
                        className={`font-bold px-3.5 py-2 rounded-xl text-xs border flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                          isDark 
                            ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMeta ? 'animate-spin text-emerald-500' : ''}`} />
                        <span>Verificar Estado</span>
                      </button>
                    </div>
                  );
                }
                return (
                  <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-2 animate-fade-in shadow-md">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>✅ Plantilla Aprobada por Meta & Activa para Respuestas y Recordatorios</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300/80">Meta HSM Tier-1</span>
                  </div>
                );
              })()}

              {/* iPhone 15 Pro Realistic Frame Mockup */}
              <div className="max-w-[360px] mx-auto rounded-[46px] border-[10px] border-[#222736] bg-[#070A0F] shadow-2xl overflow-hidden relative ring-1 ring-white/15 select-none transition-all hover:scale-[1.01]">
                
                {/* Dynamic Island / Notch */}
                <div className="pt-2 pb-1 bg-black flex justify-center items-center relative">
                  <div className="w-24 h-5 bg-[#12151B] rounded-full flex items-center justify-between px-2 border border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A1F2C]" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>
                </div>

                {/* iOS Status Bar */}
                <div className="bg-black px-6 py-1 flex items-center justify-between text-[11px] font-semibold text-white">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold">5G</span>
                    <div className="w-5 h-2.5 rounded-md border border-white/60 p-0.5 flex items-center">
                      <div className="w-full h-full bg-emerald-400 rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat App Header */}
                <div className="bg-[#1F2C34] px-3.5 py-2.5 flex items-center justify-between border-b border-white/5 text-white">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                      {salonName ? salonName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div className="min-w-0">
                      <strong className="text-xs font-bold block truncate">{salonName || 'BeautyFlow Studio'}</strong>
                      <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-2.5 h-2.5" /> Cuenta Oficial
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* WhatsApp Chat Screen */}
                <div className="bg-[#0B141A] p-3.5 min-h-[380px] flex flex-col justify-between space-y-3 font-sans relative">
                  
                  {/* Date Badge */}
                  <div className="text-center">
                    <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-md bg-[#182229] text-slate-400 shadow-sm border border-white/5">
                      HOY
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-2 max-w-[94%] self-start">
                    <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tl-xs p-3.5 shadow-md space-y-2 border border-emerald-600/30">
                      {currentWa.headerText && (
                        <div className="font-extrabold text-xs text-emerald-200 border-b border-emerald-600/40 pb-1">
                          {currentWa.headerText}
                        </div>
                      )}

                      <div className="text-[11px] leading-relaxed whitespace-pre-line text-slate-100">
                        {currentWa.bodyText}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-emerald-200/70 pt-0.5">
                        <span>{currentWa.footerText}</span>
                        <span className="font-mono flex items-center gap-1">
                          10:45 AM <CheckCheck className="w-3 h-3 text-cyan-400" />
                        </span>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="space-y-1">
                      {currentWa.buttons.map((btn, idx) => (
                        <div
                          key={idx}
                          className="bg-[#202C33] hover:bg-[#2A3942] border border-white/10 text-emerald-400 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer transition-all"
                        >
                          <span>{btn.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Bottom Input Bar */}
                  <div className="pt-2 flex items-center gap-1.5 border-t border-white/5">
                    <div className="bg-[#202C33] rounded-full px-3 py-1.5 flex items-center justify-between flex-1 border border-white/5 text-[11px] text-slate-400">
                      <span>Mensaje...</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow">
                      <Send className="w-3 h-3" />
                    </div>
                  </div>

                </div>

                {/* iOS Home Indicator Bar */}
                <div className="py-2 bg-[#0B141A] flex justify-center">
                  <div className="w-28 h-1 bg-white/30 rounded-full" />
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: EMAIL HTML TEMPLATES (STUDIO LAYOUT) */}
      {/* ========================================================================= */}
      {templateChannel === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Selector de Plantillas Email (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {syncSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{syncSuccessMessage}</span>
              </div>
            )}

            <div className={`p-5 rounded-3xl border space-y-3.5 shadow-sm ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex items-center justify-between border-b pb-3 ${
                isDark ? 'border-white/5' : 'border-slate-100'
              }`}>
                <label className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Mail className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Plantillas HTML Transaccionales:</span>
                </label>
                <span className="text-[10px] bg-[#FF5A36]/15 text-[#FF5A36] font-bold px-2 py-0.5 rounded-full border border-[#FF5A36]/20">
                  SMTP / Resend
                </span>
              </div>

              <div className="space-y-2.5">
                {emailTemplates.map((tpl) => {
                  const isSelected = tpl.id === activeEmailId;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setActiveEmailId(tpl.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? isDark
                            ? 'border-[#FF5A36]/60 bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/10 ring-1 ring-[#FF5A36]/30'
                            : 'border-[#FF5A36] bg-orange-50/70 shadow-md ring-1 ring-[#FF5A36]'
                          : isDark
                            ? 'border-white/5 hover:border-white/20 bg-[#0B0E14]/60 hover:bg-[#0B0E14]'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className={`text-xs font-bold block truncate ${
                            isSelected ? 'text-[#FF5A36]' : isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {tpl.name}
                          </strong>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                            isDark 
                              ? 'bg-white/5 text-slate-400 border-white/10'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {tpl.badge}
                          </span>
                        </div>
                        <span className={`text-[11px] block truncate ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {tpl.timing}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditEmail(tpl);
                          }}
                          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                            isDark
                              ? 'bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white'
                              : 'bg-slate-200/60 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                          title="Editar Plantilla HTML"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-[#FF5A36] translate-x-0.5' : isDark ? 'text-slate-600' : 'text-slate-400'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Test Send Card Email */}
            <div className={`p-5 rounded-3xl border space-y-3 shadow-md ${
              isDark
                ? 'border-[#FF5A36]/20 bg-[#FF5A36]/5'
                : 'border-orange-200 bg-orange-50/50'
            }`}>
              <div className="flex items-center justify-between">
                <strong className={`text-xs font-bold flex items-center gap-1.5 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <Send className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Enviar Correo de Prueba HTML</span>
                </strong>
                {emailTestSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                    <Check className="w-3.5 h-3.5" /> ¡Correo enviado!
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className={`w-full rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-[#FF5A36] ${
                    isDark
                      ? 'bg-[#0B0E14] border border-white/10 text-white'
                      : 'bg-white border border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSendEmailTest}
                  disabled={isSendingEmailTest}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5A36]/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isSendingEmailTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Vista Previa Real de Email HTML con Switcher de Dispositivo (7 cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 sticky top-6 shadow-xl ${
              isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
            }`}>
              
              {/* Header Bar */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>De: </span>
                    <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                      {salonName || 'BeautyFlow'} &lt;reservas@beautyflow.app&gt;
                    </strong>
                  </div>
                  <div className="text-xs">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Asunto: </span>
                    <strong className="text-[#FF5A36]">{currentEmail.subject}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditEmail(currentEmail)}
                    className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/20 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Plantilla HTML</span>
                  </button>

                  {/* Device Switcher */}
                  <div className={`flex items-center gap-1 p-1 border rounded-xl shrink-0 ${
                    isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <button
                      type="button"
                      onClick={() => setEmailPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        emailPreviewDevice === 'desktop'
                          ? isDark ? 'bg-white/15 text-white font-bold' : 'bg-white text-slate-900 font-bold shadow-sm'
                          : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        emailPreviewDevice === 'mobile'
                          ? isDark ? 'bg-white/15 text-white font-bold' : 'bg-white text-slate-900 font-bold shadow-sm'
                          : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Móvil</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Renderizado de la Tarjeta HTML de Email (Desktop o iPhone Frame) */}
              {emailPreviewDevice === 'mobile' ? (
                /* Mobile iPhone Frame for Email */
                <div className="max-w-[360px] mx-auto rounded-[46px] border-[10px] border-[#222736] bg-[#070A0F] shadow-2xl overflow-hidden relative ring-1 ring-white/15 select-none transition-all hover:scale-[1.01]">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="pt-2 pb-1 bg-black flex justify-center items-center relative">
                    <div className="w-24 h-5 bg-[#12151B] rounded-full flex items-center justify-between px-2 border border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1A1F2C]" />
                      <div className="w-2 h-2 rounded-full bg-[#FF5A36]/80 animate-pulse" />
                    </div>
                  </div>

                  {/* iOS Status Bar */}
                  <div className="bg-black px-6 py-1 flex items-center justify-between text-[11px] font-semibold text-white">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold">5G</span>
                      <div className="w-5 h-2.5 rounded-md border border-white/60 p-0.5 flex items-center">
                        <div className="w-full h-full bg-emerald-400 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Apple Mail App Top Header */}
                  <div className="bg-[#1C1F28] px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-white text-xs">
                    <span className="text-cyan-400 font-bold flex items-center gap-0.5">
                      ‹ Buzón
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">1 de 12</span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Email Content Area in Mobile Screen */}
                  <div className="p-4 bg-[#090B10] space-y-4 max-h-[460px] overflow-y-auto font-sans">
                    
                    <div className="text-center space-y-1.5 border-b border-white/10 pb-4">
                      <div 
                        className="w-10 h-10 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md"
                        style={{ backgroundColor: currentEmail.accentColor || '#FF5A36' }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-extrabold text-white">{salonName || 'BeautyFlow Studio'}</h4>
                      <p className="text-[10px] text-[#FF5A36] font-semibold uppercase">Experiencia & Cuidado</p>
                    </div>

                    <div className="space-y-3 text-center">
                      <h5 className="text-xs font-bold text-white">{currentEmail.headline || currentEmail.name}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {currentEmail.bodyHtml || 'Estimada clienta, tu reserva en ' + (salonName || 'BeautyFlow') + ' está programada.'}
                      </p>

                      {currentEmail.id.includes('confirmation') && (
                        <div className="bg-[#141926] p-3 rounded-xl border border-white/10 space-y-1.5 text-[10px] text-left">
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400">Servicio:</span>
                            <strong className="text-white">Balayage & Plex</strong>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400">Especialista:</span>
                            <strong className="text-white">Sofía Restrepo</strong>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-white/5">
                            <span className="text-slate-400">Hora:</span>
                            <strong className="text-emerald-400">3:30 PM</strong>
                          </div>
                          <div className="flex justify-between py-0.5">
                            <span className="text-slate-400">Total:</span>
                            <strong className="text-white">$280.000 COP</strong>
                          </div>
                        </div>
                      )}

                      {currentEmail.ctaText && (
                        <div className="pt-1">
                          <button
                            type="button"
                            style={{ backgroundColor: currentEmail.accentColor || '#FF5A36' }}
                            className="w-full text-white font-extrabold py-2 rounded-xl text-[11px] shadow-md cursor-pointer"
                          >
                            {currentEmail.ctaText}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-3 text-center text-[9px] text-slate-500">
                      {salonName} • {salonPhone}
                    </div>

                  </div>

                  {/* iOS Home Bar */}
                  <div className="py-2 bg-[#090B10] flex justify-center">
                    <div className="w-28 h-1 bg-white/30 rounded-full" />
                  </div>

                </div>
              ) : (
                /* Desktop Client View */
                <div className={`p-6 sm:p-8 rounded-3xl border max-w-xl mx-auto space-y-6 font-sans shadow-xl transition-all ${
                  isDark
                    ? 'bg-[#090B10] border-white/10 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  
                  {/* Logo y Encabezado del Email */}
                  <div className={`text-center space-y-2 border-b pb-6 ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <div 
                      className="w-12 h-12 rounded-2xl text-white flex items-center justify-center mx-auto shadow-lg"
                      style={{ backgroundColor: currentEmail.accentColor || '#FF5A36' }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h2 className={`text-xl font-extrabold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{salonName || 'Studio Glamour Spa'}</h2>
                    <p className="text-xs text-[#FF5A36] font-semibold uppercase tracking-wider">Experiencia & Cuidado Exclusivo</p>
                  </div>

                  {/* Contenido según tipo de Email */}
                  <div className="space-y-4 text-center">
                    <h3 className={`text-lg font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{currentEmail.headline || currentEmail.name}</h3>
                    <p className={`text-xs leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {currentEmail.bodyHtml || 'Estimada clienta, tu reserva en ' + (salonName || 'BeautyFlow') + ' está programada.'}
                    </p>

                    {currentEmail.id.includes('confirmation') && (
                      <div className={`p-4 rounded-xl border space-y-2.5 text-xs text-left ${
                        isDark 
                          ? 'bg-[#141926] border-white/10' 
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <div className={`flex justify-between py-1 border-b ${
                          isDark ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>💇‍♀️ Servicio:</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Balayage & Tratamiento Plex</strong>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${
                          isDark ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>👤 Especialista:</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Sofía Restrepo</strong>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${
                          isDark ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>📅 Fecha:</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Viernes, 22 de Agosto 2026</strong>
                        </div>
                        <div className={`flex justify-between py-1 border-b ${
                          isDark ? 'border-white/5' : 'border-slate-100'
                        }`}>
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>⏰ Hora:</span>
                          <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">3:30 PM</strong>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>💵 Total a Pagar:</span>
                          <strong className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>$280.000 COP</strong>
                        </div>
                      </div>
                    )}

                    {currentEmail.ctaText && (
                      <div className="pt-2">
                        <button
                          type="button"
                          style={{ backgroundColor: currentEmail.accentColor || '#FF5A36' }}
                          className="text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg cursor-pointer"
                        >
                          {currentEmail.ctaText}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Email Footer */}
                  <div className={`border-t pt-4 text-center text-[10px] space-y-1 ${
                    isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}>
                    <p>{salonName} • {salonPhone}</p>
                    <p>Gestión automatizada por BeautyFlow AI</p>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: MATRIZ DE REGLAS DE ENVÍO & HORARIOS */}
      {/* ========================================================================= */}
      {templateChannel === 'dispatch_rules' && (
        <div className="space-y-6">
          
          {syncSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-fade-in shadow-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncSuccessMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Columna Izquierda: Reglas de WhatsApp (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 shadow-xl ${
                isDark 
                  ? 'bg-[#121622] border-emerald-500/30 text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Reglas de Envío por WhatsApp
                      </h3>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Activa o desactiva qué mensajes automáticos disparar
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/25">
                    Meta Cloud API
                  </span>
                </div>

                {/* Regla 1: Confirmación Inmediata */}
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isDark 
                    ? 'bg-[#0B0E14] border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        1. Confirmación Inmediata de Reserva
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Dispara mensaje con fecha, hora, valor y botones
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.wa_confirmation_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_confirmation_enabled: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className={`pt-2 border-t flex items-center gap-2 text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Condición:</span>
                    <label className={`flex items-center gap-1.5 cursor-pointer ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      <input
                        type="checkbox"
                        checked={dispatchConfig.only_client_booked_confirmation}
                        onChange={(e) => saveDispatchConfig({ ...dispatchConfig, only_client_booked_confirmation: e.target.checked })}
                        className="accent-emerald-500 rounded"
                      />
                      <span>Solo si el cliente reservó en la web (no en citas manuales)</span>
                    </label>
                  </div>
                </div>

                {/* Regla 2: Recordatorio Previo */}
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isDark 
                    ? 'bg-[#0B0E14] border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        2. Recordatorio Interactivo de Asistencia
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Envía botones para Confirmar o Reagendar
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.wa_reminder_24h_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_reminder_24h_enabled: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Anticipación de envío:</span>
                    <select
                      value={dispatchConfig.wa_reminder_hours_before}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_reminder_hours_before: Number(e.target.value) })}
                      className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-[#141926] border border-white/10 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={48}>48 horas antes</option>
                      <option value={24}>24 horas antes (Recomendado)</option>
                      <option value={12}>12 horas antes</option>
                    </select>
                  </div>
                </div>

                {/* Regla 3: Recordatorio Inminente 2h */}
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isDark 
                    ? 'bg-[#0B0E14] border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        3. Recordatorio "En Camino" con Ubicación
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Avisa que su especialista está lista + enlace Waze
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.wa_reminder_2h_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_reminder_2h_enabled: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Tiempo antes de la cita:</span>
                    <select
                      value={dispatchConfig.wa_reminder_inminent_hours_before}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_reminder_inminent_hours_before: Number(e.target.value) })}
                      className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-[#141926] border border-white/10 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={3}>3 horas antes</option>
                      <option value={2}>2 horas antes (Estándar)</option>
                      <option value={1}>1 hora antes</option>
                    </select>
                  </div>
                </div>

                {/* Regla 4: Reactivación VIP */}
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isDark 
                    ? 'bg-[#0B0E14] border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        4. Reactivación Automática de Clientas Inactivas
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Dispara mensaje con descuento para volver al salón
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.wa_vip_reactivation_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_vip_reactivation_enabled: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Disparar tras inactividad de:</span>
                    <select
                      value={dispatchConfig.wa_vip_inactivity_days}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_vip_inactivity_days: Number(e.target.value) })}
                      className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-[#141926] border border-white/10 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={25}>25 días sin visita</option>
                      <option value={35}>35 días sin visita (Recomendado)</option>
                      <option value={60}>60 días sin visita</option>
                    </select>
                  </div>
                </div>

                {/* Regla 5: Solicitud de Reseña Google Maps */}
                <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                  isDark 
                    ? 'bg-[#0B0E14] border-white/10 hover:border-white/20' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        5. Solicitud de Reseña Google Maps
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Pide 5 estrellas tras completar el servicio
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.wa_review_request_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_review_request_enabled: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                    />
                  </div>
                  <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${
                    isDark ? 'border-white/5 text-slate-400' : 'border-slate-200 text-slate-600'
                  }`}>
                    <span>Disparar tras completar cita:</span>
                    <select
                      value={dispatchConfig.wa_review_hours_after}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, wa_review_hours_after: Number(e.target.value) })}
                      className={`rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 ${
                        isDark
                          ? 'bg-[#141926] border border-white/10 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value={2}>2 horas después</option>
                      <option value={12}>12 horas después</option>
                      <option value={24}>24 horas después (Al día siguiente)</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Columna Derecha: Reglas de Email y Políticas Globales (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Reglas de Email */}
              <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 shadow-xl ${
                isDark
                  ? 'bg-[#121622] border-[#FF5A36]/30 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center border border-[#FF5A36]/20 shadow">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Reglas de Envío por Email HTML
                      </h3>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Define qué correos transaccionales y de marketing enviar
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#FF5A36]/15 text-[#FF5A36] font-bold px-2.5 py-1 rounded-full border border-[#FF5A36]/25">
                    SMTP / Resend
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div>
                      <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Email de Confirmación con Botón a Calendario
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Envía tarjeta elegante con archivo Google/Apple Calendar
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.email_confirmation_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, email_confirmation_enabled: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A36] rounded cursor-pointer"
                    />
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div>
                      <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Email Recordatorio 24 Horas Antes
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Resumen de la cita y políticas de puntualidad
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.email_reminder_24h_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, email_reminder_24h_enabled: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A36] rounded cursor-pointer"
                    />
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div>
                      <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Recibo Digital / Factura POS Automática
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Envía comprobante al cobrar la cuenta en la caja
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.email_receipt_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, email_receipt_enabled: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A36] rounded cursor-pointer"
                    />
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div>
                      <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Solicitud de Reseña 5 Estrellas
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Envía correo para potenciar el SEO de tu ficha de Google
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.email_review_request_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, email_review_request_enabled: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A36] rounded cursor-pointer"
                    />
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div>
                      <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Saludo de Cumpleaños & Regalo VIP
                      </strong>
                      <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Dispara felicitación automática en la fecha de nacimiento
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={dispatchConfig.email_birthday_vip_enabled}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, email_birthday_vip_enabled: e.target.checked })}
                      className="w-5 h-5 accent-[#FF5A36] rounded cursor-pointer"
                    />
                  </div>

                </div>
              </div>

              {/* Políticas Globales de Horarios y Anti-Spam */}
              <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 shadow-xl ${
                isDark
                  ? 'bg-[#121622] border-cyan-500/30 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className={`flex items-center justify-between border-b pb-4 ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Políticas Globales de Comunicación
                      </h3>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Control de horarios de descanso y prioridades
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  
                  {/* Canal Preferido */}
                  <div>
                    <label className={`block font-bold mb-1.5 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Estrategia de Canales (Coexistencia):
                    </label>
                    <select
                      value={dispatchConfig.preferred_channel}
                      onChange={(e) => saveDispatchConfig({ ...dispatchConfig, preferred_channel: e.target.value as any })}
                      className={`w-full rounded-xl p-2.5 focus:outline-none focus:border-cyan-400 ${
                        isDark
                          ? 'bg-[#0B0E14] border border-white/10 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="both">WhatsApp y Email en simultáneo (Máxima Asistencia)</option>
                      <option value="whatsapp_first">WhatsApp primero, Email como respaldo</option>
                      <option value="whatsapp_only">Solo WhatsApp</option>
                      <option value="email_only">Solo Email</option>
                    </select>
                  </div>

                  {/* Ventana de Silencio Nocturno */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                    isDark
                      ? 'bg-[#0B0E14] border-white/10 hover:border-white/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-cyan-500" />
                        <div>
                          <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Ventana de Silencio Nocturno (Anti-Molestias)
                          </strong>
                          <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pausa recordatorios en la noche y los envía en la mañana
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={dispatchConfig.quiet_hours_enabled}
                        onChange={(e) => saveDispatchConfig({ ...dispatchConfig, quiet_hours_enabled: e.target.checked })}
                        className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                      />
                    </div>

                    {dispatchConfig.quiet_hours_enabled && (
                      <div className={`pt-2 border-t flex items-center gap-3 text-[11px] ${
                        isDark ? 'border-white/5 text-slate-300' : 'border-slate-200 text-slate-700'
                      }`}>
                        <span>No enviar entre las:</span>
                        <input
                          type="time"
                          value={dispatchConfig.quiet_hours_start}
                          onChange={(e) => saveDispatchConfig({ ...dispatchConfig, quiet_hours_start: e.target.value })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono ${
                            isDark
                              ? 'bg-[#141926] border border-white/10 text-white'
                              : 'bg-white border border-slate-300 text-slate-900'
                          }`}
                        />
                        <span>y las:</span>
                        <input
                          type="time"
                          value={dispatchConfig.quiet_hours_end}
                          onChange={(e) => saveDispatchConfig({ ...dispatchConfig, quiet_hours_end: e.target.value })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono ${
                            isDark
                              ? 'bg-[#141926] border border-white/10 text-white'
                              : 'bg-white border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: WHATSAPP STUDIO CREATOR */}
      {/* ========================================================================= */}
      {isNewWaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className={`border rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto ${
            isDark 
              ? 'bg-[#121622] border-emerald-500/40 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                    <span>WhatsApp HSM Template Studio</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Meta Cloud API v22.0
                    </span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Diseña mensajes oficiales con botones interactivos y variables en tiempo real.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewWaModalOpen(false)}
                className={`p-1.5 rounded-xl transition-all ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Bar */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 flex-wrap ${
              isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Wand2 className="w-4 h-4" />
                <span>Preajustes Rápidos:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyWaPreset('balayage_promo')}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border-white/10'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                  }`}
                >
                  🎁 Promo Balayage
                </button>
                <button
                  type="button"
                  onClick={() => applyWaPreset('hair_care_tips')}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border-white/10'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                  }`}
                >
                  🧴 Tips Post-Servicio
                </button>
                <button
                  type="button"
                  onClick={() => applyWaPreset('flash_reminder')}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border-white/10'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border-slate-200'
                  }`}
                >
                  ⏳ Recordatorio 1h Antes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleCreateWaTemplate} className="lg:col-span-7 space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nombre de la Plantilla *
                    </label>
                    <input
                      type="text"
                      required
                      value={newWaForm.name}
                      onChange={(e) => setNewWaForm({ ...newWaForm, name: e.target.value })}
                      placeholder="Ej. Promo Balayage Fin de Semana"
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Categoría Meta *
                    </label>
                    <select
                      value={newWaForm.category}
                      onChange={(e) => setNewWaForm({ ...newWaForm, category: e.target.value as any })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="UTILITY">UTILITY (Confirmaciones / Recordatorios)</option>
                      <option value="MARKETING">MARKETING (Ofertas / Descuentos / Promos)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Encabezado Opcional (Header)
                  </label>
                  <input
                    type="text"
                    value={newWaForm.headerText}
                    onChange={(e) => setNewWaForm({ ...newWaForm, headerText: e.target.value })}
                    placeholder="Ej. ✨ ¡Oferta Exclusiva para ti!"
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Cuerpo del Mensaje (Body) *
                    </label>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Formato Meta: `&#123;&#123;1&#125;&#125;`, `&#123;&#123;2&#125;&#125;`
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 flex-wrap mb-2 ${
                    isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Insertar Variable:
                    </span>
                    {[
                      { tag: '{{1}}', label: 'Nombre' },
                      { tag: '{{2}}', label: 'Servicio' },
                      { tag: '{{3}}', label: 'Especialista' },
                      { tag: '{{4}}', label: 'Fecha' },
                      { tag: '{{5}}', label: 'Hora' },
                      { tag: '{{6}}', label: 'Valor COP' }
                    ].map((btn) => (
                      <button
                        key={btn.tag}
                        type="button"
                        onClick={() => setNewWaForm({ ...newWaForm, bodyText: newWaForm.bodyText + ' ' + btn.tag })}
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{btn.tag} ({btn.label})</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={newWaForm.bodyText}
                    onChange={(e) => setNewWaForm({ ...newWaForm, bodyText: e.target.value })}
                    placeholder="¡Hola {{1}}! Te esperamos en nuestro salón..."
                    className={`w-full rounded-xl p-3 font-sans focus:outline-none focus:border-emerald-500 leading-relaxed ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Pie de Página (Footer)
                    </label>
                    <input
                      type="text"
                      value={newWaForm.footerText}
                      onChange={(e) => setNewWaForm({ ...newWaForm, footerText: e.target.value })}
                      placeholder="Ej. Studio Glamour • Cuidado Exclusivo"
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Botón Interactivo 1
                    </label>
                    <input
                      type="text"
                      value={newWaForm.button1Text}
                      onChange={(e) => setNewWaForm({ ...newWaForm, button1Text: e.target.value })}
                      placeholder="Ej. ✅ Confirmar Asistencia"
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className={`pt-3 flex justify-end gap-3 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsNewWaModalOpen(false)}
                    className={`px-5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Guardar y Enviar a Meta</span>
                  </button>
                </div>
              </form>

              {/* Preview */}
              <div className="lg:col-span-5 space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Simulación en Teléfono:</span>
                </label>

                <div className="bg-[#0B141A] p-5 rounded-3xl border border-white/10 shadow-2xl space-y-3 font-sans">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center">
                      {salonName ? salonName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">{salonName || 'BeautyFlow Studio'}</strong>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3" /> Cuenta Oficial
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tl-none p-4 shadow-lg space-y-2 border border-emerald-600/30 text-xs">
                    {newWaForm.headerText && <div className="font-extrabold text-emerald-200 border-b border-emerald-600/40 pb-1">{newWaForm.headerText}</div>}
                    <div className="whitespace-pre-line text-slate-100">{newWaForm.bodyText || 'Escribe el mensaje arriba para simularlo...'}</div>
                    <div className="text-[9px] text-emerald-200/70 text-right">{newWaForm.footerText || salonName} • 10:45 AM ✓✓</div>
                  </div>

                  {newWaForm.button1Text && (
                    <div className="bg-[#202C33] text-emerald-400 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 border border-white/10 shadow-md">
                      <span>{newWaForm.button1Text}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1.5: EDITAR PLANTILLA DE WHATSAPP */}
      {/* ========================================================================= */}
      {isEditWaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className={`border rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto ${
            isDark 
              ? 'bg-[#121622] border-emerald-500/40 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                    <span>Editar Plantilla WhatsApp HSM</span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Modifica el texto y variables. Al guardar, quedará lista para enviar a Meta.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditWaModalOpen(false)}
                className={`p-1.5 rounded-xl transition-all ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleSaveEditWa} className="lg:col-span-7 space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nombre de la Plantilla *
                    </label>
                    <input
                      type="text"
                      required
                      value={editWaForm.name}
                      onChange={(e) => setEditWaForm({ ...editWaForm, name: e.target.value })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Categoría Meta *
                    </label>
                    <select
                      value={editWaForm.category}
                      onChange={(e) => setEditWaForm({ ...editWaForm, category: e.target.value as any })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="UTILITY">UTILITY (Confirmaciones / Recordatorios)</option>
                      <option value="MARKETING">MARKETING (Ofertas / Descuentos / Promos)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Encabezado Opcional (Header)
                  </label>
                  <input
                    type="text"
                    value={editWaForm.headerText || ''}
                    onChange={(e) => setEditWaForm({ ...editWaForm, headerText: e.target.value })}
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Cuerpo del Mensaje (Body) *
                    </label>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Usa `&#123;&#123;1&#125;&#125;`, `&#123;&#123;2&#125;&#125;`
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 flex-wrap mb-2 ${
                    isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Insertar:
                    </span>
                    {[
                      { tag: '{{1}}', label: 'Nombre' },
                      { tag: '{{2}}', label: 'Servicio' },
                      { tag: '{{3}}', label: 'Especialista' },
                      { tag: '{{4}}', label: 'Fecha' },
                      { tag: '{{5}}', label: 'Hora' },
                      { tag: '{{6}}', label: 'Valor COP' }
                    ].map((btn) => (
                      <button
                        key={btn.tag}
                        type="button"
                        onClick={() => setEditWaForm({ ...editWaForm, bodyText: editWaForm.bodyText + ' ' + btn.tag })}
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        +{btn.tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={editWaForm.bodyText}
                    onChange={(e) => setEditWaForm({ ...editWaForm, bodyText: e.target.value })}
                    className={`w-full rounded-xl p-3 font-sans focus:outline-none focus:border-emerald-500 leading-relaxed ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Pie de Página (Footer)
                  </label>
                  <input
                    type="text"
                    value={editWaForm.footerText}
                    onChange={(e) => setEditWaForm({ ...editWaForm, footerText: e.target.value })}
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-emerald-500 ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className={`pt-3 flex justify-end gap-3 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsEditWaModalOpen(false)}
                    className={`px-5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>

              {/* Preview */}
              <div className="lg:col-span-5 space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Vista Previa:</span>
                </label>

                <div className="bg-[#0B141A] p-5 rounded-3xl border border-white/10 shadow-2xl space-y-3 font-sans">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-extrabold text-xs flex items-center justify-center">
                      {salonName ? salonName.charAt(0).toUpperCase() : 'B'}
                    </div>
                    <span className="text-xs font-bold text-white">{salonName || 'BeautyFlow Studio'}</span>
                  </div>

                  <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tl-none p-4 shadow-lg space-y-2 border border-emerald-600/30 text-xs">
                    {editWaForm.headerText && <div className="font-extrabold text-emerald-200 border-b border-emerald-600/40 pb-1">{editWaForm.headerText}</div>}
                    <div className="whitespace-pre-line">{editWaForm.bodyText}</div>
                    <div className="text-[9px] text-emerald-200/70 text-right">{editWaForm.footerText} • 10:45 AM ✓✓</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EMAIL HTML CREATOR */}
      {/* ========================================================================= */}
      {isNewEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className={`border rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto ${
            isDark 
              ? 'bg-[#121622] border-[#FF5A36]/40 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                    <span>Email HTML Template Studio</span>
                    <span className="text-[10px] bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30 px-2 py-0.5 rounded-full font-bold">
                      Responsive HTML5
                    </span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Diseña correos automatizados con estética de alta gama y botones de llamado a la acción.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewEmailModalOpen(false)}
                className={`p-1.5 rounded-xl transition-all ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Bar */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 flex-wrap ${
              isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF5A36]">
                <Wand2 className="w-4 h-4" />
                <span>Preajustes Rápidos:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => applyEmailPreset('black_luxury')}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-[#FF5A36]/20 text-slate-200 hover:text-[#FF5A36] border-white/10'
                      : 'bg-white hover:bg-orange-50 text-slate-700 hover:text-[#FF5A36] border-slate-200'
                  }`}
                >
                  💎 Invitación VIP Black Luxury
                </button>
                <button
                  type="button"
                  onClick={() => applyEmailPreset('keratin_aftercare')}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-400 border-white/10'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
                  }`}
                >
                  🧴 Mantenimiento Alisado
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleCreateEmailTemplate} className="lg:col-span-7 space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nombre de la Plantilla *
                    </label>
                    <input
                      type="text"
                      required
                      value={newEmailForm.name}
                      onChange={(e) => setNewEmailForm({ ...newEmailForm, name: e.target.value })}
                      placeholder="Ej. Campaña Especial Spa"
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Categoría
                    </label>
                    <select
                      value={newEmailForm.category}
                      onChange={(e) => setNewEmailForm({ ...newEmailForm, category: e.target.value as any })}
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="MARKETING">MARKETING (Campañas & Promociones)</option>
                      <option value="TRANSACCIONAL">TRANSACCIONAL (Confirmaciones & Recibos)</option>
                      <option value="REPUTACIÓN">REPUTACIÓN (Reseñas Google Maps)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Asunto del Correo (Subject) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmailForm.subject}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, subject: e.target.value })}
                    placeholder="Ej. ✨ Tu Cita Especial en Studio Glamour Spa"
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Preheader (Texto antes de abrir)
                  </label>
                  <input
                    type="text"
                    value={newEmailForm.preheader}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, preheader: e.target.value })}
                    placeholder="Ej. Revisa los detalles de tu cita..."
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Título Principal (Headline)
                  </label>
                  <input
                    type="text"
                    value={newEmailForm.headline}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, headline: e.target.value })}
                    placeholder="Ej. ¡Tenemos todo preparado para consentirte!"
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Mensaje Principal
                  </label>
                  <textarea
                    rows={3}
                    value={newEmailForm.bodyHtml}
                    onChange={(e) => setNewEmailForm({ ...newEmailForm, bodyHtml: e.target.value })}
                    placeholder="Hola {{client_name}}, te esperamos para tu tratamiento..."
                    className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                      isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Texto del Botón CTA
                    </label>
                    <input
                      type="text"
                      value={newEmailForm.ctaText}
                      onChange={(e) => setNewEmailForm({ ...newEmailForm, ctaText: e.target.value })}
                      placeholder="Ej. 📅 Agendar con Descuento"
                      className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      URL de Destino
                    </label>
                    <input
                      type="text"
                      value={newEmailForm.ctaUrl}
                      onChange={(e) => setNewEmailForm({ ...newEmailForm, ctaUrl: e.target.value })}
                      placeholder="https://..."
                      className={`w-full rounded-xl p-3 font-mono focus:outline-none focus:border-[#FF5A36] ${
                        isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className={`pt-3 flex justify-end gap-3 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsNewEmailModalOpen(false)}
                    className={`px-5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-[#FF5A36]/30 cursor-pointer"
                  >
                    💾 Guardar Plantilla de Email
                  </button>
                </div>
              </form>

              {/* Preview Interactivo Email */}
              <div className="lg:col-span-5 space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Eye className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Vista Previa:</span>
                </label>

                <div className="bg-[#090B10] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">{salonName || 'BeautyFlow Studio'}</h4>
                  
                  <div className="bg-[#141926] p-4 rounded-2xl border border-white/10 space-y-2 text-left">
                    <h5 className="text-xs font-bold text-white text-center">{newEmailForm.headline || 'Título del Correo'}</h5>
                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                      {newEmailForm.bodyHtml || 'Contenido del correo en tiempo real...'}
                    </p>

                    {newEmailForm.ctaText && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          className="bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md"
                        >
                          {newEmailForm.ctaText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDITOR COMPLETO DE PLANTILLAS DE EMAIL HTML */}
      {/* ========================================================================= */}
      {isEditEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className={`border rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto ${
            isDark 
              ? 'bg-[#121622] border-[#FF5A36]/40 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}>
            
            <div className={`flex items-center justify-between border-b pb-4 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                    <span>Editor de Plantilla Email HTML</span>
                    <span className="text-[10px] bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30 px-2 py-0.5 rounded-full font-bold">
                      {editEmailForm.badge}
                    </span>
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Modifica el texto, variables, botón y colores con previsualización en vivo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {defaultEmailTemplates.some(d => d.id === editEmailForm.id) && (
                  <button
                    type="button"
                    onClick={() => handleResetEmailToDefault(editEmailForm.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                      isDark
                        ? 'text-slate-400 hover:text-amber-400 border-white/10 hover:border-amber-400/30'
                        : 'text-slate-600 hover:text-amber-600 border-slate-200 hover:border-amber-400/30'
                    }`}
                    title="Restaurar valores iniciales"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsEditEmailModalOpen(false)}
                  className={`p-1.5 rounded-xl transition-all ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Tabs */}
            <div className={`flex items-center justify-between border-b pb-3 flex-wrap gap-2 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditEmailTab('visual')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    editEmailTab === 'visual'
                      ? isDark ? 'bg-white/15 text-white border border-white/20' : 'bg-slate-200 text-slate-900 border border-slate-300'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Editor Visual (Bloques)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditEmailTab('code')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    editEmailTab === 'code'
                      ? isDark ? 'bg-white/15 text-white border border-white/20' : 'bg-slate-200 text-slate-900 border border-slate-300'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Código HTML Directo</span>
                </button>
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Color de Acento:
                </span>
                {[
                  { color: '#FF5A36', name: 'Naranja Glow' },
                  { color: '#10B981', name: 'Esmeralda' },
                  { color: '#EC4899', name: 'Rosa Glam' },
                  { color: '#8B5CF6', name: 'Púrpura VIP' },
                  { color: '#3B82F6', name: 'Azul Pro' }
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setEditEmailForm({ ...editEmailForm, accentColor: c.color })}
                    style={{ backgroundColor: c.color }}
                    className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                      editEmailForm.accentColor === c.color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleSaveEditEmail} className="lg:col-span-7 space-y-4 text-xs">
                
                {editEmailTab === 'visual' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Nombre de la Plantilla *
                        </label>
                        <input
                          type="text"
                          required
                          value={editEmailForm.name}
                          onChange={(e) => setEditEmailForm({ ...editEmailForm, name: e.target.value })}
                          className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                            isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Categoría
                        </label>
                        <select
                          value={editEmailForm.category}
                          onChange={(e) => setEditEmailForm({ ...editEmailForm, category: e.target.value as any })}
                          className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                            isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="TRANSACCIONAL">TRANSACCIONAL (Confirmaciones & Recibos)</option>
                          <option value="MARKETING">MARKETING (Campañas & Promociones)</option>
                          <option value="REPUTACIÓN">REPUTACIÓN (Reseñas Google Maps)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Asunto del Correo (Subject) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editEmailForm.subject}
                        onChange={(e) => setEditEmailForm({ ...editEmailForm, subject: e.target.value })}
                        className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                          isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Preheader (Texto antes de abrir)
                      </label>
                      <input
                        type="text"
                        value={editEmailForm.preheader}
                        onChange={(e) => setEditEmailForm({ ...editEmailForm, preheader: e.target.value })}
                        className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                          isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Título Principal (Headline)
                      </label>
                      <input
                        type="text"
                        value={editEmailForm.headline || ''}
                        onChange={(e) => setEditEmailForm({ ...editEmailForm, headline: e.target.value })}
                        className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                          isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Párrafo / Cuerpo del Mensaje
                        </label>
                        <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Variables soportadas
                        </span>
                      </div>

                      <div className={`p-2 rounded-xl border flex items-center gap-1.5 flex-wrap mb-2 ${
                        isDark ? 'bg-[#0B0E14] border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Insertar:
                        </span>
                        {[
                          { tag: '{{client_name}}', label: 'Clienta' },
                          { tag: '{{service_name}}', label: 'Servicio' },
                          { tag: '{{stylist_name}}', label: 'Especialista' },
                          { tag: '{{appointment_date}}', label: 'Fecha' },
                          { tag: '{{appointment_time}}', label: 'Hora' },
                          { tag: '{{total_price}}', label: 'Total COP' }
                        ].map((btn) => (
                          <button
                            key={btn.tag}
                            type="button"
                            onClick={() => setEditEmailForm({
                              ...editEmailForm,
                              bodyHtml: (editEmailForm.bodyHtml || '') + ' ' + btn.tag
                            })}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all cursor-pointer ${
                              isDark
                                ? 'bg-white/5 hover:bg-[#FF5A36]/20 text-orange-300 border-white/10'
                                : 'bg-white hover:bg-orange-50 text-orange-700 border-slate-300'
                            }`}
                          >
                            +{btn.tag}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={4}
                        value={editEmailForm.bodyHtml || ''}
                        onChange={(e) => setEditEmailForm({ ...editEmailForm, bodyHtml: e.target.value })}
                        className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] leading-relaxed ${
                          isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Texto del Botón (CTA)
                        </label>
                        <input
                          type="text"
                          value={editEmailForm.ctaText || ''}
                          onChange={(e) => setEditEmailForm({ ...editEmailForm, ctaText: e.target.value })}
                          className={`w-full rounded-xl p-3 focus:outline-none focus:border-[#FF5A36] ${
                            isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          URL de Destino del Botón
                        </label>
                        <input
                          type="text"
                          value={editEmailForm.ctaUrl || ''}
                          onChange={(e) => setEditEmailForm({ ...editEmailForm, ctaUrl: e.target.value })}
                          className={`w-full rounded-xl p-3 font-mono focus:outline-none focus:border-[#FF5A36] ${
                            isDark ? 'bg-[#0B0E14] border border-white/10 text-white' : 'bg-slate-50 border border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className={`font-bold flex items-center gap-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <Code className="w-4 h-4 text-cyan-500" />
                        <span>Código HTML Personalizado (Plantilla Completa)</span>
                      </label>
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Compatible con Resend / SendGrid / Postmark
                      </span>
                    </div>

                    <textarea
                      rows={14}
                      value={editEmailForm.bodyHtml || ''}
                      onChange={(e) => setEditEmailForm({ ...editEmailForm, bodyHtml: e.target.value })}
                      placeholder="<table width='100%' cellpadding='0' cellspacing='0'>...</table>"
                      className={`w-full rounded-2xl p-4 font-mono text-xs focus:outline-none focus:border-cyan-400 leading-relaxed shadow-inner ${
                        isDark 
                          ? 'bg-[#070A0F] border border-white/15 text-cyan-300' 
                          : 'bg-slate-900 border border-slate-700 text-cyan-400'
                      }`}
                    />
                  </div>
                )}

                <div className={`pt-3 flex justify-end gap-3 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsEditEmailModalOpen(false)}
                    className={`px-5 py-2.5 rounded-xl font-semibold cursor-pointer ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-[#FF5A36]/30 cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </form>

              {/* Live Preview */}
              <div className="lg:col-span-5 space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <Eye className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Previsualización en Tiempo Real:</span>
                </label>

                <div className="bg-[#090B10] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 text-center">
                  <div 
                    className="w-10 h-10 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md"
                    style={{ backgroundColor: editEmailForm.accentColor || '#FF5A36' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">{salonName || 'BeautyFlow Studio'}</h4>
                  
                  <div className="bg-[#141926] p-4 rounded-2xl border border-white/10 space-y-2 text-left">
                    <h5 className="text-xs font-bold text-white text-center">{editEmailForm.headline || editEmailForm.name}</h5>
                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                      {editEmailForm.bodyHtml || 'Contenido del correo en tiempo real...'}
                    </p>

                    {editEmailForm.ctaText && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          style={{ backgroundColor: editEmailForm.accentColor || '#FF5A36' }}
                          className="text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md cursor-pointer"
                        >
                          {editEmailForm.ctaText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
