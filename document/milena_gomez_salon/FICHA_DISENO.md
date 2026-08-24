# Ficha de Diseño: Milena Gómez salon (Centro de Estética & Spa)

Manual forense de identidad visual, tipografía, paleta cromática y arquitectura UI para **Milena Gómez salon** en Apartadó, Antioquia.

---

## 🎨 1. Paleta de Colores Forense (Inspiración Rose Gold, Mauve & Warm Champagne)

| Nombre del Color | Código HEX | Rol / Uso en la Interfaz |
| :--- | :--- | :--- |
| **Rose Mauve Primary** | `#9b4b5c` | Color primario de marca, botones principales CTA, titulares acentuados. |
| **Deep Velvet Rose** | `#7c3444` | Hover de botones, fondos de banners promocionales y contrastes intensos. |
| **Warm Champagne Gold** | `#c59b5f` | Detalles en oro cálido, anillos de medallas, estrellas e iconografía de lujo. |
| **Soft Blush Base** | `#fbf3f2` | Fondo del Hero inmersivo, ribbons y secciones alternas. |
| **Cream Linen White** | `#fdfaf9` | Fondo global de la página (`body background`), tono cálido y femenino. |
| **Rose Border Soft** | `#f2d8df` | Bordes sutiles de tarjetas, líneas divisorias y separadores con corazón. |
| **Deep Velvet Espresso** | `#2b141c` | Titulares principales `<h1>`, `<h2>` y nombres de servicios. |
| **Muted Mauve Gray** | `#6c565e` | Párrafos descriptivos, subtítulos y metadatos secundarios. |
| **Pure White** | `#ffffff` | Superficie de tarjetas, panel informativo de mapas y modales. |

---

## 🔤 2. Tipografía y Jerarquía Visual

- **Fuente de Titulares Display**: `Playfair Display` (Google Fonts, pesos `500`, `600`, `700`, `800`). Proyecta alta cosmética, lujo y serenidad estética.
- **Fuente de Acento Cursivo (Script Flourish)**: `Alex Brush` itálica (`font-style: italic`). Para realces como *"Relájate • Renuévate • Rejuvenece"* y *"Consiéntete con el Verdadero Lujo"*.
- **Fuente de Lectura & UI**: `Plus Jakarta Sans` (Google Fonts, pesos `300`, `400`, `500`, `600`, `700`). Máxima nitidez y legibilidad moderna en cualquier resolución.

---

## 📐 3. Componentes y Layout Forense

1. **Top Bar Superior**: Teléfono directo `(+57) 312 886 7937`, dirección en Cl. 101 #97/56, horario y redes sociales en fondo suave rose quartz.
2. **Navbar Fijo Glassmorphism**: Logotipo refinado `Milena Gómez salon` con emblema de flor de loto dorada, enlaces con scroll suave y botón destacado "Agendar Cita".
3. **Hero Header Inmersivo Full-Width Edge-to-Edge**:
   - Capa `.hero-bg-cover` con modelo en tratamiento facial de spa a la derecha.
   - Máscara `.hero-bg-overlay` con gradiente `linear-gradient(90deg, #fbf3f2 0%, #fbf3f2 38%, rgba(251,243,242,0.92) 52%, transparent 100%)`.
   - Badge flotante circular en oro y velvet rose (*"5.0 ★ Calidad VIP • Agenda Este Mes"*).
   - **Móvil Calibrado (< 768px)**: `.hero-bg-img` con `opacity: 0.72` + `.hero-bg-overlay` translúcido + `text-shadow` en titulares.
4. **Catálogo de 5 Servicios Circulares con Medalla Flotante**:
   - Tarjetas circulares con halo dorado, medallas de ícono flotante y badges de técnica (*«Técnica Glow Spa»*, *«Ritual Anti-Estrés»*, *«Cuidado de Autor»*, *«Spa Podal Relax»*, *«Dermo-Nutrición»*) **sin precios numéricos**.
5. **Banner Promocional Deep Velvet & Gold**:
   - Fondo gradiente velvet rose con medalla de amor propio, mensaje de impacto y botón de reserva directa por WhatsApp.
6. **Sección "¿Por Qué Elegirnos?" & Beneficios**:
   - Composición a 2 columnas con imagen de cabina de estética y 4 tarjetas de valor.
7. **Galería "Resultados Reales" (6 Imágenes)**:
   - Grid con efectos hover de zoom y etiquetas de tratamiento.
8. **Testimonios de Clientas Satisfechas (5.0 Estrellas)**:
   - Tarjetas con avatar circular y calificación.
9. **Módulo de Ubicación Georreferenciado en Google Maps**:
   - Tarjeta a 2 columnas con datos de contacto de Apartadó e iframe responsive.
10. **Footer Editorial & WhatsApp Flotante**:
    - Enlaces, formulario VIP y botón interactivo con animación pulsante.
