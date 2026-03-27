import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import CartDrawer from '../components/CartDrawer';
import OrderCategoryNav from '../components/OrderCategoryNav';
import OrderProductGrid from '../components/OrderProductGrid';
import OrderCartPanel from '../components/OrderCartPanel';
import { useMenuData } from '../hooks/useMenuData';
import { useSearchParams } from 'react-router-dom';

const OrderPage: React.FC = () => {
  const { items, categories, loading } = useMenuData();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isVegOnly, setIsVegOnly] = useState(false);

  const { cart, cartTotal, toggleDrawer } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);


  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.isVeg;
      
      // If there is a search query, show any item that matches it (global search)
      if (searchQuery && searchQuery.trim() !== '') {
        return matchesSearch && matchesVeg;
      }
      
      // Filter by category if one is selected and it's not "All"
      const matchesCategory = (activeCategory && activeCategory !== 'All') 
        ? item.category === activeCategory 
        : true;
        
      return matchesCategory && matchesSearch && matchesVeg;
    });
  }, [items, activeCategory, searchQuery, isVegOnly]);

  return (
    <div className="min-h-screen bg-alabaster flex flex-col">
      <SEO 
        title="Order Online | KOS Café Meerut"
        description="Craving something delicious? Order from KOS Sports Café Meerut. Indian, Mexican, Chinese and more delivered to your doorstep."
      />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-32">
        
        {/* High-Impact Header Banner */}
        <div className="bg-gradient-to-br from-[#2B1E16] to-[#5C4033] rounded-[2rem] p-10 md:p-14 mb-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-bronze/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-bronze/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="font-serif text-5xl md:text-6xl text-white tracking-widest uppercase mb-3">Order Online</h1>
              <p className="text-white/70 text-lg font-sans max-w-md">Freshly prepared, delivered with love. Choose from our wide selection of sports-inspired delights.</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-bronze' : 'text-stone-300'}`} size={18} />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-bronze transition-all text-obsidian placeholder-stone-300 text-sm shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`p-3 rounded-2xl border transition-all ${
                isVegOnly 
                  ? 'bg-green-50 border-green-200 text-green-600' 
                  : 'bg-white border-stone-200 text-stone-400'
              }`}
              title="Vegetarian Only"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Responsive Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Category Scroll (Hidden on Desktop) */}
          <div className="lg:hidden -mx-4 md:mx-0">
            <OrderCategoryNav 
              categories={categories} 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
              variant="horizontal" 
            />
          </div>

          {/* Sidebar Navigation (Hidden on Mobile) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-sidebar p-6 rounded-3xl border border-border-base/50">
              <p className="text-[10px] uppercase tracking-widest font-black text-muted mb-4 px-2">Categories</p>
              <OrderCategoryNav 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
                variant="vertical" 
              />
            </div>
          </aside>

          {/* Product Grid (Center) */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-obsidian tracking-wider uppercase">{activeCategory}</h2>
              <span className="text-[10px] text-stone-400 font-sans uppercase tracking-widest">{filteredItems.length} items found</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + isVegOnly + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <OrderProductGrid items={filteredItems} loading={loading} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cart Panel (Hidden on Mobile) */}
          <aside className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
            <OrderCartPanel />
          </aside>
        </div>
      </main>

      <CartDrawer />

      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm"
          >
            <button 
              onClick={() => toggleDrawer(true)}
              className="w-full bg-obsidian text-white rounded-full p-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-between group border border-white/10 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="bg-bronze w-10 h-10 rounded-full flex items-center justify-center relative">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-1 -right-1 bg-white text-bronze text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-obsidian">
                    {cartCount}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-sans font-black text-xs uppercase tracking-widest">View Cart</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wide">{cartCount} items</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-lg text-white">₹{cartTotal}</p>
                </div>
                <div className="bg-white/20 rounded-full p-1.5">
                  <ChevronRight size={18} />
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderPage;

