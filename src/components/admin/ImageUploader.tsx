"use client";
import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ZoomIn, Maximize, Settings2 } from 'lucide-react';
import { uploadImageAdmin } from '../../server/actions/admin';

export interface ImageConfig {
  scale?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  objectPosition?: string;
  borderRadius?: string;
}

interface ImageUploaderProps {
  url: string | null;
  config: ImageConfig | null;
  onUrlChange: (url: string) => void;
  onConfigChange: (config: ImageConfig) => void;
  bucket?: string;
  className?: string;
}

export default function ImageUploader({ 
  url, 
  config, 
  onUrlChange, 
  onConfigChange, 
  bucket = 'products',
  className = '' 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentConfig: ImageConfig = {
    scale: 1,
    objectFit: 'cover',
    objectPosition: 'center',
    ...config,
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileName', fileName);

      const { url: uploadedUrl, error } = await uploadImageAdmin(fd);

      if (error || !uploadedUrl) {
        throw new Error(error || 'Upload failed');
      }

      onUrlChange(uploadedUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!url && (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <Upload className="w-10 h-10 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-300">اسحب الصورة هنا أو اضغط للرفع</p>
          <p className="text-sm text-gray-500 mt-2">JPG, PNG, WebP حتى 5MB</p>
          {isUploading && <p className="text-brand-primary mt-2">جاري الرفع...</p>}
        </div>
      )}

      {url && (
        <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-brand-primary" />
              معاينة مباشرة (Live Preview)
            </h3>
            <button 
              onClick={() => onUrlChange('')} 
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              type="button"
            >
              <X className="w-4 h-4" /> إزالة الصورة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-600 bg-gray-900 flex justify-center items-center">
              <img 
                src={url} 
                alt="Preview" 
                style={{
                  transform: `scale(${currentConfig.scale})`,
                  objectFit: currentConfig.objectFit,
                  objectPosition: currentConfig.objectPosition,
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between text-sm text-gray-300 mb-2">
                  <span className="flex items-center gap-1"><ZoomIn className="w-4 h-4"/> Scale (Zoom)</span>
                  <span>{currentConfig.scale}x</span>
                </label>
                <input 
                  type="range" 
                  min="0.5" max="2" step="0.1" 
                  value={currentConfig.scale} 
                  onChange={(e) => onConfigChange({ ...currentConfig, scale: parseFloat(e.target.value) })}
                  className="w-full accent-brand-primary"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm text-gray-300 mb-2">
                  <Maximize className="w-4 h-4"/> Object Fit
                </label>
                <div className="flex bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  <button 
                    type="button"
                    onClick={() => onConfigChange({ ...currentConfig, objectFit: 'cover' })}
                    className={`flex-1 py-1.5 text-sm ${
                      currentConfig.objectFit === 'cover' ? 'bg-brand-primary text-black font-semibold' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >Cover</button>
                  <button 
                    type="button"
                    onClick={() => onConfigChange({ ...currentConfig, objectFit: 'contain' })}
                    className={`flex-1 py-1.5 text-sm ${
                      currentConfig.objectFit === 'contain' ? 'bg-brand-primary text-black font-semibold' : 'text-gray-400 hover:bg-gray-800'
                    }`}
                  >Contain</button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm text-gray-300 mb-2">
                  <Settings2 className="w-4 h-4"/> Alignment
                </label>
                <select 
                  value={currentConfig.objectPosition}
                  onChange={(e) => onConfigChange({ ...currentConfig, objectPosition: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
