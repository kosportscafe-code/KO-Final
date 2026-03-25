import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight, Loader2 } from 'lucide-react';
import { GalleryItem, fetchGalleryImages } from '../services/galleryService';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreview = async () => {
      const data = await fetchGalleryImages('all');
      setItems(data.slice(0, 6)); // Show only first 6 on homepage
      setLoading(false);
    };
    loadPreview();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff3b3b]/10 border border-[#ff3b3b]/20 text-[#ff3b3b] mb-4 w-fit"
            >
              <Camera size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visuals</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">SHOTS FROM THE <span className="text-[#ff3b3b]">COURT</span></h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Capturing the intensity of the game and the joy of the feast. Our gallery is live and updated in real-time.
            </p>
          </div>
          
          <Link 
            to="/gallery" 
            className="group flex items-center gap-2 text-white font-bold hover:text-[#ff3b3b] transition-colors"
          >
            Explore Full Gallery
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-[#ff3b3b] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="aspect-square rounded-2xl overflow-hidden group bg-white/5 border border-white/5"
              >
                <img
                  src={item.url}
                  alt="Gallery"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;