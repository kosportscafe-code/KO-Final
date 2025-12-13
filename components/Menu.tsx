import React, { useEffect, useState } from 'react';
import { MenuItem } from '../types';
import { fetchMenuData } from '../services/sheetService';
import { formatCurrency, getDriveImage } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Default images for menu categories
const categoryImages: Record<string, string> = {
  'Sandwiches': '/images/menu/sandwich.jpg',
  'Rolls & Wraps': '/images/menu/burrito.jpg',
  'Bowls & Meals': '/images/menu/bowl.jpg',
  'Pizzas': '/images/menu/pizza.jpg',
  'Burgers': '/images/menu/burger.jpg',
  'Momos': '/images/menu/momos.jpg',
  'Chinese & Noodles': '/images/menu/noodles.jpg',
  'Drinks': '/images/menu/drinks.jpg',
  'Thalis': '/images/menu/thali.jpg',
};

// Placeholder image if no specific image is found
const placeholderImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, item, imageSrc }) => {
  const Motion = motion as any;

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <Motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-obsidian" />
          </button>

          {/* Image */}
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={imageSrc}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Item Details */}
          <div className="p-6">
            <h3 className="font-serif text-2xl text-obsidian mb-2">{item.name}</h3>
            <p className="font-sans text-stone-500 text-sm mb-4">{item.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                {item.priceMed ? (
                  <>
                    <span className="font-sans text-stone-500">Regular: {formatCurrency(item.priceReg)}</span>
                    <span className="font-sans text-obsidian font-medium">Medium: {formatCurrency(item.priceMed)}</span>
                  </>
                ) : (
                  <span className="font-sans text-xl text-obsidian font-medium">{formatCurrency(item.priceReg)}</span>
                )}
              </div>
            </div>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
};

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMenuData();
      setItems(data);

      const uniqueCats = Array.from(new Set(data.map(i => i.category)));
      setCategories(uniqueCats);
      if (uniqueCats.length > 0) setActiveCategory(uniqueCats[0]);

      setLoading(false);
    };
    loadData();
  }, []);

  const filteredItems = items.filter(item => item.category === activeCategory);

  const getItemImage = (item: MenuItem): string => {
    if (item.image) return getDriveImage(item.image);
    if (categoryImages[item.category]) return categoryImages[item.category];
    return placeholderImage;
  };

  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <div className="w-12 h-12 border-t-2 border-b-2 border-bronze rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <section id="menu" className="py-24 bg-alabaster relative">
        <div className="container mx-auto px-6">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-4">Our Menu</h2>
            <div className="w-16 h-[1px] bg-bronze mx-auto"></div>
          </div>

          {/* Category Nav */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-sm tracking-widest uppercase transition-all duration-300 pb-1 border-b ${activeCategory === cat
                    ? 'text-bronze border-bronze'
                    : 'text-stone-400 border-transparent hover:text-stone-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <Motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-16 max-w-6xl mx-auto"
          >
            {filteredItems.map((item) => (
              <Motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={item.id}
                className="group flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Clickable Image */}
                <div
                  className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-sm bg-stone-100 cursor-pointer relative"
                  onClick={() => openModal(item)}
                >
                  <img
                    src={getItemImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-obsidian/60 px-3 py-1 rounded">
                      View
                    </span>
                  </div>
                </div>

                <div className="flex-grow w-full">
                  <div className="flex justify-between items-baseline border-b border-stone-200 pb-2 mb-2 border-dotted">
                    <h3
                      className="font-serif text-xl text-obsidian cursor-pointer hover:text-bronze transition-colors"
                      onClick={() => openModal(item)}
                    >
                      {item.name}
                    </h3>
                    <div className="flex gap-4">
                      {/* Price Display Logic */}
                      {item.priceMed ? (
                        <div className="flex gap-3 text-sm font-sans">
                          <span className="text-stone-500">Reg: {formatCurrency(item.priceReg)}</span>
                          <span className="text-obsidian font-medium">Med: {formatCurrency(item.priceMed)}</span>
                        </div>
                      ) : (
                        <span className="font-sans text-lg text-obsidian">{formatCurrency(item.priceReg)}</span>
                      )}
                    </div>
                  </div>

                  <p className="font-sans text-stone-500 text-sm font-light mb-4 min-h-[40px]">
                    {item.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item, 'Regular')}
                      className="flex items-center gap-1 text-xs uppercase tracking-wider text-obsidian hover:text-bronze transition-colors"
                    >
                      <Plus className="w-3 h-3" /> {item.priceMed ? 'Add Reg' : 'Add to Cart'}
                    </button>

                    {item.priceMed && (
                      <button
                        onClick={() => addToCart(item, 'Medium')}
                        className="flex items-center gap-1 text-xs uppercase tracking-wider text-obsidian hover:text-bronze transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Med
                      </button>
                    )}
                  </div>
                </div>
              </Motion.div>
            ))}
          </Motion.div>

          {/* Download PDF Button */}
          <div className="text-center mt-20">
            <button className="text-xs uppercase tracking-widest text-stone-400 hover:text-obsidian border-b border-stone-300 pb-1 transition-colors">
              Download Full Menu PDF
            </button>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
        imageSrc={selectedItem ? getItemImage(selectedItem) : ''}
      />
    </>
  );
};

export default Menu;