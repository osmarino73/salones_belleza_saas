import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/supabase';
import { ProspectSite } from '../types';
import { Calendar } from 'lucide-react';
import { injectProspectLinks } from '../lib/prospectHtmlInjector';

export const PublicProspectSitePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<ProspectSite | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSite() {
      if (!slug) return;
      setLoading(true);
      const found = await api.getProspectSiteBySlug(slug);
      if (found) {
        setSite(found);
        api.incrementProspectSiteViews(found.id);
        
        // Actualizar título de la pestaña para Google SEO
        document.title = `${found.business_name} | Sitio Oficial`;
      }
      setLoading(false);
    }
    loadSite();
  }, [slug]);

  // Inyectar enlaces de agendamiento (/reservar/:slug) y WhatsApp en el HTML nativo
  const renderedHtml = useMemo(() => {
    if (!site?.raw_html) return '';
    return injectProspectLinks(site.raw_html, {
      slug: site.slug,
      businessName: site.business_name,
      phoneWhatsapp: site.phone_whatsapp
    });
  }, [site]);

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

  return (
    <div 
      className="w-full min-h-screen"
      dangerouslySetInnerHTML={{ __html: renderedHtml }} 
    />
  );
};

