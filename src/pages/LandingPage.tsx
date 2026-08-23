import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors,
  CheckCircle2,
  Calendar,
  Gift,
  Phone,
  Clock,
  Award,
  ChevronDown,
  ArrowRight,
  Star,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Zap,
  LogIn,
  Sparkles,
  Crown,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white font-body selection:bg-orange-500 selection:text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-black/90 border-b border-white/10 py-2 text-xs text-slate-400 hidden sm:block">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Atención Automatizada por IA las 24 Horas
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
              WhatsApp Soporte: +57 300 900 8000
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Award className="w-3.5 h-3.5 text-orange-500" />
            Oferta Exclusiva para Salones de Belleza, Barberías & Spas
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-dark-800/95 backdrop-blur-md border-b border-white/10 py-3.5">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-black text-white">
            <img
              src="/kowy-logo.jpg"
              alt="Kowy Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-[#FF5A36]/20"
            />
            <span>Kowy<span className="text-[#FF5A36]">.app</span></span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white text-xs sm:text-sm font-semibold px-3 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-orange-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Registrar Mi Salón</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-500">
              <span>// LA ELECCIÓN DE SALONES & COLORISTAS TOP EN LATAM</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Multiplica la Rentabilidad de tu Salón con{' '}
              <span className="text-orange-500">Inteligencia Artificial</span> y Cero Plantones
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Te diseñamos una <strong>Página Web Profesional 100% Gratis</strong> e integramos el Agente de WhatsApp que atiende notas de voz, agenda citas en segundos y fideliza clientas con fichas técnicas de tinte.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <a
                href="#solicitar"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/40 transition-all"
              >
                <Gift className="w-5 h-5" />
                <span>Reclamar Web Gratis + Demo 14 Días</span>
              </a>
              <Link
                to="/reservas"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>Ver Portal de Reservas</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <span>Instalación llave en mano en 48 horas sin costo inicial</span>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-dark-800 border border-orange-500/30 rounded-2xl p-3 shadow-2xl shadow-black/80">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=700&q=80"
                alt="Salón de Belleza Profesional"
                className="w-full h-64 sm:h-80 object-cover rounded-xl"
              />
              <div className="mt-3.5 p-1 flex justify-between items-center">
                <div>
                  <strong className="text-white text-sm block">Studio Glamour Spa</strong>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bot de WhatsApp Activo 24/7
                  </span>
                </div>
                <span className="bg-white text-dark-900 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-orange-500" /> IA Conectada
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3-Box Showcase Row */}
      <section className="py-8 bg-dark-800/40 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Box 1 */}
          <div className="bg-orange-500 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-orange-500/20 min-h-[190px]">
            <div>
              <h3 className="text-4xl font-extrabold">+35%</h3>
              <p className="font-semibold text-sm mt-1">Citas Nuevas Agendadas en Automático por WhatsApp IA</p>
            </div>
            <a href="#solicitar" className="inline-flex items-center gap-1 text-xs font-bold bg-white text-dark-900 px-3.5 py-1.5 rounded-full w-fit mt-4">
              Reclamar Ahora <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Box 2: Photo */}
          <div className="relative rounded-xl overflow-hidden min-h-[190px] border border-white/10 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80')" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent p-6 flex flex-col justify-end">
              <span className="text-xs uppercase font-bold text-orange-500">// SALÓN EN VIVO</span>
              <h4 className="text-base font-bold text-white">Atención de Lujo para tus Clientas</h4>
            </div>
          </div>

          {/* Box 3 */}
          <div className="bg-orange-500 text-white rounded-xl p-6 flex flex-col justify-between shadow-lg shadow-orange-500/20 min-h-[190px]">
            <div>
              <h3 className="text-4xl font-extrabold">80%</h3>
              <p className="font-semibold text-sm mt-1">Menos Plantones (No-Shows) con Recordatorios 24h y 2h antes</p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold bg-white text-dark-900 px-3.5 py-1.5 rounded-full w-fit mt-4">
              Ver Panel SaaS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About & Transformation */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
              alt="Equipo de Estilistas"
              className="w-full h-80 sm:h-96 object-cover rounded-2xl border border-white/10 shadow-2xl"
            />
            <div className="mt-3 bg-dark-800 border border-orange-500/40 rounded-xl p-4 flex items-center gap-3.5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xl font-extrabold text-white block leading-tight">87,450+</strong>
                <span className="text-xs uppercase text-slate-400 tracking-wider">Citas Agendadas por IA</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider">// EL NUEVO ESTÁNDAR PARA SALONES</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Operación <span className="text-orange-500">100% Automatizada</span> & Rentable para tu Equipo
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Olvídate de los mensajes de WhatsApp sin responder a las 9:00 PM, citas anotadas en papel que se cruzan y fórmulas de tinte memorizadas que se pierden con el tiempo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Plantones reducidos a cero',
                'Fichas de colorimetría en la nube',
                'Liquidación comisiones en 1 clic',
                '0% Comisión por cada servicio',
                'Página web profesional de regalo',
                'Recordatorios WhatsApp automáticos'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="#solicitar"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-orange-500/30 transition-all"
              >
                <span>Comenzar Prueba Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Specialty Niches */}
      <section className="py-16 bg-dark-800/60 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1.5">// SOLUCIONES ADAPTADAS</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Diseñado para los Especialistas más <span className="text-orange-500">Exigentes</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-700 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-orange-500/50 transition-all">
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" alt="Salón" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Salones & Coloristas Top</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Guarda cada gramo de fórmula de tinte, volumen de oxidante y fotos de Antes/Después. Alertas automáticas de retoque.</p>
                <a href="#solicitar" className="block text-center text-xs font-bold py-2.5 rounded-lg border border-white/10 hover:border-orange-500 text-white transition-all">Explorar Salones →</a>
              </div>
            </div>

            <div className="bg-dark-700 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-orange-500/50 transition-all">
              <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80" alt="Barbería" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Barberías VIP & Grooming</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Agendamiento veloz en 30 segundos sin interrumpir el corte del barbero. Control de tiempos exactos y liquidación.</p>
                <a href="#solicitar" className="block text-center text-xs font-bold py-2.5 rounded-lg border border-white/10 hover:border-orange-500 text-white transition-all">Explorar Barberías →</a>
              </div>
            </div>

            <div className="bg-dark-700 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-orange-500/50 transition-all">
              <img src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80" alt="Spa" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Spas, Nails & Estética</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">Control de cabinas, asignación de especialistas en poligel y pestañas. Mensajes automáticos en los cumpleaños con cupones.</p>
                <a href="#solicitar" className="block text-center text-xs font-bold py-2.5 rounded-lg border border-white/10 hover:border-orange-500 text-white transition-all">Explorar Spas →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Oficiales Kowy (Escalera de Valor COP) */}
      <section id="planes" className="py-16 sm:py-24 bg-gradient-to-b from-[#090B10] via-[#0E121B] to-[#090B10]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A36] uppercase tracking-wider mb-2 bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PLANES TRANSPARENTES EN PESOS COLOMBIANOS ($ COP)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Sin Contratos de Permanencia. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#FF5A36] via-pink-500 to-amber-400 bg-clip-text text-transparent">
                Comienza con tu Web 100% Gratis
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Elige el plan que se adapte al tamaño de tu equipo. Todos los planes incluyen alojamiento seguro en la nube y vitrina digital de por vida.
            </p>
          </div>

          {/* Grid de los 4 Planes Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Plan 0: Gratuito */}
            <div className="bg-[#141926] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  PRESENCIA DE MARCA
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">🌐 Plan Gratuito</h3>
                <p className="text-xs text-slate-400 mt-1">Tu vitrina de lujo en Google</p>
                <div className="text-3xl font-black text-white my-4">
                  $0 <span className="text-xs font-normal text-slate-400">/ mes (De por vida)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <span>Página Web Profesional de Lujo (móvil y PC)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <span>Galería de fotos y catálogo de servicios</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <span>Dirección física y mapa en Google Maps</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> <span>Botón flotante directo a tu WhatsApp</span></li>
                  <li className="flex items-start gap-2 text-slate-500 line-through"><X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" /> <span>Agendador online interactivo</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3 rounded-2xl border border-white/10 hover:border-white/30 text-white text-xs font-bold transition-all bg-white/[0.02]"
              >
                Reclamar Web Gratis
              </a>
            </div>

            {/* Plan 1: Inicio */}
            <div className="bg-[#141926] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  BARBERÍAS & INDEPENDIENTES
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">🚀 Plan Inicio</h3>
                <p className="text-xs text-slate-400 mt-1">Digitaliza tus citas sin llamadas</p>
                <div className="text-3xl font-black text-white my-4">
                  $50.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>Todo lo del Plan Gratuito</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>Agendador Interactivo (<strong className="text-white">kowy.app/reservar/:slug</strong>)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>Hasta 4 Colaboradores con agendas</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>Link para Bio de Instagram & TikTok</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> <span>Panel de control de citas para el salón</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
              >
                Comenzar con Inicio
              </a>
            </div>

            {/* Plan 2: Crecimiento (ESTRELLA - MES 1 INCLUIDO) */}
            <div className="bg-gradient-to-b from-[#181F33] to-[#121624] border-2 border-amber-400 rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-amber-500/15 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-wider shadow-lg flex items-center gap-1">
                <Crown className="w-3 h-3" /> REGALO EN TU MES 1
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  GESTIÓN & CAJA POS
                </span>
                <h3 className="text-xl font-extrabold text-amber-300 mt-3">📈 Plan Crecimiento</h3>
                <p className="text-xs text-slate-400 mt-1">Para salones medianos y spas</p>
                <div className="text-3xl font-black text-white my-4">
                  $120.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> <span>Colaboradores ILIMITADOS</span></li>
                  <li className="flex items-start gap-2 font-bold text-amber-200"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> <span>App Móvil para Estilistas (<strong className="text-white">/colaborador</strong>)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> <span>Módulo de Caja POS Profesional & Arqueo Z</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> <span>Liquidación automática de comisiones</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> <span>Inventario y venta de productos retail</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF5A36] hover:opacity-95 text-slate-950 text-xs font-black shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02]"
              >
                Reclamar con Mes 1 de Regalo
              </a>
            </div>

            {/* Plan 3: Pro Flow IA */}
            <div className="bg-gradient-to-b from-[#1E142B] to-[#140E1E] border border-purple-500/50 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-400 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  AUTOMATIZACIÓN IA 24/7
                </span>
                <h3 className="text-xl font-extrabold text-purple-300 mt-3">🤖 Plan Pro Flow IA</h3>
                <p className="text-xs text-slate-400 mt-1">Tu recepcionista virtual en WhatsApp</p>
                <div className="text-3xl font-black text-white my-4">
                  $240.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>Todo lo del Plan Crecimiento</span></li>
                  <li className="flex items-start gap-2 font-bold text-purple-300"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>Asistente Kowy IA en WhatsApp 24/7</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>Bandeja Omnicanal (WhatsApp + IG + FB)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>Recordatorios WhatsApp anti-plantón (24h y 2h)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" /> <span>Control humano en 1 clic (Human Takeover)</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition-all"
              >
                Activar Kowy IA
              </a>
            </div>

          </div>

          {/* Banner Planes Superiores: Escala & Agencia VIP */}
          <div className="mt-8 p-6 rounded-3xl bg-[#141926] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                PLANES PARA CADENAS & SPAS DE ALTO VOLUMEN
              </span>
              <h4 className="text-lg font-black text-white">¿Buscas Pauta en Meta Ads o Gestión Llave en Mano?</h4>
              <p className="text-xs text-slate-400 max-w-2xl">
                Contamos con el <strong>Plan Escala ($720k COP/mes)</strong> con pauta geolocalizada y radar de clientas inactivas (+35 días), y el <strong>Plan Agencia VIP ($1.44M COP/mes)</strong> con equipo dedicado y dominio propio.
              </p>
            </div>
            <a
              href="https://wa.me/573009008000?text=Hola%20Kowy,%20deseo%20consultar%20sobre%20los%20Planes%20Escala%20o%20Agencia%20VIP"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 shrink-0 transition-all"
            >
              Consultar Planes VIP →
            </a>
          </div>

        </div>
      </section>

      {/* Lead Capture Form con Oferta de Activación $50k (Anclaje $680.000) */}
      <section id="solicitar" className="py-16 sm:py-24 bg-gradient-to-b from-[#090B10] to-[#0E121B] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#141926] border-2 border-[#FF5A36]/40 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider mb-3">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>OFERTA DE LANZAMIENTO LOCAL</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Reclama la <span className="bg-gradient-to-r from-[#FF5A36] to-pink-500 bg-clip-text text-transparent">Página Web Gratis</span> de tu Salón
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                El desarrollo y configuración comercial regular cuesta <strong className="text-rose-400 line-through">$680.000 COP</strong>. Por un aporte simbólico de activación de solo <strong className="text-emerald-400 font-extrabold">$50.000 COP</strong>, te entregamos tu web personalizada lista en 48 horas con el <strong className="text-amber-300">Plan Crecimiento de Regalo durante tus primeros 30 días</strong>.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-black text-white">¡Solicitud Recibida con Éxito!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Un especialista de Kowy se comunicará a tu WhatsApp en los próximos 15 minutos para entregarte el boceto de tu página web oficial.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre de tu Salón / Barbería / Spa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sandra Color´s Studio"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tu Nombre y Cargo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sandra Pérez (Dueña)"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Número de WhatsApp Principal *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 300 123 4567"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ciudad / Municipio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Medellín / Apartadó, Colombia"
                    className="w-full bg-[#0E121B] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div className="sm:col-span-2 pt-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF5A36] via-pink-500 to-amber-500 hover:opacity-95 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.01] text-sm cursor-pointer"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Reclamar Mi Web Gratis + 30 Días de Plan Crecimiento</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cero riesgo • Sin contratos ni cláusulas de permanencia • Soporte local en Colombia</span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-white/10 py-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5 text-white font-black text-base">
            <img
              src="/kowy-logo.jpg"
              alt="Kowy Logo"
              className="w-6 h-6 rounded-lg object-cover"
            />
            <span>Kowy<span className="text-[#FF5A36]">.app</span></span>
          </div>
          <div>© 2026 Kowy.app • La Plataforma Todo-en-Uno para Salones, Barberías y Spas</div>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-orange-500">Ingresar</Link>
            <Link to="/reservas" className="hover:text-orange-500">Portal Citas</Link>
            <Link to="/dashboard" className="hover:text-orange-500">Demo SaaS</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
