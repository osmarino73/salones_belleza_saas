- [x] **Corrección de Duplicación de Párrafo Sobre Nosotros en Badge Flotante ([`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Resuelto bug donde el párrafo descriptivo se inyectaba dentro del badge flotante sobre la foto (`experience-floating-badge`) además de la columna derecha.
  - Blindada la extracción del baseline y el reemplazo en `prospectHtmlInjector.ts` para respetar los badges y apuntar exclusivamente a `<p class="section-desc">`.

- [x] **Desacoplamiento Dueño/Admin vs Especialistas y Sembrado Automático de Colaborador Demo ([`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts), [`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`BookingPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/BookingPage.tsx), Supabase `stylists`)**:
  - `ownerStylist` ahora se crea estrictamente con `attends_clients: false` y `show_on_web: false` por defecto.
  - Al activar salones sin especialistas en su prospección, se siembra automáticamente un colaborador demo temático adaptado al nicho (ej. *Mateo 'Teo' - Master Barber* para barberías, *Valentina* para nails, *Carolina* para spa, *Camila* para salones).
  - Blindado `prospectHtmlInjector.ts` y `BookingPage.tsx` filtrando especialistas que atienden citas y están habilitados para la web.
  - Actualizado el salón Barberia Santosino en Supabase con su nuevo barbero operativo.
  - Verificado compilación con `npx tsc --noEmit` (0 errores).

- [x] **Corrección de Imagen de Ambiente y Fallback de Sobre Nosotros ([`PublicProspectSitePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), [`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts), [`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), Supabase `tenants`)**:
  - Eliminado el fallback accidental a `hero_image_mobile` para la sección de historia/ambiente.
  - Asignada la fotografía de ambiente de alta fidelidad (`photo-1585747860715-2ba37e788b70`) para barberías.
  - Blindado `prospectHtmlInjector.ts` para proteger la imagen del salón contra pisados involuntarios.
  - Sincronizados y auditados los registros de tenants en Supabase.

- [x] **Forzado Estricto de `title_accent: null` y Eliminación de Sufijos Artificiales ([`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts), [`PublicProspectSitePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), Supabase `tenants`)**:
  - Eliminados los fallbacks a textos inventados en `activateProspectAsTenant` y `PublicProspectSitePage.tsx`.
  - Migrada la base de datos de Supabase fijando `title_accent = null` en todos los tenants.
  - Verificado en `/sitio/barber-oscar` que el H1 muestra puramente el titular original sin ningún sufijo.

- [x] **Corrección de Titular H1 Duplicado en el Hero ([`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`PublicProspectSitePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), [`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts))**:
  - Resuelto bug donde `bData.headline` se asignaba a `title_accent` y se concatenaba dos veces consecutivas en el H1.
  - Añadido guardián `isAccentAlreadyInH1` en `prospectHtmlInjector.ts` para evitar duplicación de texto en el titular.
  - Sincronizado `Barber Oscar` en Supabase con `title_accent: 'Barbería Tradicional & Urbana'`.
  - Verificado visualmente en navegador en `/sitio/barber-oscar`.

- [x] **Auditoría y Calibración al 100% de las 3 Plantillas Oficiales ([`plantillaBarberia.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaBarberia.ts), [`plantillaSalonFemenino.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaSalonFemenino.ts), [`plantillaNails.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaNails.ts), [`beautyHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/beautyHtmlInjector.ts))**:
  - Resuelto token no reemplazado `{{ADDRESS_URI}}` en Salón Femenino.
  - Eliminado signo `+` duplicado que causaba `+(+57)` en Nails Studio.
  - Validados 100% de los tokens dinámicos en las 3 plantillas (0 tokens sueltos).
  - Verificados enlaces SaaS `/reservar/:slug?service=...` y botones WhatsApp oficiales.
  - Comprobado visualmente en navegador en vivo para Barbería (`/sitio/barber-ivonnoo`), Salón Femenino (`/sitio/karis-colors`) y Nails (`/sitio/nails-fama`).
  - Tipo-seguridad confirmada con `npx tsc --noEmit` (0 errores).

- [x] **Scroll Independiente en Tarjetas de Edición (Imágenes, Colores, Textos) ([`WebsiteEditorTab.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/components/dashboard/WebsiteEditorTab.tsx))**:
  - Habilitado scroll vertical independiente (`overflow-y-auto`) con barra dorada minimalista para las tarjetas de imágenes, paletas y textos, manteniendo la previsualización interactiva y el selector de tabs anclados en pantalla.

- [x] **Viewport Desktop Escalado a 1200px y Modal Fullscreen en Editor Web ([`WebsiteEditorTab.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/components/dashboard/WebsiteEditorTab.tsx))**:
  - Implementado viewport desktop nativo a 1200px escalado proporcionalmente al ancho disponible de la columna en el Dashboard, permitiendo que las media queries CSS activen la navegación desktop (`Inicio`, `Servicios`, `Nosotros`, `Ubicación`), banner 16:9 y cuadrícula de 4 columnas.
  - Añadido botón "Expandir" para previsualización modal a pantalla completa 1:1.

- [x] **Eliminación del Subtítulo en el Logo del Navbar en Previsualizador y Plantilla de Barberías ([`plantillaBarberia.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaBarberia.ts))**:
  - Eliminada la etiqueta `<div class="brand-subtitle">{{CITY}} &bull; Club Masculino VIP</div>` en la plantilla base HTML de barbería.
  - La previsualización interactiva del Editor Visual de Dashboard ahora muestra exclusivamente el nombre limpio del negocio en el navbar.

- [x] **Persistencia de Propuesta de Valor (`subtitle`), Slogan y Corrección PGRST204 en Editor Web ([`WebsiteEditorTab.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/components/dashboard/WebsiteEditorTab.tsx), [`PublicProspectSitePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx))**:
  - Resuelto el error `PGRST204` en `WebsiteEditorTab.tsx` eliminando la propiedad no existente `hero_badge` en el update de la tabla `tenants`.
  - Agregado el guardado de `subtitle: subheadline`, `slogan: headline` y `about_rating_text: metric4Val` en `tenants` y en `business_data` de `prospect_sites`.
  - Sincronizado en vivo el tenant de Barber Monster con su nueva propuesta de valor y titular.

- [x] **Mapeo Exhaustivo de `business_data` (Subtitle, Copywriting y Métricas) a `tenants` ([`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts))**:
  - `activateProspectAsTenant` ahora extrae y persiste sistemáticamente: `subtitle` (desde `copywriting.subheadline`), `hero_image_url` (priorizando `banner_url`), `slogan` (priorizando `copywriting.headline`), `hero_eyebrow` (desde `copywriting.badge`), métricas (`about_years_exp`, `about_clients_count`, `about_rating_text`) y `about_description`.
  - Forzados `title_accent: null` y `about_title_accent: null` para que PostgreSQL no aplique defaults espurios.
  - Sincronizado en caliente el tenant de Barber Monster con todos sus datos reales en Supabase.

- [x] **Logotipo Blanco Puro, H1 Sincronizado con Apartadó y Eliminación de Subtítulo Redundante en Navbar ([`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`PublicProspectSitePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), Supabase `tenants` y `prospect_sites`)**:
  - Logotipo `.brand-name` configurado en blanco puro 100% (`#ffffff !important`), erradicando el degradado rosado/fucsia.
  - Sincronizado el H1 del Hero con el titular SEO geolocalizado de Apartadó (`Cortes de Precisión, Barba Impecable y Estilo Auténtico en Apartadó`) priorizando `copywriting.headline` y actualizando `tenants.slogan` en Supabase.
  - Eliminado el subtítulo redundante `[Apartadó • Club Masculino VIP]` del navbar en la base de datos y ocultado con CSS (`.header-nav .brand-subtitle { display: none !important; }`).

- [x] **Default `title_accent: null` y Erradicación de Sufijos Concatenados en la Marca ([`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts), [`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Eliminada la concatenación artificial de `${businessName} <span>${titleAccent}</span>` en `brandTitleRegex` de `prospectHtmlInjector.ts`. Ahora preserva estrictamente el nombre limpio del negocio.
  - Forzado `title_accent: null` por defecto en la creación y activación de tenants en `supabase.ts`.
  - Actualizado el registro de Barber Monster (`d628d08d-4af7-40eb-8032-04104a1c3154`) en Supabase con `title_accent: null`.

- [x] **Heredabilidad Editorial Total de Prospecto a Tenant (`business_data` a `tenants`) ([`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts))**:
  - Habilitada la extracción e inyección en `tenants` de `slogan`, `business_hours` (con `horario` normalizado), `hero_eyebrow`, `title_accent`, `about_title`, `about_description`, `about_badge_text`, fotos (`hero_image_url`, `about_image_url`), `primary_color` y `logo_icon` temático según la especialidad (`💈` barbería, `💅` uñas, `💆‍♀️` spa, `💇‍♀️` salón).
  - Eliminado el pisado por valores `DEFAULT` obsoletos de la base de datos de PostgreSQL. Sincronizado en caliente el tenant de Barber Monster en Supabase.

- [x] **Corrección de Precios Corruptos, Duración Sobrescrita y Auto-Poblado de Fotos en Activación de Servicios ([`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts), [`plantillaBarberia.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaBarberia.ts), [`beautySpecialties.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/beautySpecialties.ts), [`beautyImageLibrary.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/beautyImageLibrary.ts))**:
  - Resuelto el bug donde `$25.000` se expandía como `$25.0005.000 COP COP` en `prospectHtmlInjector.ts` debido a colisión de grupos de captura `$2` en `replace()`.
  - Resuelto el pisado de duración de servicio por horario comercial (`Lun a Sáb: 8:00 AM – 7:00 PM`) acotando la inyección de reloj únicamente al footer y contacto.
  - Habilitado el guardado automático de `image_url` en la tabla `services` al activar prospectos a tenant con `srv.imagen_url` y fallback a `getSuggestedImageForService`.
  - Reemplazadas fotos rotas (404) y fotos no afines (hombre adulto en corte de niños) por fotos reales de alta resolución activas de Unsplash. Sincronizada la base de datos de Barber Monster.

- [x] **Unificación Oficial a 14 Días de Prueba Gratis en Plan Inicio ($29.000 COP) ([`whatsappPitchGenerator.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/whatsappPitchGenerator.ts), [`LandingPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/LandingPage.tsx), [`AgentIntakePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/AgentIntakePage.tsx), [`SuperadminDashboardPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`supabase.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/supabase.ts))**:
  - Ampliado el periodo oficial de prueba gratuita de 8 días a 14 días (2 semanas completas con 2 fines de semana) para garantizar adopción del producto y eliminar la objeción de falta de tiempo.
  - Sincronizadas las plantillas de WhatsApp, skill de persuasión, Landing Page, FAQ, servicios de activación y panel de Superadmin.

- [x] **Botón Enviar Credenciales por WhatsApp en Activación In-Field ([`AgentIntakePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/AgentIntakePage.tsx))**:
  - Incorporado botón de 1 clic «📲 Enviar por WhatsApp» en la tarjeta de activación inmediata de salones en calle para que el asesor despache directamente usuario, clave y URL al dueño.

- [x] **Implementación de la Opción 2 para el Plan Gratuito (1 Especialista + 25 Citas / mes) ([`planPermissions.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/planPermissions.ts), [`BookingPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/BookingPage.tsx), [`DashboardPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/DashboardPage.tsx), [`LandingPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/LandingPage.tsx), [`PLANES_Y_MERCADOLOGIA.md`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/PLANES_Y_MERCADOLOGIA.md))**:
  - **Lógica de Permisos & Modelo**: En `planPermissions.ts`, configurado Plan Gratuito con `max_stylists: 1`, `max_monthly_appointments: 25`, `can_use_booking_saas: true` y función `checkMonthlyBookingLimit`.
  - **Agendador Interactivo (`/reservar/:slug`)**: En `BookingPage.tsx`, se limita la selección al especialista principal y se contabilizan las citas online del mes en curso. Al completarse las 25 citas, el botón conmuta suavemente a *"Agendar por WhatsApp Directo"* con el mensaje prellenado con todos los detalles del turno (cero pérdida de clientas).
  - **Dashboard del Salón**: Barra de progreso visible de cupo mensual (`X / 25`), avisos preventivos y botón directo de upgrade a Plan Inicio ($29.000 COP/mes).
  - **Landing Page B2B**: Presentación oficial de las ventajas del Plan Gratuito en la escalera de valor.

- [x] **Imagen Oficial Predeterminada de Hero Móvil para Plantilla Nails ([`beautySpecialties.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/beautySpecialties.ts), [`beautyHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/beautyHtmlInjector.ts))**:
  - Configurada `https://ascskenpfcnyejaamjlb.supabase.co/storage/v1/object/public/stock-images/1792160934258_Complete_image_leaving_lower_third_20261016092835.webp` como imagen oficial predeterminada para el Hero Móvil (9:16) en la especialidad de Uñas / Nails Bar.
  - Sincronizado en Supabase el sitio en vivo de `nail-maxx`.

- [x] **Edición Dinámica de {{HERO_BADGE}} y Mayor Peso Editorial en Hero de Uñas ([`WebsiteEditorTab.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/components/dashboard/WebsiteEditorTab.tsx), [`AgentIntakePage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/AgentIntakePage.tsx), [`prospectHtmlInjector.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`plantillaNails.ts`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/lib/templates/plantillaNails.ts))**:
  - **Edición de `{{HERO_BADGE}}`**: Habilitada la edición del badge caligráfico superior (`.hero-script-tag`) tanto en el Editor Web del Dashboard (`WebsiteEditorTab.tsx`) como en el Wizard de Prospección de Agentes (`AgentIntakePage.tsx`). Soportado de forma retrocompatible en `prospectHtmlInjector.ts` para que cualquier cambio en `copywriting.badge` o `hero_badge` se refleje inmediatamente en el sitio público en vivo.
  - **Mayor Peso y Distinción al H1**: Se elevó la jerarquía de *"El diseño y la elegancia que tus manos merecen en Apartadó."* con `font-weight: 700`, escala armónica `clamp(2.2rem, 3.6vw, 3.2rem)`, `line-height: 1.14` y sombras multicapa profundas para máximo impacto visual y contraste óptico.
  - **Efecto Glow & Cápsula Translúcida**: Sombra luminosa (*soft glow*) en la firma caligráfica (`text-shadow: 0 0 24px rgba(216, 125, 125, 0.45)`) y conversión del botón «Ver Servicios» en píldora translúcida con micro-borde de vidrio y *backdrop-blur*.

- [x] **Corrección de Colapso Visual en Galería Stock CDN ([`SuperadminDashboardPage.tsx`](file:///c:/Users/comer/kowy.app/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - **Problema**: El modal se mostraba como un conjunto de rayas horizontales colapsadas y los filtros quedaban aplastados a un scrollbar.
  - **Solución**: Se corrigió la estructura flex aplicando `shrink-0` a los elementos fijos, envolviendo el grid en un contenedor con `min-h-0 overflow-y-auto` y forzando `min-h-[300px]` en cada tarjeta con preview de `h-44`.

- [x] **Flujo Fiel de 3 Pasos de Agentes de Campo Kowy (Ficha Negocio ➔ Fotos & Servicios ➔ ¡Listo!)**:
  - **Requerimiento**: Adaptar con fidelidad estética y funcional las pantallas de referencia para el módulo de prospección en calle de Kowy (`/agente`).
  - **Implementación**:
    1. **Paso 1 (Ficha Negocio)**: GPS Auto, pills de ciudades colombianas, slug automático, 11 especialidades de belleza interactivas, eslogan con IA, WhatsApp para reservas (+57) y constructor visual de horarios (`[L][M][X][J][V][S][D]`, horas y "Viernes y Sábado cierran más tarde").
    2. **Paso 2 (Fotos & Servicios)**: 8 plantillas visuales con previews y badges, slots para Hero Desktop (16:9), Hero Móvil (9:16) y Banner, generador de copywriting con IA (Hero + Sobre Nosotros), y catálogo de 6 servicios con precios COP editables en caliente.
    3. **Paso 3 (¡Listo!)**: Enlaces directos a la demo (`/sitio/:slug`) y al agendador (`/reservar/:slug`), generador de pitch de WhatsApp en 3 pasos con envío directo a `wa.me/` y activación B2B express en terreno (8 días gratis en Plan Inicio, $0 hosting de por vida) con campo editable de contraseña, botón de generación aleatoria `🎲` y toggle de visibilidad `👁️`.

- [x] **Módulo de Agentes de Campo PWA y Reforma Comercial Plan Inicio ($29.000 COP / mes + 8 Días Gratis + $0 Hosting)**:
  - **Requerimiento**: Integrar módulo de agentes en terreno adaptando `kewe_export_module` con arquitectura nativa Mobile-First (cero dependencias externas rotas), y reformar Plan Inicio a $29.000 COP/mes (3 estilistas + $10k/adicional) con 8 días gratis sin costo de hosting.
  - **Implementación**:
    1. **PWA Móvil en Terreno (`src/pages/AgentIntakePage.tsx`)**: Rutas `/agente` y `/campo` con geolocalización GPS automática, carga rápida de prospectos en 30s, generación de demo 1-clic con estética nativa Mobile-First y presets de belleza.
    2. **Inyector HTML de Belleza (`src/lib/beautyHtmlInjector.ts`)**: Genera landings de salones con reservas vinculadas a `/reservar/:slug` y botón flotante exclusivo a WhatsApp oficial.
    3. **Servicio de Agentes y Métricas (`src/lib/agentService.ts`)**: Manejo de sesión de agente, registro de prospectos, persistencia en Supabase (`agentes_campo`) y métricas del día.
    4. **Activación B2B Efímera (`src/lib/prospectActivationService.ts`)**: Conversión directa de prospecto a tenant en producción (8 días de prueba gratis, $0 hosting) sin desconectar la sesión del agente móvil.
    5. **Reforma Comercial Kowy**: Actualización en `PLANES_Y_MERCADOLOGIA.md`, `DATOS_NEGOCIO.json`, `planPermissions.ts`, `LandingPage.tsx`, `DashboardPage.tsx`, `SuperadminDashboardPage.tsx`, `supabase.ts`, `whatsappPitchGenerator.ts` y skill `whatsapp-persuasive-copy`.
    6. **DDL Supabase (`create_field_agents_table.sql`)**: Estructura de tabla `agentes_campo` y campos GPS.
    7. **Navegación Superadmin**: Acceso directo a `/agente` desde topbar y tabs de `SuperadminDashboardPage.tsx`.

- [x] **Botón de Copiado de JSON Completo por Negocio en CRM Z-Control (`C:\Users\Rio Belen\zcontrolprospecto\index.html`)**:
  - **Requerimiento**: Botón para copiar el JSON con toda la información de ese negocio específico.
  - **Implementación**:
    1. **Botón en Tabla**: En la columna de acciones de copiado se añadió el botón `<button class="copy-pill btn-copy-lead-json"><i class="fa-solid fa-code"></i> JSON</button>`.
    2. **Botón en Cuadrícula (Cards)**: En `.quick-copy-bar` se incorporó el botón `JSON`.
    3. **Botón en Tarjetas Kanban**: Integrado junto a los botones de Chat y Editar.
    4. **Botón en Modal de Detalle**: Botón destacado en el pie del modal: `Copiar JSON de este Negocio`.
    5. **Copiado al Portapapeles**: Obtiene el objeto íntegro del lead con toda la información del negocio (`nombre`, `rubro`, `contacto`, `ubicacion`, `sitio_web`, `sistema_reservas`, `servicios`, `especialistas`, `status`, `notes`), formateado en JSON con sangría (2 espacios), y muestra toast confirmando el copiado.
  - **Validación**: Sintaxis JS verificada en VM y compilación exitosa con `npm run build`.

- [x] **Columnas 'Oportunidad' y 'Sitio Web' en Tablero CRM Z-Control (`C:\Users\Rio Belen\zcontrolprospecto\index.html`)**:
  - **Requerimiento**: Agregar las columnas de "Oportunidad" y "Sitio Web" en el tablero de prospectos.
  - **Implementación**:
    1. **Encabezados de Tabla**: Añadidos `<th>Oportunidad</th>` y `<th>Sitio Web</th>` en `.leads-table`.
    2. **Badges de Oportunidad**: Insignias visuales temáticas (`🔥 ALTA` en rosa brillante, `⚡ MEDIA` en ámbar, `⚪ BAJA` en gris). Si el prospecto no posee sitio web registrado, clasifica automáticamente como oportunidad ALTA para vender el SaaS Kowy.
    3. **Enlace a Sitio Web**: Si existe URL, genera un enlace interactivo con dominio limpio (`🌐 dominio.com ↗`); si no tiene sitio web, exhibe una etiqueta limpia `Sin web`.
    4. **Sincronización Transversal**: Badges de oportunidad y botones de acceso al sitio web añadidos también a la vista de Cuadrícula (Cards), vista Kanban y al generador de tabla HTML exportable.
  - **Validación**: Análisis y validación de sintaxis JS en VM y compilación limpia con `npm run build`.

- [x] **Soporte Drag & Drop y Explorador de Archivos JSON en Z-Control CRM (`C:\Users\Rio Belen\zcontrolprospecto\index.html`)**:
  - **Requerimiento**: Poder arrastrar y soltar archivos `.json` directamente o disponer de un botón para buscar y seleccionar el archivo en el computador dentro del modal "Importador & Editor JSON".
  - **Implementación**:
    1. **Zona Drag & Drop Visual (`#json-dropzone`)**: Caja con borde punteado interactivo, feedback visual al pasar el cursor (`.dragover`), ícono de nube y textos explicativos.
    2. **Explorador de Archivos Nativo (`#btn-browse-file` + `#json-file-input`)**: Botón *"Buscar Archivo JSON..."* que abre el selector de archivos del sistema operativo con filtro para archivos `.json`.
    3. **Doble Captura de Eventos**: Permite soltar el archivo tanto en la dropzone superior como directamente sobre el área de texto `<textarea id="json-input">`.
    4. **Lectura y Formateo Instantáneo**: Carga mediante `FileReader`, parseo JSON seguro, auto-indentación estética (2 espacios) y notificación toast con el total de prospectos detectados.
    5. **Badge de Confirmación (`#json-file-badge`)**: Muestra el nombre del archivo cargado, tamaño formateado (KB/MB) y cantidad de prospectos listos para importar.
  - **Validación**: Pruebas de sintaxis JS pasadas exitosamente sin errores.

- [x] **Corrección de Extracción de Datos Reales y WhatsApp en Maps Reservation Prospector AI ([`content.js`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/document/maps-reservation-prospector-v2/content.js))**:
  - **Problema**: Al presionar "⚡ Analizar Búsqueda", los datos de los negocios quedaban incompletos y el WhatsApp se reemplazaba con el valor genérico ficticio `+573000000000`. Además, en listas largas el proceso podía detenerse a mitad de camino.
  - **Causa Raíz**: 
    1. Google Maps oculta el teléfono, dirección completa y servicios en las tarjetas compactas del feed; el scraper anterior leía únicamente el HTML estático superficial sin abrir las fichas.
    2. `normalizePhone` tenía programado por defecto el fallback ficticio `+573000000000`.
    3. Detenciones a mitad de camino: desincronización de nodos DOM tras abrir y cerrar fichas (nodos DOM huérfanos/desconectados), variantes de texto en el botón Volver de Maps ("Volver a los resultados de la búsqueda") que dejaban la ficha abierta, o sitios web con tiempos de respuesta lentos en el auditor de reservas.
  - **Solución Implementada**:
    1. Eliminación total del fallback `+573000000000`. Si un negocio no tiene teléfono, ahora retorna cadena vacía y se etiqueta como `"No registrado en Maps"`.
    2. **Inspección Profunda Automática y Blindada**: en `scan()`, el extractor consulta dinámicamente tarjetas frescas conectadas al DOM en cada iteración, hace scroll suave al negocio, abre la ficha, extrae teléfono real (`button[data-item-id*="phone"]`), dirección completa, horario, sitio web y chips de servicios reales.
    3. **Retorno Seguro al Feed (`closeDetailAndReturnToFeed`)**: soporte para selectores de regreso en español ("Volver", "Atrás", "Regresar", `hV10qc`) con fallback a `history.back()`, esperando la confirmación activa del feed antes del siguiente negocio.
    4. **Auditoría de Reservas con Timeout (`checkWebsiteWithTimeout`)**: límite de 3.0s con `Promise.race` para evitar que páginas caídas o lentas congelen el análisis.
    5. **Aislamiento de Errores por Tarjeta**: `try / catch` independiente por cada negocio para que un fallo o anuncio patrocinado nunca detenga el escaneo global.
    6. Control de flujo con botón interactivo `⏹️ Detener Escaneo`, botón `💾 Guardar Todos` y edición rápida `✏️`.

- [x] **Preservación Fiel del Texto del Header & Eyebrows Nativos del HTML Base ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - **Requerimiento**: Tomar tal cual el texto del header y escrituras/eyebrows cursivos como vienen maquetados originalmente en la plantilla HTML base (ej. "Katerine Canedo", "ESTÉTICA FACIAL INTEGRAL · MONTERÍA", eslóganes y taglines).
  - **Implementación**:
    1. Se eliminó la regla CSS restrictiva `.hero-script-tag, .hero-eyebrow, .hero-tagline-script { display: none !important; }` en `prospectHtmlInjector.ts`.
    2. Se configuró la visualización limpia con `display: block !important` y tipografía adaptable fluida tanto en computadores como en pantallas móviles (`@media (max-width: 640px)`).
    3. Se mantuvieron intactos los textos, fuentes cursivas, acentos de color y jerarquía visual nativa.
    4. Compilación validada exitosamente mediante `npm run build` (código 0).

- [x] **Optimización del Texto del Hero en Móviles (Anclaje Inferior) ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - **Requerimiento**: Mover y mejorar el texto del header/hero en móviles para que quede fijado en la parte inferior de la imagen sin tapar el rostro de la modelo.
  - **Implementación**:
    1. Se ampliaron los selectores de contenedores en `@media (max-width: 640px)` (`.hero-content`, `.hero-text-box`, `.hero-container-align`, `.hero-caption`, `.hero-intro`, `.hero-inner`, `.hero-header-box`, `.hero-main-content`, etc.) con `position: absolute !important; bottom: 0 !important; top: auto !important; margin-bottom: 0 !important;`.
    2. Se configuró escala tipográfica ultracompacta `clamp(1.10rem, 4.0vw, 1.40rem)` para H1, interlineado ajustado `1.18` y márgenes reducidos para la tipografía, botones y badges.
    3. Se re-encuadró el rostro de la modelo en los dos tercios superiores de la pantalla con `object-position: center 5% !important`.
    4. Se optimizó el gradiente oscuro suave (`height: 55% !important`) desde la base inferior para garantizar legibilidad y contraste AAA sobre cualquier fotografía o video canvas.
    5. Compilación validada exitosamente mediante `npm run build` (código 0).

- [x] **Integración de Pitch Persuasivo "Estatus Makloz Tech" ($7.417/mes) ([`whatsappPitchGenerator.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/whatsappPitchGenerator.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`whatsapp-persuasive-copy/SKILL.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/.agents/skills/whatsapp-persuasive-copy/SKILL.md))**:
  - Incorporada nueva función `generateMaklozTechPitch({ businessName, ownerName })` con enfoque de estatus, autoridad, subsidio tecnológico del 85% de Makloz Tech e inversión anual de $89.000 COP ($7.417/mes) para hosting y certificado SSL.
  - Actualizado el modal de prospectos de WhatsApp y la tarjeta de sitio creado en el Superadmin con soporte para selector de 3 pasos (Paso 1: Gancho Visual, Paso 2: Oferta $89k SaaS, Paso 3: Estatus Makloz Tech).
  - Registrada la Plantilla 3B en la skill `whatsapp-persuasive-copy`.
  - Compilación validada exitosamente con `npm run build` (código 0).

- [x] **Optimización Mobile-First de Encuadre y Prevención de Superposición de Textos ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Resuelto el problema por el cual en teléfonos móviles físicos (Safari iOS y Chrome Android) los textos del Hero (título H1, subtítulo y eyebrow) se superponían sobre el rostro de la modelo.
  - Se configuró `min-height: 100dvh !important` para prevenir la compresión causada por la barra de direcciones de navegadores móviles.
  - Se re-encuadró la imagen/canvas del rostro en el tercio superior de la pantalla mediante `object-position: center 12% !important` en `@media (max-width: 640px)`.
  - Se implementó tipografía adaptativa `clamp(1.35rem, 5.5vw, 1.95rem)` para evitar que los títulos H1 colapsen en 3-4 renglones y padding de protección vertical.
  - Compilación validada exitosamente con `npm run build` (código 0).

- [x] **Corrección de Tokens Cromáticos para Sandra Color´s y Plantillas con `--accent-primary` ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Resuelto el problema por el cual cambiar el color principal en Sandra Color´s desde el Superadmin no producía cambios evidentes en la web pública.
  - La plantilla nativa de Sandra Color´s controla más de 28 reglas CSS de títulos H1, acentos, botones, tarjetas de servicios y footer mediante tokens `--accent-primary`, `--accent-light`, `--accent-hover`, `--accent-soft` y `--gold-border`.
  - El inyector de CSS (`colorOverridesCss`) omitía estos tokens; se han incorporado a `:root` con `!important`, junto a los tokens de Nails/Pink (`--color-rose*`), control de sombras dinámicas y contraste de texto para `.btn-hero-primary` y `.btn-footer-cta`.
  - Compilación validada exitosamente con `npm run build` (código 0).

- [x] **Paso Extra de Seguridad en Eliminación de Prospectos y Salones Activos ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - Implementado flujo de seguridad en dos pasos para la eliminación de prospectos en el Embudo de Ventas: Paso 1 (Impacto y purga opcional en Cloudflare R2) y Paso 2 (Paso extra de seguridad con validación por teclado que exige escribir `ELIMINAR` para desbloquear el botón 🔒 ➔ 🔓).
  - Eliminado el `window.confirm()` rudimentario en la eliminación de salones activos SaaS y reemplazado por un modal de máxima seguridad en dos pasos: Paso 1 (Diagnóstico forense de citas, colaboradoras, servicios, CRM y web que serán destruidos en cascada) y Paso 2 (Desafío de Superadmin exigiendo escribir el nombre del salón o `ELIMINAR`).
  - Compilación validada exitosamente con `npm run build`.

- [x] **Actualización de Canal de Cobro en Mensaje de Activación Paso 2 a Nequi / Bancolombia ([`whatsappPitchGenerator.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/whatsappPitchGenerator.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`PLANES_Y_MERCADOLOGIA.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/PLANES_Y_MERCADOLOGIA.md))**:
  - Cambiada la referencia de pago de activación de $89.000 COP de `(vía Nequi o Daviplata)` a `(vía Nequi o Bancolombia)`.
  - Actualizado el cierre del Paso 2 a `¿Les comparto los datos de Nequi/Bancolombia para dejarles el acceso administrativo activo hoy mismo? ⚡`.
  - Sincronizados tips del modal en Superadmin Dashboard y documentación en `PLANES_Y_MERCADOLOGIA.md`.

- [x] **Actualización de Copy Persuasivo en Mensaje de Primer Contacto para Nicho Nails ([`whatsappPitchGenerator.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/whatsappPitchGenerator.ts), [`SKILL.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/.agents/skills/whatsapp-persuasive-copy/SKILL.md))**:
  - Modificada la pregunta de cierre para prospectos del nicho de uñas: ahora pregunta directamente qué les pareció el demo preparado para su negocio (`¿Qué les pareció el demo que preparamos para {businessName}? ¿Les gustó cómo quedó?`).
  - La interpolación es dinámica con el nombre del negocio (por ejemplo *"Dp Beauty Nails"*), adaptándose automáticamente a cualquier salón o estudio de uñas prospectado.
  - Sincronizada la skill `whatsapp-persuasive-copy`.

- [x] **Inyección Cromática Dinámica Multi-Nicho para Prospectos y Sitios Web ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx))**:
  - Resuelto el problema por el cual cambiar el color principal en prospectos no activos (específicamente My Spacio Nails) no se reflejaba en el sitio web en vivo.
  - La plantilla de uñas de My Spacio Nails utiliza tokens CSS Camel (`--color-camel`, `--camel-gradient`, `--shadow-camel`, etc.) que no estaban contemplados en el inyector de estilos dinámicos.
  - Se incorporaron al `:root` dinámico los tokens de Nails (Camel/Nude/Champagne), tokens de Barberías y Rizos (Gold/Golden Accent) y tokens de Spas (Mocca/Warm Earth).
  - Se implementó cálculo de luminancia y contraste para asegurar legibilidad del texto en botones principales (`.btn-header-cta`, `.btn-primary`, `.btn-hero-book`, etc.).
  - Soporte para parseo seguro de `business_data` y resolución en cascada en `PublicProspectSitePage.tsx`.

- [x] **Reemplazo de Imagen de Sobre Nosotros por Fotografía Real del Nicho Nails ([`beautyImageLibrary.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts), Supabase `prospect_sites`, Cloudflare R2 `stock/nails/`)**:
  - Reemplazada la fotografía de secadores y planchas de pelo CROC en "Sobre Nosotros" por una fotografía macro de salón que muestra a una manicurista profesional trabajando con instrumental y lámpara UV en la uña de una clienta.
  - Alojada en Cloudflare R2 (`https://pub-22e6e94a97b84b068f4217675926ef7f.r2.dev/stock/nails/about-nuva-nails-manicurista.jpg`).
  - Sincronizada en Supabase (`prospect_sites` y `tenants`) y en los archivos locales de `nuva_nails_spa`.
  - Añadida a la biblioteca `BEAUTY_STOCK_LIBRARY` en la categoría `hero_nails`.

- [x] **Actualización Integral de Imágenes de Servicios para Nicho Nails y Nüva Nails Spa ([`beautyImageLibrary.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts), Supabase `prospect_sites`, Cloudflare R2 `stock/nails/`)**:
  - Reemplazadas las imágenes inconsistentes de stock por fotografías macro de alta definición enfocadas 100% en uñas y manicura.
  - Subidas 6 fotografías de catálogo a Cloudflare R2 (`kowy-frames/stock/nails/`) con CDN global y caché inmutable.
  - Sincronizados `business_data.servicios` y `raw_html` de `nuva-nails-spa` en Supabase y en el archivo local de `negocios_locales/nuva_nails_spa/index.html`.
  - Actualizada la biblioteca modular `NAILS_STOCK_SERVICES` en `beautyImageLibrary.ts` para todos los futuros salones de uñas.

- [x] **Sincronización Bidireccional de Color Principal en Sitios Activos ([`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx))**:
  - Resuelto el bug donde cambiar el color principal desde Superadmin funcionaba de inmediato en prospectos pero no en sitios ya activos/reclamados.
  - Se completó el payload en `api.updateTenant` para incluir `primary_color` y todas las columnas de personalización web hacia la tabla `tenants` de Supabase.
  - Se agregó sincronización automática en `api.updateProspectSite` para reflejar cualquier cambio de color en la tabla `tenants` en Supabase por ID o slug.
  - En Superadmin se amplió la coincidencia de tenant por `claimed_tenant_id` y por `slug`, actualizando de forma reactiva `tenants` en memoria.
  - En la web pública (`PublicProspectSitePage.tsx`), se priorizó `bData.primary_color || tenant?.primary_color`, asegurando que defaults antiguos de la base de datos no bloqueen el nuevo color.

- [x] **Eliminación Coordinada de Prospectos con Purga Automática en Cloudflare R2 ([`delete-frames.mjs`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/netlify/functions/delete-frames.mjs), [`deleteFramesFromR2.mjs`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/scripts/deleteFramesFromR2.mjs), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - Implementada serverless function `netlify/functions/delete-frames.mjs` con `@aws-sdk/client-s3` para listar y borrar por lotes todos los fotogramas WebP bajo `frames/:slug/` en Cloudflare R2.
  - Creado script CLI `npm run delete:frames <slug>` en `scripts/deleteFramesFromR2.mjs` para mantenimiento manual desde terminal.
  - Diseñado modal interactivo de confirmación en Superadmin Dashboard con detección automática de assets en CDN, checkbox para liberar almacenamiento en R2 y sincronización de borrado en Supabase con feedback detallado de fotogramas purgados.

- [x] **Banco de Imágenes de Servicios por Nicho - Catálogo Especializado Nails ([`beautyImageLibrary.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts), [`ServiceImagePicker.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/ServiceImagePicker.tsx), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - Creada la colección modular `NAILS_STOCK_SERVICES` con 14 servicios esenciales de uñas en alta resolución WebP (Manicura Semipermanente, Manicura Rusa con Torno, Acrílicas Esculpidas, Soft Gel / Gel-X, Kapping / Rubber Base, Polygel, Nail Art con Foil de Oro, Micro French, Baby Boomer, Cat Eye, Pedicura Spa / Jelly, Pedicura Rusa, Retiro Seguro y Spa de Manos con Parafina).
  - Ampliado el motor de inferencia semántica `getSuggestedImageForService` para mapear de forma granular más de 25 términos de la industria de uñas a su fotografía técnica correspondiente.
  - Actualizado el modal de Galería de Superadmin con la categoría `💅 Uñas & Nails` y soporte transparente en el selector de servicios para salones (`ServiceImagePicker`).

- [x] **Selector y Personalizador de Color Principal por Negocio en Superadmin ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Implementado botón interactivo de color (pastilla visual con preview y HEX) en la columna "Salón" y botón `<Palette />` en las Acciones de la tabla de prospectos.
  - Creado modal de personalización cromática con 10 presets de lujo curados (Caramel Mocca, Gold Foil, Rose Gold, Emerald Spa, Ruby Velvet, Cyber Cyan, Sunset Amber, Bronze Luxury, Lavanda Relax, Hot Coral), selector libre nativo (`<input type="color">`), input HEX y previsualización en vivo de botones y acentos tipográficos.
  - El inyector `prospectHtmlInjector.ts` calcula derivaciones de brillo con `adjustColorBrightness` y sobreescribe de forma limpia y no invasiva las variables de acento (`--color-accent`, `--color-primary`, `--color-mocca`, `--color-gold`, etc.) en `:root`.
  - Persistencia reactiva en Supabase (`prospect_sites.business_data.primary_color` y `tenants.primary_color` si fue reclamado) con confirmación visual de guardado.

- [x] **Resolución de Feedback y Publicación de Video-Scroll en Vivo ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Resuelto el problema reportado donde al pulsar "Aplicar y Publicar en Vivo" parecía no ocurrir nada: se añadieron estados visuales inmediatos en el botón (`✓ ¡Publicado con Éxito!` con anillo esmeralda reactivo), badge de confirmación en el pie del modal y botón de "Cerrar".
  - Corregido el reemplazo de URLs en [`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts): ahora detecta y sustituye cualquier URL previa de CDN (`.../frames/:slug/...`) por la nueva versión (`v2`), limpiando barras inclinadas duplicadas (`//mobile`).
  - Sincronización completa de `raw_html` en Supabase al aplicar nueva versión de video.
  - El botón "Probar Sitio en Vivo" ahora fuerza bypass de caché local del navegador con `?t=...`.

- [x] **Modal Dedicado "Gestión de Video-Scroll & CDN R2" en Superadmin ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`upload-frames.mjs`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/netlify/functions/upload-frames.mjs), [`uploadFramesToR2.mjs`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/scripts/uploadFramesToR2.mjs))**:
  - Implementado botón de acceso rápido `🎬 Video Scroll HD • Gestionar` en la tabla de prospectos.
  - Creado modal interactivo con diagnóstico en tiempo real de Cloudflare R2, control de versionado (`v1` -> `v2` para cache-busting), selector de carpetas para subida web directa de frames WebP con barra de progreso, y botón de 1 clic `🚀 Aplicar y Publicar en Vivo` para sincronizar en Supabase.
  - Soportado parámetro `version` tanto en la Netlify Function como en el script CLI `npm run upload:frames <slug> --version=v2`.

- [x] **Bloqueo Total de Edición de Portada en Sitios con Video-Scroll ([`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx))**:
  - Implementada la Opción B: Cuando un sitio cuenta con animación de Video-Scroll Scrubbing (`#hero-canvas` / `.hero-scroll-section` / `has_video_scroll`), la sección de Fotografía Principal del Header queda 100% bloqueada en el Personalizador Web.
  - Se sustituye el selector de fotos por un banner de alta gama con candado `🔒`, badge `🎬 Video Scroll HD` e indicador de CDN Cloudflare R2 activo, protegiendo la secuencia cinemática contra sobreescrituras accidentales.

- [x] **Corrección del Botón de Cierre en Modal de Activación / Bienvenida ([`WelcomeModal.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/WelcomeModal.tsx))**:
  - Resuelto problema donde el botón de cerrar (`X`) en la esquina superior derecha no respondía al clic debido a que el contenedor de cabecera con `relative z-10` se superponía en el apilamiento CSS sobre el botón (`absolute z-10`).
  - Se elevó el botón a `z-50` prioritario con mayor área táctil (`w-9 h-9 sm:w-10 sm:h-10`).
  - Se habilitó cierre al hacer clic en el backdrop oscuro exterior y mediante la tecla `Escape`.

- [x] **Generador de Mensajes Persuasivos de WhatsApp Adaptados por Nicho & Modal de Vista Previa ([`whatsappPitchGenerator.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/whatsappPitchGenerator.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`HomepageStudioModal.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/HomepageStudio/HomepageStudioModal.tsx), [`SKILL.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/.agents/skills/whatsapp-persuasive-copy/SKILL.md))**:
  - **Paso 1 (Gancho Visual & Demo)**: Personalizado por nicho con pregunta de dolor agudo ("¿Les gustaría que sus clientes agenden turnos solos sin tener que responder tantos chats de WhatsApp?").
  - **Paso 2 (Respuesta al Interés & Cierre Directo $89k)**: Redacción persuasiva de alta conversión sin rodeos ("¡Qué bueno que les guste! 🚀 La armamos pensando en que no pierdan clientes por responder tarde al WhatsApp..."), 3 pilares clave (web 1 año, 1 mes gratis agenda móvil, material QR) y micro-cierre con datos de Nequi/Daviplata.
  - **Modal Dedicado en Tabla de Prospectos**: El botón de WhatsApp en la tabla de embudo ahora abre un modal interactivo para leer, copiar y alternar entre Mensaje 1 y Mensaje 2 en tiempo real para cualquier prospecto, con selector de nicho dinámico, botón de 1 clic a WhatsApp y opción de marcar como contactado.
  - Integración modular reutilizable en Superadmin Dashboard y Local Homepage Studio.

- [x] **Resolución de Error 404 en Contador de Visitas de Prospectos ([`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts), [`create_increment_views_rpc.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_increment_views_rpc.sql))**:
  - `incrementProspectSiteViews` actualiza directamente la columna `views_count` en la tabla `prospect_sites`, eliminando la llamada RPC fallida a `/rest/v1/rpc/increment_prospect_views` y su error 404.
  - Creado script SQL `create_increment_views_rpc.sql` para el esquema de base de datos.

- [x] **Diagnóstico Inmune a CORS y Resolución Multi-Ruta de Fotogramas para Video-Scroll ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`uploadFramesToR2.mjs`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/scripts/uploadFramesToR2.mjs))**:
  - Diagnóstico CDN mediante `new Image()` nativo con timeout y fallback a `poster.webp`, eliminando falsos negativos causados por bloqueos de CORS en `fetch()`.
  - Detección universal de carpetas de fotogramas en `../negocios_locales/<slug>/public/frames` y con guiones bajos en el CLI `npm run upload:frames <slug>`.

- [x] **Ingesta Inteligente de Video-Scroll & Diagnóstico CDN de Frames en Superadmin ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - Auto-detección de plantillas con video-scroll en la carga de archivos HTML y prospectos existentes.
  - Panel dinámico con diagnóstico en tiempo real contra Cloudflare R2 (`200 OK`), botón para copiar comando `npm run upload:frames <slug>` y enlace al bucket.
  - Preset de 1-clic `🎬 Cargar: Sanus Spa (Video-Scroll)` y badge `🎬 Video Scroll HD` en la tabla de prospectos.

- [x] **Integración de Cloudflare R2 y Automatización de Subida de Fotogramas (`uploadFramesToR2.mjs`)**:
  - Script CLI `npm run upload:frames <slug> [carpeta_origen]` para subir lotes de frames WebP directamente a Cloudflare R2 con 8 workers concurrentes y headers de caché inmutables (`max-age=31536000`).
  - Egress ilimitado a $0, permitiendo crear 10 negocios diarios (300/mes) sin sobrepasar límites ni saturar Git/Netlify.
  - Inyector no invasivo (`prospectHtmlInjector.ts`) con resolución transparente a `VITE_R2_CDN_URL` y fallback a `/frames/:slug`.

- [x] **Soporte de Inyección SaaS para Plantillas con Canvas Video Scroll Scrubbing (Frames WebP en Header) ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`sanusSpaSiteData.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/sanusSpaSiteData.ts), [`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx))**:
  - `overflow-x: clip` en el reset inyectado para evitar anular `position: sticky` en el canvas en navegadores modernos.
  - Reescritura dinámica de rutas de fotogramas a `/frames/:slug/desktop` y `/frames/:slug/mobile`.
  - Mapeo de botones de reserva ("Agendar", "Reservar") a `/reservar/:slug` respetando anclas internas (`#servicios`).
  - Fotogramas WebP alojados en `public/frames/sanus-spa/` y registro estático de Sanus Spa para pruebas instantáneas.

- [x] **Corrección de TypeError: `r.toLowerCase is not a function` en Agendador ([`BookingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/BookingPage.tsx), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx), [`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx))**:
  - `getSalonScheduleForDate` ahora soporta objetos JSON de horarios de atención (ej. `{"lunes_a_sabado": "8:00 AM - 7:00 PM"}`) transformándolos a cadenas formateadas legibles.
  - Se eliminó el error de ejecución en `useMemo` al cargar la página de agendamiento y los 14 días disponibles.
  - Blindaje con `String(...)` y comprobación de tipo `string` en filtros de servicios, categorías y CRM.

- [x] **Resolución de Error 400 / 409 en Inserción de Tenants y Servicios ([`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts), [`add_owner_email_to_tenants.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/add_owner_email_to_tenants.sql))**:
  - Eliminado el fallo en cascada donde la falta de `owner_email` en la tabla `tenants` impedía crear el salón y generaba violaciones de clave foránea 409 en `stylists` y `services`.
  - Implementado mecanismo de reintento automático sin `owner_email` y fallback a esquema base para garantizar que el tenant siempre quede creado en la base de datos.
  - Reordenada la consulta en `getTenantByOwnerEmail` para buscar primero en `stylists.email` evitando respuestas 400 en consola.
  - Generado script de migración SQL para añadir formalmente la columna `owner_email` a `tenants` y `prospect_sites` con `NOTIFY pgrst, 'reload schema'`.

- [x] **Eliminación de Pills/Badges Secundarias en Tarjetas de Servicios ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Eliminadas las pastillas intermedias de técnicas/ingredientes (*"Caída Natural & Lavado Botánico"*, *"Mantecas Naturales & Vapor"*, etc.) para lograr una presentación más limpia, espaciosa y minimalista de cada tarjeta de servicio (Foto, Título, Duración, Precio y Botón Agendar).

- [x] **Mimetización Visual de Botón "Ver Todos los Servicios" ([`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts))**:
  - Sustituido el fondo fucsia genérico por el gradiente dorado de lujo (`linear-gradient(135deg, #e5a95d 0%, #c48b47 100%)`) con texto obsidiana `#0d0d11`, tipografía heredada del proyecto en mayúsculas (`font-family: inherit; font-weight: 800; text-transform: uppercase`) y sombra dorada sutil.
  - Integradas las clases nativas `.btn-card` y `.btn-primary` junto con un icono SVG de flecha integrado.

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
  - Anclaje de alto valor ($680.000 COP regular ➔ $89.000 COP activación única por Nequi/Daviplata con 1 año de hosting incluido + 30 días de Crecimiento + afiches QR).

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
