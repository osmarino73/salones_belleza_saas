/**
 * BEAUTYFLOW AI - HOMEPAGE STUDIO ENGINE
 * 
 * Motor de compilación y renderizado en vivo para páginas web de salones, spas y barberías.
 * Combina tokens de diseño, colores de referencia, copy local y biblioteca CDN en un único HTML
 * ultra-rápido, responsivo y de alta conversión (<30 KB).
 */

import { HomepageStudioState, StudioThemeConfig } from '../types';
import { getHeroImageForCategory, getSuggestedImageForService, getSpecialistAvatar } from './beautyImageLibrary';

export const STUDIO_THEME_PRESETS: Record<string, StudioThemeConfig> = {
  rose_gold: {
    presetName: 'rose_gold',
    primaryColor: '#FF5A36',
    accentColor: '#ec4899',
    backgroundColor: '#090B10',
    surfaceColor: '#141926',
    textColor: '#F8FAFC',
    mutedColor: '#94A3B8',
    fontFamily: 'serif_luxury',
    borderRadius: 'rounded-3xl',
    glassmorphism: true
  },
  dark_gold: {
    presetName: 'dark_gold',
    primaryColor: '#D97706',
    accentColor: '#F59E0B',
    backgroundColor: '#0A0A0B',
    surfaceColor: '#18181B',
    textColor: '#FAFAFA',
    mutedColor: '#A1A1AA',
    fontFamily: 'bold_display',
    borderRadius: 'rounded-2xl',
    glassmorphism: true
  },
  botanical_sage: {
    presetName: 'botanical_sage',
    primaryColor: '#10B981',
    accentColor: '#059669',
    backgroundColor: '#06110D',
    surfaceColor: '#0F231B',
    textColor: '#F0FDF4',
    mutedColor: '#86EFAC',
    fontFamily: 'clean_minimal',
    borderRadius: 'rounded-3xl',
    glassmorphism: true
  },
  pastel_pink: {
    presetName: 'pastel_pink',
    primaryColor: '#F43F5E',
    accentColor: '#FB7185',
    backgroundColor: '#0F0910',
    surfaceColor: '#1F1221',
    textColor: '#FFF1F2',
    mutedColor: '#FDA4AF',
    fontFamily: 'modern_sans',
    borderRadius: 'rounded-3xl',
    glassmorphism: true
  },
  cyber_neon: {
    presetName: 'cyber_neon',
    primaryColor: '#06B6D4',
    accentColor: '#3B82F6',
    backgroundColor: '#030712',
    surfaceColor: '#0F172A',
    textColor: '#F8FAFC',
    mutedColor: '#94A3B8',
    fontFamily: 'modern_sans',
    borderRadius: 'rounded-2xl',
    glassmorphism: true
  },
  minimal_white: {
    presetName: 'minimal_white',
    primaryColor: '#0F172A',
    accentColor: '#FF5A36',
    backgroundColor: '#FAFAFA',
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A',
    mutedColor: '#64748B',
    fontFamily: 'modern_sans',
    borderRadius: 'rounded-2xl',
    glassmorphism: false
  }
};

export const INITIAL_STUDIO_STATE: HomepageStudioState = {
  businessName: 'Studio Glamour & Spa',
  slogan: 'Especialistas en Colorimetría Europea, Balayage & Cuidado Capilar',
  rubroDescription: 'Salón de Belleza de Alta Gama con atención personalizada y profesionales certificados.',
  category: 'salon',
  phoneWhatsapp: '+573001234567',
  phoneCall: '(300) 123-4567',
  address: 'Carrera 43A # 1Sur-220, El Poblado',
  city: 'Medellín',
  googleMapsUrl: 'https://maps.google.com/?q=El+Poblado+Medellin',
  scheduleSummary: 'Martes a Sábado: 8:00 AM – 8:00 PM',
  heroImageUrl: getHeroImageForCategory('salon'),
  theme: STUDIO_THEME_PRESETS.rose_gold,
  services: [
    {
      id: 'srv-1',
      titulo: 'Balayage Rubio Cenizo & Matiz',
      descripcion: 'Decoloración técnica en degradado natural con nutrición Olaplex y brillo espejo.',
      precio_cop: 290000,
      duracion_minutos: 150,
      imagen_url: getSuggestedImageForService('balayage rubio'),
      badge: 'Más Popular'
    },
    {
      id: 'srv-2',
      titulo: 'Corte Bob en Capas & Brushing',
      descripcion: 'Diseño de corte personalizado para dar volumen y movimiento con secado profesional.',
      precio_cop: 65000,
      duracion_minutos: 45,
      imagen_url: getSuggestedImageForService('corte bob peinado')
    },
    {
      id: 'srv-3',
      titulo: 'Alisado Orgánico Espejo',
      descripcion: 'Fórmula 100% libre de formol que reestructura la fibra capilar eliminando el frizz.',
      precio_cop: 240000,
      duracion_minutos: 120,
      imagen_url: getSuggestedImageForService('keratina alisado')
    },
    {
      id: 'srv-4',
      titulo: 'Facial Hidratante & Spa Relax',
      descripcion: 'Limpieza ultrasónica profunda con mascarilla de ácido hialurónico y masaje facial.',
      precio_cop: 130000,
      duracion_minutos: 60,
      imagen_url: getSuggestedImageForService('facial spa')
    }
  ],
  specialists: [
    {
      id: 'esp-1',
      nombre: 'Sofía Restrepo',
      rol: 'Master Colorista & Directora',
      avatar_url: getSpecialistAvatar(0),
      especialidad: 'Balayage, Corrección de Color & Rubios'
    },
    {
      id: 'esp-2',
      nombre: 'Carlos Morales',
      rol: 'Master Stylist & Cortes',
      avatar_url: getSpecialistAvatar(1),
      especialidad: 'Cortes en Capas, Bobs & Brushing'
    },
    {
      id: 'esp-3',
      nombre: 'Valentina Nails',
      rol: 'Especialista en Estética & Piel',
      avatar_url: getSpecialistAvatar(2),
      especialidad: 'Faciales Ultrasónicos & Masajes'
    }
  ]
};

/**
 * Compila el estado completo del Studio a un archivo HTML autónomo, de alto rendimiento y ultra-liviano.
 */
export function compileStudioToHtml(state: HomepageStudioState): string {
  const {
    businessName,
    slogan,
    category,
    phoneWhatsapp,
    phoneCall,
    address,
    city,
    googleMapsUrl,
    scheduleSummary,
    heroImageUrl,
    theme,
    services,
    specialists
  } = state;

  const cleanPhone = phoneWhatsapp.replace(/\D/g, '');
  const isLight = theme.presetName === 'minimal_white';

  const fontDeclaration = theme.fontFamily === 'serif_luxury'
    ? `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
       h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
       body { font-family: 'Plus Jakarta Sans', sans-serif; }`
    : theme.fontFamily === 'bold_display'
    ? `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;900&family=Inter:wght@400;600;700&display=swap');
       h1, h2, h3 { font-family: 'Outfit', sans-serif; }
       body { font-family: 'Inter', sans-serif; }`
    : `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
       body { font-family: 'Inter', sans-serif; }`;

  const borderClass = theme.borderRadius === 'rounded-3xl' ? '28px' : theme.borderRadius === 'rounded-2xl' ? '20px' : '12px';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${city} | Sitio Oficial</title>
  <meta name="description" content="${businessName} en ${city}. ${slogan}. Agenda tu cita online o consulta por WhatsApp.">
  <style>
    ${fontDeclaration}
    :root {
      --primary: ${theme.primaryColor};
      --accent: ${theme.accentColor};
      --bg: ${theme.backgroundColor};
      --surface: ${theme.surfaceColor};
      --text: ${theme.textColor};
      --muted: ${theme.mutedColor};
      --radius: ${borderClass};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }
    
    /* Top VIP Bar */
    .topbar { background: linear-gradient(90deg, var(--primary), var(--accent)); color: #fff; padding: 8px 16px; font-size: 0.82rem; font-weight: 700; text-align: center; display: flex; justify-content: center; align-items: center; gap: 12px; }
    
    /* Hero Header */
    .hero { position: relative; padding: 80px 20px 70px; text-align: center; background: linear-gradient(180deg, rgba(9,11,16,0.7) 0%, var(--bg) 100%), url('${heroImageUrl}') center/cover no-repeat; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: var(--primary); padding: 6px 18px; border-radius: 999px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 18px; backdrop-filter: blur(10px); }
    h1 { font-size: 3.2rem; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 16px; background: linear-gradient(135deg, #fff 40%, var(--primary) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; max-width: 900px; }
    .slogan { font-size: 1.2rem; color: var(--muted); max-width: 680px; margin-bottom: 30px; font-weight: 400; }
    
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
    .btn-wa { display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: #fff; text-decoration: none; padding: 15px 32px; border-radius: 999px; font-weight: 800; font-size: 1rem; box-shadow: 0 10px 25px rgba(37,211,102,0.35); transition: transform 0.2s, box-shadow 0.2s; }
    .btn-wa:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(37,211,102,0.45); }
    .btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; text-decoration: none; padding: 15px 30px; border-radius: 999px; font-weight: 700; font-size: 1rem; backdrop-filter: blur(10px); transition: background 0.2s; }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); }

    /* Highlights Section */
    .container { max-width: 1140px; margin: 0 auto; padding: 60px 20px; }
    .features-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 60px; }
    .feature-card { background: var(--surface); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius); padding: 24px; text-align: center; }
    .feature-icon { font-size: 1.8rem; margin-bottom: 10px; }
    .feature-title { font-weight: 800; font-size: 1.05rem; margin-bottom: 4px; color: #fff; }
    .feature-desc { font-size: 0.85rem; color: var(--muted); }

    /* Services Grid */
    .section-header { text-align: center; margin-bottom: 40px; }
    .section-title { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 8px; color: #fff; }
    .section-subtitle { color: var(--muted); font-size: 1rem; max-width: 600px; margin: 0 auto; }

    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 70px; }
    .service-card { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s, border-color 0.2s; box-shadow: 0 15px 35px rgba(0,0,0,0.3); }
    .service-card:hover { transform: translateY(-4px); border-color: var(--primary); }
    .service-img-wrap { position: relative; height: 180px; overflow: hidden; }
    .service-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .service-card:hover .service-img { transform: scale(1.05); }
    .service-tag { position: absolute; top: 12px; right: 12px; background: var(--primary); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; }
    .service-body { padding: 22px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
    .service-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .service-desc { font-size: 0.88rem; color: var(--muted); margin-bottom: 16px; flex: 1; }
    .service-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; }
    .service-price { font-size: 1.2rem; font-weight: 900; color: #10B981; }
    .service-time { font-size: 0.78rem; color: var(--muted); }

    /* Specialists */
    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 70px; }
    .team-card { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 28px 20px; text-align: center; }
    .team-avatar { width: 95px; height: 95px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px; border: 3px solid var(--primary); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
    .team-name { font-weight: 800; font-size: 1.15rem; color: #fff; margin-bottom: 4px; }
    .team-role { font-size: 0.85rem; color: var(--primary); font-weight: 700; margin-bottom: 8px; }
    .team-spec { font-size: 0.8rem; color: var(--muted); }

    /* Location & Map */
    .location-box { background: var(--surface); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 35px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: center; margin-bottom: 40px; }
    .info-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
    .info-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: var(--primary); shrink: 0; }
    
    /* Footer */
    footer { background: #05070B; border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 20px; text-align: center; color: var(--muted); font-size: 0.85rem; }

    @media (max-width: 768px) {
      h1 { font-size: 2.2rem; }
      .slogan { font-size: 1rem; }
      .services-grid { grid-template-columns: 1fr; }
    }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "${businessName}",
    "description": "${slogan}",
    "telephone": "${phoneWhatsapp}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${address}",
      "addressLocality": "${city}",
      "addressCountry": "CO"
    },
    "openingHours": "${scheduleSummary}"
  }
  </script>
</head>
<body>

  <!-- Top VIP Notice Bar -->
  <div class="topbar">
    <span>✨ ${slogan}</span>
    <span>•</span>
    <span>📍 ${city}, Colombia</span>
  </div>

  <!-- Hero Header -->
  <header class="hero">
    <div class="badge">Salón & Spa Oficial en Google Maps</div>
    <h1>${businessName}</h1>
    <p class="slogan">${slogan}. Atención personalizada de alta gama, especialistas certificados y productos de grado profesional.</p>
    
    <div class="hero-actions">
      <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${businessName}, vi su página web oficial y quisiera cotizar una cita.`)}" target="_blank" class="btn-wa">
        💬 Agendar por WhatsApp Directo
      </a>
      <a href="#catalogo" class="btn-secondary">
        ✨ Ver Catálogo & Precios
      </a>
    </div>
  </header>

  <main class="container">

    <!-- Value Propositions -->
    <div class="features-row">
      <div class="feature-card">
        <div class="feature-icon">👑</div>
        <div class="feature-title">Especialistas Certificados</div>
        <div class="feature-desc">Profesionales con amplia trayectoria en las últimas tendencias y técnicas internacionales.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💎</div>
        <div class="feature-title">Productos de Alta Gama</div>
        <div class="feature-desc">Fórmulas orgánicas y marcas premium para el cuidado y brillo de tu cabello y piel.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <div class="feature-title">Atención Personalizada</div>
        <div class="feature-desc">Diagnóstico previo para garantizar resultados impecables y a tu medida.</div>
      </div>
    </div>

    <!-- Services Catalog -->
    <section id="catalogo">
      <div class="section-header">
        <h2 class="section-title">Nuestros Servicios Exclusivos</h2>
        <p class="section-subtitle">Conoce nuestra carta de servicios y reserva tu turno con confirmación instantánea.</p>
      </div>

      <div class="services-grid">
        ${services.map(s => `
        <div class="service-card">
          <div class="service-img-wrap">
            <img src="${s.imagen_url || getSuggestedImageForService(s.titulo, category)}" alt="${s.titulo}" class="service-img" loading="lazy" />
            ${s.badge ? `<span class="service-tag">${s.badge}</span>` : ''}
          </div>
          <div class="service-body">
            <div>
              <h3 class="service-title">${s.titulo}</h3>
              <p class="service-desc">${s.descripcion}</p>
            </div>
            <div class="service-footer">
              <div>
                <div class="service-price">$ ${s.precio_cop ? s.precio_cop.toLocaleString('es-CO') : '0'} COP</div>
                <div class="service-time">⏱️ Aprox. ${s.duracion_minutos || 60} minutos</div>
              </div>
              <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola, quisiera reservar el servicio: ${s.titulo}`)}" target="_blank" style="text-decoration:none; background:rgba(255,255,255,0.08); color:#fff; font-size:0.8rem; font-weight:700; padding:8px 14px; border-radius:999px;">
                Reservar →
              </a>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </section>

    <!-- Team Specialists -->
    ${specialists && specialists.length > 0 ? `
    <section>
      <div class="section-header">
        <h2 class="section-title">Equipo de Especialistas</h2>
        <p class="section-subtitle">Profesionales dedicados a realzar tu belleza con el más alto estándar de calidad.</p>
      </div>

      <div class="team-grid">
        ${specialists.map((esp, idx) => `
        <div class="team-card">
          <img src="${esp.avatar_url || getSpecialistAvatar(idx)}" alt="${esp.nombre}" class="team-avatar" loading="lazy" />
          <div class="team-name">${esp.nombre}</div>
          <div class="team-role">${esp.rol}</div>
          <div class="team-spec">${esp.especialidad || 'Atención personalizada y asesoría de imagen'}</div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <!-- Location & Contact -->
    <section class="location-box">
      <div>
        <h2 style="font-size: 1.8rem; font-weight: 900; margin-bottom: 12px; color: var(--text);">Visítanos en ${city}</h2>
        <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 24px;">Estamos ubicados en una zona accesible y confortable para brindarte la mejor experiencia de relajación.</p>

        <div class="info-item">
          <div class="info-icon">📍</div>
          <div>
            <strong style="color: var(--text); font-size: 0.95rem; display: block;">Dirección Oficial:</strong>
            <span style="color: var(--muted); font-size: 0.88rem;">${address || 'Consultar por WhatsApp'}, ${city}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">🕒</div>
          <div>
            <strong style="color: var(--text); font-size: 0.95rem; display: block;">Horario de Atención:</strong>
            <span style="color: var(--muted); font-size: 0.88rem;">${scheduleSummary}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">📞</div>
          <div>
            <strong style="color: var(--text); font-size: 0.95rem; display: block;">Teléfono / WhatsApp:</strong>
            <span style="color: var(--muted); font-size: 0.88rem;">${phoneWhatsapp}</span>
          </div>
        </div>

        ${googleMapsUrl ? `
        <a href="${googleMapsUrl}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:var(--primary); color:#fff; text-decoration:none; padding:12px 24px; border-radius:999px; font-weight:800; font-size:0.9rem; margin-top:8px;">
          📍 Abrir en Google Maps
        </a>` : ''}
      </div>

      <div style="background: rgba(0,0,0,0.15); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 30px; text-align: center;">
        <h3 style="color: var(--text); font-size: 1.3rem; font-weight: 800; margin-bottom: 8px;">¿Lista para renovar tu look?</h3>
        <p style="color: var(--muted); font-size: 0.88rem; margin-bottom: 20px;">Escríbenos directamente y te asesoramos con el especialista adecuado para ti.</p>
        <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${businessName}, quisiera consultar disponibilidad para esta semana.`)}" target="_blank" class="btn-wa" style="width: 100%; justify-content: center;">
          💬 Chatear con Recepción
        </a>
      </div>
    </section>

  </main>

  <footer>
    <p>© ${new Date().getFullYear()} ${businessName} • Todos los derechos reservados.</p>
    <p style="margin-top: 6px; font-size: 0.78rem;">Página web oficial optimizada para Google Maps & Reservas Online con BeautyFlow AI.</p>
  </footer>

</body>
</html>`;
}
