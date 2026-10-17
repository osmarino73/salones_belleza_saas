export type BeautyImageType = 'servicio' | 'hero_desktop' | 'hero_mobile' | 'banner_catalogo' | 'story';

export interface BeautyStockImage {
  id: string;
  title: string;
  category: 'barberia' | 'peluqueria' | 'unas' | 'pestanas' | 'spa' | 'todos';
  categoryLabel: string;
  imageType?: BeautyImageType;
  imageUrl: string;
  thumbnailUrl: string;
  tags: string[];
}

export interface BeautyImageSectionType {
  id: 'todos' | BeautyImageType;
  name: string;
  ratio: string;
  icon: string;
  description: string;
}

export interface BeautyServiceCategory {
  id: string;
  nombre: string;
  icono: string;
  sub: string;
}

export interface BeautyService {
  id?: string;
  titulo: string;
  descripcion: string;
  precio_cop: number;
  duracion_min?: number;
  duracion_texto?: string; // ej: "45 min", "1h 30m"
  imagen_url: string;
  categoria: string;
  etiqueta?: string; // "POPULAR", "TOP", "PROMO"
  profesionales?: string[]; // Nombres de barberos/estilistas que lo hacen
}

export interface BeautySpecialty {
  id: string;
  label: string;
  color: string;
  heroBadge: string;
  heroImage?: string;
  heroMobileImage?: string;
  menuBannerUrl?: string;
  categories: BeautyServiceCategory[];
  services: BeautyService[];
}

export interface ProspectSite {
  id: string;
  slug: string;
  business_name: string;
  phone_whatsapp: string;
  address?: string;
  city?: string;
  google_maps_url?: string;
  raw_html: string;
  category: 'barberia' | 'peluqueria_damas' | 'unas_nails' | 'pestanas_cejas' | 'spa_estetica' | 'otro';
  status: 'prospecto' | 'contactado' | 'reclamado' | 'cliente_pago';
  claimed_tenant_id?: string;
  primary_color: string;
  business_data?: {
    banner_url?: string;
    banner_vertical_url?: string;
    logo_url?: string;
    menu_banner_url?: string;
    story_image_url?: string;
    instagram?: string;
    horarios?: string;
    specialty_id?: string;
    copywriting?: ProspectCopywriting;
    services?: BeautyService[];
  };
  created_by?: string;
  creator_email?: string;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProspectCopywriting {
  headline?: string;
  subheadline?: string;
  badge?: string;
  storyTitle?: string;
  storyText?: string;
  ctaText?: string;
  benefits?: { title: string; desc: string; icon?: string }[];
}

export interface FieldAgent {
  id: string;
  user_id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  estado: 'activo' | 'inactivo';
  created_at?: string;
  metricas?: {
    totalProspectos: number;
    prospectosHoy: number;
    prospectosSemana: number;
    convertidos: number;
  };
}
