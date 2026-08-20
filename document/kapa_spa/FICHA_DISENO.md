# 🎨 Ficha de Diseño y Manual de Marca — Kapa Spa

Manual del sistema de diseño para **Kapa Spa**, basado en la estética de alta gama *Glamour Studio* con tonalidades rosa empolvado, blanco marfil, tipografía serif editorial y contrastes en gris obsidiana.

---

## 🌸 1. Paleta de Colores

| Token CSS | Hex | Rol y Uso |
| :--- | :--- | :--- |
| `--color-primary` | `#ec4899` / `#f472b6` | Color primario de acento, botones CTA principales y detalles. |
| `--color-primary-light` | `#fdf2f8` / `#fce7f3` | Fondos de tarjetas de servicios, badges y contenedores suaves. |
| `--color-primary-dark` | `#db2777` | Hover de botones y estados interactivos. |
| `--color-dark-bg` | `#18151e` | Fondo del Footer y barras de contraste premium. |
| `--color-dark-surface` | `#231f2b` | Superficies oscuras secundarias. |
| `--color-text-main` | `#1f2937` | Color principal de lectura para títulos y subtítulos. |
| `--color-text-muted` | `#6b7280` | Párrafos secundarios, metadatos y descripciones. |
| `--color-bg-body` | `#faf7f5` | Fondo general de la página con sensación cálida y acogedora. |
| `--color-white` | `#ffffff` | Blanco puro para tarjetas, inputs y contenedores elevados. |
| `--color-gold-accent` | `#d4af37` | Acentos dorados para estrellas de valoración y badges de 5.0. |

---

## 🔤 2. Tipografía

- **Títulos de Lujo / Display**: `'Playfair Display', Georgia, serif`
  - Pesos: `600`, `700`, `800`
  - Carácter: Elegancia clásica, lujo, calma y sofisticación.
- **Cuerpo y UI / Sans**: `'Plus Jakarta Sans', -apple-system, sans-serif`
  - Pesos: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
  - Carácter: Máxima legibilidad en pantallas táctiles y desktop.

---

## 🧩 3. Componentes Visuales

1. **Botones CTA**:
   - `btn-primary`: Fondo rosa chicle elegante (`#ec4899`), texto blanco, radio `9999px` (estilo pill), sombra suave `0 10px 25px -5px rgba(236, 72, 153, 0.4)` y efecto hover transformativo (`translateY(-2px)`).
   - `btn-secondary`: Borde fino rosa con fondo transparente o blanco translúcido.
2. **Tarjetas de Servicio (Feature Cards)**:
   - Fondo en degradado sutil rosado (`#fff0f5` a `#ffffff`), bordes redondeados `1.25rem`, borde sutil `1px solid rgba(236,72,153,0.15)` e iconos vectoriales estilizados.
3. **Tarjetas de Especialistas**:
   - Fotografía vertical en proporción 3:4 con esquinas redondeadas, degradado sutil al pie de la foto, badge de especialidad y botón de reserva individual.
4. **Badges de Confianza**:
   - Píldoras con iconos (`⭐ 5.0 Google Reviews`, `💆‍♀️ +1,500 Clientes Felices`, `🌿 Cosmética Orgánica`).
5. **Formulario de Reserva**:
   - Inputs limpios con efecto glow rosado en focus, selector dinámico de servicio y botón de envío directo a WhatsApp.
