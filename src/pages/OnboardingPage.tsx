import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Building2,
  Phone,
  MapPin,
  DollarSign,
  Bot,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Clock,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Star,
  Layers,
  Flame,
  Heart,
  Palette,
  Smile
} from 'lucide-react';
import { api } from '../lib/supabase';

export type BusinessType = 
  | 'salon' 
  | 'alisados' 
  | 'nails' 
  | 'cejas_pestanas' 
  | 'barber' 
  | 'spa' 
  | 'corporal' 
  | 'maquillaje';

interface ServiceTemplate {
  id: string;
  name: string;
  businessType: BusinessType;
  category: 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa';
  duration_minutes: number;
  price_cop: number;
  base_price_cop: number;
  selected: boolean;
}

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // STEP 1: BUSINESS BASICS
  const [businessName, setBusinessName] = useState('');
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>(['salon', 'nails']);
  const [city, setCity] = useState('Medellín');
  const [country, setCountry] = useState('Colombia');
  const [address, setAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>('COP');

  // STEP 2: PRICING TIER & COP TEMPLATES
  const [pricingTier, setPricingTier] = useState<'express' | 'estandar' | 'luxury'>('estandar');

  const defaultTemplates: Record<BusinessType, Omit<ServiceTemplate, 'price_cop'>[]> = {
    salon: [
      { id: 'srv-bal', name: 'Balayage Rubio Cenizo + Olaplex & Matiz', businessType: 'salon', category: 'color', duration_minutes: 120, base_price_cop: 280000, selected: true },
      { id: 'srv-cor', name: 'Corte Bob / En Capas + Brushing de Salón', businessType: 'salon', category: 'corte', duration_minutes: 45, base_price_cop: 65000, selected: true },
      { id: 'srv-bab', name: 'Mechas Babylights Micro-tejidas + Baño de Brillo', businessType: 'salon', category: 'color', duration_minutes: 150, base_price_cop: 320000, selected: true },
      { id: 'srv-tin', name: 'Tinte Completo + Baño de Brillo Gloss', businessType: 'salon', category: 'color', duration_minutes: 75, base_price_cop: 140000, selected: true },
      { id: 'srv-hid', name: 'Hidratación Profunda con Ácido Hialurónico & Masaje', businessType: 'salon', category: 'keratina', duration_minutes: 60, base_price_cop: 110000, selected: true }
    ],
    alisados: [
      { id: 'srv-nan', name: 'Nanoplastia Capilar Orgánica (Liso Espejo)', businessType: 'alisados', category: 'keratina', duration_minutes: 120, base_price_cop: 260000, selected: true },
      { id: 'srv-ker2', name: 'Keratina Vegana Antifrizz Termoactiva', businessType: 'alisados', category: 'keratina', duration_minutes: 90, base_price_cop: 220000, selected: true },
      { id: 'srv-bot', name: 'Botox Capilar Rejuvenecedor + Sellado de Puntas', businessType: 'alisados', category: 'keratina', duration_minutes: 75, base_price_cop: 160000, selected: true },
      { id: 'srv-cir', name: 'Cirugía Capilar Restauradora para Cabello Procesado', businessType: 'alisados', category: 'keratina', duration_minutes: 90, base_price_cop: 190000, selected: true },
      { id: 'srv-det', name: 'Detox Capilar Profundo + Exfoliación de Cuero Cabelludo', businessType: 'alisados', category: 'keratina', duration_minutes: 50, base_price_cop: 95000, selected: true }
    ],
    nails: [
      { id: 'srv-pol', name: 'Uñas Esculpidas en Poligel + Esmaltado Semipermanente', businessType: 'nails', category: 'nails', duration_minutes: 75, base_price_cop: 110000, selected: true },
      { id: 'srv-rus', name: 'Manicura Rusa Combinada + Nivelación Rubber Base', businessType: 'nails', category: 'nails', duration_minutes: 60, base_price_cop: 55000, selected: true },
      { id: 'srv-ped', name: 'Pedicura Spa con Hidratación Profunda & Exfoliación', businessType: 'nails', category: 'nails', duration_minutes: 50, base_price_cop: 45000, selected: true },
      { id: 'srv-ret', name: 'Retiro Profesional de Acrílico / Poligel con Cuidado', businessType: 'nails', category: 'nails', duration_minutes: 30, base_price_cop: 25000, selected: true },
      { id: 'srv-sof', name: 'Extensión de Uñas en Soft Gel + Nail Art Básico', businessType: 'nails', category: 'nails', duration_minutes: 70, base_price_cop: 95000, selected: true }
    ],
    cejas_pestanas: [
      { id: 'srv-lif', name: 'Lifting de Pestañas con Tinte & Tratamiento Keratina', businessType: 'cejas_pestanas', category: 'spa', duration_minutes: 60, base_price_cop: 80000, selected: true },
      { id: 'srv-ext', name: 'Extensiones de Pestañas Pelo a Pelo (Efecto Clásico)', businessType: 'cejas_pestanas', category: 'spa', duration_minutes: 90, base_price_cop: 120000, selected: true },
      { id: 'srv-vol', name: 'Extensiones Volumen Ruso 3D/5D Espectacular', businessType: 'cejas_pestanas', category: 'spa', duration_minutes: 110, base_price_cop: 160000, selected: true },
      { id: 'srv-lam', name: 'Laminado de Cejas HD + Diseño con Henna / Tinte', businessType: 'cejas_pestanas', category: 'spa', duration_minutes: 50, base_price_cop: 70000, selected: true },
      { id: 'srv-mic', name: 'Microblading / Shading de Cejas Pelo a Pelo', businessType: 'cejas_pestanas', category: 'spa', duration_minutes: 120, base_price_cop: 350000, selected: true }
    ],
    barber: [
      { id: 'srv-fad', name: 'Fade Clásico Degradado + Lavado & Peinado Pompadour', businessType: 'barber', category: 'barberia', duration_minutes: 45, base_price_cop: 35000, selected: true },
      { id: 'srv-bar', name: 'Ritual de Barba con Toalla Caliente, Aceite & Navaja', businessType: 'barber', category: 'barberia', duration_minutes: 30, base_price_cop: 25000, selected: true },
      { id: 'srv-eje', name: 'Combo Premium: Corte Ejecutivo + Perfilado de Barba', businessType: 'barber', category: 'barberia', duration_minutes: 60, base_price_cop: 50000, selected: true },
      { id: 'srv-mas', name: 'Black Mask Facial Purificante + Exfoliación', businessType: 'barber', category: 'spa', duration_minutes: 30, base_price_cop: 30000, selected: true },
      { id: 'srv-can', name: 'Camuflaje de Canas Rejuvenecedor / Tinte de Barba', businessType: 'barber', category: 'barberia', duration_minutes: 30, base_price_cop: 35000, selected: true }
    ],
    spa: [
      { id: 'srv-rel', name: 'Masaje Relajante con Aromaterapia & Piedras Calientes', businessType: 'spa', category: 'spa', duration_minutes: 60, base_price_cop: 120000, selected: true },
      { id: 'srv-fac', name: 'Limpieza Facial Profunda + Peeling Ultrasónico', businessType: 'spa', category: 'spa', duration_minutes: 75, base_price_cop: 130000, selected: true },
      { id: 'srv-des', name: 'Masaje Terapéutico Descontracturante de Espalda', businessType: 'spa', category: 'spa', duration_minutes: 50, base_price_cop: 110000, selected: true },
      { id: 'srv-hid2', name: 'Circuito de Hidroterapia & Mascarilla Corporal Completa', businessType: 'spa', category: 'spa', duration_minutes: 90, base_price_cop: 190000, selected: true }
    ],
    corporal: [
      { id: 'srv-mad', name: 'Maderoterapia Reductora & Moldeo de Cintura (Sesión)', businessType: 'corporal', category: 'spa', duration_minutes: 50, base_price_cop: 85000, selected: true },
      { id: 'srv-dre', name: 'Drenaje Linfático Manual Post-Quirúrgico', businessType: 'corporal', category: 'spa', duration_minutes: 50, base_price_cop: 95000, selected: true },
      { id: 'srv-cav', name: 'Sesión Combinada: Cavitación + Radiofrecuencia Corporal', businessType: 'corporal', category: 'spa', duration_minutes: 60, base_price_cop: 120000, selected: true },
      { id: 'srv-vac', name: 'Masaje Anticelulítico con Vacumterapia & Termoterapia', businessType: 'corporal', category: 'spa', duration_minutes: 50, base_price_cop: 90000, selected: true }
    ],
    maquillaje: [
      { id: 'srv-nov', name: 'Paquete Novia Radiante: Maquillaje Blindado + Prueba Previa', businessType: 'maquillaje', category: 'corte', duration_minutes: 120, base_price_cop: 320000, selected: true },
      { id: 'srv-soc', name: 'Maquillaje Social de Noche con Pestañas Postizas', businessType: 'maquillaje', category: 'corte', duration_minutes: 60, base_price_cop: 130000, selected: true },
      { id: 'srv-ond', name: 'Peinado Social con Ondas Glamour Hollywood / Brushing', businessType: 'maquillaje', category: 'corte', duration_minutes: 50, base_price_cop: 85000, selected: true },
      { id: 'srv-rec', name: 'Peinado Recogido Elegante de Gala / Quinceañera', businessType: 'maquillaje', category: 'corte', duration_minutes: 60, base_price_cop: 110000, selected: true }
    ]
  };

  const getMultiplier = (tier: 'express' | 'estandar' | 'luxury') => {
    if (tier === 'express') return 0.75;
    if (tier === 'luxury') return 1.45;
    return 1.0;
  };

  // Helper to compile services from all active business types
  const getCombinedServices = (types: BusinessType[], tier: 'express' | 'estandar' | 'luxury') => {
    const list: ServiceTemplate[] = [];
    const multiplier = getMultiplier(tier);
    types.forEach(t => {
      if (defaultTemplates[t]) {
        defaultTemplates[t].forEach(srv => {
          list.push({
            ...srv,
            price_cop: Math.round((srv.base_price_cop * multiplier) / 1000) * 1000
          });
        });
      }
    });
    return list;
  };

  const [servicesList, setServicesList] = useState<ServiceTemplate[]>(getCombinedServices(['salon', 'nails'], 'estandar'));

  const handleToggleBusinessType = (type: BusinessType) => {
    let updatedTypes: BusinessType[];
    if (businessTypes.includes(type)) {
      if (businessTypes.length === 1) return; // Must have at least 1
      updatedTypes = businessTypes.filter(t => t !== type);
    } else {
      updatedTypes = [...businessTypes, type];
    }
    setBusinessTypes(updatedTypes);
    setServicesList(getCombinedServices(updatedTypes, pricingTier));
  };

  const handlePricingTierChange = (tier: 'express' | 'estandar' | 'luxury') => {
    setPricingTier(tier);
    setServicesList(getCombinedServices(businessTypes, tier));
  };

  // STEP 3: AI ASSISTANT SETTINGS & WEEKLY SCHEDULE
  const [agentName, setAgentName] = useState('Lumi');
  const [personalityTone, setPersonalityTone] = useState<'elegante_calido' | 'cercano_juvenil' | 'profesional_formal'>('elegante_calido');
  const [cancellationHours, setCancellationHours] = useState(4);

  interface DaySchedule {
    day: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
    label: string;
    shortLabel: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }

  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
    { day: 'lunes', label: 'Lunes', shortLabel: 'Lun', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'martes', label: 'Martes', shortLabel: 'Mar', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'miercoles', label: 'Miércoles', shortLabel: 'Mié', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'jueves', label: 'Jueves', shortLabel: 'Jue', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'viernes', label: 'Viernes', shortLabel: 'Vie', isOpen: true, openTime: '08:00', closeTime: '20:00' },
    { day: 'sabado', label: 'Sábado', shortLabel: 'Sáb', isOpen: true, openTime: '08:00', closeTime: '21:00' },
    { day: 'domingo', label: 'Domingo', shortLabel: 'Dom', isOpen: false, openTime: '09:00', closeTime: '15:00' }
  ]);

  const applySchedulePreset = (preset: 'standard' | 'barber' | 'all_week') => {
    if (preset === 'standard') {
      setWeeklySchedule([
        { day: 'lunes', label: 'Lunes', shortLabel: 'Lun', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'martes', label: 'Martes', shortLabel: 'Mar', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'miercoles', label: 'Miércoles', shortLabel: 'Mié', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'jueves', label: 'Jueves', shortLabel: 'Jue', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'viernes', label: 'Viernes', shortLabel: 'Vie', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'sabado', label: 'Sábado', shortLabel: 'Sáb', isOpen: true, openTime: '08:00', closeTime: '21:00' },
        { day: 'domingo', label: 'Domingo', shortLabel: 'Dom', isOpen: false, openTime: '09:00', closeTime: '15:00' }
      ]);
    } else if (preset === 'barber') {
      setWeeklySchedule([
        { day: 'lunes', label: 'Lunes', shortLabel: 'Lun', isOpen: false, openTime: '09:00', closeTime: '20:00' },
        { day: 'martes', label: 'Martes', shortLabel: 'Mar', isOpen: true, openTime: '09:00', closeTime: '21:00' },
        { day: 'miercoles', label: 'Miércoles', shortLabel: 'Mié', isOpen: true, openTime: '09:00', closeTime: '21:00' },
        { day: 'jueves', label: 'Jueves', shortLabel: 'Jue', isOpen: true, openTime: '09:00', closeTime: '21:00' },
        { day: 'viernes', label: 'Viernes', shortLabel: 'Vie', isOpen: true, openTime: '09:00', closeTime: '21:00' },
        { day: 'sabado', label: 'Sábado', shortLabel: 'Sáb', isOpen: true, openTime: '08:30', closeTime: '21:30' },
        { day: 'domingo', label: 'Domingo', shortLabel: 'Dom', isOpen: true, openTime: '09:00', closeTime: '16:00' }
      ]);
    } else if (preset === 'all_week') {
      setWeeklySchedule([
        { day: 'lunes', label: 'Lunes', shortLabel: 'Lun', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'martes', label: 'Martes', shortLabel: 'Mar', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'miercoles', label: 'Miércoles', shortLabel: 'Mié', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'jueves', label: 'Jueves', shortLabel: 'Jue', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'viernes', label: 'Viernes', shortLabel: 'Vie', isOpen: true, openTime: '08:00', closeTime: '20:00' },
        { day: 'sabado', label: 'Sábado', shortLabel: 'Sáb', isOpen: true, openTime: '08:00', closeTime: '21:00' },
        { day: 'domingo', label: 'Domingo', shortLabel: 'Dom', isOpen: true, openTime: '09:00', closeTime: '17:00' }
      ]);
    }
  };

  const copyFirstDayScheduleToAll = () => {
    const firstOpenDay = weeklySchedule.find(d => d.isOpen);
    if (!firstOpenDay) return;
    const updated = weeklySchedule.map(d => {
      if (d.isOpen) {
        return { ...d, openTime: firstOpenDay.openTime, closeTime: firstOpenDay.closeTime };
      }
      return d;
    });
    setWeeklySchedule(updated);
  };

  const getFormattedScheduleSummary = () => {
    return weeklySchedule.map(d => `${d.shortLabel}: ${d.isOpen ? `${d.openTime} - ${d.closeTime}` : 'Cerrado'}`).join(' | ');
  };

  // STEP 4: OWNER CREDENTIALS
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerAttendsClients, setOwnerAttendsClients] = useState(true);
  const [ownerSpecialty, setOwnerSpecialty] = useState('Dueña & Especialista Principal');

  const businessSlug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'mi-salon';
  const siteOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://belleza2027.netlify.app';
  const publicBookingUrl = `${siteOrigin}/reservas?salon=${businessSlug}`;

  // SUBMIT & CREATE TENANT EN SUPABASE CON AUTENTICACIÓN
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filtrar servicios seleccionados
      const activeServices = servicesList
        .filter(s => s.selected)
        .map(s => ({
          name: s.name,
          category: s.category,
          duration_minutes: s.duration_minutes,
          price: s.price_cop,
          price_usd: s.price_cop,
          price_cop: s.price_cop,
          description: `${s.name} profesional`
        }));

      await api.registerBusiness({
        tenant: {
          name: businessName,
          slug: businessSlug,
          phone: businessPhone,
          whatsapp_number: businessPhone,
          currency: currency || 'COP',
          address: address.trim() ? (city ? `${address.trim()}, ${city}` : address.trim()) : (city || ''),
          city,
          country,
          business_hours: {
            summary: getFormattedScheduleSummary(),
            schedule: weeklySchedule
          }
        },
        owner: {
          name: ownerName,
          email: ownerEmail,
          password: ownerPassword,
          phone: ownerPhone,
          role: 'admin',
          is_owner: true,
          attends_clients: ownerAttendsClients,
          specialty: ownerSpecialty
        },
        services: activeServices,
        aiSettings: {
          agent_name: agentName,
          personality_tone: personalityTone,
          system_prompt_custom: `Eres ${agentName}, el asistente oficial de ${businessName}. Tu misión es saludar cordialmente, cotizar servicios y agendar citas por WhatsApp con calidez y elegancia. Horario de atención: ${getFormattedScheduleSummary()}. Política de cancelación: Mínimo ${cancellationHours} horas de anticipación.`,
          weekly_schedule: weeklySchedule,
          cancellation_notice_hours: cancellationHours
        }
      });

      setTimeout(() => {
        setLoading(false);
        setCurrentStep(5);
      }, 800);
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      setCurrentStep(5);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicBookingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090B10] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-lg shadow-[#FF5A36]/30">
            <Scissors className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            BeautyFlow<span className="text-[#FF5A36]">.AI</span>
          </span>
        </Link>

        {currentStep < 5 && (
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <span>Paso {currentStep} de 4</span>
            <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5A36] to-pink-500 transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* MAIN WIZARD CARD */}
      <main className="max-w-3xl w-full mx-auto my-auto py-6 z-10">
        <div className="bg-[#141926]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">

          {/* =========================================================================
              PASO 1: IDENTIDAD DEL NEGOCIO
              ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A36]">PASO 1: TU SALÓN O ESTABLECIMIENTO</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  ¿Cómo se llama tu negocio?
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Configuraremos tu catálogo, tu asistente de WhatsApp y tu enlace de reservas online.
                </p>
              </div>

              {/* Selector de Especialidades / Tipo de Negocio */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    ¿Qué servicios ofrece tu negocio?
                  </label>
                  <span className="text-[10px] text-[#FF5A36] font-bold bg-[#FF5A36]/10 px-2 py-0.5 rounded-full">
                    Puedes seleccionar varios
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'salon', label: 'Cabello & Color', icon: Scissors, desc: 'Balayage, tintes y cortes' },
                    { id: 'alisados', label: 'Alisados & Keratinas', icon: Flame, desc: 'Nanoplastia y botox capilar' },
                    { id: 'nails', label: 'Uñas & Nails Bar', icon: Sparkles, desc: 'Poligel, semi y manicura rusa' },
                    { id: 'cejas_pestanas', label: 'Cejas & Pestañas', icon: Eye, desc: 'Lash lifting y microblading' },
                    { id: 'barber', label: 'Barbería Masculina', icon: Store, desc: 'Fade, barba y rituales' },
                    { id: 'spa', label: 'Spa & Masajes', icon: Layers, desc: 'Relajantes y faciales' },
                    { id: 'corporal', label: 'Moldeo Corporal', icon: Heart, desc: 'Maderoterapia y drenajes' },
                    { id: 'maquillaje', label: 'Maquillaje & Novias', icon: Palette, desc: 'Social, novias y peinados' }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = businessTypes.includes(item.id as any);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleBusinessType(item.id as any)}
                        className={`p-3 sm:p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                          isSelected
                            ? 'border-[#FF5A36] bg-[#FF5A36]/10 ring-1 ring-[#FF5A36]'
                            : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-[#FF5A36] text-white' : 'bg-white/5 text-slate-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#FF5A36]" />
                          )}
                        </div>
                        <div>
                          <strong className="text-xs font-bold block">{item.label}</strong>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formulario de Datos */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nombre Comercial del Salón *</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Lumina Studio Beauty"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-sm font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">WhatsApp del Negocio (10 dígitos) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="3101234567"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-[#FF5A36]"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Aquí responderá tu Agente IA</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Moneda Principal</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36]"
                    >
                      <option value="USD">Dólares ($ USD)</option>
                      <option value="COP">Pesos Colombianos ($ COP)</option>
                      <option value="MXN">Pesos Mexicanos ($ MXN)</option>
                      <option value="EUR">Euros (€ EUR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Ciudad & País</label>
                    <input
                      type="text"
                      value={`${city}, ${country}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setCity(parts[0]?.trim() || '');
                        if (parts[1]) setCountry(parts[1].trim());
                      }}
                      placeholder="Medellín, Colombia"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Dirección Física</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle 10 # 43E-22"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36]"
                    />
                  </div>
                </div>
              </div>

              {/* Botón Siguiente */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!businessName.trim() || !businessPhone.trim()) {
                      alert('Por favor ingresa el nombre y WhatsApp de tu negocio');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-[#FF5A36]/30 flex items-center gap-2 text-sm transition-all"
                >
                  <span>Continuar a Servicios</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PASO 2: PLANTILLA DE SERVICIOS
              ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A36]">PASO 2: CATÁLOGO EN PESOS COLOMBIANOS (COP)</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Plantilla de Servicios & Precios COP
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Hemos precargado los servicios más rentables para <strong className="text-white">{businessName}</strong>. Elige el nivel de precios de tu salón para autocalcular las tarifas.
                </p>
                <div className="mt-2.5 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px]">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#FF5A36]" />
                  <span>
                    💡 <strong>100% Personalizable:</strong> Todos estos servicios, precios y tiempos los podrás <strong>editar, eliminar y crear nuevos</strong> en cualquier momento desde el panel de administración de tu negocio.
                  </span>
                </div>
              </div>

              {/* Selector de Nivel de Salón (Pricing Tier) */}
              <div className="p-3.5 rounded-2xl bg-[#0E121B] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Nivel de Precios del Salón:</span>
                  <span className="text-[10px] text-[#FF5A36] font-bold">Ajusta todas las tarifas en 1 clic</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'express', label: '🟢 Express / Barrio', desc: 'Tarifas económicas y ágiles' },
                    { id: 'estandar', label: '🟡 Estudio Pro', desc: 'Tarifas estándar de mercado' },
                    { id: 'luxury', label: '🟣 Boutique Lujo', desc: 'Tarifas premium y alta gama' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handlePricingTierChange(tier.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        pricingTier === tier.id
                          ? 'border-[#FF5A36] bg-[#FF5A36]/15 ring-1 ring-[#FF5A36]'
                          : 'border-white/10 bg-[#141926] hover:border-white/20'
                      }`}
                    >
                      <strong className="text-xs font-bold block text-white">{tier.label}</strong>
                      <span className="text-[10px] text-slate-400 block truncate">{tier.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Listado de Servicios Agrupados por Especialidad Elegida */}
              <div className="space-y-6">
                {businessTypes.map((bType) => {
                  const meta: Record<BusinessType, { title: string; icon: any; badge: string }> = {
                    salon: { title: 'Peluquería & Colorimetría', icon: Scissors, badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
                    alisados: { title: 'Alisados & Terapias Capilares', icon: Flame, badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
                    nails: { title: 'Uñas & Nails Bar', icon: Sparkles, badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                    cejas_pestanas: { title: 'Cejas & Pestañas (Lash Studio)', icon: Eye, badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                    barber: { title: 'Barbería & Grooming Masculino', icon: Store, badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
                    spa: { title: 'Spa & Masajes Relajantes', icon: Layers, badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                    corporal: { title: 'Estética & Moldeo Corporal', icon: Heart, badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                    maquillaje: { title: 'Maquillaje Profesional & Novias', icon: Palette, badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' }
                  };
                  const currentMeta = meta[bType];
                  const Icon = currentMeta.icon;
                  const typeServices = servicesList.filter(s => s.businessType === bType);

                  return (
                    <div key={bType} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${currentMeta.badge} border`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="text-sm font-bold text-white">{currentMeta.title}</h3>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {typeServices.filter(s => s.selected).length} de {typeServices.length} activos
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {typeServices.map((srv) => {
                          const originalIdx = servicesList.findIndex(s => s.id === srv.id);
                          return (
                            <div
                              key={srv.id}
                              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                                srv.selected ? 'bg-[#0E121B] border-white/15' : 'bg-white/[0.02] border-white/5 opacity-50'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={srv.selected}
                                  onChange={(e) => {
                                    const updated = [...servicesList];
                                    if (originalIdx !== -1) {
                                      updated[originalIdx].selected = e.target.checked;
                                      setServicesList(updated);
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-[#FF5A36] focus:ring-[#FF5A36] bg-transparent border-white/20"
                                />
                                <div className="min-w-0 flex-1">
                                  <input
                                    type="text"
                                    value={srv.name}
                                    onChange={(e) => {
                                      const updated = [...servicesList];
                                      if (originalIdx !== -1) {
                                        updated[originalIdx].name = e.target.value;
                                        setServicesList(updated);
                                      }
                                    }}
                                    className="bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none w-full truncate"
                                  />
                                  <span className="text-[11px] text-slate-400 block mt-0.5">{srv.duration_minutes} min de duración</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="relative w-28 sm:w-32">
                                  <span className="absolute left-2.5 top-2 text-xs font-bold text-[#FF5A36]">$</span>
                                  <input
                                    type="number"
                                    step={1000}
                                    value={srv.price_cop}
                                    onChange={(e) => {
                                      const updated = [...servicesList];
                                      if (originalIdx !== -1) {
                                        updated[originalIdx].price_cop = Number(e.target.value);
                                        setServicesList(updated);
                                      }
                                    }}
                                    className="w-full bg-[#141926] border border-white/10 rounded-xl pl-6 pr-2 py-1.5 text-xs font-mono font-bold text-right text-white focus:outline-none focus:border-[#FF5A36]"
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">COP</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botones de Navegación */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-[#FF5A36]/30 flex items-center gap-2 text-sm transition-all"
                >
                  <span>Configurar Asistente IA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PASO 3: PERSONALIDAD DEL AGENTE IA
              ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A36]">PASO 3: TU ASISTENTE VIRTUAL</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Personaliza tu Agente de WhatsApp
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tu asistente atenderá clientes 24/7, compartirá tarifas y agendará citas de forma 100% autónoma.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nombre del Asistente Virtual *</label>
                  <div className="relative">
                    <Bot className="absolute left-3 top-3 w-4 h-4 text-[#FF5A36]" />
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Ej. Lumi, Flowy, Valeria"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#FF5A36]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-2">Tono de Voz y Personalidad:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'elegante_calido', label: 'Elegante & Cálido', desc: 'Trato exclusivo, educado y acogedor' },
                      { id: 'cercano_juvenil', label: 'Cercano & Juvenil', desc: 'Fresco, dinámico y con emojis' },
                      { id: 'profesional_formal', label: 'Profesional & Directo', desc: 'Respuestas ejecutivas y precisas' }
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setPersonalityTone(tone.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          personalityTone === tone.id
                            ? 'border-[#FF5A36] bg-[#FF5A36]/10 ring-1 ring-[#FF5A36]'
                            : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                        }`}
                      >
                        <strong className="text-xs font-bold block">{tone.label}</strong>
                        <span className="text-[10px] text-slate-400">{tone.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configurador de Horario Semanal Día por Día (UI de Lujo) */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#0E121B] border border-white/10 shadow-2xl space-y-4">
                  {/* Encabezado y Presets */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#FF5A36]/15 border border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
                          <Clock className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-white text-sm tracking-tight">Horario de Atención Semanal</h3>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          🟢 {weeklySchedule.filter(d => d.isOpen).length} de 7 días activos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Establece las horas de apertura y cierre para que tu Agente IA y el Portal Web agenden citas en horas válidas.
                      </p>
                    </div>

                    {/* Presets Rápidos */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-semibold">Plantillas:</span>
                      <button
                        type="button"
                        onClick={() => applySchedulePreset('standard')}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-[#FF5A36]/15 hover:border-[#FF5A36]/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        ⚡ Lun - Sáb
                      </button>
                      <button
                        type="button"
                        onClick={() => applySchedulePreset('barber')}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-[#FF5A36]/15 hover:border-[#FF5A36]/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        💈 Mar - Dom
                      </button>
                      <button
                        type="button"
                        onClick={() => applySchedulePreset('all_week')}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-[#FF5A36]/15 hover:border-[#FF5A36]/40 border border-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all shadow-sm"
                      >
                        🌟 Lun - Dom
                      </button>
                    </div>
                  </div>

                  {/* Lista de los 7 Días */}
                  <div className="space-y-2">
                    {weeklySchedule.map((dayItem, dIdx) => (
                      <div
                        key={dayItem.day}
                        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          dayItem.isOpen
                            ? 'bg-[#141926]/90 border-white/15 shadow-sm'
                            : 'bg-white/[0.01] border-white/5 opacity-50'
                        }`}
                      >
                        {/* Identificador del Día + Toggle Switch */}
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <div className="flex items-center gap-2.5">
                            {/* Avatar del Día */}
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs transition-all ${
                              dayItem.isOpen
                                ? 'bg-gradient-to-br from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/20'
                                : 'bg-white/5 text-slate-500 border border-white/5'
                            }`}>
                              {dayItem.shortLabel}
                            </div>
                            <div>
                              <strong className="text-xs font-bold block text-white">{dayItem.label}</strong>
                              <span className={`text-[10px] font-semibold ${dayItem.isOpen ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {dayItem.isOpen ? 'Atención Abierta' : 'Día de Descanso'}
                              </span>
                            </div>
                          </div>

                          {/* Tactile Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...weeklySchedule];
                              updated[dIdx].isOpen = !updated[dIdx].isOpen;
                              setWeeklySchedule(updated);
                            }}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                              dayItem.isOpen ? 'bg-[#FF5A36]' : 'bg-white/10'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform transform ${
                              dayItem.isOpen ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>

                        {/* Selectores de Horas */}
                        {dayItem.isOpen ? (
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <div className="flex items-center gap-1.5 bg-[#0E121B] border border-white/10 rounded-xl px-2.5 py-1.5 focus-within:border-[#FF5A36] transition-all">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Abre:</span>
                              <input
                                type="time"
                                value={dayItem.openTime}
                                onChange={(e) => {
                                  const updated = [...weeklySchedule];
                                  updated[dIdx].openTime = e.target.value;
                                  setWeeklySchedule(updated);
                                }}
                                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none w-20"
                              />
                            </div>

                            <span className="text-slate-500 font-bold text-xs">➔</span>

                            <div className="flex items-center gap-1.5 bg-[#0E121B] border border-white/10 rounded-xl px-2.5 py-1.5 focus-within:border-[#FF5A36] transition-all">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Cierra:</span>
                              <input
                                type="time"
                                value={dayItem.closeTime}
                                onChange={(e) => {
                                  const updated = [...weeklySchedule];
                                  updated[dIdx].closeTime = e.target.value;
                                  setWeeklySchedule(updated);
                                }}
                                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none w-20"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="self-end sm:self-center">
                            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 inline-flex items-center gap-1.5">
                              <span>🚫</span> Cerrado al público
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Acciones Rápidas & Resumen IA */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={copyFirstDayScheduleToAll}
                      className="text-[11px] text-[#FF5A36] hover:underline font-bold flex items-center gap-1.5 self-start"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Copiar horas del primer día a todos los días abiertos</span>
                    </button>

                    <div className="text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      🤖 <strong className="text-slate-300">Prompt IA:</strong> Sincronizado automáticamente
                    </div>
                  </div>
                </div>

                {/* Política de Cancelación */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Horas mínimas de anticipación para Cancelar o Reprogramar</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={48}
                      value={cancellationHours}
                      onChange={(e) => setCancellationHours(Number(e.target.value))}
                      className="w-24 bg-[#0E121B] border border-white/10 rounded-xl p-2.5 text-white font-mono text-center focus:outline-none focus:border-[#FF5A36]"
                    />
                    <span className="text-slate-400">horas antes del turno</span>
                  </div>
                </div>
              </div>

              {/* Botones de Navegación */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-[#FF5A36]/30 flex items-center gap-2 text-sm transition-all"
                >
                  <span>Crear Cuenta Dueña</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              PASO 4: CUENTA DE LA ADMINISTRADORA / DUEÑA
              ========================================================================= */}
          {currentStep === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A36]">PASO 4: ACCESO MAESTRO</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  Crea tu Cuenta de Administradora
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Estas serán tus credenciales principales para entrar al Dashboard y gestionar tu negocio.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nombre de la Dueña / Administradora *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Ej. Sofía Restrepo"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#FF5A36]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Correo Electrónico (Login) *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="sofia@luminastudio.co"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-[#FF5A36]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Contraseña Maestra *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres con números y símbolos"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-white font-mono focus:outline-none focus:border-[#FF5A36]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Opción de Rol & Atención de Citas */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block">¿También atiendes clientes en el salón?</strong>
                      <p className="text-[11px] text-slate-400">Si lo activas, aparecerás como especialista disponible en el portal de reservas.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOwnerAttendsClients(!ownerAttendsClients)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        ownerAttendsClients ? 'bg-[#FF5A36] justify-end' : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  {ownerAttendsClients && (
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Tu Especialidad / Título Profesional</label>
                      <input
                        type="text"
                        value={ownerSpecialty}
                        onChange={(e) => setOwnerSpecialty(e.target.value)}
                        placeholder="Ej. Directora & Master Stylist, Barbero Principal, Colorista"
                        className="w-full bg-[#0E121B] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#FF5A36]"
                      />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Tu cuenta de Administradora tiene acceso total al negocio y 14 días de prueba Pro IA.</span>
                </div>
              </div>

              {/* Botones de Envío */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-extrabold px-8 py-3 rounded-full shadow-lg shadow-[#FF5A36]/40 flex items-center gap-2 text-sm transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Creando tu Salón...</span>
                  ) : (
                    <>
                      <span>Lanzar Mi Salón IA</span>
                      <Zap className="w-4 h-4 fill-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              PASO 5: ¡ÉXITO & SALÓN LISTO!
              ========================================================================= */}
          {currentStep === 5 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">¡FELICITACIONES!</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  ¡{businessName} está en Vivo!
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2">
                  Tu base de datos, catálogo de servicios y asistente de IA <strong className="text-white">{agentName}</strong> han sido configurados con éxito.
                </p>
              </div>

              {/* Card de Enlace de Reservas */}
              <div className="p-4 rounded-2xl bg-[#0E121B] border border-white/10 max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Tu Enlace Público de Citas:</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Activo 24/7</span>
                </div>
                <div className="flex items-center gap-2 bg-[#141926] p-2 rounded-xl border border-white/5">
                  <input
                    type="text"
                    readOnly
                    value={publicBookingUrl}
                    className="bg-transparent text-xs font-mono text-[#FF5A36] focus:outline-none flex-1 truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1 transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Botón para entrar al Dashboard */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-extrabold px-8 py-3.5 rounded-full shadow-xl shadow-[#FF5A36]/40 inline-flex items-center gap-2 text-base transition-all transform hover:scale-105"
                >
                  <span>Ir a Mi Dashboard Maestro</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="text-center text-xs text-slate-500 py-2 z-10">
        © 2026 BeautyFlow AI • Plataforma SaaS para Salones de Belleza, Barberías y Spas
      </footer>

    </div>
  );
};

export default OnboardingPage;
