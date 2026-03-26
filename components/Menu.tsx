import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MenuItem } from '../types';
import { fetchMenuData } from '../services/sheetService';
import { FALLBACK_MENU, MENU_PDF_URL } from '../constants';
import { formatCurrency, getDriveImage, generateAltText, getOptimizedImageUrl } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { Plus, X, Search, ArrowUpDown, Leaf } from 'lucide-react';
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

const getSizeLabels = (category: string) => {
  if (['Sandwiches', 'Momos', 'Chinese & Noodles'].includes(category)) {
    return { reg: 'Half', med: 'Full', fullReg: 'Half', fullMed: 'Full' };
  }
  return { reg: 'Reg', med: 'Med', fullReg: 'Regular', fullMed: 'Medium' };
};

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  imageSrc: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, item, imageSrc }) => {
  const Motion = motion as any;

  if (!isOpen || !item) return null;

  const labels = getSizeLabels(item.category);

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
            aria-label="Close image modal"
          >
            <X className="w-5 h-5 text-obsidian" aria-hidden="true" />
          </button>

          {/* Image */}
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={imageSrc}
              alt={generateAltText(imageSrc, item.name, item.category)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderImage;
              }}
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
                    <span className="font-sans text-stone-500">{labels.reg}: {formatCurrency(item.priceReg)}</span>
                    <span className="font-sans text-obsidian font-medium">{labels.med}: {formatCurrency(item.priceMed)}</span>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'low-high' | 'high-low'>('default');
  const [isVegOnly, setIsVegOnly] = useState(false);
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

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = !isVegOnly || item.isVeg !== false;
      return matchesCategory && matchesSearch && matchesVeg;
    });

    if (sortBy === 'low-high') {
      result = [...result].sort((a, b) => a.priceReg - b.priceReg);
    } else if (sortBy === 'high-low') {
      result = [...result].sort((a, b) => b.priceReg - a.priceReg);
    }

    return result;
  }, [items, activeCategory, searchQuery, isVegOnly, sortBy]);

  const getItemImage = (item: MenuItem): string => {
    if (item.image_url) return getDriveImage(item.image_url);
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

  // ── Enhanced JSON-LD Menu Schema ──────────────────────────────────────────
  // Answers AI queries like "Does KOS Café serve burgers?" and "Price of sandwiches?"
  useEffect(() => {
    if (items.length === 0) return;

    const getDietType = (item: MenuItem): string[] => {
      if (item.isVeg !== false) return ["https://schema.org/VegetarianDiet"];
      return [];
    };

    const buildOffers = (item: MenuItem): object => {
      const availability = item.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock";

      if (item.priceMed) {
        const labels = getSizeLabels(item.category);
        return [
          {
            "@type": "Offer",
            "name": labels.fullReg,
            "price": item.priceReg,
            "priceCurrency": "INR",
            "availability": availability
          },
          {
            "@type": "Offer",
            "name": labels.fullMed,
            "price": item.priceMed,
            "priceCurrency": "INR",
            "availability": availability
          }
        ];
      }
      return {
        "@type": "Offer",
        "price": item.priceReg,
        "priceCurrency": "INR",
        "availability": availability
      };
    };

    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    const menuSchema = {
      "@context": "https://schema.org",
      "@type": "Menu",
      "@id": "https://www.kosportscafe.com/#menu",
      "name": "KOS Sports Café Menu",
      "description": "Full food and drink menu at KOS Sports Café in Meerut. Includes Burgers, Sandwiches, Pizzas, Momos, Chinese, Drinks and more.",
      "url": "https://www.kosportscafe.com/#menu",
      "inLanguage": "en",
      "isPartOf": { "@id": "https://www.kosportscafe.com/#restaurant" },
      "hasMenuSection": Object.entries(grouped).map(([category, sectionItems]) => ({
        "@type": "MenuSection",
        "name": category,
        "description": `${category} available at KOS Sports Café in Meerut`,
        "hasMenuItem": (sectionItems as MenuItem[]).map(item => ({
          "@type": "MenuItem",
          "name": item.name,
          "description": item.description || `${item.name} — a ${category} item at KOS Sports Café`,
          "url": "https://www.kosportscafe.com/#menu",
          ...(item.image_url ? { "image": item.image_url } : {}),
          ...(getDietType(item).length > 0 ? { "suitableForDiet": getDietType(item) } : {}),
          "offers": buildOffers(item)
        }))
      }))
    };

    let script = document.querySelector('script[id="menu-jsonld"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'menu-jsonld');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(menuSchema);

    return () => {
      const el = document.querySelector('script[id="menu-jsonld"]');
      if (el) el.remove();
    };
  }, [items]);

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

          {/* Smart Controls: Search, Sort, Veg Toggle */}
          <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-bronze' : 'text-stone-300'}`} size={18} />
              <input
                type="text"
                placeholder="Search your favorite dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/20 transition-all text-obsidian placeholder-stone-300 font-sans text-sm shadow-sm"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
              {/* Veg Toggle */}
              <button 
                onClick={() => setIsVegOnly(!isVegOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  isVegOnly 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-white border-stone-200 text-stone-400 hover:border-stone-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border-2 ${isVegOnly ? 'bg-green-600 border-green-800' : 'bg-transparent border-stone-300'}`} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Veg Only</span>
              </button>

              {/* Price Sort */}
              <div className="relative flex-grow md:flex-initial">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none w-full pl-11 pr-10 py-2.5 bg-white border border-stone-200 rounded-full focus:outline-none focus:border-bronze text-[10px] uppercase tracking-widest font-bold text-stone-500 cursor-pointer hover:border-stone-300 transition-all"
                >
                  <option value="default">Default Order</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category Nav */}
          <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16" aria-label="Menu categories">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-current={activeCategory === cat ? 'true' : undefined}
                className={`font-sans text-sm tracking-widest uppercase transition-all duration-300 pb-1 border-b ${activeCategory === cat
                    ? 'text-bronze border-bronze'
                    : 'text-stone-400 border-transparent hover:text-stone-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* ── Menu Grid — each card uses Schema.org MenuItem microdata ─────── */}
          <section aria-label={`${activeCategory} items at KOS Sports Café`}>
            <h3 className="sr-only">{activeCategory} — KOS Sports Café Menu</h3>
            <Motion.ul
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {filteredAndSortedItems.map((item) => {
                const labels = getSizeLabels(item.category);
                const itemImage = getOptimizedImageUrl(item.image_url, 600);
                const availability = item.inStock !== false ? 'InStock' : 'OutOfStock';
                const dietLabel = item.isVeg !== false ? 'Vegetarian' : 'Non-vegetarian';

                return (
                <Motion.li
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-stone-100 flex flex-col h-full"
                >
                  {/* ── Schema.org MenuItem microdata wrapper ── */}
                  <article
                    itemScope
                    itemType="https://schema.org/MenuItem"
                    aria-label={item.name}
                    className="flex flex-col h-full"
                  >
                    {/* Hidden machine-readable metadata */}
                    <meta itemProp="name" content={item.name} />
                    <meta itemProp="description" content={item.description || `${item.name} — ${item.category} at KOS Sports Café, Meerut`} />
                    <meta itemProp="url" content="https://www.kosportscafe.com/#menu" />
                    {item.image_url && <meta itemProp="image" content={item.image_url} />}
                    {item.isVeg !== false && <meta itemProp="suitableForDiet" content="https://schema.org/VegetarianDiet" />}

                    {/* Price offer microdata — primary (Reg/Half) */}
                    <span itemScope itemType="https://schema.org/Offer" itemProp="offers" className="sr-only">
                      <meta itemProp="name" content={labels.fullReg} />
                      <meta itemProp="price" content={String(item.priceReg)} />
                      <meta itemProp="priceCurrency" content="INR" />
                      <meta itemProp="availability" content={`https://schema.org/${availability}`} />
                    </span>

                    {/* Price offer microdata — secondary (Med/Full) if present */}
                    {item.priceMed && (
                      <span itemScope itemType="https://schema.org/Offer" itemProp="offers" className="sr-only">
                        <meta itemProp="name" content={labels.fullMed} />
                        <meta itemProp="price" content={String(item.priceMed)} />
                        <meta itemProp="priceCurrency" content="INR" />
                        <meta itemProp="availability" content={`https://schema.org/${availability}`} />
                      </span>
                    )}

                    {/* Image Top */}
                    <div
                      className="aspect-[4/3] w-full flex-shrink-0 overflow-hidden bg-stone-50 cursor-pointer relative"
                      onClick={() => openModal(item)}
                    >
                      <img
                        src={itemImage}
                        alt={`${item.name} — ${dietLabel} ${item.category} at KOS Sports Café`}
                        itemProp="image"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        width="600"
                        height="600"
                      />
                      {/* Out of Stock Overlay */}
                      {item.inStock === false && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-obsidian text-white text-[10px] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-sm shadow-xl transform -rotate-12 border border-white/20">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/10 transition-all duration-300"></div>

                      {/* Popular Badge */}
                      {item.isPopular && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-bronze text-white text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm border border-white/20">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Veg/Non-Veg Tag */}
                      <div className="absolute top-4 right-4 z-10" aria-label={dietLabel} title={dietLabel}>
                        <div className={`w-5 h-5 bg-white/90 backdrop-blur-sm rounded-md border flex items-center justify-center ${item.isVeg !== false ? 'border-green-500' : 'border-red-500'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h4
                          className="font-serif text-xl text-obsidian cursor-pointer hover:text-bronze transition-colors flex-grow"
                          itemProp="name"
                          onClick={() => openModal(item)}
                        >
                          {item.name}
                        </h4>
                      </div>

                      <p className="font-sans text-stone-400 text-sm font-light mb-6 line-clamp-2" itemProp="description">
                        {item.description || `${dietLabel} ${item.category.toLowerCase()} — available at KOS Sports Café.`}
                      </p>

                      <div className="mt-auto">
                        <div className="flex justify-between items-end mb-4">
                          <div className="flex flex-col">
                            {item.priceMed ? (
                              <div className="flex flex-col gap-1 text-sm font-sans">
                                <span className="text-stone-400 uppercase tracking-tighter text-[10px]">{labels.reg}</span>
                                <span className="text-obsidian font-semibold">{formatCurrency(item.priceReg)}</span>
                              </div>
                            ) : (
                              <span className="font-sans text-xl text-bronze font-semibold">{formatCurrency(item.priceReg)}</span>
                            )}
                          </div>

                          {item.priceMed && (
                            <div className="flex flex-col items-end gap-1 text-sm font-sans">
                              <span className="text-stone-400 uppercase tracking-tighter text-[10px]">{labels.med}</span>
                              <span className="text-obsidian font-semibold">{formatCurrency(item.priceMed)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => item.inStock !== false && addToCart(item, labels.fullReg as any)}
                            disabled={item.inStock === false}
                            className={`flex-1 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                              item.inStock === false
                                ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
                                : 'bg-stone-50 hover:bg-obsidian hover:text-white text-obsidian'
                            }`}
                            aria-label={`Add ${labels.fullReg} ${item.name} to cart`}
                          >
                            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" aria-hidden="true" />
                            <span className="text-[10px] uppercase tracking-widest font-semibold">{item.priceMed ? labels.reg : 'Add'}</span>
                          </button>

                          {item.priceMed && (
                            <button
                              onClick={() => item.inStock !== false && addToCart(item, labels.fullMed as any)}
                              disabled={item.inStock === false}
                              className={`flex-1 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
                                item.inStock === false
                                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                  : 'bg-obsidian text-white hover:bg-bronze'
                              }`}
                              aria-label={`Add ${labels.fullMed} ${item.name} to cart`}
                            >
                              <Plus className="w-4 h-4" aria-hidden="true" />
                              <span className="text-[10px] uppercase tracking-widest font-semibold">{labels.med}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Motion.li>
              )})}
            </Motion.ul>
          </section>

          {/* ── Internal Links: Menu → Booking / Contact ──────────────────── */}
          <div className="text-center mt-20 space-y-8">
            <div className="py-8 border-t border-stone-200">
              <p className="text-stone-500 mb-6 font-sans italic">Craving something special while watching the game?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#shows"
                  className="inline-block px-8 py-3 bg-obsidian text-white rounded-full font-sans text-xs tracking-widest uppercase hover:bg-bronze transition-all shadow-lg"
                  aria-label="Book a table or event space at KOS Sports Café"
                >
                  Book a Table or Event Space
                </a>
                <a
                  href="#contact"
                  rel="noopener"
                  className="inline-block px-8 py-3 bg-white border border-stone-200 text-obsidian rounded-full font-sans text-xs tracking-widest uppercase hover:border-bronze hover:text-bronze transition-all shadow-sm"
                  aria-label="Contact KOS Sports Café"
                >
                  Contact Us
                </a>
              </div>
            </div>

            <div>
              <a
                href={MENU_PDF_URL}
                download="KOS-Cafe-Menu.webp"
                className="text-xs uppercase tracking-widest text-stone-400 hover:text-obsidian border-b border-stone-300 pb-1 transition-colors cursor-pointer"
                aria-label="Download the full KOS Café menu as PDF"
              >
                Download Full Menu PDF
              </a>
            </div>
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