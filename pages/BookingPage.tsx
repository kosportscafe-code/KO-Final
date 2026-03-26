import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import SEO from '../components/SEO';
import { Calendar, Users, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventParam = searchParams.get('event');
  const dateParam = searchParams.get('date');
  const priceParam = searchParams.get('price');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Motion = motion as any;

  return (
    <main className="pt-24 min-h-screen bg-stone-50">
      <SEO 
        title="Book Table & Events | KOS Sports Café"
        description="Reserve your table or book tickets for upcoming events at KOS Sports Café. Guaranteed priority seating and seamless WhatsApp confirmation."
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-obsidian overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/Hero2.jpg" 
            alt="Atmosphere" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 to-obsidian" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">Reservations</h1>
            <p className="text-cream/60 max-w-2xl mx-auto font-sans text-lg">
              Secure your spot for the big game, a live show, or a casual evening with world-class cuisine.
            </p>
          </Motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-24 -mt-12 group">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Info Column */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
                  <h2 className="font-serif text-2xl text-obsidian mb-6">Booking Info</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-bronze/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-bronze" />
                      </div>
                      <div>
                        <p className="font-bold text-obsidian text-sm uppercase tracking-wider">Quick Response</p>
                        <p className="text-stone-500 text-sm">We typically confirm all requests on WhatsApp within 30 minutes.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-bronze/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-bronze" />
                      </div>
                      <div>
                        <p className="font-bold text-obsidian text-sm uppercase tracking-wider">Group Bookings</p>
                        <p className="text-stone-500 text-sm">For groups larger than 12, please mention it in the special requests.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-bronze/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-bronze" />
                      </div>
                      <div>
                        <p className="font-bold text-obsidian text-sm uppercase tracking-wider">Secure Booking</p>
                        <p className="text-stone-500 text-sm">Your data is only used for reservation purposes via encrypted WhatsApp chat.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-bronze rounded-2xl text-white shadow-lg shadow-bron/20 transform transition-transform hover:scale-[1.02]">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-white/80">Need Help?</p>
                  <h3 className="font-serif text-2xl mb-4">Direct Support</h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">
                    Have questions about corporate events or catering? Chat with our manager directly.
                  </p>
                  <a 
                    href="https://wa.me/917060403965" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-obsidian text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-8">
                <div className="bg-white p-6 md:p-12 rounded-3xl border border-stone-100 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <BookingForm 
                      initialType={eventParam ? `Event: ${eventParam}` : 'Table Reservation'}
                      price={priceParam ? parseInt(priceParam) : 0}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
