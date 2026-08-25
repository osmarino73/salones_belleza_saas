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

### 2. Mapeo Estricto de Agendamiento a `/reservar/:slug`
- **Botones de Header, Navbar, Hero y Footer**: Todo botón o CTA de reserva/agendamiento (`Agendar Cita`, `Reservar Cita`, `Turno`, `btn-primary`, `btn-header`) se enlaza directamente a `/reservar/:slug`.
- **Botones en Tarjetas de Servicios**: Cada botón dentro de las tarjetas del catálogo se mapea a `/reservar/:slug?service=nombre-del-servicio`, eliminando `target="_blank"` para abrir fluidamente el agendador interactivo.

### 3. Canal Exclusivo de WhatsApp en Botón Flotante
- Únicamente el **botón flotante verde** (`.whatsapp-float`, `.wa-floating`, etc.) y los enlaces de información pura del topbar se mantienen como chat de WhatsApp (`https://wa.me/:telefono`), normalizados con el número oficial del negocio.

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

---

## 🚀 Archivos Asociados
- Motor de inyección: [prospectHtmlInjector.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts)
- Optimizador de imágenes WebP: [beautyImageLibrary.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts)
- Renderizador público de sitio: [PublicProspectSitePage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx)
- Panel Superadmin / Lead Hub: [SuperadminDashboardPage.tsx](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx)


