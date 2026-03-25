import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AboutStory from '../components/AboutStory';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import StandupShows from '../components/StandupShows';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import SEO from '../components/SEO';

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
      <Menu />
      <Gallery />
      <StandupShows />
      <Testimonials />
      
      {/* FAQ Section - Optically identical to original if it was hidden, 
          or ensuring it's semantically correct now. 
          Actually, the user asked to ADD FAQ schema AND content. 
          I will add it as a new section at the bottom to avoid changing existing section order.
      */}
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
