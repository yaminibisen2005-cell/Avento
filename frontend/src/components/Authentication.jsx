import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ForgotPasswordModal from './ForgotPasswordModal'

export default function Authentication({ initialIsLogin = false, onBackToLanding, onLoginSuccess }) {
  const { login, signup, loginWithGoogle } = useAuth()

  // 3D Flip state: false = Signup ('Create Account'), true = Login ('Welcome Back')
  const [isLogin, setIsLogin] = useState(initialIsLogin)
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

  // Interactive 3D Card Tilt following mouse movement (Max 5deg, smooth spring interpolation)
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window
    const normX = (e.clientX / innerWidth - 0.5) * 2
    const normY = (e.clientY / innerHeight - 0.5) * 2
    setCardTilt({
      rotateX: -normY * 5,
      rotateY: normX * 5
    })
  }

  const handleMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 })
  }

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
          message: 'Your organizer account has been submitted successfully. Our team will review your profile. You will receive access after approval.' 
        })
        setLoginForm(prev => ({ ...prev, email: signupForm.email }))
        setTimeout(() => setIsLogin(true), 2500)
      } else {
        setToast({ type: 'success', message: 'Student account created! Verification email dispatched.' })
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res.user)
          }
        }, 800)
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

      if (res.user?.role === 'ORGANIZER' && res.user?.approved === false) {
        setToast({ type: 'info', message: 'Organizer account is pending admin approval.' })
      } else {
        const welcomeLabel = loginRole === 'ORGANIZER' ? 'Organizer' : 'Student'
        setToast({ type: 'success', message: `Welcome back, ${welcomeLabel}! Entering AVENTO...` })
      }

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(res.user)
        }
      }, 600)
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setToast({ type: '', message: '' })
    setLoading(true)
    try {
      const res = await loginWithGoogle()
      if (res.user?.blocked) {
        setToast({ type: 'error', message: 'Your account has been blocked by an administrator.' })
        return
      }
      setToast({ type: 'success', message: 'Signed in with Google! Entering AVENTO...' })
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(res.user)
        }
      }, 600)
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Google sign-in failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen min-h-[100dvh] overflow-y-auto overflow-x-hidden auth-mesh-bg text-[#1F2937] antialiased selection:bg-[#D9B24A]/25 selection:text-[#0B4B3A] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8 lg:pt-8 pb-24 sm:pb-28 lg:pb-32 select-none"
      style={{ 
        perspective: '1600px',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      
      {/* ========================================================================= */}
      {/* BACKGROUND: MESH GRADIENTS & ATMOSPHERIC BLURS                             */}
      {/* ========================================================================= */}

      {/* 1. Large Blurred Green Glow Behind Entire Card */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#0F5D46]/18 blur-[160px] pointer-events-none -z-20 animate-blob-24s"
        aria-hidden="true"
      />

      {/* 2. Large Gold Radial Glow (Top-Right) */}
      <div 
        className="absolute -top-28 -right-28 w-[680px] h-[680px] rounded-full bg-[#D9B24A]/20 blur-[150px] pointer-events-none -z-20 animate-blob-18s"
        aria-hidden="true"
      />

      {/* 3. Deep Green Radial Glow (Bottom-Left) */}
      <div 
        className="absolute -bottom-28 -left-28 w-[680px] h-[680px] rounded-full bg-[#0F5D46]/15 blur-[150px] pointer-events-none -z-20 animate-blob-12s"
        aria-hidden="true"
      />

      {/* 4. Fine Dotted Matrix Grid */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)]" 
        aria-hidden="true" 
      />

      {/* 5. Abstract Curved Vector Lines & Rings */}
      <svg className="absolute -top-16 -left-16 w-[600px] h-[600px] pointer-events-none -z-20 opacity-35" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <circle cx="250" cy="250" r="230" stroke="#0F5D46" strokeWidth="1.2" strokeDasharray="8 8" />
        <circle cx="250" cy="250" r="170" stroke="#D9B24A" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="250" cy="250" r="110" stroke="#0F5D46" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
      </svg>
      <svg className="absolute -bottom-24 -right-24 w-[580px] h-[580px] pointer-events-none -z-20 opacity-30" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <ellipse cx="250" cy="250" rx="230" ry="140" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="6 6" transform="rotate(-25 250 250)" />
        <ellipse cx="250" cy="250" rx="160" ry="90" stroke="#0F5D46" strokeWidth="0.8" strokeDasharray="4 4" transform="rotate(15 250 250)" />
      </svg>

      {/* Optional Top Return Link */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="fixed top-5 left-6 sm:left-10 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white border border-[#0F5D46]/20 text-[12px] font-medium text-[#0F5D46] shadow-sm hover:shadow transition-all duration-200 hover:-translate-x-0.5 group backdrop-blur-md cursor-pointer"
        >
          <span className="text-[#D9B24A] group-hover:-translate-x-1 transition-transform text-xs">←</span>
          <span>Home</span>
        </button>
      )}

      {/* ========================================================================= */}
      {/* MAIN CARD: FLOATING GLASS CONTAINER (RESPONSIVE, BALANCED 3D CARD)        */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.985, y: 12 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          rotateX: cardTilt.rotateX,
          rotateY: cardTilt.rotateY
        }}
        transition={{ 
          opacity: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
          rotateX: { type: 'spring', stiffness: 75, damping: 20, mass: 0.5 },
          rotateY: { type: 'spring', stiffness: 75, damping: 20, mass: 0.5 }
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.55)',
          boxShadow: '0 40px 90px rgba(15, 93, 70, 0.15)',
          borderRadius: '34px',
          transformStyle: 'preserve-3d'
        }}
        className="auth-main-card-float relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[1220px] xl:max-w-[1300px] my-auto flex flex-col lg:flex-row lg:h-[600px] xl:h-[610px] rounded-[24px] sm:rounded-[34px] overflow-hidden z-20"
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
        {/* LEFT PANEL (50%): REFINED, COMPACT & CALM HERO SHOWCASE                 */}
        {/* ======================================================================= */}
        <div 
          style={{
            background: 'radial-gradient(at 0% 0%, rgba(15, 93, 70, 0.22) 0px, transparent 60%), radial-gradient(at 100% 100%, rgba(217, 178, 74, 0.22) 0px, transparent 60%), linear-gradient(135deg, rgba(234, 247, 241, 0.95) 0%, rgba(255, 255, 255, 0.5) 45%, rgba(234, 247, 241, 0.88) 100%)'
          }}
          className="w-full lg:w-1/2 h-full p-6 sm:p-7 lg:p-8 xl:p-10 hidden lg:flex flex-col justify-between text-left relative z-10 overflow-hidden"
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

          {/* --- MAIN HERO SECTION: COMPACT, ELEGANT PROPORTIONS --- */}
          <div className="my-auto">
            
            {/* HERO HEADING: Compact 34px / 32px scale */}
            <div className="mb-3 max-w-[480px]">
              <h1 className="uppercase text-left">
                <span 
                  className="font-bold text-2xl sm:text-[30px] lg:text-[34px] text-[#0F5D46] block tracking-[-0.035em] leading-[1.05]"
                >
                  SMART EVENTS.
                </span>
                <span 
                  className="font-bold text-2xl sm:text-[28px] lg:text-[32px] bg-gradient-to-b from-[#E6C55A] to-[#D9B24A] bg-clip-text text-transparent inline-block tracking-[-0.035em] leading-[1.05] mt-0.5"
                >
                  MADE SIMPLE.
                </span>
              </h1>
            </div>

            {/* PARAGRAPH */}
            <p 
              className="text-[13px] sm:text-[13.5px] font-normal leading-[1.5] max-w-[420px] mb-3 text-left text-[#66757A]"
            >
              Manage registrations, QR attendance, certificates and analytics from one intelligent platform.
            </p>

            {/* FEATURE CARDS: 4 Specified Cards */}
            <div className="space-y-2 relative max-w-[420px]">
              
              {/* Card 1: ⚡ Instant QR Check-in */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.84)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 10px 25px rgba(15, 93, 70, 0.06)',
                  borderRadius: '16px'
                }}
                className="w-[92%] sm:w-[355px] px-3.5 py-2 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,93,70,0.12)] transition-all duration-200 relative z-0 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B4B3A] text-[#D9B24A] flex items-center justify-center text-xs font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    ⚡
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-[#0B4B3A] leading-tight">Instant QR Check-in</div>
                    <div className="text-[11px] font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      0.3s sub-second turnstile gate entry
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0F5D46] bg-[#EAF7F1] px-2 py-0.5 rounded-full border border-[#0F5D46]/15">
                  0.3s
                </span>
              </div>

              {/* Card 2: 🎓 Smart Certificates */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.86)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 12px 30px rgba(15, 93, 70, 0.08)',
                  borderRadius: '16px'
                }}
                className="w-[96%] sm:w-[375px] -mt-1 ml-2 px-3.5 py-2 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,93,70,0.14)] transition-all duration-200 relative z-10 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D9B24A]/25 text-[#0B4B3A] border border-[#D9B24A]/40 flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    🎓
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-[#0B4B3A] leading-tight">Smart Certificates</div>
                    <div className="text-[11px] font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Cryptographically verifiable credentials
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0B4B3A] bg-[#FAF8F3] px-2 py-0.5 rounded-full border border-[#D9B24A]/30 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#0F5D46]" />
                  VERIFIED
                </span>
              </div>

              {/* Card 3: 📊 Live Event Analytics */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255, 255, 255, 1)',
                  boxShadow: '0 14px 35px rgba(15, 93, 70, 0.10)',
                  borderRadius: '16px'
                }}
                className="w-[94%] sm:w-[365px] -mt-1 ml-1 px-3.5 py-2 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,93,70,0.16)] transition-all duration-200 relative z-20 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0F5D46] text-white flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    📊
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-[#0B4B3A] leading-tight">Live Event Analytics</div>
                    <div className="text-[11px] font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Real-time attendance & seat tracking
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#0F5D46]/20">
                  LIVE
                </span>
              </div>

              {/* Card 4: 💳 Secure Payments */}
              <div 
                style={{
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255, 255, 255, 1)',
                  boxShadow: '0 16px 40px rgba(15, 93, 70, 0.12)',
                  borderRadius: '16px'
                }}
                className="w-[96%] sm:w-[370px] -mt-1 ml-3 px-3.5 py-2 flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,93,70,0.18)] transition-all duration-200 relative z-30 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D9B24A]/25 text-[#0B4B3A] border border-[#D9B24A]/50 flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    💳
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-[#0B4B3A] leading-tight">Secure Payments</div>
                    <div className="text-[11px] font-normal mt-0.5 leading-tight text-[#0F5D46]/70">
                      Bank-grade Razorpay escrow checkout
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#0B4B3A] bg-[#FAF8F3] px-2 py-0.5 rounded-full border border-[#D9B24A]/30">
                  ESCROW
                </span>
              </div>

            </div>

          </div>

          {/* --- BOTTOM: STATS (13px, 500 Weight) --- */}
          <div className="pt-3 border-t border-[#0F5D46]/12">
            <div className="flex items-center justify-between gap-3 sm:gap-4 text-[12.5px] font-medium text-[#0F5D46] flex-wrap">
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
        {/* RIGHT PANEL (50%): COMPACT & ELEGANT AUTHENTICATION FORM                */}
        {/* ======================================================================= */}
        <div className="auth-right-panel-bg w-full lg:w-1/2 h-auto lg:h-full relative p-4 sm:p-6 lg:p-6 xl:p-8 flex items-center justify-center">
          
          {/* Soft Green Glow Behind the Form Container */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#0F5D46]/10 blur-[100px] pointer-events-none" 
            aria-hidden="true"
          />

          {/* 3D Perspective Viewport */}
          <div className="auth-perspective w-full max-w-[480px] sm:max-w-[500px] lg:max-w-[480px] xl:max-w-[500px] h-[550px] sm:h-[560px] lg:h-full relative z-10">
            
            {/* Framer Motion 3D Flipper Container (650ms ease-in-out) */}
            <motion.div
              initial={false}
              animate={{ rotateY: isLogin ? 180 : 0 }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >

              {/* ================================================================= */}
              {/* FRONT FACE: SIGNUP (CREATE ACCOUNT)                               */}
              {/* ================================================================= */}
              <div 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.78)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  pointerEvents: !isLogin ? 'auto' : 'none'
                }}
                className="absolute inset-0 w-full h-full rounded-[24px] border border-white/60 p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-left shadow-[0_25px_60px_rgba(15,93,70,0.12)] overflow-y-auto custom-scrollbar"
              >
                {/* Mobile Brand Header */}
                <div className="lg:hidden flex items-center justify-center gap-2 pt-0.5 pb-1 shrink-0">
                  <div className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-[#0B4B3A] to-[#0F5D46] flex items-center justify-center text-white font-bold text-xs shadow-xs border border-white/40">
                    A
                  </div>
                  <span className="font-bold tracking-wider text-[13.5px] text-[#0B4B3A]">AVENTO</span>
                  <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2 py-0.5 rounded-full">
                    Smart Events
                  </span>
                </div>

                {/* Instant Access Badge */}
                <div className="flex items-center justify-between relative z-10 shrink-0">
                  <span className="text-[10px] sm:text-[10.5px] uppercase font-semibold tracking-[0.12em] text-[#0B4B3A] bg-[#EAF7F1]/90 border border-[#0F5D46]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5D46] animate-ping" />
                    Instant Access
                  </span>
                  <span className="text-[11px] sm:text-[11.5px] font-medium text-[#6B7478]">
                    Event Registration
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div className="relative z-10 mt-1 sm:mt-1.5 mb-1 shrink-0">
                  <h2 
                    className="font-bold text-2xl sm:text-[26px] lg:text-[28px] text-[#0B4B3A] tracking-[-0.025em] leading-tight"
                  >
                    Create Account
                  </h2>
                  <p 
                    className="text-xs sm:text-[13px] font-normal mt-0.5 leading-normal text-[#6B7478]"
                  >
                    Create your AVENTO workspace securely.
                  </p>
                </div>

                {/* Role Selector Toggle */}
                <div className="flex items-center gap-2 p-1 bg-[#0F5D46]/[0.06] rounded-[14px] border border-[#0F5D46]/10 mb-1.5 relative z-10 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSignupForm(prev => ({ ...prev, role: 'STUDENT' }))}
                    className={`flex-1 py-1 text-[11.5px] font-bold rounded-[10px] transition-all duration-200 cursor-pointer ${
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
                    className={`flex-1 py-1 text-[11.5px] font-bold rounded-[10px] transition-all duration-200 cursor-pointer ${
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
                  <div className={`p-2 rounded-[12px] text-xs font-semibold flex items-center justify-between gap-2 mb-1.5 relative z-10 shrink-0 ${
                    toast.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}>
                    <span className="leading-snug text-left break-words">{toast.type === 'error' ? '⚠️' : '✅'} {toast.message}</span>
                    <button type="button" onClick={() => setToast({ type: '', message: '' })} className="text-gray-400 hover:text-gray-700 text-xs shrink-0">✕</button>
                  </div>
                )}

                {/* Form Fields: Micro Labels, Inputs, Checkbox, Submit */}
                <form onSubmit={handleSignupSubmit} className="space-y-1.5 sm:space-y-2 relative z-10 shrink-0">
                  
                  {/* Row 1: Full Name & Phone Number (2-Column Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div>
                      <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
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
                      <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
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
                    <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                    <div>
                      <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
                        PASSWORD
                      </label>
                      <div className="relative">
                        <input 
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={signupForm.password}
                          onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                          className="auth-input-glass w-full pr-8 focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer"
                          aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                        >
                          {showSignupPassword ? '👁' : '👁‍🗨'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
                        CONFIRM PASSWORD
                      </label>
                      <div className="relative">
                        <input 
                          type={showSignupConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={signupForm.confirmPassword}
                          onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          required
                          className="auth-input-glass w-full pr-8 focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer"
                          aria-label={showSignupConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showSignupConfirmPassword ? '👁' : '👁‍🗨'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-0.5">
                    <input 
                      type="checkbox" 
                      id="signupTermsCheck"
                      required
                      className="w-3.5 h-3.5 mt-0.5 rounded text-[#0F5D46] border-gray-300 focus:ring-[#0F5D46] accent-[#0F5D46] cursor-pointer"
                    />
                    <label htmlFor="signupTermsCheck" className="text-[11.5px] sm:text-[12px] font-normal text-[#66757A] leading-tight cursor-pointer">
                      I agree to Terms & Privacy Policy
                    </label>
                  </div>

                  {/* Primary Button: Create Account */}
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className="auth-btn-primary w-full text-white flex items-center justify-center group cursor-pointer relative overflow-hidden text-[14px] font-semibold mt-2 sm:mt-2.5 disabled:opacity-70"
                  >
                    <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                    <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
                    {!loading && (
                      <span className="relative z-10 text-[#D9B24A] font-medium text-[13px] ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    )}
                  </motion.button>

                </form>

                {/* Bottom Row: Google Button & Already have an account? Login */}
                <div className="relative z-10 pt-1.5 shrink-0 space-y-1.5 sm:space-y-2">
                  {/* Google Button */}
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[38px] sm:h-[40px] bg-white/85 hover:bg-white text-[#0B4B3A] border border-[#0F5D46]/20 hover:border-[#0F5D46]/40 font-medium text-[13px] sm:text-[13.5px] rounded-[14px] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer backdrop-blur-md"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Switch to Login */}
                  <div className="text-center text-[12.5px] sm:text-[13px] font-medium text-[#6B7478]">
                    <span>Already have an account? </span>
                    <button 
                      type="button" 
                      onClick={() => handleToggleAuth(true)}
                      className="font-semibold text-[#D9B24A] hover:underline underline-offset-4 cursor-pointer transition-all"
                    >
                      Login
                    </button>
                  </div>
                </div>

              </div>


              {/* ================================================================= */}
              {/* BACK FACE: LOGIN (SIGN IN) - REDESIGNED                          */}
              {/* ================================================================= */}
              <div 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.82)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  pointerEvents: isLogin ? 'auto' : 'none'
                }}
                className="absolute inset-0 w-full h-full rounded-[24px] border border-white/60 p-4 sm:p-5 lg:p-6 flex flex-col justify-between text-left shadow-[0_25px_60px_rgba(15,93,70,0.12)] overflow-y-auto custom-scrollbar"
              >
                {/* Mobile Brand Header */}
                <div className="lg:hidden flex items-center justify-center gap-2 pt-0.5 pb-1 shrink-0">
                  <div className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-[#0B4B3A] to-[#0F5D46] flex items-center justify-center text-white font-bold text-xs shadow-xs border border-white/40">
                    A
                  </div>
                  <span className="font-bold tracking-wider text-[13.5px] text-[#0B4B3A]">AVENTO</span>
                  <span className="text-[10px] uppercase font-semibold tracking-[0.08em] text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-2 py-0.5 rounded-full">
                    Smart Events
                  </span>
                </div>

                {/* Instant Access Badge */}
                <div className="flex items-center justify-between relative z-10 shrink-0">
                  <span className="text-[10px] sm:text-[10.5px] uppercase font-semibold tracking-[0.12em] text-[#0B4B3A] bg-[#EAF7F1]/90 border border-[#0F5D46]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F5D46] animate-ping" />
                    Instant Access
                  </span>
                  <span className="text-[11px] sm:text-[11.5px] font-medium text-[#6B7478]">
                    {loginRole === 'ORGANIZER' ? '🏢 Organizer Portal' : '🎓 Student Portal'}
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div className="relative z-10 mt-1 sm:mt-1.5 mb-1 shrink-0">
                  <h2 
                    className="font-bold text-2xl sm:text-[26px] lg:text-[28px] text-[#0B4B3A] tracking-[-0.025em] leading-tight"
                  >
                    Welcome Back
                  </h2>
                  <p 
                    className="text-xs sm:text-[13px] font-normal mt-0.5 leading-normal text-[#6B7478]"
                  >
                    {loginRole === 'ORGANIZER' 
                      ? 'Sign in to manage university events, registrations and analytics.' 
                      : 'Sign in to access your registrations, QR tickets and certificates.'}
                  </p>
                </div>

                {/* ============================================================= */}
                {/* ACCOUNT TYPE SELECTOR: Segmented Selectable Cards             */}
                {/* ============================================================= */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 my-1.5 relative z-10 shrink-0">
                  {/* Option 1: Student Login */}
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLoginRole('STUDENT')
                      setToast({ type: '', message: '' })
                    }}
                    className={`p-2 sm:p-2.5 rounded-[16px] text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                      loginRole === 'STUDENT'
                        ? 'bg-[#0F5D46]/[0.08] border-2 border-[#0F5D46] shadow-[0_4px_16px_rgba(15,93,70,0.12)] scale-[1.01]'
                        : 'bg-white/80 border border-gray-200/90 hover:border-[#0F5D46]/35 hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-[12.5px] text-[#0B4B3A]">
                        <span className="text-sm sm:text-base">🎓</span>
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
                    <p className="text-[10px] sm:text-[10.5px] leading-tight text-[#0F5D46]/75">
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
                    className={`p-2 sm:p-2.5 rounded-[16px] text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                      loginRole === 'ORGANIZER'
                        ? 'bg-[#0F5D46]/[0.08] border-2 border-[#0F5D46] shadow-[0_4px_16px_rgba(15,93,70,0.12)] scale-[1.01]'
                        : 'bg-white/80 border border-gray-200/90 hover:border-[#0F5D46]/35 hover:bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-[12.5px] text-[#0B4B3A]">
                        <span className="text-sm sm:text-base">🏢</span>
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
                    <p className="text-[10px] sm:text-[10.5px] leading-tight text-[#0F5D46]/75">
                      Manage events, registrations, payments and analytics.
                    </p>
                  </motion.button>
                </div>

                {/* Toast Alert on Login */}
                {toast.message && isLogin && (
                  <div className={`p-2 rounded-[12px] text-xs font-semibold flex items-center justify-between gap-2 mb-1.5 relative z-10 shrink-0 ${
                    toast.type === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200/80'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  }`}>
                    <span className="leading-snug text-left break-words">{toast.type === 'error' ? '⚠️' : '✅'} {toast.message}</span>
                    <button type="button" onClick={() => setToast({ type: '', message: '' })} className="text-gray-400 hover:text-gray-700 text-xs shrink-0">✕</button>
                  </div>
                )}

                {/* Login Fields Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-2 relative z-10 shrink-0">
                  
                  {/* Email with Mail Icon */}
                  <div>
                    <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46] mb-0.5 block">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        placeholder={loginRole === 'ORGANIZER' ? 'organizer@university.edu' : 'student@university.edu'}
                        value={loginForm.email}
                        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        className="auth-input-glass w-full pl-9 pr-4 text-xs sm:text-[13px] focus:outline-none"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4 text-[#0F5D46]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password with Lock Icon & Eye Toggle */}
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <label className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.08em] uppercase text-[#0F5D46]">
                        PASSWORD
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setShowForgotModal(true)} 
                        className="text-[10.5px] sm:text-[11px] font-medium text-[#D9B24A] hover:underline underline-offset-4 transition-colors cursor-pointer bg-transparent border-0 p-0"
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
                        className="auth-input-glass w-full pl-9 pr-8 text-xs sm:text-[13px] focus:outline-none"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4 text-[#0F5D46]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#0F5D46] p-1 focus:outline-none cursor-pointer transition-colors"
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me with Checkbox Icon */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <input 
                      type="checkbox" 
                      id="loginRememberCheckCustom"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0F5D46] border-gray-300 focus:ring-[#0F5D46] accent-[#0F5D46] cursor-pointer"
                    />
                    <label htmlFor="loginRememberCheckCustom" className="text-[11.5px] sm:text-[12px] font-normal text-[#66757A] cursor-pointer select-none">
                      Remember me for 30 days
                    </label>
                  </div>

                  {/* Large Premium Login Button */}
                  <motion.button 
                    type="submit"
                    disabled={loading}
                    whileHover={{ y: loading ? 0 : -2 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className="w-full h-[42px] sm:h-[44px] rounded-[14px] bg-[#0B4B3A] hover:bg-[#073327] text-white flex items-center justify-center gap-2 font-semibold text-[13.5px] sm:text-[14px] shadow-[0_4px_16px_rgba(11,75,58,0.22)] hover:shadow-[0_6px_22px_rgba(11,75,58,0.32)] transition-all duration-200 cursor-pointer relative overflow-hidden disabled:opacity-70 mt-1.5"
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
                <div className="relative z-10 pt-1.5 shrink-0 space-y-2">
                  {/* Google Button */}
                  <button 
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full h-[38px] sm:h-[40px] bg-white/90 hover:bg-white text-[#0B4B3A] border border-[#0F5D46]/20 hover:border-[#0F5D46]/40 font-medium text-[13px] rounded-[14px] shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer backdrop-blur-md"
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
                  <div className="pt-0.5 text-center text-xs text-[#6B7478]">
                    <span className="text-[10.5px] sm:text-[11px] text-gray-500 block mb-0.5">Don't have an account?</span>
                    <div className="flex items-center justify-center gap-3 text-xs font-semibold">
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

              </div>

            </motion.div>

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
