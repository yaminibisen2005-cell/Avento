import React, { useState } from 'react'

export default function Notifications({ initialNotifications = [] }) {
  const defaultList = initialNotifications.length > 0 ? initialNotifications : [
    { id: '1', title: 'Registration Confirmed', message: 'Pass for National AI Innovation Hackathon is ready in your tickets vault.', time: '10m ago', isRead: false, type: 'ticket' },
    { id: '2', title: 'New Certificate Available', message: 'Official verifiable credential issued for UI/UX Design Sprint 2026.', time: '1h ago', isRead: false, type: 'certificate' },
    { id: '3', title: 'Event Reminder', message: 'DevOps & Cloud Masterclass starts tomorrow at 09:00 AM IST.', time: '1d ago', isRead: true, type: 'reminder' },
    { id: '4', title: 'Payment Receipt Settled', message: '₹999 Razorpay payment confirmed for Tech Leadership Summit.', time: '2d ago', isRead: true, type: 'payment' }
  ]

  const [notifications, setNotifications] = useState(defaultList)
  const [filter, setFilter] = useState('all') // 'all' | 'unread'

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: true })))
  }

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) {
        const nextState = !(n.isRead || n.read)
        return { ...n, isRead: nextState, read: nextState }
      }
      return n
    }))
  }

  const isItemRead = (n) => Boolean(n.isRead || n.read)
  const unreadCount = notifications.filter(n => !isItemRead(n)).length

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !isItemRead(n))
    : notifications

  return (
    <div className="space-y-4 sm:space-y-6 text-left select-none pb-12">
      {/* Page Title & Mark Read Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Notification Feed
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-0.5 sm:mt-1">
            Real-time updates regarding registrations, payments, and certificates
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {/* Filter Pills */}
          <div className="flex p-1 bg-[#0F5D46]/10 rounded-full border border-[#0F5D46]/15 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filter === 'all' ? 'bg-[#0F5D46] text-white shadow-2xs' : 'text-[#0F5D46] hover:bg-white/60'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                filter === 'unread' ? 'bg-[#0F5D46] text-white shadow-2xs' : 'text-[#0F5D46] hover:bg-white/60'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-[#0F5D46] text-xs font-bold rounded-full border border-[#0F5D46]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              Mark all read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-2.5 sm:space-y-3">
          {filteredNotifications.map((item) => {
            const read = isItemRead(item)
            return (
              <div
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                style={{
                  background: read 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(250, 248, 242, 0.60) 100%)' 
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(234, 247, 241, 0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)'
                }}
                className={`p-3.5 sm:p-5 rounded-[18px] sm:rounded-[22px] border transition-all duration-200 flex items-start gap-3 sm:gap-4 cursor-pointer ${
                  read 
                    ? 'border-white/60 text-[#5E6A68]' 
                    : 'border-[#0F5D46]/25 shadow-[0_8px_25px_rgba(15,93,70,0.06)]'
                }`}
              >
                {/* Icon */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] flex items-center justify-center text-base sm:text-lg shrink-0 ${
                  read ? 'bg-gray-100 text-gray-500' : 'bg-[#0F5D46] text-white shadow-2xs'
                }`}>
                  {item.type === 'ticket' && '🎫'}
                  {item.type === 'certificate' && '🏆'}
                  {item.type === 'reminder' && '⏰'}
                  {item.type === 'payment' && '💳'}
                  {!['ticket', 'certificate', 'reminder', 'payment'].includes(item.type) && '🔔'}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <h4 className={`text-xs sm:text-sm font-bold ${read ? 'text-[#1F2937]' : 'text-[#0F5D46]'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] sm:text-[11px] text-[#5E6A68] whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11.5px] sm:text-xs text-[#1F2937]/75 mt-0.5 sm:mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {/* Unread indicator */}
                {!read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9B24A] shrink-0 mt-1" />
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white/70 backdrop-blur-md rounded-[20px] sm:rounded-[24px] border border-white/60">
          <span className="text-3xl sm:text-4xl block mb-2">🔔</span>
          <h3 className="font-bold text-base sm:text-lg text-[#0F5D46]">No notifications found</h3>
          <p className="text-xs text-[#5E6A68] mt-1">
            {filter === 'unread' ? 'You have no unread notifications.' : 'You\'re all caught up! New alerts regarding your events will appear here.'}
          </p>
        </div>
      )}
    </div>
  )
}
