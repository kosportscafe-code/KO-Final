import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight, Bot, Phone } from 'lucide-react';
import { FALLBACK_MENU, CONTACT_PHONE } from '../constants';

// ─── Types ────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  links?: { label: string; href: string; scroll?: string }[];
  chips?: string[];
  timestamp: Date;
}

// ─── Knowledge Base ───────────────────────────────────────────────────────
const KB = {
  hours:    'We\'re open **every day from 11:00 AM to 11:00 PM**. Come in whenever you\'re hungry! 🕐',
  location: 'KOS Sports Café is located **Near Rohta Road on NH58, Meerut**. 📍',
  phone:    `You can call or WhatsApp us at **${CONTACT_PHONE}**. 📞`,
  wifi:     'Yes! Complimentary WiFi is available for all guests. 📶 Password available at the counter.',
  parking:  'Yes, parking is available near the café on NH58, Rohta Road. 🚗',
  payment:  'We accept **cash, UPI, GPay, PhonePe, and all major cards**. 💳',
  delivery: 'We currently don\'t offer direct delivery. You can check **Zomato / Swiggy** for delivery options. 🛵',
  social:   'Follow us @kosportscafe on **Instagram** and **Facebook** for updates! 📲',
  veg:      'We have a wide range of **vegetarian options** — Sandwiches, Pizzas, Momos, Rolls, Chinese, Salads, Hummus, and more! 🌿',
};

// ─── Intent Definitions ────────────────────────────────────────────────────
// Each intent: keywords to match, response text, optional link buttons, optional follow-up chips.
const INTENTS: Array<{
  id: string;
  keywords: string[];
  text: string;
  links?: { label: string; href: string; scroll?: string }[];
  chips?: string[];
}> = [
  {
    id: 'menu',
    keywords: ['menu', 'food', 'eat', 'dish', 'item', 'cuisine', 'what do you serve', 'what food'],
    text: 'Our menu has something for everyone! 😋\n\n**Categories:**\nBurgers · Pizzas · Sandwiches · Momos · Rolls · Chinese · Pasta · Tacos · Nachos · Thalis · Drinks · Shakes',
    links: [{ label: 'View Full Menu', href: '/order' }],
    chips: ['Burger prices', 'Pizza prices', "What's cheapest?"],
  },
  {
    id: 'booking',
    keywords: ['book', 'reserv', 'table', 'seat', 'private', 'reserve'],
    text: 'You can book a table or a specific event seats directly on our website! \n\nStep 1: Scroll to our *Booking Section* below.\nStep 2: Fill in your details and confirm via WhatsApp.',
    links: [{ label: 'Go to Booking Form', href: '#booking', scroll: 'booking' }],
    chips: ['View Menu', 'Upcoming Events', 'Contact'],
  },
  {
    id: 'events',
    keywords: ['event', 'show', 'comedy', 'standup', 'stand-up', 'live', 'screening', 'gaming', 'entertainment', 'upcoming'],
    text: 'We host amazing events regularly! 🎭\n\n• **Live Standup Comedy** nights\n• **Sports Screenings** (cricket, football & more)\n• **Gaming Tournaments**\n• **Private Events**\n\nCheck the Events page for the latest schedule!',
    links: [{ label: 'See Upcoming Events', href: '#shows', scroll: 'shows' }],
    chips: ['Book Now', 'Contact'],
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'address', 'map', 'direction', 'find', 'reach', 'nh58', 'rohta', 'meerut', 'located'],
    text: KB.location + '\n\nParking is available on-site! 🚗',
    links: [{ label: 'Open Google Maps', href: 'https://www.google.com/maps/search/KO+Sports+Cafe+Meerut' }],
    chips: ['Opening Hours', 'Contact'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'phone', 'number', 'call', 'whatsapp', 'reach', 'speak', 'talk', 'human'],
    text: `Want to get in touch? We\'re always happy to help! 📱\n\n**Call/WhatsApp:** ${CONTACT_PHONE}\n**Email:** info@kosportscafe.com\n**Instagram:** @kosportscafe`,
    links: [
      { label: `Call ${CONTACT_PHONE}`, href: 'tel:+917060403965' },
      { label: 'WhatsApp Us', href: 'https://wa.me/917060403965' },
      { label: 'Instagram', href: 'https://www.instagram.com/kosportscafe/' },
    ],
  },
  {
    id: 'hours',
    keywords: ['open', 'close', 'hour', 'timing', 'time', 'when', 'schedule', 'timings'],
    text: KB.hours,
    chips: ['View Menu', 'Our Location'],
  },
  { id: 'wifi',     keywords: ['wifi', 'wi-fi', 'internet', 'network', 'password'], text: KB.wifi },
  { id: 'parking',  keywords: ['park', 'parking'], text: KB.parking },
  { id: 'payment',  keywords: ['pay', 'payment', 'upi', 'cash', 'card', 'gpay', 'paytm', 'phonepay'], text: KB.payment },
  { id: 'delivery', keywords: ['deliver', 'zomato', 'swiggy', 'takeaway', 'take away', 'home delivery'], text: KB.delivery },
  {
    id: 'veg',
    keywords: ['veg', 'vegetar', 'plant', 'no meat', 'without meat', 'vegan'],
    text: KB.veg,
    links: [{ label: 'View Menu', href: '/order' }],
  },
  {
    id: 'social',
    keywords: ['instagram', 'facebook', 'social', 'follow', 'insta'],
    text: KB.social,
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/kosportscafe/' },
      { label: 'Facebook', href: 'https://www.facebook.com/kosportscafe/' },
    ],
  },
];

// The 4 core quick-reply chips shown on greeting and fallback
const CORE_CHIPS = ['View Menu', 'Book Now', 'Upcoming Events', 'Contact'];

// ─── Category aliases for menu item search ────────────────────────────────
const CATEGORY_ALIASES: Record<string, string[]> = {
  'Burgers':            ['burger', 'burgers'],
  'Pizzas':             ['pizza', 'pizzas'],
  'Sandwiches':         ['sandwich', 'sandwiches', 'sub'],
  'Momos':              ['momo', 'momos', 'dumpling'],
  'Chinese & Noodles':  ['chinese', 'noodle', 'noodles', 'hakka', 'chow mein'],
  'Rolls & Wraps':      ['roll', 'wrap', 'burrito', 'rolls'],
  'Drinks':             ['drink', 'drinks', 'juice', 'lime', 'mojito', 'cold drink'],
  'Shakes & Beverages': ['shake', 'milkshake', 'coffee', 'tea', 'hot chocolate', 'beverage'],
  'Pasta':              ['pasta', 'spaghetti'],
  'Nachos':             ['nachos', 'nacho'],
  'Tacos':              ['taco', 'tacos'],
  'Fries':              ['fries', 'french fries', 'chips'],
  'Thalis':             ['thali', 'thalis'],
  'Bowls & Meals':      ['bowl', 'rice bowl', 'burrito rice'],
  'Hummus':             ['hummus', 'falafel'],
  'Pavs':               ['pav', 'vada pav', 'pav bhaji'],
  'Salads':             ['salad'],
};

// ─── Smart Response Engine ─────────────────────────────────────────────────
function getResponse(input: string): Omit<Message, 'id' | 'timestamp' | 'role'> {
  const q = input.toLowerCase().trim();
  const has = (...terms: string[]) => terms.some(t => q.includes(t));

  // 1. Greeting
  if (has('hi', 'hello', 'hey', 'hola', 'namaste', 'sup', 'good morning', 'good evening'))
    return {
      text: 'Hey there! 👋 Welcome to **KOS Sports Café**. I\'m your virtual assistant — ask me anything about our menu, hours, events, or location!',
      chips: [...CORE_CHIPS],
    };

  // 2. Intent matching (priority-ordered)
  for (const intent of INTENTS) {
    if (intent.keywords.some(k => q.includes(k))) {
      return { text: intent.text, links: intent.links, chips: intent.chips };
    }
  }

  // 3. Category-based menu lookup
  for (const [cat, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some(a => q.includes(a))) {
      const items = FALLBACK_MENU.filter(i => i.category === cat);
      if (items.length > 0) {
        const list = items.slice(0, 6).map(i => {
          const price = i.priceMed ? `₹${i.priceReg}–₹${i.priceMed}` : `₹${i.priceReg}`;
          return `• **${i.name}** — ${price}`;
        }).join('\n');
        const more = items.length > 6 ? `\n_...and ${items.length - 6} more on the menu!_` : '';
        return {
          text: `Here are our **${cat}**:\n${list}${more}`,
          links: [{ label: 'View Full Menu', href: '/order' }],
          chips: ['Book Now', 'Upcoming Events'],
        };
      }
    }
  }

  // 4. Specific item name search
  const matched = FALLBACK_MENU.filter(i =>
    i.name.toLowerCase().includes(q) || q.includes(i.name.toLowerCase().split(' ')[0])
  );
  if (matched.length === 1) {
    const item = matched[0];
    const price = item.priceMed ? `Half: ₹${item.priceReg} / Full: ₹${item.priceMed}` : `₹${item.priceReg}`;
    const desc = item.description ? ` — ${item.description}` : '';
    return {
      text: `**${item.name}**${desc}\nPrice: ${price}\nCategory: ${item.category}`,
      links: [{ label: 'View Full Menu', href: '/menu', scroll: 'menu' }],
      chips: ['Book Now', 'Contact'],
    };
  } else if (matched.length > 1 && matched.length <= 5) {
    const list = matched.map(i => `• **${i.name}** (${i.category}) — ₹${i.priceReg}`).join('\n');
    return { text: `Found a few matches:\n${list}`, links: [{ label: 'View Full Menu', href: '/order' }] };
  }

  // 5. Price queries
  if (has('price', 'cost', 'how much', 'rate', 'cheap', 'expensive', 'cheapest', 'afford'))
    return {
      text: 'Our prices start from just **₹20** (Tea) up to **₹279** (large pizza). Most snacks & meals are between **₹39–₹199**! 😊',
      links: [{ label: 'Browse Prices on Menu', href: '/order' }],
    };

  // 6. Fallback — always offer all 4 core intents
  return {
    text: `Hmm, I didn\'t quite catch that! 🤔 Here\'s what I *can* help with:`,
    links: [
      { label: 'View Menu', href: '#menu', scroll: 'menu' },
      { label: 'Book a Table', href: '#booking', scroll: 'booking' },
      { label: 'See Events', href: '#shows', scroll: 'shows' },
      { label: 'WhatsApp Us', href: 'https://wa.me/917060403965' },
    ],
    chips: [...CORE_CHIPS],
  };
}

// ─── Chip → trigger text mapping ─────────────────────────────────────────
const CHIP_INPUTS: Record<string, string> = {
  'View Menu':        'show me the menu',
  'Book Now':         'I want to book a table',
  'Upcoming Events':  'tell me about upcoming events',
  'Contact':          'how can I contact you',
  'Our Location':     'where are you located',
  'Opening Hours':    'what are the opening hours',
  'Burger prices':    'burger',
  'Pizza prices':     'pizza',
  'Drink options':    'drinks',
  "What's cheapest?": 'cheapest item',
};

// ─── Welcome message ───────────────────────────────────────────────────────
const WELCOME: Omit<Message, 'id' | 'timestamp'> = {
  role: 'bot',
  text: 'Hi! 👋 I\'m **KOS Assistant** — your virtual café guide. How can I help you today?',
  chips: [...CORE_CHIPS],
};

// ─── Render bot text with basic markdown ──────────────────────────────────
function RenderText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, li) => {
        const segs = line.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={li} className={line.startsWith('_') ? 'text-xs text-stone-400 italic' : ''}>
            {segs.map((seg, si) =>
              si % 2 === 1
                ? <strong key={si} className="font-semibold text-obsidian">{seg}</strong>
                : <span key={si}>{seg.replace(/^_|_$/g, '')}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { ...WELCOME, id: 'welcome', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [lastUserQuery, setLastUserQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const Motion = motion as any;

  // Build a contextual WhatsApp URL from the last user query
  const buildWhatsAppUrl = useCallback(() => {
    const base = 'https://wa.me/917060403965?text=';
    const topic = lastUserQuery.trim();
    const msg = topic
      ? `Hi KOS Sports Café! I was asking about: "${topic}". Can you help me?`
      : 'Hi, I want to know more about KOS Sports Café';
    return base + encodeURIComponent(msg);
  }, [lastUserQuery]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when window opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasOpened(true);
  };

  const handleNavLink = useCallback((href: string, scroll?: string) => {
    setIsOpen(false);
    if (scroll) {
      // Navigate then scroll
      const el = document.getElementById(scroll);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (href.startsWith('/')) {
        window.location.href = href;
      }
    } else if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLastUserQuery(trimmed); // track for dynamic WhatsApp message
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const response = getResponse(trimmed);
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'bot',
      ...response,
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChip = (chip: string) => {
    const mapped = CHIP_INPUTS[chip] || chip;
    sendMessage(mapped);
  };

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip — show before first open */}
        <AnimatePresence>
          {!hasOpened && !isOpen && (
            <Motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ delay: 1.5, duration: 0.4 }}
              className="bg-white border border-stone-200 text-obsidian text-sm font-sans px-4 py-2 rounded-full shadow-lg whitespace-nowrap"
            >
              💬 Ask me anything!
            </Motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => isOpen ? setIsOpen(false) : handleOpen()}
          className="relative w-14 h-14 bg-bronze rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-obsidian transition-all duration-300 group"
          aria-label={isOpen ? 'Close chat' : 'Open KOS Café chat assistant'}
        >
          {/* Pulse ring */}
          {!isOpen && !hasOpened && (
            <span className="absolute inset-0 rounded-full bg-bronze animate-ping opacity-25" />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <Motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-6 h-6" />
              </Motion.span>
            ) : (
              <Motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle className="w-6 h-6" />
              </Motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-obsidian text-white flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-bronze flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm font-semibold leading-tight">KOS Assistant</p>
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">KOS Sports Café · Always here</p>
              </div>
              {/* WhatsApp handoff button */}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                title="Continue on WhatsApp"
                aria-label="Chat on WhatsApp"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1da851] text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 flex-shrink-0"
              >
                {/* WhatsApp SVG icon */}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth" style={{ overscrollBehavior: 'contain' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl font-sans text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-obsidian text-white rounded-br-sm'
                        : 'bg-stone-50 text-obsidian border border-stone-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'bot' ? <RenderText text={msg.text} /> : <span>{msg.text}</span>}
                  </div>

                  {/* Action links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-[85%]">
                      {msg.links.map((link, i) => (
                        <button
                          key={i}
                          onClick={() => handleNavLink(link.href, link.scroll)}
                          className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-bronze border border-bronze/40 rounded-full hover:bg-bronze hover:text-white transition-all duration-200"
                        >
                          {link.label}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick reply chips */}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 max-w-[95%]">
                      {msg.chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleChip(chip)}
                          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-white border border-stone-200 text-stone-500 rounded-full hover:border-bronze hover:text-bronze transition-all duration-200"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <Motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-start gap-2"
                  >
                    <div className="bg-stone-50 border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <Motion.span
                          key={i}
                          className="w-2 h-2 bg-bronze rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-stone-100 flex-shrink-0 bg-white"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 text-sm font-sans text-obsidian placeholder-stone-300 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze/20 transition-all"
                maxLength={200}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 flex items-center justify-center bg-bronze text-white rounded-full hover:bg-obsidian transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-[9px] uppercase tracking-widest text-stone-300 pb-2 font-sans">
              KOS Sports Café · Meerut
            </p>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
