# 🤖 Guía del Proyecto para IA: Sanus Spa

Este proyecto corresponde a la landing page oficial de **Sanus Spa** (Spa y gimnasio en Apartadó, Antioquia), desarrollada bajo los estándares globales del repositorio (`/AGENTS.md`) y la habilidad de animación de video `video-to-scroll-frames`.

---

## 🎯 Arquitectura de Secciones Mandatoria

Toda modificación o expansión debe preservar estrictamente el orden oficial:
1. **`#inicio` (Hero Canvas Video Scroll Scrubbing)**:
   - Contenedor `.hero-scroll-section` (`260vh`) con `.canvas-sticky-wrapper` (`100vh`/`100dvh`).
   - Canvas interactivo alimentado por 72 fotogramas WebP (`public/frames/desktop/` y `public/frames/mobile/`).
   - Poster de respaldo contra pantallas negras (`poster.webp`).
   - Regla CSS obligatoria: `html, body { overflow-x: clip; }`.
2. **Barra de Pilares / Garantías (`#pilares`)**:
   - 4 sellos de confianza.
   - En móvil (< 768px): Carrusel horizontal deslizable con *Scroll Snap*.
3. **`#servicios` (Catálogo de Servicios Full-Bleed Minimalista)**:
   - Grid de **3 columnas en escritorio (`repeat(3, 1fr)`)** y **2 columnas en móvil**.
   - Tarjetas 3:4 con fotografía al 100%, degradado inferior aterciopelado, precio visible y enlace minimalista `AGENDAR ➔`.
4. **`#nosotros` (Sobre Nosotros & Retrato Editorial)**:
   - Bloque de experiencia con fotografía de ambiente zen (`photo-1600334129128-685c5582fd35`), badge VIP y métricas.
   - Grid de 4 columnas en escritorio y 2 columnas en móvil con **Retrato Editorial Full-Bleed (3:4.2)** de especialistas con enlace directo a WhatsApp.
5. **`#ubicacion` (Mapa & Contacto)**:
   - Panel de información con horarios y Google Maps interactivo embebido:
     `https://maps.google.com/maps?q=Sanus+Spa,+Cra.+106,+Apartad%C3%B3,+Antioquia&t=&z=16&ie=UTF8&iwloc=&output=embed`
6. **Footer Principal**:
   - Enlaces de navegación, redes sociales y módulo de reserva con botón conciso **«Agendar»**.

---

## 🎨 Tríada Visual
- **Colores**: Obsidian `#0e0f13`, Superficie `#15171c`, Acento Oro `#d4af37`, Champagne `#e5c07b`, Texto Marfil `#f9f7f2`.
- **Tipografía**: `'Cormorant Garamond'` (titulares), `'Alex Brush'` (signature script), `'Plus Jakarta Sans'` (sans-serif).

---

## 📱 Reglas Críticas Móviles
- Cero barras o docks de navegación inferiores fijas (`.mobile-action-dock`).
- Navegación móvil limpia: Header minimalista (Logotipo a la izquierda, botón «Agendar» a la derecha) y botón circular de WhatsApp flotante anti-corte (`env(safe-area-inset-bottom)`).
