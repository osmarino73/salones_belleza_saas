export interface BeautySpecialtyService {
  titulo: string;
  descripcion: string;
  precio_cop: number;
  duracion_min: number;
  duracion_texto: string;
  categoria: string;
  imagen_url: string;
  etiqueta?: string;
}

export interface BeautySpecialty {
  id: string;
  label: string;
  icon: string;
  color: string;
  heroBadge: string;
  sloganDefault: string;
  heroImage: string;
  heroMobileImage: string;
  menuBannerUrl: string;
  copywriting: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutP1: string;
    aboutP2: string;
  };
  categories: Array<{ id: string; nombre: string; icono: string; sub: string }>;
  services: BeautySpecialtyService[];
}

export interface VisualTemplateStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  primaryColor: string;
  accentColor: string;
  previewImage: string;
  nicheTag: string;
  darkTheme: boolean;
}

export const VISUAL_TEMPLATE_STYLES: VisualTemplateStyle[] = [
  {
    id: 'dark-luxury-gold',
    name: 'Plantilla Base 1 — Dark Luxury & Gold',
    tagline: 'Barbería VIP & Salón Top',
    description: 'Diseño oscuro premium con reflejos dorados y tipografía editorial de alto impacto.',
    badge: 'LUXURY',
    primaryColor: '#c5a059',
    accentColor: '#d4af37',
    previewImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Barbería & Salón',
    darkTheme: true
  },
  {
    id: 'salon-femenino-colorimetria',
    name: 'Plantilla Base 2 — Salón Femenino & Colorimetría',
    tagline: 'Balayage, Color & Cuidado Integral',
    description: 'Estética Velvet Obsidian con Camel Rose, tipografías Alex Brush y catálogo prémium de autor.',
    badge: 'FEMENINO VIP',
    primaryColor: '#cbb39c',
    accentColor: '#dfc8b1',
    previewImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Salón & Color',
    darkTheme: true
  },
  {
    id: 'rose-gold-blush',
    name: 'Plantilla Base 3 — Rose Gold & Blush',
    tagline: 'Nails Bar, Spa & Salón Femenino',
    description: 'Tonos rosa empolvado, oro rosa sofisticado y acabados refinados para clientas exigentes.',
    badge: 'POPULAR',
    primaryColor: '#e07a5f',
    accentColor: '#ec4899',
    previewImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp',
    nicheTag: 'Nails & Beauty',
    darkTheme: true
  },
  {
    id: 'emerald-botanical',
    name: 'Plantilla Base 4 — Emerald Botanical & Zen',
    tagline: 'Spa Facial, Masajes & Wellness',
    description: 'Atmósfera relajante verde esmeralda, bienestar botánico y aromaterapia.',
    badge: 'WELLNESS',
    primaryColor: '#10b981',
    accentColor: '#059669',
    previewImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Spa & Relax',
    darkTheme: true
  },
  {
    id: 'caramel-mocca',
    name: 'Plantilla Base 5 — Caramel Mocca Luxury',
    tagline: 'Nails Bar Cálido & Salón de Autor',
    description: 'Tierra cálida, mocca tostado y elegancia sobria para manicura de alta gama.',
    badge: 'ELEGANTE',
    primaryColor: '#9c6d53',
    accentColor: '#f59e0b',
    previewImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Nails & Mocca',
    darkTheme: true
  },
  {
    id: 'ruby-velvet',
    name: 'Plantilla Base 6 — Ruby Velvet & Glamour',
    tagline: 'Colorimetría, Balayage & Keratinas',
    description: 'Rojo vino seductor con alto contraste, brillo capilar y presencia imponente.',
    badge: 'GLAMOUR',
    primaryColor: '#be123c',
    accentColor: '#e11d48',
    previewImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Color & Hair',
    darkTheme: true
  },
  {
    id: 'monochrome-minimal',
    name: 'Plantilla Base 7 — Monochrome Studio Editorial',
    tagline: 'Cortes de Autor & Studio Unisex',
    description: 'Minimalismo puro blanco y negro con acentos sutiles, estilo editorial europeo.',
    badge: 'MINIMAL',
    primaryColor: '#f4f4f5',
    accentColor: '#a1a1aa',
    previewImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Editorial',
    darkTheme: true
  },
  {
    id: 'lavanda-serenity',
    name: 'Plantilla Base 8 — Lavanda Serenity & Lashes',
    tagline: 'Cejas, Pestañas & Estética',
    description: 'Tonos lavanda suaves que transmiten delicadeza, precisión y descanso visual.',
    badge: 'SUAVE',
    primaryColor: '#8b5cf6',
    accentColor: '#a855f7',
    previewImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    nicheTag: 'Lashes & Brows',
    darkTheme: true
  }
];

export const BEAUTY_SPECIALTIES: Record<string, BeautySpecialty> = {
  // 1. BARBERÍA CLÁSICA & MODERNA
  barberia: {
    id: 'barberia',
    label: 'Barbería Clásica & Urbana',
    icon: '💈',
    color: '#d97706',
    heroBadge: '💈 Cortes de Precisión & Ritual de Barba',
    sloganDefault: 'El arte y la precisión que definen tu imagen masculina',
    heroImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792080374316_Barber_shaping_beard_with_razor_20261015110551.webp',
    heroMobileImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792081956862_Barber_executing_skin_fade_haircut_20261015113222.webp',
    menuBannerUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Cortes de Precisión, Barba Impecable y Estilo Auténtico',
      heroSubtitle: 'Degradados milimétricos, toallas calientes y perfilado a navaja tradicional.',
      aboutTitle: 'Tradición Clásica con Maestría Urbana',
      aboutP1: 'Nacimos con una obsesión clara: rescatar la ceremonia de la barbería tradicional combinándola con las últimas tendencias de degradados y estilismo masculino contemporáneo.',
      aboutP2: 'Cada servicio se ejecuta con herramientas esterilizadas de grado médico, productos de fijación premium y toallas aromatizadas con aceites esenciales para una experiencia insuperable.'
    },
    categories: [
      { id: 'cortes', nombre: 'Cortes & Fade', icono: 'scissors', sub: 'Tijera & Navaja' },
      { id: 'barba', nombre: 'Barba Ritual', icono: 'sparkles', sub: 'Toalla Caliente' },
      { id: 'combos', nombre: 'Combos VIP', icono: 'package', sub: 'Corte + Barba + Facial' }
    ],
    services: [
      {
        titulo: 'Corte Fade Degradado (Low / Mid / High)',
        descripcion: 'Degradado milimétrico con shaver y máquina, pulido superior a tijera, lavado refrescante y fijación mate.',
        precio_cop: 25000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Cortes & Fade',
        imagen_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Ritual de Barba Royal con Toalla Caliente',
        descripcion: 'Vapor de ozono relajante, toalla caliente perfumada, perfilado a navaja japonesa y bálsamo hidratante.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Barba Ritual',
        imagen_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP'
      },
      {
        titulo: 'Combo Completo: Fade de Autor + Barba + Black Mask',
        descripcion: 'Experiencia total: corte personalizado, ritual de barba completo y mascarilla negra purificante de carbón activado.',
        precio_cop: 45000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Combos VIP',
        imagen_url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RECOMENDADO'
      },
      {
        titulo: 'Corte Clásico Tradicional a Tijera',
        descripcion: 'Corte sobrio y elegante realizado enteramente a tijera según visagismo facial, con terminación natural.',
        precio_cop: 22000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Cortes & Fade',
        imagen_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÁSICO'
      },
      {
        titulo: 'Exfoliación Facial Antiestrés & Masaje Craneal',
        descripcion: 'Limpieza de poros con micropartículas botánicas, tónico astringente y masaje relajante de cuello y cráneo.',
        precio_cop: 18000,
        duracion_min: 25,
        duracion_texto: '25 min',
        categoria: 'Barba Ritual',
        imagen_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RELAX'
      },
      {
        titulo: 'Corte Infantil Kids (Diseño & Estilo)',
        descripcion: 'Atención paciente y divertida para niños, incluye corte moderno, líneas suaves y cera hipoalergénica.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Cortes & Fade',
        imagen_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'KIDS'
      }
    ]
  },

  // 2. SALÓN FEMENINO & COLORIMETRÍA
  salon: {
    id: 'salon',
    label: 'Salón Femenino & Colorimetría',
    icon: '💇‍♀️',
    color: '#e11d48',
    heroBadge: '✨ Expertas en Balayage & Salud Capilar',
    sloganDefault: 'Transformaciones capilares que resaltan tu belleza natural',
    heroImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792079931885_Stylist_blow-drying_client_hair_2K_20261015104423.webp',
    heroMobileImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792083289211_Stylist_cutting_client_hair_20261015115430.webp',
    menuBannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Rubios Luminosos, Balayage de Ensueño y Cabello Sano',
      heroSubtitle: 'Técnicas internacionales de decoloración protegida con Plex y nutrición intensiva.',
      aboutTitle: 'Pasión por el Color y la Alta Peluquería',
      aboutP1: 'Creemos que tu cabello es tu accesorio más poderoso. Nos especializamos en visagismo, diseño de mechas personalizadas y protocolos de reconstrucción profunda.',
      aboutP2: 'Utilizamos marcas cosméticas europeas libres de amoniaco dañino y formulaciones avanzadas que blindan la fibra capilar, garantizando brillo espejo y movimiento natural.'
    },
    categories: [
      { id: 'color', nombre: 'Color & Balayage', icono: 'palette', sub: 'Mechas & Tintes' },
      { id: 'corte', nombre: 'Corte & Cepillado', icono: 'scissors', sub: 'Ondas & Volumen' },
      { id: 'tratamientos', nombre: 'Keratinas & Botox', icono: 'sparkles', sub: 'Brillo Espejo' }
    ],
    services: [
      {
        titulo: 'Balayage Deluxe & Matizado Tonalizador',
        descripcion: 'Degradé a mano alzada con transiciones suaves, incluye plex protector, matiz frío y tratamiento sellador.',
        precio_cop: 180000,
        duracion_min: 180,
        duracion_texto: '3h',
        categoria: 'Color & Balayage',
        imagen_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PREMIUM'
      },
      {
        titulo: 'Corte de Dama & Cepillado con Ondas Glam',
        descripcion: 'Lavado con shampoo reconstructor, corte según morfología facial y cepillado moldeado con ondas duraderas.',
        precio_cop: 45000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Corte & Cepillado',
        imagen_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÁSICO'
      },
      {
        titulo: 'Keratina Orgánica Brillo Espejo (Libre de Formol)',
        descripcion: 'Alisado termoactivo progresivo a base de aminoácidos vegetales. Elimina el frizz y aporta suavidad hasta por 5 meses.',
        precio_cop: 160000,
        duracion_min: 150,
        duracion_texto: '2h 30m',
        categoria: 'Keratinas & Botox',
        imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP VENTAS'
      },
      {
        titulo: 'Botox Capilar Reestructurante Anti-Age',
        descripcion: 'Relleno de fibra con ácido hialurónico y colágeno para cabellos secos, porosos o quebradizos por procesos químicos.',
        precio_cop: 90000,
        duracion_min: 90,
        duracion_texto: '1h 30m',
        categoria: 'Keratinas & Botox',
        imagen_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'REPARACIÓN'
      },
      {
        titulo: 'Tinte Raíz & Cobertura Total de Canas',
        descripcion: 'Aplicación precisa de color en crecimiento, emulsión hidratante en puntas y mascarilla fijadora de pigmento.',
        precio_cop: 70000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Color & Balayage',
        imagen_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'EXPRESS'
      },
      {
        titulo: 'Peinado Social para Eventos & Maquillaje Glow',
        descripcion: 'Recogido o semirecogido editorial y maquillaje social de larga duración resistente a la humedad.',
        precio_cop: 130000,
        duracion_min: 100,
        duracion_texto: '1h 40m',
        categoria: 'Corte & Cepillado',
        imagen_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'EVENTOS'
      }
    ]
  },

  // 3. UÑAS & NAILS BAR
  nails: {
    id: 'nails',
    label: 'Uñas & Nails Bar',
    icon: '💅',
    color: '#ec4899',
    heroBadge: '💅 Manicura Rusa, Esculpidas & Nail Art',
    sloganDefault: 'El cuidado y el diseño que tus manos y pies merecen',
    heroImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792148861583_Woman_posing_for_beauty_campaign_20261016060037.webp',
    heroMobileImage: 'https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792160934258_Complete_image_leaving_lower_third_20261016092835.webp',
    menuBannerUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Uñas Esculpidas, Manicura Rusa y Diseños Exclusivos',
      heroSubtitle: 'Nivelación con base rubber, esmaltado semipermanente de larga duración e higiene clínica.',
      aboutTitle: 'Precisión, Sanidad y Vanguardia en Nails',
      aboutP1: 'En nuestro estudio cada uña es un lienzo de diseño milimétrico. Esterilizamos el 100% de nuestras fresas en autoclave y empleamos materiales de un solo uso.',
      aboutP2: 'Desde la técnica rusa combinada con torno hasta extensiones en acrílico esculpido o soft gel, aseguramos durabilidad de más de 21 días sin desprendimientos.'
    },
    categories: [
      { id: 'semi', nombre: 'Semipermanente', icono: 'heart', sub: 'Rubber & Spa' },
      { id: 'esculpidas', nombre: 'Acrílicas & Gel', icono: 'sparkles', sub: 'Soft Gel & Moldes' },
      { id: 'pies', nombre: 'Pedicura Spa', icono: 'gem', sub: 'Jelly & Sales' }
    ],
    services: [
      {
        titulo: 'Manicura Semipermanente con Nivelación Rubber',
        descripcion: 'Limpieza profunda de cutículas con torno, base rubber niveladora para curvatura perfecta y esmaltado liso.',
        precio_cop: 45000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Semipermanente',
        imagen_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Uñas Acrílicas Esculpidas Baby Boomer / French',
        descripcion: 'Estructura esculpida sobre molde, difuminado baby boomer suave o francesa moderna con sellado ultra brillante.',
        precio_cop: 85000,
        duracion_min: 120,
        duracion_texto: '2h',
        categoria: 'Acrílicas & Gel',
        imagen_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PREMIUM'
      },
      {
        titulo: 'Pedicura Jelly Spa con Masaje & Exfoliación',
        descripcion: 'Inmersión en gelatina aromática tibia, exfoliación de talones, remoción de asperezas, hidratación y esmaltado.',
        precio_cop: 55000,
        duracion_min: 70,
        duracion_texto: '1h 10m',
        categoria: 'Pedicura Spa',
        imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RELAX'
      },
      {
        titulo: 'Sistema Soft Gel / Gel-X Tips Completos',
        descripcion: 'Extensiones ligeras y flexibles adheridas con gel constructor, acabado ultra natural y sin daño a la uña.',
        precio_cop: 75000,
        duracion_min: 90,
        duracion_texto: '1h 30m',
        categoria: 'Acrílicas & Gel',
        imagen_url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TENDENCIA'
      },
      {
        titulo: 'Nail Art a Mano Alzada & Efecto Ojo de Gato',
        descripcion: 'Diseños decorativos personalizados con cristales, foils metálicos, micro-ilustraciones o pigmento magnético Cat Eye.',
        precio_cop: 25000,
        duracion_min: 30,
        duracion_texto: '30 min',
        categoria: 'Semipermanente',
        imagen_url: 'https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/nail-art-luxury-designs.jpg',
        etiqueta: 'DISEÑO'
      },
      {
        titulo: 'Retiro Seguro de Sistema & Baño de Calcio',
        descripcion: 'Remoción cuidadosa con torno sin limar la placa natural, tratamiento con suero de queratina y aceite de jojoba.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Semipermanente',
        imagen_url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CUIDADO'
      }
    ]
  },

  // 4. SPA FACIAL, CORPORAL & MASAJES
  spa: {
    id: 'spa',
    label: 'Spa Facial, Corporal & Masajes',
    icon: '🧖‍♀️',
    color: '#059669',
    heroBadge: '🌿 Masajes Relajantes & Faciales Renovadores',
    sloganDefault: 'Un santuario de calma y bienestar para tu cuerpo y mente',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Desconéctate del Estrés y Renueva tu Energía Vital',
      heroSubtitle: 'Terapias de relajación profunda, piedras volcánicas calientes y limpiezas faciales clínicas.',
      aboutTitle: 'Bienestar Holístico en un Entorno de Serenidad',
      aboutP1: 'Diseñamos cada sesión como un ritual de escape. Cabinas insonorizadas, música ambiental de baja frecuencia y esencias botánicas puras preparan tu mente para descansar.',
      aboutP2: 'Nuestras terapeutas certificadas combinan técnicas descontracturantes con aparatología estética de vanguardia para revitalizar tu piel y eliminar contracturas musculares.'
    },
    categories: [
      { id: 'masajes', nombre: 'Masajes Holísticos', icono: 'sparkles', sub: 'Piedras & Bambú' },
      { id: 'facial', nombre: 'Faciales Clínicos', icono: 'heart', sub: 'Hidratación & Glow' },
      { id: 'corporal', nombre: 'Rituales Corporales', icono: 'gem', sub: 'Exfoliación & Fangos' }
    ],
    services: [
      {
        titulo: 'Masaje Relajante de Cuerpo Completo con Piedras Calientes',
        descripcion: 'Ritual antiestrés con aceites esenciales botánicos, piedras basálticas volcánicas y maniobras sedativas lentas.',
        precio_cop: 80000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Masajes Holísticos',
        imagen_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RELAX'
      },
      {
        titulo: 'Limpieza Facial Profunda con Hidrofacial & Máscara LED',
        descripcion: 'Extracción ultrasónica, microdermoabrasión suave con punta de diamante, sérum de ácido hialurónico y terapia de luz LED.',
        precio_cop: 95000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Faciales Clínicos',
        imagen_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'GLOW'
      },
      {
        titulo: 'Masaje Descontracturante & Terapéutico de Espalda',
        descripcion: 'Presión media-alta enfocada en nudos musculares del cuello, trapecio y zona lumbar con ungüento térmico árnica.',
        precio_cop: 65000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Masajes Holísticos',
        imagen_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ALIVIO'
      },
      {
        titulo: 'Drenaje Linfático Manual Post-Operatorio',
        descripcion: 'Maniobras especializadas tipo Vodder para reducir retención de líquidos, inflamación y acelerar la recuperación.',
        precio_cop: 75000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Rituales Corporales',
        imagen_url: 'https://images.unsplash.com/photo-1512290900672-1f41d9961608?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÍNICO'
      },
      {
        titulo: 'Ritual Chocoterapia & Exfoliación Café de Colombia',
        descripcion: 'Exfoliación corporal con café orgánico de origen, envoltura nutritiva en mousse de cacao y baño hidratante.',
        precio_cop: 110000,
        duracion_min: 80,
        duracion_texto: '1h 20m',
        categoria: 'Rituales Corporales',
        imagen_url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'SPA VIP'
      },
      {
        titulo: 'Día de Spa en Pareja: Masaje Doble & Jacuzzi',
        descripcion: 'Experiencia compartida para 2 personas con masaje sensorial, copa de champaña, tabla de frutas y jacuzzi privado.',
        precio_cop: 220000,
        duracion_min: 120,
        duracion_texto: '2h',
        categoria: 'Masajes Holísticos',
        imagen_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PAREJAS'
      }
    ]
  },

  // 5. CEJAS, PESTAÑAS & MIRADA
  cejas: {
    id: 'cejas',
    label: 'Cejas, Pestañas & Mirada',
    icon: '👁️',
    color: '#8b5cf6',
    heroBadge: '👁️ Microblading, Lifting & Extensiones de Pestañas',
    sloganDefault: 'El poder de una mirada perfecta enmarcada con precisión',
    heroImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Diseño de Cejas Personalizado y Pestañas de Impacto',
      heroSubtitle: 'Lifting con queratina, extensiones pelo a pelo y sombreado con henna natural.',
      aboutTitle: 'Arquitectura de la Mirada y Visagismo Facial',
      aboutP1: 'Estudiamos los ángulos y simetría de tu rostro para diseñar cejas armónicas y naturales que resalten tus expresiones sin rigidez.',
      aboutP2: 'Utilizamos adhesivos hipoalergénicos certificados por oftalmología y pigmentos orgánicos de alta fijación que respetan el crecimiento de tu pestaña natural.'
    },
    categories: [
      { id: 'cejas', nombre: 'Diseño de Cejas', icono: 'sparkles', sub: 'Henna & Laminado' },
      { id: 'pestanas', nombre: 'Pestañas', icono: 'heart', sub: 'Lifting & Pelo a Pelo' }
    ],
    services: [
      {
        titulo: 'Lifting de Pestañas con Nutrición de Queratina & Tinte',
        descripcion: 'Curvatura natural desde la raíz, oscurecimiento con tinte negro intenso y botox vitamínico para engrosar.',
        precio_cop: 55000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Pestañas',
        imagen_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Laminado de Cejas & Diseño con Pigmento Henna',
        descripcion: 'Alisado y direccionamiento de vellitos rebeldes, depilación con hilo egipcio y sombreado semipermanente con henna.',
        precio_cop: 45000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Diseño de Cejas',
        imagen_url: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP'
      },
      {
        titulo: 'Extensiones de Pestañas Efecto Clásico Pelo a Pelo',
        descripcion: 'Una extensión ultra ligera sobre cada pestaña natural, mirada limpia, alargada y elegante para uso diario.',
        precio_cop: 85000,
        duracion_min: 100,
        duracion_texto: '1h 40m',
        categoria: 'Pestañas',
        imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'NATURAL'
      },
      {
        titulo: 'Volumen Ruso / Híbrido 3D a 5D',
        descripcion: 'Abanicos artesanales hechos a mano para mayor densidad y volumen sin aportar peso excesivo a la pestaña.',
        precio_cop: 110000,
        duracion_min: 120,
        duracion_texto: '2h',
        categoria: 'Pestañas',
        imagen_url: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'VOLUMEN'
      },
      {
        titulo: 'Microblading Pelo a Pelo Hiperrealista',
        descripcion: 'Trazos manuales que simulan vellos naturales para rellenar espacios vacíos y definir la estructura por 12 a 18 meses.',
        precio_cop: 220000,
        duracion_min: 150,
        duracion_texto: '2h 30m',
        categoria: 'Diseño de Cejas',
        imagen_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PERMANENTE'
      },
      {
        titulo: 'Depilación de Cejas & Bozo con Hilo Egipcio',
        descripcion: 'Técnica milenaria 100% natural que arranca el vello de raíz sin tirones agresivos ni pigmentar la piel sensible.',
        precio_cop: 20000,
        duracion_min: 25,
        duracion_texto: '25 min',
        categoria: 'Diseño de Cejas',
        imagen_url: 'https://images.unsplash.com/photo-1517832606589-7629c33971a6?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'EXPRESS'
      }
    ]
  },

  // 6. ESTÉTICA MÉDICA & FACIAL AVANZADA
  estetica: {
    id: 'estetica',
    label: 'Estética & Tratamientos Faciales',
    icon: '💉',
    color: '#0284c7',
    heroBadge: '✨ Rejuvenecimiento Facial & Aparatología Médica',
    sloganDefault: 'Ciencia y tecnología médica al servicio de tu piel',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1512290900672-1f41d9961608?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Tecnología Antiedad, Peeling Químico y Tensa Facial',
      heroSubtitle: 'Protocolos dermatológicos seguros para manchas, acné, líneas de expresión y luminosidad.',
      aboutTitle: 'Medicina Estética & Cuidado Dermatológico',
      aboutP1: 'Contamos con profesionales capacitados y aparatología con registro sanitario INVIMA para garantizar tratamientos no invasivos de máxima eficacia.',
      aboutP2: 'Diseñamos planes individualizados de regeneración celular con principios activos bio-asimilables que devuelven firmeza, elasticidad y tersura a tu rostro.'
    },
    categories: [
      { id: 'antiedad', nombre: 'Rejuvenecimiento', icono: 'sparkles', sub: 'Dermapen & Radiofrecuencia' },
      { id: 'manchas', nombre: 'Acné & Manchas', icono: 'heart', sub: 'Peelings & Despigmentantes' }
    ],
    services: [
      {
        titulo: 'Dermapen con Cóctel de Vitaminas & Ácido Hialurónico',
        descripcion: 'Microagujas que estimulan la síntesis de colágeno natural, reducen poros dilatados y aportan luminosidad inmediata.',
        precio_cop: 120000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Rejuvenecimiento',
        imagen_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP'
      },
      {
        titulo: 'Radiofrecuencia Facial Tensora Efecto Lifting',
        descripcion: 'Ondas electromagnéticas térmicas que compactan las fibras de elastina caídas en óvalo facial y papada.',
        precio_cop: 90000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Rejuvenecimiento',
        imagen_url: 'https://images.unsplash.com/photo-1512290900672-1f41d9961608?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'LIFTING'
      },
      {
        titulo: 'Peeling Químico Despigmentante Antimanchas',
        descripcion: 'Ácidos mandélico y glicólico para atenuar melasma solar, secuelas de acné y emparejar el tono cutáneo.',
        precio_cop: 110000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Acné & Manchas',
        imagen_url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÍNICO'
      },
      {
        titulo: 'Protocolo Anti-Acné con Terapia Fotodinámica Azul',
        descripcion: 'Eliminación de la bacteria Cutibacterium acnes mediante luz azul bactericida y mascarilla descongestiva de zinc.',
        precio_cop: 85000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Acné & Manchas',
        imagen_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ACNÉ'
      },
      {
        titulo: 'Mesoterapia Virtual Facial Hidratante',
        descripcion: 'Electroporación sin agujas para infiltrar activos hidratantes en capas profundas de la dermis sin dolor.',
        precio_cop: 95000,
        duracion_min: 55,
        duracion_texto: '55 min',
        categoria: 'Rejuvenecimiento',
        imagen_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'SIN AGUJAS'
      },
      {
        titulo: 'Drenaje Linfático Facial & Masaje Kobido',
        descripcion: 'Masaje japonés milenario tensor que activa la microcirculación y oxigena profundamente los tejidos faciales.',
        precio_cop: 65000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Rejuvenecimiento',
        imagen_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'KOBIDO'
      }
    ]
  },

  // 7. PELUQUERÍA INFANTIL & FAMILIAR
  infantil: {
    id: 'infantil',
    label: 'Peluquería Infantil / Unisex',
    icon: '👶',
    color: '#f59e0b',
    heroBadge: '🎈 Cortes Infantiles Pacientes & Divertidos',
    sloganDefault: 'La experiencia de corte más divertida y sin lágrimas para tus pequeños',
    heroImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Estilo, Diversión y Cuidado Especial para Niños y Familias',
      heroSubtitle: 'Sillas lúdicas, personal con tacto maternal y productos libres de lágrimas.',
      aboutTitle: 'Paciencia y Cariño en Cada Tijeretazo',
      aboutP1: 'Entendemos que el primer corte o la visita a la peluquería puede generar ansiedad en los pequeños. Por eso creamos un espacio lleno de juegos, colores y amor.',
      aboutP2: 'Nuestros estilistas cuentan con experiencia pediátrica y emplean tijeras con puntas redondeadas para una total seguridad infantil.'
    },
    categories: [
      { id: 'ninos', nombre: 'Cortes Infantiles', icono: 'scissors', sub: 'Niños & Niñas' },
      { id: 'familiar', nombre: 'Combos Papá e Hijo', icono: 'heart', sub: 'Familia' }
    ],
    services: [
      {
        titulo: 'Corte Infantil Niños con Diseño o Línea',
        descripcion: 'Corte moderno degradado o clásico, adaptado a su textura capilar, con peinado en gel infantil y sorpresa.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Cortes Infantiles',
        imagen_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'FAVORITO'
      },
      {
        titulo: 'Corte Niñas con Trenzas & Moños de Colores',
        descripcion: 'Corte de puntas, lavado suave con aroma a fresa y peinado elaborado con trenzas decoradas.',
        precio_cop: 25000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Cortes Infantiles',
        imagen_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PRINCESAS'
      },
      {
        titulo: 'Ritual Primer Corte de Bebé con Certificado de Recuerdo',
        descripcion: 'Experiencia inolvidable con sobre especial para guardar el primer mechón y foto conmemorativa plastificada.',
        precio_cop: 30000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Cortes Infantiles',
        imagen_url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'BEBÉS'
      },
      {
        titulo: 'Combo Dúo: Corte Papá + Corte Hijo',
        descripcion: 'Momento de complicidad compartida: corte para el papá y corte infantil con descuento especial.',
        precio_cop: 40000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Combos Papá e Hijo',
        imagen_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'FAMILIAR'
      },
      {
        titulo: 'Peinado con Trenzas Boxeadoras para Deportes',
        descripcion: 'Dos trenzas pegadas de larga duración ideales para natación, gimnasia o días de colegio.',
        precio_cop: 22000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Cortes Infantiles',
        imagen_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'DURADERO'
      },
      {
        titulo: 'Tratamiento Desenredante Suave & Nutritivo',
        descripcion: 'Baño de crema hipoalergénica con manteca de karité para desenredar rizos infantiles sin tirones.',
        precio_cop: 18000,
        duracion_min: 30,
        duracion_texto: '30 min',
        categoria: 'Cortes Infantiles',
        imagen_url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RIZOS'
      }
    ]
  },

  // 8. PODOLOGÍA & SPA DE PIES
  podologia: {
    id: 'podologia',
    label: 'Podología & Spa de Pies',
    icon: '🦶',
    color: '#0d9488',
    heroBadge: '🩺 Salud, Bienestar & Belleza Podológica',
    sloganDefault: 'Pisa firme y sin dolor con el cuidado podológico profesional',
    heroImage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Tratamiento Clínico de Uñas, Durezas y Pies Saludables',
      heroSubtitle: 'Quiropodia profesional, atención a pie diabético y alivio de uñas encarnadas.',
      aboutTitle: 'Salud y Alivio Clínico para tus Pies',
      aboutP1: 'Tus pies sostienen todo tu mundo. Brindamos tratamientos podológicos con rigurosa esterilización hospitalaria para tratar hiperqueratosis, micosis y afecciones ungueales.',
      aboutP2: 'Combinamos técnicas clínicas no invasivas con relajantes mascarillas térmicas de parafina para devolver suavidad y confort a cada paso.'
    },
    categories: [
      { id: 'clinico', nombre: 'Podología Clínica', icono: 'sparkles', sub: 'Uñeros & Durezas' },
      { id: 'spa', nombre: 'Pedicura Spa', icono: 'heart', sub: 'Hidratación Profunda' }
    ],
    services: [
      {
        titulo: 'Sesión de Quiropodia Podológica Integral',
        descripcion: 'Corte anatómico de uñas con torno clínico, eliminación de callosidades (helomas), pulido y masaje con crema de urea al 20%.',
        precio_cop: 60000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Podología Clínica',
        imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÍNICO'
      },
      {
        titulo: 'Tratamiento de Uña Encarnada (Onicocriptosis) sin Dolor',
        descripcion: 'Desencarnado con instrumental micrométrico, desinfección antiséptica y colocación de curación protectora.',
        precio_cop: 45000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Podología Clínica',
        imagen_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ALIVIO'
      },
      {
        titulo: 'Spa de Pies con Parafinoterapia Tibia',
        descripcion: 'Inmersión en cera de parafina caliente enriquecida con caléndula para talones agrietados y resequedad severa.',
        precio_cop: 40000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Pedicura Spa',
        imagen_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'HIDRATACIÓN'
      },
      {
        titulo: 'Reconstrucción de Uña con Resina Antimicótica',
        descripcion: 'Prótesis ungueal flexible y estética con resina médica biocompatible que protege el lecho durante el crecimiento.',
        precio_cop: 35000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Podología Clínica',
        imagen_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ESTÉTICA'
      },
      {
        titulo: 'Reflexología Podal Relajante con Aceite de Menta',
        descripcion: 'Presión en puntos reflejos plantares para liberar tensión general, mejorar la circulación periférica y desinflamar.',
        precio_cop: 50000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Pedicura Spa',
        imagen_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RELAX'
      },
      {
        titulo: 'Pedicura Clínica Especial para Adulto Mayor / Diabético',
        descripcion: 'Corte preventivo no agresivo con inspección cutánea minuciosa y humectación de alta tolerancia dérmica.',
        precio_cop: 55000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Podología Clínica',
        imagen_url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PREVENTIVO'
      }
    ]
  },

  // 9. MAQUILLAJE PROFESIONAL & NOVIAS
  maquillaje: {
    id: 'maquillaje',
    label: 'Maquillaje Social & Novias',
    icon: '💄',
    color: '#be123c',
    heroBadge: '💄 Maquillaje de Alta Gama & Efecto Soft Glam',
    sloganDefault: 'Resalta tus facciones con un maquillaje duradero e impecable',
    heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Piel Blindada, Efecto Glow y Miradas Magnéticas',
      heroSubtitle: 'Maquillaje profesional con aerógrafo, pestañas visón 3D y fijación a prueba de lágrimas y sudor.',
      aboutTitle: 'El Arte de Embellecer sin Enmascarar',
      aboutP1: 'Cada rostro cuenta una historia única. Nuestro enfoque de maquillaje realza tu belleza natural con acabados aterciopelados y transiciones de color fotogénicas.',
      aboutP2: 'Trabajamos exclusivamente con cosméticos de alta gama (Dior, MAC, Charlotte Tilbury, NARS) que cuidan tu piel y garantizan más de 16 horas de fijación intacta.'
    },
    categories: [
      { id: 'social', nombre: 'Maquillaje Social', icono: 'sparkles', sub: 'Grados & Fiestas' },
      { id: 'novias', nombre: 'Novias & Quinceañeras', icono: 'heart', sub: 'Pruebas & VIP' }
    ],
    services: [
      {
        titulo: 'Maquillaje Social de Noche & Efecto Soft Glam',
        descripcion: 'Preparación de piel con sérum glow, base blindada waterproof, contorno difuminado, sombras ahumadas y pestañas 3D.',
        precio_cop: 90000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Maquillaje Social',
        imagen_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Paquete Novia VIP con Prueba Previa & Kit de Retoque',
        descripcion: 'Prueba de maquillaje semanas antes, aplicación de aerógrafo el día del evento, hidratación labial y fijador de 24 horas.',
        precio_cop: 250000,
        duracion_min: 150,
        duracion_texto: '2h 30m',
        categoria: 'Novias & Quinceañeras',
        imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'NOVIAS'
      },
      {
        titulo: 'Maquillaje Express de Día / Grados & Fotos',
        descripcion: 'Acabado fresco y luminoso, corrección sutil de imperfecciones, rubor radiante y labial de larga duración.',
        precio_cop: 65000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Maquillaje Social',
        imagen_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'FRESCO'
      },
      {
        titulo: 'Diseño de Ondas al Agua & Peinado Glamour',
        descripcion: 'Moldeado con plancha o tenaza profesional, fijación anti-humedad y brillo siliconado.',
        precio_cop: 45000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Maquillaje Social',
        imagen_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PEINADO'
      },
      {
        titulo: 'Clase de Automaquillaje Personalizada (1 a 1)',
        descripcion: 'Aprende a conocer tu rostro, preparar tu piel, elegir tu tono de base exacto y recrear un look de día y noche.',
        precio_cop: 120000,
        duracion_min: 120,
        duracion_texto: '2h',
        categoria: 'Maquillaje Social',
        imagen_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'APRENDE'
      },
      {
        titulo: 'Colocación de Pestañas Postizas de Tira / Grupitos',
        descripcion: 'Pegado milimétrico con pegamento hipoalergénico libre de látex, máscara integradora y delineado pulido.',
        precio_cop: 25000,
        duracion_min: 20,
        duracion_texto: '20 min',
        categoria: 'Maquillaje Social',
        imagen_url: 'https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'EXPRESS'
      }
    ]
  },

  // 10. TERAPIAS HOLÍSTICAS & BIENESTAR
  holistico: {
    id: 'holistico',
    label: 'Terapias Holísticas & Bienestar',
    icon: '🧘',
    color: '#10b981',
    heroBadge: '🧘 Reiki, Aromaterapia & Masajes Energéticos',
    sloganDefault: 'Armonía y equilibrio integral para tu mente, cuerpo y espíritu',
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Equilibrio Energético, Sanación y Paz Interior',
      heroSubtitle: 'Cuencos tibetanos, alineación de chakras con cristales y masajes ayurvédicos.',
      aboutTitle: 'Reconexión con tu Esencia y Sanación Natural',
      aboutP1: 'En un mundo acelerado, creamos un oasis de silencio y reconexión. Guiamos tu cuerpo hacia la autorregulación mediante terapias ancestrales integradas.',
      aboutP2: 'Utilizamos aceites puros prensados en frío, resinas sagradas (copal y palo santo) y frecuencias sonoras afinadas a 432 Hz para desbloquear canales de energía.'
    },
    categories: [
      { id: 'energia', nombre: 'Energía & Chakras', icono: 'sparkles', sub: 'Reiki & Cuencos' },
      { id: 'masajes', nombre: 'Masajes Ayurvédicos', icono: 'heart', sub: 'Aceites Medicados' }
    ],
    services: [
      {
        titulo: 'Sesión de Reiki & Alineación de Chakras con Péndulo',
        descripcion: 'Canalización de energía universal para desbloquear emociones estancadas, aliviar ansiedad y armonizar centros vitales.',
        precio_cop: 70000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Energía & Chakras',
        imagen_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ARMONÍA'
      },
      {
        titulo: 'Masaje Ayurvédico Abhyanga con Aceite Tibio de Sésamo',
        descripcion: 'Masaje rítmico envolvente de pies a cabeza que nutre los tejidos, elimina toxinas (ama) y pacifica el sistema nervioso.',
        precio_cop: 90000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Masajes Ayurvédicos',
        imagen_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'AYURVEDA'
      },
      {
        titulo: 'Baño de Sonido Terapéutico con Cuencos Tibetanos',
        descripcion: 'Inmersión acústica vibracional con cuencos de 7 metales y gongs que inducen ondas cerebrales alfa y theta.',
        precio_cop: 60000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Energía & Chakras',
        imagen_url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'SONIDOS'
      },
      {
        titulo: 'Terapia de Ventosas Chinas (Cupping) & Descontracturante',
        descripcion: 'Descompresión miofascial con ventosas de vidrio para liberar contracturas crónicas y estimular la oxigenación.',
        precio_cop: 65000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Masajes Ayurvédicos',
        imagen_url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ALIVIO'
      },
      {
        titulo: 'Masaje Craneofacial Shirobhyanga & Aromaterapia',
        descripcion: 'Presión en puntos marmas de la cabeza, sienes y cuello con lavanda para calmar migrañas y el insomnio.',
        precio_cop: 45000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Masajes Ayurvédicos',
        imagen_url: 'https://images.unsplash.com/photo-1512290900672-1f41d9961608?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'INSOMNIO'
      },
      {
        titulo: 'Limpieza Energética Aurica con Humos Sagrados',
        descripcion: 'Sahumerio con salvia blanca, ruda y copal para descargar energías pesadas y renovar el campo electromagnético.',
        precio_cop: 50000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Energía & Chakras',
        imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ENERGÍA'
      }
    ]
  },

  // 11. PELUQUERÍA MIXTA TRADICIONAL & MULTIESTILO
  mixta: {
    id: 'mixta',
    label: 'Peluquería Mixta Tradicional',
    icon: '✂️',
    color: '#0284c7',
    heroBadge: '✂️ Atención Integral para Toda la Familia',
    sloganDefault: 'Calidad, cercanía y experiencia en cortes para damas y caballeros',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    copywriting: {
      heroTitle: 'Cortes, Color y Estilo en el Corazón de tu Barrio',
      heroSubtitle: 'La confianza de estilistas experimentados para cuidar la imagen de toda tu familia.',
      aboutTitle: 'Tradición y Calidez en Cada Servicio',
      aboutP1: 'Somos el salón de confianza donde siempre encuentras una sonrisa y manos expertas. Ofrecemos cortes para damas, caballeros y niños con la mejor relación calidad-precio.',
      aboutP2: 'Nos apasiona complacer tus gustos personales con un servicio ágil, puntual y con productos de primeras marcas.'
    },
    categories: [
      { id: 'damas', nombre: 'Damas', icono: 'scissors', sub: 'Corte & Cepillado' },
      { id: 'caballeros', nombre: 'Caballeros', icono: 'sparkles', sub: 'Corte & Barba' }
    ],
    services: [
      {
        titulo: 'Corte de Dama & Cepillado Moldeador',
        descripcion: 'Corte adaptado al gusto de la clienta, lavado y cepillado profesional con secador.',
        precio_cop: 35000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Damas',
        imagen_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Corte de Caballero & Lavado Capilar',
        descripcion: 'Corte a máquina y tijera con navaja en patillas y nuca, terminado con champú refrescante.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Caballeros',
        imagen_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'CLÁSICO'
      },
      {
        titulo: 'Tintura Completa & Tratamiento Brillo',
        descripcion: 'Aplicación uniforme de tinte tradicional, lavado con shampoo sellador y secado rápido.',
        precio_cop: 65000,
        duracion_min: 80,
        duracion_texto: '1h 20m',
        categoria: 'Damas',
        imagen_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'COLOR'
      },
      {
        titulo: 'Manicura Tradicional Limado & Esmaltado',
        descripcion: 'Limpieza de cutículas, limado anatómico, masaje de manos y esmaltado convencional de 2 capas.',
        precio_cop: 22000,
        duracion_min: 40,
        duracion_texto: '40 min',
        categoria: 'Damas',
        imagen_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TRADICIONAL'
      },
      {
        titulo: 'Pedicura Tradicional con Exfoliación',
        descripcion: 'Remojo en sales, retiro de callosidades, exfoliación podológica y esmaltado limpio.',
        precio_cop: 28000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Damas',
        imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'PIES'
      },
      {
        titulo: 'Corte Infantil Niños o Niñas',
        descripcion: 'Corte paciente y rápido para niños en edad escolar con peinado prolijo.',
        precio_cop: 18000,
        duracion_min: 30,
        duracion_texto: '30 min',
        categoria: 'Caballeros',
        imagen_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'KIDS'
      }
    ]
  }
};

// Helper para sugerir eslóganes con IA según nombre, especialidad y ciudad
export function suggestSlogan(businessName: string, specialtyId: string, city: string = 'Medellín'): string {
  const cleanName = businessName.trim() || 'Tu Salón';
  const cleanCity = city.trim() || 'Colombia';
  
  const slogansBySpecialty: Record<string, string[]> = {
    barberia: [
      `El estilo y la precisión que definen tu imagen en ${cleanCity}`,
      `Tradición, elegancia y cortes de precisión en ${cleanCity}`,
      `Donde el ritual de la barba y el buen gusto se encuentran`,
      `Maestría en degradados y cuidado masculino de primer nivel`
    ],
    salon: [
      `El arte de resaltar tu belleza auténtica en ${cleanCity}`,
      `Transformaciones capilares que inspiran confianza y sofisticación`,
      `Expertas en balayage, color y salud capilar en ${cleanCity}`,
      `Tu momento de consentirte con el mejor cuidado capilar`
    ],
    nails: [
      `El diseño y la elegancia que tus manos merecen en ${cleanCity}`,
      `Uñas impecables, manicura de alta gama y diseños exclusivos`,
      `Cuidado, detalle y perfección para tus manos y pies`,
      `El santuario de las uñas perfectas en ${cleanCity}`
    ],
    spa: [
      `Un oasis de paz y serenidad para tu bienestar en ${cleanCity}`,
      `Desconéctate del estrés y renueva tu energía vital`,
      `El balance perfecto entre relajación, belleza y bienestar`,
      `Rituales holísticos y cuidado facial de alta gama`
    ],
    cejas: [
      `La arquitectura de tu mirada en manos de especialistas en ${cleanCity}`,
      `Cejas perfectas y pestañas de impacto que transforman tu rostro`,
      `Visagismo y precisión para enmarcar la fuerza de tu mirada`
    ],
    estetica: [
      `Ciencia y tecnología médica al servicio de tu piel en ${cleanCity}`,
      `Rejuvenecimiento facial seguro con resultados visibles`,
      `Salud, luminosidad y tersura para tu piel`
    ],
    infantil: [
      `La peluquería más divertida y sin lágrimas de ${cleanCity}`,
      `Paciencia, cariño y cortes modernos para toda la familia`
    ],
    podologia: [
      `Pisa firme, saludable y sin dolor en ${cleanCity}`,
      `Cuidado podológico clínico y estético de alta especialidad`
    ],
    maquillaje: [
      `El maquillaje que resalta tu mejor versión en tus momentos inolvidables`,
      `Acabados editoriales de larga duración a prueba de emociones`
    ],
    holistico: [
      `Armonía, equilibrio y reconexión profunda en ${cleanCity}`,
      `Terapias ancestrales y bienestar integral para tu mente y cuerpo`
    ],
    mixta: [
      `La peluquería de confianza para toda la familia en ${cleanCity}`,
      `Experiencia, calidez y buen servicio en cada visita`
    ]
  };

  const pool = slogansBySpecialty[specialtyId] || slogansBySpecialty.barberia;
  return pool[Math.floor(Math.random() * pool.length)];
}
