import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  time: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "NIRAJ KUMAR ROY",
    rating: 5,
    text: "KO Sports Café, Meerut, शहर में एक ऐसी जगह है जहाँ स्पोर्ट्स-थीम्ड वातावरण, well-curated menu और attentive service का एक शानदार संगम मिलता है।",
    time: "18 weeks ago"
  },
  {
    id: 2,
    name: "Sneha Giri",
    rating: 5,
    text: "Really liked the flavours of the food. Outstanding experience.",
    time: "19 weeks ago"
  },
  {
    id: 3,
    name: "Shailly Verma",
    rating: 5,
    text: "Your food is very tasty, and the staff has a very friendly nature.",
    time: "11 weeks ago"
  },
  {
    id: 4,
    name: "Devendra Singh",
    rating: 5,
    text: "Awesome taste.. And purity. No artificial color. Tastes like homecooked. Thank you",
    time: "15 weeks ago"
  },
  {
    id: 5,
    name: "MOHAMMED ARSH",
    rating: 5,
    text: "It is very good that you came at all.",
    time: "15 weeks ago"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff3b3b]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff8c00]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff3b3b]/10 border border-[#ff3b3b]/20 text-[#ff3b3b] mb-6"
          >
            <Star size={16} fill="currentColor" />
            <span className="text-xs font-black uppercase tracking-widest">Customer Love</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            WHAT OUR <span className="text-[#ff3b3b]">GUESTS</span> SAY
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Real reviews from our awesome community on Google.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl hover:border-[#ff3b3b]/30 transition-all group relative"
            >
              <Quote className="absolute top-6 right-8 text-white/5 group-hover:text-[#ff3b3b]/10 transition-colors" size={48} />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#ff3b3b]" fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff3b3b] to-[#ff8c00] flex items-center justify-center text-white font-black text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-gray-500 text-xs">{review.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a 
            href="https://www.google.com/search?q=kos+cafe+reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            Read more on Google Reviews
            <Star size={14} className="text-[#ff3b3b]" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
