import React from 'react';
import Hero from '../components/Hero';
import AboutStory from '../components/AboutStory';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import StandupShows from '../components/StandupShows';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <AboutStory />
      <Menu />
      <Gallery />
      <StandupShows />
    </main>
  );
};

export default Home;
