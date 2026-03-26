import { CafeEvent } from '../types';

export interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  guests: number;
  date: string;
  type: 'Table Reservation' | 'Event Booking' | 'General Inquiry';
  eventName?: string;
  message?: string;
  timestamp: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const BOOKING_STORAGE_KEY = 'kos_bookings';

export const getBookings = (): BookingRecord[] => {
  try {
    const data = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Failed to load bookings', error);
    return [];
  }
};

export const saveBooking = (booking: Omit<BookingRecord, 'id' | 'timestamp' | 'status'>): void => {
  const bookings = getBookings();
  const newBooking: BookingRecord = {
    ...booking,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    status: 'Pending'
  };
  
  bookings.unshift(newBooking);
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
};

export const updateBookingStatus = (id: string, status: BookingRecord['status']): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
  }
};

export const deleteBooking = (id: string): void => {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== id);
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(filtered));
};
