import { ProspectSite, BeautyService } from '../types/keweBeauty';
import { PLANTILLA_BARBERIA_HTML } from './templates/plantillaBarberia';
import { PLANTILLA_SALON_BEAUTY_HTML } from './templates/plantillaSalonBeauty';

export interface InjectBeautyHtmlParams {
  templateHtml?: string;
  category?: 'barberia' | 'peluqueria_damas' | 'unas_nails' | 'pestanas_cejas' | 'spa_estetica' | 'otro';
  businessName: string;
  phoneWhatsapp: string;
  address?: string;
  primaryColor?: string;
  heroImage?: string;
  heroMobileImage?: string;
  headline?: string;
  subheadline?: string;
  heroBadge?: string;
  services?: BeautyService[];
}

export function injectBeautyHtml(params: InjectBeautyHtmlParams): string {
  const {
    category = 'barberia',
    businessName,
    phoneWhatsapp,
    address = 'Consultar ubicación por WhatsApp',
    primaryColor = category === 'barberia' ? '#d97706' : '#e11d48',
    heroImage = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80',
    heroMobileImage = 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1080&q=80',
    headline = category === 'barberia' 
      ? 'Cortes de Precisión & Cuidado Masculino de Primer Nivel' 
      : 'Tu Belleza en Manos de Profesionales Apasionados',
    subheadline = 'Reserva tu turno en línea con confirmación inmediata por WhatsApp.',
    heroBadge = category === 'barberia' ? '💈 Citas Disponibles Hoy' : '✨ Agenda tu Momento de Belleza',
    services = []
  } = params;

  // Seleccionar plantilla base según categoría si no se pasó una explícita
  let html = params.templateHtml || (category === 'barberia' ? PLANTILLA_BARBERIA_HTML : PLANTILLA_SALON_BEAUTY_HTML);

  // Formateador de moneda en pesos colombianos o local
  const formatCOP = (num: number) => `$ ${num.toLocaleString('es-CO')}`;

  // Renderizar tarjetas de servicios
  const servicesCardsHtml = services.map((s) => {
    const waBookingUrl = `https://wa.me/${phoneWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, quiero agendar cita para: *${s.titulo}* (${s.duracion_texto || 'Servicio'})`)}`;

    return `
      <div class="rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all flex flex-col group shadow-lg">
        <div class="relative h-48 w-full overflow-hidden bg-zinc-950">
          <img src="${s.imagen_url}" alt="${s.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          ${s.etiqueta ? `<span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-md">${s.etiqueta}</span>` : ''}
          ${s.duracion_texto ? `<span class="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/70 text-zinc-300 backdrop-blur-md">⏱️ ${s.duracion_texto}</span>` : ''}
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1 block">${s.categoria}</span>
            <h3 class="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">${s.titulo}</h3>
            <p class="text-zinc-400 text-xs leading-relaxed line-clamp-2">${s.descripcion}</p>
          </div>
          <div class="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase text-zinc-500 block font-bold">Precio</span>
              <span class="text-base font-black text-white">${formatCOP(s.precio_cop)}</span>
            </div>
            <a href="${waBookingUrl}" target="_blank"
               class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md">
              Agendar
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('\n');

  // Reemplazo de marcadores
  return html
    .replace(/\{\{BUSINESS_NAME\}\}/g, businessName)
    .replace(/\{\{PHONE_WHATSAPP\}\}/g, phoneWhatsapp)
    .replace(/\{\{ADDRESS\}\}/g, address)
    .replace(/\{\{PRIMARY_COLOR\}\}/g, primaryColor)
    .replace(/\{\{HERO_IMAGE\}\}/g, heroImage)
    .replace(/\{\{HERO_MOBILE_IMAGE\}\}/g, heroMobileImage)
    .replace(/\{\{HEADLINE\}\}/g, headline)
    .replace(/\{\{SUBHEADLINE\}\}/g, subheadline)
    .replace(/\{\{HERO_BADGE\}\}/g, heroBadge)
    .replace(/\{\{SERVICES_CARDS\}\}/g, servicesCardsHtml);
}
