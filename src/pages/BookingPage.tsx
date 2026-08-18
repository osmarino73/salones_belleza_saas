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
  Phone
} from 'lucide-react';
import { api, initialServices, initialStylists, getActiveTenantId } from '../lib/supabase';
import { Service, Stylist } from '../types';

export const BookingPage: React.FC = () => {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const salonSlug = routeSlug || searchParams.get('salon') || '';

  const [salonName, setSalonName] = useState<string>('Studio Glamour Spa');
  const [salonPhone, setSalonPhone] = useState<string>('');
  const [salonCurrency, setSalonCurrency] = useState<string>('COP');
  const [services, setServices] = useState<Service[]>(initialServices);
  const [stylists, setStylists] = useState<Stylist[]>(initialStylists);

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service>(initialServices[0]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(initialStylists[0]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [clientName, setClientName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+57');
  const [phone10Digits, setPhone10Digits] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Check if stylist is blocked on selected date or if day of week is non-working
  const stylistAvailability = useMemo(() => {
    if (!selectedStylist || !selectedDate) return { blocked: false, reason: '' };

    // 1. Specific blocked dates / vacations
    if (selectedStylist.blocked_dates?.includes(selectedDate)) {
      const slot = selectedStylist.blocked_slots?.find(s => s.date === selectedDate);
      return {
        blocked: true,
        reason: slot?.reason || 'Vacaciones / Día Libre'
      };
    }

    // 2. Standard working days (0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab)
    if (selectedStylist.working_days && selectedStylist.working_days.length > 0) {
      const dayOfWeek = new Date(selectedDate + 'T00:00:00').getDay();
      if (!selectedStylist.working_days.includes(dayOfWeek)) {
        return {
          blocked: true,
          reason: 'Día de descanso semanal'
        };
      }
    }

    return { blocked: false, reason: '' };
  }, [selectedStylist, selectedDate]);

  // Filter stylists that can perform the selected service
  const filteredStylists = useMemo(() => {
    const activeStylists = stylists.filter(s => s.attends_clients !== false);
    if (!selectedService) return activeStylists;
    const cat = selectedService.category;
    const srvId = selectedService.id;

    const matched = activeStylists.filter(s => {
      // 1. Exact service ID match
      if (s.service_ids && s.service_ids.length > 0) {
        if (s.service_ids.includes(srvId)) return true;
      }
      // 2. Service category match
      if (s.service_categories && s.service_categories.length > 0) {
        if (s.service_categories.includes(cat)) return true;
      }
      // 3. Fallback: Specialty keyword match
      if (s.specialty) {
        const spec = s.specialty.toLowerCase();
        if (cat === 'color' && (spec.includes('color') || spec.includes('balayage'))) return true;
        if (cat === 'corte' && (spec.includes('corte') || spec.includes('estilista') || spec.includes('barber'))) return true;
        if (cat === 'keratina' && (spec.includes('keratina') || spec.includes('alisado') || spec.includes('color') || spec.includes('estilista'))) return true;
        if (cat === 'nails' && (spec.includes('nail') || spec.includes('uña') || spec.includes('manicur'))) return true;
        if (cat === 'barberia' && (spec.includes('barber') || spec.includes('corte') || spec.includes('caballero'))) return true;
        if (cat === 'spa' && (spec.includes('spa') || spec.includes('facial') || spec.includes('masaje') || spec.includes('nail'))) return true;
      }
      return false;
    });

    return matched.length > 0 ? matched : activeStylists;
  }, [stylists, selectedService]);

  // Auto-select first matching stylist when service changes if current is not in list
  useEffect(() => {
    if (filteredStylists.length > 0 && selectedStylist) {
      const isCurrentValid = filteredStylists.some(s => s.id === selectedStylist.id);
      if (!isCurrentValid) {
        setSelectedStylist(filteredStylists[0]);
      }
    }
  }, [filteredStylists]);

  useEffect(() => {
    async function loadBookingData() {
      let targetTenantId: string | undefined = undefined;

      // 1. Cargar datos del salón activo desde LocalStorage
      const activeTenantRaw = localStorage.getItem('bf_tenant_active');
      if (activeTenantRaw) {
        try {
          const tenant = JSON.parse(activeTenantRaw);
          if (tenant.name) setSalonName(tenant.name);
          if (tenant.phone) setSalonPhone(tenant.phone);
          if (tenant.currency) setSalonCurrency(tenant.currency);
          if (tenant.id) targetTenantId = tenant.id;
        } catch (e) {}
      }

      // 2. Si hay slug en URL, buscar primero en prospect_sites (sitios gancho creados con DATOS_NEGOCIO.json)
      if (salonSlug) {
        try {
          const prospectSite = await api.getProspectSiteBySlug(salonSlug);
          if (prospectSite) {
            if (prospectSite.business_name) setSalonName(prospectSite.business_name);
            if (prospectSite.phone_whatsapp) setSalonPhone(prospectSite.phone_whatsapp);
            setSalonCurrency('COP');

            // Mapear servicios reales de DATOS_NEGOCIO.json si existen
            if (prospectSite.business_data?.servicios && prospectSite.business_data.servicios.length > 0) {
              const mappedSrvs: Service[] = prospectSite.business_data.servicios.map((s: any, idx: number) => {
                const titleLower = s.titulo.toLowerCase();
                let cat: Service['category'] = 'corte';
                if (titleLower.includes('color') || titleLower.includes('balayage') || titleLower.includes('tinte')) cat = 'color';
                else if (titleLower.includes('keratina') || titleLower.includes('alisad') || titleLower.includes('botox')) cat = 'keratina';
                else if (titleLower.includes('nail') || titleLower.includes('uña') || titleLower.includes('pedicur')) cat = 'nails';
                else if (titleLower.includes('barber') || titleLower.includes('fade')) cat = 'barberia';
                else if (titleLower.includes('facial') || titleLower.includes('spa') || titleLower.includes('masaje') || titleLower.includes('pestaña')) cat = 'spa';

                return {
                  id: `ps-srv-${idx + 1}`,
                  tenant_id: prospectSite.id,
                  name: s.titulo,
                  category: cat,
                  duration_minutes: s.duracion_minutos || 60,
                  price: s.precio_cop || (cat === 'color' ? 280000 : cat === 'spa' ? 120000 : 65000),
                  price_cop: s.precio_cop || (cat === 'color' ? 280000 : cat === 'spa' ? 120000 : 65000),
                  price_usd: s.precio_cop || (cat === 'color' ? 280000 : cat === 'spa' ? 120000 : 65000),
                  requires_patch_test: cat === 'color',
                  description: s.descripcion || `${s.titulo} profesional`
                };
              });
              setServices(mappedSrvs);
              setSelectedService(mappedSrvs[0]);
            }

            // Mapear especialistas reales de DATOS_NEGOCIO.json si existen
            if (prospectSite.business_data?.especialistas && prospectSite.business_data.especialistas.length > 0) {
              const mappedStys: Stylist[] = prospectSite.business_data.especialistas.map((esp: any, idx: number) => ({
                id: `ps-sty-${idx + 1}`,
                tenant_id: prospectSite.id,
                name: esp.nombre,
                specialty: esp.rol || 'Master Stylist',
                photo_url: '',
                rating: 5.0,
                reviews_count: 14 + idx * 6,
                commission_service_pct: 45,
                commission_retail_pct: 10,
                working_days: [1, 2, 3, 4, 5, 6],
                attends_clients: true,
                is_active: true
              }));
              setStylists(mappedStys);
              setSelectedStylist(mappedStys[0]);
              return; // Terminamos la carga específica de prospect site
            }
          }

          // Si no es prospect_site, buscar en tenants SaaS registrados
          const tenantBySlug = await api.getTenantBySlug(salonSlug);
          if (tenantBySlug) {
            if (tenantBySlug.name) setSalonName(tenantBySlug.name);
            if (tenantBySlug.phone) setSalonPhone(tenantBySlug.phone);
            if (tenantBySlug.currency) setSalonCurrency(tenantBySlug.currency);
            if (tenantBySlug.id) targetTenantId = tenantBySlug.id;
          } else {
            const formatted = salonSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            setSalonName(formatted);
          }
        } catch (e) {}
      }

      // 3. Cargar servicios y estilistas estándar del tenant
      const [srvs, stys] = await Promise.all([
        api.getServices(targetTenantId),
        api.getStylists(targetTenantId)
      ]);

      if (srvs && srvs.length > 0) {
        setServices(srvs);
        setSelectedService(srvs[0]);
      } else {
        setServices([]);
      }
      if (stys && stys.length > 0) {
        setStylists(stys);
        setSelectedStylist(stys[0]);
      } else {
        setStylists([]);
        setSelectedStylist(null);
      }
    }
    loadBookingData();
  }, [salonSlug]);

  const availableSlots = [
    '09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:15 PM'
  ];

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) {
      setPhone10Digits(digits);
    } else if (digits.length <= 6) {
      setPhone10Digits(`${digits.slice(0, 3)} ${digits.slice(3)}`);
    } else {
      setPhone10Digits(`${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    try {
      const activeTid = selectedService.tenant_id || getActiveTenantId();
      await api.createAppointment({
        id: '',
        tenant_id: activeTid,
        client_id: '',
        client_name: clientName.trim() || 'Clienta Web',
        client_phone: `${countryCode} ${phone10Digits}`.trim(),
        stylist_id: selectedStylist?.id || (stylists[0]?.id && stylists[0]?.id !== 'sty-1' ? stylists[0]?.id : '') || '',
        stylist_name: selectedStylist ? selectedStylist.name : (stylists[0]?.name || 'Primer Disponible'),
        service_id: selectedService.id,
        service_name: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration_minutes: selectedService.duration_minutes || 60,
        price_usd: Number(selectedService.price_usd ?? selectedService.price ?? 0),
        status: 'confirmada_wa',
        wa_reminder_24h_sent: true,
        wa_reminder_2h_sent: false,
        created_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Booking notice:', e);
    }
    setIsSuccess(true);
  };

  const formatCurrency = (amount: number | undefined | null, currency: string = salonCurrency || 'COP') => {
    const num = Number(amount ?? 0);
    if (currency === 'COP' || (!currency && num > 1000)) {
      return `$ ${num.toLocaleString('es-CO')} COP`;
    }
    if (currency === 'MXN') {
      return `$ ${num.toLocaleString('es-MX')} MXN`;
    }
    if (currency === 'EUR') {
      return `€ ${num.toLocaleString('es-ES')} EUR`;
    }
    return `$ ${num.toLocaleString('en-US')} USD`;
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white font-sans py-8 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-white mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF5A36] to-pink-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-[#FF5A36]/40">
            <Scissors className="w-4 h-4" />
          </div>
          <span>{salonName}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Reserva tu Cita Online</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Elige tu servicio y horario en menos de 1 minuto sin esperar en el teléfono.</p>
      </div>

      {/* Booking Wizard Card */}
      <div className="max-w-3xl mx-auto bg-[#141926] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        
        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 gap-2 mb-8 pb-6 border-b border-white/10">
          {[
            { num: 1, label: 'Servicio' },
            { num: 2, label: 'Especialista' },
            { num: 3, label: 'Fecha y Hora' },
            { num: 4, label: 'Tus Datos' }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`text-center p-2 rounded-xl border transition-all cursor-pointer ${
                step === s.num
                  ? 'border-[#FF5A36] bg-[#FF5A36]/10 text-white'
                  : step > s.num
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/5 bg-white/[0.02] text-slate-500'
              }`}
            >
              <div className="text-xs font-bold">Paso {s.num}</div>
              <div className="text-[11px] truncate hidden sm:block">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF5A36]" />
              Selecciona el Servicio Deseado
            </h2>

            {services.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-white/[0.02] border border-white/5 rounded-xl">
                <Scissors className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#FF5A36]" />
                <p className="text-sm font-semibold text-white">No hay servicios disponibles en este momento.</p>
                <p className="text-xs text-slate-400 mt-1">Por favor comunícate directamente con el salón.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedService?.id === srv.id
                        ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/10'
                        : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm sm:text-base text-white">{srv.name}</strong>
                        {srv.requires_patch_test && (
                          <span className="text-[10px] bg-[#FF5A36]/20 text-[#FF5A36] font-bold px-2 py-0.5 rounded-full">
                            Test de Parche
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{srv.description}</p>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {srv.duration_minutes} minutos
                      </span>
                    </div>

                    <div className="text-right pl-4 shrink-0">
                      <div className="text-base sm:text-lg font-extrabold text-[#FF5A36]">
                        {formatCurrency(srv.price_usd ?? srv.price ?? srv.price_cop, salonCurrency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-[#FF5A36]/30"
              >
                <span>Continuar a Especialista</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Specialist */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF5A36]" />
                Escoge tu Especialista
              </h2>
              {selectedService && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Mostrando profesionales capacitados para: <strong className="text-[#FF5A36]">{selectedService.name}</strong>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: First Available */}
              <div
                onClick={() => setSelectedStylist(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedStylist === null
                    ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/10'
                    : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#0A0D14] border border-[#FF5A36] flex items-center justify-center text-[#FF5A36] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Cualquier Especialista</strong>
                  <span className="text-xs text-slate-400 block">Primer horario disponible</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">⚡ Mayor disponibilidad de turnos</span>
                </div>
              </div>

              {/* Filtered Specialists List */}
              {filteredStylists.map((sty) => {
                const isSelected = selectedStylist?.id === sty.id;
                const isBlockedToday = sty.blocked_dates?.includes(selectedDate);

                return (
                  <div
                    key={sty.id}
                    onClick={() => setSelectedStylist(sty)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 relative ${
                      isSelected
                        ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/10'
                        : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                    }`}
                  >
                    <img
                      src={sty.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                      alt={sty.name}
                      className={`w-14 h-14 rounded-full object-cover border-2 shrink-0 ${
                        isSelected ? 'border-[#FF5A36]' : 'border-white/15'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-sm text-white block truncate">{sty.name}</strong>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
                          Calificado/a
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block truncate">{sty.specialty}</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{sty.rating || 5.0} ({sty.reviews_count || 12} reseñas)</span>
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
                className="text-slate-400 hover:text-white px-4 py-2 text-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-[#FF5A36]/30"
              >
                <span>Continuar a Horario</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date and Time */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#FF5A36]" />
              Elige Día y Hora
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fecha de la Cita</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              {/* Warning if Stylist is on Vacation or Off Day */}
              {stylistAvailability.blocked ? (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-red-400">
                    <Ban className="w-4 h-4 shrink-0" />
                    <span>{selectedStylist?.name} no tiene disponibilidad para esta fecha</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Motivo: <strong className="text-white">{stylistAvailability.reason}</strong>. Por favor selecciona otro día en el calendario o regresa a elegir otro profesional.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">Horarios Disponibles para esta Fecha</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedTime === slot
                            ? 'border-[#FF5A36] bg-[#FF5A36] text-white shadow-lg shadow-[#FF5A36]/30'
                            : 'border-white/10 bg-[#0E121B] text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white px-4 py-2 text-sm flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                disabled={stylistAvailability.blocked}
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-[#FF5A36]/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar a Mis Datos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Client Info */}
        {step === 4 && !isSuccess && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Tus Datos de Contacto
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Camila Restrepo"
                  className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Número de WhatsApp (Para recordatorios) *</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[#0E121B] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
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
                    className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-[#0E121B] border border-white/10 rounded-xl p-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Servicio:</span>
                  <strong className="text-white">{selectedService?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Especialista:</span>
                  <strong className="text-white">{selectedStylist ? selectedStylist.name : 'Primer Disponible'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha y Hora:</span>
                  <strong className="text-[#FF5A36]">{selectedDate} • {selectedTime}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-bold text-white">Total Estimado:</span>
                  <strong className="text-white font-extrabold">
                    {selectedService ? formatCurrency(selectedService.price_usd ?? selectedService.price ?? selectedService.price_cop, salonCurrency) : '$ 0'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-slate-400 hover:text-white px-4 py-2 text-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-[#FF5A36]/40"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Cita</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Confirmation Screen */}
        {isSuccess && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">¡Cita Agendada con Éxito!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Hemos enviado un mensaje de confirmación a tu WhatsApp <strong>{countryCode} {phone10Digits}</strong> con los detalles y recordatorio automático.
            </p>

            {salonPhone && (
              <div className="pt-2">
                <a
                  href={`https://wa.me/${salonPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${salonName}! 💖 Acabo de reservar mi cita online para *${selectedService?.name}* con *${selectedStylist ? selectedStylist.name : 'su equipo'}* para el día *${selectedDate}* a las *${selectedTime}*. Mi nombre es *${clientName || 'Clienta Web'}*.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black px-6 py-3 rounded-full text-xs shadow-xl shadow-emerald-500/30 transition-all hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notificar al Salón por WhatsApp Directo</span>
                </a>
              </div>
            )}

            <div className="pt-4 flex justify-center gap-3 flex-wrap">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-[#FF5A36]/30"
              >
                Ver Cita en el Dashboard
              </Link>
              <Link
                to="/"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
