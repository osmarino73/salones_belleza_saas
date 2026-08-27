import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Palette,
  MapPin,
  Scissors,
  Users,
  Eye,
  Smartphone,
  Monitor,
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Plus,
  Trash2,
  X,
  Layers,
  Crown,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { HomepageStudioState, StudioThemeConfig, StudioServiceItem, StudioSpecialistItem, ProspectSite, MediaItem } from '../../types';
import {
  STUDIO_THEME_PRESETS,
  INITIAL_STUDIO_STATE,
  compileStudioToHtml
} from '../../lib/homepageStudioEngine';
import {
  getAllMediaItems,
  addCustomMediaItem,
  getSuggestedImageForService,
  getSpecialistAvatar,
  getHeroImageForCategory
} from '../../lib/beautyImageLibrary';
import { api } from '../../lib/supabase';

interface HomepageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSitePublished?: (site: ProspectSite) => void;
}

export const HomepageStudioModal: React.FC<HomepageStudioModalProps> = ({
  isOpen,
  onClose,
  onSitePublished
}) => {
  const [activeStep, setActiveStep] = useState<'reference' | 'business' | 'services' | 'team' | 'preview'>('reference');
  const [studioState, setStudioState] = useState<HomepageStudioState>(INITIAL_STUDIO_STATE);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Media Picker Submodal State
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{ type: 'hero' | 'service' | 'specialist'; id?: string } | null>(null);
  const [mediaFilterCat, setMediaFilterCat] = useState<string>('todos');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [customImageTitleInput, setCustomImageTitleInput] = useState('');
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);

  // Publicación
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSite, setPublishedSite] = useState<ProspectSite | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  useEffect(() => {
    setAllMedia(getAllMediaItems());
  }, []);

  // HTML Compilado en Vivo
  const compiledHtml = useMemo(() => {
    return compileStudioToHtml(studioState);
  }, [studioState]);

  if (!isOpen) return null;

  // Manejador de Subida de Imagen de Referencia
  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setStudioState(prev => ({
        ...prev,
        referenceImageUrl: dataUri
      }));
    };
    reader.readAsDataURL(file);
  };

  // Manejador de Aplicación de Presets de Color/Tema
  const handleApplyThemePreset = (presetKey: string) => {
    const preset = STUDIO_THEME_PRESETS[presetKey];
    if (preset) {
      setStudioState(prev => ({
        ...prev,
        theme: preset
      }));
    }
  };

  // Carga de DATOS_NEGOCIO.json
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const b = parsed.negocio || parsed;
        
        setStudioState(prev => ({
          ...prev,
          businessName: b.nombre || prev.businessName,
          slogan: b.eslogan || prev.slogan,
          phoneWhatsapp: b.contacto?.whatsapp?.numero || b.contacto?.telefono_principal || prev.phoneWhatsapp,
          phoneCall: b.contacto?.telefono_principal || prev.phoneCall,
          address: b.ubicacion?.direccion || prev.address,
          city: b.ubicacion?.ciudad || prev.city,
          googleMapsUrl: b.ubicacion?.google_maps_url || prev.googleMapsUrl,
          scheduleSummary: b.horario_atencion || prev.scheduleSummary,
          services: b.servicios && b.servicios.length > 0 ? b.servicios.map((s: any, idx: number) => ({
            id: `srv-json-${idx + 1}`,
            titulo: s.titulo,
            descripcion: s.descripcion || 'Servicio profesional garantizado.',
            precio_cop: s.precio_cop || 75000,
            duracion_minutos: s.duracion_minutos || 60,
            imagen_url: getSuggestedImageForService(s.titulo)
          })) : prev.services,
          specialists: b.especialistas && b.especialistas.length > 0 ? b.especialistas.map((esp: any, idx: number) => ({
            id: `esp-json-${idx + 1}`,
            nombre: esp.nombre,
            rol: esp.rol || 'Especialista',
            avatar_url: getSpecialistAvatar(idx),
            especialidad: esp.especialidades ? esp.especialidades.join(', ') : 'Asesoría y estilismo profesional'
          })) : prev.specialists
        }));
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Cargar preset de prueba Luxus Beauty Spa
  const handleLoadDemo = () => {
    setStudioState({
      ...INITIAL_STUDIO_STATE,
      businessName: 'Luxus Beauty Spa Poblado',
      slogan: 'Look & Siente Lo Mejor de Ti en Nuestro Spa de Lujo',
      phoneWhatsapp: '+573009876543',
      address: 'Carrera 43A # 1Sur-220, El Poblado',
      city: 'Medellín',
      theme: STUDIO_THEME_PRESETS.rose_gold
    });
  };

  // Selección de Imagen desde Media Picker
  const handleSelectMediaItem = (itemUrl: string) => {
    if (!mediaPickerTarget) return;

    if (mediaPickerTarget.type === 'hero') {
      setStudioState(prev => ({ ...prev, heroImageUrl: itemUrl }));
    } else if (mediaPickerTarget.type === 'service' && mediaPickerTarget.id) {
      setStudioState(prev => ({
        ...prev,
        services: prev.services.map(s => s.id === mediaPickerTarget.id ? { ...s, imagen_url: itemUrl } : s)
      }));
    } else if (mediaPickerTarget.type === 'specialist' && mediaPickerTarget.id) {
      setStudioState(prev => ({
        ...prev,
        specialists: prev.specialists.map(esp => esp.id === mediaPickerTarget.id ? { ...esp, avatar_url: itemUrl } : esp)
      }));
    }

    setMediaPickerTarget(null);
  };

  // Agregar nueva imagen a la biblioteca
  const handleAddCustomImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customImageUrlInput.trim()) return;
    const added = addCustomMediaItem({
      title: customImageTitleInput.trim() || 'Foto Personalizada',
      url: customImageUrlInput.trim(),
      category: 'general',
      tags: ['personalizada', 'salon']
    });
    setAllMedia(getAllMediaItems());
    setCustomImageUrlInput('');
    setCustomImageTitleInput('');
    handleSelectMediaItem(added.url);
  };

  // Publicar Sitio Gancho
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const slug = studioState.businessName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'mi-salon';

      const sitePayload: Partial<ProspectSite> = {
        business_name: studioState.businessName,
        phone_whatsapp: studioState.phoneWhatsapp,
        address: studioState.address,
        city: studioState.city,
        country: 'Colombia',
        google_maps_url: studioState.googleMapsUrl,
        slug,
        category: studioState.category,
        raw_html: compiledHtml,
        business_data: {
          nombre: studioState.businessName,
          eslogan: studioState.slogan,
          contacto: {
            telefono_principal: studioState.phoneCall,
            whatsapp: { numero: studioState.phoneWhatsapp, link: `https://wa.me/${studioState.phoneWhatsapp.replace(/\D/g, '')}` }
          },
          ubicacion: {
            direccion: studioState.address,
            ciudad: studioState.city,
            google_maps_url: studioState.googleMapsUrl
          },
          horario_atencion: studioState.scheduleSummary,
          servicios: studioState.services.map(s => ({
            titulo: s.titulo,
            descripcion: s.descripcion,
            precio_cop: s.precio_cop,
            duracion_minutos: s.duracion_minutos
          })),
          especialistas: studioState.specialists.map(e => ({
            nombre: e.nombre,
            rol: e.rol,
            especialidades: [e.especialidad]
          }))
        },
        status: 'prospecto'
      };

      const published = await api.createProspectSite(sitePayload);
      setPublishedSite(published);
      if (onSitePublished) onSitePublished(published);
      setActiveStep('preview');
    } catch (err) {
      console.error('Error publishing site:', err);
      alert('Ocurrió un error al publicar.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Pitch de WhatsApp Oficial de Alta Conversión (Paso 1 + Paso 2 Kowy)
  const generatePitchText = () => {
    const slug = publishedSite?.slug || studioState.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const siteUrl = `${window.location.origin}/sitio/${slug}`;

    return `¡Hola ${studioState.businessName}! 👋✨
Encontramos su negocio en Google Maps y les armamos una propuesta de su página web oficial con catálogo y reservas online:
👉 ${siteUrl}

¿Qué les parece cómo quedó el diseño de su marca? 💖`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in">
      <div className="bg-[#0D111A] border border-white/10 rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* ===================================================================
            HEADER DEL ESTUDIO
            =================================================================== */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#111624] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF5A36] to-pink-500 flex items-center justify-center text-white shadow-lg shadow-[#FF5A36]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Local Homepage Studio</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40">
                  IA & Design Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Diseño a medida guiado por imagen de referencia y Google Maps</p>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="hidden md:flex items-center bg-[#090B10] p-1 rounded-2xl border border-white/10 text-xs font-bold">
            {[
              { id: 'reference', label: '1. Estilo & Referencia', icon: Palette },
              { id: 'business', label: '2. Negocio & Maps', icon: MapPin },
              { id: 'services', label: '3. Servicios & Precios', icon: Scissors },
              { id: 'team', label: '4. Especialistas', icon: Users },
              { id: 'preview', label: '5. Live Preview & Publicar', icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeStep === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStep(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white shadow-md shadow-[#FF5A36]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadDemo}
              className="hidden lg:flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Demo</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ===================================================================
            CUERPO DEL ESTUDIO: SPLIT-SCREEN
            =================================================================== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* COLUMNA IZQUIERDA: CONTROLES & FORMULARIOS (5 COLS) */}
          <div className="lg:col-span-5 border-r border-white/10 overflow-y-auto p-6 space-y-6 bg-[#0D111A]">
            
            {/* ===============================================================
                PASO 1: REFERENCIA VISUAL, PALETA & TEMAS
                =============================================================== */}
            {activeStep === 'reference' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36]">PASO 1: DIRECCIÓN DE ARTE</span>
                  <h3 className="text-xl font-black text-white mt-0.5">Imagen de Referencia & Paleta de Color</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Sube una captura de pantalla de un diseño web que te guste como inspiración o elige uno de nuestros presets de lujo.
                  </p>
                </div>

                {/* Subida de Imagen de Referencia */}
                <div className="p-4 rounded-2xl bg-[#141926] border border-dashed border-white/20 text-center space-y-3">
                  {studioState.referenceImageUrl ? (
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden h-36 border border-white/10">
                        <img src={studioState.referenceImageUrl} alt="Referencia" className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> Referencia Cargada
                        </span>
                      </div>
                      <label className="text-xs text-slate-300 font-bold hover:text-white cursor-pointer inline-block">
                        Cambiar Imagen de Referencia
                        <input type="file" accept="image/*" onChange={handleReferenceImageUpload} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400 mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Arrastra una imagen de referencia o haz clic</h4>
                      <p className="text-[11px] text-slate-400 mb-3">Captura de pantalla de la web modelo</p>
                      <label className="bg-[#FF5A36] hover:bg-[#E54E07] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer inline-block transition-all shadow-md shadow-[#FF5A36]/30">
                        Subir Captura de Referencia
                        <input type="file" accept="image/*" onChange={handleReferenceImageUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                {/* Presets de Estilo Visual */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Paletas & Estilos Preconfigurados:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: 'rose_gold', label: '✨ Rose Gold Luxury', primary: '#FF5A36', bg: '#090B10' },
                      { key: 'dark_gold', label: '👑 Dark Gold Obsidian', primary: '#D97706', bg: '#0A0A0B' },
                      { key: 'botanical_sage', label: '🌿 Botanical Sage Spa', primary: '#10B981', bg: '#06110D' },
                      { key: 'pastel_pink', label: '🌸 Pastel Pink Nails', primary: '#F43F5E', bg: '#0F0910' },
                      { key: 'cyber_neon', label: '⚡ Cyber Neon Barber', primary: '#06B6D4', bg: '#030712' },
                      { key: 'minimal_white', label: '⚪ Minimalist Clean', primary: '#0F172A', bg: '#FAFAFA' }
                    ].map(theme => (
                      <button
                        key={theme.key}
                        type="button"
                        onClick={() => handleApplyThemePreset(theme.key)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          studioState.theme.presetName === theme.key
                            ? 'border-[#FF5A36] bg-[#FF5A36]/10 shadow-lg shadow-[#FF5A36]/10'
                            : 'border-white/10 bg-[#141926] hover:border-white/20'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-black text-white block">{theme.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{theme.primary}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.primary }} />
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.bg }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="p-4 rounded-2xl bg-[#141926] border border-white/10 space-y-3">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Ajuste Fino de Colores:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Color Primario</span>
                      <div className="flex items-center gap-2 bg-[#090B10] p-1.5 rounded-xl border border-white/10">
                        <input
                          type="color"
                          value={studioState.theme.primaryColor}
                          onChange={(e) => setStudioState(prev => ({
                            ...prev,
                            theme: { ...prev.theme, primaryColor: e.target.value, presetName: 'custom' }
                          }))}
                          className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-white font-bold">{studioState.theme.primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Color de Fondo</span>
                      <div className="flex items-center gap-2 bg-[#090B10] p-1.5 rounded-xl border border-white/10">
                        <input
                          type="color"
                          value={studioState.theme.backgroundColor}
                          onChange={(e) => setStudioState(prev => ({
                            ...prev,
                            theme: { ...prev.theme, backgroundColor: e.target.value, presetName: 'custom' }
                          }))}
                          className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                        />
                        <span className="text-xs font-mono text-white font-bold">{studioState.theme.backgroundColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep('business')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF5A36]/30 cursor-pointer hover:opacity-95"
                >
                  <span>Siguiente: Datos del Negocio & Maps →</span>
                </button>
              </div>
            )}

            {/* ===============================================================
                PASO 2: DATOS DEL NEGOCIO & GOOGLE MAPS
                =============================================================== */}
            {activeStep === 'business' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36]">PASO 2: INFORMACIÓN LOCAL</span>
                    <h3 className="text-xl font-black text-white mt-0.5">Identidad & Contacto</h3>
                  </div>
                  <label className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                    Cargar DATOS_NEGOCIO.json
                    <input type="file" accept=".json" onChange={handleJsonUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nombre del Negocio *</label>
                    <input
                      type="text"
                      value={studioState.businessName}
                      onChange={(e) => setStudioState(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-[#FF5A36] focus:outline-none"
                      placeholder="Ej. Luxus Beauty Spa"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Eslogan Atractivo</label>
                    <input
                      type="text"
                      value={studioState.slogan}
                      onChange={(e) => setStudioState(prev => ({ ...prev, slogan: e.target.value }))}
                      className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF5A36] focus:outline-none"
                      placeholder="Ej. Especialistas en Colorimetría Europea y Balayage"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp de la Dueña *</label>
                      <input
                        type="text"
                        value={studioState.phoneWhatsapp}
                        onChange={(e) => setStudioState(prev => ({ ...prev, phoneWhatsapp: e.target.value }))}
                        className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs font-semibold focus:border-[#FF5A36] focus:outline-none"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad</label>
                      <input
                        type="text"
                        value={studioState.city}
                        onChange={(e) => setStudioState(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF5A36] focus:outline-none"
                        placeholder="Medellín"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Dirección del Salón</label>
                    <input
                      type="text"
                      value={studioState.address}
                      onChange={(e) => setStudioState(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF5A36] focus:outline-none"
                      placeholder="Ej. Carrera 43A # 1Sur-220, El Poblado"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Enlace de Google Maps</label>
                    <input
                      type="url"
                      value={studioState.googleMapsUrl}
                      onChange={(e) => setStudioState(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                      className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:border-[#FF5A36] focus:outline-none"
                      placeholder="https://maps.google.com/?q=..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Horario de Atención</label>
                    <input
                      type="text"
                      value={studioState.scheduleSummary}
                      onChange={(e) => setStudioState(prev => ({ ...prev, scheduleSummary: e.target.value }))}
                      className="w-full bg-[#141926] border border-white/10 rounded-xl p-3 text-white text-xs focus:border-[#FF5A36] focus:outline-none"
                      placeholder="Martes a Sábado: 8:00 AM – 8:00 PM"
                    />
                  </div>

                  {/* Foto de Hero Banner */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Foto Principal (Hero Banner)</label>
                    <div className="flex items-center gap-3 p-3 bg-[#141926] rounded-xl border border-white/10">
                      <img src={studioState.heroImageUrl} alt="Hero" className="w-16 h-12 rounded-lg object-cover" />
                      <div className="flex-1 truncate">
                        <span className="text-xs text-white font-bold block truncate">Imagen de Cabecera</span>
                        <span className="text-[10px] text-slate-400">CDN WebP Ultra-Rápido</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget({ type: 'hero' })}
                        className="px-3 py-1.5 rounded-lg bg-[#FF5A36] text-white text-xs font-bold hover:bg-[#E54E07] cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('reference')}
                    className="w-1/3 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep('services')}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Servicios →</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                PASO 3: CATÁLOGO DE SERVICIOS
                =============================================================== */}
            {activeStep === 'services' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36]">PASO 3: CATÁLOGO</span>
                    <h3 className="text-xl font-black text-white mt-0.5">Servicios & Fotos</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `srv-${Date.now()}`;
                      setStudioState(prev => ({
                        ...prev,
                        services: [
                          ...prev.services,
                          {
                            id: newId,
                            titulo: 'Nuevo Servicio Exclusivo',
                            descripcion: 'Tratamiento profesional de alta gama.',
                            precio_cop: 85000,
                            duracion_minutos: 60,
                            imagen_url: getSuggestedImageForService('corte')
                          }
                        ]
                      }));
                    }}
                    className="bg-[#FF5A36]/10 border border-[#FF5A36]/40 text-[#FF5A36] hover:bg-[#FF5A36] hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Servicio</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {studioState.services.map((srv, idx) => (
                    <div key={srv.id} className="p-4 rounded-2xl bg-[#141926] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={srv.imagen_url}
                            alt={srv.titulo}
                            className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={() => setMediaPickerTarget({ type: 'service', id: srv.id })}
                            className="text-[10px] bg-white/10 hover:bg-[#FF5A36] text-white px-2 py-1 rounded-md font-bold cursor-pointer"
                          >
                            🖼️ Cambiar Foto
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (studioState.services.length <= 1) return;
                            setStudioState(prev => ({
                              ...prev,
                              services: prev.services.filter(s => s.id !== srv.id)
                            }));
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={srv.titulo}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStudioState(prev => ({
                              ...prev,
                              services: prev.services.map(s => s.id === srv.id ? { ...s, titulo: val } : s)
                            }));
                          }}
                          className="bg-[#090B10] border border-white/10 rounded-lg p-2 text-xs text-white font-bold focus:outline-none"
                          placeholder="Nombre del Servicio"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-bold">$</span>
                          <input
                            type="number"
                            value={srv.precio_cop}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setStudioState(prev => ({
                                ...prev,
                                services: prev.services.map(s => s.id === srv.id ? { ...s, precio_cop: val } : s)
                              }));
                            }}
                            className="w-full bg-[#090B10] border border-white/10 rounded-lg p-2 text-xs text-emerald-300 font-bold focus:outline-none"
                            placeholder="Precio COP"
                          />
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={srv.descripcion}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStudioState(prev => ({
                            ...prev,
                            services: prev.services.map(s => s.id === srv.id ? { ...s, descripcion: val } : s)
                          }));
                        }}
                        className="w-full bg-[#090B10] border border-white/10 rounded-lg p-2 text-[11px] text-slate-300 focus:outline-none"
                        placeholder="Descripción breve de beneficios"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('business')}
                    className="w-1/3 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep('team')}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Especialistas →</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                PASO 4: EQUIPO & ESPECIALISTAS
                =============================================================== */}
            {activeStep === 'team' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A36]">PASO 4: EQUIPO</span>
                    <h3 className="text-xl font-black text-white mt-0.5">Especialistas & Avatares</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `esp-${Date.now()}`;
                      setStudioState(prev => ({
                        ...prev,
                        specialists: [
                          ...prev.specialists,
                          {
                            id: newId,
                            nombre: 'Especialista Máster',
                            rol: 'Colorista & Asesor de Imagen',
                            avatar_url: getSpecialistAvatar(prev.specialists.length),
                            especialidad: 'Atención personalizada'
                          }
                        ]
                      }));
                    }}
                    className="bg-[#FF5A36]/10 border border-[#FF5A36]/40 text-[#FF5A36] hover:bg-[#FF5A36] hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Agregar Miembro</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {studioState.specialists.map((esp, idx) => (
                    <div key={esp.id} className="p-4 rounded-2xl bg-[#141926] border border-white/10 flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={esp.avatar_url}
                          alt={esp.nombre}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#FF5A36]"
                        />
                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget({ type: 'specialist', id: esp.id })}
                          className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#FF5A36] text-white cursor-pointer shadow-md"
                          title="Cambiar avatar"
                        >
                          <ImageIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={esp.nombre}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStudioState(prev => ({
                              ...prev,
                              specialists: prev.specialists.map(s => s.id === esp.id ? { ...s, nombre: val } : s)
                            }));
                          }}
                          className="w-full bg-[#090B10] border border-white/10 rounded-lg p-1.5 text-xs text-white font-bold focus:outline-none"
                          placeholder="Nombre del profesional"
                        />
                        <input
                          type="text"
                          value={esp.rol}
                          onChange={(e) => {
                            const val = e.target.value;
                            setStudioState(prev => ({
                              ...prev,
                              specialists: prev.specialists.map(s => s.id === esp.id ? { ...s, rol: val } : s)
                            }));
                          }}
                          className="w-full bg-[#090B10] border border-white/10 rounded-lg p-1.5 text-[11px] text-slate-300 focus:outline-none"
                          placeholder="Rol / Cargo"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStudioState(prev => ({
                            ...prev,
                            specialists: prev.specialists.filter(s => s.id !== esp.id)
                          }));
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep('services')}
                    className="w-1/3 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    ← Volver
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep('preview')}
                    className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-pink-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Siguiente: Live Preview & Publicar →</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===============================================================
                PASO 5: RESUMEN DE PUBLICACIÓN & PITCH WHATSAPP
                =============================================================== */}
            {activeStep === 'preview' && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">PASO 5: PUBLICACIÓN</span>
                  <h3 className="text-xl font-black text-white mt-0.5">Listo para Publicar</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Revisa el diseño en vivo en el panel derecho. Al publicar se creará la web de regalo con agendador inyectado.
                  </p>
                </div>

                {publishedSite ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>¡PÁGINA WEB PUBLICADA CON ÉXITO!</span>
                    </div>

                    <div className="p-3 bg-[#0A0D14] rounded-xl border border-white/10 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Enlace Público Oficial:</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-white truncate">
                          {window.location.origin}/sitio/{publishedSite.slug}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/sitio/${publishedSite.slug}`);
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                            title="Copiar enlace"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/sitio/${publishedSite.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#FF5A36] text-white"
                            title="Abrir sitio web"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                      {copiedLink && <span className="text-[10px] text-emerald-400 font-bold block">✓ Enlace copiado</span>}
                    </div>

                    {/* Pitch de WhatsApp */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Mensaje WhatsApp para la Dueña:</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatePitchText());
                            setCopiedPitch(true);
                            setTimeout(() => setCopiedPitch(false), 2000);
                          }}
                          className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copiar Texto</span>
                        </button>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0A0D14] text-[11px] text-slate-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                        {generatePitchText()}
                      </div>
                      {copiedPitch && <span className="text-[10px] text-emerald-400 font-bold block">✓ Texto copiado</span>}

                      <a
                        href={`https://wa.me/${publishedSite.phone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(generatePitchText())}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                        <span>Enviar WhatsApp a la Dueña ({publishedSite.phone_whatsapp})</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublish}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-orange-500 to-pink-500 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-[#FF5A36]/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
                    >
                      {isPublishing ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>{isPublishing ? 'Publicando y Optimizando Sitio...' : '🚀 Publicar Sitio Gancho en 1-Clic'}</span>
                    </button>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inyección Automática de Agendador</span>
                      </div>
                      <p className="text-[11px]">
                        El sitio incluirá botón de reservas online vinculado al catálogo de {studioState.businessName} y banner para activar 14 días gratis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* COLUMNA DERECHA: LIVE PREVIEW SPLIT-SCREEN (7 COLS) */}
          <div className="lg:col-span-7 bg-[#07090E] flex flex-col overflow-hidden">
            
            {/* Live Preview Toolbar */}
            <div className="px-4 py-2.5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-white">Live Preview Interactivo</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({(compiledHtml.length / 1024).toFixed(1)} KB)</span>
              </div>

              {/* Device Switcher */}
              <div className="flex items-center bg-[#090B10] p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 font-bold text-[11px] transition-all cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-[#FF5A36] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vista Escritorio"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg flex items-center gap-1 font-bold text-[11px] transition-all cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-[#FF5A36] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vista Móvil (iPhone)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Móvil</span>
                </button>
              </div>
            </div>

            {/* Iframe Viewport Container */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#05070A]">
              <div
                className={`transition-all duration-300 shadow-2xl overflow-hidden rounded-2xl border border-white/20 ${
                  previewDevice === 'mobile'
                    ? 'w-[375px] h-[667px] ring-8 ring-[#1C2333] rounded-[40px]'
                    : 'w-full h-full'
                }`}
              >
                <iframe
                  title="Live Preview"
                  srcDoc={compiledHtml}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================================
          SUBMODAL: SELECTOR DE IMÁGENES DE LA BIBLIOTECA
          =================================================================== */}
      {mediaPickerTarget && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121624] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
            
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#151c2e]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#FF5A36]" />
                <h4 className="text-sm font-black text-white">Seleccionar Imagen de la Biblioteca</h4>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerTarget(null)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subir Nueva Foto */}
            <form onSubmit={handleAddCustomImage} className="p-3 bg-[#0A0D14] border-b border-white/10 flex gap-2">
              <input
                type="url"
                value={customImageUrlInput}
                onChange={(e) => setCustomImageUrlInput(e.target.value)}
                placeholder="Pegar enlace de imagen URL (https://...)"
                className="flex-1 bg-[#141926] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#FF5A36] text-white font-bold text-xs hover:bg-[#E54E07] cursor-pointer shrink-0"
              >
                + Usar URL
              </button>
            </form>

            {/* Categorías Filter */}
            <div className="px-4 py-2 border-b border-white/10 bg-[#0c101a] flex gap-2 overflow-x-auto">
              {['todos', 'hero_salon', 'hero_spa', 'hero_barber', 'hero_nails', 'color', 'cortes', 'keratina', 'nails', 'spa_facial', 'barberia', 'maquillaje', 'especialistas'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMediaFilterCat(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer ${
                    mediaFilterCat === cat ? 'bg-[#FF5A36] text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-1">
              {allMedia
                .filter(img => mediaFilterCat === 'todos' || img.category === mediaFilterCat)
                .map(img => (
                  <div
                    key={img.id}
                    onClick={() => handleSelectMediaItem(img.url)}
                    className="relative group rounded-xl overflow-hidden border border-white/10 hover:border-[#FF5A36] cursor-pointer h-28"
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <span className="text-[11px] font-bold text-white">✓ Seleccionar</span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
