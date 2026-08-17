import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles,
  Smartphone,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Globe,
  Radio
} from 'lucide-react';

interface CountryItem {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: CountryItem[] = [
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴' },
  { name: 'México', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱' },
  { name: 'Estados Unidos', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'España', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷' },
  { name: 'Perú', code: 'PE', dialCode: '+51', flag: '🇵🇪' },
  { name: 'Panamá', code: 'PA', dialCode: '+507', flag: '🇵🇦' },
  { name: 'Ecuador', code: 'EC', dialCode: '+593', flag: '🇪🇨' },
  { name: 'Costa Rica', code: 'CR', dialCode: '+506', flag: '🇨🇷' },
  { name: 'Guatemala', code: 'GT', dialCode: '+502', flag: '🇬🇹' },
  { name: 'República Dominicana', code: 'DO', dialCode: '+1', flag: '🇩🇴' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591', flag: '🇧🇴' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598', flag: '🇺🇾' },
  { name: 'Venezuela', code: 'VE', dialCode: '+58', flag: '🇻🇪' },
  { name: 'Suiza', code: 'CH', dialCode: '+41', flag: '🇨🇭' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'República Checa', code: 'CZ', dialCode: '+420', flag: '🇨🇿' }
];

interface ZernioOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  tenantId?: string;
  initialPhone?: string;
  onSuccess: (data: { phone: string; channelId: string; mode: 'coexistence' | 'cloud_api' }) => void;
}

export const ZernioOnboardingModal: React.FC<ZernioOnboardingModalProps> = ({
  isOpen,
  onClose,
  salonName,
  tenantId = '00000000-0000-0000-0000-000000000001',
  initialPhone = '',
  onSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [connectionMode, setConnectionMode] = useState<'coexistence' | 'cloud_api'>('coexistence');
  
  // Country Selector State
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  
  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channelId, setChannelId] = useState('');
  
  // QR & Sync State
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  useEffect(() => {
    if (initialPhone) {
      const clean = initialPhone.replace(/\D/g, '');
      if (clean.length >= 10) {
        setPhoneNumber(clean.slice(-10));
      }
    }
    setChannelId(`chn_zernio_${(tenantId || 'salon').slice(0, 8)}_${Math.random().toString(36).substring(2, 7)}`);
  }, [initialPhone, tenantId, isOpen]);

  // Countdown timer for QR
  useEffect(() => {
    let timer: any;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.dialCode.includes(countrySearchQuery) ||
      c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const fullFormattedPhone = `${selectedCountry.dialCode} ${phoneNumber}`;
  const webhookUrl = `https://api.zernio.com/v1/webhooks/whatsapp?tenant_id=${tenantId}`;

  const handlePhoneInput = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) {
      setPhoneNumber(digits);
    } else if (digits.length <= 6) {
      setPhoneNumber(`${digits.slice(0, 3)} ${digits.slice(3)}`);
    } else {
      setPhoneNumber(`${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`);
    }
  };

  const handleStartSync = () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 7) {
      alert('Por favor ingresa un número de teléfono válido.');
      return;
    }
    setStep(2);
    setCountdown(60);
  };

  const handleSimulateSuccessfulConnection = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep(3);
    }, 1500);
  };

  const handleFinishAndSave = () => {
    onSuccess({
      phone: fullFormattedPhone,
      channelId,
      mode: connectionMode
    });
    onClose();
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
      
      {/* Window Frame (Style inspired by Meta / Zernio Embedded Dialog) */}
      <div className="relative w-full max-w-lg bg-[#141926] border border-white/10 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Top Header Strip */}
        <div className="bg-[#0E121B] px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>Zernio Media Connector</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-normal">
                  v2.4 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Conexión Segura de WhatsApp para {salonName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#101420] px-6 py-3 border-b border-white/5 flex items-center justify-between text-xs">
          {[
            { num: 1, label: '1. Número & Modo' },
            { num: 2, label: '2. Escaneo QR' },
            { num: 3, label: '3. Activado' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-[11px] font-semibold ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* =========================================================================
              STEP 1: PHONE NUMBER & CONNECTION MODE (COEXISTENCIA VS CLOUD API)
              ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Agrega tu número de teléfono de WhatsApp
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Elige cómo quieres que tu salón y la IA envíen mensajes a tus clientas.
                </p>
              </div>

              {/* Connection Mode Radios */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-300">Modo de Operación</label>
                
                {/* Option 1: Coexistence (Recommended) */}
                <div
                  onClick={() => setConnectionMode('coexistence')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    connectionMode === 'coexistence'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                  }`}
                >
                  <div className="pt-0.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      connectionMode === 'coexistence' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                    }`}>
                      {connectionMode === 'coexistence' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-white">Modo Coexistencia</strong>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      El número <strong>sigue funcionando en tu app normal de WhatsApp</strong> en tu teléfono. La IA responde automáticamente sin bloquearte.
                    </p>
                  </div>
                </div>

                {/* Option 2: Cloud API */}
                <div
                  onClick={() => setConnectionMode('cloud_api')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    connectionMode === 'cloud_api'
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'border-white/10 bg-[#0E121B] hover:border-white/20'
                  }`}
                >
                  <div className="pt-0.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      connectionMode === 'cloud_api' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                    }`}>
                      {connectionMode === 'cloud_api' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold text-white">Zernio Cloud API Oficial</strong>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Conexión por Meta Cloud API oficial de alto volumen para franquicias con servidores dedicados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Input with Country Search Dropdown */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Número de WhatsApp del Salón *
                </label>
                
                <div className="flex gap-2 relative">
                  {/* Country Selector Dropdown Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="bg-[#0E121B] border border-white/15 hover:border-emerald-500 text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-1.5 h-full whitespace-nowrap transition-all"
                    >
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span>{selectedCountry.dialCode}</span>
                      <span className="text-[10px] text-slate-400">▾</span>
                    </button>

                    {/* Country Selector Popover */}
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#0E121B] border border-white/15 rounded-xl shadow-2xl z-50 p-2 space-y-2">
                        {/* Search in Dropdown */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Buscar país o prefijo..."
                            className="w-full bg-[#141926] border border-white/10 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            autoFocus
                          />
                        </div>

                        {/* Country List */}
                        <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar">
                          {filteredCountries.map((c) => (
                            <button
                              key={`${c.code}-${c.dialCode}`}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery('');
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                                selectedCountry.code === c.code ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{c.flag}</span>
                                <span>{c.name}</span>
                              </div>
                              <span className="text-[11px] font-mono text-slate-400">{c.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    placeholder="312 456 7890"
                    className="flex-1 bg-[#0E121B] border border-white/15 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none transition-all placeholder-slate-600"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Identificador de canal: <code className="text-emerald-400 font-mono">{channelId}</code>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white px-3 py-2"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleStartSync}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <span>Siguiente: Escanear QR</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: QR SCANNING & LIVE SYNC WITH ZERNIO
              ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  Vincula tu WhatsApp en 10 segundos
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Abre WhatsApp en tu teléfono $\rightarrow$ <strong>Dispositivos vinculados</strong> $\rightarrow$ <strong>Vincular un dispositivo</strong>.
                </p>
              </div>

              {/* QR Box Visualizer */}
              <div className="relative mx-auto w-48 h-48 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-emerald-500/40 group">
                {/* Simulated QR Pattern */}
                <div className="w-full h-full bg-[#141926] rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-2">
                  
                  {/* Scanner Laser Line Animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-emerald-400" />
                  
                  <div className="grid grid-cols-5 gap-1.5 opacity-80">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm ${
                          i % 2 === 0 || i === 0 || i === 4 || i === 20 || i === 24
                            ? 'bg-emerald-400'
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="text-center p-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto mb-1 shadow-md">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-white block">Escanea con tu WhatsApp</span>
                    </div>
                  </div>
                </div>

                {/* Live Countdown badge */}
                <div className="absolute -bottom-3 bg-[#0E121B] border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow">
                  Expira en: {countdown}s
                </div>
              </div>

              {/* Phone and Channel Details Card */}
              <div className="bg-[#0E121B] border border-white/10 rounded-xl p-3.5 text-xs text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Número a Vincular:</span>
                  <strong className="text-white font-mono">{fullFormattedPhone}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Modo:</span>
                  <span className="text-emerald-400 font-semibold">
                    {connectionMode === 'coexistence' ? '✓ Coexistencia Activa' : 'Cloud API'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span className="text-slate-400">Webhook Zernio:</span>
                  <button
                    type="button"
                    onClick={handleCopyWebhook}
                    className="text-[11px] text-slate-300 hover:text-white font-mono flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10"
                  >
                    {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedWebhook ? 'Copiado' : 'Copiar URL'}</span>
                  </button>
                </div>
              </div>

              {/* Simulation / Verification Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSimulateSuccessfulConnection}
                  disabled={isScanning}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sincronizando sesión con Zernio...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Verificar y Confirmar Conexión</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Volver a editar número
                </button>

                <a
                  href="https://zernio.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 underline"
                >
                  <span>Abrir consola de Zernio.com</span>
                  <Globe className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: SUCCESS CONFIRMATION
              ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white">¡WhatsApp Conectado con Éxito!</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                  Tu número <strong className="text-white font-mono">{fullFormattedPhone}</strong> ha sido vinculado a Zernio Media Gateway.
                </p>
              </div>

              <div className="bg-[#0E121B] border border-emerald-500/30 rounded-2xl p-4 text-xs text-left space-y-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Servicios Activos de IA:</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 text-[11px] pl-6 list-disc">
                  <li>Respuestas automáticas inteligentes a consultas de servicios.</li>
                  <li>Agendamiento de citas directo en la agenda del salón.</li>
                  <li>Envío automático de recordatorios 24h y 2h antes del servicio.</li>
                  <li>Modo Intervención Humana listo si deseas responder manualmente.</li>
                </ul>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleFinishAndSave}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold py-3.5 rounded-xl text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Activar Agente y Volver al Dashboard</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
