import React from 'react'
import aventoLogo from '../../assets/logo.png'

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  unreadCount = 2, 
  onLogout, 
  onBackToLanding,
  mobileOpen = false,
  setMobileOpen
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'explore', label: 'Explore Events', icon: '🎫' },
    { id: 'wishlist', label: 'Saved Wishlist', icon: '💛' },
    { id: 'registrations', label: 'My Registrations', icon: '📅' },
    { id: 'tickets', label: 'My Tickets', icon: '🎟' },
    { id: 'certificates', label: 'Certificates', icon: '🏆' },
    { id: 'payments', label: 'Payment History', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙' }
  ]

  const handleNavClick = (id) => {
    setActiveTab(id)
    if (setMobileOpen) setMobileOpen(false)
  }

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-6 select-none">
      {/* Top: Brand Header & Navigation */}
      <div>
        {/* Logo & Student Role Badge */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#0F5D46]/10">
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F5D46] via-[#165A46] to-[#D9B24A] p-[1.5px] shadow-xs group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={aventoLogo} alt="AVENTO" className="w-6 h-6 object-contain" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-extrabold text-[20px] tracking-tight text-[#0F5D46] block leading-tight font-sans">
                AVENTO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#D9B24A]">
                STUDENT SUITE
              </span>
            </div>
          </div>

          <span className="text-[10.5px] uppercase font-extrabold tracking-wider text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2.5 py-1 rounded-full shadow-2xs">
            Student
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5 text-left">
          {navItems.map((item) => {
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[14px] text-[13.5px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0F5D46] text-white shadow-[0_4px_16px_rgba(15,93,70,0.25)]'
                    : 'text-[#5E6A68] hover:text-[#0F5D46] hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-white text-[#0F5D46]' 
                      : 'bg-[#D9B24A] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Actions: Website link & Logout */}
      <div className="pt-6 border-t border-[#0F5D46]/10 space-y-2">
        <button
          type="button"
          onClick={onBackToLanding}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-bold text-[#0F5D46] bg-white/70 hover:bg-white border border-[#0F5D46]/15 shadow-2xs transition-all cursor-pointer"
        >
          <span>🌐</span>
          <span>Back to Landing Page</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] text-xs font-bold text-red-700 bg-red-50/80 hover:bg-red-100 border border-red-200/60 shadow-2xs transition-all cursor-pointer"
        >
          <span>🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside 
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(250, 248, 242, 0.82) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)'
        }}
        className="hidden lg:block w-[280px] h-screen sticky top-0 shrink-0 border-r border-[#0F5D46]/10 shadow-[4px_0_30px_rgba(15,93,70,0.03)] z-30"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
          />

          {/* Sliding Drawer */}
          <div 
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 248, 242, 0.95) 100%)'
            }}
            className="relative w-[280px] h-full shadow-2xl z-10 animate-slide-right"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
