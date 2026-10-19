import React, { useState, useRef, useEffect } from 'react';
import {
  ImageIcon,
  Upload,
  Sparkles,
  X,
  Check,
  Search,
  Camera,
  RefreshCw
} from 'lucide-react';
import { StockImageItem, getManagedStockLibrary, getSuggestedImageForService, uploadStockImageBlob } from '../lib/beautyImageLibrary';
import { uploadImageToR2 } from '../services/r2Storage';
import { compressImage } from '../utils/imageCompressor';

interface ServiceImagePickerProps {
  value?: string;
  category?: string;
  serviceName?: string;
  onChange: (url: string) => void;
  label?: string;
}

const resolveCategoryKey = (cat?: string): string => {
  if (!cat) return 'all';
  const lower = cat.toLowerCase();
  if (lower.includes('barber') || lower.includes('barba')) return 'barberia';
  if (lower.includes('nail') || lower.includes('uña') || lower.includes('manicur') || lower.includes('pedicur')) return 'nails';
  if (lower.includes('corte') || lower.includes('peinado') || lower.includes('fade')) return 'cortes';
  if (lower.includes('keratina') || lower.includes('alisad') || lower.includes('botox')) return 'keratina';
  if (lower.includes('pesta') || lower.includes('lash') || lower.includes('ceja') || lower.includes('brow')) return 'pestanas';
  if (lower.includes('spa') || lower.includes('facial') || lower.includes('masaje')) return 'spa_facial';
  if (lower.includes('color') || lower.includes('balayage') || lower.includes('mecha') || lower.includes('rubio')) return 'color';
  if (lower.includes('maquillaje') || lower.includes('makeup')) return 'maquillaje';
  return 'all';
};

export const ServiceImagePicker: React.FC<ServiceImagePickerProps> = ({
  value = '',
  category = 'color',
  serviceName = '',
  onChange,
  label = 'Fotografía de Referencia del Servicio'
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload'>('stock');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => resolveCategoryKey(category));
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar automáticamente la categoría seleccionada cuando cambia la categoría del formulario
  useEffect(() => {
    const resolved = resolveCategoryKey(category);
    if (resolved !== 'all') {
      setSelectedCategory(resolved);
    }
  }, [category]);

  const stockCategories = [
    { id: 'all', label: '✨ Todas' },
    { id: 'nails', label: '💅 Uñas & Manicura' },
    { id: 'color', label: '🎨 Color & Balayage' },
    { id: 'cortes', label: '✂️ Cortes & Peinados' },
    { id: 'keratina', label: '✨ Alisados & Keratinas' },
    { id: 'pestanas', label: '👁️ Pestañas & Cejas' },
    { id: 'spa_facial', label: '🧖‍♀️ Spa & Faciales' },
    { id: 'barberia', label: '💈 Barbería & Barba' },
    { id: 'maquillaje', label: '💄 Maquillaje' }
  ];

  const filteredStock = getManagedStockLibrary().filter((item) => {
    if (item.category.startsWith('hero_') || item.category === 'especialistas') return false;

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const res = await compressImage(file, { maxWidth: 900, maxHeight: 900, quality: 0.85 });
      try {
        const fetchRes = await fetch(res.dataUrl);
        const blob = await fetchRes.blob();
        const uploadRes = await uploadImageToR2(blob, `servicio_${serviceName || category || 'custom'}_${Date.now()}`, 'services');
        if (uploadRes.url) {
          onChange(uploadRes.url);
          return;
        }
      } catch (uploadErr) {
        console.warn('Fallback a dataUrl para imagen de servicio:', uploadErr);
      }
      onChange(res.dataUrl);
    } catch (err) {
      console.error('Error compressing uploaded service image:', err);
      alert('Ocurrió un error al procesar la imagen.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
  };

  const suggestedUrl = getSuggestedImageForService(serviceName || 'servicio', category);

  const handleAutoSuggest = () => {
    if (suggestedUrl) {
      onChange(suggestedUrl);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>{label}</span>
        </label>
        
        {/* Sugerencia Rápida con IA / Algoritmo */}
        {suggestedUrl && !value && (
          <button
            type="button"
            onClick={handleAutoSuggest}
            className="text-[11px] font-bold text-[#FF5A36] bg-[#FF5A36]/10 hover:bg-[#FF5A36]/20 px-2.5 py-1 rounded-lg border border-[#FF5A36]/30 flex items-center gap-1 transition-colors cursor-pointer"
            title="Auto-seleccionar foto sugerida según el nombre del servicio"
          >
            <Sparkles className="w-3 h-3" />
            <span>Sugerir Foto</span>
          </button>
        )}

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3 h-3" /> Quitar foto
          </button>
        )}
      </div>

      {/* Sugerencia Rápida de 1 Toque con IA / Algoritmo */}
      {suggestedUrl && !value && (
        <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#FF5A36]/15 via-[#FF5A36]/5 to-transparent border border-[#FF5A36]/30 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={suggestedUrl}
              alt="Foto sugerida"
              className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0 shadow-sm"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-black text-[#FF5A36] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Foto Recomendada para tu Servicio
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Alta resolución, optimizada para catálogo y agendador
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(suggestedUrl)}
            className="px-3 py-1.5 rounded-xl bg-[#FF5A36] hover:bg-[#E54E07] text-white text-xs font-bold shrink-0 shadow-md shadow-[#FF5A36]/20 transition-all cursor-pointer flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Usar Esta</span>
          </button>
        </div>
      )}

      {/* Preview Card cuando hay imagen asignada */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-[#0A0D14] p-2.5 flex items-center gap-3.5 shadow-lg">
          <div className="w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden shrink-0 border border-white/10 relative group">
            <img
              src={value}
              alt="Servicio Preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
              <Check className="w-3 h-3" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foto Asignada al Servicio</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Se visualiza en tu catálogo web y flujo de reservas.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs font-bold text-[#FF5A36] hover:text-[#E54E07] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Cambiar foto
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Selector Tabs (Banco Stock vs Subir Propia) */
        <div className="p-3.5 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3.5 shadow-md">
          
          {/* Sub-tabs switch táctil para móvil */}
          <div className="grid grid-cols-2 rounded-xl bg-white/5 p-1 text-xs font-bold gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-[#FF5A36] to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fotos Profesionales</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Cámara / Galería</span>
            </button>
          </div>

          {/* TAB 1: BANCO STOCK CDN */}
          {activeTab === 'stock' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Category Pills con scroll táctil suave */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {stockCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-xl shrink-0 font-bold transition-all cursor-pointer text-xs ${
                      selectedCategory === c.id
                        ? 'bg-[#FF5A36] text-white shadow-sm'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search Bar táctil */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar fotos de Uñas, Manicura, Balayage, Barbería..."
                  className="w-full bg-[#121624] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              {/* Grid de Fotos de Stock */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-64 sm:max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {filteredStock.map((img) => {
                  const isSelected = value === img.url;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => onChange(img.url)}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                          : 'border-white/10 hover:border-[#FF5A36]'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2">
                        <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                          {img.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SUBIR FOTO PROPIA O PEGAR URL */}
          {activeTab === 'upload' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              
              {/* Zona de Carga / Cámara Móvil con Touch Target Amplio */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-500/70 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all text-center cursor-pointer space-y-2 active:scale-[0.99]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-white block">
                    {isCompressing ? 'Optimizando foto...' : 'Tocar para Tomar Foto o Abrir Galería'}
                  </strong>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Se comprime automáticamente para carga instantánea en teléfonos
                  </span>
                </div>
              </div>

              {/* Direct URL Input */}
              <form onSubmit={handleApplyUrl} className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="O pega un enlace de foto (https://...)"
                  className="flex-1 bg-[#121624] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-all disabled:opacity-50"
                >
                  Usar
                </button>
              </form>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
