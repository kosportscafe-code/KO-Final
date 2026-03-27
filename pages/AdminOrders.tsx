import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Filter, Trash2, Search, Table as TableIcon, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';
import { ORDERS_CSV_URL } from '../constants';
import Papa from 'papaparse';
import { orderService } from '../services/orderService';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTable, setFilterTable] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchOrders = async () => {
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
      return;
    }

    try {
      const response = await fetch(ORDERS_CSV_URL);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const mappedOrders = (results.data as any[]).map(row => ({
            id: row.id,
            tableId: row.tableId,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
            total: Number(row.total),
            status: row.status as any,
            timestamp: row.timestamp,
            customerName: row.customerName
          }));
          setOrders(mappedOrders);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for instant order broadcasts
    const unsubscribe = orderService.onNewOrder((newOrder) => {
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
    });

    return () => unsubscribe();
  }, []);

  const clearServedOrders = () => {
    const remaining = orders.filter(o => o.status !== 'SERVED');
    setOrders(remaining);
    localStorage.setItem('kos_order_history', JSON.stringify(remaining));
  };

  const filteredOrders = orders.filter(order => {
    const matchTable = filterTable === '' || order.tableId === filterTable;
    const matchStatus = filterStatus === 'ALL' || order.status === filterStatus;
    return matchTable && matchStatus;
  });

  const dailyRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.timestamp).toDateString();
      const today = new Date().toDateString();
      return orderDate === today && o.status !== 'CANCELLED';
    })
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const dailyOrders = orders.filter(o => {
    const orderDate = new Date(o.timestamp).toDateString();
    return orderDate === new Date().toDateString();
  }).length;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and track your restaurant orders.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
            <div className="p-3 bg-bronze/10 rounded-xl text-bronze">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Today's Orders</p>
              <p className="text-2xl font-black text-gray-900">{dailyOrders}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Today's Revenue</p>
              <p className="text-2xl font-black text-gray-900">₹{dailyRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Table..." 
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bronze/20 focus:outline-none w-full"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-bronze/20 focus:outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="SERVED">Served</option>
          </select>
        </div>
        
        <button 
          onClick={clearServedOrders}
          className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          <Trash2 size={18} />
          Clear Served
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Table</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Items</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-gray-500">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg font-bold text-gray-700">
                      T-{order.tableId || 'Walk'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-600">
                          {item.qty}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      order.status === 'NEW' ? 'bg-orange-100 text-orange-600' :
                      order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'READY' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.total}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
