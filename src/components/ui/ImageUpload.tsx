import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  hint?: string;
}

export function ImageUpload({ value, onChange, onClear, label, hint }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('hihi-images')
        .upload(filename, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from('hihi-images')
        .getPublicUrl(data.path);
      onChange(publicUrl);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-slate-600">{label}</label>
      )}
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border-2 border-[#26A69A]/30 aspect-video bg-slate-100"
          >
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {onClear && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClear}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
              >
                <X className="w-4 h-4 text-slate-700" />
              </motion.button>
            )}
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 bg-[#26A69A] text-white text-xs font-semibold rounded-full">
                ✓ Uploaded
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[#FF6F61] bg-[#FF6F61]/5 scale-105'
                : 'border-slate-200 hover:border-[#FF6F61]/50 hover:bg-[#FF6F61]/3'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader className="w-8 h-8 text-[#FF6F61]" />
                </motion.div>
                <p className="text-sm font-medium text-slate-600">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6F61]/20 to-[#26A69A]/20 flex items-center justify-center">
                  {isDragging ? (
                    <Upload className="w-7 h-7 text-[#FF6F61]" />
                  ) : (
                    <Image className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {isDragging ? 'Drop image here' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{hint || 'PNG, JPG up to 5MB'}</p>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}