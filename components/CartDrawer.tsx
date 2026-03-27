import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronRight, Check, MapPin, ShoppingBag } from 'lucide-react';
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
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'captured' | 'denied'>('idle');
  const [locationObj, setLocationObj] = useState<{lat: number, lng: number} | null>(null);

  // Cast motion to any to avoid TypeScript errors with missing props in current environment
  const Motion = motion as any;

  const handleGetLocation = () => {
    setLocationStatus('fetching');

    // Security Check: Geolocation requires HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      alert("Browser Security: Live location sharing requires a secure connection (HTTPS). Please ensure your site has an SSL certificate.");
      setLocationStatus('denied');
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationObj({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('captured');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied. Please allow location access in your browser settings.");
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate taxes
    const taxAmount = Math.round(cartTotal * 0.05); // 5% total tax
    const grandTotal = cartTotal + taxAmount;
    
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in all details before placing the order.");
      return;
    }

    setStatus('sending');

    let message = `Hello, I want to place an order:\n\n`;
    
    cart.forEach(item => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      message += `${item.name} x ${qty} = ₹${price * qty}\n`;
    });
    
    message += `\nTotal: ₹${grandTotal}\n\n`;
    message += `Name: ${name}\n`;
    message += `Address: ${address}\n`;
    
    if (locationObj) {
      message += `Live Location: https://www.google.com/maps?q=${locationObj.lat},${locationObj.lng}\n`;
    }

    message += `\nPlease confirm.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=917060403965&text=${encodedMessage}`;

    // Small delay/ensure state is not cleared BEFORE message is built
    window.location.href = whatsappUrl;
    
    setTimeout(() => {
      clearCart();
      toggleDrawer(false);
      setStatus('idle');
      setName('');
      setPhone('');
      setAddress('');
      setLocationStatus('idle');
      setLocationObj(null);
    }, 100);
  };

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const drawerVariants = {
    hidden: isMobile ? { y: '100%', x: 0 } : { x: '100%', y: 0 },
    visible: { y: 0, x: 0 },
    exit: isMobile ? { y: '100%', x: 0 } : { x: '100%', y: 0 }
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
            className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <Motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-[101] bg-cart shadow-2xl flex flex-col transition-all duration-300 ${
              isMobile 
                ? 'bottom-0 left-0 right-0 h-auto max-h-[92vh] rounded-t-[2.5rem]' 
                : 'top-0 right-0 h-full w-[450px] border-l border-border-base'
            }`}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-border-base rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className={`flex justify-between items-center border-b border-border-base/50 ${isMobile ? 'px-6 py-4' : 'p-6'}`}>
              <h2 className="font-serif text-2xl text-heading">Your Order</h2>
              <button 
                onClick={() => toggleDrawer(false)} 
                className="p-2 hover:bg-background rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-muted" aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full min-h-[200px] flex flex-col justify-center items-center text-muted text-center">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-muted/30" />
                  </div>
                  <h3 className="font-serif text-xl text-heading mb-2">Your cart is empty 🛒</h3>
                  <p className="text-muted text-sm">Start adding food!</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-serif text-lg text-obsidian">{item.name}</h4>
                        <span className="font-sans font-medium text-sm">{formatCurrency((Number(item.price) || 0) * (Number(item.qty) || 0))}</span>
                      </div>
                      <p className="text-xs text-stone-500 mb-2 uppercase tracking-wide">
                        {item.selectedSize} 
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-stone-300 rounded-full">
                          <button 
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="px-3 py-1 hover:bg-stone-200 rounded-l-full transition-colors"
                            aria-label="Decrease quantity"
                          >-</button>
                          <span className="px-1 text-sm font-sans w-6 text-center">{item.qty}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="px-3 py-1 hover:bg-stone-200 rounded-r-full transition-colors"
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-stone-400 hover:text-red-400 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
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
                    <input 
                      required
                      type="text" 
                      placeholder="Customer Name" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                    <input 
                      required
                      type="text" 
                      placeholder="Delivery Address" 
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                    <input 
                      required
                      type="tel" 
                      placeholder="Phone Number" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-2 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                    
                    {/* Geolocation Section */}
                    <div className="pt-2 pb-2">
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-5 h-5 ${locationStatus === 'captured' ? 'text-green-500' : 'text-stone-400'}`} aria-hidden="true" />
                          <span className="text-sm font-medium text-stone-600">
                            {locationStatus === 'idle' && "Share your live location"}
                            {locationStatus === 'fetching' && "Fetching location..."}
                            {locationStatus === 'captured' && (
                              <span className="text-green-600">
                                Location: {locationObj?.lat.toFixed(4)}, {locationObj?.lng.toFixed(4)} ✅
                              </span>
                            )}
                            {locationStatus === 'denied' && "Location not shared"}
                          </span>
                        </div>
                        {locationStatus !== 'captured' && locationStatus !== 'fetching' && (
                          <button 
                            type="button" 
                            onClick={handleGetLocation}
                            className="px-3 py-1.5 bg-bronze/10 text-bronze rounded-lg text-xs uppercase tracking-wider font-bold hover:bg-bronze hover:text-white transition-all active:scale-95"
                          >
                            Get Location
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 py-4">
                      <div className="flex justify-between items-center text-sm text-stone-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-stone-500">
                        <span>Taxes (5%)</span>
                        <span>{formatCurrency(Math.round(cartTotal * 0.05))}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border-base/30 mt-2">
                        <span className="text-muted font-serif text-lg uppercase tracking-wider">Total</span>
                        <span className="text-2xl font-sans text-bronze font-black">{formatCurrency(cartTotal + Math.round(cartTotal * 0.05))}</span>
                      </div>
                      <p className="text-[10px] text-muted text-center italic leading-tight px-4 pb-2">
                        2.5% SGST + 2.5% CGST added in the bill when order is placed.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-[#25D366] text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#128C7E] transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-70 active:scale-95 shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
                      aria-label="Confirm and send order via WhatsApp"
                    >
                      {status === 'sending' ? 'Redirecting...' : 'Order on WhatsApp'}
                      {status === 'idle' && <ChevronRight className="w-5 h-5" aria-hidden="true" />}
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