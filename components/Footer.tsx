import React from 'react';
import { CONTACT_PHONE, CONTACT_WEBSITE, CAFE_NAME } from '../constants';
import { Instagram, Facebook, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian text-alabaster py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

          {/* Brand */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl text-white">{CAFE_NAME}</h3>
            <p className="font-sans text-stone-400 font-light text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              The ultimate gathering place for sports enthusiasts and food lovers alike.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest text-bronze">Contact Us</h4>
            <div className="flex justify-center md:justify-start items-center gap-3">
              <a
                href="tel:+917060403965"
                className="font-serif text-xl hover:text-bronze transition-colors"
              >
                {CONTACT_PHONE}
              </a>
              <a
                href="https://wa.me/917060403965"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 transition-colors"
                title="Chat on WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
            <a
              href="mailto:info@kosportscafe.com"
              className="font-sans text-stone-400 font-light text-sm hover:text-bronze transition-colors underline"
            >
              {CONTACT_WEBSITE}
            </a>
            <div className="flex justify-center md:justify-start items-center gap-2 text-stone-400 text-sm">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <a
                href="https://www.google.com/maps/search/KO+Sports+Cafe+Meerut"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bronze transition-colors underline"
              >
                Find us on Google Maps
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-sans text-xs uppercase tracking-widest text-bronze">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-6">
              <a
                href="https://www.instagram.com/kosportscafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bronze transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/kosportscafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bronze transition-colors"
                title="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
            <div className="pt-8 flex flex-col items-center md:items-start space-y-4">
              <p className="text-xs text-stone-500">
                © {new Date().getFullYear()} KOS Café. All rights reserved.
              </p>
              <a 
                href="/admin" 
                className="inline-flex items-center justify-center px-4 py-2 border border-stone-600 text-stone-300 text-xs font-bold uppercase tracking-widest hover:border-[#ff3b3b] hover:text-[#ff3b3b] transition-colors rounded"
              >
                Admin Login
              </a>
            </div>
            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-stone-500 font-bold">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
