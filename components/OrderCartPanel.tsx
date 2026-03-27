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
    clearCart,
    tableNumber,
    placeOrder
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
        
        // Construct WhatsApp message manually to keep the "Notify via WhatsApp" behavior
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
        
        // Small delay to show success before redirecting
        setTimeout(() => {
          window.location.href = whatsappUrl;
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      setStatus('error');
    }
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
      <div className="p-6 border-b border-border-base/50 flex flex-col gap-2">
        <h2 className="font-serif text-xl text-heading flex items-center gap-2">
          Your Order <span className="text-xs bg-bronze text-white px-2 py-0.5 rounded-full font-sans">{cart.length}</span>
        </h2>
        {tableNumber && (
          <div className="inline-flex self-start px-4 py-2 bg-bronze text-white rounded-xl shadow-lg shadow-bronze/20">
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Serving Table {tableNumber}</span>
          </div>
        )}
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
            className="w-full bg-white border border-border-base rounded-xl px-5 py-4 text-sm text-heading placeholder-muted/50 focus:border-bronze focus:outline-none transition-colors shadow-sm"
          />
          <input 
            required
            type="tel" 
            placeholder="Phone Number" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full bg-white border border-border-base rounded-xl px-5 py-4 text-sm text-heading placeholder-muted/50 focus:border-bronze focus:outline-none transition-colors shadow-sm"
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
            disabled={status === 'sending' || status === 'success'}
            className={`w-full text-white py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 flex justify-center items-center gap-3 active:scale-95 shadow-lg ${
              status === 'success' 
                ? 'bg-green-500 shadow-green-200' 
                : 'bg-bronze hover:bg-bronze-dark shadow-[0_10px_30px_rgba(184,134,11,0.3)]'
            }`}
          >
            {status === 'sending' && 'Placing Order...'}
            {status === 'success' && 'Order Placed! ✅'}
            {status === 'idle' && 'Place Order & Notify'}
            {status === 'error' && 'Retry Order'}
            {(status === 'idle' || status === 'error') && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
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
              className="w-full bg-[#25D366]/10 text-[#25D366] py-4 rounded-[20px] font-bold uppercase tracking-widest text-[10px] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all flex justify-center items-center gap-2"
            >
              Order via WhatsApp (Fallback)
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.853.448-1.273.607-1.446.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298L11.006 11.2c.101.209.02.378-.051.52-.071.141-.151.233-.254.34-.103.107-.217.221-.31.334-.107.13-.218.271-.091.488.127.216.563.928 1.211 1.503.834.743 1.54.972 1.761 1.081.221.109.351.091.484-.061.132-.153.565-.658.718-.881.153-.223.307-.187.518-.109.21.078 1.332.628 1.56.744.227.116.379.174.434.268.055.094.055.544-.089.949z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCartPanel;
