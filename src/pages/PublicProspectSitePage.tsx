import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/supabase';
import { ProspectSite } from '../types';
import { Calendar, MessageCircle } from 'lucide-react';
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
      businessHours: typeof tenant?.business_hours?.summary === 'string'
        ? tenant.business_hours.summary
        : typeof bData.business_hours?.summary === 'string'
        ? bData.business_hours.summary
        : typeof bData.horario_atencion === 'string'
        ? bData.horario_atencion
        : bData.horario_atencion && typeof bData.horario_atencion === 'object'
        ? Object.entries(bData.horario_atencion).filter(([_, v]) => typeof v === 'string').map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' | ')
        : undefined,
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

  const cleanPhone = site.phone_whatsapp ? site.phone_whatsapp.replace(/\D/g, '') : '';
  const waUrl = cleanPhone 
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`¡Hola ${site.business_name}! Vi su página web oficial y quisiera consultar información.`)}`
    : null;

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-transparent">
      <iframe 
        title={`${site.business_name} | Sitio Oficial`}
        srcDoc={renderedHtml}
        className="w-full h-full border-0 block"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          border: 'none',
          display: 'block'
        }}
      />

      {/* Botón Flotante React Nativo: Siempre Visible en Pantalla con Icono Oficial de Alta Fidelidad */}
      {waUrl && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[99999] flex items-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#2fe577] to-[#128C7E] text-white flex items-center justify-center shadow-2xl shadow-emerald-500/60 transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer border border-white/30"
            title="Escribir por WhatsApp"
            aria-label={`Escribir por WhatsApp a ${site.business_name}`}
          >
            {/* Aura de pulso suave */}
            <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-60" />

            {/* Icono Oficial Vectorial WhatsApp de Alta Fidelidad */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-7 h-7 fill-white relative z-10 transition-transform group-hover:scale-105"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};


