import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { 
  BEAUTY_STOCK_CATEGORIES, 
  BEAUTY_STOCK_IMAGES, 
  BEAUTY_IMAGE_TYPES 
} from '../../data/beautyStockImages';
import { 
  StockImageItem, 
  getManagedStockLibrary, 
  fetchStockLibraryFromSupabase 
} from '../../lib/beautyImageLibrary';
import { BeautyStockImage, BeautyImageType } from '../../types';

interface BeautyImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialCategory?: string;
  initialType?: BeautyImageType | 'todos';
  currentSelectedUrl?: string;
}

export const BeautyImageGalleryModal: React.FC<BeautyImageGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  initialCategory,
  initialType = 'todos',
  currentSelectedUrl
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'todos');
  const [selectedType, setSelectedType] = useState<BeautyImageType | 'todos'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicStock, setDynamicStock] = useState<StockImageItem[]>(() => {
    try {
      return getManagedStockLibrary();
    } catch {
      return [];
    }
  });

  // Cargar en vivo la biblioteca completa de Supabase (53+ imágenes WebP HD)
  useEffect(() => {
    fetchStockLibraryFromSupabase().then((items) => {
      if (items && items.length > 0) {
        setDynamicStock(items);
      }
    });
  }, []);

  // Unificar recursos dinámicos de Supabase con el catálogo base
  const allImages = useMemo<BeautyStockImage[]>(() => {
    const mappedDynamic: BeautyStockImage[] = dynamicStock.map((item) => {
      let cat: 'barberia' | 'peluqueria' | 'unas' | 'pestanas' | 'spa' | 'todos' = 'barberia';
      let catLabel = 'Barbería Clásica & Fade';
      const catLower = item.category.toLowerCase();
      const tagsLower = item.tags.map(t => t.toLowerCase());

      if (
        catLower.includes('barber') || 
        tagsLower.some(t => t.includes('barber') || t.includes('fade') || t.includes('barba'))
      ) {
        cat = 'barberia';
        catLabel = 'Barbería Clásica & Fade';
      } else if (
        catLower.includes('salon') || 
        catLower === 'color' || 
        catLower === 'cortes' || 
        catLower === 'keratina' ||
        tagsLower.some(t => t.includes('balayage') || t.includes('peluqueria') || t.includes('cabello'))
      ) {
        cat = 'peluqueria';
        catLabel = 'Peluquería Femenina & Color';
      } else if (
        catLower.includes('nails') || 
        tagsLower.some(t => t.includes('nail') || t.includes('uña') || t.includes('manicura') || t.includes('acrilic'))
      ) {
        cat = 'unas';
        catLabel = 'Nails Bar & Manicura Spa';
      } else if (
        catLower.includes('spa') || 
        catLower === 'spa_facial' || 
        tagsLower.some(t => t.includes('spa') || t.includes('facial') || t.includes('masaje') || t.includes('relax'))
      ) {
        cat = 'spa';
        catLabel = 'Spa, Facial & Bienestar';
      } else if (
        tagsLower.some(t => t.includes('ceja') || t.includes('pestana') || t.includes('lash') || t.includes('brow'))
      ) {
        cat = 'pestanas';
        catLabel = 'Lash & Brow Studio';
      }

      // Determinar formato sugerido (Móvil, Desktop o Servicio)
      let imageType: BeautyImageType = 'servicio';
      if (catLower.startsWith('hero_') || tagsLower.includes('general') || tagsLower.includes('desktop') || tagsLower.includes('portada')) {
        imageType = 'hero_desktop';
      }
      if (tagsLower.includes('movil') || tagsLower.includes('vertical')) {
        imageType = 'hero_mobile';
      }

      return {
        id: item.id,
        title: item.title,
        category: cat,
        categoryLabel: catLabel,
        imageType,
        imageUrl: item.url,
        thumbnailUrl: item.url,
        tags: item.tags || []
      };
    });

    // Unificar con imágenes base evitando duplicados de URL
    const existingUrls = new Set(mappedDynamic.map(img => img.imageUrl));
    const extraStatic = BEAUTY_STOCK_IMAGES.filter(img => !existingUrls.has(img.imageUrl));

    return [...mappedDynamic, ...extraStatic];
  }, [dynamicStock]);

  const filteredImages = useMemo(() => {
    return allImages.filter((img) => {
      // 1. Filtro de categoría
      if (selectedCategory !== 'todos' && img.category !== selectedCategory) {
        return false;
      }

      // 2. Filtro de tipo de formato inteligente
      if (selectedType !== 'todos') {
        const tags = (img.tags || []).map(t => t.toLowerCase());
        if (selectedType === 'hero_mobile') {
          const isMobileCandidate = 
            img.imageType === 'hero_mobile' ||
            tags.includes('movil') ||
            tags.includes('vertical') ||
            (img.imageType === 'hero_desktop' && selectedCategory !== 'todos'); // Las fotos hero de la especialidad también son válidas en móviles
          if (!isMobileCandidate) return false;
        } else if (selectedType === 'hero_desktop') {
          const isDesktopCandidate = 
            img.imageType === 'hero_desktop' ||
            tags.includes('desktop') ||
            tags.includes('general') ||
            tags.includes('portada') ||
            (img.category === 'barberia' && tags.includes('movil'));
          if (!isDesktopCandidate) return false;
        } else if (img.imageType !== selectedType) {
          return false;
        }
      }

      // 3. Búsqueda por texto o tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = img.title.toLowerCase().includes(q);
        const matchTag = img.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchTag;
      }

      return true;
    });
  }, [allImages, selectedCategory, selectedType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e121b] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#121624]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-pink-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5A36]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Biblioteca de Recursos Visuales HD
              </h3>
              <p className="text-xs text-slate-400">
                Fotografías profesionales de alta resolución libres de derechos para salones y barberías
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Filtros & Búsqueda */}
        <div className="p-4 border-b border-white/5 space-y-3 bg-[#0a0d14]/70">
          
          {/* Fila 1: Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por estilo, técnica o palabras clave (fade, balayage, acrílicas, spa, cejas)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Fila 2: Categorías de Especialidad */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {BEAUTY_STOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5A36] text-white shadow-md shadow-[#FF5A36]/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Fila 3: Filtro de Formato (16:9, 4:5, 1:1) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
            <span className="text-slate-500 font-bold shrink-0 mr-1">Formato:</span>
            {BEAUTY_IMAGE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.name} ({t.ratio})
              </button>
            ))}
          </div>
        </div>

        {/* Galería de Imágenes en Cuadrícula */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {filteredImages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs">No se encontraron imágenes con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredImages.map((img) => {
                const isSelected = currentSelectedUrl === img.imageUrl;
                return (
                  <div
                    key={img.id}
                    onClick={() => {
                      onSelectImage(img.imageUrl);
                      onClose();
                    }}
                    className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${
                      isSelected 
                        ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/60 shadow-lg shadow-[#FF5A36]/20' 
                        : 'border-white/10 hover:border-white/30 bg-black/40'
                    }`}
                  >
                    <div className="aspect-square relative overflow-hidden bg-zinc-900">
                      <img
                        src={img.thumbnailUrl || img.imageUrl}
                        alt={img.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Badge Formato */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-[9px] font-black text-amber-400 uppercase tracking-wider">
                        {img.imageType || '1:1'}
                      </span>

                      {/* Check si está seleccionada */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}

                      {/* Overlay Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                        <span className="text-[10px] font-black text-white leading-tight line-clamp-2">
                          {img.title}
                        </span>
                        <span className="text-[9px] text-amber-300 font-bold mt-1">
                          Click para aplicar ➔
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-[#0e121b]">
                      <p className="text-[11px] font-bold text-white truncate">{img.title}</p>
                      <p className="text-[9px] text-slate-400 truncate">{img.categoryLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#0e121b] flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Mostrando: <strong className="text-white">{filteredImages.length}</strong> recursos HD
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default BeautyImageGalleryModal;
