import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Check } from 'lucide-react';
import { 
  BEAUTY_STOCK_CATEGORIES, 
  BEAUTY_STOCK_IMAGES, 
  BEAUTY_IMAGE_TYPES 
} from '../../data/beautyStockImages';
import { BeautyStockImage, BeautyImageType } from '../../types/keweBeauty';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  const filteredImages = useMemo(() => {
    return BEAUTY_STOCK_IMAGES.filter((img) => {
      // Filtro de categoría
      if (selectedCategory !== 'todos' && img.category !== selectedCategory) {
        return false;
      }
      // Filtro de tipo de formato
      if (selectedType !== 'todos' && img.imageType !== selectedType) {
        return false;
      }
      // Búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = img.title.toLowerCase().includes(q);
        const matchTag = img.tags.some(t => t.toLowerCase().includes(q));
        return matchTitle || matchTag;
      }
      return true;
    });
  }, [selectedCategory, selectedType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg sm:text-xl">Biblioteca de Imágenes para Salones & Barberías</h3>
              <p className="text-xs text-muted-foreground">Fotos HD profesionales optimizadas para servicios, portadas y galerías</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filtros de Tipo / Ratio */}
        <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-border/50 flex items-center gap-2 overflow-x-auto hide-scrollbar">
          {BEAUTY_IMAGE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedType === type.id 
                  ? 'bg-amber-500 text-black shadow-sm font-black' 
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
              <span className="text-[10px] opacity-70">({type.ratio})</span>
            </button>
          ))}
        </div>

        {/* Buscador & Categorías de Nicho */}
        <div className="p-4 sm:px-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-muted-foreground" />
            <Input 
              placeholder="Buscar por fade, balayage, acrílicas, spa, cejas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
            {BEAUTY_STOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedCategory === cat.id 
                    ? 'bg-foreground text-background' 
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Imágenes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredImages.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground">
              <Sparkles size={32} className="mx-auto mb-2 opacity-40 text-amber-500" />
              <p className="text-sm font-bold">No se encontraron imágenes</p>
              <p className="text-xs">Prueba con otra palabra clave o quita los filtros</p>
            </div>
          ) : (
            filteredImages.map((img) => {
              const isSelected = currentSelectedUrl === img.imageUrl;
              return (
                <div 
                  key={img.id}
                  onClick={() => {
                    onSelectImage(img.imageUrl);
                    onClose();
                  }}
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] shadow-sm flex flex-col bg-card ${
                    isSelected ? 'ring-2 ring-amber-500 border-amber-500' : 'border-border/60 hover:border-amber-500/50'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-secondary">
                    <img 
                      src={img.thumbnailUrl} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-md">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-amber-500 transition-colors">
                      {img.title}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                      <span className="capitalize">{img.categoryLabel}</span>
                      <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-[9px] uppercase">{img.imageType}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default BeautyImageGalleryModal;
