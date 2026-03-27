import React from 'react';
import { motion } from 'framer-motion';

interface OrderCategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  variant: 'horizontal' | 'vertical';
}

const OrderCategoryNav: React.FC<OrderCategoryNavProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  variant 
}) => {
  const Motion = motion as any;
  const allCategories = ['All', ...categories];

  if (variant === 'vertical') {
    return (
      <nav className="flex flex-col gap-2 pr-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar" aria-label="Menu categories">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`text-left px-6 py-3 rounded-full font-serif text-lg uppercase tracking-widest transition-all duration-300 border ${
              activeCategory === cat
                ? 'bg-bronze text-white border-bronze shadow-lg shadow-bronze/20'
                : 'bg-sidebar text-body border-transparent hover:bg-bronze/10 hover:text-bronze'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>
    );
  }

  // Horizontal variant for mobile
  return (
    <nav 
      className="flex overflow-x-auto whitespace-nowrap gap-3 px-6 py-4 no-scrollbar bg-cart/90 backdrop-blur-md sticky top-0 z-20 border-b border-border-base/30" 
      aria-label="Menu categories"
    >
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`flex-shrink-0 px-6 py-2.5 rounded-full font-serif text-sm uppercase tracking-widest transition-all duration-300 border ${
            activeCategory === cat
              ? 'bg-bronze text-white border-bronze shadow-md'
              : 'bg-sidebar text-body border-transparent hover:bg-bronze/10 hover:text-bronze'
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default OrderCategoryNav;
