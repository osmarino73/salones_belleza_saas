import React from 'react';
import {
  X,
  Sparkles,
  Globe,
  Calendar,
  Users,
  Scissors,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  HeartHandshake,
  Smartphone
} from 'lucide-react';
import { Tenant } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  ownerName: string;
  onOpenCustomizer?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  tenant,
  ownerName,
  onOpenCustomizer,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const salonName = tenant?.name || 'Tu Salón de Belleza';
  const salonSlug = tenant?.slug || 'mi-salon';
  const cleanOwner = ownerName && ownerName.toLowerCase() !== 'owner' ? ownerName : 'Dueña';
  const websiteUrl = `/sitio/${salonSlug}`;
  const bookingUrl = `/reservar/${salonSlug}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0E131F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white my-8">
        {/* Glow de Fondo Superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-r from-[#FF5A36]/30 via-pink-500/25 to-purple-600/20 blur-3xl pointer-events-none" />

        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabecera de Bienvenida */}
        <div className="p-6 sm:p-8 text-center relative z-10 space-y-3 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>¡Bienvenida a Kowy! 🚀</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ¡Hola, {cleanOwner}! 🎉
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Tu salón <strong className="text-white font-bold">{salonName}</strong> ya tiene su plataforma digital activa. Aquí tienes todo lo que necesitas para llenar tu agenda y gestionar tu negocio.
          </p>
        </div>

        {/* Tarjetas de las 3 Herramientas Clave */}
        <div className="p-6 sm:p-8 space-y-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Tus 3 superpoderes listos para usar:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Superpoder 1: Página Web Oficial */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition-all space-y-2 relative group">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <strong className="text-xs font-bold text-white block">Tu Página Web</strong>
              <p className="text-[11px] text-slate-400 leading-snug">
                Página web móvil con tus servicios, fotos, horarios y botón de WhatsApp oficial.
              </p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-400 hover:text-pink-300 pt-1"
              >
                <span>Ver mi Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Superpoder 2: Agendador Online 24/7 */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#FF5A36]/40 transition-all space-y-2 relative group">
              <div className="w-9 h-9 rounded-xl bg-[#FF5A36]/20 border border-[#FF5A36]/30 text-[#FF5A36] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <strong className="text-xs font-bold text-white block">Agendador 24/7</strong>
              <p className="text-[11px] text-slate-400 leading-snug">
                Tus clientas eligen servicio, día, hora y especialista sin necesidad de llamar.
              </p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5A36] hover:text-orange-400 pt-1"
              >
                <span>Ver Agendador</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Superpoder 3: Control & Equipo */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all space-y-2 relative group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <strong className="text-xs font-bold text-white block">Equipo & Caja POS</strong>
              <p className="text-[11px] text-slate-400 leading-snug">
                Control de citas, comisiones de colaboradoras, caja diaria y portal de especialistas.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onNavigateTab) onNavigateTab('especialistas');
                }}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 pt-1 cursor-pointer"
              >
                <span>Ver Equipo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Banner de Acción Rápida Recomendada */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF5A36]/15 via-pink-500/10 to-purple-500/10 border border-[#FF5A36]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5A36]/30 font-black">
                ✨
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">
                  Paso sugerido: Personaliza los datos de tu web
                </strong>
                <span className="text-[11px] text-slate-300 block">
                  Ajusta tu foto de portada, lema, horario y servicios destacados en vivo.
                </span>
              </div>
            </div>

            {onOpenCustomizer && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCustomizer();
                }}
                className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Personalizar Web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer con Botón Principal de Cierre */}
        <div className="px-6 py-4 bg-black/30 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">Todo listo para empezar a recibir citas.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black text-xs px-6 py-2.5 rounded-full shadow-lg shadow-[#FF5A36]/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🚀 ¡Empezar a usar mi Dashboard!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
