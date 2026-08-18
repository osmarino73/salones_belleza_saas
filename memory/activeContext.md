## 📍 Estado Actual
- **Fase del Proyecto**: Plataforma SaaS BeautyFlow AI con Módulo de Caja POS Profesional (Apertura y Cierre de Caja, Arqueo, Comisiones y Multi-pago en $ COP), Centro de Plantillas HSM/Email, Tablero Omnicanal (WhatsApp + Instagram Direct + Messenger), y Portal de Reservas.
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
