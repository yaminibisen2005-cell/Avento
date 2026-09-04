import React from 'react'
import { motion } from 'framer-motion'

export default function TrustedBySection() {
  return (
    <section 
      style={{
        backgroundColor: '#FAF8F2',
        backgroundImage: `
          radial-gradient(at 10% 20%, #F3F7F4 0px, transparent 55%),
          radial-gradient(at 90% 15%, #FFFDF8 0px, transparent 50%),
          radial-gradient(at 50% 50%, #FAF8F2 0px, transparent 65%),
          radial-gradient(at 80% 85%, #EDF6F2 0px, transparent 60%),
          radial-gradient(at 15% 80%, #F3F7F4 0px, transparent 55%)
        `
      }}
      className="relative w-full py-20 sm:py-24 lg:py-28 overflow-hidden select-none"
    >
      {/* ================= 1. SMOOTH GRADIENT TRANSITIONS (ZERO VISIBLE BREAK) ================= */}
      {/* Top transition seamlessly blending from Hero section */}
      <div 
        className="absolute top-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-b from-[#FAF8F2] to-transparent -z-10" 
        aria-hidden="true" 
      />
      {/* Bottom transition seamlessly blending into following sections */}
      <div 
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none bg-gradient-to-t from-[#FAF8F2] to-transparent -z-10" 
        aria-hidden="true" 
      />

      {/* ================= 2. GENTLE AMBIENT NOISE TEXTURE (2% OPACITY) ================= */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterSection'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterSection)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Grid Mask */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" 
        aria-hidden="true"
      />

      {/* ================= 3. SOFT VIGNETTE AROUND PAGE EDGES ================= */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 [background:radial-gradient(ellipse_at_center,transparent_45%,rgba(250,248,242,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* ================= 4. VERY SOFT EMERALD & GOLD RADIAL GRADIENT GLOWS ================= */}
      {/* Left Emerald Glow (#0F5D46 at 6-8% opacity) */}
      <motion.div 
        animate={{ x: [-20, 15, -20], y: [-10, 15, -10], scale: [1, 1.06, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-8 left-[5%] w-[580px] h-[480px] rounded-full bg-[#0F5D46]/[0.07] blur-[140px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Right Gold Glow (#D9B24A at 5-7% opacity) */}
      <motion.div 
        animate={{ x: [15, -20, 15], y: [15, -10, 15], scale: [1, 1.08, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-6 right-[8%] w-[560px] h-[460px] rounded-full bg-[#D9B24A]/[0.06] blur-[135px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Center-Bottom Subtle Emerald Tint */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[620px] h-[350px] rounded-full bg-[#0F5D46]/[0.05] blur-[120px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* ================= 5. SOFT BLURRED BOKEH CIRCLES & FROSTED BLUR PATCHES ================= */}
      {/* Frosted Glass Blur Patch 1 (Left Wing) */}
      <div 
        className="hidden md:block absolute top-12 left-[14%] w-60 h-36 rounded-[32px] bg-white/[0.04] backdrop-blur-md border border-white/[0.08] pointer-events-none -z-10 shadow-xs"
        aria-hidden="true"
      />
      {/* Frosted Glass Blur Patch 2 (Right Wing) */}
      <div 
        className="hidden md:block absolute bottom-10 right-[16%] w-64 h-40 rounded-[32px] bg-white/[0.04] backdrop-blur-md border border-white/[0.08] pointer-events-none -z-10 shadow-xs"
        aria-hidden="true"
      />

      {/* Blurred Bokeh Circles */}
      <motion.div 
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-16 right-[24%] w-40 h-40 rounded-full bg-[#D9B24A]/[0.05] blur-[48px] pointer-events-none -z-20"
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-12 left-[20%] w-48 h-48 rounded-full bg-[#0F5D46]/[0.06] blur-[55px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* ================= 6. TRANSLUCENT 3D ABSTRACT ELEMENTS (OPACITY STRICTLY 4-8%) ================= */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none">
          <defs>
            {/* Emerald to Gold Ribbon Gradient */}
            <linearGradient id="ribbonGradientTrusted" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F5D46" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#D9B24A" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#0F5D46" stopOpacity="0.04" />
            </linearGradient>
            {/* Glass Sphere Radial Gradient */}
            <radialGradient id="glassSphereGrad1" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="40%" stopColor="#D9B24A" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#0F5D46" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id="glassSphereGrad2" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
              <stop offset="45%" stopColor="#0F5D46" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0F5D46" stopOpacity="0.03" />
            </radialGradient>
          </defs>

          {/* Flowing Ribbon Shapes */}
          <path 
            d="M -60 220 C 240 100, 520 340, 880 180 C 1140 60, 1380 240, 1520 160" 
            stroke="url(#ribbonGradientTrusted)" 
            strokeWidth="2" 
            strokeDasharray="6 4"
            fill="none" 
          />
          <path 
            d="M -40 140 C 300 280, 680 80, 1060 260 C 1280 340, 1440 180, 1500 120" 
            stroke="url(#ribbonGradientTrusted)" 
            strokeWidth="1.2" 
            fill="none" 
          />

          {/* Transparent Rings (Tilted Orbital Rings) */}
          <ellipse cx="220" cy="180" rx="90" ry="45" transform="rotate(-18 220 180)" stroke="#0F5D46" strokeWidth="1" strokeDasharray="4 6" opacity="0.07" />
          <ellipse cx="1240" cy="220" rx="105" ry="50" transform="rotate(15 1240 220)" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="5 5" opacity="0.06" />

          {/* Glass Spheres */}
          <circle cx="160" cy="140" r="38" fill="url(#glassSphereGrad1)" stroke="rgba(217, 178, 74, 0.12)" strokeWidth="0.8" />
          <circle cx="1300" cy="160" r="44" fill="url(#glassSphereGrad2)" stroke="rgba(15, 93, 70, 0.14)" strokeWidth="0.8" />

          {/* Rounded Glass Cubes (Isometric Lines) */}
          <g transform="translate(340, 80) scale(0.7)" opacity="0.06" stroke="#0F5D46" strokeWidth="1.2" strokeLinejoin="round">
            <path d="M 30 10 L 55 24 L 30 38 L 5 24 Z" />
            <path d="M 5 24 L 5 52 L 30 66 L 30 38 Z" />
            <path d="M 55 24 L 55 52 L 30 66 L 30 38 Z" />
          </g>
          <g transform="translate(1080, 240) scale(0.65)" opacity="0.06" stroke="#D9B24A" strokeWidth="1.2" strokeLinejoin="round">
            <path d="M 30 10 L 55 24 L 30 38 L 5 24 Z" />
            <path d="M 5 24 L 5 52 L 30 66 L 30 38 Z" />
            <path d="M 55 24 L 55 52 L 30 66 L 30 38 Z" />
          </g>
        </svg>
      </div>

      {/* ================= 7. CONTENT: TRANSLUCENT FROSTED GLASS PANEL (NO PLAIN WHITE) ================= */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="rounded-[26px] bg-white/45 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_-12px_rgba(15,93,70,0.06)] py-9 px-6 sm:px-10 text-center transition-all duration-300 hover:bg-white/60 hover:shadow-[0_28px_60px_-10px_rgba(15,93,70,0.10)]">
          <p className="text-[11.5px] uppercase font-extrabold text-[#0F5D46]/75 tracking-widest mb-7 flex items-center justify-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9B24A] animate-pulse" />
            <span>Trusted by 180+ Leading Academic & Technology Communities</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9B24A] animate-pulse" />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 sm:gap-x-16 gap-y-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-bold text-base sm:text-lg text-[#0F5D46] tracking-wider">DELHI TECH UNIVERSITY</span>
            <span className="font-bold text-base sm:text-lg text-[#0F5D46] tracking-wider">IIT KHARAGPUR</span>
            <span className="font-bold text-base sm:text-lg text-[#0F4C3A] tracking-wider">RV COLLEGE OF ENG</span>
            <span className="font-bold text-base sm:text-lg text-[#0F5D46] tracking-wider">BITS PILANI</span>
            <span className="font-bold text-base sm:text-lg text-[#0F5D46] tracking-wider">VIT UNIVERSITY</span>
          </div>
        </div>
      </div>

      {/* ================= 8. EMPTY SPACE FOR FUTURE EXTENSION ================= */}
      <div className="h-4 sm:h-6" aria-hidden="true" />
    </section>
  )
}
