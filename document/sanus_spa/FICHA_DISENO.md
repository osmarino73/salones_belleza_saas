# 🎨 Ficha de Diseño Visual: Sanus Spa

Este documento contiene el manual de identidad visual y especificaciones técnicas para la landing page de **Sanus Spa**, clonando de forma forense la estética de lujo y serenidad de la referencia visual (*Tabbsum Shah Beauty*), combinada con el motor de animación de video por scroll Canvas HTML5.

---

## 🏛️ Tríada Visual Forense

### 1. Paleta Cromática
- **Fondo Primario Obsidian / Pizarra Texturizada**: `#0e0f13` (Ébano profundo con grano sutil de estudio).
- **Fondo Secundario / Superficie Elevada**: `#15171c` (Gris grafito profundo para secciones y paneles).
- **Acento Oro Cálido / Champagne**: `#d4af37` (Oro imperial refinado para botones primarios, divisores y estrellas).
- **Acento Oro Suave / Brillo**: `#e5c07b` (Champagne radiante para hovers y líneas de acento).
- **Bordes & Divisores Sutiles**: `rgba(212, 175, 55, 0.22)` (Filos metálicos finos de alta gama).
- **Texto Principal**: `#f9f7f2` (Marfil cálido de alto contraste).
- **Texto Secundario**: `#b6b3ab` (Ceniza suave para descripciones y metadatos).
- **Texto Silenciado**: `#848076` (Gris medio para notas y derechos).

### 2. Tipografía de Autor
- **Titulares Display & Marcas**: `'Cormorant Garamond', Georgia, serif` (Pesos 500 y 600, elegancia editorial y porte prémium).
- **Signature Script**: `'Alex Brush', cursive` (Frase manuscrita caligráfica para subtítulos líricos y sellos de confianza).
- **UI, Navegación & Botones**: `'Plus Jakarta Sans', system-ui, sans-serif` (Pesos 400, 500, 600, 700; limpio, legible y geométrico).

---

## 🎬 Sistema de Animación Hero: Canvas Video Scroll Scrubbing
- **Frames Duales WebP 1080p Nativo**: 72 fotogramas a 12 fps extraídos de `Modelo_gira_cabeza_y_abre_202609090852.mp4`:
  - Desktop (16:9 - 1920x1080 nativo, Q85): Peso total 3.9 MB (~54 KB por frame de nitidez cristalina).
  - Mobile (9:16 - 720x1280, Q76): Peso total 1.31 MB (~18 KB por frame).
- **Encuadre Calibrado (Reducción del 10%)**: En `renderFrame()`, la escala base de cover se reduce en un **10% (`scale = baseScale * 0.90`)** con desplazamiento horizontal suave hacia la derecha en desktop. Esto proporciona un encuadre holgado donde se aprecia la cabeza completa de la modelo, su cabello, cuello y hombros sin roces con los bordes de la pantalla ni la barra de navegación.
- **Nitidez Óptica 100% (Cero Capas Opacas)**: Se eliminó por completo cualquier capa de superposición (`.canvas-overlay-gradient` y posters residuales). El video se dibuja directamente sobre el canvas con el color base ébano `#0e0f13`, garantizando máxima nitidez, colores vivos y textura natural de la piel sin veladuras grisáceas ni pérdida de contraste.
- **Storytelling de 3 Textos Secuenciales**: Durante los `300vh` de recorrido de scroll, el bloque lateral izquierdo presenta 3 capítulos editoriales que transicionan suavemente con *crossfade* (`opacity` y `translateY`):
  1. **Capítulo 1 (0% - 32%)**: *Armonía, Vitalidad & Cuidado Integral* (Introducción y agendamiento).
  2. **Capítulo 2 (33% - 66%)**: *Libera el Estrés, Revitaliza tu Piel* (Circuitos de hidroterapia, sauna y piedras volcánicas).
  3. **Capítulo 3 (67% - 100%)**: *Espacios Diseñados Para tu Serenidad* (Instalaciones privadas y llamada final a la acción).
- **Regla CSS Crítica**: `html, body { overflow-x: clip; }` para proteger `position: sticky` sin bloquear el scroll táctil ni destruir el contexto de navegación.

---

## 📐 Componentes UI & Grid Estándar

### 1. Barra de Pilares
- 4 sellos de confianza: *Terapeutas Certificados*, *Ambiente 100% Zen*, *Circuito de Hidroterapia*, *Higiene y Protocolo Clínico*.
- En móvil (< 768px): Carrusel horizontal deslizable (*Scroll Snap*) en una fila continua.

### 2. Catálogo de Servicios Full-Bleed Minimalista (`.service-card`)
- **Escritorio**: 3 columnas (`repeat(3, 1fr)`), 2 filas de 3 tarjetas.
- **Móvil**: 2 columnas (`repeat(2, 1fr)`).
- **Relación 3:4 Full-Bleed**: Fotografía al 100%, degradado inferior suave, sin badges superiores de tiempo, precio en oro cálido y enlace minimalista `AGENDAR ➔` directo a WhatsApp con micro-interacción hover.

### 3. Sobre Nosotros & Retratos Editoriales (`.team-card`)
- **Sobre Nosotros**: Experiencia a 2 columnas con fotografía de ambiente zen de camillas y toallas aromáticas (`photo-1600334129128-685c5582fd35`), badge flotante VIP y 4 métricas de autoridad.
- **Equipo de Profesionales**: Grid de 4 columnas en escritorio y 2 en móvil con formato **Retrato Editorial Full-Bleed (3:4.2)**, iluminación cálida, nombre display blanco, rol uniforme, 5 estrellas y enlace `AGENDAR ➔`.

### 4. Navegación Móvil Limpia & Google Maps Georreferenciado
- Header minimalista superior: Logotipo tipográfico + botón conciso **«Agendar»**.
- **Smart Header Calibrado**: La barra de navegación se mantiene fija y visible durante todo el recorrido del Hero/video Canvas; únicamente activa el auto-ocultamiento al descender hacia las secciones inferiores (pilares, servicios, sobre nosotros, mapa) y reaparece instantáneamente al hacer scroll hacia arriba.
- Botón flotante de WhatsApp anti-corte con `env(safe-area-inset-bottom)`. Cero docks o barras inferiores fijas.
- Mapa oficial con URL nominal georreferenciada (`z=16`).
