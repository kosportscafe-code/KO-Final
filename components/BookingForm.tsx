import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Users, Phone, User, MessageSquare, ArrowRight, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTACT_PHONE } from '../constants';
import { getEvents } from '../services/eventService';
import { saveBooking } from '../services/bookingService';
import { CafeEvent } from '../types';

interface BookingFormProps {
  initialType?: 'Table Reservation' | string;
  price?: number;
  onSuccess?: () => void;
  isModal?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  initialType = 'Table Reservation', 
  price = 0,
  onSuccess,
  isModal = false 
}) => {
  const [availableEvents, setAvailableEvents] = React.useState<CafeEvent[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    people: '2',
    date: new Date().toISOString().split('T')[0],
    type: initialType === 'Table Reservation' ? 'Table Reservation' : 'Event Booking',
    selectedEvent: initialType.startsWith('Event:') ? initialType.replace('Event: ', '') : '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const Motion = motion as any;

  React.useEffect(() => {
    setAvailableEvents(getEvents());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = () => {
    const { name, phone, people, date, type, selectedEvent, message } = formData;
    let title = "General Inquiry";
    if (type === 'Table Reservation') title = "Table Reservation";
    if (type === 'Event Booking') title = `Event Booking: ${selectedEvent || 'Upcoming Show'}`;

    let waMessage = `*NEW BOOKING REQUEST - KOS CAFÉ*\n`;
    waMessage += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    waMessage += `*Type:* ${title}\n`;
    waMessage += `*Date:* ${date}\n`;
    if (type !== 'General Inquiry') {
        waMessage += `*Guests:* ${people} People\n`;
    }
    
    waMessage += `\n*CUSTOMER DETAILS*\n`;
    waMessage += `*Name:* ${name}\n`;
    waMessage += `*Phone:* ${phone}\n`;
    
    if (message.trim()) {
      waMessage += `\n*SPECIAL REQUEST*\n${message}\n`;
    }
    
    waMessage += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    waMessage += `_Sent via Website Booking System_`;

    return waMessage;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleFinalConfirm = () => {
    setIsSubmitting(true);
    
    // Save to LocalStorage for Admin Dashboard
    saveBooking({
      customerName: formData.name,
      phone: formData.phone,
      guests: parseInt(formData.people.toString()) || 1,
      date: formData.date,
      type: formData.type as any,
      eventName: formData.selectedEvent,
      message: formData.message
    });

    const waMessage = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/917060403965?text=${encodedMessage}`;

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const formatDateNice = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-IN', options);
    } catch (e) {
      return dateStr;
    }
  };

  const inputClasses = "w-full bg-white/50 border border-stone-200 rounded-lg px-4 py-3 font-sans text-obsidian focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/20 transition-all placeholder:text-stone-400";
  const labelClasses = "block text-xs uppercase tracking-widest text-stone-500 font-bold mb-2 ml-1";

  if (showConfirmation) {
    return (
      <Motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 py-4 px-1"
      >
        <div className="bg-bronze/5 border border-bronze/20 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif text-xl text-obsidian flex items-center gap-2">
            Review Your Request
          </h3>
          <div className="grid grid-cols-2 gap-y-4 text-sm font-sans">
            <div>
              <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Type</p>
              <p className="text-obsidian font-bold">{formData.type}</p>
            </div>
            <div>
              <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Date</p>
              <p className="text-obsidian font-bold">{formatDateNice(formData.date)}</p>
            </div>
            <div>
              <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Name</p>
              <p className="text-obsidian font-bold">{formData.name}</p>
            </div>
            {formData.type !== 'General Inquiry' && (
              <div>
                <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Guests</p>
                <p className="text-obsidian font-bold">{formData.people} People</p>
              </div>
            )}
          </div>
          {formData.selectedEvent && (
            <div className="pt-2 border-t border-bronze/10">
              <p className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Selected Event</p>
              <p className="text-bronze font-bold">{formData.selectedEvent}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleFinalConfirm}
            disabled={isSubmitting}
            className="w-full bg-obsidian text-white py-4 rounded-lg font-sans text-sm font-bold uppercase tracking-widest hover:bg-bronze transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
          >
            {isSubmitting ? 'Opening WhatsApp...' : 'Confirm & Open WhatsApp'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => setShowConfirmation(false)}
            className="w-full bg-white text-stone-500 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:text-obsidian transition-colors text-center"
          >
            Go Back & Edit
          </button>
        </div>
      </Motion.div>
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className={`space-y-6 ${isModal ? '' : 'max-w-2xl mx-auto'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className={labelClasses}>Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              required
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="phone" className={labelClasses}>Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              required
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1">
          <label htmlFor="date" className={labelClasses}>Preferred Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              required
              id="date"
              name="date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Number of People */}
        <div className="space-y-1">
          <label htmlFor="people" className={labelClasses}>Number of Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <select
              id="people"
              name="people"
              value={formData.people}
              onChange={handleChange}
              className={`${inputClasses} pl-10 appearance-none`}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
          {price > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-bronze uppercase bg-bronze/10 px-2 py-1 rounded">
              Total: ₹{price * (parseInt(formData.people.toString().replace('+', '')) || 0)}
            </div>
          )}
        </div>
      </div>

      {/* Booking Type Options (Only in non-modal/standalone) */}
      {!isModal && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="type" className={labelClasses}>What are you booking for?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Table Reservation', selectedEvent: '' }))}
                className={`py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  formData.type === 'Table Reservation' 
                    ? 'bg-obsidian text-white border-obsidian' 
                    : 'bg-white text-stone-500 border-stone-200 hover:border-bronze'
                }`}
              >
                Table Reservation
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'Event Booking' }))}
                className={`py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  formData.type === 'Event Booking' 
                    ? 'bg-obsidian text-white border-obsidian' 
                    : 'bg-white text-stone-500 border-stone-200 hover:border-bronze'
                }`}
              >
                Event Booking
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'General Inquiry', selectedEvent: '' }))}
                className={`py-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  formData.type === 'General Inquiry' 
                    ? 'bg-obsidian text-white border-obsidian' 
                    : 'bg-white text-stone-500 border-stone-200 hover:border-bronze'
                }`}
              >
                General Inquiry
              </button>
            </div>
          </div>

          {/* Dynamic Event Selection Dropdown */}
          {formData.type === 'Event Booking' && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="selectedEvent" className={labelClasses}>Select Event</label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <select
                  required
                  id="selectedEvent"
                  name="selectedEvent"
                  value={formData.selectedEvent}
                  onChange={handleChange}
                  className={`${inputClasses} pl-10 appearance-none`}
                >
                  <option value="">Select an upcoming event...</option>
                  {availableEvents.map(evt => (
                    <option key={evt.id} value={evt.name}>{evt.name} ({evt.date})</option>
                  ))}
                  <option value="Private Celebration">Other / Private Celebration</option>
                </select>
              </div>
            </div>
          )}

          {formData.type === 'Table Reservation' && (
            <div className="space-y-1">
              <label htmlFor="subType" className={labelClasses}>Reservation Type</label>
              <select
                id="subType"
                name="message"
                onChange={(e) => setFormData(prev => ({ ...prev, message: `Type: ${e.target.value}. ${prev.message}` }))}
                className={inputClasses}
              >
                <option value="Casual Dining">Casual Dining</option>
                <option value="Sports Screening">Live Sports Screening Night</option>
                <option value="Gaming Night">Gaming Zone Slot</option>
                <option value="Work from Cafe">Work from Cafe</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Special Request */}
      <div className="space-y-1">
        <label htmlFor="message" className={labelClasses}>Special Request (Optional)</label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Any specific requests or instructions?"
            value={formData.message}
            onChange={handleChange}
            className={`${inputClasses} pl-10 resize-none`}
          ></textarea>
        </div>
      </div>

      <Motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-obsidian text-white py-4 rounded-lg font-sans text-sm font-bold uppercase tracking-widest hover:bg-bronze transition-all flex items-center justify-center gap-3 group"
      >
        Continue to Confirmation
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Motion.button>

      <p className="text-center text-[10px] text-stone-400 font-sans uppercase tracking-widest mt-4">
        Direct confirmation via WhatsApp with KOS Sports Café
      </p>
    </form>
  );
};

export default BookingForm;
