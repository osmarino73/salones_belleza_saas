import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/supabase';
import { ProspectSite, Tenant, PlanTier } from '../types';
import {
  BEAUTY_STOCK_LIBRARY,
  StockImageItem,
  getHeroImageForCategory,
  getSuggestedImageForService,
  getSpecialistAvatar,
  optimizeProspectHtml
} from '../lib/beautyImageLibrary';
import { HomepageStudioModal } from '../components/HomepageStudio/HomepageStudioModal';
import {
  Crown,
  Sparkles,
  Globe,
  PlusCircle,
  Copy,
  ExternalLink,
  MessageCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Edit3,
  MapPin,
  Phone,
  Search,
  Filter,
  BarChart3,
  Building2,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon,
  Check,
  X,
  Key,
  Mail,
  Lock,
  UserCheck
} from 'lucide-react';

export const SuperadminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'prospects' | 'tenants'>('generator');
  const [prospectSites, setProspectSites] = useState<ProspectSite[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Homepage Studio Modal State
  const [showHomepageStudioModal, setShowHomepageStudioModal] = useState(false);

  // Form State para el Generador de Sitios Gancho
  const [businessName, setBusinessName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Medellín');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'salon' | 'barberia' | 'spa' | 'estetica' | 'nails'>('salon');
  const [rawHtml, setRawHtml] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState<string>('');
  const [fileNameHeroImg, setFileNameHeroImg] = useState<string>('');
  const [businessData, setBusinessData] = useState<any | null>(null);
  const [jsonInputText, setJsonInputText] = useState('');
  const [showJsonPaste, setShowJsonPaste] = useState(false);
  const [fileNameJson, setFileNameJson] = useState<string>('');
  const [fileNameHtml, setFileNameHtml] = useState<string>('');
  
  // Estado post-publicación exitosa
  const [createdSite, setCreatedSite] = useState<ProspectSite | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Galería de Imágenes de Muestra CDN
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('todos');
  const [copiedImageUrl, setCopiedImageUrl] = useState<string | null>(null);

  // Modal de Activación de Salón / Tenant (Solicitud de Correo & Credenciales)
  const [activatingProspect, setActivatingProspect] = useState<ProspectSite | null>(null);
  const [activationEmail, setActivationEmail] = useState('');
  const [activationTempPass, setActivationTempPass] = useState('');
  const [activationCurrency, setActivationCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>('COP');
  const [activationTrialDays, setActivationTrialDays] = useState(14);
  const [isActivatingTenant, setIsActivatingTenant] = useState(false);
  const [activationSuccessData, setActivationSuccessData] = useState<{
    tenant: Tenant;
    tempPass: string;
    prospect: ProspectSite;
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sites, allTenants] = await Promise.all([
      api.getProspectSites(),
      api.getAllTenants()
    ]);
    setProspectSites(sites);
    setTenants(allTenants);
    setLoading(false);
  };

  // Auto-generar slug al escribir el nombre
  const handleBusinessNameChange = (name: string) => {
    setBusinessName(name);
    const generatedSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  // Procesador inteligente de DATOS_NEGOCIO.json
  const parseAndApplyBusinessData = (jsonData: any) => {
    try {
      const b = jsonData.negocio || jsonData;
      setBusinessData(b);

      if (b.nombre) handleBusinessNameChange(b.nombre);
      
      // Extraer teléfono / WhatsApp
      const waNumber = b.contacto?.whatsapp?.numero || b.contacto?.telefono_principal || b.telefono || '';
      if (waNumber) setPhoneWhatsapp(waNumber);

      // Extraer Google Maps URL
      const mapsUrl = b.ubicacion?.google_maps_url || b.google_maps_url || '';
      if (mapsUrl) setGoogleMapsUrl(mapsUrl);

      // Extraer Dirección y Ciudad
      if (b.ubicacion?.direccion) setAddress(b.ubicacion.direccion);
      if (b.ubicacion?.ciudad) setCity(b.ubicacion.ciudad);

      // Auto-detección inteligente de categoría
      const rubroText = ((b.rubro || '') + ' ' + (b.nombre || '') + ' ' + (b.eslogan || '')).toLowerCase();
      if (rubroText.includes('barber') || rubroText.includes('barbero')) {
        setCategory('barberia');
      } else if (rubroText.includes('spa') || rubroText.includes('masaje') || rubroText.includes('relax')) {
        setCategory('spa');
      } else if (rubroText.includes('nail') || rubroText.includes('uña') || rubroText.includes('pestaña')) {
        setCategory('nails');
      } else if (rubroText.includes('estetic') || rubroText.includes('facial') || rubroText.includes('corporal')) {
        setCategory('estetica');
      } else {
        setCategory('salon');
      }

      // Auto-generar HTML Luxury si no hay uno cargado aún
      const autoHtml = generateStandaloneHtmlFromBusinessData(b);
      setRawHtml(autoHtml);
    } catch (e) {
      console.error('Error parsing business data:', e);
    }
  };

  // Generador de HTML Autónomo de Lujo basado en DATOS_NEGOCIO.json con Imágenes CDN de Alta Gama
  const generateStandaloneHtmlFromBusinessData = (b: any) => {
    const name = b.nombre || 'Salón & Spa Oficial';
    const slogan = b.eslogan || 'Look & Siente Lo Mejor de Ti';
    const wa = b.contacto?.whatsapp?.numero || b.contacto?.telefono_principal || '+573000000000';
    const cleanWa = wa.replace(/\D/g, '');
    const detectedCategory = category || 'salon';
    const heroBgUrl = getHeroImageForCategory(detectedCategory);

    const services = b.servicios || [
      { titulo: 'Cortes & Estilismo', descripcion: 'Diseño de corte personalizado y cepillado profesional.' },
      { titulo: 'Color & Iluminación', descripcion: 'Balayage, tintes premium y brillo extremo.' },
      { titulo: 'Spa & Bienestar', descripcion: 'Tratamientos faciales y corporales de relajación profunda.' }
    ];
    const specialists = b.especialistas || [
      { nombre: 'Especialista Máster', rol: 'Directora & Estilista Principal' },
      { nombre: 'Master Stylist', rol: 'Colorista & Asesor de Imagen' }
    ];

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Sitio Oficial</title>
  <style>
    :root {
      --primary: #FF5A36;
      --accent: #ec4899;
      --dark: #090B10;
      --card-bg: #141926;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
    body { background-color: var(--dark); color: var(--text); line-height: 1.6; }
    .top-bar { background: linear-gradient(90deg, #FF5A36, #ec4899); color: #fff; text-align: center; padding: 9px 16px; font-size: 0.85rem; font-weight: 800; }
    .header { position: relative; padding: 70px 20px 60px; text-align: center; background: linear-gradient(180deg, rgba(9,11,16,0.7) 0%, rgba(9,11,16,0.95) 100%), url('${heroBgUrl}') center/cover no-repeat; }
    .badge { display: inline-block; background: rgba(255,90,54,0.2); border: 1px solid rgba(255,90,54,0.5); color: #ff7e61; padding: 6px 16px; border-radius: 999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; backdrop-blur: 8px; }
    h1 { font-size: 3rem; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 12px; background: linear-gradient(135deg, #fff 40%, #ff7e61 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .slogan { font-size: 1.15rem; color: #cbd5e1; max-width: 650px; margin: 0 auto 26px; }
    .cta-wa { display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff; text-decoration: none; padding: 14px 30px; border-radius: 999px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 10px 25px rgba(37,211,102,0.3); transition: transform 0.2s; }
    .cta-wa:hover { transform: scale(1.04); }
    .container { max-width: 1100px; margin: 0 auto; padding: 50px 20px; }
    .section-title { font-size: 1.9rem; font-weight: 900; margin-bottom: 30px; text-align: center; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 60px; }
    .service-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
    .service-card:hover { transform: translateY(-5px); border-color: rgba(255,90,54,0.4); }
    .service-img { width: 100%; height: 180px; object-fit: cover; }
    .service-body { padding: 22px; }
    .service-card h3 { font-size: 1.25rem; margin-bottom: 8px; color: #fff; }
    .service-card p { font-size: 0.88rem; color: var(--muted); margin-bottom: 14px; min-height: 42px; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
    .team-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 24px; text-align: center; }
    .team-avatar { width: 85px; height: 85px; border-radius: 50%; object-fit: cover; margin: 0 auto 14px; border: 3px solid #FF5A36; box-shadow: 0 8px 20px rgba(255,90,54,0.25); }
    .team-name { font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; }
    .team-role { font-size: 0.82rem; color: #ff7e61; font-weight: 600; }
  </style>
</head>
<body>
  <div class="top-bar">✨ ${slogan} — Agenda tu Cita Online con Confirmación en WhatsApp</div>
  <header class="header">
    <div class="badge">Salón & Spa Oficial en Google Maps</div>
    <h1>${name}</h1>
    <p class="slogan">${slogan}. Atención personalizada de alta gama y especialistas calificados.</p>
    <a href="https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hola ${name}, vi su página web oficial y quisiera cotizar una cita.`)}" target="_blank" class="cta-wa">
      💬 Consultar por WhatsApp
    </a>
  </header>
  <main class="container">
    <h2 class="section-title">Nuestros Servicios Destacados</h2>
    <div class="services-grid">
      ${services.map((s: any) => `
      <div class="service-card">
        <img src="${getSuggestedImageForService(s.titulo, detectedCategory)}" alt="${s.titulo}" class="service-img" loading="lazy" />
        <div class="service-body">
          <h3>✨ ${s.titulo}</h3>
          <p>${s.descripcion}</p>
          ${s.precio_cop ? `<div style="color: #10b981; font-weight: 800; font-size: 1.15rem;">$ ${s.precio_cop.toLocaleString('es-CO')} COP</div>` : ''}
        </div>
      </div>`).join('')}
    </div>
    <h2 class="section-title">Equipo de Especialistas</h2>
    <div class="team-grid">
      ${specialists.map((esp: any, idx: number) => `
      <div class="team-card">
        <img src="${getSpecialistAvatar(idx)}" alt="${esp.nombre}" class="team-avatar" loading="lazy" />
        <div class="team-name">${esp.nombre}</div>
        <div class="team-role">${esp.rol}</div>
      </div>`).join('')}
    </div>
  </main>
</body>
</html>`;
  };

  // Carga de archivo DATOS_NEGOCIO.json
  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileNameJson(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonInputText(text);
        const parsed = JSON.parse(text);
        parseAndApplyBusinessData(parsed);
      } catch (err) {
        alert('Error al leer el archivo JSON. Verifica que sea un formato JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  // Carga de archivo HTML (.html) con optimización de Base64
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileNameHtml(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Optimizar automáticamente reemplazando Base64 pesados por CDN de muestra
      const optimized = optimizeProspectHtml(text, category);
      setRawHtml(optimized);
    };
    reader.readAsText(file);
  };

  // Carga de Fotografía Principal del Hero (JPG, PNG, WebP)
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileNameHeroImg(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setHeroImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Carga del preset Luxus Beauty Spa
  const handleLoadLuxusPreset = async () => {
    const luxusJson = {
      negocio: {
        nombre: "Luxus Beauty Spa",
        rubro: "Salón de Belleza, Estilismo & Spa de Lujo",
        eslogan: "Look & Siente Lo Mejor de Ti en Nuestro Spa de Lujo",
        contacto: {
          telefono_principal: "(300) 987-6543",
          whatsapp: {
            numero: "+573009876543",
            link: "https://wa.me/573009876543?text=Hola,%20quisiera%20reservar%20una%20cita%20en%20Luxus%20Beauty%20Spa"
          }
        },
        ubicacion: {
          google_maps_url: "https://share.google/yWGLacyAcBcrQ8Zy7",
          direccion: "Carrera 43A # 1Sur-220, El Poblado",
          ciudad: "Medellín"
        },
        horario_atencion: "Martes a Sábado: 9:00 AM – 8:00 PM",
        servicios: [
          { titulo: "Cortes & Peinados", descripcion: "Cortes modernos, cepillado y peinados de alto impacto.", precio_cop: 65000, duracion_minutos: 45 },
          { titulo: "Colorimetría & Balayage", descripcion: "Iluminación, balayage y reconstrucción capilar profunda con Olaplex.", precio_cop: 290000, duracion_minutos: 150 },
          { titulo: "Faciales & Spa Relax", descripcion: "Limpieza facial ultrasónica, peelings orgánicos y masajes relajantes.", precio_cop: 130000, duracion_minutos: 75 },
          { titulo: "Maquillaje & Novias", descripcion: "Maquillaje profesional con aerógrafo y paquetes para novias.", precio_cop: 250000, duracion_minutos: 90 }
        ],
        especialistas: [
          { nombre: "Emma Styles", rol: "Master Colorista & Balayage" },
          { nombre: "Alex Carter", rol: "Master Stylist & Cortes" },
          { nombre: "Jessica Moore", rol: "Especialista en Piel & Spa" }
        ]
      }
    };

    setFileNameJson('DATOS_NEGOCIO.json (Luxus Beauty Spa)');
    setFileNameHtml('luxus_beauty_spa_standalone.html');
    parseAndApplyBusinessData(luxusJson);
    setJsonInputText(JSON.stringify(luxusJson, null, 2));
  };

  // Carga del preset Kapa Spa (Apartadó)
  const handleLoadKapaPreset = async () => {
    const kapaJson = {
      negocio: {
        nombre: "Kapa Spa",
        rubro: "Spa, Centro de Masajes & Bienestar",
        categoria: "spa",
        eslogan: "Tu Espacio de Paz, Desconexión y Belleza Holística",
        calificacion: "5.0",
        resenas: "1",
        contacto: {
          telefono_principal: "(+57) 324 451 9640",
          telefono_raw: "+573244519640",
          whatsapp: {
            numero: "+573244519640",
            link: "https://wa.me/573244519640?text=Hola%20Kapa%20Spa%2C%20quisiera%20cotizar%20una%20cita."
          }
        },
        ubicacion: {
          direccion: "Cra. 92 #97-10",
          ciudad: "Apartadó",
          departamento_pais: "Antioquia, Colombia",
          google_maps_url: "https://www.google.com/maps/place/Kapa+Spa/@7.8837627,-76.6367651,16z"
        },
        horario_atencion: "Lunes a Sábado: 8:00 AM – 7:00 PM",
        servicios: [
          { titulo: "Limpieza Facial Profunda Ultrasónica", descripcion: "Higiene cutánea con espátula ultrasónica, vapor ozono y fototerapia.", precio_cop: 95000, duracion_minutos: 60 },
          { titulo: "Masaje Relajante con Piedras Calientes", descripcion: "Terapia geotermal con aceites aromáticos para aliviar contracturas.", precio_cop: 120000, duracion_minutos: 60 },
          { titulo: "Exfoliación Corporal & Chocolaterapia", descripcion: "Renovación epidérmica completa con envoltura de cacao nutritivo.", precio_cop: 140000, duracion_minutos: 75 },
          { titulo: "Circuito Hidroterapia & Jacuzzi", descripcion: "Sesión de relajación térmica con sauna y tina de hidromasaje.", precio_cop: 80000, duracion_minutos: 45 }
        ],
        especialistas: [
          { nombre: "Elena Gómez", rol: "Terapeuta Holística & Masajes" },
          { nombre: "Valeria Ríos", rol: "Cosmiatra & Especialista en Piel" },
          { nombre: "Camila Morales", rol: "Especialista en Hidroterapia & Spa" }
        ]
      }
    };

    setFileNameJson('DATOS_NEGOCIO.json (Kapa Spa - Apartadó)');
    setFileNameHtml('kapa_spa_standalone.html');
    parseAndApplyBusinessData(kapaJson);
    setJsonInputText(JSON.stringify(kapaJson, null, 2));
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      alert('Por favor ingresa el nombre del negocio o carga DATOS_NEGOCIO.json.');
      return;
    }

    setIsPublishing(true);

    try {
      // Si no hay rawHtml, generarlo automáticamente con el template de lujo
      let finalHtml = rawHtml.trim() || generateStandaloneHtmlFromBusinessData(businessData || { nombre: businessName });

      // Si se cargó una foto específica de Hero (heroImageUrl), reemplazarla en el HTML
      if (heroImageUrl) {
        finalHtml = finalHtml.replace(
          /(<div\b[^>]*class=["'][^"']*(?:hero-bg-cover|hero-main-img-box|model-image-frame|hero-image-box)[^"']*["'][^>]*>\s*<img\b[^>]*src=["'])([^"']*)(["'][^>]*>)/i,
          `$1${heroImageUrl}$3`
        );
      }

      const updatedBusinessData = {
        ...(businessData || {}),
        hero_image_url: heroImageUrl || businessData?.hero_image_url || undefined
      };

      const siteData: Partial<ProspectSite> = {
        business_name: businessName,
        phone_whatsapp: phoneWhatsapp || '+573001234567',
        address,
        city,
        country: 'Colombia',
        google_maps_url: googleMapsUrl,
        slug: slug || businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        raw_html: finalHtml,
        business_data: updatedBusinessData,
        status: 'prospecto'
      };

      const published = await api.createProspectSite(siteData);
      setCreatedSite(published);
      setProspectSites([published, ...prospectSites.filter(s => s.id !== published.id && s.slug !== published.slug)]);
      
      // Auto-scroll al resultado
      setTimeout(() => {
        const resEl = document.getElementById('published-result-box');
        if (resEl) resEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Error publishing prospect site:', err);
      alert('Ocurrió un error al publicar el sitio. Intenta nuevamente.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteSite = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este sitio gancho?')) {
      await api.deleteProspectSite(id);
      setProspectSites(prospectSites.filter(s => s.id !== id));
      if (createdSite?.id === id) setCreatedSite(null);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    if (confirm(`⚠️ ¿Estás seguro de eliminar el salón "${name}"?\n\nEsta acción borrará en cascada todas sus citas, colaboradoras, servicios, inventario y liberará su sitio web público.`)) {
      await api.deleteTenantCascade(id);
      setTenants(tenants.filter(t => t.id !== id));
      alert(`✅ El salón "${name}" y todos sus datos asociados fueron eliminados.`);
      loadData();
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ProspectSite['status']) => {
    await api.updateProspectSite(id, { status: newStatus });
    setProspectSites(prospectSites.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // Generar pitch de WhatsApp con Anclaje $680.000 COP -> Activación $50.000 COP + 1 Mes Plan Crecimiento
  const generateWhatsAppPitch = (siteObj: ProspectSite) => {
    const siteUrl = `${window.location.origin}/sitio/${siteObj.slug}`;
    const servicesText = siteObj.business_data?.servicios && siteObj.business_data.servicios.length > 0
      ? ` para sus servicios de ${siteObj.business_data.servicios.slice(0, 2).map((s: any) => s.titulo).join(' y ')}`
      : '';

    return `¡Hola ${siteObj.business_name}! 👋 Estuvimos viendo su salón en Google Maps y les preparamos un regalo especial para su negocio:

🌐 Su Página Web Profesional (100% Gratis de por vida):
👉 ${siteUrl}

(Pueden compartirla con sus clientas para mostrar fotos${servicesText}, dirección y horarios sin costo alguno).

✨ Oportunidad de Digitalización Local:
El desarrollo de esta web y la configuración del sistema de reservas tiene un valor comercial regular de ~~$680.000 COP~~.

🎁 Por un aporte único de activación de solo $50.000 COP (Nequi / Daviplata), reciben:
1. ✅ La Página Web Completa y Personalizada (Valor regular $680.000 COP).
2. ✅ Configuración total de su Catálogo de Servicios y Especialistas.
3. ✅ 1 Mes COMPLETO INCLUIDO en el Plan Crecimiento (Valor normal $120.000/mes):
   - 📅 Botón de reservas online para clientas (/reservar).
   - 👥 Colaboradoras / Especialistas ilimitadas.
   - 📱 App móvil para que cada estilista vea su agenda y comisiones.
   - 💳 Módulo de Caja POS con arqueo y liquidación de turnos.

A partir del 2do mes pueden continuar con su plan desde $50.000/mes o quedarse solo con su web gratis sin permanencias.

¿Qué les parece cómo quedó el diseño de su web? Si desean activarla hoy mismo me confirman su correo y les entrego sus accesos 📲`;
  };

  // Manejador para abrir el Modal de Activación
  const handleOpenActivationModal = (p: ProspectSite) => {
    setActivatingProspect(p);
    setActivationEmail('');
    const cleanName = p.business_name.replace(/[^a-zA-Z]/g, '').slice(0, 5) || 'Salon';
    setActivationTempPass(`${cleanName}2026*`);
    setActivationCurrency('COP');
    setActivationTrialDays(30);
    setActivationSuccessData(null);
    setCopiedCredentials(false);
  };

  // Ejecutar activación y migración de datos a Tenant
  const handleExecuteActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activatingProspect || !activationEmail) {
      alert('Por favor ingresa el correo electrónico del negocio.');
      return;
    }

    setIsActivatingTenant(true);
    try {
      const res = await api.activateProspectAsTenant({
        prospectId: activatingProspect.id,
        ownerEmail: activationEmail,
        tempPassword: activationTempPass,
        businessName: activatingProspect.business_name,
        phoneWhatsapp: activatingProspect.phone_whatsapp,
        currency: activationCurrency,
        trialDays: activationTrialDays
      });

      if (res.success) {
        setActivationSuccessData({
          tenant: res.tenant,
          tempPass: res.tempPassword,
          prospect: activatingProspect
        });
        await loadData();
      } else {
        alert('Error al activar el salón: ' + (res.error || 'Verifica los datos.'));
      }
    } catch (err) {
      console.error('Error activating tenant:', err);
      alert('Ocurrió un error inesperado al activar el tenant.');
    } finally {
      setIsActivatingTenant(false);
    }
  };

  // Mensaje de bienvenida con credenciales para enviar por WhatsApp
  const generateWelcomeCredentialsPitch = (data: { tenant: Tenant; tempPass: string; prospect: ProspectSite }) => {
    const loginUrl = `${window.location.origin}/login`;
    const siteUrl = `${window.location.origin}/sitio/${data.prospect.slug}`;
    const bookingUrl = `${window.location.origin}/reservar/${data.prospect.slug}`;

    return `¡Hola ${data.tenant.name}! 🎉 Ya activamos tu acceso de administración a tu plataforma BeautyFlow AI.

🌐 Tu Panel de Administración:
👉 ${loginUrl}

👤 Usuario / Correo: ${data.tenant.owner_email}
🔑 Contraseña Temporal: ${data.tempPass}

✨ Enlaces Oficiales de tu Salón:
🌐 Tu Página Web Oficial: ${siteUrl}
📅 Tu Agendador de Citas: ${bookingUrl}

Al ingresar a tu panel podrás personalizar tus tarifas, agregar a tu equipo de colaboradoras, cambiar las fotos de tu web y gestionar tu caja y agenda en tiempo real. ¡Muchos éxitos con tu negocio! 🚀`;
  };

  const handleCopy = (text: string, type: 'link' | 'pitch' | 'credentials') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else if (type === 'pitch') {
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2500);
    } else if (type === 'credentials') {
      setCopiedCredentials(true);
      setTimeout(() => setCopiedCredentials(false), 2500);
    }
  };

  // Filtro de prospectos
  const filteredProspects = prospectSites.filter(site => {
    const matchesSearch = site.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.phone_whatsapp.includes(searchTerm) ||
                          site.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans selection:bg-[#FF5A36] selection:text-white">
      
      {/* =====================================================================
          TOPBAR SUPERADMIN MASTER
          ===================================================================== */}
      <header className="sticky top-0 z-50 bg-[#0E121B]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-lg shadow-[#FF5A36]/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white">BeautyFlow AI</h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                👑 Superadmin Master
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Lead Engine & Central de Salones SaaS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGalleryModal(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-pink-500/30 hover:border-pink-500/60 bg-pink-500/10 text-pink-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">🖼️ Galería Stock CDN</span>
          </button>

          <Link
            to="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>Ver Dashboard Dueña</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/login"
            className="w-8 h-8 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
            title="Cerrar Sesión"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* =====================================================================
          TABS DE NAVEGACIÓN SUPERADMIN
          ===================================================================== */}
      <div className="border-b border-white/10 bg-[#0E121B]/50 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🚀 Creador de Sitios Gancho</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prospects')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prospects'
                ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>📊 Embudo de Prospectos ({prospectSites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tenants'
                ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏢 Salones Activos SaaS ({tenants.length})</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          CONTENIDO PRINCIPAL
          ===================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* ===================================================================
            TAB 1: CREADOR DE SITIOS GANCHO (LEAD MAGNET STUDIO)
            =================================================================== */}
        {activeTab === 'generator' && (
          <div className="space-y-6">

            {/* VIP HERO CARD: LOCAL HOMEPAGE STUDIO */}
            <div className="bg-gradient-to-r from-purple-950/50 via-[#1A1E2C] to-[#161220] border border-[#FF5A36]/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5 animate-fade-in relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 text-center md:text-left z-10">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36] bg-[#FF5A36]/15 px-2.5 py-0.5 rounded-full border border-[#FF5A36]/30">
                    ✨ ESTUDIO DE DISEÑO VISUAL ALL-IN-ONE
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Nuevo
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Local Homepage Studio (IA & Referencia Visual)</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Crea páginas web gancho no-genéricas usando una <strong>captura de referencia</strong> para extraer paleta y tipografía, combinada con los datos de <strong>Google Maps</strong> y fotos de la biblioteca con <strong>Live Preview Split-Screen</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHomepageStudioModal(true)}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-orange-500 to-pink-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[#FF5A36]/40 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 shrink-0 z-10"
              >
                <Sparkles className="w-5 h-5" />
                <span>🎨 Abrir Homepage Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Formulario de Ingesta & Datos (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#121624] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
                
                {/* Header Card */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 text-[#FF5A36] text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Ingesta Rápida por JSON / Formulario Manual</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleLoadKapaPreset}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>🌿 Cargar: Kapa Spa (Apartadó)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleLoadLuxusPreset}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-pink-300 border border-pink-500/30 text-[11px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        <span>✨ Cargar: Luxus Beauty Spa</span>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl font-black">Ingesta de Negocio & Sitio Web</h2>
                  <p className="text-xs text-slate-400">
                    Carga el archivo <code>DATOS_NEGOCIO.json</code> y el archivo <code>.html</code> generados por tu herramienta. El sistema inyectará automáticamente el botón de reservas y el agendador con los servicios reales.
                  </p>
                </div>

                {/* ===================================================================
                    ZONA DE CARGA RÁPIDA DE ARCHIVOS (CARPETA / JSON / HTML)
                    =================================================================== */}
                <div className="bg-[#0A0D14] border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#FF5A36]" />
                      Importación 1-Clic desde Carpeta del Generador
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowJsonPaste(!showJsonPaste)}
                      className="text-[11px] text-[#FF5A36] hover:underline font-semibold cursor-pointer"
                    >
                      {showJsonPaste ? 'Ocultar editor JSON' : 'Pegar JSON de texto'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Cargar DATOS_NEGOCIO.json */}
                    <label className="border border-dashed border-white/20 hover:border-[#FF5A36]/60 rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-[#FF5A36]/5 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-[#FF5A36]/20 flex items-center justify-center text-[#FF5A36] mb-1.5 transition-colors">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-[#FF5A36]">
                        {fileNameJson ? `✓ ${fileNameJson}` : '1. DATOS_NEGOCIO.json'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {fileNameJson ? 'Datos cargados' : 'Cargar archivo JSON'}
                      </span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleJsonFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Cargar HTML / Standalone */}
                    <label className="border border-dashed border-white/20 hover:border-emerald-500/60 rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-emerald-500/5 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1.5 transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400">
                        {fileNameHtml ? `✓ ${fileNameHtml}` : '2. Sitio Web (.html)'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {fileNameHtml ? 'HTML listo' : 'index.html'}
                      </span>
                      <input
                        type="file"
                        accept=".html,text/html"
                        onChange={handleHtmlFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Cargar Fotografía del Hero / Portada */}
                    <label className="border border-dashed border-white/20 hover:border-pink-500/60 rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-pink-500/5 group">
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-pink-500/20 flex items-center justify-center text-pink-400 mb-1.5 transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-pink-400">
                        {fileNameHeroImg ? `✓ ${fileNameHeroImg}` : '3. Foto Hero (Opcional)'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {fileNameHeroImg ? 'Foto optimizada lista' : 'modelo1.webp / JPG / PNG'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Editor / Pegado de JSON Opcional */}
                  {showJsonPaste && (
                    <div className="pt-2 border-t border-white/10 space-y-2 animate-fade-in">
                      <label className="block text-[11px] font-bold text-slate-300">
                        Pega aquí el contenido de <code>DATOS_NEGOCIO.json</code>:
                      </label>
                      <textarea
                        rows={6}
                        value={jsonInputText}
                        onChange={(e) => {
                          setJsonInputText(e.target.value);
                          try {
                            const parsed = JSON.parse(e.target.value);
                            parseAndApplyBusinessData(parsed);
                          } catch (err) {}
                        }}
                        placeholder='{ "negocio": { "nombre": "Luxus Beauty Spa", "contacto": { "whatsapp": { "numero": "+573009876543" } }, ... } }'
                        className="w-full bg-[#121624] border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-[#FF5A36]"
                      />
                    </div>
                  )}
                </div>

                {/* ===================================================================
                    PREVISUALIZACIÓN DE SERVICIOS Y ESPECIALISTAS DETECTADOS
                    =================================================================== */}
                {businessData && (
                  <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-pink-500/30 rounded-2xl p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase text-pink-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        Catálogo & Equipo Detectados ({businessData.servicios?.length || 0} Servicios, {businessData.especialistas?.length || 0} Especialistas)
                      </span>
                      {businessData.eslogan && (
                        <span className="text-[10px] text-slate-400 italic max-w-xs truncate">
                          "{businessData.eslogan}"
                        </span>
                      )}
                    </div>

                    {/* Chips de Servicios */}
                    {businessData.servicios && businessData.servicios.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Servicios:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {businessData.servicios.map((srv: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-200 border border-pink-500/30 text-[11px] font-medium flex items-center gap-1"
                              title={srv.descripcion}
                            >
                              <span>✨ {srv.titulo}</span>
                              {srv.precio_cop && (
                                <strong className="text-emerald-300 text-[10px]">
                                  ${srv.precio_cop.toLocaleString('es-CO')}
                                </strong>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Chips de Especialistas */}
                    {businessData.especialistas && businessData.especialistas.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Equipo & Especialistas:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {businessData.especialistas.map((esp: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[11px] font-medium flex items-center gap-1"
                            >
                              <span>👤 {esp.nombre}</span>
                              <span className="text-[10px] text-purple-300/80">({esp.rol})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ===================================================================
                    FORMULARIO EDITABLE DE DETALLES
                    =================================================================== */}
                <form onSubmit={handlePublishSite} className="space-y-4 text-xs">
                  
                  {/* Nombre y WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Nombre del Salón en Google Maps *</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => handleBusinessNameChange(e.target.value)}
                        placeholder="Ej. Studio Glamour Spa Poblado"
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Teléfono / WhatsApp de la Dueña *</label>
                      <input
                        type="text"
                        value={phoneWhatsapp}
                        onChange={(e) => setPhoneWhatsapp(e.target.value)}
                        placeholder="Ej. +57 300 123 4567"
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Dirección & Ciudad */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 mb-1 font-bold">Dirección del Salón (Maps)</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej. Calle 10 # 43E-22, El Poblado"
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Ciudad</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Medellín"
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs"
                      />
                    </div>
                  </div>

                  {/* Link Google Maps & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">Enlace Google Maps (Opcional)</label>
                      <input
                        type="url"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-bold">URL Slug Pública</label>
                      <div className="flex items-center bg-[#0A0D14] border border-white/10 rounded-xl px-3 text-slate-400 font-mono text-xs">
                        <span>/sitio/</span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="mi-salon"
                          className="w-full bg-transparent p-3 text-white focus:outline-none text-xs font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-bold">Categoría del Negocio</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF5A36] text-xs font-semibold"
                    >
                      <option value="salon">💇‍♀️ Salón de Belleza / Peluquería</option>
                      <option value="barberia">💈 Barbería Tradicional / Moderna</option>
                      <option value="spa">🧖‍♀️ Spa & Bienestar</option>
                      <option value="estetica">✨ Centro de Estética Facial / Corporal</option>
                      <option value="nails">💅 Nail Bar & Pestañas</option>
                    </select>
                  </div>

                  {/* Código HTML Puro */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">Código HTML del Sitio Web *</label>
                      <span className="text-[10px] text-[#FF5A36] font-semibold">HTML + CSS embebido</span>
                    </div>
                    <textarea
                      rows={8}
                      value={rawHtml}
                      onChange={(e) => setRawHtml(e.target.value)}
                      placeholder="<!DOCTYPE html><html><head>...</head><body><h1>Mi Salón</h1>...</body></html>"
                      className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-[#FF5A36] leading-relaxed"
                      required
                    />
                  </div>

                  {/* Botón de Publicación */}
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-orange-500 to-pink-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[#FF5A36]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>{isPublishing ? 'Publicando y optimizando sitio...' : '🚀 Publicar Sitio Gancho & Inyectar Agendador'}</span>
                  </button>

                </form>
              </div>
            </div>

            {/* Right: Resultado & Pitch de WhatsApp (5 Cols) */}
            <div id="published-result-box" className="lg:col-span-5 space-y-5">
              {createdSite ? (
                <div className="bg-[#121624] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">¡SITIO WEB PUBLICADO!</span>
                      <h3 className="text-base font-black">{createdSite.business_name}</h3>
                    </div>
                  </div>

                  {/* Link Box */}
                  <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Enlace Público de Cortesía:</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-white truncate">
                        {window.location.origin}/sitio/{createdSite.slug}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(`${window.location.origin}/sitio/${createdSite.slug}`, 'link')}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                          title="Copiar enlace"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`/sitio/${createdSite.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-[#FF5A36] text-white transition-colors"
                          title="Abrir sitio web"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                    {copiedLink && (
                      <span className="text-[10px] text-emerald-400 font-bold block animate-fade-in">✓ Enlace copiado al portapapeles</span>
                    )}
                  </div>

                  {/* Pitch WhatsApp Generator */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Mensaje de Prospección WhatsApp
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generateWhatsAppPitch(createdSite), 'pitch')}
                        className="text-[10px] text-emerald-300 hover:text-white font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar Texto</span>
                      </button>
                    </div>

                    <div className="bg-[#0A0D14]/80 p-3 rounded-xl border border-white/5 text-[11px] text-slate-300 font-sans whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                      {generateWhatsAppPitch(createdSite)}
                    </div>

                    {copiedPitch && (
                      <span className="text-[10px] text-emerald-400 font-bold block animate-fade-in">✓ Texto de WhatsApp copiado</span>
                    )}

                    {/* Botón 1-Click WhatsApp Directo */}
                    <a
                      href={`https://wa.me/${createdSite.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppPitch(createdSite))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Enviar WhatsApp a la Dueña ({createdSite.phone_whatsapp})</span>
                    </a>
                  </div>

                  {/* Botón de Activación si la dueña ya respondió con su correo */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" />
                        ¿La dueña envió su correo?
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Crea su cuenta SaaS con contraseña temporal y migra sus servicios y equipo automáticamente.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleOpenActivationModal(createdSite)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>🔑 Activar Tenant & Generar Credenciales</span>
                    </button>
                  </div>

                  {/* Botón para crear otro */}
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedSite(null);
                      setBusinessName('');
                      setPhoneWhatsapp('');
                      setAddress('');
                      setGoogleMapsUrl('');
                      setSlug('');
                      setRawHtml('');
                    }}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    + Crear otro sitio gancho
                  </button>

                </div>
              ) : (
                <div className="bg-[#121624] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Cómo funciona el Gancho</span>
                  </div>
                  <h3 className="text-base font-black">Tu Fábrica de Clientes en 3 Pasos</h3>
                  
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 rounded-2xl bg-[#0A0D14] border border-white/5 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] flex items-center justify-center font-bold text-xs shrink-0">1</div>
                      <div>
                        <strong className="block text-white font-bold mb-0.5">Pegas el HTML de Maps</strong>
                        <span className="text-slate-400 text-[11px]">Tu sistema te entrega el diseño y lo guardas en tu dominio en 1 segundo.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0A0D14] border border-white/5 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                      <div>
                        <strong className="block text-white font-bold mb-0.5">Inyección Automática</strong>
                        <span className="text-slate-400 text-[11px]">Añadimos el botón de agendamiento online y el banner para que la dueña active sus 14 días gratis.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0A0D14] border border-white/5 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                      <div>
                        <strong className="block text-white font-bold mb-0.5">Contacto por WhatsApp</strong>
                        <span className="text-slate-400 text-[11px]">Le regalas la web por WhatsApp. Cuando la dueña ve su marca online, reclama su cuenta en tu SaaS.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: EMBUDO DE PROSPECTOS & ESTADOS
            =================================================================== */}
        {activeTab === 'prospects' && (
          <div className="space-y-4">
            
            {/* Barra de Filtros & Búsqueda */}
            <div className="bg-[#121624] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, teléfono, ciudad..."
                  className="w-full bg-[#0A0D14] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {['todos', 'prospecto', 'contactado', 'reclamado', 'cliente_pago'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : st === 'cliente_pago' ? 'Cliente Pago' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabla de Prospectos */}
            <div className="bg-[#121624] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {filteredProspects.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <Globe className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-base font-bold text-white">No hay sitios prospecto registrados</h3>
                  <p className="text-xs">Usa el Creador de Sitios Gancho para publicar el primer salón de Google Maps.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A0D14] border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-4">Salón / Negocio</th>
                        <th className="p-4">WhatsApp & Ubicación</th>
                        <th className="p-4">Visitas Web</th>
                        <th className="p-4">Estado del Embudo</th>
                        <th className="p-4 text-right">Acciones Rápidas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProspects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          
                          {/* Salón */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center font-black text-white text-xs shrink-0">
                                {p.business_name.charAt(0)}
                              </div>
                              <div>
                                <strong className="block text-white text-xs">{p.business_name}</strong>
                                <span className="text-[11px] font-mono text-slate-400">/sitio/{p.slug}</span>
                              </div>
                            </div>
                          </td>

                          {/* WhatsApp & Ubicación */}
                          <td className="p-4">
                            <div className="space-y-0.5">
                              <span className="text-emerald-400 font-bold block flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {p.phone_whatsapp}
                              </span>
                              <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#FF5A36]" /> {p.city || 'Medellín'} {p.address ? `• ${p.address}` : ''}
                              </span>
                            </div>
                          </td>

                          {/* Visitas */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono font-bold">
                              👁️ {p.views_count || 0} visitas
                            </span>
                          </td>

                          {/* Estado */}
                          <td className="p-4">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdateStatus(p.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                p.status === 'cliente_pago' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                                p.status === 'reclamado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                p.status === 'contactado' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                                'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              <option value="prospecto" className="bg-[#121624] text-white">Prospecto</option>
                              <option value="contactado" className="bg-[#121624] text-white">Contactado WA</option>
                              <option value="reclamado" className="bg-[#121624] text-white">Reclamó 14 Días</option>
                              <option value="cliente_pago" className="bg-[#121624] text-white">Cliente de Pago</option>
                            </select>
                          </td>

                          {/* Acciones */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Botón Activar Acceso Dueña */}
                              <button
                                type="button"
                                onClick={() => handleOpenActivationModal(p)}
                                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm ${
                                  p.status === 'reclamado' || p.status === 'cliente_pago'
                                    ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40'
                                }`}
                                title="Activar cuenta SaaS para la dueña con su correo y contraseña temporal"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-400" />
                                <span>{p.status === 'reclamado' || p.status === 'cliente_pago' ? 'Ver Acceso' : 'Activar Acceso'}</span>
                              </button>

                              <a
                                href={`/sitio/${p.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                                title="Ver página web"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              <a
                                href={`https://wa.me/${p.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppPitch(p))}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-black transition-colors"
                                title="Enviar mensaje de WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              </a>

                              <button
                                type="button"
                                onClick={() => handleDeleteSite(p.id)}
                                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                title="Eliminar sitio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ===================================================================
            TAB 3: GESTIÓN GLOBAL DE SALONES (MULTI-TENANT SAAS)
            =================================================================== */}
        {activeTab === 'tenants' && (
          <div className="space-y-6">
            
            {/* KPI Cards Globales */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#121624] border border-white/10 rounded-2xl p-5 space-y-1">
                <span className="text-slate-400 text-xs font-semibold">Total Salones en la Plataforma</span>
                <div className="text-3xl font-black text-white">{tenants.length}</div>
                <span className="text-[10px] text-emerald-400 font-bold">● Negocios Multi-Tenant</span>
              </div>

              <div className="bg-[#121624] border border-white/10 rounded-2xl p-5 space-y-1">
                <span className="text-slate-400 text-xs font-semibold">Salones en Prueba (14 Días)</span>
                <div className="text-3xl font-black text-amber-400">
                  {tenants.filter(t => t.plan !== 'vip_360').length}
                </div>
                <span className="text-[10px] text-amber-300 font-bold">⏳ Activación con Bot de WhatsApp</span>
              </div>

              <div className="bg-[#121624] border border-white/10 rounded-2xl p-5 space-y-1">
                <span className="text-slate-400 text-xs font-semibold">Facturación Estimada MRR</span>
                <div className="text-3xl font-black text-emerald-400">
                  $ {(tenants.length * 120000).toLocaleString('es-CO')} COP
                </div>
                <span className="text-[10px] text-slate-400">Ingreso recurrente mensual</span>
              </div>

              <div className="bg-[#121624] border border-white/10 rounded-2xl p-5 space-y-1">
                <span className="text-slate-400 text-xs font-semibold">Sitios Gancho Creados</span>
                <div className="text-3xl font-black text-[#FF5A36]">{prospectSites.length}</div>
                <span className="text-[10px] text-slate-400">Embudo de prospección activo</span>
              </div>
            </div>

            {/* Lista de Salones Registrados */}
            <div className="bg-[#121624] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-black">Salones & Negocios Registrados</h3>
                  <p className="text-xs text-slate-400">Administración de tenants activos y control de suscripciones.</p>
                </div>
                <button
                  type="button"
                  onClick={loadData}
                  className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {tenants.map((t) => {
                  const currentPlan = (t.plan_tier || 'crecimiento') as PlanTier;
                  const daysLeft = t.trial_ends_at 
                    ? Math.max(0, Math.ceil((new Date(t.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    : 30;

                  return (
                    <div key={t.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-[#FF5A36]/20">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-white">{t.name}</strong>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                              currentPlan === 'crecimiento' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              currentPlan === 'pro_ia' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                              currentPlan === 'escala' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                              currentPlan === 'agencia' ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' :
                              'bg-slate-500/20 text-slate-300 border-slate-500/40'
                            }`}>
                              {currentPlan === 'free' ? '🌐 Gratis ($0)' :
                               currentPlan === 'inicio' ? '🌱 Inicio ($50k)' :
                               currentPlan === 'crecimiento' ? '📈 Crecimiento ($120k)' :
                               currentPlan === 'pro_ia' ? '🤖 Pro Flow IA ($240k)' :
                               currentPlan === 'escala' ? '🎯 Escala ($720k)' : '👑 Agencia VIP ($1.44M)'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                              ⏳ {daysLeft} días restantes
                            </span>
                          </div>
                          <span className="text-slate-400 text-[11px] block mt-0.5">
                            {t.phone} • {t.address || t.city || 'Medellín, Colombia'} • <span className="text-slate-300">{t.owner_email || 'dueña@salon.com'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-center">
                        {/* Selector Rápido de Plan */}
                        <div className="flex items-center gap-1.5 bg-[#0A0D14] border border-white/15 rounded-xl px-2.5 py-1">
                          <span className="text-[10px] text-slate-400 font-bold">Plan:</span>
                          <select
                            value={currentPlan}
                            onChange={async (e) => {
                              const newPlan = e.target.value as PlanTier;
                              await api.updateTenantPlan(t.id, { plan_tier: newPlan });
                              await loadData();
                            }}
                            className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
                          >
                            <option value="free" className="bg-[#121624]">🌐 Gratis ($0)</option>
                            <option value="inicio" className="bg-[#121624]">🌱 Inicio ($50.000 COP)</option>
                            <option value="crecimiento" className="bg-[#121624]">📈 Crecimiento ($120.000 COP)</option>
                            <option value="pro_ia" className="bg-[#121624]">🤖 Pro Flow IA ($240.000 COP)</option>
                            <option value="escala" className="bg-[#121624]">🎯 Escala ($720.000 COP)</option>
                            <option value="agencia" className="bg-[#121624]">👑 Agencia VIP ($1.440.000 COP)</option>
                          </select>
                        </div>

                        {/* Extender 30 Días */}
                        <button
                          type="button"
                          onClick={async () => {
                            await api.updateTenantPlan(t.id, { plan_tier: currentPlan, trial_days_to_add: 30, subscription_status: 'active' });
                            alert(`✅ Se renovaron 30 días de suscripción para ${t.name}.`);
                            await loadData();
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                          title="Extender 30 días adicionales de suscripción"
                        >
                          <span>+30 Días</span>
                        </button>

                        <Link
                          to={`/reservar/${t.slug}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-slate-300 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>Agendador</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          className="px-3 py-1.5 rounded-xl bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-[#FF5A36]/20 transition-all"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Dashboard</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteTenant(t.id, t.name)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold transition-all flex items-center justify-center cursor-pointer"
                          title="Borrar salón y todos sus datos en 1 clic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =====================================================================
          MODAL: GALERÍA DE IMÁGENES DE MUESTRA (STOCK CDN)
          ===================================================================== */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121624] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#151c2e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-[#FF5A36] flex items-center justify-center text-white">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Biblioteca de Imágenes de Muestra (CDN WebP)</h3>
                  <p className="text-xs text-slate-400">Imágenes ultra-livianas de alta resolución para reemplazar Base64 y optimizar sitios web</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categorías Filter */}
            <div className="px-5 py-3 border-b border-white/10 bg-[#0c101a] flex gap-2 overflow-x-auto">
              {[
                { id: 'todos', label: 'Todas' },
                { id: 'hero_salon', label: '👑 Hero Salón' },
                { id: 'hero_spa', label: '🧖‍♀️ Hero Spa' },
                { id: 'hero_barber', label: '💈 Hero Barber' },
                { id: 'hero_nails', label: '💅 Hero Nails' },
                { id: 'color', label: '🎨 Color & Balayage' },
                { id: 'cortes', label: '✂️ Cortes & Peinados' },
                { id: 'keratina', label: '✨ Alisados & Keratina' },
                { id: 'nails', label: '💅 Nail Art' },
                { id: 'spa_facial', label: '🧖‍♀️ Spa & Faciales' },
                { id: 'barberia', label: '💈 Barbería' },
                { id: 'maquillaje', label: '💄 Maquillaje' },
                { id: 'especialistas', label: '👥 Especialistas' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedGalleryCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGalleryCategory === cat.id
                      ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of Images */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              {BEAUTY_STOCK_LIBRARY
                .filter(img => selectedGalleryCategory === 'todos' || img.category === selectedGalleryCategory)
                .map(img => (
                  <div key={img.id} className="bg-[#171f30] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#FF5A36]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-36 overflow-hidden">
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md uppercase">
                          {img.category}
                        </span>
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{img.title}</h4>
                        <div className="flex gap-1 flex-wrap">
                          {img.tags.map(t => (
                            <span key={t} className="text-[9px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(img.url);
                          setCopiedImageUrl(img.id);
                          setTimeout(() => setCopiedImageUrl(null), 2000);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          copiedImageUrl === img.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 hover:bg-[#FF5A36] text-slate-200 hover:text-white'
                        }`}
                      >
                        {copiedImageUrl === img.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>✓ URL Copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Enlace CDN</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0E121B] flex items-center justify-between text-xs text-slate-400">
              <span>💡 Todas las imágenes cargan en formato WebP comprimido a 800-1200px.</span>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: LOCAL HOMEPAGE STUDIO (DISEÑO CON IA & REFERENCIA)
          ===================================================================== */}
      <HomepageStudioModal
        isOpen={showHomepageStudioModal}
        onClose={() => setShowHomepageStudioModal(false)}
        onSitePublished={(site) => {
          setProspectSites([site, ...prospectSites.filter(s => s.id !== site.id && s.slug !== site.slug)]);
          setCreatedSite(site);
        }}
      />

      {/* =====================================================================
          MODAL: ACTIVACIÓN DE SALÓN / TENANT (SOLICITUD DE EMAIL & CREDENCIALES)
          ===================================================================== */}
      {activatingProspect && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#111624] border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8 text-slate-100">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {activationSuccessData ? '🎉 ¡Salón Activado con Éxito!' : '🔑 Activar Salón & Crear Acceso Dueña'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activatingProspect.business_name} • {activatingProspect.phone_whatsapp}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivatingProspect(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vista 1: Formulario de Activación */}
            {!activationSuccessData ? (
              <form onSubmit={handleExecuteActivation} className="space-y-4">
                
                {/* Info Box */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Ingresa el correo electrónico que te envió la dueña por WhatsApp. Se creará su cuenta en <strong>Supabase Auth</strong> y se migrarán automáticamente sus servicios y colaboradoras a su base de datos.
                  </p>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>Correo Electrónico de la Dueña *</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={activationEmail}
                    onChange={(e) => setActivationEmail(e.target.value)}
                    placeholder="ej. dueña@kapaspa.com"
                    className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-xs font-medium"
                  />
                </div>

                {/* Password Temporal & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        Contraseña Temporal *
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const rand = Math.floor(1000 + Math.random() * 9000);
                          const clean = activatingProspect.business_name.replace(/[^a-zA-Z]/g, '').slice(0, 4) || 'Spa';
                          setActivationTempPass(`${clean}${rand}*`);
                        }}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Generar
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={activationTempPass}
                      onChange={(e) => setActivationTempPass(e.target.value)}
                      placeholder="Kapa2026*"
                      className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Moneda del Negocio</label>
                    <select
                      value={activationCurrency}
                      onChange={(e) => setActivationCurrency(e.target.value as any)}
                      className="w-full bg-[#0A0D14] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 text-xs font-bold"
                    >
                      <option value="COP">COP ($ Pesos Colombianos)</option>
                      <option value="USD">USD ($ Dólares)</option>
                      <option value="MXN">MXN ($ Pesos Mexicanos)</option>
                      <option value="EUR">EUR (€ Euros)</option>
                    </select>
                  </div>
                </div>

                {/* Resumen de Activación Limpia */}
                <div className="p-3.5 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estado de la nueva cuenta del negocio:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-emerald-400 font-bold block">
                        ✨ Cuenta Virgen
                      </span>
                      <span className="text-[10px] text-slate-400">0 citas ni facturación ficticia</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-amber-400 font-bold block">
                        🎯 Onboarding Guiado
                      </span>
                      <span className="text-[10px] text-slate-400">Creará servicios y colaboradoras</span>
                    </div>
                  </div>
                </div>

                {/* Botón Submit */}
                <button
                  type="submit"
                  disabled={isActivatingTenant || !activationEmail}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isActivatingTenant ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  <span>{isActivatingTenant ? 'Creando tenant y acceso administrativo...' : '🚀 Activar Salón & Entregar Credenciales'}</span>
                </button>

              </form>
            ) : (
              /* Vista 2: Credenciales Creadas & Enlace WhatsApp */
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                
                {/* Credentials Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/40 space-y-3">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                    DATOS DE ACCESO GENERADOS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Usuario / Email:</span>
                      <strong className="text-white select-all">{activationSuccessData.tenant.owner_email}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0A0D14] border border-white/10">
                      <span className="text-[10px] text-slate-400 block">Contraseña Temporal:</span>
                      <strong className="text-emerald-400 select-all">{activationSuccessData.tempPass}</strong>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Pitch Ready to Send */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Mensaje de WhatsApp para la Dueña:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(generateWelcomeCredentialsPitch(activationSuccessData), 'credentials')}
                      className="text-[10px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedCredentials ? '✓ Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="bg-[#0A0D14] p-3 rounded-xl border border-white/10 text-[11px] text-slate-300 font-sans whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                    {generateWelcomeCredentialsPitch(activationSuccessData)}
                  </div>
                </div>

                {/* 1-Click WhatsApp Button */}
                <a
                  href={`https://wa.me/${activationSuccessData.tenant.phone.replace(/\D/g, '')}?text=${encodeURIComponent(generateWelcomeCredentialsPitch(activationSuccessData))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>📲 Enviar Credenciales por WhatsApp a la Dueña</span>
                </a>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setActivatingProspect(null)}
                  className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cerrar Ventana
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
