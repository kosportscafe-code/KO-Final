import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  return (
    <main className="flex-grow pt-32 pb-16 bg-white text-obsidian">
      <SEO 
        title="Privacy Policy | KOS Sports Café" 
        description="Learn how KOS Sports Café collects, uses, and protects your personal information." 
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-bronze hover:text-obsidian transition-colors mb-8 group">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Home
        </Link>
        
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-8">Privacy Policy</h1>
        
        <div className="prose prose-stone max-w-none space-y-6 font-sans text-stone-600 font-light">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">1. Introduction</h2>
            <p>Welcome to KOS Sports Café. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data:</strong> first name, last name.</li>
              <li><strong>Contact Data:</strong> email address, telephone numbers.</li>
              <li><strong>Technical Data:</strong> internet protocol (IP) address, browser type and version, time zone setting and location.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process your bookings, respond to your inquiries, and improve our services.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">4. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at info@kosportscafe.com.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
