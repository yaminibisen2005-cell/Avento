import React, { useState, useEffect } from 'react'
import aventoLogo from '../assets/logo.png'

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  // isFlipped: false = Login (Front Face), true = Signup (Back Face)
  const [isFlipped, setIsFlipped] = useState(initialMode === 'signup')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  // Sync mode when opened or toggled
  useEffect(() => {
    setIsFlipped(initialMode === 'signup')
  }, [initialMode, isOpen])

  // ESC key listener to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Mouse parallax on container
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 16
    const y = (clientY / window.innerHeight - 0.5) * 16
    setMouseOffset({ x, y })
  }

  if (!isOpen) return null

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 lg:p-10 animate-in fade-in duration-300"
    >
      {/* ================= BACKGROUND ATMOSPHERE (HERO THEME) ================= */}
      
      {/* 1. Subtle Dotted Matrix Pattern */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" 
        aria-hidden="true"
      ></div>

      {/* 2. Giant 'A' Logo Watermark (7% Opacity) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none -z-20 flex items-center justify-center animate-watermark"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#0F4C3A]" fill="none">
          <defs>
            <linearGradient id="authWatermark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F4C3A" stopOpacity="0.07" />
              <stop offset="50%" stopColor="#C89B3C" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#0F4C3A" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path 
            d="M 200,35 L 345,345 L 265,345 L 228,265 L 172,265 L 135,345 L 55,345 Z M 200,135 L 182,215 L 218,215 Z" 
            fill="url(#authWatermark)"
            stroke="rgba(200, 155, 60, 0.1)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* 3. Large Emerald & Warm Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#0F4C3A]/12 blur-[130px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C89B3C]/18 blur-[110px] pointer-events-none -z-10 animate-pulse-glow [animation-delay:2s]"></div>

      {/* 4. Golden Metallic Spheres & 3D Crystals */}
      <div 
        className="hidden lg:block absolute top-16 left-[10%] w-10 h-10 rounded-full pointer-events-none -z-10 animate-diamond-float"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFF6DE 0%, #E8BD65 35%, #C89B3C 65%, #7A5714 100%)',
          boxShadow: '0 10px 24px rgba(122, 87, 20, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.9)'
        }}
      ></div>
      <div 
        className="hidden lg:block absolute bottom-20 left-[40%] w-6 h-6 rounded-full pointer-events-none -z-10 animate-particle-2"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFF8E7 0%, #E2B755 40%, #C89B3C 70%, #855F16 100%)',
          boxShadow: '0 8px 16px rgba(133, 95, 22, 0.2)'
        }}
      ></div>

      {/* Close Button '✕' */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#0F4C3A] border border-[#0F4C3A]/15 shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 group"
        aria-label="Close authentication"
      >
        <span className="text-xl leading-none font-medium group-hover:rotate-90 transition-transform duration-300">✕</span>
      </button>

      {/* ================= MAIN CONTAINER: 55% LEFT / 45% RIGHT ================= */}
      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center z-20 my-auto">
        
        {/* ================= LEFT PANEL (55%): BRAND STORY & FEATURE CARDS ================= */}
        <div className="lg:col-span-6 xl:col-span-6 hidden lg:flex flex-col gap-8 text-left pr-4">
          
          {/* Brand Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F4C3A] via-[#165A46] to-[#C89B3C] p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={aventoLogo} alt="Avento Logo" className="w-5 h-5 object-contain" />
              </div>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#0F4C3A]">
              AVENTO
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#C89B3C] px-2.5 py-0.5 rounded-full bg-[#C89B3C]/10 border border-[#C89B3C]/20">
              Auth Suite
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-[#0F4C3A] leading-[1] tracking-tight">
              Smart Events.<br />
              <span className="bg-gradient-to-r from-[#C89B3C] via-[#E6BA5E] to-[#B3872E] bg-clip-text text-transparent">
                Simplified.
              </span>
            </h2>
          </div>

          {/* Paragraph */}
          <p className="text-[#1E293B]/75 text-base leading-relaxed max-w-lg">
            The all-in-one digital operating system for university hackathons, conferences, and student symposiums. Experience bank-grade ticketing, automated blockchain certificates, and 0.3s QR attendance.
          </p>

          {/* 3 Floating Glass Feature Cards */}
          <div className="flex flex-col gap-3.5 pt-2">
            
            {/* Feature 1: QR Attendance */}
            <div 
              className="p-3.5 rounded-[20px] bg-white border border-[#0F4C3A]/15 shadow-[0_12px_28px_-8px_rgba(15,76,58,0.08)] flex items-center gap-3.5 transition-transform duration-300 hover:translate-x-1"
              style={{ transform: `translateX(${mouseOffset.x * 0.5}px)` }}
            >
              <div className="w-11 h-11 rounded-[14px] bg-[#0F4C3A]/10 border border-[#0F4C3A]/20 flex items-center justify-center text-xl shrink-0">
                🎫
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#0F4C3A]">QR Attendance</div>
                <div className="text-xs text-[#1E293B]/60 font-medium">Instant 0.3s check-in via any smartphone camera</div>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            </div>

            {/* Feature 2: AI Certificates */}
            <div 
              className="p-3.5 rounded-[20px] bg-white border border-[#0F4C3A]/15 shadow-[0_12px_28px_-8px_rgba(15,76,58,0.08)] flex items-center gap-3.5 transition-transform duration-300 hover:translate-x-1"
              style={{ transform: `translateX(${mouseOffset.x * -0.5}px)` }}
            >
              <div className="w-11 h-11 rounded-[14px] bg-[#C89B3C]/15 border border-[#C89B3C]/30 flex items-center justify-center text-xl shrink-0">
                📜
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#0F4C3A]">AI Certificates</div>
                <div className="text-xs text-[#1E293B]/60 font-medium">Blockchain verified & automatically delivered to inbox</div>
              </div>
              <span className="ml-auto text-[10px] font-mono font-bold text-[#C89B3C] bg-[#C89B3C]/10 px-2 py-0.5 rounded-full">AUTO</span>
            </div>

            {/* Feature 3: Secure Payments */}
            <div 
              className="p-3.5 rounded-[20px] bg-white border border-[#0F4C3A]/15 shadow-[0_12px_28px_-8px_rgba(15,76,58,0.08)] flex items-center gap-3.5 transition-transform duration-300 hover:translate-x-1"
              style={{ transform: `translateX(${mouseOffset.x * 0.3}px)` }}
            >
              <div className="w-11 h-11 rounded-[14px] bg-[#0F4C3A]/10 border border-[#0F4C3A]/20 flex items-center justify-center text-xl shrink-0">
                💳
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-[#0F4C3A]">Secure Payments</div>
                <div className="text-xs text-[#1E293B]/60 font-medium">Razorpay bank-grade escrow protection & instant payouts</div>
              </div>
              <span className="ml-auto text-[10px] font-bold text-[#10B981]">100% SECURE</span>
            </div>

          </div>

          {/* Social Proof Footer */}
          <div className="pt-2 flex items-center gap-3 text-xs text-[#0F4C3A]/80 font-semibold">
            <span className="flex -space-x-1.5 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#0F4C3A] text-white text-[9px] font-bold flex items-center justify-center">AR</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#C89B3C] text-white text-[9px] font-bold flex items-center justify-center">SN</span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#1B634E] text-white text-[9px] font-bold flex items-center justify-center">VK</span>
            </span>
            <span>Joined by 20,000+ students from 200+ colleges nationwide</span>
          </div>

        </div>

        {/* ================= RIGHT PANEL (45%): 3D FLIP AUTHENTICATION CARD ================= */}
        <div className="lg:col-span-6 xl:col-span-6 w-full max-w-lg mx-auto auth-perspective">
          
          {/* Inner 3D Flippable Container */}
          <div 
            className="relative w-full preserve-3d auth-flip-transition"
            style={{
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: 'auto'
            }}
          >

            {/* ======================================================== */}
            {/* FRONT FACE: LOGIN FORM                                   */}
            {/* ======================================================== */}
            <div 
              className="w-full max-h-[88vh] overflow-y-auto custom-scrollbar rounded-[24px] sm:rounded-[28px] bg-white border border-[#0F4C3A]/15 p-4 sm:p-8 shadow-2xl flex flex-col justify-between relative"
              style={{
                display: isFlipped ? 'none' : 'flex' // Clean accessibility & pointer-events guarantee
              }}
            >
              {/* Glass Reflection Sheen */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="text-left mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={aventoLogo} alt="Avento Logo" className="w-6 h-6 object-contain" />
                    <span className="font-display font-extrabold text-lg text-[#0F4C3A] tracking-tight">AVENTO</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#C89B3C] bg-[#C89B3C]/10 border border-[#C89B3C]/20 px-2.5 py-0.5 rounded-full">
                    Member Access
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#0F4C3A] tracking-tight">
                  Welcome Back
                </h3>
                <p className="text-xs text-[#1E293B]/60 font-medium mt-1">
                  Enter your credentials to manage registrations and events
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
                
                {/* Email Field with Luxury Floating Styling */}
                <div className="relative group">
                  <label className="block text-[11px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="student@university.edu"
                      required
                      className="w-full px-4 py-3 pl-11 rounded-[18px] bg-white/70 border border-gray-200/80 text-xs sm:text-sm text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/15 focus:bg-white transition-all shadow-xs"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F4C3A] transition-colors">
                      ✉
                    </span>
                  </div>
                </div>

                {/* Password Field with Show/Hide Eye Toggle */}
                <div className="relative group">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-bold text-[#0F4C3A] uppercase tracking-wider">
                      Password
                    </label>
                    <a href="#forgot" className="text-[11px] font-bold text-[#C89B3C] hover:text-[#9A7224] transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input 
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      required
                      className="w-full px-4 py-3 pl-11 pr-11 rounded-[18px] bg-white/70 border border-gray-200/80 text-xs sm:text-sm text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/15 focus:bg-white transition-all shadow-xs"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0F4C3A] transition-colors">
                      🔒
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F4C3A] p-1 focus:outline-none"
                    >
                      {showLoginPassword ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input 
                    type="checkbox" 
                    id="rememberLogin"
                    className="w-4 h-4 rounded-md text-[#0F4C3A] border-gray-300 focus:ring-[#0F4C3A] accent-[#0F4C3A] cursor-pointer"
                  />
                  <label htmlFor="rememberLogin" className="text-xs font-semibold text-[#1E293B]/70 cursor-pointer">
                    Remember my credentials for 30 days
                  </label>
                </div>

                {/* Primary Sign In Button */}
                <button 
                  type="submit"
                  className="w-full py-3.5 mt-2 bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm rounded-[18px] shadow-[0_8px_20px_-4px_rgba(15,76,58,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(200,155,60,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Sign In to Dashboard</span>
                  <span className="text-[#C89B3C] font-black group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>

              </form>

              {/* Flip Trigger: Switch to Signup Face */}
              <div className="mt-6 pt-3 border-t border-gray-100/80 text-center text-xs text-[#1E293B]/70">
                <span>Don't have an account? </span>
                <button 
                  type="button" 
                  onClick={() => setIsFlipped(true)}
                  className="font-bold text-[#0F4C3A] hover:text-[#C89B3C] transition-colors underline underline-offset-4 decoration-[#C89B3C]"
                >
                  Create Account
                </button>
              </div>

            </div>

            {/* ======================================================== */}
            {/* BACK FACE: SIGNUP FORM                                   */}
            {/* ======================================================== */}
            <div 
              className="w-full max-h-[88vh] overflow-y-auto custom-scrollbar rounded-[24px] sm:rounded-[28px] bg-white border border-[#0F4C3A]/15 p-4 sm:p-8 shadow-2xl flex flex-col justify-between relative"
              style={{
                display: !isFlipped ? 'none' : 'flex' // Clean accessibility & pointer-events guarantee
              }}
            >
              {/* Glass Reflection Sheen */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-tl from-[#C89B3C]/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="text-left mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={aventoLogo} alt="Avento Logo" className="w-6 h-6 object-contain" />
                    <span className="font-display font-extrabold text-lg text-[#0F5D46] tracking-tight">AVENTO</span>
                  </div>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#0F4C3A] tracking-tight">
                  Create Account
                </h3>
                <p className="text-xs text-[#1E293B]/60 font-medium mt-0.5">
                  Join 20,000+ students and event directors on AVENTO
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3 text-left">
                
                {/* Full Name & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Aditi Verma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-3.5 py-2.5 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                    University / Personal Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="aditi@dtu.ac.in"
                    required
                    className="w-full px-3.5 py-2.5 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* College / Institution Name */}
                <div>
                  <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                    College / Organization Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Delhi Technological University (DTU)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                  />
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showSignupPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 pr-8 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F4C3A]"
                      >
                        {showSignupPassword ? '👁' : '👁‍🗨'}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-[10.5px] font-bold text-[#0F4C3A] uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input 
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 pr-8 rounded-[16px] bg-white/70 border border-gray-200/80 text-xs text-[#1E293B] placeholder:text-gray-400 focus:outline-none focus:border-[#0F4C3A] focus:ring-1 focus:ring-[#0F4C3A]/20 focus:bg-white transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F4C3A]"
                      >
                        {showSignupConfirmPassword ? '👁' : '👁‍🗨'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="termsSignup"
                    required
                    className="w-4 h-4 mt-0.5 rounded text-[#0F4C3A] border-gray-300 focus:ring-[#0F4C3A] accent-[#0F4C3A] cursor-pointer"
                  />
                  <label htmlFor="termsSignup" className="text-[11px] font-medium text-[#1E293B]/70 leading-tight cursor-pointer">
                    I agree to AVENTO's <a href="#terms" className="underline text-[#0F4C3A] font-bold">Terms of Service</a> & <a href="#privacy" className="underline text-[#0F4C3A] font-bold">Privacy Policy</a>
                  </label>
                </div>

                {/* Primary Create Account Button */}
                <button 
                  type="submit"
                  className="w-full py-3 mt-1 bg-[#0F4C3A] hover:bg-[#0A3629] text-white font-bold text-sm rounded-[18px] shadow-[0_8px_20px_-4px_rgba(15,76,58,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(200,155,60,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Create AVENTO Account</span>
                  <span className="text-[#C89B3C] font-black group-hover:translate-x-1 transition-transform duration-200">→</span>
                </button>

              </form>

              {/* Flip Trigger: Switch back to Login Face */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-[#1E293B]/70">
                <span>Already have an account? </span>
                <button 
                  type="button" 
                  onClick={() => setIsFlipped(false)}
                  className="font-bold text-[#0F4C3A] hover:text-[#C89B3C] transition-colors underline underline-offset-4 decoration-[#C89B3C]"
                >
                  Sign In
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
