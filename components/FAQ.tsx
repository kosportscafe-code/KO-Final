import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "What are the opening hours of KOS Sports Café?",
    answer: "KOS Sports Café is open daily from 11:00 AM to 11:00 PM, serving you world-class cuisine and entertainment throughout the day."
  },
  {
    question: "Do you host live comedy or events?",
    answer: "Yes! We regularly host live standup comedy shows, sports screenings, and exclusive entertainment events. You can find our upcoming schedule in the Events section."
  },
  {
    question: "Is there a gaming or sports screening zone?",
    answer: "Absolutely. We feature a dedicated sports screening area for the big games and world-class gaming consoles for enthusiasts to enjoy."
  },
  {
    question: "What kind of food is available?",
    answer: "Our diverse menu features Italian favorites like pizzas and pastas, Mexican snacks, specialized Indian thalis, and a wide range of Continental dishes."
  },
  {
    question: "Can I book events or tables?",
    answer: "Yes, we accept bookings for tables and private events. You can reach out to us directly via WhatsApp through the contact links on our site."
  },
  {
    question: "Where is the cafe located?",
    answer: "The cafe is located Near Rohta Road on NH58, Meerut. It's the ultimate gathering spot for sports and food lovers in the city."
  }
];

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-alabaster relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bronze/10 border border-bronze/20 text-bronze mb-6">
            <HelpCircle size={16} aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest">Common Questions</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-4">Frequently Asked Questions</h2>
          <div className="w-16 h-[1px] bg-bronze mx-auto"></div>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div 
              key={index}
              className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                aria-expanded={activeIndex === index}
                aria-label={`${activeIndex === index ? 'Collapse' : 'Expand'} answer for: ${item.question}`}
              >
                <span className="font-serif text-lg text-obsidian font-medium pr-8">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-bronze"
                >
                  <ChevronDown size={20} aria-hidden="true" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="p-6 pt-0 text-stone-600 font-sans leading-relaxed border-t border-stone-100">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
