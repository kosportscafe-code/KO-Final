import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ChevronRight, Check, MapPin, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const CartDrawer: React.FC = () => {
  const { 
    isDrawerOpen, 
    toggleDrawer, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal,
    tableNumber,
    placeOrder
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in all details before placing the order.");
      return;
    }

    setStatus('sending');

    try {
      const order = await placeOrder({
        name,
        phone,
        address,
        location: locationObj || undefined
      });

      if (order) {
        setStatus('success');
        
        const taxAmount = Math.round(cartTotal * 0.05);
        const grandTotal = cartTotal + taxAmount;
        
        let message = `Hello, I want to place an order:\n\n`;
        if (tableNumber) message += `SERVING TABLE: ${tableNumber}\n\n`;
        
        cart.forEach(item => {
          message += `${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
        });
        
        message += `\nTotal: ₹${grandTotal}\n`;
        message += `Order ID: ${order.id}\n`;
        message += `Name: ${name}\n`;
        message += `Address: ${address}\n`;
        if (locationObj) message += `Location: https://www.google.com/maps?q=${locationObj.lat},${locationObj.lng}\n`;
        message += `\nPlease confirm.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=917060403965&text=${encodedMessage}`;

        setTimeout(() => {
          window.location.href = whatsappUrl;
          toggleDrawer(false);
          setStatus('idle');
          setName('');
          setPhone('');
          setAddress('');
          setLocationStatus('idle');
          setLocationObj(null);
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      setStatus('error');
    }
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

  const CartForm = () => (
    <div className="space-y-4">
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
            className="w-full bg-transparent border-b border-border-base py-2 text-heading placeholder-muted/50 focus:border-primary focus:outline-none transition-colors"
          />
          <input 
            required
            type="text" 
            placeholder="Delivery Address" 
            value={address}
            onChange={e => setAddress(e.target.value)}
            className={`w-full bg-transparent border-b border-border-base text-heading placeholder-muted/50 focus:border-primary focus:outline-none transition-colors ${isMobile ? 'py-3 text-base' : 'py-4 text-lg'}`}
          />
          <input 
            required
            type="tel" 
            placeholder="Phone Number" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={`w-full bg-transparent border-b border-border-base text-heading placeholder-muted/50 focus:border-primary focus:outline-none transition-colors ${isMobile ? 'py-3 text-base' : 'py-4 text-lg'}`}
          />
          
          <div className="pt-2 pb-2">
            <div className="flex items-center justify-between p-3 bg-sidebar rounded-lg border border-border-base/50">
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${locationStatus === 'captured' ? 'text-green-500' : 'text-muted/40'}`} aria-hidden="true" />
                <span className="text-sm font-medium text-muted">
                  {locationStatus === 'idle' && "Share live location"}
                  {locationStatus === 'fetching' && "Fetching..."}
                  {locationStatus === 'captured' && (
                    <span className="text-green-600 text-xs">
                      Captured ✅
                    </span>
                  )}
                  {locationStatus === 'denied' && "Denied"}
                </span>
              </div>
              {locationStatus !== 'captured' && locationStatus !== 'fetching' && (
                <button 
                  type="button" 
                  onClick={handleGetLocation}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs uppercase tracking-wider font-bold"
                >
                  Get
                </button>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5 py-2">
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-500">
              <span>Taxes (5%)</span>
              <span>{formatCurrency(Math.round(cartTotal * 0.05))}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border-base/30 mt-1">
              <span className="text-muted font-serif text-base uppercase tracking-wider">Total</span>
              <span className="text-xl font-sans text-primary font-black">{formatCurrency(cartTotal + Math.round(cartTotal * 0.05))}</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full text-background py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 flex justify-center items-center gap-3 active:scale-95 shadow-lg ${
              status === 'success' 
                ? 'bg-green-500 shadow-green-200' 
                : 'bg-primary hover:opacity-90 shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
            }`}
          >
            {status === 'sending' && 'Placing...'}
            {status === 'success' && 'Done! ✅'}
            {status === 'idle' && 'Place Order & Notify'}
            {status === 'error' && 'Retry'}
            {(status === 'idle' || status === 'error') && <ChevronRight className="w-5 h-5" />}
          </button>

          <div className="pt-2">
            <button 
              type="button"
              onClick={() => {
                const taxAmount = Math.round(cartTotal * 0.05);
                const grandTotal = cartTotal + taxAmount;
                let msg = `Hello KOS Café, I want to order:\n\n`;
                if (tableNumber) msg += `*TABLE: ${tableNumber}*\n\n`;
                cart.forEach(item => {
                  msg += `• ${item.name} (${item.selectedSize}) x ${item.qty} = ₹${item.price * item.qty}\n`;
                });
                msg += `\n*Total: ₹${grandTotal}*\n`;
                msg += `\nName: ${name || 'Not provided'}\n`;
                msg += `Address: ${address || 'Not provided'}\n`;
                if (locationObj) msg += `Location: https://www.google.com/maps?q=${locationObj.lat},${locationObj.lng}\n`;
                
                window.open(`https://wa.me/917060403965?text=${encodeURIComponent(msg)}`, '_blank');
              }}
              className="w-full bg-[#25D366]/10 text-[#25D366] py-3 rounded-[20px] font-bold uppercase tracking-widest text-[9px] border border-[#25D366]/20 transition-all flex justify-center items-center gap-2"
            >
              Order via WhatsApp (Fallback)
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.273.607-1.446.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298L11.006 11.2c.101.209.02.378-.051.52-.071.141-.151.233-.254.34-.103.107-.217.221-.31.334-.107.13-.218.271-.091.488.127.216.563.928 1.211 1.503.834.743 1.54.972 1.761 1.081.221.109.351.091.484-.061.132-.153.565-.658.718-.881.153-.223.307-.187.518-.109.21.078 1.332.628 1.56.744.227.116.379.174.434.268.055.094.055.544-.089.949z"/></svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );

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
                ? 'bottom-0 left-0 right-0 h-auto max-h-[96dvh] rounded-t-[2.5rem]' 
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
            <div className={`border-b border-border-base/50 flex-shrink-0 ${isMobile ? 'px-6 py-4' : 'p-6'}`}>
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-serif text-2xl text-heading">Your Order</h2>
                <button 
                  onClick={() => toggleDrawer(false)} 
                  className="p-2 hover:bg-background rounded-full transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 text-muted" aria-hidden="true" />
                </button>
              </div>
              {tableNumber && (
                <div className="inline-flex px-4 py-2 bg-primary text-background rounded-xl shadow-lg shadow-primary/20">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Serving Table {tableNumber}</span>
                </div>
              )}
            </div>

            {/* Content Area (Scrollable Items + Form on mobile) */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="p-6 space-y-6">
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
                          <h4 className="font-serif text-lg text-heading">{item.name}</h4>
                          <span className="font-sans font-medium text-sm">{formatCurrency((Number(item.price) || 0) * (Number(item.qty) || 0))}</span>
                        </div>
                        <p className="text-xs text-muted mb-2 uppercase tracking-wide">
                          {item.selectedSize} 
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-border-base rounded-full">
                            <button 
                              onClick={() => updateQuantity(item.cartId, -1)}
                              className="px-3 py-1 hover:bg-sidebar rounded-l-full transition-colors"
                            >-</button>
                            <span className="px-1 text-sm font-sans w-6 text-center">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartId, 1)}
                              className="px-3 py-1 hover:bg-sidebar rounded-r-full transition-colors"
                            >+</button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-muted/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {isMobile && cart.length > 0 && (
                <div className="p-6 bg-cart border-t border-border-base pb-10">
                  <CartForm />
                </div>
              )}
            </div>

            {/* Desktop Fixed Form */}
            {!isMobile && cart.length > 0 && (
              <div className="p-6 bg-cart border-t border-border-base flex-shrink-0">
                <CartForm />
              </div>
            )}
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;