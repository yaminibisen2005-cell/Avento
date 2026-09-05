import React, { useState, useEffect } from 'react'
import aventoLogo from '../assets/logo.png'
import PremiumAuth from './PremiumAuth'

export default function Navbar({ 
  onOpenAuth, 
  isSplashing = false, 
  currentUser = null, 
  onLogout, 
  onOpenDashboard, 
  onOpenProfile,
  onOpenEvents, 
  onOpenAbout, 
  onBackToLanding, 
  activeTab: propActiveTab 
}) {
  const [localActiveTab, setLocalActiveTab] = useState('Home')
  const activeTab = propActiveTab || localActiveTab
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isScrolled, setIsScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = React.useRef(null)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Events', href: '#events' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ease-out px-4 sm:px-8 lg:px-12 ${
        isSplashing || !isScrolled
          ? 'h-[72px] sm:h-[76px] bg-transparent border-b border-transparent shadow-none'
          : 'h-[64px] sm:h-[68px] bg-white/90 backdrop-blur-xl border-b border-[#0F5D46]/10 shadow-[0_4px_24px_rgba(15,93,70,0.06)]'
      }`}
    >
      <div className="w-full max-w-[1440px] h-full mx-auto flex items-center justify-between">
        
        {/* ================= LEFT: LOGO ================= */}
        <a 
          href="#home" 
          onClick={(e) => {
            if (onBackToLanding) {
              e.preventDefault()
              onBackToLanding()
            } else {
              setLocalActiveTab('Home')
            }
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F5D46] via-[#165A46] to-[#D9B24A] p-[1.5px] shadow-xs group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img 
                src={aventoLogo} 
                alt="Avento Logo" 
                className="w-5 h-5 object-contain group-hover:rotate-6 transition-transform duration-300" 
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[20px] tracking-tight text-[#0F5D46] group-hover:text-[#0B4B3A] transition-colors leading-none font-sans">
              AVENTO
            </span>
            <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-[#D9B24A] leading-none mt-1">
              Smart Events
            </span>
          </div>
        </a>

        {/* ================= CENTER: NAVIGATION ================= */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((item) => {
            const isActive = activeTab === item.name
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.name === 'Home' && onBackToLanding) {
                    e.preventDefault()
                    onBackToLanding()
                  } else if (item.name === 'Dashboard' && onOpenDashboard) {
                    e.preventDefault()
                    onOpenDashboard('dashboard')
                  } else if (item.name === 'Events' && onOpenEvents) {
                    e.preventDefault()
                    onOpenEvents()
                  } else if (item.name === 'About' && onOpenAbout) {
                    e.preventDefault()
                    onOpenAbout()
                  } else if ((item.name === 'Features' || item.name === 'Contact') && activeTab !== 'Home') {
                    if (onBackToLanding) {
                      e.preventDefault()
                      onBackToLanding()
                      setTimeout(() => {
                        const el = document.querySelector(item.href)
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }
                  } else {
                    setLocalActiveTab(item.name)
                  }
                }}
                className={`relative py-1 text-[16px] font-semibold tracking-[-0.01em] transition-colors duration-200 group ${
                  isActive 
                    ? 'text-[#0B4B3A]' 
                    : 'text-[#0F5D46]/90 hover:text-[#0B4B3A]'
                }`}
              >
                <span>{item.name}</span>

                {/* Thin Luxury Gold Underline */}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#D9B24A] rounded-full transition-all duration-300 origin-left ${
                    isActive 
                      ? 'scale-x-100 opacity-100' 
                      : 'scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </a>
            )
          })}
        </nav>

        {/* ================= RIGHT: SEARCH + LOGIN + SIGN UP ================= */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search Icon */}
          <div className="relative">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2.5 rounded-full text-[#0F5D46] hover:text-[#0B4B3A] hover:bg-[#0F5D46]/8 transition-all duration-200 cursor-pointer"
              aria-label="Search events"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(15,93,70,0.12)] border border-[#0F5D46]/15 p-2.5 z-50">
                <div className="flex items-center gap-2 bg-[#FAF8F3] px-3 py-2 rounded-xl border border-gray-200/80">
                  <svg className="w-3.5 h-3.5 text-[#D9B24A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search hackathons, passes..." 
                    className="w-full text-xs bg-transparent focus:outline-none text-[#1F2937]"
                    autoFocus
                  />
                  <span className="text-[10px] text-gray-400 font-mono">ESC</span>
                </div>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3" ref={userMenuRef}>
              {/* Primary Profile Button (Directly opens profile / user details) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    else if (onOpenDashboard) onOpenDashboard('profile');
                  }}
                  className="pl-2 pr-3.5 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-[14px] font-bold text-white bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] hover:from-[#083629] hover:to-[#0B4B3A] rounded-full shadow-[0_6px_20px_rgba(15,93,70,0.28)] hover:shadow-[0_10px_28px_rgba(15,93,70,0.4)] hover:-translate-y-0.5 transition-all duration-250 flex items-center gap-2.5 group border border-[#0F5D46]/30 cursor-pointer"
                  title="Click to view Profile & User Details"
                  aria-label="User Profile"
                >
                  {/* User Avatar Circle */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white p-[1.5px] shadow-xs flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-full bg-[#FAF8F2] flex items-center justify-center font-extrabold text-xs sm:text-[13px] text-[#0F5D46]">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : '👤'}
                    </div>
                  </div>

                  {/* User Name & Profile Badge */}
                  <div className="flex flex-col items-start text-left leading-none">
                    <span className="font-extrabold text-white text-xs sm:text-[13.5px] truncate max-w-[120px] sm:max-w-[150px]">
                      {currentUser.fullName || 'My Profile'}
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-[#D9B24A] mt-0.5">
                      👤 {currentUser.role || 'User'} Profile
                    </span>
                  </div>

                  {/* Quick Dropdown Toggle Arrow */}
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className={`p-1 -mr-1 hover:bg-white/20 rounded-full text-[10px] text-[#D9B24A] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    title="Open options menu"
                  >
                    ▼
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_50px_rgba(15,93,70,0.18)] border border-[#0F5D46]/15 p-3 z-50 text-left animate-fade-in">
                    {/* User Card */}
                    <div 
                      onClick={() => {
                        setUserMenuOpen(false);
                        if (onOpenProfile) onOpenProfile();
                        else if (onOpenDashboard) onOpenDashboard('profile');
                      }}
                      className="p-3 bg-[#FAF8F2] hover:bg-[#EAF7F1] rounded-[18px] border border-[#0F5D46]/10 mb-2 cursor-pointer transition-colors"
                      title="Click to view full user profile & details"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F5D46] truncate">{currentUser.fullName}</span>
                        <span className="text-[9px] font-extrabold uppercase bg-[#0F5D46] text-white px-2 py-0.5 rounded-full">
                          {currentUser.role}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-[#5E6A68] truncate block mt-0.5">{currentUser.email}</span>
                      <span className="text-[9.5px] text-[#D9B24A] font-bold block mt-1">Tap to open Profile & Details →</span>
                    </div>

                    <div className="space-y-1 text-xs font-semibold">
                      {/* Direct View Profile Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (onOpenProfile) onOpenProfile();
                          else if (onOpenDashboard) onOpenDashboard('profile');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-[#EAF7F1] text-[#0F5D46] font-bold hover:bg-[#d8efe5] transition-colors cursor-pointer"
                      >
                        <span className="text-base">👤</span>
                        <div className="flex flex-col text-left leading-tight">
                          <span>Profile & User Details</span>
                          <span className="text-[10px] font-normal text-[#5E6A68]">Account details, credentials & stats</span>
                        </div>
                      </button>

                      {currentUser.role === 'STUDENT' && onOpenDashboard && (
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenDashboard('tickets');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#FAF8F2] hover:text-[#0F5D46] transition-colors cursor-pointer"
                        >
                          <span>🎟</span>
                          <span>My Passes & QR Tickets</span>
                        </button>
                      )}

                      {currentUser.role === 'ORGANIZER' && onOpenDashboard && (
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenDashboard('my-events');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-[#1F2937] hover:bg-[#FAF8F2] hover:text-[#0F5D46] transition-colors cursor-pointer"
                        >
                          <span>🏛</span>
                          <span>My Hosted Events</span>
                        </button>
                      )}

                      <div className="pt-2 mt-1 border-t border-[#0F5D46]/10">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (onLogout) onLogout();
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
          ) : (
            <button 
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth('login')
                } else {
                  setAuthMode('login')
                  setAuthModalOpen(true)
                }
              }}
              className="px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-[12px] font-bold tracking-tight text-white bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] hover:from-[#083629] hover:to-[#0B4B3A] rounded-full shadow-[0_2px_10px_rgba(15,93,70,0.2)] hover:shadow-[0_4px_14px_rgba(15,93,70,0.3)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 group border border-[#0F5D46]/30 cursor-pointer"
            >
              <span className="text-[11px]">👤</span>
              <span>Login / Sign Up</span>
              <span className="text-[#D9B24A] text-[11px] group-hover:translate-x-0.5 transition-transform duration-200 font-bold">→</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0F4C3A] hover:bg-[#0F4C3A]/5 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[74px] inset-x-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[rgba(200,155,60,0.2)] shadow-[0_20px_40px_rgba(15,76,58,0.12)] p-5 flex flex-col gap-2.5">
          {navLinks.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              onClick={(e) => {
                if (item.name === 'Home' && onBackToLanding) {
                  e.preventDefault()
                  onBackToLanding()
                } else if (item.name === 'Dashboard' && onOpenDashboard) {
                  e.preventDefault()
                  onOpenDashboard('dashboard')
                } else if (item.name === 'Events' && onOpenEvents) {
                  e.preventDefault()
                  onOpenEvents()
                } else if (item.name === 'About' && onOpenAbout) {
                  e.preventDefault()
                  onOpenAbout()
                } else if ((item.name === 'Features' || item.name === 'Contact') && activeTab !== 'Home') {
                  if (onBackToLanding) {
                    e.preventDefault()
                    onBackToLanding()
                    setTimeout(() => {
                      const el = document.querySelector(item.href)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }
                } else {
                  setLocalActiveTab(item.name)
                }
                setMobileMenuOpen(false)
              }}
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              className={`py-2 px-3 text-sm font-semibold tracking-[0.3px] transition-colors border-b border-gray-100 ${
                activeTab === item.name 
                  ? 'text-[#0A3629] font-bold' 
                  : 'text-[#0F4C3A]'
              }`}
            >
              {item.name}
            </a>
          ))}
          {currentUser ? (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#0F5D46]">{currentUser.fullName}</span>
                <span className="text-[10px] font-extrabold uppercase bg-[#D9B24A]/15 text-[#8C6F1E] border border-[#D9B24A]/30 px-2.5 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile()
                    else if (onOpenDashboard) onOpenDashboard('profile')
                    setMobileMenuOpen(false)
                  }}
                  className="flex-1 py-2.5 text-xs font-bold text-[#0F5D46] bg-white border border-[#0F5D46]/25 rounded-xl shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>👤</span>
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => {
                    if (onLogout) onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex-1 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🚪</span>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button 
                onClick={() => {
                  if (onOpenAuth) {
                    onOpenAuth('login')
                  } else {
                    setAuthMode('login')
                    setAuthModalOpen(true)
                  }
                  setMobileMenuOpen(false)
                }}
                className="w-full py-2 px-3 text-[12px] font-bold tracking-wide rounded-xl text-white bg-gradient-to-r from-[#0F4C3A] via-[#14634d] to-[#0F4C3A] hover:from-[#14634d] hover:to-[#0B3A2C] border border-[#D9B24A]/40 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="text-[11px]">👤</span>
                <span>Login / Sign Up</span>
                <span className="text-[#D9B24A] text-[11px]">→</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Optional fallback only if onOpenAuth is not supplied */}
      {!onOpenAuth && (
        <PremiumAuth 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
      )}
    </header>
  )
}
