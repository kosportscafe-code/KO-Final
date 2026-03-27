import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Utensils } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useMenuData } from '../hooks/useMenuData';

const staticHighlights = [
  {
    id: 'h1',
    name: 'Bombay Masala',
    description: 'A fusion of local spices and classic Italian flavors.',
    price: 214,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
    tag: 'Popular'
  },
  {
    id: 'h2',
    name: 'KOS Signature Pizza',
    description: 'Loaded with premium toppings and our secret house sauce.',
    price: 389,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop',
    tag: 'Chef Choice'
  },
  {
    id: 'h3',
    name: 'Special Veg Thali',
    description: 'A complete nutritional powerhouse with authentic flavors.',
    price: 249,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop',
    tag: 'Best Value'
  }
];

const MenuHighlights: React.FC = () => {
    const { items, loading } = useMenuData();
    const Motion = motion as any;

    const dynamicHighlights = useMemo(() => {
        if (loading || items.length === 0) return staticHighlights;

        return staticHighlights.map(staticItem => {
            // Try to find matching dynamic item by name
            const dynamicItem = items.find(i => 
                i.name.toLowerCase().includes(staticItem.name.toLowerCase()) || 
                staticItem.name.toLowerCase().includes(i.name.toLowerCase())
            );

            if (dynamicItem) {
                return {
                    ...staticItem,
                    id: dynamicItem.id,
                    price: dynamicItem.price,
                    description: dynamicItem.description || staticItem.description,
                    // keep static image if dynamic lacks one, or use dynamic
                    image: dynamicItem.image || staticItem.image
                };
            }
            return staticItem;
        });
    }, [items, loading]);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/10 border border-bronze/20 text-bronze mb-4">
              <Utensils size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-xs">Taste the Victory</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian leading-tight">
              Chef's <span className="text-bronze">Highlights</span>
            </h2>
            <p className="text-stone-500 mt-4 font-sans leading-relaxed">
              A curated selection of our most loved dishes, prepared fresh to fuel your sports passion.
            </p>
          </div>
          
          <a 
            href="/order" 
            className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-obsidian hover:text-bronze transition-colors"
          >
            Explore Full Menu <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicHighlights.map((item, index) => (
            <Motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-alabaster rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-obsidian text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {item.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl text-obsidian">{item.name}</h3>
                  <span className="font-sans font-bold text-bronze">{formatCurrency(item.price)}</span>
                </div>
                <p className="text-stone-500 text-sm font-sans flex-grow leading-relaxed mb-6">
                  {item.description}
                </p>
                
                <a 
                  href={`/order?search=${encodeURIComponent(item.name)}`}
                  className="w-full py-3 bg-white border border-stone-200 text-obsidian text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-obsidian hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
                  Order Now
                </a>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuHighlights;

