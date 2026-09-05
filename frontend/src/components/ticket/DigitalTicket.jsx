import React, { useState } from 'react'
import { motion } from 'framer-motion'
import QRCodeScannerBadge from './QRCodeScannerBadge'
import TicketActions from './TicketActions'

export default function DigitalTicket({ 
  ticket, 
  studentName = 'Attendee',
  showActions = true 
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  const ticketId = ticket.ticketId || ticket.id || 'AVT-PASS-8841'
  const registrationId = ticket.registrationId || `REG-AVT-${ticket.id ? String(ticket.id).slice(-4) : '9901'}`
  const seatNumber = ticket.seat || ticket.seatNumber || 'Zone A / Row 2 / Seat 18'
  const qrData = ticket.qrCode || `AVENTO:PASS:${ticketId}:${studentName}`

  return (
    <div className="w-full max-w-4xl mx-auto select-none py-2 text-left">
      {/* 3D Flip Card Container */}
      <div className="relative [perspective:1400px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full [transform-style:preserve-3d]"
        >
          {/* ========================================================== */}
          {/* FRONT SIDE: LUXURY BOARDING PASS                           */}
          {/* ========================================================== */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(254, 252, 248, 0.90) 100%)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)'
            }}
            className="w-full rounded-[30px] border border-white/80 shadow-[0_20px_50px_rgba(15,93,70,0.10)] overflow-hidden [backface-visibility:hidden] relative"
          >
            {/* Top Emerald Header Strip */}
            <div className="h-3 w-full bg-gradient-to-r from-[#0F5D46] via-[#126B51] to-[#D9B24A]" />

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
              {/* Left Main Ticket Info (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F5D46] flex items-center justify-center text-white font-extrabold text-xs shadow-2xs">
                      A
                    </div>
                    <div>
                      <span className="font-display font-extrabold text-sm text-[#0F5D46] tracking-tight block">
                        AVENTO PASS
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#D9B24A] tracking-wider block">
                        Official Delegate Pass
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-[#EAF7F1] text-[#0F5D46] border border-[#0F5D46]/20 px-2.5 py-1 rounded-full">
                      {ticket.category || 'Event'}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase bg-[#D9B24A]/15 text-[#8C6F1E] border border-[#D9B24A]/30 px-2 py-1 rounded-full flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  </div>
                </div>

                {/* Event Heading */}
                <div>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F5D46] tracking-tight leading-tight mb-1">
                    {ticket.title || ticket.eventTitle}
                  </h3>
                  <p className="text-xs text-[#5E6A68] flex items-center gap-2">
                    <span>📍 {ticket.venue}</span>
                  </p>
                </div>

                {/* Attendee Details & Seat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">
                      PASS HOLDER
                    </span>
                    <span className="font-bold text-[#1F2937] block truncate">
                      {ticket.studentName || studentName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">
                      SEAT / ACCESS
                    </span>
                    <span className="font-extrabold text-[#0F5D46] block truncate">
                      {seatNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">
                      DATE & TIME
                    </span>
                    <span className="font-semibold text-[#1F2937] block">
                      {ticket.date}
                    </span>
                    <span className="text-[10px] text-[#5E6A68] block">
                      {ticket.time || '09:00 AM IST'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">
                      PASS ID
                    </span>
                    <span className="font-mono font-bold text-[#0F5D46] block truncate">
                      {ticketId}
                    </span>
                  </div>
                </div>

                {/* Bottom Status Row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-emerald-700">Admission Active & Confirmed</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Venue Rules</span>
                    <span>🔄</span>
                  </button>
                </div>
              </div>

              {/* Perforation Dashed Divider with Notches */}
              <div className="hidden lg:flex flex-col items-center justify-between absolute right-[32%] top-0 bottom-0 pointer-events-none">
                {/* Top Notch Cutout */}
                <div className="w-6 h-6 rounded-full bg-[#FAF8F2] -mt-3 shadow-inner" />
                {/* Vertical Dashed Line */}
                <div className="w-0.5 h-full border-r-2 border-dashed border-[#0F5D46]/20 my-2" />
                {/* Bottom Notch Cutout */}
                <div className="w-6 h-6 rounded-full bg-[#FAF8F2] -mb-3 shadow-inner" />
              </div>

              {/* Right Check-in QR Stub (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-[24px] bg-gradient-to-b from-white/90 to-[#FAF8F2] border border-[#0F5D46]/10 text-center space-y-3">
                <QRCodeScannerBadge
                  value={qrData}
                  size={120}
                />

                <div className="text-center space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400 block tracking-widest">
                    {registrationId}
                  </span>
                  <span className="text-[11px] text-[#5E6A68] font-medium block">
                    Hold steady at turnstile scanner
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================== */}
          {/* BACK SIDE: VENUE PROTOCOLS & SECURITY HOLOGRAM              */}
          {/* ========================================================== */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(254, 252, 248, 0.98) 0%, rgba(250, 248, 242, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              WebkitBackdropFilter: 'blur(25px)',
              transform: 'rotateY(180deg)'
            }}
            className="w-full rounded-[30px] border border-white/80 shadow-[0_20px_50px_rgba(15,93,70,0.10)] overflow-hidden [backface-visibility:hidden] absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-left"
          >
            {/* Top Back Header */}
            <div className="flex items-center justify-between border-b border-[#0F5D46]/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡</span>
                <span className="font-display font-extrabold text-sm text-[#0F5D46] tracking-tight">
                  SECURITY & VENUE ADMISSION PROTOCOLS
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Back to Pass</span>
                <span>🔄</span>
              </button>
            </div>

            {/* Instruction Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-xs">
              <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10 space-y-1">
                <span className="font-bold text-[#0F5D46] block">1. Physical University ID</span>
                <p className="text-[11.5px] text-[#5E6A68] leading-relaxed">
                  Attendees must present their original college ID along with this digital pass at Gate 1 or Gate 2.
                </p>
              </div>

              <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10 space-y-1">
                <span className="font-bold text-[#0F5D46] block">2. Hardware Inspection</span>
                <p className="text-[11.5px] text-[#5E6A68] leading-relaxed">
                  Laptops and development boards are permitted. All devices are tagged with serial stamps at check-in.
                </p>
              </div>

              <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10 space-y-1">
                <span className="font-bold text-[#0F5D46] block">3. Code of Conduct</span>
                <p className="text-[11.5px] text-[#5E6A68] leading-relaxed">
                  AVENTO reserves right of admission. Badges are strictly non-transferable and tied to registered identity.
                </p>
              </div>

              <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10 space-y-1">
                <span className="font-bold text-[#0F5D46] block">4. Certificate Eligibility</span>
                <p className="text-[11.5px] text-[#5E6A68] leading-relaxed">
                  Minimum 85% session attendance recorded via entrance scans is mandatory for certificate generation.
                </p>
              </div>
            </div>

            {/* Bottom Security Hologram Strip */}
            <div className="p-3 rounded-[16px] bg-gradient-to-r from-[#0F5D46] to-[#0B4B3A] text-white flex items-center justify-between text-[11px] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#D9B24A] font-extrabold text-sm">★</span>
                <span>CRYPTOGRAPHICALLY SEALED PASS</span>
              </div>
              <span className="font-mono text-[#D9B24A] text-[10px]">
                HASH: SHA256-AVT-992
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ticket Action Toolbar */}
      {showActions && (
        <div className="mt-3 flex justify-center">
          <TicketActions ticket={ticket} />
        </div>
      )}
    </div>
  )
}
