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
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Events', href: '/events' },
    { name: 'Book Table', href: '/book' },
    { name: 'Our Story', href: '/about' },
    { name: 'Blog', href: '/blog' },
  ];

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${isScrolled
        ? 'bg-alabaster/80 backdrop-blur-md border-stone-200 py-3'
        : 'bg-transparent border-transparent py-6'
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
                  className={`font-sans text-sm tracking-widest uppercase transition-colors ${isScrolled
                    ? 'text-obsidian/70 hover:text-bronze'
                    : 'text-white hover:text-cream'
                    } ${location.pathname === link.href ? 'text-bronze' : ''}`}
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
            className={`hidden md:block font-sans text-xs tracking-widest uppercase px-5 py-2 border transition-colors ${
              isScrolled
                ? 'border-obsidian text-obsidian hover:bg-obsidian hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-obsidian'
            }`}
          >
            Book Show
          </a>

          <button
            onClick={() => toggleDrawer(true)}
            className="relative p-2 hover:bg-stone-200/50 rounded-full transition-colors"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-obsidian" strokeWidth={1.5} aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-bronze text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden"
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
            className="md:hidden bg-alabaster border-t border-stone-200 overflow-hidden"
          >
            <ul className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={location.pathname === link.href ? "page" : undefined}
                      className={`font-serif text-xl ${location.pathname === link.href ? 'text-bronze' : 'text-obsidian'}`}
                    >
                      {link.name}
                    </a>
                  </li>
              ))}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;