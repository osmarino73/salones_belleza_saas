import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Scissors,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  TrendingUp,
  User,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Phone,
  MessageCircle,
  X,
  Save,
  ChevronRight,
  Shield,
  Star,
  Activity,
  ArrowUpRight,
  Lock,
  Key,
  Ban,
  CalendarOff,
  AlertTriangle,
  Trash2,
  Check,
  Search,
  Zap,
  Wallet,
  Layers,
  ChevronDown
} from 'lucide-react';
import { api, initialStylists } from '../lib/supabase';
import { Appointment, Client, Stylist, ColorFormula, BlockedSlot } from '../types';
import { TimePickerSelect } from '../components/TimePickerSelect';

export const StylistPortalPage: React.FC = () => {
  const { stylistId } = useParams<{ stylistId?: string }>();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<'agenda' | 'wallet' | 'crm' | 'availability'>('agenda');

  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);
  const [currentStylist, setCurrentStylist] = useState<Stylist>(initialStylists[0]);
  const [stylistStatus, setStylistStatus] = useState<'disponible' | 'en_atencion' | 'descanso'>('disponible');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Agenda Filter
  const [agendaFilter, setAgendaFilter] = useState<'today' | 'tomorrow' | 'all'>('today');
  const [crmSearchQuery, setCrmSearchQuery] = useState('');

  // Availability & Blocked Slots State
  const [workingDays, setWorkingDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [newBlockStartDate, setNewBlockStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlockEndDate, setNewBlockEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [newBlockReason, setNewBlockReason] = useState('Vacaciones');
  const [newBlockFullDay, setNewBlockFullDay] = useState(true);
  const [newBlockStartTime, setNewBlockStartTime] = useState('02:00 PM');
  const [newBlockEndTime, setNewBlockEndTime] = useState('06:00 PM');
  const [availabilitySuccessMsg, setAvailabilitySuccessMsg] = useState('');

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  // Formula Modal State
  const [selectedClientForFormula, setSelectedClientForFormula] = useState<Client | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [newFormulaText, setNewFormulaText] = useState('L\'Oréal Majirel 7.1 (30g) + 8.2 (15g) con Oxidante 20 Vol (45ml)');
  const [newDeveloperVol, setNewDeveloperVol] = useState('20 Vol');
  const [newExposureMin, setNewExposureMin] = useState(35);
  const [newDiagnosticNotes, setNewDiagnosticNotes] = useState('Raíz natural 5. Matiz suave en lava cabezas.');
  const [isPlexUsed, setIsPlexUsed] = useState(true);

  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [salonCurrency, setSalonCurrency] = useState('COP');
  const [salonName, setSalonName] = useState('Salón');

  useEffect(() => {
    async function loadData() {
      setLoading(false);

      let currentEmail = '';
      const authUserRaw = localStorage.getItem('bf_auth_user');
      if (authUserRaw) {
        try {
          const authUser = JSON.parse(authUserRaw);
          if (authUser.email) currentEmail = authUser.email.toLowerCase().trim();
          if (authUser.user_metadata?.role === 'admin' || authUser.user_metadata?.is_owner) {
            setIsUserAdmin(true);
          }
        } catch (e) {}
      }

      // Cargar tenant activo para moneda y nombre
      const activeTenantRaw = localStorage.getItem('bf_tenant_active');
      let targetTenantId: string | undefined = undefined;
      if (activeTenantRaw) {
        try {
          const activeTenant = JSON.parse(activeTenantRaw);
          targetTenantId = activeTenant.id;
          if (activeTenant.currency) setSalonCurrency(activeTenant.currency);
          if (activeTenant.name) setSalonName(activeTenant.name);
        } catch (e) {}
      }

      const [stys, apts, cls] = await Promise.all([
        api.getStylists(targetTenantId),
        api.getAppointments(targetTenantId),
        api.getClients(targetTenantId)
      ]);
      setStylists(stys);
      setAppointments(apts);
      setClients(cls);

      // 1. Si se especificó un stylistId en la URL
      if (stylistId) {
        const found = stys.find(s => s.id === stylistId || s.name.toLowerCase().includes(stylistId.toLowerCase()));
        if (found) {
          setCurrentStylist(found);
          if (found.is_owner || found.role === 'admin') setIsUserAdmin(true);
          return;
        }
      }

      // 2. Si el usuario autenticado coincide con un estilista específico
      if (currentEmail) {
        const matched = stys.find(s => s.email?.toLowerCase().trim() === currentEmail);
        if (matched) {
          setCurrentStylist(matched);
          if (matched.is_owner || matched.role === 'admin') {
            setIsUserAdmin(true);
          }
        }
      }
    }
    loadData();
  }, [stylistId]);

  // Filter appointments for current stylist
  const myAppointments = useMemo(() => {
    return appointments.filter(
      a => a.stylist_id === currentStylist.id || a.stylist_name === currentStylist.name
    );
  }, [appointments, currentStylist]);

  // Filter clients who have appointments or formulas with this stylist
  const myClients = useMemo(() => {
    return clients.filter(
      c => c.preferred_stylist_id === currentStylist.id || 
           (c.formulas && c.formulas.some(f => f.stylist_id === currentStylist.id || f.stylist_name === currentStylist.name)) ||
           myAppointments.some(a => a.client_name === c.full_name)
    );
  }, [clients, currentStylist, myAppointments]);

  // Search filtered CRM clients
  const filteredCrmClients = useMemo(() => {
    if (!crmSearchQuery.trim()) return myClients;
    const q = crmSearchQuery.toLowerCase();
    return myClients.filter(c => 
      (c.full_name && String(c.full_name).toLowerCase().includes(q)) || 
      (c.phone_whatsapp && String(c.phone_whatsapp).toLowerCase().includes(q))
    );
  }, [myClients, crmSearchQuery]);

  // Currency Formatter
  const formatCurrency = (val: number, cur: string = salonCurrency || 'COP') => {
    const num = Number(val || 0);
    if (cur === 'USD') {
      return `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    if (cur === 'MXN') {
      return `$ ${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
    }
    if (cur === 'ARS') {
      return `$ ${Math.round(num).toLocaleString('es-AR')} ARS`;
    }
    if (cur === 'CLP') {
      return `$ ${Math.round(num).toLocaleString('es-CL')} CLP`;
    }
    if (cur === 'EUR') {
      return `€ ${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$ ${Math.round(num).toLocaleString('es-CO')} COP`;
  };

  // Commission Calculations (100% reales basadas en las citas efectivamente COBRADAS)
  const serviceCommissionPct = Number(currentStylist.commission_service_pct ?? 45);
  const retailCommissionPct = Number(currentStylist.commission_retail_pct ?? 10);

  // Citas efectivamente cobradas en caja hoy
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  const billedAppointmentsToday = myAppointments.filter(
    a => a.status === 'cobrada' && a.date === todayStr
  );
  const totalBilledToday = billedAppointmentsToday.reduce((sum, a) => sum + (Number(a.price_usd || 0)), 0);
  const earnedCommissionsToday = (totalBilledToday * serviceCommissionPct) / 100;

  // Citas terminadas en espera de pago en caja hoy
  const waitingPayAppointmentsToday = myAppointments.filter(
    a => a.status === 'completada' && a.date === todayStr
  );
  const waitingPayCommissionsToday = waitingPayAppointmentsToday.reduce((sum, a) => sum + ((Number(a.price_usd || 0) * serviceCommissionPct) / 100), 0);

  // Citas actualmente en atención en el sillón hoy
  const inProgressAppointmentsToday = myAppointments.filter(
    a => a.status === 'en_atencion' && a.date === todayStr
  );

  // Total acumulado de citas efectivamente cobradas en el salón (Mes)
  const completedAppointmentsMonth = myAppointments.filter(a => a.status === 'cobrada');
  const totalBilledMonth = completedAppointmentsMonth.reduce((sum, a) => sum + (Number(a.price_usd || 0)), 0);
  const earnedMonthCommissions = (totalBilledMonth * serviceCommissionPct) / 100;

  // Siguiente cita pendiente o en atención
  const upcomingAppointment = useMemo(() => {
    return myAppointments.find(a => a.date === todayStr && a.status !== 'cobrada' && a.status !== 'no_show') || myAppointments[0];
  }, [myAppointments, todayStr]);

  // Appointments filtered by day
  const displayedAppointments = useMemo(() => {
    if (agendaFilter === 'today') {
      return myAppointments.filter(a => a.date === todayStr);
    }
    if (agendaFilter === 'tomorrow') {
      return myAppointments.filter(a => a.date === tomorrowStr);
    }
    return myAppointments;
  }, [myAppointments, agendaFilter, todayStr, tomorrowStr]);

  // Handler for appointment status update
  const handleUpdateAppointmentStatus = async (id: string, newStatus: Appointment['status']) => {
    await api.updateAppointmentStatus(id, newStatus);
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (newStatus === 'en_atencion') {
      setStylistStatus('en_atencion');
    } else if (newStatus === 'completada' || newStatus === 'cobrada') {
      setStylistStatus('disponible');
    }
  };

  // Handler for saving color formula
  const handleSaveFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForFormula) return;

    const formula: ColorFormula = {
      id: `form-${Date.now()}`,
      client_id: selectedClientForFormula.id,
      stylist_id: currentStylist.id,
      stylist_name: currentStylist.name,
      formula_text: newFormulaText,
      developer_volume: newDeveloperVol,
      exposure_minutes: Number(newExposureMin),
      plex_used: isPlexUsed,
      porosity_level: 'media',
      diagnostic_notes: newDiagnosticNotes,
      created_at: new Date().toISOString().split('T')[0]
    };

    await api.addColorFormula(selectedClientForFormula.id, formula);

    // Update local client state
    const updatedClients = clients.map(c => {
      if (c.id === selectedClientForFormula.id) {
        return {
          ...c,
          formulas: [formula, ...(c.formulas || [])]
        };
      }
      return c;
    });

    setClients(updatedClients);
    setIsFormulaModalOpen(false);
  };

  // Sync availability state when currentStylist changes
  useEffect(() => {
    if (currentStylist) {
      setWorkingDays(currentStylist.working_days || [1, 2, 3, 4, 5, 6]);
      setBlockedDates(currentStylist.blocked_dates || []);
      setBlockedSlots(currentStylist.blocked_slots || [
        {
          id: 'blk-1',
          stylist_id: currentStylist.id,
          date: '2026-08-25',
          reason: 'Cita Médica / Trámite',
          full_day: false,
          start_time: '02:00 PM',
          end_time: '05:00 PM',
          created_at: '2026-08-18'
        },
        {
          id: 'blk-2',
          stylist_id: currentStylist.id,
          date: '2026-08-29',
          reason: 'Día de Descanso Programado',
          full_day: true,
          created_at: '2026-08-18'
        }
      ]);
    }
  }, [currentStylist]);

  // Handler for changing collaborator password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMessage('');
    if (newPasswordInput.length < 6) {
      setPasswordErrorMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    setPasswordSuccessMessage('¡Contraseña actualizada con éxito!');
    setTimeout(() => {
      setPasswordSuccessMessage('');
      setIsChangePasswordModalOpen(false);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }, 1200);
  };

  // Handler: Toggle standard working day (0=Dom, 1=Lun ... 6=Sab)
  const handleToggleWorkingDay = async (dayIndex: number) => {
    const updated = workingDays.includes(dayIndex)
      ? workingDays.filter(d => d !== dayIndex)
      : [...workingDays, dayIndex].sort();
    
    setWorkingDays(updated);
    const updatedStylist: Stylist = {
      ...currentStylist,
      working_days: updated
    };
    setCurrentStylist(updatedStylist);
    await api.updateStylist(updatedStylist);
    setAvailabilitySuccessMsg('Días laborales actualizados con éxito');
    setTimeout(() => setAvailabilitySuccessMsg(''), 3000);
  };

  // Handler: Add new Blocked Date or Range
  const handleAddBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockStartDate) return;

    // Generate all dates between start and end
    const datesToBlock: string[] = [];
    const start = new Date(newBlockStartDate);
    const end = new Date(newBlockEndDate || newBlockStartDate);

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      datesToBlock.push(dt.toISOString().split('T')[0]);
    }

    const newSlots: BlockedSlot[] = datesToBlock.map(dateStr => ({
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stylist_id: currentStylist.id,
      date: dateStr,
      reason: newBlockReason,
      full_day: newBlockFullDay,
      start_time: newBlockFullDay ? undefined : newBlockStartTime,
      end_time: newBlockFullDay ? undefined : newBlockEndTime,
      created_at: new Date().toISOString()
    }));

    const combinedSlots = [...newSlots, ...blockedSlots];
    const combinedDates = Array.from(new Set([...datesToBlock, ...blockedDates]));

    setBlockedSlots(combinedSlots);
    setBlockedDates(combinedDates);

    const updatedStylist: Stylist = {
      ...currentStylist,
      blocked_dates: combinedDates,
      blocked_slots: combinedSlots
    };
    setCurrentStylist(updatedStylist);
    await api.updateStylist(updatedStylist);

    setAvailabilitySuccessMsg(`¡${datesToBlock.length} día(s) bloqueado(s) correctamente! Flowy IA respetará tu descanso.`);
    setTimeout(() => setAvailabilitySuccessMsg(''), 4000);
  };

  // Handler: Remove a blocked slot
  const handleRemoveBlockedSlot = async (slotId: string, dateStr: string) => {
    const updatedSlots = blockedSlots.filter(s => s.id !== slotId);
    const dateStillHasSlots = updatedSlots.some(s => s.date === dateStr);
    const updatedDates = dateStillHasSlots
      ? blockedDates
      : blockedDates.filter(d => d !== dateStr);

    setBlockedSlots(updatedSlots);
    setBlockedDates(updatedDates);

    const updatedStylist: Stylist = {
      ...currentStylist,
      blocked_dates: updatedDates,
      blocked_slots: updatedSlots
    };
    setCurrentStylist(updatedStylist);
    await api.updateStylist(updatedStylist);

    setAvailabilitySuccessMsg('Día desbloqueado y disponible nuevamente para citas.');
    setTimeout(() => setAvailabilitySuccessMsg(''), 3000);
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 relative ${
      theme === 'dark' ? 'bg-[#080B11] text-slate-100' : 'bg-[#F4F6F9] text-slate-800'
    }`}>

      {/* AMBIENT GLOW EFFECTS (Background Mesh) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-64 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* TOP GLASS HEADER FOR MOBILE & DESKTOP */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl px-3.5 sm:px-6 py-2.5 sm:py-3 transition-colors ${
        theme === 'dark' ? 'bg-[#0B0F19]/80 border-white/[0.08]' : 'bg-white/90 border-black/5 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-lg shadow-[#FF5A36]/25 group-hover:scale-105 transition-transform">
                <Scissors className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs sm:text-sm tracking-tight leading-none">
                  Kowy<span className="text-[#FF5A36]">.app</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Portal Staff</span>
              </div>
            </Link>
          </div>

          {/* Center Stylist Switcher (Admin Mode) or Salon Chip */}
          <div className="flex items-center gap-1.5">
            {isUserAdmin ? (
              <div className="relative">
                <select
                  value={currentStylist.id}
                  onChange={(e) => {
                    const found = stylists.find(s => s.id === e.target.value);
                    if (found) setCurrentStylist(found);
                  }}
                  className={`text-xs font-bold border rounded-2xl pl-3 pr-7 py-1.5 focus:outline-none focus:border-[#FF5A36] max-w-[140px] sm:max-w-none truncate appearance-none cursor-pointer transition-all ${
                    theme === 'dark' 
                      ? 'bg-[#141926]/90 border-white/10 text-white hover:border-white/20' 
                      : 'bg-slate-100 border-black/10 text-slate-900'
                  }`}
                  title="Modo Dueña: Cambiar colaborador para previsualizar"
                >
                  {stylists.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0E121B] text-white">
                      {s.name.split(' ')[0]} ({s.specialty.split('&')[0].trim()})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-slate-400" />
              </div>
            ) : (
              <span className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border ${
                theme === 'dark' ? 'bg-[#141926]/80 border-white/10 text-slate-300' : 'bg-slate-100 border-black/5 text-slate-700'
              }`}>
                {salonName}
              </span>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-[#141926] border-white/10 text-amber-400 hover:border-amber-400/40' : 'bg-[#F0F2F7] border-black/5 text-slate-700'
              }`}
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isUserAdmin && (
              <Link
                to="/dashboard"
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border hidden sm:flex items-center gap-1.5 transition-all ${
                  theme === 'dark' ? 'border-white/10 hover:border-[#FF5A36] bg-[#141926] text-white shadow-sm' : 'border-black/5 bg-white shadow-sm'
                }`}
                title="Volver al panel general de administración"
              >
                <span>Panel Dueña</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5A36]" />
              </Link>
            )}

            <Link
              to="/login"
              className="w-8 h-8 rounded-xl border border-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER (Mobile-First Thumb-Zone Optimized) */}
      <main className="max-w-6xl mx-auto p-3 sm:p-6 space-y-3.5 sm:space-y-6 pb-36 sm:pb-12">

        {/* STICKY ACTIVE APPOINTMENT WIDGET (Atención en Sillón en Vivo) */}
        {inProgressAppointmentsToday.length > 0 && (
          <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/25 via-orange-500/15 to-transparent border-2 border-amber-500/50 flex items-center justify-between gap-3 shadow-xl shadow-amber-500/15 animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-500/30 animate-pulse">
                <Scissors className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-black text-amber-400 block">● En Sillón Ahora</span>
                <strong className="text-sm font-black text-white block truncate">{inProgressAppointmentsToday[0].client_name}</strong>
                <span className="text-xs text-slate-300 block truncate">{inProgressAppointmentsToday[0].service_name} • {inProgressAppointmentsToday[0].time}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateAppointmentStatus(inProgressAppointmentsToday[0].id, 'completada')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 active:scale-95 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-lg shadow-purple-600/30 shrink-0 flex items-center gap-1.5 cursor-pointer transition-transform"
              title="Finalizar atención y enviar el turno a recepción/caja POS"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Enviar a Caja</span>
            </button>
          </div>
        )}

        {/* HERO PROFILE 360° GLASS CARD */}
        <div className={`p-4 sm:p-6 rounded-3xl border relative overflow-hidden backdrop-blur-xl transition-all ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-[#141926]/90 via-[#101420]/80 to-[#141926]/90 border-white/10 shadow-2xl shadow-black/40' 
            : 'bg-white border-black/5 shadow-md'
        }`}>
          {/* Subtle top accent gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5A36] to-transparent opacity-80" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Avatar & Profile Info */}
            <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto">
              <div className="relative shrink-0">
                <img
                  src={currentStylist.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={currentStylist.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FF5A36]/80 shadow-xl shadow-[#FF5A36]/25"
                />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0B0F19] ${
                  stylistStatus === 'disponible' ? 'bg-emerald-500 animate-pulse' :
                  stylistStatus === 'en_atencion' ? 'bg-amber-500' : 'bg-slate-500'
                }`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black tracking-tight truncate text-white">
                    {currentStylist.name}
                  </h1>
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{currentStylist.rating || '5.0'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-0.5 truncate font-medium">
                  {currentStylist.specialty}
                </p>

                {/* Commission Badges & Password Quick Modal */}
                <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-[11px] flex-wrap">
                  <span className="bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/20 font-black px-2 py-0.5 rounded-lg">
                    {serviceCommissionPct}% Servicios
                  </span>
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-black px-2 py-0.5 rounded-lg">
                    {retailCommissionPct}% Retail
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className={`p-1 px-2.5 rounded-lg border text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-white/5 border-white/10 hover:border-[#FF5A36] text-slate-300' 
                        : 'bg-slate-100 border-black/5 hover:border-[#FF5A36] text-slate-700'
                    }`}
                    title="Cambiar mi contraseña"
                  >
                    <Key className="w-3 h-3 text-[#FF5A36]" />
                    <span>Clave</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Stylist Status Switcher Segmented Controller */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado en Salón:</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 border border-white/10 rounded-2xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStylistStatus('disponible')}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    stylistStatus === 'disponible'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                  <span>Disponible</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStylistStatus('en_atencion')}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    stylistStatus === 'en_atencion'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scissors className="w-3 h-3" />
                  <span>En Sillón</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStylistStatus('descanso')}
                  className={`text-[11px] font-black px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    stylistStatus === 'descanso'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Descanso</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3 LIVE GLASS METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Card 1: Mi Comisión Cobrada Hoy */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all hover:scale-[1.01] ${
            theme === 'dark' ? 'bg-[#141926]/90 border-emerald-500/20 shadow-xl shadow-black/30' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Mi Billetera de Hoy</span>
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                {serviceCommissionPct}% comisión
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight my-1">
              {formatCurrency(earnedCommissionsToday, salonCurrency)}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between gap-1 flex-wrap pt-2 border-t border-white/5">
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{billedAppointmentsToday.length} turno(s) cobrado(s)</span>
              </span>
              {waitingPayAppointmentsToday.length > 0 && (
                <span className="text-purple-300 font-bold bg-purple-500/15 px-2 py-0.5 rounded-full border border-purple-500/20 text-[10px]">
                  💳 +{formatCurrency(waitingPayCommissionsToday, salonCurrency)} en caja
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Acumulado Quincena / Mes */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all hover:scale-[1.01] ${
            theme === 'dark' ? 'bg-[#141926]/90 border-[#FF5A36]/20 shadow-xl shadow-black/30' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#FF5A36]" />
                <span>Acumulado del Mes</span>
              </span>
              <span className="text-[10px] bg-[#FF5A36]/10 text-[#FF5A36] px-2 py-0.5 rounded-full border border-[#FF5A36]/20">
                Liquidación quincenal
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-[#FF5A36] tracking-tight my-1">
              {formatCurrency(earnedMonthCommissions, salonCurrency)}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
              <span>{completedAppointmentsMonth.length} citas cobradas en el salón</span>
              <span className="text-emerald-400 font-bold">100% transparente</span>
            </div>
          </div>

          {/* Card 3: Próximo Turno Inteligente */}
          <div className={`p-5 rounded-3xl border flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all hover:scale-[1.01] ${
            theme === 'dark' ? 'bg-[#141926]/90 border-blue-500/20 shadow-xl shadow-black/30' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Próximo Cliente</span>
              </span>
              {upcomingAppointment && (
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                  {upcomingAppointment.time}
                </span>
              )}
            </div>

            {upcomingAppointment ? (
              <div>
                <div className="text-base sm:text-lg font-black truncate text-white">
                  {upcomingAppointment.client_name}
                </div>
                <div className="text-xs text-[#FF5A36] font-extrabold truncate mt-0.5">
                  {upcomingAppointment.service_name}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm font-bold my-1">
                Agenda libre por ahora
              </div>
            )}

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
              {upcomingAppointment?.client_phone ? (
                <a
                  href={`https://wa.me/${upcomingAppointment.client_phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Escribir por WhatsApp</span>
                </a>
              ) : (
                <span>Esperando nuevos turnos</span>
              )}
            </div>
          </div>

        </div>

        {/* NAVIGATION SEGMENTED TABS (Desktop Bar) */}
        <div className={`hidden sm:grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl border ${
          theme === 'dark' ? 'bg-[#0E121B]/90 border-white/10 shadow-lg' : 'bg-white border-black/5 shadow-sm'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mi Agenda ({displayedAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Fórmulas & Clientas ({myClients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'wallet'
                ? 'bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Mi Billetera & Historial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'availability'
                ? 'bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CalendarOff className="w-4 h-4" />
            <span>Días Libres & Descansos ({blockedSlots.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MI AGENDA INTERACTIVA (TIMELINE) */}
        {/* ========================================================================= */}
        {activeTab === 'agenda' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Day Filter Chips */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF5A36]" />
                  <span>Turnos de Trabajo</span>
                </h2>
                <p className="text-xs text-slate-400">Actualiza el estado de cada servicio con un toque desde tu celular.</p>
              </div>

              <div className="flex gap-1.5 p-1 bg-black/40 border border-white/10 rounded-2xl text-xs font-black">
                <button
                  type="button"
                  onClick={() => setAgendaFilter('today')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    agendaFilter === 'today' ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📅 Hoy
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaFilter('tomorrow')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    agendaFilter === 'tomorrow' ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ☀️ Mañana
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    agendaFilter === 'all' ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ✨ Todos ({myAppointments.length})
                </button>
              </div>
            </div>

            {displayedAppointments.length === 0 ? (
              <div className={`p-12 rounded-3xl border text-center space-y-3 backdrop-blur-xl ${
                theme === 'dark' ? 'bg-[#141926]/90 border-white/10' : 'bg-white border-black/5 shadow-sm'
              }`}>
                <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-black text-white">No tienes citas programadas para este filtro</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Las reservas de la web y de WhatsApp aparecerán aquí en tiempo real con alertas y recordatorios.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedAppointments.map((apt) => {
                  const clientObj = clients.find(c => c.full_name === apt.client_name || c.phone_whatsapp === apt.client_phone);
                  const isOngoing = apt.status === 'en_atencion';
                  const isWaitingPay = apt.status === 'completada';
                  const isDone = apt.status === 'cobrada';

                  return (
                    <div
                      key={apt.id}
                      className={`p-4 sm:p-5 rounded-3xl border transition-all backdrop-blur-xl ${
                        isOngoing
                          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30 shadow-xl shadow-amber-500/10'
                          : isWaitingPay
                          ? 'border-purple-500/40 bg-purple-500/10'
                          : isDone
                          ? 'border-emerald-500/30 bg-emerald-500/5 opacity-85'
                          : theme === 'dark' ? 'bg-[#141926]/90 border-white/10 hover:border-white/20' : 'bg-white border-black/5 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        
                        {/* Time & Client info */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className={`p-3 rounded-2xl text-center min-w-[76px] shrink-0 border ${
                            isOngoing 
                              ? 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md' 
                              : isWaitingPay 
                              ? 'bg-purple-600 border-purple-500 text-white font-black' 
                              : isDone
                              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold'
                              : 'bg-white/5 border-white/10 text-white'
                          }`}>
                            <span className="text-xs font-mono font-black block">{apt.time}</span>
                            <span className="text-[10px] opacity-80 block mt-0.5">{apt.duration_minutes} min</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm sm:text-base font-black block text-white truncate">{apt.client_name}</strong>
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                isOngoing
                                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                                  : isWaitingPay
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : isDone
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {isOngoing ? '● En Sillón' : isWaitingPay ? '💳 En Caja (Esperando Pago)' : isDone ? '✓ Cobrada & Liquidada' : '⏳ Confirmada'}
                              </span>
                            </div>

                            <span className="text-xs text-[#FF5A36] font-extrabold block mt-0.5">
                              {apt.service_name} • {formatCurrency(apt.price_usd, salonCurrency)}
                            </span>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 flex-wrap">
                              {apt.client_phone && (
                                <a
                                  href={`https://wa.me/${apt.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${apt.client_name}! Te saluda ${currentStylist.name} de ${salonName}. Ya tengo tu espacio listo 💖`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              <span className="text-[10px] text-slate-500">{apt.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for the Stylist (Thumb-Zone Optimized) */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2.5 sm:pt-0 border-t sm:border-t-0 border-white/5">
                          {clientObj && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClientForFormula(clientObj);
                                setIsFormulaModalOpen(true);
                              }}
                              className="text-xs font-bold px-3 py-2.5 rounded-xl border border-white/10 hover:border-[#FF5A36] bg-white/5 text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px] active:scale-95"
                              title="Ver o registrar fórmula técnica"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                              <span>Fórmula</span>
                            </button>
                          )}

                          {isOngoing ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completada')}
                              className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-indigo-600 active:scale-95 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px]"
                              title="Marcar servicio técnico terminado y enviar al cliente a recepción/caja"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>✓ Terminado / A Caja</span>
                            </button>
                          ) : isWaitingPay ? (
                            <span className="text-[11px] font-bold text-purple-300 bg-purple-500/15 px-3 py-2.5 rounded-xl border border-purple-500/25 flex items-center justify-center gap-1.5 min-h-[42px]">
                              💳 Esperando Cobro en Recepción
                            </span>
                          ) : isDone ? (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-3 py-2.5 rounded-xl border border-emerald-500/25 flex items-center justify-center gap-1.5 min-h-[42px]">
                              ✓ Liquidada en Caja
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'en_atencion')}
                              className="flex-1 sm:flex-initial bg-gradient-to-r from-amber-500 to-orange-500 active:scale-95 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[42px]"
                            >
                              <Scissors className="w-4 h-4 stroke-[2.5]" />
                              <span>Iniciar Atención</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FÓRMULAS & CLIENTAS (CRM 360°) */}
        {/* ========================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FF5A36]" />
                  <span>Mis Clientas & Expedientes de Color</span>
                </h2>
                <p className="text-xs text-slate-400">Consulta fórmulas exactas de tinte aplicadas en visitas anteriores.</p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={crmSearchQuery}
                  onChange={(e) => setCrmSearchQuery(e.target.value)}
                  placeholder="Buscar clienta..."
                  className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>
            </div>

            {filteredCrmClients.length === 0 ? (
              <div className="p-12 rounded-3xl border border-white/10 bg-[#141926]/90 text-center space-y-2 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-600" />
                <strong className="text-white block">No se encontraron clientas</strong>
                <p className="text-xs">Intenta con otro término de búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCrmClients.map((client) => {
                  const clientFormulas = (client.formulas || []).filter(
                    f => f.stylist_id === currentStylist.id || f.stylist_name === currentStylist.name
                  );

                  return (
                    <div
                      key={client.id}
                      className={`p-5 rounded-3xl border flex flex-col justify-between backdrop-blur-xl transition-all ${
                        theme === 'dark' ? 'bg-[#141926]/90 border-white/10 hover:border-white/20' : 'bg-white border-black/5 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <strong className="text-sm font-black block text-white">{client.full_name}</strong>
                            <span className="text-xs text-slate-400 font-mono">{client.phone_whatsapp}</span>
                          </div>
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/20 uppercase">
                            {client.status || 'frecuente'}
                          </span>
                        </div>

                        {/* Formulas List */}
                        {clientFormulas.length > 0 ? (
                          <div className="space-y-2 mb-3">
                            {clientFormulas.map((form) => (
                              <div
                                key={form.id}
                                className="p-3.5 rounded-2xl border border-white/5 bg-[#0E121B]/80 text-xs space-y-1.5"
                              >
                                <div className="flex justify-between text-[10px] text-[#FF5A36] font-black uppercase">
                                  <span>Fórmula Registrada</span>
                                  <span>{form.created_at}</span>
                                </div>
                                <p className="font-mono text-[11px] text-white font-bold">{form.formula_text}</p>
                                <div className="text-[10px] text-slate-400 flex gap-3 pt-1 border-t border-white/5">
                                  <span>Oxidante: <strong className="text-white">{form.developer_volume}</strong></span>
                                  <span>Tiempo: <strong className="text-white">{form.exposure_minutes} min</strong></span>
                                  <span>Plex: <strong className="text-emerald-400">{form.plex_used ? 'Sí' : 'No'}</strong></span>
                                </div>
                                {form.diagnostic_notes && (
                                  <p className="text-[10px] text-slate-400 italic">"{form.diagnostic_notes}"</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic p-4 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl mb-3">
                            Sin fórmulas registradas por ti aún.
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClientForFormula(client);
                            setIsFormulaModalOpen(true);
                          }}
                          className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#FF5A36]/25 cursor-pointer transition-all hover:scale-105"
                        >
                          <Plus className="w-3.5 h-3.5" /> Agregar Fórmula de Tinte
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MI BILLETERA & LIQUIDACIÓN */}
        {/* ========================================================================= */}
        {activeTab === 'wallet' && (
          <div className="space-y-4 animate-fade-in">
            <div className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
              theme === 'dark' ? 'bg-[#141926]/90 border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Liquidación de Comisiones & Transparencia</span>
                  </h2>
                  <p className="text-xs text-slate-400">Cada servicio completado se liquida en base a tu porcentaje acordado ({serviceCommissionPct}%).</p>
                </div>
                <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-mono shadow-md">
                  Acumulado Total: {formatCurrency(earnedMonthCommissions, salonCurrency)}
                </span>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {myAppointments.map((apt) => {
                  const comAmount = Math.round(((apt.price_usd || 0) * serviceCommissionPct) / 100);
                  const isDone = apt.status === 'cobrada';
                  const isWaitingPay = apt.status === 'completada';
                  const isOngoing = apt.status === 'en_atencion';

                  return (
                    <div key={apt.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="block text-sm font-black text-white">{apt.service_name}</strong>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isDone ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                            isWaitingPay ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20' :
                            isOngoing ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-slate-400'
                          }`}>
                            {isDone ? '✓ Cobrada en Caja' : isWaitingPay ? '💳 En Caja (Por Cobrar)' : isOngoing ? '● En Sillón' : 'Agendada'}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{apt.client_name} • {apt.date} {apt.time}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">Total: {formatCurrency(apt.price_usd, salonCurrency)}</span>
                        {isDone ? (
                          <strong className="text-sm text-emerald-400 font-black block font-mono">
                            +{formatCurrency(comAmount, salonCurrency)} ({serviceCommissionPct}%)
                          </strong>
                        ) : isWaitingPay ? (
                          <strong className="text-xs text-purple-300 font-bold block">
                            {formatCurrency(comAmount, salonCurrency)} (Por Liquidar)
                          </strong>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium block">
                            {formatCurrency(comAmount, salonCurrency)} (Estimada)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MI DISPONIBILIDAD & BLOQUEO DE DÍAS */}
        {/* ========================================================================= */}
        {activeTab === 'availability' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Feedback notification message */}
            {availabilitySuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center justify-between shadow-xl animate-fade-in">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>{availabilitySuccessMsg}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Sincronizado con Flowy IA</span>
              </div>
            )}

            {/* SECTION 1: JORNADA Y DÍAS HABITUALES DE TRABAJO */}
            <div className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
              theme === 'dark' ? 'bg-[#141926]/90 border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-white/5">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF5A36]" />
                    <span>Días Laborales Habituales</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Marca los días de la semana en los que normalmente atiendes en el salón.
                  </p>
                </div>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {workingDays.length} días de atención / semana
                </span>
              </div>

              {/* Day Selector Pills */}
              <div className="grid grid-cols-7 gap-2 text-center">
                {[
                  { index: 1, label: 'Lun', full: 'Lunes' },
                  { index: 2, label: 'Mar', full: 'Martes' },
                  { index: 3, label: 'Mié', full: 'Miércoles' },
                  { index: 4, label: 'Jue', full: 'Jueves' },
                  { index: 5, label: 'Vie', full: 'Viernes' },
                  { index: 6, label: 'Sáb', full: 'Sábado' },
                  { index: 0, label: 'Dom', full: 'Domingo' }
                ].map((d) => {
                  const isWorking = workingDays.includes(d.index);
                  return (
                    <button
                      key={d.index}
                      type="button"
                      onClick={() => handleToggleWorkingDay(d.index)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isWorking
                          ? 'bg-gradient-to-br from-[#FF5A36] to-pink-500 border-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/25 scale-105 font-black'
                          : 'bg-[#0E121B] border-white/5 text-slate-500 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-black">{d.label}</span>
                      <span className={`text-[9px] mt-1 font-bold ${isWorking ? 'text-white/90' : 'text-slate-500'}`}>
                        {isWorking ? 'Activo' : 'Libre'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: FORMULARIO DE BLOQUEO DE FECHAS / VACACIONES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Formulario Izquierda (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
                  theme === 'dark' ? 'bg-[#141926]/90 border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="border-b pb-3 border-white/5">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-500" />
                      <span>Bloquear Días o Vacaciones</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evita que clientas agenden citas en tus días de descanso, viajes o citas médicas.
                    </p>
                  </div>

                  {/* Preset Quick Buttons */}
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Motivos Rápidos
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '🌴 Vacaciones', reason: 'Vacaciones' },
                        { label: '🩺 Cita Médica', reason: 'Cita Médica' },
                        { label: '💆‍♀️ Día Libre', reason: 'Día Libre / Descanso' },
                        { label: '📚 Masterclass', reason: 'Capacitación' },
                        { label: '✨ Personal', reason: 'Asunto Personal' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewBlockReason(item.reason)}
                          className={`text-xs font-black px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                            newBlockReason === item.reason
                              ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-md shadow-[#FF5A36]/25'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleAddBlockedSlot} className="space-y-3.5 text-xs">
                    
                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Desde la Fecha *</label>
                        <input
                          type="date"
                          value={newBlockStartDate}
                          onChange={(e) => {
                            setNewBlockStartDate(e.target.value);
                            if (new Date(e.target.value) > new Date(newBlockEndDate)) {
                              setNewBlockEndDate(e.target.value);
                            }
                          }}
                          className="w-full border rounded-xl p-2.5 bg-[#0E121B] border-white/10 text-white focus:outline-none focus:border-[#FF5A36]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Hasta la Fecha *</label>
                        <input
                          type="date"
                          value={newBlockEndDate}
                          min={newBlockStartDate}
                          onChange={(e) => setNewBlockEndDate(e.target.value)}
                          className="w-full border rounded-xl p-2.5 bg-[#0E121B] border-white/10 text-white focus:outline-none focus:border-[#FF5A36]"
                          required
                        />
                      </div>
                    </div>

                    {/* Motivo personalizado */}
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Motivo / Razón del Bloqueo</label>
                      <input
                        type="text"
                        value={newBlockReason}
                        onChange={(e) => setNewBlockReason(e.target.value)}
                        placeholder="Ej. Vacaciones de Verano / Permiso personal"
                        className="w-full border rounded-xl p-2.5 bg-[#0E121B] border-white/10 text-white focus:outline-none focus:border-[#FF5A36]"
                        required
                      />
                    </div>

                    {/* Todo el día switch */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <strong className="block text-xs font-bold text-white">Bloquear Todo el Día</strong>
                        <span className="text-[11px] text-slate-400">Sin citas durante toda la jornada</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={newBlockFullDay}
                        onChange={(e) => setNewBlockFullDay(e.target.checked)}
                        className="w-4 h-4 text-[#FF5A36] rounded"
                      />
                    </div>

                    {/* Horas específicas con selector visual si no es todo el día */}
                    {!newBlockFullDay && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-fade-in">
                        <TimePickerSelect
                          label="Hora de Inicio"
                          value={newBlockStartTime}
                          onChange={setNewBlockStartTime}
                          theme={theme}
                        />
                        <TimePickerSelect
                          label="Hora de Fin"
                          value={newBlockEndTime}
                          onChange={setNewBlockEndTime}
                          theme={theme}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-[#FF5A36] hover:opacity-95 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Guardar Bloqueo de Días</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista Derecha de Bloqueos Activos (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`p-6 rounded-3xl border space-y-4 backdrop-blur-xl ${
                  theme === 'dark' ? 'bg-[#141926]/90 border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center border-b pb-3 border-white/5">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <CalendarOff className="w-4 h-4 text-[#FF5A36]" />
                        <span>Días y Fechas Bloqueadas Activas ({blockedSlots.length})</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Fechas donde la web y Flowy IA no permitirán agendar citas con {currentStylist.name.split(' ')[0]}.
                      </p>
                    </div>
                  </div>

                  {blockedSlots.length === 0 ? (
                    <div className="p-10 rounded-2xl text-center space-y-2 border border-dashed border-white/10 text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto text-emerald-500/40" />
                      <strong className="text-sm block text-white">Sin días bloqueados actualmente</strong>
                      <p className="text-xs max-w-sm mx-auto">
                        Estás 100% disponible para recibir citas según tus días habituales de trabajo.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {blockedSlots.map((slot) => {
                        const dateObj = new Date(slot.date + 'T00:00:00');
                        const formattedDate = dateObj.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });

                        return (
                          <div
                            key={slot.id}
                            className="p-3.5 rounded-2xl border border-white/5 bg-[#0E121B]/80 flex items-center justify-between gap-3 transition-all hover:border-white/15"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-black text-sm shrink-0">
                                {dateObj.getDate()}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-xs capitalize font-black text-white">
                                    {formattedDate}
                                  </strong>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                                    {slot.reason || 'Día No Disponible'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  {slot.full_day
                                    ? '🚫 No disponible todo el día'
                                    : `⏰ Bloqueado de ${slot.start_time} a ${slot.end_time}`}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveBlockedSlot(slot.id, slot.date)}
                              className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                              title="Desbloquear este día"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Flowy Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="block text-white font-bold">Protección Automática Flowy IA</strong>
                      <span className="text-[11px] text-slate-400">
                        Si una clienta pide cita por WhatsApp en tus días bloqueados, Flowy le ofrecerá tus días libres más cercanos.
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL REGISTRO DE FÓRMULA DE COLORIMETRÍA */}
      {isFormulaModalOpen && selectedClientForFormula && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="border border-[#FF5A36]/40 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in bg-[#141926] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-[#FF5A36] font-black uppercase tracking-wider">FÓRMULA TÉCNICA EN SILLÓN</span>
                <h3 className="text-base font-black">{selectedClientForFormula.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mezcla Técnica de Tinte *</label>
                <input
                  type="text"
                  value={newFormulaText}
                  onChange={(e) => setNewFormulaText(e.target.value)}
                  placeholder="Ej. Igora Royal 8.1 (30g) + 0.22 (5g)"
                  className="w-full border border-white/10 rounded-xl p-2.5 font-mono bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Oxidante</label>
                  <select
                    value={newDeveloperVol}
                    onChange={(e) => setNewDeveloperVol(e.target.value)}
                    className="w-full border border-white/10 rounded-xl p-2.5 bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="10 Vol">10 Vol</option>
                    <option value="20 Vol">20 Vol</option>
                    <option value="30 Vol">30 Vol</option>
                    <option value="40 Vol">40 Vol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tiempo (Minutos)</label>
                  <input
                    type="number"
                    value={newExposureMin}
                    onChange={(e) => setNewExposureMin(Number(e.target.value))}
                    className="w-full border border-white/10 rounded-xl p-2.5 font-mono bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Notas Diagnósticas</label>
                <textarea
                  rows={2}
                  value={newDiagnosticNotes}
                  onChange={(e) => setNewDiagnosticNotes(e.target.value)}
                  placeholder="Fondo de decoloración 9, aplicar matiz en húmedo..."
                  className="w-full border border-white/10 rounded-xl p-2.5 bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="plex_checkbox"
                  checked={isPlexUsed}
                  onChange={(e) => setIsPlexUsed(e.target.checked)}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36]"
                />
                <label htmlFor="plex_checkbox" className="text-slate-300 text-xs cursor-pointer select-none">
                  Protector Plex #1 añadido a la mezcla
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF5A36]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Fórmula</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR CONTRASEÑA DEL COLABORADOR */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="border border-[#FF5A36]/40 rounded-3xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in bg-[#141926] text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-black">Cambiar Mi Contraseña</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccessMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                <p>{passwordSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                {passwordErrorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-[11px]">
                    {passwordErrorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Contraseña Actual o Provisoria</label>
                  <input
                    type="password"
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Tu clave actual..."
                    className="w-full border border-white/10 rounded-xl p-2.5 font-mono bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nueva Contraseña Personal *</label>
                  <input
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full border border-white/10 rounded-xl p-2.5 font-mono bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full border border-white/10 rounded-xl p-2.5 font-mono bg-[#0E121B] text-white focus:outline-none focus:border-[#FF5A36]"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF5A36]/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Actualizar Clave</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FLOATING MOBILE APP BOTTOM NAVIGATION BAR (iOS / Android Native Feel with Live Badges) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 border border-white/10 backdrop-blur-2xl px-2 py-1.5 flex items-center justify-around bg-[#0B0F19]/95 rounded-3xl shadow-2xl shadow-black/90">
        <button
          type="button"
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black py-1.5 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'agenda' ? 'text-[#FF5A36] bg-[#FF5A36]/15 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Calendar className="w-4 h-4" />
            {myAppointments.filter(a => a.date === todayStr && a.status !== 'cobrada').length > 0 && (
              <span className="absolute -top-1 -right-2.5 w-3.5 h-3.5 rounded-full bg-[#FF5A36] text-white text-[8px] font-black flex items-center justify-center animate-pulse shadow-sm">
                {myAppointments.filter(a => a.date === todayStr && a.status !== 'cobrada').length}
              </span>
            )}
          </div>
          <span>Agenda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crm')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'crm' ? 'text-[#FF5A36] bg-[#FF5A36]/15 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Fórmulas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'wallet' ? 'text-[#FF5A36] bg-[#FF5A36]/15 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Billetera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('availability')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-black py-1.5 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'availability' ? 'text-[#FF5A36] bg-[#FF5A36]/15 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <CalendarOff className="w-4 h-4" />
            {blockedSlots.length > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-400" />
            )}
          </div>
          <span>Libres</span>
        </button>
      </div>

    </div>
  );
};

export default StylistPortalPage;
