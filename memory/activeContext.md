## 📍 Estado Actual
- **Fase del Proyecto**: Plataforma SaaS BeautyFlow AI con Activación de Tenants B2B desde Superadmin (Solicitud de Email & Entrega de Credenciales por WhatsApp), Landing Pages Puras sin Barras Superpuestas, Local Homepage Studio, Módulo de Caja POS Profesional, Centro de Plantillas HSM/Email, Tablero Omnicanal y Biblioteca Multimedia CDN WebP.
- **URL de Producción en Vivo**: **[https://belleza2027.netlify.app](https://belleza2027.netlify.app)**
- **Portal de Reservas Público**: **[https://belleza2027.netlify.app/reservas](https://belleza2027.netlify.app/reservas)**
- **Repositorio Oficial GitHub**: [https://github.com/osmarino73/salones_belleza_saas](https://github.com/osmarino73/salones_belleza_saas)

## 🎯 Foco para la Próxima Sesión & Roadmap Futuro
1. **Flujo de Webhooks n8n & Supabase**:
   - Conectar los webhooks en n8n para consultar las reglas de `tenant_dispatch_rules` y despachar WhatsApp HSM / Emails automáticos.
2. **Módulo de Fidelización & Campañas IA**:
   - Mensajes automáticos a clientas inactivas (+35 días sin visita).
3. **Vertical Dental / Salud (`DentalFlow AI`)**:
   - Posible clonación y adaptación del SaaS hacia clínicas dentales, nutricionistas y consultorios médicos.

## 📌 Decisiones & Ajustes Recientes
- **Estandarización de Hero Fullwidth & Renderizado Móvil de Alto Impacto ([`SKILL.md`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/.agents/skills/landing-html-injector/SKILL.md), [`prospectHtmlInjector.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - **Estructura Universal de Hero**: Soporte para la clase `<div class="hero-bg-cover"><img class="hero-bg-img" src="..." /><div class="hero-bg-overlay"></div></div>` que ocupa el 70% derecho en escritorio con degradado suave.
  - **Opción A en Móviles (Tarjeta Visual Radiante al 100%)**: En celulares (`@media (max-width: 768px)`), el inyector extrae la fotografía del fondo tenue y la presenta como una tarjeta visual elegante (`border-radius: 24px`, sombra suave de elevación, brillo y saturación al 100%) justo debajo de los botones de agendamiento para máxima claridad y estética de lujo.
  - **Carga 3-Clic en Superadmin**: Panel de ingesta con 3 botones claros (`1. DATOS_NEGOCIO.json`, `2. Sitio Web (.html)`, `3. Foto Hero Opcional (.webp, .jpg, .png)`). El sistema optimiza y persiste la imagen directamente en Supabase sin dependencias de rutas locales.
  - **Aislamiento Estético Puro**: Preserva al 100% la paleta original maquetada por la IA/diseñador, respetando el catálogo y colaboradoras demostrativas en sitios no reclamados y sincronizando en vivo cuando el salón se activa.
- **Módulo de Gestión de Categorías Dinámicas & Servicios con Fotografías de Referencia ([`create_service_categories_table.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_service_categories_table.sql), [`ServiceImagePicker.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/ServiceImagePicker.tsx), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx))**:
  - **Categorías CRUD**: Pestaña dedicada en *"Equipo, Servicios & Stock"* para Crear, Editar y Eliminar categorías de servicios con iconos/emojis y slugs personalizados. Sincronizadas en la tabla `service_categories` de Supabase con RLS habilitado.
  - **Banco de Imágenes & Subida Propia de Servicios**: Cada tratamiento cuenta con `ServiceImagePicker`, permitiendo seleccionar fotos WebP curadas del Stock CDN o cargar imágenes locales comprimidas en WebP.
  - **Especialidades & WhatsApp `+57`**: Selector toggle multiselección de categorías para colaboradoras y prefijo `🇨🇴 +57` con input de 10 dígitos.
- **Onboarding de Bienvenida para Nuevos Negocios & Activación Virgen ([`SalonOnboardingModal.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/SalonOnboardingModal.tsx), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx), [`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts))**:
  - **Cuentas Vírgenes**: Al activar un negocio desde el Superadmin (`activateProspectAsTenant`), ya no se migran servicios ni colaboradoras ficticias. El negocio inicia en estado 100% virgen (con $0 facturación, 0 citas ficticias y solo el perfil administrativo de la dueña).
  - **Onboarding Wizard en 4 Pasos**: Se diseñó un asistente interactivo que se despliega automáticamente para nuevas cuentas:
    1. **Paso 1 (Tu Salón)**: Confirmación de Nombre, WhatsApp, Ciudad, Horarios y Moneda principal (COP, USD, MXN, EUR).
    2. **Paso 2 (Servicios)**: Creación de catálogo inicial con nombre, categoría, duración y precios reales.
    3. **Paso 3 (Equipo)**: Registro de colaboradoras/especialistas con % de comisión de servicios y ventas de producto.
    4. **Paso 4 (WhatsApp IA - 100% Opcional)**: Presentación del asistente virtual con opción de vincular número o botón directo de **"Omitir este paso y finalizar"**.
  - **Persistencia & Recarga**: Al completar u omitir, el dashboard recarga en tiempo real los servicios y colaboradoras creadas sin requerir recargar la página.
- **Flujo de Activación de Tenants B2B & Solicitud de Correo ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`supabase.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts))**:
  - **Eliminación de barras superpuestas**: Se eliminó el banner de reclamo de 14 días y los botones flotantes de `/sitio/:slug` para mantener la estética 100% pura y original del diseño.
  - **Inyección no intrusiva de enlaces**: Se creó la skill `landing-html-injector` y el util `prospectHtmlInjector.ts` para conectar los botones nativos del HTML a `/reservar/:slug` y los botones de WhatsApp nativos con el número internacional del negocio.
  - **Pitch de Prospección con Solicitud de Correo**: El mensaje inicial de WhatsApp solicita a la dueña su email para entregarle su acceso de administración.
  - **Modal de Activación en Superadmin**: Botón `🔑 Activar Acceso` en cada prospecto. Permite ingresar el correo de la dueña, define una contraseña temporal (ej. `Kapa2026*`), moneda (COP) y días de prueba (14 días).
  - **Migración Automática**: Al activar, se crea el usuario en `auth.users`, el negocio en `public.tenants`, los 4 servicios en `public.services`, las 3 especialistas en `public.stylists`, el perfil de la dueña administradora y marca el prospecto como `status: 'reclamado'`.
  - **Entrega de Credenciales en 1 Clic**: Genera el mensaje de bienvenida formateado con URL de login, usuario, contraseña temporal y enlaces oficiales listo para enviar por WhatsApp a la dueña.
- **Extractor Google Maps Prospector AI v2.0 con Exportador de `DATOS_NEGOCIO.json` ([`document/maps-reservation-prospector-v2/`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/document/maps-reservation-prospector-v2/))**:
  - **Capacidades Implementadas**:
    1. **Extracción y Normalización Integral de Metadatos**: Captura nombre, calificación, total de opiniones, rubro/categoría normalizada (`salon`, `barberia`, `spa`, `nails`, `cejas_pestanas`, `estetica`, `dental`), dirección, ciudad detectada, teléfono con formato internacional `+57...` y enlace directo de Google Maps (`google_maps_url`).
    2. **Generación Automática de `DATOS_NEGOCIO.json`**: Crea al vuelo el JSON estructurado completo con eslogan persuasivo de alta gama, catálogo de 4 servicios especializados con precios en $ COP y duración, y equipo de especialistas con roles y áreas de especialidad.
    3. **Botones de Acción en 1-Clic en Google Maps**: En cada tarjeta del panel flotante y del popup de la extensión se añadieron botones para `📋 Copiar JSON`, `📥 Descargar JSON` y `📦 Exportar Bundle JSON (Todos)`.
    4. **Integración Directa con Homepage Studio**: El archivo `DATOS_NEGOCIO.json` extraído es 100% compatible para autocompletar en 1 segundo el **Local Homepage Studio** (`HomepageStudioModal.tsx`) y el **Superadmin Lead Hub** (`SuperadminDashboardPage.tsx`).
- **Local Homepage Studio (Estudio Integral de Diseño Web B2B) ([`HomepageStudioModal.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/HomepageStudio/HomepageStudioModal.tsx), [`homepageStudioEngine.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/homepageStudioEngine.ts))**:
  - **Solución implementada**:
    1. **Subida de Imagen de Referencia**: Permite cargar una captura de pantalla de cualquier página web como modelo de diseño visual.
    2. **Extracción & Presets de Paleta de Colores**: Presets de lujo (`Rose Gold Luxury`, `Dark Gold Obsidian`, `Botanical Sage`, `Pastel Pink`, `Cyber Neon`, `Minimalist Clean`) y selectores interactivos de color primario y fondo.
    3. **Integración con Google Maps & `DATOS_NEGOCIO.json`**: Autocompletado de dirección, horario, enlace Maps, servicios con precios COP y equipo de especialistas con fotos.
    4. **Biblioteca Multimedia & Subida Personalizada**: Selector visual de imágenes CDN WebP de alta velocidad para Hero, Servicios y Especialistas con soporte para añadir nuevas fotos por URL o archivo local.
    5. **Live Preview Split-Screen**: Visualización en vivo en tiempo real con conmutador Móvil (375px) y Desktop (100%).
    6. **Publicación en 1-Clic**: Genera `/sitio/:slug`, inyecta el agendador (`/reservar/:slug`), el reclamo (`/onboarding?reclamar=:slug`) y el pitch de WhatsApp listo para prospectar.
- **Biblioteca de Imágenes de Muestra Stock CDN WebP & Optimizador anti-Base64 ([`beautyImageLibrary.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts), [`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx))**:
  - **Problema resuelto**: Al incrustar imágenes en Base64 dentro del HTML generado, cada sitio pesaba más de 5 MB, provocando lentitud de carga, saturación de la cuota de `localStorage` (`QuotaExceededError`) y lentitud en base de datos.
  - **Solución implementada**:
    1. **Biblioteca CDN Curada WebP**: Catálogo estructurado de imágenes de alta resolución (Hero de Salón, Spa, Barbería, Nails, Colorimetría, Balayage, Cortes, Keratinas, Limpieza Facial, Maquillaje y Avatares de Especialistas).
    2. **Optimizador Automático (`optimizeProspectHtml`)**: Reemplaza al vuelo cualquier cadena Base64 pesada o rutas locales rotas por URLs optimizadas CDN. Reducción de peso de **5.000 KB (5 MB) a solo ~12 KB - 39 KB (99.2% de reducción)**.
    3. **Modal de Galería Stock en Superadmin**: Selector visual interactivo con pestañas por categoría y botón de 1-clic para copiar enlaces CDN de muestra.
- **Procesamiento de Carpetas Externas y Solución Anti-Base64 (Opción A Probada con Éxito en `kapa_spa`)**:
  - **Problema resuelto**: Al exportar negocios desde el generador externo (`document/kapa_spa`), el script `build_standalone.js` convertía las imágenes locales en Base64 crudo dentro del HTML, inflando el archivo a **11.4 MB (11.414.045 bytes)**, lo que provocaba bloqueos de `localStorage` (`QuotaExceededError`) y colapso de rendimiento.
  - **Solución implementada (Opción A)**:
    1. Se actualizó el **Optimizador Semántico WebP CDN** en [`scripts/import_prospect_folder.js`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/scripts/import_prospect_folder.js) y en [`beautyImageLibrary.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/beautyImageLibrary.ts).
    2. El optimizador reconoce las rutas de archivos de la carpeta (`service_facial.jpg`, `about_massage.jpg`, `service_jacuzzi.jpg`, `specialist_elena.jpg`, `specialist_valeria.jpg`, `specialist_camila.jpg`, `hero_spa.jpg`) y las mapea al vuelo a fotografías WebP CDN de alta definición.
    3. **Resultado cuantitativo**: El tamaño del HTML de *Kapa Spa* se redujo de **11.4 MB (11.400 KB) a solo 63.6 KB (99.4% de reducción)**.
    4. **Publicación y agendamiento listos**:
       - URL del sitio público: `/sitio/kapa-spa`
       - Portal de agendamiento dinámico: `/reservar/kapa-spa` (con los 4 servicios de spa y 3 terapeutas)
       - Pitch de WhatsApp listo para prospección: `+573244519640`.
    2. **Portal de Reservas Dinámico ([`BookingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/BookingPage.tsx))**:
       - Al entrar a `/reservar/:slug`, si el slug pertenece a un sitio prospecto, carga automáticamente los servicios y especialistas reales del JSON (`negocio.servicios` y `negocio.especialistas`).
       - En la pantalla de éxito, incluye botón directo de confirmación hacia el WhatsApp del negocio.
    3. **Onboarding con Reclamo Automático ([`OnboardingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/OnboardingPage.tsx))**:
       - Al entrar con `/onboarding?reclamar=:slug`, precarga identidad, servicios reales y especialistas del negocio, muestra banner de 14 días gratis y al registrarse la dueña marca el prospecto como `status: 'reclamado'`.
    4. **Script CLI de Ingesta ([`scripts/import_prospect_folder.js`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/scripts/import_prospect_folder.js))**:
       - Script Node.js ejecutable (`node scripts/import_prospect_folder.js document/luxus_beauty_spa` o `--all`) que compila el HTML standalone con Base64 y procesa el JSON.
    5. **Tipos y Base de Datos ([`types/index.ts`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/types/index.ts), [`create_prospect_sites_table.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_prospect_sites_table.sql))**:
       - Soporte para `business_data JSONB` en `prospect_sites`.
- **Dashboard de Superadmin & Lead Engine Studio ([`SuperadminDashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/SuperadminDashboardPage.tsx), [`PublicProspectSitePage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/PublicProspectSitePage.tsx))**:
  - **Módulo de Prospección de Alto Impacto (Lead Magnet)**:
    1. **Creador de Sitios Gancho**: Permite al dueño del SaaS pegar el código HTML generado por su herramienta externa, asociarlo a Google Maps (o formulario manual), e inyectarle automáticamente el botón de reservas online (`/reservar/:slug`), el banner para activar 14 días gratis (`/onboarding?reclamar=:slug`) y el Schema SEO Local (`LocalBusiness`).
    2. **Generador de Pitch de WhatsApp en 1-Click**: Crea un mensaje persuasivo personalizado listo para enviar a la dueña por WhatsApp Web con el enlace público a su web de regalo.
    3. **Embudo de Prospectos**: Rastrear visitas web en vivo y cambiar el estado del prospecto (`Prospecto`, `Contactado`, `Reclamó 14 Días`, `Cliente de Pago`).
    4. **Gestión Global de Tenants SaaS**: Control de todos los salones registrados, días restantes de prueba gratis, facturación mensual recurrente (MRR) y acceso directo como soporte.
- **Corrección de Contraste y Scroll en Modal de Cobro POS ([`PosCashRegisterPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/components/PosCashRegisterPage.tsx))**:
  - **Problema corregido**: 
    1. En modo claro, el monto total (`$58.000 COP`) se veía blanco sobre fondo blanco (completamente invisible).
    2. El modal excedía la altura de pantalla en laptops y cortaba el botón de acción inferior.
  - **Solución implementada**:
    1. Se rediseñó la tarjeta hero con fondo oscuro contrastante `bg-gradient-to-br from-slate-900 via-[#161c2d] to-[#0f1422]` y texto blanco brillante `$ 58.000` con insignia coral `COP`, garantizando visibilidad 100% nítida en modo claro y oscuro.
    2. Se añadió `max-h-[92vh] overflow-y-auto` y se ajustaron los contrastes de los 6 botones de medios de pago, chips rápidos de billetes y botón de cobro para encajar con fluidez en cualquier pantalla.
- **Flujo Seguro Anti-Descuadre: Completar en Sillón vs Cobro en Caja POS ([`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx), [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx))**:
  - **Problema de Seguridad Resuelto**: Se eliminó el riesgo de que el colaborador pudiera auto-marcar un turno como "Cobrado" por sí mismo.
  - **Nuevo Ciclo Operativo Blindado**:
    1. **Especialista en el Sillón**: Presiona **`"✓ Terminado / Enviar a Caja"`** -> La cita pasa a estado `'completada'` y el especialista queda libre (`disponible`) para su siguiente cita.
    2. **Visualización en Billetera Colaborador**: La comisión del servicio se muestra como **`💳 En Caja (Esperando Pago - Por Liquidar)`**, pero **NO suma al saldo cobrado disponible** hasta que recepción valide el dinero.
    3. **Administradora en Recepción / POS**: En el Dashboard de administración se destacan las órdenes listas para cobro (`💳 Por Cobrar en Caja`) con el botón directo **`"Cobrar en POS"`**.
    4. **Acreditación Simultánea**: Al registrar el pago en caja (Efectivo/Tarjeta/Transferencia) o validar prepago, la cita pasa a `'cobrada'`. En ese instante exacto se acredita la comisión a la billetera del colaborador y el dinero a la caja general.
- **Sincronización Estricta de Saldo de Comisiones (Solo Citas Cobradas)**:
  - **Regla Contable Unificada**: Una comisión se considera **saldo ganado y liquidable** ÚNICAMENTE cuando la cita tiene el estado `status: 'cobrada'` (es decir, fue pagada en el punto de venta POS o cancelada por adelantado).
  - **Comportamiento corregido**:
    1. Cuando el profesional presiona "Iniciar Atención" (`status: 'en_atencion'`), el servicio está en proceso en el sillón. Su comisión se muestra como *En sillón / En proceso*, pero **NO suma al saldo cobrado de comisiones** ni en el portal del colaborador ni en el panel del administrador.
    2. Cuando el servicio se finaliza/cobra (`status: 'cobrada'`), el saldo se acredita y sincroniza **simultáneamente y en tiempo real** tanto en la billetera del especialista como en la caja/dashboard del administrador.
- **Eliminación del Botón "Dueña" en la Barra de Navegación ([`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx))**:
  - **Problema corregido**: En la barra de navegación móvil inferior del portal de colaborador aparecía un botón llamado "Dueña" con acceso al dashboard de administración.
  - **Solución implementada**: Se eliminó dicho botón del *Bottom Navigation Bar* móvil, dejando únicamente las opciones pertinentes al colaborador (*Mi Agenda*, *Fórmulas*, *Billetera*, *Días Libres*) y asegurando que ninguna referencia de administración sea accesible para el especialista.
- **Optimización de Navegación Móvil en Portal del Colaborador ([`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx))**:
  - **Problema corregido**: En la vista móvil aparecía duplicado el menú de pestañas centrales (`Mi Agenda`, `Fórmulas`, `Mi Billetera`, `Días No Disponibles`) cuando en móviles ya existe la barra de navegación fija inferior (*Bottom Navigation Bar* tipo App móvil).
  - **Solución implementada**: Se configuró `hidden sm:flex` en el contenedor de pestañas superior para que en teléfonos móviles (< 640px) quede 100% invisible y la navegación se realice limpiamente a través del *Bottom Nav* inferior, conservando el menú superior segmentado únicamente en pantallas de escritorio y tablets.
- **Moneda Dinámica y Cálculo Real de Comisiones en Portal de Colaboradores ([`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx))**:
  - **Problema corregido**: 
    1. En el portal del especialista se mostraba un valor fijo ficticio de prueba de `$1240.00 USD` en el acumulado del mes aún cuando el profesional no había atendido ningún servicio.
    2. Las tarjetas y listas mostraban texto quemado con `USD` en vez de la moneda configurada para el negocio (`COP $`).
  - **Solución implementada**:
    1. Eliminado el valor estático `+ 1240`. Las comisiones del día y del mes ahora se calculan **100% en vivo** según los servicios efectivamente completados o cobrados por el estilista (`0 turnos = $ 0 COP`).
    2. Integrado `formatCurrency` en todas las tarjetas de métricas, tarjetas de turnos en agenda y pestaña de liquidación/billetera para respetar la moneda oficial del salón (`COP`, `MXN`, `USD`, `EUR`, etc.).
- **Aislamiento de Roles y Protección de Privacidad (Admin vs Colaborador)**:
  - **Problema corregido**: Al iniciar sesión con la cuenta de un colaborador (ej. `ommsoluciones@gmail.com`), el enrutador lo dirigía a `/dashboard` donde podía ver la facturación global, caja registradora, prompts de IA y configuraciones del administrador.
  - **Solución implementada**:
    1. **Enrutamiento Inteligente en Login ([`LoginPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/LoginPage.tsx))**: Al autenticarse, verifica en Supabase Auth y en la tabla de colaboradores si el usuario es colaborador. Si es colaborador, lo redirige automáticamente a su portal privado en `/colaborador/:id`.
    2. **Role Guard en Dashboard ([`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx))**: Si un colaborador intenta entrar directamente a `/dashboard`, el sistema detecta su rol y lo redirige de inmediato a su propio portal.
    3. **Aislamiento en Portal del Especialista ([`StylistPortalPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/StylistPortalPage.tsx))**: El colaborador únicamente tiene acceso a sus citas asignadas, sus comisiones personales ganadas, sus fichas de clientes/fórmulas y su propia disponibilidad, sin acceso a cajas POS ni configuraciones del salón.
- **Registro Automático de Colaboradores en Supabase Auth (`auth.users`)**:
  - **Problema corregido**: Al crear un nuevo colaborador desde el Dashboard con correo (ej. `ommsoluciones@gmail.com`) y contraseña provisoria, únicamente se guardaba en la tabla de base de datos `public.stylists`, pero no se registraba en el panel de **Authentication (`auth.users`)** de Supabase.
  - **Solución implementada**: Se integró `api.auth.signUp` dentro de [`api.createStylist`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts) y [`api.updateStylist`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts) para que cada vez que se cree un colaborador o se le asigne una contraseña, se genere de forma inmediata y automática su usuario autenticado en **Supabase Auth (`auth.users`)** con su rol y `tenant_id` en metadata.
- **Diseño de Pestañas Segmentadas en Expediente 360° (Sin Barra de Desplazamiento)**:
  - **Problema corregido**: El menú superior del modal de expediente del colaborador usaba `overflow-x-auto` con textos extensos, lo que provocaba una barra de desplazamiento horizontal antiestética.
  - **Solución implementada**: Reemplazado por un contenedor de cuadrícula segmentada responsiva de 4 columnas (`grid grid-cols-2 sm:grid-cols-4`) con etiquetas concisas (*Citas*, *Comisiones*, *Servicios*, *Horarios*) que ocupa exactamente el 100% del ancho sin desbordamiento ni scrollbars.
- **Expediente 360° y Dossier Financiero/Operativo por Colaborador (`isStylistDetailsModalOpen`)**:
  - **Nueva funcionalidad**: Al hacer clic sobre la tarjeta de cualquier estilista o colaboradora en la sección *Servicios & Equipo > Equipo*, se abre un modal interactivo 360° con desglose detallado de:
    1. **4 KPIs Clave en Vivo**: Facturado Total por Servicios, Comisiones Ganadas Acumuladas, Total de Citas en Agenda (atendidas vs pendientes) y Ticket Promedio por Cliente (en la moneda del salón).
    2. **Pestaña Citas & Agenda**: Historial cronológico con cliente, servicio, hora, precio, estado y cálculo exacto de comisión ganada por cada cita.
    3. **Pestaña Comisiones & Liquidación**: Resumen de porcentajes acordados (Servicios vs Retail) y acumulado pendiente por liquidar.
    4. **Pestaña Especialidades & Servicios**: Categorías habilitadas (`🎨 Color`, `✂️ Corte`, `💆‍♀️ Keratina`, `💅 Nails`, `💈 Barbería`, `🧖‍♀️ Spa`).
    5. **Pestaña Horarios & Disponibilidad**: Días de trabajo semanales, bloqueos activos y botón directo para agregar permisos o vacaciones.
- **Sincronización Bidireccional y Persistencia de Colaboradores en BD ([`api.createStylist`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts), [`api.updateStylist`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts))**:
  - **Problema corregido**: Al crear o editar un estilista/colaborador, no se persistían los datos en Supabase porque los nombres de columnas del frontend (`commission_service_pct`, `commission_retail_pct`, IDs con prefijo `sty-...`) no coincidían con el esquema PostgreSQL (`service_commission_pct`, `product_commission_pct`, `UUID`). PostgreSQL rechazaba los comandos con `column does not exist` o `invalid input syntax for type uuid`.
  - **Solución implementada**:
    1. Creado mapeador bidireccional (`mapStylistToDBPayload` y `mapStylistFromDB`) que normaliza las columnas de comisión, disponibilidad, roles (`role`, `is_owner`, `attends_clients`) y categorías JSONB.
    2. Generación automática y validación de UUIDs antes del `insert`/`update` en Supabase.
    3. Actualizado el script de migración [`add_stylist_availability_and_blocked_slots.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/add_stylist_availability_and_blocked_slots.sql) con las columnas `role`, `is_owner` y `attends_clients`.
- **Jerarquía de Rol Admin/Dueña y Capacidad Opcional de Atender Citas (`role: 'admin'`, `attends_clients: boolean`)**:
  - **Problema corregido**: Al crear un negocio desde el Onboarding, la cuenta de la dueña/administradora se registraba directamente como un colaborador ordinario sin distinguir su rol de administración general y sin permitirle decidir si quería atender citas o solo gestionar.
  - **Solución implementada**:
    1. **Rol Maestro (`role: 'admin'`, `is_owner: true`)**: La cuenta de la dueña tiene privilegios maestros protegidos (no puede ser eliminada por error y porta la insignia dorada `👑 Dueña / Admin`).
    2. **Opción de Atender Citas (`attends_clients: boolean`)**: Tanto en el Onboarding (Paso 4) como en el modal de edición de equipo en el Dashboard, la Administradora puede activar o desactivar si atiende citas con clientas y especificar su especialidad/categorías (ej. *Corte*, *Color*, *Barbería*).
    3. **Aislamiento en Portal de Reservas ([`BookingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/BookingPage.tsx))**: Si la dueña o algún miembro del equipo tiene `attends_clients: false` (modo *Solo Gestión*), el sistema lo excluye automáticamente del flujo público de agendamiento.
- **Corrección en Creación de Citas y Validación UUID (`api.createAppointment`)**:
  - **Problema corregido**: Al agendar una cita desde el portal público (`/reservas`) o crearla manualmente desde el Dashboard, el sistema enviaba IDs de texto planos (`apt-1723...`, `cli-1723...`, `sty-1`), lo cual provocaba un error de sintaxis en PostgreSQL (`invalid input syntax for type uuid`) impidiendo que la cita se insertara en la tabla `public.appointments` de Supabase.
  - **Solución implementada**:
    1. Sanitización y validación estricta de UUIDs en [`api.createAppointment`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts): genera UUIDs estándar v4 y asigna `null` a llaves foráneas opcionales si no son UUIDs válidos.
    2. Vinculación dinámica del `tenant_id`, especialista real y servicio real tanto en [`BookingPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/BookingPage.tsx) como en [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx).
    3. Persistencia reactiva en LocalStorage y Supabase sin bloqueos.
- **Sincronización Automática de Salón por Email de Usuario (`api.getTenantByUserEmail`)**:
  - **Problema corregido**: Al iniciar sesión con un correo nuevo registrado (ej. `asovid2025@gmail.com`), el dashboard seguía mostrando el salón demo inicial (*Studio Glamour Spa*) y sus servicios demo (*Balayage, Corte Bob...*) porque el LocalStorage mantenía en caché el `tenant_id` demo anterior.
  - **Solución implementada**:
    1. Creada función [`api.getTenantByUserEmail`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/supabase.ts) que busca en Supabase el negocio exacto creado por la cuenta activa.
    2. Integrado en `api.auth.signIn` y en el `loadData()` del Dashboard (`DashboardPage.tsx`) para actualizar automáticamente el salón, nombre, teléfono, moneda y **cargar exclusivamente los servicios y colaboradores reales de ese usuario**.
- **Aislamiento Estricto Multitenant en Portal de Reservas (`/reservas?salon=slug`)**:
  - **Problema corregido**: Al entrar a `/reservas`, si no se encontraba coincidencia exacta o había registros en localStorage sin `tenant_id`, se mezclaban los servicios del salón demo con el nuevo salón registrado.
  - **Solución implementada**:
    1. Búsqueda inteligente por slug en Supabase (`api.getTenantBySlug`) con fallback al salón activo en sesión.
    2. Filtrado estricto por `tenant_id` en `api.getServices(targetTenantId)` y `api.getStylists(targetTenantId)` que garantiza que **cada salón cargue exclusivamente sus servicios y colaboradores propios**.
    3. Estado vacío elegante en el Paso 1 de reservas si el negocio recién registrado aún no ha publicado servicios.
- **Corrección Integral de Moneda y Precios (`formatCurrency` y Normalización Supabase)**:
  - **Problema corregido**: En Supabase la columna es `price`, mientras que en el frontend se leía `price_usd`, provocando que en salones nuevos o registrados en COP saliera `$ undefined USD` o `$ USD` sin número.
  - **Solución implementada**:
    1. Normalización en `api.getServices()`, `createService()` y `updateService()` para mapear `price`, `price_usd` y `price_cop` de forma transparente.
    2. Función universal `formatCurrency(amount, salonCurrency)` que formatea en **COP (`$ 35.000 COP`)**, **USD (`$ 35 USD`)**, **MXN (`$ 35 MXN`)** o **EUR (`€ 35 EUR`)** según la moneda seleccionada en el Onboarding o configuración del salón.
    3. Actualizado en **Portal Público de Reservas (`BookingPage.tsx`)** y en el **Catálogo del Dashboard (`DashboardPage.tsx`)**.
- **Arquitectura de Base de Datos y Almacenamiento de Fotos (`create_storage_avatars_bucket.sql`)**:
  - **Soporte Híbrido Inteligente**:
    1. **Supabase Storage Bucket (`avatars`)**: Sube el archivo WebP optimizado al bucket con CDN público y guarda la URL HTTPS en la columna `photo_url TEXT` de `public.stylists`.
    2. **Fallback Automático DataURL WebP**: Si el bucket no está creado o no hay conexión de storage, guarda directamente el DataURL WebP (<35 KB) en la columna `photo_url TEXT` sin errores ni bloqueos.
  - Creado script SQL [`create_storage_avatars_bucket.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_storage_avatars_bucket.sql) con políticas de lectura pública y subida RLS.
- **Compresor y Subida Profesional de Imágenes (`ImageUploadField.tsx` y `imageCompressor.ts`)**:
  - Motor de compresión HTML5 Canvas del lado del cliente que procesa fotos pesadas de celulares (5MB-10MB) y las optimiza a **WebP 1:1 (~25 KB - 35 KB, reducción >95%)** sin saturar la base de datos ni el ancho de banda.
  - Interfaz con 3 modalidades:
    1. **📤 Subir / Arrastrar Archivo**: Selector de archivos o cámara con estadísticas en vivo (`Optimizado: 4.2 MB ➔ 28 KB (-96%)`).
    2. **✨ Galería Profesional**: 6 avatares predeterminados para estilistas (Colorista, Master, Barber, Nails, Keratina).
    3. **🌐 Enlace URL**: Opción para pegar links directos HTTPS.
  - Integrado en el modal de **Agregar / Editar Profesional** de [`DashboardPage.tsx`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/pages/DashboardPage.tsx).
- **Scroll Responsivo y Altura Máxima en Modales (`max-h-[90vh] overflow-y-auto`)**:
  - Se añadió `max-h-[90vh] overflow-y-auto` a todos los modales de la app (Editar/Agregar Profesional, Registrar Clienta, Ficha 360°, Disponibilidad de Estilistas, Agregar Servicio, Producto Retail, Agendar Cita y Ajustes del Negocio).
  - Los botones de acción (`Guardar`, `Cancelar`, `Listo`) y todos los campos ahora son 100% visibles y accesibles con scroll fluido en cualquier pantalla o resolución.
- **Mapeo y Filtrado de Especialistas por Servicio (`Service-to-Stylist Mapping`)**:
  - Cada especialista tiene asignadas sus categorías (`color`, `corte`, `keratina`, `nails`, `barberia`, `spa`) y servicios específicos.
  - **Portal Público de Citas (`BookingPage.tsx`)**: Al elegir un servicio en el Paso 1, el Paso 2 filtra automáticamente y muestra **únicamente los especialistas capacitados** para ese servicio con sus badges de calificación y horarios libres.
  - **Panel del Salón (`DashboardPage.tsx`)**:
    - Modal de Crear/Editar Estilista con chips interactivos de categorías autorizadas.
    - Modal de Agendar Nueva Cita Manual filtra dinámicamente los especialistas al cambiar el servicio seleccionado.
    - Tarjetas de equipo muestran los chips de especialidad (`🎨 Color`, `✂️ Corte`, `💅 Nails`, etc.).
- **Nuevo Selector de Hora Interactivo (`TimePickerSelect.tsx`)**:
  - Reemplaza inputs manuales de texto por un selector moderno con presets inteligentes (`08:00 AM`, `09:30 AM`, `11:00 AM`, `02:00 PM`, `05:00 PM`, etc.).
  - Incluye cuadrícula desplazable de intervalos de 15 minutos (de 07:00 AM a 09:45 PM).
  - Diales de precisión con dropdowns de hora (`01` a `12`), minutos (`:00`, `:15`, `:30`, `:45`) y selector `AM/PM`.
  - Integrado en el **Portal de Colaborador** (bloqueo de horas) y en el **Panel Principal** (creación de citas manuales).
- **Gestor de Disponibilidad, Bloqueo de Días y Vacaciones por Especialista**:
  - Implementado en el **Portal de Colaborador (`StylistPortalPage.tsx`)**:
    - Pestaña `Días No Disponibles & Horarios`: selector interactivo de días laborales semanales (`Lun` a `Dom`).
    - Formulario de bloqueo de fechas o rangos (vacaciones, citas médicas, descansos, capacitaciones, asuntos personales).
    - Opción de `Día Completo` o `Rango Horario Específico`.
    - Lista en vivo de bloqueos activos con desbloqueo en 1 clic.
  - Implementado en el **Panel de la Dueña (`DashboardPage.tsx`)**:
    - Tarjetas de especialistas en `Equipo, Servicios & Stock` con badges de días laborales y días bloqueados activos.
    - Modal de gestión de disponibilidad para que la administradora también pueda bloquear o desbloquear fechas a cualquier miembro del equipo.
  - Implementado en el **Portal Público de Citas (`BookingPage.tsx`)**:
    - Validación automática de disponibilidad: si el especialista está de vacaciones o no trabaja ese día, se muestra una alerta explicativa y se deshabilitan las horas y el botón de continuar.
- **Motor de Fidelización & Reactivación IA (`LoyaltyReactivationPage.tsx`)**:
  - Ubicado en el **Menú Secundario / Perfil** para mantener la barra superior limpia y minimalista (`Overview`, `CRM Colorimetría`, `Mensajes & WhatsApp`).
  - Radar de clientas inactivas segmentado por umbrales de tiempo (`🟡 35 - 60 Días`, `🟠 60 - 90 Días`, `🔴 +90 Días Crítico`, `🎂 Cumpleañeras del Mes`, `👑 VIP en Riesgo`).
  - Cálculo en vivo del **Ingreso Potencial en Riesgo** y **Recuperación Proyectada (~38% benchmark)** en $ COP.
  - Generador de Campañas Inteligentes 1-Clic:
    - *Campaña 1*: Tratamiento Hidratante de Regalo al agendar esta semana.
    - *Campaña 2*: Renovación de Color & Retoque de Raíz (ciclo de 45 días).
    - *Campaña 3*: Pase VIP Flash con descuento personalizado.
    - *Campaña 4*: Cumpleaños del Mes con copa de cortesía + regalo sorpresa.
  - Personalizador en vivo de variables (Descuento %, Servicio de Cortesía) con Vista Previa real de WhatsApp.
  - Disparador de Campaña Masiva multicliente o envío individual directo por WhatsApp Web/Zernio.
  - Switch de **Piloto Automático Flowy IA** para contactar con tono cálido a los 35 días exactos.
- **Bandeja Omnicanal Meta Suite (`MessagesBoardPage.tsx`)**:
  - Centralización de mensajes de **WhatsApp Cloud API**, **Instagram Direct (@handles / DMs de Reels y Stories)** y **Facebook Messenger**.
  - Filtro selector de canales interactivo (`✨ Todos`, `🟢 WhatsApp`, `📸 Instagram Direct`, `💬 Messenger`) con contadores en vivo.
  - Tarjetas de conversación con avatares distintivos, badges oficiales de canal y tags de @handle o Fanpage.
  - Chat activo con cabecera adaptativa, glows neón, intervención humana por canal y cajas de texto personalizadas.
  - Ficha CRM 360° con enlaces directos para abrir chats en WhatsApp Web, Instagram Direct o Facebook Messenger.
  - Modo Simulador Sandbox con switch selector de canal para probar respuestas de Flowy IA por WhatsApp, Instagram o Messenger.
- **Módulo de Caja POS Profesional (`PosCashRegisterPage.tsx`)**:
  - Control de turnos con **Apertura de Caja** (base inicial en efectivo $ COP, responsable, notas).
  - Terminal de ventas con catálogo filtrable, asignación de estilista por ítem y cálculo automático de comisiones (% servicio / % retail).
  - **Cuadros de Diálogo de Cobro Rediseñados (Luxury Glassmorphism POS)**:
    - **Modal de Checkout**: Tarjetas interactivas con glows y paletas neón para los 6 medios de pago (Efectivo con teclado rápido de billetes colombianos `$20k`, `$50k`, `$100k`, `$200k`, `Exacto` y calculadora de vuelto; Nequi; Daviplata; Datáfono con Débito/Crédito; Transferencia bancaria; y Pago Mixto con desglose proporcional dual).
    - **Modal de Éxito & Ticket Térmico Digital**: Comprobante tipo recibo de salón con envío de 1 clic a WhatsApp para la clienta e impresión térmica.
    - **Modal de Confirmación de Liquidación de Comisiones**: Reemplazo de diálogos nativos por un modal visual con avatar del estilista, monto en verde esmeralda y paso automático a $0 COP.
    - **Modal de Cobro Extra & Movimientos de Caja**: Diseños pulidos con bordes suaves y presets rápidos.
  - **Arqueo y Cierre Oficial (Reporte Z)** con cuadre físico en vivo e impresión de comprobante fiscal.
- **Herramienta de Prospección B2B (`document/maps-reservation-prospector-v2/`)**:
  - Extensión de Chrome para prospección en Google Maps de salones, barberías, spas y clínicas odontológicas.
  - Extracción inteligente de nombre, categoría, calificación por estrellas (★), cantidad de opiniones, dirección colombiana/internacional, teléfono celular/fijo, sitio web y auditoría heurística de sistema de reservas.
  - Exportación con 1 clic a CSV estructurado para prospección y campañas de ventas B2B.
- **Flujos de Automatización n8n (`n8n_workflows/`)**:
  - `workflow_1_agente_whatsapp_zernio.json`: Agente Flowy IA con tool calling de servicios, disponibilidad y reservas.
  - `workflow_2_recordatorios_y_emails.json`: Cron schedule de recordatorios automáticos 2h/24h y confirmaciones por email HTML.
  - `workflow_3_meta_omnichannel_direct.json`: Webhook para Instagram Direct (DMs) y Facebook Messenger.
- **Moneda $ COP Unificada**: Todo el sistema opera fluidamente en Pesos Colombianos.
