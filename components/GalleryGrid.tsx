import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Maximize2, X, Upload, Loader2, RefreshCw } from 'lucide-react';
import { GalleryItem, fetchGalleryImages, openUploadWidget } from '../services/galleryService';
import { isAuthenticated } from '../services/authService';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'food', label: 'Food 🍔', icon: null },
  { id: 'events', label: 'Events 🎤', icon: null },
  { id: 'sports', label: 'Sports ⚽', icon: null },
];

const GalleryGrid: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const isAdmin = isAuthenticated();

  const loadImages = async () => {
    setLoading(true);
    const data = await fetchGalleryImages(filter);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, [filter]);

  const handleUpload = () => {
    let uploadCategory = filter;
    
    if (filter === 'all') {
        const choice = window.prompt('Select category for upload:\n1. Food\n2. Events\n3. Sports', '1');
        if (choice === '1') uploadCategory = 'food';
        else if (choice === '2') uploadCategory = 'events';
        else if (choice === '3') uploadCategory = 'sports';
        else return; // Cancelled
    }

    openUploadWidget(uploadCategory, (url) => {
      console.log('Uploaded successfully:', url);
      loadImages(); // Refresh
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === cat.id
                  ? 'bg-[#ff3b3b] text-white shadow-lg shadow-[#ff3b3b]/20 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
              }`}
            >
              <Filter size={14} aria-hidden="true" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button 
                onClick={loadImages}
                className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#ff3b3b] transition-all shadow-sm"
                title="Refresh Gallery"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            </button>
            
            {isAdmin && (
                <button
                onClick={handleUpload}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-xl bg-[#ff3b3b] text-white hover:bg-[#e63535] hover:-translate-y-1 active:scale-95"
                >
                <Upload size={18} aria-hidden="true" />
                Upload {filter !== 'all' ? `to ${filter}` : 'Image'}
                </button>
            )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={48} className="text-[#ff3b3b] animate-spin" aria-hidden="true" />
          <p className="text-gray-400 font-medium animate-pulse">Fetching visuals...</p>
        </div>
      ) : items.length > 0 ? (
        <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="group relative aspect-square rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/10"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.url}
                  alt={`Gallery image - ${item.category} at KOS Sports Café`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#ff3b3b] font-black mb-1">
                    {item.category}
                  </span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold text-lg">Visual Entry</h4>
                    <Maximize2 size={18} className="text-white/70" aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-400 text-lg">No images found in this category yet.</p>
          {isAdmin && <p className="text-sm text-gray-500 mt-2">Start by uploading something epic!</p>}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[110]"
            >
              <X size={24} aria-hidden="true" />
            </button>
            <motion.img
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              src={selectedImage.url}
              alt={`Full screen preview: ${selectedImage.category} at KOS Sports Café`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white">
                <p className="text-[#ff3b3b] font-black tracking-widest uppercase text-xs mb-2">{selectedImage.category}</p>
                <p className="text-white/60 text-sm">{new Date(selectedImage.createdAt).toLocaleDateString()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
