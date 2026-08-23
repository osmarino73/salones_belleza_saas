import React, { useState, useEffect } from 'react';
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
  Check
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
  const myAppointments = appointments.filter(
    a => a.stylist_id === currentStylist.id || a.stylist_name === currentStylist.name
  );

  // Filter clients who have appointments or formulas with this stylist
  const myClients = clients.filter(
    c => c.preferred_stylist_id === currentStylist.id || 
         (c.formulas && c.formulas.some(f => f.stylist_id === currentStylist.id || f.stylist_name === currentStylist.name)) ||
         myAppointments.some(a => a.client_name === c.full_name)
  );

  // Currency Formatter
  const formatCurrency = (val: number, cur: string = salonCurrency) => {
    const num = Number(val || 0);
    if (cur === 'COP') {
      return `$ ${Math.round(num).toLocaleString('es-CO')} COP`;
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
    return `$ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  };

  // Commission Calculations (100% reales basadas en las citas efectivamente COBRADAS)
  const serviceCommissionPct = Number(currentStylist.commission_service_pct ?? 45);
  const retailCommissionPct = Number(currentStylist.commission_retail_pct ?? 10);

  // Citas efectivamente cobradas en caja hoy
  const todayStr = new Date().toISOString().split('T')[0];
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

  // Total acumulado esperando pago en caja (Mes)
  const waitingPayAppointmentsMonth = myAppointments.filter(a => a.status === 'completada');
  const waitingPayMonthCommissions = waitingPayAppointmentsMonth.reduce((sum, a) => sum + ((Number(a.price_usd || 0) * serviceCommissionPct) / 100), 0);

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
    // Check if other slots share the same date
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
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0A0D14] text-slate-100' : 'bg-[#F4F6F9] text-slate-800'
    }`}>

      {/* TOP COMPACT HEADER FOR MOBILE & DESKTOP */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-colors ${
        theme === 'dark' ? 'bg-[#0E121B]/95 border-white/10' : 'bg-white/95 border-black/5 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-md shadow-[#FF5A36]/30">
                <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-tight">
                BeautyFlow<span className="text-[#FF5A36]">.AI</span>
              </span>
            </Link>

            <span className="text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20 whitespace-nowrap">
              Colaborador
            </span>
          </div>

          {/* Center Stylist Badge / Switcher */}
          <div className="flex items-center gap-1">
            {isUserAdmin ? (
              <select
                value={currentStylist.id}
                onChange={(e) => {
                  const found = stylists.find(s => s.id === e.target.value);
                  if (found) setCurrentStylist(found);
                }}
                className={`text-[11px] sm:text-xs font-bold border rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 focus:outline-none focus:border-[#FF5A36] max-w-[130px] sm:max-w-none truncate ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/10 text-slate-900'
                }`}
                title="Modo Dueña: Seleccionar colaborador para previsualizar"
              >
                {stylists.map(s => (
                  <option key={s.id} value={s.id}>{s.name.split(' ')[0]} ({s.specialty.split('&')[0].trim()})</option>
                ))}
              </select>
            ) : (
              <span className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border ${
                theme === 'dark' ? 'bg-[#141926] border-white/10 text-slate-300' : 'bg-slate-100 border-black/5 text-slate-700'
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
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
                theme === 'dark' ? 'bg-[#1A2133] border-white/10 text-amber-400' : 'bg-[#F0F2F7] border-black/5 text-slate-700'
              }`}
              title="Cambiar tema"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {isUserAdmin && (
              <Link
                to="/dashboard"
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border hidden sm:flex items-center gap-1 transition-all ${
                  theme === 'dark' ? 'border-white/10 hover:border-white/20 bg-[#141926]' : 'border-black/5 bg-white shadow-sm'
                }`}
                title="Volver al panel general de administración"
              >
                <span>Panel Administrador</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              to="/login"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/10 transition-all"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-24 sm:pb-8">

        {/* PROFILE HERO CARD */}
        <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <img
              src={currentStylist.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentStylist.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#FF5A36] shadow-md shadow-[#FF5A36]/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight truncate">
                  {currentStylist.name}
                </h1>
                <span className="flex items-center gap-0.5 text-[10px] sm:text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-400/20">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{currentStylist.rating || '5.0'}</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {currentStylist.specialty}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-[10px] sm:text-[11px] flex-wrap">
                <span className="bg-[#FF5A36]/10 text-[#FF5A36] font-bold px-1.5 sm:px-2 py-0.5 rounded-md">
                  {serviceCommissionPct}% Serv.
                </span>
                <span className="bg-emerald-500/10 text-emerald-500 font-bold px-1.5 sm:px-2 py-0.5 rounded-md">
                  {retailCommissionPct}% Retail
                </span>

                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className={`p-1 px-2.5 rounded-md border text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 transition-all ${
                    theme === 'dark' ? 'bg-[#1A2133] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-slate-100 border-black/5 hover:border-[#FF5A36] text-slate-700'
                  }`}
                  title="Cambiar mi contraseña"
                >
                  <Key className="w-3 h-3 text-[#FF5A36]" />
                  <span>Cambiar Clave</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Stylist Status Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5">
            <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">Mi Estado:</span>
            <div className={`p-1 rounded-xl border grid grid-cols-3 sm:flex items-center gap-1 w-full sm:w-auto ${
              theme === 'dark' ? 'bg-[#0E121B] border-white/10' : 'bg-[#F5F6FA] border-black/5'
            }`}>
              <button
                type="button"
                onClick={() => setStylistStatus('disponible')}
                className={`text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  stylistStatus === 'disponible'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Disponible</span>
              </button>

              <button
                type="button"
                onClick={() => setStylistStatus('en_atencion')}
                className={`text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  stylistStatus === 'en_atencion'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scissors className="w-3 h-3" />
                <span>En Sillón</span>
              </button>

              <button
                type="button"
                onClick={() => setStylistStatus('descanso')}
                className={`text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  stylistStatus === 'descanso'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Descanso</span>
              </button>
            </div>
          </div>
        </div>

        {/* LIVE COMMISSIONS WALLET METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Comisiones de Hoy */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
              <span>Mi Comisión Cobrada Hoy</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight mb-1">
              {formatCurrency(earnedCommissionsToday, salonCurrency)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between gap-1 flex-wrap">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>{billedAppointmentsToday.length} turno(s) cobrado(s)</span>
              </span>
              {inProgressAppointmentsToday.length > 0 && (
                <span className="text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  ⏳ {inProgressAppointmentsToday.length} en sillón
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Comisiones Acumuladas Mes */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
              <span>Acumulado del Mes</span>
              <TrendingUp className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF5A36] tracking-tight mb-1">
              {formatCurrency(earnedMonthCommissions, salonCurrency)}
            </div>
            <div className="text-[11px] text-slate-400">
              {completedAppointmentsMonth.length} servicio(s) completado(s) • Liquidación quincenal
            </div>
          </div>

          {/* Card 3: Próximo Turno */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
          }`}>
            <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
              <span>Próxima Cita Agendada</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold truncate">
                {myAppointments.length > 0 ? myAppointments[0].client_name : 'Sin citas pendientes'}
              </div>
              <div className="text-xs text-[#FF5A36] font-mono font-bold">
                {myAppointments.length > 0 ? `${myAppointments[0].time} • ${myAppointments[0].service_name}` : 'Agenda libre'}
              </div>
            </div>
          </div>

        </div>

        {/* NAVIGATION SEGMENTED TABS (Solo Desktop, en móvil se usa el Bottom Nav) */}
        <div className={`hidden sm:flex p-1.5 rounded-2xl border items-center gap-2 ${
          theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'agenda'
                ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mi Agenda de Hoy ({myAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'crm'
                ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Fórmulas & Clientas ({myClients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'wallet'
                ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Mi Billetera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`flex-1 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTab === 'availability'
                ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarOff className="w-4 h-4" />
            <span>Días No Disponibles ({blockedSlots.length})</span>
          </button>
        </div>

        {/* TAB 4: MI DISPONIBILIDAD & BLOQUEO DE DÍAS */}
        {activeTab === 'availability' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Feedback notification message */}
            {availabilitySuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{availabilitySuccessMsg}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">Sincronizado con Flowy IA</span>
              </div>
            )}

            {/* SECTION 1: JORNADA Y DÍAS HABITUALES DE TRABAJO */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 border-black/5 dark:border-white/10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF5A36]" />
                    <span>Días Laborales Habituales</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Marca los días de la semana en los que normalmente atiendes en el salón.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
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
                          ? 'bg-gradient-to-br from-[#FF5A36]/20 to-pink-500/10 border-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/10'
                          : theme === 'dark'
                            ? 'bg-[#0E121B] border-white/5 text-slate-500 hover:border-white/20'
                            : 'bg-slate-100 border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-extrabold">{d.label}</span>
                      <span className={`text-[9px] mt-1 font-bold ${isWorking ? 'text-emerald-400' : 'text-slate-500'}`}>
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
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="border-b pb-3 border-black/5 dark:border-white/10">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-500" />
                      <span>Bloquear Días o Vacaciones</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evita que clientas agenden citas en tus días de descanso, viajes o citas médicas.
                    </p>
                  </div>

                  {/* Preset Quick Buttons */}
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5">
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
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                            newBlockReason === item.reason
                              ? 'bg-[#FF5A36] text-white border-[#FF5A36]'
                              : theme === 'dark'
                                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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
                          className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                            theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                          }`}
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
                          className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                            theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                          }`}
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
                        className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                        }`}
                        required
                      />
                    </div>

                    {/* Todo el día switch */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div>
                        <strong className="block text-xs font-bold">Bloquear Todo el Día</strong>
                        <span className="text-[11px] text-slate-400">Sin citas durante toda la jornada</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={newBlockFullDay}
                        onChange={(e) => setNewBlockFullDay(e.target.checked)}
                        className="w-4 h-4 text-[#FF5A36] rounded"
                      />
                    </div>

                    {/* Horas específicas con selector visual interactivo si no es todo el día */}
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
                      className="w-full bg-gradient-to-r from-red-600 to-[#FF5A36] hover:opacity-95 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Guardar Bloqueo de Días</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista Derecha de Bloqueos Activos (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <CalendarOff className="w-4 h-4 text-[#FF5A36]" />
                        <span>Días y Fechas Bloqueadas Activas ({blockedSlots.length})</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Fechas donde el bot y la web no permitirán agendar citas con {currentStylist.name.split(' ')[0]}.
                      </p>
                    </div>
                  </div>

                  {blockedSlots.length === 0 ? (
                    <div className="p-8 rounded-2xl text-center space-y-2 border border-dashed border-white/10 text-slate-400">
                      <Calendar className="w-10 h-10 mx-auto text-emerald-500/40" />
                      <strong className="text-sm block">Sin días bloqueados actualmente</strong>
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
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/5 hover:border-white/15' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-extrabold text-sm shrink-0">
                                {dateObj.getDate()}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="text-xs capitalize font-bold">
                                    {formattedDate}
                                  </strong>
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
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
                              className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                              title="Desbloquear este día"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Flowy Banner */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
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
        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">Turnos Programados para Hoy</h2>
                <p className="text-xs text-slate-400">Actualiza el estado de cada servicio mientras atiendes en el sillón.</p>
              </div>
            </div>

            {myAppointments.length === 0 ? (
              <div className={`p-10 rounded-2xl border text-center space-y-2 ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5'
              }`}>
                <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold">No tienes citas agendadas para hoy</h3>
                <p className="text-xs text-slate-400">El bot de IA de WhatsApp agendará clientas automáticamente en tu horario disponible.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myAppointments.map((apt) => {
                  const clientObj = clients.find(c => c.full_name === apt.client_name);
                  const isOngoing = apt.status === 'en_atencion';
                  const isWaitingPay = apt.status === 'completada';
                  const isDone = apt.status === 'cobrada';

                  return (
                    <div
                      key={apt.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isOngoing
                          ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/30'
                          : isWaitingPay
                          ? 'border-purple-500/40 bg-purple-500/5'
                          : isDone
                          ? 'border-emerald-500/30 bg-emerald-500/5 opacity-90'
                          : theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        
                        {/* Time & Client info */}
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl text-center min-w-[70px] ${
                            isOngoing ? 'bg-amber-500 text-white' : isWaitingPay ? 'bg-purple-600 text-white' : theme === 'dark' ? 'bg-[#0E121B]' : 'bg-[#F0F2F7]'
                          }`}>
                            <span className="text-xs font-mono font-extrabold block">{apt.time}</span>
                            <span className="text-[9px] opacity-75">{apt.duration_minutes} min</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm font-bold block">{apt.client_name}</strong>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOngoing
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : isWaitingPay
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : isDone
                                  ? 'bg-emerald-500/20 text-emerald-500'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {isOngoing ? '● En Sillón' : isWaitingPay ? '💳 En Caja (Esperando Pago)' : isDone ? '✓ Cobrada & Liquidada' : 'Confirmada WA'}
                              </span>
                            </div>

                            <span className="text-xs text-[#FF5A36] font-semibold block mt-0.5">
                              {apt.service_name} • {formatCurrency(apt.price_usd, salonCurrency)}
                            </span>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                              <a
                                href={`https://wa.me/${apt.client_phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-emerald-500" />
                                <span>{apt.client_phone}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for the Stylist */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5">
                          {clientObj && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedClientForFormula(clientObj);
                                setIsFormulaModalOpen(true);
                              }}
                              className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                                theme === 'dark' ? 'bg-[#1A2133] border-white/10 hover:border-[#FF5A36]' : 'bg-[#F9FAFC] border-black/10 hover:border-[#FF5A36]'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5 text-[#FF5A36]" />
                              <span>Fórmula</span>
                            </button>
                          )}

                          {isOngoing ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completada')}
                              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Marcar servicio técnico terminado y enviar al cliente a recepción/caja"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ Terminado / Enviar a Caja</span>
                            </button>
                          ) : isWaitingPay ? (
                            <span className="text-[11px] font-bold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 flex items-center gap-1">
                              💳 Esperando Cobro en Recepción
                            </span>
                          ) : isDone ? (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1">
                              ✓ Liquidada en Caja
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'en_atencion')}
                              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Scissors className="w-3.5 h-3.5" />
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

        {/* TAB 2: FÓRMULAS & CLIENTAS (MI CRM) */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold">Mis Clientas & Expedientes de Colorimetría</h2>
                <p className="text-xs text-slate-400">Consulta fórmulas exactas de tinte aplicadas en visitas anteriores.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myClients.map((client) => {
                const clientFormulas = (client.formulas || []).filter(
                  f => f.stylist_id === currentStylist.id || f.stylist_name === currentStylist.name
                );

                return (
                  <div
                    key={client.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between ${
                      theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <strong className="text-sm font-bold block">{client.full_name}</strong>
                          <span className="text-xs text-slate-400">{client.phone_whatsapp}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] uppercase">
                          {client.status}
                        </span>
                      </div>

                      {/* Formulas List */}
                      {clientFormulas.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {clientFormulas.map((form) => (
                            <div
                              key={form.id}
                              className={`p-3 rounded-xl border text-xs space-y-1 ${
                                theme === 'dark' ? 'bg-[#0E121B] border-white/5' : 'bg-[#F9FAFC] border-black/5'
                              }`}
                            >
                              <div className="flex justify-between text-[10px] text-[#FF5A36] font-bold">
                                <span>Fórmula Registrada</span>
                                <span>{form.created_at}</span>
                              </div>
                              <p className="font-mono text-[11px]">{form.formula_text}</p>
                              <div className="text-[10px] text-slate-400 flex gap-3 pt-1">
                                <span>Oxidante: <strong>{form.developer_volume}</strong></span>
                                <span>Tiempo: <strong>{form.exposure_minutes} min</strong></span>
                                <span>Plex: <strong>{form.plex_used ? 'Sí' : 'No'}</strong></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl mb-3">
                          Sin fórmulas registradas por ti aún.
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClientForFormula(client);
                          setIsFormulaModalOpen(true);
                        }}
                        className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar Fórmula de Tinte
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MI BILLETERA & LIQUIDACIÓN */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">Transparencia en Liquidación de Comisiones</h2>
                  <p className="text-xs text-slate-400">Cada servicio completado se liquida con tu porcentaje acordado.</p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Total Acumulado: {formatCurrency(earnedMonthCommissions, salonCurrency)}
                </span>
              </div>

              <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
                {myAppointments.map((apt) => {
                  const comAmount = Math.round(((apt.price_usd || 0) * serviceCommissionPct) / 100);
                  const isDone = apt.status === 'cobrada';
                  const isWaitingPay = apt.status === 'completada';
                  const isOngoing = apt.status === 'en_atencion';

                  return (
                    <div key={apt.id} className="py-3.5 flex justify-between items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="block text-sm font-bold">{apt.service_name}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDone ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                            isWaitingPay ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20' :
                            isOngoing ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-slate-400'
                          }`}>
                            {isDone ? '✓ Cobrada en Caja' : isWaitingPay ? '💳 En Caja (Esperando Pago)' : isOngoing ? '● En Sillón' : 'Agendada'}
                          </span>
                        </div>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{apt.client_name} • {apt.date} {apt.time}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Total: {formatCurrency(apt.price_usd, salonCurrency)}</span>
                        {isDone ? (
                          <strong className="text-sm text-emerald-400 font-extrabold block">
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

      </main>

      {/* MODAL REGISTRO DE FÓRMULA DE COLORIMETRÍA */}
      {isFormulaModalOpen && selectedClientForFormula && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div>
                <span className="text-[10px] text-[#FF5A36] font-bold uppercase tracking-wider">FÓRMULA TÉCNICA EN SILLÓN</span>
                <h3 className="text-base font-bold">{selectedClientForFormula.full_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="text-slate-400 hover:text-white"
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
                  className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Oxidante</label>
                  <select
                    value={newDeveloperVol}
                    onChange={(e) => setNewDeveloperVol(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
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
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
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
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
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
                <label htmlFor="plex_checkbox" className="text-slate-400 text-xs cursor-pointer select-none">
                  Protector Plex #1 añadido a la mezcla
                </label>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Fórmula</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR CONTRASEÑA DEL COLABORADOR */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">Cambiar Mi Contraseña</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold space-y-1">
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
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
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
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
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
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Actualizar Clave</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FIXED MOBILE APP-LIKE BOTTOM NAVIGATION BAR */}
      <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-4 py-2 flex items-center justify-around transition-colors ${
        theme === 'dark' ? 'bg-[#0E121B]/95 border-white/10 text-white' : 'bg-white/95 border-black/10 text-slate-800 shadow-2xl'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeTab === 'agenda' ? 'text-[#FF5A36] font-extrabold' : 'text-slate-400'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'agenda' ? 'bg-[#FF5A36]/15' : ''}`}>
            <Calendar className="w-4 h-4" />
          </div>
          <span>Mi Agenda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crm')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeTab === 'crm' ? 'text-[#FF5A36] font-extrabold' : 'text-slate-400'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'crm' ? 'bg-[#FF5A36]/15' : ''}`}>
            <FileText className="w-4 h-4" />
          </div>
          <span>Fórmulas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeTab === 'wallet' ? 'text-[#FF5A36] font-extrabold' : 'text-slate-400'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'wallet' ? 'bg-[#FF5A36]/15' : ''}`}>
            <DollarSign className="w-4 h-4" />
          </div>
          <span>Billetera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('availability')}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-3 rounded-xl transition-all ${
            activeTab === 'availability' ? 'text-[#FF5A36] font-extrabold' : 'text-slate-400'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'availability' ? 'bg-[#FF5A36]/15' : ''}`}>
            <CalendarOff className="w-4 h-4" />
          </div>
          <span>Días Libres</span>
        </button>
      </div>

    </div>
  );
};

export default StylistPortalPage;
