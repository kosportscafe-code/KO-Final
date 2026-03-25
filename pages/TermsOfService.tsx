import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfService: React.FC = () => {
  return (
    <main className="flex-grow pt-32 pb-16 bg-white text-obsidian">
      <SEO 
        title="Terms of Service | KOS Sports Café" 
        description="Review the terms and conditions for using the KOS Sports Café website and services." 
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-bronze hover:text-obsidian transition-colors mb-8 group">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
          Back to Home
        </Link>
        
        <h1 className="font-serif text-4xl md:text-5xl text-obsidian mb-8">Terms of Service</h1>
        
        <div className="prose prose-stone max-w-none space-y-6 font-sans text-stone-600 font-light">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">1. Terms</h2>
            <p>By accessing the website at kosportscafe.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on KOS Sports Café's website for personal, non-commercial transitory viewing only.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">3. Disclaimer</h2>
            <p>The materials on KOS Sports Café's website are provided on an 'as is' basis. KOS Sports Café makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-obsidian">4. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
