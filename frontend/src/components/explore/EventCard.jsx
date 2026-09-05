import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function EventCard({ 
  event, 
  onViewDetails, 
  onRegister, 
  isWishlisted = false, 
  onToggleWishlist,
  isRegistered: propIsRegistered
}) {
  const { isEventRegistered } = useAuth();
  const isRegistered = propIsRegistered !== undefined ? propIsRegistered : isEventRegistered(event.id);
  const totalSeats = event.seatsTotal || 100;
  const filledSeats = event.seatsFilled || 0;
  const seatsLeft = event.seatsLeft != null ? event.seatsLeft : Math.max(0, totalSeats - filledSeats);
  const fillPercentage = Math.min(100, Math.round(((totalSeats - seatsLeft) / totalSeats) * 100)) || 45;

  const isFree = !event.fee || event.fee.toLowerCase().includes('free') || event.fee === '0';
  const displayFee = isFree ? 'Free' : (event.fee.startsWith('₹') ? event.fee : `₹${event.fee}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Cover Image Area */}
      <div 
        onClick={() => onViewDetails && onViewDetails(event.id)}
        className="relative h-36 sm:h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'} 
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill Top-Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF7F1] text-[#0F5D46] shadow-xs">
            {event.category || 'Campus'}
          </span>
        </div>

        {/* Wishlist Heart Top-Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) onToggleWishlist(event);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-10 ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-xs' 
              : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist toggle"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Event Title */}
          <h3 
            onClick={() => onViewDetails && onViewDetails(event.id)}
            className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#0F5D46] transition-colors line-clamp-1 mb-1.5 cursor-pointer" 
            title={event.title}
          >
            {event.title}
          </h3>

          {/* Date & Location Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{event.date || 'TBA'}</span>
            </div>

            <div className="flex items-center gap-1 truncate">
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate">{event.venue || 'Campus'}</span>
            </div>
          </div>

          {/* Seats Left & Fee Row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[11px] text-gray-500 font-medium block mb-1">
                {seatsLeft} seats left
              </span>
              <div className="w-20 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0F5D46] rounded-full transition-all duration-300"
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>

            {/* Fee */}
            <span className="text-xs font-bold text-gray-900 shrink-0">
              {displayFee}
            </span>
          </div>
        </div>

        {/* Action Row: Heart + Register Button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(event);
            }}
            className={`w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-gray-500 hover:bg-gray-50'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {isRegistered ? (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold shadow-2xs flex items-center gap-1 cursor-default select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Registered</span>
            </span>
          ) : (
            <button
              onClick={() => onRegister && onRegister(event)}
              className="px-4 py-1.5 rounded-full bg-[#D9B24A] hover:bg-[#c9a23c] text-gray-900 text-xs font-semibold transition-colors cursor-pointer shadow-2xs active:scale-97"
            >
              Register
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
