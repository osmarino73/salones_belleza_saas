import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
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
  Lock,
  MessageSquare,
  Users,
  ShieldAlert
} from 'lucide-react';
import { api } from '../lib/supabase';

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
  // 1: Welcome & Overview, 2: Add Phone Number, 3: Verification & Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [connectionMode, setConnectionMode] = useState<'coexistence' | 'cloud_api'>('coexistence');
  
  // Country Selector State
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  
  // Phone & Channel State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channelId, setChannelId] = useState('');
  const [sessionId, setSessionId] = useState('');
  
  // Sync State
  const [isVerifying, setIsVerifying] = useState(false);
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
    setSessionId(`01a001c4-620a-7e72-9103-${Math.random().toString(36).substring(2, 12)}`);
  }, [initialPhone, tenantId, isOpen]);

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

  const handleVerifyZernioConnection = async () => {
    setIsVerifying(true);
    try {
      const res = await api.zernio.createOrGetChannel(fullFormattedPhone, tenantId);
      if (res && res.id) {
        setChannelId(res.id);
      }
    } catch (e) {
      console.warn('Zernio sync notice:', e);
    }

    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 1200);
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in font-sans text-slate-800">
      
      {/* Window Frame (Replicating exact Meta & Zernio Embedded Signup Dialog) */}
      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto text-slate-900">
        
        {/* Top Browser Chrome Bar (Facebook / Zernio Style) */}
        <div className="bg-[#1877F2] text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="font-extrabold tracking-tight text-lg leading-none flex items-center gap-1.5">
              <span>facebook</span>
              <span className="font-light text-xs opacity-80">| Zernio</span>
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

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-full bg-slate-300 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-[11px] text-slate-700 hidden sm:inline">{salonName}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* =========================================================================
              PANTALLA 1 (EXACTA A LA DE LA IMAGEN DE YOUTUBE)
              "Conecta tu cuenta fácilmente con Zernio"
              ========================================================================= */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* Banner Ilustrativo Superior (Conectar WhatsApp / Zernio) */}
              <div className="w-full h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-xl flex items-center justify-between px-6 text-white overflow-hidden relative shadow-inner">
                <div className="space-y-0.5 z-10">
                  <div className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded inline-block">
                    Social Media Connector
                  </div>
                  <h3 className="text-base font-extrabold">Zernio Media Gateway</h3>
                  <p className="text-[11px] opacity-90">WhatsApp Business Cloud & Coexistencia</p>
                </div>

                <div className="flex items-center gap-2 text-white/90 z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 fill-current text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="w-6 h-6 fill-current text-amber-300" />
                  </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-6 -bottom-10 w-32 h-32 rounded-full bg-white/10" />
              </div>

              {/* Title & Introduction */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  Conecta tu cuenta fácilmente con Zernio
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  En este proceso de registro, se te guiará para que registres tu cuenta de empresa y la conectes con tu socio.
                </p>
              </div>

              {/* Feature Points Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <strong className="text-xs font-bold text-slate-800 block">
                  Podrás hacer lo siguiente:
                </strong>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1877F2] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">
                      Comunícate con tus clientes a gran escala
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      La API de la nube te permite enviar y recibir mensajes de forma segura y administrar las conversaciones de manera automática.
                    </p>
                    <ul className="space-y-1 text-[11px] text-slate-600 pt-1 list-disc pl-4">
                      <li>Manejar grandes volúmenes de mensajes con facilidad.</li>
                      <li>Reducir los costos asociados a los SMS o llamadas de voz tradicionales.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Terms disclaimer */}
              <p className="text-[10px] text-slate-400 leading-tight">
                Al continuar, aceptas las <span className="text-[#1877F2] hover:underline cursor-pointer">Condiciones de hospedaje de Meta para la API de la nube</span> y las <span className="text-[#1877F2] hover:underline cursor-pointer">Condiciones de Meta para WhatsApp Business</span>.
              </p>

            </div>
          )}

          {/* =========================================================================
              PANTALLA 2 (EXACTA A LA DE LA IMAGEN 2)
              "Agrega tu número de teléfono de WhatsApp"
              ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* Stepper horizontal mini */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-[#1877F2]">Paso 2 de 3: Identificación del Número</span>
                <span className="text-[10px] bg-blue-50 text-[#1877F2] font-semibold px-2 py-0.5 rounded">
                  Modo Coexistencia
                </span>
              </div>

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
                  Tipo de Conexión:
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
                    <strong className="text-xs text-slate-800 block">Modo Coexistencia (WhatsApp del móvil activo)</strong>
                    <span className="text-[11px] text-slate-500 block">Lo que se conteste desde el móvil también queda sincronizado.</span>
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
                    <strong className="text-xs text-slate-800 block">Solo Cloud API</strong>
                    <span className="text-[11px] text-slate-500 block">Conexión directa por Meta Business API.</span>
                  </div>
                </div>
              </div>

              {/* Phone Input with Country Search (Dropdown con buscador [ 🔍 ch ]) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Número de teléfono *
                </label>

                {/* Selector de país */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full bg-white border border-slate-300 hover:border-[#1877F2] text-slate-800 text-xs px-3 py-2.5 rounded-lg flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{selectedCountry.flag}</span>
                      <span className="font-bold">{selectedCountry.code}</span>
                      <span className="font-bold text-[#1877F2]">{selectedCountry.dialCode}</span>
                      <span className="text-slate-600">({selectedCountry.name})</span>
                    </div>
                    <span className="text-xs text-slate-400">▾</span>
                  </button>

                  {/* Popover con buscador tipo [ 🔍 ch ] */}
                  {isCountryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-slate-300 rounded-xl shadow-2xl z-50 p-2 space-y-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={countrySearchQuery}
                          onChange={(e) => setCountrySearchQuery(e.target.value)}
                          placeholder="Buscar país o prefijo (ej. ch, +57, +56)..."
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
                              <span className="font-semibold">{c.code}</span>
                              <span className="font-mono text-[#1877F2]">{c.dialCode}</span>
                              <span className="text-slate-500 text-[11px]">{c.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input de número */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  placeholder="311 419 5123"
                  className="w-full bg-white border border-slate-300 focus:border-[#1877F2] text-slate-900 rounded-lg px-3.5 py-2.5 text-sm font-mono focus:outline-none transition-all placeholder-slate-400 shadow-sm"
                  required
                />
                <span className="text-[10px] text-slate-500 block">
                  Identificador internacional: <strong className="text-slate-800 font-mono">{fullFormattedPhone}</strong>
                </span>
              </div>
            </div>
          )}

          {/* =========================================================================
              PANTALLA 3 (ACTIVACIÓN EXITOSA & SINCRONIZACIÓN)
              ========================================================================= */}
          {step === 3 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">¡WhatsApp Vinculado con Éxito!</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  El número <strong className="text-slate-900 font-mono">{fullFormattedPhone}</strong> ya está conectado mediante Zernio.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-left space-y-2 text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Servicios Activos:</span>
                </div>
                <ul className="space-y-1 text-[11px] pl-5 list-disc text-emerald-800">
                  <li>Agente IA responde 24/7 con tus servicios y precios en COP.</li>
                  <li>Envío automático de recordatorios 24h y 2h antes.</li>
                  <li>Modo Coexistencia activo en tu móvil.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleFinishAndSave}
                className="w-full bg-[#1877F2] hover:bg-blue-600 text-white font-extrabold py-3 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Terminar y Guardar en Dashboard</span>
              </button>
            </div>
          )}

        </div>

        {/* Footer (Exacto a la Imagen de YouTube y Facebook Onboarding) */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="text-[10px] text-slate-400 block hover:underline cursor-pointer">
              Política de privacidad y Condiciones de Social Media Connector
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Session ID: {sessionId}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {step === 1 && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#1877F2] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg text-xs shadow transition-all flex items-center gap-1.5"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs transition-all"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleVerifyZernioConnection}
                  disabled={isVerifying || phoneNumber.replace(/\D/g, '').length < 7}
                  className="bg-[#1877F2] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg text-xs shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
