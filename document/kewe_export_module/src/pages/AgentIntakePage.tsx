import React, { useState, useEffect } from 'react';
import { 
  Smartphone, MapPin, Sparkles, Send, CheckCircle2, Copy, 
  ExternalLink, Camera, Award, LogOut, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { agentService } from '../services/agentService';
import { activateProspectInField } from '../services/prospectActivationService';
import { BEAUTY_SPECIALTIES } from '../lib/beautySpecialties';
import { injectBeautyHtml } from '../lib/beautyHtmlInjector';
import { FieldAgent, ProspectSite } from '../types/keweBeauty';
import { supabase } from '@/lib/supabase';

export const AgentIntakePage: React.FC = () => {
  const [agent, setAgent] = useState<FieldAgent | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login de agente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Formulario de prospección
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'barberia' | 'peluqueria_damas' | 'unas_nails'>('barberia');
  const [address, setAddress] = useState('');
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prospecto creado
  const [createdProspect, setCreatedProspect] = useState<ProspectSite | null>(null);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    const current = await agentService.getCurrentAgent();
    if (current) {
      const metrics = await agentService.getAgentMetrics(current.email);
      setAgent({ ...current, metricas: metrics });
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const current = await agentService.loginAgent(email, password);
      const metrics = await agentService.getAgentMetrics(current.email);
      setAgent({ ...current, metricas: metrics });
      toast.success(`¡Bienvenido, ${current.nombre}! 🚀`);
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no soportada');
      return;
    }
    setIsCapturingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setGpsLocation(coords);
        setIsCapturingGps(false);
        toast.success('Ubicación GPS capturada con éxito');
      },
      () => {
        setIsCapturingGps(false);
        toast.error('No se pudo obtener la ubicación GPS');
      },
      { timeout: 10000 }
    );
  };

  const handleCreateProspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) {
      toast.error('Ingresa el nombre y WhatsApp del salón');
      return;
    }

    setIsSubmitting(true);
    try {
      const specialty = BEAUTY_SPECIALTIES[category];
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);

      // Generar HTML personalizado
      const rawHtml = injectBeautyHtml({
        category,
        businessName,
        phoneWhatsapp: cleanPhone,
        address: address || gpsLocation || 'Medellín, Colombia',
        primaryColor: specialty.color,
        heroImage: specialty.heroImage,
        heroMobileImage: specialty.heroMobileImage,
        services: specialty.services
      });

      const { data, error } = await supabase
        .from('prospect_sites')
        .insert({
          slug,
          business_name: businessName,
          phone_whatsapp: cleanPhone,
          address: address || 'Ubicación registrada',
          raw_html: rawHtml,
          category,
          status: 'prospecto',
          primary_color: specialty.color,
          creator_email: agent?.email,
          business_data: {
            gps: gpsLocation,
            specialty_id: category,
            services: specialty.services
          }
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedProspect(data);
      toast.success('¡Demo generada exitosamente!');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al registrar prospecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickActivate = async () => {
    if (!createdProspect) return;
    setIsActivating(true);
    const tempPass = 'Kewe' + Math.floor(100000 + Math.random() * 900000) + '!';
    const fakeEmail = `${createdProspect.slug}@kewe.app`;

    try {
      const res = await activateProspectInField({
        prospect: createdProspect,
        ownerEmail: fakeEmail,
        tempPassword: tempPass,
        agentEmail: agent?.email,
        plan: 'free'
      });

      if (res.success) {
        toast.success('¡Salón activado con prueba gratuita!');
        // Enlace para enviar por WhatsApp al dueño del salón
        const waMsg = `¡Hola ${createdProspect.business_name}! 🚀 Ya está lista la página web y sistema de citas de tu salón. Mírala aquí: ${window.location.origin}/p/${createdProspect.slug}`;
        window.open(`https://wa.me/${createdProspect.phone_whatsapp}?text=${encodeURIComponent(waMsg)}`, '_blank');
      } else {
        toast.error(res.error || 'No se pudo activar');
      }
    } finally {
      setIsActivating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold">Cargando Portal de Agentes...</div>;
  }

  // Vista de Login si no hay sesión
  if (!agent) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center px-6 py-12">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center">
            <span className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black text-2xl flex items-center justify-center mx-auto mb-3">
              K
            </span>
            <h1 className="text-2xl font-black">Portal de Agentes Kewe</h1>
            <p className="text-xs text-zinc-400">Herramienta de prospección comercial en calle para Salones & Barberías</p>
          </div>

          <form onSubmit={handleLogin} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Email de Agente</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="agente@kewe.app" 
                required 
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Contraseña</label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
            <Button type="submit" disabled={isLoggingIn} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold h-11 rounded-xl">
              {isLoggingIn ? 'Verificando...' : 'Ingresar al Portal'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Vista Principal de Agente Autenticado
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      
      {/* Top Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-sm">
            K
          </span>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{agent.nombre}</p>
            <p className="text-[10px] text-zinc-400">Agente de Campo Activo</p>
          </div>
        </div>
        <button onClick={() => agentService.logoutAgent().then(() => setAgent(null))} className="p-2 text-zinc-400 hover:text-white">
          <LogOut size={16} />
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        
        {/* Tarjeta de Métricas Rápidas */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-3 rounded-2xl border border-zinc-800 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500">Hoy</span>
            <p className="text-lg font-black text-amber-500">{agent.metricas?.prospectosHoy || 0}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500">Total</span>
            <p className="text-lg font-black text-white">{agent.metricas?.totalProspectos || 0}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500">Activados</span>
            <p className="text-lg font-black text-emerald-500">{agent.metricas?.convertidos || 0}</p>
          </div>
        </div>

        {/* Formulario de Alta Rápida de Prospecto */}
        {!createdProspect ? (
          <form onSubmit={handleCreateProspect} className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-4">
            <h2 className="text-sm font-black text-white flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" /> Nuevo Salón / Barbería en Campo
            </h2>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">Nombre Comercial</label>
              <Input 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                placeholder="Ej: Barbería Don Pedro" 
                required 
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">WhatsApp del Dueño</label>
              <Input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Ej: 3001234567" 
                required 
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">Especialidad de Belleza</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'barberia', name: 'Barbería', icon: '💈' },
                  { id: 'peluqueria_damas', name: 'Salón', icon: '💇‍♀️' },
                  { id: 'unas_nails', name: 'Nails', icon: '💅' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      category === item.id 
                        ? 'bg-amber-500 text-black border-amber-500 font-black' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <span>{item.icon} {item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">Dirección & GPS</label>
              <div className="flex gap-2">
                <Input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Calle o Centro Comercial" 
                  className="bg-zinc-950 border-zinc-800 text-white flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleCaptureGps} 
                  disabled={isCapturingGps}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3"
                  title="Capturar GPS en vivo"
                >
                  <MapPin size={16} className={gpsLocation ? 'text-emerald-500' : ''} />
                </Button>
              </div>
              {gpsLocation && (
                <p className="text-[10px] text-emerald-400 font-mono mt-1">📍 GPS: {gpsLocation}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold h-12 rounded-2xl shadow-lg shadow-amber-500/20 text-sm"
            >
              {isSubmitting ? 'Generando Página Web...' : '🚀 Generar Demo en Caliente'}
            </Button>
          </form>
        ) : (
          /* Vista de Demo Lista & Activación */
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{createdProspect.business_name}</h3>
              <p className="text-xs text-zinc-400 mt-0.5">¡Página web y catálogo de citas listos para mostrar al cliente!</p>
            </div>

            <div className="flex flex-col gap-2">
              <a 
                href={`/p/${createdProspect.slug}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <ExternalLink size={14} /> Abrir Demo en Pantalla Completa
              </a>

              <Button 
                onClick={handleQuickActivate} 
                disabled={isActivating}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold h-12 rounded-xl text-sm"
              >
                {isActivating ? 'Activando...' : '⭐ Activar Prueba Gratis 7 Días & WhatsApp'}
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => {
                  setCreatedProspect(null);
                  setBusinessName('');
                  setPhone('');
                  setAddress('');
                  setGpsLocation(null);
                }}
                className="text-xs text-zinc-500 hover:text-white"
              >
                Prospectar Siguiente Salón
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AgentIntakePage;
