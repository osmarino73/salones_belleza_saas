# AGENTS.md - Contexto y Reglas de Desarrollo para Kowy (kowy.app)

¡Bienvenido, agente de IA! Este proyecto contiene la Landing Page de captura B2B y la plataforma SaaS multi-tenant **Kowy** (`kowy.app`) para Salones de Belleza, Barberías, Spas y Negocios de Citas.

## 📌 Reglas de Código & Estructura
1. **Arquitectura React SPA**: Toda funcionalidad y vista se desarrolla en `src/` utilizando React 18, TypeScript, Tailwind CSS, Lucide Icons y Supabase Client.
2. **Estilo B2B de Alto Nivel**: Utiliza el sistema de diseño de `FICHA_DISENO.md` (Dark Mode Glassmorphism con Rose Gold + Cyan Neon).
3. **Fuente Única de Verdad**: Los textos y datos comerciales se leen desde `DATOS_NEGOCIO.json` y `src/types/`.
4. **Diseño Responsivo**: Toda nueva sección debe ser 100% responsiva (móvil primero, probado en pantallas de 360px hasta 4K).
5. **Protocolo de Memoria Engram (`memory/`)**: Antes de iniciar cualquier tarea, lee `memory/activeContext.md` y `memory/progress.md`. Al completar cambios significativos, actualiza el estado en `memory/` para preservar el contexto de desarrollo entre sesiones.
6. **Protocolo Obligatorio de Ingesta Web (`landing-html-injector`)**: SIEMPRE que se procese, genere o ingeste un sitio web o landing page de un salón/prospecto, se DEBE aplicar la habilidad `landing-html-injector` ([prospectHtmlInjector.ts](file:///c:/Users/Rio%20Belen/salones_belleza_saas/src/lib/prospectHtmlInjector.ts)). Todos los botones de reserva (Header, Navbar, Hero, Footer) deben conducir automáticamente al agendador interactivo SaaS (`/reservar/:slug`), dejando exclusivamente el botón flotante verde para el canal de WhatsApp. Las tarjetas de servicios en la portada web no deben mostrar precios ni botones de enlace internos. Si el negocio cuenta con más servicios registrados de los mostrados en la portada web, se debe renderizar automáticamente un botón centrado al pie (*"Ver todos los servicios"*) que enlace directamente a la página de reservas interactiva, mimetizándose al 100% con el color de acento, bordes redondeados y tipografía del botón principal del Header/Navbar sin degradados extraños.

## 🚀 Comandos
- Para compilar la app React completa para producción (Netlify):
  `npm run build`
- Para iniciar el entorno de desarrollo:
  `npm run dev`
