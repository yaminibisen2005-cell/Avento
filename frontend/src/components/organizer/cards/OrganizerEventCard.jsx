import React from 'react'
import { motion } from 'framer-motion'

export default function OrganizerEventCard({ 
  event, 
  onView, 
  onEdit, 
  onDelete 
}) {
  const fillPercentage = Math.min(100, Math.round((event.seatsFilled / event.seatsTotal) * 100))

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="rounded-[26px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.06)] hover:shadow-[0_18px_45px_rgba(15,93,70,0.12)] overflow-hidden flex flex-col justify-between text-left select-none group transition-all"
    >
      {/* Top Banner Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/95 text-[#0F5D46] px-2.5 py-1 rounded-full shadow-xs">
            {event.category}
          </span>
          <span className="text-[10px] font-bold bg-black/50 text-white backdrop-blur-xs px-2.5 py-1 rounded-full">
            {event.mode}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs ${
            event.status === 'Published' 
              ? 'bg-[#0F5D46] text-white' 
              : event.status === 'Draft'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-200 text-gray-700'
          }`}>
            {event.status}
          </span>
        </div>

        {/* Bottom Banner Stats */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between text-white text-xs font-bold">
          <span>{event.fee} Entry</span>
          <span className="text-[#D9B24A]">{event.seatsFilled} / {event.seatsTotal} registered</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-[#0F5D46] leading-snug line-clamp-1 mb-1">
            {event.title}
          </h3>
          <p className="text-[11.5px] text-[#5E6A68] flex items-center gap-1 truncate">
            <span>📍 {event.venue}</span>
            <span>•</span>
            <span>{event.date}</span>
          </p>
        </div>

        {/* Seats Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#5E6A68]">Capacity</span>
            <span className="font-bold text-[#1F2937]">{fillPercentage}% ({event.seatsTotal - event.seatsFilled} left)</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0F5D46] to-[#D9B24A] rounded-full transition-all duration-500" 
              style={{ width: `${fillPercentage}%` }} 
            />
          </div>
        </div>

        {/* Financial & Attendance Metrics */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs">
          <div>
            <span className="text-[10px] text-[#5E6A68] block">Revenue</span>
            <span className="font-bold text-[#0F5D46]">{event.revenue > 0 ? `₹${event.revenue.toLocaleString()}` : 'Free'}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#5E6A68] block">Attendance</span>
            <span className="font-bold text-[#1F2937]">{event.attendanceRate > 0 ? `${event.attendanceRate}%` : 'Pending'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onView && onView(event)}
            className="flex-1 py-2 bg-[#EAF7F1] hover:bg-[#d5eee2] text-[#0F5D46] font-bold text-xs rounded-[12px] transition-colors cursor-pointer text-center"
          >
            Manage
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(event)}
            className="px-3 py-2 bg-white hover:bg-gray-50 text-[#5E6A68] font-bold text-xs rounded-[12px] border border-gray-200 transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(event.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-[12px] transition-colors cursor-pointer text-xs font-bold"
            title="Delete Event"
          >
            🗑
          </button>
        </div>
      </div>
    </motion.div>
  )
}
