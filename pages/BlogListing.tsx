import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag, ChevronRight, PhoneCall } from 'lucide-react';
import { generateAltText, getOptimizedImageUrl } from '../utils/helpers';
import { getBlogPosts } from '../services/blogService';
import { BlogPost } from '../types';
import { WHATSAPP_NUMBER } from '../config';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'Sports', 'Standup', 'Events', 'Offers'];

const BlogListing: React.FC = () => {
  const [posts] = useState<BlogPost[]>(getBlogPosts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "KOS Sports Café Blog",
    "description": "Stay updated with the latest sports news, event announcements, and culinary stories from KOS Sports Café in Meerut.",
    "url": "https://www.kosportscafe.com/blog",
    "publisher": {
      "@type": "Restaurant",
      "name": "KOS Sports Café",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.kosportscafe.com/logo.png"
      }
    }
  };

  return (
    <main className="flex-grow pt-24 pb-16 bg-[#0a0a0a] text-white">
      <SEO 
        title="Blog & News | KOS Sports Café" 
        description="Stay updated with the latest sports news, event announcements, and culinary stories from KOS Sports Café in Meerut."
        image="/images/menu/sandwich.jpg"
      />
      <script type="application/ld+json">
        {JSON.stringify(blogListingSchema)}
      </script>
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-center tracking-tighter uppercase text-white">
          <span className="text-bronze italic">KO</span> Blog
        </h1>
        <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
          Dive into the latest updates, sports analyses, comedy gig reviews, and exclusive cafe offers.
        </p>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-bronze transition-colors" size={20} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] bg-opacity-80 border border-gray-800 rounded-full focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze transition-all text-white placeholder-gray-500 shadow-[0_0_15px_rgba(176,137,104,0.1)] focus:shadow-[0_0_20px_rgba(176,137,104,0.3)]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-bronze text-white shadow-[0_0_15px_rgba(176,137,104,0.4)]'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a] border border-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="h-full">
                <Link 
                  to={`/blog/${post.slug}`} 
                  className="group bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-bronze transition-all duration-300 hover:shadow-[0_0_30px_rgba(176,137,104,0.15)] flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={getOptimizedImageUrl(post.image || 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80', 600)} 
                      alt={generateAltText(post.image, post.title, post.category)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#ff8c00] border border-[#ff8c00]/30 uppercase tracking-wide">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-[#ff3b3b]" aria-hidden="true" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} className="text-[#ff3b3b]" aria-hidden="true" />
                        {post.author}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-3 group-hover:text-[#ff3b3b] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                      {post.excerpt || post.content.replace(/<[^>]+>/g, '').substring(0, 120) + '...'}
                    </p>
                    
                    <div className="flex items-center text-bronze font-semibold text-sm mt-auto group-hover:translate-x-2 transition-transform" aria-label={`Read more about ${post.title}`}>
                      Read Article <ChevronRight size={16} className="ml-1" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Tag size={48} className="text-gray-800 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-bold text-gray-500 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or category filter.</p>
          </div>
        )}
        {/* Internal Linking Footer for AIO */}
        <div className="mt-20 py-12 border-t border-gray-800 text-center">
          <h2 className="text-2xl font-serif text-white mb-6">Beyond the Stories</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/menu" 
              className="group px-8 py-4 bg-[#111] border border-gray-800 rounded-full hover:border-bronze transition-all"
            >
              <span className="text-gray-400 group-hover:text-bronze transition-colors">Explore our full </span>
              <span className="text-white group-hover:text-bronze font-bold transition-colors">Sports Cafe Menu</span>
            </Link>
            <Link 
              to="/events" 
              className="group px-8 py-4 bg-[#111] border border-gray-800 rounded-full hover:border-bronze transition-all"
            >
              <span className="text-gray-400 group-hover:text-bronze transition-colors">Join our next </span>
              <span className="text-white group-hover:text-bronze font-bold transition-colors">Live Comedy Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent("Hi, I want to book a seat")}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform z-50 flex items-center justify-center group"
      >
        <PhoneCall size={28} aria-hidden="true" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Book a Seat
        </span>
      </a>
    </main>
  );
};

export default BlogListing;
