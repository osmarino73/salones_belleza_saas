import React, { useState } from 'react';
import {
  MessageCircle,
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
  ChevronRight
} from 'lucide-react';
import { TenantAISettings } from '../types';

interface WhatsAppTemplatesCardProps {
  theme: 'light' | 'dark';
  salonName: string;
  salonPhone: string;
  aiSettings: TenantAISettings;
  onUpdateSettings: (updated: TenantAISettings) => void;
}

interface TemplateItem {
  id: string;
  key: string;
  name: string;
  category: 'MARKETING' | 'UTILITY';
  status: 'APROBADA_META' | 'ACTIVA';
  headerText?: string;
  bodyText: string;
  footerText: string;
  buttons: Array<{ type: 'QUICK_REPLY' | 'URL'; text: string; icon?: string }>;
  timing: string;
  variables: string[];
}

export const WhatsAppTemplatesCard: React.FC<WhatsAppTemplatesCardProps> = ({
  theme,
  salonName,
  salonPhone,
  aiSettings,
  onUpdateSettings
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('booking_confirmation');
  const [testPhone, setTestPhone] = useState<string>(salonPhone || '');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  const templates: TemplateItem[] = [
    {
      id: 'booking_confirmation',
      key: 'confirmacion_reserva_v2',
      name: '1. Confirmación Inmediata de Reserva',
      category: 'UTILITY',
      status: 'APROBADA_META',
      headerText: '✨ ¡Cita Confirmada con Éxito!',
      bodyText: `¡Hola {{1}}! Tu reserva en *${salonName || 'BeautyFlow Studio'}* ha sido agendada con éxito.\n\n💇‍♀️ *Servicio:* {{2}}\n👤 *Especialista:* {{3}}\n📅 *Fecha:* {{4}}\n⏰ *Hora:* {{5}}\n💵 *Valor:* {{6}}`,
      footerText: `${salonName} • Confirmación Automática`,
      buttons: [
        { type: 'URL', text: '📍 Ver Ubicación', icon: 'map' },
        { type: 'URL', text: '📅 Añadir a Calendario', icon: 'calendar' }
      ],
      timing: 'Inmediatamente tras agendar en la web o por WhatsApp',
      variables: ['Nombre Clienta', 'Servicio', 'Estilista', 'Fecha', 'Hora', 'Precio COP']
    },
    {
      id: 'appointment_reminder_24h',
      key: 'recordatorio_cita_24h',
      name: '2. Recordatorio 24h Antes (Interactivo)',
      category: 'UTILITY',
      status: 'APROBADA_META',
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
      name: '3. Recordatorio 2 Horas Antes ("En Camino")',
      category: 'UTILITY',
      status: 'APROBADA_META',
      headerText: '☕ ¡Te esperamos en 2 horas!',
      bodyText: `¡Hola {{1}}! Tu especialista *{{2}}* ya tiene todo listo para tu servicio de *{{3}}* en 2 horas.\n\n📍 Te esperamos en *{{4}}*. ¡Ven con tiempo para relajarte con un café! ✨`,
      footerText: `${salonName} • Te esperamos con amor`,
      buttons: [
        { type: 'URL', text: '🚗 Cómo Llegar (Waze/Maps)', icon: 'map' }
      ],
      timing: '2 horas antes del servicio',
      variables: ['Nombre Clienta', 'Estilista', 'Servicio', 'Dirección del Salón']
    },
    {
      id: 'client_reactivation_promo',
      key: 'reactivacion_clientas_vip',
      name: '4. Reactivación de Clientas VIP (+30 días)',
      category: 'MARKETING',
      status: 'APROBADA_META',
      headerText: '💖 ¡Te extrañamos en el salón!',
      bodyText: `¡Hola {{1}}! Hace más de 30 días que no nos visitas en *${salonName || 'BeautyFlow'}* y queremos consentirte.\n\n🎁 Tienes un *15% de descuento especial* en tu próximo corte, color o spa durante este mes.\n\n¿Te gustaría que te reservemos un espacio esta semana?`,
      footerText: 'Promoción válida para clientas VIP',
      buttons: [
        { type: 'QUICK_REPLY', text: '📅 Agendar con Descuento' },
        { type: 'QUICK_REPLY', text: 'Ver Catálogo y Precios' }
      ],
      timing: 'Disparado automáticamente si la clienta no asiste en 35 días',
      variables: ['Nombre Clienta', 'Nombre Salón']
    }
  ];

  const currentTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0];

  const handleSendTestMessage = () => {
    if (!testPhone || testPhone.replace(/\D/g, '').length < 7) {
      alert('Por favor ingresa un número de teléfono válido con código de país (ej. +57 311 419 5123).');
      return;
    }
    setIsSendingTest(true);
    setTestSuccess(false);

    // Simular envío de plantilla por la API de Zernio
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className={`p-6 rounded-2xl border space-y-6 ${
      theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Plantillas de WhatsApp Oficiales</span>
              <span className="text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Aprobadas por Meta
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Plantillas HSM de alta conversión para confirmaciones automáticas, recordatorios y fidelización.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Zernio Template Engine <strong className="text-emerald-400">v2.4</strong>
        </div>
      </div>

      {/* Grid: Selector a la izquierda + Preview interactivo a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Lista de Plantillas (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Plantillas Disponibles:
          </label>

          {templates.map((tpl) => {
            const isSelected = tpl.id === activeTemplateId;
            return (
              <div
                key={tpl.id}
                onClick={() => setActiveTemplateId(tpl.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500/50 bg-emerald-500/10 shadow-md shadow-emerald-500/10'
                    : 'border-white/5 hover:border-white/15 bg-[#0E121B]/40 hover:bg-[#0E121B]'
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

                <div className="shrink-0 flex items-center gap-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    {tpl.category}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}

          {/* Toggle de automatización global */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#0E121B] space-y-3 mt-4">
            <div className="flex items-center justify-between text-xs">
              <div>
                <strong className="block font-bold text-white">Recordatorio Automático 24h</strong>
                <span className="text-[11px] text-slate-400">Disparo automático desde n8n / Supabase</span>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.send_reminder_whatsapp}
                onChange={(e) => onUpdateSettings({ ...aiSettings, send_reminder_whatsapp: e.target.checked })}
                className="w-4 h-4 text-emerald-500 rounded accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa Real en Burbuja de WhatsApp (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vista Previa en WhatsApp:</span>
              </label>

              <span className="text-[11px] font-mono text-slate-400">
                Template ID: <strong className="text-slate-300">{currentTemplate.key}</strong>
              </span>
            </div>

            {/* Burbuja Verde WhatsApp */}
            <div className="bg-[#0B141A] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden space-y-3 font-sans">
              
              {/* WhatsApp Message Bubble */}
              <div className="bg-[#005C4B] text-[#E9EDEF] rounded-2xl rounded-tl-none p-3.5 sm:p-4 shadow-md max-w-md space-y-2.5 relative border border-emerald-600/30">
                
                {/* Header */}
                {currentTemplate.headerText && (
                  <div className="font-extrabold text-sm text-emerald-200 border-b border-emerald-600/40 pb-1.5">
                    {currentTemplate.headerText}
                  </div>
                )}

                {/* Body Text with formatting */}
                <div className="text-xs leading-relaxed whitespace-pre-line text-slate-100">
                  {currentTemplate.bodyText}
                </div>

                {/* Footer and timestamp */}
                <div className="flex items-center justify-between text-[10px] text-emerald-200/70 pt-1">
                  <span>{currentTemplate.footerText}</span>
                  <span className="font-mono">10:45 AM ✓✓</span>
                </div>
              </div>

              {/* WhatsApp Interactive Action Buttons */}
              <div className="space-y-1.5 max-w-md">
                {currentTemplate.buttons.map((btn, idx) => (
                  <div
                    key={idx}
                    className="bg-[#202C33] hover:bg-[#2A3942] border border-white/10 text-emerald-400 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow transition-all text-center"
                  >
                    <span>{btn.text}</span>
                  </div>
                ))}
              </div>

              {/* Variables Info Tags */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap text-[10px] text-slate-400">
                <span className="font-bold text-slate-300">Variables dinámicas:</span>
                {currentTemplate.variables.map((v, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-emerald-300">
                    {`{{${i + 1}}}`} {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Test Sending Box */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Enviar Prueba a mi WhatsApp</span>
              </strong>
              {testSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-bounce">
                  <Check className="w-3.5 h-3.5" /> ¡Mensaje enviado con éxito!
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+57 311 419 5123"
                className="w-full bg-[#0E121B] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSendTestMessage}
                disabled={isSendingTest}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Plantilla</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
