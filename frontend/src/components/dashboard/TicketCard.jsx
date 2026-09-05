import React from 'react'
import DigitalTicket from '../ticket/DigitalTicket'

export default function TicketCard({ ticket, studentName = 'Student' }) {
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
