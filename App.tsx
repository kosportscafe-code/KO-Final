import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminEvents from './pages/AdminEvents';
import AdminBlog from './pages/AdminBlog';
import AdminMedia from './pages/AdminMedia';
import AdminMenu from './pages/AdminMenu';
import AdminBookings from './pages/admin/AdminBookings';
import GalleryPage from './pages/GalleryPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import BookingPage from './pages/BookingPage';
import OrderPage from './pages/OrderPage';
import BackgroundDecor from './components/BackgroundDecor';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-alabaster flex flex-col">
        {/* We only want Navbar and Footer outside of the Admin layout, 
            so we move Navbar/Footer into conditional logic, 
            but using standard Routes makes it simpler. 
            For this Vite app, standard Navbar overlay goes everywhere except /admin. Let's do a wildcard router! */}
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            {/* The index route redirects to blog */}
            <Route index element={<AdminBlog />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
          
          <Route path="/*" element={
            <>
              <Navbar />
              <BackgroundDecor />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<Home />} />
                <Route path="/menu" element={<OrderPage />} />
                <Route path="/events" element={<Home />} />
                <Route path="/book" element={<BookingPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/contact" element={<Home />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/blog" element={<BlogListing />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
              </Routes>
              <Footer />
              <ChatBot />
            </>
          } />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;