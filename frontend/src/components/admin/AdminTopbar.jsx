import React, { useState, useEffect, useRef } from 'react'

export default function AdminTopbar({
  adminName = 'AVENTO Administrator',
  onNavigateTab,
  onLogout,
  onMenuToggle,
  searchQuery = '',
  setSearchQuery
}) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header 
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 248, 242, 0.88) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)'
      }}
      className="h-20 w-full sticky top-0 z-20 px-4 sm:px-8 border-b border-[#0F5D46]/12 shadow-[0_4px_24px_rgba(15,93,70,0.03)] flex items-center justify-between select-none"
    >
      {/* LEFT: HAMBURGER & TITLE */}
      <div className="flex items-center gap-3 sm:gap-4 text-left">
        <button
          type="button"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-[14px] text-[#0F5D46] hover:bg-[#0F5D46]/10 border border-[#0F5D46]/15 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-[#D9B24A]">
            SUPERUSER PRIVILEGE LEVEL
          </span>
          <h1 className="font-display font-extrabold text-base sm:text-xl text-[#0F5D46] leading-tight">
            Platform Master Console
          </h1>
        </div>
      </div>

      {/* RIGHT: SEARCH, SYSTEM ALERTS, ADMIN BADGE */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Input */}
        <div className="relative hidden md:block w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search users, events, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 text-xs rounded-full bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
          />
        </div>

        {/* Quick Action: Pending Approvals */}
        <button
          type="button"
          onClick={() => onNavigateTab && onNavigateTab('organizer-approval')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF7F1] hover:bg-[#d5eee2] text-[#0F5D46] border border-[#0F5D46]/20 text-xs font-bold shadow-2xs cursor-pointer transition-all"
        >
          <span>🛡</span>
          <span>Review Approvals</span>
        </button>

        {/* System Alert Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/20 shadow-2xs cursor-pointer relative"
          >
            <span>🔔</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D9B24A] border-2 border-white animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-[22px] shadow-2xl border border-[#0F5D46]/15 p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="font-bold text-xs text-[#0F5D46]">System Audit Log</span>
                <span className="text-[10px] bg-[#D9B24A] text-white font-extrabold px-2 py-0.5 rounded-full">
                  Live Feed
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                  <span className="font-bold text-[#0F5D46] block">Organizer Review Request</span>
                  <span className="text-[11px] text-[#5E6A68]">BITS Innovators Club submitted GST & credentials.</span>
                </div>
                <div className="p-2 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                  <span className="font-bold text-[#0F5D46] block">High-Value Settlement</span>
                  <span className="text-[11px] text-[#5E6A68]">Batch payout of ₹4.8L processed for IIT Delhi.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/90 border border-[#0F5D46]/20 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0F5D46] via-[#126B51] to-[#D9B24A] p-0.5 text-white flex items-center justify-center font-bold text-xs">
              👑
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#0F5D46] max-w-[120px] truncate">
              {adminName}
            </span>
            <span className="text-[10px] text-[#5E6A68]">▼</span>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[20px] shadow-2xl border border-[#0F5D46]/15 p-2.5 z-50 text-left text-xs font-semibold space-y-1">
              <div className="p-2.5 bg-[#FAF8F2] rounded-[14px] mb-1">
                <span className="font-bold text-[#0F5D46] block truncate">{adminName}</span>
                <span className="text-[10px] text-[#D9B24A] font-extrabold uppercase">Platform Root Admin</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false)
                  if (onNavigateTab) onNavigateTab('settings')
                }}
                className="w-full px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#EAF7F1] hover:text-[#0F5D46] flex items-center gap-2 cursor-pointer"
              >
                <span>⚙</span>
                <span>Platform Settings</span>
              </button>
              <div className="pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    if (onLogout) onLogout()
                  }}
                  className="w-full px-3 py-2 rounded-[12px] text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-bold"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
