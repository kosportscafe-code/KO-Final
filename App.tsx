import React from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutStory from './components/AboutStory';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import AIAtelier from './components/AIAtelier';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-alabaster flex flex-col">
        <Navbar />
        <main>
          <Hero />
          <AboutStory />
          <Menu />
          <Gallery />
          <AIAtelier />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;