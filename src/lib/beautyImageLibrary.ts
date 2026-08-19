/**
 * BEAUTYFLOW AI - BIBLIOTECA DE IMÁGENES DE MUESTRA DE ALTA GAMA (STOCK CDN)
 * 
 * Imágenes curadas de alta resolución, optimizadas en formato WebP para salones, spas,
 * barberías y centros de estética. Reemplaza Base64 pesados reduciendo el peso de 5MB a ~12KB.
 */

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
  // BARBERÍA MASCULINA & FADE
  // ==========================================
  {
    id: 'barber-fade-beard',
    category: 'barberia',
    title: 'Mid Fade con Ritual de Barba y Toalla Caliente',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    tags: ['fade', 'barba', 'corte hombre', 'degradado', 'navaja']
  },
  {
    id: 'barber-styling',
    category: 'barberia',
    title: 'Corte Ejecutivo & Pompadour con Pomada',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    tags: ['pompadour', 'corte masculino', 'barberia', 'estilo']
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
  if (t.includes('barber') || t.includes('fade') || t.includes('barba') || t.includes('afeitad')) {
    return 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80';
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

  // 1. Reemplazar Base64 en src="..."
  // Coincide con <img src="data:image/...;base64,..." ...>
  let imgIndex = 0;
  optimized = optimized.replace(/src=["']data:image\/[^"']+["']/gi, (match) => {
    imgIndex++;
    if (imgIndex === 1) {
      return `src="${getHeroImageForCategory(category)}"`;
    }
    const sample = BEAUTY_STOCK_LIBRARY[(imgIndex % BEAUTY_STOCK_LIBRARY.length)];
    return `src="${sample.url}"`;
  });

  // 2. Reemplazar Base64 en CSS background-image: url("data:image/...")
  optimized = optimized.replace(/url\(["']?data:image\/[^)"']+["']?\)/gi, () => {
    return `url("${getHeroImageForCategory(category)}")`;
  });

  // 3. Reemplazar rutas relativas rotas como assets/images/hero.jpg
  optimized = optimized.replace(/src=["']assets\/images\/[^"']+["']/gi, (match) => {
    imgIndex++;
    const sample = BEAUTY_STOCK_LIBRARY[(imgIndex % BEAUTY_STOCK_LIBRARY.length)];
    return `src="${sample.url}"`;
  });

  return optimized;
}
