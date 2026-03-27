import { useState, useEffect } from 'react';
import { CartItem, MenuItem } from '../types';

export const useCartState = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kos_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            ...item,
            price: (typeof item.price === 'number' && !isNaN(item.price)) 
              ? item.price 
              : (typeof item.priceReg === 'number' ? item.priceReg : 0)
          }));
        }
        return [];
      } catch (e) {
        console.error("Failed to parse cart");
        return [];
      }
    }
    return [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('kos_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleDrawer = (open?: boolean) => {
    setIsDrawerOpen(prev => open !== undefined ? open : !prev);
  };

  const addToCart = (item: MenuItem, size: 'Regular' | 'Medium' | 'Half' | 'Full') => {
    // Determine price based on size
    let price = item.priceReg;
    if ((size === 'Medium' || size === 'Full') && item.priceMed) {
      price = item.priceMed;
    }
    
    const finalPrice = Number(price) || 0;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i => i.cartId === existing.cartId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { 
        ...item, 
        cartId: `${item.id}-${size}-${Date.now()}`, 
        selectedSize: size, 
        price: finalPrice, 
        qty: 1 
      }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev
      .map(item => {
        if (item.cartId === cartId) {
          return { ...item, qty: item.qty + delta };
        }
        return item;
      })
      .filter(item => item.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0);

  return {
    cart,
    isDrawerOpen,
    toggleDrawer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal
  };
};
