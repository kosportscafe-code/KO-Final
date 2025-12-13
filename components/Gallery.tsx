import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Local images from the images folder
const images = [
  "/images/interior.webp",
  "/images/pamphlet.webp"
];

interface GalleryImageProps {
  src: string;
  idx: number;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ src, idx }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      className="relative group overflow-hidden break-inside-avoid mb-8 bg-stone-100 rounded-sm"
    >
      <img
        src={src}
        alt="Gallery moment"
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover transition-all duration-1000 ease-out
          sepia-[.15] brightness-105 contrast-[0.95] group-hover:sepia-0 group-hover:scale-105
          ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}
        `}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-obsidian/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Motion.div>
  );
};

const Gallery: React.FC = () => {
  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  return (
    <section id="gallery" className="py-24 bg-stone-150">
      <div className="container mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="font-serif text-4xl text-obsidian mb-6">Moments at KOSC</h2>
          <p className="font-sans text-stone-600 font-light text-lg">
            Where friends become rivals, strangers become friends, and every visit creates lasting memories.
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
          {images.map((src, idx) => (
            <GalleryImage key={idx} src={src} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;