import React, { useState, useEffect } from 'react';
import { 
  Smartphone, MapPin, Sparkles, Send, CheckCircle2, Copy, 
  ExternalLink, LogOut, ChevronRight, MessageCircle, RefreshCw,
  Scissors, Heart, Eye, EyeOff, ArrowLeft, Key, Lock, Check, Clock,
  Upload, Trash2, Camera, Calendar, ShieldCheck, ArrowRight,
  Layers, Palette, Building2, Search, Zap, Dices, SlidersHorizontal,
  Share2, FolderOpen, ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { agentService } from '../lib/agentService';
import { activateProspectInField } from '../lib/prospectActivationService';
import { getManagedStockLibrary, uploadStockImageBlob, StockImageItem } from '../lib/beautyImageLibrary';
import { compressImage } from '../utils/imageCompressor';
import { generateDynamicCopywriting } from '../lib/dynamicCopywritingGenerator';
import { 
  BEAUTY_SPECIALTIES, 
  VISUAL_TEMPLATE_STYLES, 
  BeautySpecialtyService,
  suggestSlogan 
} from '../lib/beautySpecialties';
import { injectBeautyHtml } from '../lib/beautyHtmlInjector';
import { FieldAgent, ProspectSite } from '../types';
import { api, supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  generateStep1Pitch, 
  generateStep2Pitch, 
  generateMaklozTechPitch, 
  generateWelcomeCredentialsPitch 
} from '../lib/whatsappPitchGenerator';

const FAST_CITIES = [
  'Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Apartadó', 
  'Turbo', 'Carepa', 'Envigado', 'Bello', 'Itagüí', 'Rionegro', 'Cartagena', 'Bucaramanga'
];

interface ColombianCityGeo {
  name: string;
  lat: number;
  lon: number;
}

const COLOMBIA_CITIES_GEO: ColombianCityGeo[] = [
  // Urabá y Antioquia
  { name: 'Apartadó', lat: 7.8829, lon: -76.6258 },
  { name: 'Turbo', lat: 8.0926, lon: -76.7282 },
  { name: 'Carepa', lat: 7.7569, lon: -76.6556 },
  { name: 'Chigorodó', lat: 7.6681, lon: -76.6806 },
  { name: 'Necoclí', lat: 8.4253, lon: -76.7869 },
  { name: 'Medellín', lat: 6.2442, lon: -75.5812 },
  { name: 'Envigado', lat: 6.1759, lon: -75.5917 },
  { name: 'Itagüí', lat: 6.1846, lon: -75.5991 },
  { name: 'Bello', lat: 6.3373, lon: -75.5579 },
  { name: 'Sabaneta', lat: 6.1515, lon: -75.6166 },
  { name: 'Rionegro', lat: 6.1551, lon: -75.3737 },
  // Principales ciudades de Colombia
  { name: 'Bogotá', lat: 4.7110, lon: -74.0721 },
  { name: 'Cali', lat: 3.4516, lon: -76.5320 },
  { name: 'Barranquilla', lat: 10.9685, lon: -74.7813 },
  { name: 'Cartagena', lat: 10.3910, lon: -75.4794 },
  { name: 'Bucaramanga', lat: 7.1254, lon: -73.1198 },
  { name: 'Pereira', lat: 4.8133, lon: -75.6961 },
  { name: 'Manizales', lat: 5.0689, lon: -75.5174 },
  { name: 'Montería', lat: 8.7479, lon: -75.8814 },
  { name: 'Santa Marta', lat: 11.2408, lon: -74.1990 },
  { name: 'Cúcuta', lat: 7.8939, lon: -72.5078 },
  { name: 'Ibagué', lat: 4.4389, lon: -75.2322 },
  { name: 'Pasto', lat: 1.2136, lon: -77.2811 },
  { name: 'Villavicencio', lat: 4.1420, lon: -73.6266 },
  { name: 'Popayán', lat: 2.4419, lon: -76.6063 },
  { name: 'Valledupar', lat: 10.4631, lon: -73.2532 },
  { name: 'Neiva', lat: 2.9273, lon: -75.2819 },
  { name: 'Armenia', lat: 4.5339, lon: -75.6811 },
  { name: 'Sincelejo', lat: 9.3047, lon: -75.3978 },
  { name: 'Tunja', lat: 5.5353, lon: -73.3678 },
  { name: 'Riohacha', lat: 11.5444, lon: -72.9072 }
];

function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestColombianCity(lat: number, lon: number): string | null {
  let nearestCity: string | null = null;
  let minDistance = Infinity;

  for (const c of COLOMBIA_CITIES_GEO) {
    const dist = getHaversineDistanceKm(lat, lon, c.lat, c.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = c.name;
    }
  }

  return minDistance <= 50 ? nearestCity : null;
}

async function reverseGeocodeCoords(lat: number, lon: number): Promise<{ cityName: string; streetAddress?: string }> {
  // 1. Intentar reverse geocoding online con Nominatim (timeout 2500ms)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'es' }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const onlineCity = 
        addr.city || 
        addr.town || 
        addr.municipality || 
        addr.village || 
        addr.county || 
        addr.state_district;

      let street = '';
      const road = addr.road || addr.pedestrian || addr.path || addr.footway;
      const houseNum = addr.house_number;
      const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || addr.quarter || addr.city_district;

      if (road) {
        street = houseNum ? `${road} #${houseNum}` : road;
        if (neighborhood && !street.toLowerCase().includes(neighborhood.toLowerCase())) {
          street = `${street}, Barrio ${neighborhood.replace(/^Barrio\s+/i, '')}`;
        }
      } else if (neighborhood) {
        street = `Barrio ${neighborhood.replace(/^Barrio\s+/i, '')}`;
      } else if (data.display_name) {
        const parts = String(data.display_name).split(',').map((p: string) => p.trim());
        if (parts.length > 0) {
          street = parts.slice(0, 2).join(', ');
        }
      }

      if (onlineCity && typeof onlineCity === 'string') {
        const cleanCity = onlineCity.replace(/^Municipio de\s+/i, '').trim();
        return { cityName: cleanCity, streetAddress: street || undefined };
      }
    }
  } catch {
    // Si falla o da timeout, continuamos con el fallback offline
  }

  // 2. Fallback offline instantáneo por distancia geodésica
  const nearest = findNearestColombianCity(lat, lon);
  return { cityName: nearest || 'Medellín' };
}

export const AgentIntakePage: React.FC = () => {
  const [agent, setAgent] = useState<FieldAgent | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login de agente
  const [agentEmailInput, setAgentEmailInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navegación de vistas: wizard de captura vs historial de prospectos
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [recentProspects, setRecentProspects] = useState<ProspectSite[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Estados para el Modal "Prospectos en Campo" (Activación in-field y envío de datos + días gratis)
  const [prospectSearchTerm, setProspectSearchTerm] = useState('');
  const [activatingProspectId, setActivatingProspectId] = useState<string | null>(null);
  const [modalOwnerEmail, setModalOwnerEmail] = useState('');
  const [modalTempPassword, setModalTempPassword] = useState('');
  const [modalShowPassword, setModalShowPassword] = useState(false);
  const [modalTrialDays, setModalTrialDays] = useState(14);
  const [isModalActivating, setIsModalActivating] = useState(false);
  const [modalSuccessData, setModalSuccessData] = useState<{
    prospectId: string;
    businessName: string;
    phone: string;
    ownerEmail: string;
    tempPass: string;
    loginUrl: string;
    trialDays: number;
    slug: string;
    category?: string;
  } | null>(null);

  // --------------------------------------------------------------------------
  // STEP 1: FICHA DEL NEGOCIO
  // --------------------------------------------------------------------------
  const [city, setCity] = useState('Medellín');
  const [address, setAddress] = useState('');
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [isCapturingGps, setIsCapturingGps] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('barberia');
  const [slogan, setSlogan] = useState('');
  const [phone, setPhone] = useState('');

  // Horario constructor
  const [scheduleMode, setScheduleMode] = useState<'constructor' | 'frecuentes' | 'manual'>('constructor');
  const [scheduleOpenDays, setScheduleOpenDays] = useState('Lunes a Sábado');
  const [activeDays, setActiveDays] = useState<Record<string, boolean>>({
    L: true, M: true, X: true, J: true, V: true, S: true, D: false
  });
  const [openHour, setOpenHour] = useState('08:00 AM');
  const [closeHour, setCloseHour] = useState('08:00 PM');
  const [weekendLateClose, setWeekendLateClose] = useState(false);
  const [customScheduleText, setCustomScheduleText] = useState('Lunes a Sábado: 8:00 AM - 8:00 PM');
  const [isEditingScheduleText, setIsEditingScheduleText] = useState(false);

  // --------------------------------------------------------------------------
  // STEP 2: FOTOS & CARTA DE SERVICIOS
  // --------------------------------------------------------------------------
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('dark-luxury-gold');
  const [previewModalTemplate, setPreviewModalTemplate] = useState<any | null>(null);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [heroDesktopUrl, setHeroDesktopUrl] = useState('');
  const [heroMobileUrl, setHeroMobileUrl] = useState('');
  const [bannerMenuUrl, setBannerMenuUrl] = useState('');

  // Estados para modal de biblioteca de imágenes y subida desde celular/PC
  const [stockModalTarget, setStockModalTarget] = useState<'heroDesktop' | 'heroMobile' | 'banner' | null>(null);
  const [stockFilterCategory, setStockFilterCategory] = useState<string>('all');
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<string | null>(null);

  const desktopFileInputRef = React.useRef<HTMLInputElement>(null);
  const mobileFileInputRef = React.useRef<HTMLInputElement>(null);
  const bannerFileInputRef = React.useRef<HTMLInputElement>(null);

  const stockImagesList = React.useMemo(() => {
    return getManagedStockLibrary().filter((item) => {
      if (item.category === 'especialistas') return false;
      const matchesCat = stockFilterCategory === 'all' || item.category === stockFilterCategory;
      const matchesQuery = !stockSearchQuery.trim() || 
        item.title.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(stockSearchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [stockFilterCategory, stockSearchQuery]);

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'heroDesktop' | 'heroMobile' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(target);
    try {
      const isMobile = target === 'heroMobile';
      const maxWidth = isMobile ? 1080 : 1920;
      const maxHeight = isMobile ? 1920 : 1080;

      // 1. Compresión inteligente WebP
      const compressed = await compressImage(file, {
        maxWidth,
        maxHeight,
        cropSquare: false,
        quality: 0.85
      });

      // 2. Subida a Supabase Storage (con fallback a dataUrl)
      let finalUrl = compressed.dataUrl;
      try {
        const uploadRes = await uploadStockImageBlob(compressed.blob, file.name);
        if (uploadRes.url) {
          finalUrl = uploadRes.url;
        }
      } catch (uploadErr) {
        console.warn('Storage upload notice, using local dataUrl:', uploadErr);
      }

      if (target === 'heroDesktop') setHeroDesktopUrl(finalUrl);
      else if (target === 'heroMobile') setHeroMobileUrl(finalUrl);
      else if (target === 'banner') setBannerMenuUrl(finalUrl);

      showToast('🎉 ¡Foto cargada y optimizada con éxito!');
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      showToast('Error al procesar la imagen: ' + (err.message || ''), 'error');
    } finally {
      setIsUploadingPhoto(null);
      e.target.value = '';
    }
  };

  // Copywriting bloques
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutP1, setAboutP1] = useState('');
  const [aboutP2, setAboutP2] = useState('');

  // Servicios editables (6 servicios con precios COP)
  const [servicesList, setServicesList] = useState<BeautySpecialtyService[]>([]);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  // Generador de HTML para vista previa interactiva en vivo
  const previewHtml = React.useMemo(() => {
    if (!previewModalTemplate) return '';
    const spec = BEAUTY_SPECIALTIES[category] || BEAUTY_SPECIALTIES.barberia;
    const cleanP = (phone || '').replace(/\D/g, '') || '573000000000';
    return injectBeautyHtml({
      slug: slug || 'demo-preview',
      category: previewModalTemplate.id === 'salon-femenino-colorimetria' ? 'salon' : (previewModalTemplate.id === 'rose-gold-blush' ? 'nails' : category),
      businessName: businessName.trim() || 'Mi Salón & Spa',
      phoneWhatsapp: cleanP,
      address: address || `${city || 'Medellín'}, Colombia`,
      city: city || 'Medellín',
      primaryColor: previewModalTemplate.primaryColor,
      visualTemplateId: previewModalTemplate.id,
      heroImage: heroDesktopUrl || previewModalTemplate.previewImage,
      heroMobileImage: heroMobileUrl || previewModalTemplate.previewImage,
      bannerUrl: bannerMenuUrl || previewModalTemplate.previewImage,
      heroBadge: heroBadge || spec.heroBadge,
      headline: heroTitle || `${businessName || 'Tu Belleza'} | Alta Gama`,
      subheadline: heroSubtitle || 'Agenda tu turno online en segundos con confirmación inmediata 24/7.',
      aboutTitle,
      aboutP1,
      aboutP2,
      services: servicesList.length > 0 ? servicesList : spec.services,
      gpsCoordinates: gpsLocation || undefined
    });
  }, [previewModalTemplate, category, businessName, phone, address, city, heroDesktopUrl, heroMobileUrl, bannerMenuUrl, heroBadge, heroTitle, heroSubtitle, aboutTitle, aboutP1, aboutP2, servicesList, slug, gpsLocation]);

  // --------------------------------------------------------------------------
  // STEP 3: PROSPECTO CREADO & ACTIVACIÓN
  // --------------------------------------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProspect, setCreatedProspect] = useState<ProspectSite | null>(null);
  const [selectedPitchStep, setSelectedPitchStep] = useState<1 | 2 | 3>(1);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Activación B2B en caliente (14 Días Gratis en Plan Inicio)
  const [isActivating, setIsActivating] = useState(false);
  const [activationOwnerEmail, setActivationOwnerEmail] = useState('');
  const [activationOwnerPassword, setActivationOwnerPassword] = useState('');
  const [showActivationPassword, setShowActivationPassword] = useState(false);
  const [activationResult, setActivationResult] = useState<{
    ownerEmail: string;
    tempPass: string;
    loginUrl: string;
    tenantId?: string;
  } | null>(null);

  // Autogenerar contraseña amigable cuando se crea el prospecto
  useEffect(() => {
    if (createdProspect && !activationOwnerPassword) {
      const clean = createdProspect.business_name?.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Kowy';
      setActivationOwnerPassword(`${clean}${Math.floor(1000 + Math.random() * 9000)}*`);
    }
  }, [createdProspect]);

  useEffect(() => {
    checkSession();
  }, []);

  // Cuando cambia el nombre del negocio, autogenerar slug
  useEffect(() => {
    if (businessName.trim()) {
      const generatedSlug = businessName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [businessName]);

  // Cuando cambia la categoría de belleza, actualizar defaults
  useEffect(() => {
    const spec = BEAUTY_SPECIALTIES[category] || BEAUTY_SPECIALTIES.barberia;
    setSlogan(suggestSlogan(businessName, category, city));
    setHeroDesktopUrl(spec.heroImage);
    setHeroMobileUrl(spec.heroMobileImage);
    setBannerMenuUrl(spec.menuBannerUrl);

    setHeroBadge(spec.heroBadge || (category === 'nails' ? 'Nail Spa & Esthetic' : 'Salón & Spa'));
    setHeroTitle(spec.copywriting.heroTitle);
    setHeroSubtitle(spec.copywriting.heroSubtitle);
    setAboutTitle(spec.copywriting.aboutTitle);
    setAboutP1(spec.copywriting.aboutP1);
    setAboutP2(spec.copywriting.aboutP2);

    setServicesList([...spec.services]);

    // Asignar plantilla recomendada según categoría
    if (category === 'barberia') setSelectedTemplateId('dark-luxury-gold');
    else if (category === 'nails') setSelectedTemplateId('rose-gold-blush');
    else if (category === 'spa' || category === 'holistico') setSelectedTemplateId('emerald-botanical');
    else if (category === 'cejas') setSelectedTemplateId('lavanda-serenity');
    else if (category === 'salon') setSelectedTemplateId('salon-femenino-colorimetria');
    else setSelectedTemplateId('dark-luxury-gold');
  }, [category]);

  // Recalcular horario resultante
  useEffect(() => {
    const activeDaysLabels = Object.entries(activeDays)
      .filter(([_, active]) => active)
      .map(([day]) => day);

    let daysSummary = 'Lunes a Sábado';
    if (activeDays.L && activeDays.M && activeDays.X && activeDays.J && activeDays.V && activeDays.S && activeDays.D) {
      daysSummary = 'Todos los días (Lun a Dom)';
    } else if (activeDays.L && activeDays.M && activeDays.X && activeDays.J && activeDays.V && activeDays.S && !activeDays.D) {
      daysSummary = 'Lunes a Sábado';
    } else if (activeDays.L && activeDays.M && activeDays.X && activeDays.J && activeDays.V && !activeDays.S && !activeDays.D) {
      daysSummary = 'Lunes a Viernes';
    } else if (!activeDays.L && activeDays.M && activeDays.X && activeDays.J && activeDays.V && activeDays.S && activeDays.D) {
      daysSummary = 'Martes a Domingo';
    } else {
      daysSummary = `Días: ${activeDaysLabels.join(', ')}`;
    }

    const lateText = weekendLateClose ? ' (Vie y Sáb hasta tarde)' : '';
    const generatedSchedule = `${daysSummary}: ${openHour} - ${closeHour}${lateText}`;
    setCustomScheduleText(generatedSchedule);
  }, [activeDays, openHour, closeHour, weekendLateClose]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const checkSession = async () => {
    setLoading(true);
    const current = await agentService.getCurrentAgent();
    if (current) {
      const metrics = await agentService.getAgentMetrics(current.email);
      setAgent({ ...current, metricas: metrics });
      loadProspects(current.email);
    }
    setLoading(false);
  };

  const loadProspects = async (email: string) => {
    const list = await agentService.getAgentProspects(email);
    setRecentProspects(list);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentEmailInput.trim()) {
      showToast('Ingresa tu correo o código de asesor', 'error');
      return;
    }
    setIsLoggingIn(true);
    try {
      const current = await agentService.loginAgent(agentEmailInput);
      const metrics = await agentService.getAgentMetrics(current.email);
      setAgent({ ...current, metricas: metrics });
      loadProspects(current.email);
      showToast(`¡Bienvenido, ${current.nombre}! 🚀`);
    } catch (err: any) {
      showToast(err.message || 'Error al iniciar sesión', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await agentService.logoutAgent();
    setAgent(null);
    setCreatedProspect(null);
    setActivationResult(null);
    setCurrentStep(1);
  };

  // Capturar coordenadas GPS del celular y auto-detectar Municipio + Dirección
  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalización no soportada en este navegador', 'error');
      return;
    }
    setIsCapturingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const coords = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
        setGpsLocation(coords);

        try {
          const { cityName, streetAddress } = await reverseGeocodeCoords(lat, lon);
          if (cityName) {
            setCity(cityName);
          }
          if (streetAddress) {
            setAddress(streetAddress);
          }
          showToast(`📍 Ubicación detectada: ${cityName || 'fijada'}`);
        } catch {
          showToast('📍 Coordenadas GPS fijadas');
        } finally {
          setIsCapturingGps(false);
        }
      },
      () => {
        setIsCapturingGps(false);
        showToast('No se pudo obtener la ubicación GPS', 'error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSloganAiSuggest = () => {
    const newSlogan = suggestSlogan(businessName, category, city);
    setSlogan(newSlogan);
    showToast('✨ Eslogan generado con éxito');
  };

  const handleRegenerateCopywritingAi = () => {
    const generated = generateDynamicCopywriting(businessName, category, city, {
      heroBadge,
      heroTitle,
      heroSubtitle,
      aboutTitle,
      aboutP1,
      aboutP2,
      slogan
    });

    setHeroBadge(generated.heroBadge);
    setHeroTitle(generated.heroTitle);
    setHeroSubtitle(generated.heroSubtitle);
    setAboutTitle(generated.aboutTitle);
    setAboutP1(generated.aboutP1);
    setAboutP2(generated.aboutP2);
    setSlogan(generated.slogan);

    showToast('🪄 ¡Nuevos textos persuasivos generados con IA!');
  };

  // Validar y avanzar al paso 2
  const handleProceedToStep2 = () => {
    if (!city.trim()) {
      showToast('Ingresa o selecciona la ciudad', 'error');
      return;
    }
    if (!businessName.trim()) {
      showToast('Ingresa el nombre comercial del negocio', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('Ingresa el WhatsApp para reservas', 'error');
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generar prospecto y sitio web demo
  const handleGenerateSiteAndProspect = async () => {
    setIsSubmitting(true);
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const baseSlug = (slug || businessName)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'salon';
      const finalSlug = await api.generateUniqueProspectSlug(baseSlug, city);
      const template = VISUAL_TEMPLATE_STYLES.find(t => t.id === selectedTemplateId) || VISUAL_TEMPLATE_STYLES[0];

      // Inyectar HTML Mobile-First con booking SaaS en /reservar/:slug
      const rawHtml = injectBeautyHtml({
        slug: finalSlug,
        category,
        businessName,
        phoneWhatsapp: cleanPhone,
        address: address || (gpsLocation ? `Coordenadas: ${gpsLocation}` : `${city}, Colombia`),
        city,
        primaryColor: template.primaryColor,
        visualTemplateId: selectedTemplateId,
        heroImage: heroDesktopUrl || template.previewImage,
        heroMobileImage: heroMobileUrl || template.previewImage,
        bannerUrl: bannerMenuUrl || template.previewImage,
        heroBadge: heroBadge || (category === 'nails' ? 'Nail Spa & Esthetic' : undefined),
        headline: heroTitle || `${businessName} | ${slogan}`,
        subheadline: heroSubtitle || 'Agenda tu turno online en segundos con confirmación inmediata 24/7.',
        scheduleText: customScheduleText,
        aboutTitle,
        aboutP1,
        aboutP2,
        services: servicesList,
        gpsCoordinates: gpsLocation || undefined
      });

      const newSitePayload = {
        slug: finalSlug,
        business_name: businessName,
        phone_whatsapp: cleanPhone,
        address: address || `${city}, Colombia`,
        city,
        raw_html: rawHtml,
        category,
        status: 'prospecto' as const,
        primary_color: template.primaryColor,
        creator_email: agent?.email || 'asesor@kowy.app',
        gps_coordinates: gpsLocation || undefined,
        views_count: 0,
        business_data: {
          gps: gpsLocation,
          city,
          specialty_id: category,
          template_id: selectedTemplateId,
          slogan,
          headline: heroTitle,
          subheadline: heroSubtitle,
          hero_badge: heroBadge,
          hero_image_desktop: heroDesktopUrl,
          hero_image_mobile: heroMobileUrl,
          banner_url: bannerMenuUrl,
          horario: customScheduleText,
          about: { title: aboutTitle, p1: aboutP1, p2: aboutP2 },
          servicios: servicesList
        }
      };

      let insertedProspect: ProspectSite | null = null;

      if (supabase && isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('prospect_sites')
          .insert([newSitePayload])
          .select()
          .maybeSingle();

        if (!error && data) {
          insertedProspect = data;
        }
      }

      if (!insertedProspect) {
        insertedProspect = await api.createProspectSite({
          ...newSitePayload,
          id: 'prospect-' + Date.now()
        } as any);
      }

      setCreatedProspect(insertedProspect);
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('🎉 ¡Ficha y Sitio Web Demo creados con éxito!');

      // Actualizar métricas del agente
      if (agent?.email) {
        const metrics = await agentService.getAgentMetrics(agent.email);
        setAgent(prev => prev ? { ...prev, metricas: metrics } : null);
        loadProspects(agent.email);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error al registrar prospecto: ' + (err.message || ''), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Activación inmediata B2B en calle con 14 días gratis en Plan Inicio
  const handleQuickActivate = async () => {
    if (!createdProspect) return;
    const targetEmail = activationOwnerEmail.trim() || `${createdProspect.slug}@gmail.com`;

    setIsActivating(true);
    try {
      const res = await activateProspectInField({
        prospect: createdProspect,
        ownerEmail: targetEmail,
        tempPassword: activationOwnerPassword.trim() || undefined,
        agentEmail: agent?.email,
        trialDays: 14
      });

      if (res.success) {
        setActivationResult({
          ownerEmail: res.ownerEmail,
          tempPass: res.tempPassword,
          loginUrl: res.loginUrl,
          tenantId: res.tenant?.id
        });
        showToast('🚀 ¡Salón activado con 14 Días Gratis en Plan Inicio!');
      } else {
        showToast(res.error || 'No se pudo activar el salón', 'error');
      }
    } catch (err: any) {
      showToast('Error en la activación: ' + (err.message || ''), 'error');
    } finally {
      setIsActivating(false);
    }
  };

  const getActivePitchText = (): string => {
    if (!createdProspect) return '';
    const demoUrl = `${window.location.origin}/sitio/${createdProspect.slug}`;
    const cleanName = createdProspect.business_name;

    if (selectedPitchStep === 1) {
      return generateStep1Pitch({
        businessName: cleanName,
        category: createdProspect.category,
        slug: createdProspect.slug
      });
    }
    if (selectedPitchStep === 2) {
      return generateStep2Pitch({
        businessName: cleanName,
        category: createdProspect.category
      });
    }
    return generateMaklozTechPitch({
      businessName: cleanName
    });
  };

  const handleCopyPitch = () => {
    const text = getActivePitchText();
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    showToast('📋 Pitch copiado al portapapeles');
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    if (!createdProspect) return;
    const cleanPhone = createdProspect.phone_whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(getActivePitchText());
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleResetForNewProspect = () => {
    setBusinessName('');
    setSlug('');
    setPhone('');
    setAddress('');
    setGpsLocation(null);
    setCreatedProspect(null);
    setActivationResult(null);
    setActivationOwnerEmail('');
    setActivationOwnerPassword('');
    setShowActivationPassword(false);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper para verificar si un prospecto ya fue activado en producción
  const isProspectActive = (p: ProspectSite) => {
    return p.status === 'reclamado' || p.status === 'cliente_pago' || Boolean(p.claimed_tenant_id);
  };

  const handleStartActivateProspect = (p: ProspectSite) => {
    setActivatingProspectId(p.id);
    const clean = p.business_name?.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Kowy';
    setModalTempPassword(`${clean.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}*`);
    setModalOwnerEmail(p.owner_email || `${p.slug}@gmail.com`);
    setModalTrialDays(14);
    setModalSuccessData(null);
  };

  const handleConfirmModalActivation = async (p: ProspectSite) => {
    if (!modalOwnerEmail.trim()) {
      showToast('Ingresa el correo del propietario', 'error');
      return;
    }
    setIsModalActivating(true);
    try {
      const res = await activateProspectInField({
        prospect: p,
        ownerEmail: modalOwnerEmail.trim(),
        tempPassword: modalTempPassword.trim(),
        agentEmail: agent?.email,
        trialDays: modalTrialDays
      });

      if (res.success) {
        setModalSuccessData({
          prospectId: p.id,
          businessName: p.business_name,
          phone: p.phone_whatsapp,
          ownerEmail: res.ownerEmail,
          tempPass: res.tempPassword,
          loginUrl: res.loginUrl,
          trialDays: res.trialDays,
          slug: p.slug,
          category: p.category
        });

        // Actualizar el estado en la lista local de prospectos
        setRecentProspects(prev => prev.map(item => {
          if (item.id === p.id) {
            return {
              ...item,
              status: 'reclamado',
              claimed_tenant_id: res.tenant?.id,
              owner_email: res.ownerEmail
            };
          }
          return item;
        }));

        showToast(`🎉 ¡${p.business_name} activado con ${res.trialDays} Días Gratis!`);
      } else {
        showToast(res.error || 'Error al activar prospecto', 'error');
      }
    } catch (err: any) {
      showToast('Error: ' + (err.message || ''), 'error');
    } finally {
      setIsModalActivating(false);
    }
  };

  const handleSendCredentialsViaWhatsApp = (
    businessName: string,
    phone: string,
    ownerEmail: string,
    tempPass: string,
    slug: string,
    category?: string
  ) => {
    const text = generateWelcomeCredentialsPitch({
      tenantName: businessName,
      ownerEmail,
      tempPass,
      slug,
      category,
      origin: window.location.origin
    });
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // --------------------------------------------------------------------------
  // PANTALLA DE LOGIN DE ASESOR
  // --------------------------------------------------------------------------
  if (!loading && !agent) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-[#FF5A36] selection:text-white">
        <div className="w-full max-w-md bg-[#0e121b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5A36]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 shadow-lg shadow-[#FF5A36]/30 mb-3 border border-white/20">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Kowy<span className="text-[#FF5A36]">.app</span></h1>
            <p className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A36] mt-0.5">Módulo Agentes de Campo</p>
            <p className="text-xs text-slate-400 mt-2">Ingresa tu código o correo de asesor comercial para iniciar prospección en calle.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Código o Correo del Asesor
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={agentEmailInput}
                  onChange={(e) => setAgentEmailInput(e.target.value)}
                  placeholder="ej. carlos@kowy.app o AGENTE-01"
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF5A36] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-extrabold text-sm uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all shadow-lg shadow-[#FF5A36]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>{isLoggingIn ? 'Iniciando sesión...' : 'Entrar al Módulo de Campo'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link to="/superadmin" className="text-xs text-slate-400 hover:text-white transition-colors">
              Ir al Superadmin Central ➔
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // INTERFAZ PRINCIPAL DEL AGENTE DE CAMPO (3 PASOS)
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-[#FF5A36] selection:text-white pb-20">
      
      {/* =====================================================================
          HEADER DEL AGENTE (IDÉNTICO A LA IMAGEN)
          ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white">
              kowy<span className="text-[#FF5A36]">7</span>
            </span>
          </Link>
          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40">
            AGENTE EN CAMPO
          </span>
          <span className="hidden md:inline text-xs text-slate-400">
            {agent?.nombre || 'SuperAdmin Principal'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span>Mis Prospectos ({recentProspects.length})</span>
          </button>
          
          <Link
            to="/superadmin"
            className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>SuperAdmin</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-8 h-8 rounded-xl border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =====================================================================
          STEP WIZARD BAR (PASO 1, PASO 2, PASO 3)
          ===================================================================== */}
      <div className="border-b border-white/5 bg-[#0B0F19] py-3.5 px-4 sticky top-[57px] z-30">
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
          
          {/* STEP 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 transition-all cursor-pointer ${
              currentStep === 1 
                ? 'text-[#FF5A36]' 
                : currentStep > 1 
                  ? 'text-emerald-400' 
                  : 'text-slate-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
              currentStep === 1
                ? 'bg-[#FF5A36] text-white border-[#FF5A36]'
                : currentStep > 1
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-white/5 text-slate-500 border-white/10'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className={currentStep === 1 ? 'border-b-2 border-[#FF5A36] pb-0.5' : ''}>
              FICHA NEGOCIO
            </span>
          </button>

          <div className="flex-1 h-0.5 bg-white/10 mx-3" />

          {/* STEP 2 */}
          <button
            type="button"
            onClick={() => {
              if (businessName.trim() && phone.trim()) setCurrentStep(2);
              else showToast('Completa los datos del paso 1 primero', 'error');
            }}
            className={`flex items-center gap-2 transition-all cursor-pointer ${
              currentStep === 2 
                ? 'text-[#FF5A36]' 
                : currentStep > 2 
                  ? 'text-emerald-400' 
                  : 'text-slate-500'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
              currentStep === 2
                ? 'bg-[#FF5A36] text-white border-[#FF5A36]'
                : currentStep > 2
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-white/5 text-slate-500 border-white/10'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className={currentStep === 2 ? 'border-b-2 border-[#FF5A36] pb-0.5' : ''}>
              FOTOS & SERVICIOS
            </span>
          </button>

          <div className="flex-1 h-0.5 bg-white/10 mx-3" />

          {/* STEP 3 */}
          <div className={`flex items-center gap-2 ${
            currentStep === 3 ? 'text-emerald-400' : 'text-slate-500'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
              currentStep === 3
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white/5 text-slate-500 border-white/10'
            }`}>
              3
            </span>
            <span>¡LISTO!</span>
          </div>

        </div>
      </div>

      {/* TOAST FLOTANTE */}
      {notificationMsg && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 border transition-all ${
          notificationMsg.type === 'success' 
            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40' 
            : 'bg-red-500/20 text-red-200 border-red-500/40'
        }`}>
          {notificationMsg.type === 'success' ? '✅' : '⚠️'}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6">
        
        {/* ===================================================================
            PASO 1: FICHA NEGOCIO (IDÉNTICO A LA PRIMERA IMAGEN)
            =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            
            {/* Título de la Ficha */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-2xl">🏪</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  FICHA DEL SALÓN / NEGOCIO
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Toma los datos del negocio en el local para simular la web y el agendador interactivo.
              </p>
            </div>

            {/* SECCIÓN 1: UBICACIÓN & CIUDAD DEL LOCAL */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF5A36]" />
                    <span>1. UBICACIÓN & CIUDAD DEL LOCAL *</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fija la ciudad primero para que la IA adapte los eslóganes y textos a la región.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isCapturingGps}
                  className="px-3 py-1.5 rounded-xl border border-[#FF5A36]/40 bg-[#FF5A36]/10 text-[#FF5A36] hover:bg-[#FF5A36]/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Capturar coordenadas GPS automáticas"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isCapturingGps ? 'GPS...' : 'GPS Auto'}</span>
                </button>
              </div>

              {gpsLocation && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>GPS fijado: {gpsLocation}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="ej. Medellín"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF5A36] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Dirección del Local *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Carrera 101A # 98-20"
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF5A36] transition-all"
                  />
                </div>
              </div>

              {/* Botones de Ciudad Rápida */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  RÁPIDO:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FAST_CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCity(c)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        city.toLowerCase() === c.toLowerCase()
                          ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: NOMBRE COMERCIAL DEL SALÓN */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>🏷️</span>
                <span>2. NOMBRE COMERCIAL DEL SALÓN / NEGOCIO *</span>
              </h3>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Sandra Color's / Barbería Imperial"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base font-bold placeholder-slate-500 focus:outline-none focus:border-[#FF5A36] transition-all"
              />
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Identificador URL (Slug):</span>
                <code className="text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded-md font-mono text-xs">
                  kowy.app/s/{slug || 'slug'}
                </code>
              </div>
            </div>

            {/* SECCIÓN 3: ESPECIALIDAD DE BELLEZA */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#FF5A36]" />
                  <span>3. ESPECIALIDAD DE BELLEZA *</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Selecciona la especialidad principal para cargar el catálogo de servicios y fotos de muestra.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(BEAUTY_SPECIALTIES).map((spec) => {
                  const isSelected = category === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setCategory(spec.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#FF5A36] bg-[#FF5A36]/15 text-white shadow-lg shadow-[#FF5A36]/20'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xl">{spec.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{spec.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 4: ESLOGAN O FRASE DISTINTIVA */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                    <span>4. ESLOGAN O FRASE DISTINTIVA</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lema para la portada de la web en {city} y el agendador.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSloganAiSuggest}
                  className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sugerir con IA</span>
                </button>
              </div>

              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Ej. El arte de resaltar tu belleza en Medellín"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FF5A36] transition-all"
              />
            </div>

            {/* SECCIÓN 5: WHATSAPP PARA CITAS */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>5. WHATSAPP PARA RESERVAS DEL SALÓN *</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  A este número llegarán las confirmaciones y notificaciones del agendador interactivo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                  co +57
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="312 345 6789"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base font-bold placeholder-slate-500 focus:outline-none focus:border-[#FF5A36] transition-all"
                />
              </div>
            </div>

            {/* SECCIÓN 6: HORARIO DE ATENCIÓN */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF5A36]" />
                    <span>6. HORARIO DE ATENCIÓN</span>
                  </h3>
                </div>
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
                  {(['constructor', 'frecuentes', 'manual'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setScheduleMode(mode)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                        scheduleMode === mode ? 'bg-[#FF5A36] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Días activos */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Días que abre el local
                </label>
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {[
                    { key: 'L', label: 'LUN' },
                    { key: 'M', label: 'MAR' },
                    { key: 'X', label: 'MIÉ' },
                    { key: 'J', label: 'JUE' },
                    { key: 'V', label: 'VIE' },
                    { key: 'S', label: 'SÁB' },
                    { key: 'D', label: 'DOM' }
                  ].map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setActiveDays(prev => ({ ...prev, [d.key]: !prev[d.key] }))}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center ${
                        activeDays[d.key]
                          ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                          : 'bg-white/5 text-slate-500 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{d.key}</span>
                      <span className="text-[9px] opacity-80">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Horas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    ☀️ Abre a las:
                  </label>
                  <select
                    value={openHour}
                    onChange={(e) => setOpenHour(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="07:00 AM" className="bg-slate-900">07:00 AM</option>
                    <option value="08:00 AM" className="bg-slate-900">08:00 AM</option>
                    <option value="08:30 AM" className="bg-slate-900">08:30 AM</option>
                    <option value="09:00 AM" className="bg-slate-900">09:00 AM</option>
                    <option value="10:00 AM" className="bg-slate-900">10:00 AM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    🌙 Cierra a las:
                  </label>
                  <select
                    value={closeHour}
                    onChange={(e) => setCloseHour(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-[#FF5A36]"
                  >
                    <option value="06:00 PM" className="bg-slate-900">06:00 PM</option>
                    <option value="07:00 PM" className="bg-slate-900">07:00 PM</option>
                    <option value="08:00 PM" className="bg-slate-900">08:00 PM</option>
                    <option value="09:00 PM" className="bg-slate-900">09:00 PM</option>
                    <option value="10:00 PM" className="bg-slate-900">10:00 PM</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={weekendLateClose}
                  onChange={(e) => setWeekendLateClose(e.target.checked)}
                  className="rounded border-white/20 text-[#FF5A36] focus:ring-0 w-4 h-4 bg-white/5"
                />
                <span className="text-xs text-slate-300">🌙 Viernes y Sábado cierran más tarde</span>
              </label>

              {/* Horario Resultante Box */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    HORARIO RESULTANTE EN LA WEB Y RESERVAS:
                  </span>
                  {isEditingScheduleText ? (
                    <input
                      type="text"
                      value={customScheduleText}
                      onChange={(e) => setCustomScheduleText(e.target.value)}
                      onBlur={() => setIsEditingScheduleText(false)}
                      autoFocus
                      className="text-xs font-bold text-white bg-white/10 px-2 py-1 rounded border border-white/20 mt-1 w-full"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white mt-0.5 block">{customScheduleText}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingScheduleText(!isEditingScheduleText)}
                  className="px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 text-[11px] font-bold text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
                >
                  ✏️ Retocar Texto
                </button>
              </div>
            </div>

            {/* BOTÓN CONTINUAR A FOTOS & SERVICIOS */}
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-sm uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all shadow-xl shadow-[#FF5A36]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>CONTINUAR A FOTOS & SERVICIOS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* ===================================================================
            PASO 2: FOTOS & CARTA DE SERVICIOS (IDÉNTICO A LA SEGUNDA IMAGEN)
            =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            
            {/* Cabecera con botón volver */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a Ficha</span>
              </button>
              <span className="text-xs text-slate-400 font-bold">{businessName}</span>
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-2xl">📸</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  FOTOS & CARTA DE SERVICIOS
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Elige la estética visual y los servicios más populares del salón.
              </p>
            </div>

            {/* SECCIÓN 1: MODELO VISUAL DEL SITIO WEB (8 ESTILOS BASE) */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#FF5A36]" />
                  <span>MODELO VISUAL DEL SITIO WEB (8 ESTILOS BASE)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Elige el diseño que mejor represente la identidad del salón.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {VISUAL_TEMPLATE_STYLES.map((t) => {
                  const isSelected = selectedTemplateId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(t.id);
                        if (t.previewImage) {
                          setHeroDesktopUrl(t.previewImage);
                        }
                        const targetCategory = t.id === 'salon-femenino-colorimetria' ? 'salon'
                          : (t.id === 'rose-gold-blush' || t.id === 'caramel-mocca') ? 'nails'
                          : (t.id === 'emerald-botanical') ? 'spa'
                          : (t.id === 'lavanda-serenity') ? 'cejas'
                          : (t.id === 'dark-luxury-gold') ? 'barberia'
                          : category;
                        if (targetCategory !== category) {
                          setCategory(targetCategory);
                        }
                      }}
                      className={`group rounded-2xl overflow-hidden border text-left flex flex-col transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/40 shadow-xl shadow-[#FF5A36]/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="h-28 w-full relative overflow-hidden bg-black">
                        <img 
                          src={t.previewImage} 
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-md">
                          {t.nicheTag}
                        </span>
                        {isSelected && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#FF5A36] text-white shadow-md">
                            SELECCIONADO
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(t);
                          }}
                          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/85 hover:bg-[#FF5A36] text-white flex items-center gap-1 border border-white/20 backdrop-blur-md shadow-lg transition-colors z-10"
                          title="Ver Demo interactiva de esta plantilla"
                        >
                          <Eye className="w-3 h-3 text-[#FF5A36]" />
                          <span>Ver Demo</span>
                        </button>
                      </div>
                      <div className="p-3 bg-[#0b0e17] flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black text-[#FF5A36] block">{t.badge}</span>
                          <h4 className="text-xs font-bold text-white leading-snug">{t.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 2: FOTOS HERO Y BANNER (OPCIONALES) */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#FF5A36]" />
                  <span>FOTOS HERO Y BANNER DEL CATÁLOGO (OPCIONALES)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Personaliza la foto de portada de la web y el agendador digital para la especialidad.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Hero Horizontal (Desktop) */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">🖼️ Hero Desktop</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setHeroDesktopUrl('https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp')}
                        className="text-[9px] text-[#FF5A36] hover:underline font-bold cursor-pointer"
                        title="Fijar foto oficial de campaña en alta definición"
                      >
                        Campaña HD ✨
                      </button>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">16:9</span>
                    </div>
                  </div>

                  <div className="h-28 rounded-xl overflow-hidden bg-black/60 relative border border-white/10 group">
                    <img src={heroDesktopUrl} alt="Hero Desktop" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {isUploadingPhoto === 'heroDesktop' && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-1.5 text-white">
                        <RefreshCw className="w-5 h-5 text-[#FF5A36] animate-spin" />
                        <span className="text-[10px] font-bold">Comprimiendo WebP...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => desktopFileInputRef.current?.click()}
                      disabled={isUploadingPhoto === 'heroDesktop'}
                      className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
                      title="Subir foto desde la galería de tu celular o PC"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Subir Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStockModalTarget('heroDesktop');
                        setStockFilterCategory(category === 'barberia' ? 'barberia' : (category === 'nails' ? 'nails' : 'all'));
                      }}
                      className="px-2 py-1.5 rounded-xl bg-[#FF5A36]/20 hover:bg-[#FF5A36]/30 text-[#FF5A36] border border-[#FF5A36]/40 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Elegir foto profesional de la biblioteca Kowy"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Biblioteca</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={desktopFileInputRef}
                    onChange={(e) => handlePhotoUpload(e, 'heroDesktop')}
                    accept="image/*"
                    className="hidden"
                  />

                  <input
                    type="url"
                    value={heroDesktopUrl}
                    onChange={(e) => setHeroDesktopUrl(e.target.value)}
                    placeholder="O pega una URL..."
                    className="w-full px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-[9px] text-slate-300 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>

                {/* 2. Hero Vertical (Móvil) */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">📱 Hero Móvil</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">9:16</span>
                  </div>

                  <div className="h-28 rounded-xl overflow-hidden bg-black/60 relative border border-white/10 group">
                    <img src={heroMobileUrl} alt="Hero Mobile" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {isUploadingPhoto === 'heroMobile' && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-1.5 text-white">
                        <RefreshCw className="w-5 h-5 text-[#FF5A36] animate-spin" />
                        <span className="text-[10px] font-bold">Comprimiendo WebP...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => mobileFileInputRef.current?.click()}
                      disabled={isUploadingPhoto === 'heroMobile'}
                      className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
                      title="Subir foto desde la galería de tu celular o PC"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Subir Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStockModalTarget('heroMobile');
                        setStockFilterCategory(category === 'barberia' ? 'barberia' : (category === 'nails' ? 'nails' : 'all'));
                      }}
                      className="px-2 py-1.5 rounded-xl bg-[#FF5A36]/20 hover:bg-[#FF5A36]/30 text-[#FF5A36] border border-[#FF5A36]/40 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Elegir foto profesional de la biblioteca Kowy"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Biblioteca</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    onChange={(e) => handlePhotoUpload(e, 'heroMobile')}
                    accept="image/*"
                    className="hidden"
                  />

                  <input
                    type="url"
                    value={heroMobileUrl}
                    onChange={(e) => setHeroMobileUrl(e.target.value)}
                    placeholder="O pega una URL..."
                    className="w-full px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-[9px] text-slate-300 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>

                {/* 3. Banner Catálogo */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">🏷️ Banner Menú</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">Banner</span>
                  </div>

                  <div className="h-28 rounded-xl overflow-hidden bg-black/60 relative border border-white/10 group">
                    <img src={bannerMenuUrl} alt="Banner Menú" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {isUploadingPhoto === 'banner' && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-1.5 text-white">
                        <RefreshCw className="w-5 h-5 text-[#FF5A36] animate-spin" />
                        <span className="text-[10px] font-bold">Comprimiendo WebP...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      disabled={isUploadingPhoto === 'banner'}
                      className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/10"
                      title="Subir foto desde la galería de tu celular o PC"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>Subir Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStockModalTarget('banner');
                        setStockFilterCategory(category === 'barberia' ? 'barberia' : (category === 'nails' ? 'nails' : 'all'));
                      }}
                      className="px-2 py-1.5 rounded-xl bg-[#FF5A36]/20 hover:bg-[#FF5A36]/30 text-[#FF5A36] border border-[#FF5A36]/40 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Elegir foto profesional de la biblioteca Kowy"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Biblioteca</span>
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    onChange={(e) => handlePhotoUpload(e, 'banner')}
                    accept="image/*"
                    className="hidden"
                  />

                  <input
                    type="url"
                    value={bannerMenuUrl}
                    onChange={(e) => setBannerMenuUrl(e.target.value)}
                    placeholder="O pega una URL..."
                    className="w-full px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-[9px] text-slate-300 focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: COPYWRITING PERSONALIZADO (HERO & HISTORIA) */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                    <span>COPYWRITING PERSONALIZADO (HERO & HISTORIA)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Textos persuasivos redactados para {businessName}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateCopywritingAi}
                  className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerar IA</span>
                </button>
              </div>

              {/* Bloque 1: Hero */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-[#FF5A36] block">
                  1. BLOQUE HERO (PORTADA)
                </span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Badge Caligráfico / Distintivo Superior (&#123;&#123;HERO_BADGE&#125;&#125;):
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    placeholder="Ej. Nail Spa &amp; Esthetic o 💅 Manicura Rusa &amp; Nail Art"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Título de Impacto:</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Subtítulo Descriptivo:</label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* Bloque 2: Sobre Nosotros */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-black uppercase text-[#FF5A36] block">
                  2. BLOQUE NUESTRA HISTORIA / SOBRE NOSOTROS
                </span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Título de Sección:</label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Párrafo 1 (Origen & Filosofía):</label>
                  <textarea
                    rows={2}
                    value={aboutP1}
                    onChange={(e) => setAboutP1(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Párrafo 2 (Experiencia & Productos):</label>
                  <textarea
                    rows={2}
                    value={aboutP2}
                    onChange={(e) => setAboutP2(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: SERVICIOS DEL SALÓN */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-[#FF5A36]" />
                    <span>SERVICIOS DEL SALÓN ({servicesList.length})</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Se inyectan directamente en el sitio web sin que tengas que digitarlos en el local.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const spec = BEAUTY_SPECIALTIES[category] || BEAUTY_SPECIALTIES.barberia;
                    setServicesList([...spec.services]);
                    showToast('⚡ Servicios restaurados desde la plantilla');
                  }}
                  className="px-2.5 py-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ Auto Plantilla</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          {service.etiqueta || service.categoria}
                        </span>
                        <input
                          type="number"
                          value={service.precio_cop}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setServicesList(prev => prev.map((s, i) => i === idx ? { ...s, precio_cop: val } : s));
                          }}
                          className="w-24 text-right px-2 py-0.5 bg-black/50 border border-white/15 rounded text-xs font-black text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={service.titulo}
                        onChange={(e) => {
                          const val = e.target.value;
                          setServicesList(prev => prev.map((s, i) => i === idx ? { ...s, titulo: val } : s));
                        }}
                        className="w-full bg-transparent font-bold text-xs text-white border-b border-transparent hover:border-white/20 focus:border-[#FF5A36] focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{service.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN INFERIOR */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
              >
                VOLVER
              </button>
              <button
                type="button"
                onClick={handleGenerateSiteAndProspect}
                disabled={isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-sm uppercase tracking-wider hover:opacity-95 active:scale-98 transition-all shadow-xl shadow-[#FF5A36]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>GENERANDO SITIO DEMO...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GENERAR NEGOCIO & FICHA ➔</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* ===================================================================
            PASO 3: ¡LISTO! DEMO CREADA, PITCH WHATSAPP Y ACTIVACIÓN B2B
            =================================================================== */}
        {currentStep === 3 && createdProspect && (
          <div className="space-y-6">
            
            {/* Banner de Éxito */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-[#FF5A36]/15 to-pink-500/20 border border-emerald-500/40 text-center space-y-2 shadow-2xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/30">
                ✓
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                ¡Página Web Demo & Agendador Creados!
              </h2>
              <p className="text-xs text-slate-300">
                El demo para <strong className="text-white">{createdProspect.business_name}</strong> ya está en vivo en la nube con el agendador interactivo de Kowy.
              </p>
            </div>

            {/* Tarjeta de Enlaces en Vivo */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                ENLACES EN VIVO PARA MOSTRAR A LA DUEÑA DEL SALÓN:
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#FF5A36] block">Landing Demo</span>
                    <p className="text-xs font-mono text-white truncate">
                      {window.location.origin}/sitio/{createdProspect.slug}
                    </p>
                  </div>
                  <a
                    href={`/sitio/${createdProspect.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#FF5A36] text-white text-xs font-bold flex items-center gap-1.5 shrink-0 hover:opacity-95"
                  >
                    <span>Ver Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block">Agendador 24/7</span>
                    <p className="text-xs font-mono text-white truncate">
                      {window.location.origin}/reservar/{createdProspect.slug}
                    </p>
                  </div>
                  <a
                    href={`/reservar/${createdProspect.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 hover:opacity-95"
                  >
                    <span>Agendador</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* SECCIÓN WHATSAPP PITCH PERSUASIVO */}
            <div className="bg-[#0e121b] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>PITCH DE WHATSAPP PARA EL DUEÑO</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Envía el mensaje estructurado para captar su atención de inmediato.
                  </p>
                </div>
              </div>

              {/* Selector de Pasos */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
                {[
                  { id: 1, label: 'Paso 1: Gancho Visual' },
                  { id: 2, label: 'Paso 2: 14 Días Gratis $29k' },
                  { id: 3, label: 'Paso 3: Estatus Makloz' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedPitchStep(s.id as 1 | 2 | 3)}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      selectedPitchStep === s.id
                        ? 'bg-[#FF5A36] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Preview del mensaje */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-slate-200 whitespace-pre-line font-sans leading-relaxed max-h-56 overflow-y-auto">
                {getActivePitchText()}
              </div>

              {/* Botones de acción WhatsApp */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPitch ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#22bf5b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </div>
            </div>

            {/* SECCIÓN ACTIVACIÓN B2B EN CALIENTE (14 DÍAS PLAN INICIO) */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-[#0e121b] to-purple-950/40 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2 inline-block">
                  🚀 Cierre Inmediato en Calle
                </span>
                <h3 className="text-sm font-extrabold text-white">
                  ACTIVAR SALÓN EN PRODUCCIÓN (14 DÍAS GRATIS - PLAN INICIO)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Si el dueño aprueba en el acto, genérale su cuenta SaaS en 1 clic. Entra con 14 días gratis ($0 hosting de por vida).
                </p>
              </div>

              {!activationResult ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Correo del Dueño del Salón (Para Login):
                    </label>
                    <input
                      type="email"
                      value={activationOwnerEmail}
                      onChange={(e) => setActivationOwnerEmail(e.target.value)}
                      placeholder="ej. contacto@misalon.com"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-300">
                        Contraseña de Acceso:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const clean = createdProspect?.business_name?.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Kowy';
                          const newPass = `${clean}${Math.floor(1000 + Math.random() * 9000)}*`;
                          setActivationOwnerPassword(newPass);
                          showToast('🎲 Nueva clave generada');
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>🎲 Generar otra</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showActivationPassword ? 'text' : 'password'}
                        value={activationOwnerPassword}
                        onChange={(e) => setActivationOwnerPassword(e.target.value)}
                        placeholder="ej. Kowy2026*"
                        className="w-full px-3.5 py-2.5 pr-10 bg-white/5 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowActivationPassword(!showActivationPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        title={showActivationPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showActivationPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Podés dejar esta clave pre-generada o escribir la que el dueño te indique en el local.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickActivate}
                    disabled={isActivating}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    {isActivating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Key className="w-4 h-4" />
                    )}
                    <span>{isActivating ? 'Activando...' : 'Activar Cuenta del Salón Ahora'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Salón Activo en Plan Inicio (14 Días Gratis)!</span>
                  </div>
                  <div className="text-xs space-y-1 font-mono text-slate-200">
                    <p>📧 Usuario: <strong>{activationResult.ownerEmail}</strong></p>
                    <p>🔑 Clave Temporal: <strong>{activationResult.tempPass}</strong></p>
                    <p>🌐 Panel: <strong>{activationResult.loginUrl}</strong></p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleSendCredentialsViaWhatsApp(
                          createdProspect.business_name,
                          createdProspect.phone_whatsapp,
                          activationResult.ownerEmail,
                          activationResult.tempPass,
                          createdProspect.slug,
                          createdProspect.category
                        );
                      }}
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Credenciales por WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const creds = generateWelcomeCredentialsPitch({
                          tenantName: createdProspect.business_name,
                          ownerEmail: activationResult.ownerEmail,
                          tempPass: activationResult.tempPass,
                          slug: createdProspect.slug,
                          category: createdProspect.category,
                          origin: window.location.origin
                        });
                        navigator.clipboard.writeText(creds);
                        showToast('📋 Credenciales copiadas para enviar por WhatsApp');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN REGISTRAR OTRO SALÓN */}
            <button
              type="button"
              onClick={handleResetForNewProspect}
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-extrabold text-xs uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>+ REGISTRAR OTRO SALÓN EN LA CALLE</span>
            </button>

          </div>
        )}

      </main>

      {/* =====================================================================
          MODAL DE PROSPECTOS EN CAMPO (ACTIVACIÓN IN-FIELD & WHATSAPP)
          ===================================================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Header del Modal */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#0e121b]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    Prospectos en Campo
                  </h3>
                  <p className="text-xs text-slate-400">
                    Activa clientes o reenvía credenciales de acceso
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false);
                  setActivatingProspectId(null);
                  setModalSuccessData(null);
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
                title="Cerrar modal"
              >
                ✕
              </button>
            </div>

            {/* Buscador reactivo por nombre, teléfono o ciudad */}
            <div className="p-4 border-b border-white/5 bg-[#0e121b]/60">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={prospectSearchTerm}
                  onChange={(e) => setProspectSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, teléfono o ciudad..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                {prospectSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setProspectSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Prospectos */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-white/5">
              {(() => {
                const term = prospectSearchTerm.toLowerCase().trim();
                const filtered = recentProspects.filter((p) => {
                  if (!term) return true;
                  return (
                    (p.business_name || '').toLowerCase().includes(term) ||
                    (p.phone_whatsapp || '').toLowerCase().includes(term) ||
                    (p.city || '').toLowerCase().includes(term) ||
                    (p.category || '').toLowerCase().includes(term)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      {prospectSearchTerm ? 'No se encontraron prospectos con ese criterio.' : 'Aún no hay prospectos registrados en campo.'}
                    </div>
                  );
                }

                return filtered.map((p) => {
                  const isActive = isProspectActive(p);
                  const isActivatingThis = activatingProspectId === p.id;
                  const successForThis = modalSuccessData?.prospectId === p.id;

                  return (
                    <div key={p.id} className="pt-3 first:pt-0 space-y-2.5">
                      
                      {/* Fila principal del Prospecto */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-extrabold text-white truncate">
                              {p.business_name}
                            </h4>
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black tracking-wider uppercase">
                                ACTIVO
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-black tracking-wider uppercase">
                                DEMO
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="text-rose-400 text-xs">📍</span>
                            <span>{p.city || 'Apartadó'}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-rose-400 text-xs">📞</span>
                            <span className="font-mono">{p.phone_whatsapp}</span>
                          </div>
                        </div>

                        {/* Acciones del Prospecto */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Botón Ver Sitio en Vivo */}
                          <a
                            href={`/sitio/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Ver sitio web"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {isActive ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>En Producción</span>
                              </span>

                              {/* Botón Reenviar Credenciales por WhatsApp */}
                              <button
                                type="button"
                                onClick={() => {
                                  handleSendCredentialsViaWhatsApp(
                                    p.business_name,
                                    p.phone_whatsapp,
                                    p.owner_email || `${p.slug}@gmail.com`,
                                    'Kowy2026*',
                                    p.slug,
                                    p.category
                                  );
                                  showToast('📲 Abriendo WhatsApp para enviar accesos');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                title="Enviar credenciales y días gratis por WhatsApp"
                              >
                                <Send className="w-3 h-3" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartActivateProspect(p)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                isActivatingThis
                                  ? 'bg-amber-500 text-black shadow-md'
                                  : 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400'
                              }`}
                            >
                              <Zap className={`w-3.5 h-3.5 ${isActivatingThis ? 'fill-black' : 'fill-amber-400'}`} />
                              <span>Activar</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Panel Inline de Activación (Idéntico a Imagen 2) */}
                      {isActivatingThis && !successForThis && (
                        <div className="mt-2.5 p-4 rounded-2xl bg-[#121624] border border-amber-500/35 space-y-3 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs uppercase tracking-wider">
                              <Zap className="w-4 h-4 fill-amber-400" />
                              <span>ACTIVAR: {p.business_name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActivatingProspectId(null)}
                              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Input Correo del Dueño */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                Correo del Dueño:
                              </label>
                              <input
                                type="email"
                                value={modalOwnerEmail}
                                onChange={(e) => setModalOwnerEmail(e.target.value)}
                                placeholder="ej. dueño@negocio.com"
                                className="w-full px-3.5 py-2.5 bg-black/70 border border-white/15 rounded-xl text-white text-xs font-sans focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            {/* Input Contraseña + Dado Random */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                                Contraseña de Acceso:
                              </label>
                              <div className="flex items-center gap-1.5">
                                <div className="relative flex-1">
                                  <input
                                    type={modalShowPassword ? 'text' : 'password'}
                                    value={modalTempPassword}
                                    onChange={(e) => setModalTempPassword(e.target.value)}
                                    placeholder="Clave Temporal"
                                    className="w-full px-3.5 py-2.5 pr-8 bg-black/70 border border-white/15 rounded-xl text-amber-300 font-mono text-xs font-bold focus:outline-none focus:border-amber-400 tracking-wider"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setModalShowPassword(!modalShowPassword)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                  >
                                    {modalShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const clean = p.business_name?.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Kowy';
                                    setModalTempPassword(`${clean.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}*`);
                                    showToast('🎲 Nueva contraseña generada');
                                  }}
                                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
                                  title="Generar otra contraseña"
                                >
                                  <Dices className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Días Gratis Opciones */}
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span>Días de prueba bonificados:</span>
                            <div className="flex items-center gap-1.5">
                              {[7, 14, 30].map((d) => (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => setModalTrialDays(d)}
                                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                    modalTrialDays === d
                                      ? 'bg-amber-500 text-black shadow-sm'
                                      : 'bg-white/5 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {d} Días
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Botón Confirmar Activación */}
                          <button
                            type="button"
                            onClick={() => handleConfirmModalActivation(p)}
                            disabled={isModalActivating}
                            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/25"
                          >
                            {isModalActivating ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Activando en Producción...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4 fill-black" />
                                <span>Confirmar Activación ({modalTrialDays} Días Gratis)</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Tarjeta de Éxito y Envío WhatsApp Tras Activar */}
                      {successForThis && (
                        <div className="mt-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>¡Salón Activado ({modalSuccessData.trialDays} Días Gratis de Prueba)!</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setModalSuccessData(null);
                                setActivatingProspectId(null);
                              }}
                              className="text-xs text-slate-400 hover:text-white cursor-pointer"
                            >
                              Cerrar
                            </button>
                          </div>

                          <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-slate-200 space-y-1">
                            <p>📧 Usuario: <strong className="text-white">{modalSuccessData.ownerEmail}</strong></p>
                            <p>🔑 Clave: <strong className="text-amber-300">{modalSuccessData.tempPass}</strong></p>
                            <p>🌐 Panel: <span className="text-slate-300">{modalSuccessData.loginUrl}</span></p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            {/* Enviar Credenciales por WhatsApp */}
                            <button
                              type="button"
                              onClick={() => {
                                handleSendCredentialsViaWhatsApp(
                                  modalSuccessData.businessName,
                                  modalSuccessData.phone,
                                  modalSuccessData.ownerEmail,
                                  modalSuccessData.tempPass,
                                  modalSuccessData.slug,
                                  p.category
                                );
                              }}
                              className="w-full sm:flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar Datos & Días Gratis por WhatsApp</span>
                            </button>

                            {/* Copiar Credenciales */}
                            <button
                              type="button"
                              onClick={() => {
                                const text = generateWelcomeCredentialsPitch({
                                  tenantName: modalSuccessData.businessName,
                                  ownerEmail: modalSuccessData.ownerEmail,
                                  tempPass: modalSuccessData.tempPass,
                                  slug: modalSuccessData.slug,
                                  category: p.category,
                                  origin: window.location.origin
                                });
                                navigator.clipboard.writeText(text);
                                showToast('📋 Credenciales y días gratis copiados');
                              }}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer del Modal */}
            <div className="p-3.5 border-t border-white/10 bg-[#0e121b] flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Total Prospectos: <strong className="text-white">{recentProspects.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowHistoryModal(false);
                  setActivatingProspectId(null);
                  setModalSuccessData(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE VISTA PREVIA INTERACTIVA DE PLANTILLA */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-5 animate-fade-in">
          <div className="w-full max-w-5xl h-[92vh] bg-[#0c1017] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-3.5 sm:p-4 px-5 border-b border-white/10 flex items-center justify-between bg-[#080c12]">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36] animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{previewModalTemplate.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-[#FF5A36] font-black uppercase">
                      {previewModalTemplate.badge}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Vista previa interactiva del sitio web móvil / escritorio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Switch Mobile / Desktop */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDeviceMode('mobile')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDeviceMode === 'mobile'
                        ? 'bg-[#FF5A36] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Móvil (390px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDeviceMode('desktop')}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDeviceMode === 'desktop'
                        ? 'bg-[#FF5A36] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Escritorio
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const chosenId = previewModalTemplate.id;
                    setSelectedTemplateId(chosenId);
                    const targetCategory = chosenId === 'salon-femenino-colorimetria' ? 'salon'
                      : (chosenId === 'rose-gold-blush' || chosenId === 'caramel-mocca') ? 'nails'
                      : (chosenId === 'emerald-botanical') ? 'spa'
                      : (chosenId === 'lavanda-serenity') ? 'cejas'
                      : (chosenId === 'dark-luxury-gold') ? 'barberia'
                      : category;
                    if (targetCategory !== category) {
                      setCategory(targetCategory);
                    }
                    setPreviewModalTemplate(null);
                    showToast(`Plantilla "${previewModalTemplate.name}" seleccionada`);
                  }}
                  className="px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black bg-[#FF5A36] hover:bg-[#e04826] text-white shadow-lg transition-all"
                >
                  Elegir Plantilla
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModalTemplate(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Frame Body */}
            <div className="flex-1 bg-black/70 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black ${
                  previewDeviceMode === 'mobile'
                    ? 'w-[390px] max-w-full'
                    : 'w-full'
                }`}
              >
                <iframe
                  srcDoc={previewHtml}
                  title="Vista Previa de Plantilla"
                  className="w-full h-full border-0 bg-black"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE BIBLIOTECA DE IMÁGENES KOWY */}
      {stockModalTarget && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-[#0e121b] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF5A36]/20 border border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                    <span>Biblioteca de Fotografías de Alta Gama</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30 font-bold uppercase">
                      {stockModalTarget === 'heroDesktop' ? 'Hero Desktop (16:9)' : (stockModalTarget === 'heroMobile' ? 'Hero Móvil (9:16)' : 'Banner Menú')}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Toca cualquier fotografía para seleccionarla y reemplazar la imagen genérica.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStockModalTarget(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Filtros de Categoría y Búsqueda */}
            <div className="p-3 sm:p-4 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
              {/* Categorías */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Todas' },
                  { id: 'barberia', label: 'Barbería' },
                  { id: 'color', label: 'Salón & Color' },
                  { id: 'cortes', label: 'Cortes' },
                  { id: 'nails', label: 'Uñas' },
                  { id: 'spa_facial', label: 'Spa Facial' },
                  { id: 'pestanas', label: 'Cejas & Pestañas' },
                  { id: 'maquillaje', label: 'Maquillaje' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setStockFilterCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      stockFilterCategory === c.id
                        ? 'bg-[#FF5A36] text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Buscador */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="Buscar foto..."
                  className="w-full pl-8 pr-3 py-1.5 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>
            </div>

            {/* Grid de Fotos */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {stockImagesList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No se encontraron fotografías para este filtro.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {stockImagesList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (stockModalTarget === 'heroDesktop') setHeroDesktopUrl(item.url);
                        else if (stockModalTarget === 'heroMobile') setHeroMobileUrl(item.url);
                        else if (stockModalTarget === 'banner') setBannerMenuUrl(item.url);

                        setStockModalTarget(null);
                        showToast(`✨ Foto "${item.title}" asignada`);
                      }}
                      className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#FF5A36] text-left flex flex-col transition-all cursor-pointer relative shadow-md hover:shadow-xl hover:shadow-[#FF5A36]/15"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
                        <img
                          src={item.url}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-black/80 text-white backdrop-blur-md border border-white/10">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-2.5 bg-[#0b0e17] flex-1">
                        <h4 className="text-[11px] font-bold text-white line-clamp-1 group-hover:text-[#FF5A36] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-400">
              <span>{stockImagesList.length} fotografías en biblioteca</span>
              <button
                type="button"
                onClick={() => setStockModalTarget(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer text-xs"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
