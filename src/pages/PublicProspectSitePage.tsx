import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/supabase';
import { ProspectSite } from '../types';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Phone, MapPin, ExternalLink, CheckCircle } from 'lucide-react';

export const PublicProspectSitePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<ProspectSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  useEffect(() => {
    async function loadSite() {
      if (!slug) return;
      setLoading(true);
      const found = await api.getProspectSiteBySlug(slug);
      if (found) {
        setSite(found);
        api.incrementProspectSiteViews(found.id);
        
        // Actualizar título de la pestaña para Google SEO
        document.title = `${found.business_name} - Sitio Oficial | Citas Online`;
      }
      setLoading(false);
    }
    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FF5A36] border-t-transparent animate-spin mb-4" />
        <p className="text-slate-400 text-sm animate-pulse">Cargando sitio oficial...</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center mb-4 border border-[#FF5A36]/20">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black mb-2">Sitio Web en Preparación</h1>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          La página web para este salón de belleza está siendo optimizada para Google Maps y agendamiento online.
        </p>
        <Link
          to="/"
          className="bg-[#FF5A36] text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-lg shadow-[#FF5A36]/30"
        >
          Ir a BeautyFlow AI
        </Link>
      </div>
    );
  }

  const cleanPhone = site.phone_whatsapp.replace(/\D/g, '');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative font-sans">
      
      {/* =====================================================================
          1. TOP CLAIM BANNER (EL GANCHO PARA LA DUEÑA)
          ===================================================================== */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#121727] via-[#1a233a] to-[#121727] border-b border-white/10 text-white px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs">
              Sitio web de cortesía optimizado para <strong>{site.business_name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/onboarding?reclamar=${site.slug}&nombre=${encodeURIComponent(site.business_name)}&tel=${encodeURIComponent(site.phone_whatsapp)}`}
              className="bg-gradient-to-r from-[#FF5A36] to-pink-500 hover:opacity-95 text-white font-black px-3.5 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>¿Eres la dueña? Activar 14 Días Gratis</span>
            </Link>
          </div>

        </div>
      </header>

      {/* =====================================================================
          2. RENDERIZADOR DEL HTML PURO GENERADO POR TU SISTEMA
          ===================================================================== */}
      <main className="flex-1 w-full bg-white relative">
        <div 
          className="w-full min-h-[85vh]"
          dangerouslySetInnerHTML={{ __html: site.raw_html }} 
        />
      </main>

      {/* =====================================================================
          3. BOTONES FLOTANTES DE ACCIÓN (AGENDAR CITA & WHATSAPP)
          ===================================================================== */}
      {/* Botón Flotante Agendar Cita */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <Link
          to={`/reservar/${site.slug}`}
          className="bg-gradient-to-r from-[#FF5A36] to-[#FF3B14] hover:from-[#FF4820] hover:to-[#E52E07] text-white font-black px-5 py-3.5 rounded-full shadow-2xl shadow-[#FF5A36]/50 flex items-center gap-2 text-sm transition-all hover:scale-105 group border border-white/20"
        >
          <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>📅 Agendar Cita Online</span>
        </Link>
      </div>

      {/* Botón Flotante WhatsApp */}
      {cleanPhone && (
        <div className="fixed bottom-5 left-5 z-40">
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${site.business_name}, vi su página web y quiero información de servicios.`)}`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold p-3.5 rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-110 border border-white/20"
            title="Escribir por WhatsApp"
          >
            <Phone className="w-5 h-5 fill-current" />
          </a>
        </div>
      )}

      {/* =====================================================================
          4. FOOTER SEO & VERIFICACIÓN GOOGLE MAPS
          ===================================================================== */}
      <footer className="bg-[#0B0F19] border-t border-white/10 text-slate-400 py-6 px-4 text-center text-xs">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-4 flex-wrap text-slate-300">
            {site.address && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5A36]" /> {site.address}, {site.city}
              </span>
            )}
            {site.phone_whatsapp && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {site.phone_whatsapp}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Sitio web oficial verificado con tecnología <strong className="text-slate-300">BeautyFlow AI SaaS</strong>. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* =====================================================================
          5. SCHEMA.ORG JSON-LD (PARA POSICIONAR EN GOOGLE MAPS)
          ===================================================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HairSalon",
            "name": site.business_name,
            "telephone": site.phone_whatsapp,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": site.address || "",
              "addressLocality": site.city || "Medellín",
              "addressCountry": site.country || "CO"
            },
            "url": window.location.href
          })
        }}
      />

    </div>
  );
};
