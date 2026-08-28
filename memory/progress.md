- [x] **Auto-Extracción y Personalización Completa de Header & Sección "Sobre Nosotros" ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts))**:
  - Función `extractWebsiteDataFromHtml` para extraer fotos, títulos, acentos, descripciones, badge VIP y métricas directamente del HTML base.
  - Formulario en el Personalizador Web con selector de fotos de salón/local, edición de badge, textos, historia y estadísticas.
  - Sincronización en vivo con iframe `srcDoc` y base de datos Supabase.

- [x] **Aislamiento Visual 100% Fiel de Sitios Gancho vía Iframe (`srcDoc`) ([`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx))**:
  - Reemplazado el `<div dangerouslySetInnerHTML>` por `<iframe srcDoc={renderedHtml}>` para aislar al 100% el árbol DOM y el CSS.
  - Elimina la contaminación del fondo oscuro `#090B10` de la app React; preserva íntegramente los fondos crema/marfil (`#FAF7F2`), tarjetas y tipografías oscuras de la maqueta base original (Imagen 1).

- [x] **Regla de Oro de Enlaces: Agendamiento Estricto vs Canal WhatsApp ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Todo botón o texto que indique `Agendar`, `Reservar`, `Cita`, `Turno`, `Book` o `Separar` en el Header, Navbar, Hero, Tarjetas o Footer dirige inequívocamente a `/reservar/:slug` (o con `?service=` / `?stylistId=`).
  - Suprime enlaces `wa.me` quemados de plantillas previas y elimina `target="_blank"` para fluidez SaaS.
  - WhatsApp queda reservado con exclusividad para íconos de WhatsApp (`fa-whatsapp`), botón flotante verde (`.whatsapp-float`) y textos que digan explícitamente "WhatsApp".

- [x] **Preselección Inteligente de Servicios vía URL (`?service=...`) en Agendador SaaS ([`BookingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/BookingPage.tsx))**:
  - Función de normalización NFD `normalizeBookingSlug` anti-tildes y símbolos.
  - Reconocimiento 100% fiel de URLs como `/reservar/crismar-barbershop?service=corte-clasico-fade` para servicios con nombres como *"Corte Clásico & Fade"*.
  - Selección inmediata con resaltado visual, total exacto y compatibilidad con preselección de especialistas (`?stylist=...`).

- [x] **Rebranding Integral a Kowy (`kowy.app`) & Favicon / Logo Oficial**:
  - Actualización de toda la plataforma a la marca Kowy y dominio `kowy.app`.
  - Isotipo 3D 'K' en coral-neón a magenta con destello de IA sobre fondo obsidiana `#090B10`, sin marcos blancos.

- [x] **Renovación de Landing Page B2B con Planes en COP & Oferta de Activación**:
  - Escalera oficial de 6 planes: $0 Gratuito, $50k Inicio, $120k Crecimiento (Regalo Mes 1), $240k Pro Flow IA, $720k Escala, $1.44M VIP.
  - Anclaje de alto valor ($680.000 COP regular ➔ $50.000 COP activación única por Nequi/Daviplata con 30 días de Crecimiento).

- [x] **Generador de QR Dinámico por Slug & Afiche HD Imprimible**:
  - QR vinculado a `https://kowy.app/reservar/:slug` y botón para copiar enlace directo.
  - Afiche Canvas HD (1200x1600 px) con diseño de acrílico y créditos de `Tecnología Kowy.app`.

- [x] **Rediseño Minimalista del Aviso de Configuración Inicial**:
  - Pill banner sobrio con contraste óptimo en modo claro y oscuro, indicadores limpios y botones compactos.

- [x] **Aislamiento Multi-Tenant & Onboarding en 3 Pasos**:
  - Eliminación de fallbacks cruzados (`prospects[0]`) y corrección de horario `[object Object]`.
  - Onboarding simplificado a 3 pasos (1. Tu Salón, 2. Servicios, 3. Equipo y Finalizar).
  - Resolución inteligente del nombre real de la dueña o del salón en el saludo.

- [x] **Protección en Agendador sin Servicios**:
  - Bloqueo del botón de continuar si no hay servicios seleccionados.
  - Tarjeta *"Catálogo en Preparación"* con botón directo a WhatsApp si el catálogo está vacío.
  - Eliminación de servicios ficticios y especialistas demo en negocios de clientes reales.

- [x] **Gestión y Control de 6 Planes SaaS en Base de Datos & Superadmin ([`update_tenant_plans_and_subscriptions.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/update_tenant_plans_and_subscriptions.sql), [`types/index.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/types/index.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - **Script SQL de Migración**: Columnas en `public.tenants` (`plan_tier`, `subscription_status`, `trial_started_at`, `trial_ends_at`, `subscription_price_cop`, `max_stylists`, `has_pos_access`, `has_ai_whatsapp`, `has_omnichannel`, `has_meta_ads`).
  - **Tipos TypeScript**: Definición de `PlanTier` (`'free' | 'inicio' | 'crecimiento' | 'pro_ia' | 'escala' | 'agencia'`) y `PlanFeatureConfig`.
  - **Activación 30 Días**: `activateProspectAsTenant` asigna por defecto el **Plan Crecimiento ($120.000 COP)** por 30 días con acceso a POS, comisiones y app móvil de colaboradoras.
  - **Control en Superadmin**: Selector interactivo de planes en la tabla de tenants con insignias de color, contador en vivo de días restantes de prueba y botón `+30 Días` para renovar la suscripción.
  - **Estrategia & Documento**: [`PLANES_Y_MERCADOLOGIA.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/PLANES_Y_MERCADOLOGIA.md) y [`DATOS_NEGOCIO.json`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/DATOS_NEGOCIO.json) con anclaje de $680.000 COP a $50.000 COP.

- [x] **Ingesta Inteligente de Carpetas & Generador Web (`DATOS_NEGOCIO.json`)**:
  - **Superadmin Lead Hub (`SuperadminDashboardPage.tsx`)**: Carga por drag & drop o selector de `DATOS_NEGOCIO.json` y `.html`, con preset de 1-clic para *Luxus Beauty Spa*, auto-completado de campos, visualización previa en tarjetas de servicios y especialistas, y generador de pitch personalizado para WhatsApp.
  - **Portal Dinámico de Reservas (`BookingPage.tsx`)**: Carga automática de los servicios y especialistas reales extraídos de `DATOS_NEGOCIO.json` para sitios de prospección (`/reservar/:slug`), con botón directo de notificación al WhatsApp del negocio.
  - **Onboarding de Reclamo Automático (`OnboardingPage.tsx`)**: Detección de `/onboarding?reclamar=:slug` que precarga catálogo real, equipo, contacto y marca el prospecto como `status: 'reclamado'`.
  - **CLI Importer (`scripts/import_prospect_folder.js`)**: Script Node.js para compilar HTML standalone con Base64 e ingestar carpetas en masa.
  - **Esquema de Base de Datos (`create_prospect_sites_table.sql` & `types/index.ts`)**: Soporte para `business_data JSONB`.

- [x] **Tablero de Mensajes & WhatsApp Omnicanal (`MessagesBoardPage.tsx`)**:
  - **Bandeja de Entrada en Tiempo Real (3 Columnas Split-Screen)**:
    - *Columna 1*: Sidebar de conversaciones con búsqueda en vivo, filtros por estado (`IA Activa`, `Control Humano`, `Con Cita`, `No Leídos`) y badges VIP.
    - *Columna 2*: Chat en vivo con burbujas de WhatsApp oficiales, marcas de tiempo, checks de entrega `✓✓`, identificador visual de emisor (Cliente, Flowy IA u Operador Humano) y barra de herramientas con inserción de Plantillas HSM y Respuestas Rápidas.
    - *Columna 3*: Ficha CRM 360° de la clienta seleccionada con próximas citas, estilista asignado, notas de diagnóstico capilar y botones directos para `+ Agendar Cita` o `💳 Cobrar en POS`.
  - **Intervención Humana (Human Takeover)**: Botón interactivo en cabecera de chat para pausar a Flowy IA y responder manualmente en conversaciones específicas sin afectar a los demás clientes.
  - **Botón Maestro Global del Bot IA**: Switch en la barra superior para encender/pausar la atención de Flowy IA para todo el salón en 1 clic.
  - **Modo Dual**: Alternador entre `📥 Bandeja en Vivo` y `🧪 Modo Simulador Sandbox` (entorno seguro para probar prompts y respuestas de IA sin impactar a clientas reales).
  - **Barra Superior Minimalista**: Ahorro de más de 200px de altura con diseño ultra-compacto y métricas inline en tiempo real.

- [x] **Centro Dedicado de Plantillas Multicanal (`TemplatesManagerPage.tsx`)**:
  - **Validación Estricta de WhatsApp**: Eliminación total de auto-aprobaciones simuladas por `setTimeout`. El sistema bloquea envíos si no hay canal de WhatsApp conectado y mantiene las plantillas en `🟡 Pendiente de Envío` de forma estricta.
  - **Matriz de Reglas y Horarios de Envío (`⚡ Reglas de Envío`)**: Control granular para activar/desactivar qué mensajes disparar (Confirmaciones, Recordatorios 24h, Recordatorios 2h, Reactivación VIP, Reseñas Google, Recibos POS, Cumpleaños), tiempos de anticipación, canal preferido y ventana de silencio nocturno anti-molestias.
  - **Editor Completo de Plantillas WhatsApp HSM & Email HTML**: Modales con edición de textos, variables, botones y previsualización en tiempo real.
  - **Simulador Móvil iPhone 15 Pro con Dynamic Island**: Chasis realista con barra de estado iOS, cabecera de WhatsApp / Apple Mail y checks `✓✓`.
  - **Creadores Studio Split-Screen**: Modales con preajustes de 1 clic, inserción de variables dinámicas por chips (`+{{1}} Nombre`) y simulación en tiempo real.

- [x] **Arquitectura de Base de Datos para Plantillas (`create_templates_tables.sql`)**:
  - `tenant_whatsapp_templates`: Almacena plantillas HSM, categoría, variables, botones, `meta_status` (`PENDIENTE`, `EN_REVISION`, `APROBADA`, `RECHAZADA`), `meta_template_id` y marcas de tiempo de envío y aprobación.
  - `tenant_email_templates`: Almacena plantillas HTML transaccionales y de marketing con personalización de colores, preheaders y llamadas a la acción.
  - `tenant_dispatch_rules`: Almacena la matriz completa de reglas y horarios de envío por tenant.

- [x] **Optimización de Interfaz del Dashboard (`DashboardPage.tsx`)**:
  - Saludo de bienvenida (*"¡Hola de nuevo, sofia! 👋"*) aislado exclusivamente en la pestaña de Inicio / Overview, dejando limpias y despejadas todas las demás vistas.
  - Nueva pestaña **`Mensajes & WhatsApp`** en el menú de navegación principal.

- [x] **Aislamiento de Datos Multi-Tenant & Negocios Reales**:
  - Salones nuevos inician con sus servicios en COP, estilista máster, 0 citas ficticias y CRM limpio.

- [x] **Portal Público de Reservas Dinámico (`/reservas`)**:
  - Enlace con slug único: `https://belleza2027.netlify.app/reservas?salon=mi-salon`.
  - Carga inteligente de catálogo, precios en COP y guardado directo en Supabase.

- [x] **Motor de Fidelización & Reactivación IA (`LoyaltyReactivationPage.tsx`)**:
  - Radar de clientas inactivas segmentado por umbrales de tiempo (`🟡 35 - 60 Días`, `🟠 60 - 90 Días`, `🔴 +90 Días Crítico`, `🎂 Cumpleañeras del Mes`, `👑 VIP en Riesgo`).
  - Cálculo en vivo del **Ingreso Potencial en Riesgo** y **Recuperación Proyectada (~38% benchmark)** en $ COP.
  - 4 Campañas inteligentes de 1-clic con variables dinámicas y vista previa en tiempo real de WhatsApp.
  - Disparador de campaña masiva multicliente o reactivación individual directa.
  - Piloto Automático Flowy IA integrado.

- [x] **Gestor de Disponibilidad & Bloqueo de Días por Especialista**:
  - Portal de Colaborador (`StylistPortalPage.tsx`): Pestaña dedicada para marcar días semanales de atención y bloquear fechas específicas o rangos de vacaciones.
  - Panel de Dueña (`DashboardPage.tsx`): Tarjetas de especialistas con badges de disponibilidad y modal de gestión administrativa de bloqueos.
  - Portal Público de Citas (`BookingPage.tsx`): Detección automática y bloqueo de horarios cuando el especialista no está disponible.
  - Script SQL de base de datos: [`add_stylist_availability_and_blocked_slots.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/add_stylist_availability_and_blocked_slots.sql).

- [x] **Selector de Hora Visual Interactivo (`TimePickerSelect.tsx`)**:
  - Reemplazo de inputs manuales de texto por selector con horarios frecuentes, cuadrícula de intervalos de 15 min y diales de precisión (Hora, Minuto, AM/PM).

- [x] **Extractor Google Maps Prospector AI v2.0 (`document/maps-reservation-prospector-v2/`)**:
  - Extracción inteligente de metadatos de negocios en Google Maps 2026 (nombre, categoría normalizada, rating, reseñas, teléfono/WhatsApp `+57...`, dirección, ciudad, URL Maps y sitio web).
  - Generador automático de **`DATOS_NEGOCIO.json`** enriquecido con eslogan persuasivo, catálogo de servicios con precios COP y equipo de especialistas por categoría.
  - Botones de acción directa en el panel flotante y en el popup: `📋 Copiar JSON`, `📥 Descargar JSON` y `📦 Exportar Bundle JSON (Todos)` para alimentar instantáneamente el **Homepage Studio** y el **Superadmin Dashboard**.

- [x] **Compresor y Subida Profesional de Imágenes WebP (`ImageUploadField.tsx` y `imageCompressor.ts`)**:
  - Compresión HTML5 Canvas del lado del cliente (>95% de reducción, fotos de 5MB pasan a ~25KB WebP a 400x400 px).
  - Soporte híbrido: Subida a bucket de Supabase Storage (`avatars`) con fallback inteligente a DataURL WebP ultraligero.
  - 3 Modos integrados: Subida de archivos / cámara, galería de 6 avatares predeterminados y enlaces URL.
  - Script SQL de base de datos y storage: [`create_storage_avatars_bucket.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_storage_avatars_bucket.sql).

- [x] **Scroll Responsivo y Altura Máxima en Modales (`max-h-[90vh] overflow-y-auto`)**:
  - Ajuste en todos los modales del Dashboard y Portal de Colaboradores para asegurar visibilidad total y accesibilidad en cualquier resolución de pantalla.

- [x] **Depuración Visual del Hero Móvil en Ingesta Web (`prospectHtmlInjector.ts`)**:
  - Eliminación total de la capa de gradiente de emblanquecimiento (`.hero-bg-overlay, .hero-overlay { display: none !important; }`).
  - Restauración de la opacidad al 100% en la fotografía de fondo para conservar el contraste, tonalidades y atmósfera original del negocio (barberías oscuras, spas, salones).
  - Remoción de sombras blancas forzadas en títulos y subtítulos del Hero móvil.

- [x] **Despliegue Continuo (CI/CD) Netlify + GitHub**:
  - Repositorio oficial: [https://github.com/osmarino73/salones_belleza_saas](https://github.com/osmarino73/salones_belleza_saas).
  - Producción activa: [https://belleza2027.netlify.app](https://belleza2027.netlify.app).
