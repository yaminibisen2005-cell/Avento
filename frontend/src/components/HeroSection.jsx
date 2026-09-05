import React from 'react'
import { motion } from 'framer-motion'
import MacbookMockup3D from './MacbookMockup3D'
import {
  QRAttendanceCard,
  CertificateCard
} from './FloatingGlassCard'

export default function HeroSection({ currentUser, onOpenProfile, onOpenEvents, onOpenAuth }) {
  return (
    <motion.section 
      id="home" 
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: '#FAF8F2',
        backgroundImage: `
          radial-gradient(at 0% 0%, #F3F7F4 0px, transparent 55%),
          radial-gradient(at 100% 0%, #FFFDF8 0px, transparent 50%),
          radial-gradient(at 50% 30%, #FAF8F2 0px, transparent 65%),
          radial-gradient(at 85% 85%, #EDF6F2 0px, transparent 60%),
          radial-gradient(at 15% 90%, #F3F7F4 0px, transparent 55%)
        `
      }}
      className="relative w-full pt-20 sm:pt-24 lg:pt-24 pb-8 sm:pb-10 lg:pb-12 overflow-hidden select-none"
    >
      {/* Seamless bottom fade into next section */}
      <div 
        className="absolute bottom-0 inset-x-0 h-36 pointer-events-none bg-gradient-to-b from-transparent to-[#FAF8F2] -z-10" 
        aria-hidden="true" 
      />
      {/* ================= 1. LUXURY BACKGROUND: MESH, VIGNETTE & GRAIN ================= */}

      {/* Subtle Noise Texture (2.2% Opacity) */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterHeroV2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterHeroV2)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Transparent Subtle Dot Matrix Grid */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" 
        aria-hidden="true"
      />

      {/* Soft Vignette Around Edges to Draw Attention Inward */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(250,248,242,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* ================= 2. SOFT LIGHT RAYS COMING DIAGONALLY FROM TOP-LEFT ================= */}
      <motion.div 
        animate={{ opacity: [0.035, 0.065, 0.035], scale: [1, 1.03, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-[950px] h-[950px] pointer-events-none -z-20 overflow-visible"
        aria-hidden="true"
      >
        <svg viewBox="0 0 900 900" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="heroRayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9B24A" stopOpacity="0.7" />
              <stop offset="45%" stopColor="#0F5D46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FAF8F2" stopOpacity="0" />
            </linearGradient>
            <filter id="heroRayBlur">
              <feGaussianBlur stdDeviation="28" />
            </filter>
          </defs>
          <g filter="url(#heroRayBlur)" fill="url(#heroRayGradient)">
            <polygon points="0,0 380,550 280,680" />
            <polygon points="0,0 580,420 480,540" />
            <polygon points="0,0 720,280 620,380" />
          </g>
        </svg>
      </motion.div>

      {/* ================= 3. FOUR-CORNER VERY SOFT EMERALD & GOLD RADIAL GLOWS ================= */}
      {/* Corner 1: Top-Left Emerald Glow (#0F5D46 at 8% opacity) */}
      <motion.div 
        animate={{ x: [-20, 15, -20], y: [-15, 12, -15], scale: [1, 1.08, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-16 -left-20 w-[640px] h-[640px] rounded-full bg-[#0F5D46]/[0.08] blur-[160px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Corner 2: Top-Right Gold Glow (#D9B24A at 7% opacity) */}
      <motion.div 
        animate={{ x: [18, -20, 18], y: [12, -15, 12], scale: [1, 1.09, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-10 right-0 w-[680px] h-[680px] rounded-full bg-[#D9B24A]/[0.07] blur-[150px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Corner 3: Bottom-Left Gold Glow (#D9B24A at 6% opacity) */}
      <motion.div 
        animate={{ x: [-12, 16, -12], y: [10, -12, 10], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-0 left-[8%] w-[580px] h-[580px] rounded-full bg-[#D9B24A]/[0.06] blur-[145px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Corner 4: Bottom-Right Emerald Glow (#0F5D46 at 7% opacity) */}
      <motion.div 
        animate={{ x: [15, -15, 15], y: [-10, 14, -10], scale: [1, 1.07, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-0 right-[4%] w-[640px] h-[640px] rounded-full bg-[#0F5D46]/[0.07] blur-[150px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* ================= 4. LARGE TRANSLUCENT BLURRED GLASS CIRCLES (5-10% OPACITY) ================= */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:block absolute top-24 left-[14%] w-72 h-72 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.14] pointer-events-none -z-10 shadow-xs"
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden lg:block absolute bottom-16 right-[16%] w-80 h-80 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] pointer-events-none -z-10 shadow-xs"
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="hidden xl:block absolute top-1/2 left-[44%] w-56 h-56 rounded-full bg-white/[0.06] backdrop-blur-lg border border-white/[0.10] pointer-events-none -z-10 shadow-xs"
        aria-hidden="true"
      />

      {/* ================= 5. HUGE WATERMARK "A" LOGO IN CENTER (3-5% OPACITY, BLURRED) ================= */}
      <div 
        style={{ filter: 'blur(2px)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] pointer-events-none -z-20 flex items-center justify-center opacity-[0.035]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="heroWatermarkBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F5D46" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#D9B24A" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0F5D46" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path 
            d="M 200,35 L 345,345 L 265,345 L 228,265 L 172,265 L 135,345 L 55,345 Z M 200,135 L 182,215 L 218,215 Z" 
            fill="url(#heroWatermarkBrandGradient)"
            stroke="rgba(217, 178, 74, 0.3)"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* ================= 6. ABSTRACT GEOMETRIC SHAPES (TRIANGLES, CIRCLES, RINGS WITH HEAVY BLUR) ================= */}
      <motion.div 
        animate={{ rotate: [0, 2, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[850px] pointer-events-none -z-20 overflow-visible"
        aria-hidden="true"
      >
        <svg viewBox="0 0 950 850" className="w-full h-full" fill="none">
          <defs>
            <filter id="heavyAbstractBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="48" />
            </filter>
            <filter id="mediumRingBlur">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          {/* Large Transparent Triangle (AVENTO A-Crest Inspired) */}
          <polygon 
            points="475,80 720,560 230,560" 
            fill="rgba(15, 93, 70, 0.05)" 
            stroke="rgba(217, 178, 74, 0.08)" 
            strokeWidth="1.5"
            filter="url(#heavyAbstractBlur)" 
          />

          {/* Inverted Sub-Triangle */}
          <polygon 
            points="475,320 590,540 360,540" 
            fill="rgba(217, 178, 74, 0.04)" 
            filter="url(#heavyAbstractBlur)" 
          />

          {/* Large Blurred Glass Rings */}
          <circle cx="475" cy="425" r="320" stroke="rgba(15, 93, 70, 0.07)" strokeWidth="1" strokeDasharray="8 8" filter="url(#mediumRingBlur)" />
          <circle cx="475" cy="425" r="240" stroke="rgba(217, 178, 74, 0.06)" strokeWidth="1" filter="url(#mediumRingBlur)" />
        </svg>
      </motion.div>

      {/* ================= 7. THIN DOTTED ORBITAL LINES FLOWING ACROSS HERO ================= */}
      <motion.svg 
        animate={{ rotate: [0, 3, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:block absolute top-1/2 right-[1%] -translate-y-1/2 w-[880px] h-[780px] pointer-events-none -z-20 opacity-[0.085] overflow-visible"
        viewBox="0 0 880 780" 
        fill="none"
        aria-hidden="true"
      >
        {/* Soft elliptical orbits */}
        <ellipse cx="440" cy="390" rx="425" ry="245" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="5 6" />
        <ellipse cx="440" cy="390" rx="340" ry="195" stroke="#0F5D46" strokeWidth="1" strokeDasharray="4 6" />
        <ellipse cx="440" cy="390" rx="260" ry="155" stroke="#D9B24A" strokeWidth="0.8" />
        {/* Flowing bezier curves */}
        <path d="M 50 490 Q 440 210 830 490" stroke="#0F5D46" strokeWidth="1.2" strokeDasharray="5 5" />
        <path d="M 110 290 Q 440 510 770 290" stroke="#D9B24A" strokeWidth="0.8" />
      </motion.svg>

      {/* ================= 8. FLOATING GLOWING PARTICLES IN EMERALD & GOLD ================= */}
      <motion.div 
        animate={{ y: [-10, 10, -10], opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:block absolute top-32 right-[34%] w-1.5 h-1.5 rounded-full bg-[#D9B24A] pointer-events-none -z-10 shadow-[0_0_8px_rgba(217,178,74,0.6)]" 
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [10, -10, 10], opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="hidden lg:block absolute bottom-40 right-[42%] w-2 h-2 rounded-full bg-[#0F5D46] pointer-events-none -z-10 shadow-[0_0_8px_rgba(15,93,70,0.5)]" 
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="hidden lg:block absolute top-1/2 right-[14%] w-1.5 h-1.5 rounded-full bg-[#D9B24A] pointer-events-none -z-10 shadow-[0_0_8px_rgba(217,178,74,0.6)]" 
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [8, -8, 8], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="hidden lg:block absolute top-28 left-[38%] w-1.5 h-1.5 rounded-full bg-[#0F5D46] pointer-events-none -z-10 shadow-[0_0_8px_rgba(15,93,70,0.5)]" 
        aria-hidden="true"
      />

      {/* ================= 9. SUBTLE GLASS REFLECTION BEHIND LAPTOP ================= */}
      <div 
        className="hidden xl:block absolute top-[28%] right-[8%] w-[740px] h-[460px] bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent backdrop-blur-md rounded-[40px] -rotate-6 pointer-events-none -z-10 shadow-[0_20px_50px_rgba(15,93,70,0.03)]"
        aria-hidden="true"
      />


      {/* ================= HERO CONTENT & TWO-COLUMN COMPOSITION ================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 relative z-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 xl:gap-20 2xl:gap-24 items-center min-h-[640px] xl:min-h-[680px]">
          
          {/* ================= LEFT COLUMN: HERO CONTENT (ALIGNED LEFT) ================= */}
          <div className="xl:col-span-5 flex flex-col justify-center text-left z-20">
            
            {/* Badge: 16px mobile / 32px desktop spacing */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3.5 sm:px-4.5 py-1 sm:py-1.5 rounded-full text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.14em] sm:tracking-[0.16em] text-[#0F5D46] bg-white/80 backdrop-blur-md border border-[#0F5D46]/18 shadow-xs uppercase">
                <span className="w-2 h-2 rounded-full bg-[#D9B24A] animate-pulse" />
                EVENT REGISTRATION PLATFORM
              </span>
            </motion.div>

            {/* Main Heading: 16px mobile / 28px desktop spacing */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
              className="mb-4 sm:mb-7 max-w-[560px]"
            >
              <h1 
                className="font-black text-3xl xs:text-4xl sm:text-6xl md:text-7xl xl:text-[76px] 2xl:text-[84px] uppercase tracking-[-0.05em] sm:tracking-[-0.06em] text-left"
                style={{ 
                  lineHeight: '0.96',
                  textShadow: '0 10px 35px rgba(15, 93, 70, 0.08)'
                }}
              >
                <span className="text-[#0F5D46] block mb-0.5 sm:mb-1">
                  BUILD.
                </span>
                <span className="text-[#0F5D46] block mb-0.5 sm:mb-1">
                  CONNECT.
                </span>
                <span className="bg-gradient-to-r from-[#D9B24A] via-[#F5D66D] to-[#C9971D] bg-clip-text text-transparent inline-block">
                  CELEBRATE.
                </span>
              </h1>
            </motion.div>

            {/* Description: 24px mobile / 40px desktop spacing */}
            <motion.p 
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="text-sm sm:text-[19px] font-normal leading-[1.6] sm:leading-[1.65] max-w-[500px] text-[#5E6A68] text-left mb-6 sm:mb-10"
            >
              Manage registrations, participants, QR attendance, secure payments and automated certificates from one intelligent platform.
            </motion.p>

            {/* CTA Buttons: Responsive 48px mobile height */}
            <motion.div 
              initial={{ opacity: 0, y: 25, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.9,
                type: "spring", 
                stiffness: 160, 
                damping: 18, 
                delay: 0.22 
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-[18px] mb-6 sm:mb-10"
            >
              {/* Primary Button */}
              <motion.a 
                href="#events" 
                onClick={(e) => {
                  if (onOpenEvents) {
                    e.preventDefault();
                    onOpenEvents();
                  }
                }}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="h-[48px] sm:h-[58px] px-6 sm:px-9 rounded-[16px] sm:rounded-[18px] bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] text-white font-bold text-sm sm:text-[16.5px] tracking-[-0.01em] shadow-[0_8px_24px_-4px_rgba(15,93,70,0.35)] sm:shadow-[0_14px_35px_-6px_rgba(15,93,70,0.45)] hover:shadow-[0_20px_45px_-4px_rgba(15,93,70,0.55)] flex items-center justify-center gap-2.5 sm:gap-3 transition-all duration-200 border border-[#0F5D46]/30 group cursor-pointer"
              >
                <span>Explore Events</span>
                <span className="text-[#D9B24A] text-base sm:text-lg font-bold transform group-hover:translate-x-1.5 transition-transform duration-200">
                  →
                </span>
              </motion.a>

              {/* Secondary Button */}
              {currentUser ? (
                <motion.button 
                  type="button"
                  onClick={onOpenProfile}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="h-[48px] sm:h-[58px] px-5 sm:px-8 rounded-[16px] sm:rounded-[18px] bg-white/90 hover:bg-white text-[#0F5D46] font-bold text-sm sm:text-[16px] tracking-[-0.01em] border border-[#0F5D46]/25 hover:border-[#0F5D46]/45 shadow-2xs hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EAF7F1] border border-[#0F5D46]/20 flex items-center justify-center text-[10px] sm:text-xs font-extrabold text-[#0F5D46]">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span>View My Profile</span>
                  <span className="text-[#D9B24A] text-xs font-bold">→</span>
                </motion.button>
              ) : (
                <motion.button 
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : null}
                  whileHover={{ y: -3, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="h-[48px] sm:h-[58px] px-5 sm:px-8 rounded-[16px] sm:rounded-[18px] bg-white/80 hover:bg-white text-[#0F5D46] font-semibold text-sm sm:text-[16.5px] tracking-[-0.01em] border border-[#0F5D46]/20 hover:border-[#0F5D46]/40 shadow-2xs hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#D9B24A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Host Event</span>
                </motion.button>
              )}
            </motion.div>

            {/* Stats Row: 4 Compact Glass Chips */}
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <div className="bg-white/75 backdrop-blur-md rounded-full shadow-2xs border border-[#0F5D46]/12 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-semibold text-[#0F5D46] flex items-center gap-1.5">
                <span className="text-[#0F5D46] font-bold text-[11px] sm:text-xs">✔</span>
                <span>200+ Colleges</span>
              </div>
              <div className="bg-white/75 backdrop-blur-md rounded-full shadow-2xs border border-[#0F5D46]/12 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-semibold text-[#0F5D46] flex items-center gap-1.5">
                <span className="text-[#0F5D46] font-bold text-[11px] sm:text-xs">✔</span>
                <span>20K+ Participants</span>
              </div>
              <div className="bg-white/75 backdrop-blur-md rounded-full shadow-2xs border border-[#0F5D46]/12 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-semibold text-[#0F5D46] flex items-center gap-1.5">
                <span className="text-[#0F5D46] font-bold text-[11px] sm:text-xs">✔</span>
                <span>98% Attendance</span>
              </div>
              <div className="bg-white/75 backdrop-blur-md rounded-full shadow-2xs border border-[#0F5D46]/12 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-semibold text-[#0F5D46] flex items-center gap-1.5">
                <span className="text-[#0F5D46] font-bold text-[11px] sm:text-xs">✔</span>
                <span>99.9% Uptime</span>
              </div>
            </motion.div>

          </div>


          {/* ================= RIGHT COLUMN: MACBOOK DASHBOARD WITH 3D DEPTH - Slides in from right ================= */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, type: 'spring', stiffness: 110, damping: 18, delay: 0.18 }}
            className="xl:col-span-7 relative flex items-center justify-center z-20 mt-10 xl:mt-0 xl:translate-y-4 xl:translate-x-3 max-w-full overflow-hidden"
          >
            
            {/* 7. Radial Light Behind Laptop for Floating Depth */}
            <div 
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.85) 0%, rgba(243, 247, 244, 0.5) 45%, transparent 70%)',
                filter: 'blur(60px)'
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[520px] pointer-events-none -z-10"
              aria-hidden="true"
            />

            {/* Subtle Green & Gold Depth Glow Halo */}
            <motion.div 
              animate={{ scale: [1, 1.04, 1], opacity: [0.08, 0.11, 0.08] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'radial-gradient(circle at center, rgba(15, 93, 70, 0.8) 0%, rgba(217, 178, 74, 0.6) 45%, transparent 70%)',
                filter: 'blur(90px)'
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[560px] pointer-events-none -z-10"
              aria-hidden="true"
            />

            {/* Laptop & Floating Cards Wrapper */}
            <div className="relative w-full max-w-[720px] xl:max-w-[760px] flex justify-center items-center">
              
              {/* TWO FLOATING CARDS (20-30px AWAY FROM LAPTOP EDGES) */}

              {/* Top Left: QR Attendance Card (translateY -10px, 4s duration, ease-in-out, infinite) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden lg:block absolute -top-5 -left-6 xl:-left-9 z-30 pointer-events-auto"
              >
                <QRAttendanceCard />
              </motion.div>

              {/* Top Right: Certificate Generated Card (translateY -10px, 4s duration, ease-in-out, infinite, different delay) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
                className="hidden lg:block absolute -top-6 -right-4 xl:-right-8 z-30 pointer-events-auto"
              >
                <CertificateCard />
              </motion.div>

              {/* 8. 3D MACBOOK MOCKUP (FLOATING VIA LAYERED SHADOWS) */}
              <div className="w-full flex justify-center items-center">
                <MacbookMockup3D />
              </div>

            </div>

          </motion.div>

        </div>
      </div>

    </motion.section>
  )
}
