import React from 'react';
import Hero from '../components/Hero';
import AboutStory from '../components/AboutStory';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import StandupShows from '../components/StandupShows';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <main>
      <SEO 
        title="KOS Sports Café | Home" 
        description="The ultimate gathering place for sports enthusiasts and food lovers in Meerut. Experience world-class gaming and world-class cuisine at KOS Sports Café."
      />
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
