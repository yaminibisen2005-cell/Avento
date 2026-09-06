import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function Authentication({ initialIsLogin = false, onBackToLanding, onLoginSuccess }) {
  const { login, signup, loginWithGoogle } = useAuth()

  // 3D Flip state: false = Signup ('Create Account'), true = Login ('Welcome Back')
  const [isLogin, setIsLogin] = useState(initialIsLogin)

  useEffect(() => {
    setIsLogin(initialIsLogin)
  }, [initialIsLogin])
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  
  // Form states
  const [loginRole, setLoginRole] = useState('STUDENT') // 'STUDENT' or 'ORGANIZER'
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  })
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ type: '', message: '' })

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)

  const handleToggleAuth = (targetLogin) => {
    setToast({ type: '', message: '' })
    setIsLogin(targetLogin)
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setToast({ type: '', message: '' })

    if (signupForm.password !== signupForm.confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match' })
      return
    }
    if (signupForm.password.length < 8) {
      setToast({ type: 'error', message: 'Password must be at least 8 characters long' })
      return
    }

    setLoading(true)
    try {
      const res = await signup({
        fullName: signupForm.fullName,
        phoneNumber: signupForm.phoneNumber,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role
      })

      if (signupForm.role === 'ORGANIZER') {
        setToast({ 
          type: 'success', 
          message: 'Organizer account created! Opening Organizer Dashboard...' 
        })
        const organizerUser = {
          ...(res.user || {}),
          role: 'ORGANIZER',
          approved: true
        }
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(organizerUser)
          }
        }, 600)
      } else {
        setToast({ type: 'success', message: 'Student account created! Welcome to AVENTO.' })
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res.user)
          }
        }, 600)
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setToast({ type: '', message: '' })
    setLoading(true)

    try {
      const res = await login(loginForm.email, loginForm.password, rememberMe, loginRole)
      if (res.user?.blocked) {
        setToast({ type: 'error', message: 'Your account has been blocked by an administrator.' })
        return
      }

      const activeUser = {
        ...(res.user || {}),
        role: loginRole === 'ORGANIZER' ? 'ORGANIZER' : (res.user?.role || 'STUDENT'),
        approved: true
      }

      const welcomeLabel = activeUser.role === 'ORGANIZER' ? 'Organizer' : 'Student'
      setToast({ type: 'success', message: `Welcome back, ${welcomeLabel}! Opening dashboard...` })

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(activeUser)
        }
      }, 500)
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setToast({ type: '', message: '' })
    try {
      const res = await loginWithGoogle()
      setToast({ type: 'success', message: 'Signed in with Google successfully!' })
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(res.user)
        }
      }, 600)
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Google Sign-In failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main 
      className="relative w-full min-h-screen min-h-[100dvh] overflow-y-auto bg-[#FAF8F2] text-[#1F2937] antialiased selection:bg-[#D9B24A]/25 selection:text-[#0B4B3A] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8"
      style={{ 
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      
      {/* ========================================================================= */}
      {/* BACKGROUND: SUBTLE ACCENTS (NO BLUR OVERLAYING FORM)                      */}
      {/* ========================================================================= */}

      {/* 1. Subtle Green Glow (Top-Left) */}
      <div 
        className="absolute -top-10 -left-10 w-[500px] h-[500px] rounded-full bg-[#0F5D46]/08 blur-[100px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* 2. Subtle Gold Glow (Bottom-Right) */}
      <div 
        className="absolute -bottom-10 -right-10 w-[500px] h-[500px] rounded-full bg-[#D9B24A]/10 blur-[100px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* 3. Fine Dotted Matrix Grid */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" 
        aria-hidden="true" 
      />

      {/* Optional Top Return Link */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="fixed top-4 left-4 sm:left-8 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white hover:bg-white/95 border border-[#0F5D46]/20 text-[12.5px] font-semibold text-[#0F5D46] shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-x-0.5 group cursor-pointer"
        >
          <span className="text-[#D9B24A] group-hover:-translate-x-1 transition-transform text-xs">←</span>
          <span>Home</span>
        </button>
      )}

      {/* ========================================================================= */}
      {/* MAIN CARD: SOLID, CRISP LUXURY CARD (GENEROUS SPACING)                     */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(15, 93, 70, 0.15)',
          boxShadow: '0 25px 70px -15px rgba(15, 93, 70, 0.14), 0 0 0 1px rgba(15, 93, 70, 0.05)',
          borderRadius: '32px'
        }}
        className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[1180px] xl:max-w-[1240px] my-auto flex flex-col lg:flex-row min-h-[640px] lg:min-h-[700px] rounded-[24px] sm:rounded-[32px] overflow-hidden z-20"
      >
        
        {/* Soft 1px Gradient Vertical Divider */}
        <div 
          className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-[1px] pointer-events-none z-30 -translate-x-1/2"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 93, 70, 0.35) 50%, transparent 100%)'
          }}
          aria-hidden="true"
        />

        {/* ======================================================================= */}
        {/* LEFT PANEL (50%): SPACIOUS & ELEGANT HERO SHOWCASE                      */}
        {/* ======================================================================= */}
        <div 
          style={{
            background: 'radial-gradient(at 0% 0%, rgba(15, 93, 70, 0.22) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(217, 178, 74, 0.22) 0px, transparent 60%), linear-gradient(135deg, rgba(234, 247, 241, 0.95) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(234, 247, 241, 0.88) 100%)'
          }}
          className="w-full lg:w-1/2 min-h-full p-6 sm:p-8 lg:p-9 xl:p-11 hidden lg:flex flex-col justify-between text-left relative z-10 overflow-hidden"
        >
          
          {/* --- 3D BACKGROUND GRAPHICS & DEPTH --- */}

          {/* 1. Translucent 3D "A" Watermark Shape (4% Opacity) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] pointer-events-none -z-10 flex items-center justify-center opacity-[0.04]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 400 400" className="w-full h-full text-[#0F5D46]" fill="none">
              <path 
                d="M 200,35 L 345,345 L 265,345 L 228,265 L 172,265 L 135,345 L 55,345 Z M 200,135 L 182,215 L 218,215 Z" 
                fill="#0F5D46"
              />
            </svg>
          </div>

          {/* 2. Soft Emerald Light Beams & Blobs */}
          <div 
            className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#0F5D46]/14 blur-[70px] pointer-events-none -z-10 animate-blob-12s"
            aria-hidden="true"
          />
          <div 
            className="absolute top-20 left-20 w-80 h-56 rounded-full bg-[#D9B24A]/18 blur-[70px] pointer-events-none -z-10 animate-blob-18s"
            aria-hidden="true"
          />
          <div 
            className="absolute -bottom-16 -right-16 w-76 h-76 rounded-full bg-[#0F5D46]/12 blur-[80px] pointer-events-none -z-10 animate-blob-24s"
            aria-hidden="true"
          />

          {/* 3. Abstract Vector Waves & Concentric Thin Rings */}
          <svg className="absolute top-2 -left-10 w-[500px] h-[420px] pointer-events-none -z-10 opacity-40 animate-blob-18s" viewBox="0 0 500 420" fill="none" aria-hidden="true">
            <ellipse cx="250" cy="210" rx="230" ry="140" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="6 8" fill="none" transform="rotate(-12 250 210)" />
            <ellipse cx="250" cy="210" rx="160" ry="95" stroke="#0F5D46" strokeWidth="0.8" strokeDasharray="4 4" fill="none" transform="rotate(18 250 210)" opacity="0.65" />
            <path d="M 50,120 Q 200,220 450,150" stroke="#0F5D46" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.4" />
          </svg>

          {/* 4. Glass Orb & Specular Highlight Ring */}
          <div 
            className="absolute top-20 right-[15%] w-20 h-20 rounded-full pointer-events-none -z-10 border border-white/70 shadow-[0_8px_25px_rgba(15,93,70,0.08)] opacity-65 animate-blob-12s"
            style={{
              background: 'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.8) 0%, rgba(234, 247, 241, 0.25) 55%, transparent 100%)'
            }}
            aria-hidden="true"
          />

          {/* 5. 3D Floating Gold Spheres */}
          <div 
            className="hidden sm:block absolute top-10 right-10 w-6 h-6 rounded-full pointer-events-none -z-10 animate-sphere-6s"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #FFF9EC 0%, #E8CD78 35%, #D9B24A 65%, #8C6F1E 100%)',
              boxShadow: '0 8px 18px rgba(140, 111, 30, 0.24), inset 0 1.5px 3px rgba(255, 255, 255, 0.95)'
            }}
            aria-hidden="true"
          />
          <div 
            className="hidden sm:block absolute top-[42%] left-3 w-4 h-4 rounded-full pointer-events-none -z-10 animate-sphere-6s [animation-delay:2s]"
            style={{
              background: 'radial-gradient(circle at 35% 28%, #FFF9EC 0%, #E8CD78 35%, #D9B24A 65%, #8C6F1E 100%)',
              boxShadow: '0 6px 14px rgba(140, 111, 30, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.9)'
            }}
            aria-hidden="true"
          />

          {/* 6. Emerald Crystal Object */}
          <div 
            className="hidden sm:block absolute bottom-16 right-8 w-7 h-9 pointer-events-none -z-10 animate-crystal-10s opacity-85 filter drop-shadow-[0_8px_16px_rgba(15,93,70,0.2)]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 50 65" className="w-full h-full">
              <polygon points="25,2 48,18 25,63 2,18" fill="#0B4B3A" opacity="0.9" />
              <polygon points="25,2 48,18 25,32" fill="#0F5D46" />
              <polygon points="25,2 2,18 25,32" fill="#1C7E61" />
              <polygon points="2,18 25,32 25,63" fill="#073327" />
              <polygon points="48,18 25,32 25,63" fill="#0B4B3A" />
            </svg>
          </div>

          {/* 7. Floating Golden Particles */}
          <div className="absolute top-28 left-[60%] w-1.5 h-1.5 rounded-full bg-[#D9B24A] opacity-50 animate-particle-1" />
          <div className="absolute bottom-28 left-[26%] w-1.5 h-1.5 rounded-full bg-[#0F5D46] opacity-40 animate-particle-2" />
          <div className="absolute top-14 left-[20%] w-1 h-1 rounded-full bg-[#D9B24A] opacity-35 animate-particle-1" />

          {/* --- TOP: BRAND LOGO & ENTERPRISE BADGE --- */}
          <div className="flex items-center gap-2.5 pt-0 mb-3 sm:mb-4">
            <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-[#0B4B3A] to-[#0F5D46] flex items-center justify-center text-white font-bold text-xs shadow-[0_3px_10px_rgba(15,93,70,0.2)] border border-white/40">
              A
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-[14px] text-[#0B4B3A]">AVENTO</span>
              <span className="text-[10px] uppercase font-semibold tracking-[0.1em] text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2 py-0.5 rounded-full shadow-2xs">
                Smart Events Platform
              </span>
            </div>
          </div>

          {/* --- MAIN HERO SECTION: SPACIOUS, ELEGANT PROPORTIONS --- */}
          <div className="my-auto py-2">
            
            {/* HERO HEADING */}
            <div className="mb-3 max-w-[480px]">
              <h1 className="uppercase text-left">
                <span 
                  className="font-black text-2xl sm:text-3xl lg:text-[36px] text-[#0F5D46] block tracking-[-0.035em] leading-[1.08]"
                >
                  SMART EVENTS.
                </span>
                <span 
                  className="font-black text-2xl sm:text-3xl lg:text-[34px] bg-gradient-to-b from-[#E6C55A] to-[#D9B24A] bg-clip-text text-transparent inline-block tracking-[-0.035em] leading-[1.08] mt-1"
                >
                  MADE SIMPLE.
                </span>
              </h1>
            </div>

            {/* PARAGRAPH */}
            <p 
              className="text-xs sm:text-sm font-normal leading-relaxed max-w-[440px] mb-5 text-left text-[#5E6A68]"
            >
              Manage registrations, QR attendance, certificates and analytics from one intelligent platform.
            </p>

            {/* FEATURE CARDS: 4 Spacious Cards */}
            <div className="space-y-2.5 relative max-w-[440px]">
              
              {/* Card 1: ⚡ Instant QR Check-in */}
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 93, 70, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 93, 70, 0.05)',
                  borderRadius: '16px'
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,93,70,0.08)] transition-all duration-200 relative z-0 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0B4B3A] text-[#D9B24A] flex items-center justify-center text-xs font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    ⚡
                  </div>
                  <div className="text-left">
                    <div className="text-[13.5px] font-bold text-[#0B4B3A] leading-tight">Instant QR Check-in</div>
                    <div className="text-xs font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      0.3s sub-second turnstile gate entry
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-1 rounded-full border border-[#0F5D46]/15">
                  0.3s
                </span>
              </div>

              {/* Card 2: 🎓 Smart Certificates */}
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 93, 70, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 93, 70, 0.05)',
                  borderRadius: '16px'
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,93,70,0.08)] transition-all duration-200 relative z-10 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#D9B24A]/25 text-[#0B4B3A] border border-[#D9B24A]/40 flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    🎓
                  </div>
                  <div className="text-left">
                    <div className="text-[13.5px] font-bold text-[#0B4B3A] leading-tight">Smart Certificates</div>
                    <div className="text-xs font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Cryptographically verifiable credentials
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0B4B3A] bg-[#FAF8F3] px-2.5 py-1 rounded-full border border-[#D9B24A]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5D46]" />
                  VERIFIED
                </span>
              </div>

              {/* Card 3: 📊 Live Event Analytics */}
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 93, 70, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 93, 70, 0.05)',
                  borderRadius: '16px'
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,93,70,0.08)] transition-all duration-200 relative z-20 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0F5D46] text-white flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    📊
                  </div>
                  <div className="text-left">
                    <div className="text-[13.5px] font-bold text-[#0B4B3A] leading-tight">Live Event Analytics</div>
                    <div className="text-xs font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Real-time attendance & seat tracking
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-1 rounded-full border border-[#0F5D46]/20">
                  LIVE
                </span>
              </div>

              {/* Card 4: 💳 Secure Payments */}
              <div 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(15, 93, 70, 0.12)',
                  boxShadow: '0 4px 14px rgba(15, 93, 70, 0.05)',
                  borderRadius: '16px'
                }}
                className="w-full px-4 py-2.5 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,93,70,0.08)] transition-all duration-200 relative z-30 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#D9B24A]/25 text-[#0B4B3A] border border-[#D9B24A]/50 flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    💳
                  </div>
                  <div className="text-left">
                    <div className="text-[13.5px] font-bold text-[#0B4B3A] leading-tight">Secure Payments</div>
                    <div className="text-xs font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Bank-grade Razorpay escrow checkout
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0B4B3A] bg-[#FAF8F3] px-2.5 py-1 rounded-full border border-[#D9B24A]/30">
                  ESCROW
                </span>
              </div>

            </div>

          </div>

          {/* --- BOTTOM: STATS --- */}
          <div className="pt-3 border-t border-[#0F5D46]/12">
            <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs sm:text-[13px] font-semibold text-[#0F5D46] flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-[#0F5D46] font-bold text-xs">✔</span>
                <span>200+ Colleges</span>
              </span>
              <span className="text-[#D9B24A] font-bold">•</span>
              <span className="flex items-center gap-1">
                <span className="text-[#0F5D46] font-bold text-xs">✔</span>
                <span>20K+ Participants</span>
              </span>
              <span className="text-[#D9B24A] font-bold">•</span>
              <span className="flex items-center gap-1">
                <span className="text-[#0F5D46] font-bold text-xs">✔</span>
                <span>98% Attendance</span>
              </span>
              <span className="text-[#D9B24A] font-bold">•</span>
              <span className="flex items-center gap-1">
                <span className="text-[#0F5D46] font-bold text-xs">✔</span>
                <span>99.9% Uptime</span>
              </span>
            </div>
          </div>

        </div>


        {/* ======================================================================= */}
        {/* RIGHT PANEL (50%): SPACIOUS & ELEGANT AUTHENTICATION FORM               */}
        {/* ======================================================================= */}
        <div className="auth-right-panel-bg w-full lg:w-1/2 min-h-full relative p-6 sm:p-8 lg:p-9 xl:p-12 flex items-center justify-center overflow-y-auto custom-scrollbar">
          
          <div className="w-full max-w-[480px] sm:max-w-[500px] flex flex-col justify-between relative z-10 py-2 sm:py-4">
            {/* Top-Level Unified Switcher: Sign In | Sign Up in the Same Card */}
            <div className="flex p-1.5 bg-[#0F5D46]/[0.07] rounded-2xl border border-[#0F5D46]/15 mb-5 relative z-20 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => handleToggleAuth(true)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  isLogin
                    ? 'bg-[#0F5D46] text-white shadow-sm'
                    : 'text-[#0F5D46] hover:bg-white/60'
                }`}
              >
                <span>🔐</span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleAuth(false)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  !isLogin
                    ? 'bg-[#0F5D46] text-white shadow-sm'
                    : 'text-[#0F5D46] hover:bg-white/60'
                }`}
              >
                <span>✨</span>
                <span>Sign Up</span>
              </button>
            </div>

            {!isLogin ? (
              <motion.div
                key="signup-pane"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full p-2 sm:p-3 flex flex-col justify-between text-left overflow-y-auto custom-scrollbar"
              >
                {/* Mobile Brand Header */}
                <div className="lg:hidden flex items-center justify-center gap-2 pb-3 shrink-0">
                  <div className="w-7 h-7 rounded-[9px] bg-gradient-to-br from-[#0B4B3A] to-[#0F5D46] flex items-center justify-center text-white font-bold text-xs shadow-xs border border-white/40">
                    A
                  </div>
                  <span className="font-bold tracking-wider text-[15px] text-[#0B4B3A]">AVENTO</span>
                  <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2.5 py-0.5 rounded-full">
                    Smart Events
                  </span>
                </div>

                {/* Portal Subtitle */}
                <div className="flex items-center justify-end relative z-10 shrink-0 mb-1">
                  <span className="text-xs font-semibold text-[#6B7478]">
                    Event Registration
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div className="relative z-10 mb-3 shrink-0">
                  <h2 
                    className="font-extrabold text-2xl sm:text-3xl text-[#0B4B3A] tracking-[-0.025em] leading-tight"
                  >
                    Create Account
                  </h2>
                  <p 
                    className="text-xs sm:text-sm font-normal mt-1 leading-normal text-[#6B7478]"
                  >
                    Create your AVENTO workspace securely.
                  </p>
                </div>

                {/* Role Selector Toggle */}
                <div className="flex items-center gap-2.5 p-1.5 bg-[#0F5D46]/[0.06] rounded-[16px] border border-[#0F5D46]/10 mb-4 relative z-10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSignupForm(prev => ({ ...prev, role: 'STUDENT' }))}
                    className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-[12px] transition-all duration-200 cursor-pointer ${
                      signupForm.role === 'STUDENT'
                        ? 'bg-[#0F5D46] text-white shadow-xs'
                        : 'text-[#0F5D46] hover:bg-white/60'
                    }`}
                  >
                    🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupForm(prev => ({ ...prev, role: 'ORGANIZER' }))}
                    className={`flex-1 py-2 text-xs sm:text-[13px] font-bold rounded-[12px] transition-all duration-200 cursor-pointer ${
                      signupForm.role === 'ORGANIZER'
                        ? 'bg-[#0F5D46] text-white shadow-xs'
                        : 'text-[#0F5D46] hover:bg-white/60'
                    }`}
                  >
                    🏛 Organizer
                  </button>
                </div>

                {/* Toast Alert */}
                {toast.message && !isLogin && (
                  <div className={`p-3 rounded-[14px] text-xs font-semibold flex items-center justify-between gap-2 mb-3 relative z-10 shrink-0 ${
                    toast.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}>
                    <span className="leading-snug text-left break-words">{toast.type === 'error' ? '⚠️' : '✅'} {toast.message}</span>
                    <button type="button" onClick={() => setToast({ type: '', message: '' })} className="text-gray-400 hover:text-gray-700 text-xs shrink-0">✕</button>
                  </div>
                )}

                {/* Form Fields: Labels, Inputs, Checkbox, Submit */}
                <form onSubmit={handleSignupSubmit} className="space-y-3 sm:space-y-3.5 relative z-10 shrink-0">
                  
                  {/* Row 1: Full Name & Phone Number (2-Column Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                        FULL NAME
                      </label>
                      <input 
                        type="text" 
                        placeholder="Alex Morgan"
                        value={signupForm.fullName}
                        onChange={e => setSignupForm({ ...signupForm, fullName: e.target.value })}
                        required
                        className="auth-input-glass w-full focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                        PHONE NUMBER
                      </label>
                      <input 
                        type="tel" 
                        placeholder="9876543210"
                        value={signupForm.phoneNumber}
                        onChange={e => setSignupForm({ ...signupForm, phoneNumber: e.target.value })}
                        required
                        className="auth-input-glass w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                      EMAIL ADDRESS
                    </label>
                    <input 
                      type="email" 
                      placeholder="alex@university.edu"
                      value={signupForm.email}
                      onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="auth-input-glass w-full focus:outline-none"
                    />
                  </div>

                  {/* Row 3: Password & Confirm Password (2-Column Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                        PASSWORD
                      </label>
                      <div className="relative">
                        <input 
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={signupForm.password}
                          onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                          className="auth-input-glass w-full pr-10 focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer"
                          aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignupPassword ? '👁' : '👁‍🗨'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                        CONFIRM PASSWORD
                      </label>
                      <div className="relative">
                        <input 
                          type={showSignupConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={signupForm.confirmPassword}
                          onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          required
                          className="auth-input-glass w-full pr-10 focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer"
                          aria-label={showSignupConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showSignupConfirmPassword ? '👁' : '👁‍🗨'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="signupTermsCheck"
                      required
                      className="w-4 h-4 mt-0.5 rounded text-[#0F5D46] border-gray-300 focus:ring-[#0F5D46] accent-[#0F5D46] cursor-pointer"
                    />
                    <label htmlFor="signupTermsCheck" className="text-xs font-normal text-[#5E6A68] leading-tight cursor-pointer">
                      I agree to the <strong className="text-[#0F5D46]">Terms of Service</strong> & <strong className="text-[#0F5D46]">Privacy Policy</strong>
                    </label>
                  </div>

                  {/* Primary Button: Create Account */}
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className="auth-btn-primary w-full h-[48px] sm:h-[52px] rounded-[16px] text-white flex items-center justify-center group cursor-pointer relative overflow-hidden text-sm sm:text-base font-bold mt-3 disabled:opacity-70 shadow-sm"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                    <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                    {!loading && (
                      <span className="relative z-10 text-[#D9B24A] font-bold text-base ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    )}
                  </motion.button>

                </form>

                {/* Bottom Row: Google Button & Already have an account? Login */}
                <div className="relative z-10 pt-3 shrink-0 space-y-3">
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[44px] sm:h-[48px] bg-white/95 hover:bg-white text-[#0B4B3A] border border-[#0F5D46]/20 hover:border-[#0F5D46]/40 font-semibold text-xs sm:text-sm rounded-[14px] shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>

                  <div className="text-center text-xs sm:text-sm text-[#5E6A68] pt-1">
                    <span>Already have an account? </span>
                    <button 
                      type="button" 
                      onClick={() => handleToggleAuth(true)}
                      className="font-bold text-[#0F5D46] hover:text-[#D9B24A] hover:underline underline-offset-4 cursor-pointer transition-colors ml-1"
                    >
                      Login
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                key="login-pane"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full p-2 sm:p-3 flex flex-col justify-between text-left"
              >
                {/* Mobile Brand Header */}
                <div className="lg:hidden flex items-center justify-center gap-2 pb-3 shrink-0">
                  <div className="w-7 h-7 rounded-[9px] bg-gradient-to-br from-[#0B4B3A] to-[#0F5D46] flex items-center justify-center text-white font-bold text-xs shadow-xs border border-white/40">
                    A
                  </div>
                  <span className="font-bold tracking-wider text-[15px] text-[#0B4B3A]">AVENTO</span>
                  <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2.5 py-0.5 rounded-full">
                    Smart Events
                  </span>
                </div>

                {/* Portal Subtitle */}
                <div className="flex items-center justify-end relative z-10 shrink-0 mb-1">
                  <span className="text-xs font-semibold text-[#6B7478]">
                    {loginRole === 'ORGANIZER' ? '🏢 Organizer Portal' : '🎓 Student Portal'}
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div className="relative z-10 mb-3 shrink-0">
                  <h2 
                    className="font-extrabold text-2xl sm:text-3xl text-[#0B4B3A] tracking-[-0.025em] leading-tight"
                  >
                    Welcome Back
                  </h2>
                  <p 
                    className="text-xs sm:text-sm font-normal mt-1 leading-normal text-[#6B7478]"
                  >
                    {loginRole === 'ORGANIZER' 
                      ? 'Sign in to manage university events, registrations and analytics.' 
                      : 'Sign in to access your registrations, QR tickets and certificates.'}
                  </p>
                </div>

                {/* ============================================================= */}
                {/* ACCOUNT TYPE SELECTOR: Segmented Selectable Cards             */}
                {/* ============================================================= */}
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 my-3 sm:my-4 relative z-10 shrink-0">
                  {/* Option 1: Student Login */}
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLoginRole('STUDENT')
                      setToast({ type: '', message: '' })
                    }}
                    className={`p-3 sm:p-3.5 rounded-[16px] text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                      loginRole === 'STUDENT'
                        ? 'bg-[#0F5D46]/[0.08] border-2 border-[#0F5D46] shadow-[0_4px_16px_rgba(15,93,70,0.12)] scale-[1.01]'
                        : 'bg-white border border-gray-200/90 hover:border-[#0F5D46]/35 hover:bg-gray-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#0B4B3A]">
                        <span className="text-base">🎓</span>
                        <span>Student Login</span>
                      </div>
                      {loginRole === 'STUDENT' ? (
                        <span className="w-4 h-4 rounded-full bg-[#D9B24A] text-[#0B4B3A] flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs">
                          ✓
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] sm:text-[11.5px] leading-normal text-[#0F5D46]/75 mt-0.5">
                      Access registered events, certificates and tickets.
                    </p>
                  </motion.button>

                  {/* Option 2: Organizer Login */}
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLoginRole('ORGANIZER')
                      setToast({ type: '', message: '' })
                    }}
                    className={`p-3 sm:p-3.5 rounded-[16px] text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                      loginRole === 'ORGANIZER'
                        ? 'bg-[#0F5D46]/[0.08] border-2 border-[#0F5D46] shadow-[0_4px_16px_rgba(15,93,70,0.12)] scale-[1.01]'
                        : 'bg-white border border-gray-200/90 hover:border-[#0F5D46]/35 hover:bg-gray-50/50 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#0B4B3A]">
                        <span className="text-base">🏢</span>
                        <span>Organizer Login</span>
                      </div>
                      {loginRole === 'ORGANIZER' ? (
                        <span className="w-4 h-4 rounded-full bg-[#D9B24A] text-[#0B4B3A] flex items-center justify-center text-[10px] font-black shrink-0 shadow-2xs">
                          ✓
                        </span>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] sm:text-[11.5px] leading-normal text-[#0F5D46]/75 mt-0.5">
                      Manage events, registrations, payments and analytics.
                    </p>
                  </motion.button>
                </div>

                {/* Toast Alert on Login */}
                {toast.message && isLogin && (
                  <div className={`p-3 rounded-[14px] text-xs font-semibold flex items-center justify-between gap-2 mb-3 relative z-10 shrink-0 ${
                    toast.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}>
                    <span className="leading-snug text-left break-words">{toast.type === 'error' ? '⚠️' : '✅'} {toast.message}</span>
                    <button type="button" onClick={() => setToast({ type: '', message: '' })} className="text-gray-400 hover:text-gray-700 text-xs shrink-0">✕</button>
                  </div>
                )}

                {/* Login Fields Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-3 sm:space-y-3.5 relative z-10 shrink-0">
                  
                  {/* Email with Mail Icon */}
                  <div>
                    <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46] mb-1.5 block">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder={loginRole === 'ORGANIZER' ? 'organizer@university.edu' : 'student@university.edu'}
                        value={loginForm.email}
                        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        className="auth-input-glass w-full pl-11 pr-4 text-xs sm:text-sm focus:outline-none"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4 text-[#0F5D46]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password with Lock Icon & Eye Toggle */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-[#0F5D46]">
                        PASSWORD
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setShowForgotModal(true)} 
                        className="text-xs font-bold text-[#D9B24A] hover:text-[#b8912e] hover:underline underline-offset-4 transition-colors cursor-pointer bg-transparent border-0 p-0"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={loginForm.password}
                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        className="auth-input-glass w-full pl-11 pr-10 text-xs sm:text-sm focus:outline-none"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4 text-[#0F5D46]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer transition-colors"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me with Checkbox Icon */}
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="checkbox" 
                      id="loginRememberCheckCustom"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0F5D46] border-gray-300 focus:ring-[#0F5D46] accent-[#0F5D46] cursor-pointer"
                    />
                    <label htmlFor="loginRememberCheckCustom" className="text-xs font-normal text-[#5E6A68] cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Large Premium Login Button */}
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: loading ? 0 : -1 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className="w-full h-[48px] sm:h-[52px] rounded-[16px] bg-[#0B4B3A] hover:bg-[#073327] text-white flex items-center justify-center gap-2 font-bold text-sm sm:text-base shadow-[0_8px_24px_rgba(11,75,58,0.25)] hover:shadow-[0_12px_28px_rgba(11,75,58,0.35)] transition-all duration-200 cursor-pointer relative overflow-hidden disabled:opacity-70 mt-2"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                    <span className="relative z-10 font-bold">
                      {loading ? 'Authenticating...' : `Login as ${loginRole === 'ORGANIZER' ? 'Organizer' : 'Student'}`}
                    </span>
                    {!loading && (
                      <span className="relative z-10 text-[#D9B24A] font-extrabold text-base transform group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    )}
                  </motion.button>

                </form>

                {/* Bottom Row: Google Button & Separate Account Creation Links */}
                <div className="relative z-10 pt-3 shrink-0 space-y-3">
                  {/* Google Button */}
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[44px] sm:h-[48px] bg-white/95 hover:bg-white text-[#0B4B3A] border border-[#0F5D46]/20 hover:border-[#0F5D46]/40 font-semibold text-xs sm:text-sm rounded-[14px] shadow-2xs hover:shadow-xs transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Dual Create Account Links */}
                  <div className="pt-1 text-center text-xs sm:text-sm text-[#6B7478]">
                    <span className="text-xs text-gray-500 block mb-1">Don't have an account?</span>
                    <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
                      <button 
                        type="button" 
                        onClick={() => {
                          setSignupForm(prev => ({ ...prev, role: 'STUDENT' }))
                          handleToggleAuth(false)
                        }}
                        className="inline-flex items-center gap-1.5 text-[#0F5D46] hover:text-[#0B4B3A] hover:underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        <span>🎓</span>
                        <span>Create Student Account</span>
                      </button>
                      <span className="text-gray-300">•</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setSignupForm(prev => ({ ...prev, role: 'ORGANIZER' }))
                          handleToggleAuth(false)
                        }}
                        className="inline-flex items-center gap-1.5 text-[#D9B24A] hover:text-[#b8912e] hover:underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        <span>🏢</span>
                        <span>Create Organizer Account</span>
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </div>

      </motion.div>

      <ForgotPasswordModal 
        isOpen={showForgotModal} 
        onClose={() => setShowForgotModal(false)} 
      />
    </main>
  )
}
