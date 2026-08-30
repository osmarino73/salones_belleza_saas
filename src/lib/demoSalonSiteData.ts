import { ProspectSite, Tenant, Service, Stylist } from '../types';
import { MILENA_GOMEZ_SITE_DATA } from './milenaGomezSiteData';

export const DEMO_TENANT_DATA: Tenant = {
  id: 'tenant-demo',
  name: 'Studio Glamour & Spa',
  slug: 'demo',
  owner_email: 'demo@studioglamour.co',
  phone: '+57 311 419 5123',
  address: 'Cra. 43A #1-50, El Poblado, Medellín, Colombia',
  city: 'Medellín',
  country: 'Colombia',
  currency: 'COP',
  is_active: true,
  plan: 'vip_360',
  plan_tier: 'crecimiento',
  subscription_status: 'active',
  created_at: '2026-08-01T00:00:00.000Z',
  business_hours: {
    summary: 'Lunes a Sábado: 8:00 AM - 7:00 PM'
  },
  navbar_tagline: 'Especialistas en Colorimetría, Balayage & Cuidado Capilar • Medellín',
  hero_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  about_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
  show_team_section: true,
  show_about_section: true,
  show_first_visit_discount: true,
  first_visit_discount_pct: 15,
  first_visit_discount_title: '15% de Regalo en tu Primera Cita'
};

export const DEMO_SERVICES_DATA: Service[] = [
  {
    id: 'srv-demo-1',
    tenant_id: 'tenant-demo',
    name: 'Balayage Deluxe & Matizado Orgánico',
    category: 'color',
    duration_minutes: 120,
    price_cop: 180000,
    price_usd: 45,
    price: 180000,
    requires_patch_test: true,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    description: 'Aclaración personalizada con técnica mano alzada, nutrición Plex y matizado de brillo espejo.'
  },
  {
    id: 'srv-demo-2',
    tenant_id: 'tenant-demo',
    name: 'Corte de Diseño & Cepillado Spa',
    category: 'corte',
    duration_minutes: 45,
    price_cop: 60000,
    price_usd: 15,
    price: 60000,
    requires_patch_test: false,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    description: 'Diagnóstico de visagismo, lavado con masaje capilar, corte de autor y brushing profesional.'
  },
  {
    id: 'srv-demo-3',
    tenant_id: 'tenant-demo',
    name: 'Tratamiento de Keratina & Brillo Espejo',
    category: 'keratina',
    duration_minutes: 90,
    price_cop: 150000,
    price_usd: 38,
    price: 150000,
    requires_patch_test: false,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    description: 'Alisado orgánico libre de formol que sella cutículas, elimina frizz y aporta sedosidad extrema.'
  },
  {
    id: 'srv-demo-4',
    tenant_id: 'tenant-demo',
    name: 'Manicure Ruso & Semipermanente',
    category: 'nails',
    duration_minutes: 60,
    price_cop: 45000,
    price_usd: 12,
    price: 45000,
    requires_patch_test: false,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    description: 'Limpieza profunda de cutícula con torno, nivelación con base rubber y esmaltado de alta duración.'
  },
  {
    id: 'srv-demo-5',
    tenant_id: 'tenant-demo',
    name: 'Diseño de Cejas & Lifting de Pestañas',
    category: 'spa',
    duration_minutes: 45,
    price_cop: 55000,
    price_usd: 14,
    price: 55000,
    requires_patch_test: false,
    is_featured: true,
    image_url: 'https://images.unsplash.com/photo-1588514912908-724128526569?auto=format&fit=crop&w=800&q=80',
    description: 'Curvatura natural con hidratación de queratina y visagismo con pigmento semipermanente.'
  }
];

export const DEMO_STYLISTS_DATA: Stylist[] = [
  {
    id: 'sty-demo-1',
    tenant_id: 'tenant-demo',
    name: 'Valentina Rengifo',
    email: 'valentina@studioglamour.co',
    phone: '+57 311 419 5123',
    phone_whatsapp: '+57 311 419 5123',
    specialty: 'Master Colorista & Directora',
    role: 'admin',
    is_owner: true,
    is_active: true,
    attends_clients: true,
    show_on_web: true,
    rating: 5.0,
    reviews_count: 56,
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    commission_service_pct: 50,
    commission_retail_pct: 10,
    service_categories: ['color', 'corte', 'keratina']
  },
  {
    id: 'sty-demo-2',
    tenant_id: 'tenant-demo',
    name: 'Camila Morales',
    email: 'camila@studioglamour.co',
    phone: '+57 311 419 5123',
    phone_whatsapp: '+57 311 419 5123',
    specialty: 'Especialista en Uñas & Mirada',
    role: 'colaborador',
    is_owner: false,
    is_active: true,
    attends_clients: true,
    show_on_web: true,
    rating: 4.9,
    reviews_count: 42,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    commission_service_pct: 45,
    commission_retail_pct: 10,
    service_categories: ['nails', 'spa']
  },
  {
    id: 'sty-demo-3',
    tenant_id: 'tenant-demo',
    name: 'Andrés Restrepo',
    email: 'andres@studioglamour.co',
    phone: '+57 311 419 5123',
    phone_whatsapp: '+57 311 419 5123',
    specialty: 'Estilista & Diseñador de Corte',
    role: 'colaborador',
    is_owner: false,
    is_active: true,
    attends_clients: true,
    show_on_web: true,
    rating: 4.9,
    reviews_count: 38,
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    commission_service_pct: 45,
    commission_retail_pct: 10,
    service_categories: ['corte', 'keratina']
  }
];

export const DEMO_SALON_SITE_DATA: ProspectSite = {
  id: 'ps-demo-salon-100',
  slug: 'demo',
  business_name: 'Studio Glamour & Spa',
  phone_whatsapp: '+57 311 419 5123',
  address: 'Cra. 43A #1-50, El Poblado',
  city: 'Medellín',
  country: 'Colombia',
  google_maps_url: 'https://maps.google.com/?q=El+Poblado+Medellin',
  status: 'prospecto',
  views_count: 142,
  claimed_tenant_id: 'tenant-demo',
  created_at: '2026-08-01T00:00:00.000Z',
  raw_html: MILENA_GOMEZ_SITE_DATA.raw_html,
  business_data: {
    nombre: 'Studio Glamour & Spa',
    rubro: 'Salón de Belleza & Spa',
    hero_eyebrow: 'Bienvenidos a ❤️',
    slogan: 'Studio Glamour & Spa',
    title_accent: 'Tu Salón de Alta Belleza en Medellín',
    subtitle: 'Colorimetría avanzada, balayage de autor, cuidado capilar y spa de uñas en El Poblado.',
    navbar_tagline: 'Especialistas en Colorimetría, Balayage & Cuidado Capilar • Medellín',
    horario_atencion: 'Lunes a Sábado: 8:00 AM - 7:00 PM',
    business_hours: { summary: 'Lunes a Sábado: 8:00 AM - 7:00 PM' },
    primary_color: '#FF5A36',
    contacto: {
      telefono_principal: '+57 311 419 5123',
      whatsapp: { numero: '+573114195123', link: 'https://wa.me/573114195123' }
    },
    ubicacion: {
      direccion: 'Cra. 43A #1-50, El Poblado',
      ciudad: 'Medellín',
      google_maps_url: 'https://maps.google.com/?q=El+Poblado+Medellin'
    },
    servicios: DEMO_SERVICES_DATA.map(s => ({
      id: s.id,
      titulo: s.name,
      descripcion: s.description,
      precio_cop: s.price_cop,
      duracion_minutos: s.duration_minutes,
      image_url: s.image_url
    })),
    especialistas: DEMO_STYLISTS_DATA.map(st => ({
      id: st.id,
      nombre: st.name,
      rol: st.specialty,
      foto_url: st.photo_url
    }))
  }
};
