import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronRight, Check } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { WEBHOOK_URL } from '../constants';

const CartDrawer: React.FC = () => {
  const { 
    isDrawerOpen, 
    toggleDrawer, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    clearCart
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [table, setTable] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const orderData = {
      customer: { name, phone, table },
      items: cart.map(item => ({
        name: item.name,
        size: item.selectedSize,
        price: item.price,
        qty: item.quantity,
        total: item.price * item.quantity
      })),
      grandTotal: cartTotal,
      timestamp: new Date().toISOString()
    };

    try {
      // Send to Make.com or similar
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      setStatus('success');
      setTimeout(() => {
        clearCart();
        toggleDrawer(false);
        setStatus('idle');
        setName('');
        setPhone('');
        setTable('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleDrawer(false)}
            className="fixed inset-0 bg-obsidian/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <Motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-alabaster/95 shadow-2xl z-50 flex flex-col border-l border-white/50"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-stone-200">
              <h2 className="font-serif text-2xl text-obsidian">Your Order</h2>
              <button onClick={() => toggleDrawer(false)} className="p-2 hover:bg-stone-200 rounded-full">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-stone-400">
                  <span className="font-serif italic text-xl mb-2">Cart is empty</span>
                  <p className="text-sm">Add some delicious items from the menu.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-lg text-obsidian">{item.name}</h4>
                        <span className="font-sans font-medium text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                      <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide">
                        {item.selectedSize} 
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-stone-300 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="px-3 py-1 hover:bg-stone-200 rounded-l-full transition-colors"
                          >-</button>
                          <span className="px-1 text-sm font-sans w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="px-3 py-1 hover:bg-stone-200 rounded-r-full transition-colors"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-stone-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Form */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-stone-200">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-serif text-2xl text-obsidian mb-2">Order Placed!</h3>
                    <p className="text-stone-500">The kitchen has received your order.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                      <input 
                        required
                        type="text" 
                        placeholder="Name" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                      />
                       <input 
                        type="text" 
                        placeholder="Table #" 
                        value={table}
                        onChange={e => setTable(e.target.value)}
                        className="w-20 bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                      />
                    </div>
                    <input 
                      required
                      type="tel" 
                      placeholder="Phone Number" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                    
                    <div className="flex justify-between items-center py-4">
                      <span className="text-stone-500 font-serif text-lg">Total</span>
                      <span className="text-2xl font-sans text-obsidian font-medium">{formatCurrency(cartTotal)}</span>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-obsidian text-white py-4 font-sans uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                    >
                      {status === 'sending' ? 'Processing...' : 'Place Order'}
                      {!status.startsWith('send') && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </form>
                )}
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;