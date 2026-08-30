import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/supabase';
import { ProspectSite } from '../types';
import { Calendar } from 'lucide-react';
import { injectProspectLinks } from '../lib/prospectHtmlInjector';

export const PublicProspectSitePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<ProspectSite | null>(null);
  const [tenant, setTenant] = useState<any | null>(null);
  const [liveServices, setLiveServices] = useState<any[]>([]);
  const [liveStylists, setLiveStylists] = useState<any[]>([]);
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

        // Cargar tenant, servicios y estilistas reales configurados en Supabase
        try {
          const tenantData = await api.getTenantBySlug(slug);
          if (tenantData) {
            setTenant(tenantData);
            const tid = tenantData.id;
            if (tid && tid !== '00000000-0000-0000-0000-000000000001') {
              const [dbServices, dbStylists] = await Promise.all([
                api.getServices(tid),
                api.getStylists(tid)
              ]);
              if (dbServices && dbServices.length > 0) {
                setLiveServices(dbServices);
              }
              if (dbStylists && dbStylists.length > 0) {
                setLiveStylists(dbStylists);
              }
            }
          }
        } catch (e) {
          console.warn('Error loading live services or stylists for site:', e);
        }
      }
      setLoading(false);
    }
    loadSite();
  }, [slug]);

  // Inyectar enlaces de agendamiento (/reservar/:slug), WhatsApp, catálogo vivo y equipo en el HTML nativo
  const renderedHtml = useMemo(() => {
    if (!site?.raw_html) return '';
    const bData = (site as any).business_data || {};
    const showTeam = tenant?.show_team_section !== undefined 
      ? tenant.show_team_section 
      : (bData.show_team_section !== undefined ? bData.show_team_section : true);

    const showAbout = tenant?.show_about_section !== undefined
      ? tenant.show_about_section
      : (bData.show_about_section !== undefined ? bData.show_about_section : true);

    const showDiscount = tenant?.show_first_visit_discount !== undefined
      ? tenant.show_first_visit_discount
      : (bData.show_first_visit_discount !== undefined ? bData.show_first_visit_discount : false);

    // Filtrar textos de muestra o fallbacks antiguos para no sobreescribir la plantilla base
    const rawTitleAccent = tenant?.title_accent || bData.title_accent;
    const cleanTitleAccent = rawTitleAccent && rawTitleAccent !== 'Centro de Estética' ? rawTitleAccent : undefined;

    const rawEyebrow = tenant?.hero_eyebrow || bData.hero_eyebrow;
    const cleanEyebrow = rawEyebrow && rawEyebrow !== 'Bienvenidas a ❤️' ? rawEyebrow : undefined;

    const rawSlogan = tenant?.slogan || bData.slogan;
    const cleanSlogan = rawSlogan && rawSlogan !== 'Sandra Color´s' && rawSlogan !== site.business_name ? rawSlogan : undefined;

    const rawAboutBadge = tenant?.about_badge_text || bData.about_badge_text;
    const cleanAboutBadge = rawAboutBadge && rawAboutBadge !== 'VIP EXPERIENCIA SALÓN' ? rawAboutBadge : undefined;

    const rawAboutAccent = tenant?.about_title_accent || bData.about_title_accent;
    const cleanAboutAccent = rawAboutAccent && rawAboutAccent !== 'PASIÓN POR TU BELLEZA.' ? rawAboutAccent : undefined;

    const rawAboutDesc = tenant?.about_description || bData.about_description;
    const cleanAboutDesc = rawAboutDesc && !rawAboutDesc.includes('Transformamos el cuidado') && !rawAboutDesc.startsWith('Especialistas certificadas') ? rawAboutDesc : undefined;

    return injectProspectLinks(site.raw_html, {
      slug: site.slug,
      businessName: site.business_name,
      phoneWhatsapp: site.phone_whatsapp,
      primaryColor: tenant?.primary_color || bData.primary_color || undefined,
      showTeamSection: showTeam,
      showFirstVisitDiscount: showDiscount,
      firstVisitDiscountPct: tenant?.first_visit_discount_pct || bData.first_visit_discount_pct || 15,
      firstVisitDiscountTitle: tenant?.first_visit_discount_title || bData.first_visit_discount_title || undefined,
      heroImageUrl: tenant?.hero_image_url || bData.hero_image_url || undefined,
      logoIcon: tenant?.logo_icon || bData.logo_icon || undefined,
      heroEyebrow: cleanEyebrow,
      slogan: cleanSlogan,
      titleAccent: cleanTitleAccent,
      navbarTagline: tenant?.navbar_tagline || bData.navbar_tagline || undefined,
      subtitle: tenant?.subtitle || bData.subtitle || undefined,
      aboutImageUrl: tenant?.about_image_url || bData.about_image_url || undefined,
      aboutBadgeText: cleanAboutBadge,
      aboutEyebrow: tenant?.about_eyebrow || bData.about_eyebrow || undefined,
      aboutTitle: tenant?.about_title || bData.about_title || undefined,
      aboutTitleAccent: cleanAboutAccent,
      aboutDescription: cleanAboutDesc,
      aboutYearsExp: tenant?.about_years_exp || bData.about_years_exp || undefined,
      aboutClientsCount: tenant?.about_clients_count || bData.about_clients_count || undefined,
      aboutStat3Text: tenant?.about_stat3_text || bData.about_stat3_text || undefined,
      aboutRatingText: tenant?.about_rating_text || bData.about_rating_text || undefined,
      showAboutSection: showAbout,
      liveServices: liveServices.length > 0 ? liveServices : undefined,
      liveStylists: liveStylists.length > 0 ? liveStylists : undefined
    });
  }, [site, liveServices, liveStylists, tenant]);

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
          Ir a Kowy.app
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent">
      <iframe 
        title={`${site.business_name} | Sitio Oficial`}
        srcDoc={renderedHtml}
        className="w-full min-h-screen border-0 block"
        style={{
          width: '100%',
          height: '100vh',
          minHeight: '100vh',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};

