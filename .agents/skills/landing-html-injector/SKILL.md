---
name: landing-html-injector
description: Protocolo oficial para la integración funcional SaaS no invasiva de plantillas HTML (enlaces a /reservar/:slug, WhatsApp oficial, sincronización con base de datos Supabase y branding dinámico) respetando al 100% el diseño mobile-first nativo.
---

# Landing HTML Injector Skill (Protocolo de Integración SaaS No Invasiva)

Esta habilidad define el protocolo oficial para conectar páginas web y landing pages externas (salones, barberías, spas) dentro del ecosistema SaaS de **Kowy** (`kowy.app`).

Como las plantillas base ya vienen optimizadas y maquetadas de forma nativa para dispositivos móviles (Mobile-First, 2 columnas equilibradas y tipografía cuidada), el inyector opera de forma **no invasiva**, enfocándose exclusivamente en la **conectividad funcional** y la **sincronización de datos**.

---

## 🎯 Las 6 Reglas de Oro de Integración SaaS

### 1. Respeto Absoluto a la Estética y Estructura Nativa (Cero Overrides Forzados)
- **No inyectar estilos CSS invasivos** que alteren fondos, colores de tarjetas, cuadrículas, fuentes ni cabeceras del template base.
- **Preservar el diseño revisado del HTML**: No forzar jerarquías visuales artificiales (ej. inyectar etiquetas de subtítulo adicionales o clases CSS inventadas como `.section-subtitle`) en secciones como `NUESTROS SERVICIOS` / `Servicios Populares` ni en ninguna otra parte del HTML.
- Se respetan íntegramente las clases, colores, tipografías, encabezados y el diseño de las tarjetas (cards) del HTML original ya aprobado.

### 2. Regla de Oro: Mapeo Estricto de Todo Agendamiento a `/reservar/:slug`
- **Todo lo que diga reservar debe llevar a reservar**: Cualquier botón, enlace o CTA con textos como `Agendar`, `Reservar`, `Cita`, `Turno`, `Book`, `Separar Cita`, `Solicitar Cita` o clases como `.btn-header`, `.btn-primary`, `.btn-booking`, `.btn-card`, `.btn-hero`, `.btn-cita` en Header, Navbar, Hero, Tarjetas y Footer DEBE conducir inequívocamente al portal de reservas SaaS (`/reservar/:slug` o `/reservar/:slug?service=...` en servicios y `?stylistId=...` en especialistas).
- **Eliminación de `wa.me` quemados**: Si el template HTML traía originalmente enlaces provisorios a `https://wa.me/...` en botones de agendar, el inyector los sustituye obligatoriamente por la URL de reserva SaaS y remueve `target="_blank"`.

### 3. Exclusividad Estricta del Canal de WhatsApp
- **Lo único que debe llevar a WhatsApp son íconos o textos que digan WhatsApp**:
  1. El **botón flotante verde** (`.whatsapp-float`, `.wa-floating`, `.whatsapp-btn`).
  2. Enlaces o íconos que contengan explícitamente el logo/icono de WhatsApp (`fa-brands fa-whatsapp`, `fa-whatsapp`, `lucide-whatsapp`) en la barra superior o redes sociales.
  3. Textos que digan explícitamente la palabra *"WhatsApp"* (e.g. *"Escribir al WhatsApp"*, *"Chatear por WhatsApp"*).
- Todos los enlaces válidos de WhatsApp se normalizan con el teléfono internacional del negocio (`https://wa.me/:telefono`) y se abren con `target="_blank"`.

### 4. Sincronización Reactiva de Servicios y Especialistas (Supabase)
- **Sitios gancho / pendientes**: Muestran el catálogo y especialistas demostrativos de su HTML original sin romperse.
- **Negocios activos**: Inyectan los datos reales de Supabase (`liveServices` y `liveStylists` con `show_on_web: true`), sustituyendo textos e imágenes en la estructura nativa existente.

### 5. Botón Mimetizado de Catálogo Extendido
- Cuando el negocio tiene más servicios registrados en la base de datos que los mostrados en la portada web (`liveServices.length > displayServices.length`), se inserta automáticamente un botón centrado al pie:
  ```html
  <a href="/reservar/:slug" class="btn-view-all-services">Ver todos los servicios (N) →</a>
  ```
- Hereda el color principal del negocio y una tipografía sobria y coherente con el template.

### 6. Branding Dinámico y Control de Descuentos
- Reemplazo dinámico del nombre del salón, slogan, logo/icono y foto principal del Hero según la base de datos.
- Banner de descuento por 1ª visita condicional (`show_first_visit_discount: true/false`): solo se renderiza si la administradora lo activa desde su panel.

### 7. Aislamiento y Estandarización del Botón Flotante de WhatsApp en Móviles (Capa Host / React Root)
- **Problema de Iframe en Celulares**: En navegadores móviles (Chrome/Safari), si el botón flotante reside dentro del HTML del iframe, el navegador expande el iframe y `position: fixed` queda atascado al final del documento (3.000px abajo).
- **Protocolo de Renderizado**:
  1. El botón flotante de WhatsApp se gobierna **desde la capa superior React (`PublicProspectSitePage.tsx`)** con `z-[99999]`, garantizando **visibilidad permanente y fija** en la pantalla del celular en todo momento (desde el Hero hasta el Footer).
  2. **Diseño Vectorial Oficial**: Utiliza el glifo SVG oficial de alta fidelidad de WhatsApp con auricular blanco relleno, fondo con gradiente `#2fe577` a `#128C7E`, aura de pulso suave (`animate-ping`) y micro-borde `border-white/30`.
  3. **Neutralización Interna**: En el HTML inyectado dentro del iframe, se neutralizan (`display: none !important;`) los botones flotantes internos duplicados para prevenir desajustes de scroll.

---

## 🚀 Archivos Asociados
- Motor de inyección: [prospectHtmlInjector.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts)
- Optimizador de imágenes WebP: [beautyImageLibrary.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts)
- Renderizador público de sitio: [PublicProspectSitePage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx)
- Panel Superadmin / Lead Hub: [SuperadminDashboardPage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx)



