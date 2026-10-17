import { BeautySpecialty } from '../types/keweBeauty';

export const BEAUTY_SPECIALTIES: Record<string, BeautySpecialty> = {
  // 1. BARBERÍA TRADICIONAL & MODERNA
  barberia: {
    id: 'barberia',
    label: 'Barbería Clásica & Fade Moderno',
    color: '#d97706',
    heroBadge: '💈 Cortes de Precisión & Ritual de Barba',
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    categories: [
      { id: 'cortes', nombre: 'Cortes & Estilo', icono: 'scissors', sub: 'Tijera & Máquina' },
      { id: 'barba', nombre: 'Rituales de Barba', icono: 'sparkles', sub: 'Toalla Caliente & Navaja' },
      { id: 'combos', nombre: 'Packs Exclusivos', icono: 'package', sub: 'Corte + Barba + Facial' },
      { id: 'tratamientos', nombre: 'Cuidado Capilar', icono: 'droplet', sub: 'Exfoliación & Mascarilla' }
    ],
    services: [
      {
        titulo: 'Corte Degradado Low / Mid / High Fade',
        descripcion: 'Degradado milimétrico con navaja y máquina, texturizado superior a tijera, lavado refrescante y peinado con pomada mate.',
        precio_cop: 25000,
        duracion_min: 45,
        duracion_texto: '45 min',
        categoria: 'Cortes & Estilo',
        imagen_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'POPULAR'
      },
      {
        titulo: 'Ritual de Barba Royal con Toalla Caliente',
        descripcion: 'Vapor de ozono, toalla caliente con aceites esenciales, perfilado a navaja tradicional, bálsamo hidratante y masaje relajante.',
        precio_cop: 20000,
        duracion_min: 35,
        duracion_texto: '35 min',
        categoria: 'Rituales de Barba',
        imagen_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP'
      },
      {
        titulo: 'Combo VIP: Corte de Autor + Barba + Black Mask',
        descripcion: 'La experiencia completa: corte personalizado, diseño de barba con toalla caliente y mascarilla purificante de carbón activado.',
        precio_cop: 45000,
        duracion_min: 75,
        duracion_texto: '1h 15m',
        categoria: 'Packs Exclusivos',
        imagen_url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'RECOMENDADO'
      }
    ]
  },

  // 2. SALÓN DE BELLEZA & COLORIMETRÍA
  peluqueria_damas: {
    id: 'peluqueria_damas',
    label: 'Salón de Belleza & Colorimetría',
    color: '#e11d48',
    heroBadge: '✨ Expertos en Balayage & Recuperación Capilar',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    categories: [
      { id: 'color', nombre: 'Color & Mechas', icono: 'palette', sub: 'Balayage & Tintura' },
      { id: 'corte-peinado', nombre: 'Corte & Cepillado', icono: 'scissors', sub: 'Estilo & Ondas' },
      { id: 'alisados', nombre: 'Alisados & Keratinas', icono: 'sparkles', sub: 'Brillo Espejo' },
      { id: 'terapias', nombre: 'Terapias Capilares', icono: 'heart', sub: 'Botox & Hidratación' }
    ],
    services: [
      {
        titulo: 'Balayage Deluxe & Matizado Iluminador',
        descripcion: 'Degradado sutil sin marcas con protector Olaplex, matizado de tono personalizado, tratamiento sellador de cutícula y ondas al agua.',
        precio_cop: 180000,
        duracion_min: 180,
        duracion_texto: '3h',
        categoria: 'Color & Mechas',
        imagen_url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'ESTRELLA'
      },
      {
        titulo: 'Alisado Orgánico Taninoplastia / Keratina',
        descripcion: '0% formol, máxima nutrición y efecto lacio natural con brillo espejo de hasta 5 meses de duración.',
        precio_cop: 150000,
        duracion_min: 150,
        duracion_texto: '2h 30m',
        categoria: 'Alisados & Keratinas',
        imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'MÁS PEDIDO'
      },
      {
        titulo: 'Corte de Estilo & Cepillado Voluminoso',
        descripcion: 'Diagnóstico capilar, lavado con masaje craneal, corte moderno en capas o recto y cepillado moldeado.',
        precio_cop: 40000,
        duracion_min: 50,
        duracion_texto: '50 min',
        categoria: 'Corte & Cepillado',
        imagen_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },

  // 3. NAILS BAR & MANICURA SPA
  unas_nails: {
    id: 'unas_nails',
    label: 'Nails Bar & Spa de Manos y Pies',
    color: '#ec4899',
    heroBadge: '💅 Uñas Esculpidas & Diseños en Tendencia',
    heroImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1080&q=80',
    menuBannerUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    categories: [
      { id: 'acrilico', nombre: 'Acrílicas & Polygel', icono: 'sparkles', sub: 'Esculpidas & Tips' },
      { id: 'semi', nombre: 'Semipermanente', icono: 'heart', sub: 'Duración 21 Días' },
      { id: 'pedicure', nombre: 'Spa Pedicure', icono: 'droplet', sub: 'Exfoliación & Masaje' },
      { id: 'nail-art', nombre: 'Nail Art & Efectos', icono: 'palette', sub: 'Mano Alzada & Cristales' }
    ],
    services: [
      {
        titulo: 'Uñas Acrílicas Esculpidas + Nail Art',
        descripcion: 'Estructura perfecta con acrílico premium, cutícula rusa combinada, esmaltado semipermanente y diseño en 2 uñas.',
        precio_cop: 85000,
        duracion_min: 120,
        duracion_texto: '2h',
        categoria: 'Acrílicas & Polygel',
        imagen_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        etiqueta: 'TOP TENDENCIA'
      },
      {
        titulo: 'Spa Pedicure con Terapia deSales & Masaje',
        descripcion: 'Retiro de durezas, exfoliación profunda de durazno, mascarilla hidratante con botas térmicas y esmaltado impecable.',
        precio_cop: 45000,
        duracion_min: 60,
        duracion_texto: '1h',
        categoria: 'Spa Pedicure',
        imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
};
