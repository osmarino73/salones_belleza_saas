export const PLANTILLA_SALON_BEAUTY_HTML = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} | Salón de Belleza & Spa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #faf5f5; color: #1c1917; }
    h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
    .beauty-gradient { background: linear-gradient(135deg, {{PRIMARY_COLOR}}, #fb7185); }
    .beauty-text { color: {{PRIMARY_COLOR}}; }
    .beauty-border { border-color: {{PRIMARY_COLOR}}; }
  </style>
</head>
<body class="antialiased">

  <!-- NAVBAR -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="w-8 h-8 rounded-full beauty-gradient flex items-center justify-center text-white text-sm shadow-sm">
          ✨
        </span>
        <span class="font-serif font-extrabold text-xl tracking-tight text-stone-900">{{BUSINESS_NAME}}</span>
      </div>
      <a href="https://wa.me/{{PHONE_WHATSAPP}}?text=Hola%20deseo%20reservar%20un%20servicio" target="_blank"
         class="px-5 py-2 rounded-full beauty-gradient text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md shadow-rose-500/20 transition-all">
        Agendar Cita
      </a>
    </div>
  </header>

  <!-- HERO -->
  <section class="relative pt-24 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden bg-gradient-to-b from-rose-50/50 to-transparent">
    <div class="max-w-4xl mx-auto text-center relative z-10">
      <span class="inline-block px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-widest mb-4">
        {{HERO_BADGE}}
      </span>
      <h1 class="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
        {{HEADLINE}}
      </h1>
      <p class="text-stone-600 text-sm md:text-base max-w-xl mx-auto mb-8 font-light">
        {{SUBHEADLINE}}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#servicios" class="w-full sm:w-auto px-8 py-3.5 rounded-full beauty-gradient text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:scale-105 transition-all">
          Explorar Servicios & Precios
        </a>
        <a href="https://wa.me/{{PHONE_WHATSAPP}}" target="_blank" class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white border border-rose-200 text-stone-700 font-semibold text-sm hover:bg-rose-50/50 transition-all">
          💬 Consultar por WhatsApp
        </a>
      </div>
    </div>
  </section>

  <!-- CATÁLOGO DE SERVICIOS -->
  <section id="servicios" class="py-16 px-4 max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-extrabold text-stone-900">Menú de Experiencias</h2>
      <p class="text-stone-500 text-sm mt-2">Tratamientos diseñados para resaltar tu mejor versión</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
      {{SERVICES_CARDS}}
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="py-12 border-t border-rose-100 bg-white px-4 text-center">
    <p class="font-serif font-extrabold text-lg text-stone-900 mb-1">{{BUSINESS_NAME}}</p>
    <p class="text-stone-500 text-xs mb-3">📍 {{ADDRESS}} • 📱 {{PHONE_WHATSAPP}}</p>
    <p class="text-stone-400 text-[10px]">Reservas potenciadas por Kewe.app</p>
  </footer>

</body>
</html>
`;
