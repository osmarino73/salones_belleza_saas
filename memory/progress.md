# Progreso del Proyecto BeautyFlow AI

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

- [x] **Extractor Google Maps Prospector v2 (`document/maps-reservation-prospector-v2/`)**:
  - Selectores 2026 actualizados para extracción de nombre, categoría, rating, reseñas, teléfono, dirección y sitio web con exportación CSV.

- [x] **Compresor y Subida Profesional de Imágenes WebP (`ImageUploadField.tsx` y `imageCompressor.ts`)**:
  - Compresión HTML5 Canvas del lado del cliente (>95% de reducción, fotos de 5MB pasan a ~25KB WebP a 400x400 px).
  - Soporte híbrido: Subida a bucket de Supabase Storage (`avatars`) con fallback inteligente a DataURL WebP ultraligero.
  - 3 Modos integrados: Subida de archivos / cámara, galería de 6 avatares predeterminados y enlaces URL.
  - Script SQL de base de datos y storage: [`create_storage_avatars_bucket.sql`](file:///c:/Users/Rio%20Belen/salones_belleza_saas/create_storage_avatars_bucket.sql).

- [x] **Scroll Responsivo y Altura Máxima en Modales (`max-h-[90vh] overflow-y-auto`)**:
  - Ajuste en todos los modales del Dashboard y Portal de Colaboradores para asegurar visibilidad total y accesibilidad en cualquier resolución de pantalla.

- [x] **Despliegue Continuo (CI/CD) Netlify + GitHub**:
  - Repositorio oficial: [https://github.com/osmarino73/salones_belleza_saas](https://github.com/osmarino73/salones_belleza_saas).
  - Producción activa: [https://belleza2027.netlify.app](https://belleza2027.netlify.app).
