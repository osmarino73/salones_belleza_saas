import React from 'react';
import { X, Crown, Sparkles, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { SubscriptionPlan, PLAN_CONFIGS, getUpgradeWhatsAppUrl } from '../lib/planPermissions';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: SubscriptionPlan;
  currentPlan?: string;
  featureName: string;
  featureDescription?: string;
  salonName?: string;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  currentPlan,
  featureName,
  featureDescription,
  salonName
}) => {
  if (!isOpen) return null;

  const targetPlan = PLAN_CONFIGS[requiredPlan];
  const upgradeUrl = getUpgradeWhatsAppUrl(requiredPlan, salonName, featureName);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#121829] border-2 border-[#FF5A36] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-[#FF5A36]/20 relative text-white space-y-6">
        
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Superior */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] text-xs font-black uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Función Exclusiva del {targetPlan.name}</span>
        </div>

        {/* Encabezado */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Desbloquea {featureName}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {featureDescription || `Para utilizar ${featureName} en tu salón, necesitas el ${targetPlan.name}.`}
          </p>
        </div>

        {/* Tarjeta de Beneficios del Plan */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
          <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Inversión mensual</span>
              <strong className="text-2xl font-black text-white">{targetPlan.price_label}</strong>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Sin permanencia
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <strong className="text-slate-300 block font-bold">Todo lo que desbloqueas:</strong>
            <ul className="space-y-1.5 text-slate-300">
              {requiredPlan === 'crecimiento' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Colaboradoras Ilimitadas</strong> en tu equipo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>App Móvil</strong> para que cada estilista vea sus citas (<code className="text-[#FF5A36]">/colaborador</code>)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Punto de Venta POS</strong>, arqueo Z de caja y cobros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Liquidación automática de comisiones</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>CRM de Colorimetría</strong> y ficha técnica de clientas</span>
                  </li>
                </>
              )}

              {requiredPlan === 'pro_ia' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Recepcionista IA 24/7 en WhatsApp</strong> (Zernio Gateway)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Recordatorios automáticos</strong> anti-plantón por WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Bandeja Omnicanal</strong> con toma de control humano en 1 clic</span>
                  </li>
                </>
              )}

              {requiredPlan === 'inicio' && (
                <>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Agendador Interactivo 24/7</strong> (<code className="text-[#FF5A36]">/reservar/:slug</code>)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span>Hasta <strong>4 Colaboradores</strong> con agenda</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span>Panel de control de citas del día</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2.5 pt-1">
          <a
            href={upgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-2xl bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/30 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Activar {targetPlan.name} por WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            Seguir en mi plan actual
          </button>
        </div>

      </div>
    </div>
  );
};
