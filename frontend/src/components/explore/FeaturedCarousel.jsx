import React from 'react';
import { motion } from 'framer-motion';

export default function FeaturedCarousel({
  events = [],
  onViewDetails,
  onRegister,
  wishlistIds = new Set(),
  onToggleWishlist
}) {
  // Use first 3 events as featured, or provide high-fidelity campus fallbacks if list is short
  const fallbackFeatured = [
    {
      id: 'feat-1',
      title: 'AVENTO HackFest 2025',
      category: 'Hackathon',
      date: 'Mar 15-17, 2025',
      venue: 'IIT Delhi',
      seatsTotal: 200,
      seatsFilled: 80,
      seatsLeft: 120,
      fee: 'Free',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'feat-2',
      title: 'UI/UX Design Workshop',
      category: 'Workshop',
      date: 'Apr 5, 2025',
      venue: 'Online',
      seatsTotal: 150,
      seatsFilled: 75,
      seatsLeft: 75,
      fee: '₹299',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'feat-3',
      title: 'The Future of AI',
      category: 'Tech Talk',
      date: 'Apr 12, 2025',
      venue: 'NIT Trichy',
      seatsTotal: 100,
      seatsFilled: 50,
      seatsLeft: 50,
      fee: 'Free',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const featuredList = events.length >= 3
    ? events.slice(0, 3)
    : events.length > 0
      ? [...events, ...fallbackFeatured.slice(events.length, 3)]
      : fallbackFeatured;

  const scrollToAllEvents = () => {
    const el = document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-14" id="featured">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Featured Events
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Handpicked events you shouldn't miss
          </p>
        </div>

        <button
          onClick={scrollToAllEvents}
          className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0F5D46] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All</span>
          <span className="text-base leading-none">→</span>
        </button>
      </div>

      {/* 3 Featured Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredList.map((evt, idx) => {
          const isSaved = wishlistIds.has(evt.id);
          const totalSeats = evt.seatsTotal || 100;
          const filled = evt.seatsFilled || 0;
          const seatsLeft = evt.seatsLeft != null ? evt.seatsLeft : Math.max(0, totalSeats - filled);
          const percent = Math.min(100, Math.round(((totalSeats - seatsLeft) / totalSeats) * 100)) || 50;

          return (
            <motion.div
              key={evt.id || idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover Image Area */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#0F5D46] shadow-xs">
                    {evt.category || 'Featured'}
                  </span>
                </div>

                {/* Top Right Heart Bookmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(evt);
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 ${
                    isSaved ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3
                    onClick={() => { if (onViewDetails) onViewDetails(evt.id); }}
                    className="text-base font-bold text-gray-900 group-hover:text-[#0F5D46] transition-colors line-clamp-1 mb-2 cursor-pointer"
                    title={evt.title}
                  >
                    {evt.title}
                  </h3>

                  {/* Date & Location Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5 truncate">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{evt.date || 'Upcoming'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 truncate">
                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{evt.venue || 'Campus'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Seats Left Progress Bar + Wishlist Icon + Register Now Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                  {/* Seats Left Bar */}
                  <div>
                    <span className="text-xs text-gray-500 font-medium block mb-1">
                      {seatsLeft} seats left
                    </span>
                    <div className="w-24 sm:w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0F5D46] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions: Heart + Gold Register Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWishlist) onToggleWishlist(evt);
                      }}
                      className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${
                        isSaved ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                      title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      aria-label="Wishlist toggle"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => { if (onRegister) onRegister(evt); }}
                      className="px-4 py-2 rounded-full bg-[#D9B24A] hover:bg-[#cba43e] text-gray-900 font-semibold text-xs transition-colors shadow-xs cursor-pointer active:scale-97"
                    >
                      Register Now
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
