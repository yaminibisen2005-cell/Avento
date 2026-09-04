import React, { useState, useEffect } from 'react'
import aventoLogo from '../assets/logo.png'
import PremiumAuth from './PremiumAuth'

export default function Navbar({ onOpenAuth, isSplashing = false, currentUser = null, onLogout, onOpenDashboard, onOpenEvents, onOpenAbout, onBackToLanding, activeTab: propActiveTab }) {
  const [localActiveTab, setLocalActiveTab] = useState('Home')
  const activeTab = propActiveTab || localActiveTab
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isScrolled, setIsScrolled] = useState(false)

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Events', href: '#events' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#about' },
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

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ease-out px-6 sm:px-10 lg:px-16 ${
        isSplashing || !isScrolled
          ? 'h-[86px] sm:h-[90px] bg-transparent border-b border-transparent shadow-none'
          : 'h-[76px] bg-white/85 backdrop-blur-xl border-b border-[#0F5D46]/10 shadow-[0_8px_30px_rgba(15,93,70,0.06)]'
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
            <span className="font-extrabold text-[21px] tracking-tight text-[#0F5D46] group-hover:text-[#0B4B3A] transition-colors leading-none font-sans">
              AVENTO
            </span>
            <span className="text-[9px] tracking-widest uppercase font-mono font-bold text-[#D9B24A] leading-none mt-1">
              Smart Events
            </span>
          </div>
        </a>

        {/* ================= CENTER: NAVIGATION (16PX, 600 WEIGHT) ================= */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-11">
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
                  } else if (item.name === 'Events' && onOpenEvents) {
                    e.preventDefault()
                    onOpenEvents()
                  } else if (item.name === 'About' && onOpenAbout) {
                    e.preventDefault()
                    onOpenAbout()
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
            <div className="flex items-center gap-2.5 sm:gap-3">
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-[13.5px] font-bold text-[#0F5D46] bg-[#EAF7F1] hover:bg-[#d4ede1] border border-[#0F5D46]/25 rounded-full transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </button>
              )}
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-[#0F5D46] leading-tight">{currentUser.fullName}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D9B24A] bg-[#D9B24A]/10 px-2 py-0.5 rounded-full border border-[#D9B24A]/30 mt-0.5">
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-[13px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-full transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              {/* Login Button */}
              <button 
                onClick={() => {
                  if (onOpenAuth) {
                    onOpenAuth('login')
                  } else {
                    setAuthMode('login')
                    setAuthModalOpen(true)
                  }
                }}
                className="hidden sm:inline-flex px-5 py-2.5 text-[15px] font-semibold tracking-[-0.01em] text-[#0F5D46] bg-white/80 hover:bg-white border border-[#0F5D46]/20 rounded-full shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
              >
                Log In
              </button>

              {/* Sign Up Button */}
              <button 
                onClick={() => {
                  if (onOpenAuth) {
                    onOpenAuth('signup')
                  } else {
                    setAuthMode('signup')
                    setAuthModalOpen(true)
                  }
                }}
                className="px-6 py-2.5 text-[15px] font-bold tracking-[-0.01em] text-white bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] hover:from-[#083629] hover:to-[#0B4B3A] rounded-full shadow-[0_6px_20px_rgba(15,93,70,0.28)] hover:shadow-[0_10px_28px_rgba(15,93,70,0.4)] hover:-translate-y-0.5 transition-all duration-250 flex items-center gap-1.5 group border border-[#0F5D46]/30 cursor-pointer"
              >
                <span>Sign Up</span>
                <span className="text-[#D9B24A] group-hover:translate-x-1 transition-transform duration-200 font-bold">→</span>
              </button>
            </>
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
        <div className="md:hidden absolute top-[88px] inset-x-4 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[rgba(200,155,60,0.2)] shadow-[0_20px_40px_rgba(15,76,58,0.12)] p-6 flex flex-col gap-3">
          {navLinks.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              onClick={(e) => {
                if (item.name === 'Home' && onBackToLanding) {
                  e.preventDefault()
                  onBackToLanding()
                } else if (item.name === 'Events' && onOpenEvents) {
                  e.preventDefault()
                  onOpenEvents()
                } else if (item.name === 'About' && onOpenAbout) {
                  e.preventDefault()
                  onOpenAbout()
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
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#0F5D46]">{currentUser.fullName}</span>
                <span className="text-[10px] font-extrabold uppercase bg-[#D9B24A]/15 text-[#8C6F1E] border border-[#D9B24A]/30 px-2.5 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                {onOpenDashboard && (
                  <button 
                    onClick={() => {
                      onOpenDashboard()
                      setMobileMenuOpen(false)
                    }}
                    className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0F5D46] hover:bg-[#126B51] rounded-full shadow-xs cursor-pointer"
                  >
                    📊 Open Dashboard
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (onLogout) onLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 flex gap-3">
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
                className="flex-1 py-2.5 text-xs font-semibold text-[#0F4C3A] border border-[#0F4C3A]/30 rounded-full hover:bg-[#F7E8C2]/60"
              >
                Log In
              </button>
              <button 
                onClick={() => {
                  if (onOpenAuth) {
                    onOpenAuth('signup')
                  } else {
                    setAuthMode('signup')
                    setAuthModalOpen(true)
                  }
                  setMobileMenuOpen(false)
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0F4C3A] rounded-full shadow-sm"
              >
                Sign Up
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
