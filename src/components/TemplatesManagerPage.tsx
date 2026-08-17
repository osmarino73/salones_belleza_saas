import React, { useState } from 'react';
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
  HelpCircle
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

export const TemplatesManagerPage: React.FC<TemplatesManagerPageProps> = ({
  theme,
  salonName,
  salonPhone,
  salonEmail,
  aiSettings,
  onUpdateSettings
}) => {
  const [templateChannel, setTemplateChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  
  // WhatsApp Templates State
  const [activeWaId, setActiveWaId] = useState<string>('booking_confirmation');
  const [testWaPhone, setTestWaPhone] = useState<string>(salonPhone || '');
  const [isSendingWaTest, setIsSendingWaTest] = useState<boolean>(false);
  const [waTestSuccess, setWaTestSuccess] = useState<boolean>(false);

  // Email Templates State
  const [activeEmailId, setActiveEmailId] = useState<string>('email_booking_confirmation');
  const [testEmailAddress, setTestEmailAddress] = useState<string>(salonEmail || 'contacto@studio.com');
  const [isSendingEmailTest, setIsSendingEmailTest] = useState<boolean>(false);
  const [emailTestSuccess, setEmailTestSuccess] = useState<boolean>(false);

  // WhatsApp Templates Data
  const waTemplates = [
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

  // Email Templates Data
  const emailTemplates = [
    {
      id: 'email_booking_confirmation',
      key: 'email_confirmacion_reserva',
      name: 'Confirmación Elegante de Cita',
      subject: `✨ Cita Confirmada en ${salonName || 'BeautyFlow'} - Resumen y Detalles`,
      preheader: 'Tu cita ha sido confirmada. Revisa los detalles de tu especialista y ubicación.',
      category: 'TRANSACCIONAL',
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
      timing: 'Enviado en la fecha de cumpleaños o campañas masivas',
      variables: ['{{client_name}}', '{{discount_code}}', '{{expiry_date}}'],
      badge: 'Fidelización'
    }
  ];

  const currentWa = waTemplates.find(t => t.id === activeWaId) || waTemplates[0];
  const currentEmail = emailTemplates.find(t => t.id === activeEmailId) || emailTemplates[0];

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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Top Banner Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-[#141926] via-[#111622] to-[#1A1828] border-white/10'
          : 'bg-gradient-to-r from-white via-slate-50 to-pink-50/40 border-black/5 shadow-sm'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Motor de Notificaciones Multicanal
            </span>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Meta Cloud & Resend API
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-pink-500">Plantillas & Automatizaciones</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Personaliza y gestiona las plantillas de alta conversión de <strong>WhatsApp Business HSM</strong> y <strong>Correos Electrónicos HTML</strong> para confirmar citas, enviar recordatorios y fidelizar clientas.
          </p>
        </div>

        {/* Channel Segmented Switcher */}
        <div className="p-1.5 rounded-2xl border flex items-center gap-1.5 shrink-0 bg-[#0E121B] border-white/10 shadow-lg">
          <button
            type="button"
            onClick={() => setTemplateChannel('whatsapp')}
            className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              templateChannel === 'whatsapp'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Plantillas WhatsApp (4)</span>
          </button>

          <button
            type="button"
            onClick={() => setTemplateChannel('email')}
            className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              templateChannel === 'email'
                ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Plantillas Email HTML (5)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: WHATSAPP TEMPLATES */}
      {/* ========================================================================= */}
      {templateChannel === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Lista de Plantillas WhatsApp (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl border space-y-3 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plantillas HSM de WhatsApp:</span>
                </label>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  ✓ Aprobadas por Meta
                </span>
              </div>

              <div className="space-y-2">
                {waTemplates.map((tpl) => {
                  const isSelected = tpl.id === activeWaId;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setActiveWaId(tpl.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-500/50 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                          : 'border-white/5 hover:border-white/15 bg-[#0E121B]/50 hover:bg-[#0E121B]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className={`text-xs font-bold block truncate ${
                            isSelected ? 'text-emerald-400' : 'text-slate-200'
                          }`}>
                            {tpl.name}
                          </strong>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                          {tpl.timing}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                          {tpl.category}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ajustes de Automatización WhatsApp */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <strong className="text-xs font-bold block text-white">Reglas de Envío Automático</strong>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block font-semibold">Confirmación Inmediata</strong>
                    <span className="text-[11px] text-slate-400">Envía mensaje instantáneo al crear cita</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 text-emerald-500 rounded accent-emerald-500 cursor-not-allowed opacity-80"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <strong className="block font-semibold">Recordatorio Interactivo 24h</strong>
                    <span className="text-[11px] text-slate-400">Botones interactivos de Confirmar/Reagendar</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings?.send_reminder_whatsapp ?? true}
                    onChange={(e) => {
                      if (aiSettings) {
                        onUpdateSettings({ ...aiSettings, send_reminder_whatsapp: e.target.checked });
                      }
                    }}
                    className="w-4 h-4 text-emerald-500 rounded accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Enviar Prueba WhatsApp */}
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                  <span>Probar Plantilla en mi WhatsApp</span>
                </strong>
                {waTestSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
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
                  className="w-full bg-[#0E121B] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleSendWaTest}
                  disabled={isSendingWaTest}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
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

          {/* Columna Derecha: Preview Móvil Interactivo WhatsApp (7 cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Vista Previa en WhatsApp Móvil</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID Meta: <strong>{currentWa.key}</strong>
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  Modo: <strong className="text-emerald-400">Coexistencia Activa</strong>
                </span>
              </div>

              {/* Teléfono Mockup WhatsApp */}
              <div className="bg-[#0B141A] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden space-y-3 font-sans">
                
                {/* Chat Top Bar */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-extrabold text-xs flex items-center justify-center">
                    {salonName ? salonName.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-white block">{salonName || 'BeautyFlow Studio'}</strong>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      ● Cuenta de Empresa Oficial
                    </span>
                  </div>
                </div>

                {/* WhatsApp Message Bubble */}
                <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tl-none p-4 shadow-lg max-w-lg space-y-2.5 relative border border-emerald-600/30">
                  {currentWa.headerText && (
                    <div className="font-extrabold text-sm text-emerald-200 border-b border-emerald-600/40 pb-1.5">
                      {currentWa.headerText}
                    </div>
                  )}

                  <div className="text-xs leading-relaxed whitespace-pre-line text-slate-100">
                    {currentWa.bodyText}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-emerald-200/70 pt-1">
                    <span>{currentWa.footerText}</span>
                    <span className="font-mono">10:45 AM ✓✓</span>
                  </div>
                </div>

                {/* Botones Interactivos */}
                <div className="space-y-1.5 max-w-lg">
                  {currentWa.buttons.map((btn, idx) => (
                    <div
                      key={idx}
                      className="bg-[#202C33] hover:bg-[#2A3942] border border-white/10 text-emerald-400 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow transition-all text-center"
                    >
                      <span>{btn.text}</span>
                    </div>
                  ))}
                </div>

                {/* Variables Info Tags */}
                <div className="pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">Variables dinámicas:</span>
                  {currentWa.variables.map((v, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-emerald-300">
                      {`{{${i + 1}}}`} {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: EMAIL HTML TEMPLATES */}
      {/* ========================================================================= */}
      {templateChannel === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Columna Izquierda: Selector de Plantillas Email (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl border space-y-3 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Plantillas HTML Transaccionales:</span>
                </label>
                <span className="text-[10px] bg-[#FF5A36]/10 text-[#FF5A36] font-bold px-2 py-0.5 rounded-full">
                  SMTP / Resend API
                </span>
              </div>

              <div className="space-y-2">
                {emailTemplates.map((tpl) => {
                  const isSelected = tpl.id === activeEmailId;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setActiveEmailId(tpl.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#FF5A36]/50 bg-[#FF5A36]/10 shadow-md shadow-[#FF5A36]/10'
                          : 'border-white/5 hover:border-white/15 bg-[#0E121B]/50 hover:bg-[#0E121B]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className={`text-xs font-bold block truncate ${
                            isSelected ? 'text-[#FF5A36]' : 'text-slate-200'
                          }`}>
                            {tpl.name}
                          </strong>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10">
                            {tpl.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                          {tpl.timing}
                        </span>
                      </div>

                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-[#FF5A36] translate-x-0.5' : 'text-slate-600'}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enviar Prueba por Correo */}
            <div className="p-5 rounded-2xl border border-[#FF5A36]/20 bg-[#FF5A36]/5 space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Enviar Correo de Prueba HTML</span>
                </strong>
                {emailTestSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
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
                  className="w-full bg-[#0E121B] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FF5A36]"
                />
                <button
                  type="button"
                  onClick={handleSendEmailTest}
                  disabled={isSendingEmailTest}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#FF5A36]/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
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

          {/* Columna Derecha: Vista Previa Real de Email HTML (7 cols) */}
          <div className="lg:col-span-7">
            <div className={`p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              {/* Email Client Header Preview */}
              <div className="border-b pb-3 border-black/5 dark:border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">De: <strong className="text-white">{salonName || 'BeautyFlow'} &lt;reservas@beautyflow.app&gt;</strong></span>
                  <span className="text-[10px] font-mono text-slate-400">10:45 AM</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400">Asunto: </span>
                  <strong className="text-[#FF5A36]">{currentEmail.subject}</strong>
                </div>
                <div className="text-[11px] text-slate-400 italic">
                  Preheader: {currentEmail.preheader}
                </div>
              </div>

              {/* Renderizado de la Tarjeta HTML de Email */}
              <div className="bg-[#090B10] p-6 sm:p-8 rounded-2xl border border-white/10 max-w-xl mx-auto space-y-6 text-slate-200 font-sans shadow-2xl">
                
                {/* Logo y Encabezado del Email */}
                <div className="text-center space-y-2 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF5A36]/30">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">{salonName || 'Studio Glamour Spa'}</h2>
                  <p className="text-xs text-[#FF5A36] font-semibold uppercase tracking-wider">Experiencia & Cuidado Exclusivo</p>
                </div>

                {/* Contenido según tipo de Email */}
                {activeEmailId === 'email_booking_confirmation' && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-bold text-white">¡Tu Cita está Confirmada!</h3>
                      <p className="text-xs text-slate-400">Hola <strong>Camila Torres</strong>, hemos reservado tu espacio con los mejores estilistas.</p>
                    </div>

                    {/* Resumen Card */}
                    <div className="bg-[#141926] p-4 rounded-xl border border-white/10 space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">💇‍♀️ Servicio:</span>
                        <strong className="text-white">Balayage & Tratamiento Plex</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">👤 Especialista:</span>
                        <strong className="text-white">Sofía Restrepo</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">📅 Fecha:</span>
                        <strong className="text-white">Viernes, 22 de Agosto 2026</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-slate-400">⏰ Hora:</span>
                        <strong className="text-emerald-400 font-extrabold">3:30 PM</strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">💵 Total a Pagar:</span>
                        <strong className="text-white font-extrabold">$280.000 COP</strong>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        className="bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg shadow-[#FF5A36]/30 cursor-pointer"
                      >
                        📅 Añadir a Google / Apple Calendar
                      </button>
                    </div>
                  </div>
                )}

                {activeEmailId === 'email_reminder_24h' && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-bold text-white">Te recordamos tu cita de mañana</h3>
                    <p className="text-xs text-slate-400">
                      Hola <strong>Camila</strong>, tu cita para <strong>Balayage</strong> con <strong>Sofía Restrepo</strong> es mañana a las <strong>3:30 PM</strong>.
                    </p>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs shadow"
                      >
                        ✅ Confirmar Asistencia
                      </button>
                      <button
                        type="button"
                        className="bg-white/10 hover:bg-white/15 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-white/15"
                      >
                        🔄 Reagendar
                      </button>
                    </div>
                  </div>
                )}

                {activeEmailId === 'email_receipt' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white">Comprobante de Pago Digital</h3>
                      <p className="text-xs text-slate-400">Recibo No. <strong>#REC-8492</strong></p>
                    </div>

                    <div className="bg-[#141926] p-4 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span>Balayage & Plex</span>
                        <span>$280.000 COP</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Serum Reparador Moroccanoil</span>
                        <span>$95.000 COP</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-emerald-400 text-sm">
                        <span>TOTAL PAGADO</span>
                        <span>$375.000 COP</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeEmailId === 'email_google_review' && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-bold text-white">¿Te encantó tu nuevo look?</h3>
                    <p className="text-xs text-slate-400">Califica la atención de <strong>Sofía Restrepo</strong> en Google Maps con 5 estrellas:</p>
                    
                    <div className="flex justify-center gap-1.5 py-2 text-amber-400">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-6 h-6 fill-current hover:scale-125 transition-transform cursor-pointer" />
                      ))}
                    </div>

                    <button
                      type="button"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20"
                    >
                      ⭐ Dejar Reseña en Google Maps
                    </button>
                  </div>
                )}

                {activeEmailId === 'email_vip_promo' && (
                  <div className="space-y-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
                      <Gift className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">¡Feliz Cumpleaños de parte del equipo!</h3>
                    <p className="text-xs text-slate-400">Este mes tienes un <strong>20% de descuento de regalo</strong> en cualquier servicio de spa o colorimetría.</p>

                    <div className="bg-[#141926] p-3 rounded-xl border border-dashed border-pink-500/40 text-xs font-mono text-pink-300">
                      CÓDIGO: <strong className="text-white font-extrabold tracking-wider">CUMPLEVIP20</strong>
                    </div>
                  </div>
                )}

                {/* Email Footer */}
                <div className="border-t border-white/10 pt-4 text-center text-[10px] text-slate-400 space-y-1">
                  <p>{salonName} • {salonPhone}</p>
                  <p>Gestión automatizada por BeautyFlow AI</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
