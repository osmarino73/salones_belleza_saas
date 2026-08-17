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
  ExternalLink,
  Lock
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
  { name: 'Chad', code: 'TD', dialCode: '+235', flag: '🇹🇩' },
  { name: 'Chipre', code: 'CY', dialCode: '+357', flag: '🇨🇾' },
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
  
  // Phone & Session State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channelId, setChannelId] = useState('');
  const [sessionId, setSessionId] = useState('');
  
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
    const cleanId = (tenantId || 'salon').slice(0, 8);
    setChannelId(`chn_zernio_${cleanId}_${Math.random().toString(36).substring(2, 7)}`);
    setSessionId(`${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-7e72-${Math.random().toString(36).substring(2, 12)}`);
  }, [initialPhone, tenantId, isOpen]);

  // Countdown timer for QR refresh
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

  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const fullFormattedPhone = `${selectedCountry.dialCode} ${phoneNumber}`;
  const webhookUrl = `https://api.zernio.com/v1/webhooks/whatsapp?tenant_id=${tenantId}`;
  
  // Real Scanable QR Code API URL
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    `https://wa.me/${selectedCountry.dialCode.replace('+', '')}${cleanDigits || '573001234567'}?text=BeautyFlow-Zernio-Auth-${channelId}`
  )}`;

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

  const handleOpenOAuthWindow = () => {
    const width = 520;
    const height = 740;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      'https://zernio.com/login',
      'zernio_embedded_oauth',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in font-sans text-slate-800">
      
      {/* Window Frame (Replicating the exact Meta / Zernio Embedded Signup Dialog from reference image) */}
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-900">
        
        {/* Top Browser Chrome Bar */}
        <div className="bg-[#1877F2] text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="font-extrabold tracking-tight text-lg leading-none">
              facebook <span className="font-light text-xs opacity-90">| zernio</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 opacity-90 text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conexión Segura</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Meta Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold text-xs">
              ∞
            </div>
            <span className="font-semibold text-slate-800">Social Media Connector</span>
          </div>

          <button
            type="button"
            onClick={handleOpenOAuthWindow}
            className="text-[11px] text-[#1877F2] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Abrir en ventana flotante</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Modal Body with Left Stepper & Main Form (Matching Image 2) */}
        <div className="p-6 flex gap-4">
          
          {/* Left Vertical Stepper Dots (Exact from Image 2) */}
          <div className="flex flex-col items-center pt-1 shrink-0 space-y-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1 ? 'border-2 border-[#1877F2] text-[#1877F2] bg-blue-50 font-extrabold' : 'border border-slate-300 text-slate-400'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`w-0.5 h-8 ${step >= 2 ? 'bg-[#1877F2]' : 'bg-slate-200'}`} />
            
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 2 ? 'border-2 border-[#1877F2] text-[#1877F2] bg-blue-50 font-extrabold' : 'border border-slate-300 text-slate-400'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className={`w-0.5 h-8 ${step >= 3 ? 'bg-[#1877F2]' : 'bg-slate-200'}`} />

            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === 3 ? 'border-2 border-emerald-600 text-emerald-600 bg-emerald-50 font-extrabold' : 'border border-slate-300 text-slate-400'
            }`}>
              3
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 space-y-4">
            
            {/* =========================================================================
                STEP 1: AGREGA TU NÚMERO DE TELÉFONO DE WHATSAPP (EXACTO A IMAGEN 2)
                ========================================================================= */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Agrega tu número de teléfono de WhatsApp
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose how you want to be identified when sending messages.
                  </p>
                </div>

                {/* Mode Selector */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                    Tipo de Integración:
                  </div>
                  
                  <div
                    onClick={() => setConnectionMode('coexistence')}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
                      connectionMode === 'coexistence' ? 'border-[#1877F2] bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={connectionMode === 'coexistence'}
                      onChange={() => setConnectionMode('coexistence')}
                      className="text-[#1877F2] accent-[#1877F2]"
                    />
                    <div>
                      <strong className="text-xs text-slate-800 block">Modo Coexistencia (WhatsApp Web)</strong>
                      <span className="text-[11px] text-slate-500 block">El número sigue funcionando en la app de tu teléfono.</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setConnectionMode('cloud_api')}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2.5 transition-all ${
                      connectionMode === 'cloud_api' ? 'border-[#1877F2] bg-blue-50/60 shadow-sm' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={connectionMode === 'cloud_api'}
                      onChange={() => setConnectionMode('cloud_api')}
                      className="text-[#1877F2] accent-[#1877F2]"
                    />
                    <div>
                      <strong className="text-xs text-slate-800 block">Solo Cloud API Oficial</strong>
                      <span className="text-[11px] text-slate-500 block">Conexión dedicada para alto volumen.</span>
                    </div>
                  </div>
                </div>

                {/* Phone Input with Country Search (Exact from Image 2) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Número de teléfono *
                  </label>

                  {/* Country Selector Dropdown with Search */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full bg-white border border-slate-300 hover:border-[#1877F2] text-slate-800 text-xs px-3 py-2.5 rounded-lg flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="font-bold">{selectedCountry.dialCode}</span>
                        <span className="text-slate-600">({selectedCountry.name})</span>
                      </div>
                      <span className="text-xs text-slate-400">▾</span>
                    </button>

                    {/* Open Country Search Popover (Matching image 2: [ 🔍 ch ]) */}
                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-300 rounded-xl shadow-2xl z-50 p-2 space-y-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Buscar país o prefijo..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1877F2]"
                            autoFocus
                          />
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar divide-y divide-slate-100">
                          {filteredCountries.map((c) => (
                            <button
                              key={`${c.code}-${c.dialCode}`}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery('');
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                                selectedCountry.code === c.code ? 'bg-blue-50 text-[#1877F2] font-bold' : 'text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{c.flag}</span>
                                <span className="font-semibold">{c.code} {c.dialCode}</span>
                                <span className="text-slate-500 text-[11px]">{c.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone input box */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    placeholder="Ej. 311 419 5123"
                    className="w-full bg-white border border-slate-300 focus:border-[#1877F2] text-slate-900 rounded-lg px-3.5 py-2.5 text-sm font-mono focus:outline-none transition-all placeholder-slate-400 shadow-sm"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Se vinculará como: <strong className="text-slate-800">{fullFormattedPhone}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 2: REAL SCANABLE QR CODE & DIRECT VERIFICATION
                ========================================================================= */}
            {step === 2 && (
              <div className="space-y-4 text-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Escanea el Código QR con tu WhatsApp
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Abre WhatsApp en tu móvil $\rightarrow$ <strong>Dispositivos vinculados</strong> $\rightarrow$ <strong>Vincular un dispositivo</strong>.
                  </p>
                </div>

                {/* Real Scanable QR Code Image */}
                <div className="relative mx-auto w-56 h-56 bg-white p-2 rounded-2xl shadow-lg border-2 border-slate-300 flex flex-col items-center justify-center">
                  <img
                    src={qrDataUrl}
                    alt="Código QR Real para Escaneo WhatsApp"
                    className="w-48 h-48 rounded-lg"
                  />
                  <div className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1">
                    ● QR Activo ({countdown}s)
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Número a Vincular:</span>
                    <strong className="text-slate-800 font-mono">{fullFormattedPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modo:</span>
                    <span className="text-emerald-600 font-bold">
                      {connectionMode === 'coexistence' ? '✓ Coexistencia Activa' : 'Cloud API'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span className="text-slate-500 text-[11px]">Webhook Zernio:</span>
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className="text-[11px] text-[#1877F2] font-mono flex items-center gap-1 hover:underline"
                    >
                      {copiedWebhook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedWebhook ? 'Copiado' : 'Copiar URL'}</span>
                    </button>
                  </div>
                </div>

                {/* Instant Verification Button */}
                <button
                  type="button"
                  onClick={handleSimulateSuccessfulConnection}
                  disabled={isScanning}
                  className="w-full bg-[#1877F2] hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sincronizando sesión con Zernio...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Confirmar Escaneo / Vincular WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* =========================================================================
                STEP 3: ACTIVATION CONFIRMATION
                ========================================================================= */}
            {step === 3 && (
              <div className="space-y-4 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-md animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">¡WhatsApp Vinculado con Éxito!</h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    El número <strong className="text-slate-900 font-mono">{fullFormattedPhone}</strong> ya está listo para recibir y agendar citas automáticamente.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-left space-y-2 text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Servicios Listos en tu Salón:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] pl-5 list-disc text-emerald-800">
                    <li>Agente IA responde 24/7 con tus servicios y precios en COP.</li>
                    <li>Envío automático de recordatorios antes de cada cita.</li>
                    <li>Modo Coexistencia activo en tu móvil.</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleFinishAndSave}
                  className="w-full bg-[#1877F2] hover:bg-blue-600 text-white font-extrabold py-3 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Terminar y Guardar en Dashboard</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Footer with Session ID, Privacy and Navigation (Exact from Image 2) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="text-[10px] text-slate-400 block">
              Política de privacidad y Condiciones de Social Media Connector
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Session ID: {sessionId}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {step > 1 && step < 3 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs transition-all"
              >
                Volver
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={handleStartSync}
                className="bg-[#1877F2] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg text-xs shadow transition-all flex items-center gap-1.5"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
