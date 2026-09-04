import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import aventoLogo from '../assets/logo.png'

export default function SplashHero({ onEnterHero }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  // Subtle parallax tracker
  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePos({ x, y })
  }

  // Smooth scroll to Hero Section
  const scrollToHero = useCallback(() => {
    const heroEl = document.getElementById('home')
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' })
    }
    if (onEnterHero) onEnterHero()
  }, [onEnterHero])

  // Auto-transition timer after 2.8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only auto-scroll if user is still near the top
      if (window.scrollY < 120) {
        scrollToHero()
      }
    }, 2800)

    return () => clearTimeout(timer)
  }, [scrollToHero])

  // Listen for initial wheel / scroll down to trigger smooth transition
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 15 && window.scrollY < 100) {
        scrollToHero()
      }
    }

    const handleKeyDown = (e) => {
      if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') && window.scrollY < 100) {
        scrollToHero()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [scrollToHero])

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: '#FAF8F2',
        backgroundImage: `
          radial-gradient(at 15% 20%, #F3F7F4 0px, transparent 55%),
          radial-gradient(at 85% 25%, #FFFDF8 0px, transparent 50%),
          radial-gradient(at 50% 50%, #FAF8F2 0px, transparent 65%),
          radial-gradient(at 75% 85%, #EDF6F2 0px, transparent 60%),
          radial-gradient(at 25% 80%, #F3F7F4 0px, transparent 55%)
        `
      }}
      className="relative w-full h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none z-30"
    >
      {/* ================= AMBIENT NOISE & TEXTURE ================= */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='splashNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23splashNoise)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid Mask */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]" 
        aria-hidden="true" 
      />

      {/* Edge Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(250,248,242,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* ================= BACKGROUND GLOWS & BREATHING LIGHTS ================= */}
      {/* Emerald Ambient Breathing Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.12, 1],
          opacity: [0.08, 0.14, 0.08]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[900px] h-[720px] sm:h-[900px] rounded-full bg-[#0F5D46] blur-[160px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Gold Ambient Accent Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.06, 0.11, 0.06]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] rounded-full bg-[#D9B24A] blur-[140px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* ================= 3D ABSTRACT FLOATING ELEMENTS ================= */}
      {/* Slow Rotating Concentric Glass Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)`
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] sm:w-[780px] h-[640px] sm:h-[780px] pointer-events-none -z-10 opacity-[0.11]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 800 800" className="w-full h-full" fill="none">
          <ellipse cx="400" cy="400" rx="380" ry="240" transform="rotate(-25 400 400)" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="8 8" />
          <ellipse cx="400" cy="400" rx="320" ry="190" transform="rotate(35 400 400)" stroke="#0F5D46" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="260" stroke="#D9B24A" strokeWidth="0.8" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Floating Glass Spheres */}
      <motion.div 
        animate={{ y: [-14, 14, -14], x: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`
        }}
        className="hidden sm:block absolute top-[20%] left-[16%] w-16 h-16 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full rounded-full border border-white/60 backdrop-blur-md shadow-[0_12px_28px_rgba(15,93,70,0.08)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(217,178,74,0.18) 40%, rgba(15,93,70,0.12) 100%)'
          }}
        />
      </motion.div>

      <motion.div 
        animate={{ y: [12, -12, 12], x: [8, -8, 8] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          transform: `translate3d(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px, 0)`
        }}
        className="hidden sm:block absolute bottom-[22%] right-[18%] w-20 h-20 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full rounded-full border border-white/60 backdrop-blur-md shadow-[0_16px_36px_rgba(217,178,74,0.12)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8) 0%, rgba(15,93,70,0.16) 45%, rgba(217,178,74,0.14) 100%)'
          }}
        />
      </motion.div>

      {/* Floating Micro Particles */}
      <motion.div 
        animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[30%] right-[30%] w-2 h-2 rounded-full bg-[#D9B24A] pointer-events-none -z-10" 
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [8, -8, 8], opacity: [0.15, 0.45, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute bottom-[35%] left-[28%] w-1.5 h-1.5 rounded-full bg-[#0F5D46] pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* ================= HUGE TRANSPARENT FROSTED GLASS 'A' MONOGRAM (15% OPACITY) ================= */}
      <motion.div 
        animate={{ scale: [1, 1.02, 1], opacity: [0.14, 0.17, 0.14] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${mousePos.x * -0.25}px, ${mousePos.y * -0.25}px, 0)`,
          filter: 'blur(1.5px)'
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] md:w-[740px] h-[520px] sm:h-[680px] md:h-[740px] pointer-events-none -z-10 flex items-center justify-center opacity-[0.15]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="splashMonogramGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F5D46" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D9B24A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F5D46" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path 
            d="M 200,35 L 345,345 L 265,345 L 228,265 L 172,265 L 135,345 L 55,345 Z M 200,135 L 182,215 L 218,215 Z" 
            fill="url(#splashMonogramGlass)"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>


      {/* ================= CENTER HERO: OFFICIAL LOGO + MONOGRAM BRAND TEXT ================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        
        {/* Official AVENTO Logo with Glowing Glass Bezel */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05 }}
          onClick={scrollToHero}
          className="relative group cursor-pointer mb-6 sm:mb-7"
        >
          {/* Subtle Halo Rim Glow */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#0F5D46]/30 via-[#D9B24A]/40 to-[#0F5D46]/20 blur-lg group-hover:blur-xl transition-all duration-500 opacity-80" />

          {/* Frosted Glass Emblem Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_20px_50px_rgba(15,93,70,0.14)] p-4 flex items-center justify-center transition-transform duration-300">
            <img 
              src={aventoLogo} 
              alt="AVENTO Official Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* Brand Headline: AVENTO */}
        <motion.h1 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-black text-5xl sm:text-6xl md:text-7xl tracking-[-0.04em] text-[#0F5D46] leading-none mb-3"
          style={{ textShadow: '0 8px 30px rgba(15,93,70,0.08)' }}
        >
          AVENTO
        </motion.h1>

        {/* Subtitle: SMART EVENTS */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="flex items-center gap-3"
        >
          <span className="w-6 sm:w-8 h-[1px] bg-[#D9B24A]/50" />
          <span className="text-[13px] sm:text-[15px] font-mono font-bold tracking-[0.32em] text-[#D9B24A] uppercase">
            SMART EVENTS
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#D9B24A]/50" />
        </motion.div>

      </div>


      {/* ================= BOTTOM TRANSITION TRIGGER / SCROLL INDICATOR ================= */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={scrollToHero}
        className="absolute bottom-8 sm:bottom-10 z-20 flex flex-col items-center gap-2.5 text-[#0F5D46]/70 hover:text-[#0F5D46] transition-colors cursor-pointer group"
        aria-label="Scroll to explore"
      >
        <span className="text-[10.5px] font-bold tracking-[0.24em] uppercase font-mono group-hover:tracking-[0.28em] transition-all duration-300">
          Scroll to explore
        </span>

        {/* Pulsing Downward Chevron */}
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-7 h-7 rounded-full bg-white/70 backdrop-blur-md border border-[#0F5D46]/15 shadow-xs flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Seamless bottom fade into HeroSection */}
      <div 
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-b from-transparent to-[#FAF8F2] -z-10" 
        aria-hidden="true" 
      />
    </section>
  )
}
