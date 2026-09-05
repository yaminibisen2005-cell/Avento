import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import SplashScreen from './components/SplashScreen'
import HeroSection from './components/HeroSection'
import EventCategoriesSection from './components/EventCategoriesSection'
import Authentication from './components/Authentication'
import StudentDashboard from './components/dashboard/StudentDashboard'
import OrganizerDashboard from './components/organizer/OrganizerDashboard'
import AdminDashboard from './components/admin/AdminDashboard'
import EventListingPage from './components/explore/EventListingPage'
import AboutPage from './components/about/AboutPage'
import Footer from './components/Footer'
import { useAuth } from './context/AuthContext'
import { authStorage } from './services/api'

export default function App() {
  const { user: authUser, logout } = useAuth()

  // Page view state: 'landing' or 'auth' or 'dashboard' or 'events' or 'about'
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const hash = window.location.hash
      if (pathname === '/events' || hash === '#events') {
        return 'events'
      }
      if (pathname === '/about' || hash === '#about') {
        return 'about'
      }
      if (pathname === '/dashboard' || hash.startsWith('#dashboard') || hash === '#profile') {
        return 'dashboard'
      }
      if (pathname === '/login' || hash === '#login' || pathname === '/signup' || hash === '#signup') {
        return 'auth'
      }
    }
    return 'landing'
  })

  // Splash screen appears on first visit of browser session
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return !sessionStorage.getItem('avento_splash_shown')
    } catch {
      return true
    }
  })
  const [authInitialLogin, setAuthInitialLogin] = useState(true)
  const [currentUser, setCurrentUser] = useState(() => authStorage.getUser())
  const [dashboardTab, setDashboardTab] = useState(() => {
    try {
      return sessionStorage.getItem('avento_dashboard_tab') || 'dashboard'
    } catch {
      return 'dashboard'
    }
  })

  const handleOpenProfile = () => {
    setDashboardTab('profile')
    try { sessionStorage.setItem('avento_dashboard_tab', 'profile') } catch {}
    if (window.history) window.history.pushState({}, '', '/dashboard#profile')
    setView('dashboard')
  }

  const handleOpenDashboard = (tab = 'dashboard') => {
    setDashboardTab(tab)
    try { sessionStorage.setItem('avento_dashboard_tab', tab) } catch {}
    if (window.history) window.history.pushState({}, '', `/dashboard#${tab}`)
    setView('dashboard')
  }

  const handleBackToLanding = () => {
    if (window.history) {
      window.history.pushState({}, '', '/')
    }
    setView('landing')
  }

  const handleOpenEvents = () => {
    if (window.history) {
      window.history.pushState({}, '', '/events')
    }
    setView('events')
  }

  const handleOpenAbout = () => {
    if (window.history) {
      window.history.pushState({}, '', '/about')
    }
    setView('about')
  }

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialLogin(mode === 'login')
    if (window.history) {
      window.history.pushState({}, '', mode === 'signup' ? '/signup' : '/login')
    }
    setView('auth')
  }

  const handleLogout = useCallback((target = 'landing') => {
    logout()
    setCurrentUser(null)
    if (window.history) {
      window.history.pushState({}, '', target === 'login' ? '/login' : '/')
    }
    if (target === 'login') {
      setAuthInitialLogin(true)
      setView('auth')
    } else {
      setView('landing')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [logout])

  // Keep currentUser synchronized with AuthContext state
  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser)
    } else if (authStorage.isSessionExpired()) {
      setCurrentUser(null)
    } else {
      setCurrentUser(authStorage.getUser())
    }
  }, [authUser])

  // Handle automatic session expiration and unauthorized 401 events
  useEffect(() => {
    const handleSessionExpired = () => {
      handleLogout('landing')
    }
    window.addEventListener('avento_session_expired', handleSessionExpired)
    window.addEventListener('avento_auth_unauthorized', handleSessionExpired)
    return () => {
      window.removeEventListener('avento_session_expired', handleSessionExpired)
      window.removeEventListener('avento_auth_unauthorized', handleSessionExpired)
    }
  }, [handleLogout])

  // Display Splash Screen for full animation on first launch only
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false)
        try {
          sessionStorage.setItem('avento_splash_shown', 'true')
        } catch {}
      }, 5500)
      return () => clearTimeout(timer)
    }
  }, [showSplash])

  // Listen for browser URL /events, /about, /dashboard, /login, /signup or hash navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname
      const hash = window.location.hash

      if (pathname === '/events' || hash === '#events') {
        setView('events')
      } else if (pathname === '/about' || hash === '#about') {
        setView('about')
      } else if (pathname === '/dashboard' || hash.startsWith('#dashboard') || hash === '#profile') {
        if (hash === '#profile') {
          setDashboardTab('profile')
        } else if (hash.includes('#')) {
          const tab = hash.replace('#dashboard', '').replace('#', '')
          if (tab) setDashboardTab(tab)
        }
        setView('dashboard')
      } else if (pathname === '/login' || hash === '#login') {
        setAuthInitialLogin(true)
        setView('auth')
      } else if (pathname === '/signup' || hash === '#signup') {
        setAuthInitialLogin(false)
        setView('auth')
      } else if (pathname === '/' && (!hash || hash === '#home')) {
        setView('landing')
      }
    }
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  // State for interactive countdown and FAQ
  const [faqOpen, setFaqOpen] = useState(null)
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 22, seconds: 59 })

  // Timer countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  // Steps data
  const steps = [
    { number: '01', title: 'Register', desc: 'Choose your event and enter participant details in under 60 seconds.' },
    { number: '02', title: 'Secure Payment', desc: 'Complete payments via bank-grade encrypted Razorpay gateway.' },
    { number: '03', title: 'QR Attendance', desc: 'Scan instant entry QR badge at the reception desk in 0.3 seconds.' },
    { number: '04', title: 'Smart Certificate', desc: 'Automated blockchain-verified credential delivered instantly to your inbox.' }
  ]

  // Features data
  const features = [
    {
      title: 'Frictionless Registration',
      desc: 'Smart custom forms, instant ticket tiers, and spot registration options for event organizers.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Real-Time Headcount Management',
      desc: 'Live dashboard to filter, segment, export, and notify registered attendees in one click.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: '0.3s QR Attendance Scanning',
      desc: 'Zero special hardware needed. Volunteers use mobile cameras for instantaneous check-ins.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      title: 'Automated Certificate Delivery',
      desc: 'Dynamic template builder, smart coordinate mapping, and single-click mass PDF dispatch.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Bank-Grade Payment Escrow',
      desc: 'Direct integration with Razorpay supporting UPI, Credit Cards, NetBanking, and Instant Payouts.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      title: 'Deep Analytics & CSV Exports',
      desc: 'Track turnout curves, revenue velocity, ticket conversions, and audit-ready data reports.',
      icon: (
        <svg className="w-5 h-5 text-[#0F4C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  // Testimonials
  const testimonials = [
    {
      name: 'Aarav Patel',
      college: 'Delhi Technological University (DTU)',
      stars: 5,
      review: 'Avento eliminated our 2-hour queue at the tech fest. Attendees scanned their QR badges in less than a second. It feels like software built by Apple.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
    },
    {
      name: 'Sneha Kulkarni',
      college: 'RV College of Engineering',
      stars: 5,
      review: 'I used Avento to register for the national Web3 hackathon. Seamless Razorpay payment, direct calendar invites, and instant certificates. A beautiful experience.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80'
    },
    {
      name: 'Dr. S. Mukhopadhyay',
      college: 'IIT Kharagpur Event Coordinator',
      stars: 5,
      review: 'From an administrative standpoint, Avento is a lifesaver. Participant reports, automated emails, and certificate verification in one place. Truly professional software.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'
    }
  ]

  // FAQs
  const faqs = [
    { q: 'Is Avento free to use for student hackathons?', a: 'Yes! Avento is 100% free for non-commercial student club events and hackathons. For paid events, we charge a minimal transactional platform fee per ticket registration.' },
    { q: 'How does automated certificate generation work?', a: 'Organizers upload a certificate background, map dynamic placeholder coordinates (e.g. name, event, rank), and Avento automatically emails verifiable PDF credentials to attendees upon completed QR scan.' },
    { q: 'Can we integrate custom payment gateways?', a: 'Avento provides native, bank-grade Razorpay checkout supporting UPI, Cards, NetBanking, and Wallets. Funds settle directly into your verified organization bank account.' },
  ]

  if (!showSplash && view === 'events') {
    return (
      <EventListingPage
        currentUser={currentUser}
        onBackToLanding={handleBackToLanding}
        onOpenAbout={handleOpenAbout}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={handleOpenDashboard}
        onOpenProfile={handleOpenProfile}
        onLogout={() => handleLogout('landing')}
      />
    )
  }

  if (!showSplash && view === 'about') {
    return (
      <AboutPage
        currentUser={currentUser}
        onBackToLanding={handleBackToLanding}
        onOpenEvents={handleOpenEvents}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={handleOpenDashboard}
        onOpenProfile={handleOpenProfile}
        onLogout={() => handleLogout('landing')}
      />
    )
  }

  if (!showSplash && view === 'auth') {
    return (
      <div className="w-full h-screen h-[100dvh] overflow-hidden relative">
        <Authentication 
          initialIsLogin={authInitialLogin}
          onBackToLanding={handleBackToLanding}
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            if (user?.role === 'ORGANIZER' || user?.role === 'ADMIN') {
              handleOpenDashboard('dashboard')
            } else {
              handleBackToLanding()
            }
          }}
        />
      </div>
    )
  }

  if (!showSplash && view === 'dashboard') {
    if (currentUser?.blocked) {
      return (
        <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-6 text-center select-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-red-200 shadow-2xl space-y-4 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-3xl">
              🚫
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900">Account Access Suspended</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your AVENTO account has been blocked by an administrator. Please contact university platform coordinators to resolve access.
            </p>
            <button
              type="button"
              onClick={() => handleLogout('landing')}
              className="w-full py-2.5 rounded-[12px] bg-gray-900 hover:bg-black text-white font-semibold text-xs cursor-pointer transition-all shadow-xs"
            >
              Sign Out & Return Home
            </button>
          </motion.div>
        </div>
      )
    }

    if (currentUser && currentUser.approved === false && currentUser.role !== 'ORGANIZER') {
      return (
        <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-6 select-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-[28px] bg-white/85 backdrop-blur-xl border border-[#0F5D46]/20 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#0F5D46]/10 flex items-center justify-center text-lg">
                ⏳
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">Waiting for Admin Approval</h3>
                <p className="text-[11px] text-gray-500">Organizer Verification in Progress</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Welcome, <strong className="text-[#0F5D46]">{currentUser.name || currentUser.fullName || currentUser.email}</strong>. Your university organizer credentials have been submitted for institutional verification. You will receive access after approval.
            </p>
            <div className="p-3 rounded-xl bg-[#0F5D46]/5 border border-[#0F5D46]/10 text-[11.5px] text-[#0F5D46] flex items-center justify-between">
              <span>Status:</span>
              <span className="font-bold uppercase tracking-wider bg-[#0F5D46]/10 px-2 py-0.5 rounded-md text-[10.5px]">Pending Review</span>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 rounded-[12px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
              >
                Check Status
              </button>
              <button
                type="button"
                onClick={() => handleLogout('landing')}
                className="flex-1 py-2.5 rounded-[12px] bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-all"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    if (currentUser?.role === 'ADMIN') {
      return (
        <AdminDashboard
          user={currentUser}
          initialTab={dashboardTab}
          onLogout={() => handleLogout('landing')}
          onBackToLanding={handleBackToLanding}
        />
      )
    }

    if (currentUser?.role === 'ORGANIZER') {
      return (
        <OrganizerDashboard
          user={currentUser}
          initialTab={dashboardTab}
          onLogout={() => handleLogout('landing')}
          onBackToLanding={handleBackToLanding}
        />
      )
    }

    return (
      <StudentDashboard
        user={currentUser}
        initialTab={dashboardTab}
        onLogout={() => handleLogout('landing')}
        onBackToLanding={handleBackToLanding}
      />
    )
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="avento-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] w-full h-full bg-[#FAF8F2]"
        >
          <SplashScreen />
        </motion.div>
      ) : (
        <motion.div
          key="avento-main-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF8F2] text-[#1F2937] font-sans antialiased selection:bg-[#C89B3C]/25 selection:text-[#0F4C3A] relative"
        >
          {/* ==================== 1. FLOATING GLASS NAVBAR ==================== */}
          <Navbar 
            onOpenAuth={handleOpenAuth} 
            isSplashing={false}
            currentUser={currentUser}
            onOpenDashboard={handleOpenDashboard}
            onOpenProfile={handleOpenProfile}
            onBackToLanding={handleBackToLanding}
            onOpenEvents={handleOpenEvents}
            onOpenAbout={handleOpenAbout}
            onLogout={() => handleLogout('landing')}
          />

          {/* ==================== 2. MAIN HERO SECTION ==================== */}
          <HeroSection 
            currentUser={currentUser}
            onOpenProfile={handleOpenProfile}
            onOpenEvents={handleOpenEvents}
            onOpenAuth={handleOpenAuth}
          />

          {/* ==================== 3. EVENT CATEGORIES (PRIMARY SHOWCASE) ==================== */}
          <EventCategoriesSection onCategoryClick={handleOpenEvents} />

      {/* ==================== 6. HOW IT WORKS ==================== */}
      <section className="py-12 sm:py-14 max-w-7xl mx-auto px-6 relative">
        <div className="mb-10 sm:mb-12 text-center">
          <span className="text-[11px] font-extrabold text-[#C89B3C] tracking-widest uppercase bg-[#C89B3C]/15 px-3.5 py-1.5 rounded-full border border-[#C89B3C]/30">
            Frictionless Flow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-[#0F4C3A] tracking-tight">
            How AVENTO Works
          </h2>
          <p className="text-[#1F2937]/70 text-sm sm:text-base mt-2">
            The modern standard for digital authentication, attendance verification, and credentials.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Glowing Timeline Connector Line */}
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#0F4C3A] via-[#C89B3C] to-[#0F4C3A] -translate-y-1/2 opacity-70"></div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((st, i) => (
              <div key={i} className="glass-card-premium p-6 flex flex-col items-center text-center group transition-all duration-300">
                {/* Step Badge */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F4C3A] to-[#0A3629] text-[#C89B3C] flex items-center justify-center shadow-md font-display font-bold text-lg mb-5 border border-[#C89B3C]/30 group-hover:scale-110 transition-transform duration-300">
                  {st.number}
                </div>

                <h3 className="font-display font-bold text-lg text-[#0F4C3A] mb-2">
                  {st.title}
                </h3>
                <p className="text-[#1F2937]/75 text-xs sm:text-sm leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. WHY CHOOSE AVENTO / BENTO FEATURES ==================== */}
      <section id="about" className="py-12 sm:py-14 max-w-7xl mx-auto px-6 relative">
        <div className="mb-10 sm:mb-12 text-center">
          <span className="text-[11px] font-extrabold text-[#0F4C3A] tracking-widest uppercase bg-[#0F4C3A]/10 px-3.5 py-1.5 rounded-full border border-[#0F4C3A]/15">
            Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-[#0F4C3A] tracking-tight">
            Built for Modern Event Teams
          </h2>
          <p className="text-[#1F2937]/70 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Everything you need to host flawless tech summits, hackathons, and symposiums without spreadsheets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="glass-card-premium p-8 flex flex-col items-start text-left group transition-all duration-300"
            >
              <div className="p-3.5 bg-[#0F4C3A]/10 border border-[#0F4C3A]/15 rounded-2xl mb-5 group-hover:bg-[#0F4C3A] transition-colors duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                  {feat.icon}
                </div>
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F4C3A] mb-2.5">
                {feat.title}
              </h3>
              <p className="text-[#1F2937]/75 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 8. LIVE SPOTLIGHT EVENT ==================== */}
      <section className="py-10 sm:py-12 max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#0F4C3A] via-[#0B382B] to-[#062018] rounded-[32px] text-white p-8 md:p-12 shadow-[0_30px_70px_rgba(15,76,58,0.25)] relative overflow-hidden text-left flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/15">
          
          {/* Subtle Ambient Gold Glow inside Container */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col gap-4 relative z-10 max-w-xl">
            <span className="w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#C89B3C] bg-white/10 border border-[#C89B3C]/30 tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C] animate-ping"></span>
              Live Spotlight Event
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
              AI Innovation Hackathon 2026
            </h2>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              Join top engineers and student founders across the country. Powered by Avento for instant 0.3s check-in, real-time escrow prize delivery, and blockchain certificates.
            </p>

            {/* Registration Capacity Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between items-center text-xs font-semibold text-white/80 mb-2">
                <span>432 Registered</span>
                <span className="text-[#C89B3C]">500 Capacity Cap (86.4%)</span>
              </div>
              <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#C89B3C] to-[#F6E6BF] h-full rounded-full transition-all duration-1000" style={{ width: '86.4%' }}></div>
              </div>
            </div>
          </div>

          {/* Countdown & CTA Box */}
          <div className="flex flex-col items-center gap-5 relative z-10 w-full lg:w-auto shrink-0 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <div className="text-center">
              <div className="text-[11px] uppercase font-extrabold tracking-wider text-[#C89B3C] mb-3">
                Registration Closes In
              </div>
              
              {/* Countdown Digits */}
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-center">
                  <div className="bg-black/30 border border-white/10 w-14 h-12 flex items-center justify-center text-xl font-bold rounded-lg text-white font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-white/60 mt-1 uppercase font-semibold">Days</span>
                </div>
                <span className="text-xl font-bold -mt-4 text-[#C89B3C]">:</span>
                <div className="flex flex-col items-center">
                  <div className="bg-black/30 border border-white/10 w-14 h-12 flex items-center justify-center text-xl font-bold rounded-lg text-white font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-white/60 mt-1 uppercase font-semibold">Hours</span>
                </div>
                <span className="text-xl font-bold -mt-4 text-[#C89B3C]">:</span>
                <div className="flex flex-col items-center">
                  <div className="bg-black/30 border border-white/10 w-14 h-12 flex items-center justify-center text-xl font-bold rounded-lg text-white font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[10px] text-white/60 mt-1 uppercase font-semibold">Mins</span>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleOpenEvents}
              className="w-full py-3.5 bg-[#C89B3C] hover:bg-[#B3872E] text-[#0F4C3A] font-extrabold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              Claim Hackathon Ticket
            </button>
          </div>

        </div>
      </section>

      {/* ==================== 9. TESTIMONIALS ==================== */}
      <section className="py-12 sm:py-14 max-w-7xl mx-auto px-6 text-center relative">
        <div className="mb-10 sm:mb-12">
          <span className="text-[11px] font-extrabold text-[#C89B3C] tracking-widest uppercase bg-[#C89B3C]/15 px-3.5 py-1.5 rounded-full border border-[#C89B3C]/30">
            Validated by Community
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-[#0F4C3A] tracking-tight">
            What Organizers & Attendees Say
          </h2>
          <p className="text-[#1F2937]/70 text-sm sm:text-base mt-2">
            Trusted by universities, student club leads, and conference directors across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="glass-card-premium p-7 text-left flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                {/* Gold Stars */}
                <div className="flex gap-1 mb-4 text-[#C89B3C]">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>
                <p className="text-[#1F2937]/80 text-sm leading-relaxed italic mb-6">
                  "{t.review}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3.5 border-t border-[#0F4C3A]/10 pt-4">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-11 h-11 rounded-full object-cover border border-[#0F4C3A]/20 shadow-xs" 
                />
                <div className="text-left">
                  <div className="font-bold text-sm text-[#0F4C3A]">{t.name}</div>
                  <div className="text-[11px] text-[#1F2937]/60 font-medium truncate max-w-[200px]">
                    {t.college}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 10. FAQ ACCORDION ==================== */}
      <section className="py-12 sm:py-14 max-w-3xl mx-auto px-6 text-center relative">
        <div className="mb-8 sm:mb-10">
          <span className="text-[11px] font-extrabold text-[#0F4C3A] tracking-widest uppercase bg-[#0F4C3A]/10 px-3.5 py-1.5 rounded-full border border-[#0F4C3A]/15">
            Clear Answers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 text-[#0F4C3A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#1F2937]/70 text-sm sm:text-base mt-2">
            Everything you need to know about setting up events on AVENTO.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx
            return (
              <div 
                key={idx} 
                className="glass-card-premium overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-bold text-sm sm:text-base text-[#0F4C3A] hover:text-[#0A3629] transition-colors duration-200 focus:outline-none"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className={`transform transition-transform duration-300 font-mono text-sm ${isOpen ? 'rotate-180 text-[#C89B3C]' : 'text-gray-400'}`}>
                    ▼
                  </span>
                </button>

                {/* Answer Block */}
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 border-t border-[#0F4C3A]/10' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <p className="px-6 py-5 text-sm text-[#1F2937]/80 leading-relaxed bg-white/40">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ==================== 11. REDESIGNED LUXURY FOOTER ==================== */}
      <Footer
        onBackToLanding={handleBackToLanding}
        onOpenEvents={handleOpenEvents}
        onOpenAbout={handleOpenAbout}
        onOpenAuth={handleOpenAuth}
        showCta={true}
      />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

