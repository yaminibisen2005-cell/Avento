import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function HeroSection({ event, onRegister, isWishlisted, onToggleWishlist, onShare }) {
  const [copied, setCopied] = useState(false)

  const handleShareClick = () => {
    if (onShare) {
      onShare()
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const seatsPercentage = Math.min(100, Math.round(((event.maxSeats - event.seatsLeft) / event.maxSeats) * 100))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start text-left select-none">
      {/* ================= LEFT: LARGE COVER IMAGE (5 Cols) ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-5 relative group"
      >
        <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-[32px] overflow-hidden border border-white/80 shadow-[0_20px_50px_rgba(15,93,70,0.12)]">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />

          {/* Luxury Vignette & Glass Highlights */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F5D46]/20 via-transparent to-[#D9B24A]/15 pointer-events-none" />

          {/* Floating Category Pill */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#0F5D46] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-md">
              {event.category}
            </span>
          </div>

          {/* Floating Mode Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
              {event.mode === 'In-Person' ? '📍 In-Person' : '🌐 Virtual'}
            </span>
          </div>

          {/* Bottom Countdown & Seats Tag */}
          <div className="absolute bottom-5 inset-x-5 z-10 flex items-center justify-between text-white">
            <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-[14px] border border-white/20 text-xs">
              <span className="text-[#D9B24A] font-extrabold">⏳ {event.countdownTarget ? '3 Days Left' : 'Registration Open'}</span>
            </div>
            <div className="bg-[#0F5D46]/90 backdrop-blur-md px-3.5 py-1.5 rounded-[14px] border border-white/20 text-xs font-bold">
              {event.fee} Entry
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= RIGHT: EVENT INFO & QUICK ACTIONS (7 Cols) ================= */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 flex flex-col justify-between space-y-6"
      >
        <div>
          {/* Badge Tags Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2.5 py-1 rounded-full">
              {event.difficulty || 'All Levels'}
            </span>
            {event.certificateAvailable && (
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#D9B24A] bg-[#D9B24A]/10 border border-[#D9B24A]/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>★</span>
                <span>Verified Certificate</span>
              </span>
            )}
            <div className="flex items-center gap-1 bg-white/90 border border-gray-200/80 px-2.5 py-1 rounded-full text-xs font-bold text-[#1F2937]">
              <span className="text-[#D9B24A]">★</span>
              <span>{event.rating}</span>
              <span className="text-[#5E6A68] text-[10px] font-medium">({event.reviewsCount || 142})</span>
            </div>
          </div>

          {/* Heading (Large Apple/Linear Style) */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0F5D46] tracking-tight leading-[1.12] mb-3">
            {event.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#0B4B3A] font-semibold leading-relaxed mb-4">
            {event.subtitle}
          </p>

          {/* Short Description */}
          <p className="text-sm text-[#5E6A68] leading-relaxed mb-6">
            {event.shortDescription}
          </p>

          {/* Key Metadata Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-[22px] bg-white/80 border border-white/80 shadow-xs mb-6 text-xs">
            <div>
              <span className="text-[#5E6A68] font-bold text-[10px] uppercase tracking-wider block mb-0.5">DATE & TIME</span>
              <span className="font-bold text-[#1F2937] block">{event.date}</span>
              <span className="text-[11px] text-[#5E6A68] block">{event.time}</span>
            </div>
            <div>
              <span className="text-[#5E6A68] font-bold text-[10px] uppercase tracking-wider block mb-0.5">LOCATION</span>
              <span className="font-bold text-[#1F2937] block truncate">{event.venue?.name || 'Main Campus'}</span>
              <span className="text-[11px] text-[#5E6A68] block">{event.mode}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#5E6A68] font-bold text-[10px] uppercase tracking-wider block mb-0.5">ORGANIZER</span>
              <span className="font-bold text-[#0F5D46] block truncate">{event.organizer?.name || 'Technical Council'}</span>
              <span className="text-[11px] text-[#D9B24A] font-bold block">✓ Verified Host</span>
            </div>
          </div>

          {/* Remaining Seats Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1F2937]">
                {event.participantsJoined} students registered
              </span>
              <span className="text-[#0F5D46] font-bold">
                {event.seatsLeft} seats remaining ({seatsPercentage}% booked)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#0F5D46] to-[#D9B24A] rounded-full transition-all duration-700"
                style={{ width: `${seatsPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Register Button */}
          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            className="flex-1 min-w-[200px] py-3.5 px-6 rounded-[16px] bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] hover:from-[#083629] hover:to-[#0B4B3A] text-white font-bold text-sm shadow-[0_8px_25px_rgba(15,93,70,0.3)] hover:shadow-[0_12px_32px_rgba(15,93,70,0.4)] flex items-center justify-center gap-2 group cursor-pointer transition-all border border-[#0F5D46]/30"
          >
            <span>Register Now • {event.fee}</span>
            <span className="text-[#D9B24A] group-hover:translate-x-1 transition-transform font-bold">→</span>
          </motion.button>

          {/* Save to Wishlist Button */}
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`p-3.5 rounded-[16px] border font-bold text-sm transition-all cursor-pointer flex items-center gap-2 ${
              isWishlisted
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                : 'bg-white/90 hover:bg-white text-[#5E6A68] hover:text-[#0F5D46] border-[#0F5D46]/20 shadow-2xs'
            }`}
            aria-label="Save to wishlist"
          >
            <span>{isWishlisted ? '❤️' : '🤍'}</span>
            <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="p-3.5 rounded-[16px] bg-white/90 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/20 shadow-2xs font-bold text-sm transition-all cursor-pointer flex items-center gap-2"
            aria-label="Share event"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
