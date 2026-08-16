import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';
import { api, initialServices, initialStylists } from '../lib/supabase';
import { Service, Stylist } from '../types';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const salonSlug = searchParams.get('salon') || '';

  const [salonName, setSalonName] = useState<string>('Studio Glamour Spa');
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

  useEffect(() => {
    async function loadBookingData() {
      // 1. Cargar datos del salón activo
      const activeTenantRaw = localStorage.getItem('bf_tenant_active');
      if (activeTenantRaw) {
        try {
          const tenant = JSON.parse(activeTenantRaw);
          if (tenant.name) setSalonName(tenant.name);
        } catch (e) {}
      } else if (salonSlug) {
        const formatted = salonSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setSalonName(formatted);
      }

      // 2. Cargar servicios y estilistas
      const [srvs, stys] = await Promise.all([
        api.getServices(),
        api.getStylists()
      ]);

      if (srvs && srvs.length > 0) {
        setServices(srvs);
        setSelectedService(srvs[0]);
      }
      if (stys && stys.length > 0) {
        setStylists(stys);
        setSelectedStylist(stys[0]);
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
      await api.createAppointment({
        id: `apt-${Date.now()}`,
        tenant_id: selectedService.tenant_id,
        client_id: `cli-${Date.now()}`,
        client_name: clientName.trim() || 'Clienta Web',
        client_phone: `${countryCode} ${phone10Digits}`.trim(),
        stylist_id: selectedStylist?.id || stylists[0]?.id || 'sty-1',
        stylist_name: selectedStylist ? selectedStylist.name : (stylists[0]?.name || 'Primer Disponible'),
        service_id: selectedService.id,
        service_name: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration_minutes: selectedService.duration_minutes,
        price_usd: selectedService.price_usd,
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

  const formatPrice = (price: number) => {
    return price > 1000 ? `$ ${price.toLocaleString('es-CO')} COP` : `$ ${price} USD`;
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
                    <div className="text-base sm:text-lg font-extrabold text-[#FF5A36]">{formatPrice(srv.price_usd)}</div>
                  </div>
                </div>
              ))}
            </div>

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
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#FF5A36]" />
              Escoge tu Especialista
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: First Available */}
              <div
                onClick={() => setSelectedStylist(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedStylist === null
                    ? 'border-[#FF5A36] bg-[#FF5A36]/10'
                    : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#0A0D14] border border-[#FF5A36] flex items-center justify-center text-[#FF5A36] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Cualquier Especialista</strong>
                  <span className="text-xs text-slate-400 block">Primer horario disponible</span>
                  <span className="text-[11px] text-emerald-400">⚡ Mayor disponibilidad</span>
                </div>
              </div>

              {/* Specialists List */}
              {stylists.map((sty) => (
                <div
                  key={sty.id}
                  onClick={() => setSelectedStylist(sty)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedStylist?.id === sty.id
                      ? 'border-[#FF5A36] bg-[#FF5A36]/10'
                      : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                  }`}
                >
                  <img
                    src={sty.photo_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'}
                    alt={sty.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#FF5A36] shrink-0"
                  />
                  <div>
                    <strong className="text-sm text-white block">{sty.name}</strong>
                    <span className="text-xs text-slate-400 block">{sty.specialty}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{sty.rating || 5.0} ({sty.reviews_count || 12} reseñas)</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#0E121B] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Horarios Disponibles para esta Fecha</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
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
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white px-4 py-2 text-sm flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Volver
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-[#FF5A36]/30"
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
                  <strong className="text-white font-extrabold">{selectedService ? formatPrice(selectedService.price_usd) : '$ 0'}</strong>
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

            <div className="pt-4 flex justify-center gap-3">
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
