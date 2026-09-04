import React, { useState } from 'react'

export default function Notifications({ initialNotifications = [] }) {
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Title & Mark Read Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Notification Feed
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time updates regarding registrations, payments, and certificates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-white/90 hover:bg-white text-[#0F5D46] text-xs font-bold rounded-full border border-[#0F5D46]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              style={{
                background: item.read 
                  ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(250, 248, 242, 0.60) 100%)' 
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(234, 247, 241, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
              className={`p-5 rounded-[22px] border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                item.read 
                  ? 'border-white/60 text-[#5E6A68]' 
                  : 'border-[#0F5D46]/25 shadow-[0_8px_25px_rgba(15,93,70,0.06)]'
              }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-lg shrink-0 ${
                item.read ? 'bg-gray-100 text-gray-500' : 'bg-[#0F5D46] text-white shadow-2xs'
              }`}>
                {item.type === 'ticket' && '🎫'}
                {item.type === 'certificate' && '🏆'}
                {item.type === 'reminder' && '⏰'}
                {item.type === 'payment' && '💳'}
                {!['ticket', 'certificate', 'reminder', 'payment'].includes(item.type) && '🔔'}
              </div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${item.read ? 'text-[#1F2937]' : 'text-[#0F5D46]'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-[#5E6A68] whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-[#1F2937]/75 mt-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              {/* Unread indicator */}
              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9B24A] shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/70 backdrop-blur-md rounded-[24px] border border-white/60">
          <span className="text-4xl block mb-2">🔔</span>
          <h3 className="font-bold text-lg text-[#0F5D46]">No notifications right now</h3>
          <p className="text-xs text-[#5E6A68] mt-1">
            You're all caught up! New alerts regarding your events will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
