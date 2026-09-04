import React from 'react'
import { motion } from 'framer-motion'
import QRCodeScannerBadge from '../ticket/QRCodeScannerBadge'
import TicketActions from '../ticket/TicketActions'

export default function StepPaymentSuccess({ 
  registrationData, 
  onGoToTickets, 
  onClose 
}) {
  const ticketId = registrationData?.ticketId || 'AVT-HACK-4412'
  const registrationId = registrationData?.id || 'REG-AVT-8891'
  const attendeeName = registrationData?.attendee?.fullName || 'Student'
  const qrValue = registrationData?.qrCodeData || `AVENTO:PASS:${ticketId}:${attendeeName}`

  const ticketObj = {
    id: ticketId,
    ticketId: ticketId,
    registrationId: registrationId,
    title: registrationData?.eventTitle || 'Event Pass',
    venue: registrationData?.venue || 'Main Auditorium',
    date: registrationData?.date || 'Upcoming',
    time: registrationData?.time || '09:00 AM IST',
    category: registrationData?.category || 'Event',
    studentName: attendeeName,
    seat: registrationData?.seatNumber || 'Zone A / Main Hall'
  }

  return (
    <div className="py-2 text-center select-none space-y-6">
      {/* Large Glowing Success Animation */}
      <div className="relative mx-auto w-20 h-20">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-[#0F5D46]/20 blur-xl"
        />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0F5D46] to-[#177A5D] text-white flex items-center justify-center text-3xl shadow-[0_12px_32px_rgba(15,93,70,0.35)] relative z-10 border-4 border-white"
        >
          ✓
        </motion.div>
      </div>

      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D9B24A] bg-[#D9B24A]/15 border border-[#D9B24A]/30 px-3 py-0.5 rounded-full inline-block mb-1.5">
          Verified & Sealed
        </span>
        <h2 className="font-display font-extrabold text-2xl text-[#0F5D46] leading-tight">
          Registration Confirmed!
        </h2>
        <p className="text-xs text-[#5E6A68] mt-1 max-w-sm mx-auto leading-relaxed">
          Your official entry pass for <strong className="text-[#0B4B3A]">{registrationData?.eventTitle}</strong> has been generated with real vector QR check-in.
        </p>
      </div>

      {/* Real QR Code Pass Preview Card */}
      <div className="p-4 rounded-[24px] bg-[#FAF8F2] border border-[#0F5D46]/15 max-w-sm mx-auto shadow-inner flex flex-col items-center gap-3">
        <QRCodeScannerBadge value={qrValue} size={110} />

        <div className="text-left w-full space-y-1.5 pt-2 border-t border-[#0F5D46]/10 text-xs">
          <div className="flex justify-between">
            <span className="text-[#5E6A68]">Ticket ID:</span>
            <span className="font-mono font-extrabold text-[#0F5D46]">{ticketId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5E6A68]">Assigned Seat:</span>
            <span className="font-bold text-[#1F2937]">{registrationData?.seatNumber || 'Zone A / Main Hall'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5E6A68]">Attendee:</span>
            <span className="font-bold text-[#1F2937]">{attendeeName}</span>
          </div>
        </div>
      </div>

      {/* Multi-Format Actions (PDF, PNG, Share, Google Cal, Apple Cal) */}
      <div className="flex justify-center max-w-sm mx-auto">
        <TicketActions ticket={ticketObj} />
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-3 max-w-sm mx-auto pt-2">
        <button
          type="button"
          onClick={onGoToTickets}
          className="flex-1 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[16px] shadow-sm cursor-pointer"
        >
          🎟 Open My Tickets Passbook
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 bg-white hover:bg-gray-50 text-[#5E6A68] font-bold text-xs rounded-[16px] border border-gray-200 cursor-pointer shadow-2xs"
        >
          Done
        </button>
      </div>
    </div>
  )
}
