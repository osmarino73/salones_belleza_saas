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

export const NAILS_STOCK_SERVICES: StockImageItem[] = [
  {
    id: 'nails-semipermanente',
    category: 'nails',
    title: 'Manicura Semipermanente & Gel Polish Brillo Espejo',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/semipermanente-mocca.jpg',
    tags: ['semipermanente', 'gelish', 'esmalte', 'manicura', 'nude', 'brillo', 'gel polish']
  },
  {
    id: 'nails-rusa-dry',
    category: 'nails',
    title: 'Manicura Rusa / Dry Manicure con Torno y Fresas Diamantadas',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/kapping-gel-nivelador.jpg',
    tags: ['rusa', 'dry manicure', 'torno', 'cuticula', 'limpieza profunda', 'fresas', 'perfeccion']
  },
  {
    id: 'nails-acrilicas-esculpidas',
    category: 'nails',
    title: 'Uñas Acrílicas Esculpidas & Extensiones Coffin / Almond',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/extensiones-acrilicas-esculpidas.jpg',
    tags: ['acrilicas', 'esculpidas', 'extensiones', 'coffin', 'almond', 'tips', 'monomero', 'acrilico']
  },
  {
    id: 'nails-soft-gel',
    category: 'nails',
    title: 'Soft Gel / Gel-X / Press On Nails de Cobertura Completa',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/extensiones-acrilicas-esculpidas.jpg',
    tags: ['soft gel', 'gel x', 'press on', 'extension gel', 'tips completos', 'ligero']
  },
  {
    id: 'nails-kapping-rubber',
    category: 'nails',
    title: 'Kapping Gel & Nivelación con Rubber Base (Fuerza Natural)',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/kapping-gel-nivelador.jpg',
    tags: ['kapping', 'rubber base', 'nivelacion', 'bano de gel', 'refuerzo', 'antiquiebre']
  },
  {
    id: 'nails-polygel',
    category: 'nails',
    title: 'Polygel / Acrylgel Híbrido Esculpido & Curado UV',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/kapping-gel-nivelador.jpg',
    tags: ['polygel', 'acrylgel', 'acrigel', 'hibrido', 'esculpido', 'flexibilidad']
  },
  {
    id: 'nails-nail-art-luxury',
    category: 'nails',
    title: 'Nail Art Editorial Minimalista & Hojilla de Oro Foil',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/nail-art-luxury-designs.jpg',
    tags: ['nail art', 'decoracion', 'foil', 'glitter', 'diseno', 'piedras', 'lineas', 'lujo']
  },
  {
    id: 'nails-french-modern',
    category: 'nails',
    title: 'Francesa Moderna / Micro French Estilizado & Minimal',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/extensiones-acrilicas-esculpidas.jpg',
    tags: ['francesa', 'french', 'micro french', 'blanco', 'elegante', 'sonrisa']
  },
  {
    id: 'nails-baby-boomer',
    category: 'nails',
    title: 'Baby Boomer & Degradé Ombré Francés Blanco Nube',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/extensiones-acrilicas-esculpidas.jpg',
    tags: ['baby boomer', 'ombre', 'degrade', 'difuminado', 'leche', 'rosa', 'blanco']
  },
  {
    id: 'nails-cat-eye',
    category: 'nails',
    title: 'Efecto Ojo de Gato (Cat Eye) Magnético & Glazed Donut Cromo',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/nail-art-luxury-designs.jpg',
    tags: ['cat eye', 'ojo de gato', 'glazed donut', 'cromo', 'efecto espejo', 'iman', 'brillo saten']
  },
  {
    id: 'nails-pedicura-spa',
    category: 'nails',
    title: 'Pedicura Spa Profunda & Jelly Spa con Ritual Hidratante',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/pedicura-spa-relax.jpg',
    tags: ['pedicura', 'pedicure', 'spa pies', 'jelly spa', 'hidromasaje', 'exfoliacion', 'pies']
  },
  {
    id: 'nails-pedicura-rusa',
    category: 'nails',
    title: 'Pedicura Rusa & Esmaltado Semipermanente en Pies',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/pedicura-spa-relax.jpg',
    tags: ['pedicura rusa', 'esmaltado pies', 'pies pulidos', 'cuticula pies', 'pies perfectos']
  },
  {
    id: 'nails-retiro-sistema',
    category: 'nails',
    title: 'Retiro Seguro de Acrílico / Gel & Tratamiento Fortalecedor',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/retiro-bano-calcio.jpg',
    tags: ['retiro', 'remocion', 'retiro acrilico', 'retiro gel', 'nutricion', 'fortalecedor', 'salud ungueal']
  },
  {
    id: 'nails-spa-parafina',
    category: 'nails',
    title: 'Spa de Manos con Mascarilla Térmica & Baño de Parafina',
    url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/retiro-bano-calcio.jpg',
    tags: ['parafina', 'spa manos', 'mascarilla termal', 'hidratacion manos', 'suavidad', 'terapia termica']
  }
];

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
  // NAIL ART & MANICURA (CATÁLOGO ESPECIALIZADO NAILS)
  // ==========================================
  ...NAILS_STOCK_SERVICES,

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
  // 3. Nicho Nails (Salones de Uñas, Manicura, Pedicura & Nail Spa)
  if (t.includes('parafina') || (t.includes('spa') && t.includes('mano'))) {
    return 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('retiro') || t.includes('remocion') || t.includes('remover') || t.includes('desmonte')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('pedicura rusa') || t.includes('pedicure ruso') || (t.includes('pies') && t.includes('rusa'))) {
    return 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('pedicur') || t.includes('pedicure') || t.includes('jelly') || t.includes('pies')) {
    return 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('rusa') || t.includes('dry') || t.includes('torno') || t.includes('fresas') || t.includes('cuticula')) {
    return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('acrilic') || t.includes('esculpid') || t.includes('extension') || t.includes('coffin') || t.includes('almond') || t.includes('monomero')) {
    return 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('soft gel') || t.includes('gel x') || t.includes('press on') || t.includes('tips')) {
    return 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('kapping') || t.includes('rubber') || t.includes('nivelacion') || t.includes('baño de gel') || t.includes('bano de gel')) {
    return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('polygel') || t.includes('acrylgel') || t.includes('acrigel')) {
    return 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('cat eye') || t.includes('ojo de gato') || t.includes('glazed') || t.includes('cromo') || t.includes('espejo')) {
    return 'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('baby boomer') || t.includes('boomer') || t.includes('ombre') || t.includes('degrade')) {
    return 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('french') || t.includes('frances') || t.includes('francesa')) {
    return 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('nail art') || t.includes('decoracion') || t.includes('foil') || t.includes('glitter') || t.includes('piedras') || t.includes('mano alzada')) {
    return 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
  }
  if (t.includes('nail') || t.includes('uña') || t.includes('semipermanente') || t.includes('manicura') || t.includes('gelish') || t.includes('gel polish')) {
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
    if (lower.includes('nail') || lower.includes('uña') || lower.includes('manicur') || lower.includes('pedicur') || lower.includes('acrilic') || lower.includes('gel')) {
      return getSuggestedImageForService(lower);
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
