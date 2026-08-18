import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Sparkles, Check, Trash2, Camera, RefreshCw } from 'lucide-react';
import { compressImage, formatBytes, CompressionResult } from '../utils/imageCompressor';
import { api } from '../lib/supabase';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  theme?: 'dark' | 'light';
  aspectRatio?: 'square' | 'banner';
  maxWidth?: number;
  className?: string;
}

const PRESET_AVATARS = [
  {
    label: 'Colorista & Balayage',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Estilista Master',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Barber & Fade',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Nails & Spa Artist',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Tratamientos & Keratinas',
    url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Especialista Capilar',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  }
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Foto de Perfil',
  theme = 'dark',
  aspectRatio = 'square',
  maxWidth = 400,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<CompressionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const result = await compressImage(file, {
        maxWidth,
        maxHeight: maxWidth,
        quality: 0.82,
        mimeType: 'image/webp',
        cropSquare: aspectRatio === 'square'
      });

      setStats(result);

      // Try uploading to Supabase Storage bucket 'avatars'
      const storageUrl = await api.uploadAvatar(result.blob, file.name);
      if (storageUrl) {
        onChange(storageUrl);
      } else {
        // Fallback to lightweight compressed WebP DataURL (<35KB)
        onChange(result.dataUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2.5 text-xs ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-slate-400 font-semibold">{label}</label>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'upload' ? 'bg-[#FF5A36] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-2.5 h-2.5" />
            <span>Subir</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preset')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'preset' ? 'bg-[#FF5A36] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Galería</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeMode === 'url' ? 'bg-[#FF5A36] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-2.5 h-2.5" />
            <span>URL</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`p-3 rounded-2xl border ${isDark ? 'bg-[#0E121B] border-white/10' : 'bg-[#F9FAFC] border-black/10'}`}>
        <div className="flex items-center gap-4">
          
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center ${
              value ? 'border-[#FF5A36]' : 'border-dashed border-slate-400 dark:border-slate-600 bg-white/5'
            }`}>
              {value ? (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              ) : (
                <Camera className="w-6 h-6 text-slate-400" />
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-all cursor-pointer"
                title="Eliminar foto"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mode-Specific Content Area */}
          <div className="flex-1 min-w-0">
            {activeMode === 'upload' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-xl border border-dashed text-center transition-all cursor-pointer ${
                  isDragOver
                    ? 'border-[#FF5A36] bg-[#FF5A36]/10'
                    : isDark
                      ? 'border-white/15 bg-white/5 hover:border-[#FF5A36]/60 hover:bg-white/10'
                      : 'border-slate-300 bg-white hover:border-[#FF5A36]/60 shadow-sm'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2 text-slate-400 py-1">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#FF5A36]" />
                    <span className="font-semibold">Optimizando y convirtiendo a WebP...</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="font-bold text-[#FF5A36] block">
                      Haz clic para subir o arrastra una imagen
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Se optimizará automáticamente a WebP ultraligero (~25 KB)
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeMode === 'preset' && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Selecciona una foto profesional:</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = value === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          onChange(preset.url);
                          setStats(null);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                          isSelected ? 'border-[#FF5A36] ring-2 ring-[#FF5A36]/30' : 'border-transparent hover:border-white/40'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#FF5A36]/60 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeMode === 'url' && (
              <div className="space-y-1">
                <input
                  type="url"
                  value={value.startsWith('data:') ? '' : value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setStats(null);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className={`w-full border rounded-xl p-2 focus:outline-none focus:border-[#FF5A36] text-xs font-mono ${
                    isDark ? 'bg-[#141926] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'
                  }`}
                />
                <span className="text-[10px] text-slate-400 block">
                  Pega un enlace directo de imagen HTTPS (Unsplash, Cloudinary, etc.)
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Compression Statistics Badge */}
        {stats && (
          <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3 h-3 shrink-0" />
              <span>Optimizado: {formatBytes(stats.originalSize)} ➔ {formatBytes(stats.compressedSize)} (-{stats.reductionPct}%)</span>
            </div>
            <span className="font-mono text-slate-400 font-bold">{stats.width}x{stats.height} px (WebP)</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-2 text-[10px] text-red-400 font-semibold">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
