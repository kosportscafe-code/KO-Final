import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AboutStory from '../components/AboutStory';
import MenuHighlights from '../components/MenuHighlights';
import Gallery from '../components/Gallery';
import StandupShows from '../components/StandupShows';
import BookingForm from '../components/BookingForm';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';
import { Calendar, Users, ArrowRight, ShoppingBag } from 'lucide-react';

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling for virtual routes and hash fragments
    const scrollToSection = () => {
      const { pathname, hash } = location;
      
      if (pathname === '/about') {
        document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/menu') {
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/events') {
        document.getElementById('shows')?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/book' || hash === '#booking') {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/faq') {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/contact') {
        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash) {
        const id = hash.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Small delay to ensure components are mounted
    const timeoutId = setTimeout(scrollToSection, 100);
    return () => clearTimeout(timeoutId);
  }, [location]);

  const getSEOProps = () => {
    switch(location.pathname) {
      case '/about':
        return {
          title: "About Our Story | KOS Sports Café",
          description: "Discover the passion behind KOS Sports Café. From our world-class gaming atmosphere to our commitment to exceptional cuisine in Meerut.",
          image: "/images/Hero2.jpg"
        };
      case '/menu':
        return {
          title: "Our Menu | KOS Sports Café",
          description: "Explore the delicious offerings at KOS Sports Café. From signature sandwiches and pizzas to specialty drinks and thalis.",
          image: "/images/menu/bowl.jpg"
        };
      case '/events':
        return {
          title: "Upcoming Events & Shows | KOS Sports Café",
          description: "Join us for live standup comedy, sports screenings, and exclusive events. Experience the best entertainment in Meerut at KOS Sports Café.",
          image: "/images/GalleryGrid/event1.jpg"
        };
      case '/contact':
        return {
          title: "Contact Us & Location | KOS Sports Café",
          description: "Find us in Meerut! Get in touch for bookings, event inquiries, or visit us to experience the ultimate sports café vibe.",
          image: "/images/Hero1.jpg"
        };
      default:
        return {
          title: "KOS Sports Café | Home",
          description: "The ultimate gathering place for sports enthusiasts and food lovers in Meerut. Experience world-class gaming and world-class cuisine at KOS Sports Café.",
          image: "/images/Hero1.jpg"
        };
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the opening hours of KOS Sports Café?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "KOS Sports Café is open daily from 11:00 AM to 11:00 PM, serving you world-class cuisine and entertainment throughout the day."
        }
      },
      {
        "@type": "Question",
        "name": "Do you host live comedy or events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We regularly host live standup comedy shows, sports screenings, and exclusive entertainment events. You can find our upcoming schedule in the Events section."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a gaming or sports screening zone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. We feature a dedicated sports screening area for the big games and world-class gaming consoles for enthusiasts to enjoy."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of food is available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our diverse menu features Italian favorites like pizzas and pastas, Mexican snacks, specialized Indian thalis, and a wide range of Continental dishes."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book events or tables?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we accept bookings for tables and private events. You can reach out to us directly via WhatsApp through the contact links on our site."
        }
      },
      {
        "@type": "Question",
        "name": "Where is the cafe located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cafe is located Near Rohta Road on NH58, Meerut. It's the ultimate gathering spot for sports and food lovers in the city."
        }
      }
    ]
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@id": "https://www.kosportscafe.com/#restaurant",
    "@type": ["Restaurant", "SportsActivityLocation"],
    "name": "KOS Sports Café",
    "image": ["https://www.kosportscafe.com/images/Hero1.jpg", "https://www.kosportscafe.com/images/LOGO.jpg"],
    "priceRange": "$$",
    "servesCuisine": ["Italian", "Mexican", "Indian", "Continental"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Rohta Road, NH58",
      "addressLocality": "Meerut",
      "addressRegion": "UP",
      "postalCode": "250002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.9845,
      "longitude": 77.7064
    },
    "url": "https://www.kosportscafe.com",
    "telephone": "+917060403965",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/kosportscafe/",
      "https://www.facebook.com/kosportscafe/"
    ],
    "hasMenu": "https://www.kosportscafe.com/menu"
  };

  const seoPropsFromPath = getSEOProps();
  const finalSeoProps = {
    ...seoPropsFromPath,
    jsonLd: [businessSchema, faqSchema]
  };

  return (
    <main>
      <SEO {...finalSeoProps} />

      <Hero />
      <AboutStory />
      <MenuHighlights />
      <Gallery />
      <StandupShows />

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Calendar size={16} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest">Reservations</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-heading mb-4">Book a Table</h2>
            <p className="text-muted max-w-2xl mx-auto font-sans leading-relaxed">
              Planning a visit, a private event, or just want to ensure your favorite spot is ready? 
              Fill out the form below and we'll confirm your booking on WhatsApp.
            </p>
            <div className="w-16 h-[1px] bg-primary mx-auto mt-8"></div>
          </div>

          <div className="bg-cart p-8 md:p-12 rounded-3xl border border-border-base shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h3 className="font-serif text-2xl text-heading mb-4">Why Book with Us?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-heading font-bold text-sm">Priority Seating</p>
                        <p className="text-muted text-xs">Get the best views during major sports screenings.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Calendar className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-heading font-bold text-sm">Event Coordination</p>
                        <p className="text-muted text-xs">Tailored menus for birthdays and group gatherings.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="p-6 bg-sidebar rounded-2xl text-heading">
                  <p className="text-muted/60 text-[10px] uppercase tracking-widest font-bold mb-2">Need immediate help?</p>
                  <p className="font-serif text-xl mb-4">Chat with our team directly for instant updates.</p>
                  <a href="https://wa.me/917060403965" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-heading transition-colors text-sm font-bold uppercase tracking-widest">
                    WhatsApp Chat <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Global Order CTA */}
      <section className="py-24 bg-sidebar relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center grayscale" />
          <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-6xl text-heading mb-6 leading-tight">
              Ready to <span className="text-primary italic">Fuel</span> Your Game?
            </h2>
            <p className="text-muted/60 text-lg mb-10 font-sans leading-relaxed">
              Order your favorites now and enjoy the ultimate sports cafe experience at home or in our stadium-vibe lounge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/order" 
                className="inline-flex items-center justify-center gap-3 bg-primary text-background px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-heading hover:text-background transition-all shadow-2xl active:scale-95"
              >
                Order Online Now <ShoppingBag size={18} />
              </a>
              <a 
                href="/book" 
                className="inline-flex items-center justify-center gap-3 bg-heading/10 backdrop-blur-md border border-heading/20 text-heading px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-heading/20 transition-all active:scale-95"
              >
                Book a Table
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
      
      {/* Semantic Address - Invisible but AIO-rich */}
      <address className="not-italic opacity-0 h-0 pointer-events-none overflow-hidden">
        KOS Sports Café<br />
        Near Rohta Road on NH58<br />
        Meerut, Uttar Pradesh 250002<br />
        India
      </address>
    </main>
  );
};

export default Home;
