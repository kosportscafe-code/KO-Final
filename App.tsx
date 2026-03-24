import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import AdminEvents from './pages/AdminEvents';
import AdminBlog from './pages/AdminBlog';

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
          </Route>
          
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<BlogListing />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
              </Routes>
              <Footer />
              <CartDrawer />
            </>
          } />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;