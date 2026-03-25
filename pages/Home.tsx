import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AboutStory from '../components/AboutStory';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import StandupShows from '../components/StandupShows';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling for virtual routes
    if (location.pathname === '/about') {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/menu') {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/contact') {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  const getSEOProps = () => {
    switch(location.pathname) {
      case '/about':
        return {
          title: "About Our Story | KOS Sports Café",
          description: "Discover the passion behind KOS Sports Café. From our world-class gaming atmosphere to our commitment to exceptional cuisine in Meerut."
        };
      case '/menu':
        return {
          title: "Our Menu | KOS Sports Café",
          description: "Explore the delicious offerings at KOS Sports Café. From signature sandwiches and pizzas to specialty drinks and thalis."
        };
      case '/contact':
        return {
          title: "Contact Us & Location | KOS Sports Café",
          description: "Find us in Meerut! Get in touch for bookings, event inquiries, or visit us to experience the ultimate sports café vibe."
        };
      default:
        return {
          title: "KOS Sports Café | Home",
          description: "The ultimate gathering place for sports enthusiasts and food lovers in Meerut. Experience world-class gaming and world-class cuisine at KOS Sports Café."
        };
    }
  };

  const seoProps = getSEOProps();

  return (
    <main>
      <SEO {...seoProps} />
      <Hero />
      <AboutStory />
      <Menu />
      <Gallery />
      <StandupShows />
      <Testimonials />
    </main>
  );
};

export default Home;
