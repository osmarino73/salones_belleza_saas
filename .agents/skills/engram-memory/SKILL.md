---
name: engram-memory
description: Sistema de memoria persistente contextual y banco de memoria (Engram) para rastrear estado activo, decisiones arquitectónicas, progreso e intenciones del proyecto a lo largo de múltiples sesiones y agentes.
---

# Engram - Protocolo de Memoria Contextual Persistente

Engram es el sistema de preservación de contexto y memoria a largo plazo del proyecto. Garantiza que ningún agente o sesión pierda el hilo conductor, las decisiones técnicas o el progreso alcanzado.

## 📂 Estructura del Banco de Memoria (`memory/`)

1. **`memory/activeContext.md`**:
   - Foco actual del desarrollo.
   - Últimos cambios realizados y en qué punto nos quedamos.
   - Siguientes pasos inmediatos.

2. **`memory/progress.md`**:
   - Lo que ya está funcionando al 100%.
   - Lo que está en progreso.
   - Lo que falta por construir.
   - Estado de salud del proyecto (builds, tests, migraciones).

3. **`memory/decisionLog.md`**:
   - Registro de decisiones arquitectónicas y técnicas clave (ADRs).
   - Justificación de por qué se eligieron ciertas tecnologías o enfoques.

4. **`memory/productContext.md`**:
   - Por qué existe el proyecto y a quién resuelve problemas.
   - Flujos de usuario clave y experiencia esperada.

5. **`memory/systemPatterns.md`**:
   - Arquitectura del sistema y patrones de diseño utilizados.
   - Estructura de carpetas, reglas de componentes y convenciones.

---

## 🔄 Reglas de Operación para Agentes

1. **Al iniciar una nueva tarea**:
   - Leer `memory/activeContext.md` y `memory/progress.md` para situarse de inmediato sin necesidad de hacer preguntas redundantes.

2. **Al completar una funcionalidad o hito importante**:
   - Actualizar `memory/activeContext.md` con el nuevo estado.
   - Actualizar `memory/progress.md` marcando los ítems completados.
   - Si hubo una decisión de arquitectura relevante, añadirla a `memory/decisionLog.md`.

3. **Inmutabilidad y Coherencia**:
   - No borrar el historial previo; reflejar la evolución continua del proyecto.
