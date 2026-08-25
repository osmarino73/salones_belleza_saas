# AGENTS.md - Contexto y Reglas de Desarrollo para Kowy (kowy.app)

¡Bienvenido, agente de IA! Este proyecto contiene la Landing Page de captura B2B y la plataforma SaaS multi-tenant **Kowy** (`kowy.app`) para Salones de Belleza, Barberías, Spas y Negocios de Citas.

## 📌 Reglas de Código & Estructura
1. **Arquitectura React SPA**: Toda funcionalidad y vista se desarrolla en `src/` utilizando React 18, TypeScript, Tailwind CSS, Lucide Icons y Supabase Client.
2. **Estilo B2B de Alto Nivel**: Utiliza el sistema de diseño de `FICHA_DISENO.md` (Dark Mode Glassmorphism con Rose Gold + Cyan Neon).
3. **Fuente Única de Verdad**: Los textos y datos comerciales se leen desde `DATOS_NEGOCIO.json` y `src/types/`.
4. **Diseño Responsivo**: Toda nueva sección debe ser 100% responsiva (móvil primero, probado en pantallas de 360px hasta 4K).
5. **Protocolo de Memoria Engram (`memory/`)**: Antes de iniciar cualquier tarea, lee `memory/activeContext.md` y `memory/progress.md`. Al completar cambios significativos, actualiza el estado en `memory/` para preservar el contexto de desarrollo entre sesiones.
6. **Protocolo de Integración SaaS No Invasivo (`landing-html-injector`)**: Los templates base ya son Mobile-First nativos. Al procesar o generar landing pages de negocios, se DEBE aplicar la habilidad `landing-html-injector` ([prospectHtmlInjector.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts)) de forma no invasiva:
   - **Respeto a la Estética Nativa**: Preservar el 100% de los colores, tarjetas, tipografías y estructura del template base sin inyectar overrides forzados de CSS.
   - **Agendamiento SaaS**: Todos los botones de reserva (Header, Navbar, Hero, Cards, Footer) deben conducir automáticamente al agendador interactivo SaaS (`/reservar/:slug`).
   - **WhatsApp Oficial**: El botón flotante verde queda reservado exclusivamente para el canal de WhatsApp (`https://wa.me/:telefono`).
   - **Sincronización con Supabase**: Inyectar servicios y especialistas reales del tenant en la estructura nativa existente.
   - **Catálogo Extendido**: Si el negocio tiene más servicios registrados que los de portada, renderizar automáticamente el botón centrado *"Ver todos los servicios"* mimetizado con la identidad del negocio.

## 🚀 Comandos
- Para compilar la app React completa para producción (Netlify):
  `npm run build`
- Para iniciar el entorno de desarrollo:
  `npm run dev`
