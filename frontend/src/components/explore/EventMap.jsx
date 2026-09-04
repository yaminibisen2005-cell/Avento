import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventMap({ events = [], onViewDetails, onRegister }) {
  const offlineEvents = events.filter(e => e.mode?.toLowerCase() !== 'online');
  const [selectedPin, setSelectedPin] = useState(offlineEvents[0] || null);

  // Approximate relative coordinates on the interactive campus schematic
  const pinCoordinates = [
    { top: '35%', left: '28%', city: 'Delhi / NCR' },
    { top: '48%', left: '62%', city: 'Bengaluru Hub' },
    { top: '65%', left: '38%', city: 'Mumbai Campus' },
    { top: '42%', left: '45%', city: 'Hyderabad' },
    { top: '25%', left: '55%', city: 'Pilani Campus' },
    { top: '70%', left: '50%', city: 'Chennai Centre' }
  ];

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-[#0F5D46]/12 p-6 sm:p-8 shadow-sm mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-[#0F5D46] uppercase tracking-wider font-mono">
              GEOGRAPHIC RADAR
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F5D46] tracking-tight">
            Offline Campus Venues & Turnstiles
          </h2>
        </div>

        <span className="text-xs font-semibold text-gray-500 bg-[#FAF8F2] px-3 py-1.5 rounded-full border border-[#0F5D46]/10">
          Showing {offlineEvents.length} in-person venues
        </span>
      </div>

      {/* Map Graphic Canvas */}
      <div className="relative w-full h-[460px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FAF8F2] via-[#EAF7F1]/30 to-[#F2EFE8] border border-[#0F5D46]/15 flex items-center justify-center">
        
        {/* Stylized Grid & Compass Radar Background */}
        <div 
          className="absolute inset-0 bg-dot-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_85%)]" 
          aria-hidden="true" 
        />

        {/* Circular Radar Scan Pulse */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-[#0F5D46]/10 animate-ping opacity-20 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-[#D9B24A]/15 pointer-events-none" />

        {/* Venue Location Pins */}
        {offlineEvents.map((evt, idx) => {
          const coord = pinCoordinates[idx % pinCoordinates.length];
          const isSelected = selectedPin?.id === evt.id;

          return (
            <div
              key={evt.id}
              style={{ top: coord.top, left: coord.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              onClick={() => setSelectedPin(evt)}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin Tooltip */}
                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shadow-md transition-all duration-200 mb-1.5 ${
                  isSelected 
                    ? 'bg-[#0F5D46] text-white scale-105' 
                    : 'bg-white/95 text-gray-800 border border-[#0F5D46]/15 group-hover:bg-[#0F5D46] group-hover:text-white'
                }`}>
                  {evt.venue?.split(',')[0] || evt.title}
                </div>

                {/* Animated Pin Marker */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-125' : 'group-hover:scale-110'
                }`}>
                  <span className={`absolute w-full h-full rounded-full opacity-60 animate-ping ${
                    isSelected ? 'bg-emerald-400' : 'bg-[#D9B24A]'
                  }`} />
                  <div className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                    isSelected ? 'bg-[#0F5D46] text-white' : 'bg-white text-[#0F5D46] border-2 border-[#0F5D46]'
                  }`}>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Selected Event Floating Preview Card */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#0F5D46]/20 shadow-xl p-4 z-30 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0F5D46] text-white uppercase">
                    {selectedPin.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {selectedPin.date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Close pin preview"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedPin.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80'}
                  alt={selectedPin.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1" title={selectedPin.title}>
                    {selectedPin.title}
                  </h4>
                  <p className="text-[11px] text-[#0F5D46] font-semibold truncate mt-0.5">
                    📍 {selectedPin.venue}
                  </p>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {selectedPin.shortDescription || selectedPin.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F5D46]">
                  {selectedPin.fee || 'Free'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails && onViewDetails(selectedPin.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0F5D46] bg-[#0F5D46]/10 hover:bg-[#0F5D46]/20 rounded-lg transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRegister && onRegister(selectedPin)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F5D46] hover:bg-[#0B4B3A] rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
