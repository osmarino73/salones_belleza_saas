# Decision Log (ADRs) - BeautyFlow AI

## [ADR-001] Adopción de Supabase (PostgreSQL) como Base de Datos Core
- **Fecha**: 2026-08-15
- **Estado**: Aprobado e Implementado
- **Contexto**: Se requería una base de datos relacional robusta con soporte para relaciones multi-tenant, triggers automáticos para liquidación de comisiones y APIs REST/GraphQL automáticas.
- **Decisión**: Usar Supabase PostgreSQL con el schema maestro definido en `schema.sql`.

## [ADR-002] Enfoque de UI Dual: React SPA + HTML Standalone
- **Fecha**: 2026-08-15
- **Estado**: Aprobado e Implementado
- **Contexto**: El cliente y los agentes necesitan una SPA moderna con React/Vite para desarrollo continuo, pero también archivos HTML 100% autónomos para previews instantáneos sin servidor.
- **Decisión**: Mantener `src/` como fuente principal y un script `build_standalone.js` con ESM para empaquetado autónomo.

## [ADR-003] Agente de IA para WhatsApp vía Webhooks n8n
- **Fecha**: 2026-08-16
- **Estado**: Diseñado en `AUTOMATIZACIONES_WHATSAPP.md`
- **Contexto**: La atención por WhatsApp debe consultar disponibilidad en Supabase, registrar citas y evitar conflictos de horarios en lenguaje natural.
- **Decisión**: Usar n8n como orquestador conectando Meta Cloud API con un agente de OpenAI que ejecuta herramientas/SQL sobre Supabase.

## [ADR-004] Sistema de Memoria Persistente Engram
- **Fecha**: 2026-08-16
- **Estado**: Implementado
- **Contexto**: Preservar el contexto de diseño, arquitectura y progreso entre diferentes turnos, modelos y sesiones sin perder continuidad.
- **Decisión**: Crear la skill `.agents/skills/engram-memory` y el banco de memoria centralizado en `memory/`.

## [ADR-005] Integración de Zernio API con Servidor Propio n8n (WhatsApp + Email)
- **Fecha**: 2026-08-16
- **Estado**: Aprobado e Implementado
- **Contexto**: Se evaluó Zernio API (`docs.zernio.com`) como Gateway unificado para WhatsApp e Instagram. Dado que el usuario ya cuenta con servidor n8n propio y requiere envíos multicanal (WhatsApp + Emails con Resend/SMTP).
- **Decisión**: Utilizar n8n en el servidor del usuario como orquestador central, conectado a los webhooks de Zernio, el motor OpenAI GPT-4o-mini con Function Calling, y Supabase como base de datos de estado. Se crearon los flujos JSON listos para importar en `n8n_workflows/`.

## [ADR-006] Preservación Estética Absoluta del HTML Base (Zero CSS & Hierarchy Overrides)
- **Fecha**: 2026-08-25
- **Estado**: Aprobado e Implementado
- **Contexto**: Las plantillas HTML base de los negocios ya vienen con diseño estético y responsive revisado. Cualquier alteración de CSS o inyección de subtítulos/clases artificiales (ej. en la sección de servicios) rompería la armonía original.
- **Decisión**: Blindar en la skill `landing-html-injector` y en las reglas de desarrollo que el HTML base se mantiene 100% intacto en diseño, clases CSS y jerarquía visual. La integración SaaS opera únicamente a nivel funcional (enlaces `/reservar/:slug`, canal WhatsApp y sincronización con Supabase).

## [ADR-007] Modelo de Acceso para Colaboradores Multi-Sede (Múltiples Correos Independientes)
- **Fecha**: 2026-08-26
- **Estado**: Aprobado e Implementado
- **Contexto**: Un colaborador (barbero, estilista, etc.) puede trabajar en diferentes salones/sedes (ej. Lunes a Miércoles en un negocio y Jueves a Sábado en otro). Se evaluó cuenta unificada vs. cuentas independientes.
- **Decisión**: Mantener cuentas con correos independientes por cada salón (ej. `carlos.crismar@gmail.com` y `carlos.milena@gmail.com` o alias `carlos+crismar@gmail.com`). Esto garantiza aislamiento 100% nativo por `tenant_id` en Supabase, privacidad absoluta de comisiones entre salones competidores y cero complejidad de sincronización.

## [ADR-008] Blindaje de Seguridad y Control de Acceso Estricto para el Súper Administrador
- **Fecha**: 2026-08-27
- **Estado**: Aprobado e Implementado
- **Contexto**: La consola de súper administración (`/superadmin`) gestiona la creación de prospectos, activación de tenants y estadísticas globales de Kowy. Se requería evitar accesos directos por URL o desde cuentas de dueñas de salón/estilistas sin privilegios.
- **Decisión**: Implementar el componente envoltorio `SuperadminGuard` en `App.tsx`, validar credenciales obligatorias en Supabase Auth al iniciar sesión en `LoginPage`, bloquear accesos no autorizados con una pantalla de seguridad 403 y restringir la administración central a la lista blanca oficial (`osmarino73@yahoo.es` y rol `superadmin`).

