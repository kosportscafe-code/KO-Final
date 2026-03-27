import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { formatCurrency, getOptimizedImageUrl } from '../utils/helpers';
import { getSizeLabels } from '../services/menuService';
import { useCart } from '../context/CartContext';
import { StructuredMenuItem } from '../hooks/useMenuData';

interface OrderProductGridProps {
  items: StructuredMenuItem[];
  loading: boolean;
  onItemClick?: (item: StructuredMenuItem) => void;
}

const OrderProductGrid: React.FC<OrderProductGridProps> = ({ items, loading }) => {
  const { addToCart } = useCart();
  const Motion = motion as any;

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-64">
        <div className="w-10 h-10 border-t-2 border-b-2 border-bronze rounded-full animate-spin"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 text-center py-20">
        <p className="text-stone-400 font-serif italic text-lg">No items found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const labels = getSizeLabels(item.category);
          const itemImage = getOptimizedImageUrl(item.image, 400);
          const dietLabel = item.isVeg ? 'Vegetarian' : 'Non-vegetarian';

          return (
            <Motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 border border-border-base flex flex-col group relative"
            >
              {/* Image Section */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-background">
                <img
                  src={itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                
                {/* Diet Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`w-5 h-5 bg-white/90 backdrop-blur-md rounded-md border flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500 shadow-sm'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                </div>

                {/* Popular Tag */}
                {item.isPopular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-bronze text-white text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-bronze/20">
                      <Star size={10} fill="currentColor" /> Popular
                    </span>
                  </div>
                )}

                {/* Stock Overlay */}
                {item.inStock === false && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-heading text-white text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl rotate-[-5deg] shadow-2xl">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 flex flex-col px-1">
                <div className="mb-1">
                  <h3 className="font-sans font-bold text-base md:text-lg text-heading leading-tight group-hover:text-bronze transition-colors">
                    {item.name}
                  </h3>
                </div>
                
                <p className="font-sans text-muted text-[10px] md:text-xs line-clamp-2 mb-4 h-8 md:h-9 leading-relaxed">
                  {item.description || `${dietLabel} ${item.category.toLowerCase()} at KOS Café.`}
                </p>

                {/* Pricing Area */}
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      {item.priceMed ? (
                        <>
                          <span className="text-[10px] text-muted uppercase font-bold tracking-widest mb-0.5">{labels.reg}</span>
                          <span className="text-heading font-black text-sm md:text-base">₹{item.price}</span>
                        </>
                      ) : (
                        <span className="text-bronze font-black text-lg md:text-xl">₹{item.price}</span>
                      )}
                    </div>
                    {item.priceMed && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted uppercase font-bold tracking-widest mb-0.5">{labels.med}</span>
                        <span className="text-heading font-black text-sm md:text-base">₹{item.priceMed}</span>
                      </div>
                    )}
                  </div>

                  {/* Add Buttons */}
                  <div className="flex gap-2">
                    <Motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => item.inStock !== false && addToCart(item as any, labels.fullReg as any)}
                      disabled={item.inStock === false}
                      className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-widest font-black shadow-lg ${
                        item.inStock === false
                          ? 'bg-background text-muted/30 border-border-base/20 cursor-not-allowed'
                          : 'bg-bronze text-white hover:bg-[#B85722] shadow-bronze/20'
                      }`}
                    >
                      <Plus size={16} strokeWidth={3} /> {item.priceMed ? labels.reg : 'Add'}
                    </Motion.button>

                    {item.priceMed && (
                      <Motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => item.inStock !== false && addToCart(item as any, labels.fullMed as any)}
                        disabled={item.inStock === false}
                        className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-widest font-black shadow-lg ${
                          item.inStock === false
                            ? 'bg-background text-muted/50 cursor-not-allowed'
                            : 'bg-bronze text-white hover:bg-[#B85722] shadow-bronze/20'
                        }`}
                      >
                        <Plus size={16} strokeWidth={3} /> {labels.med}
                      </Motion.button>
                    )}
                  </div>
                </div>
              </div>
            </Motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default OrderProductGrid;

