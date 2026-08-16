# AGENTS.md - Contexto y Reglas de Desarrollo para BeautyFlow AI

¡Bienvenido, agente de IA! Este proyecto contiene la Landing Page de captura B2B y la plataforma SaaS **BeautyFlow AI** para Salones de Belleza, Barberías y Spas.

## 📌 Reglas de Código & Estructura
1. **Arquitectura React SPA**: Toda funcionalidad y vista se desarrolla en `src/` utilizando React 18, TypeScript, Tailwind CSS, Lucide Icons y Supabase Client.
2. **Estilo B2B de Alto Nivel**: Utiliza el sistema de diseño de `FICHA_DISENO.md` (Dark Mode Glassmorphism con Rose Gold + Cyan Neon).
3. **Fuente Única de Verdad**: Los textos y datos comerciales se leen desde `DATOS_NEGOCIO.json` y `src/types/`.
4. **Diseño Responsivo**: Toda nueva sección debe ser 100% responsiva (móvil primero, probado en pantallas de 360px hasta 4K).
5. **Protocolo de Memoria Engram (`memory/`)**: Antes de iniciar cualquier tarea, lee `memory/activeContext.md` y `memory/progress.md`. Al completar cambios significativos, actualiza el estado en `memory/` para preservar el contexto de desarrollo entre sesiones.

## 🚀 Comandos
- Para compilar la app React completa para producción (Netlify):
  `npm run build`
- Para iniciar el entorno de desarrollo:
  `npm run dev`
