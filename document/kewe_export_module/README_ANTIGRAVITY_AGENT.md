# Guía Maestra de Integración para el Agente IA de Antigravity (Kewe.app)

> **Propósito:** Esta carpeta contiene el módulo completo de **Prospección Comercial en Campo**, **Editor Visual de Página Web**, **Biblioteca de Recursos Visuales HD** y **Plantillas Especializadas** adaptadas al nicho de **Salones de Belleza, Barberías, Nails Bars y Spas (Kewe.app)**, extraído y perfeccionado desde la arquitectura de **Mennu7**.

---

## 📂 Mapa de Archivos del Módulo

```text
kewe_export_module/
├── supabase_schema.sql                 # Script DDL con tablas: agentes_campo, prospect_sites, prospect_templates, stock_beauty_images
├── src/
│   ├── types/
│   │   └── keweBeauty.ts               # Tipado TypeScript (BeautyService, BeautySpecialty, ProspectSite, FieldAgent)
│   ├── data/
│   │   └── beautyStockImages.ts        # Biblioteca de fotos HD Unsplash (Barbería, Colorimetría, Nails, Pestañas, Spa)
│   ├── lib/
│   │   ├── beautySpecialties.ts        # Especialidades preconfiguradas (servicios, precios COP/USD, duraciones y fotos)
│   │   ├── beautyHtmlInjector.ts       # Motor inyector de HTML dinámico con botones de WhatsApp
│   │   └── templates/
│   │       ├── plantillaBarberia.ts    # Plantilla responsive dark mode para Barberías & Cortes
│   │       └── plantillaSalonBeauty.ts # Plantilla elegante Rose Gold para Salones Femeninos & Spas
│   ├── services/
│   │   ├── agentService.ts             # Auth de agentes de campo, control de sesión y cálculo de métricas
│   │   └── prospectActivationService.ts# Activación B2B sin desloguear al agente (usando cliente efímero Supabase)
│   ├── components/
│   │   └── dashboard/
│   │       ├── WebsiteEditorTab.tsx    # Pestaña "Mi Página Web" (edición de imágenes, colores, textos y preview)
│   │       └── BeautyImageGalleryModal.tsx # Modal selector de la biblioteca de imágenes por formato
│   └── pages/
│       └── AgentIntakePage.tsx         # Vista mobile-first para celular del asesor comercial con captura GPS
```

---

## 🚀 Pasos de Integración en Kewe.app (Instrucciones para el Agente)

### Paso 1: Ejecutar la Migración SQL en Supabase
1. Abre el Dashboard de Supabase de **kewe.app** -> **SQL Editor**.
2. Pega y ejecuta el contenido de `supabase_schema.sql`.
3. Esto crea:
   - `agentes_campo` (con RLS y estados `activo` / `inactivo`).
   - `prospect_sites` (con slugs únicos y campo `category` adaptado a salones).
   - `prospect_templates` (para plantillas reutilizables).
   - `stock_beauty_images` (para imágenes en base de datos).

### Paso 2: Copiar Archivos al Proyecto Kewe
1. Copia `src/types/keweBeauty.ts` a tu carpeta `src/types/`.
2. Copia `src/data/beautyStockImages.ts` a `src/data/`.
3. Copia `src/lib/beautySpecialties.ts`, `src/lib/beautyHtmlInjector.ts` y la carpeta `src/lib/templates/` a tu carpeta `src/lib/`.
4. Copia `src/services/agentService.ts` y `src/services/prospectActivationService.ts` a `src/services/`.
5. Copia los componentes `WebsiteEditorTab.tsx` y `BeautyImageGalleryModal.tsx` a `src/components/dashboard/`.
6. Copia `AgentIntakePage.tsx` a `src/pages/`.

### Paso 3: Registrar Rutas en tu Router (`App.tsx`)
```tsx
import AgentIntakePage from '@/pages/AgentIntakePage';
import WebsiteEditorTab from '@/components/dashboard/WebsiteEditorTab';

// 1. Ruta para el agente comercial en calle (abrible desde el celular):
<Route path="/agente" element={<AgentIntakePage />} />
<Route path="/campo" element={<AgentIntakePage />} />

// 2. Ruta para el Sitio Web público demo del prospecto:
<Route path="/p/:slug" element={<PublicProspectSitePage />} />

// 3. Pestaña "Mi Página Web" en tu Dashboard de Kewe:
{activeTab === 'website' && <WebsiteEditorTab />}
```

---

## 🛠️ Detalle de las 4 Funciones Clave

### 1. El Portal del Agente de Campo (`AgentIntakePage.tsx`)
- **Diseño Mobile-First:** Pensado 100% para la pantalla del celular del vendedor en la calle.
- **Geolocalización GPS:** Botón de un toque para capturar latitud y longitud del salón visitado.
- **Generación en Caliente:** Con solo escribir el nombre del salón y su WhatsApp, inyecta una demo completa con catálogo de servicios según la especialidad seleccionada (`barberia`, `peluqueria_damas`, `unas_nails`).
- **Activación B2B Instantánea:** Crea el usuario del dueño en Supabase Auth usando un **cliente efímero**, garantizando que el agente comercial **nunca pierda su sesión activa** en el celular.

### 2. Editor "Mi Página Web" (`WebsiteEditorTab.tsx`)
- **Pestaña Imágenes:** Permite cambiar el Hero Desktop (16:9), Hero Móvil (4:5) y Logo mediante subida o selección de la biblioteca.
- **Pestaña Colores:** Paletas cromáticas de belleza (`Oro Barbería`, `Rose Gold Luxury`, `Rosa Pastel Nails`, `Verde Esmeralda Spa`, etc.) y selector manual HEX.
- **Pestaña Textos:** Edición del Headline principal, subtítulo, llamada a la acción y datos de contacto.
- **Previsualizador en Vivo:** Iframe con toggle instantáneo Móvil (375px) / Desktop (100%).

### 3. Biblioteca de Imágenes Optimizadas (`beautyStockImages.ts` & `BeautyImageGalleryModal.tsx`)
- Fotografías HD reales de Unsplash seleccionadas específicamente para el rubro de estética y barbería.
- Clasificadas por formato de aspecto:
  - `1:1` para tarjetas de servicios individuales.
  - `16:9` para cabeceras panorámicas de escritorio.
  - `4:5` para smartphones móviles.
  - `4:3` para fotos de ambiente del salón.
- Buscador reactivo por palabras clave (`fade`, `balayage`, `acrilicas`, `spa`, `cejas`).

### 4. Plantillas Optimizadas para el Nicho (`templates/`)
- `plantillaBarberia.ts`: Estilo oscuro moderno, tipografía bold, acentos dorados y amber, enfocado en reservas masculinas y servicios de barba/fade.
- `plantillaSalonBeauty.ts`: Estilo delicado y de lujo en tonos Rose Gold y Stone, con tipografías editoriales (`Playfair Display`), enfocado en salones de estética, colorimetría y nails spa.
- Ambas incluyen enlaces dinámicos directos a WhatsApp formateados con el nombre del servicio para agendamiento de citas sin fricción.
