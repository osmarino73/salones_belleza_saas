import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Globe, Sparkles, Save, ImagePlus, Palette, FileText, ExternalLink,
  Smartphone, Monitor, RotateCw, Check, MapPin, Phone, Upload, RefreshCw, CheckCircle2,
  Maximize2, X
} from 'lucide-react';
import BeautyImageGalleryModal from './BeautyImageGalleryModal';
import { BeautyImageType, Tenant } from '../../types';
import { injectBeautyHtml } from '../../lib/beautyHtmlInjector';
import { BEAUTY_SPECIALTIES } from '../../lib/beautySpecialties';
import { api, supabase, isSupabaseConfigured } from '../../lib/supabase';
import { compressImage } from '../../utils/imageCompressor';
import { uploadStockImageBlob } from '../../lib/beautyImageLibrary';

// Paletas de color premium para Barberías, Salones de Belleza, Nails & Spas
const PRESET_BEAUTY_COLORS = [
  { name: 'Oro Barbería', hex: '#e5a854', desc: 'Barbería Clásica & Madera' },
  { name: 'Rose Gold Luxury', hex: '#e11d48', desc: 'Salón Femenino & Colorimetría' },
  { name: 'Nude Champagne', hex: '#f59e0b', desc: 'Estética & Maquillaje' },
  { name: 'Rosa Pastel Nails', hex: '#ec4899', desc: 'Nails Bar & Pestañas' },
  { name: 'Verde Esmeralda Spa', hex: '#059669', desc: 'Spa Holístico & Masajes' },
  { name: 'Morado Glow Lavanda', hex: '#8b5cf6', desc: 'Lash & Brow Studio' },
  { name: 'Negro Mate & Carbón', hex: '#18181b', desc: 'Barbershop VIP & Tatuajes' },
  { name: 'Azul Real Zafiro', hex: '#2563eb', desc: 'Clínica Estética & Láser' },
];

interface WebsiteEditorTabProps {
  tenant?: Tenant | null;
  onSaved?: () => void;
}

export const WebsiteEditorTab: React.FC<WebsiteEditorTabProps> = ({ tenant, onSaved }) => {
  const [editorSection, setEditorSection] = useState<'branding' | 'colors' | 'copywriting'>('branding');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const previewColumnRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<'hero_desktop' | 'hero_mobile' | 'about' | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Estados de Configuración de la Web
  const [businessName, setBusinessName] = useState(tenant?.name || 'Mi Salón & Spa');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(tenant?.phone || '573000000000');
  const [address, setAddress] = useState(tenant?.address || 'Medellín, Colombia');
  const [city, setCity] = useState(tenant?.city || 'Medellín');
  const [primaryColor, setPrimaryColor] = useState(tenant?.primary_color || '#d97706');
  const [category, setCategory] = useState<string>('barberia');
  const [slug, setSlug] = useState(tenant?.slug || 'mi-salon');
  
  // Imágenes oficiales de alta resolución
  const [heroImage, setHeroImage] = useState(
    tenant?.hero_image_url || 
    'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp'
  );
  const [heroMobileImage, setHeroMobileImage] = useState(
    (tenant as any)?.hero_mobile_image_url || 
    'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp'
  );
  const [aboutImage, setAboutImage] = useState(
    (tenant as any)?.about_image_url || 
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80'
  );
  const [logoUrl, setLogoUrl] = useState(tenant?.logo_url || '');

  // Textos & Copywriting oficiales sincronizados con la plantilla
  const [headline, setHeadline] = useState('MAESTRÍA EN DEGRADADOS Y CUIDADO MASCULINO DE PRIMER NIVEL');
  const [subheadline, setSubheadline] = useState('Cortes de precisión, degradados skin fade impecables y perfilado de barba con toalla caliente.');
  const [heroBadge, setHeroBadge] = useState('BARBERÍA TRADICIONAL & MODERNA');

  // Sección Sobre Nosotros y Métricas de Autoridad
  const [aboutTitle, setAboutTitle] = useState('PRECISIÓN. ESTILO. CONFIANZA TOTAL.');
  const [aboutDescription, setAboutDescription] = useState('En Barber namia creemos que un gran corte es mucho más que un servicio: es una declaración de identidad. Combinamos la tradición del afeitado clásico con las últimas tendencias de degradados para que luzcas imponente.');
  const [metric1Val, setMetric1Val] = useState('8+');
  const [metric1Label, setMetric1Label] = useState('Años Exp.');
  const [metric2Val, setMetric2Val] = useState('20K+');
  const [metric2Label, setMetric2Label] = useState('Cortes Realizados');
  const [metric3Val, setMetric3Val] = useState('4');
  const [metric3Label, setMetric3Label] = useState('Master Barberos');
  const [metric4Val, setMetric4Val] = useState('4.9');
  const [metric4Label, setMetric4Label] = useState('Calificación');

  // Modal Galería de Imágenes
  const [galleryConfig, setGalleryConfig] = useState<{
    isOpen: boolean;
    type: BeautyImageType | 'todos';
    target: 'hero_desktop' | 'hero_mobile' | 'about' | 'logo';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Cargar datos del sitio existente en Supabase si están disponibles
  useEffect(() => {
    const loadSiteConfig = async () => {
      if (!tenant) return;
      if (tenant.name) setBusinessName(tenant.name);
      if (tenant.phone) setPhoneWhatsapp(tenant.phone);
      if (tenant.address) setAddress(tenant.address);
      if (tenant.city) setCity(tenant.city);
      if (tenant.slug) setSlug(tenant.slug);
      if (tenant.primary_color) setPrimaryColor(tenant.primary_color);
      if (tenant.hero_image_url) setHeroImage(tenant.hero_image_url);
      if ((tenant as any).hero_mobile_image_url) setHeroMobileImage((tenant as any).hero_mobile_image_url);
      if ((tenant as any).about_image_url) setAboutImage((tenant as any).about_image_url);

      // Buscar si tiene un prospect_site sincronizado
      try {
        if (tenant.slug) {
          const site = await api.getProspectSiteBySlug(tenant.slug);
          if (site) {
            if (site.primary_color) setPrimaryColor(site.primary_color);
            if (site.category) setCategory(site.category);
            const bData = (site.business_data || {}) as any;

            const isHttpUrl = (val?: string): val is string => Boolean(val && typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:image/')) && !val.includes('{{'));

            // 1. Extraer Hero Desktop real (desde business_data o el HTML renderizado)
            // 1. Extraer Hero Desktop real (desde business_data o el HTML renderizado)
            const extractedDesktop = site.raw_html?.match(/<picture[^>]*id=["'](?:canvasPoster|canvas-poster-fallback)["'][\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1]
              || site.raw_html?.match(/<picture[^>]*class=["'][^"']*canvas-poster-img[^"']*["'][\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1];
            if (isHttpUrl(bData.banner_url)) {
              setHeroImage(bData.banner_url);
            } else if (isHttpUrl(bData.hero_image_url)) {
              setHeroImage(bData.hero_image_url);
            } else if (isHttpUrl(extractedDesktop)) {
              setHeroImage(extractedDesktop);
            } else if (site.category === 'barberia') {
              setHeroImage('https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp');
            } else {
              setHeroImage('https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792079931885_Stylist_blow-drying_client_hair_2K_20261015104423.webp');
            }

            // 2. Extraer Hero Mobile real
            const extractedMobile = site.raw_html?.match(/<picture[^>]*id=["'](?:canvasPoster|canvas-poster-fallback)["'][\s\S]*?<source[^>]+srcset=["']([^"']+)["']/i)?.[1]
              || site.raw_html?.match(/<picture[^>]*class=["'][^"']*canvas-poster-img[^"']*["'][\s\S]*?<source[^>]+srcset=["']([^"']+)["']/i)?.[1];
            if (isHttpUrl(bData.banner_vertical_url)) {
              setHeroMobileImage(bData.banner_vertical_url);
            } else if (isHttpUrl(extractedMobile)) {
              setHeroMobileImage(extractedMobile);
            } else if (site.category === 'barberia') {
              setHeroMobileImage('https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp');
            } else {
              setHeroMobileImage('https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792083289211_Stylist_cutting_client_hair_20261015115430.webp');
            }

            // 3. Extraer Foto Sobre Nosotros / Experiencia
            const extractedAbout = site.raw_html?.match(/<div[^>]*class=["'][^"']*salon-image-showcase[^"']*["'][\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1]
              || site.raw_html?.match(/<section[^>]*id=["'](?:nosotros|about)["'][\s\S]*?<img[^>]+src=["']([^"']+)["']/i)?.[1];
            if (isHttpUrl(bData.about_image_url)) {
              setAboutImage(bData.about_image_url);
            } else if (isHttpUrl(extractedAbout)) {
              setAboutImage(extractedAbout);
            } else if (site.category === 'barberia') {
              setAboutImage('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80');
            } else {
              setAboutImage('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80');
            }

            // 4. Logo
            if (bData.logo_url) setLogoUrl(bData.logo_url);

            // 5. Headline real de la landing
            const extractedHeadline = site.raw_html?.match(/<h1[^>]*class=["'][^"']*hero-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)?.[1];
            if (bData.copywriting?.headline) {
              setHeadline(bData.copywriting.headline);
            } else if (extractedHeadline) {
              setHeadline(extractedHeadline.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            }

            // 6. Subheadline real de la landing
            const extractedSubheadline = site.raw_html?.match(/<p[^>]*class=["'][^"']*hero-desc[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1];
            if (bData.copywriting?.subheadline) {
              setSubheadline(bData.copywriting.subheadline);
            } else if (extractedSubheadline) {
              setSubheadline(extractedSubheadline.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            }

            // 7. Hero Badge / Eyebrow real (soporta .hero-script-tag, .eyebrow-pill, etc.)
            const extractedBadge = site.raw_html?.match(/<(?:span|div|p)[^>]*class=["'][^"']*(?:eyebrow-pill|hero-script-tag|hero-script-eyebrow|hero-eyebrow|badge-hero|hero-badge|script-eyebrow)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div|p)>/i)?.[1];
            if (bData.copywriting?.badge || bData.hero_badge || bData.hero_eyebrow) {
              setHeroBadge(bData.copywriting?.badge || bData.hero_badge || bData.hero_eyebrow);
            } else if (extractedBadge) {
              setHeroBadge(extractedBadge.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            }

            // 8. Título y Descripción de Sobre Nosotros
            const extractedAboutTitle = site.raw_html?.match(/<section[^>]*id=["']nosotros["'][\s\S]*?<h3>([\s\S]*?)<\/h3>/i)?.[1]
              || site.raw_html?.match(/class=["'][^"']*experience-text-content[^"']*["'][\s\S]*?<h3>([\s\S]*?)<\/h3>/i)?.[1];
            if (bData.about_title || bData.copywriting?.about_title) {
              setAboutTitle(bData.about_title || bData.copywriting?.about_title);
            } else if (extractedAboutTitle && !extractedAboutTitle.includes('{{')) {
              setAboutTitle(extractedAboutTitle.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            }

            const extractedAboutDesc = site.raw_html?.match(/class=["'][^"']*experience-text-content[^"']*["'][\s\S]*?<p>([\s\S]*?)<\/p>/i)?.[1];
            if (bData.about_description || bData.copywriting?.about_description) {
              setAboutDescription(bData.about_description || bData.copywriting?.about_description);
            } else if (extractedAboutDesc && !extractedAboutDesc.includes('{{')) {
              setAboutDescription(extractedAboutDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            } else if (tenant.name) {
              setAboutDescription(`En ${tenant.name} creemos que un gran corte es mucho más que un servicio: es una declaración de identidad. Combinamos la tradición del afeitado clásico con las últimas tendencias de degradados para que luzcas imponente.`);
            }

            // 9. Métricas de Autoridad
            const mData = bData.metrics || {};
            if (bData.metric1_val || mData.metric1Val) setMetric1Val(bData.metric1_val || mData.metric1Val);
            if (bData.metric1_label || mData.metric1Label) setMetric1Label(bData.metric1_label || mData.metric1Label);
            if (bData.metric2_val || mData.metric2Val) setMetric2Val(bData.metric2_val || mData.metric2Val);
            if (bData.metric2_label || mData.metric2Label) setMetric2Label(bData.metric2_label || mData.metric2Label);
            if (bData.metric3_val || mData.metric3Val) setMetric3Val(bData.metric3_val || mData.metric3Val);
            if (bData.metric3_label || mData.metric3Label) setMetric3Label(bData.metric3_label || mData.metric3Label);
            if (bData.metric4_val || mData.metric4Val) setMetric4Val(bData.metric4_val || mData.metric4Val);
            if (bData.metric4_label || mData.metric4Label) setMetric4Label(bData.metric4_label || mData.metric4Label);
          }
        }
      } catch (e) {
        console.warn('Notice loading prospect site for editor:', e);
      }
    };

    loadSiteConfig();
  }, [tenant]);

  // Medición dinámica del ancho del contenedor para escalar Desktop a 1200px
  useEffect(() => {
    if (!previewColumnRef.current) return;
    const updateSize = () => {
      if (previewColumnRef.current) {
        const w = previewColumnRef.current.clientWidth;
        if (w > 0) setContainerWidth(w);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(previewColumnRef.current);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const DESKTOP_VIEWPORT_WIDTH = 1200;
  const desktopScale = useMemo(() => {
    const availableWidth = Math.max(300, containerWidth - 8);
    return Math.min(1, availableWidth / DESKTOP_VIEWPORT_WIDTH);
  }, [containerWidth]);

  // Generación HTML en tiempo real para el Iframe
  const renderedHtml = useMemo(() => {
    const specialty = BEAUTY_SPECIALTIES[category] || BEAUTY_SPECIALTIES.barberia;
    return injectBeautyHtml({
      category,
      businessName,
      phoneWhatsapp,
      address,
      city,
      slug,
      primaryColor,
      heroImage,
      heroMobileImage,
      aboutImageUrl: aboutImage,
      headline,
      subheadline,
      heroBadge,
      aboutTitle,
      aboutDescription,
      metric1Val,
      metric1Label,
      metric2Val,
      metric2Label,
      metric3Val,
      metric3Label,
      metric4Val,
      metric4Label,
      services: specialty.services
    });
  }, [
    category,
    businessName,
    phoneWhatsapp,
    address,
    city,
    slug,
    primaryColor,
    heroImage,
    heroMobileImage,
    aboutImage,
    headline,
    subheadline,
    heroBadge,
    aboutTitle,
    aboutDescription,
    metric1Val,
    metric1Label,
    metric2Val,
    metric2Label,
    metric3Val,
    metric3Label,
    metric4Val,
    metric4Label
  ]);

  const handleSelectGalleryImage = (url: string) => {
    if (!galleryConfig) return;
    if (galleryConfig.target === 'hero_desktop') setHeroImage(url);
    if (galleryConfig.target === 'hero_mobile') setHeroMobileImage(url);
    if (galleryConfig.target === 'about') setAboutImage(url);
    if (galleryConfig.target === 'logo') setLogoUrl(url);
    showToast('✨ Imagen aplicada al diseño');
  };

  // Subir imagen optimizada directamente desde PC o Celular
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'hero_desktop' | 'hero_mobile' | 'about'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida (JPG, PNG, WebP)', 'error');
      return;
    }

    setUploadingTarget(target);
    try {
      const maxWidth = target === 'hero_desktop' ? 1920 : target === 'hero_mobile' ? 1080 : 1200;
      const maxHeight = target === 'hero_mobile' ? 1920 : 1080;

      const res = await compressImage(file, {
        maxWidth,
        maxHeight,
        quality: 0.84,
        mimeType: 'image/webp',
        cropSquare: false
      });

      // Subir a Supabase Storage con fallback a dataUrl
      const uploadRes = await uploadStockImageBlob(res.blob, file.name);
      const finalUrl = uploadRes.url || res.dataUrl;

      if (target === 'hero_desktop') setHeroImage(finalUrl);
      if (target === 'hero_mobile') setHeroMobileImage(finalUrl);
      if (target === 'about') setAboutImage(finalUrl);

      showToast('✨ Foto subida y optimizada exitosamente');
    } catch (err: any) {
      console.error('Error subiendo imagen:', err);
      showToast('Error al procesar la imagen: ' + (err?.message || ''), 'error');
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tenantId = tenant?.id;
      const targetSlug = slug || tenant?.slug || 'mi-salon';

      // 1. Actualizar en tabla tenants si hay tenantId o slug
      if (supabase && isSupabaseConfigured && (tenantId || targetSlug)) {
        const tenantPayload: any = {
          name: businessName,
          phone: phoneWhatsapp,
          whatsapp_number: phoneWhatsapp,
          address: address,
          city: city,
          primary_color: primaryColor,
          hero_image_url: heroImage,
          about_image_url: aboutImage,
          slogan: headline,
          subtitle: subheadline,
          hero_eyebrow: heroBadge,
          about_title: aboutTitle,
          about_title_accent: null,
          about_description: aboutDescription,
          about_years_exp: metric1Val,
          about_clients_count: metric2Val,
          about_rating_text: metric4Val,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        };

        let tQuery = supabase.from('tenants').update(tenantPayload);
        if (tenantId) {
          tQuery = tQuery.eq('id', tenantId);
        } else {
          tQuery = tQuery.eq('slug', targetSlug);
        }

        const { error: tErr } = await tQuery;

        if (tErr) {
          console.error('Notice updating tenant core fields:', tErr.message);
        }
      }

      // 2. Actualizar en prospect_sites para que el sitio público /sitio/:slug quede en vivo
      try {
        const site = await api.getProspectSiteBySlug(targetSlug);
        if (site && site.id) {
          await api.updateProspectSite(site.id, {
            ...site,
            business_name: businessName,
            phone_whatsapp: phoneWhatsapp,
            address: address,
            city: city,
            primary_color: primaryColor,
            raw_html: renderedHtml,
            business_data: {
              ...(site.business_data || {}),
              nombre: businessName || site.business_data?.nombre || site.business_name || 'Mi Salón',
              slogan: headline,
              subtitle: subheadline,
              banner_url: heroImage,
              banner_vertical_url: heroMobileImage,
              about_image_url: aboutImage,
              about_title: aboutTitle,
              about_description: aboutDescription,
              metric1_val: metric1Val,
              metric1_label: metric1Label,
              metric2_val: metric2Val,
              metric2_label: metric2Label,
              metric3_val: metric3Val,
              metric3_label: metric3Label,
              metric4_val: metric4Val,
              metric4_label: metric4Label,
              metrics: {
                metric1Val,
                metric1Label,
                metric2Val,
                metric2Label,
                metric3Val,
                metric3Label,
                metric4Val,
                metric4Label
              },
              logo_url: logoUrl,
              copywriting: {
                headline,
                subheadline,
                badge: heroBadge,
                about_title: aboutTitle,
                about_description: aboutDescription
              },
              hero_badge: heroBadge,
              hero_eyebrow: heroBadge
            }
          });
        }
      } catch (prospectErr) {
        console.warn('Prospect site update notice:', prospectErr);
      }

      showToast('🎉 ¡Tu página web ha sido actualizada y publicada en vivo!');
      if (onSaved) onSaved();
    } catch (err: any) {
      console.error(err);
      showToast('Ocurrió un error al guardar: ' + (err.message || ''), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Notification */}
      {notificationMsg && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border animate-slide-in ${
          notificationMsg.type === 'error'
            ? 'bg-red-500/90 text-white border-red-400'
            : 'bg-emerald-500/90 text-white border-emerald-400'
        }`}>
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e121b] p-4 sm:p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              <Globe className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Editor Visual de Mi Página Web
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Personaliza imágenes, colores, textos y catálogo de tu salón o barbería en tiempo real con previsualización en vivo.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Botón Ver Sitio en Vivo */}
          <a
            href={`/sitio/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Ver Sitio en Vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Botón Guardar Cambios */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 fill-black" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL DE EDICIÓN (5 Columnas) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          
          {/* Tabs Selector */}
          <div className="grid grid-cols-3 gap-1.5 bg-[#0e121b] p-1.5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setEditorSection('branding')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                editorSection === 'branding' 
                  ? 'bg-amber-500 text-black shadow-md font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span>Imágenes</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorSection('colors')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                editorSection === 'colors' 
                  ? 'bg-amber-500 text-black shadow-md font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colores</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorSection('copywriting')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                editorSection === 'copywriting' 
                  ? 'bg-amber-500 text-black shadow-md font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Textos</span>
            </button>
          </div>

          {/* Contenedor Scrollable para las Cards de Imágenes, Colores y Textos */}
          <div className="max-h-[820px] xl:max-h-[860px] overflow-y-auto pr-1.5 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-amber-500/40 hover:[&::-webkit-scrollbar-thumb]:bg-amber-500/70 [&::-webkit-scrollbar-thumb]:rounded-full">

          {/* CONTENIDO 1: IMÁGENES & BRANDING */}
          {editorSection === 'branding' && (
            <div className="bg-[#0e121b] p-5 rounded-3xl border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Imágenes de Portada & Marca</h3>
                  <p className="text-[11px] text-slate-400">Sube fotos desde tu PC/celular o escoge de la biblioteca oficial en alta resolución.</p>
                </div>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                  HD & WebP
                </span>
              </div>
              
              {/* 1. Hero Desktop */}
              <div className="space-y-2">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200">1. Portada PC / Desktop (16:9)</span>
                  <div className="flex items-center gap-2">
                    {/* Botón Subir Foto desde PC / Móvil */}
                    <label className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all">
                      {uploadingTarget === 'hero_desktop' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Subir Foto</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingTarget !== null}
                        onChange={(e) => handleFileChange(e, 'hero_desktop')}
                      />
                    </label>

                    {/* Botón Abrir Biblioteca HD */}
                    <button 
                      type="button"
                      onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_desktop', target: 'hero_desktop' })}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20"
                    >
                      <Sparkles className="w-3 h-3" /> Biblioteca HD
                    </button>
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/50 group">
                  <img 
                    src={heroImage} 
                    alt="Hero Desktop" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-3">
                    <label className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer backdrop-blur-md border border-white/20 shadow-lg">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Subir PC/Celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingTarget !== null}
                        onChange={(e) => handleFileChange(e, 'hero_desktop')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_desktop', target: 'hero_desktop' })}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg hover:bg-amber-400"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-black" />
                      <span>Biblioteca HD</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Hero Móvil */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200">2. Portada Smartphone Móvil (4:5)</span>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all">
                      {uploadingTarget === 'hero_mobile' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Subir Foto</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingTarget !== null}
                        onChange={(e) => handleFileChange(e, 'hero_mobile')}
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_mobile', target: 'hero_mobile' })}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20"
                    >
                      <Sparkles className="w-3 h-3" /> Biblioteca HD
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-24 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shrink-0 group">
                    <img 
                      src={heroMobileImage} 
                      alt="Hero Mobile" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      <label className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer shadow-lg" title="Subir desde PC o Celular">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingTarget !== null}
                          onChange={(e) => handleFileChange(e, 'hero_mobile')}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_mobile', target: 'hero_mobile' })}
                        className="p-2 rounded-xl bg-amber-500 text-black font-bold cursor-pointer shadow-lg"
                        title="Abrir Biblioteca"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-white">Visualización Vertical (4:5)</p>
                    <p className="text-[11px]">Esta foto vertical se muestra en los celulares de tus clientes para una inmersión completa sin recortes.</p>
                  </div>
                </div>
              </div>

              {/* 3. Sobre Nosotros / Experiencia */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200">3. Sección "Sobre Nosotros" / Experiencia (4:3)</span>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-bold text-[11px] flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all">
                      {uploadingTarget === 'about' ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                          <span>Subiendo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Subir Foto</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingTarget !== null}
                        onChange={(e) => handleFileChange(e, 'about')}
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={() => setGalleryConfig({ isOpen: true, type: 'todos', target: 'about' })}
                      className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20"
                    >
                      <Sparkles className="w-3 h-3" /> Biblioteca HD
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-28 w-36 rounded-2xl overflow-hidden border border-white/10 bg-black/50 shrink-0 group">
                    <img 
                      src={aboutImage} 
                      alt="Sobre Nosotros" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                      <label className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 cursor-pointer shadow-lg" title="Subir desde PC o Celular">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingTarget !== null}
                          onChange={(e) => handleFileChange(e, 'about')}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setGalleryConfig({ isOpen: true, type: 'todos', target: 'about' })}
                        className="p-2 rounded-xl bg-amber-500 text-black font-bold cursor-pointer shadow-lg"
                        title="Abrir Biblioteca"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-white">Ambiente & Experiencia</p>
                    <p className="text-[11px]">Foto destacada de las instalaciones, sillones o ambiente general que acompaña la historia y trayectoria de tu negocio.</p>
                  </div>
                </div>
              </div>

              {/* URLs manuales de respaldo */}
              <div className="pt-2 border-t border-white/5 space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">URL Foto Desktop (16:9):</label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">URL Foto Móvil Smartphone (4:5):</label>
                  <input
                    type="text"
                    value={heroMobileImage}
                    onChange={(e) => setHeroMobileImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">URL Foto Sobre Nosotros (4:3):</label>
                  <input
                    type="text"
                    value={aboutImage}
                    onChange={(e) => setAboutImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO 2: COLORES & PALETAS */}
          {editorSection === 'colors' && (
            <div className="bg-[#0e121b] p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white">Paleta Cromática de Tu Salón</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona una identidad de color preestablecida o escribe tu código HEX corporativo:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_BEAUTY_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPrimaryColor(c.hex)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      primaryColor === c.hex 
                        ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/40' 
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full shadow-md shrink-0 border border-white/20" 
                      style={{ backgroundColor: c.hex }} 
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs truncate text-white">{c.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5">
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Color Personalizado (HEX)</label>
                <div className="flex items-center gap-2.5">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-11 h-11 rounded-xl cursor-pointer border border-white/15 bg-transparent p-0.5"
                  />
                  <input 
                    type="text"
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-xs uppercase font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO 3: TEXTOS & COPYWRITING */}
          {editorSection === 'copywriting' && (
            <div className="bg-[#0e121b] p-5 rounded-3xl border border-white/10 space-y-3.5 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white">Información & Mensajes Persuasivos</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edita los textos que ven tus clientas al ingresar a tu página web:
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nombre Comercial del Negocio</label>
                <input 
                  type="text"
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp para Agendamiento</label>
                  <input 
                    type="text"
                    value={phoneWhatsapp} 
                    onChange={(e) => setPhoneWhatsapp(e.target.value)} 
                    placeholder="Ej: 573001234567" 
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Ciudad</label>
                  <input 
                    type="text"
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Ej: Apartadó" 
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dirección / Sede Física</label>
                <input 
                  type="text"
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Ej: Cl. 104 #113-53" 
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Badge Caligráfico / Distintivo Superior (&#123;&#123;HERO_BADGE&#125;&#125;)
                </label>
                <input 
                  type="text"
                  value={heroBadge} 
                  onChange={(e) => setHeroBadge(e.target.value)} 
                  placeholder="Ej. Nail Spa &amp; Esthetic o 💈 Citas Disponibles Hoy" 
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Título Principal (Headline)</label>
                <input 
                  type="text"
                  value={headline} 
                  onChange={(e) => setHeadline(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Subtítulo / Propuesta de Valor</label>
                <textarea 
                  rows={3}
                  value={subheadline} 
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>

              {/* SECCIÓN SOBRE NOSOTROS */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Sección "Sobre Nosotros"
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Personaliza el título de impacto y la historia o filosofía de tu negocio:
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Título de Sobre Nosotros</label>
                  <input 
                    type="text"
                    value={aboutTitle} 
                    onChange={(e) => setAboutTitle(e.target.value)} 
                    placeholder="Ej. PRECISIÓN. ESTILO. CONFIANZA TOTAL." 
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Historia / Descripción del Negocio</label>
                  <textarea 
                    rows={4}
                    value={aboutDescription} 
                    onChange={(e) => setAboutDescription(e.target.value)}
                    placeholder="Escribe la historia, tradición y propuesta que hace único a tu salón o barbería..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* SECCIÓN MÉTRICAS DE AUTORIDAD */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" /> Métricas de Autoridad (4 Indicadores)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Muestra tus cifras de experiencia para generar máxima confianza:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Métrica 1 */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-wider block">Métrica #1</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Valor</label>
                        <input 
                          type="text"
                          value={metric1Val} 
                          onChange={(e) => setMetric1Val(e.target.value)} 
                          placeholder="8+" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Etiqueta</label>
                        <input 
                          type="text"
                          value={metric1Label} 
                          onChange={(e) => setMetric1Label(e.target.value)} 
                          placeholder="Años Exp." 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Métrica 2 */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-wider block">Métrica #2</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Valor</label>
                        <input 
                          type="text"
                          value={metric2Val} 
                          onChange={(e) => setMetric2Val(e.target.value)} 
                          placeholder="20K+" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Etiqueta</label>
                        <input 
                          type="text"
                          value={metric2Label} 
                          onChange={(e) => setMetric2Label(e.target.value)} 
                          placeholder="Cortes Realizados" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Métrica 3 */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-wider block">Métrica #3</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Valor</label>
                        <input 
                          type="text"
                          value={metric3Val} 
                          onChange={(e) => setMetric3Val(e.target.value)} 
                          placeholder="4" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Etiqueta</label>
                        <input 
                          type="text"
                          value={metric3Label} 
                          onChange={(e) => setMetric3Label(e.target.value)} 
                          placeholder="Master Barberos" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Métrica 4 */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-wider block">Métrica #4</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Valor</label>
                        <input 
                          type="text"
                          value={metric4Val} 
                          onChange={(e) => setMetric4Val(e.target.value)} 
                          placeholder="4.9" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-amber-400 font-bold text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Etiqueta</label>
                        <input 
                          type="text"
                          value={metric4Label} 
                          onChange={(e) => setMetric4Label(e.target.value)} 
                          placeholder="Calificación" 
                          className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>

        </div>

        {/* PREVISUALIZADOR EN VIVO (7 Columnas) */}
        <div className="lg:col-span-7 bg-[#0e121b] p-4 sm:p-5 rounded-3xl border border-white/10 shadow-xl flex flex-col items-center lg:sticky lg:top-6">
          
          {/* Barra Superior del Previsualizador */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Previsualización en Tiempo Real
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'mobile' 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista Smartphone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Móvil (390px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  previewDevice === 'desktop' 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Escritorio</span>
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreenPreview(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer ml-1"
                title="Ver en Pantalla Completa"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline">Expandir</span>
              </button>
            </div>
          </div>

          {/* Iframe Interactivo con Mockup Alargado Moderno y Escalado Desktop */}
          <div ref={previewColumnRef} className="w-full flex justify-center items-start">
            <div className={`transition-all duration-300 overflow-hidden shadow-2xl border-4 border-zinc-800 rounded-3xl bg-black ${
              previewDevice === 'mobile' 
                ? 'w-[390px] max-w-full h-[840px] xl:h-[880px]' 
                : 'w-full h-[840px] xl:h-[880px]'
            }`}>
              {previewDevice === 'mobile' ? (
                <iframe 
                  srcDoc={renderedHtml}
                  title="Previsualizador Web Kowy Móvil"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              ) : (
                <div 
                  style={{
                    width: `${100 / desktopScale}%`,
                    height: `${Math.round(880 / desktopScale)}px`,
                    transform: `scale(${desktopScale})`,
                    transformOrigin: 'top left',
                    flexShrink: 0,
                  }}
                >
                  <iframe 
                    srcDoc={renderedHtml}
                    title="Previsualizador Web Kowy Escritorio"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal de la Biblioteca de Imágenes */}
      {galleryConfig && (
        <BeautyImageGalleryModal
          isOpen={galleryConfig.isOpen}
          onClose={() => setGalleryConfig(null)}
          onSelectImage={handleSelectGalleryImage}
          initialCategory={category || 'barberia'}
          initialType={galleryConfig.type}
          currentSelectedUrl={
            galleryConfig.target === 'hero_mobile' 
              ? heroMobileImage 
              : galleryConfig.target === 'about' 
                ? aboutImage 
                : heroImage
          }
        />
      )}

      {/* Modal de Previsualización Fullscreen Desktop */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col p-3 sm:p-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                <Monitor className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Previsualización Escritorio en Vivo</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">100% Pantalla Real</span>
                </h3>
                <p className="text-xs text-slate-400">{businessName} • Vista panorámica de alta resolución</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/sitio/${slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Ver en Pestaña Nueva</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsFullscreenPreview(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white transition-all cursor-pointer"
                title="Cerrar Previsualización"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            <iframe
              srcDoc={renderedHtml}
              title="Previsualizador Web Kowy Fullscreen"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default WebsiteEditorTab;
