## 📍 Estado Actual
- **Fase del Proyecto**: Plataforma SaaS BeautyFlow AI con Centro de Plantillas HSM/Email, Tablero de Mensajes & WhatsApp Omnicanal con Human Takeover, y Portal de Reservas Multi-Tenant.
- **URL de Producción en Vivo**: **[https://belleza2027.netlify.app](https://belleza2027.netlify.app)**
- **Portal de Reservas Público**: **[https://belleza2027.netlify.app/reservas](https://belleza2027.netlify.app/reservas)**
- **Repositorio Oficial GitHub**: [https://github.com/osmarino73/salones_belleza_saas](https://github.com/osmarino73/salones_belleza_saas)

## 🎯 Foco para la Próxima Sesión
1. **Flujo de Webhooks n8n & Supabase**:
   - Conectar los webhooks en n8n para consultar las reglas de `tenant_dispatch_rules` y despachar WhatsApp HSM / Emails automáticos.
2. **Caja POS & Cobros**:
   - Emisión de recibos digitales por WhatsApp y cálculo automático de abonos.
3. **Módulo de Fidelización & Campañas IA**:
   - Mensajes automáticos a clientas inactivas (+35 días sin visita).

## 📌 Decisiones & Ajustes Recientes
- **Tablero de Mensajes & WhatsApp Omnicanal (`MessagesBoardPage.tsx`)**: Bandeja de 3 columnas (Inbox, Chat en vivo con Human Takeover toggle, y Ficha CRM 360° con diagnóstico capilar).
- **Modo Sandbox / Simulador**: Pestaña dedicada para testear prompts y respuestas de Flowy IA de forma aislada sin enviar mensajes a clientas reales.
- **Botón Maestro de Bot IA**: Switch directo en la barra de mensajes para activar o pausar el bot para todo el salón en 1 clic.
- **Validación Estricta de WhatsApp**: Eliminación de auto-aprobaciones simuladas en plantillas; validación estricta de conexión antes de enviar a Meta Cloud API.
- **Header Overview Aislado**: El saludo de bienvenida solo se muestra en la pestaña de Inicio / Overview.
- **Migración SQL de Plantillas**: Archivo `create_templates_tables.sql` creado con tablas `tenant_whatsapp_templates`, `tenant_email_templates` y `tenant_dispatch_rules`.
