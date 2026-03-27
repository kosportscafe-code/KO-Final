import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  return (
    <section id="home" className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">

      {/* Background Image with Parallax */}
      <Motion.div
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img
          src="/images/Hero1.jpg"
          alt="Atmospheric interior of KOS Sports Café Meerut, featuring modern seating and sports-themed decor"
          className="w-full h-[120%] object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-white/0 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-alabaster via-transparent to-transparent" />
      </Motion.div>

      {/* Content */}
      <Motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20"
      >
        <Motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="block font-sans text-sm md:text-base tracking-[0.2em] uppercase text-cream mb-4"
        >
          Where Sports Meet Taste
        </Motion.span>

        <Motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight"
        >
          Game On.<br />
          <span className="italic text-slate">Eat Well.</span>
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-stone-700 max-w-lg mx-auto mb-10 text-white font-light"
        >
          An unparalleled experience where world-class gaming meets world-class cuisine.
        </Motion.p>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/order"
            className="w-full sm:w-auto px-10 py-5 bg-bronze text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-obsidian transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 group/btn"
          >
            Order Online <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
          </a>
          <a
            href="/book"
            className="w-full sm:w-auto px-10 py-5 border border-white/30 bg-white/5 backdrop-blur-sm text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center"
          >
            Book a Table
          </a>
        </Motion.div>
      </Motion.div>
    </section>
  );
};

export default Hero;