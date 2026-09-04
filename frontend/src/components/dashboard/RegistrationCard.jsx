import React from 'react'
import { motion } from 'framer-motion'

export default function RegistrationCard({ registration, onViewTicket, onViewEvent }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-emerald-50 text-[#0F5D46] border-[#0F5D46]/20'
      case 'completed':
        return 'bg-amber-50 text-[#92400E] border-amber-200'
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.80) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 rounded-[22px] border border-white/70 shadow-[0_10px_30px_rgba(15,93,70,0.05)] hover:shadow-[0_16px_40px_rgba(15,93,70,0.10)] flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all select-none"
    >
      {/* Left: Event Details */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[10.5px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(registration.status)}`}>
            {registration.status}
          </span>
          <span className="text-[11px] font-bold text-[#5E6A68] bg-gray-100/80 px-2.5 py-0.5 rounded-full">
            {registration.category}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {registration.id}
          </span>
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl text-[#0F5D46]">
          {registration.eventTitle}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5E6A68]">
          <span className="flex items-center gap-1.5">
            <span>📅</span>
            <span>{registration.date}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>📍</span>
            <span>{registration.venue}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>💳</span>
            <span>{registration.paymentStatus}</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => onViewTicket && onViewTicket(registration)}
          className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>🎟</span>
          <span>View Ticket</span>
        </button>

        {onViewEvent && (
          <button
            type="button"
            onClick={() => onViewEvent(registration)}
            className="px-3.5 py-2 bg-white/90 hover:bg-white text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/20 transition-all cursor-pointer"
          >
            Details
          </button>
        )}
      </div>
    </motion.div>
  )
}
