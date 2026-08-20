import React, { useState, useRef } from 'react';
import {
  ImageIcon,
  Upload,
  Sparkles,
  X,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import { BEAUTY_STOCK_LIBRARY, StockImageItem } from '../lib/beautyImageLibrary';
import { compressImage } from '../utils/imageCompressor';

interface ServiceImagePickerProps {
  value?: string;
  category?: 'color' | 'corte' | 'keratina' | 'nails' | 'barberia' | 'spa';
  onChange: (url: string) => void;
  label?: string;
}

export const ServiceImagePicker: React.FC<ServiceImagePickerProps> = ({
  value = '',
  category = 'color',
  onChange,
  label = 'Fotografía de Referencia del Servicio'
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload'>('stock');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    category === 'barberia' ? 'barberia' :
    category === 'nails' ? 'nails' :
    category === 'corte' ? 'cortes' :
    category === 'keratina' ? 'keratina' :
    category === 'spa' ? 'spa_facial' : 'color'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtrar categorías del stock
  const stockCategories = [
    { id: 'all', label: 'Todas' },
    { id: 'color', label: 'Color & Balayage' },
    { id: 'cortes', label: 'Cortes & Peinados' },
    { id: 'keratina', label: 'Alisados & Keratinas' },
    { id: 'nails', label: 'Uñas & Manicura' },
    { id: 'spa_facial', label: 'Spa & Limpieza Facial' },
    { id: 'barberia', label: 'Barbería & Barba' },
    { id: 'maquillaje', label: 'Maquillaje & Cejas' }
  ];

  const filteredStock = BEAUTY_STOCK_LIBRARY.filter((item) => {
    // Excluir fachadas y avatares de estilistas para enfoque en tratamientos/servicios
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
      // Compresión inteligente WebP (<100KB)
      const res = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.82 });
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" /> Quitar imagen
          </button>
        )}
      </div>

      {/* Preview Card */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-[#0A0D14] p-2 flex items-center gap-3">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
            <img
              src={value}
              alt="Servicio Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
              <Check className="w-3 h-3" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Imagen Asignada</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Esta foto se mostrará en el catálogo y agendador público.
            </p>
            <button
              type="button"
              onClick={() => onChange('')}
              className="mt-1 text-[11px] font-semibold text-[#FF5A36] hover:underline"
            >
              Cambiar fotografía
            </button>
          </div>
        </div>
      ) : (
        /* Selector Tabs (Banco Stock vs Subir Propia) */
        <div className="p-3.5 rounded-2xl bg-[#0A0D14] border border-white/10 space-y-3">
          
          {/* Sub-tabs switch */}
          <div className="flex rounded-xl bg-white/5 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('stock')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'stock'
                  ? 'bg-gradient-to-r from-[#FF5A36] to-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Banco de Imágenes (Stock CDN)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto Propia</span>
            </button>
          </div>

          {/* TAB 1: BANCO STOCK CDN */}
          {activeTab === 'stock' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {stockCategories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 font-semibold transition-all cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#FF5A36]/20 border border-[#FF5A36] text-[#FF5A36]'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar fotos de Balayage, Uñas, Barbería, Spa..."
                  className="w-full bg-[#121624] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              {/* Grid of Stock Photos */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredStock.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => onChange(img.url)}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#FF5A36] transition-all cursor-pointer"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                      <span className="text-[10px] font-bold text-white leading-tight line-clamp-2 text-left">
                        {img.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUBIR FOTO PROPIA O PEGAR URL */}
          {activeTab === 'upload' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              
              {/* Drag & Drop Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all text-center cursor-pointer space-y-1.5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">
                    {isCompressing ? 'Optimizando imagen...' : 'Sube una foto desde tu equipo'}
                  </strong>
                  <span className="text-[10px] text-slate-400">
                    PNG, JPG, WebP (Se comprime automáticamente)
                  </span>
                </div>
              </div>

              {/* Direct URL Input */}
              <form onSubmit={handleApplyUrl} className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="O pega el enlace URL de la foto (https://...)"
                  className="flex-1 bg-[#121624] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-all disabled:opacity-50"
                >
                  Usar URL
                </button>
              </form>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
