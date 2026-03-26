import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookings, updateBookingStatus, deleteBooking, BookingRecord } from '../../services/bookingService';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<'All' | 'Table Reservation' | 'Event Booking' | 'General Inquiry'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBookings(getBookings());
  };

  const handleStatusUpdate = (id: string, status: BookingRecord['status']) => {
    updateBookingStatus(id, status);
    loadData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking record?')) {
      deleteBooking(id);
      loadData();
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesFilter = filter === 'All' || b.type === filter;
      const matchesSearch = b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           b.phone.includes(searchTerm) ||
                           (b.eventName && b.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, searchTerm]);

  // Stats
  const stats = useMemo(() => ({
    total: bookings.length,
    events: bookings.filter(b => b.type === 'Event Booking').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    today: bookings.filter(b => {
      const bDate = new Date(b.timestamp).toDateString();
      const today = new Date().toDateString();
      return bDate === today;
    }).length
  }), [bookings]);

  const Motion = motion as any;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-obsidian text-white flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Total</p>
            <p className="text-2xl font-serif text-obsidian">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-bronze text-white flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Events</p>
            <p className="text-2xl font-serif text-obsidian">{stats.events}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Pending</p>
            <p className="text-2xl font-serif text-obsidian">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Today</p>
            <p className="text-2xl font-serif text-obsidian">{stats.today}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['All', 'Table Reservation', 'Event Booking', 'General Inquiry'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === t 
                  ? 'bg-obsidian text-white' 
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {t === 'Table Reservation' ? 'Tables' : t === 'Event Booking' ? 'Events' : t === 'General Inquiry' ? 'Inquiries' : t}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-200 rounded-full text-sm font-sans focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/20"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Type / Detail</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Guests</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              <AnimatePresence mode="popLayout">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <Motion.tr 
                      key={b.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-obsidian">{b.customerName}</p>
                          <p className="text-xs text-stone-500">{b.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            b.type === 'Table Reservation' ? 'bg-blue-50 text-blue-600' :
                            b.type === 'Event Booking' ? 'bg-purple-50 text-purple-600' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {b.type.split(' ')[0]}
                          </span>
                          {b.eventName && <span className="text-xs font-serif text-bronze">{b.eventName}</span>}
                        </div>
                        {b.message && (
                          <div className="mt-1 flex items-start gap-1 text-[10px] text-stone-400 italic">
                            <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{b.message}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Users className="w-3 h-3" />
                          <span className="text-sm font-bold">{b.guests}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Calendar className="w-3 h-3" />
                          <span className="text-sm">{b.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                          b.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(b.id, 'Confirmed')}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark as Confirmed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(b.id, 'Cancelled')}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Mark as Cancelled"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-stone-200 mx-1" />
                          <button 
                            onClick={() => handleDelete(b.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </Motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-300">
                          <Search className="w-6 h-6" />
                        </div>
                        <p className="text-stone-400 text-sm">No bookings found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
