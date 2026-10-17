import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, Sparkles, Save, ImagePlus, Palette, FileText, ExternalLink,
  Smartphone, Monitor, RotateCw, Check, MapPin, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import BeautyImageGalleryModal from './BeautyImageGalleryModal';
import { BeautyImageType } from '../../types/keweBeauty';
import { injectBeautyHtml } from '../../lib/beautyHtmlInjector';
import { BEAUTY_SPECIALTIES } from '../../lib/beautySpecialties';

// Paletas de color premium para Barberías, Salones de Belleza, Nails & Spas
const PRESET_BEAUTY_COLORS = [
  { name: 'Oro Barbería', hex: '#d97706', desc: 'Barbería Clásica & Madera' },
  { name: 'Rose Gold Luxury', hex: '#e11d48', desc: 'Salón Femenino & Colorimetría' },
  { name: 'Nude Champagne', hex: '#f59e0b', desc: 'Estética & Maquillaje' },
  { name: 'Rosa Pastel Nails', hex: '#ec4899', desc: 'Nails Bar & Pestañas' },
  { name: 'Verde Esmeralda Spa', hex: '#059669', desc: 'Spa Holístico & Masajes' },
  { name: 'Morado Glow Lavanda', hex: '#8b5cf6', desc: 'Lash & Brow Studio' },
  { name: 'Negro Mate & Carbón', hex: '#18181b', desc: 'Barbershop VIP & Tatuajes' },
  { name: 'Azul Real Zafiro', hex: '#2563eb', desc: 'Clínica Estética & Láser' },
];

export const WebsiteEditorTab: React.FC = () => {
  const [editorSection, setEditorSection] = useState<'branding' | 'colors' | 'copywriting'>('branding');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Configuración de la Web
  const [businessName, setBusinessName] = useState('Golden Blade Barbería');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('573001234567');
  const [address, setAddress] = useState('Calle 10 # 43E-12, El Poblado');
  const [primaryColor, setPrimaryColor] = useState('#d97706');
  const [category, setCategory] = useState<'barberia' | 'peluqueria_damas' | 'unas_nails'>('barberia');
  
  // Imágenes
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80');
  const [heroMobileImage, setHeroMobileImage] = useState('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1080&q=80');
  const [logoUrl, setLogoUrl] = useState('');

  // Textos & Copywriting
  const [headline, setHeadline] = useState('Cortes de Precisión & Cuidado Masculino de Primer Nivel');
  const [subheadline, setSubheadline] = useState('Vive una experiencia tradicional de barbería con toalla caliente, navaja clásica y estilo moderno.');
  const [heroBadge, setHeroBadge] = useState('💈 Citas Disponibles Hoy');

  // Modal Galería de Imágenes
  const [galleryConfig, setGalleryConfig] = useState<{
    isOpen: boolean;
    type: BeautyImageType | 'todos';
    target: 'hero_desktop' | 'hero_mobile' | 'logo';
  } | null>(null);

  // Generación HTML en tiempo real para el Iframe
  const renderedHtml = useMemo(() => {
    const specialty = BEAUTY_SPECIALTIES[category] || BEAUTY_SPECIALTIES.barberia;
    return injectBeautyHtml({
      category,
      businessName,
      phoneWhatsapp,
      address,
      primaryColor,
      heroImage,
      heroMobileImage,
      headline,
      subheadline,
      heroBadge,
      services: specialty.services
    });
  }, [category, businessName, phoneWhatsapp, address, primaryColor, heroImage, heroMobileImage, headline, subheadline, heroBadge]);

  const handleSelectGalleryImage = (url: string) => {
    if (!galleryConfig) return;
    if (galleryConfig.target === 'hero_desktop') setHeroImage(url);
    if (galleryConfig.target === 'hero_mobile') setHeroMobileImage(url);
    if (galleryConfig.target === 'logo') setLogoUrl(url);
    toast.success('Imagen de la biblioteca aplicada');
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simular guardado en Supabase / prospect_sites
    setTimeout(() => {
      setIsSaving(false);
      toast.success('¡Página web actualizada correctamente!');
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-4 sm:p-6 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-bold">
              <Globe size={18} />
            </span>
            <h2 className="text-xl font-black text-foreground">Editor Visual de Mi Página Web</h2>
          </div>
          <p className="text-xs text-muted-foreground">Personaliza imágenes, colores, textos y catálogo de tu salón o barbería en tiempo real</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold gap-1.5 text-xs h-10 shadow-md shadow-amber-500/20"
          >
            <Save size={16} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Editor & Preview Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PANEL DE EDICIÓN (5 Columnas) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Tabs Selector */}
          <div className="grid grid-cols-3 gap-1 bg-secondary/50 p-1.5 rounded-2xl border border-border/60">
            <button
              onClick={() => setEditorSection('branding')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                editorSection === 'branding' ? 'bg-card text-foreground shadow-sm font-black' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ImagePlus size={14} />
              <span>Imágenes</span>
            </button>
            <button
              onClick={() => setEditorSection('colors')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                editorSection === 'colors' ? 'bg-card text-foreground shadow-sm font-black' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Palette size={14} />
              <span>Colores</span>
            </button>
            <button
              onClick={() => setEditorSection('copywriting')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                editorSection === 'copywriting' ? 'bg-card text-foreground shadow-sm font-black' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText size={14} />
              <span>Textos</span>
            </button>
          </div>

          {/* CONTENIDO 1: IMÁGENES & BRANDING */}
          {editorSection === 'branding' && (
            <div className="bg-card p-5 rounded-3xl border border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Imágenes de Portada & Marca</h3>
              
              {/* Hero Desktop */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">Portada PC / Desktop (16:9)</span>
                  <button 
                    onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_desktop', target: 'hero_desktop' })}
                    className="text-amber-500 hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <Sparkles size={12} /> Abrir Biblioteca
                  </button>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-secondary">
                  <img src={heroImage} alt="Hero Desktop" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Hero Móvil */}
              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">Portada Smartphone Móvil (4:5)</span>
                  <button 
                    onClick={() => setGalleryConfig({ isOpen: true, type: 'hero_mobile', target: 'hero_mobile' })}
                    className="text-amber-500 hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <Sparkles size={12} /> Abrir Biblioteca
                  </button>
                </div>
                <div className="relative h-28 w-24 rounded-2xl overflow-hidden border border-border bg-secondary">
                  <img src={heroMobileImage} alt="Hero Mobile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO 2: COLORES & PALETAS */}
          {editorSection === 'colors' && (
            <div className="bg-card p-5 rounded-3xl border border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Paleta Cromática de Tu Salón</h3>
              <p className="text-xs text-muted-foreground">Selecciona un estilo predeterminado o ingresa tu color HEX:</p>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_BEAUTY_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setPrimaryColor(c.hex)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      primaryColor === c.hex ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500' : 'border-border/60 hover:bg-secondary/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full shadow-sm shrink-0" style={{ backgroundColor: c.hex }} />
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-foreground block mb-1">Color Personalizado (HEX)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <Input 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO 3: TEXTOS & COPYWRITING */}
          {editorSection === 'copywriting' && (
            <div className="bg-card p-5 rounded-3xl border border-border space-y-3.5">
              <h3 className="text-sm font-bold text-foreground">Información & Mensajes Persuasivos</h3>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Nombre del Negocio</label>
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">WhatsApp para Agendamiento</label>
                <Input value={phoneWhatsapp} onChange={(e) => setPhoneWhatsapp(e.target.value)} placeholder="Ej: 573001234567" />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Dirección / Sede</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Título Principal (Headline)</label>
                <Input value={headline} onChange={(e) => setHeadline(e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Subtítulo Descriptivo</label>
                <textarea 
                  value={subheadline} 
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full h-20 rounded-xl border border-border bg-background p-2.5 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* PREVISUALIZADOR EN VIVO (7 Columnas) */}
        <div className="lg:col-span-7 bg-card p-4 rounded-3xl border border-border shadow-sm flex flex-col items-center">
          
          {/* Barra de Dispositivo */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-border/60 mb-3">
            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Previsualización en Vivo
            </span>

            <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${previewDevice === 'mobile' ? 'bg-card text-foreground shadow-sm font-bold' : 'text-muted-foreground'}`}
                title="Vista Smartphone"
              >
                <Smartphone size={16} />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${previewDevice === 'desktop' ? 'bg-card text-foreground shadow-sm font-bold' : 'text-muted-foreground'}`}
                title="Vista Desktop"
              >
                <Monitor size={16} />
              </button>
            </div>
          </div>

          {/* Iframe Interactivo */}
          <div className={`transition-all duration-300 overflow-hidden shadow-2xl border-4 border-zinc-800 rounded-3xl bg-black ${
            previewDevice === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-[667px]'
          }`}>
            <iframe 
              srcDoc={renderedHtml}
              title="Previsualizador Web Kewe"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>

        </div>

      </div>

      {/* Modal de la Biblioteca de Imágenes */}
      {galleryConfig && (
        <BeautyImageGalleryModal
          isOpen={galleryConfig.isOpen}
          onClose={() => setGalleryConfig(null)}
          onSelectImage={handleSelectGalleryImage}
          initialType={galleryConfig.type}
        />
      )}

    </div>
  );
};

export default WebsiteEditorTab;
