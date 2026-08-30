import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors,
  CheckCircle2,
  Calendar,
  Gift,
  Clock,
  ChevronDown,
  ArrowRight,
  Star,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  Crown,
  Users,
  Smartphone,
  X,
  Copy,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  
  // Estado para el Simulador Instantáneo "Tu Salón en 5 Segundos"
  const [simSalonName, setSimSalonName] = useState('');
  const [simGeneratedSlug, setSimGeneratedSlug] = useState('');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Estado para la Calculadora de Pérdidas por Plantones (No-Shows)
  const [lostAppointments, setLostAppointments] = useState<number>(6);
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(75000);

  const monthlyLostMoney = useMemo(() => {
    return lostAppointments * avgTicketPrice;
  }, [lostAppointments, avgTicketPrice]);

  const yearlyLostMoney = useMemo(() => {
    return monthlyLostMoney * 12;
  }, [monthlyLostMoney]);

  // Formulario de Captura de Leads
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    whatsapp: '',
    city: '',
    niche: 'Salón de Belleza'
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSalonName.trim()) return;
    const cleanSlug = simSalonName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'mi-salon';
    setSimGeneratedSlug(cleanSlug);
    setIsSimModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Preparar mensaje de WhatsApp preformateado
    const message = encodeURIComponent(
      `¡Hola Kowy! 🚀 Deseo reclamar la oferta de activación para mi Salón:\n\n` +
      `🏢 Negocio: ${formData.businessName}\n` +
      `👤 Responsable: ${formData.ownerName}\n` +
      `📱 WhatsApp: ${formData.whatsapp}\n` +
      `📍 Ciudad: ${formData.city}\n` +
      `💇 Rubro: ${formData.niche}\n\n` +
      `Por favor contáctenme para entregar el diseño de mi página web y activar mis 30 días de regalo del Plan Crecimiento.`
    );

    // Abrir WhatsApp en nueva pestaña
    window.open(`https://wa.me/573114195123?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white font-body selection:bg-[#FF5A36] selection:text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-[#0A0D15] border-b border-white/5 py-2 text-xs text-slate-400 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              Página Web Profesional de Regalo + Agendador Online 24/7
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF5A36]" />
              Instalación Lista en 48 Horas
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/573114195123?text=Hola%20Kowy,%20deseo%20asesoria%20para%20mi%20salon"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[#FF5A36] hover:text-[#ff785a] font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Oficial: +57 311 419 5123
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Glassmorphism */}
      <header className="sticky top-0 z-50 bg-[#0A0E18]/95 backdrop-blur-md border-b border-white/10 py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-black text-white">
            <img
              src="/kowy-logo.jpg"
              alt="Kowy Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-[#FF5A36]/20 border border-white/10"
            />
            <span className="tracking-tight">Kowy<span className="text-[#FF5A36]">.app</span></span>
          </Link>

          {/* Menú Central */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#demo" className="hover:text-[#FF5A36] transition-colors">Demo en Vivo</a>
            <a href="#pilares" className="hover:text-[#FF5A36] transition-colors">Funcionalidades</a>
            <a href="#calculadora" className="hover:text-[#FF5A36] transition-colors">Calculadora</a>
            <a href="#comparativa" className="hover:text-[#FF5A36] transition-colors">¿Por qué Kowy?</a>
            <a href="#planes" className="hover:text-[#FF5A36] transition-colors">Planes ($ COP)</a>
            <a href="#faq" className="hover:text-[#FF5A36] transition-colors">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/sitio/demo"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all"
            >
              <span>Ver Demo Web</span>
              <ExternalLink className="w-3 h-3 text-[#FF5A36]" />
            </Link>

            <Link
              to="/login"
              className="text-slate-300 hover:text-white text-xs font-bold px-3 py-2 transition-colors"
            >
              Iniciar Sesión
            </Link>

            <a
              href="#solicitar"
              className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#FF5A36]/25 transition-all active:scale-95"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Activar Mi Salón</span>
            </a>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION CON ESTILO OSCURO SOBRIO & ELEGANTE */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Glow unificado Kowy */}
        <div className="absolute top-10 left-1/3 -translate-x-1/2 w-[550px] h-[350px] bg-[#FF5A36]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Copy Persuasivo */}
          <div className="lg:col-span-7 space-y-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5A36]/10 border border-[#FF5A36]/25 text-[#FF5A36] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>La Plataforma #1 para Salones, Barberías & Spas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Llena la agenda de tu Salón <br className="hidden sm:block" />
              <span className="text-[#FF5A36]">
                en automático las 24 Horas
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base sm:leading-relaxed max-w-2xl">
              Te entregamos tu <strong>Página Web Profesional 100% Gratis</strong> y un sistema de agendamiento inteligente que elimina los plantones, te ahorra 15 horas de WhatsApp a la semana y permite a tus clientas reservar solas en 30 segundos.
            </p>

            {/* Badges de Confianza Rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0" />
                <span>0% comisión por cita</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0" />
                <span>Sin contratos de amarre</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0" />
                <span>Entrega en 48 horas</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <a
                href="#solicitar"
                className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black px-7 py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#FF5A36]/30 transition-all hover:scale-[1.02] text-sm cursor-pointer"
              >
                <Gift className="w-5 h-5" />
                <span>Reclamar Web Gratis + 30 Días de Regalo</span>
              </a>

              <Link
                to="/reservar/demo"
                className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Calendar className="w-4 h-4 text-[#FF5A36]" />
                <span>Probar Agendador en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Dueña" />
                <img className="w-8 h-8 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80" alt="Estilista" />
                <img className="w-8 h-8 rounded-full border-2 border-[#07090E] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Barbero" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#FF5A36]">
                  {'★★★★★'} <strong className="text-white font-bold ml-1">4.9 / 5.0</strong>
                </div>
                <span>Más de 85 salones y barberías digitalizados en Colombia</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Mockup Interactivo de Celular */}
          <div className="lg:col-span-5 relative" id="demo">
            {/* Marco de Teléfono Glassmorphism */}
            <div className="relative mx-auto w-full max-w-[340px] bg-[#0E1322] border-4 border-white/10 rounded-[42px] p-3.5 shadow-2xl shadow-black/90 ring-1 ring-white/5">
              
              {/* Notificación Flotante Superior */}
              <div className="absolute -top-5 -left-4 sm:-left-8 z-20 bg-[#141A29]/95 border border-[#FF5A36]/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md max-w-[260px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF5A36]/30">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <span className="text-[10px] text-[#FF5A36] font-extrabold uppercase block leading-none">Nueva Cita Confirmada</span>
                    <strong className="text-xs text-white block truncate leading-tight mt-0.5">Balayage Deluxe ($180k)</strong>
                    <span className="text-[9px] text-slate-400 block">Mañana 2:30 PM • Valentina R.</span>
                  </div>
                </div>
              </div>

              {/* Pantalla Interna del Móvil */}
              <div className="bg-[#0A0D16] rounded-[32px] overflow-hidden border border-white/10 space-y-3 pb-4">
                
                {/* Header del Salón Demo */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
                    alt="Salón Demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D16] via-black/40 to-transparent p-3.5 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/70 text-slate-200 border border-white/10">
                        ● Abierto Ahora
                      </span>
                      <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-bold">
                        ⭐ 5.0 (140)
                      </span>
                    </div>
                    <div>
                      <strong className="text-base font-black text-white block">Studio Glamour & Spa</strong>
                      <span className="text-[10px] text-slate-300">El Poblado, Medellín</span>
                    </div>
                  </div>
                </div>

                {/* Catálogo Rápido con Botones de Cita */}
                <div className="px-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white text-[11px]">Servicios Destacados</span>
                    <Link to="/sitio/demo" className="text-[10px] text-[#FF5A36] font-bold hover:underline">
                      Ver Web Completa →
                    </Link>
                  </div>

                  {/* Servicio 1 */}
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-left">
                    <div>
                      <strong className="text-xs font-bold text-white block">Balayage Deluxe</strong>
                      <span className="text-[10px] text-slate-400">120 min • Con Mascarilla</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-white block">$180.000</span>
                      <Link
                        to="/reservar/demo?service=balayage"
                        className="text-[9px] font-extrabold px-2 py-1 rounded-lg bg-[#FF5A36] text-white inline-block mt-0.5"
                      >
                        Agendar
                      </Link>
                    </div>
                  </div>

                  {/* Servicio 2 */}
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-left">
                    <div>
                      <strong className="text-xs font-bold text-white block">Corte & Cepillado Spa</strong>
                      <span className="text-[10px] text-slate-400">45 min • Lavado Masaje</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-white block">$60.000</span>
                      <Link
                        to="/reservar/demo?service=corte"
                        className="text-[9px] font-extrabold px-2 py-1 rounded-lg bg-white/10 text-white inline-block mt-0.5 hover:bg-[#FF5A36]"
                      >
                        Agendar
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Botón WhatsApp Oficial */}
                <div className="px-3 pt-1">
                  <a
                    href="https://wa.me/573114195123?text=Hola%20Studio%20Glamour,%20vi%20su%20demo%20y%20quiero%20informacion"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>WhatsApp del Salón</span>
                  </a>
                </div>
              </div>

              {/* Botón Flotante Inferior: Ver Demo */}
              <div className="mt-3 flex gap-2">
                <Link
                  to="/sitio/demo"
                  className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold text-center border border-white/10 transition-colors"
                >
                  🌐 Abrir Web Demo
                </Link>
                <Link
                  to="/reservar/demo"
                  className="flex-1 py-2 rounded-xl bg-[#FF5A36]/15 hover:bg-[#FF5A36]/25 text-[#FF5A36] text-[11px] font-bold text-center border border-[#FF5A36]/30 transition-colors"
                >
                  📅 Probar Citas
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. WIDGET SIMULADOR: TU SALÓN EN KOWY EN 5 SEGUNDOS */}
      <section className="py-12 bg-[#0A0D15] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-1.5 text-center md:text-left max-w-md">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-full border border-[#FF5A36]/20">
                <Zap className="w-3 h-3" />
                <span>Simulador Instantáneo</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Mira cómo lucirá la Web de tu Salón
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escribe el nombre de tu negocio y generaremos tu enlace oficial y vista previa interactiva en segundos.
              </p>
            </div>

            {/* Formulario de Simulación Rápida */}
            <form onSubmit={handleSimulate} className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                required
                value={simSalonName}
                onChange={(e) => setSimSalonName(e.target.value)}
                placeholder="Ej. Sandra Color´s Studio"
                className="flex-1 bg-[#07090E] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
              />
              <button
                type="submit"
                className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-[#FF5A36]/25 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                ⚡ Simular Mi Web
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* MODAL DEL SIMULADOR INSTANTÁNEO */}
      {isSimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0E1322] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setIsSimModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-[#FF5A36]/30">
              ✨
            </div>

            <h3 className="text-xl font-black text-white">
              ¡Tu Web Oficial para <span className="text-[#FF5A36]">{simSalonName}</span> está lista!
            </h3>

            <div className="p-3 rounded-2xl bg-[#07090E] border border-white/10 text-left space-y-1">
              <span className="text-[10px] text-slate-400 block font-semibold">Tus enlaces oficiales reservados:</span>
              <div className="text-xs font-mono text-[#FF5A36] font-bold truncate">
                kowy.app/sitio/{simGeneratedSlug}
              </div>
              <div className="text-xs font-mono text-slate-300 font-bold truncate">
                kowy.app/reservar/{simGeneratedSlug}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Para personalizar tus fotos, servicios, horarios y conectar tu WhatsApp oficial a estos enlaces, reclama tu activación hoy.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href="#solicitar"
                onClick={() => {
                  setFormData(prev => ({ ...prev, businessName: simSalonName }));
                  setIsSimModalOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-black transition-all shadow-md shadow-[#FF5A36]/30"
              >
                Reclamar Web de {simSalonName}
              </a>
              <Link
                to={`/reservar/demo`}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors"
              >
                Ver Demostración
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOS 4 PILARES DEL ECOSISTEMA KOWY (DISEÑO UNIFICADO) */}
      <section id="pilares" className="py-16 sm:py-24 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A36] uppercase tracking-wider bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TODO LO QUE TU SALÓN NECESITA EN UN SOLO LUGAR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Diseñado para que tu Salón facture más <br className="hidden sm:block" />
            <span className="text-[#FF5A36]">sin trabajar horas extras</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Elimina el caos de la agenda en papel y las respuestas manuales a medianoche. Kowy automatiza tu vitrina digital de punta a punta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pilar 1 */}
          <div className="p-6 rounded-3xl bg-[#0E1322] border border-white/10 hover:border-[#FF5A36]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/10 border border-[#FF5A36]/25 text-[#FF5A36] flex items-center justify-center font-bold">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">1. Página Web de Lujo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diseñada con estética de alta costura, galería de resultados, ubicación georreferenciada en Google Maps y catálogo visual optimizado para móviles.
              </p>
            </div>
            <Link to="/sitio/demo" className="text-xs font-bold text-[#FF5A36] hover:text-white flex items-center gap-1 pt-2">
              <span>Explorar Web Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pilar 2 */}
          <div className="p-6 rounded-3xl bg-[#0E1322] border border-white/10 hover:border-[#FF5A36]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/10 border border-[#FF5A36]/25 text-[#FF5A36] flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">2. Agendador 24/7</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tus clientas eligen día, turno disponible y su estilista favorita sin interrumpir tu trabajo. El motor respeta tus horarios de atención automáticamente.
              </p>
            </div>
            <Link to="/reservar/demo" className="text-xs font-bold text-[#FF5A36] hover:text-white flex items-center gap-1 pt-2">
              <span>Probar Agendador</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pilar 3 */}
          <div className="p-6 rounded-3xl bg-[#0E1322] border border-white/10 hover:border-[#FF5A36]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/10 border border-[#FF5A36]/25 text-[#FF5A36] flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">3. Recordatorios Anti-Plantón</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mensajes automáticos por WhatsApp 24 horas y 2 horas antes de cada cita. Reduce el 80% de cancelaciones y recupera turnos a tiempo.
              </p>
            </div>
            <a href="#calculadora" className="text-xs font-bold text-[#FF5A36] hover:text-white flex items-center gap-1 pt-2">
              <span>Calcular Ahorro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Pilar 4 */}
          <div className="p-6 rounded-3xl bg-[#0E1322] border border-white/10 hover:border-[#FF5A36]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A36]/10 border border-[#FF5A36]/25 text-[#FF5A36] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">4. Equipo, Comisiones & POS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada colaboradora ve sus citas en su propio teléfono (<code className="text-[#FF5A36]">/colaborador</code>). Liquidación automática de comisiones y caja diaria en 1 clic.
              </p>
            </div>
            <Link to="/colaborador/sty-demo-1" className="text-xs font-bold text-[#FF5A36] hover:text-white flex items-center gap-1 pt-2">
              <span>Ver App Estilista</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. CALCULADORA INTERACTIVA DE PÉRDIDAS POR PLANTONES */}
      <section id="calculadora" className="py-16 sm:py-24 bg-[#0A0D15] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
                💰 CALCULADORA FINANCIERA PARA SALONES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                ¿Cuánto dinero pierde tu Salón por clientas que no asisten?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Ajusta los valores de tu negocio y descubre el impacto económico real de los plantones.
              </p>
            </div>

            {/* Sliders Interactivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Slider 1: Citas no confirmadas */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Citas perdidas por mes:</span>
                  <strong className="text-lg font-black text-[#FF5A36]">{lostAppointments} clientas</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={lostAppointments}
                  onChange={(e) => setLostAppointments(Number(e.target.value))}
                  className="w-full accent-[#FF5A36] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Promedio en salones de Colombia: 5 a 10 citas/mes</span>
              </div>

              {/* Slider 2: Ticket Promedio */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Precio promedio por servicio:</span>
                  <strong className="text-lg font-black text-white">
                    ${avgTicketPrice.toLocaleString('es-CO')} COP
                  </strong>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="250000"
                  step="5000"
                  value={avgTicketPrice}
                  onChange={(e) => setAvgTicketPrice(Number(e.target.value))}
                  className="w-full accent-[#FF5A36] cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 block">Desde manicure ($35k) hasta balayage ($200k+)</span>
              </div>

            </div>

            {/* Resultado Financiero Impactante */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Pérdida mensual estimada en tu salón:</span>
                <strong className="text-2xl sm:text-3xl font-black text-white block">
                  -${monthlyLostMoney.toLocaleString('es-CO')} COP <span className="text-xs font-normal text-slate-400">/ mes</span>
                </strong>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Eso equivale a <strong>-${yearlyLostMoney.toLocaleString('es-CO')} COP</strong> al año en horas de trabajo vacías.
                </span>
              </div>

              <div className="shrink-0 bg-[#FF5A36]/15 border border-[#FF5A36]/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-[#FF5A36] font-black uppercase block">Con Kowy ($50k/mes):</span>
                <strong className="text-lg font-black text-white block mt-0.5">¡Se paga solo!</strong>
                <span className="text-[10px] text-slate-300 block">Con solo 1 cita recuperada al mes.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. TABLA COMPARATIVA: KOWY VS AGENDA TRADICIONAL */}
      <section id="comparativa" className="py-16 sm:py-24 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A36] uppercase tracking-wider bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
            <span>⚖️ COMPARATIVA DIRECTA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            ¿Cómo cambia tu día a día con Kowy?
          </h2>
        </div>

        <div className="bg-[#0E1322] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 sm:p-5 font-bold text-slate-400 w-2/5">Desafío en el Salón</th>
                  <th className="p-4 sm:p-5 font-bold text-slate-400 w-3/10">❌ Agenda de Papel / WhatsApp</th>
                  <th className="p-4 sm:p-5 font-black text-[#FF5A36] w-3/10 bg-[#FF5A36]/5">✅ Con Kowy (kowy.app)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Citas a deshoras (11:00 PM)</td>
                  <td className="p-4 sm:p-5 text-slate-400">Mensajes sin responder o responder cansada</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF5A36]/5">Agendador 24/7 automático</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Cruces de turnos y errores</td>
                  <td className="p-4 sm:p-5 text-slate-400">Citas dobles y clientas esperando enojadas</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF5A36]/5">Agenda blindada por especialista</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Plantones y No-Shows</td>
                  <td className="p-4 sm:p-5 text-slate-400">Pérdida del 20% al 30% de las citas</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF5A36]/5">Recordatorios WhatsApp 24h y 2h antes</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Liquidación de Comisiones</td>
                  <td className="p-4 sm:p-5 text-slate-400">Horas con calculadora y discusiones</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF5A36]/5">Cálculo exacto automático en 1 clic</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-white">Presencia en Google e Internet</td>
                  <td className="p-4 sm:p-5 text-slate-400">Invisible o página web costosa ($1M+)</td>
                  <td className="p-4 sm:p-5 text-white font-bold bg-[#FF5A36]/5">Página Web Profesional de Regalo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. ESCALERA DE PLANES Y PRECIOS TRANSPARENTES ($ COP) */}
      <section id="planes" className="py-16 sm:py-24 bg-[#0A0D15] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A36] uppercase tracking-wider bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
              <Crown className="w-3.5 h-3.5" />
              <span>PLANES EN PESOS COLOMBIANOS ($ COP) SIN PERMANENCIA</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Precios justos para crecer tu Salón
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Todos los planes incluyen tu Página Web Oficial de por vida y soporte prioritario por WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Plan 0: Gratuito */}
            <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  PRESENCIA DIGITAL
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">🌐 Plan Gratuito</h3>
                <p className="text-xs text-slate-400 mt-1">Tu vitrina de lujo en internet</p>
                <div className="text-3xl font-black text-white my-4">
                  $0 <span className="text-xs font-normal text-slate-400">/ mes (De por vida)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Página Web Profesional completa (móvil y PC)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Galería de fotos y catálogo de servicios</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Dirección física y mapa en Google Maps</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Botón flotante directo a tu WhatsApp</span></li>
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
            <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  BARBERÍAS & INDEPENDIENTES
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">🚀 Plan Inicio</h3>
                <p className="text-xs text-slate-400 mt-1">Citas automáticas sin llamadas</p>
                <div className="text-3xl font-black text-white my-4">
                  $50.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Todo lo del Plan Gratuito</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Agendador Interactivo 24/7 (<strong className="text-white">/reservar/:slug</strong>)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Hasta 4 Colaboradores con agenda</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Enlace para Bio de Instagram & TikTok</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Panel de control de citas del día</span></li>
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
            <div className="bg-[#121829] border-2 border-[#FF5A36] rounded-3xl p-6 flex flex-col justify-between shadow-2xl shadow-[#FF5A36]/15 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5A36] text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-wider shadow-lg flex items-center gap-1">
                <Crown className="w-3 h-3" /> 30 DÍAS DE REGALO
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30">
                  MÁS POPULAR • CAJA & COMISIONES
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">📈 Plan Crecimiento</h3>
                <p className="text-xs text-slate-400 mt-1">Para salones medianos y spas</p>
                <div className="text-3xl font-black text-white my-4">
                  $120.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Colaboradores ILIMITADOS</span></li>
                  <li className="flex items-start gap-2 font-bold text-slate-200"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>App Móvil para Estilistas (<strong className="text-white">/colaborador</strong>)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Caja POS Profesional & Arqueo Z</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Liquidación automática de comisiones</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Inventario y venta de productos</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3.5 rounded-2xl bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-black shadow-lg shadow-[#FF5A36]/30 transition-all hover:scale-[1.02]"
              >
                Reclamar con Mes 1 de Regalo
              </a>
            </div>

            {/* Plan 3: Pro Flow IA */}
            <div className="bg-[#0E1322] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  AUTOMATIZACIÓN IA 24/7
                </span>
                <h3 className="text-xl font-extrabold text-white mt-3">🤖 Plan Pro Flow IA</h3>
                <p className="text-xs text-slate-400 mt-1">Recepcionista virtual con IA</p>
                <div className="text-3xl font-black text-white my-4">
                  $240.000 <span className="text-xs font-normal text-slate-400">COP / mes</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                  <li className="flex items-start gap-2 font-bold text-white"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Todo lo del Plan Crecimiento</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Asistente IA en WhatsApp 24/7</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Bandeja Omnicanal (WhatsApp + IG + FB)</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Recordatorios WhatsApp anti-plantón</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" /> <span>Control humano en 1 clic</span></li>
                </ul>
              </div>
              <a
                href="#solicitar"
                className="w-full text-center py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-black transition-all border border-white/10"
              >
                Activar Kowy IA
              </a>
            </div>

          </div>

          {/* Banner Planes VIP: Escala & Agencia */}
          <div className="mt-8 p-6 rounded-3xl bg-[#0E1322] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-[#FF5A36]/10 px-2.5 py-0.5 rounded-full border border-[#FF5A36]/20">
                PLANES PARA CADENAS & SPAS DE ALTO VOLUMEN
              </span>
              <h4 className="text-lg font-black text-white">¿Buscas Pauta en Meta Ads o Gestión Llave en Mano?</h4>
              <p className="text-xs text-slate-400 max-w-2xl">
                Contamos con el <strong>Plan Escala ($720k COP/mes)</strong> con pauta publicitaria geolocalizada, y el <strong>Plan Agencia VIP ($1.44M COP/mes)</strong> con equipo dedicado y dominio propio.
              </p>
            </div>
            <a
              href="https://wa.me/573114195123?text=Hola%20Kowy,%20deseo%20consultar%20sobre%20los%20Planes%20Escala%20o%20Agencia%20VIP"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 shrink-0 transition-all"
            >
              Consultar Planes VIP →
            </a>
          </div>

        </div>
      </section>

      {/* 7. OFERTA DE LANZAMIENTO & FORMULARIO DE CAPTURA ($50k) */}
      <section id="solicitar" className="py-16 sm:py-24 bg-[#07090E] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#0E1322] border border-[#FF5A36]/30 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-center">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5A36]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF5A36] bg-[#FF5A36]/10 px-3.5 py-1 rounded-full border border-[#FF5A36]/20 uppercase tracking-wider">
                <Gift className="w-4 h-4 text-[#FF5A36]" />
                <span>OFERTA DE LANZAMIENTO LOCAL EN COLOMBIA</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Reclama la <span className="text-[#FF5A36]">Página Web de tu Salón</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                El desarrollo y configuración comercial regular cuesta <strong className="text-slate-400 line-through">$680.000 COP</strong>. Por un aporte simbólico de activación de solo <strong className="text-white font-extrabold">$50.000 COP</strong>, te entregamos tu web personalizada lista en 48 horas con el <strong className="text-[#FF5A36]">Plan Crecimiento de Regalo durante tus primeros 30 días</strong>.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#07090E] border border-white/10 rounded-2xl p-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#FF5A36] mx-auto" />
                <h3 className="text-xl font-black text-white">¡Solicitud Enviada a WhatsApp!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Se ha abierto la conversación oficial con nuestro equipo. Si no se abrió automáticamente, pulsa el botón de abajo.
                </p>
                <a
                  href={`https://wa.me/573114195123?text=Hola%20Kowy,%20registre%20mi%20negocio%20${encodeURIComponent(formData.businessName)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black px-6 py-3 rounded-2xl text-xs shadow-lg shadow-[#FF5A36]/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Chat de WhatsApp (+57 311 419 5123)</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre de tu Salón / Barbería / Spa *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Ej. Sandra Color´s Studio"
                    className="w-full bg-[#07090E] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Tu Nombre y Cargo *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Ej. Sandra Pérez (Dueña)"
                    className="w-full bg-[#07090E] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Número de WhatsApp Principal *</label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-[#07090E] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ciudad / Municipio *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej. Medellín, Apartadó, Bogotá..."
                    className="w-full bg-[#07090E] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <div className="sm:col-span-2 pt-3">
                  <button
                    type="submit"
                    className="w-full bg-[#FF5A36] hover:bg-[#E54E07] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#FF5A36]/30 transition-all hover:scale-[1.01] text-sm cursor-pointer"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Reclamar Mi Web Gratis + 30 Días de Plan Crecimiento</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>Cero riesgo • Sin contratos de permanencia • Soporte local en Colombia</span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. PREGUNTAS FRECUENTES (FAQ) */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-black uppercase text-[#FF5A36] bg-[#FF5A36]/10 px-3 py-1 rounded-full border border-[#FF5A36]/20">
            DUDAS FRECUENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Preguntas Frecuentes de Dueñas de Salón
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: '¿Por qué la Página Web es 100% Gratis?',
              a: 'Porque queremos que experimentes el poder de tener presencia digital profesional sin barreras. El Plan Gratuito te permite tener tu vitrina web, fotos y WhatsApp de por vida sin pagar mensualidad.'
            },
            {
              q: '¿Qué incluye la activación de $50.000 COP?',
              a: 'Incluye la personalización comercial completa de tu página web en 48 horas (subida de tus fotos, catálogo de servicios, horarios y Google Maps) más 30 Días de Regalo del Plan Crecimiento ($120.000 COP) para probar el agendador online y control de colaboradoras.'
            },
            {
              q: '¿Mis clientas necesitan descargar alguna app para agendar?',
              a: 'No. Tus clientas solo abren el enlace desde tu biografía de Instagram, TikTok o WhatsApp (kowy.app/reservar/:tu-salon) y agendan directamente en su navegador en menos de 30 segundos.'
            },
            {
              q: '¿Cómo ven las colaboradoras sus citas?',
              a: 'Cada estilista o barbero recibe un enlace único para su celular (kowy.app/colaborador) donde ve únicamente sus turnos asignados del día, comisiones ganadas y fichas técnicas de clientas.'
            },
            {
              q: '¿Hay contratos de permanencia?',
              a: 'Ninguno. No exigimos cláusulas de permanencia ni cobramos comisiones por cada servicio que realices. Si deseas pausar o cambiar de plan, puedes hacerlo en cualquier momento.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#0E1322] border border-white/10 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-white flex justify-between items-center gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#FF5A36] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-white/10 py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
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
            <Link to="/sitio/demo" className="hover:text-[#FF5A36]">Ver Demo Web</Link>
            <Link to="/reservar/demo" className="hover:text-[#FF5A36]">Probar Agendador</Link>
            <Link to="/login" className="hover:text-[#FF5A36]">Iniciar Sesión</Link>
          </div>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE DE WHATSAPP OFICIAL (311 419 5123) */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <a
          href="https://wa.me/573114195123?text=Hola%20Kowy,%20estoy%20viendo%20la%20pagina%20web%20y%20deseo%20asesoria"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#FF5A36] hover:bg-[#E54E07] text-white flex items-center justify-center shadow-2xl shadow-[#FF5A36]/40 transition-all hover:scale-110 active:scale-95 group"
          title="Hablar con un Asesor Kowy por WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>

    </div>
  );
};
