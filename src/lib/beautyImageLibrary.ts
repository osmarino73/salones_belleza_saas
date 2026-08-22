/**
 * BEAUTYFLOW AI - BIBLIOTECA DE IMÁGENES DE MUESTRA DE ALTA GAMA (STOCK CDN)
 * 
 * Imágenes curadas de alta resolución, optimizadas en formato WebP para salones, spas,
 * barberías y centros de estética. Reemplaza Base64 pesados reduciendo el peso de 5MB a ~12KB.
 */

import { MediaItem } from '../types';

export interface StockImageItem {
  id: string;
  category: 'hero_salon' | 'hero_spa' | 'hero_barber' | 'hero_nails' | 'color' | 'cortes' | 'keratina' | 'nails' | 'spa_facial' | 'barberia' | 'maquillaje' | 'especialistas';
  title: string;
  url: string;
  tags: string[];
}

export const BEAUTY_STOCK_LIBRARY: StockImageItem[] = [
  // ==========================================
  // HERO & FACHADAS DE LUJO
  // ==========================================
  {
    id: 'hero-salon-gold',
    category: 'hero_salon',
    title: 'Salón de Belleza Moderno & Estaciones Doradas',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    tags: ['salon', 'lujo', 'espejos', 'estaciones', 'peluqueria']
  },
  {
    id: 'hero-salon-minimal',
    category: 'hero_salon',
    title: 'Estudio de Belleza Minimalista & Sillas Negras',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    tags: ['salon', 'minimalista', 'moderno', 'peluqueria']
  },
  {
    id: 'hero-spa-zen',
    category: 'hero_spa',
    title: 'Spa Relax Zen con Velas y Bambú',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    tags: ['spa', 'relax', 'masajes', 'zen', 'bienestar']
  },
  {
    id: 'hero-barber-vintage',
    category: 'hero_barber',
    title: 'Barbería Clásica & Cuero Chesterfield',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    tags: ['barberia', 'vintage', 'hombres', 'cuero', 'fade']
  },
  {
    id: 'hero-nails-lounge',
    category: 'hero_nails',
    title: 'Nail Lounge Aesthetic & Iluminación Rosa',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80',
    tags: ['nails', 'uñas', 'lounge', 'acrilico', 'spa']
  },

  // ==========================================
  // COLORIMETRÍA & BALAYAGE
  // ==========================================
  {
    id: 'color-balayage-blonde',
    category: 'color',
    title: 'Balayage Rubio Cenizo en Ondas',
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    tags: ['balayage', 'rubio', 'color', 'ondas', 'mechas']
  },
  {
    id: 'color-brunette-caramel',
    category: 'color',
    title: 'Morena Iluminada Tono Caramelo & Avellana',
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    tags: ['morena iluminada', 'caramelo', 'color', 'brillo']
  },
  {
    id: 'color-copper-gold',
    category: 'color',
    title: 'Cobrizo Intenso & Efecto Espejo',
    url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=80',
    tags: ['cobrizo', 'tinte', 'cobre', 'brillo']
  },

  // ==========================================
  // CORTES & ESTILISMO
  // ==========================================
  {
    id: 'corte-bob-capas',
    category: 'cortes',
    title: 'Corte Bob Francés en Capas con Brushing',
    url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    tags: ['corte', 'bob', 'brushing', 'estilismo', 'peinado']
  },
  {
    id: 'corte-ondas-novia',
    category: 'cortes',
    title: 'Peinado Glam con Ondas Hollywoodenses',
    url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    tags: ['ondas', 'peinado', 'novia', 'evento', 'secado']
  },

  // ==========================================
  // KERATINAS & ALISADOS
  // ==========================================
  {
    id: 'keratina-liso-espejo',
    category: 'keratina',
    title: 'Alisado Orgánico & Brillo Seda',
    url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    tags: ['keratina', 'alisado', 'liso', 'botox', 'organico']
  },

  // ==========================================
  // NAIL ART & MANICURA
  // ==========================================
  {
    id: 'nails-rusa-francesa',
    category: 'nails',
    title: 'Manicura Rusa con Esmaltado Soft & French',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    tags: ['manicura', 'uñas', 'semipermanente', 'rusa', 'french']
  },
  {
    id: 'nails-art-luxury',
    category: 'nails',
    title: 'Nail Art Minimalista con Hojilla de Oro',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    tags: ['nail art', 'uñas', 'gel', 'acrilicas', 'lujo']
  },

  // ==========================================
  // SPA, FACIALES & MASAJE
  // ==========================================
  {
    id: 'spa-facial-mask',
    category: 'spa_facial',
    title: 'Limpieza Facial Profunda & Mascarilla Hidratante',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    tags: ['facial', 'mascarilla', 'limpieza', 'piel', 'estetica']
  },
  {
    id: 'spa-masaje-velas',
    category: 'spa_facial',
    title: 'Masaje Relajante Descontracturante con Aceites',
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    tags: ['masaje', 'relajacion', 'espalda', 'aceites', 'spa']
  },

  // ==========================================
  // BARBERÍA MASCULINA, FADE & CUIDADO DE BARBA
  // ==========================================
  {
    id: 'barber-fade-beard',
    category: 'barberia',
    title: 'Mid Fade con Ritual de Barba y Toalla Caliente',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    tags: ['fade', 'barba', 'corte hombre', 'degradado', 'navaja', 'ritual']
  },
  {
    id: 'barber-styling',
    category: 'barberia',
    title: 'Corte Ejecutivo & Pompadour Clásico con Pomada',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    tags: ['pompadour', 'corte masculino', 'barberia', 'estilo', 'clasico']
  },
  {
    id: 'barber-beard-trim',
    category: 'barberia',
    title: 'Perfilado de Barba con Navaja & Óleo Hidratante',
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    tags: ['barba', 'perfilado', 'navaja', 'barberia', 'lineas', 'arreglo de barba']
  },
  {
    id: 'barber-hot-towel',
    category: 'barberia',
    title: 'Afeitado Tradicional con Toalla Caliente & Espuma',
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    tags: ['afeitado', 'toalla caliente', 'spa masculino', 'barberia', 'relax']
  },
  {
    id: 'barber-skin-fade',
    category: 'barberia',
    title: 'Skin Fade / High Fade Cero Pulido & Textura Superior',
    url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
    tags: ['skin fade', 'cero', 'high fade', 'degradado', 'corte urbano']
  },
  {
    id: 'barber-taper-fade',
    category: 'barberia',
    title: 'Low Taper Fade con Diseño y Marcado de Patillas',
    url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    tags: ['taper fade', 'low fade', 'patillas', 'diseño', 'barberia moderna']
  },
  {
    id: 'barber-hair-tattoo',
    category: 'barberia',
    title: 'Hair Tattoo & Diseños / Líneas Artísticas en Degradado',
    url: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80',
    tags: ['hair tattoo', 'diseño', 'lineas', 'tribal', 'barberia urbana']
  },
  {
    id: 'barber-kids-cut',
    category: 'barberia',
    title: 'Corte Infantil & Kids con Estilo y Paciencia',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    tags: ['kids', 'ninos', 'infantil', 'corte nino', 'barberia']
  },
  {
    id: 'barber-spa-hairwash',
    category: 'barberia',
    title: 'Lavado Spa Capilar con Masaje & Exfoliación de Cuero Cabelludo',
    url: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80',
    tags: ['lavado', 'spa capilar', 'exfoliacion', 'masaje capilar', 'cuero cabelludo']
  },
  {
    id: 'barber-beard-dye',
    category: 'barberia',
    title: 'Pigmentación & Tinte de Barba Efecto Sombreado Natural',
    url: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80',
    tags: ['pigmentacion', 'tinte barba', 'sombreado', 'barba poblada', 'color hombre']
  },

  // ==========================================
  // PESTAÑAS, CEJAS & MIRADA
  // ==========================================
  {
    id: 'lashes-volumen-ruso',
    category: 'pestanas' as any,
    title: 'Extensiones de Pestañas Volumen Ruso & Efecto Foxy',
    url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
    tags: ['pestanas', 'pestañas', 'volumen ruso', 'extensiones', 'mirada', 'lashes']
  },
  {
    id: 'lashes-pelo-a-pelo',
    category: 'pestanas' as any,
    title: 'Pestañas Pelo a Pelo Clásicas & Lifting con Keratina',
    url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    tags: ['pestanas', 'pestañas', 'pelo a pelo', 'lifting', 'laminado', 'lashes']
  },
  {
    id: 'brows-microblading',
    category: 'pestanas' as any,
    title: 'Diseño de Cejas con Henna & Microblading Pelo a Pelo',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    tags: ['cejas', 'microblading', 'henna', 'perfilado', 'brows']
  },

  // ==========================================
  // MAQUILLAJE PROFESIONAL & NOVIAS
  // ==========================================
  {
    id: 'makeup-glam',
    category: 'maquillaje',
    title: 'Maquillaje Social Glam & Acabado Glow',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    tags: ['maquillaje', 'social', 'glow', 'novia', 'sombras']
  },

  // ==========================================
  // ESPECIALISTAS (AVATARES PROFESIONALES)
  // ==========================================
  {
    id: 'stylist-woman-1',
    category: 'especialistas',
    title: 'Estilista Master Colorista (Femenina)',
    url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80',
    tags: ['estilista', 'colorista', 'mujer', 'avatar']
  },
  {
    id: 'stylist-woman-2',
    category: 'especialistas',
    title: 'Especialista en Piel & Spa (Femenina)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tags: ['terapeuta', 'spa', 'estetica', 'avatar']
  },
  {
    id: 'stylist-man-1',
    category: 'especialistas',
    title: 'Master Stylist & Barbero (Masculino)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tags: ['barbero', 'estilista', 'hombre', 'avatar']
  }
];

/**
 * Obtiene la imagen de Hero sugerida según la categoría
 */
export function getHeroImageForCategory(category: string = 'salon'): string {
  const cat = category.toLowerCase();
  if (cat.includes('barber')) {
    return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80';
  }
  if (cat.includes('spa') || cat.includes('relax')) {
    return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80';
  }
  if (cat.includes('nail') || cat.includes('uña')) {
    return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Obtiene la imagen adecuada para un servicio según su título o categoría
 */
export function getSuggestedImageForService(title: string = '', categoryHint?: string): string {
  const t = (title + ' ' + (categoryHint || '')).toLowerCase();

  // 1. Barbería y Barba Específicos
  if (t.includes('toalla caliente') || t.includes('afeitad') || t.includes('shave')) {
    return 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('barba') || t.includes('beard') || t.includes('perfilad')) {
    return 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('fade') || t.includes('degradad') || t.includes('taper') || t.includes('skin')) {
    return 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('tattoo') || t.includes('diseño') || t.includes('linea')) {
    return 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('infantil') || t.includes('kid') || t.includes('niño')) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('barber') || t.includes('caballero') || t.includes('hombre')) {
    return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80';
  }

  // 2. Colorimetría y Cabello Femenino
  if (t.includes('color') || t.includes('balayage') || t.includes('mechas') || t.includes('tinte') || t.includes('rubio')) {
    return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('keratina') || t.includes('alisad') || t.includes('botox') || t.includes('liso')) {
    return 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('nail') || t.includes('uña') || t.includes('manicura') || t.includes('pedicura') || t.includes('acrilic')) {
    return 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('facial') || t.includes('spa') || t.includes('masaje') || t.includes('limpieza') || t.includes('piel') || t.includes('peeling')) {
    return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('maquillaje') || t.includes('makeup') || t.includes('novia') || t.includes('pestaña') || t.includes('ceja')) {
    return 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('corte') || t.includes('cepillado') || t.includes('peinado') || t.includes('blower') || t.includes('secado')) {
    return 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
}

/**
 * Obtiene el avatar para un especialista
 */
export function getSpecialistAvatar(index: number = 0): string {
  const avatars = [
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  ];
  return avatars[index % avatars.length];
}

/**
 * OPTIMIZADOR AUTOMÁTICO DE HTML:
 * Reemplaza imágenes Base64 pesadas (data:image/...;base64) o rutas locales (assets/images/...)
 * por imágenes de muestra CDN de alta velocidad reduciendo el tamaño a ~12KB.
 */
export function optimizeProspectHtml(html: string, category: string = 'salon'): string {
  if (!html) return '';

  let optimized = html;

  const getUrlForTag = (tag: string) => {
    const lower = tag.toLowerCase();
    if (lower.includes('facial') || lower.includes('limpieza') || lower.includes('peeling')) {
      return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('massage') || lower.includes('masaje') || lower.includes('piedras') || lower.includes('relajante')) {
      return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('jacuzzi') || lower.includes('hidro') || lower.includes('sauna') || lower.includes('circuito')) {
      return 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('chocola') || lower.includes('cacao') || lower.includes('exfolia')) {
      return 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('balayage') || lower.includes('color') || lower.includes('rubio') || lower.includes('mecha')) {
      return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('corte') || lower.includes('bob') || lower.includes('brushing')) {
      return 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('keratina') || lower.includes('liso') || lower.includes('alisado')) {
      return 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('nail') || lower.includes('uñas') || lower.includes('manicura')) {
      return 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80';
    }
    if (lower.includes('elena')) {
      return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80';
    }
    if (lower.includes('valeria')) {
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
    }
    if (lower.includes('camila')) {
      return 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80';
    }
    if (lower.includes('specialist') || lower.includes('terapeuta') || lower.includes('estilista')) {
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
    }
    if (lower.includes('hero') || lower.includes('banner')) {
      return getHeroImageForCategory(category);
    }
    return null;
  };

  // 1. Reemplazar rutas relativas específicas como assets/images/service_facial.jpg
  optimized = optimized.replace(/src=["'](assets\/images\/[^"']+)["']/gi, (match, path) => {
    const mapped = getUrlForTag(path);
    if (mapped) return `src="${mapped}"`;
    return `src="${getHeroImageForCategory(category)}"`;
  });

  optimized = optimized.replace(/url\(["']?(assets\/images\/[^)"']+)["']?\)/gi, (match, path) => {
    const mapped = getUrlForTag(path);
    if (mapped) return `url("${mapped}")`;
    return `url("${getHeroImageForCategory(category)}")`;
  });

  // 2. Reemplazar Base64 en src="..."
  let imgIndex = 0;
  optimized = optimized.replace(/src=["']data:image\/[^"']+["']/gi, () => {
    imgIndex++;
    if (imgIndex === 1) {
      return `src="${getHeroImageForCategory(category)}"`;
    }
    const sample = BEAUTY_STOCK_LIBRARY[(imgIndex % BEAUTY_STOCK_LIBRARY.length)];
    return `src="${sample.url}"`;
  });

  // 3. Reemplazar Base64 en CSS background-image
  optimized = optimized.replace(/url\(["']?data:image\/[^)"']+["']?\)/gi, () => {
    return `url("${getHeroImageForCategory(category)}")`;
  });

  return optimized;
}

const CUSTOM_MEDIA_STORAGE_KEY = 'bf_custom_media_library_v1';

/**
 * Obtiene las imágenes personalizadas guardadas por el usuario
 */
export function getCustomMediaLibrary(): MediaItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MEDIA_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

/**
 * Agrega una nueva imagen personalizada a la biblioteca
 */
export function addCustomMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>): MediaItem {
  const customItems = getCustomMediaLibrary();
  const newItem: MediaItem = {
    ...item,
    id: `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    is_custom: true,
    created_at: new Date().toISOString()
  };
  const updated = [newItem, ...customItems];
  try {
    localStorage.setItem(CUSTOM_MEDIA_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not persist custom image to local storage:', e);
  }
  return newItem;
}

/**
 * Elimina una imagen personalizada de la biblioteca
 */
export function deleteCustomMediaItem(id: string): void {
  const customItems = getCustomMediaLibrary();
  const updated = customItems.filter(item => item.id !== id);
  try {
    localStorage.setItem(CUSTOM_MEDIA_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
}

/**
 * Devuelve todas las imágenes (predeterminadas de stock CDN + personalizadas subidas por el usuario)
 */
export function getAllMediaItems(): MediaItem[] {
  const stockAsMedia: MediaItem[] = BEAUTY_STOCK_LIBRARY.map(s => ({
    id: s.id,
    title: s.title,
    url: s.url,
    category: s.category,
    tags: s.tags,
    is_custom: false
  }));
  const custom = getCustomMediaLibrary();
  return [...custom, ...stockAsMedia];
}
