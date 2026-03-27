import React, { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { ORDERS_CSV_URL } from '../constants';
import Papa from 'papaparse';
import { orderService } from '../services/orderService';

const KitchenPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchOrders = async () => {
    // If no remote URL, use local storage as fallback for demo
    if (!ORDERS_CSV_URL) {
      const saved = localStorage.getItem('kos_order_history');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrders(parsed);
        } catch (e) {
          console.error("Failed to parse local orders");
        }
      }
      setLoading(false);
      setLastRefresh(new Date());
      return;
    }

    try {
      const response = await fetch(ORDERS_CSV_URL);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // In a real app, you'd map the CSV rows back to the Order interface
          // For now, we'll assume the format is compatible or handle it here
          const mappedOrders = (results.data as any[]).map(row => ({
            id: row.id,
            tableId: row.tableId,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
            total: Number(row.total),
            status: row.status as any,
            timestamp: row.timestamp,
          }));
          setOrders(mappedOrders);
          setLoading(false);
          setLastRefresh(new Date());
        }
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll secondary data every 10 seconds
    
    // Listen for instant order broadcasts
    const unsubscribe = orderService.onNewOrder((newOrder) => {
      setOrders(prev => {
        // Avoid duplicates if polling also picked it up
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
      // Play a notification sound if possible? Or just visual
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    // Note: This only updates local UI unless there's an UPDATE API
  };

  const getTimeString = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'NEW': return 'bg-orange-500 text-white animate-pulse';
      case 'PREPARING': return 'bg-yellow-400 text-black';
      case 'READY': return 'bg-green-500 text-white';
      case 'SERVED': return 'bg-gray-600 text-white opacity-50';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">Kitchen Dashboard</h1>
          <p className="text-white/40 font-medium">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-6">
          <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">New Orders</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'NEW').length}</p>
          </div>
          <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10 text-center">
            <p className="text-xs text-white/40 uppercase font-bold tracking-widest mb-1">Preparing</p>
            <p className="text-3xl font-black">{orders.filter(o => o.status === 'PREPARING').length}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64 text-white/40 animate-pulse text-xl font-bold uppercase tracking-widest">
          Syncing with Orders Database...
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {orders
          .filter(o => o.status !== 'CANCELLED' && o.status !== 'SERVED')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map(order => (
          <div key={order.id} className="bg-[#1a1a1a] rounded-[32px] border-2 border-white/10 overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
            {/* Card Header */}
            <div className={`p-8 flex justify-between items-start ${getStatusColor(order.status)}`}>
              <div>
                <span className="text-[14px] font-black uppercase tracking-[0.2em] opacity-90 mb-2 block">TABLE</span>
                <span className="text-6xl font-black tabular-nums">{order.tableId || 'WALK'}</span>
              </div>
              <div className="text-right">
                <span className="text-[14px] font-black uppercase tracking-[0.2em] opacity-90 mb-2 block">RECEIVED</span>
                <span className="text-3xl font-bold tabular-nums">{getTimeString(order.timestamp)}</span>
              </div>
            </div>

            {/* Items Section */}
            <div className="p-8 flex-1 space-y-6">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/10 p-5 rounded-[24px] border border-white/10">
                    <div className="flex items-center gap-6">
                      <span className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-3xl">
                        {item.qty}
                      </span>
                      <div>
                        <p className="font-black text-2xl leading-tight uppercase tracking-tight">{item.name}</p>
                        <p className="text-sm text-white/50 font-bold uppercase tracking-widest mt-1">{item.size || 'Regular'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateStatus(order.id, 'PREPARING')}
                className={`flex-1 py-8 rounded-[24px] font-black uppercase text-base tracking-widest transition-all ${
                  order.status === 'PREPARING' ? 'bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.4)]' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Prep
              </button>
              <button 
                onClick={() => updateStatus(order.id, 'READY')}
                className={`flex-1 py-8 rounded-[24px] font-black uppercase text-base tracking-widest transition-all ${
                  order.status === 'READY' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                Ready
              </button>
              <button 
                onClick={() => updateStatus(order.id, 'SERVED')}
                className="col-span-2 py-8 bg-white text-black rounded-[24px] font-black uppercase text-lg tracking-widest hover:bg-gray-200 transition-all active:scale-[0.98]"
              >
                Mark as Served
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96 text-white/20 space-y-6">
          <CheckCircle2 size={120} strokeWidth={1} opacity={0.3} />
          <h2 className="text-3xl font-black uppercase tracking-tighter">Kitchen is Quiet</h2>
          <p className="font-bold uppercase tracking-widest text-sm">Waiting for incoming table orders...</p>
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
