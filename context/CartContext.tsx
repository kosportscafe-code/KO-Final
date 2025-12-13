import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  toggleDrawer: (open?: boolean) => void;
  addToCart: (item: MenuItem, size: 'Regular' | 'Medium') => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kos_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart");
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('kos_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleDrawer = (open?: boolean) => {
    setIsDrawerOpen(prev => open !== undefined ? open : !prev);
  };

  const addToCart = (item: MenuItem, size: 'Regular' | 'Medium') => {
    const price = size === 'Medium' && item.priceMed ? item.priceMed : item.priceReg;
    
    setCart(prev => {
      // Check if same item with same size exists
      const existing = prev.find(i => i.id === item.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i => i.cartId === existing.cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        ...item, 
        cartId: `${item.id}-${size}-${Date.now()}`, 
        selectedSize: size, 
        price, 
        quantity: 1 
      }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, isDrawerOpen, toggleDrawer, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};