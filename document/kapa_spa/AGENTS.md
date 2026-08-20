# 🤖 Guía de Contexto e Instrucciones para la IA — Kapa Spa

Bienvenido. Si eres un modelo de Inteligencia Artificial (Claude, ChatGPT, Gemini, Antigravity, Cursor, etc.) que está leyendo esta carpeta, este documento contiene el contexto maestro para continuar manteniendo o expandiendo el sitio web del negocio local **Kapa Spa**.

---

## 🎯 Meta del Proyecto

Desarrollar y mantener una experiencia web de alta gama, sofisticada, responsiva y enfocada en la reserva de citas y generación de leads directos a WhatsApp para el centro de bienestar y spa **Kapa Spa** ubicado en Apartadó, Antioquia, Colombia.

---

## 📁 Estructura del Proyecto

- `AGENTS.md`: Este archivo. Guía de contexto maestro para la IA.
- `FICHA_DISENO.md`: Manual del sistema de diseño (tokens de color HEX/HSL, fuentes de Google Fonts, escala tipográfica y componentes).
- `DATOS_NEGOCIO.json`: Fuente única de verdad con teléfonos, WhatsApp, mapa de Google Maps, horarios y lista de servicios oficiales.
- `index.html`: Estructura HTML5 modular principal con marcado Schema.org JSON-LD para SEO Local.
- `styles.css`: Hoja de estilos con variables CSS (`:root`) y diseño responsivo adaptativo.
- `build_standalone.js`: Script ejecutable en Node.js (`node build_standalone.js`) para empaquetar los cambios de `index.html` y `styles.css` en la versión autónoma en Base64.
- `kapa_spa_standalone.html`: Versión 100% autónoma en un solo archivo con CSS e imágenes Base64 embebidas.
- `assets/images/`: Galería de imágenes originales en alta resolución.

---

## 📐 Reglas de Desarrollo para la IA

Si el usuario te solicita crear una **nueva subpágina** (ej: `/servicios.html`, `/reserva.html`, `/contacto.html`) o **modificar la existente**:

1. **Revisar `FICHA_DISENO.md`**:
   - Usar la paleta de colores `--color-primary` (`#ec4899`), `--color-primary-light` (`#fdf2f8`), `--color-dark-bg` (`#18151e`) y la tipografía `'Playfair Display'` para títulos de lujo y `'Plus Jakarta Sans'` para párrafos y componentes UI.
2. **Consultar `DATOS_NEGOCIO.json`**:
   - Usar los datos oficiales: Teléfono `(+57) 324 451 9640`, WhatsApp `+573244519640`, Dirección `Cra. 92 #97-10, Apartadó, Antioquia` y enlace a Google Maps oficial.
3. **Mantener la Estructura Semántica**:
   - Conservar la barra superior de información (`.top-bar`), la barra de navegación sticky (`.main-nav`), las tarjetas de servicios con precios COP, la sección de especialistas, el formulario interactivo de reserva a WhatsApp, el pie de página (`.footer`) y el botón flotante de WhatsApp.
4. **Incluir Marcado SEO Local**:
   - Asegurar que la cabecera contenga el bloque de metadatos Schema.org JSON-LD de tipo `"DaySpa"` / `"BeautySalon"`.
5. **Generar la Versión Standalone**:
   - Tras realizar cualquier cambio en HTML o CSS, ejecuta `node build_standalone.js` para actualizar el entregable autónomo `kapa_spa_standalone.html`.
