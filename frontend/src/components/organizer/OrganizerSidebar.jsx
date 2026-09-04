import React from 'react'
import logoImg from '../../assets/logo.png'

export default function OrganizerSidebar({
  activeTab = 'dashboard',
  setActiveTab,
  unreadCount = 2,
  onLogout,
  onBackToLanding,
  mobileOpen = false,
  setMobileOpen
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'my-events', label: 'My Events', icon: '🗓' },
    { id: 'create-event', label: 'Create Event', icon: '✨' },
    { id: 'registrations', label: 'Registrations', icon: '👥' },
    { id: 'attendance', label: 'QR Attendance', icon: '📷' },
    { id: 'certificates', label: 'Certificates', icon: '🎓' },
    { id: 'revenue', label: 'Revenue & Payouts', icon: '💳' },
    { id: 'analytics', label: 'Analytics & Trends', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
    { id: 'profile', label: 'Organizer Profile', icon: '🏛' },
    { id: 'settings', label: 'Settings', icon: '⚙' }
  ]

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    if (setMobileOpen) setMobileOpen(false)
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-5 select-none text-left">
      {/* 1. TOP BRAND HEADER */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="AVENTO Logo" className="h-8 w-auto object-contain" />
            <div>
              <span className="font-display font-extrabold text-sm text-[#0F5D46] tracking-tight block">
                AVENTO
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#D9B24A] bg-[#D9B24A]/15 px-2 py-0.5 rounded-full border border-[#D9B24A]/30 inline-block">
                Organizer Portal
              </span>
            </div>
          </div>

          {/* Close drawer button for mobile */}
          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* 2. NAVIGATION LINKS */}
        <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0F5D46] to-[#126B51] text-white shadow-[0_4px_16px_rgba(15,93,70,0.22)]'
                    : 'text-[#5E6A68] hover:text-[#0F5D46] hover:bg-[#EAF7F1]/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#D9B24A] text-white' : 'bg-[#0F5D46] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 3. BOTTOM ACTIONS: BACK TO SITE & LOGOUT */}
      <div className="pt-4 border-t border-[#0F5D46]/10 space-y-1.5">
        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-[#0F5D46] hover:bg-[#EAF7F1] rounded-[14px] transition-colors cursor-pointer"
          >
            <span>🌐</span>
            <span>Back to Website</span>
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-[14px] transition-colors cursor-pointer"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Fixed Sidebar (280px) */}
      <aside 
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 248, 242, 0.88) 100%)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)'
        }}
        className="hidden lg:block w-[280px] h-screen sticky top-0 border-r border-[#0F5D46]/12 shadow-[4px_0_24px_rgba(15,93,70,0.03)] z-30 shrink-0"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setMobileOpen(false)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
          />
          <div 
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 248, 242, 0.95) 100%)',
              backdropFilter: 'blur(30px)'
            }}
            className="relative w-72 h-full shadow-2xl z-10 flex flex-col"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
