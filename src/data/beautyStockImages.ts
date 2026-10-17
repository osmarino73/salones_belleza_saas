import { BeautyStockImage, BeautyImageSectionType, BeautyImageType } from '../types';

export const BEAUTY_IMAGE_TYPES: BeautyImageSectionType[] = [
  { id: 'todos', name: 'Todos los Formatos', ratio: 'Todos', icon: '🖼️', description: 'Todas las fotos de la biblioteca' },
  { id: 'servicio', name: 'Fotos de Servicios', ratio: '1:1', icon: '✂️', description: 'Tarjetas de cortes, peinados y tratamientos (800x800)' },
  { id: 'hero_desktop', name: 'Hero Escritorio', ratio: '16:9', icon: '💻', description: 'Cabecera de página en PC/Desktop (1920x1080)' },
  { id: 'hero_mobile', name: 'Hero Móvil', ratio: '4:5', icon: '📱', description: 'Cabecera optimizada para smartphone (1080x1350)' },
  { id: 'banner_catalogo', name: 'Banner de Servicios', ratio: '3:1', icon: '🏷️', description: 'Encabezado panorámico del catálogo (1200x400)' },
  { id: 'story', name: 'Nuestro Salón & Experiencia', ratio: '4:3', icon: '🏛️', description: 'Espacio, sillones, ambiente y equipo (800x600)' },
];

export const BEAUTY_STOCK_CATEGORIES = [
  { id: 'todos', name: 'Todos los Rubros', icon: '✨' },
  { id: 'barberia', name: 'Barbería Clásica & Fade', icon: '💈' },
  { id: 'peluqueria', name: 'Peluquería Femenina & Color', icon: '💇‍♀️' },
  { id: 'unas', name: 'Nails Bar & Manicura Spa', icon: '💅' },
  { id: 'pestanas', name: 'Lash & Brow Studio', icon: '👁️' },
  { id: 'spa', name: 'Spa, Facial & Bienestar', icon: '🧖‍♀️' },
] as const;

export const BEAUTY_STOCK_IMAGES: BeautyStockImage[] = [
  // ==========================================
  // 1. BARBERÍA & CORTE MASCULINO
  // ==========================================
  {
    id: 'barber-fade-texture',
    title: 'Corte Degradado Low Fade con Textura',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=300&q=70',
    tags: ['fade', 'degradado', 'corte', 'barberia', 'textura', 'pompadour']
  },
  {
    id: 'barber-beard-trim',
    title: 'Perfilado de Barba & Ritual Toalla Caliente',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=300&q=70',
    tags: ['barba', 'ritual', 'toalla caliente', 'afeitado', 'perfilado', 'navaja']
  },
  {
    id: 'barber-hero-desktop',
    title: 'Barbero Maestro Perfilando Barba a Navaja (HD)',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'hero_desktop',
    imageUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp',
    thumbnailUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp',
    tags: ['hero', 'desktop', 'barba', 'navaja', 'barbero', 'portada']
  },
  {
    id: 'barber-hero-mobile',
    title: 'Barbero Ejecutando Skin Fade de Precisión (HD)',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'hero_mobile',
    imageUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp',
    thumbnailUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp',
    tags: ['hero', 'mobile', 'fade', 'degradado', 'corte', 'vertical']
  },
  {
    id: 'barber-station-vintage',
    title: 'Estación de Barbería Clásica Vintage',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'story',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=70',
    tags: ['interior', 'salon', 'barberia', 'vintage', 'sillas']
  },
  {
    id: 'barber-story-salon',
    title: 'Ambiente Acogedor & Sillones Hidráulicos',
    category: 'barberia',
    categoryLabel: 'Barbería Clásica & Fade',
    imageType: 'story',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=300&q=70',
    tags: ['historia', 'salon', 'sillones', 'ambiente', 'equipo']
  },

  // ==========================================
  // 2. PELUQUERÍA FEMENINA & COLOR
  // ==========================================
  {
    id: 'salon-balayage-blonde',
    title: 'Técnica Balayage & Matizado Rubio Dorado',
    category: 'peluqueria',
    categoryLabel: 'Peluquería Femenina & Color',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=300&q=70',
    tags: ['balayage', 'rubio', 'colorimetria', 'mechas', 'iluminacion']
  },
  {
    id: 'salon-cut-blowdry',
    title: 'Corte de Estilo & Cepillado Voluminoso',
    category: 'peluqueria',
    categoryLabel: 'Peluquería Femenina & Color',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=70',
    tags: ['corte', 'cepillado', 'peinado', 'styling', 'ondulado']
  },
  {
    id: 'salon-hero-desktop',
    title: 'Salón de Belleza Iluminado & Espejos LED',
    category: 'peluqueria',
    categoryLabel: 'Peluquería Femenina & Color',
    imageType: 'hero_desktop',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=70',
    tags: ['hero', 'desktop', 'salon', 'espejos', 'lujo']
  },
  {
    id: 'salon-hero-mobile',
    title: 'Estilista Profesional en Sesión de Peinado',
    category: 'peluqueria',
    categoryLabel: 'Peluquería Femenina & Color',
    imageType: 'hero_mobile',
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1080&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=300&q=70',
    tags: ['hero', 'mobile', 'estilista', 'peluqueria', 'modelo']
  },

  // ==========================================
  // 3. NAILS BAR & MANICURA SPA
  // ==========================================
  {
    id: 'nails-acrylic-art',
    title: 'Uñas Acrílicas Esculpidas con Nail Art',
    category: 'unas',
    categoryLabel: 'Nails Bar & Manicura Spa',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=300&q=70',
    tags: ['unas', 'acrilico', 'nail art', 'manicura', 'esmaltado']
  },
  {
    id: 'nails-pedicure-spa',
    title: 'Spa Pedicure con Exfoliación & Masaje',
    category: 'unas',
    categoryLabel: 'Nails Bar & Manicura Spa',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=300&q=70',
    tags: ['pedicure', 'spa', 'pies', 'relajacion', 'masaje']
  },
  {
    id: 'nails-hero-desktop',
    title: 'Editorial Uñas & Campaña Beauty Nails (HD)',
    category: 'unas',
    categoryLabel: 'Nails Bar & Manicura Spa',
    imageType: 'hero_desktop',
    imageUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp',
    thumbnailUrl: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp',
    tags: ['hero', 'desktop', 'nails', 'manicura', 'campaña', 'modelo', 'manos']
  },
  {
    id: 'nails-hero-mobile',
    title: 'Primer Plano de Manicura Francesa Minimalista',
    category: 'unas',
    categoryLabel: 'Nails Bar & Manicura Spa',
    imageType: 'hero_mobile',
    imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1080&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=300&q=70',
    tags: ['hero', 'mobile', 'manicura', 'francesa', 'elegante']
  },

  // ==========================================
  // 4. LASH & BROW STUDIO
  // ==========================================
  {
    id: 'lash-volume-russian',
    title: 'Extensiones de Pestañas Volumen Ruso',
    category: 'pestanas',
    categoryLabel: 'Lash & Brow Studio',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=300&q=70',
    tags: ['pestanas', 'volumen ruso', 'lifting', 'mirada', 'extensiones']
  },
  {
    id: 'brow-lamination',
    title: 'Diseño & Laminado de Cejas con Henna',
    category: 'pestanas',
    categoryLabel: 'Lash & Brow Studio',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1597225244660-1cd128c64284?auto=format&fit=crop&w=300&q=70',
    tags: ['cejas', 'laminado', 'microblading', 'henna', 'perfilado']
  },

  // ==========================================
  // 5. SPA & ESTÉTICA FACIAL
  // ==========================================
  {
    id: 'spa-facial-glow',
    title: 'Limpieza Facial Profunda con Hidratación Glow',
    category: 'spa',
    categoryLabel: 'Spa, Facial & Bienestar',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=70',
    tags: ['facial', 'spa', 'limpieza', 'hidratacion', 'glow', 'mascarilla']
  },
  {
    id: 'spa-massage-relax',
    title: 'Masaje Relajante Antiestrés con Aromaterapia',
    category: 'spa',
    categoryLabel: 'Spa, Facial & Bienestar',
    imageType: 'servicio',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=70',
    tags: ['masaje', 'spa', 'relajante', 'antiestres', 'aceites', 'bienestar']
  }
];

export const getBeautyStockImagesByType = (type: BeautyImageType | 'todos') => {
  if (type === 'todos') return BEAUTY_STOCK_IMAGES;
  return BEAUTY_STOCK_IMAGES.filter(img => img.imageType === type);
};
