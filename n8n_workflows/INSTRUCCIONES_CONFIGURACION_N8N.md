# 📖 Guía de Configuración: Agente de IA Multicanal con n8n & Meta Suite

Esta guía detalla cómo importar y poner en marcha los flujos de automatización para **BeautyFlow AI** en tu servidor propio de **n8n** conectando **Zernio API (WhatsApp)**, **Meta Graph API (Instagram Direct & Messenger)**, **Supabase** y **OpenAI**.

---

## 🔑 1. Credenciales Necesarias en n8n

En tu panel de n8n (`Credentials`), asegúrate de tener creadas las siguientes conexiones:

1. **Supabase / PostgreSQL**:
   - **Host / URL**: Tu URL de Supabase (`https://ascskenpfcnyejaamjlb.supabase.co`)
   - **Service Role Key / Anon Key**: Configurada en tu `.env`.
   - **Headers Auth**:
     - `apikey`: `<TU_SUPABASE_ANON_KEY>`
     - `Authorization`: `Bearer <TU_SUPABASE_ANON_KEY>`

2. **OpenAI**:
   - **API Key**: `sk-...`
   - **Modelo Recomendado**: `gpt-4o-mini` (rápido, económico y con excelente tool calling).

3. **Zernio API (WhatsApp)**:
   - **Header Auth**:
     - Name: `Authorization`
     - Value: `Bearer <TU_ZERNIO_API_KEY>`
   - **Endpoint Base**: `https://api.zernio.com/v1/`

4. **Meta Graph API (Instagram & Messenger)**:
   - **Header Auth**:
     - Name: `Authorization`
     - Value: `Bearer <TU_PAGE_ACCESS_TOKEN_META>`
   - **Endpoint Base**: `https://graph.facebook.com/v19.0/`

5. **Servicio de Correo Electrónico (Resend / SMTP)**:
   - **Resend API Key** o **Credenciales SMTP** para el envío de confirmaciones y recordatorios con plantillas HTML.

---

## 📦 2. Flujos Disponibles en `n8n_workflows/`

### 1. `workflow_1_agente_whatsapp_zernio.json` *(Atención WhatsApp)*
* **Trigger**: Webhook `POST /webhook/zernio-whatsapp`.
* **Proceso**:
  1. Recibe el mensaje entrante desde Zernio.
  2. Consulta la disponibilidad y catálogo en Pesos Colombianos ($ COP).
  3. El Agente de IA `Flowy` agenda citas y responde con tono profesional y emojis elegantes.
  4. Envía la respuesta al cliente a través de la API de Zernio.

### 2. `workflow_2_recordatorios_y_emails.json` *(Disparos Automáticos)*
* **Trigger**: Cron Schedule (Ejecuta cada 15 minutos).
* **Proceso**:
  1. Consulta en Supabase citas confirmadas que ocurrirán en las próximas **2 horas** y **24 horas**.
  2. Dispara recordatorio por WhatsApp con botones rápidos (`1. Confirmar`, `2. Reagendar`).
  3. Envía email de confirmación con diseño HTML de alta gama y enlace a Google Calendar.

### 3. `workflow_3_meta_omnichannel_direct.json` *(Instagram DMs & Messenger)*
* **Trigger**: Webhook `POST /webhook/meta-omnichannel`.
* **Proceso**:
  1. Recibe mensajes directos (DMs) de Instagram o chats de la Fanpage de Facebook.
  2. Identifica si el cliente pregunta por un Reel, historia o servicio.
  3. Devuelve tarifas en COP y facilita el link del portal de reservas `https://belleza2027.netlify.app/reservas`.
  4. Responde a través de `graph.facebook.com/me/messages`.

---

## ⚙️ 3. Puesta en Marcha Rápida (Paso a Paso)

1. **Importar los Flujos en n8n**:
   - En n8n, haz clic en **`Add workflow`** $\rightarrow$ **`Import from File`** o pega el contenido JSON de `n8n_workflows/`.
2. **Asignar Credenciales**:
   - Vincula tus credenciales de OpenAI y Supabase en cada nodo.
3. **Activar los Flujos**:
   - Cambia el switch superior a **`Active`** en cada workflow.
4. **Configurar el Webhook en Zernio Dashboard**:
   - En [https://zernio.com](https://zernio.com) $\rightarrow$ **Webhooks** $\rightarrow$ Añadir URL de n8n:
     `https://tu-servidor-n8n.com/webhook/zernio-whatsapp`
5. **Configurar el Webhook en Meta Developers (Instagram / Facebook)**:
   - En Meta for Developers $\rightarrow$ Webhooks $\rightarrow$ Callback URL:
     `https://tu-servidor-n8n.com/webhook/meta-omnichannel` con campos `messages` e `instagram_messages`.
