import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { initialServices, initialStylists } from '../lib/supabase';
import { Service, Stylist } from '../types';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service>(initialServices[0]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(initialStylists[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-18');
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [clientName, setClientName] = useState<string>('María Fernanda López');
  const [countryCode, setCountryCode] = useState<string>('+57');
  const [phone10Digits, setPhone10Digits] = useState<string>('312 456 7890');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const availableSlots = [
    '09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '05:00 PM', '06:15 PM'
  ];

  const handlePhoneChange = (val: string) => {
    // Keep only numbers and max 10 digits
    const digits = val.replace(/\D/g, '').slice(0, 10);
    // Format 3XX XXX XXXX
    if (digits.length <= 3) {
      setPhone10Digits(digits);
    } else if (digits.length <= 6) {
      setPhone10Digits(`${digits.slice(0, 3)} ${digits.slice(3)}`);
    } else {
      setPhone10Digits(`${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`);
    }
  };

  const handleConfirmBooking = () => {
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white font-body py-8 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold text-white mb-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/40">
            <Scissors className="w-4 h-4" />
          </div>
          <span>Studio Glamour<span className="text-orange-500"> Spa</span></span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Reserva tu Cita Online</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Elige tu servicio y horario en menos de 1 minuto sin esperar en el teléfono.</p>
      </div>

      {/* Booking Wizard Card */}
      <div className="max-w-3xl mx-auto bg-dark-800 border border-orange-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10">
        
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
                  ? 'border-orange-500 bg-orange-500/10 text-white'
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
              <Sparkles className="w-5 h-5 text-orange-500" />
              Selecciona el Servicio Deseado
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {initialServices.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedService.id === srv.id
                      ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                      : 'border-white/10 bg-dark-700 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm sm:text-base text-white">{srv.name}</strong>
                      {srv.requires_patch_test && (
                        <span className="text-[10px] bg-orange-500/20 text-orange-500 font-bold px-2 py-0.5 rounded-full">
                          Test de Parche
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{srv.description}</p>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {srv.duration_minutes} minutos
                    </span>
                  </div>

                  <div className="text-right pl-4">
                    <div className="text-lg font-extrabold text-orange-500">${srv.price_usd}</div>
                    <div className="text-[10px] text-slate-500">USD</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30"
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
              <User className="w-5 h-5 text-orange-500" />
              Escoge tu Especialista
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option: First Available */}
              <div
                onClick={() => setSelectedStylist(null)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                  selectedStylist === null
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-white/10 bg-dark-700 hover:border-white/20'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-dark-900 border border-orange-500 flex items-center justify-center text-orange-500 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-sm text-white block">Cualquier Especialista</strong>
                  <span className="text-xs text-slate-400 block">Primer horario disponible</span>
                  <span className="text-[11px] text-emerald-400">⚡ Mayor disponibilidad</span>
                </div>
              </div>

              {/* Specialists List */}
              {initialStylists.map((sty) => (
                <div
                  key={sty.id}
                  onClick={() => setSelectedStylist(sty)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    selectedStylist?.id === sty.id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/10 bg-dark-700 hover:border-white/20'
                  }`}
                >
                  <img
                    src={sty.photo_url}
                    alt={sty.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shrink-0"
                  />
                  <div>
                    <strong className="text-sm text-white block">{sty.name}</strong>
                    <span className="text-xs text-slate-400 block">{sty.specialty}</span>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{sty.rating} ({sty.reviews_count})</span>
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30"
              >
                <span>Continuar a Horario</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date and Time */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-500" />
              Selecciona Fecha y Hora
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Fecha de la Cita</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { day: 'Mar 18', date: '2026-08-18', label: 'Hoy' },
                  { day: 'Mié 19', date: '2026-08-19', label: 'Mañana' },
                  { day: 'Jue 20', date: '2026-08-20', label: 'Jueves' },
                  { day: 'Vie 21', date: '2026-08-21', label: 'Viernes' },
                  { day: 'Sáb 22', date: '2026-08-22', label: 'Sábado' }
                ].map((d) => (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => setSelectedDate(d.date)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedDate === d.date
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'border-white/10 bg-dark-700 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.day}</div>
                    <div className="text-[10px] opacity-80">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Horarios Disponibles</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      selectedTime === slot
                        ? 'border-orange-500 bg-orange-500/20 text-orange-500 font-bold'
                        : 'border-white/10 bg-dark-700 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30"
              >
                <span>Continuar a Tus Datos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Client Details & WhatsApp */}
        {step === 4 && !isSuccess && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              Tus Datos para Confirmación por WhatsApp
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nombre y Apellido *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Número de WhatsApp * (Para enviarte la confirmación y recordatorio)
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4 sm:col-span-3">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+507">🇵🇦 +507</option>
                      <option value="+34">🇪🇸 +34</option>
                    </select>
                  </div>
                  <div className="col-span-8 sm:col-span-9">
                    <input
                      type="tel"
                      value={phone10Digits}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="300 123 4567"
                      className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-dark-900 border border-white/10 rounded-xl p-4 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Servicio:</span>
                  <strong className="text-white">{selectedService.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Especialista:</span>
                  <strong className="text-white">{selectedStylist ? selectedStylist.name : 'Primer Disponible'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha y Hora:</span>
                  <strong className="text-orange-500">{selectedDate} • {selectedTime}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm">
                  <span className="font-bold text-white">Total Estimado:</span>
                  <strong className="text-white font-extrabold">${selectedService.price_usd} USD</strong>
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
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 text-sm shadow-lg shadow-orange-500/40"
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
              Hemos enviado un mensaje de confirmación a tu WhatsApp <strong>{countryCode} {phone10Digits}</strong> con la ubicación del salón y recordatorio automático.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/dashboard"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-orange-500/30"
              >
                Ver Cita en el Dashboard
              </Link>
              <Link
                to="/"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
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
