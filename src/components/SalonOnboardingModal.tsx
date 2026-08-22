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

import { ServiceImagePicker } from './ServiceImagePicker';
import { getSuggestedImageForService } from '../lib/beautyImageLibrary';

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
  category: string;
  duration_minutes: number;
  price: number;
  image_url?: string;
}

interface NewStylistItem {
  name: string;
  phone: string;
  specialty: string;
  categories: string[];
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
  const [salonPhone, setSalonPhone] = useState(tenant?.phone || '+57 300 000 0000');
  const [salonAddress, setSalonAddress] = useState(tenant?.address || '');
  const [salonCity, setSalonCity] = useState(tenant?.city || 'Medellín');
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>((tenant?.currency as any) || initialCurrency || 'COP');
  const [businessHours, setBusinessHours] = useState(tenant?.business_hours?.summary || 'Lun a Sáb: 8:00 AM – 7:00 PM');

  React.useEffect(() => {
    async function loadInitialData() {
      if (tenant && tenant.id !== '00000000-0000-0000-0000-000000000001') {
        if (tenant.name) setSalonName(tenant.name);
        if (tenant.phone) setSalonPhone(tenant.phone);
        if (tenant.address) setSalonAddress(tenant.address);
        if (tenant.city) setSalonCity(tenant.city);
        if (tenant.currency) setCurrency(tenant.currency as any);
        if (tenant.business_hours?.summary) setBusinessHours(tenant.business_hours.summary);

        // Precargar servicios del prospecto si existen
        try {
          const prospects = await api.getProspectSites();
          const pSite = prospects.find(p => p.claimed_tenant_id === tenant.id || p.slug === tenant.slug || (p.business_name && tenant.name && p.business_name.toLowerCase().includes(tenant.name.toLowerCase())));
          if (pSite?.business_data?.servicios && pSite.business_data.servicios.length > 0) {
            const loadedServices = pSite.business_data.servicios.map((s: any) => ({
              name: s.nombre || s.titulo,
              category: 'color',
              duration_minutes: s.duracion_minutos || 60,
              price: s.precio_cop || 90000,
              image_url: s.img || s.imagen || ''
            }));
            setServicesList(loadedServices);
          }
        } catch (e) {}
      } else {
        // Si es un onboarding inicial de prospecto (ej. Sandra, Cris, Kapa)
        try {
          const prospects = await api.getProspectSites();
          let targetProspect = null;
          if (ownerEmail) {
            targetProspect = prospects.find(p => p.claimed_tenant_id && p.claimed_tenant_id === tenant?.id);
          }
          if (!targetProspect && prospects.length > 0) {
            targetProspect = prospects[0]; // Tomar el primer prospecto activo
          }
          if (targetProspect) {
            setSalonName(targetProspect.business_name);
            if (targetProspect.phone_whatsapp) {
              setSalonPhone(targetProspect.phone_whatsapp);
              setWaPhoneNumber(targetProspect.phone_whatsapp);
            }
            if (targetProspect.city) setSalonCity(targetProspect.city);
            if (targetProspect.address) setSalonAddress(targetProspect.address);
            if (targetProspect.business_data?.horario_atencion) setBusinessHours(targetProspect.business_data.horario_atencion);
            
            if (targetProspect.business_data?.servicios && targetProspect.business_data.servicios.length > 0) {
              const loadedServices = targetProspect.business_data.servicios.map((s: any) => ({
                name: s.nombre || s.titulo,
                category: 'color',
                duration_minutes: s.duracion_minutos || 60,
                price: s.precio_cop || 90000,
                image_url: s.img || s.imagen || ''
              }));
              setServicesList(loadedServices);
            }
          }
        } catch (e) {}
      }
    }
    loadInitialData();
  }, [tenant, isOpen, ownerEmail]);

  // Lista Dinámica de Categorías en el Onboarding
  const [availableCategories, setAvailableCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: 'color', name: 'Colorimetría & Tintes', icon: '🎨' },
    { id: 'corte', name: 'Cortes & Peinados', icon: '✂️' },
    { id: 'keratina', name: 'Alisados & Keratinas', icon: '✨' },
    { id: 'nails', name: 'Uñas & Manicura', icon: '💅' },
    { id: 'barberia', name: 'Barbería & Barba', icon: '💈' },
    { id: 'spa', name: 'Spa & Estética', icon: '🧖‍♀️' }
  ]);
  const [isAddingNewCatOnboarding, setIsAddingNewCatOnboarding] = useState(false);
  const [newCatNameOnboarding, setNewCatNameOnboarding] = useState('');
  const [newCatIconOnboarding, setNewCatIconOnboarding] = useState('✨');

  // Cargar categorías existentes del salón al abrir
  React.useEffect(() => {
    async function fetchCats() {
      if (!isOpen) return;
      const tid = tenant?.id;
      if (tid && tid !== '00000000-0000-0000-0000-000000000001') {
        try {
          const dbCats = await api.getCategories(tid);
          if (dbCats && dbCats.length > 0) {
            setAvailableCategories(dbCats.map(c => ({
              id: c.slug || c.id,
              name: c.name,
              icon: c.icon || '✨'
            })));
          }
        } catch (e) {}
      }
    }
    fetchCats();
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
  const [tempServiceCategory, setTempServiceCategory] = useState<string>('color');
  const [tempServiceDuration, setTempServiceDuration] = useState(60);
  const [tempServicePrice, setTempServicePrice] = useState<number>(currency === 'COP' ? 90000 : 40);
  const [tempServiceImage, setTempServiceImage] = useState<string>('');

  // Paso 3: Colaboradores Iniciales
  const [stylistsList, setStylistsList] = useState<NewStylistItem[]>([]);
  const [tempStylistName, setTempStylistName] = useState('');
  const [tempStylistPhoneRaw, setTempStylistPhoneRaw] = useState(''); // Solo 10 dígitos
  const [tempStylistCategories, setTempStylistCategories] = useState<string[]>(['color', 'corte']);
  const [tempStylistCommService, setTempStylistCommService] = useState(45);
  const [tempStylistCommRetail, setTempStylistCommRetail] = useState(10);

  // Paso 4: WhatsApp IA (Opcional)
  const [waPhoneNumber, setWaPhoneNumber] = useState(tenant?.phone || '');
  const [agentName, setAgentName] = useState('Flowy');

  if (!isOpen) return null;

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempServiceName.trim()) return;

    // Asignar imagen manual o auto-sugerir imagen ilustrativa de stock
    const finalImage = tempServiceImage.trim() || getSuggestedImageForService(tempServiceName, tempServiceCategory);

    setServicesList([
      ...servicesList,
      {
        name: tempServiceName.trim(),
        category: tempServiceCategory,
        duration_minutes: Number(tempServiceDuration),
        price: Number(tempServicePrice),
        image_url: finalImage
      }
    ]);
    setTempServiceName('');
    setTempServiceImage('');
    setTempServicePrice(currency === 'COP' ? 60000 : 30);
  };

  const handleRemoveService = (idx: number) => {
    setServicesList(servicesList.filter((_, i) => i !== idx));
  };

  const handleAddStylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempStylistName.trim()) return;

    // Limpiar solo los 10 dígitos ingresados
    const cleanDigits = tempStylistPhoneRaw.replace(/\D/g, '').slice(-10);
    const formattedPhone = cleanDigits ? `+57 ${cleanDigits}` : '';

    const categoryNamesMap: Record<string, string> = {
      color: 'Colorimetría',
      corte: 'Cortes & Peinados',
      keratina: 'Alisados & Keratinas',
      nails: 'Uñas & Manicura',
      barberia: 'Barbería',
      spa: 'Spa Facial & Corporal'
    };
    availableCategories.forEach(ac => {
      categoryNamesMap[ac.id] = ac.name;
    });

    const generatedSpecialty = tempStylistCategories.length > 0
      ? tempStylistCategories.map(c => categoryNamesMap[c] || c).join(', ')
      : 'Estilista Integral';

    setStylistsList([
      ...stylistsList,
      {
        name: tempStylistName.trim(),
        phone: formattedPhone,
        specialty: generatedSpecialty,
        categories: tempStylistCategories.length > 0 ? tempStylistCategories : ['color', 'corte'],
        commission_service_pct: Number(tempStylistCommService),
        commission_retail_pct: Number(tempStylistCommRetail)
      }
    ]);
    setTempStylistName('');
    setTempStylistPhoneRaw('');
    setTempStylistCategories(['color', 'corte']);
  };

  const handleRemoveStylist = (idx: number) => {
    setStylistsList(stylistsList.filter((_, i) => i !== idx));
  };

  const toggleCategory = (catId: string) => {
    if (tempStylistCategories.includes(catId)) {
      if (tempStylistCategories.length === 1) return; // Mantener al menos una
      setTempStylistCategories(tempStylistCategories.filter(c => c !== catId));
    } else {
      setTempStylistCategories([...tempStylistCategories, catId]);
    }
  };

  const handleSaveAndFinish = async (skipWhatsApp: boolean = false) => {
    setIsSubmitting(true);
    try {
      const activeTid = (tenant?.id && tenant.id !== '00000000-0000-0000-0000-000000000001')
        ? tenant.id
        : (ownerEmail && ownerEmail !== 'sofia@studioglamour.co')
        ? `tenant-${ownerEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        : '00000000-0000-0000-0000-000000000001';

      // 0. Guardar categorías creadas en el Onboarding si son nuevas
      for (const cat of availableCategories) {
        if (!['color', 'corte', 'keratina', 'nails', 'barberia', 'spa'].includes(cat.id)) {
          await api.createCategory({
            tenant_id: activeTid,
            name: cat.name,
            slug: cat.id,
            icon: cat.icon || '✨',
            description: `Categoría ${cat.name}`
          });
        }
      }

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
          image_url: s.image_url || undefined,
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
          service_categories: st.categories || ['color', 'corte'],
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center p-4 sm:p-6 pt-10 sm:pt-16 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-b from-[#161B2B] via-[#0F131F] to-[#0A0D14] border border-white/15 rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-slate-100 space-y-6 mb-12 overflow-hidden">
        
        {/* Glow Decorativo de Fondo */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header con Barra de Progreso */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF5A36] to-pink-500 flex items-center justify-center text-white font-black shadow-lg shadow-[#FF5A36]/30 ring-1 ring-white/20 shrink-0">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-full border border-[#FF5A36]/20">
                    Setup Inicial Guiado • BeautyFlow AI
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Paso {currentStep} de 4 ({currentStep === 1 ? '25%' : currentStep === 2 ? '50%' : currentStep === 3 ? '75%' : '100%'})
                  </span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                  {currentStep === 1 && '🏢 Identidad & Ubicación de tu Salón'}
                  {currentStep === 2 && '✂️ Tu Catálogo de Servicios & Precios'}
                  {currentStep === 3 && '👥 Tu Equipo de Colaboradoras & Comisiones'}
                  {currentStep === 4 && '🤖 Asistente de WhatsApp IA & Finalización'}
                </h2>
                <p className="text-xs text-slate-400">
                  {currentStep === 1 && 'Personaliza el nombre, contacto y horarios que verán tus clientas en tu página web.'}
                  {currentStep === 2 && 'Agrega los tratamientos que ofreces para que tus clientas puedan reservar solas.'}
                  {currentStep === 3 && 'Registra a tus colaboradoras para organizar sus agendas y liquidar comisiones en automático.'}
                  {currentStep === 4 && 'Revisa el resumen de tu plataforma y activa tu agendador interactivo.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all border border-white/5"
              title="Cerrar y continuar luego"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Barra de Progreso Lineal con Glow */}
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-amber-500 via-[#FF5A36] to-pink-500 h-full rounded-full transition-all duration-500 shadow-sm shadow-[#FF5A36]/50"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Stepper Wizard Bar Prémium */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { num: 1, title: 'Tu Salón', icon: '🏢' },
              { num: 2, title: 'Servicios', icon: '✂️' },
              { num: 3, title: 'Equipo', icon: '👥' },
              { num: 4, title: 'Listo & IA', icon: '🚀' }
            ].map((stepItem) => (
              <div
                key={stepItem.num}
                className={`p-2 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden ${
                  currentStep === stepItem.num
                    ? 'bg-gradient-to-b from-[#FF5A36]/20 to-[#FF5A36]/5 border-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/20'
                    : currentStep > stepItem.num
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold'
                    : 'bg-white/[0.02] border-white/5 text-slate-500 font-medium'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 flex items-center justify-center gap-1">
                  <span>{stepItem.icon}</span> Paso {stepItem.num}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{stepItem.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PASO 1: DATOS DEL NEGOCIO & MONEDA
            ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Tarjeta Didáctica */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex items-start gap-3 text-xs text-slate-300">
              <Building2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block font-bold mb-0.5">💡 ¿Para qué usamos estos datos?</strong>
                <span>Esta información se mostrará en la cabecera de tu página web oficial y en el mensaje de confirmación que reciben tus clientas al agendar.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Nombre Comercial de tu Salón / Spa *
                </label>
                <input
                  type="text"
                  required
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="ej. Sandra Color's, Luxus Beauty Spa, Barbería Don Mario"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold placeholder:text-slate-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">El nombre que conocen tus clientas en tu ciudad</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  WhatsApp de Contacto Oficial *
                </label>
                <input
                  type="text"
                  value={salonPhone}
                  onChange={(e) => setSalonPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold placeholder:text-slate-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Aquí te llegarán las confirmaciones y notificaciones</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Ciudad o Municipio *</label>
                <input
                  type="text"
                  value={salonCity}
                  onChange={(e) => setSalonCity(e.target.value)}
                  placeholder="ej. Medellín, Bogotá, Cali, Barranquilla, Envigado"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Dirección Física (Opcional)</label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  placeholder="ej. Calle 10 # 43E-22, Barrio El Poblado"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Moneda Principal de tu Negocio</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-bold cursor-pointer"
                >
                  <option value="COP">🇨🇴 COP ($ Pesos Colombianos)</option>
                  <option value="USD">🇺🇸 USD ($ Dólares)</option>
                  <option value="MXN">🇲🇽 MXN ($ Pesos Mexicanos)</option>
                  <option value="EUR">🇪🇺 EUR (€ Euros)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Horarios de Atención</label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="ej. Lun a Sáb: 8:00 AM – 7:00 PM"
                  className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Tip Pro */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-slate-400">
              <span>✨ Podrás modificar cualquiera de estos datos en cualquier momento desde tu panel de Ajustes.</span>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!salonName.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF5A36] to-orange-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF5A36]/30 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                <span>Siguiente: Tus Servicios & Precios</span>
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
            {/* Tarjeta Didáctica */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300">
              <Scissors className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block font-bold mb-0.5">💡 ¿Cómo funciona tu Catálogo de Servicios?</strong>
                <span>Cada tratamiento que agregues aquí tendrá su propio botón de agendamiento online. Tus clientas podrán ver la duración, el precio exacto y las fotos de muestra.</span>
              </div>
            </div>

            {/* Formulario Rápido de Servicio */}
            <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                  + Agregar Nuevo Servicio a tu Menú
                </span>
                <span className="text-[10px] text-slate-400">Precios en {currency}</span>
              </div>
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

                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-400">Categoría</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCatOnboarding(!isAddingNewCatOnboarding)}
                      className="text-[10px] font-bold text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{isAddingNewCatOnboarding ? 'Cerrar' : '+ Nueva'}</span>
                    </button>
                  </div>
                  <select
                    value={tempServiceCategory}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsAddingNewCatOnboarding(true);
                      } else {
                        setTempServiceCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs font-semibold"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                    <option value="__NEW__">➕ + Crear Otra Categoría...</option>
                  </select>

                  {/* Mini-panel creación rápida en Onboarding */}
                  {isAddingNewCatOnboarding && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 p-2.5 rounded-xl border border-orange-500/40 bg-[#0E121B] shadow-xl space-y-1.5">
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newCatIconOnboarding}
                          onChange={(e) => setNewCatIconOnboarding(e.target.value)}
                          placeholder="🎨"
                          className="w-8 text-center bg-black/40 border border-white/15 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={newCatNameOnboarding}
                          onChange={(e) => setNewCatNameOnboarding(e.target.value)}
                          placeholder="ej. Pestañas, Masajes"
                          className="flex-1 bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newCatNameOnboarding.trim()) return;
                          const cleanSlug = newCatNameOnboarding.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
                          const iconVal = newCatIconOnboarding.trim() || '✨';
                          const nameVal = newCatNameOnboarding.trim();
                          
                          // Obtener el ID real del salón aislado
                          const activeTid = (tenant?.id && tenant.id !== '00000000-0000-0000-0000-000000000001')
                            ? tenant.id
                            : (ownerEmail && ownerEmail !== 'sofia@studioglamour.co')
                            ? `tenant-${ownerEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
                            : '00000000-0000-0000-0000-000000000001';

                          const newEntry = {
                            id: cleanSlug,
                            name: nameVal,
                            icon: iconVal
                          };
                          setAvailableCategories(prev => [...prev, newEntry]);
                          setTempServiceCategory(cleanSlug);
                          setNewCatNameOnboarding('');
                          setIsAddingNewCatOnboarding(false);

                          // Guardar inmediatamente en Supabase / LocalStorage vinculado al tenant real
                          try {
                            await api.createCategory({
                              tenant_id: activeTid,
                              name: nameVal,
                              slug: cleanSlug,
                              icon: iconVal,
                              description: `Categoría ${nameVal}`
                            });
                          } catch (err) {
                            console.warn('Error saving category:', err);
                          }
                        }}
                        disabled={!newCatNameOnboarding.trim()}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-[10px] font-bold py-1 rounded-md cursor-pointer shadow-sm"
                      >
                        ✓ Crear y Asignar
                      </button>
                    </div>
                  )}
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

                <div className="sm:col-span-2">
                  <ServiceImagePicker
                    value={tempServiceImage}
                    category={tempServiceCategory}
                    onChange={(url) => setTempServiceImage(url)}
                    label="Foto Ilustrativa (Banco de Fotos o Subir Propia)"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1.5">
                  {servicesList.map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {srv.image_url && (
                          <img
                            src={srv.image_url}
                            alt={srv.name}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <strong className="text-white block font-bold truncate">{srv.name}</strong>
                          <span className="text-[11px] text-slate-400">
                            {srv.duration_minutes} min • <span className="text-emerald-400 font-bold">${srv.price.toLocaleString()} {currency}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all shrink-0"
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
            {/* Tarjeta Didáctica */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent border border-purple-500/20 flex items-start gap-3 text-xs text-slate-300">
              <Users className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300 block font-bold mb-0.5">💡 Cero enredos en las quincenas</strong>
                <span>Al registrar a tus estilistas con su % de comisión, el sistema calculará automáticamente sus pagos al cobrar cada cita en recepción. Además, cada colaboradora tendrá su propia App móvil para ver sus turnos del día.</span>
              </div>
            </div>

            {/* Formulario Rápido de Colaborador */}
            <form onSubmit={handleAddStylist} className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                  + Agregar Colaboradora / Estilista a tu Equipo
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">✨ No se requiere correo electrónico</span>
              </div>
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

                {/* WhatsApp con prefijo fijo +57 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">WhatsApp de la Colaboradora *</label>
                  <div className="flex items-center rounded-xl bg-[#121624] border border-white/15 focus-within:border-purple-400 overflow-hidden">
                    <span className="px-3 py-2.5 bg-white/5 border-r border-white/10 text-white font-bold text-xs shrink-0 flex items-center gap-1">
                      🇨🇴 +57
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={tempStylistPhoneRaw}
                      onChange={(e) => setTempStylistPhoneRaw(e.target.value.replace(/\D/g, ''))}
                      placeholder="3120000000 (10 dígitos)"
                      className="w-full bg-transparent px-3 py-2.5 text-white focus:outline-none text-xs font-semibold placeholder-slate-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Solo escribe los 10 números de su celular</span>
                </div>

                {/* Selección Múltiple de Especialidades / Categorías */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span>Especialidad / Categorías que atiende *</span>
                    <span className="text-[10px] text-purple-400 font-normal">Selecciona una o varias</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCategories.map((cat) => {
                      const isSelected = tempStylistCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-sm shadow-purple-500/20'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {cat.icon} {cat.name} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
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
                    <span className="text-[11px] text-slate-400">Directora & Gestión General • Solo administración</span>
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
            PASO 4: CONEXIÓN WHATSAPP IA & FINALIZACIÓN
            ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Tarjeta Didáctica */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-start gap-3 text-xs text-slate-300">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 block font-bold mb-0.5">🎉 ¡Todo listo para comenzar a operar!</strong>
                <span>Hemos organizado tu catálogo y tu equipo. Opcionalmente puedes asignarle un nombre a tu asistente virtual de WhatsApp para recordatorios automáticos.</span>
              </div>
            </div>

            {/* Resumen Visual del Salón Configurado */}
            <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                📋 Resumen de tu Plataforma Lista:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block">🏢 Salón Configurado</span>
                  <strong className="text-white font-bold block truncate">{salonName}</strong>
                  <span className="text-[10px] text-emerald-400 font-semibold">{salonCity} ({currency})</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block">✂️ Menú de Servicios</span>
                  <strong className="text-white font-bold block">{servicesList.length} Tratamientos</strong>
                  <span className="text-[10px] text-cyan-300 font-semibold">Listos con fotos y precios</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <span className="text-slate-400 text-[10px] block">👥 Equipo de Trabajo</span>
                  <strong className="text-white font-bold block">{stylistsList.length + 1} Profesionales</strong>
                  <span className="text-[10px] text-purple-300 font-semibold">Con agendas y comisiones</span>
                </div>
              </div>
            </div>

            {/* Configuración Opcional del Asistente */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>🤖 Asistente Virtual de WhatsApp (Opcional)</span>
                <span className="text-[10px] text-slate-400">Puedes configurarlo ahora o después</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp del Negocio</span>
                  </label>
                  <input
                    type="text"
                    value={waPhoneNumber}
                    onChange={(e) => setWaPhoneNumber(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    Nombre del Asistente Virtual
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Flowy"
                    className="w-full bg-[#121624] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 text-xs font-semibold"
                  />
                </div>
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
                  Omitir IA y Finalizar
                </button>

                {/* Botón Guardar con WhatsApp */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveAndFinish(false)}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-[#FF5A36] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Guardando Plataforma...' : '✨ Abrir Mi Dashboard'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
