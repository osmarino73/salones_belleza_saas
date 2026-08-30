import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { injectProspectLinks, extractWebsiteDataFromHtml } from '../lib/prospectHtmlInjector';
import {
  Scissors,
  Sparkles,
  Crown,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Clock,
  Plus,
  Search,
  Bell,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Layers,
  ShoppingBag,
  Send,
  Phone,
  Settings,
  ChevronRight,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowRight,
  Check,
  Star,
  Activity,
  ArrowDownLeft,
  ChevronDown,
  Filter,
  Bot,
  Save,
  Loader2,
  Trash2,
  HelpCircle,
  MapPin,
  Shield,
  Zap,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Building2,
  Store,
  User,
  Package,
  UserPlus,
  Tag,
  PlusCircle,
  Edit3,
  Instagram,
  MessageSquare,
  Smartphone,
  Heart,
  Ban,
  CalendarOff,
  Eye,
  Mail,
  Award,
  Percent,
  Briefcase,
  CalendarCheck,
  ExternalLink,
  Wallet,
  Palette,
  Upload,
  QrCode,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import { api, initialStylists, initialServices, initialProducts, getActiveTenantId } from '../lib/supabase';
import { Appointment, Client, Stylist, Service, ServiceCategory, ColorFormula, TenantAISettings, Product, BlockedSlot, Tenant } from '../types';
import { ZernioOnboardingModal } from '../components/ZernioOnboardingModal';
import { WelcomeModal } from '../components/WelcomeModal';
import { WhatsAppTemplatesCard } from '../components/WhatsAppTemplatesCard';
import { TemplatesManagerPage } from '../components/TemplatesManagerPage';
import { MessagesBoardPage } from '../components/MessagesBoardPage';
import { PosCashRegisterPage } from '../components/PosCashRegisterPage';
import { LoyaltyReactivationPage } from '../components/LoyaltyReactivationPage';
import { TimePickerSelect } from '../components/TimePickerSelect';
import { ImageUploadField } from '../components/ImageUploadField';
import { ServiceImagePicker } from '../components/ServiceImagePicker';
import { getSuggestedImageForService } from '../lib/beautyImageLibrary';
import { PlanUpgradeModal } from '../components/PlanUpgradeModal';
import { getPlanConfig, canAddMoreStylists, SubscriptionPlan } from '../lib/planPermissions';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'crm' | 'pos' | 'whatsapp' | 'ai_settings' | 'catalog_team' | 'templates' | 'loyalty'>('overview');
  const [posInitialClient, setPosInitialClient] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTenantObj, setActiveTenantObj] = useState<Tenant | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [aiSettings, setAiSettings] = useState<TenantAISettings | null>(null);
  const [isZernioOnboardingOpen, setIsZernioOnboardingOpen] = useState(false);
  const [isSavingAiSettings, setIsSavingAiSettings] = useState(false);
  const [aiSettingsSavedSuccess, setAiSettingsSavedSuccess] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  // Catalog & Team Sub-tab State
  const [catalogSubTab, setCatalogSubTab] = useState<'stylists' | 'services' | 'categories' | 'products'>('stylists');

  // Modal de Upgrade de Plan (Feature Gating)
  const [upgradeModalState, setUpgradeModalState] = useState<{
    isOpen: boolean;
    requiredPlan: SubscriptionPlan;
    featureName: string;
    featureDescription?: string;
  }>({
    isOpen: false,
    requiredPlan: 'crecimiento',
    featureName: ''
  });

  const [isStylistModalOpen, setIsStylistModalOpen] = useState(false);
  const [showStylistGuide, setShowStylistGuide] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);
  const [stylistForm, setStylistForm] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    specialty: string;
    photo_url: string;
    role: 'admin' | 'colaborador';
    is_owner: boolean;
    attends_clients: boolean;
    show_on_web: boolean;
    commission_service_pct: number;
    commission_retail_pct: number;
    service_categories: string[];
    service_ids: string[];
  }>({
    name: '',
    email: '',
    phone: '',
    password: 'BeautyFlow2026*',
    specialty: 'Directora & Gestión',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'colaborador',
    is_owner: false,
    attends_clients: false,
    show_on_web: true,
    commission_service_pct: 45,
    commission_retail_pct: 10,
    service_categories: ['color', 'corte'],
    service_ids: []
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<{
    name: string;
    slug: string;
    icon: string;
    description: string;
  }>({
    name: '',
    slug: '',
    icon: '✨',
    description: ''
  });

  // Creación rápida de categoría al vuelo dentro del modal de servicio
  const [isQuickCategoryOpen, setIsQuickCategoryOpen] = useState(false);
  const [quickCategoryName, setQuickCategoryName] = useState('');
  const [quickCategoryIcon, setQuickCategoryIcon] = useState('✨');

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showServiceGuide, setShowServiceGuide] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<{
    name: string;
    category: string;
    duration_minutes: number;
    price_usd: number;
    image_url: string;
    requires_patch_test: boolean;
    description: string;
    is_featured: boolean;
  }>({
    name: '',
    category: 'color',
    duration_minutes: 60,
    price_usd: 40,
    image_url: '',
    requires_patch_test: false,
    description: '',
    is_featured: true
  });

  // Personalización del Sitio Web Público
  const [isWebsiteCustomizerOpen, setIsWebsiteCustomizerOpen] = useState(false);
  const [showWebsiteGuide, setShowWebsiteGuide] = useState(false);
  const [isSavingWebsite, setIsSavingWebsite] = useState(false);
  const [websiteForm, setWebsiteForm] = useState<{
    hero_image_url: string;
    primary_color: string;
    show_team_section: boolean;
    show_first_visit_discount: boolean;
    first_visit_discount_pct: number;
    first_visit_discount_title: string;
    logo_icon: string;
    hero_eyebrow: string;
    slogan: string;
    title_accent: string;
    navbar_tagline: string;
    business_hours_text: string;
    subtitle: string;
    about_image_url: string;
    about_badge_text: string;
    about_eyebrow: string;
    about_title: string;
    about_title_accent: string;
    about_description: string;
    about_years_exp: string;
    about_clients_count: string;
    about_stat3_text: string;
    about_rating_text: string;
    show_about_section: boolean;
  }>({
    hero_image_url: '',
    primary_color: '#d92672',
    show_team_section: true,
    show_first_visit_discount: false,
    first_visit_discount_pct: 15,
    first_visit_discount_title: '',
    logo_icon: '🪄',
    hero_eyebrow: '',
    slogan: '',
    title_accent: '',
    navbar_tagline: '',
    business_hours_text: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
    subtitle: '',
    about_image_url: '',
    about_badge_text: '',
    about_eyebrow: 'Sobre Nosotros',
    about_title: '',
    about_title_accent: '',
    about_description: '',
    about_years_exp: '+8',
    about_clients_count: '+3.5K',
    about_stat3_text: '100%',
    about_rating_text: '5.0',
    show_about_section: true
  });

  const [prospectRawHtml, setProspectRawHtml] = useState<string>('');

  // Sincronizar websiteForm y prospectRawHtml cuando activeTenantObj esté listo o al abrir el modal
  useEffect(() => {
    if (activeTenantObj) {
      // 1. Cargar el HTML real del sitio del prospecto para el previsualizador y extracción de respaldo
      api.getProspectSites().then((pSites) => {
        const matched = pSites.find(p => p.slug === activeTenantObj.slug || p.claimed_tenant_id === activeTenantObj.id);
        const rawHtml = matched?.raw_html || '';
        if (rawHtml) {
          setProspectRawHtml(rawHtml);
        }

        // Extraer los datos reales directamente del HTML base de la plantilla
        const extracted = rawHtml ? extractWebsiteDataFromHtml(rawHtml) : {};
        const bData = (matched as any)?.business_data || {};

        // Limpiar placeholders antiguos si provienen de datos de muestra
        const cleanEyebrow = (activeTenantObj.hero_eyebrow && activeTenantObj.hero_eyebrow !== 'Bienvenidas a ❤️')
          ? activeTenantObj.hero_eyebrow 
          : (bData.hero_eyebrow && bData.hero_eyebrow !== 'Bienvenidas a ❤️' ? bData.hero_eyebrow : (extracted.heroEyebrow || ''));

        const cleanTitleAccent = (activeTenantObj.title_accent && activeTenantObj.title_accent !== 'Centro de Estética')
          ? activeTenantObj.title_accent
          : (bData.title_accent && bData.title_accent !== 'Centro de Estética' ? bData.title_accent : (extracted.titleAccent || ''));

        const cleanNavbarTagline = activeTenantObj.navbar_tagline || bData.navbar_tagline || extracted.navbarTagline || '';

        const cleanBusinessHours = activeTenantObj.business_hours?.summary || bData.business_hours?.summary || bData.horario_atencion || extracted.businessHours || 'Lunes a Sábado: 8:00 AM - 7:00 PM';

        const cleanSlogan = (activeTenantObj.slogan && activeTenantObj.slogan !== 'Sandra Color´s' && activeTenantObj.slogan !== activeTenantObj.name)
          ? activeTenantObj.slogan
          : (extracted.slogan || bData.slogan || activeTenantObj.name || '');

        const cleanSubtitle = (activeTenantObj.subtitle && !activeTenantObj.subtitle.includes('Sandra Color´s'))
          ? activeTenantObj.subtitle
          : (extracted.subtitle || bData.subtitle || '');

        const cleanAboutBadgeText = (activeTenantObj.about_badge_text && activeTenantObj.about_badge_text !== 'VIP EXPERIENCIA SALÓN')
          ? activeTenantObj.about_badge_text
          : (bData.about_badge_text && bData.about_badge_text !== 'VIP EXPERIENCIA SALÓN' ? bData.about_badge_text : (extracted.aboutBadgeText || ''));

        const cleanAboutTitle = (activeTenantObj.about_title && activeTenantObj.about_title !== 'CUIDADO. DEFINICIÓN.')
          ? activeTenantObj.about_title
          : (extracted.aboutTitle || bData.about_title || activeTenantObj.about_title || '');

        const cleanAboutTitleAccent = (activeTenantObj.about_title_accent && activeTenantObj.about_title_accent !== 'PASIÓN POR TU BELLEZA.')
          ? activeTenantObj.about_title_accent
          : (bData.about_title_accent && bData.about_title_accent !== 'PASIÓN POR TU BELLEZA.' ? bData.about_title_accent : (extracted.aboutTitleAccent || ''));

        const cleanAboutDescription = (activeTenantObj.about_description && !activeTenantObj.about_description.includes('Transformamos el cuidado') && !activeTenantObj.about_description.startsWith('Especialistas certificadas con amplia'))
          ? activeTenantObj.about_description
          : (extracted.aboutDescription || bData.about_description || activeTenantObj.about_description || '');

        setWebsiteForm({
          hero_image_url: activeTenantObj.hero_image_url || bData.hero_image_url || extracted.heroImageUrl || '',
          primary_color: activeTenantObj.primary_color || bData.primary_color || '#d92672',
          show_team_section: activeTenantObj.show_team_section !== undefined ? activeTenantObj.show_team_section : (bData.show_team_section !== undefined ? bData.show_team_section : true),
          show_first_visit_discount: activeTenantObj.show_first_visit_discount !== undefined ? activeTenantObj.show_first_visit_discount : (bData.show_first_visit_discount !== undefined ? bData.show_first_visit_discount : false),
          first_visit_discount_pct: activeTenantObj.first_visit_discount_pct || bData.first_visit_discount_pct || 15,
          first_visit_discount_title: activeTenantObj.first_visit_discount_title || bData.first_visit_discount_title || '',
          logo_icon: activeTenantObj.logo_icon || bData.logo_icon || extracted.logoIcon || '🪄',
          hero_eyebrow: cleanEyebrow,
          slogan: cleanSlogan,
          title_accent: cleanTitleAccent,
          navbar_tagline: cleanNavbarTagline,
          business_hours_text: cleanBusinessHours,
          subtitle: cleanSubtitle,
          about_image_url: activeTenantObj.about_image_url || bData.about_image_url || extracted.aboutImageUrl || '',
          about_badge_text: cleanAboutBadgeText,
          about_eyebrow: activeTenantObj.about_eyebrow || bData.about_eyebrow || extracted.aboutEyebrow || 'Sobre Nosotros',
          about_title: cleanAboutTitle,
          about_title_accent: cleanAboutTitleAccent,
          about_description: cleanAboutDescription,
          about_years_exp: activeTenantObj.about_years_exp || bData.about_years_exp || extracted.aboutYearsExp || '+8',
          about_clients_count: activeTenantObj.about_clients_count || bData.about_clients_count || extracted.aboutClientsCount || '+3.5K',
          about_stat3_text: activeTenantObj.about_stat3_text || bData.about_stat3_text || extracted.aboutStat3Text || '100%',
          about_rating_text: activeTenantObj.about_rating_text || bData.about_rating_text || extracted.aboutRatingText || '5.0',
          show_about_section: activeTenantObj.show_about_section !== undefined ? activeTenantObj.show_about_section : (bData.show_about_section !== undefined ? bData.show_about_section : true)
        });
      }).catch(() => {});
    }
  }, [activeTenantObj]);

  // Generar HTML real inyectado en vivo para el iframe de previsualización
  const previewRenderedHtml = useMemo(() => {
    if (!prospectRawHtml) return '';
    return injectProspectLinks(prospectRawHtml, {
      slug: activeTenantObj?.slug || 'sandra-color-s',
      businessName: activeTenantObj?.name || 'Sandra Color´s',
      phoneWhatsapp: activeTenantObj?.phone || '+57 300 000 0000',
      primaryColor: websiteForm.primary_color || activeTenantObj?.primary_color || '#d92672',
      showTeamSection: websiteForm.show_team_section !== false,
      showFirstVisitDiscount: websiteForm.show_first_visit_discount,
      firstVisitDiscountPct: Number(websiteForm.first_visit_discount_pct || 15),
      firstVisitDiscountTitle: websiteForm.first_visit_discount_title || undefined,
      heroImageUrl: websiteForm.hero_image_url || undefined,
      logoIcon: websiteForm.logo_icon || undefined,
      heroEyebrow: websiteForm.hero_eyebrow || undefined,
      slogan: websiteForm.slogan || undefined,
      titleAccent: websiteForm.title_accent || undefined,
      navbarTagline: websiteForm.navbar_tagline || undefined,
      businessHours: websiteForm.business_hours_text || undefined,
      subtitle: websiteForm.subtitle || undefined,
      aboutImageUrl: websiteForm.about_image_url || undefined,
      aboutBadgeText: websiteForm.about_badge_text || undefined,
      aboutEyebrow: websiteForm.about_eyebrow || undefined,
      aboutTitle: websiteForm.about_title || undefined,
      aboutTitleAccent: websiteForm.about_title_accent || undefined,
      aboutDescription: websiteForm.about_description || undefined,
      aboutYearsExp: websiteForm.about_years_exp || undefined,
      aboutClientsCount: websiteForm.about_clients_count || undefined,
      aboutStat3Text: websiteForm.about_stat3_text || undefined,
      aboutRatingText: websiteForm.about_rating_text || undefined,
      showAboutSection: websiteForm.show_about_section !== false,
      liveServices: services.length > 0 ? services : undefined,
      liveStylists: stylists.length > 0 ? stylists : undefined
    });
  }, [prospectRawHtml, websiteForm, activeTenantObj, services, stylists]);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Tratamiento',
    price_usd: 25,
    cost_price_usd: 12,
    stock_quantity: 10,
    min_stock_alert: 3,
    sku: ''
  });

  // Profile Submenu & Business Modal States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isBusinessSettingsModalOpen, setIsBusinessSettingsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [salonName, setSalonName] = useState('Mi Salón');
  const [salonPhone, setSalonPhone] = useState('+57 300 000 0000');
  const [salonCurrency, setSalonCurrency] = useState<'COP' | 'USD' | 'MXN' | 'EUR'>('COP');
  const [salonAddress, setSalonAddress] = useState('');
  const [salonHours, setSalonHours] = useState('Lun - Sáb: 08:00 AM - 08:00 PM');

  const formatCurrency = (amount: number | string | undefined | null, currency: string = salonCurrency || 'COP') => {
    const num = Number(amount ?? 0);
    if (currency === 'USD') {
      return `$ ${num.toLocaleString('en-US')} USD`;
    }
    if (currency === 'MXN') {
      return `$ ${num.toLocaleString('es-MX')} MXN`;
    }
    if (currency === 'EUR') {
      return `€ ${num.toLocaleString('es-ES')} EUR`;
    }
    return `$ ${num.toLocaleString('es-CO')} COP`;
  };

  // CRM Client State & Modals
  const [searchTermClient, setSearchTermClient] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<{
    full_name: string;
    phone_whatsapp: string;
    email: string;
    birthday: string;
    status: 'vip' | 'frecuente' | 'nuevo' | 'en_riesgo';
    allergies: string;
    preferred_stylist_id: string;
  }>({
    full_name: '',
    phone_whatsapp: '',
    email: '',
    birthday: '',
    status: 'nuevo',
    allergies: '',
    preferred_stylist_id: 'sty-1'
  });

  // Modals
  const [selectedClientForFormula, setSelectedClientForFormula] = useState<Client | null>(null);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewFormulaModalOpen, setIsNewFormulaModalOpen] = useState(false);
  const [isSavingFormula, setIsSavingFormula] = useState(false);

  // New Appointment Form State
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newService, setNewService] = useState('Balayage Rubio Cenizo + Olaplex');
  const [newStylist, setNewStylist] = useState('Sofía Restrepo');
  const [newTime, setNewTime] = useState('03:30 PM');

  // New Color Formula Form State
  const [newFormulaText, setNewFormulaText] = useState('L\'Oréal Majirel 8.1 (30g) + 9.22 (10g)');
  const [newDeveloperVol, setNewDeveloperVol] = useState('20 Vol');
  const [newExposureMin, setNewExposureMin] = useState(35);
  const [newDiagnosticNotes, setNewDiagnosticNotes] = useState('Raíz natural altura 5. Matizado cenizo suave.');

  // POS State
  const [cartItems, setCartItems] = useState<{ name: string; price: number; type: 'service' | 'retail' }[]>([
    { name: 'Balayage Rubio Cenizo', price: 110, type: 'service' },
    { name: 'Olaplex Nº 3 Hair Perfector', price: 32, type: 'retail' }
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // WhatsApp Simulated Bot State
  const [chatMessages, setChatMessages] = useState<{ sender: 'client' | 'bot'; text: string; time: string }[]>([
    { sender: 'client', text: 'Hola! Quiero saber si tienen espacio para un Balayage mañana en la tarde con Sofía?', time: '10:14 AM' },
    { sender: 'bot', text: '¡Hola Camila! 💖 Con gusto te ayudamos. Sofía tiene espacio disponible mañana a las 02:00 PM y a las 04:30 PM. ¿Cuál horario te queda más cómodo?', time: '10:14 AM' },
    { sender: 'client', text: 'Perfecto, a las 02:00 PM me queda genial!', time: '10:15 AM' },
    { sender: 'bot', text: '🎉 ¡Listo Camila! Tu cita para Balayage con Sofía Restrepo quedó confirmada para mañana a las 02:00 PM. Te enviaremos un recordatorio 2 horas antes.', time: '10:15 AM' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(false);

      let currentEmail = '';
      let targetTenantId: string | undefined = undefined;

      // 1. Cargar usuario autenticado / dueña
      const authUserRaw = localStorage.getItem('bf_auth_user');
      if (authUserRaw) {
        try {
          const authUser = JSON.parse(authUserRaw);
          if (authUser.user_metadata?.name && !authUser.user_metadata.name.includes('@')) {
            setOwnerName(authUser.user_metadata.name);
          }
          if (authUser.email) {
            setOwnerEmail(authUser.email);
            currentEmail = authUser.email;
            if (!ownerName) {
              const cleanPrefix = authUser.email.split('@')[0].replace(/[._-]/g, ' ');
              const formattedName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);
              setOwnerName(formattedName);
            }
          }
        } catch (e) {}
      }

      // 2. Buscar tenant oficial asociado a este email en Supabase
      if (currentEmail) {
        try {
          const tenantFromEmail = await api.getTenantByUserEmail(currentEmail);
          if (tenantFromEmail) {
            targetTenantId = tenantFromEmail.id;
            setActiveTenantObj(tenantFromEmail);
            if (tenantFromEmail.name) {
              setSalonName(tenantFromEmail.name);
              // Si el usuario no tiene nombre configurado, usar el nombre del salón o dueña
              if (tenantFromEmail.owner_name) {
                setOwnerName(tenantFromEmail.owner_name);
              } else if (!ownerName || ownerName.toLowerCase() === 'owner') {
                setOwnerName(tenantFromEmail.name);
              }
            }
            if (tenantFromEmail.phone) setSalonPhone(tenantFromEmail.phone);
            if (tenantFromEmail.address) setSalonAddress(tenantFromEmail.address.replace(/^,\s*/, '').trim());
            if (tenantFromEmail.currency) setSalonCurrency(tenantFromEmail.currency);
            if (tenantFromEmail.business_hours?.summary) setSalonHours(tenantFromEmail.business_hours.summary);
            localStorage.setItem('bf_tenant_active', JSON.stringify(tenantFromEmail));
          }
        } catch (e) {}
      }

      // 3. Fallback a información en LocalStorage si no se recuperó de Supabase
      if (!targetTenantId) {
        const activeTenantRaw = localStorage.getItem('bf_tenant_active');
        if (activeTenantRaw) {
          try {
            const activeTenant = JSON.parse(activeTenantRaw);
            // No heredar el ID del tenant demo para usuarios distintos
            if (activeTenant.id !== '00000000-0000-0000-0000-000000000001' || currentEmail === 'sofia@studioglamour.co') {
              targetTenantId = activeTenant.id;
              setActiveTenantObj(activeTenant);
              if (activeTenant.name) setSalonName(activeTenant.name);
              if (activeTenant.phone) setSalonPhone(activeTenant.phone);
              if (activeTenant.address) setSalonAddress(activeTenant.address.replace(/^,\s*/, '').trim());
              if (activeTenant.currency) setSalonCurrency(activeTenant.currency);
              if (activeTenant.business_hours?.summary) setSalonHours(activeTenant.business_hours.summary);
            }
          } catch (e) {
            console.warn('Error parsing active tenant:', e);
          }
        }
      }

      // Si sigue sin targetTenantId y es un usuario específico, generar un namespace limpio
      if (!targetTenantId && currentEmail && currentEmail !== 'sofia@studioglamour.co') {
        targetTenantId = `tenant-${currentEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      }

      if (targetTenantId) {
        try {
          const rawT = localStorage.getItem('bf_tenant_active');
          if (rawT) {
            const parsed = JSON.parse(rawT);
            if (parsed.id !== '00000000-0000-0000-0000-000000000001' || currentEmail === 'sofia@studioglamour.co') {
              setActiveTenantObj(parsed);
              if (parsed.name) setSalonName(parsed.name);
            }
          }
        } catch (e) {}
      }

      const [apts, cls, stys, srvs, cats, prods, settings] = await Promise.all([
        api.getAppointments(targetTenantId),
        api.getClients(targetTenantId),
        api.getStylists(targetTenantId),
        api.getServices(targetTenantId),
        api.getCategories(targetTenantId),
        api.getProducts(targetTenantId),
        api.getTenantAISettings(targetTenantId)
      ]);
      setAppointments(apts);
      setClients(cls);
      setStylists(stys);
      setServices(srvs);
      setCategories(cats);
      setProducts(prods);
      setAiSettings(settings);

      // WELCOME TRIGGER: Mostrar mensaje de bienvenida limpio si es primera vez que la usuaria ingresa a su panel
      if (currentEmail) {
        const cleanE = currentEmail.toLowerCase().trim();
        const welcomeSeen = localStorage.getItem(`bf_welcome_seen_${cleanE}`) === 'true' ||
                            (targetTenantId && localStorage.getItem(`bf_welcome_seen_${targetTenantId}`) === 'true');
        if (!welcomeSeen) {
          setTimeout(() => {
            setIsWelcomeModalOpen(true);
          }, 450);
        }
      }

      // ROLE GUARD: Si el usuario autenticado es un colaborador y NO es admin/dueña, redirigir a /colaborador
      if (currentEmail) {
        const cleanEmail = currentEmail.toLowerCase().trim();
        const matchedSty = stys.find(s => s.email?.toLowerCase().trim() === cleanEmail);
        const authRole = authUserRaw ? JSON.parse(authUserRaw)?.user_metadata?.role : null;
        if (authRole === 'colaborador' || (matchedSty && !matchedSty.is_owner && matchedSty.role !== 'admin')) {
          navigate(matchedSty ? `/colaborador/${matchedSty.id}` : '/colaborador', { replace: true });
          return;
        }
      }

      // Cargar datos reales en el simulador de WhatsApp y POS
      if (srvs && srvs.length > 0) {
        const topSrv = srvs[0];
        const masterStylist = (stys && stys[0]?.name) || 'Directora';
        const currentSalonName = salonName || 'Nuestro Salón';

        setCartItems([
          { name: topSrv.name, price: Number(topSrv.price_usd ?? topSrv.price ?? 0), type: 'service' }
        ]);

        setChatMessages([
          { sender: 'client', text: `¡Hola! Quiero saber si tienen espacio para ${topSrv.name} hoy con ${masterStylist}?`, time: '10:14 AM' },
          { sender: 'bot', text: `¡Hola! 💖 Con gusto te ayudamos en ${currentSalonName}. ${masterStylist} tiene espacio disponible hoy a las 02:00 PM y a las 04:30 PM. ¿Cuál horario te queda más cómodo?`, time: '10:14 AM' },
          { sender: 'client', text: 'Perfecto, a las 02:00 PM me queda genial!', time: '10:15 AM' },
          { sender: 'bot', text: `🎉 ¡Listo! Tu cita para ${topSrv.name} con ${masterStylist} quedó confirmada para hoy a las 02:00 PM. Te enviaremos un recordatorio por WhatsApp.`, time: '10:15 AM' }
        ]);
      }
    }
    loadData();
  }, []);

  const handleSaveAiSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiSettings) return;
    setIsSavingAiSettings(true);
    try {
      const updated = await api.updateTenantAISettings(aiSettings);
      setAiSettings(updated);
      setAiSettingsSavedSuccess(true);
      setTimeout(() => setAiSettingsSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving AI settings:', err);
    } finally {
      setIsSavingAiSettings(false);
    }
  };

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim() || !aiSettings) return;
    const currentFaqs = aiSettings.faqs || [];
    setAiSettings({
      ...aiSettings,
      faqs: [...currentFaqs, { pregunta: newFaqQuestion.trim(), respuesta: newFaqAnswer.trim() }]
    });
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (index: number) => {
    if (!aiSettings) return;
    const currentFaqs = [...(aiSettings.faqs || [])];
    currentFaqs.splice(index, 1);
    setAiSettings({ ...aiSettings, faqs: currentFaqs });
  };

  // CLIENT CRUD HANDLERS
  const handleOpenNewClient = () => {
    setEditingClient(null);
    setClientForm({
      full_name: '',
      phone_whatsapp: '',
      email: '',
      birthday: '',
      status: 'nuevo',
      allergies: '',
      preferred_stylist_id: stylists[0]?.id || 'sty-1'
    });
    setIsClientModalOpen(true);
  };

  const handleEditClient = (cl: Client) => {
    setEditingClient(cl);
    setClientForm({
      full_name: cl.full_name,
      phone_whatsapp: cl.phone_whatsapp,
      email: cl.email || '',
      birthday: cl.birthday || '',
      status: cl.status,
      allergies: cl.allergies || '',
      preferred_stylist_id: cl.preferred_stylist_id || stylists[0]?.id || 'sty-1'
    });
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.full_name.trim()) return;

    if (editingClient) {
      const updated: Client = {
        ...editingClient,
        full_name: clientForm.full_name,
        phone_whatsapp: clientForm.phone_whatsapp,
        email: clientForm.email,
        birthday: clientForm.birthday,
        status: clientForm.status,
        allergies: clientForm.allergies,
        preferred_stylist_id: clientForm.preferred_stylist_id
      };
      await api.updateClient(updated);
      setClients(clients.map(c => c.id === updated.id ? updated : c));
    } else {
      const newCl: Client = {
        id: `cli-${Date.now()}`,
        tenant_id: 'ten-1',
        full_name: clientForm.full_name,
        phone_whatsapp: clientForm.phone_whatsapp,
        email: clientForm.email,
        birthday: clientForm.birthday,
        status: clientForm.status,
        total_spent_usd: 0,
        visits_count: 0,
        preferred_stylist_id: clientForm.preferred_stylist_id,
        allergies: clientForm.allergies,
        formulas: [],
        created_at: new Date().toISOString()
      };
      await api.createClient(newCl);
      setClients([newCl, ...clients]);
    }
    setIsClientModalOpen(false);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta clienta y sus expedientes de colorimetría?')) {
      await api.deleteClient(id);
      setClients(clients.filter(c => c.id !== id));
    }
  };

  // STYLIST CRUD HANDLERS
  const handleOpenNewStylist = () => {
    const check = canAddMoreStylists(stylists.length, activeTenantObj?.plan_tier);
    if (!check.allowed) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'crecimiento',
        featureName: 'Colaboradoras Ilimitadas',
        featureDescription: check.message
      });
      return;
    }

    setEditingStylist(null);
    setStylistForm({
      name: '',
      email: '',
      phone: '',
      password: 'BeautyFlow2026*',
      specialty: 'Directora & Gestión',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: 'colaborador',
      is_owner: false,
      attends_clients: false, // Por defecto 'Solo gestión administrativa' en off
      show_on_web: true,
      commission_service_pct: 45,
      commission_retail_pct: 10,
      service_categories: ['color', 'corte'],
      service_ids: []
    });
    setIsStylistModalOpen(true);
  };

  const handleEditStylist = (sty: Stylist) => {
    setEditingStylist(sty);
    setStylistForm({
      name: sty.name,
      email: sty.email || '',
      phone: sty.phone || '',
      password: '',
      specialty: sty.specialty,
      photo_url: sty.photo_url || '',
      role: sty.role || (sty.is_owner ? 'admin' : 'colaborador'),
      is_owner: sty.is_owner || sty.role === 'admin' || false,
      attends_clients: sty.attends_clients !== false,
      show_on_web: sty.show_on_web !== false,
      commission_service_pct: sty.commission_service_pct ?? 45,
      commission_retail_pct: sty.commission_retail_pct ?? 10,
      service_categories: sty.service_categories || ['color', 'corte'],
      service_ids: sty.service_ids || []
    });
    setIsStylistModalOpen(true);
  };

  const handleSaveStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stylistForm.name.trim()) return;
    
    if (editingStylist) {
      const updated: Stylist = {
        ...editingStylist,
        name: stylistForm.name,
        email: stylistForm.email,
        phone: stylistForm.phone,
        specialty: stylistForm.specialty,
        photo_url: stylistForm.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: stylistForm.role,
        is_owner: stylistForm.is_owner,
        attends_clients: stylistForm.attends_clients,
        show_on_web: stylistForm.show_on_web,
        commission_service_pct: Number(stylistForm.commission_service_pct),
        commission_retail_pct: Number(stylistForm.commission_retail_pct),
        service_categories: stylistForm.service_categories,
        service_ids: stylistForm.service_ids
      };
      await api.updateStylist(updated, stylistForm.password || undefined);
      setStylists(stylists.map(s => s.id === updated.id ? updated : s));
    } else {
      const newSty: Stylist = {
        id: '',
        tenant_id: getActiveTenantId(),
        name: stylistForm.name,
        email: stylistForm.email,
        phone: stylistForm.phone,
        specialty: stylistForm.specialty,
        photo_url: stylistForm.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        role: stylistForm.role,
        is_owner: stylistForm.is_owner,
        attends_clients: stylistForm.attends_clients,
        show_on_web: stylistForm.show_on_web,
        rating: 5.0,
        reviews_count: 0,
        commission_service_pct: Number(stylistForm.commission_service_pct),
        commission_retail_pct: Number(stylistForm.commission_retail_pct),
        working_days: [1, 2, 3, 4, 5, 6],
        service_categories: stylistForm.service_categories,
        service_ids: stylistForm.service_ids,
        is_active: true
      };
      const saved = await api.createStylist(newSty, stylistForm.password || 'BeautyFlow2026*');
      setStylists([saved, ...stylists]);
    }
    setIsStylistModalOpen(false);
  };

  const handleDeleteStylist = async (id: string) => {
    const target = stylists.find(s => s.id === id);
    if (target?.is_owner || target?.role === 'admin') {
      alert('La cuenta principal de Administradora / Dueña no puede ser eliminada.');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este profesional del equipo?')) {
      const tid = activeTenantObj?.id || getActiveTenantId();
      setStylists(prev => prev.filter(s => s.id !== id));
      await api.deleteStylist(id, tid);
    }
  };

  // STYLIST 360° PROFILE DOSSIER STATE
  const [selectedStylistForDetails, setSelectedStylistForDetails] = useState<Stylist | null>(null);
  const [isStylistDetailsModalOpen, setIsStylistDetailsModalOpen] = useState(false);
  const [stylistDetailsTab, setStylistDetailsTab] = useState<'appointments' | 'commissions' | 'schedule' | 'specialties'>('appointments');

  const handleOpenStylistDetails = (sty: Stylist) => {
    setSelectedStylistForDetails(sty);
    setStylistDetailsTab('appointments');
    setIsStylistDetailsModalOpen(true);
  };

  // OWNER AVAILABILITY & BLOCKED DATES HANDLERS
  const [selectedStylistForAvailability, setSelectedStylistForAvailability] = useState<Stylist | null>(null);
  const [isStylistAvailabilityModalOpen, setIsStylistAvailabilityModalOpen] = useState(false);
  const [availStartDate, setAvailStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [availEndDate, setAvailEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [availReason, setAvailReason] = useState('Vacaciones');
  const [availFullDay, setAvailFullDay] = useState(true);

  const handleOpenStylistAvailability = (sty: Stylist) => {
    setSelectedStylistForAvailability(sty);
    setAvailStartDate(new Date().toISOString().split('T')[0]);
    setAvailEndDate(new Date().toISOString().split('T')[0]);
    setAvailReason('Vacaciones');
    setAvailFullDay(true);
    setIsStylistAvailabilityModalOpen(true);
  };

  const handleOwnerAddBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStylistForAvailability || !availStartDate) return;

    const datesToBlock: string[] = [];
    const start = new Date(availStartDate);
    const end = new Date(availEndDate || availStartDate);

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      datesToBlock.push(dt.toISOString().split('T')[0]);
    }

    const currentSlots = selectedStylistForAvailability.blocked_slots || [];
    const currentDates = selectedStylistForAvailability.blocked_dates || [];

    const newSlots: BlockedSlot[] = datesToBlock.map(dateStr => ({
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stylist_id: selectedStylistForAvailability.id,
      date: dateStr,
      reason: availReason,
      full_day: availFullDay,
      created_at: new Date().toISOString()
    }));

    const combinedSlots = [...newSlots, ...currentSlots];
    const combinedDates = Array.from(new Set([...datesToBlock, ...currentDates]));

    const updatedStylist: Stylist = {
      ...selectedStylistForAvailability,
      blocked_dates: combinedDates,
      blocked_slots: combinedSlots
    };

    setSelectedStylistForAvailability(updatedStylist);
    setStylists(stylists.map(s => s.id === updatedStylist.id ? updatedStylist : s));
    await api.updateStylist(updatedStylist);
  };

  const handleOwnerRemoveBlockedSlot = async (slotId: string, dateStr: string) => {
    if (!selectedStylistForAvailability) return;
    const currentSlots = selectedStylistForAvailability.blocked_slots || [];
    const currentDates = selectedStylistForAvailability.blocked_dates || [];

    const updatedSlots = currentSlots.filter(s => s.id !== slotId);
    // Si ya no quedan slots en esa fecha, desbloquearla de blocked_dates
    const hasMoreSlotsOnDate = updatedSlots.some(s => s.date === dateStr);
    const updatedDates = hasMoreSlotsOnDate ? currentDates : currentDates.filter(d => d !== dateStr);

    const updatedStylist: Stylist = {
      ...selectedStylistForAvailability,
      blocked_dates: updatedDates,
      blocked_slots: updatedSlots
    };

    setSelectedStylistForAvailability(updatedStylist);
    setStylists(stylists.map(s => s.id === updatedStylist.id ? updatedStylist : s));
    await api.updateStylist(updatedStylist);
  };

  const handleOwnerToggleWorkingDay = async (dayIndex: number) => {
    if (!selectedStylistForAvailability) return;
    const currentDays = selectedStylistForAvailability.working_days || [1, 2, 3, 4, 5, 6];
    const updatedDays = currentDays.includes(dayIndex)
      ? currentDays.filter(d => d !== dayIndex)
      : [...currentDays, dayIndex].sort();

    const updatedStylist: Stylist = {
      ...selectedStylistForAvailability,
      working_days: updatedDays
    };

    setSelectedStylistForAvailability(updatedStylist);
    setStylists(stylists.map(s => s.id === updatedStylist.id ? updatedStylist : s));
    await api.updateStylist(updatedStylist);
  };

  // SERVICES CRUD HANDLERS
  const handleOpenNewService = () => {
    setEditingService(null);
    setServiceForm({
      name: '',
      category: categories[0]?.slug || 'color',
      duration_minutes: 45,
      price_usd: 30,
      image_url: '',
      requires_patch_test: false,
      description: '',
      is_featured: true
    });
    setIsServiceModalOpen(true);
  };

  const handleEditService = (srv: Service) => {
    setEditingService(srv);
    setServiceForm({
      name: srv.name,
      category: srv.category,
      duration_minutes: srv.duration_minutes,
      price_usd: srv.price_usd || srv.price || 0,
      image_url: srv.image_url || '',
      requires_patch_test: srv.requires_patch_test || false,
      description: srv.description || '',
      is_featured: srv.is_featured !== false
    });
    setIsServiceModalOpen(true);
  };

  const handleCreateQuickCategory = async () => {
    if (!quickCategoryName.trim()) return;
    const activeTid = activeTenantObj?.id || getActiveTenantId();
    const cleanSlug = quickCategoryName.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    const created = await api.createCategory({
      tenant_id: activeTid,
      name: quickCategoryName.trim(),
      slug: cleanSlug,
      icon: quickCategoryIcon.trim() || '✨',
      description: `Categoría para ${quickCategoryName.trim()}`,
      display_order: categories.length + 1
    });
    setCategories([...categories, created]);
    setServiceForm({ ...serviceForm, category: created.slug });
    setQuickCategoryName('');
    setQuickCategoryIcon('✨');
    setIsQuickCategoryOpen(false);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) return;

    // Si no seleccionó imagen, sugerir una de la librería según la categoría
    const finalImage = serviceForm.image_url || getSuggestedImageForService(serviceForm.name, serviceForm.category);

    try {
      if (editingService) {
        const updated: Service = {
          ...editingService,
          name: serviceForm.name,
          category: serviceForm.category,
          duration_minutes: Number(serviceForm.duration_minutes),
          price_usd: Number(serviceForm.price_usd),
          price: Number(serviceForm.price_usd),
          price_cop: salonCurrency === 'COP' ? Number(serviceForm.price_usd) : Number(serviceForm.price_usd) * 4000,
          image_url: finalImage,
          requires_patch_test: serviceForm.requires_patch_test,
          description: serviceForm.description,
          is_featured: !!serviceForm.is_featured
        };
        await api.updateService(updated);
        setServices(services.map(s => s.id === updated.id ? updated : s));
        alert(`✅ Servicio "${serviceForm.name}" actualizado con éxito en Supabase y visible en tu agendador.`);
      } else {
        const activeTid = activeTenantObj?.id || getActiveTenantId();
        const newSrv: Service = {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `srv-${Date.now()}`,
          tenant_id: activeTid,
          name: serviceForm.name,
          category: serviceForm.category,
          duration_minutes: Number(serviceForm.duration_minutes),
          price_usd: Number(serviceForm.price_usd),
          price: Number(serviceForm.price_usd),
          price_cop: salonCurrency === 'COP' ? Number(serviceForm.price_usd) : Number(serviceForm.price_usd) * 4000,
          image_url: finalImage,
          requires_patch_test: serviceForm.requires_patch_test,
          description: serviceForm.description,
          is_featured: !!serviceForm.is_featured
        };
        const saved = await api.createService(newSrv);
        setServices([saved, ...services]);
        alert(`✨ ¡Servicio "${serviceForm.name}" guardado exitosamente en la base de datos de Supabase! Ahora las clientas pueden reservarlo online.`);
      }
      setIsServiceModalOpen(false);
    } catch (err: any) {
      alert(`❌ Error guardando en Supabase: ${err.message || 'Error desconocido'}`);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      const tid = activeTenantObj?.id || getActiveTenantId();
      setServices(prev => prev.filter(s => s.id !== id));
      await api.deleteService(id, tid);
    }
  };

  // CATEGORY CRUD HANDLERS
  const handleOpenNewCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      icon: '✨',
      description: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '✨',
      description: cat.description || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    const activeTid = activeTenantObj?.id || getActiveTenantId();
    const cleanSlug = (categoryForm.slug || categoryForm.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-');

    if (editingCategory) {
      const updated: ServiceCategory = {
        ...editingCategory,
        name: categoryForm.name.trim(),
        slug: cleanSlug,
        icon: categoryForm.icon.trim() || '✨',
        description: categoryForm.description.trim()
      };
      await api.updateCategory(updated);
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
    } else {
      const newCat = await api.createCategory({
        tenant_id: activeTid,
        name: categoryForm.name.trim(),
        slug: cleanSlug,
        icon: categoryForm.icon.trim() || '✨',
        description: categoryForm.description.trim(),
        display_order: categories.length + 1
      });
      setCategories([...categories, newCat]);
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    // Verificar si hay servicios usándola
    const servicesCount = services.filter(s => s.category === cat.slug || s.category === cat.id).length;
    const confirmMsg = servicesCount > 0
      ? `Hay ${servicesCount} servicio(s) asociados a "${cat.name}". ¿Deseas eliminarla de todas formas?`
      : `¿Estás seguro de eliminar la categoría "${cat.name}"?`;

    if (confirm(confirmMsg)) {
      const activeTid = activeTenantObj?.id || getActiveTenantId();
      await api.deleteCategory(id, activeTid);
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // PRODUCT CRUD HANDLERS
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      category: 'Tratamiento',
      price_usd: 30,
      cost_price_usd: 15,
      stock_quantity: 10,
      min_stock_alert: 3,
      sku: ''
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      price_usd: prod.price_usd,
      cost_price_usd: prod.cost_price_usd || 0,
      stock_quantity: prod.stock_quantity,
      min_stock_alert: prod.min_stock_alert || 3,
      sku: prod.sku || ''
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price_usd: Number(productForm.price_usd),
        cost_price_usd: Number(productForm.cost_price_usd),
        stock_quantity: Number(productForm.stock_quantity),
        min_stock_alert: Number(productForm.min_stock_alert),
        sku: productForm.sku
      };
      await api.updateProduct(updated);
      setProducts(products.map(p => p.id === updated.id ? updated : p));
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        tenant_id: 'ten-1',
        name: productForm.name,
        brand: productForm.brand,
        category: productForm.category,
        price_usd: Number(productForm.price_usd),
        cost_price_usd: Number(productForm.cost_price_usd),
        stock_quantity: Number(productForm.stock_quantity),
        min_stock_alert: Number(productForm.min_stock_alert),
        sku: productForm.sku || `SKU-${Date.now().toString().slice(-4)}`,
        created_at: new Date().toISOString()
      };
      await api.createProduct(newProd);
      setProducts([newProd, ...products]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedService = services.find(s => s.name === newService) || services[0];
    const matchedStylist = stylists.find(s => s.name === newStylist) || stylists[0];
    const activeTid = getActiveTenantId();

    const newApt: Appointment = {
      id: '',
      tenant_id: activeTid,
      client_id: '',
      client_name: newClientName || 'Cliente Salón',
      client_phone: newClientPhone || '',
      stylist_id: matchedStylist?.id || '',
      stylist_name: matchedStylist?.name || newStylist || 'Especialista',
      service_id: matchedService?.id || '',
      service_name: matchedService?.name || newService || 'Servicio General',
      date: new Date().toISOString().split('T')[0],
      time: newTime,
      duration_minutes: matchedService?.duration_minutes || 60,
      price_usd: Number(matchedService?.price_usd ?? matchedService?.price ?? 40),
      status: 'confirmada_wa',
      wa_reminder_24h_sent: true,
      wa_reminder_2h_sent: false,
      created_at: new Date().toISOString()
    };

    const saved = await api.createAppointment(newApt);
    setAppointments([saved, ...appointments]);
    setIsNewAppointmentOpen(false);
    setNewClientName('');
    setNewClientPhone('');
  };

  const handleSaveFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForFormula || isSavingFormula) return;

    try {
      setIsSavingFormula(true);
      const targetTenantId = selectedClientForFormula.tenant_id || activeTenantObj?.id;
      const targetStylist = stylists.find(s => s.id === selectedClientForFormula.preferred_stylist_id) || stylists[0];

      const formulaPayload: Partial<ColorFormula> = {
        client_id: selectedClientForFormula.id,
        tenant_id: targetTenantId,
        stylist_id: targetStylist?.id,
        stylist_name: targetStylist?.name || ownerName || 'Colorista',
        formula_text: newFormulaText.trim(),
        developer_volume: newDeveloperVol,
        exposure_minutes: Number(newExposureMin) || 35,
        plex_used: true,
        porosity_level: 'media',
        diagnostic_notes: newDiagnosticNotes.trim(),
        created_at: new Date().toISOString().split('T')[0]
      };

      const savedFormula = await api.addColorFormula(selectedClientForFormula.id, formulaPayload);

      // Actualizar reactivamente la lista de clientes en memoria
      setClients(prevClients => {
        return prevClients.map(c => {
          if (c.id === selectedClientForFormula.id) {
            const existingFormulas = c.formulas || [];
            return {
              ...c,
              formulas: [savedFormula, ...existingFormulas.filter(f => f.id !== savedFormula.id)]
            };
          }
          return c;
        });
      });

      // Actualizar el cliente seleccionado en el modal
      setSelectedClientForFormula(prev => {
        if (!prev) return null;
        const existingFormulas = prev.formulas || [];
        return {
          ...prev,
          formulas: [savedFormula, ...existingFormulas.filter(f => f.id !== savedFormula.id)]
        };
      });

      setIsNewFormulaModalOpen(false);
      setNewFormulaText('');
      setNewDiagnosticNotes('');
    } catch (error) {
      console.error('Error guardando formula:', error);
      alert('Hubo un error al guardar la fórmula. Por favor intenta de nuevo.');
    } finally {
      setIsSavingFormula(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const userMsg = { sender: 'client' as const, text: newMsgText, time: '10:18 AM' };
    setChatMessages(prev => [...prev, userMsg]);
    setNewMsgText('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot' as const,
          text: '¡Entendido! Nuestro motor de IA ha sincronizado tu solicitud en tiempo real con la agenda del salón.',
          time: '10:18 AM'
        }
      ]);
    }, 700);
  };

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleNavigateTab = (targetTab: typeof activeTab) => {
    const planConfig = getPlanConfig(activeTenantObj?.plan_tier);

    if (targetTab === 'crm' && !planConfig.can_use_color_crm) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'crecimiento',
        featureName: 'CRM Colorimetría 360°',
        featureDescription: 'Lleva el historial técnico y fórmulas exactas de tinte de cada clienta para fidelizar y garantizar resultados consistentes.'
      });
      return;
    }

    if (targetTab === 'pos' && !planConfig.can_use_pos) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'crecimiento',
        featureName: 'Caja POS & Liquidación de Comisiones',
        featureDescription: 'Factura servicios, gestiona arqueo Z de caja y liquida comisiones diarias a tus colaboradoras sin cálculos manuales.'
      });
      return;
    }

    if (targetTab === 'templates' && !planConfig.can_use_templates) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'pro_ia',
        featureName: 'Centro de Plantillas WhatsApp & Email',
        featureDescription: 'Accede a plantillas HSM aprobadas por Meta para envíos y confirmaciones automáticas de alto impacto.'
      });
      return;
    }

    if (targetTab === 'ai_settings' && !planConfig.can_use_ai_whatsapp) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'pro_ia',
        featureName: 'Recepcionista Virtual IA 24/7 en WhatsApp',
        featureDescription: 'Automatiza el agendamiento y respuestas inteligentes por WhatsApp con IA de última generación (ChatGPT/Gemini).'
      });
      return;
    }

    if (targetTab === 'loyalty' && !planConfig.can_use_loyalty_reactivation) {
      setUpgradeModalState({
        isOpen: true,
        requiredPlan: 'pro_ia',
        featureName: 'Motor de Fidelización & Reactivación (+35D)',
        featureDescription: 'Identifica automáticamente a clientas que llevan más de 35 días sin visitar tu salón y reactívalas en 1 clic.'
      });
      return;
    }

    setActiveTab(targetTab);
  };

  return (
    <div className={`min-h-screen font-body transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#090B10] text-white' : 'bg-[#F5F6FA] text-[#111827]'
    }`}>
      
      {/* Top Full-Width Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 flex justify-between items-center transition-colors ${
        theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
      }`}>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 text-base sm:text-lg font-black">
            <img
              src="/kowy-logo.jpg"
              alt="Kowy Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-[#FF5A36]/30"
            />
            <span className="hidden sm:inline">Kowy <span className="text-[#FF5A36]">.app</span></span>
          </Link>

          {/* Segmented Pill Navigation Strip */}
          <nav className={`p-1 rounded-full border flex items-center gap-1 overflow-x-auto max-w-[50vw] sm:max-w-none ${
            theme === 'dark' ? 'bg-[#0E121B] border-white/10' : 'bg-[#F5F6FA] border-black/5'
          }`}>
            {[
              { id: 'overview', label: 'Overview', icon: Layers, locked: false },
              { id: 'crm', label: 'CRM Colorimetría', icon: Users, locked: !getPlanConfig(activeTenantObj?.plan_tier).can_use_color_crm },
              { id: 'whatsapp', label: 'Mensajes & WhatsApp', icon: MessageSquare, locked: false }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigateTab(tab.id as any)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-[#2E374D] text-white shadow-md'
                        : 'bg-[#12151B] text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.locked && <span className="text-[10px] text-amber-400 font-bold ml-0.5">🔒</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User Pill */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewAppointmentOpen(true)}
            className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              theme === 'dark' ? 'bg-[#1A2133] border-white/10 text-amber-400' : 'bg-[#F0F2F7] border-black/5 text-slate-700'
            }`}
            title="Cambiar tema Claro / Oscuro"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Interactive User Profile Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-full border transition-all ${
                isProfileMenuOpen
                  ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/20'
                  : theme === 'dark' ? 'border-white/10 hover:border-white/20 bg-[#141926]' : 'border-black/5 hover:border-black/20 bg-white shadow-sm'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#FF5A36] text-white font-bold text-xs flex items-center justify-center border border-[#FF5A36]/40 shadow-sm">
                {ownerName ? ownerName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <strong className="block font-bold leading-none">{ownerName}</strong>
                <span className="text-[10px] text-slate-400">{salonName}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180 text-[#FF5A36]' : ''}`} />
            </button>

            {/* Profile Dropdown Submenu */}
            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileMenuOpen(false)} 
                />
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl z-50 p-2 space-y-1 animate-fade-in ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900 shadow-xl'
                }`}>
                  {/* User info header */}
                  <div className="px-3 py-2.5 border-b border-black/5 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold block">{ownerName}</strong>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border bg-white/5 border-white/10 text-slate-300">
                        {activeTenantObj?.plan_tier === 'crecimiento' ? '📈 Crecimiento ($120k)' :
                         activeTenantObj?.plan_tier === 'inicio' ? '🚀 Inicio ($50k)' :
                         activeTenantObj?.plan_tier === 'pro_ia' ? '🤖 Pro Flow IA ($240k)' :
                         activeTenantObj?.plan_tier === 'escala' ? '🎯 Escala ($720k)' :
                         activeTenantObj?.plan_tier === 'agencia' ? '👑 Agencia VIP ($1.4M)' : '🌐 Plan Gratis ($0)'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate mt-0.5">{ownerEmail}</span>
                  </div>

                  {/* Menu Items (Paleta Sobria & Unificada) */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsWelcomeModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                    <span>Bienvenida & Enlaces de mi Salón</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlanModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Crown className="w-4 h-4 text-slate-400" />
                      <span>Mi Plan & Suscripción</span>
                    </div>
                    <span className="text-[10px] bg-white/5 border border-white/10 text-slate-400 px-1.5 py-0.5 rounded font-semibold">
                      30 Días
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNavigateTab('catalog_team');
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeTab === 'catalog_team'
                        ? 'bg-[#FF5A36]/10 text-[#FF5A36] font-bold'
                        : theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Scissors className="w-4 h-4 text-slate-400" />
                    <span>Equipo, Servicios & Stock</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNavigateTab('loyalty');
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      activeTab === 'loyalty'
                        ? 'bg-[#FF5A36]/10 text-[#FF5A36] font-bold'
                        : theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Fidelización & Reactivación (+35D)</span>
                    </div>
                    {!getPlanConfig(activeTenantObj?.plan_tier).can_use_loyalty_reactivation && (
                      <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        🔒 Pro IA
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNavigateTab('templates');
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      activeTab === 'templates'
                        ? 'bg-[#FF5A36]/10 text-[#FF5A36] font-bold'
                        : theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      <span>Plantillas WhatsApp & Email</span>
                    </div>
                    {!getPlanConfig(activeTenantObj?.plan_tier).can_use_templates && (
                      <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        🔒 Pro IA
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleNavigateTab('ai_settings');
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                      activeTab === 'ai_settings'
                        ? 'bg-[#FF5A36]/10 text-[#FF5A36] font-bold'
                        : theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-slate-400" />
                      <span>Configuración Agente IA</span>
                    </div>
                    {!getPlanConfig(activeTenantObj?.plan_tier).can_use_ai_whatsapp && (
                      <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        🔒 Pro IA
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsWebsiteCustomizerOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Palette className="w-4 h-4 text-slate-400" />
                    <span>Personalizar Página Web (Portada)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBusinessSettingsModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Configuración del Negocio</span>
                  </button>

                  <Link
                    to="/reservas"
                    target="_blank"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-2.5 transition-all ${
                      theme === 'dark' ? 'hover:bg-white/5 text-slate-200' : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>Portal Público de Citas</span>
                  </Link>

                  <div className="pt-1 border-t border-black/5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={async () => {
                        setIsProfileMenuOpen(false);
                        await api.auth.signOut();
                        localStorage.clear();
                        navigate('/login');
                      }}
                      className="w-full text-left text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2.5 text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Fluid Canvas Container */}
      <main className="max-w-[1600px] mx-auto p-4 sm:p-8 space-y-6">

        {/* =========================================================================
            VIEW 1: OVERVIEW (FINEXY 3-COLUMN OPERATIONS BOARD)
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Hero Greeting (Solo en Inicio / Overview) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  ¡Hola de nuevo, <span className="text-[#FF5A36]">{ownerName}</span>! 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {salonName} (Sede Principal) • Estado del sistema: <span className="text-emerald-500 font-bold">● Operativo en Vivo</span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-xs font-black px-3.5 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>📲 Mi Código QR de Reservas</span>
                </button>

                <Link
                  to="/reservas"
                  target="_blank"
                  className={`text-xs font-bold px-3.5 py-2 rounded-full border flex items-center gap-1.5 transition-all ${
                    theme === 'dark' ? 'bg-[#141926] border-white/10 text-white hover:border-[#FF5A36]' : 'bg-white border-black/5 text-slate-800 hover:border-[#FF5A36] shadow-sm'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>Ver Portal Web Público</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            
            {/* BANNER MINIMALISTA DE CONFIGURACIÓN INICIAL */}
            {(services.length === 0 || stylists.filter(s => !s.is_owner || s.attends_clients).length === 0) && (
              <div className={`rounded-2xl p-4 sm:p-4.5 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 ${
                theme === 'dark'
                  ? 'bg-[#141926]/90 border-amber-500/30 text-slate-200'
                  : 'bg-amber-500/[0.04] border-amber-500/25 text-slate-800 shadow-sm'
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-xs sm:text-sm font-bold tracking-tight">
                        Configura tus servicios y equipo para activar reservas
                      </strong>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                        Setup Pendiente
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className={services.length > 0 ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
                        {services.length > 0 ? '✓' : '•'} {services.length} Servicios
                      </span>
                      <span>•</span>
                      <span className={stylists.filter(s => !s.is_owner || s.attends_clients).length > 0 ? 'text-emerald-500 font-semibold' : 'text-amber-500 font-semibold'}>
                        {stylists.filter(s => !s.is_owner || s.attends_clients).length > 0 ? '✓' : '•'} {stylists.filter(s => !s.is_owner || s.attends_clients).length} Colaboradores
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-1 md:pt-0">
                  <button
                    type="button"
                    onClick={() => setIsWelcomeModalOpen(true)}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-[#FF5A36] hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ver Guía de Inicio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('catalog_team');
                      setCatalogSubTab(services.length === 0 ? 'services' : 'stylists');
                    }}
                    className={`flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all border ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-black/10 shadow-xs'
                    }`}
                  >
                    <span>Manual</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Top Operations 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Card 1: Balance & Stylists Wallet */}
              <div className={`lg:col-span-4 rounded-2xl p-6 border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
              }`}>
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                    <span className="font-semibold">Facturación Mensual Total</span>
                    <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold">COP $</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                    {appointments.filter(a => a.status === 'cobrada').reduce((acc, a) => acc + a.price_usd, 0) > 0
                      ? `$ ${appointments.filter(a => a.status === 'cobrada').reduce((acc, a) => acc + a.price_usd, 0).toLocaleString('es-CO')} COP`
                      : '$ 0 COP'}
                  </div>
                  <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 mb-5">
                    <TrendingUp className="w-3.5 h-3.5" /> {appointments.length > 0 ? `${appointments.length} citas registradas` : 'Listo para recibir reservas'}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('agenda')}
                      className="bg-[#12151B] dark:bg-[#252B37] hover:bg-[#FF5A36] text-white text-xs font-bold py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" /> + Agendar
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('pos')}
                      className={`text-xs font-bold py-2.5 rounded-full border flex items-center justify-center gap-1.5 transition-all ${
                        theme === 'dark' ? 'bg-[#1A2133] border-white/10 text-white hover:border-[#FF5A36]' : 'bg-[#F9FAFC] border-black/10 text-slate-800 hover:border-[#FF5A36]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Cobrar POS
                    </button>
                  </div>
                </div>

                {/* Sub-Stylists mini wallet strip */}
                <div className="pt-4 border-t border-black/5 dark:border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
                  {stylists.map(s => {
                    const earned = appointments
                      .filter(a => a.stylist_name === s.name && a.status === 'cobrada')
                      .reduce((sum, a) => sum + (a.price_usd * ((s.commission_service_pct || 45) / 100)), 0);
                    return (
                      <div key={s.id} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <span className="font-bold block truncate text-[11px]">{s.name.split(' ')[0]}</span>
                        <strong className="text-[#FF5A36] text-xs font-extrabold">{earned > 0 ? `$ ${earned.toLocaleString('es-CO')}` : '$ 0'}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: 2x2 Operations Metric Grid (Center) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                
                {/* 1. Solid Coral Card (Citas de Hoy) */}
                <div className="bg-gradient-to-br from-[#FF6947] to-[#FF4D26] text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-[#FF5A36]/25">
                  <div className="flex justify-between items-center text-xs font-semibold opacity-90">
                    <span>Citas Agendadas Hoy</span>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tight my-1">
                      {appointments.length} {appointments.length === 1 ? 'Cita' : 'Citas'}
                    </div>
                    <div className="text-[11px] opacity-90 font-medium">
                      {appointments.length > 0 ? 'Recordatorios automáticos activos' : 'Enlace web 24/7 listo'}
                    </div>
                  </div>
                </div>

                {/* 2. Mini Metric (0 Plantones) */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    <span>No-Shows (Plantones)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold tracking-tight my-1 text-emerald-500">0%</div>
                    <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Recordatorio 2h antes activo
                    </div>
                  </div>
                </div>

                {/* 3. Mini Metric (Comisiones) */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    <span>Comisión de Equipo</span>
                    <DollarSign className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold tracking-tight my-1">
                      {appointments.filter(a => a.status === 'cobrada').reduce((acc, a) => acc + (a.price_usd * 0.45), 0) > 0
                        ? `$ ${appointments.filter(a => a.status === 'cobrada').reduce((acc, a) => acc + (a.price_usd * 0.45), 0).toLocaleString('es-CO')} COP`
                        : '$ 0 COP'}
                    </div>
                    <div className="text-[11px] text-slate-400">Liquidación automática</div>
                  </div>
                </div>

                {/* 4. Mini Metric (Clientas en CRM) */}
                <div className={`rounded-2xl p-5 border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    <span>Clientas en CRM</span>
                    <Users className="w-4 h-4 text-[#FF5A36]" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight my-1">{clients.length}</div>
                    <div className="text-[11px] text-slate-400">Base de datos activa</div>
                  </div>
                </div>

              </div>

              {/* Card 3: Bar Chart Comparison (Servicios vs Retail) */}
              <div className={`lg:col-span-3 rounded-2xl p-6 border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
              }`}>
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-3">
                    <span>Servicios vs Retail</span>
                    <div className="flex gap-2 text-[10px]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF5A36]" /> Servicios</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-800 dark:bg-white" /> Retail</span>
                    </div>
                  </div>

                  {/* Visual CSS Chart Bars */}
                  <div className="flex items-end justify-between h-28 border-b border-black/5 dark:border-white/10 pb-2">
                    {[
                      { day: 'Lun', s: 65, r: 25 },
                      { day: 'Mar', s: 85, r: 35 },
                      { day: 'Mié', s: 70, r: 20 },
                      { day: 'Jue', s: 90, r: 40 },
                      { day: 'Vie', s: 100, r: 50 },
                      { day: 'Sáb', s: 110, r: 60 }
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-3.5 bg-[#FF5A36] rounded-t" style={{ height: `${bar.s * 0.7}px` }} />
                        <div className="w-3.5 bg-slate-800 dark:bg-slate-300 rounded-t -mt-1" style={{ height: `${bar.r * 0.5}px` }} />
                        <span className="text-[10px] text-slate-400">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Meta Mensual ($18,000)</span>
                    <strong className="text-emerald-500 font-bold">82.7%</strong>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF5A36] h-full rounded-full" style={{ width: '82.7%' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Live Appointments Table & Quick Action Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left/Center Table (8 Cols) */}
              <div className={`lg:col-span-8 rounded-2xl p-6 border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
              }`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-base font-bold">Actividad & Citas en Vivo</h2>
                      <span className="text-xs text-slate-400">Sincronización en tiempo real con recepción y WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sincronizado API
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {appointments.length === 0 ? (
                      <div className="text-center py-10 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center mx-auto">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold">¡Tu Agenda está lista para recibir citas!</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Comparte tu enlace público de reservas con tus clientas o recibe citas automáticas por WhatsApp para que aparezcan aquí.
                        </p>
                        <div className="pt-2 flex justify-center gap-2">
                          <Link
                            to="/reservas"
                            target="_blank"
                            className="bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Probar Enlace de Citas
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs min-w-[550px]">
                        <thead className="border-b border-black/5 dark:border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3">Hora</th>
                            <th className="py-3">Clienta</th>
                            <th className="py-3">Servicio</th>
                            <th className="py-3">Especialista</th>
                            <th className="py-3">Estado</th>
                            <th className="py-3 text-right">Fórmula / CRM</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                          {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 font-mono font-bold text-[#FF5A36]">{apt.time}</td>
                              <td className="py-3.5">
                                <strong className="block">{apt.client_name}</strong>
                                <span className="text-[11px] text-slate-400">{apt.client_phone}</span>
                              </td>
                              <td className="py-3.5">{apt.service_name}</td>
                              <td className="py-3.5">{apt.stylist_name}</td>
                              <td className="py-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  apt.status === 'en_atencion'
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                    : apt.status === 'completada'
                                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-extrabold'
                                    : apt.status === 'cobrada'
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                }`}>
                                  {apt.status === 'en_atencion' ? '● En Sillón' : apt.status === 'completada' ? '💳 Por Cobrar en Caja' : apt.status === 'cobrada' ? '✓ Cobrada' : 'Confirmada WA'}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {apt.status === 'completada' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cl = clients.find(c => c.full_name === apt.client_name);
                                        if (cl) setPosInitialClient(cl);
                                        setActiveTab('pos');
                                      }}
                                      className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all inline-flex items-center gap-1 shadow-sm"
                                      title="Cobrar servicio en el Punto de Venta POS y liquidar comisión"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" /> Cobrar en POS
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cl = clients.find(c => c.full_name === apt.client_name) || clients[0];
                                      if (cl) setSelectedClientForFormula(cl);
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all inline-flex items-center gap-1.5 ${
                                      theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                                    }`}
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#FF5A36]" /> Ficha 360°
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-slate-400 flex justify-between items-center mt-4">
                  <span>Mostrando {appointments.length} citas registradas</span>
                  <span>BeautyFlow AI SaaS</span>
                </div>
              </div>

              {/* Right: Simulated WhatsApp AI Live Box (4 Cols) */}
              <div className={`lg:col-span-4 rounded-2xl p-6 border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
              }`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-xs block">WhatsApp IA Bot</strong>
                        <span className="text-[10px] text-emerald-500 font-bold">● Atendiendo en vivo</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {chatMessages.slice(-3).map((msg, i) => (
                      <div key={i} className={`p-2.5 rounded-xl text-xs ${
                        msg.sender === 'client'
                          ? theme === 'dark' ? 'bg-[#1E222B] text-slate-200' : 'bg-[#F0F2F7] text-slate-800'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        <span className="font-bold text-[10px] block opacity-80 mb-0.5">
                          {msg.sender === 'client' ? 'Clienta' : 'Bot BeautyFlow IA'}
                        </span>
                        <p className="leading-snug">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('whatsapp')}
                    className="w-full text-center text-xs font-bold text-[#FF5A36] hover:underline"
                  >
                    Abrir Asistente WhatsApp Completo →
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: AGENDA & CALENDARIO
            ========================================================================= */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`p-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                    theme === 'dark' ? 'bg-[#1A2133] border-white/10 text-white hover:border-[#FF5A36]' : 'bg-[#F0F2F7] border-black/5 text-slate-800 hover:border-[#FF5A36]'
                  }`}
                  title="Volver a Overview"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 rotate-45" />
                  <span>Volver</span>
                </button>
                <div>
                  <h2 className="text-lg font-bold">Agenda & Columnas por Especialista</h2>
                  <p className="text-xs text-slate-400">Control visual de turnos, tiempos y estados de atención.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNewAppointmentOpen(true)}
                className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30"
              >
                <Plus className="w-4 h-4" /> Agendar Cita
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stylists.map((sty) => {
                const sApts = appointments.filter(a => a.stylist_name === sty.name || a.stylist_id === sty.id);
                return (
                  <div key={sty.id} className={`rounded-2xl p-5 border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center gap-3 pb-3 border-b border-black/5 dark:border-white/10 mb-4">
                        <img src={sty.photo_url} alt={sty.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF5A36]" />
                        <div>
                          <strong className="text-sm block">{sty.name}</strong>
                          <span className="text-xs text-slate-400">{sty.specialty}</span>
                          <span className="text-[11px] text-[#FF5A36] font-bold block mt-0.5">{sApts.length} turnos hoy</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {sApts.map((apt) => (
                          <div key={apt.id} className={`p-3.5 rounded-xl border space-y-2 ${
                            theme === 'dark' ? 'bg-[#1A2133] border-white/10' : 'bg-[#F9FAFC] border-black/5'
                          }`}>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono font-bold text-[#FF5A36]">{apt.time}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                                {apt.status}
                              </span>
                            </div>
                            <div>
                              <strong className="text-xs block">{apt.client_name}</strong>
                              <span className="text-[11px] text-slate-400">{apt.service_name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 dark:border-white/10 mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setNewStylist(sty.name);
                          setIsNewAppointmentOpen(true);
                        }}
                        className="text-xs text-[#FF5A36] font-bold hover:underline"
                      >
                        + Agregar cita a {sty.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: CRM COLORIMETRÍA 360°
            ========================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight">CRM & Expedientes de Colorimetría 360°</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF5A36]/10 text-[#FF5A36]">
                    {clients.filter(c => c.full_name.toLowerCase().includes(searchTermClient.toLowerCase()) || c.phone_whatsapp.includes(searchTermClient)).length} clientas
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Guarda fórmulas exactas de tinte, volúmenes de oxidante, historial de citas y notas de diagnóstico.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTermClient}
                    onChange={(e) => setSearchTermClient(e.target.value)}
                    placeholder="Buscar por nombre o teléfono..."
                    className={`w-full border rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewClient}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 whitespace-nowrap transition-all"
                >
                  <Plus className="w-4 h-4" /> Agregar Clienta
                </button>
              </div>
            </div>

            {clients.filter(c => c.full_name.toLowerCase().includes(searchTermClient.toLowerCase()) || c.phone_whatsapp.includes(searchTermClient)).length === 0 ? (
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5'
              }`}>
                <Users className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold">No se encontraron clientas</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchTermClient ? `No hay resultados para "${searchTermClient}"` : 'Aún no tienes clientas registradas en el CRM.'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenNewClient}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30"
                >
                  <Plus className="w-4 h-4" /> Registrar Nueva Clienta
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients
                  .filter(c => c.full_name.toLowerCase().includes(searchTermClient.toLowerCase()) || c.phone_whatsapp.includes(searchTermClient))
                  .map((client) => (
                    <div key={client.id} className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      theme === 'dark' ? 'bg-[#141926] border-white/10 hover:border-white/20' : 'bg-white border-black/5 hover:border-black/15 shadow-sm'
                    }`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-sm font-bold block">{client.full_name}</strong>
                            <span className="text-xs text-slate-400 block">{client.phone_whatsapp}</span>
                            {client.email && <span className="text-[10px] text-slate-500 block truncate">{client.email}</span>}
                          </div>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            client.status === 'vip' 
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : client.status === 'frecuente'
                              ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                              : 'bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20'
                          }`}>
                            {client.status}
                          </span>
                        </div>

                        <div className={`grid grid-cols-2 gap-2 text-xs p-3 rounded-xl ${
                          theme === 'dark' ? 'bg-[#0E121B]' : 'bg-[#F9FAFC]'
                        }`}>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Visitas:</span>
                            <strong>{client.visits_count} citas</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Total Facturado:</span>
                            <strong className="text-emerald-500">{formatCurrency(client.total_spent_usd || 0, salonCurrency)}</strong>
                          </div>
                        </div>

                        {client.allergies && (
                          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-500">
                            <span className="font-bold">⚠️ Diagnóstico / Alergias:</span> {client.allergies}
                          </div>
                        )}

                        {client.formulas && client.formulas.length > 0 ? (
                          <div className="p-3 rounded-xl bg-[#FF5A36]/5 border border-[#FF5A36]/20 text-xs space-y-1">
                            <div className="text-[10px] text-[#FF5A36] font-bold uppercase">Última Mezcla Guardada:</div>
                            <p className="font-mono text-[11px] line-clamp-2">{client.formulas[0].formula_text}</p>
                            <div className="text-[10px] text-slate-400 flex justify-between pt-1">
                              <span>{client.formulas[0].developer_volume} • {client.formulas[0].exposure_minutes} min</span>
                              <span className="text-emerald-500 font-bold">{client.formulas[0].created_at}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic p-2 text-center">
                            Sin fórmulas técnicas guardadas
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-black/5 dark:border-white/10 mt-4 flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedClientForFormula(client)}
                          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            theme === 'dark' ? 'bg-[#1E222B] hover:bg-[#FF5A36] text-white' : 'bg-[#F0F2F7] hover:bg-[#FF5A36] hover:text-white text-slate-800'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" /> Ficha 360°
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedClientForFormula(client);
                            setIsNewFormulaModalOpen(true);
                          }}
                          className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-2.5 py-2 rounded-xl"
                          title="Agregar fórmula de tinte"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditClient(client)}
                          className={`p-2 rounded-xl border transition-all ${
                            theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                          }`}
                          title="Editar datos de clienta"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
                          title="Eliminar clienta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            VIEW 4: POS & CAJA & LIQUIDACIÓN (NUEVO MOTOR PROFESIONAL)
            ========================================================================= */}
        {activeTab === 'pos' && (
          <PosCashRegisterPage
            theme={theme}
            salonName={salonName}
            salonCurrency={salonCurrency}
            services={services}
            products={products}
            stylists={stylists}
            clients={clients}
            ownerName={ownerName}
            initialCartClient={posInitialClient}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* =========================================================================
            VIEW 5: TABLERO DE MENSAJES & WHATSAPP OMNICANAL EN VIVO
            ========================================================================= */}
        {activeTab === 'whatsapp' && (
          <MessagesBoardPage
            theme={theme}
            salonName={salonName}
            salonPhone={salonPhone}
            salonEmail={ownerEmail}
            aiSettings={aiSettings}
            clients={clients}
            appointments={appointments}
            stylists={stylists}
            services={services}
            onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
            onOpenPosWithClient={(client) => {
              setPosInitialClient(client);
              setActiveTab('pos');
            }}
            onUpdateAiSettings={(newSettings) => setAiSettings(prev => prev ? ({ ...prev, ...newSettings }) : null)}
          />
        )}

        {/* =========================================================================
            VIEW 6: CONFIGURACIÓN DEL AGENTE IA & WHATSAPP (MULTI-TENANT)
            ========================================================================= */}
        {activeTab === 'ai_settings' && aiSettings && (
          <div className="space-y-6">
            
            {/* Top AI Header Banner with Save Button */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight">
                      Configuración del Agente IA • {aiSettings.agent_name}
                    </h2>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      aiSettings.is_active 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${aiSettings.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      {aiSettings.is_active ? 'Agente Activo en WhatsApp' : 'Agente Pausado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Personaliza la identidad, el tono, las políticas de reserva y el prompt de tu asistente de IA.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {aiSettingsSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> ¡Guardado con éxito!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSaveAiSettings()}
                  disabled={isSavingAiSettings}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-[#FF5A36]/30 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingAiSettings ? 'Guardando...' : 'Guardar Configuración'}</span>
                </button>
              </div>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Identidad y Personalidad */}
                <div className={`p-6 rounded-2xl border space-y-5 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                      <h3 className="text-sm font-bold">Identidad & Tono de Comunicación</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <span className="text-slate-400 font-medium">Estado:</span>
                      <input
                        type="checkbox"
                        checked={aiSettings.is_active}
                        onChange={(e) => setAiSettings({ ...aiSettings, is_active: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nombre del Asistente</label>
                      <input
                        type="text"
                        value={aiSettings.agent_name}
                        onChange={(e) => setAiSettings({ ...aiSettings, agent_name: e.target.value })}
                        placeholder="Ej: Flowy, Bella, Sofía..."
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Idioma de Atención</label>
                      <select
                        value={aiSettings.language}
                        onChange={(e) => setAiSettings({ ...aiSettings, language: e.target.value })}
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      >
                        <option value="es">Español (Latinoamérica / España)</option>
                        <option value="en">Inglés (English)</option>
                        <option value="pt">Portugués (Português)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Tono y Personalidad del Asistente</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          id: 'elegante_calido',
                          title: 'Elegante & Cálido',
                          desc: 'Lenguaje refinado, acogedor y enfocado en exclusividad y bienestar.'
                        },
                        {
                          id: 'profesional_formal',
                          title: 'Profesional & Directo',
                          desc: 'Respuestas ejecutivas, precisas, con enfoque en tiempos y orden.'
                        },
                        {
                          id: 'cercano_juvenil',
                          title: 'Cercano & Dinámico',
                          desc: 'Estilo amigable, fresco, emojis vibrantes y tono juvenil.'
                        }
                      ].map((preset) => {
                        const isSelected = aiSettings.personality_tone === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setAiSettings({ ...aiSettings, personality_tone: preset.id as any })}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-[#FF5A36] bg-[#FF5A36]/10 text-white shadow-sm'
                                : theme === 'dark'
                                  ? 'border-white/5 bg-[#0E121B] text-slate-400 hover:border-white/20'
                                  : 'border-black/5 bg-[#F9FAFC] text-slate-600 hover:border-black/20'
                            }`}
                          >
                            <strong className={`text-xs block mb-1 ${isSelected ? 'text-[#FF5A36]' : ''}`}>
                              {preset.title}
                            </strong>
                            <p className="text-[11px] leading-tight opacity-80">{preset.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Cerebro & Prompt Maestro */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 border-b pb-3 border-black/5 dark:border-white/10">
                    <Bot className="w-4 h-4 text-[#FF5A36]" />
                    <h3 className="text-sm font-bold">Prompt Maestro & Directrices del Salón</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Instrucciones del Sistema (System Prompt)
                    </label>
                    <textarea
                      rows={4}
                      value={aiSettings.system_prompt_custom}
                      onChange={(e) => setAiSettings({ ...aiSettings, system_prompt_custom: e.target.value })}
                      placeholder="Indica las directrices obligatorias para la IA..."
                      className={`w-full border rounded-xl p-3 text-xs leading-relaxed focus:outline-none focus:border-[#FF5A36] font-mono ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      💡 El modelo seguirá estas instrucciones al responder a tus clientas por WhatsApp.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Descripción & Especialidades del Salón
                      </label>
                      <input
                        type="text"
                        value={aiSettings.business_bio}
                        onChange={(e) => setAiSettings({ ...aiSettings, business_bio: e.target.value })}
                        placeholder="Ej: Salón de alta peluquería y colorimetría..."
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Dirección, Parqueadero & Referencias
                      </label>
                      <input
                        type="text"
                        value={aiSettings.address_instructions || ''}
                        onChange={(e) => setAiSettings({ ...aiSettings, address_instructions: e.target.value })}
                        placeholder="Ej: Calle 10 # 43E-22. Parqueadero gratuito."
                        className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Política de Cancelación o Reprogramación
                    </label>
                    <input
                      type="text"
                      value={aiSettings.cancellation_policy}
                      onChange={(e) => setAiSettings({ ...aiSettings, cancellation_policy: e.target.value })}
                      placeholder="Ej: Puedes cancelar con al menos 4 horas de anticipación."
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Preguntas Frecuentes (FAQs) */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#FF5A36]" />
                      <h3 className="text-sm font-bold">Preguntas Frecuentes del Salón (FAQs)</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">
                      {aiSettings.faqs?.length || 0} FAQs configuradas
                    </span>
                  </div>

                  {/* List of FAQs */}
                  <div className="space-y-2.5">
                    {aiSettings.faqs && aiSettings.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex justify-between items-start gap-3 ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/5' : 'bg-[#F9FAFC] border-black/5'
                        }`}
                      >
                        <div className="space-y-1">
                          <strong className="text-xs text-[#FF5A36] block">❓ {faq.pregunta}</strong>
                          <p className="text-xs text-slate-300 leading-relaxed">💡 {faq.respuesta}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-slate-400 hover:text-red-400 p-1 transition-colors"
                          title="Eliminar FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New FAQ Form */}
                  <div className={`p-4 rounded-xl border border-dashed space-y-3 ${
                    theme === 'dark' ? 'border-white/10 bg-[#0E121B]/50' : 'border-black/10 bg-[#F5F6FA]'
                  }`}>
                    <span className="text-xs font-bold text-slate-400 block">+ Añadir Nueva Pregunta Frecuente</span>
                    <input
                      type="text"
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      placeholder="Ej: ¿Atienden a domicilio o con cita previa?"
                      className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                      }`}
                    />
                    <input
                      type="text"
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      placeholder="Ej: Solo atendemos en sede con cita previa para garantizar tu exclusividad."
                      className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      disabled={!newFaqQuestion.trim() || !newFaqAnswer.trim()}
                      className="bg-[#12151B] dark:bg-[#252B37] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 disabled:opacity-40 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Guardar FAQ
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 4. Políticas de Reserva & Depósitos */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 border-b pb-3 border-black/5 dark:border-white/10">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold">Agendamiento & Depósitos (Abonos)</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="block font-semibold">Agendamiento Autónomo por Chat</strong>
                        <span className="text-[11px] text-slate-400">Permite a la IA reservar citas en tiempo real</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiSettings.booking_enabled}
                        onChange={(e) => setAiSettings({ ...aiSettings, booking_enabled: e.target.checked })}
                        className="w-4 h-4 text-[#FF5A36] rounded"
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-black/5 dark:border-white/5">
                      <div>
                        <strong className="block font-semibold">Exigir Abono Previo (Anticipo)</strong>
                        <span className="text-[11px] text-slate-400">Evita plantones cobrando un adelanto</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiSettings.requires_deposit}
                        onChange={(e) => setAiSettings({ ...aiSettings, requires_deposit: e.target.checked })}
                        className="w-4 h-4 text-[#FF5A36] rounded"
                      />
                    </div>

                    {aiSettings.requires_deposit && (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Tipo de Abono</label>
                            <select
                              value={aiSettings.deposit_type}
                              onChange={(e) => setAiSettings({ ...aiSettings, deposit_type: e.target.value as any })}
                              className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF5A36] ${
                                theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                              }`}
                            >
                              <option value="fixed">Monto Fijo ($)</option>
                              <option value="percentage">Porcentaje (%)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                              Valor ({aiSettings.deposit_type === 'fixed' ? `$ ${salonCurrency || 'COP'}` : '%'})
                            </label>
                            <input
                              type="number"
                              value={aiSettings.deposit_value}
                              onChange={(e) => setAiSettings({ ...aiSettings, deposit_value: parseFloat(e.target.value) || 0 })}
                              className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF5A36] ${
                                theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Instrucciones y Datos de Transferencia
                          </label>
                          <textarea
                            rows={2}
                            value={aiSettings.payment_instructions || ''}
                            onChange={(e) => setAiSettings({ ...aiSettings, payment_instructions: e.target.value })}
                            placeholder="Cuentas de Nequi, Daviplata, Zelle, Bizum o link de pago..."
                            className={`w-full border rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Canales de Mensajería & Conectividad Zernio */}
                <div className={`p-6 rounded-2xl border space-y-5 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      <h3 className="text-sm font-bold">Canales de Mensajería & Zernio</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Zernio Gateway
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Canal 1: WhatsApp */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden ${
                      aiSettings.zernio_connected
                        ? 'border-emerald-500/40 bg-emerald-500/5'
                        : 'border-white/10 bg-[#0E121B]'
                    }`}>
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                          aiSettings.zernio_connected
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}>
                          <MessageCircle className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-white">WhatsApp Business</strong>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              aiSettings.zernio_connected
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-slate-400'
                            }`}>
                              Coexistencia
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 break-words">
                            {aiSettings.zernio_connected ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                ● Conectado ({aiSettings.whatsapp_phone_number || 'Canal Activo'})
                              </span>
                            ) : (
                              'Sin cuentas conectadas. Haz clic en Conectar para vincular tu WhatsApp.'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 w-full sm:w-auto">
                        {aiSettings.zernio_connected ? (
                          <>
                            <button
                              type="button"
                              onClick={async () => {
                                const activeTenant = localStorage.getItem('bf_tenant_active');
                                const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                                const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                                const connectUrl = await api.zernio.getConnectUrl(tid, 'whatsapp');
                                window.open(connectUrl, 'zernio_connect', 'width=560,height=760,top=100,left=100,scrollbars=yes,status=1');
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Reconectar</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated: TenantAISettings = {
                                  ...aiSettings,
                                  zernio_connected: false,
                                  zernio_status: 'disconnected'
                                };
                                setAiSettings(updated);
                                try {
                                  await api.updateTenantAISettings(updated);
                                } catch (e) {}
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex-1 sm:flex-initial text-center"
                            >
                              Desconectar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const activeTenant = localStorage.getItem('bf_tenant_active');
                              const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                              const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                              const width = 560;
                              const height = 760;
                              const left = window.screen.width / 2 - width / 2;
                              const top = window.screen.height / 2 - height / 2;

                              const connectUrl = await api.zernio.getConnectUrl(tid, 'whatsapp');
                              const popup = window.open(
                                connectUrl,
                                'zernio_whatsapp_connect',
                                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
                              );

                              // Monitorear cuando se cierre el popup
                              const checkInterval = setInterval(async () => {
                                if (popup && popup.closed) {
                                  clearInterval(checkInterval);
                                  try {
                                    // Verificar con Zernio API si realmente se conectó una cuenta
                                    const accounts = await api.zernio.getAccounts();
                                    const waAccount = accounts.find((a: any) => a.platform === 'whatsapp' || a.provider === 'whatsapp') || accounts[0];
                                    if (waAccount) {
                                      if (aiSettings) {
                                        const updated: TenantAISettings = {
                                          ...aiSettings,
                                          whatsapp_phone_number: waAccount.username || waAccount.phoneNumber || salonPhone || '+57 311 419 5123',
                                          zernio_connected: true,
                                          zernio_status: 'connected',
                                          zernio_connection_mode: 'coexistence'
                                        };
                                        setAiSettings(updated);
                                        await api.updateTenantAISettings(updated);
                                      }
                                    }
                                  } catch (e) {
                                    console.warn('Account verification notice:', e);
                                  }
                                }
                              }, 1200);
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer w-full sm:w-auto"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                            <span>Conectar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Canal 2: Instagram Direct */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden ${
                      aiSettings.instagram_connected
                        ? 'border-pink-500/40 bg-pink-500/5'
                        : 'border-white/10 bg-[#0E121B]'
                    }`}>
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                          aiSettings.instagram_connected
                            ? 'bg-pink-500/20 text-pink-400 border-pink-500/30'
                            : 'bg-white/5 text-pink-400 border-white/10'
                        }`}>
                          <Instagram className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-white">Instagram Direct</strong>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              aiSettings.instagram_connected
                                ? 'bg-pink-500/20 text-pink-400'
                                : 'bg-white/10 text-slate-400'
                            }`}>
                              Meta Graph API
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 break-words">
                            {aiSettings.instagram_connected ? (
                              <span className="text-pink-400 font-semibold flex items-center gap-1">
                                ● Conectado ({aiSettings.instagram_username || '@salon_oficial'})
                              </span>
                            ) : (
                              'Conecta tu cuenta profesional de Instagram para responder DMs automáticamente con IA.'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 w-full sm:w-auto">
                        {aiSettings.instagram_connected ? (
                          <>
                            <button
                              type="button"
                              onClick={async () => {
                                const activeTenant = localStorage.getItem('bf_tenant_active');
                                const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                                const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                                const connectUrl = await api.zernio.getConnectUrl(tid, 'instagram');
                                window.open(connectUrl, 'zernio_instagram_connect', 'width=560,height=760,top=100,left=100,scrollbars=yes,status=1');
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Reconectar</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated: TenantAISettings = {
                                  ...aiSettings,
                                  instagram_connected: false,
                                  instagram_status: 'disconnected'
                                };
                                setAiSettings(updated);
                                try {
                                  await api.updateTenantAISettings(updated);
                                } catch (e) {}
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex-1 sm:flex-initial text-center cursor-pointer"
                            >
                              Desconectar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const activeTenant = localStorage.getItem('bf_tenant_active');
                              const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                              const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                              const width = 560;
                              const height = 760;
                              const left = window.screen.width / 2 - width / 2;
                              const top = window.screen.height / 2 - height / 2;

                              const connectUrl = await api.zernio.getConnectUrl(tid, 'instagram');
                              const popup = window.open(
                                connectUrl,
                                'zernio_instagram_connect',
                                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
                              );

                              const checkInterval = setInterval(async () => {
                                if (popup && popup.closed) {
                                  clearInterval(checkInterval);
                                  try {
                                    const accounts = await api.zernio.getAccounts();
                                    const igAccount = accounts.find((a: any) => a.platform === 'instagram' || a.provider === 'instagram');
                                    const updated: TenantAISettings = {
                                      ...aiSettings,
                                      instagram_username: igAccount?.username ? `@${igAccount.username}` : `@${salonName.toLowerCase().replace(/\s+/g, '_')}`,
                                      instagram_connected: true,
                                      instagram_status: 'connected'
                                    };
                                    setAiSettings(updated);
                                    await api.updateTenantAISettings(updated);
                                  } catch (e) {
                                    console.warn('IG account verification notice:', e);
                                  }
                                }
                              }, 1200);
                            }}
                            className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/25 transition-all cursor-pointer w-full sm:w-auto"
                          >
                            <Instagram className="w-3.5 h-3.5 shrink-0" />
                            <span>Conectar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Canal 3: Facebook Messenger */}
                    <div className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden ${
                      aiSettings.messenger_connected
                        ? 'border-blue-500/40 bg-blue-500/5'
                        : 'border-white/10 bg-[#0E121B]'
                    }`}>
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                          aiSettings.messenger_connected
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-white/5 text-blue-400 border-white/10'
                        }`}>
                          <MessageSquare className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm font-bold text-white">Facebook Messenger</strong>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              aiSettings.messenger_connected
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-white/10 text-slate-400'
                            }`}>
                              Página de Facebook
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 break-words">
                            {aiSettings.messenger_connected ? (
                              <span className="text-blue-400 font-semibold flex items-center gap-1">
                                ● Conectado ({aiSettings.messenger_page_name || salonName})
                              </span>
                            ) : (
                              'Vincula tu Fanpage de Facebook para que Flowy IA atienda la mensajería de tu página.'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 w-full sm:w-auto">
                        {aiSettings.messenger_connected ? (
                          <>
                            <button
                              type="button"
                              onClick={async () => {
                                const activeTenant = localStorage.getItem('bf_tenant_active');
                                const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                                const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                                const connectUrl = await api.zernio.getConnectUrl(tid, 'whatsapp');
                                window.open(connectUrl, 'zernio_messenger_connect', 'width=560,height=760,top=100,left=100,scrollbars=yes,status=1');
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial cursor-pointer"
                            >
                              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                              <span>Reconectar</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated: TenantAISettings = {
                                  ...aiSettings,
                                  messenger_connected: false,
                                  messenger_status: 'disconnected'
                                };
                                setAiSettings(updated);
                                try {
                                  await api.updateTenantAISettings(updated);
                                } catch (e) {}
                              }}
                              className="text-xs font-bold px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex-1 sm:flex-initial text-center cursor-pointer"
                            >
                              Desconectar
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              const activeTenant = localStorage.getItem('bf_tenant_active');
                              const tenantObj = activeTenant ? JSON.parse(activeTenant) : null;
                              const tid = tenantObj?.id || '00000000-0000-0000-0000-000000000001';
                              const width = 560;
                              const height = 760;
                              const left = window.screen.width / 2 - width / 2;
                              const top = window.screen.height / 2 - height / 2;

                              const connectUrl = await api.zernio.getConnectUrl(tid, 'whatsapp');
                              const popup = window.open(
                                connectUrl,
                                'zernio_messenger_connect',
                                `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
                              );

                              const checkInterval = setInterval(async () => {
                                if (popup && popup.closed) {
                                  clearInterval(checkInterval);
                                  try {
                                    const accounts = await api.zernio.getAccounts();
                                    const fbAccount = accounts.find((a: any) => a.platform === 'facebook' || a.provider === 'facebook');
                                    const updated: TenantAISettings = {
                                      ...aiSettings,
                                      messenger_page_name: fbAccount?.name || `${salonName} Official`,
                                      messenger_connected: true,
                                      messenger_status: 'connected'
                                    };
                                    setAiSettings(updated);
                                    await api.updateTenantAISettings(updated);
                                  } catch (e) {
                                    console.warn('FB account verification notice:', e);
                                  }
                                }
                              }, 1200);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all cursor-pointer w-full sm:w-auto"
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span>Conectar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Intervención Humana */}
                    <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <strong className="block font-semibold">Modo "Intervención Humana"</strong>
                          <span className="text-[11px] text-slate-400">Pausa el bot si una recepcionista responde manualmente</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={aiSettings.human_takeover_active}
                          onChange={(e) => setAiSettings({ ...aiSettings, human_takeover_active: e.target.checked })}
                          className="w-4 h-4 text-[#FF5A36] rounded"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Pausa automática durante: <strong className="text-white">{aiSettings.human_takeover_timeout_minutes} minutos</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Enlace Directo al Centro de Plantillas Oficiales */}
                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold block">Centro de Plantillas WhatsApp & Email</strong>
                      <span className="text-[11px] text-slate-400">Gestiona tus plantillas HSM aprobadas por Meta, correos HTML y matriz de horarios.</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavigateTab('templates')}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
                  >
                    <span>Abrir Plantillas</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 7. Recordatorios & Reseñas Google */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 border-b pb-3 border-black/5 dark:border-white/10">
                    <Clock className="w-4 h-4 text-[#FF5A36]" />
                    <h3 className="text-sm font-bold">Recordatorios & Reseñas Google</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="block font-semibold">Recordatorio Automático por WhatsApp</strong>
                        <span className="text-[11px] text-slate-400">Envía mensaje interactivo antes del servicio</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={aiSettings.send_reminder_whatsapp}
                        onChange={(e) => setAiSettings({ ...aiSettings, send_reminder_whatsapp: e.target.checked })}
                        className="w-4 h-4 text-[#FF5A36] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Horas de Anticipación ({aiSettings.reminder_hours_before} horas antes)
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={24}
                        value={aiSettings.reminder_hours_before}
                        onChange={(e) => setAiSettings({ ...aiSettings, reminder_hours_before: parseInt(e.target.value) || 2 })}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Enlace de Reseña de Google Maps
                      </label>
                      <input
                        type="text"
                        value={aiSettings.google_maps_review_url || ''}
                        onChange={(e) => setAiSettings({ ...aiSettings, google_maps_review_url: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className={`w-full border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        El bot pedirá una reseña 5 estrellas a clientas satisfechas 24h después de su cita.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Proveedor de IA & API Key Personalizada (Opcional) */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 border-b pb-3 border-black/5 dark:border-white/10">
                    <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                    <h3 className="text-sm font-bold">Motor de Inteligencia Artificial (Opcional)</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <strong className="block">BeautyFlow Cloud AI (Google Gemini 1.5 Flash)</strong>
                          <span className="text-[10px] text-slate-400">Activo y gestionado automáticamente sin costo adicional</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Por Defecto
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Tu propia API Key de Google AI Studio / Gemini (Opcional para Agencias)
                      </label>
                      <input
                        type="password"
                        placeholder="AIzaSyD... (Dejar en blanco para usar la IA oficial de BeautyFlow)"
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F9FAFC] border-black/10 text-slate-900'
                        }`}
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        💡 Si eres una agencia o deseas utilizar tu propia cuota y facturación directa en Google Cloud, ingresa tu API Key aquí.
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 6: GESTIÓN DE NEGOCIO (EQUIPO, SERVICIOS & PRODUCTOS)
            ========================================================================= */}
        {activeTab === 'catalog_team' && (
          <div className="space-y-6">
            
            {/* Header with Sub-tabs and Back button */}
            <div className={`p-6 rounded-2xl border flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
              theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`p-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                    theme === 'dark' ? 'bg-[#1A2133] border-white/10 text-white hover:border-[#FF5A36]' : 'bg-[#F0F2F7] border-black/5 text-slate-800 hover:border-[#FF5A36]'
                  }`}
                  title="Volver a Overview"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 rotate-45" />
                  <span>Volver</span>
                </button>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-[#FF5A36]" />
                    Gestión del Salón: Equipo, Servicios & Stock
                  </h2>
                  <p className="text-xs text-slate-400">
                    Administra tu staff de estilistas, el catálogo de servicios con tarifas y el inventario retail.
                  </p>
                </div>
              </div>

              {/* Sub-tab Pill Switcher */}
              <div className={`p-1 rounded-2xl border flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full shrink-0 ${
                theme === 'dark' ? 'bg-[#0E121B] border-white/10' : 'bg-[#F5F6FA] border-black/5'
              }`}>
                <button
                  type="button"
                  onClick={() => setCatalogSubTab('stylists')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                    catalogSubTab === 'stylists'
                      ? 'bg-[#FF5A36] text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Profesionales ({stylists.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogSubTab('services')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                    catalogSubTab === 'services'
                      ? 'bg-[#FF5A36] text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Servicios ({services.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogSubTab('categories')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                    catalogSubTab === 'categories'
                      ? 'bg-[#FF5A36] text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Categorías ({categories.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCatalogSubTab('products')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all ${
                    catalogSubTab === 'products'
                      ? 'bg-[#FF5A36] text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Productos & Stock ({products.length})</span>
                </button>
              </div>
            </div>

            {/* SUBTAB 1: PROFESIONALES / ESTILISTAS */}
            {catalogSubTab === 'stylists' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-bold">Equipo de Estilistas & Especialistas</h3>
                    <p className="text-xs text-slate-400">Control de porcentaje de comisiones por servicio y venta de productos.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewStylist}
                    className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Agregar Profesional
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stylists.map((sty) => (
                    <div
                      key={sty.id}
                      onClick={() => handleOpenStylistDetails(sty)}
                      className={`rounded-2xl p-5 border flex flex-col justify-between transition-all cursor-pointer group ${
                        theme === 'dark'
                          ? 'bg-[#141926] border-white/10 hover:border-[#FF5A36]/60 hover:shadow-xl hover:shadow-[#FF5A36]/10'
                          : 'bg-white border-black/5 hover:border-[#FF5A36]/60 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between pb-3 border-b border-black/5 dark:border-white/10 mb-4 gap-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={sty.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                              alt={sty.name}
                              className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-full object-cover border-2 border-[#FF5A36] group-hover:scale-105 transition-transform shrink-0 aspect-square"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-sm font-bold block truncate group-hover:text-[#FF5A36] transition-colors">{sty.name}</strong>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-[#FF5A36] transition-all shrink-0" />
                              </div>
                              <span className="text-xs text-slate-400 block truncate">{sty.specialty}</span>
                              {sty.email && <span className="text-[11px] text-[#FF5A36] block truncate font-mono">{sty.email}</span>}
                              {sty.phone && <span className="text-[10px] text-slate-500 block truncate">WhatsApp: {sty.phone}</span>}
                              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-0.5">
                                <Star className="w-3 h-3 fill-amber-400 shrink-0" />
                                <span>{sty.rating || '5.0'}</span>
                                <span className="text-slate-400 font-normal">({sty.reviews_count || 0} reseñas)</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            {sty.is_owner || sty.role === 'admin' ? (
                              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1 whitespace-nowrap">
                                👑 Dueña / Admin
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 whitespace-nowrap">
                                Colaborador
                              </span>
                            )}
                            {sty.attends_clients === false ? (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                                💼 Solo Gestión
                              </span>
                            ) : (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap">
                                ✂️ Atiende Citas
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Commission stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className={`p-2.5 rounded-xl border ${
                            theme === 'dark' ? 'bg-[#1A2133] border-white/5' : 'bg-[#F9FAFC] border-black/5'
                          }`}>
                            <span className="text-[10px] text-slate-400 block">Comisión Servicios</span>
                            <strong className="text-sm font-bold text-[#FF5A36]">{sty.commission_service_pct ?? 45}%</strong>
                          </div>
                          <div className={`p-2.5 rounded-xl border ${
                            theme === 'dark' ? 'bg-[#1A2133] border-white/5' : 'bg-[#F9FAFC] border-black/5'
                          }`}>
                            <span className="text-[10px] text-slate-400 block">Comisión Retail</span>
                            <strong className="text-sm font-bold text-emerald-500">{sty.commission_retail_pct ?? 10}%</strong>
                          </div>
                        </div>

                        {/* Service Categories Chips */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(sty.service_categories && sty.service_categories.length > 0 ? sty.service_categories : ['color', 'corte']).map(cat => {
                            const catLabels: Record<string, string> = {
                              color: '🎨 Color',
                              corte: '✂️ Corte',
                              keratina: '💆‍♀️ Keratina',
                              nails: '💅 Nails',
                              barberia: '💈 Barber',
                              spa: '🧖‍♀️ Spa'
                            };
                            return (
                              <span
                                key={cat}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20"
                              >
                                {catLabels[cat] || cat}
                              </span>
                            );
                          })}
                        </div>

                        {/* Availability Pill Summary */}
                        <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-xl bg-white/5 border border-white/5 mb-3">
                          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>{(sty.working_days || [1,2,3,4,5,6]).length} días/sem</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            (sty.blocked_dates && sty.blocked_dates.length > 0)
                              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                              : 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                          }`}>
                            {(sty.blocked_dates && sty.blocked_dates.length > 0)
                              ? `🌴 ${sty.blocked_dates.length} día(s) bloqueado(s)`
                              : '✅ 100% Disponible'}
                          </span>
                        </div>

                        {/* Quick detail hint */}
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-[#FF5A36] transition-colors py-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Expediente 360° (Citas & Comisiones)</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-between items-center gap-2 text-xs"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStylistAvailability(sty);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Gestionar días no disponibles y vacaciones"
                        >
                          <CalendarOff className="w-3.5 h-3.5" />
                          <span>Disponibilidad</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStylist(sty);
                            }}
                            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStylist(sty.id);
                            }}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 2: SERVICIOS */}
            {catalogSubTab === 'services' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-bold">Catálogo Oficial de Servicios</h3>
                    <p className="text-xs text-slate-400">Tarifas, tiempos de ejecución y requerimientos para el agendamiento y el bot IA.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewService}
                    className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Agregar Servicio
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                        theme === 'dark' ? 'bg-[#141926] border-white/10 hover:border-white/20' : 'bg-white border-black/5 hover:border-black/15 shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Foto de Referencia si existe */}
                        {srv.image_url && (
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-white/10 relative group">
                            <img
                              src={srv.image_url}
                              alt={srv.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20">
                            {srv.category}
                          </span>
                          <span className="text-base font-extrabold text-[#FF5A36]">
                            {formatCurrency(srv.price_usd ?? srv.price ?? srv.price_cop, salonCurrency)}
                          </span>
                        </div>

                        <strong className="text-sm font-bold block mb-1">{srv.name}</strong>
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                          {srv.description || 'Servicio profesional con productos de alta gama y asesoría personalizada.'}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-400 pb-3 border-b border-black/5 dark:border-white/10">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#FF5A36]" /> {srv.duration_minutes} min
                          </span>
                          {srv.requires_patch_test && (
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                              Prueba de Parche Requerida
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleEditService(srv)}
                          className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                            theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" /> Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold flex items-center gap-1 transition-all cursor-pointer hover:border-red-500/40"
                          title="Eliminar este servicio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: GESTIÓN DE CATEGORÍAS */}
            {catalogSubTab === 'categories' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-bold">Categorías de Servicios</h3>
                    <p className="text-xs text-slate-400">Organiza tus tratamientos, especialidades y filtros para el agendamiento público.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewCategory}
                    className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Nueva Categoría
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const servicesCount = services.filter(s => s.category === cat.slug || s.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                          theme === 'dark' ? 'bg-[#141926] border-white/10 hover:border-white/20' : 'bg-white border-black/5 hover:border-black/15 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/20 flex items-center justify-center text-xl">
                              {cat.icon || '✨'}
                            </div>
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                              {servicesCount} {servicesCount === 1 ? 'servicio' : 'servicios'}
                            </span>
                          </div>

                          <strong className="text-sm font-bold text-white block mb-1">{cat.name}</strong>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                            {cat.description || 'Categoría para clasificación de tratamientos en el catálogo y agendador.'}
                          </p>

                          <div className="text-[11px] font-mono text-slate-500 pb-3 border-b border-black/5 dark:border-white/10">
                            Slug: <span className="text-purple-400 font-semibold">{cat.slug}</span>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="pt-3 flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleEditCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                              theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUBTAB 4: PRODUCTOS & INVENTARIO */}
            {catalogSubTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-bold">Inventario Retail & Productos de Salón</h3>
                    <p className="text-xs text-slate-400">Control de stock, alertas de reposición, precios y margen de rentabilidad.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewProduct}
                    className="bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Agregar Producto
                  </button>
                </div>

                {/* Stock Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                  }`}>
                    <span className="text-xs text-slate-400 block">Total Referencias</span>
                    <strong className="text-xl font-bold">{products.length} productos</strong>
                  </div>
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                  }`}>
                    <span className="text-xs text-slate-400 block">Unidades en Stock</span>
                    <strong className="text-xl font-bold text-emerald-500">
                      {products.reduce((acc, p) => acc + (p.stock_quantity || 0), 0)} unidades
                    </strong>
                  </div>
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#141926] border-white/10' : 'bg-white border-black/5 shadow-sm'
                  }`}>
                    <span className="text-xs text-slate-400 block">Alertas de Stock Bajo</span>
                    <strong className="text-xl font-bold text-amber-500">
                      {products.filter(p => p.stock_quantity <= (p.min_stock_alert || 3)).length} productos
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => {
                    const isLowStock = prod.stock_quantity <= (prod.min_stock_alert || 3);

                    return (
                      <div
                        key={prod.id}
                        className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                          theme === 'dark' ? 'bg-[#141926] border-white/10 hover:border-white/20' : 'bg-white border-black/5 hover:border-black/15 shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {prod.brand} • {prod.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isLowStock 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {isLowStock ? '⚠️ Stock Bajo' : '✓ En Stock'}
                            </span>
                          </div>

                          <strong className="text-sm font-bold block mb-1">{prod.name}</strong>
                          <span className="font-mono text-[10px] text-slate-400 block mb-3">SKU: {prod.sku || 'N/A'}</span>

                          <div className="grid grid-cols-3 gap-2 text-xs mb-3 pb-3 border-b border-black/5 dark:border-white/10">
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2133]' : 'bg-[#F9FAFC]'}`}>
                              <span className="text-[9px] text-slate-400 block">Venta</span>
                              <strong className="text-xs font-bold text-[#FF5A36]">${prod.price_usd}</strong>
                            </div>
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2133]' : 'bg-[#F9FAFC]'}`}>
                              <span className="text-[9px] text-slate-400 block">Costo</span>
                              <strong className="text-xs font-bold">${prod.cost_price_usd || 0}</strong>
                            </div>
                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#1A2133]' : 'bg-[#F9FAFC]'}`}>
                              <span className="text-[9px] text-slate-400 block">Stock</span>
                              <strong className={`text-xs font-bold ${isLowStock ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {prod.stock_quantity} un.
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(prod)}
                            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                              theme === 'dark' ? 'bg-[#1E222B] border-white/10 hover:border-[#FF5A36] text-slate-300' : 'bg-[#F0F2F7] border-black/5 hover:border-[#FF5A36] text-slate-800'
                            }`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#FF5A36]" /> Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-semibold flex items-center gap-1 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            VIEW 7: CENTRO DE PLANTILLAS (WHATSAPP HSM & EMAIL HTML)
            ========================================================================= */}
        {activeTab === 'templates' && (
          <TemplatesManagerPage
            theme={theme}
            salonName={salonName}
            salonPhone={salonPhone}
            salonEmail={ownerEmail}
            aiSettings={aiSettings}
            onUpdateSettings={setAiSettings}
          />
        )}

        {/* =========================================================================
            VIEW 8: MOTOR DE FIDELIZACIÓN & REACTIVACIÓN (+35 DÍAS)
            ========================================================================= */}
        {activeTab === 'loyalty' && (
          <LoyaltyReactivationPage
            theme={theme}
            clients={clients}
            appointments={appointments}
            stylists={stylists}
            services={services}
            salonName={salonName}
            salonCurrency={salonCurrency}
            onOpenNewAppointmentWithClient={(c) => {
              setNewClientName(c.full_name);
              setNewClientPhone(c.phone_whatsapp);
              setIsNewAppointmentOpen(true);
            }}
          />
        )}

      </main>

      {/* =========================================================================
          MODALS (FICHA 360°, NUEVA FÓRMULA & NUEVA CITA)
          ========================================================================= */}
      {selectedClientForFormula && !isNewFormulaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div>
                <span className="text-[10px] text-[#FF5A36] font-bold uppercase tracking-wider">EXPEDIENTE 360° & FORMULACIÓN</span>
                <h3 className="text-lg font-bold">{selectedClientForFormula.full_name}</h3>
                <span className="text-xs text-slate-400">{selectedClientForFormula.phone_whatsapp}</span>
              </div>
              <button type="button" onClick={() => setSelectedClientForFormula(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedClientForFormula.formulas && selectedClientForFormula.formulas.length > 0 ? (
              <div className={`space-y-3 p-4 rounded-xl text-xs max-h-72 overflow-y-auto ${
                theme === 'dark' ? 'bg-[#0E121B]' : 'bg-[#F9FAFC]'
              }`}>
                {selectedClientForFormula.formulas.map((form, idx) => (
                  <div key={form.id || idx} className="p-3 bg-white dark:bg-[#141926] rounded-xl border border-black/5 dark:border-white/10 space-y-2 mb-2">
                    <div className="flex justify-between text-[10px] text-[#FF5A36] font-bold">
                      <span>Fórmula #{selectedClientForFormula.formulas!.length - idx}</span>
                      <span>{form.created_at}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mezcla Exacta:</span>
                      <strong className="font-mono text-xs block">{form.formula_text}</strong>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-black/5 dark:border-white/5">
                      <div><span className="text-slate-400 block text-[9px]">Oxidante:</span> <strong className="text-[#FF5A36]">{form.developer_volume}</strong></div>
                      <div><span className="text-slate-400 block text-[9px]">Tiempo:</span> <strong>{form.exposure_minutes} min</strong></div>
                      <div><span className="text-slate-400 block text-[9px]">Plex:</span> <strong className="text-emerald-500">Sí</strong></div>
                    </div>
                    {form.diagnostic_notes && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-black/5 dark:border-white/5">{form.diagnostic_notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl text-center text-xs text-slate-400">
                Esta clienta no tiene fórmulas registradas aún.
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsNewFormulaModalOpen(true)}
                className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30"
              >
                <Plus className="w-4 h-4" /> Agregar Nueva Fórmula
              </button>
              <button
                type="button"
                onClick={() => setSelectedClientForFormula(null)}
                className="bg-slate-200 dark:bg-slate-800 text-xs px-4 py-2 rounded-full font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NUEVA FÓRMULA */}
      {isNewFormulaModalOpen && selectedClientForFormula && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div>
                <span className="text-[10px] text-[#FF5A36] font-bold uppercase tracking-wider">NUEVA FÓRMULA DE TINTE</span>
                <h3 className="text-base font-bold">{selectedClientForFormula.full_name}</h3>
              </div>
              <button type="button" onClick={() => setIsNewFormulaModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mezcla Técnica de Tinte *</label>
                <input
                  type="text"
                  value={newFormulaText}
                  onChange={(e) => setNewFormulaText(e.target.value)}
                  className={`w-full border rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Oxidante</label>
                  <select
                    value={newDeveloperVol}
                    onChange={(e) => setNewDeveloperVol(e.target.value)}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    <option value="10 Vol">10 Vol</option>
                    <option value="20 Vol">20 Vol</option>
                    <option value="30 Vol">30 Vol</option>
                    <option value="40 Vol">40 Vol</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tiempo (Minutos)</label>
                  <input
                    type="number"
                    value={newExposureMin}
                    onChange={(e) => setNewExposureMin(Number(e.target.value))}
                    className={`w-full border rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Diagnóstico Capilar / Notas</label>
                <textarea
                  value={newDiagnosticNotes}
                  onChange={(e) => setNewDiagnosticNotes(e.target.value)}
                  rows={2}
                  className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFormulaModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingFormula}
                  className="bg-[#FF5A36] hover:bg-[#E54E07] disabled:opacity-50 text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingFormula ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar en Expediente</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA CITA MANUAL */}
      {isNewAppointmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <h3 className="text-base font-bold">Agendar Nueva Cita Manual</h3>
              <button type="button" onClick={() => setIsNewAppointmentOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre de la Clienta *</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ej. Daniela Ospina"
                  className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">WhatsApp (10 dígitos) *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={newClientPhone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewClientPhone(clean);
                  }}
                  placeholder="3009876543"
                  className={`w-full border rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Ingresa los 10 dígitos del celular</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Servicio *</label>
                <select
                  value={newService}
                  onChange={(e) => {
                    setNewService(e.target.value);
                    const matchedSrv = services.find(s => s.name === e.target.value);
                    if (matchedSrv) {
                      const qualified = stylists.filter(st => 
                        (st.service_ids && st.service_ids.includes(matchedSrv.id)) ||
                        (st.service_categories && st.service_categories.includes(matchedSrv.category)) ||
                        (st.specialty && st.specialty.toLowerCase().includes(matchedSrv.category))
                      );
                      if (qualified.length > 0) {
                        setNewStylist(qualified[0].name);
                      }
                    }
                  }}
                  className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({formatCurrency(s.price_usd ?? s.price ?? s.price_cop, salonCurrency)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold flex items-center justify-between">
                    <span>Especialista</span>
                    <span className="text-[9px] text-emerald-400 font-bold">Filtrado por servicio</span>
                  </label>
                  <select
                    value={newStylist}
                    onChange={(e) => setNewStylist(e.target.value)}
                    className={`w-full border rounded-lg p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    {stylists
                      .filter(st => {
                        const matchedSrv = services.find(s => s.name === newService);
                        if (!matchedSrv) return true;
                        if (st.service_ids && st.service_ids.includes(matchedSrv.id)) return true;
                        if (st.service_categories && st.service_categories.includes(matchedSrv.category)) return true;
                        if (st.specialty && st.specialty.toLowerCase().includes(matchedSrv.category)) return true;
                        return false;
                      })
                      .map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.specialty.split('&')[0].trim()})</option>
                      ))}
                  </select>
                </div>
                <div>
                  <TimePickerSelect
                    label="Hora *"
                    value={newTime}
                    onChange={setNewTime}
                    theme={theme}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAppointmentOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30"
                >
                  Agendar y Notificar WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN DEL NEGOCIO */}
      {isBusinessSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Configuración del Salón / Negocio</h3>
                  <span className="text-[11px] text-slate-400">Datos comerciales y horarios de atención</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsBusinessSettingsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const activeTenantRaw = localStorage.getItem('bf_tenant_active');
                if (activeTenantRaw) {
                  const activeTenant = JSON.parse(activeTenantRaw);
                  const updated: Tenant = {
                    ...activeTenant,
                    name: salonName,
                    phone: salonPhone,
                    address: salonAddress,
                    currency: salonCurrency,
                    business_hours: {
                      ...activeTenant.business_hours,
                      summary: salonHours
                    }
                  };
                  setActiveTenantObj(updated);
                  localStorage.setItem('bf_tenant_active', JSON.stringify(updated));
                  await api.updateTenant(updated);
                }
              } catch (err) {
                console.warn('Error saving business settings:', err);
              }
              setIsBusinessSettingsModalOpen(false);
              alert('✨ ¡Datos de tu negocio y teléfono de WhatsApp actualizados con éxito!');
            }} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre Comercial del Salón *</label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    value={salonPhone}
                    onChange={(e) => setSalonPhone(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Moneda Principal</label>
                  <select
                    value={salonCurrency}
                    onChange={(e) => setSalonCurrency(e.target.value as any)}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    <option value="COP">Peso Colombiano ($ COP)</option>
                    <option value="USD">Dólar Estadounidense ($ USD)</option>
                    <option value="MXN">Peso Mexicano ($ MXN)</option>
                    <option value="EUR">Euro (€ EUR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dirección & Sede</label>
                <input
                  type="text"
                  value={salonAddress}
                  onChange={(e) => setSalonAddress(e.target.value)}
                  placeholder="Ej. Calle 10 # 43E-22, El Poblado"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Horario de Atención General</label>
                <input
                  type="text"
                  value={salonHours}
                  onChange={(e) => setSalonHours(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBusinessSettingsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-full shadow-md text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Guardar Datos del Salón
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA / EDITAR CLIENTA */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">
                  {editingClient ? 'Editar Datos de Clienta' : 'Registrar Nueva Clienta'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsClientModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre Completo *</label>
                <input
                  type="text"
                  value={clientForm.full_name}
                  onChange={(e) => setClientForm({ ...clientForm, full_name: e.target.value })}
                  placeholder="Ej. Carolina Montoya"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">WhatsApp (10 dígitos) *</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={clientForm.phone_whatsapp}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setClientForm({ ...clientForm, phone_whatsapp: clean });
                    }}
                    placeholder="3101234567"
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Ingresa los 10 dígitos sin prefijo</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    placeholder="caro@gmail.com"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Estado de Fidelización</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value as any })}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    <option value="nuevo">Nueva Clienta</option>
                    <option value="frecuente">Frecuente</option>
                    <option value="vip">VIP Exclusiva</option>
                    <option value="en_riesgo">En Riesgo (Inactiva)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Cumpleaños</label>
                  <input
                    type="date"
                    value={clientForm.birthday}
                    onChange={(e) => setClientForm({ ...clientForm, birthday: e.target.value })}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Especialista de Preferencia</label>
                <select
                  value={clientForm.preferred_stylist_id}
                  onChange={(e) => setClientForm({ ...clientForm, preferred_stylist_id: e.target.value })}
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                >
                  {stylists.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Notas Diagnósticas / Alergias Previas</label>
                <textarea
                  rows={2}
                  value={clientForm.allergies}
                  onChange={(e) => setClientForm({ ...clientForm, allergies: e.target.value })}
                  placeholder="Sensibilidad en cuero cabelludo, decoloraciones previas, alergia a amoníaco..."
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingClient ? 'Actualizar Clienta' : 'Guardar Clienta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR ESTILISTA */}
      {isStylistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">
                  {editingStylist ? 'Editar Profesional' : 'Agregar Nuevo Profesional'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowStylistGuide(!showStylistGuide)}
                  className="text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 hover:bg-[#FF5A36]/20 px-2.5 py-1 rounded-lg border border-[#FF5A36]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showStylistGuide ? 'Ocultar Guía' : '💡 Guía y Consejos'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsStylistModalOpen(false);
                    setShowStylistGuide(false);
                  }} 
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Interactivo de la Guía Paso a Paso */}
            {showStylistGuide && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181F33] to-[#0E1322] border border-[#FF5A36]/40 text-xs space-y-3 animate-fade-in text-slate-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-[#FF5A36] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Guía de Éxito: Cómo Registrar a tu Equipo
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStylistGuide(false)}
                    className="text-slate-400 hover:text-white text-[10px] font-bold"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">1. 👑 Rol & ¿Atiende Citas?</strong>
                    <p className="text-slate-400 leading-snug">
                      Activa <em>"¿Atiende citas?"</em> para que aparezca en el agendador. Si es socia administrativa, desactívalo.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">2. 📱 Acceso Móvil (/colaborador)</strong>
                    <p className="text-slate-400 leading-snug">
                      Con su <strong>Email</strong> y <strong>Contraseña</strong> podrá consultar sus citas y comisiones desde su propio celular.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">3. ✂️ Categorías Asignadas</strong>
                    <p className="text-slate-400 leading-snug">
                      Selecciona los servicios que domina (ej. Color, Uñas). El agendador solo le asignará citas de esas áreas.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">4. 💵 % Comisiones Claras</strong>
                    <p className="text-slate-400 leading-snug">
                      Configura el porcentaje acordado (ej. 45% o 50%). Kowy calculará sus ganancias diarias automáticamente.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/20 flex items-center gap-2 text-[11px]">
                  <Star className="w-4 h-4 text-[#FF5A36] shrink-0 fill-current" />
                  <span><strong>Tip Pro:</strong> Sube una foto nítida y activa <em>"Mostrar en Portada Web"</em> para darle prestigio a tu equipo.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveStylist} className="space-y-3.5 text-xs">
              
              {/* Rol & Privilegios */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-white text-xs block">Rol en el Salón</strong>
                    <span className="text-[11px] text-slate-400">Tipo de perfil y accesos</span>
                  </div>
                  <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setStylistForm({ ...stylistForm, role: 'admin', is_owner: true })}
                      className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                        stylistForm.role === 'admin' || stylistForm.is_owner ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      👑 Dueña / Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setStylistForm({ ...stylistForm, role: 'colaborador', is_owner: false })}
                      className={`px-3 py-1 font-bold transition-all cursor-pointer ${
                        stylistForm.role === 'colaborador' && !stylistForm.is_owner ? 'bg-[#FF5A36] text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      ✂️ Colaborador
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <strong className="text-white text-xs block">¿Atiende citas con clientas?</strong>
                    <span className="text-[10px] text-slate-400">
                      {stylistForm.attends_clients ? 'Visible en el portal público de reservas y selección de citas.' : 'Solo gestión administrativa, no se agendan citas a su nombre.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStylistForm({ ...stylistForm, attends_clients: !stylistForm.attends_clients })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      stylistForm.attends_clients ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <strong className="text-pink-400 text-xs block flex items-center gap-1">
                      ⭐ ¿Mostrar en la Portada Web?
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      {stylistForm.show_on_web ? 'Visible en la sección "Equipo de Especialistas" de la web (hasta 4 max).' : 'Oculto de la portada web (solo disponible en reservas internas).'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStylistForm({ ...stylistForm, show_on_web: !stylistForm.show_on_web })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      stylistForm.show_on_web ? 'bg-pink-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre Completo *</label>
                <input
                  type="text"
                  value={stylistForm.name}
                  onChange={(e) => setStylistForm({ ...stylistForm, name: e.target.value })}
                  placeholder="Ej. Valentina Gómez"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Email de Acceso *</label>
                  <input
                    type="email"
                    value={stylistForm.email}
                    onChange={(e) => setStylistForm({ ...stylistForm, email: e.target.value })}
                    placeholder="valentina@studioglamour.co"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    {editingStylist ? 'Nueva Clave (Opcional)' : 'Contraseña Provisoria *'}
                  </label>
                  <input
                    type="text"
                    value={stylistForm.password}
                    onChange={(e) => setStylistForm({ ...stylistForm, password: e.target.value })}
                    placeholder={editingStylist ? 'Dejar en blanco para conservar' : 'Ej. Glamour2026*'}
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required={!editingStylist}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">WhatsApp de la Colaboradora</label>
                <div className={`flex items-center rounded-xl border focus-within:border-[#FF5A36] overflow-hidden ${
                  theme === 'dark' ? 'bg-[#0E121B] border-white/10' : 'bg-[#F0F2F7] border-black/5'
                }`}>
                  <span className="px-3 py-2.5 bg-black/10 dark:bg-white/5 border-r border-black/5 dark:border-white/10 text-slate-400 font-bold text-xs shrink-0 flex items-center gap-1">
                    🇨🇴 +57
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={stylistForm.phone ? stylistForm.phone.replace('+57', '').trim() : ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setStylistForm({ ...stylistForm, phone: clean });
                    }}
                    placeholder="3101234567 (10 dígitos)"
                    className="w-full bg-transparent px-3 py-2.5 font-mono focus:outline-none text-xs font-semibold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Escribe los 10 dígitos de su celular</span>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Especialidad Principal *</label>
                <input
                  type="text"
                  value={stylistForm.specialty}
                  onChange={(e) => setStylistForm({ ...stylistForm, specialty: e.target.value })}
                  placeholder="Ej. Master Colorista & Balayage Specialist"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              {/* Selector de Categorías & Servicios Habilitados */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">
                  Categorías de Servicios que Realiza *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {categories.map((cat) => {
                    const isSelected = (stylistForm.service_categories || []).includes(cat.slug) || 
                                       (stylistForm.service_categories || []).includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const current = stylistForm.service_categories || [];
                          const targetKey = cat.slug || cat.id;
                          const updated = isSelected
                            ? current.filter(c => c !== cat.slug && c !== cat.id)
                            : [...current, targetKey];
                          setStylistForm({ ...stylistForm, service_categories: updated });
                        }}
                        className={`text-[11px] font-bold p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-sm'
                            : theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-slate-400 hover:border-white/20' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        {cat.icon || '✨'} {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Foto de Perfil Optimizada con Compresión WebP */}
              <ImageUploadField
                label="Foto de Perfil del Profesional"
                value={stylistForm.photo_url}
                onChange={(url) => setStylistForm({ ...stylistForm, photo_url: url })}
                theme={theme}
                aspectRatio="square"
                maxWidth={400}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">% Comisión Servicios</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stylistForm.commission_service_pct}
                      onChange={(e) => setStylistForm({ ...stylistForm, commission_service_pct: Number(e.target.value) })}
                      className={`w-full border rounded-xl p-2.5 pr-7 font-bold text-[#FF5A36] focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                    <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">% Comisión Retail</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={stylistForm.commission_retail_pct}
                      onChange={(e) => setStylistForm({ ...stylistForm, commission_retail_pct: Number(e.target.value) })}
                      className={`w-full border rounded-xl p-2.5 pr-7 font-bold text-emerald-500 focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                    <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStylistModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingStylist ? 'Actualizar Profesional' : 'Guardar Profesional'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DISPONIBILIDAD & BLOQUEO DE DÍAS POR ESTILISTA (VISTA DUEÑA) */}
      {isStylistAvailabilityModalOpen && selectedStylistForAvailability && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStylistForAvailability.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedStylistForAvailability.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#FF5A36]"
                />
                <div>
                  <h3 className="text-base font-bold">Disponibilidad de {selectedStylistForAvailability.name}</h3>
                  <span className="text-xs text-slate-400">{selectedStylistForAvailability.specialty}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsStylistAvailabilityModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Working Days */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-xs font-bold text-slate-300">Días Laborales Habituales:</strong>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {(selectedStylistForAvailability.working_days || [1,2,3,4,5,6]).length} días/semana
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {[
                  { index: 1, label: 'Lun' },
                  { index: 2, label: 'Mar' },
                  { index: 3, label: 'Mié' },
                  { index: 4, label: 'Jue' },
                  { index: 5, label: 'Vie' },
                  { index: 6, label: 'Sáb' },
                  { index: 0, label: 'Dom' }
                ].map((d) => {
                  const isWorking = (selectedStylistForAvailability.working_days || [1,2,3,4,5,6]).includes(d.index);
                  return (
                    <button
                      key={d.index}
                      type="button"
                      onClick={() => handleOwnerToggleWorkingDay(d.index)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isWorking
                          ? 'bg-[#FF5A36] text-white border-[#FF5A36]'
                          : theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Form to Add Blocked Date / Vacation */}
            <form onSubmit={handleOwnerAddBlockedSlot} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
              <strong className="block font-bold text-[#FF5A36] flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" />
                <span>Bloquear Nuevo Día o Vacaciones</span>
              </strong>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Desde Fecha *</label>
                  <input
                    type="date"
                    value={availStartDate}
                    onChange={(e) => {
                      setAvailStartDate(e.target.value);
                      if (new Date(e.target.value) > new Date(availEndDate)) {
                        setAvailEndDate(e.target.value);
                      }
                    }}
                    className={`w-full border rounded-xl p-2 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hasta Fecha *</label>
                  <input
                    type="date"
                    value={availEndDate}
                    min={availStartDate}
                    onChange={(e) => setAvailEndDate(e.target.value)}
                    className={`w-full border rounded-xl p-2 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Motivo *</label>
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {['Vacaciones', 'Cita Médica', 'Día Libre', 'Capacitación'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAvailReason(r)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold ${
                        availReason === r ? 'bg-[#FF5A36] text-white border-[#FF5A36]' : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={availReason}
                  onChange={(e) => setAvailReason(e.target.value)}
                  placeholder="Ej. Vacaciones / Permiso Especial"
                  className={`w-full border rounded-xl p-2 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Agregar Bloqueo a la Agenda</span>
              </button>
            </form>

            {/* Section 3: List of Active Blocked Dates */}
            <div className="space-y-2">
              <strong className="text-xs font-bold text-slate-300 block">
                Fechas Bloqueadas Activas ({selectedStylistForAvailability.blocked_slots?.length || 0}):
              </strong>

              {(!selectedStylistForAvailability.blocked_slots || selectedStylistForAvailability.blocked_slots.length === 0) ? (
                <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                  Sin días bloqueados. Disponible para recibir clientas.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
                  {selectedStylistForAvailability.blocked_slots.map(slot => (
                    <div
                      key={slot.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <strong className="text-[#FF5A36] font-mono">{slot.date}</strong>
                        <span className="text-slate-300 font-semibold">• {slot.reason}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOwnerRemoveBlockedSlot(slot.id, slot.date)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/20"
                        title="Desbloquear"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStylistAvailabilityModalOpen(false)}
                className="bg-[#FF5A36] text-white font-bold px-5 py-2 rounded-full shadow-md text-xs"
              >
                Listo / Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL EXPEDIENTE 360° & RENDIMIENTO DEL COLABORADOR / ESTILISTA */}
      {isStylistDetailsModalOpen && selectedStylistForDetails && (() => {
        const sty = selectedStylistForDetails;
        const stylistAppointments = appointments.filter(a => a.stylist_id === sty.id || a.stylist_name === sty.name);
        const completedApts = stylistAppointments.filter(a => a.status === 'cobrada');
        const inProgressApts = stylistAppointments.filter(a => a.status === 'en_atencion');
        const upcomingApts = stylistAppointments.filter(a => a.status === 'confirmada_wa' || a.status === 'pendiente');
        const totalRevenue = completedApts.reduce((acc, a) => acc + (Number(a.price_usd ?? 0)), 0);
        const serviceCommPct = Number(sty.commission_service_pct ?? 45);
        const retailCommPct = Number(sty.commission_retail_pct ?? 10);
        const totalEarnedCommissions = (totalRevenue * serviceCommPct) / 100;
        const avgTicket = completedApts.length > 0 ? (totalRevenue / completedApts.length) : 0;

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className={`border rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl space-y-6 animate-fade-in relative ${
              theme === 'dark' ? 'bg-[#121622] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
            }`}>
              
              {/* Header con Perfil & Botón Cerrar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={sty.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={sty.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#FF5A36] shadow-lg shadow-[#FF5A36]/20"
                    />
                    {sty.is_owner || sty.role === 'admin' ? (
                      <span className="absolute -top-2 -right-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-black shadow">
                        👑
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-black">{sty.name}</h2>
                      {sty.is_owner || sty.role === 'admin' ? (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                          👑 Dueña / Administradora
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          ✂️ Colaborador
                        </span>
                      )}
                      {sty.attends_clients === false ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          💼 Solo Gestión
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          ✂️ Atiende Citas
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{sty.specialty}</p>
                    
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                      {sty.phone && (
                        <a
                          href={`https://wa.me/${sty.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>+{sty.phone}</span>
                        </a>
                      )}
                      {sty.email && (
                        <span className="flex items-center gap-1 text-slate-400 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                          <Mail className="w-3.5 h-3.5 text-[#FF5A36]" />
                          <span>{sty.email}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{sty.rating || '5.0'} ({sty.reviews_count || 0})</span>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStylistDetailsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all self-end sm:self-auto"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* 4 KPIs Clave de Rendimiento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Facturado Total</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <strong className="text-base sm:text-lg font-black text-emerald-400 block">
                    {formatCurrency(totalRevenue, salonCurrency)}
                  </strong>
                  <span className="text-[10px] text-slate-500">en {stylistAppointments.length} servicios</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Comisiones Ganadas</span>
                    <Award className="w-4 h-4 text-[#FF5A36]" />
                  </div>
                  <strong className="text-base sm:text-lg font-black text-[#FF5A36] block">
                    {formatCurrency(totalEarnedCommissions, salonCurrency)}
                  </strong>
                  <span className="text-[10px] text-slate-500">{serviceCommPct}% de comisión</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Citas en Agenda</span>
                    <CalendarCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <strong className="text-base sm:text-lg font-black text-white block">
                    {stylistAppointments.length} citas
                  </strong>
                  <span className="text-[10px] text-slate-500">{completedApts.length} atendidas • {upcomingApts.length} prox.</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                }`}>
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>Ticket Promedio</span>
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <strong className="text-base sm:text-lg font-black text-purple-400 block">
                    {formatCurrency(avgTicket, salonCurrency)}
                  </strong>
                  <span className="text-[10px] text-slate-500">por cliente</span>
                </div>
              </div>

              {/* Pestañas Segmentadas sin scrollbar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setStylistDetailsTab('appointments')}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    stylistDetailsTab === 'appointments'
                      ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Citas ({stylistAppointments.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStylistDetailsTab('commissions')}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    stylistDetailsTab === 'commissions'
                      ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Comisiones</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStylistDetailsTab('specialties')}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    stylistDetailsTab === 'specialties'
                      ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Servicios</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStylistDetailsTab('schedule')}
                  className={`py-2 px-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                    stylistDetailsTab === 'schedule'
                      ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Horarios</span>
                </button>
              </div>

              {/* CONTENIDO DE LAS PESTAÑAS */}
              <div className="space-y-4 min-h-[220px]">
                {/* TAB 1: CITAS */}
                {stylistDetailsTab === 'appointments' && (
                  <div className="space-y-3">
                    {stylistAppointments.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
                        <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
                        <strong className="text-sm text-slate-300 block">Sin citas registradas aún</strong>
                        <p className="text-xs text-slate-500">Este profesional no tiene citas asociadas en el período actual.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {stylistAppointments.map((apt) => {
                          const price = Number(apt.price_usd ?? 0);
                          const comm = (price * serviceCommPct) / 100;
                          return (
                            <div
                              key={apt.id}
                              className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                                theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 text-[#FF5A36] flex flex-col items-center justify-center font-bold font-mono">
                                  <span className="text-[11px] leading-tight">{apt.time.split(' ')[0]}</span>
                                  <span className="text-[9px] text-slate-400">{apt.time.split(' ')[1]}</span>
                                </div>
                                <div>
                                  <strong className="text-sm font-bold text-white block">{apt.client_name}</strong>
                                  <span className="text-slate-400">{apt.service_name} • {apt.date}</span>
                                  {apt.client_phone && (
                                    <a
                                      href={`https://wa.me/${apt.client_phone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-emerald-400 block font-mono hover:underline mt-0.5"
                                    >
                                      💬 {apt.client_phone}
                                    </a>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 self-end sm:self-center">
                                <div className="text-right">
                                  <strong className="text-sm font-bold text-white block">
                                    {formatCurrency(price, salonCurrency)}
                                  </strong>
                                  <span className="text-[10px] text-emerald-400 font-bold block">
                                    +{formatCurrency(comm, salonCurrency)} com.
                                  </span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  apt.status === 'cobrada' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                  apt.status === 'completada' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' :
                                  apt.status === 'en_atencion' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                  apt.status === 'confirmada_wa' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                                  'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                }`}>
                                  {apt.status === 'cobrada' ? '✓ Cobrada' : apt.status === 'completada' ? '💳 Esperando Caja' : apt.status === 'en_atencion' ? '● En Sillón' : apt.status === 'confirmada_wa' ? 'Confirmada WA' : apt.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: COMISIONES & LIQUIDACIÓN */}
                {stylistDetailsTab === 'commissions' && (
                  <div className="space-y-4 text-xs">
                    <div className={`p-4 rounded-2xl border space-y-3 ${
                      theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                    }`}>
                      <div className="flex justify-between items-center pb-3 border-b border-white/5">
                        <strong className="text-sm font-bold text-white">Esquema de Liquidación de Comisiones</strong>
                        <span className="text-xs text-[#FF5A36] font-bold font-mono">Tasa Acordada</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 block">Comisión en Servicios</span>
                            <strong className="text-base font-bold text-[#FF5A36]">{serviceCommPct}%</strong>
                          </div>
                          <Scissors className="w-5 h-5 text-[#FF5A36]/60" />
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 block">Comisión en Venta Retail</span>
                            <strong className="text-base font-bold text-emerald-400">{retailCommPct}%</strong>
                          </div>
                          <ShoppingBag className="w-5 h-5 text-emerald-400/60" />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                        <div>
                          <strong className="text-xs text-emerald-300 block">Total Liquidable Acumulado</strong>
                          <span className="text-[11px] text-emerald-400/80">Basado en servicios completados y agendados</span>
                        </div>
                        <strong className="text-lg font-black text-emerald-400">
                          {formatCurrency(totalEarnedCommissions, salonCurrency)}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ESPECIALIDADES & SERVICIOS */}
                {stylistDetailsTab === 'specialties' && (
                  <div className="space-y-4 text-xs">
                    <div className={`p-4 rounded-2xl border space-y-3 ${
                      theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                    }`}>
                      <strong className="text-sm font-bold text-white block">Categorías de Servicio Autorizadas</strong>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'color', label: '🎨 Color & Tinte', desc: 'Balayage, Babylights, Corrección' },
                          { id: 'corte', label: '✂️ Corte Capilar', desc: 'Damas, Caballeros, Diseños' },
                          { id: 'keratina', label: '💆‍♀️ Keratinas', desc: 'Alisados orgánicos, Botox' },
                          { id: 'nails', label: '💅 Nails & Uñas', desc: 'Acrílicas, Poligel, Semi' },
                          { id: 'barberia', label: '💈 Barbería', desc: 'Fades, Barba, Perfilados' },
                          { id: 'spa', label: '🧖‍♀️ Spa & Faciales', desc: 'Hidratación, Limpieza, Masajes' }
                        ].map((cat) => {
                          const isAuthorized = (sty.service_categories || ['color', 'corte']).includes(cat.id as any);
                          return (
                            <div
                              key={cat.id}
                              className={`p-3 rounded-xl border transition-all ${
                                isAuthorized
                                  ? 'bg-[#FF5A36]/10 border-[#FF5A36]/30 text-white'
                                  : 'bg-white/5 border-white/5 text-slate-500 opacity-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <strong className="font-bold">{cat.label}</strong>
                                {isAuthorized ? <Check className="w-3.5 h-3.5 text-[#FF5A36]" /> : null}
                              </div>
                              <p className="text-[10px] text-slate-400">{cat.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: HORARIO & DISPONIBILIDAD */}
                {stylistDetailsTab === 'schedule' && (
                  <div className="space-y-4 text-xs">
                    <div className={`p-4 rounded-2xl border space-y-3 ${
                      theme === 'dark' ? 'bg-[#181E2E] border-white/5' : 'bg-slate-50 border-black/5'
                    }`}>
                      <div className="flex justify-between items-center">
                        <strong className="text-sm font-bold text-white">Días Laborales Habituales</strong>
                        <span className="text-[11px] text-emerald-400 font-bold">
                          {(sty.working_days || [1, 2, 3, 4, 5, 6]).length} días por semana
                        </span>
                      </div>
                      <div className="grid grid-cols-7 gap-1.5 text-center">
                        {[
                          { idx: 1, label: 'Lun' },
                          { idx: 2, label: 'Mar' },
                          { idx: 3, label: 'Mié' },
                          { idx: 4, label: 'Jue' },
                          { idx: 5, label: 'Vie' },
                          { idx: 6, label: 'Sáb' },
                          { idx: 0, label: 'Dom' }
                        ].map(d => {
                          const isWorking = (sty.working_days || [1, 2, 3, 4, 5, 6]).includes(d.idx);
                          return (
                            <div
                              key={d.idx}
                              className={`p-2 rounded-xl border text-center ${
                                isWorking
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
                                  : 'bg-white/5 border-white/5 text-slate-500 font-medium'
                              }`}
                            >
                              <span className="block text-[11px]">{d.label}</span>
                              <span className="text-[9px] block mt-0.5">{isWorking ? 'Activo' : 'Libre'}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs font-bold text-slate-300">Días Bloqueados / Vacaciones</strong>
                          <button
                            type="button"
                            onClick={() => {
                              setIsStylistDetailsModalOpen(false);
                              handleOpenStylistAvailability(sty);
                            }}
                            className="text-[#FF5A36] hover:underline text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Agregar Bloqueo
                          </button>
                        </div>

                        {(!sty.blocked_slots || sty.blocked_slots.length === 0) ? (
                          <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                            Sin días bloqueados. 100% disponible para agendar citas.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {sty.blocked_slots.map(slot => (
                              <div key={slot.id} className="p-2 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                                <span className="font-mono text-[#FF5A36] font-bold">{slot.date}</span>
                                <span className="text-slate-300">{slot.reason}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsStylistDetailsModalOpen(false);
                    handleOpenStylistAvailability(sty);
                  }}
                  className="px-4 py-2.5 rounded-full border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center cursor-pointer"
                >
                  <CalendarOff className="w-4 h-4" />
                  <span>Gestionar Disponibilidad / Vacaciones</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStylistDetailsModalOpen(false);
                      handleEditStylist(sty);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold flex items-center gap-1.5 shadow-md shadow-[#FF5A36]/30 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar Profesional</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStylistDetailsModalOpen(false)}
                    className="px-4 py-2.5 rounded-full border border-white/10 text-slate-400 hover:text-white font-semibold cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL NUEVO / EDITAR SERVICIO */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">
                  {editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceGuide(!showServiceGuide)}
                  className="text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 hover:bg-[#FF5A36]/20 px-2.5 py-1 rounded-lg border border-[#FF5A36]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showServiceGuide ? 'Ocultar Guía' : '💡 Guía y Consejos'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsServiceModalOpen(false);
                    setShowServiceGuide(false);
                  }} 
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Interactivo de la Guía Paso a Paso */}
            {showServiceGuide && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#181F33] to-[#0E1322] border border-[#FF5A36]/40 text-xs space-y-3 animate-fade-in text-slate-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-[#FF5A36] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Guía de Éxito: Cómo Configurar tu Servicio
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowServiceGuide(false)}
                    className="text-slate-400 hover:text-white text-[10px] font-bold"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">1. 🏷️ Nombre Atractivo</strong>
                    <p className="text-slate-400 leading-snug">
                      Usa nombres que transmitan valor (ej. <em className="text-[#FF5A36]">"Balayage Deluxe + Matiz"</em> en vez de <em className="line-through">"Tinte"</em>).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">2. ⏱️ Duración Exacta</strong>
                    <p className="text-slate-400 leading-snug">
                      Coloca el tiempo real en minutos (ej. 45 o 90 min) para que el agendador no cruce turnos con otras clientas.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">3. 💵 Precio en COP</strong>
                    <p className="text-slate-400 leading-snug">
                      Coloca el valor base que verá la clienta. Si varía por largo o volumen, explícalo en la descripción.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">4. 📸 Fotografía</strong>
                    <p className="text-slate-400 leading-snug">
                      Elige una foto del banco profesional o sube una foto real de tus trabajos para generar más confianza.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/20 flex items-center gap-2 text-[11px]">
                  <Star className="w-4 h-4 text-[#FF5A36] shrink-0 fill-current" />
                  <span><strong>Tip Pro:</strong> Marca la casilla <em>"Mostrar como Destacado"</em> para que aparezca en la portada de tu web.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre del Servicio *</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="Ej. Balayage Signature + Matiz Olaplex"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-400 font-semibold">Categoría *</label>
                    <button
                      type="button"
                      onClick={() => setIsQuickCategoryOpen(!isQuickCategoryOpen)}
                      className="text-[11px] font-bold text-[#FF5A36] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isQuickCategoryOpen ? 'Cerrar' : '+ Nueva'}</span>
                    </button>
                  </div>
                  
                  <select
                    value={serviceForm.category}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setIsQuickCategoryOpen(true);
                      } else {
                        setServiceForm({ ...serviceForm, category: e.target.value });
                      }
                    }}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug || cat.id}>
                        {cat.icon || '✨'} {cat.name}
                      </option>
                    ))}
                    <option value="__NEW__">➕ + Crear Otra Categoría...</option>
                  </select>

                  {/* Panel Flotante de Creación Rápida de Categoría */}
                  {isQuickCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 p-3 rounded-xl border shadow-xl bg-[#0E121B] border-[#FF5A36]/40 animate-fade-in space-y-2">
                      <div className="text-[11px] font-bold text-[#FF5A36] flex items-center justify-between">
                        <span>Nueva Categoría Rápida</span>
                        <button type="button" onClick={() => setIsQuickCategoryOpen(false)} className="text-slate-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={quickCategoryIcon}
                          onChange={(e) => setQuickCategoryIcon(e.target.value)}
                          placeholder="🎨"
                          className="w-10 text-center border border-white/15 rounded-lg bg-black/40 text-sm focus:outline-none focus:border-[#FF5A36]"
                        />
                        <input
                          type="text"
                          value={quickCategoryName}
                          onChange={(e) => setQuickCategoryName(e.target.value)}
                          placeholder="ej. Depilación Láser, Pestañas"
                          className="flex-1 px-2.5 py-1.5 border border-white/15 rounded-lg bg-black/40 text-xs text-white focus:outline-none focus:border-[#FF5A36]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCreateQuickCategory}
                        disabled={!quickCategoryName.trim()}
                        className="w-full bg-[#FF5A36] hover:bg-[#E54E07] disabled:opacity-50 text-white text-[11px] font-bold py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
                      >
                        ✓ Crear y Asignar
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Precio ({salonCurrency}) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step={salonCurrency === 'COP' ? '1000' : '1'}
                      value={serviceForm.price_usd}
                      onChange={(e) => setServiceForm({ ...serviceForm, price_usd: Number(e.target.value) })}
                      className={`w-full border rounded-xl p-2.5 pl-6 font-bold text-[#FF5A36] focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duración Estimada (Minutos) *</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={serviceForm.duration_minutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: Number(e.target.value) })}
                  className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              {/* Selector de Fotografía de Referencia (Stock CDN o Subida Propia) */}
              <ServiceImagePicker
                value={serviceForm.image_url}
                category={serviceForm.category}
                onChange={(url) => setServiceForm({ ...serviceForm, image_url: url })}
                label="Fotografía Ilustrativa de Referencia"
              />

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Descripción del Servicio</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Incluye diagnóstico capilar, lavado premium y peinado final..."
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="srv_is_featured"
                    checked={serviceForm.is_featured}
                    onChange={(e) => setServiceForm({ ...serviceForm, is_featured: e.target.checked })}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="srv_is_featured" className="text-xs font-bold text-amber-400 cursor-pointer select-none flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Mostrar como Servicio Destacado en la Portada Web</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="srv_patch_test"
                    checked={serviceForm.requires_patch_test}
                    onChange={(e) => setServiceForm({ ...serviceForm, requires_patch_test: e.target.checked })}
                    className="rounded text-[#FF5A36] focus:ring-[#FF5A36]"
                  />
                  <label htmlFor="srv_patch_test" className="text-slate-400 text-xs cursor-pointer select-none">
                    Requiere prueba de parche previa por seguridad
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingService ? 'Actualizar Servicio' : 'Guardar Servicio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVA / EDITAR CATEGORÍA */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría de Servicios'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCategoryModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <label className="block text-slate-400 mb-1 font-semibold text-center">Icono / Emoji</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    placeholder="🎨"
                    className={`w-full border rounded-xl p-2.5 text-center text-lg focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-slate-400 mb-1 font-semibold">Nombre de la Categoría *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ 
                      ...categoryForm, 
                      name: e.target.value,
                      slug: !editingCategory ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') : categoryForm.slug
                    })}
                    placeholder="Ej. Pestañas & Microblading"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Identificador Slug (URL / Filtro)</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  placeholder="pestanas-microblading"
                  className={`w-full border rounded-xl p-2.5 font-mono text-[11px] focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Descripción</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Servicios especializados en diseño de mirada, extensiones pelo a pelo y sombreado..."
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO / EDITAR PRODUCTO */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-[#FF5A36]/40 text-white' : 'bg-white border-[#FF5A36]/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold">
                  {editingProduct ? 'Editar Producto Retail' : 'Agregar Nuevo Producto'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsProductModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nombre del Producto *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ej. Olaplex Nº 7 Bonding Oil"
                  className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                    theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Marca *</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Ej. Kérastase / Olaplex"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Categoría</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="Tratamiento, Shampoo, Óleo"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Precio de Venta (COP $) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={productForm.price_usd}
                      onChange={(e) => setProductForm({ ...productForm, price_usd: Number(e.target.value) })}
                      className={`w-full border rounded-xl p-2.5 pl-6 font-bold text-[#FF5A36] focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Costo (COP $)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={productForm.cost_price_usd}
                      onChange={(e) => setProductForm({ ...productForm, cost_price_usd: Number(e.target.value) })}
                      className={`w-full border rounded-xl p-2.5 pl-6 focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                    <span className="absolute left-2.5 top-2.5 text-xs text-slate-400 font-bold">$</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Stock Actual *</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: Number(e.target.value) })}
                    className={`w-full border rounded-xl p-2.5 font-bold text-emerald-500 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Alerta Mínima</label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.min_stock_alert}
                    onChange={(e) => setProductForm({ ...productForm, min_stock_alert: Number(e.target.value) })}
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Código SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="OLA-007"
                    className={`w-full border rounded-xl p-2.5 font-mono focus:outline-none focus:border-[#FF5A36] ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-5 py-2 rounded-full shadow-md shadow-[#FF5A36]/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERSONALIZAR PÁGINA WEB & PORTADA CON VISTA PREVIA EN VIVO */}
      {isWebsiteCustomizerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className={`border rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in ${
            theme === 'dark' ? 'bg-[#121622] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
          }`}>
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-black/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✨</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Personalizador de tu Página Web
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Edita el diseño, textos, fotos y activa o desactiva secciones con previsualización en vivo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowWebsiteGuide(!showWebsiteGuide)}
                  className="text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 hover:bg-[#FF5A36]/20 px-2.5 py-1 rounded-lg border border-[#FF5A36]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showWebsiteGuide ? 'Ocultar Guía' : '💡 Guía y Consejos'}</span>
                </button>
                <button
                  type="button"
                  disabled={isSavingWebsite}
                  onClick={() => {
                    setIsWebsiteCustomizerOpen(false);
                    setShowWebsiteGuide(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Interactivo de la Guía Paso a Paso para la Web */}
            {showWebsiteGuide && (
              <div className="mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-b from-[#181F33] to-[#0E1322] border border-[#FF5A36]/40 text-xs space-y-3 animate-fade-in text-slate-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-extrabold text-[#FF5A36] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Guía de Éxito: Cómo Personalizar tu Página Web
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowWebsiteGuide(false)}
                    className="text-slate-400 hover:text-white text-[10px] font-bold"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">1. 🎨 Portada & Lema</strong>
                    <p className="text-slate-400 leading-snug">
                      Sube una foto de alta calidad de tu salón y define un lema claro (ej. <em>"Especialistas en Balayage y Spa"</em>).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">2. 🕒 Horarios de Atención</strong>
                    <p className="text-slate-400 leading-snug">
                      El horario que indiques aquí se reflejará en los turnos del agendador y en la barra superior de tu web.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">3. 👥 Sección de Equipo</strong>
                    <p className="text-slate-400 leading-snug">
                      Activa o desactiva la sección de colaboradoras para mostrar a tus especialistas en la web.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <strong className="text-white block">4. 👁️ Vista Previa en Vivo</strong>
                    <p className="text-slate-400 leading-snug">
                      Observa en la columna derecha cómo se ve tu web en tiempo real antes de presionar <em>"Publicar Cambios"</em>.
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/20 flex items-center gap-2 text-[11px]">
                  <Star className="w-4 h-4 text-[#FF5A36] shrink-0 fill-current" />
                  <span><strong>Tip Pro:</strong> Al hacer clic en <em>"Guardar & Publicar"</em>, tu web se actualiza al instante en <code>kowy.app/sitio/:tu-salon</code>.</span>
                </div>
              </div>
            )}

            {/* Banner de Carga / Sincronización en Progreso */}
            {isSavingWebsite && (
              <div className="bg-gradient-to-r from-[#FF5A36]/20 via-pink-500/20 to-emerald-500/20 border-b border-white/10 px-6 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-white animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF5A36]" />
                <span>Guardando cambios y publicando tu página web en Supabase...</span>
              </div>
            )}

            {/* Contenido en 2 Columnas (Formulario + Vista Previa) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Columna Izquierda: Formulario de Configuración (7 cols) */}
              <form id="website-customizer-form" onSubmit={async (e) => {
                e.preventDefault();
                if (!activeTenantObj) return;
                setIsSavingWebsite(true);
                try {
                  const updatedTenant: Tenant = {
                    ...activeTenantObj,
                    hero_image_url: websiteForm.hero_image_url || activeTenantObj.hero_image_url,
                    primary_color: websiteForm.primary_color || activeTenantObj.primary_color,
                    show_team_section: websiteForm.show_team_section !== undefined ? websiteForm.show_team_section : true,
                    show_first_visit_discount: websiteForm.show_first_visit_discount !== undefined ? websiteForm.show_first_visit_discount : false,
                    first_visit_discount_pct: Number(websiteForm.first_visit_discount_pct || 15),
                    first_visit_discount_title: websiteForm.first_visit_discount_title || undefined,
                    logo_icon: websiteForm.logo_icon || activeTenantObj.logo_icon,
                    hero_eyebrow: websiteForm.hero_eyebrow || activeTenantObj.hero_eyebrow,
                    slogan: websiteForm.slogan || activeTenantObj.slogan,
                    title_accent: websiteForm.title_accent || activeTenantObj.title_accent,
                    navbar_tagline: websiteForm.navbar_tagline || activeTenantObj.navbar_tagline,
                    subtitle: websiteForm.subtitle || activeTenantObj.subtitle,
                    about_image_url: websiteForm.about_image_url || activeTenantObj.about_image_url,
                    about_badge_text: websiteForm.about_badge_text || activeTenantObj.about_badge_text,
                    about_eyebrow: websiteForm.about_eyebrow || activeTenantObj.about_eyebrow,
                    about_title: websiteForm.about_title || activeTenantObj.about_title,
                    about_title_accent: websiteForm.about_title_accent || activeTenantObj.about_title_accent,
                    about_description: websiteForm.about_description || activeTenantObj.about_description,
                    about_years_exp: websiteForm.about_years_exp || activeTenantObj.about_years_exp,
                    about_clients_count: websiteForm.about_clients_count || activeTenantObj.about_clients_count,
                    about_stat3_text: websiteForm.about_stat3_text || activeTenantObj.about_stat3_text,
                    about_rating_text: websiteForm.about_rating_text || activeTenantObj.about_rating_text,
                    business_hours: { summary: websiteForm.business_hours_text || activeTenantObj.business_hours?.summary || 'Lunes a Sábado: 8:00 AM - 7:00 PM' },
                    show_about_section: websiteForm.show_about_section !== undefined ? websiteForm.show_about_section : true
                  };
                  setActiveTenantObj(updatedTenant);
                  localStorage.setItem('bf_tenant_active', JSON.stringify(updatedTenant));

                  await api.updateTenant(updatedTenant);
                  const pSites = await api.getProspectSites();
                  const matched = pSites.find(p => p.slug === updatedTenant.slug || p.claimed_tenant_id === updatedTenant.id);
                  if (matched) {
                    const updatedSite: any = {
                      hero_image_url: updatedTenant.hero_image_url,
                      primary_color: updatedTenant.primary_color,
                      business_data: {
                        ...matched.business_data,
                        hero_image_url: updatedTenant.hero_image_url,
                        primary_color: updatedTenant.primary_color,
                        logo_icon: updatedTenant.logo_icon,
                        hero_eyebrow: updatedTenant.hero_eyebrow,
                        slogan: updatedTenant.slogan,
                        title_accent: updatedTenant.title_accent,
                        navbar_tagline: updatedTenant.navbar_tagline,
                        subtitle: updatedTenant.subtitle,
                        business_hours: updatedTenant.business_hours,
                        horario_atencion: websiteForm.business_hours_text,
                        about_image_url: updatedTenant.about_image_url,
                        about_badge_text: updatedTenant.about_badge_text,
                        about_eyebrow: updatedTenant.about_eyebrow,
                        about_title: updatedTenant.about_title,
                        about_title_accent: updatedTenant.about_title_accent,
                        about_description: updatedTenant.about_description,
                        about_years_exp: updatedTenant.about_years_exp,
                        about_clients_count: updatedTenant.about_clients_count,
                        about_stat3_text: updatedTenant.about_stat3_text,
                        about_rating_text: updatedTenant.about_rating_text,
                        show_about_section: updatedTenant.show_about_section,
                        show_team_section: updatedTenant.show_team_section,
                        show_first_visit_discount: updatedTenant.show_first_visit_discount,
                        first_visit_discount_pct: updatedTenant.first_visit_discount_pct,
                        first_visit_discount_title: updatedTenant.first_visit_discount_title
                      }
                    };
                    await api.updateProspectSite(matched.id, updatedSite);
                  }
                  setIsWebsiteCustomizerOpen(false);
                  alert('✨ ¡Tu página web ha sido actualizada y publicada con éxito!');
                } catch (err) {
                  console.warn('Error saving website config in Supabase:', err);
                  alert('⚠️ Hubo un detalle al guardar en la nube, pero tus cambios quedaron almacenados localmente.');
                  setIsWebsiteCustomizerOpen(false);
                } finally {
                  setIsSavingWebsite(false);
                }
              }} className="lg:col-span-7 space-y-4 text-xs">

                {/* 1. Selector de Fotografía de Portada (Hero) */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                  <ServiceImagePicker
                    value={websiteForm.hero_image_url}
                    category="color"
                    onChange={(url) => setWebsiteForm({ ...websiteForm, hero_image_url: url })}
                    label="1. Fotografía Principal del Header (Portada)"
                  />
                </div>

                {/* 2. Textos Principales del Hero & Barra de Navegación */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <strong className="text-slate-300 font-bold text-xs block">2. Mensaje Principal & Subtítulos (Header)</strong>
                  
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Saludo Superior (Eyebrow)</label>
                    <input
                      type="text"
                      value={websiteForm.hero_eyebrow}
                      onChange={(e) => setWebsiteForm({ ...websiteForm, hero_eyebrow: e.target.value })}
                      placeholder="Ej. Bienvenidas a ❤️"
                      className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Nombre / Título Principal *</label>
                      <input
                        type="text"
                        value={websiteForm.slogan}
                        onChange={(e) => setWebsiteForm({ ...websiteForm, slogan: e.target.value })}
                        placeholder="Ej. Sandra Color´s"
                        className={`w-full border rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Acento / Especialidad Destacada</label>
                      <input
                        type="text"
                        value={websiteForm.title_accent}
                        onChange={(e) => setWebsiteForm({ ...websiteForm, title_accent: e.target.value })}
                        placeholder="Ej. Salon & Hair Studio"
                        className={`w-full border rounded-xl p-2.5 font-bold text-pink-400 focus:outline-none focus:border-[#FF5A36] ${
                          theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Lema / Subtítulo de la Barra de Navegación (Navbar)</label>
                    <input
                      type="text"
                      value={websiteForm.navbar_tagline}
                      onChange={(e) => setWebsiteForm({ ...websiteForm, navbar_tagline: e.target.value })}
                      placeholder="Ej. Especialistas en Rizos • Apartadó"
                      className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Subtítulo / Propuesta de Valor (Párrafo)</label>
                    <textarea
                      rows={2}
                      value={websiteForm.subtitle}
                      onChange={(e) => setWebsiteForm({ ...websiteForm, subtitle: e.target.value })}
                      placeholder="Ej. Especialistas en colorimetría de autor, balayage, alisados orgánicos, peinados de gala y spa capilar para mujeres modernas en Apartadó."
                      className={`w-full border rounded-xl p-2.5 leading-relaxed focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Sección "Sobre Nosotros" (Tu Salón, Historia & Espacio) */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-300 font-bold text-xs block">3. Sección "Sobre Nosotros" (Salón & Experiencia)</strong>
                    <button
                      type="button"
                      onClick={() => setWebsiteForm({ ...websiteForm, show_about_section: !websiteForm.show_about_section })}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        websiteForm.show_about_section ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {websiteForm.show_about_section ? 'Sección Activa ✓' : 'Sección Oculta'}
                    </button>
                  </div>

                  {websiteForm.show_about_section && (
                    <div className="space-y-3 pt-2">
                      {/* Fotografía de la Sección Sobre Nosotros */}
                      <ServiceImagePicker
                        value={websiteForm.about_image_url}
                        category="salon"
                        onChange={(url) => setWebsiteForm({ ...websiteForm, about_image_url: url })}
                        label="Fotografía del Salón / Espacio Físico"
                      />

                      {/* Badge VIP & Eyebrow */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1 font-semibold">Badge sobre la Foto</label>
                          <input
                            type="text"
                            value={websiteForm.about_badge_text}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_badge_text: e.target.value })}
                            placeholder="Ej. VIP EXPERIENCIA CURLY"
                            className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 font-semibold">Saludo Superior (Eyebrow)</label>
                          <input
                            type="text"
                            value={websiteForm.about_eyebrow}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_eyebrow: e.target.value })}
                            placeholder="Ej. Sobre Nosotros"
                            className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Título Principal & Acento de Sobre Nosotros */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-1 font-semibold">Título Principal</label>
                          <input
                            type="text"
                            value={websiteForm.about_title}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_title: e.target.value })}
                            placeholder="Ej. CUIDADO. DEFINICIÓN."
                            className={`w-full border rounded-xl p-2.5 font-bold focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 mb-1 font-semibold">Acento Destacado (Dorado/Color)</label>
                          <input
                            type="text"
                            value={websiteForm.about_title_accent}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_title_accent: e.target.value })}
                            placeholder="Ej. PASIÓN POR TUS RIZOS."
                            className={`w-full border rounded-xl p-2.5 font-bold text-amber-400 focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Párrafo Descriptivo / Historia */}
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Historia / Propuesta de Valor (Párrafo)</label>
                        <textarea
                          rows={3}
                          value={websiteForm.about_description}
                          onChange={(e) => setWebsiteForm({ ...websiteForm, about_description: e.target.value })}
                          placeholder="Ej. En nuestro salón transformamos el cuidado de tu cabello en una experiencia de amor propio y libertad..."
                          className={`w-full border rounded-xl p-2.5 leading-relaxed focus:outline-none focus:border-[#FF5A36] ${
                            theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                          }`}
                        />
                      </div>

                      {/* Métricas Rápidas */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div>
                          <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Años Exp.</label>
                          <input
                            type="text"
                            value={websiteForm.about_years_exp}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_years_exp: e.target.value })}
                            placeholder="+8"
                            className={`w-full border rounded-xl p-2 text-center font-bold focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Clientas</label>
                          <input
                            type="text"
                            value={websiteForm.about_clients_count}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_clients_count: e.target.value })}
                            placeholder="+3.5K"
                            className={`w-full border rounded-xl p-2 text-center font-bold focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Prod. Limpios</label>
                          <input
                            type="text"
                            value={websiteForm.about_stat3_text}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_stat3_text: e.target.value })}
                            placeholder="100%"
                            className={`w-full border rounded-xl p-2 text-center font-bold text-emerald-400 focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Calificación</label>
                          <input
                            type="text"
                            value={websiteForm.about_rating_text}
                            onChange={(e) => setWebsiteForm({ ...websiteForm, about_rating_text: e.target.value })}
                            placeholder="5.0 ★"
                            className={`w-full border rounded-xl p-2 text-center font-bold text-amber-400 focus:outline-none focus:border-[#FF5A36] ${
                              theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Horarios de Atención al Público (Días y Horas) */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <strong className="text-slate-300 font-bold text-xs block flex items-center gap-1.5">
                      🕒 4. Horario de Atención (Días y Horas)
                    </strong>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setWebsiteForm({ ...websiteForm, business_hours_text: 'Lunes a Sábado: 8:00 AM - 7:00 PM' })}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold cursor-pointer transition-colors"
                      >
                        Estándar
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebsiteForm({ ...websiteForm, business_hours_text: 'Lunes a Domingo: 9:00 AM - 8:00 PM' })}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold cursor-pointer transition-colors"
                      >
                        Todos los días
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebsiteForm({ ...websiteForm, business_hours_text: 'Lun a Vie: 9:00 AM - 7:00 PM | Sáb: 9:00 AM - 5:00 PM' })}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold cursor-pointer transition-colors"
                      >
                        Fin de semana
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Texto Visible en la Página Web</label>
                    <input
                      type="text"
                      value={websiteForm.business_hours_text}
                      onChange={(e) => setWebsiteForm({ ...websiteForm, business_hours_text: e.target.value })}
                      placeholder="Ej. Lunes a Sábado: 8:00 AM - 7:00 PM"
                      className={`w-full border rounded-xl p-2.5 font-semibold focus:outline-none focus:border-[#FF5A36] ${
                        theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                      }`}
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Se actualiza automáticamente en la sección de Ubicación & Contacto, en el pie de página y en tu motor de citas.
                    </span>
                  </div>
                </div>

                {/* 5. Secciones Condicionales de la Página */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                  <strong className="text-slate-300 font-bold text-xs block">5. Secciones Opcionales de tu Web</strong>

                  {/* Switch de Especialistas / Equipo */}
                  <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block flex items-center gap-1.5">
                        👥 Publicar Sección "Equipo de Especialistas"
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {websiteForm.show_team_section !== false 
                          ? 'Visible en la web con hasta 4 colaboradoras destacadas y botón de reserva directo.' 
                          : 'Sección oculta en la página web y en el menú de navegación.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWebsiteForm({ ...websiteForm, show_team_section: websiteForm.show_team_section === false ? true : false })}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                        websiteForm.show_team_section !== false ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Columna Derecha: Previsualizador Real del Sitio Web en Vivo (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    👁️ Vista Previa 100% Real
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      En Vivo
                    </span>
                  </div>
                </div>

                {/* Mockup del Navegador con Iframe del Sitio Real */}
                <div className="border border-white/10 bg-[#0E121B] rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[480px]">
                  {/* Barra de Navegador Mockup */}
                  <div className="bg-[#181D2A] px-3 py-2 border-b border-white/10 flex items-center gap-2 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="bg-black/40 border border-white/5 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 flex-1 text-center font-mono truncate">
                      https://kowy.app/sitio/{activeTenantObj?.slug || 'sandra-color-s'}
                    </div>
                  </div>

                  {/* Iframe Real del Sitio Web con inyección reactiva */}
                  <div className="flex-1 w-full bg-white relative overflow-hidden">
                    {previewRenderedHtml ? (
                      <iframe
                        title="Live Website Preview"
                        srcDoc={previewRenderedHtml}
                        className="w-full h-full min-h-[440px] border-0"
                        sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-[#0B0F19]">
                        <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin mb-2" />
                        <span className="text-xs">Cargando diseño web oficial...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Botonera de Acción */}
            <div className="px-6 py-3.5 border-t border-black/5 dark:border-white/10 flex justify-between items-center bg-black/10 shrink-0">
              <a
                href={`/sitio/${activeTenantObj?.slug || 'sandra-color-s'}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-bold text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Sitio Oficial en Nueva Pestaña</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isSavingWebsite}
                  onClick={() => setIsWebsiteCustomizerOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer text-xs disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="website-customizer-form"
                  disabled={isSavingWebsite}
                  className={`bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold px-6 py-2 rounded-full shadow-lg shadow-[#FF5A36]/30 flex items-center gap-2 text-xs transition-all ${
                    isSavingWebsite ? 'opacity-70 cursor-wait' : 'active:scale-95 cursor-pointer'
                  }`}
                >
                  {isSavingWebsite ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Guardando y Publicando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Guardar y Publicar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIGURACIÓN GENERAL DEL NEGOCIO & HORARIOS */}
      {isBusinessSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in ${
            theme === 'dark' ? 'bg-[#141926] border-emerald-500/40 text-white' : 'bg-white border-emerald-500/40 text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-3.5 border-black/5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Configuración del Salón & Horarios</h3>
                  <span className="text-[11px] text-slate-400">Datos públicos para clientas y agendamiento</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsBusinessSettingsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const tid = activeTenantObj?.id || getActiveTenantId();
              if (!tid) return;

              const updates: Partial<Tenant> = {
                name: salonName,
                phone: salonPhone,
                address: salonAddress,
                currency: salonCurrency,
                business_hours: { summary: salonHours }
              };

              const res = await api.updateTenantSettings(tid, updates);
              if (res) {
                setActiveTenantObj(res);
              }
              setIsBusinessSettingsModalOpen(false);
            }} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Estos datos actualizan automáticamente tu página web pública y los mensajes de confirmación por WhatsApp.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Nombre Comercial del Salón *</label>
                  <input
                    type="text"
                    required
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    placeholder="ej. Sandra Color's / Luxus Spa"
                    className={`w-full border rounded-xl p-2.5 font-bold focus:outline-none focus:border-emerald-400 ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">WhatsApp Oficial de Contacto *</label>
                  <input
                    type="text"
                    required
                    value={salonPhone}
                    onChange={(e) => setSalonPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                    className={`w-full border rounded-xl p-2.5 font-bold focus:outline-none focus:border-emerald-400 ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Moneda Principal</label>
                  <select
                    value={salonCurrency}
                    onChange={(e) => setSalonCurrency(e.target.value as any)}
                    className={`w-full border rounded-xl p-2.5 font-bold focus:outline-none focus:border-emerald-400 cursor-pointer ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  >
                    <option value="COP">🇨🇴 COP ($ Pesos Colombianos)</option>
                    <option value="USD">🇺🇸 USD ($ Dólares)</option>
                    <option value="MXN">🇲🇽 MXN ($ Pesos Mexicanos)</option>
                    <option value="EUR">🇪🇺 EUR (€ Euros)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Dirección Física del Local</label>
                  <input
                    type="text"
                    value={salonAddress}
                    onChange={(e) => setSalonAddress(e.target.value)}
                    placeholder="ej. Calle 10 # 43E-22, Medellín"
                    className={`w-full border rounded-xl p-2.5 focus:outline-none focus:border-emerald-400 ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-400 font-bold">🕒 Horarios de Atención al Público *</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSalonHours('Lun a Sáb: 8:00 AM – 7:00 PM')}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold"
                      >
                        Estándar
                      </button>
                      <button
                        type="button"
                        onClick={() => setSalonHours('Lun a Dom: 9:00 AM – 8:00 PM')}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold"
                      >
                        Todos los días
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    value={salonHours}
                    onChange={(e) => setSalonHours(e.target.value)}
                    placeholder="ej. Lun a Sáb: 8:00 AM – 7:00 PM | Dom: Cerrado"
                    className={`w-full border rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-400 ${
                      theme === 'dark' ? 'bg-[#0E121B] border-white/10 text-white' : 'bg-[#F0F2F7] border-black/5 text-slate-900'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Este horario se mostrará en el pie de página y en tu portal de reservas</span>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBusinessSettingsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-2.5 rounded-full shadow-md shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Horarios y Datos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MI PLAN & SUSCRIPCIÓN SAAS (DARK MODE NATIVO Y NÍTIDO) */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
          <div className="border border-white/15 bg-gradient-to-b from-[#161B2B] via-[#0F131F] to-[#0A0D14] text-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-6 animate-fade-in relative">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center border-b pb-4 border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FF5A36] text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/30 shrink-0">
                  <Crown className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-white tracking-tight">Mi Plan SaaS & Suscripción</h3>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
                      Plan Actual: {activeTenantObj?.plan_tier ? activeTenantObj.plan_tier.toUpperCase() : 'CRECIMIENTO'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Gestiona los módulos activos, facturación y días restantes de tu salón</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsPlanModalOpen(false)} 
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-all border border-white/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tarjeta de Estado Actual de la Suscripción */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-pink-500/10 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Plan Activo</span>
                <strong className="text-base text-amber-300 font-extrabold flex items-center gap-1.5">
                  📈 Plan Crecimiento ⭐
                </strong>
                <span className="text-xs text-slate-300 block font-semibold">$120.000 COP / mes</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Estado de tu Cuenta</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                  ● Mes 1 de Regalo Activo
                </span>
                <span className="text-[10px] text-slate-400 block">Cuota inicial de $50k cancelada</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 block font-bold uppercase tracking-wider">Vigencia Restante</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">30</span>
                  <span className="text-xs font-bold text-amber-400">Días restantes</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Sin cobros automáticos ni sorpresas</span>
              </div>
            </div>

            {/* Escalera Oficial Completa de Planes SaaS (6 Planes) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span>📊 Escalera Completa de Planes en Colombia ($ COP)</span>
                </h4>
                <span className="text-[10px] text-slate-400">Precios en Pesos Colombianos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                
                {/* 0. Plan Gratuito */}
                <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-2 hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-200 font-bold">🌐 Plan Gratuito</strong>
                    <span className="text-slate-400 font-black text-xs">$0 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">Web vitrina de por vida con fotos, catálogo y botón directo a WhatsApp.</p>
                  <span className="text-[10px] text-slate-500 block font-mono">Sin agendador online</span>
                </div>

                {/* 1. Plan Inicio */}
                <div className="p-4 rounded-2xl bg-[#0A0D14] border border-blue-500/30 space-y-2 hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-blue-300 font-bold">🚀 Plan Inicio</strong>
                    <span className="text-blue-400 font-black text-xs">$50.000 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Agendador online interactivo + hasta 4 colaboradores con agenda individual.</p>
                  <span className="text-[10px] text-blue-400/80 block font-semibold">Ideal para salones pequeños</span>
                </div>

                {/* 2. Plan Crecimiento (ACTUAL) */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/60 space-y-2 relative shadow-lg shadow-amber-500/10">
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-[#FF5A36] text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    TU PLAN ACTUAL ⭐
                  </span>
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-300 font-bold">📈 Plan Crecimiento</strong>
                    <span className="text-amber-300 font-black text-xs">$120.000 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-snug">Colaboradoras ilimitadas + App móvil para estilistas + Caja POS y comisiones.</p>
                  <span className="text-[10px] text-amber-400 block font-bold">✓ Incluido en tu primer mes</span>
                </div>

                {/* 3. Plan Pro Flow IA */}
                <div className="p-4 rounded-2xl bg-[#0A0D14] border border-purple-500/30 space-y-2 hover:border-purple-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-purple-300 font-bold">🤖 Pro Flow IA</strong>
                    <span className="text-purple-400 font-black text-xs">$240.000 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Agente Flowy IA 24/7 en WhatsApp + Bandeja Omnicanal + Recordatorios 2h antes.</p>
                  <span className="text-[10px] text-purple-400 block font-semibold">Cero citas perdidas</span>
                </div>

                {/* 4. Plan Escala & Tráfico */}
                <div className="p-4 rounded-2xl bg-[#0A0D14] border border-emerald-500/30 space-y-2 hover:border-emerald-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-emerald-300 font-bold">🎯 Plan Escala</strong>
                    <span className="text-emerald-400 font-black text-xs">$720.000 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Embudos de ofertas flash + Pauta Meta Ads + Radar reactivación (+35 días).</p>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Atracción masiva de clientas</span>
                </div>

                {/* 5. Plan Agencia Partner VIP */}
                <div className="p-4 rounded-2xl bg-[#0A0D14] border border-pink-500/30 space-y-2 hover:border-pink-500/50 transition-all">
                  <div className="flex justify-between items-center">
                    <strong className="text-pink-300 font-bold">👑 Agencia Partner VIP</strong>
                    <span className="text-pink-400 font-black text-xs">$1.440.000 / mes</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Servicio Llave en Mano: equipo dedicado, dominio propio y consultoría semanal.</p>
                  <span className="text-[10px] text-pink-400 block font-semibold">Acompañamiento total</span>
                </div>

              </div>
            </div>

            {/* Footer de Renovación / Upgrade */}
            <div className="p-4 rounded-2xl bg-[#0A0D14] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-white block font-bold">¿Deseas renovar tu mes o subir a Flowy IA WhatsApp?</strong>
                <span className="text-slate-400 text-[11px]">Escríbenos directamente por WhatsApp para activar tu asistente virtual o renovar tu suscripción.</span>
              </div>
              <a
                href="https://wa.me/573000000000?text=Hola%20BeautyFlow,%20deseo%20consultar%20sobre%20mi%20plan%20o%20renovaci%C3%B3n"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar Asesor por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* MODAL KIT IMPRIMIBLE DE CÓDIGO QR PARA RESERVAS */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in overflow-y-auto">
          <div className="bg-[#161B2B] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl relative space-y-4 text-white max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 my-auto">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="sticky top-0 float-right -mt-1 -mr-1 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header del Modal */}
            <div className="text-center space-y-1 pt-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/25">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">Kit de Código QR para el Salón</h3>
              <p className="text-[11px] text-slate-400">
                Coloca este código en la recepción, espejos o puerta para que tus clientes agenden solos.
              </p>
            </div>

            {/* Tarjeta Visual Imprimible tipo Acrílico de Salón */}
            {(() => {
              const currentSlug = activeTenantObj?.slug || salonName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'mi-salon';
              const baseUrl = window.location.origin ? window.location.origin : 'https://belleza2027.netlify.app';
              const bookingUrl = `${baseUrl}/reservar/${currentSlug}`;

              return (
                <>
                  <div id="printable-qr-card" className="bg-gradient-to-b from-[#0E121B] to-[#0A0D14] border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        Reserva Online en 30 Segundos
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-white mt-1">{salonName}</h4>
                      <p className="text-[10px] text-slate-400">Escanea con la cámara de tu celular</p>
                    </div>

                    {/* Imagen del Código QR Oficial */}
                    <div className="bg-white p-3 rounded-2xl inline-block shadow-2xl border-4 border-slate-900">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(bookingUrl)}&color=0e121b&bgcolor=ffffff&margin=1`}
                        alt={`Código QR de Reservas para ${salonName}`}
                        className="w-36 h-36 sm:w-40 sm:h-40 object-contain mx-auto"
                      />
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Sin filas ni esperas telefónicas</span>
                    </div>

                    <div className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 py-1 px-2 rounded-lg border border-emerald-500/20 truncate">
                      {bookingUrl}
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        // Crear un Canvas HD para componer el afiche completo imprimible
                        const canvas = document.createElement('canvas');
                        canvas.width = 1200;
                        canvas.height = 1600;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;

                        // 1. Fondo elegante oscuro con degradado
                        const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1600);
                        bgGrad.addColorStop(0, '#0E121B');
                        bgGrad.addColorStop(0.5, '#161B2B');
                        bgGrad.addColorStop(1, '#0A0D14');
                        ctx.fillStyle = bgGrad;
                        ctx.fillRect(0, 0, 1200, 1600);

                        // 2. Borde exterior esmeralda / neón
                        ctx.strokeStyle = '#10B981';
                        ctx.lineWidth = 16;
                        ctx.strokeRect(40, 40, 1120, 1520);

                        // 3. Badge superior: "RESERVA ONLINE EN 30 SEGUNDOS"
                        ctx.fillStyle = '#064E3B';
                        ctx.beginPath();
                        ctx.roundRect(300, 130, 600, 70, 35);
                        ctx.fill();
                        ctx.strokeStyle = '#34D399';
                        ctx.lineWidth = 4;
                        ctx.stroke();

                        ctx.fillStyle = '#6EE7B7';
                        ctx.font = 'bold 26px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('✨ RESERVA ONLINE EN 30 SEGUNDOS', 600, 175);

                        // 4. Nombre del Salón
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '900 68px sans-serif';
                        ctx.fillText(salonName || 'Mi Salón de Belleza', 600, 290);

                        // 5. Subtítulo instructivo
                        ctx.fillStyle = '#94A3B8';
                        ctx.font = '500 34px sans-serif';
                        ctx.fillText('Escanea este código con la cámara de tu celular', 600, 360);

                        // 6. Cargar y dibujar el Código QR en alta definición
                        const qrImg = new Image();
                        qrImg.crossOrigin = 'anonymous';
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=700x700&data=${encodeURIComponent(bookingUrl)}&color=0e121b&bgcolor=ffffff&margin=2`;

                        qrImg.onload = () => {
                          // Marco blanco con sombra para el QR
                          ctx.fillStyle = '#FFFFFF';
                          ctx.beginPath();
                          ctx.roundRect(250, 440, 700, 700, 40);
                          ctx.fill();

                          // Dibujar imagen del QR
                          ctx.drawImage(qrImg, 270, 460, 660, 660);

                          // 7. Pie de Afiche / Beneficios
                          ctx.fillStyle = '#F59E0B';
                          ctx.font = 'bold 36px sans-serif';
                          ctx.fillText('⭐ Agenda en el horario que prefieras', 600, 1240);

                          ctx.fillStyle = '#E2E8F0';
                          ctx.font = 'bold 32px sans-serif';
                          ctx.fillText('⚡ Sin filas, sin llamadas, confirmación directa a tu WhatsApp', 600, 1310);

                          // Línea decorativa
                          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                          ctx.lineWidth = 2;
                          ctx.beginPath();
                          ctx.moveTo(200, 1380);
                          ctx.lineTo(1000, 1380);
                          ctx.stroke();

                          // Crédito inferior
                          ctx.fillStyle = '#64748B';
                          ctx.font = '500 24px sans-serif';
                          ctx.fillText('Tecnología Kowy.app • Sistema Oficial de Reservas', 600, 1440);

                          // Descargar automáticamente la imagen
                          const link = document.createElement('a');
                          link.download = `Afiche_QR_Reservas_${salonName.replace(/\s+/g, '_')}.png`;
                          link.href = canvas.toDataURL('image/png');
                          link.click();
                        };

                        qrImg.src = qrUrl;
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Afiche Completo HD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(bookingUrl);
                        alert(`¡Enlace de reservas copiado al portapapeles! 📋\n${bookingUrl}`);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs border border-white/10 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      <span>Copiar Enlace Directo</span>
                    </button>
                  </div>
                </>
              );
            })()}

          </div>
        </div>
      )}

      {/* MODAL DE BIENVENIDA VIP PARA NUEVOS USUARIOS (CHECKLIST 1-2-3) */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setIsWelcomeModalOpen(false);
          if (ownerEmail) {
            localStorage.setItem(`bf_welcome_seen_${ownerEmail.toLowerCase().trim()}`, 'true');
          }
          if (activeTenantObj?.id) {
            localStorage.setItem(`bf_welcome_seen_${activeTenantObj.id}`, 'true');
          }
        }}
        tenant={activeTenantObj}
        ownerName={ownerName}
        servicesCount={services.length}
        stylistsCount={stylists.length}
        onOpenCustomizer={() => setIsWebsiteCustomizerOpen(true)}
        onOpenNewService={() => {
          setActiveTab('catalog_team');
          setCatalogSubTab('services');
          setEditingService(null);
          setIsServiceModalOpen(true);
        }}
        onOpenNewStylist={() => {
          setActiveTab('catalog_team');
          setCatalogSubTab('stylists');
          setEditingStylist(null);
          setIsStylistModalOpen(true);
        }}
        onNavigateTab={(tab) => {
          if (tab === 'servicios') {
            setActiveTab('catalog_team');
            setCatalogSubTab('services');
          } else if (tab === 'especialistas') {
            setActiveTab('catalog_team');
            setCatalogSubTab('stylists');
          } else {
            setActiveTab(tab as any);
          }
        }}
      />

      {/* MODAL DE UPGRADE Y DESBLOQUEO DE FUNCIONES SAAS */}
      <PlanUpgradeModal
        isOpen={upgradeModalState.isOpen}
        onClose={() => setUpgradeModalState(prev => ({ ...prev, isOpen: false }))}
        requiredPlan={upgradeModalState.requiredPlan}
        currentPlan={activeTenantObj?.plan_tier}
        featureName={upgradeModalState.featureName}
        featureDescription={upgradeModalState.featureDescription}
        salonName={salonName}
      />

    </div>
  );
};
