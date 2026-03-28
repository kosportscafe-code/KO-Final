import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Trophy, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { cart, toggleDrawer } = useCart();
  const { theme, setTheme, isIPLMode, setIsIPLMode } = useTheme();
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
        <Link to="/" className="flex items-center gap-3 group" aria-label="KOS Sports Café Home">
          <img
            src="/images/LOGO.jpg"
            alt="KOS Café Logo"
            className="h-12 w-auto object-contain"
          />
          {theme === 'ipl' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 rounded-full border border-red-500/50 shadow-lg live-badge-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">Live Match</span>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  className={`font-serif text-lg tracking-widest uppercase transition-colors text-heading hover:text-primary ${location.pathname === link.href ? 'text-primary' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme Switcher Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative group">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-sidebar/50 backdrop-blur-md rounded-full border border-border-base/50 text-heading transition-all hover:border-primary group-hover:bg-sidebar/80 no-glow"
                aria-label="Change color theme"
              >
                {theme === 'light' && <Sun size={18} className="text-orange-500" />}
                {theme === 'dark' && <Moon size={18} className="text-blue-400" />}
                {theme === 'ipl' && <Trophy size={18} className="text-yellow-500" />}
                {theme === 'festival' && <Sparkles size={18} className="text-red-500" />}
                <span className="font-sans text-[10px] tracking-widest uppercase font-bold hidden xl:inline">
                  {theme} mode
                </span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-56 bg-card backdrop-blur-xl border border-border-base/50 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
                <div className="p-3 space-y-2">
                  {/* Event Toggle */}
                  <div className="px-2 py-2 mb-2 bg-sidebar/30 rounded-xl border border-border-base/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isIPLMode ? 'bg-red-500 live-badge-pulse' : 'bg-stone-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-heading">Match Mode</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsIPLMode(!isIPLMode);
                      }}
                      className={`w-10 h-5 rounded-full transition-colors relative ${isIPLMode ? 'bg-red-600' : 'bg-muted/50'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isIPLMode ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  <button 
                    onClick={() => setTheme('light')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors no-glow ${theme === 'light' ? 'bg-primary/10 text-primary' : 'hover:bg-sidebar/50 text-heading/70'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#F5EDE3] border border-black/10" />
                    <span className="text-xs font-bold uppercase tracking-wider">Café Light</span>
                    {theme === 'light' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors no-glow ${theme === 'dark' ? 'bg-primary/10 text-primary' : 'hover:bg-sidebar/50 text-heading/70'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#111111] border border-white/10" />
                    <span className="text-xs font-bold uppercase tracking-wider">Stadium Dark</span>
                    {theme === 'dark' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                  <button 
                    onClick={() => setTheme('ipl')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors no-glow ${theme === 'ipl' ? 'bg-primary/10 text-primary' : 'hover:bg-sidebar/50 text-heading/70'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#001C44] border border-white/10" />
                    <span className="text-xs font-bold uppercase tracking-wider">Match Day (IPL)</span>
                    {theme === 'ipl' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                  <button 
                    onClick={() => setTheme('festival')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors no-glow ${theme === 'festival' ? 'bg-primary/10 text-primary' : 'hover:bg-sidebar/50 text-heading/70'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#8B0000] border border-white/10" />
                    <span className="text-xs font-bold uppercase tracking-wider">Diwali / Finals</span>
                    {theme === 'festival' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/book"
            aria-label="Book a live comedy show or event"
            className="hidden md:block font-sans text-xs tracking-widest uppercase px-5 py-2 border border-heading text-heading hover:bg-heading hover:text-white transition-all rounded-full"
          >
            Book Show
          </Link>
          
          <Link
            to="/order"
            className={`hidden md:flex items-center gap-2 font-sans text-[10px] tracking-[0.15em] uppercase px-7 py-3 rounded-full font-black transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 bg-primary text-background hover:opacity-90 ${theme === 'ipl' ? 'pulse-button' : ''}`}
          >
            Order Now
          </Link>

          <button
            onClick={() => toggleDrawer(true)}
            className="relative p-2 hover:bg-sidebar/50 rounded-full transition-colors flex items-center justify-center text-heading no-glow"
            aria-label="View shopping cart and order online"
          >
            <ShoppingBag className="w-5 h-5 text-heading" strokeWidth={1.5} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

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
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={location.pathname === link.href ? "page" : undefined}
                      className={`font-serif text-xl ${location.pathname === link.href ? 'text-primary' : 'text-heading'}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                 <li className="pt-4 space-y-4">
                  <div className="flex justify-around items-center bg-sidebar/30 p-3 rounded-2xl border border-border-base/50">
                    <button onClick={() => setTheme('light')} className={`flex flex-col items-center gap-1 no-glow ${theme === 'light' ? 'text-primary' : 'text-muted'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#F5EDE3] border border-black/10" />
                      <span className="text-[10px] font-bold uppercase">Light</span>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`flex flex-col items-center gap-1 no-glow ${theme === 'dark' ? 'text-primary' : 'text-muted'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#111111] border border-white/10" />
                      <span className="text-[10px] font-bold uppercase">Dark</span>
                    </button>
                    <button onClick={() => setTheme('ipl')} className={`flex flex-col items-center gap-1 no-glow ${theme === 'ipl' ? 'text-primary' : 'text-muted'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#001C44] border border-white/10" />
                      <span className="text-[10px] font-bold uppercase">IPL</span>
                    </button>
                    <button onClick={() => setTheme('festival')} className={`flex flex-col items-center gap-1 no-glow ${theme === 'festival' ? 'text-primary' : 'text-muted'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#8B0000] border border-white/10" />
                      <span className="text-[10px] font-bold uppercase">Festival</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      toggleDrawer(true);
                    }}
                    className="flex items-center justify-center gap-3 w-full bg-primary text-background py-4 rounded-xl font-serif text-xl shadow-lg active:scale-95 transition-all no-glow"
                  >
                    View Cart 🛒
                  </button>
                </li>
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;