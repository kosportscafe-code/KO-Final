import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDriveImage } from '../utils/helpers';

interface Show {
  id: string;
  title: string;
  date: string;
  time: string;
  price: number;
  description: string;
  image: string;
  maxSeats: number | null;
}

const PUBLIC_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1wAzoqtqTOqr8ZCSZHVsny5URpehSBVI6IOAz4hhxdfE/gviz/tq?tqx=out:csv&gid=0";

const StandupShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [request, setRequest] = useState('');
  
  // Geolocation state
  const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'captured' | 'denied'>('idle');
  const [locationObj, setLocationObj] = useState<{lat: number, lng: number} | null>(null);
  
  // Booking submit status
  const [isSending, setIsSending] = useState(false);

  const Motion = motion as any;

  useEffect(() => {
    const fetchShows = async () => {
      try {
        // Add cache-busting parameter to always get the latest sheet data
        const response = await fetch(`${PUBLIC_SHEET_CSV_URL}&t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Failed to fetch sheet");
        
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        
        if (rows.length <= 1) {
           setShows([]);
           setLoading(false);
           return;
        }

        const data: Show[] = rows.slice(1).map((row, index) => {
          // Robust regex to split commas outside of quotes
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          
          let rawImage = cols[5]?.replace(/^"|"$/g, '').trim();
          const finalImage = rawImage ? getDriveImage(rawImage) : `https://images.unsplash.com/photo-1527224857830-43a7eaa58c5f?auto=format&fit=crop&w=800&q=80&rand=${index}`;

          return {
            id: `dym-show-${index}`,
            title: cols[0]?.replace(/^"|"$/g, '').trim() || 'Upcoming Show',
            date: cols[1]?.replace(/^"|"$/g, '').trim() || 'TBA',
            time: cols[2]?.replace(/^"|"$/g, '').trim() || 'TBA',
            price: parseInt(cols[3]?.replace(/\D/g, '') || '0', 10),
            description: cols[4]?.replace(/^"|"$/g, '').trim() || '',
            image: finalImage,
            maxSeats: parseInt(cols[6]?.replace(/\D/g, ''), 10) || null
          };
        });

        setShows(data);
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

  const handleGetLocation = () => {
    setLocationStatus('fetching');
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
        setLocationStatus('denied');
      },
      { timeout: 5000 }
    );
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShow) return;
    if (!name.trim() || !phone.trim() || seats < 1) {
      alert("Please provide the required details (Name, Phone, Seats).");
      return;
    }

    setIsSending(true);

    const total = seats * selectedShow.price;
    
    let message = `Hello, I would like to book seats for a standup show:\n\n`;
    message += `\uD83C\uDFA4 Show: ${selectedShow.title}\n`;
    message += `\uD83D\uDCC5 Date: ${selectedShow.date}\n`;
    message += `\u23F0 Time: ${selectedShow.time}\n\n`;
    
    message += `\uD83D\uDC64 Name: ${name}\n`;
    message += `\uD83D\uDCDE Phone: ${phone}\n`;
    message += `\uD83C\uDFAB Seats: ${seats}\n`;
    if (request.trim()) {
      message += `\uD83D\uDCDD Special Request: ${request}\n`;
    }
    
    message += `\n\uD83D\uDCB0 Total: \u20B9${total}\n\n`;
    
    if (locationStatus === 'captured' && locationObj) {
      message += `\uD83D\uDCCD Location:\nhttps://www.google.com/maps?q=${locationObj.lat},${locationObj.lng}`;
    } else {
      message += `\uD83D\uDCCD Location: Not shared`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917060403965?text=${encodedMessage}`;

    alert("Redirecting to WhatsApp to place your booking...");
    window.location.href = whatsappUrl;

    setTimeout(() => {
        setIsSending(false);
        setSelectedShow(null);
        setName('');
        setPhone('');
        setSeats(1);
        setRequest('');
        setLocationStatus('idle');
        setLocationObj(null);
    }, 1000);
  };

  return (
    <section id="shows" className="py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-6">
            🎤 Live Standup Shows
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto font-sans">
            Grab a drink and get ready for a night of non-stop laughter. Check out our upcoming live comedy events!
          </p>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <Loader2 className="w-10 h-10 text-bronze animate-spin mb-4" />
              <p className="font-sans text-stone-500 uppercase tracking-widest text-sm">Loading Shows...</p>
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
               <div key={show.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={show.image} alt={show.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-obsidian">
                    ₹{show.price} / Seat
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-xl text-obsidian mb-2">{show.title}</h3>
                  <p className="text-stone-500 text-sm mb-5 flex-1">{show.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-sm text-stone-600">
                      <Calendar className="w-4 h-4 mr-3 text-bronze" />
                      {show.date}
                    </div>
                    <div className="flex items-center text-sm text-stone-600">
                      <Clock className="w-4 h-4 mr-3 text-bronze" />
                      {show.time}
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedShow(show)}
                    className="w-full bg-transparent border border-obsidian text-obsidian py-3 font-sans uppercase tracking-widest text-xs hover:bg-obsidian hover:text-white transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
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
              className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-alabaster">
                <div>
                  <h3 className="font-serif text-2xl text-obsidian">Book Tickets</h3>
                  <p className="text-sm text-stone-500">{selectedShow.title}</p>
                </div>
                <button onClick={() => setSelectedShow(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleBookSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <input 
                      required
                      type="text" 
                      placeholder="Your Name (Required)" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                    
                    <input 
                      required
                      type="tel" 
                      placeholder="Phone Number (Required)" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />

                    <div className="flex gap-4 items-end">
                      <div className="flex-1 border-b border-stone-300 py-3">
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">
                          Number of Seats {selectedShow.maxSeats ? `(Max ${selectedShow.maxSeats})` : ''}
                        </label>
                        <input 
                          required
                          type="number" 
                          min="1"
                          max={selectedShow.maxSeats || undefined}
                          value={seats}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setSeats(selectedShow.maxSeats && val > selectedShow.maxSeats ? selectedShow.maxSeats : val);
                          }}
                          className="w-full bg-transparent text-obsidian focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 border-b border-stone-300 py-3 text-right">
                        <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Total Amount</label>
                        <span className="text-xl font-medium text-obsidian">₹{seats * selectedShow.price}</span>
                      </div>
                    </div>

                    <input 
                      type="text" 
                      placeholder="Special Request (Optional)" 
                      value={request}
                      onChange={(e) => setRequest(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 py-3 text-obsidian placeholder-stone-400 focus:border-bronze focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Geolocation Section */}
                  <div className="pt-4 pb-2">
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-100">
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-5 h-5 ${locationStatus === 'captured' ? 'text-green-500' : 'text-stone-400'}`} />
                        <span className="text-sm font-medium text-stone-600">
                          {locationStatus === 'idle' && "Share your live location"}
                          {locationStatus === 'fetching' && "Fetching location..."}
                          {locationStatus === 'captured' && "Location captured \u2705"}
                          {locationStatus === 'denied' && "Location not shared"}
                        </span>
                      </div>
                      {locationStatus !== 'captured' && locationStatus !== 'fetching' && (
                        <button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="text-xs uppercase tracking-wider font-semibold text-bronze hover:text-obsidian transition-colors"
                        >
                          Get Location
                        </button>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-obsidian text-white py-4 font-sans uppercase tracking-widest text-xs hover:bg-stone-800 transition-colors mt-4 disabled:opacity-70"
                  >
                    {isSending ? 'Redirecting...' : 'Confirm Booking on WhatsApp'}
                  </button>
                </form>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StandupShows;
