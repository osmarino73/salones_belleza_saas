# 📖 Guía de Configuración: Agente de WhatsApp con Zernio & n8n

Esta guía detalla cómo importar y poner en marcha los flujos de automatización para **BeautyFlow AI** en tu servidor propio de **n8n** conectando **Zernio API**, **Supabase** y **OpenAI**.

---

## 🔑 1. Credenciales Necesarias en n8n

En tu panel de n8n (`Credentials`), asegúrate de crear las siguientes conexiones:

1. **Supabase / PostgreSQL**:
   - **Host / URL**: Tu URL de Supabase (`https://ascskenpfcnyejaamjlb.supabase.co`)
   - **Service Role Key / Anon Key**: Configurada en tu `.env`.
   - **Postgres Direct (Opcional)**: Si prefieres consultar mediante el nodo PostgreSQL directo (puerto 5432 / 6543 pooler).

2. **OpenAI**:
   - **API Key**: `sk-...`
   - **Modelo Recomendado**: `gpt-4o-mini` (rápido, económico y con excelente soporte de tool calling).

3. **Zernio API**:
   - **Header Auth**:
     - Name: `Authorization`
     - Value: `Bearer <TU_ZERNIO_API_KEY>`
   - **Endpoint Base**: `https://api.zernio.com/v1/`

4. **Servicio de Correo Electrónico (Resend / SMTP)**:
   - **Resend API Key** o **Credenciales SMTP** para el envío de confirmaciones y recordatorios con plantillas HTML.

---

## 📦 2. Flujos Disponibles en `n8n_workflows/`

### 1. `workflow_1_agente_whatsapp_zernio.json`
* **Trigger**: Webhook `POST /webhook/zernio-whatsapp`.
* **Proceso**:
  1. Recibe el mensaje entrante desde Zernio.
  2. Carga el historial de conversación desde la tabla `ai_agent_conversations` de Supabase.
  3. El Agente de IA analiza la intención y ejecuta herramientas según se requiera:
     - `consultar_disponibilidad`: Busca huecos libres por fecha y estilista.
     - `crear_cita`: Agenda la cita en la tabla `appointments` y vincula el cliente.
     - `consultar_precios_servicios`: Devuelve catálogo y tarifas.
  4. Guarda el mensaje y la respuesta en `ai_agent_conversations`.
  5. Envía la respuesta al cliente a través de la API de Zernio.

### 2. `workflow_2_recordatorios_y_emails.json`
* **Trigger**: Cron Schedule (Ejecuta cada 15 minutos) + Sub-Workflow de confirmación inmediata.
* **Proceso**:
  1. Consulta en Supabase citas confirmadas que ocurrirán en las próximas **2 horas**.
  2. Dispara mensaje de recordatorio por WhatsApp vía Zernio con botones de acción ("Confirmar Asistencia", "Reagendar").
  3. Envía el correo electrónico con diseño HTML de alta gama y enlace a Google Calendar.

---

## ⚙️ 3. Configuración del Webhook en Zernio Dashboard
1. Entra a [https://zernio.com](https://zernio.com) y accede a tu proyecto.
2. Ve a **Webhooks & Integrations** $\rightarrow$ **Add Webhook**.
3. Pega la URL de tu webhook de n8n:
   `https://tu-servidor-n8n.com/webhook/zernio-whatsapp`
4. Selecciona los eventos: `message.received`, `message.delivered`.
