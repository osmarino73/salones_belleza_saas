import React from 'react';
import { X, Crown, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Users, RotateCcw } from 'lucide-react';
import { SubscriptionPlan, PLAN_CONFIGS, getUpgradeWhatsAppUrl, getExtraCollaboratorWhatsAppUrl } from '../lib/planPermissions';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan: SubscriptionPlan;
  currentPlan?: string;
  featureName: string;
  featureDescription?: string;
  salonName?: string;
  onNavigateToTeam?: () => void;
  onOpenSubscriptionModal?: () => void;
}

export const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  requiredPlan,
  currentPlan,
  featureName,
  featureDescription,
  salonName,
  onNavigateToTeam,
  onOpenSubscriptionModal
}) => {
  if (!isOpen) return null;

  const targetPlan = PLAN_CONFIGS[requiredPlan];
  const upgradeUrl = getUpgradeWhatsAppUrl(requiredPlan, salonName, featureName);
  const extraCollaboratorUrl = getExtraCollaboratorWhatsAppUrl(salonName);

  const isCollaboratorLimitOnInicio = 
    (currentPlan === 'inicio' || currentPlan === 'free') && 
    requiredPlan === 'crecimiento' && 
    featureName.toLowerCase().includes('colaborador');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#121829] border-2 border-[#FF5A36] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 shadow-2xl shadow-[#FF5A36]/20 relative text-white space-y-5">
        
        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isCollaboratorLimitOnInicio ? (
          <>
            {/* Badge Superior */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Límite de Equipo (3 Colaboradores)</span>
            </div>

            {/* Encabezado */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                ¿Cómo deseas sumar más integrantes a tu salón?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Has alcanzado el cupo base de 3 colaboradores de tu Plan Inicio. Elige la opción que mejor se adapte a tu salón:
              </p>
            </div>

            {/* Las 2 Opciones en Tarjetas */}
            <div className="space-y-3.5">
              {/* OPCIÓN 1: ADD-ON MICRO-UPGRADE (RECOMENDADO) */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181F33] to-[#0E1322] border-2 border-emerald-500/70 shadow-lg shadow-emerald-500/10 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Opción 1 • Add-on Flexible</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <strong className="text-2xl font-black text-white">+ $10.000 COP</strong>
                      <span className="text-xs text-slate-400 font-semibold">/ mes por colaborador</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase shrink-0">
                    ⭐ Más Popular
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 leading-snug">
                  Conservas tu Plan Inicio ($29.000) y solo sumas el cupo extra para tu nuevo colaborador. Pagas únicamente <strong>$39.000 COP/mes</strong> en total.
                </p>

                <div className="space-y-2">
                  {onOpenSubscriptionModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSubscriptionModal();
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>⚡ Configurar Cupos y Pagar en Kowy</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <a
                    href={extraCollaboratorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                    <span>O solicitar por WhatsApp con un Asesor</span>
                  </a>
                </div>
              </div>

              {/* OPCIÓN 2: PLAN CRECIMIENTO ILIMITADO */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex justify-between items-baseline border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Opción 2 • Expansión Total</span>
                    <strong className="text-lg font-black text-white">$120.000 COP / mes</strong>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    Para 6+ integrantes
                  </span>
                </div>

                <ul className="space-y-1 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Colaboradoras 100% Ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                    <span><strong>Punto de Venta POS</strong> y comisiones automáticas</span>
                  </li>
                </ul>

                <a
                  href={upgradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#FF5A36] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/10 hover:border-[#FF5A36] cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Pasar a Plan Crecimiento Ilimitado ($120k)</span>
                </a>
              </div>
            </div>

            {/* OPCIÓN 3: HIGIENE SIN COSTO */}
            <div className="pt-2 text-center space-y-2 border-t border-white/10">
              {onNavigateToTeam && (
                <button
                  type="button"
                  onClick={onNavigateToTeam}
                  className="text-xs text-[#FF5A36] hover:underline font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>¿Alguien ya no trabaja en tu salón? Gestionar equipo para liberar un cupo sin costo</span>
                </button>
              )}
              <div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Seguir con mis 3 colaboradores actuales
                </button>
              </div>
            </div>
          </>
        ) : (
          /* FLUJO ESTÁNDAR PARA OTRAS FUNCIONES (IA, PLAN INICIO, ETC) */
          <>
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
                        <span><strong>Citas Online Ilimitadas 24/7</strong> (sin tope de 25 citas/mes)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                        <span>Hasta <strong>3 Colaboradores</strong> con agenda (+ extras por $10k/mes c/u)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
                        <span>Control de citas del día y confirmaciones por WhatsApp</span>
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
                className="w-full py-3.5 px-5 rounded-2xl bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/30 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Activar {targetPlan.name} por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors cursor-pointer"
              >
                Seguir en mi plan actual
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
