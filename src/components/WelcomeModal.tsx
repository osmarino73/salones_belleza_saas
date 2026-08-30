import React from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  Scissors,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Copy,
  Plus,
  Palette
} from 'lucide-react';
import { Tenant } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  ownerName: string;
  servicesCount?: number;
  stylistsCount?: number;
  onOpenCustomizer?: () => void;
  onOpenNewService?: () => void;
  onOpenNewStylist?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  tenant,
  ownerName,
  servicesCount = 0,
  stylistsCount = 0,
  onOpenCustomizer,
  onOpenNewService,
  onOpenNewStylist,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const salonName = tenant?.name || 'Tu Salón de Belleza';
  const salonSlug = tenant?.slug || 'mi-salon';
  const cleanOwner = ownerName && ownerName.toLowerCase() !== 'owner' ? ownerName : 'Dueña';
  const baseUrl = window.location.origin;
  const bookingUrl = `${baseUrl}/reservar/${salonSlug}`;

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    alert(`✨ ¡Enlace de reservas copiado al portapapeles!\n\n${bookingUrl}\n\nCompártelo en tu biografía de Instagram y WhatsApp para recibir citas.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto px-4 py-6 sm:py-12 flex justify-center items-start sm:items-center animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0E131F] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white my-auto">
        
        {/* Glow Superior Monocromático */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#FF5A36]/15 blur-3xl pointer-events-none" />

        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabecera Principal */}
        <div className="p-6 sm:p-7 text-center relative z-10 space-y-2 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía de Activación Kowy</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            ¡Hola, {cleanOwner}! 👋
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Tu salón <strong className="text-white font-bold">{salonName}</strong> ya tiene su plataforma lista. Completa estos 2 pasos para empezar a recibir citas:
          </p>
        </div>

        {/* Pasos Esenciales (Checklist 1 y 2) */}
        <div className="p-4 sm:p-6 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Paso 1: Servicios & Precios */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 relative group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center font-bold">
                    <Scissors className="w-4 h-4 text-[#FF5A36]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    Paso 1 Obligatorio
                  </span>
                </div>

                <div>
                  <strong className="text-xs sm:text-sm font-bold text-white block">
                    1. Revisa o Agrega tus Servicios
                  </strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Tus clientas necesitan ver los tratamientos, precios y duración para agendar solas.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {servicesCount > 0 ? `✓ ${servicesCount} servicios activos` : '⚠️ Sin servicios'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenNewService) {
                      onOpenNewService();
                    } else if (onNavigateTab) {
                      onNavigateTab('servicios');
                    }
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Gestionar Servicios</span>
                </button>
              </div>
            </div>

            {/* Paso 2: Equipo de Especialistas */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3 relative group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4 text-[#FF5A36]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    Paso 2 Obligatorio
                  </span>
                </div>

                <div>
                  <strong className="text-xs sm:text-sm font-bold text-white block">
                    2. Registra a tus Especialistas
                  </strong>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Asigna quién realiza cada tratamiento, sus fotos y horarios de atención.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">
                  {stylistsCount > 0 ? `✓ ${stylistsCount} colaboradoras` : '⚠️ Sin equipo registrado'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenNewStylist) {
                      onOpenNewStylist();
                    } else if (onNavigateTab) {
                      onNavigateTab('especialistas');
                    }
                  }}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Gestionar Equipo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Banner Paso 3: Personalizador Web & Horarios */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center shrink-0 font-bold">
                <Palette className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div>
                <strong className="text-xs font-bold text-white block">
                  3. Personaliza tu Página Web y Horario
                </strong>
                <span className="text-[11px] text-slate-400 block">
                  Cambia tu portada, lema del navbar, horarios y fotos con vista previa en vivo.
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
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Personalizar Web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Enlace de Reservas Directo para Compartir (100% Responsivo y Limpio) */}
          <div className="p-4 rounded-2xl bg-[#080B12] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full overflow-hidden">
            <div className="flex items-start sm:items-center gap-3 min-w-0 w-full flex-1">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Tu enlace oficial de reservas 24/7:</span>
                <span className="text-xs font-mono text-[#FF5A36] font-bold truncate block break-all">
                  {bookingUrl}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
              <button
                type="button"
                onClick={copyBookingLink}
                className="flex-1 sm:flex-initial bg-white/5 hover:bg-white/15 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                title="Copiar enlace"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </button>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Probar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/30 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-[11px]">Puedes consultar esta guía cuando quieras desde tu perfil.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-lg shadow-[#FF5A36]/30 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Empezar a explorar mi Dashboard!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
