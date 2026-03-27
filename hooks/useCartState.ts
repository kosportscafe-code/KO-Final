import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CartItem, MenuItem, Order, OrderItem } from '../types';
import { orderService } from '../services/orderService';

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
  
  const [tableNumber, setTableNumber] = useState<string | null>(() => {
    return localStorage.getItem('kos_table_number');
  });

  const [searchParams] = useSearchParams();

  // Global Table Number detection
  useEffect(() => {
    const table = searchParams.get('table');
    if (table && table !== tableNumber) {
      setTableNumber(table);
    }
  }, [searchParams, tableNumber]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('kos_cart', JSON.stringify(cart));
  }, [cart]);

  // Save table number to local storage on change
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('kos_table_number', tableNumber);
    }
  }, [tableNumber]);

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

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0);

  const placeOrder = useCallback(async (customerDetails: {
    name: string;
    phone: string;
    address: string;
    location?: { lat: number; lng: number };
  }): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const tax = Math.round(cartTotal * 0.05);
    const orderItems: OrderItem[] = cart.map(item => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      size: item.selectedSize
    }));

    const order: Order = {
      id: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tableId: tableNumber,
      items: orderItems,
      subtotal: cartTotal,
      tax: tax,
      total: cartTotal + tax,
      status: 'NEW',
      timestamp: new Date().toISOString(),
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerAddress: customerDetails.address,
      location: customerDetails.location
    };

    // 1. Submit to backend/webhook
    const submissionSuccess = await orderService.submitOrder(order);
    
    // 2. Save to local history anyway
    orderService.saveOrderToLocal(order);
    
    // 3. Clear cart
    clearCart();

    return order;
  }, [cart, cartTotal, tableNumber, clearCart]);

  return {
    cart,
    tableNumber,
    setTableNumber,
    isDrawerOpen,
    toggleDrawer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    cartTotal,
  };
};
