import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Scissors,
  Users,
  MessageCircle,
  Building2,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Info
} from 'lucide-react';
import { api } from '../lib/supabase';
import { Service, Stylist, Tenant } from '../types';

interface SalonOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  ownerEmail: string;
  salonCurrency: 'COP' | 'USD' | 'MXN' | 'EUR';
  onComplete: () => void;
}

interface NewServiceItem {
  name: string;
  category: 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa';
  duration_minutes: number;
  price: number;
}

interface NewStylistItem {
  name: string;
  phone: string;
  specialty: string;
  commission_service_pct: number;
  commission_retail_pct: number;
}

export const SalonOnboardingModal: React.FC<SalonOnboardingModalProps> = ({
  isOpen,
  onClose,
  tenant,
  ownerEmail,
  salonCurrency: initialCurrency = 'COP',
  onComplete
}) => {
  // Pasos: 1. Negocio, 2. Servicios, 3. Colaboradores, 4. WhatsApp (Opcional)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Paso 1: Configuración de Negocio
  const [salonName, setSalonName] = useState(tenant?.name || 'Mi Salón de Belleza');
  const [salonPhone, setSalonPhone] = useState(tenant?.phone || '');
  const [salonCity, setSalonCity] = useState(tenant?.city || 'Medellín');
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>(initialCurrency);
  const [businessHours, setBusinessHours] = useState(tenant?.business_hours?.summary || 'Lun a Sáb: 8:00 AM – 7:00 PM');

  // Sincronizar reactivamente cuando llega el tenant cargado
  React.useEffect(() => {
    if (tenant) {
      if (tenant.name) setSalonName(tenant.name);
      if (tenant.phone) {
        setSalonPhone(tenant.phone);
        setWaPhoneNumber(tenant.phone);
      }
      if (tenant.city) setSalonCity(tenant.city);
      if (tenant.currency) setCurrency(tenant.currency);
      if (tenant.business_hours?.summary) setBusinessHours(tenant.business_hours.summary);
    } else {
      // Intentar leer de localStorage si tenant viene vacío
      try {
        const raw = localStorage.getItem('bf_tenant_active');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.name) setSalonName(parsed.name);
          if (parsed.phone) {
            setSalonPhone(parsed.phone);
            setWaPhoneNumber(parsed.phone);
          }
          if (parsed.city) setSalonCity(parsed.city);
          if (parsed.currency) setCurrency(parsed.currency);
          if (parsed.business_hours?.summary) setBusinessHours(parsed.business_hours.summary);
        }
      } catch (e) {}
    }
  }, [tenant, isOpen]);

  // Paso 2: Servicios Iniciales
  const [servicesList, setServicesList] = useState<NewServiceItem[]>([
    {
      name: 'Corte de Cabello & Cepillado',
      category: 'corte',
      duration_minutes: 45,
      price: currency === 'COP' ? 45000 : 25
    }
  ]);
  const [tempServiceName, setTempServiceName] = useState('');
  const [tempServiceCategory, setTempServiceCategory] = useState<'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa'>('color');
  const [tempServiceDuration, setTempServiceDuration] = useState(60);
  const [tempServicePrice, setTempServicePrice] = useState<number>(currency === 'COP' ? 90000 : 40);

  // Paso 3: Colaboradores Iniciales
  const [stylistsList, setStylistsList] = useState<NewStylistItem[]>([]);
  const [tempStylistName, setTempStylistName] = useState('');
  const [tempStylistPhone, setTempStylistPhone] = useState('');
  const [tempStylistSpecialty, setTempStylistSpecialty] = useState('Colorimetría & Estilismo');
  const [tempStylistCommService, setTempStylistCommService] = useState(45);
  const [tempStylistCommRetail, setTempStylistCommRetail] = useState(10);

  // Paso 4: WhatsApp IA (Opcional)
  const [waPhoneNumber, setWaPhoneNumber] = useState(tenant?.phone || '');
  const [agentName, setAgentName] = useState('Flowy');

  if (!isOpen) return null;

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempServiceName.trim()) return;

    setServicesList([
      ...servicesList,
      {
        name: tempServiceName.trim(),
        category: tempServiceCategory,
        duration_minutes: Number(tempServiceDuration),
        price: Number(tempServicePrice)
      }
    ]);
    setTempServiceName('');
    setTempServicePrice(currency === 'COP' ? 60000 : 30);
  };

  const handleRemoveService = (idx: number) => {
    setServicesList(servicesList.filter((_, i) => i !== idx));
  };

  const handleAddStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempStylistName.trim()) return;

    setStylistsList([
      ...stylistsList,
      {
        name: tempStylistName.trim(),
        phone: tempStylistPhone.trim(),
        specialty: tempStylistSpecialty.trim(),
        commission_service_pct: Number(tempStylistCommService),
        commission_retail_pct: Number(tempStylistCommRetail)
      }
    ]);
    setTempStylistName('');
    setTempStylistPhone('');
    setTempStylistSpecialty('Estilista');
  };

  const handleRemoveStylist = (idx: number) => {
    setStylistsList(stylistsList.filter((_, i) => i !== idx));
  };

  const handleSaveAndFinish = async (skipWhatsApp: boolean = false) => {
    setIsSubmitting(true);
    try {
      const activeTid = tenant?.id || '00000000-0000-0000-0000-000000000001';

      // 1. Actualizar datos del tenant
      if (tenant) {
        const updatedTenant: Tenant = {
          ...tenant,
          name: salonName,
          phone: salonPhone || tenant.phone,
          city: salonCity,
          currency: currency,
          business_hours: { summary: businessHours }
        };
        localStorage.setItem('bf_tenant_active', JSON.stringify(updatedTenant));
      }

      // 2. Guardar servicios creados
      for (const s of servicesList) {
        const newSrv: Service = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          tenant_id: activeTid,
          name: s.name,
          category: s.category,
          duration_minutes: s.duration_minutes,
          price: s.price,
          price_usd: currency === 'COP' ? Math.round(s.price / 4000) : s.price,
          price_cop: currency === 'COP' ? s.price : s.price * 4000,
          requires_patch_test: false,
          description: 'Servicio profesional garantizado.'
        };
        await api.createService(newSrv);
      }

      // 3. Guardar estilistas creados
      for (let i = 0; i < stylistsList.length; i++) {
        const st = stylistsList[i];
        const newSty: Stylist = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `sty-${Date.now()}-${i}`,
          tenant_id: activeTid,
          name: st.name,
          email: `${st.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@${tenant?.slug || 'salon'}.co`,
          phone: st.phone,
          phone_whatsapp: st.phone,
          specialty: st.specialty || 'Estilista Profesional',
          photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          role: 'colaborador',
          is_owner: false,
          attends_clients: true,
          rating: 5.0,
          reviews_count: 0,
          commission_service_pct: st.commission_service_pct,
          commission_retail_pct: st.commission_retail_pct,
          working_days: [1, 2, 3, 4, 5, 6],
          service_categories: ['color', 'corte', 'keratina', 'nails', 'barberia', 'spa'],
          service_ids: [],
          is_active: true
        };
        await api.createStylist(newSty, 'BeautyFlow2026*');
      }

      // 4. Actualizar configuración de IA si no se omitió WhatsApp
      if (!skipWhatsApp && waPhoneNumber) {
        try {
          const aiConfig = await api.getTenantAISettings(activeTid);
          if (aiConfig) {
            await api.updateTenantAISettings({
              ...aiConfig,
              whatsapp_phone_number: waPhoneNumber,
              agent_name: agentName || 'Flowy',
              is_active: true
            });
          }
        } catch (e) {}
      }

      // Marcar onboarding como completado
      localStorage.setItem(`bf_onboarding_done_${ownerEmail.toLowerCase().trim()}`, 'true');
      localStorage.setItem(`bf_onboarding_done_${activeTid}`, 'true');

      onComplete();
    } catch (err) {
      console.error('Error completing onboarding:', err);
      alert('Ocurrió un error al guardar la configuración inicial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121624] border border-orange-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 my-8">
        
        {/* Header con Barra de Progreso */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF5A36] to-pink-500 flex items-center justify-center text-white font-black shadow-lg shadow-[#FF5A36]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  ¡Bienvenida a BeautyFlow AI! 🎉
                </h2>
                <p className="text-xs text-slate-400">
                  Configura tu negocio en solo 3 minutos para empezar a agendar citas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              title="Cerrar y continuar luego"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { num: 1, title: 'Tu Salón' },
              { num: 2, title: 'Servicios' },
              { num: 3, title: 'Equipo' },
              { num: 4, title: 'WhatsApp (Opcional)' }
            ].map((stepItem) => (
              <div
                key={stepItem.num}
                className={`p-2 rounded-xl border text-center transition-all ${
                  currentStep === stepItem.num
                    ? 'bg-[#FF5A36]/15 border-[#FF5A36] text-white font-bold'
                    : currentStep > stepItem.num
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
                    : 'bg-white/5 border-white/5 text-slate-500 font-medium'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider block">Paso {stepItem.num}</div>
                <div className="text-xs truncate">{stepItem.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PASO 1: DATOS DEL NEGOCIO & MONEDA
            ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" />
              <span>Verifica los datos generales de tu salón. Podrás cambiarlos en cualquier momento desde Ajustes.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Nombre del Salón / Spa *</label>
                <input
                  type="text"
                  required
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="ej. Sandra Color's"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Teléfono / WhatsApp de Contacto</label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Ciudad o Ubicación</label>
                <input
                  type="text"
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  placeholder="ej. Medellín, Colombia"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Moneda Principal de Cobro</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-bold"
                >
                  <option value="COP">COP ($ Pesos Colombianos)</option>
                  <option value="USD">USD ($ Dólares)</option>
                  <option value="MXN">MXN ($ Pesos Mexicanos)</option>
                  <option value="EUR">EUR (€ Euros)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Horarios de Atención</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="ej. Lun a Sáb: 8:00 AM – 7:00 PM"
                className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!salonName.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-orange-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF5A36]/30 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <span>Siguiente: Tus Servicios</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 2: CREACIÓN DE SERVICIOS
            ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
              <Scissors className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Agrega los servicios principales que ofreces en tu salón para que tus clientas puedan agendarlos.</span>
            </div>

            {/* Formulario Rápido de Servicio */}
            <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                + Agregar Nuevo Servicio
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Nombre del Servicio *</label>
                  <input
                    type="text"
                    required
                    value={tempServiceName}
                    onChange={(e) => setTempServiceName(e.target.value)}
                    placeholder="ej. Balayage Rubio Cenizo, Manicura Semipermanente, Corte Caballero"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Categoría</label>
                  <select
                    value={tempServiceCategory}
                    onChange={(e) => setTempServiceCategory(e.target.value as any)}
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                  >
                    <option value="color">Colorimetría & Tintes</option>
                    <option value="corte">Cortes & Peinados</option>
                    <option value="keratina">Alisados & Keratinas</option>
                    <option value="nails">Uñas & Manicura</option>
                    <option value="barberia">Barbería & Barba</option>
                    <option value="spa">Spa & Estética</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={tempServiceDuration}
                    onChange={(e) => setTempServiceDuration(Number(e.target.value))}
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> Tarifa ({currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={tempServicePrice}
                      onChange={(e) => setTempServicePrice(Number(e.target.value))}
                      className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" /> Añadir Servicio
                  </button>
                </div>
              </div>
            </form>

            {/* Lista de Servicios Agregados */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Servicios Listos en tu Catálogo ({servicesList.length})
              </span>
              {servicesList.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/15 text-center text-xs text-slate-500">
                  Aún no has agregado servicios. Escribe uno arriba para crearlo.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {servicesList.map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block font-bold">{srv.name}</strong>
                        <span className="text-[11px] text-slate-400">
                          {srv.duration_minutes} min • <span className="text-emerald-400 font-bold">${srv.price.toLocaleString()} {currency}</span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de Navegación */}
            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={servicesList.length === 0}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-orange-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF5A36]/30 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <span>Siguiente: Tu Equipo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 3: EQUIPO DE COLABORADORES & COMISIONES
            ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
              <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                Agrega a tus especialistas o colaboradoras con sus porcentajes de comisión para liquidar sus pagos automáticamente.
              </span>
            </div>

            {/* Formulario Rápido de Colaborador */}
            <form onSubmit={handleAddStylist} className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                + Agregar Colaboradora / Estilista
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={tempStylistName}
                    onChange={(e) => setTempStylistName(e.target.value)}
                    placeholder="ej. Camila Restrepo"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Especialidad / Rol</label>
                  <input
                    type="text"
                    value={tempStylistSpecialty}
                    onChange={(e) => setTempStylistSpecialty(e.target.value)}
                    placeholder="ej. Colorista Master, Manicurista"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">WhatsApp de la Colaboradora</label>
                  <input
                    type="text"
                    value={tempStylistPhone}
                    onChange={(e) => setTempStylistPhone(e.target.value)}
                    placeholder="+57 312 000 0000"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400 text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">% Comis. Servicio</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempStylistCommService}
                      onChange={(e) => setTempStylistCommService(Number(e.target.value))}
                      className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400 text-xs font-bold text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">% Comis. Venta</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tempStylistCommRetail}
                      onChange={(e) => setTempStylistCommRetail(Number(e.target.value))}
                      className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-400 text-xs font-bold text-center"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Plus className="w-4 h-4" /> Añadir al Equipo
                  </button>
                </div>
              </div>
            </form>

            {/* Lista de Colaboradores Agregados */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                Colaboradoras en tu Equipo ({stylistsList.length + 1})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {/* Dueña por defecto */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white font-bold">{salonName} (Dueña / Admin)</strong>
                      <span className="text-[9px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-black">ADMIN</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Directora & Gestión General • 100% propio</span>
                  </div>
                </div>

                {/* Colaboradoras extra */}
                {stylistsList.map((sty, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white block font-bold">{sty.name}</strong>
                      <span className="text-[11px] text-slate-400">
                        {sty.specialty} • {sty.commission_service_pct}% comisión
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStylist(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de Navegación */}
            <div className="pt-3 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-orange-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF5A36]/30 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <span>Siguiente: WhatsApp IA (Opcional)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PASO 4: CONEXIÓN WHATSAPP IA (OPCIONAL)
            ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <MessageCircle className="w-4 h-4" />
                <span>Atención Automática por WhatsApp con IA (Opcional)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tu agente virtual podrá atender dudas de tarifas, agendar citas en tu calendario y enviar recordatorios automáticos 2 horas antes de cada cita para evitar plantones.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Número de WhatsApp para tu Asistente Virtual</span>
                </label>
                <input
                  type="text"
                  value={waPhoneNumber}
                  onChange={(e) => setWaPhoneNumber(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nombre de tu Asistente Virtual de Belleza
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Flowy"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Opciones de Acción */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                {/* Botón Omitir */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveAndFinish(true)}
                  className="flex-1 sm:flex-initial px-4 py-3 rounded-xl border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-all"
                >
                  Omitir este paso y finalizar
                </button>

                {/* Botón Guardar con WhatsApp */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveAndFinish(false)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Guardando...' : 'Completar Onboarding'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
