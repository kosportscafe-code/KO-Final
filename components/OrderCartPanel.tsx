import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, X, Trash2, Minus, Plus, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const OrderCartPanel: React.FC = () => {
  const { 
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
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in all details before placing the order.");
      return;
    }

    setStatus('sending');
    const taxAmount = Math.round(cartTotal * 0.05);
    const grandTotal = cartTotal + taxAmount;

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
    
    window.location.href = whatsappUrl;
    
    setTimeout(() => {
      clearCart();
      setStatus('idle');
      setName('');
      setPhone('');
      setAddress('');
      setLocationStatus('idle');
      setLocationObj(null);
    }, 100);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-cart rounded-3xl p-8 border border-border-base h-[400px] flex flex-col justify-center items-center text-center">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 text-muted/30">
          <ShoppingBag size={32} />
        </div>
        <h3 className="font-serif text-xl text-heading mb-2">Your cart is empty 🛒</h3>
        <p className="text-muted text-sm">Start adding food!</p>
      </div>
    );
  }

  return (
    <div className="bg-cart rounded-3xl shadow-xl border border-border-base overflow-hidden flex flex-col sticky top-24 max-h-[calc(100vh-120px)]">
      {/* Items Section */}
      <div className="p-6 border-b border-border-base/50">
        <h2 className="font-serif text-xl text-heading flex items-center gap-2">
          Your Order <span className="text-xs bg-bronze text-white px-2 py-0.5 rounded-full font-sans">{cart.length}</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {cart.map((item) => (
          <div key={item.cartId} className="flex gap-3 pb-4 border-b border-border-base/10 last:border-0 last:pb-0">
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-sans font-bold text-sm text-heading leading-tight">{item.name}</h4>
                <span className="font-sans font-bold text-sm text-heading">{formatCurrency(item.price * item.qty)}</span>
              </div>
              <p className="text-[10px] text-muted mb-2 uppercase tracking-wide font-medium">
                {item.selectedSize}
              </p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-muted text-xs">Unit: ₹{Number(item.price) || 0}</p>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => updateQuantity(item.cartId, -1)}
                      className="w-7 h-7 flex items-center justify-center border border-border-base text-body hover:bg-sidebar rounded-lg transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-heading">{item.qty}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartId, 1)}
                      className="w-7 h-7 flex items-center justify-center border border-border-base text-body hover:bg-sidebar rounded-lg transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.cartId)}
              className="text-muted/40 hover:text-red-400 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <div className="p-6 bg-sidebar/10 border-t border-border-base/30">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            required
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white border border-border-base rounded-xl px-4 py-2 text-sm text-heading placeholder-muted/50 focus:border-bronze focus:outline-none transition-colors shadow-sm"
          />
          <input 
            required
            type="text" 
            placeholder="Full Delivery Address" 
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-white border border-border-base rounded-xl px-4 py-2 text-sm text-heading placeholder-muted/50 focus:border-bronze focus:outline-none transition-colors shadow-sm"
          />
          <input 
            required
            type="tel" 
            placeholder="Phone Number" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-white border border-border-base rounded-xl px-4 py-2 text-sm text-heading placeholder-muted/50 focus:border-bronze focus:outline-none transition-colors shadow-sm"
          />
          
          <button 
            type="button" 
            onClick={handleGetLocation}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
              locationStatus === 'captured' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : 'bg-white text-body border-border-base hover:border-muted'
            }`}
          >
            <MapPin size={14} />
            {locationStatus === 'captured' 
              ? `Location: ${locationObj?.lat.toFixed(4)}, ${locationObj?.lng.toFixed(4)} ✅` 
              : "Share Live Location"}
          </button>
          
          <div className="py-2 space-y-1.5">
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Subtotal</span>
              <span className="font-bold text-heading">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Taxes (5%)</span>
              <span className="font-bold text-heading">{formatCurrency(Math.round(cartTotal * 0.05))}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border-base/30 mt-1">
              <span className="text-heading font-serif text-lg uppercase tracking-wider">Total</span>
              <span className="text-2xl font-sans text-bronze font-black">{formatCurrency(cartTotal + Math.round(cartTotal * 0.05))}</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-[#25D366] text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-sm hover:bg-[#128C7E] transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-70 active:scale-95 shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
          >
            {status === 'sending' ? 'Redirecting...' : 'Order on WhatsApp'}
            {status === 'idle' && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderCartPanel;
