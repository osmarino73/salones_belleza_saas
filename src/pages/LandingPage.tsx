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
  Sparkles
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
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-500/40">
              <Scissors className="w-4 h-4" />
            </div>
            <span>BeautyFlow<span className="text-orange-500">.AI</span></span>
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

      {/* Pricing Plans */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1.5">// PLANES TRANSPARENTES</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Suscripción Mensual <span className="text-orange-500">Sin Contratos Engañosos</span></h2>
            <p className="text-slate-400 text-sm mt-2">Página web profesional de regalo incluida en todos los planes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Plan 1 */}
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-7">
              <h3 className="text-xl font-bold text-white">Plan Básico</h3>
              <p className="text-xs text-slate-400">Para 1 a 2 Estilistas o Barberos</p>
              <div className="text-4xl font-extrabold text-white my-4">$39 <span className="text-sm font-normal text-slate-400">/mes</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Página Web Profesional de Regalo</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Agendamiento Web en Línea</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> CRM Fichas de Clientes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Hasta 2 Agendas de Estilistas</li>
              </ul>
              <a href="#solicitar" className="block text-center py-2.5 rounded-lg border border-white/10 hover:border-orange-500 text-white text-xs font-bold transition-all">Elegir Plan Básico</a>
            </div>

            {/* Plan 2: Featured */}
            <div className="bg-dark-700 border-2 border-orange-500 rounded-2xl p-8 shadow-xl shadow-orange-500/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                MÁS POPULAR
              </div>
              <h3 className="text-xl font-bold text-orange-500">Plan PRO IA</h3>
              <p className="text-xs text-slate-400">Salones Medianos (3 a 6 Estilistas)</p>
              <div className="text-4xl font-extrabold text-white my-4">$89 <span className="text-sm font-normal text-slate-400">/mes</span></div>
              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Todo lo del Plan Básico</li>
                <li className="flex items-center gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Agente IA en WhatsApp 24/7</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Recordatorios Anti-Plantón WhatsApp</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Ficha Técnica de Tintes & Fórmulas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Hasta 6 Agendas de Estilistas</li>
              </ul>
              <a href="#solicitar" className="block text-center py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/30 transition-all">
                Iniciar Prueba de 14 Días
              </a>
            </div>

            {/* Plan 3 */}
            <div className="bg-dark-800 border border-white/10 rounded-2xl p-7">
              <h3 className="text-xl font-bold text-white">Plan VIP 360°</h3>
              <p className="text-xs text-slate-400">Salones Grandes & Multi-Sede</p>
              <div className="text-4xl font-extrabold text-white my-4">$149 <span className="text-sm font-normal text-slate-400">/mes</span></div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Todo lo del Plan PRO IA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Estilistas e Agendas Ilimitadas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Módulo POS de Caja & Retail</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" /> Liquidación de Comisiones de Equipo</li>
              </ul>
              <a href="#solicitar" className="block text-center py-2.5 rounded-lg border border-white/10 hover:border-orange-500 text-white text-xs font-bold transition-all">Elegir Plan VIP 360°</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="solicitar" className="py-16 sm:py-24 bg-gradient-to-b from-dark-800 to-dark-900 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-dark-800 border border-orange-500/40 rounded-2xl p-6 sm:p-10 shadow-2xl text-center">
            <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">// OFERTA LIMITADA POR CIUDAD</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Solicita la <span className="text-orange-500">Página Web Gratis</span> de tu Salón
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
              Te entregamos el diseño web personalizado de tu salón en 48 horas con el motor de IA y agendamiento 24/7 activado por 14 días sin costo.
            </p>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">¡Solicitud Recibida con Éxito!</h3>
                <p className="text-xs text-slate-300">Un especialista se comunicará a tu WhatsApp en los próximos 15 minutos para entregarte tu boceto de página web gratis.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre de tu Salón / Spa</label>
                  <input type="text" required placeholder="Studio Glamour Spa" className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tu Nombre y Cargo</label>
                  <input type="text" required placeholder="Sofía Restrepo (Dueña)" className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Principal</label>
                  <input type="tel" required placeholder="+57 300 123 4567" className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ciudad y País</label>
                  <input type="text" required placeholder="Medellín, Colombia" className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 transition-all text-sm">
                    <Gift className="w-5 h-5" />
                    <span>Reclamar Mi Web Gratis + 14 Días de IA</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-white/10 py-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-base">
            <Scissors className="w-4 h-4 text-orange-500" />
            <span>BeautyFlow<span className="text-orange-500">.AI</span></span>
          </div>
          <div>© 2026 BeautyFlow AI • Diseñado para Salones de Belleza Exclusivos en LATAM</div>
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
