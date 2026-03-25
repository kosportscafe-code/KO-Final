import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Trash2, CheckCircle, AlertCircle, ImageIcon, X } from 'lucide-react';
import { getMediaItems, saveMediaItem, deleteMediaItem, MediaItem } from '../services/mediaService';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 4;

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

type Toast = { id: string; type: 'success' | 'error'; message: string };

const AdminMedia: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(getMediaItems);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        addToast('error', `"${file.name}" is not a supported format (JPG, PNG, WEBP only).`);
        return false;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        addToast('error', `"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of validFiles) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const item: MediaItem = {
            id: `media_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            filename: file.name,
            type: file.type,
            dataUrl,
            uploadedAt: new Date().toISOString(),
            sizeBytes: file.size,
          };
          try {
            saveMediaItem(item);
            setMediaItems(getMediaItems());
            successCount++;
          } catch {
            addToast('error', `Failed to save "${file.name}". Storage may be full.`);
          }
          resolve();
        };
        reader.onerror = () => {
          addToast('error', `Failed to read "${file.name}".`);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setUploading(false);
    if (successCount > 0) {
      addToast('success', `${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully.`);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleCopy = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.dataUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      addToast('error', 'Failed to copy URL. Please try again.');
    }
  };

  const handleDelete = (id: string) => {
    deleteMediaItem(id);
    setMediaItems(getMediaItems());
    addToast('success', 'Image deleted.');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium pointer-events-auto transition-all ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
            <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="ml-1 opacity-80 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-500 text-sm mt-1">{mediaItems.length} image{mediaItems.length !== 1 ? 's' : ''} stored</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-bronze text-white rounded-xl font-semibold hover:bg-bronze/80 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-10 select-none ${
          isDragging
            ? 'border-bronze bg-bronze/5 scale-[1.01]'
            : 'border-gray-200 bg-white hover:border-bronze/50 hover:bg-gray-50'
        }`}
      >
        <div className={`mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-bronze/10' : 'bg-gray-100'}`}>
          <ImageIcon size={28} className={isDragging ? 'text-bronze' : 'text-gray-400'} />
        </div>
        <p className="font-semibold text-gray-700 text-lg">
          {isDragging ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-gray-400 text-sm mt-1">or click to browse · JPG, PNG, WEBP · max {MAX_SIZE_MB}MB each</p>
      </div>

      {/* Gallery Grid */}
      {mediaItems.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No images uploaded yet.</p>
          <p className="text-sm mt-1">Upload your first image using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-gray-50 overflow-hidden">
                <img
                  src={item.dataUrl}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatBytes(item.sizeBytes)} · {formatDate(item.uploadedAt)}
                </p>
                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleCopy(item)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      copiedId === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-bronze/10 hover:text-bronze'
                    }`}
                  >
                    {copiedId === item.id ? <CheckCircle size={13} /> : <Copy size={13} />}
                    {copiedId === item.id ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
