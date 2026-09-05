import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function StickyRegistrationCard({ 
  event, 
  onRegister, 
  isWishlisted, 
  onToggleWishlist,
  isRegistered = false,
  onViewTickets
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const seatsPercentage = Math.min(100, Math.round(((event.maxSeats - event.seatsLeft) / event.maxSeats) * 100))

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)'
      }}
      className="relative p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-[0_16px_40px_rgba(15,93,70,0.08)] space-y-5 text-left select-none"
    >
      {/* Top Header: Price & Deadline */}
      <div className="flex items-baseline justify-between pb-4 border-b border-[#0F5D46]/10">
        <div>
          <span className="text-[10.5px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">
            REGISTRATION FEE
          </span>
          <div className="text-3xl font-extrabold text-[#0F5D46] tracking-tight">
            {event.fee}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#D9B24A] bg-[#D9B24A]/10 border border-[#D9B24A]/30 px-2.5 py-1 rounded-full block">
            Limited Capacity
          </span>
          <span className="text-[11px] text-[#5E6A68] font-medium block mt-1">
            Closes {event.registrationDeadline}
          </span>
        </div>
      </div>

      {/* Seats Progress */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-[#5E6A68]">Booked Capacity:</span>
          <span className="font-bold text-[#1F2937]">{seatsPercentage}% ({event.seatsLeft} left)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-200/80 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0F5D46] to-[#D9B24A] rounded-full transition-all duration-700"
            style={{ width: `${seatsPercentage}%` }}
          />
        </div>
      </div>

      {/* Features Checklist */}
      <div className="space-y-2 text-xs text-[#1F2937]/80 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[#0F5D46] font-bold">✓</span>
          <span>Instant 0.3s QR Entry Ticket</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#0F5D46] font-bold">✓</span>
          <span>Official Verifiable Certificate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#0F5D46] font-bold">✓</span>
          <span>Full Event Materials & Compute Credits</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#0F5D46] font-bold">✓</span>
          <span>1-on-1 Mentorship & Networking</span>
        </div>
      </div>

      {/* Primary Register or Already Registered Button */}
      {isRegistered ? (
        <div className="space-y-2">
          <div className="w-full py-3.5 px-4 rounded-[16px] bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-sm shadow-xs flex items-center justify-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>✓ Already Registered</span>
          </div>
          {onViewTickets && (
            <button
              type="button"
              onClick={onViewTickets}
              className="w-full py-3 px-4 rounded-[16px] bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🎟 View My Pass / QR Ticket</span>
              <span>→</span>
            </button>
          )}
        </div>
      ) : (
        <motion.button
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRegister}
          className="w-full py-3.5 px-5 rounded-[16px] bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] hover:from-[#083629] hover:to-[#0B4B3A] text-white font-bold text-sm shadow-[0_8px_25px_rgba(15,93,70,0.28)] hover:shadow-[0_12px_32px_rgba(15,93,70,0.38)] flex items-center justify-center gap-2 group cursor-pointer transition-all border border-[#0F5D46]/30"
        >
          <span>Register Now</span>
          <span className="text-[#D9B24A] group-hover:translate-x-1 transition-transform font-bold">→</span>
        </motion.button>
      )}

      {/* Secondary Actions: Wishlist & Share */}
      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          onClick={onToggleWishlist}
          className={`flex-1 py-2.5 px-3 rounded-[14px] border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
              : 'bg-white/80 hover:bg-white text-[#5E6A68] hover:text-[#0F5D46] border-[#0F5D46]/20'
          }`}
        >
          <span>{isWishlisted ? '❤️' : '🤍'}</span>
          <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-2.5 px-3 rounded-[14px] bg-white/80 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/20 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <span>🔗</span>
          <span>{copied ? 'Copied!' : 'Share Pass'}</span>
        </button>
      </div>

      <div className="text-center pt-2">
        <span className="text-[11px] text-[#5E6A68]">
          🔒 Bank-grade verified registration by AVENTO
        </span>
      </div>
    </div>
  )
}
