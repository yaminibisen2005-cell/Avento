import React from 'react'
import DigitalTicket from '../ticket/DigitalTicket'

export default function TicketCard({ ticket, studentName = 'Aarav Sharma' }) {
  return (
    <div className="w-full">
      <DigitalTicket
        ticket={ticket}
        studentName={studentName}
        showActions={true}
      />
    </div>
  )
}
