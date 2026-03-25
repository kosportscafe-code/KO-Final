import React from 'react';
import { Calendar, Clock, Users, Ticket } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../config';

interface EventCardProps {
  date?: string;
  time?: string;
  seats?: string | number;
  title?: string;
}

const EventCard: React.FC<EventCardProps> = ({ date, time, seats, title }) => {
  const ctaMessage = `Hi, I want to book a seat for ${title ? title : 'the upcoming event'}`;
  const ctaLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(ctaMessage)}`;

  return (
    <div className="bg-obsidian border border-bronze/40 rounded-2xl p-6 shadow-[0_0_20px_rgba(176,137,104,0.1)] relative overflow-hidden group hover:border-bronze transition-colors mb-12">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-bronze/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        
        {/* Event Details */}
        <div className="space-y-4 flex-1">
          <div className="inline-block bg-bronze/20 px-3 py-1 rounded text-bronze text-xs font-bold uppercase tracking-widest border border-bronze/30">
            Featured Event
          </div>
          <h4 className="text-2xl font-bold text-white mb-2">Join us Live!</h4>
          
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {date && (
                <div className="flex items-center text-gray-300">
                  <Calendar className="text-[#ff8c00] mr-2" size={18} aria-hidden="true" />
                  <span className="font-medium">{date}</span>
                </div>
              )}
              {time && (
                <div className="flex items-center text-gray-300">
                  <Clock className="text-[#ff8c00] mr-2" size={18} aria-hidden="true" />
                  <span className="font-medium">{time}</span>
                </div>
              )}
              {seats && (
                <div className="flex items-center text-gray-300">
                  <Users className="text-[#ff8c00] mr-2" size={18} aria-hidden="true" />
                  <span className="font-medium">{seats} seats remaining</span>
                </div>
              )}
            </div>
          </div>
  
          {/* CTA Button */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-bronze text-white font-bold py-3 px-8 rounded-lg hover:bg-bronze/80 transition-all shadow-[0_4px_14px_rgba(176,137,104,0.4)] hover:shadow-[0_6px_20px_rgba(176,137,104,0.6)] hover:-translate-y-1"
            >
              <Ticket size={20} aria-hidden="true" />
              Book Now
            </a>
          </div>

      </div>
    </div>
  );
};

export default EventCard;
