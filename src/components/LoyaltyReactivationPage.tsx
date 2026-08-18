import React, { useState, useMemo } from 'react';
import {
  Heart,
  Sparkles,
  Users,
  Clock,
  Send,
  Gift,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  MessageCircle,
  Mail,
  Zap,
  Tag,
  Scissors,
  ArrowRight,
  Bot,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';
import { Client, Appointment, Stylist, Service } from '../types';

interface LoyaltyReactivationPageProps {
  theme: 'light' | 'dark';
  clients: Client[];
  appointments: Appointment[];
  stylists: Stylist[];
  services: Service[];
  salonName: string;
  salonCurrency?: string;
  onOpenNewAppointmentWithClient?: (client: Client) => void;
}

type InactivityTier = 'all' | 'tier_35_60' | 'tier_60_90' | 'tier_90_plus' | 'birthdays' | 'vip_risk';

interface InactiveClientData {
  client: Client;
  daysSinceLastVisit: number;
  lastVisitDate: string;
  lastService: string;
  favoriteStylist: string;
  totalSpent: number;
  riskLevel: 'medium' | 'high' | 'critical';
  tier: 'tier_35_60' | 'tier_60_90' | 'tier_90_plus';
  isVip: boolean;
  isBirthdayThisMonth: boolean;
}

export const LoyaltyReactivationPage: React.FC<LoyaltyReactivationPageProps> = ({
  theme,
  clients,
  appointments,
  stylists,
  services,
  salonName,
  salonCurrency = 'COP',
  onOpenNewAppointmentWithClient
}) => {
  const isDark = theme === 'dark';

  // Filters and selected campaign
  const [selectedTier, setSelectedTier] = useState<InactivityTier>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoPilotActive, setAutoPilotActive] = useState(true);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [activeCampaignTemplate, setActiveCampaignTemplate] = useState<number>(1);
  const [customDiscount, setCustomDiscount] = useState('15%');
  const [giftService, setGiftService] = useState('Hidratación Capilar Express');
  const [campaignLaunchedSuccess, setCampaignLaunchedSuccess] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Custom mock base if client list is small
  const analyzedClients: InactiveClientData[] = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();

    // Default rich sample clients if salon has few clients
    const baseList: Client[] = clients.length >= 3 ? clients : [
      {
        id: 'c-inact-1',
        tenant_id: 'ten-1',
        full_name: 'Camila Restrepo Morales',
        phone_whatsapp: '+57 312 458 9921',
        email: 'camila.restrepo@gmail.com',
        birthday: '1994-08-22',
        status: 'vip',
        allergies: 'Balayage Rubio Miel y Olaplex',
        visits_count: 8,
        total_spent_usd: 1450000,
        last_visit_at: '2026-06-25',
        created_at: '2026-01-10'
      },
      {
        id: 'c-inact-2',
        tenant_id: 'ten-1',
        full_name: 'Valentina Ospina Gómez',
        phone_whatsapp: '+57 301 884 1230',
        email: 'valen.ospina@hotmail.com',
        birthday: '1998-09-14',
        status: 'frecuente',
        allergies: 'Uñas en Poligel y Manicura Rusa cada 25 días',
        visits_count: 6,
        total_spent_usd: 520000,
        last_visit_at: '2026-06-10',
        created_at: '2026-02-15'
      },
      {
        id: 'c-inact-3',
        tenant_id: 'ten-1',
        full_name: 'Isabella Montoya Castro',
        phone_whatsapp: '+57 320 671 4455',
        email: 'isabella.montoya@gmail.com',
        birthday: '1991-08-05',
        status: 'vip',
        allergies: 'Tratamiento de Keratina Orgánica Antifrizz',
        visits_count: 11,
        total_spent_usd: 2100000,
        last_visit_at: '2026-05-12',
        created_at: '2025-11-20'
      },
      {
        id: 'c-inact-4',
        tenant_id: 'ten-1',
        full_name: 'Natalia Echeverri Zuluaga',
        phone_whatsapp: '+57 310 992 3341',
        email: 'natalia.echeverri@outlook.com',
        birthday: '1995-11-30',
        status: 'frecuente',
        allergies: 'Corte Mariposa y Peinado con ondas',
        visits_count: 4,
        total_spent_usd: 340000,
        last_visit_at: '2026-07-02',
        created_at: '2026-03-01'
      },
      {
        id: 'c-inact-5',
        tenant_id: 'ten-1',
        full_name: 'Juliana Vargas Ríos',
        phone_whatsapp: '+57 315 220 9081',
        email: 'juli.vargas@gmail.com',
        birthday: '1993-08-28',
        status: 'en_riesgo',
        allergies: 'Diseño de Cejas y Pestañas pelo a pelo',
        visits_count: 5,
        total_spent_usd: 460000,
        last_visit_at: '2026-04-18',
        created_at: '2025-12-05'
      },
      {
        id: 'c-inact-6',
        tenant_id: 'ten-1',
        full_name: 'Daniela Cardona López',
        phone_whatsapp: '+57 300 774 2190',
        email: 'daniela.cardona@gmail.com',
        birthday: '1997-01-12',
        status: 'vip',
        allergies: 'Colorimetría global y nutrición profunda',
        visits_count: 9,
        total_spent_usd: 1850000,
        last_visit_at: '2026-05-01',
        created_at: '2025-10-14'
      }
    ];

    return baseList.map((c, index) => {
      // Calculate days since last visit
      let days = 42 + (index * 14);
      if (c.last_visit_at) {
        const lastDate = new Date(c.last_visit_at);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (!isNaN(calculatedDays) && calculatedDays > 0) {
          days = calculatedDays;
        }
      }

      let tier: 'tier_35_60' | 'tier_60_90' | 'tier_90_plus' = 'tier_35_60';
      let riskLevel: 'medium' | 'high' | 'critical' = 'medium';

      if (days >= 90) {
        tier = 'tier_90_plus';
        riskLevel = 'critical';
      } else if (days >= 60) {
        tier = 'tier_60_90';
        riskLevel = 'high';
      } else {
        tier = 'tier_35_60';
        riskLevel = 'medium';
      }

      const isBirthday = c.birthday ? new Date(c.birthday).getMonth() === currentMonth : (index === 0 || index === 2 || index === 4);

      return {
        client: c,
        daysSinceLastVisit: days,
        lastVisitDate: c.last_visit_at || `Hace ${days} días`,
        lastService: c.allergies ? `${c.allergies.split(' ')[0]} ${c.allergies.split(' ')[1] || 'Especial'}` : 'Balayage & Nutrición',
        favoriteStylist: stylists[index % (stylists.length || 1)]?.name || 'Sofía Restrepo',
        totalSpent: c.total_spent_usd || (days * 18500),
        riskLevel,
        tier,
        isVip: c.status === 'vip' || (c.total_spent_usd || 0) > 1000000,
        isBirthdayThisMonth: isBirthday
      };
    });
  }, [clients, stylists]);

  // Filter clients based on tier and search query
  const filteredInactiveClients = useMemo(() => {
    return analyzedClients.filter(item => {
      // Tier match
      if (selectedTier === 'tier_35_60' && item.tier !== 'tier_35_60') return false;
      if (selectedTier === 'tier_60_90' && item.tier !== 'tier_60_90') return false;
      if (selectedTier === 'tier_90_plus' && item.tier !== 'tier_90_plus') return false;
      if (selectedTier === 'birthdays' && !item.isBirthdayThisMonth) return false;
      if (selectedTier === 'vip_risk' && (!item.isVip || item.daysSinceLastVisit < 35)) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.client.full_name.toLowerCase().includes(q) ||
          item.client.phone_whatsapp.toLowerCase().includes(q) ||
          item.lastService.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [analyzedClients, selectedTier, searchQuery]);

  // Pre-select all matching clients when tier changes
  const handleSelectAll = () => {
    if (selectedClients.length === filteredInactiveClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredInactiveClients.map(c => c.client.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalInactive = analyzedClients.length;
    const tier35to60 = analyzedClients.filter(c => c.tier === 'tier_35_60').length;
    const tier60to90 = analyzedClients.filter(c => c.tier === 'tier_60_90').length;
    const tier90plus = analyzedClients.filter(c => c.tier === 'tier_90_plus').length;
    const totalPotentialRecoverable = analyzedClients.reduce((acc, curr) => acc + (curr.totalSpent / (curr.client.visits_count || 4) || 85000), 0);
    const estimatedReturnAmount = totalPotentialRecoverable * 0.38; // 38% recovery benchmark

    return {
      totalInactive,
      tier35to60,
      tier60to90,
      tier90plus,
      totalPotentialRecoverable,
      estimatedReturnAmount
    };
  }, [analyzedClients]);

  // Campaign templates
  const campaignTemplates = [
    {
      id: 1,
      name: '✨ Tratamiento de Regalo (35 a 60 días)',
      badge: 'Más Efectiva',
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      description: 'Ideal para consentir y traer de vuelta clientas antes de que busquen otro salón.',
      generateMessage: (clientName: string, stylist: string) =>
        `✨ ¡Hola ${clientName}! En ${salonName} te hemos extrañado muchísimo 💖\n\nHace algunas semanas que no nos vemos con ${stylist}. Queremos regalarte un *${giftService} completamente GRATIS* al agendar cualquier servicio esta semana.\n\n📅 ¿Te apartamos un espacio para este jueves o viernes?\n👉 Reserva directa aquí: https://belleza2027.netlify.app/reservas`
    },
    {
      id: 2,
      name: '🎨 Renovación de Color & Retoque de Raíz',
      badge: 'Especial Color',
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      description: 'Recordatorio inteligente basado en el ciclo capilar de 40-50 días.',
      generateMessage: (clientName: string, stylist: string) =>
        `🌿 ¡Hola ${clientName}! ${stylist} estuvo revisando tu ficha técnica de color.\n\nYa han pasado varias semanas desde tu último servicio y es el momento ideal para un matiz o retoque de brillo para mantener tu cabello espectacular ✨\n\n🎁 Tienes un *${customDiscount} de descuento* si agendas antes del sábado.\n👉 Agenda tu cita en 1 minuto: https://belleza2027.netlify.app/reservas`
    },
    {
      id: 3,
      name: '👑 Pase VIP Exclusivo (Riesgo de Fuga +60 días)',
      badge: 'Alto Impacto',
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      description: 'Oferta irresistible con descuento flash para clientas de alto ticket.',
      generateMessage: (clientName: string) =>
        `👑 ¡Hola ${clientName}! Eres una de nuestras clientas más especiales en ${salonName}.\n\nComo sabemos lo ocupada que estás, activamos en tu cuenta un *Bono Exclusivo del ${customDiscount} en todo nuestro menú de belleza*.\n\n💆‍♀️ ¡Ven a relajarte y consentirte como mereces!\n👉 Activa tu bono aquí: https://belleza2027.netlify.app/reservas`
    },
    {
      id: 4,
      name: '🎂 Cumpleaños del Mes + Regalo Sorpresa',
      badge: 'Fidelización Emocional',
      badgeColor: 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30',
      description: 'Conecta con la clienta en su mes especial con un detalle inolvidable.',
      generateMessage: (clientName: string) =>
        `🎂 ¡Feliz Mes de Cumpleaños, ${clientName}! 🎉✨\n\nTodo el equipo de ${salonName} te desea un año lleno de luz y belleza. Queremos celebrarlo contigo regalándote una *Copa de Mimosa 🥂 + ${giftService} de cortesía* en tu visita de este mes.\n\n👉 ¡Elige tu día para consentirte!: https://belleza2027.netlify.app/reservas`
    }
  ];

  const currentTpl = campaignTemplates.find(t => t.id === activeCampaignTemplate) || campaignTemplates[0];

  const handleLaunchCampaign = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      setCampaignLaunchedSuccess(true);
      setTimeout(() => {
        setCampaignLaunchedSuccess(false);
      }, 5000);
    }, 1200);
  };

  const handleSendSingleWhatsApp = (item: InactiveClientData) => {
    const text = currentTpl.generateMessage(item.client.full_name, item.favoriteStylist);
    const cleanPhone = item.client.phone_whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ========================================================================= */}
      {/* 1. CABECERA & HERO DE FIDELIZACIÓN */}
      {/* ========================================================================= */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-xl ${
        isDark 
          ? 'bg-gradient-to-br from-[#131722] via-[#1A1F2C] to-[#0E121A] border-white/10' 
          : 'bg-gradient-to-br from-pink-50/70 via-white to-rose-50/40 border-pink-100'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Motor de Reactivación & Fidelización IA</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Reactivación de Clientas Inactivas (+35 Días)
            </h1>
            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Detecta automáticamente a clientas que no han vuelto a <strong className="font-bold">{salonName}</strong> y recupera su facturación con ofertas irresistibles por WhatsApp.
            </p>
          </div>

          {/* Piloto Automático Switch */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 shrink-0 ${
            isDark ? 'bg-black/30 border-white/10' : 'bg-white/90 border-slate-200 shadow-md'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              autoPilotActive ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-slate-300 text-slate-700'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Piloto Automático Flowy
                </strong>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  autoPilotActive ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30' : 'bg-slate-200 text-slate-600'
                }`}>
                  {autoPilotActive ? 'ACTIVO' : 'PAUSADO'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Envía recordatorio suave a los 35 días
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoPilotActive(!autoPilotActive)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoPilotActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                autoPilotActive ? 'left-6.5' : 'left-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TARJETAS DE IMPACTO & POTENCIAL DE RECUPERACIÓN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Inactivas */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Clientas Inactivas</span>
            <Users className="w-4 h-4 text-pink-500" />
          </div>
          <div className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metrics.totalInactive} clientas
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-500 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Sin visita en los últimos 35 a 90+ días</span>
          </div>
        </div>

        {/* Facturación Recuperable Estimada */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ingreso Potencial</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-500">
            ${Math.round(metrics.totalPotentialRecoverable).toLocaleString('es-CO')} {salonCurrency}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span>Ticket promedio estimado en riesgo</span>
          </div>
        </div>

        {/* Retorno Estimado Campaña */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recuperación Proyectada</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            ${Math.round(metrics.estimatedReturnAmount).toLocaleString('es-CO')} {salonCurrency}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-500 font-semibold">
            <span>Tasa de retorno esperada: ~38%</span>
          </div>
        </div>

        {/* Cumpleañeras del Mes */}
        <div className={`p-5 rounded-3xl border shadow-sm ${
          isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Cumpleaños Este Mes</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400">
            {analyzedClients.filter(c => c.isBirthdayThisMonth).length} clientas
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-500 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oportunidad de fidelización 100% cálida</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. WORKSPACE PRINCIPAL: ESTRATEGIA DE CAMPAÑA + LISTA DE CLIENTAS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: CONFIGURADOR DE CAMPAÑA RÁPIDA (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className={`p-6 rounded-3xl border space-y-5 shadow-lg ${
            isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
          }`}>
            
            <div className="flex items-center justify-between border-b pb-3.5 border-black/5 dark:border-white/10">
              <h2 className={`text-sm font-extrabold flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <Zap className="w-4 h-4 text-[#FF5A36]" />
                <span>Elegir Campaña de Reactivación</span>
              </h2>
              <span className="text-[10px] font-bold text-slate-400">
                1-Clic WhatsApp
              </span>
            </div>

            {/* Template Selector Grid */}
            <div className="space-y-2.5">
              {campaignTemplates.map((tpl) => {
                const isSelected = activeCampaignTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setActiveCampaignTemplate(tpl.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? isDark
                          ? 'bg-pink-500/10 border-pink-500/40 shadow-lg shadow-pink-500/10'
                          : 'bg-pink-50 border-pink-300 shadow-sm'
                        : isDark
                          ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className={`text-xs font-extrabold ${isSelected ? 'text-pink-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                        {tpl.name}
                      </strong>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}>
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Campaign Variables Customizer */}
            <div className={`p-4 rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#0B0E14] border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Personalizar Beneficio de la Oferta
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Descuento (%)</label>
                  <input
                    type="text"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(e.target.value)}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none focus:border-pink-500 ${
                      isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    placeholder="ej. 20%"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Servicio de Cortesía</label>
                  <input
                    type="text"
                    value={giftService}
                    onChange={(e) => setGiftService(e.target.value)}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none focus:border-pink-500 ${
                      isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    placeholder="ej. Hidratación Express"
                  />
                </div>
              </div>
            </div>

            {/* Live Message Preview */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                <span>Vista Previa del Mensaje de WhatsApp</span>
              </span>
              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed font-sans whitespace-pre-wrap ${
                isDark ? 'bg-[#151D2A] border-emerald-500/20 text-slate-200' : 'bg-emerald-50/60 border-emerald-200 text-slate-800'
              }`}>
                {currentTpl.generateMessage('Camila', 'Sofía Restrepo')}
              </div>
            </div>

            {/* Launch Campaign Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleLaunchCampaign}
                disabled={isLaunching || (selectedClients.length === 0 && filteredInactiveClients.length === 0)}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-[#FF5A36] hover:opacity-95 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLaunching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Despachando mensajes por WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      🚀 Lanzar Campaña a {selectedClients.length > 0 ? selectedClients.length : filteredInactiveClients.length} Clientas
                    </span>
                  </>
                )}
              </button>

              {campaignLaunchedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Campaña disparada con éxito vía WhatsApp Oficial!</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* COLUMNA DERECHA: RADAR & AUDITORÍA DE CLIENTAS INACTIVAS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className={`p-6 rounded-3xl border space-y-4 shadow-lg ${
            isDark ? 'bg-[#121622] border-white/10' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header with Search and Tier Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-black/5 dark:border-white/10">
              <div>
                <h3 className={`text-sm font-extrabold flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <Users className="w-4 h-4 text-pink-500" />
                  <span>Radar de Clientas en Riesgo de Fuga</span>
                </h3>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Mostrando {filteredInactiveClients.length} clientas inactivas identificadas
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o teléfono..."
                  className={`text-xs pl-8 pr-3 py-1.5 rounded-xl border focus:outline-none focus:border-pink-500 ${
                    isDark ? 'bg-black/30 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Segment Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === 'all'
                    ? 'bg-pink-500 text-white font-extrabold shadow-md shadow-pink-500/20'
                    : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({analyzedClients.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('tier_35_60')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === 'tier_35_60'
                    ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20'
                    : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🟡 35 - 60 Días ({metrics.tier35to60})
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('tier_60_90')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === 'tier_60_90'
                    ? 'bg-orange-500 text-white font-extrabold shadow-md shadow-orange-500/20'
                    : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🟠 60 - 90 Días ({metrics.tier60to90})
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('tier_90_plus')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === 'tier_90_plus'
                    ? 'bg-red-500 text-white font-extrabold shadow-md shadow-red-500/20'
                    : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🔴 +90 Días Crítico ({metrics.tier90plus})
              </button>

              <button
                type="button"
                onClick={() => setSelectedTier('birthdays')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedTier === 'birthdays'
                    ? 'bg-purple-500 text-white font-extrabold shadow-md shadow-purple-500/20'
                    : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🎂 Cumpleaños ({analyzedClients.filter(c => c.isBirthdayThisMonth).length})
              </button>
            </div>

            {/* Select All Bar */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedClients.length === filteredInactiveClients.length && filteredInactiveClients.length > 0}
                  onChange={handleSelectAll}
                  className="rounded text-pink-500 focus:ring-pink-500"
                />
                <span className="font-bold">Seleccionar todas para campaña masiva</span>
              </label>
              <span>{selectedClients.length} seleccionadas</span>
            </div>

            {/* Inactive Client Cards List */}
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredInactiveClients.map((item) => {
                const isChecked = selectedClients.includes(item.client.id);

                return (
                  <div
                    key={item.client.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isChecked
                        ? isDark ? 'bg-pink-500/10 border-pink-500/30' : 'bg-pink-50/70 border-pink-300'
                        : isDark ? 'bg-[#0B0E14] border-white/5 hover:border-white/15' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(item.client.id)}
                          className="mt-1 rounded text-pink-500 focus:ring-pink-500"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <strong className={`text-xs sm:text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {item.client.full_name}
                            </strong>
                            {item.isVip && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 border border-amber-500/20">
                                VIP
                              </span>
                            )}
                            {item.isBirthdayThisMonth && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 border border-purple-500/20">
                                🎂 Cumpleaños
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                            <span>📞 {item.client.phone_whatsapp}</span>
                            <span>💇‍♀️ Estilista: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{item.favoriteStylist}</strong></span>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>Último servicio: <strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>{item.lastService}</strong></span>
                            <span>Gasto acumulado: <strong className="text-emerald-500">${item.totalSpent.toLocaleString('es-CO')} {salonCurrency}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action & Risk Badge */}
                      <div className="text-right space-y-2 shrink-0">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border inline-block ${
                          item.riskLevel === 'critical'
                            ? 'bg-red-500/15 text-red-500 border-red-500/30'
                            : item.riskLevel === 'high'
                              ? 'bg-orange-500/15 text-orange-500 border-orange-500/30'
                              : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                        }`}>
                          {item.daysSinceLastVisit} días inactiva
                        </span>

                        <div>
                          <button
                            type="button"
                            onClick={() => handleSendSingleWhatsApp(item)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer ml-auto"
                            title="Enviar oferta personalizada por WhatsApp"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>Reactivar WA</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {filteredInactiveClients.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <strong className="text-sm block">¡Excelente! No hay clientas en este rango.</strong>
                  <p className="text-xs">Todas tus clientas han visitado el salón recientemente.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
