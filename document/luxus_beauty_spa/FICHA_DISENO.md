# 🎨 Ficha de Diseño & Guía de Marca — Luxus Beauty Spa

Ficha técnica y manual del sistema de diseño para mantener la coherencia visual en todas las futuras páginas del proyecto **Luxus Beauty Spa**.

---

## 1. Identidad de Marca

- **Nombre Oficial**: Luxus Beauty Spa
- **Nicho/Rubro**: Salón de Belleza, Estilismo Capilar, Estética & Spa de Lujo
- **Eslogan**: *"Look & Siente Lo Mejor de Ti en Nuestro Spa de Lujo 🌸"*
- **Propuesta de Valor**: Experiencias de transformación capilar, balayage, faciales orgánicos y bienestar integral en un ambiente elegante de alta gama.
- **Tono de Comunicación**: Sofisticado, exclusivo, relajante, profesional y aspiracional.

---

## 2. Paleta de Colores & Tokens CSS

| Uso / Elemento | Nombre Token | Código HEX | Código HSL / RGB | Propósito Visual |
| :--- | :--- | :--- | :--- | :--- |
| **Color Acento Rosa** | `--color-pink-primary` | `#ec4899` | `hsl(330, 81%, 60%)` | Botones de reserva, enlaces activos y acentos de marca. |
| **Rosa Oscuro / Hover**| `--color-pink-dark` | `#db2777` | `hsl(336, 75%, 50%)` | Estado hover de botones y bordes destacados. |
| **Fondo Rosa Soft** | `--color-pink-light` | `#fdf2f8` | `hsl(325, 78%, 97%)` | Tarjetas de servicios, formulario y sección Sobre Nosotros. |
| **Fondo Oscuro Lujo** | `--color-dark-bg` | `#111827` | `hsl(221, 39%, 11%)` | Hero section y pie de página de alta gama. |
| **Tarjeta Oscura** | `--color-dark-card` | `#1f2937` | `hsl(215, 28%, 17%)` | Fondos secundarios oscuros. |
| **Texto Encabezados** | `--color-slate-900` | `#0f172a` | `hsl(222, 47%, 11%)` | Titulares y nombres de servicios. |
| **Texto Párrafos** | `--color-slate-600` | `#475569` | `hsl(215, 16%, 35%)` | Descripciones de servicios y detalles. |

---

## 3. Tipografía & Jerarquía Visual

- **Fuente para Encabezados de Lujo**: `'Cormorant Garamond'`, serif (Google Fonts)
  - Pesos: `600` (SemiBold), `700` (Bold), con estilos *Italic* para palabras acentuadas.
- **Fuente para Cuerpo & UI**: `'Plus Jakarta Sans'`, sans-serif (Google Fonts)
  - Pesos: `400` (Regular), `600` (SemiBold), `700` (Bold), `800` (ExtraBold)

### Escala de Tamaños
- **H1 (Hero Title)**: `3.75rem` (`60px`) | Line-height: `1.15` | Font-family: `Cormorant Garamond`
- **H2 (Section Title)**: `2.75rem` (`44px`) | Line-height: `1.2` | Font-family: `Cormorant Garamond`
- **H3 (Card Titles)**: `1.4rem` (`22px`) | Line-height: `1.3`
- **Subtítulos**: `0.75rem` (`12px`) | Uppercase | Letter-spacing: `2px` | Weight: `800`

---

## 4. Componentes UI & Elementos de Conversión

1. **Hero de Alta Gama**:
   - Fondo oscuro `#111827` con titular en serif elegante e imagen principal en marco redondeado con borde sutil translúcido `border: 1px solid rgba(255, 255, 255, 0.1)`.
2. **Tarjetas de Servicios Pastel Soft**:
   - Fondo `#fdf2f8` con ícono circular blanco de acento rosa y hover elevado.
3. **Sección de Especialistas (Equipo)**:
   - Tarjetas de fotógrafas/estilistas con foto portrait y botón individual de reserva de cita.
4. **Formulario de Reservas Integrado**:
   - Selector de servicios (Balayage, Corte, Facial, Maquillaje) e insumo de fecha/hora.
5. **Local SEO Integration**:
   - Marcado Schema JSON-LD `@type: "BeautySalon"`.
   - Enlace directo a Google Maps `https://share.google/yWGLacyAcBcrQ8Zy7`.

---

## 5. Guía para Futuras Páginas Secundarias

Para extender Luxus Beauty Spa (ej: `/servicios_detalle.html`, `/tratamientos_faciales.html`, `/novias.html`):
1. Usar el contraste de fondo oscuro de lujo (`#111827`) en el Hero y fondo pastel rosa (`#fdf2f8`) en el contenido.
2. Mantener la combinación tipográfica `Cormorant Garamond` para títulos y `Plus Jakarta Sans` para UI.
3. Incluir siempre el botón flotante de WhatsApp y el bloque de Schema JSON-LD de belleza.
