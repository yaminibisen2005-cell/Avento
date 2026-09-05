import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

export default function EventCard({ event, onRegister, onDetails, isWishlisted: propIsWishlisted, onToggleWishlist, isRegistered: propIsRegistered }) {
  const { isEventRegistered } = useAuth()
  const isRegistered = propIsRegistered !== undefined ? propIsRegistered : isEventRegistered(event?.id)
  const isWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : Boolean(event?.isWishlisted);
  return (
    <motion.div
      whileHover={{ y: -7, scale: 1.01 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      onClick={() => onDetails && onDetails(event)}
      className="rounded-[24px] border border-white/70 shadow-[0_12px_36px_rgba(15,93,70,0.06)] hover:shadow-[0_24px_50px_rgba(15,93,70,0.14)] overflow-hidden flex flex-col justify-between group cursor-pointer transition-all duration-300 relative select-none"
    >
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-[24px]">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Dark bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#0F5D46] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-xs">
            {event.category}
          </span>
        </div>

        {/* Mode & Wishlist Buttons */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {event.mode && (
            <span className="text-[10px] font-bold text-white bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              {event.mode}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(event);
            }}
            className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-md flex items-center justify-center text-xs cursor-pointer transition-all"
            title="Wishlist"
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Price Tag (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-xs font-extrabold text-white bg-[#0F5D46]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
            {event.fee || 'Free'}
          </span>
        </div>

        {/* Seats Remaining (Bottom Right of Image) */}
        {event.seatsLeft !== undefined && (
          <div className="absolute bottom-3 right-3 z-10 text-[11px] font-bold text-[#D9B24A] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
            {event.seatsLeft} seats left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-[#0F5D46] group-hover:text-[#0A3B2E] transition-colors leading-snug line-clamp-1">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-[#5E6A68] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-sm">📅</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm">📍</span>
              <span className="truncate">{event.venue}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center gap-2 truncate text-[11.5px] text-[#6B7478]">
                <span className="text-sm">🏛</span>
                <span className="truncate">{event.organizer}</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-5 pt-3.5 border-t border-[#0F5D46]/[0.08] flex items-center gap-2">
          {isRegistered ? (
            <div className="flex-1 py-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-[14px] shadow-2xs flex items-center justify-center gap-1.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>✓ Registered</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onRegister) onRegister(event)
              }}
              className="flex-1 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer"
            >
              <span>Register</span>
              <span className="text-[#D9B24A] group/btn:translate-x-1 transition-transform">→</span>
            </button>
          )}

          {onDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDetails(event)
              }}
              className="px-3 py-2.5 bg-[#0F5D46]/[0.06] hover:bg-[#0F5D46]/[0.12] text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/15 transition-colors cursor-pointer"
            >
              Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
