export const PLANTILLA_BARBERIA_HTML = `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{BUSINESS_NAME}} | Barbería & Cortes de Autor</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; background-color: #09090b; color: #f4f4f5; }
    .gold-gradient { background: linear-gradient(135deg, {{PRIMARY_COLOR}}, #fbbf24); }
    .gold-text { color: {{PRIMARY_COLOR}}; }
    .gold-border { border-color: {{PRIMARY_COLOR}}; }
  </style>
</head>
<body class="antialiased selection:bg-amber-500/20">

  <!-- NAVBAR -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center font-black text-black text-lg">
          ✂️
        </div>
        <span class="font-extrabold text-lg tracking-tight uppercase">{{BUSINESS_NAME}}</span>
      </div>
      <a href="https://wa.me/{{PHONE_WHATSAPP}}?text=Hola%20quiero%20agendar%20una%20cita" target="_blank"
         class="px-4 py-2 rounded-full gold-gradient text-black font-extrabold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20">
        Agendar Cita
      </a>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="relative pt-24 pb-16 md:pt-36 md:pb-24 px-4 overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-25">
      <img src="{{HERO_IMAGE}}" class="w-full h-full object-cover hidden md:block" alt="Hero">
      <img src="{{HERO_MOBILE_IMAGE}}" class="w-full h-full object-cover md:hidden" alt="Hero Móvil">
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-xs font-bold gold-text uppercase tracking-widest mb-4">
        {{HERO_BADGE}}
      </span>
      <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none mb-4 uppercase">
        {{HEADLINE}}
      </h1>
      <p class="text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-normal">
        {{SUBHEADLINE}}
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#servicios" class="w-full sm:w-auto px-8 py-3.5 rounded-2xl gold-gradient text-black font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all">
          Ver Catálogo de Servicios
        </a>
        <a href="https://wa.me/{{PHONE_WHATSAPP}}" target="_blank" class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
          <span>💬 WhatsApp Directo</span>
        </a>
      </div>
    </div>
  </section>

  <!-- SERVICIOS -->
  <section id="servicios" class="py-16 px-4 max-w-6xl mx-auto">
    <div class="text-center mb-10">
      <h2 class="text-2xl md:text-4xl font-black uppercase tracking-tight">Nuestros Servicios</h2>
      <p class="text-zinc-400 text-xs md:text-sm mt-1">Selecciona tu servicio y reserva tu turno en segundos</p>
    </div>

    <!-- Contenedor dinámico inyectado por Kewe -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="services-grid">
      {{SERVICES_CARDS}}
    </div>
  </section>

  <!-- FOOTER & UBICACIÓN -->
  <footer class="py-12 border-t border-zinc-800/80 bg-zinc-950 px-4 text-center">
    <p class="font-extrabold text-base uppercase mb-1">{{BUSINESS_NAME}}</p>
    <p class="text-zinc-500 text-xs mb-4">📍 {{ADDRESS}} • 📱 {{PHONE_WHATSAPP}}</p>
    <p class="text-zinc-600 text-[10px]">Potenciado por Kewe.app • Sistema de Reservas para Salones & Barberías</p>
  </footer>

</body>
</html>
`;
