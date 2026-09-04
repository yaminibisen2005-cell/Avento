import React, { useState } from 'react'

export default function TabNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Check-in Verified at Gate 1', message: 'Aarav Sharma (IIT Delhi) scanned and admitted.', time: '10 mins ago', type: 'scan', unread: true },
    { id: 2, title: 'Payment Settled', message: '₹999 received for Global Tech Summit.', time: '25 mins ago', type: 'payment', unread: true },
    { id: 3, title: 'Batch Certificate Dispatch', message: '120 blockchain certificates signed and dispatched.', time: '2 hours ago', type: 'cert', unread: false },
    { id: 4, title: 'New Registration', message: 'Ananya Iyer registered for DevOps Masterclass.', time: '4 hours ago', type: 'reg', unread: false }
  ])

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <div className="max-w-3xl space-y-6 text-left select-none pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Event Desk Notifications
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time feed of attendee check-ins, ticketing settlements, and credentials
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#0F5D46] hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-[20px] border transition-all text-xs flex items-start justify-between gap-4 ${
              n.unread 
                ? 'bg-white border-[#0F5D46]/20 shadow-xs' 
                : 'bg-white/60 border-gray-100 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center shrink-0 text-sm">
                {n.type === 'scan' ? '📷' : n.type === 'payment' ? '💳' : n.type === 'cert' ? '🎓' : '👥'}
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-[#0F5D46]">{n.title}</h4>
                <p className="text-[#5E6A68]">{n.message}</p>
                <span className="text-[10px] text-gray-400 block pt-1">{n.time}</span>
              </div>
            </div>

            {n.unread && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9B24A] shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
