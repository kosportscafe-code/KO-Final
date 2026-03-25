import React from 'react';
import { motion } from 'framer-motion';
import GalleryGrid from '../components/GalleryGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera } from 'lucide-react';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ff3b3b] selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff3b3b]/10 border border-[#ff3b3b]/20 text-[#ff3b3b] mb-6"
          >
            <Camera size={16} />
            <span className="text-xs font-black uppercase tracking-widest">KOSC Visuals</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
          >
            THE <span className="text-[#ff3b3b]">GALLERY</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A visual documentation of epic saves, delicious bites, and unforgettable comedy nights.
          </motion.p>
        </section>

        {/* Dynamic Gallery Component */}
        <GalleryGrid />

        {/* Instagram Section (Future) */}
        <section className="mt-32 pt-24 border-t border-white/5">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">SOCIAL <span className="text-[#ff3b3b]">FEED</span></h2>
                    <p className="text-gray-500">Latest updates from our community @KOSCSportsCafe</p>
                </div>
                <button className="hidden md:flex px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold">
                    Follow on Instagram
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5 group overflow-hidden cursor-pointer relative">
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold">View Post</span>
                        </div>
                        <img 
                            src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=300`} 
                            alt="Social"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                ))}
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GalleryPage;
