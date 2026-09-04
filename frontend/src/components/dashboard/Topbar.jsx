import React, { useState, useEffect, useRef } from 'react'

export default function Topbar({ 
  studentName = 'Aarav Sharma', 
  userEmail = 'aarav@student.edu',
  unreadCount = 2, 
  notifications = [],
  onNavigateTab,
  onLogout,
  onBackToLanding,
  onMenuToggle,
  searchQuery = '',
  setSearchQuery,
  onOpenSearchModal
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && onNavigateTab) {
      onNavigateTab('explore')
    }
  }

  const handleMenuSelect = (tab) => {
    setProfileOpen(false)
    setNotificationsOpen(false)
    if (onNavigateTab) onNavigateTab(tab)
  }

  return (
    <header 
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 248, 242, 0.88) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)'
      }}
      className="h-20 w-full sticky top-0 z-40 px-4 sm:px-8 lg:px-10 border-b border-[#0F5D46]/15 shadow-[0_4px_24px_rgba(15,93,70,0.04)] flex items-center justify-between select-none"
    >
      {/* ================= LEFT: HAMBURGER & GREETING ================= */}
      <div className="flex items-center gap-3 sm:gap-4 text-left">
        {/* Mobile Hamburger Drawer Button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2.5 rounded-[14px] text-[#0F5D46] hover:bg-[#0F5D46]/10 border border-[#0F5D46]/15 transition-colors cursor-pointer"
          aria-label="Open navigation drawer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Personalized Student Greeting */}
        <div className="flex flex-col justify-center">
          <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#5E6A68] leading-tight">
            {getGreeting()},
          </span>
          <h1 className="font-display font-extrabold text-base sm:text-xl text-[#0F5D46] leading-tight tracking-tight">
            {studentName}
          </h1>
          <span className="text-[11px] text-[#5E6A68] hidden sm:block font-medium mt-0.5">
            Welcome back to AVENTO
          </span>
        </div>
      </div>

      {/* ================= RIGHT: SEARCH, NOTIFICATIONS, PROFILE ================= */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        {/* Desktop Search Bar */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Global search (Ctrl+K)..."
            value={searchQuery}
            onClick={() => onOpenSearchModal && onOpenSearchModal()}
            onChange={(e) => {
              if (setSearchQuery) setSearchQuery(e.target.value)
            }}
            onKeyDown={handleSearchSubmit}
            className="w-full h-10 pl-9 pr-14 text-xs rounded-full bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:ring-2 focus:ring-[#0F5D46]/15 text-[#1F2937] placeholder-gray-400 shadow-2xs transition-all cursor-pointer"
          />
          <button
            type="button"
            onClick={onOpenSearchModal}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded-[6px] border border-gray-200 cursor-pointer hover:bg-gray-200"
          >
            ⌘K
          </button>
        </div>

        {/* Mobile Search Icon Toggle */}
        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2.5 rounded-full bg-white/90 text-[#0F5D46] border border-[#0F5D46]/20 shadow-2xs hover:bg-white cursor-pointer"
            aria-label="Toggle mobile search"
          >
            🔍
          </button>

          {/* Floating Mobile Search Box */}
          {mobileSearchOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#0F5D46]/20 p-2.5 z-50 animate-fade-in">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMobileSearchOpen(false)
                      if (onNavigateTab) onNavigateTab('explore')
                    }
                  }}
                  autoFocus
                  className="w-full h-9 pl-3 pr-8 text-xs rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none text-[#1F2937]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery && setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= NOTIFICATION BELL & DROPDOWN ================= */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              setProfileOpen(false)
            }}
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              notificationsOpen
                ? 'bg-[#0F5D46] text-white shadow-xs'
                : 'bg-white/90 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/20 shadow-2xs hover:shadow-xs'
            }`}
            aria-label="Toggle notifications dropdown"
          >
            <span className="text-base leading-none">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D9B24A] border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Notification Dropdown Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_50px_rgba(15,93,70,0.15)] border border-[#0F5D46]/15 p-4 z-50 text-left animate-fade-in">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#0F5D46]/10">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-[#0F5D46]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-extrabold bg-[#D9B24A] text-white px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleMenuSelect('notifications')}
                  className="text-[11px] font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* Quick Notifications List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(notifications.length > 0 ? notifications.slice(0, 3) : [
                  { id: '1', title: 'Registration Confirmed', message: 'Pass for National AI Hackathon ready.', time: '10m ago', unread: true },
                  { id: '2', title: 'New Certificate Available', message: 'Credential issued for UI/UX Sprint.', time: '1h ago', unread: true },
                  { id: '3', title: 'Event Reminder', message: 'DevOps Masterclass starts tomorrow.', time: '1d ago', unread: false }
                ]).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMenuSelect('notifications')}
                    className="p-2.5 rounded-[14px] bg-[#FAF8F2]/80 hover:bg-[#EAF7F1]/80 border border-[#0F5D46]/10 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0F5D46] truncate">{item.title}</span>
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-[#5E6A68] mt-0.5 line-clamp-1">{item.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-2 border-t border-[#0F5D46]/10 text-center">
                <button
                  type="button"
                  onClick={() => handleMenuSelect('notifications')}
                  className="text-xs font-bold text-[#0F5D46] hover:underline cursor-pointer"
                >
                  Open Full Notification Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= PROFILE AVATAR & DROPDOWN ================= */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNotificationsOpen(false)
            }}
            className={`flex items-center gap-2.5 pl-2 pr-3 sm:pr-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              profileOpen
                ? 'bg-[#0F5D46] text-white shadow-xs'
                : 'bg-white/90 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/20 shadow-2xs hover:shadow-xs'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F5D46] to-[#D9B24A] p-[1.5px] shadow-2xs shrink-0">
              <div className="w-full h-full rounded-full bg-[#EAF7F1] flex items-center justify-center font-extrabold text-xs text-[#0F5D46]">
                {studentName?.charAt(0) || 'A'}
              </div>
            </div>

            <div className="hidden sm:block text-left leading-none">
              <span className={`text-xs font-bold block truncate max-w-[120px] ${profileOpen ? 'text-white' : 'text-[#0F5D46]'}`}>
                {studentName}
              </span>
              <span className={`text-[9.5px] font-extrabold uppercase tracking-wider ${profileOpen ? 'text-[#D9B24A]' : 'text-[#D9B24A]'}`}>
                Student
              </span>
            </div>

            <span className={`text-[10px] transition-transform duration-200 ${profileOpen ? 'rotate-180 text-white' : 'text-[#0F5D46]'}`}>
              ▼
            </span>
          </div>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_50px_rgba(15,93,70,0.15)] border border-[#0F5D46]/15 p-3 z-50 text-left animate-fade-in">
              {/* Header Info */}
              <div className="p-3 bg-[#FAF8F2] rounded-[18px] border border-[#0F5D46]/10 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F5D46] truncate">{studentName}</span>
                  <span className="text-[9px] font-extrabold uppercase bg-[#0F5D46] text-white px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <span className="text-[11px] text-[#5E6A68] truncate block mt-0.5">{userEmail}</span>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleMenuSelect('profile')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#EAF7F1] hover:text-[#0F5D46] transition-colors cursor-pointer"
                >
                  <span>👤</span>
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect('tickets')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#EAF7F1] hover:text-[#0F5D46] transition-colors cursor-pointer"
                >
                  <span>🎟</span>
                  <span>My Passes & QR Tickets</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect('certificates')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#EAF7F1] hover:text-[#0F5D46] transition-colors cursor-pointer"
                >
                  <span>🏆</span>
                  <span>Earned Certificates</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect('settings')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#EAF7F1] hover:text-[#0F5D46] transition-colors cursor-pointer"
                >
                  <span>⚙</span>
                  <span>Account Settings</span>
                </button>

                {onBackToLanding && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      onBackToLanding()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#0F5D46] hover:bg-[#EAF7F1] transition-colors cursor-pointer"
                  >
                    <span>🌐</span>
                    <span>Back to Website</span>
                  </button>
                )}

                <div className="pt-2 border-t border-[#0F5D46]/10">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      if (onLogout) onLogout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-red-700 hover:bg-red-50 transition-colors cursor-pointer font-bold"
                  >
                    <span>🚪</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
