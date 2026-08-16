# Ficha de Diseño - BeautyFlow AI (Landing Page B2B)

## 🎨 Identidad Visual & Paleta de Colores

Para una solución SaaS dirigida a salones de belleza y spas de nivel Premium, el diseño utiliza un estilo **Dark Mode Neomórfico & Glassmorphic** con acentos **Rose Gold / Magenta Vibrante** y **Deep Indigo / Cyan Neon**, creando una estética moderna, tecnológica e impulsada por Inteligencia Artificial.

### Paleta Principal (HEX / HSL)
- **Fondo Primario (Deep Navy Dark)**: `#0B0F19` (HSL: 222°, 38%, 7%)
- **Fondo Secundario / Cards (Glass Card)**: `#131B2E` con `backdrop-filter: blur(16px)` y borde `rgba(255, 255, 255, 0.08)`
- **Acento Primario (Rose Gold & Soft Violet Gradient)**: `linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)`
- **Acento Secundario (Cyan Neon / IA Spark)**: `#06B6D4` (HSL: 188°, 94%, 43%)
- **Texto Principal**: `#F9FAFB` (Blanco puro suave)
- **Texto Secundario**: `#9CA3AF` (Gris tenue elegante)
- **Éxito / Botón de Acción**: `linear-gradient(135deg, #10B981 0%, #059669 100%)`

---

## 🔤 Tipografía & Jerarquía

- **Fuente Primaria (Títulos y Botones)**: `Plus Jakarta Sans`, sans-serif (Google Fonts)
- **Fuente Secundaria (Cuerpo y Metadatos)**: `Inter`, sans-serif
- **Escala Tipográfica**:
  - `H1 (Hero Principal)`: `3.2rem` (Móvil: `2.2rem`), Weight 800, Gradient Text effect
  - `H2 (Títulos de Sección)`: `2.4rem` (Móvil: `1.8rem`), Weight 700
  - `H3 (Títulos de Tarjetas)`: `1.25rem`, Weight 600
  - `BodyText`: `1rem`, Weight 400, Line-height 1.6

---

## 📐 Componentes UI & Micro-Animaciones

1. **Hero Glow Effect**: Esfera de luz flotante en el fondo (`filter: blur(120px)`) que da vida a la cabecera.
2. **Badge de IA Animado**: Píldora reflectante con icono de destello (*sparkles*) que resalta la propuesta de valor.
3. **Simulador de WhatsApp Interactivo (Phone Mockup)**: Mockup de smartphone donde se anima una conversación en tiempo real entre un cliente y el Agente de IA reservando una cita.
4. **Calculadora Interactiva de ROI**: Deslizador (Range Slider) donde el dueño del salón ajusta sus citas perdidas semanales y calcula su pérdida estimada de dinero.
5. **Tarjetas de Precios con Glassmorphism**: La tarjeta del plan destacado ("Plan PRO IA") cuenta con un borde brillante en gradiente animado y una cinta de "MÁS POPULAR".
6. **Botonería de Conversión en Flotante**: Botón fijo inferior para WhatsApp y CTA superior sticky.
