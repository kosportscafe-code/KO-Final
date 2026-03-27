import React, { createContext, useContext, ReactNode } from 'react';
import { useCartState } from '../hooks/useCartState';
import { CartItem, MenuItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  isDrawerOpen: boolean;
  toggleDrawer: (open?: boolean) => void;
  addToCart: (item: MenuItem, size: 'Regular' | 'Medium' | 'Half' | 'Full') => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (customerDetails: {
    name: string;
    phone: string;
    address: string;
    location?: { lat: number; lng: number };
  }) => Promise<any>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cartState = useCartState();

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};