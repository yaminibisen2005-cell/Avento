import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FeaturedEvents({ events = [], onViewDetails, onRegister }) {
  const [activeTab, setActiveTab] = useState('Top Rated');
  const scrollRef = useRef(null);

  const tabs = ['Top Rated', 'Trending', 'Most Registered', "Editor's Choice"];

  // Filter or sort events according to tab
  const getFeaturedEvents = () => {
    if (!events || events.length === 0) return [];
    
    if (activeTab === 'Top Rated') {
      return [...events].sort((a, b) => (b.id - a.id));
    }
    if (activeTab === 'Trending') {
      return [...events].filter(e => e.mode?.toLowerCase() === 'in-person').concat(events).slice(0, 6);
    }
    if (activeTab === 'Most Registered') {
      return [...events].sort((a, b) => (b.seatsFilled || 0) - (a.seatsFilled || 0));
    }
    if (activeTab === "Editor's Choice") {
      return [...events].filter(e => e.fee?.toLowerCase().includes('free')).concat(events).slice(0, 6);
    }
    return events;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayEvents = getFeaturedEvents();

  if (displayEvents.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D9B24A] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono">
              CURATED SHOWCASE
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F5D46] tracking-tight">
            Featured Campus Highlights
          </h2>
        </div>

        {/* Tab Selector & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-white/80 rounded-2xl border border-[#0F5D46]/10 backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-[#0F5D46] text-white shadow-xs' 
                    : 'text-gray-600 hover:text-[#0F5D46]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#0F5D46]/15 text-[#0F5D46] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-[#0F5D46]/15 text-[#0F5D46] flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory"
      >
        {displayEvents.map((evt) => {
          const isFree = !evt.fee || evt.fee.toLowerCase().includes('free') || evt.fee === '0';
          const displayFee = isFree ? 'Free' : (evt.fee.startsWith('₹') ? evt.fee : `₹${evt.fee}`);

          return (
            <motion.div
              key={evt.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] rounded-3xl bg-white/90 backdrop-blur-xl border border-[#0F5D46]/12 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img 
                  src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} 
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D9B24A] text-[#1B382B] uppercase tracking-wider shadow-xs">
                    {activeTab}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/90 text-[#0F5D46] backdrop-blur-md">
                    {evt.category}
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium">
                  {evt.date} • {evt.venue}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onViewDetails && onViewDetails(evt.id)}
                    className="font-bold text-gray-900 hover:text-[#0F5D46] transition-colors text-sm line-clamp-1 cursor-pointer mb-1"
                  >
                    {evt.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {evt.shortDescription || evt.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#0F5D46]">
                    {displayFee}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails && onViewDetails(evt.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F5D46] bg-[#0F5D46]/8 hover:bg-[#0F5D46]/15 rounded-lg transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onRegister && onRegister(evt)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F5D46] hover:bg-[#0B4B3A] rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
