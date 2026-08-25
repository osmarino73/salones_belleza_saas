---
name: landing-html-injector
description: Habilidad especializada para inyectar enlaces de agendamiento (/reservar/:slug), normalizar WhatsApp, estandarizar Hero Fullwidth con visualización móvil nítida y sincronizar colaboradores y servicios reales dentro del HTML sin romper la estética original.
---

# Landing HTML Injector Skill

Esta habilidad define el protocolo oficial para procesar, inyectar y sincronizar páginas web y landing pages externas (salones, barberías, spas) dentro del ecosistema SaaS de **BeautyFlow AI**.

## 🎯 Principios de Arquitectura & Inyección
1. **Filosofía Mobile-First Obligatoria (>90% del Tráfico en Smartphones)**:
   - Más del 90% de las clientas acceden desde teléfonos móviles (360px a 430px de ancho). Toda sección, cuadrícula y botón DEBE estar optimizado de forma ergonómica para el uso con una sola mano.
   - **Cuadrícula de Servicios Móvil**: Se renderizan en **2 columnas equilibradas** con fotos cuadradas 1:1, títulos concisos y descripciones compactas (`-webkit-line-clamp: 2`) para evitar scroll infinito y permitir escanear todos los servicios rápidamente.
   - **Botones Táctiles Ergonómicos**: Todo botón de llamada a la acción (CTA) debe contar con una altura táctil mínima de `46px - 48px` y bordes cómodos para el pulgar.
   - **Cero Desbordamiento Horizontal**: `overflow-x: hidden !important` garantizado en todos los contenedores para evitar movimientos laterales accidentales.
2. **Respeto Absoluto a la Litografía, Colores y Diseño de Cards Originales**: 
   - **Preservación Total de Tarjetas de Servicios**: El motor toma la estructura HTML y clases exactas de la primera tarjeta de la plantilla original (diseño circular, halo dorado, tarjeta rectangular pastel, divisores, tipografías y colores) y sustituye dinámicamente los datos (nombre, descripción, imagen, numeración) sin inyectar clases forzadas fijas (`.glow-service-card`) ni estilos universales que alteren los colores o fuentes nativas.
   - **No inyectar máscaras oscuras forzadas ni alterar los colores de texto del HTML original.** Toda la litografía (fuentes serif, display, cursivas, tamaños, interlineado y colores de fuentes originales) se respeta al 100%.
3. **Hero Inmersivo Móvil: Rostro Despejado Arriba y Textos Centrados del Medio hacia Abajo**:
   - **Fotografía al Fondo con Rostro Libre**: La imagen se expande en el fondo completo (`min-height: 90vh; inset: 0; object-fit: cover; object-position: center 5% !important; opacity: 1;`). El rostro, la mirada y el cabello quedan 100% despejados y nítidos en la mitad superior de la pantalla sin capas ni velos de emblanquecimiento forzados (`.hero-bg-overlay, .hero-overlay { display: none !important; }`), preservando al 100% las tonalidades originales.
   - **Ubicación de Textos y Botones (`justify-content: flex-end`)**: El saludo *eyebrow*, título *h1* (`font-size: 2rem`), subtítulo (`max-width: 310px`) y los botones apilados (*"Agendar Cita"* y *"Explorar Servicios"*, `max-width: 290px; min-height: 46px; gap: 10px;`) se ubican centrados en la mitad inferior de la pantalla.
4. **Barra Superior y Cabecera Visible (Preservación del HTML Guía)**:
   - Se preserva la barra superior (topbar), navbar, menú y botones de cabecera visibles tanto en PC como en móvil, respetando el diseño, estructura y comportamiento original del HTML guía.
5. **Regla Estricta de Agendamiento en Tarjetas, Navbar, Hero & Footer**:
   - **Botones Nativos en Tarjetas de Servicios**: Todo botón o enlace dentro de las tarjetas del catálogo (`<article>`, `<div>`, `<li>`) se enlaza automáticamente a `/reservar/:slug?service=nombre-del-servicio`, eliminando `target="_blank"` para abrir fluidamente el agendador interactivo SaaS.
   - **Botones Globales de Agendamiento (Header, Hero, Footer, Banners)**: Todo botón cuyo texto, clase o atributo contenga palabras de agendamiento (`Agendar Cita`, `Reservar Cita`, `Agenda tu Cita`, `Turno`, `btn-header`, `btn-primary`, etc.) o `href` con parámetros de cita/tratamiento conduce directamente a `/reservar/:slug`.
   - **Preservación Exclusiva de WhatsApp**: Únicamente el **botón flotante verde** (`.whatsapp-float`, `.whatsapp-btn`, `.wa-floating`) y los enlaces de información pura del topbar se mantienen como chat de WhatsApp, normalizados con el número oficial.
6. **Sincronización Reactiva de Servicios y Colaboradores**:
   - Sitios gancho no reclamados (`status: 'pending'`): Muestran el catálogo y especialistas demostrativos de su HTML original sin romperse.
   - Salones activos con tenant registrado: Inyectan automáticamente hasta 6 servicios reales y hasta 4 colaboradoras marcadas con `show_on_web: true`.
   - **Regla de Catálogo Extendido & Mimetización 100% de Estética**: Cuando el negocio tiene más servicios registrados que los publicados en la portada web (`liveServices.length > displayServices.length`), se DEBE mostrar automáticamente un botón centrado al pie de la sección (*"Ver todos los servicios (N)"*). Este botón debe mimetizarse al 100% con la estética del negocio: hereda el color principal exacto de la marca (ej. `#c82d5a`), el mismo radio de borde (`border-radius: 12px`), tipografía sobria y sombras idénticas a las del botón principal del Header/Navbar, sin degradados llamativos ni emojis extraños que desentonen con la identidad visual del negocio.
7. **Sección Condicional de Descuento por Primera Visita**:
   - Por defecto viene **desactivada** (`show_first_visit_discount: false`).
   - Cuando la dueña la activa desde el Dashboard, se renderiza un banner promocional de bienvenida entre el Hero y los Servicios con el porcentaje configurado (ej: `15% OFF`), utilizando el color de acento principal del negocio y enlace directo a `/reservar/:slug`. Si está desactivada, el motor elimina el 100% de cualquier sección de oferta o CTA residual del HTML maquetado (`cta-section`, `offer-section`, `banner-promo`, etc.).
7. **Tipografía Oficial de Marca (Ficha de Diseño)**:
   - Todo sitio web inyecta Google Fonts: **`Plus Jakarta Sans`** (pesos 600, 700, 800, 900) para títulos, marca y botones; y **`Inter`** (pesos 400, 500, 600) para cuerpos de texto y subtítulos, garantizando estética prémium y legibilidad.
8. **Inyección Dinámica de Marca (Navbar, Hero, Footer)**:
   - La inyección del nombre/eslogan y logo del salón se aplica en tiempo real tanto en el Navbar (`.brand-name`, `.logo-text`, `.logo-title`) como en el `<h1>` del Hero y metadatos del sitio.
9. **Editor Visual con Previsualización Real en Tiempo Real**:
   - El panel de personalización del Dashboard cuenta con vista previa en pantalla dividida que renderiza el HTML oficial inyectado dentro de un iframe interactivo antes de publicar cambios.

## 🚀 Archivos Asociados
- Motor de inyección: [prospectHtmlInjector.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts)
- Optimizador de imágenes: [beautyImageLibrary.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts)
- Renderizador público: [PublicProspectSitePage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx)
- Panel Superadmin: [SuperadminDashboardPage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx)

