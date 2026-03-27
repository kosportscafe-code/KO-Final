import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { cart, toggleDrawer } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/order' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Events', href: '/events' },
    { name: 'Book Table', href: '/book' },
    { name: 'Our Story', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${isScrolled
        ? 'bg-background/95 backdrop-blur-md border-border-base/30 py-3 shadow-sm'
        : 'bg-background/50 backdrop-blur-sm border-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">

        {/* Logo Area */}
        <a href="/" className="flex items-center gap-3 group" aria-label="KOS Sports Café Home">
          <img
            src="/images/LOGO.jpg"
            alt="KOS Café Logo"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  className={`font-serif text-lg tracking-widest uppercase transition-colors text-heading hover:text-bronze ${location.pathname === link.href ? 'text-bronze' : ''}`}
                >
                  {link.name}
                </a>
              </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <a
            href="/book"
            aria-label="Book a live comedy show or event"
            className="hidden md:block font-sans text-xs tracking-widest uppercase px-5 py-2 border border-heading text-heading hover:bg-heading hover:text-white transition-all rounded-full"
          >
            Book Show
          </a>
          
          <a
            href="/order"
            className="hidden md:flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase px-7 py-3 rounded-full font-black transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 bg-bronze text-white hover:bg-heading"
          >
            Order Now
          </a>

          <a
            href="/order"
            className="relative p-2 hover:bg-stone-200/50 rounded-full transition-colors flex items-center justify-center text-heading"
            aria-label="View shopping cart and order online"
          >
            <ShoppingBag className="w-5 h-5 text-heading" strokeWidth={1.5} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-bronze text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden text-heading"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <MenuIcon className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-t border-border-base overflow-hidden shadow-xl"
          >
            <ul className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={location.pathname === link.href ? "page" : undefined}
                      className={`font-serif text-xl ${location.pathname === link.href ? 'text-bronze' : 'text-heading'}`}
                    >
                      {link.name}
                    </a>
                  </li>
              ))}
              <li className="pt-4">
                <a
                  href="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 w-full bg-bronze text-white py-4 rounded-xl font-serif text-xl shadow-lg active:shadow-inner transition-all"
                >
                  Order Now 🛒
                </a>
              </li>
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;