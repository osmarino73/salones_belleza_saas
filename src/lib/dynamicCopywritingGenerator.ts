/**
 * Generador dinámico de Copywriting Persuasivo B2B y B2C para Kowy
 * Proporciona múltiples ángulos psicológicos (Lujo/VIP, Maestría/Técnica, Bienestar/Experiencia, Vanguardia/Tendencia)
 * garantizando que cada clic en "Regenerar IA" produzca variaciones frescas y persuasivas.
 */

export interface GeneratedCopywriting {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  slogan: string;
}

interface CopywritingAngles {
  badges: string[];
  titles: (name: string, city: string) => string[];
  subtitles: (name: string, city: string) => string[];
  aboutTitles: (name: string) => string[];
  aboutP1: (name: string, city: string) => string[];
  aboutP2: (name: string, city: string) => string[];
  slogans: (name: string, city: string) => string[];
}

const COPY_BY_CATEGORY: Record<string, CopywritingAngles> = {
  barberia: {
    badges: [
      '💈 Club Masculino VIP',
      '✂️ Cortes de Precisión & Ritual de Barba',
      '🔥 Maestría en Degradados & Fade Urbano',
      '👑 Barbería Clásica de Alta Gama',
      '⭐ Experiencia de Barba & Cuidado de Autor'
    ],
    titles: (name, city) => [
      `El Estilo y la Precisión que Definen tu Imagen en ${city}`,
      `Cortes Milimétricos, Barba Impecable y Autenticidad en ${city}`,
      `Donde la Tradición Clásica se Encuentra con el Fade Moderno`,
      `Maestría en Cada Detalle para el Hombre Contemporáneo en ${city}`,
      `La Barbería que Eleva tu Presencia al Máximo Nivel`
    ],
    subtitles: (name, city) => [
      `En ${name} fusionamos toallas calientes, visagismo masculino y navaja tradicional para una experiencia insuperable.`,
      `Degradados pulidos al milímetro, perfilado de barba de autor y asesoría de imagen personalizada en ${city}.`,
      `Reserva tu cita online y disfruta de un momento de desconexión con café premium y ambiente exclusivo.`,
      `Protocolos de higiene de grado médico, productos fijadores de élite y los mejores barberos de ${city}.`
    ],
    aboutTitles: (name) => [
      `El Arte y la Maestría de ${name}`,
      `Tradición, Técnica y Pasión por el Detalle`,
      `Más que un Corte, una Ceremonia de Estilo`,
      `La Evolución de la Barbería Clásica en ${name}`
    ],
    aboutP1: (name, city) => [
      `En ${name} creemos que cada visita debe ser un ritual de desconexión y renovación. Ubicados en ${city}, honramos la ceremonia clásica del afeitado combinándola con la vanguardia urbana.`,
      `Nacimos con una obsesión clara: crear un espacio donde el cuidado masculino sea sinónimo de excelencia, camaradería y precisión quirúrgica en ${city}.`,
      `Desde nuestros inicios en ${city}, ${name} ha sido el punto de encuentro de hombres que valoran su imagen y no aceptan nada menos que un acabado impecable.`
    ],
    aboutP2: (name, city) => [
      `Cada servicio se ejecuta con herramientas esterilizadas individualmente, tónicos con aceites esenciales botánicos y técnicas de tijera y máquina calibradas a tu estructura facial.`,
      `Nuestro equipo de master barberos se capacita continuamente en visagismo y técnicas internacionales para garantizar que salgas siempre con tu mejor versión.`,
      `Combinamos toallas al vapor aromatizadas, tratamientos para la piel y productos de fijación de primera línea que protegen tu cuero cabelludo y tu barba.`
    ],
    slogans: (name, city) => [
      `Maestría en degradados y cuidado masculino de primer nivel`,
      `El estilo y la precisión que definen tu presencia en ${city}`,
      `Donde el ritual de la barba se convierte en arte`,
      `Elegancia clásica y vanguardia para el hombre exigente`
    ]
  },

  salon: {
    badges: [
      '✨ Expertas en Balayage & Colorimetría',
      '💇‍♀️ Sanctuary of Beauty & Alta Peluquería',
      '🌟 Cuidado Capilar Orgánico & Brillo Espejo',
      '💫 Rubios Luminosos & Alisados de Autor',
      '💎 Diseño Capilar de Vanguardia'
    ],
    titles: (name, city) => [
      `Rubios Luminosos, Balayage de Ensueño y Cabello Sano en ${city}`,
      `Donde Tu Belleza Encuentra Su Máxima Expresión en ${city}`,
      `Transformaciones Capilares que Inspiran Confianza y Elegancia`,
      `El Arte de la Colorimetría Avanzada y el Cuidado de Autor`,
      `Alta Peluquería Diseñada Exclusivamente Para Ti en ${city}`
    ],
    subtitles: (name, city) => [
      `Técnicas internacionales de decoloración protegida con Plex, visagismo capilar y nutrición intensiva en ${city}.`,
      `En ${name} cuidamos la fibra de tu cabello con cosmética europea biocompatible para un brillo radiante y duradero.`,
      `Diseños de mechas personalizados, alisados libres de formol y tratamientos de reconstrucción profunda.`,
      `Agenda tu turno en segundos y vive una experiencia cálida, relajante y con resultados de pasarela en ${city}.`
    ],
    aboutTitles: (name) => [
      `El Arte y la Maestría de ${name}`,
      `Pasión por el Color y la Salud Capilar`,
      `Un Espacio Exclusivo Pensado Para Tu Brillo`,
      `La Filosofía de Belleza Auténtica en ${name}`
    ],
    aboutP1: (name, city) => [
      `En ${name} creemos que tu cabello es tu accesorio más poderoso. Ubicados en ${city}, nos especializamos en visagismo y diseño de color a medida para resaltar tu luz natural.`,
      `Fundamos ${name} con el propósito de ofrecer una peluquería consciente, donde la salud capilar y la sofisticación conviven en armonía perfecta.`,
      `Creemos en el poder transformador de un buen corte y un color impecable. En ${city}, nuestro salón es tu refugio de belleza y consentimento.`
    ],
    aboutP2: (name, city) => [
      `Trabajamos exclusivamente con formulaciones avanzadas libres de amoniaco agresivo, asegurando elasticidad, hidratación profunda y un movimiento lleno de vida.`,
      `Nuestras estilistas y coloristas se forman en las últimas tendencias globales para crear transiciones de color naturales y cortes con caída perfecta.`,
      `Cada diagnóstico capilar es individualizado: evaluamos la porosidad y resistencia de tu hebra para diseñar el protocolo exacto que tu melena necesita.`
    ],
    slogans: (name, city) => [
      `Transformaciones capilares que inspiran confianza y sofisticación`,
      `El arte de resaltar tu belleza auténtica en ${city}`,
      `Colorimetría de autor, rubios sanos y brillo deslumbrante`,
      `Cuidado capilar de alta gama con calidez humana`
    ]
  },

  nails: {
    badges: [
      '💅 Nail Spa & Manicura de Autor',
      '✨ Uñas Esculpidas & Tendencias de Lujo',
      '💎 Manicura Rusa & Kapping Nivelador',
      '🌸 Manos & Pies Impecables en Cada Cita',
      '🎨 Nail Art Exclusivo a Mano Alzada'
    ],
    titles: (name, city) => [
      `El Diseño y la Elegancia que Tus Manos Merecen en ${city}`,
      `Uñas Impecables, Acrílicas Esculpidas y Soft Gel de Alta Gama`,
      `Cuidado, Detalle y Perfección para Tus Manos y Pies en ${city}`,
      `El Santuario del Cuidado de Uñas y Nail Art Exclusivo`,
      `Manicura Semipermanente & Pedicura Spa de Lujo en ${city}`
    ],
    subtitles: (name, city) => [
      `En ${name} elevamos la manicura a una obra de arte con técnica rusa, nivelación rubber y esmaltes de larga duración.`,
      `Extensiones en soft gel ultraligeras, esculpidas baby boomer y pedicura jelly spa en el mejor ambiente de ${city}.`,
      `Protocolos de esterilización en autoclave, acabado espejo garantizado y asesoría personalizada para la salud de tus uñas.`,
      `Diseños a mano alzada, pedrería Swarovski y los tonos en tendencia para que tus manos hablen de tu estilo.`
    ],
    aboutTitles: (name) => [
      `El Arte y la Maestría de ${name}`,
      `Detalle, Higiene y Pasión por las Uñas`,
      `El Cuidado Exclusivo que Tus Manos Necesitan`,
      `Experiencia de Spa para Manos y Pies en ${name}`
    ],
    aboutP1: (name, city) => [
      `En ${name} convertimos cada cita en un oasis de relajación y belleza. Ubicados en ${city}, combinamos precisión técnica con hospitalidad de primer nivel.`,
      `Nuestra filosofía en ${name} se fundamenta en un principio innegociable: unas uñas deslumbrantes nacen únicamente de una base sana y cuidada.`,
      `Creamos un espacio en ${city} donde consentir tus manos y pies es una experiencia sensorial libre de prisas, con la máxima bioseguridad.`
    ],
    aboutP2: (name, city) => [
      `Utilizamos fresas diamantadas, bases niveladoras biocompatibles y lámparas UV de última generación para evitar el debilitamiento de la placa ungueal.`,
      `Nuestras nail artists dominan las estructuras más exigentes: coffin, almond, stiletto y cuadradas con simetría milimétrica.`,
      `Cada set de instrumental pasa por un riguroso proceso de limpieza ultrasónica y empaque estéril para tu total tranquilidad.`
    ],
    slogans: (name, city) => [
      `Cuidado, detalle y perfección para tus manos y pies`,
      `El santuario de las uñas perfectas en ${city}`,
      `Diseños exclusivos y acabados que resisten tu ritmo diario`,
      `Elegancia y sofisticación en cada pincelada`
    ]
  },

  spa: {
    badges: [
      '🌿 Oasis de Relajación & Bienestar Integral',
      '💆‍♀️ Dermo Glow & Terapias Faciales Avanzadas',
      '✨ Masajes Terapéuticos & Desconexión Total',
      '🌸 Renovación Celular & Aromaterapia Zen',
      '🕊️ Spa & Sanctuary Facial de Autor'
    ],
    titles: (name, city) => [
      `Desconéctate del Estrés y Renueva Tu Energía Vital en ${city}`,
      `El Balance Perfecto entre Relajación, Belleza y Bienestar`,
      `Tratamientos Faciales Dermo Glow y Masajes de Autor en ${city}`,
      `Tu Refugio de Serenidad y Cuidado Profundo en ${city}`,
      `Ciencia Estética y Terapias Holísticas para Tu Plenitud`
    ],
    subtitles: (name, city) => [
      `En ${name} diseñamos rituales de aromaterapia, masajes descontracturantes y limpiezas faciales profundas para revitalizar cuerpo y mente.`,
      `Tecnología estética no invasiva, sueros botánicos concentrados y terapeutas certificadas en ${city}.`,
      `Regálate una pausa necesaria en cabinas insonorizadas con luz tenue, música envolvente y té relajante.`,
      `Rejuvenecimiento facial con aparatología avanzada y protocolos personalizados para devolverle la luminosidad a tu piel.`
    ],
    aboutTitles: (name) => [
      `El Arte del Bienestar en ${name}`,
      `Un Oasis de Paz Diseñado Para Ti`,
      `Ciencia de la Piel y Armonía Sensorial`,
      `Tu Espacio de Reconexión en ${name}`
    ],
    aboutP1: (name, city) => [
      `En ${name} entendemos que el verdadero bienestar nace cuando el cuerpo y la mente encuentran calma. En el corazón de ${city}, te invitamos a desacelerar.`,
      `Fundamos ${name} para ser el antídoto al ritmo acelerado de la vida moderna: un refugio donde cada sentido es atendido con devoción.`,
      `Combinamos la sabiduría de los rituales milenarios con la dermatología cosmética contemporánea en ${city}.`
    ],
    aboutP2: (name, city) => [
      `Nuestros protocolos emplean aceites esenciales 100% orgánicos, piedras volcánicas calientes y mascarillas biocompatibles de alta pureza.`,
      `Cada terapeuta analiza el estado de tu piel y tus niveles de tensión muscular antes de iniciar la sesión para personalizar la experiencia.`,
      `Ambientes climatizados con difusores de lavanda y eucalipto que inducen a un estado de meditación y descanso reparador.`
    ],
    slogans: (name, city) => [
      `Un oasis de paz y serenidad para tu bienestar en ${city}`,
      `Desconéctate del mundo exterior y reconecta con tu brillo`,
      `El balance perfecto entre relajación, belleza y plenitud`,
      `Cuidado facial consciente y descanso profundo`
    ]
  },

  cejas: {
    badges: [
      '👁️ Arquitectura de Cejas & Visagismo',
      '✨ Pestañas Volumen Ruso & Efecto Lifting',
      '💫 Miradas de Impacto & Micropigmentación',
      '🌟 Lash Lifting & Laminado con Keratina'
    ],
    titles: (name, city) => [
      `La Arquitectura de Tu Mirada en Manos de Especialistas en ${city}`,
      `Cejas Perfectas y Pestañas de Impacto que Enmarcan Tu Rostro`,
      `Diseño de Cejas por Visagismo y Extensiones de Pestañas en ${city}`,
      `Realza la Fuerza y la Expresividad de Tus Ojos en ${city}`
    ],
    subtitles: (name, city) => [
      `En ${name} aplicamos micro-técnicas de visagismo facial, laminado orgánico y extensiones de seda pelo a pelo ultra livianas.`,
      `Cejas pelo a pelo hiperrealistas, lifting nutritivo con keratina y diseño simétrico acorde a tus facciones.`,
      `Adhesivos hipoalergénicos de grado médico con retención prolongada y máxima protección para tus pestañas naturales.`
    ],
    aboutTitles: (name) => [
      `El Arte de Enmarcar Miradas en ${name}`,
      `Precisión, Armonía y Visagismo Facial`,
      `Especialistas en la Expresión de Tu Rostro`
    ],
    aboutP1: (name, city) => [
      `En ${name} creemos que unas cejas bien definidas tienen el poder de iluminar y rejuvenecer tu expresión. En ${city}, diseñamos miradas inolvidables.`,
      `Nuestra pasión es encontrar la geometría perfecta que potencia la belleza natural de tus ojos sin perder naturalidad.`
    ],
    aboutP2: (name, city) => [
      `Trabajamos con fibras de seda coreanas ultraligeras que no dañan el folículo natural, garantizando volumen esponjoso y cómodo.`,
      `Cada trazo de visagismo se mide milimétricamente considerando tu tono de piel, arco de la ceja y morfología facial.`
    ],
    slogans: (name, city) => [
      `La arquitectura de tu mirada en manos de especialistas en ${city}`,
      `Cejas perfectas y pestañas que hablan sin palabras`,
      `El marco ideal para tu belleza natural`
    ]
  }
};

/**
 * Función principal que genera variaciones frescas y dinámicas
 * Evita repetir los textos actualmente en pantalla si se proveen valores previos
 */
export function generateDynamicCopywriting(
  businessName: string,
  category: string = 'barberia',
  city: string = 'Medellín',
  currentValues?: Partial<GeneratedCopywriting>
): GeneratedCopywriting {
  const cleanName = businessName.trim() || 'El Salón';
  const cleanCity = city.trim() || 'Colombia';
  const normalizedCat = category.toLowerCase();

  let copyPool = COPY_BY_CATEGORY.barberia;
  if (normalizedCat.includes('salon') || normalizedCat.includes('peluqueria') || normalizedCat.includes('color')) {
    copyPool = COPY_BY_CATEGORY.salon;
  } else if (normalizedCat.includes('nail') || normalizedCat.includes('uña')) {
    copyPool = COPY_BY_CATEGORY.nails;
  } else if (normalizedCat.includes('spa') || normalizedCat.includes('facial') || normalizedCat.includes('masaj') || normalizedCat.includes('holistico')) {
    copyPool = COPY_BY_CATEGORY.spa;
  } else if (normalizedCat.includes('ceja') || normalizedCat.includes('pesta') || normalizedCat.includes('lash')) {
    copyPool = COPY_BY_CATEGORY.cejas;
  }

  // Helper para elegir aleatoriamente evitando el valor previo si es posible
  const pickRandomDifferent = (list: string[], current?: string): string => {
    if (!list || list.length === 0) return '';
    if (list.length === 1) return list[0];
    const filtered = current ? list.filter(item => item !== current) : list;
    const candidates = filtered.length > 0 ? filtered : list;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const titles = copyPool.titles(cleanName, cleanCity);
  const subtitles = copyPool.subtitles(cleanName, cleanCity);
  const aboutTitles = copyPool.aboutTitles(cleanName);
  const aboutP1List = copyPool.aboutP1(cleanName, cleanCity);
  const aboutP2List = copyPool.aboutP2(cleanName, cleanCity);
  const slogans = copyPool.slogans(cleanName, cleanCity);

  return {
    heroBadge: pickRandomDifferent(copyPool.badges, currentValues?.heroBadge),
    heroTitle: pickRandomDifferent(titles, currentValues?.heroTitle),
    heroSubtitle: pickRandomDifferent(subtitles, currentValues?.heroSubtitle),
    aboutTitle: pickRandomDifferent(aboutTitles, currentValues?.aboutTitle),
    aboutP1: pickRandomDifferent(aboutP1List, currentValues?.aboutP1),
    aboutP2: pickRandomDifferent(aboutP2List, currentValues?.aboutP2),
    slogan: pickRandomDifferent(slogans, currentValues?.slogan)
  };
}
