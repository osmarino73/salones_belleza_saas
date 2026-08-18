# 🤖 Guía de Contexto e Instrucciones para la IA — Luxus Beauty Spa

Bienvenido. Si eres un modelo de Inteligencia Artificial (Claude, ChatGPT, Gemini, Antigravity, Cursor, etc.) que está leyendo esta carpeta, este documento contiene el contexto maestro para continuar manteniendo o expandiendo el sitio web del negocio local **Luxus Beauty Spa**.

---

## 🎯 Meta del Proyecto

Desarrollar y mantener una experiencia web de alta gama, sofisticada, responsiva y enfocada en la reserva de citas para clientes de salón de belleza, estética y spa.

---

## 📁 Estructura del Proyecto

- `AGENTS.md`: Este archivo. Guía de contexto maestro para la IA.
- `FICHA_DISENO.md`: Manual del sistema de diseño (tokens de color HEX/HSL, fuentes de Google Fonts, escala tipográfica y componentes).
- `DATOS_NEGOCIO.json`: Fuente única de verdad con teléfonos, WhatsApp, mapa de Google Maps, horarios y lista de servicios.
- `index.html`: Estructura HTML5 principal.
- `luxus_beauty_spa_standalone.html`: Versión 100% autónoma en un solo archivo con CSS e imágenes Base64 embebidas.
- `styles.css`: Hoja de estilos con variables CSS (`:root`).
- `build_standalone.js`: Script ejecutable en Node.js (`node build_standalone.js`) para empaquetar los cambios de `index.html` y `styles.css` en la versión Standalone.
- `assets/images/`: Galería de imágenes originales.

---

## 📐 Reglas de Desarrollo para la IA

Si el usuario te solicita crear una **nueva subpágina** (ej: `/servicios.html`, `/reserva.html`, `/contacto.html`) o **modificar la existente**:

1. **Revisar `FICHA_DISENO.md`**:
   - Usar la paleta de colores `--color-pink-primary` (`#ec4899`), `--color-dark-bg` (`#111827`) y la tipografía `'Cormorant Garamond'` para títulos de lujo y `'Plus Jakarta Sans'` para párrafos y componentes UI.
2. **Consultar `DATOS_NEGOCIO.json`**:
   - Usar los datos oficiales de teléfono `(300) 987-6543`, enlace a WhatsApp y enlace a Google Maps (`https://share.google/yWGLacyAcBcrQ8Zy7`).
3. **Mantener la Estructura Semántica**:
   - Conservar la barra de anuncios superior (`.top-bar`), el menú navegable (`.main-header`), el pie de página (`.main-footer`) y el botón flotante de WhatsApp.
4. **Incluir Marcado SEO Local**:
   - Asegurar que la cabecera contenga el bloque de metadatos Schema.org JSON-LD de tipo `"BeautySalon"`.
5. **Generar la Versión Standalone**:
   - Tras realizar cambios en HTML o CSS, ejecuta `node build_standalone.js` para actualizar el entregable autónomo `luxus_beauty_spa_standalone.html`.
