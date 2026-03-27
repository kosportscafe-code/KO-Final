import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDriveImage, generateAltText, generateEventSchema, getOptimizedImageUrl } from '../utils/helpers';
import BookingForm from './BookingForm';
import { getEvents } from '../services/eventService';
import { CafeEvent } from '../types';

interface Show extends CafeEvent {
  price: number;
}

const StandupShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  
  const Motion = motion as any;

  useEffect(() => {
    const fetchShows = () => {
      try {
        const allEvents = getEvents();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingEvents: Show[] = allEvents
          .map(evt => ({
            ...evt,
            title: evt.name, // Mapping Admin 'name' to UI 'title'
            price: evt.price || 0
          }))
          .filter(evt => {
            try {
              if (!evt.date) return false;
              const eventDate = new Date(evt.date);
              if (isNaN(eventDate.getTime())) return true; // Show if unparseable (e.g. "Coming Soon")
              return eventDate >= now;
            } catch (e) {
              return true; 
            }
          })
          .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateA - dateB;
          });

        setShows(upcomingEvents);
        setError(null);
      } catch (err) {
        console.error("Error loading shows:", err);
        setError("Failed to load upcoming shows. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);


  useEffect(() => {
    if (shows.length === 0) return;

    const schema = shows.map(show => generateEventSchema(show));
    
    let script = document.querySelector('script[id="events-jsonld"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'events-jsonld');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      const el = document.querySelector('script[id="events-jsonld"]');
      if (el) el.remove();
    };
  }, [shows]);

  return (
    <section id="shows" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-heading mb-6">
            🎤 Live Standup Shows
          </h2>
          <p className="text-muted max-w-2xl mx-auto font-sans">
            Grab a drink and get ready for a night of non-stop laughter. Check out our upcoming live comedy events!
          </p>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="font-sans text-muted uppercase tracking-widest text-sm">Loading Shows...</p>
           </div>
        ) : error ? (
           <div className="text-center py-20 min-h-[400px] flex items-center justify-center">
              <p className="text-red-500 bg-red-50 px-6 py-4 rounded-lg">{error}</p>
           </div>
        ) : shows.length === 0 ? (
           <div className="text-center py-20 min-h-[400px] flex items-center justify-center">
              <p className="text-stone-500 text-lg">No upcoming shows at the moment. Stay tuned!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shows.map((show) => (
               <article key={show.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={getOptimizedImageUrl(show.image || 'https://images.unsplash.com/photo-1514525253361-b83f8b9627c5?auto=format&fit=crop&q=80', 600)} 
                    alt={generateAltText(show.image, show.title, 'Standup Show')} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                  <div className="absolute top-4 right-4 bg-cart/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-heading">
                    ₹{show.price} / Seat
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl text-heading mb-2">{show.title}</h3>
                  <p className="text-muted text-sm mb-5 flex-1">{show.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-body">
                      <Calendar className="w-4 h-4 mr-3 text-primary" aria-hidden="true" />
                      {show.date}
                    </div>
                    <div className="flex items-center text-sm text-body">
                      <Clock className="w-4 h-4 mr-3 text-primary" aria-hidden="true" />
                      {show.time}
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedShow(show)}
                    className="w-full bg-transparent border border-heading text-heading py-3 font-sans uppercase tracking-widest text-xs hover:bg-heading hover:text-background transition-colors"
                    aria-label={`Book tickets for ${show.title}`}
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedShow && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <Motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-cart w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border-base flex justify-between items-center bg-background">
                <div>
                  <h3 className="font-serif text-2xl text-heading">Book Tickets</h3>
                  <p className="text-sm text-muted">{selectedShow.title}</p>
                </div>
                <button 
                  onClick={() => setSelectedShow(null)} 
                  className="p-2 hover:bg-sidebar rounded-full transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="w-5 h-5 text-muted" aria-hidden="true" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <BookingForm 
                  initialType={`Event: ${selectedShow.title} (${selectedShow.date})`}
                  price={selectedShow.price}
                  isModal={true}
                  onSuccess={() => setSelectedShow(null)}
                />
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StandupShows;
