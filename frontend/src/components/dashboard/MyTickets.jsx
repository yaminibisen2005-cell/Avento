import React from 'react'
import TicketCard from './TicketCard'

export default function MyTickets({ tickets = [], studentName = 'Student' }) {
  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Title */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          My Digital Passes & QR Tickets
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Present these high-resolution smart badges at venue check-in points for 0.3s admission
        </p>
      </div>

      {/* Ticket List */}
      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              studentName={studentName}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/70 backdrop-blur-md rounded-[24px] border border-white/60">
          <span className="text-4xl block mb-2">🎟</span>
          <h3 className="font-bold text-lg text-[#0F5D46]">No Active Passes Found</h3>
          <p className="text-xs text-[#5E6A68] mt-1">
            Register for upcoming events to automatically generate instant QR entry tickets.
          </p>
        </div>
      )}
    </div>
  )
}
