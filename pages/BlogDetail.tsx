import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Instagram, PhoneCall } from 'lucide-react';
import { generateAltText } from '../utils/helpers';
import { getBlogPostBySlug } from '../services/blogService';
import { BlogPost } from '../types';
import EventCard from '../components/EventCard';
import { WHATSAPP_NUMBER } from '../config';
import SEO from '../components/SEO';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
      }
    }
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <main className="flex-grow pt-32 pb-16 bg-[#0a0a0a] text-white flex flex-col items-center">
        <SEO title="Post Not Found | KOS Blog" />
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-[#ff3b3b] hover:text-[#ff8c00] flex items-center">
          <ArrowLeft className="mr-2" size={20} aria-hidden="true" /> Back to Blog
        </Link>
      </main>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`;
  // Note: Instagram doesn't have a direct URL sharing scheme, so we prompt user to copy or link to profile
  const ctaPhone = WHATSAPP_NUMBER;
  const ctaMessage = `Hi, I want to book a seat for ${post.title}`;
  const ctaLink = `https://api.whatsapp.com/send?phone=${ctaPhone}&text=${encodeURIComponent(ctaMessage)}`;

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.createdAt,
    "description": post.metaDescription || post.excerpt,
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
    <main className="flex-grow pt-24 pb-16 bg-[#0a0a0a] text-white selection:bg-bronze selection:text-white">
      <SEO 
        title={`${post.metaTitle || post.title} | KOS Blog`}
        description={post.metaDescription || post.excerpt}
        image={post.image}
        url={window.location.href}
        type="article"
      />
      <script type="application/ld+json">
        {JSON.stringify(blogPostSchema)}
      </script>
      <article>
        {/* Featured Image Header */}
        <div className="relative w-full h-[40vh] md:h-[60vh] max-h-[600px] mb-8 lg:mb-12">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src={post.image || 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80'} 
            alt={generateAltText(post.image, post.title, post.category)}
            className="w-full h-full object-cover"
          />
          <header className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-4 pb-12 lg:pb-16 max-w-4xl">
            <Link to="/blog" className="text-gray-300 hover:text-white flex items-center mb-6 max-w-max transition-colors">
              <ArrowLeft className="mr-2" size={16} aria-hidden="true" /> Back to stories
            </Link>
            <span className="bg-[#ff8c00] text-black font-black uppercase tracking-wider text-xs px-3 py-1 rounded w-max mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight shadow-black drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
              <span className="flex items-center gap-2">
                <User size={18} className="text-[#ff3b3b]" aria-hidden="true" /> {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-bronze" aria-hidden="true" /> 
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </header>
        </div>

        <div className="container mx-auto px-4 max-w-4xl flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <section 
              className="prose prose-invert prose-lg max-w-none prose-a:text-[#ff3b3b] hover:prose-a:text-[#ff8c00] prose-headings:text-white prose-img:rounded-xl mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Render EventCard if event is attached */}
            {post.isEventAttached && (
              <EventCard 
                date={post.eventDate} 
                time={post.eventTime} 
                seats={post.eventSeatsLeft} 
                title={post.title} 
              />
            )}

            {/* Internal Linking for AIO */}
            <div className="mt-12 pt-12 border-t border-gray-800">
              <h4 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">Explore More at KOS</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  to="/menu" 
                  className="group p-4 bg-[#111] border border-gray-800 rounded-xl hover:border-bronze transition-all"
                >
                  <p className="text-bronze text-xs font-bold uppercase tracking-widest mb-1">Culinary Excellence</p>
                  <p className="text-white font-serif text-lg group-hover:text-bronze transition-colors">Explore our full sports cafe menu</p>
                </Link>
                <Link 
                  to="/events" 
                  className="group p-4 bg-[#111] border border-gray-800 rounded-xl hover:border-bronze transition-all"
                >
                  <p className="text-bronze text-xs font-bold uppercase tracking-widest mb-1">Live Entertainment</p>
                  <p className="text-white font-serif text-lg group-hover:text-bronze transition-colors">View upcoming live comedy and sports screenings</p>
                </Link>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-bronze/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(176,137,104,0.15)]">
              <h3 className="text-2xl font-bold mb-3 text-white">Reserve your seat for upcoming shows</h3>
              <p className="text-gray-400 mb-6 font-medium">Don't miss out on the action. Reserve your table at KO Sports Cafe today.</p>
              <a 
                href={ctaLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-bronze px-8 py-4 rounded-full font-black text-white hover:scale-105 transition-transform shadow-[0_0_20px_rgba(176,137,104,0.4)]"
              >
                <PhoneCall size={20} aria-hidden="true" /> Book Your Seat via WhatsApp
              </a>
            </div>
          </div>

          {/* Sidebar / Share */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="sticky top-32 p-6 rounded-2xl bg-[#111] border border-gray-800">
              <h4 className="text-lg font-bold mb-4 uppercase text-gray-400 tracking-wider">Share</h4>
              <div className="flex flex-col gap-4">
                <a 
                  href={whatsappShare} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-3 rounded-lg font-bold hover:bg-[#20b858] transition-colors"
                >
                  <Share2 size={18} aria-hidden="true" /> WhatsApp
                </a>
                {/* Using a general Instagram link as direct post sharing isn't supported via URL */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  <Instagram size={18} aria-hidden="true" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Floating WhatsApp Button */}
      <a 
        href={ctaLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform z-50 flex items-center justify-center group"
      >
        <PhoneCall size={28} aria-hidden="true" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Book Seat for {post.title}
        </span>
      </a>
    </main>
  );
};

export default BlogDetail;
