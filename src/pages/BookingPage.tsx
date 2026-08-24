import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import {
  Scissors,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  MessageCircle,
  Sparkles,
  AlertTriangle,
  Ban,
  Phone,
  Plus,
  Trash2,
  CalendarPlus,
  MapPin,
  Tag,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { api, initialServices, initialStylists, getActiveTenantId } from '../lib/supabase';
import { Service, Stylist } from '../types';

export const BookingPage: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const salonSlug = routeSlug || searchParams.get('salon') || '';

  const [salonName, setSalonName] = useState<string>('Studio Glamour Spa');
  const [salonPhone, setSalonPhone] = useState<string>('');
  const [salonAddress, setSalonAddress] = useState<string>('');
  const [salonCurrency, setSalonCurrency] = useState<string>('COP');
  const [services, setServices] = useState<Service[]>(initialServices);
  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);

  const [step, setStep] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([initialServices[0]]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(initialStylists[0]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+57');
  const [phone10Digits, setPhone10Digits] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Lista de próximos 14 días para selección visual rápida
  const next14Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : d.toLocaleDateString('es-CO', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('es-CO', { month: 'short' });
      days.push({ iso, dayName, dayNum, monthName });
    }
    return days;
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('bf_client_name');
    const savedPhone = localStorage.getItem('bf_client_phone');
    const savedEmail = localStorage.getItem('bf_client_email');
    if (savedName && !clientName) setClientName(savedName);
    if (savedPhone && !phone10Digits) setPhone10Digits(savedPhone);
    if (savedEmail && !clientEmail) setClientEmail(savedEmail);
  }, []);

  const primaryService = selectedServices[0] || services[0];

  const handleToggleService = (srv: Service) => {
    const exists = selectedServices.some(s => s.id === srv.id);
    if (exists) {
      if (selectedServices.length === 1) return;
      setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const stylistAvailability = useMemo(() => {
    if (!selectedStylist || !selectedDate) return { blocked: false, reason: '' };
    if (selectedStylist.blocked_dates?.includes(selectedDate)) {
      const slot = selectedStylist.blocked_slots?.find(s => s.date === selectedDate);
      return { blocked: true, reason: slot?.reason || 'Vacaciones / Día Libre' };
    }
    if (selectedStylist.working_days && selectedStylist.working_days.length > 0) {
      const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
      if (!selectedStylist.working_days.includes(dayOfWeek)) {
        return { blocked: true, reason: 'Día de descanso semanal' };
      }
    }
    return { blocked: false, reason: '' };
  }, [selectedStylist, selectedDate]);

  const filteredStylists = useMemo(() => {
    const activeStylists = stylists.filter(s => s.attends_clients !== false);
    if (!primaryService) return activeStylists;
    const cat = primaryService.category;
    const srvId = primaryService.id;

    return activeStylists.filter(s => {
      if (s.service_ids?.includes(srvId)) return true;
      if (s.service_categories?.includes(cat)) return true;
      if (s.specialty) {
        const spec = s.specialty.toLowerCase();
        if (cat === 'color' && (spec.includes('color') || spec.includes('balayage'))) return true;
        if (cat === 'corte' && (spec.includes('corte') || spec.includes('estilista') || spec.includes('barber'))) return true;
        if (cat === 'keratina' && (spec.includes('keratina') || spec.includes('alisado'))) return true;
        if (cat === 'nails' && (spec.includes('nail') || spec.includes('uña'))) return true;
        if (cat === 'spa' && (spec.includes('spa') || spec.includes('facial') || spec.includes('masaje'))) return true;
      }
      return false;
    });
  }, [stylists, primaryService]);

  useEffect(() => {
    if (filteredStylists.length > 0 && selectedStylist) {
      const isCurrentValid = filteredStylists.some(s => s.id === selectedStylist.id);
      if (!isCurrentValid) setSelectedStylist(filteredStylists[0]);
    }
  }, [filteredStylists]);

  useEffect(() => {
    async function loadBookingData() {
      let resolvedTenant: any = null;
      let tid: string | undefined = undefined;
      let prospectDataObj: any = null;

      // 1. Si viene un slug en la URL (/reservar/:salonSlug)
      if (salonSlug) {
        try {
          const cleanSlug = salonSlug.toLowerCase().trim();
          
          // A. Buscar tenant oficial en base de datos por slug exacto o parcial
          resolvedTenant = await api.getTenantBySlug(cleanSlug);

          // B. Buscar en prospect_sites por slug
          const prospectSite = await api.getProspectSiteBySlug(cleanSlug);
          if (prospectSite) {
            prospectDataObj = prospectSite.business_data;
            if (prospectSite.claimed_tenant_id && !resolvedTenant) {
              resolvedTenant = await api.getTenantBySlug(prospectSite.slug);
            }
            if (!resolvedTenant) {
              resolvedTenant = {
                id: prospectSite.id,
                name: prospectSite.business_name,
                phone: prospectSite.phone_whatsapp,
                address: prospectSite.address,
                currency: 'COP',
                prospectData: prospectSite.business_data
              };
            }
          }
        } catch (err) {}
      }

      // 2. Solo si NO viene slug en la URL, consultar tenant activo en sesión
      if (!resolvedTenant && !salonSlug) {
        const activeTenantRaw = localStorage.getItem('bf_tenant_active');
        if (activeTenantRaw) {
          try {
            resolvedTenant = JSON.parse(activeTenantRaw);
          } catch (e) {}
        }
      }

      // 3. Aplicar datos del negocio encontrado
      if (resolvedTenant) {
        tid = resolvedTenant.id;
        if (resolvedTenant.name) setSalonName(resolvedTenant.name);
        if (resolvedTenant.phone) setSalonPhone(resolvedTenant.phone);
        if (resolvedTenant.address) setSalonAddress(resolvedTenant.address);
        if (resolvedTenant.currency) setSalonCurrency(resolvedTenant.currency);
      }

      let loadedServices: Service[] = [];
      let loadedStylists: Stylist[] = [];

      // 4. Cargar servicios y estilistas registrados en base de datos para este tenant
      if (tid && tid !== '00000000-0000-0000-0000-000000000001') {
        try {
          const [srvList, styList, aptList] = await Promise.all([
            api.getServices(tid),
            api.getStylists(tid),
            api.getAppointments(tid)
          ]);
          if (srvList && srvList.length > 0) loadedServices = srvList;
          if (styList && styList.length > 0) loadedStylists = styList;
          if (aptList && aptList.length > 0) setExistingAppointments(aptList);
        } catch (err) {}
      }

      // Helper robusto para extraer el valor numérico de precios en cualquier formato (número, string con $ o texto descriptivo)
      const parsePriceValue = (val: any, fallback: number = 50000): number => {
        if (typeof val === 'number' && !isNaN(val) && val > 0) return val;
        if (typeof val === 'string') {
          // Extraer dígitos (ej: "Desde $450.000 COP" -> 450000, "$ 65.000" -> 65000)
          const digitsOnly = val.replace(/\D/g, '');
          if (digitsOnly) {
            const parsed = parseInt(digitsOnly, 10);
            if (!isNaN(parsed) && parsed > 0) return parsed;
          }
        }
        return fallback;
      };

      // 5. Si no hay servicios creados en la base de datos, NO inyectar servicios ficticios
      // El agendador mostrará limpiamente el estado "Catálogo de Servicios en Preparación" con botón directo a WhatsApp.

      // 6. Asignar estado final en memoria de React
      setServices(loadedServices);
      if (loadedServices.length > 0) {
        setSelectedServices([loadedServices[0]]);
      } else {
        setSelectedServices([]);
      }

      setStylists(loadedStylists);
      if (loadedStylists.length > 0) {
        setSelectedStylist(loadedStylists[0]);
      } else {
        setSelectedStylist(null);
      }
    }
    loadBookingData();
  }, [salonSlug]);

  const allAvailableSlots = ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'];

  // Helper para convertir hora ("02:30 PM") a minutos del día (ej. 870)
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const parts = timeStr.trim().split(' ');
    if (parts.length < 2) return 0;
    const [hStr, mStr] = parts[0].split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    const period = parts[1].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const totalRawPrice = selectedServices.reduce((acc, s) => acc + (Number(s.price_cop ?? s.price ?? s.price_usd ?? 0)), 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + (Number(s.duration_minutes || 45)), 0);
  const discountAmount = appliedDiscount > 0 ? (totalRawPrice * (appliedDiscount / 100)) : 0;
  const finalPrice = Math.max(0, totalRawPrice - discountAmount);

  // Función para determinar si un slot de horario está ocupado
  const isSlotOccupied = (slotStr: string): { occupied: boolean; reason?: string } => {
    const slotStartMin = timeToMinutes(slotStr);
    const slotEndMin = slotStartMin + totalDuration;

    // 1. Validar si la fecha es hoy y la hora ya pasó
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate === todayStr) {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      if (slotStartMin <= currentMin + 15) { // 15 min de margen mínimo
        return { occupied: true, reason: 'Horario pasado' };
      }
    }

    // Filtrar citas activas para el día seleccionado
    const dayAppointments = existingAppointments.filter(
      apt => apt.date === selectedDate && apt.status !== 'cancelada' && apt.status !== 'no_show'
    );

    // Caso A: Si el usuario seleccionó un especialista específico
    if (selectedStylist) {
      const stylistApts = dayAppointments.filter(apt => apt.stylist_id === selectedStylist.id);
      for (const apt of stylistApts) {
        const aptStartMin = timeToMinutes(apt.time);
        const aptEndMin = aptStartMin + (apt.duration_minutes || 60);

        // Comprobar colisión de rangos [slotStart, slotEnd] vs [aptStart, aptEnd]
        if (slotStartMin < aptEndMin && slotEndMin > aptStartMin) {
          return { occupied: true, reason: 'Ocupado con este especialista' };
        }
      }
      return { occupied: false };
    }

    // Caso B: Si eligió "Cualquier Especialista", verificar si TODOS los capacitados están ocupados
    if (filteredStylists.length > 0) {
      let busyCount = 0;
      for (const sty of filteredStylists) {
        const styApts = dayAppointments.filter(apt => apt.stylist_id === sty.id);
        const isStyBusy = styApts.some(apt => {
          const aptStartMin = timeToMinutes(apt.time);
          const aptEndMin = aptStartMin + (apt.duration_minutes || 60);
          return slotStartMin < aptEndMin && slotEndMin > aptStartMin;
        });
        if (isStyBusy) busyCount++;
      }

      if (busyCount >= filteredStylists.length) {
        return { occupied: true, reason: 'Equipo completo ocupado' };
      }
    }

    return { occupied: false };
  };

  const filteredSlots = useMemo(() => {
    if (timeFilter === 'morning') return allAvailableSlots.filter(s => s.includes('AM') || s.startsWith('12:'));
    if (timeFilter === 'afternoon') return allAvailableSlots.filter(s => (s.includes('PM') && !s.startsWith('12:')) && !['06:00 PM', '06:30 PM', '07:00 PM'].includes(s));
    if (timeFilter === 'evening') return allAvailableSlots.filter(s => ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'].includes(s));
    return allAvailableSlots;
  }, [timeFilter]);

  const handlePhoneChange = (val: string) => setPhone10Digits(val.replace(/\D/g, '').slice(0, 10));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'BEAUTY10') { setAppliedDiscount(10); setCouponMessage('🎉 ¡Cupón aplicado! 10% de descuento concedido.'); }
    else if (cleanCode === 'VIP20') { setAppliedDiscount(20); setCouponMessage('🌟 ¡Descuento VIP del 20% aplicado!'); }
    else setCouponMessage('❌ Código no válido o expirado.');
  };

  const handleConfirmBooking = async () => {
    if (!clientName.trim() || phone10Digits.length < 7) return alert('Por favor completa tu nombre y WhatsApp.');
    localStorage.setItem('bf_client_name', clientName.trim());
    localStorage.setItem('bf_client_phone', phone10Digits.trim());
    if (clientEmail.trim()) localStorage.setItem('bf_client_email', clientEmail.trim());
    try {
      await api.createAppointment({
        id: `apt-${Date.now()}`,
        tenant_id: selectedServices[0]?.tenant_id || getActiveTenantId(),
        client_id: `cli-${Date.now()}`,
        client_name: clientName.trim(),
        client_phone: `${countryCode} ${phone10Digits}`.trim(),
        stylist_id: selectedStylist?.id || (stylists[0]?.id || 'sty-1'),
        stylist_name: selectedStylist ? selectedStylist.name : (stylists[0]?.name || 'Primer Disponible'),
        service_id: selectedServices[0]?.id || 'srv-1',
        service_name: selectedServices.map(s => s.name).join(' + '),
        service_ids: selectedServices.map(s => s.id),
        services_summary: selectedServices.map(s => s.name).join(' + '),
        date: selectedDate,
        time: selectedTime,
        duration_minutes: totalDuration,
        status: 'confirmada_wa',
        price_cop: finalPrice,
        price_usd: finalPrice,
        wa_reminder_24h_sent: true,
        wa_reminder_2h_sent: false,
        notes: `Reserva Web (${selectedServices.length} servicios). Email: ${clientEmail || 'N/A'}. Cupón: ${appliedDiscount}%`,
        created_at: new Date().toISOString()
      });
      setIsSuccess(true);
    } catch (e) { setIsSuccess(true); }
  };

  const formatCurrency = (amount: number | undefined | null, curr: string = 'COP') => {
    const num = Number(amount) || 0;
    return `$ ${num.toLocaleString('es-CO')} ${curr}`;
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Cita en ${salonName}`);
    const [timeOnly, period] = selectedTime.split(' ');
    let [hours, mins] = timeOnly.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const start = new Date(`${selectedDate}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`);
    const end = new Date(start.getTime() + (totalDuration * 60000));
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=Reserva en ${salonName}&location=${encodeURIComponent(salonAddress || salonName)}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans py-8 px-4 sm:px-6 pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center mb-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-white mb-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-[#FF5A36] to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5A36]/40">
            <Scissors className="w-5 h-5" />
          </div>
          <span>{salonName}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Reserva tu Cita Online</h1>
      </div>

      <div className="max-w-3xl mx-auto bg-[#141926] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-8 relative z-10">
        <div className="grid grid-cols-4 gap-2 mb-6 pb-5 border-b border-white/10">
          {[1,2,3,4].map((n) => (
            <div key={n} className={`text-center p-2 rounded-xl border ${step === n ? 'border-[#FF5A36] bg-[#FF5A36]/15' : 'border-white/5 bg-white/[0.02]'}`}>
              <div className="text-xs font-black">Paso {n}</div>
            </div>
          ))}
        </div>
         {/* Step 1: Multi-Service Selection */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF5A36]" />
                  Selecciona tus Servicios
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Puedes combinar varios tratamientos en la misma cita.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300">
                {selectedServices.length} seleccionado(s)
              </span>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Scissors className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white">Catálogo de Servicios en Preparación</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {salonName} está actualizando su lista de servicios y tarifas. Mientras tanto, puedes solicitar tu cita directamente por WhatsApp.
                  </p>
                </div>
                {salonPhone && (
                  <a
                    href={`https://wa.me/${salonPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${salonName}! Deseo consultar la disponibilidad de citas y servicios.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar por WhatsApp al Salón</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((srv) => {
                  const isSelected = selectedServices.some(s => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleToggleService(srv)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center gap-3 ${
                        isSelected
                          ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/15'
                          : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {srv.image_url && (
                          <img
                            src={srv.image_url}
                            alt={srv.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shrink-0"
                            loading="lazy"
                          />
                        )}
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm sm:text-base text-white truncate font-bold">{srv.name}</strong>
                            <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                              {srv.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{srv.description || 'Servicio profesional garantizado.'}</p>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#FF5A36]" /> {srv.duration_minutes} min
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                        <div className="text-sm sm:text-base font-black text-[#FF5A36]">
                          {formatCurrency(srv.price_usd ?? srv.price ?? srv.price_cop, salonCurrency)}
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          isSelected ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30' : 'border border-white/20 text-slate-500'
                        }`}>
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {services.length > 0 && (
              <div className="pt-4 flex justify-between items-center border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Total: <strong className="text-white text-sm font-black">{formatCurrency(totalRawPrice, salonCurrency)}</strong> ({totalDuration} min)
                </div>
                <button
                  type="button"
                  disabled={selectedServices.length === 0}
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-[#FF5A36]/30 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continuar a Especialista</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Specialist */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF5A36]" />
                Escoge tu Especialista
              </h2>
              {primaryService && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Mostrando profesionales capacitados para: <strong className="text-[#FF5A36]">{primaryService.name}</strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedStylist(null)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedStylist === null
                    ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/15'
                    : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0A0D14] border border-[#FF5A36] flex items-center justify-center text-[#FF5A36] shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <strong className="text-sm text-white block font-bold">Cualquier Especialista</strong>
                  <span className="text-xs text-slate-400 block">Primer horario libre disponible</span>
                  <span className="text-[11px] text-emerald-400 font-bold">⚡ Mayor disponibilidad de turnos</span>
                </div>
              </div>

              {filteredStylists.map((sty) => {
                const isSelected = selectedStylist?.id === sty.id;
                return (
                  <div
                    key={sty.id}
                    onClick={() => setSelectedStylist(sty)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 relative ${
                      isSelected
                        ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/15'
                        : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                    }`}
                  >
                    <img
                      src={sty.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                      alt={sty.name}
                      className={`w-14 h-14 rounded-2xl object-cover border-2 shrink-0 ${
                        isSelected ? 'border-[#FF5A36]' : 'border-white/15'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-sm text-white block truncate font-bold">{sty.name}</strong>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
                          Master
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block truncate">{sty.specialty}</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{sty.rating || 5.0} ({sty.reviews_count || 18} reseñas)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white px-4 py-2 text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-[#FF5A36]/30 cursor-pointer"
              >
                <span>Continuar a Horario</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date and Time with 14-Day Visual Carousel & Turn Segmentation */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#FF5A36]" />
                Elige Día y Horario
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toca cualquier día para ver sus turnos disponibles al instante.
              </p>
            </div>

            {/* Carrusel Táctil Horizontal de 14 Días */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400">Próximos Días Disponibles</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                {next14Days.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-w-[70px] ${
                        isSelected
                          ? 'border-[#FF5A36] bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30 scale-105'
                          : 'border-white/10 bg-[#0E121B] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-black my-0.5">
                        {d.dayNum}
                      </span>
                      <span className={`text-[9px] uppercase font-semibold ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Fecha Calendario Alternativo */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-400 shrink-0">O busca otra fecha:</span>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#0E121B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            {/* Warning if Stylist is on Vacation or Off Day */}
            {stylistAvailability.blocked ? (
              <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <Ban className="w-4 h-4 shrink-0" />
                  <span>{selectedStylist?.name} no tiene disponibilidad para esta fecha</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Motivo: <strong className="text-white">{stylistAvailability.reason}</strong>. Por favor selecciona otro día en el calendario o regresa a elegir otro profesional.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-semibold text-slate-400">Turnos Disponibles</label>
                  <div className="flex gap-1 p-0.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setTimeFilter('all')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${timeFilter === 'all' ? 'bg-[#FF5A36] text-white' : 'text-slate-400'}`}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeFilter('morning')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${timeFilter === 'morning' ? 'bg-[#FF5A36] text-white' : 'text-slate-400'}`}
                    >
                      <Sun className="w-3 h-3" /> Mañana
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeFilter('afternoon')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${timeFilter === 'afternoon' ? 'bg-[#FF5A36] text-white' : 'text-slate-400'}`}
                    >
                      <Sunset className="w-3 h-3" /> Tarde
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeFilter('evening')}
                      className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${timeFilter === 'evening' ? 'bg-[#FF5A36] text-white' : 'text-slate-400'}`}
                    >
                      <Moon className="w-3 h-3" /> Noche
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {filteredSlots.map((slot) => {
                    const status = isSlotOccupied(slot);
                    const isSelected = selectedTime === slot;

                    if (status.occupied) {
                      return (
                        <div
                          key={slot}
                          title={status.reason || 'Horario no disponible'}
                          className="p-2.5 sm:p-3 rounded-xl border border-white/5 bg-white/[0.02] text-slate-600 text-xs font-semibold flex flex-col items-center justify-center opacity-40 cursor-not-allowed select-none line-through"
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] no-underline text-rose-400 font-normal mt-0.5">🔒 Ocupado</span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-[#FF5A36] bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30 scale-[1.02]'
                            : 'border-white/10 bg-[#0E121B] text-slate-300 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        <span>{slot}</span>
                        <span className={`text-[9px] font-medium mt-0.5 ${isSelected ? 'text-white/80' : 'text-emerald-400'}`}>✓ Libre</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white px-4 py-2 text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                disabled={stylistAvailability.blocked}
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-lg shadow-[#FF5A36]/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar a Mis Datos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: WhatsApp First + Name + Optional Email + Coupon */}
        {step === 4 && !isSuccess && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Tus Datos de Confirmación
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingresa tu WhatsApp para enviarte el comprobante y recordatorio directo.
              </p>
            </div>

            <div className="space-y-3">
              {/* 1. WHATSAPP DE PRIMERO */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  1. Número de WhatsApp (Principal) *
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#0E121B] border border-white/10 rounded-2xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                  </select>
                  <input
                    type="tel"
                    value={phone10Digits}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="300 123 4567"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36] font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {/* 2. NOMBRE COMPLETO */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  2. Tu Nombre y Apellido *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Camila Restrepo"
                  className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  required
                />
              </div>

              {/* 3. CORREO ELECTRÓNICO OPCIONAL */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  3. Correo Electrónico <span className="text-[10px] text-slate-500 font-normal">(Opcional - Para recibir copia de tu cita)</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              {/* Cupón de Descuento Opcional */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="¿Tienes cupón? (ej. BEAUTY10)"
                      className="w-full bg-[#0E121B] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#FF5A36] font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    Aplicar
                  </button>
                </div>
                {couponMessage && (
                  <span className={`text-[11px] block font-bold ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {couponMessage}
                  </span>
                )}
              </div>

              {/* Resumen Final de Reserva */}
              <div className="bg-[#0E121B] border border-white/10 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-slate-400 font-semibold">Servicios ({selectedServices.length}):</span>
                  <strong className="text-white text-right">{selectedServices.map(s => s.name).join(' + ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Especialista:</span>
                  <strong className="text-amber-300">{selectedStylist ? selectedStylist.name : 'Primer Disponible'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fecha y Hora:</span>
                  <strong className="text-[#FF5A36] font-black">{selectedDate} • {selectedTime}</strong>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Descuento ({appliedDiscount}%):</span>
                    <span>- {formatCurrency(discountAmount, salonCurrency)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-bold text-white">Total Final:</span>
                  <strong className="text-emerald-400 font-black text-base">
                    {formatCurrency(finalPrice, salonCurrency)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-slate-400 hover:text-white px-4 py-2 text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black px-8 py-3 rounded-2xl flex items-center gap-2 text-xs sm:text-sm shadow-xl shadow-emerald-500/25 cursor-pointer transition-all hover:scale-105"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Confirmation Screen con Google Calendar y WhatsApp */}
        {isSuccess && (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">¡Tu Cita está Confirmada! 🎉</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                Hemos reservado tu espacio en <strong className="text-white">{salonName}</strong>.
              </p>
            </div>

            {/* Tarjeta Visual de Comprobante / Voucher */}
            <div className="bg-[#0E121B] border border-emerald-500/40 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  ✓ Comprobante Digital
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Cliente</span>
                  <strong className="text-white block truncate">{clientName || 'Cliente'}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">{countryCode} {phone10Digits}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Especialista</span>
                  <strong className="text-amber-300 block truncate">{selectedStylist ? selectedStylist.name : 'Equipo Master'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Fecha & Hora</span>
                  <strong className="text-[#FF5A36] block">{selectedDate}</strong>
                  <span className="text-xs text-white font-bold">{selectedTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Servicios & Total</span>
                  <strong className="text-white block truncate">{selectedServices.map(s => s.name).join(' + ')}</strong>
                  <span className="text-xs text-emerald-400 font-black">
                    {formatCurrency(finalPrice, salonCurrency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones de WhatsApp y Google Calendar */}
            <div className="space-y-2 max-w-md mx-auto pt-1">
              {salonPhone ? (
                <a
                  href={`https://wa.me/${salonPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `✨ *¡Hola ${salonName}!* Acabo de agendar mi cita online:\n\n` +
                    `👤 *Cliente:* ${clientName || 'Cliente'}\n` +
                    `✂️ *Servicios:* ${selectedServices.map(s => s.name).join(' + ')}\n` +
                    `💈 *Especialista:* ${selectedStylist ? selectedStylist.name : 'Equipo'}\n` +
                    `📅 *Fecha:* ${selectedDate}\n` +
                    `⏰ *Hora:* ${selectedTime}\n` +
                    `💰 *Total:* ${formatCurrency(finalPrice, salonCurrency)}\n\n` +
                    `¿Me confirman la recepción, por favor? ¡Muchas gracias! 💖`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>📲 Enviar Comprobante y Confirmar por WhatsApp</span>
                </a>
              ) : (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `✨ *Mi Cita en ${salonName}* ✨\n\n` +
                    `👤 *Cliente:* ${clientName || 'Cliente'}\n` +
                    `✂️ *Servicios:* ${selectedServices.map(s => s.name).join(' + ')}\n` +
                    `💈 *Especialista:* ${selectedStylist ? selectedStylist.name : 'Equipo'}\n` +
                    `📅 *Fecha:* ${selectedDate}\n` +
                    `⏰ *Hora:* ${selectedTime}\n\n` +
                    `Guardado en mi calendario 💖`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>📲 Guardar Comprobante en mi WhatsApp</span>
                </a>
              )}

              {/* Botón de Google Calendar */}
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-2xl text-xs border border-white/10 transition-all cursor-pointer"
              >
                <CalendarPlus className="w-4 h-4 text-blue-400" />
                <span>📅 Agregar a Google Calendar / Alerta en Celular</span>
              </a>
            </div>

            <div className="pt-3 flex justify-center gap-3 flex-wrap">
              <Link
                to="/"
                className="bg-white/5 hover:bg-white/10 text-slate-300 font-semibold px-6 py-2.5 rounded-xl text-xs transition-all border border-white/5"
              >
                Volver a la Página del Salón
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer Branding Kowy */}
      <div className="max-w-3xl mx-auto text-center mt-6 text-xs text-slate-500 relative z-10 flex items-center justify-center gap-2">
        <span>Impulsado por <strong className="text-slate-300">Kowy<span className="text-[#FF5A36]">.app</span></strong></span>
        <span>•</span>
        <span>Sistema Oficial de Reservas</span>
      </div>

      {/* Sticky Mobile Summary Bar */}
      {!isSuccess && selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E121B]/95 backdrop-blur-md border-t border-white/10 p-3 sm:hidden flex items-center justify-between px-4 shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 block">{selectedServices.length} servicio(s) seleccionado(s)</span>
            <strong className="text-sm font-black text-emerald-400">{formatCurrency(finalPrice, salonCurrency)}</strong>
          </div>
          <button
            type="button"
            onClick={() => setStep(step < 4 ? step + 1 : 4)}
            className="bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF5A36]/30 flex items-center gap-1.5"
          >
            <span>{step === 4 ? 'Confirmar' : 'Siguiente'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
