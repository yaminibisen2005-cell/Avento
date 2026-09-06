import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import aventoLogo from '../assets/logo.png'

export default function SplashScreen() {
  const [isExiting, setIsExiting] = useState(false)
  const brandLetters = ['A', 'V', 'E', 'N', 'T', 'O']

  useEffect(() => {
    // 5.15s: Begin smooth fade out before unmount at 5.5s
    const timerExit = setTimeout(() => {
      setIsExiting(true)
    }, 5150)

    return () => clearTimeout(timerExit)
  }, [])

  return (
    <motion.div
      animate={
        isExiting
          ? { opacity: 0, filter: 'blur(4px)', transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
          : { opacity: 1, filter: 'blur(0px)' }
      }
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
      className="w-full h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none relative z-10"
    >
      {/* ================= 1. LUXURY NOISE TEXTURE & VIGNETTE ================= */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.022] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='splashNoiseCinematic'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23splashNoiseCinematic)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Dotted Grid */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" 
        aria-hidden="true" 
      />

      {/* Edge Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(250,248,242,0.85)_100%)]"
        aria-hidden="true"
      />

      {/* ================= 2. ANIMATED SOFT LIGHT RAYS & RADIAL GLOWS ================= */}
      {/* Animated Soft Light Rays (Very slow continuous ambient rotation) */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none -z-20 opacity-[0.05]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <radialGradient id="lightRayGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D9B24A" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0F5D46" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FAF8F2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g fill="url(#lightRayGrad)">
            <polygon points="200,200 170,0 230,0" />
            <polygon points="200,200 370,170 400,230" />
            <polygon points="200,200 230,400 170,400" />
            <polygon points="200,200 0,230 30,170" />
            <polygon points="200,200 320,80 360,120" />
            <polygon points="200,200 360,280 320,320" />
            <polygon points="200,200 80,320 40,280" />
            <polygon points="200,200 40,120 80,80" />
          </g>
        </svg>
      </motion.div>

      {/* Subtle Emerald (#0F5D46) Radial Glow Blob */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[920px] h-[750px] sm:h-[920px] rounded-full bg-[#0F5D46] blur-[160px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* Subtle Gold (#D9B24A) Radial Glow Blob */}
      <motion.div 
        animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.11, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[740px] h-[600px] sm:h-[740px] rounded-full bg-[#D9B24A] blur-[140px] pointer-events-none -z-20"
        aria-hidden="true"
      />

      {/* ================= 3. FLOATING GLASS OBJECTS AROUND LOGO ================= */}
      {/* Translucent Emerald Glass Sphere 1 */}
      <motion.div 
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:block absolute top-[28%] left-[20%] w-14 h-14 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full rounded-full border border-white/70 backdrop-blur-md shadow-[0_12px_28px_rgba(15,93,70,0.1)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(15,93,70,0.16) 45%, rgba(217,178,74,0.12) 100%)'
          }}
        />
      </motion.div>

      {/* Translucent Emerald Glass Sphere 2 */}
      <motion.div 
        animate={{ y: [12, -12, 12], x: [6, -6, 6] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="hidden sm:block absolute bottom-[30%] right-[21%] w-16 h-16 rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      >
        <div 
          className="w-full h-full rounded-full border border-white/70 backdrop-blur-md shadow-[0_16px_36px_rgba(217,178,74,0.12)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8) 0%, rgba(217,178,74,0.18) 45%, rgba(15,93,70,0.12) 100%)'
          }}
        />
      </motion.div>

      {/* Rotating Glass Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] sm:w-[740px] h-[620px] sm:h-[740px] pointer-events-none -z-10 opacity-[0.09]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 740 740" className="w-full h-full" fill="none">
          <ellipse cx="370" cy="370" rx="350" ry="210" transform="rotate(-20 370 370)" stroke="#D9B24A" strokeWidth="1.2" strokeDasharray="8 8" />
          <ellipse cx="370" cy="370" rx="290" ry="170" transform="rotate(30 370 370)" stroke="#0F5D46" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </motion.div>

      {/* Tiny Glowing Particles & Golden Sparkles */}
      <motion.div 
        animate={{ y: [-12, 12, -12], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[32%] right-[29%] w-2 h-2 rounded-full bg-[#D9B24A] pointer-events-none -z-10 shadow-[0_0_8px_rgba(217,178,74,0.6)]" 
        aria-hidden="true"
      />
      <motion.div 
        animate={{ y: [10, -10, 10], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[32%] left-[27%] w-1.5 h-1.5 rounded-full bg-[#0F5D46] pointer-events-none -z-10 shadow-[0_0_8px_rgba(15,93,70,0.5)]" 
        aria-hidden="true"
      />
      {/* 4-Point Golden Sparkle */}
      <motion.div 
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute top-[26%] right-[38%] pointer-events-none -z-10"
        aria-hidden="true"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#D9B24A">
          <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
        </svg>
      </motion.div>

      {/* ================= 4. GIGANTIC WATERMARK "A" (OPACITY 3-5%, BLURRED) ================= */}
      <motion.div 
        animate={{ 
          y: [-12, 12, -12],
          rotate: [-1.2, 1.2, -1.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(3px)' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] pointer-events-none -z-10 flex items-center justify-center opacity-[0.04]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" fill="none">
          <defs>
            <linearGradient id="hugeWatermarkGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F5D46" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#126850" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0A3A2C" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path 
            d="M 200,35 L 345,345 L 265,345 L 228,265 L 172,265 L 135,345 L 55,345 Z M 200,135 L 182,215 L 218,215 Z" 
            fill="url(#hugeWatermarkGradA)"
            stroke="rgba(15, 93, 70, 0.25)"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>

      {/* ================= 5. CENTER BRAND REVEAL ANIMATION ================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        
        {/* Step 1 & Step 2: Glowing Emerald Circle Expands (0-1.2s) & Logo Scales (1.2-2.5s) */}
        <div className="relative mb-8 sm:mb-9 flex items-center justify-center">
          
          {/* Step 1 (0-1.2s): Glowing emerald circle expands */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.25, 1], opacity: [0, 0.85, 0.6] }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#0F5D46]/40 via-[#2A8568]/30 to-[#D9B24A]/30 blur-xl pointer-events-none"
          />

          {/* Frosted Glass Emblem Rim */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/80 bg-white/60 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,93,70,0.12)]"
          />

          {/* Step 2 (1.2-2.5s): AVENTO logo icon scales from 0.6 to 1 with easing and glow */}
          <motion.div 
            initial={{ scale: 0.6, opacity: 0, filter: 'drop-shadow(0 0 0px rgba(15,93,70,0))' }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              filter: 'drop-shadow(0 8px 24px rgba(15,93,70,0.22))' 
            }}
            transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center p-4"
          >
            <img 
              src={aventoLogo} 
              alt="AVENTO Logo Icon" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
            />
          </motion.div>
        </div>

        {/* Step 3 (2.5-3.5s): The word A V E N T O appears one letter at a time */}
        <div className="flex items-center justify-center select-none overflow-visible max-w-full">
          {brandLetters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 2.5 + index * 0.16,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                fontFamily: "'General Sans', 'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
                textShadow: '0 8px 30px rgba(15, 93, 70, 0.08)'
              }}
              className="font-extrabold text-[28px] min-[400px]:text-[36px] sm:text-[60px] md:text-[80px] lg:text-[96px] text-[#0F5D46] tracking-[0.12em] min-[400px]:tracking-[0.2em] sm:tracking-[0.5em] md:tracking-[0.7em] pl-[0.12em] min-[400px]:pl-[0.2em] sm:pl-[0.5em] md:pl-[0.7em] inline-block leading-none"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Subtitle: SMART EVENT PLATFORM (Small uppercase, Gold #D9B24A, Responsive Letter spacing) */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 sm:mt-5 text-[9px] min-[400px]:text-[11px] sm:text-[13px] md:text-[14px] font-semibold tracking-[4px] min-[400px]:tracking-[6px] sm:tracking-[10px] pl-[4px] min-[400px]:pl-[6px] sm:pl-[10px] uppercase text-[#D9B24A] select-none text-center"
          style={{
            fontFamily: "'General Sans', 'Sora', sans-serif"
          }}
        >
          SMART EVENT PLATFORM
        </motion.p>

        {/* ================= 6. PREMIUM LOADING LINE ================= */}
        <div className="mt-6 sm:mt-11 w-[180px] min-[400px]:w-[210px] sm:w-[240px] h-[3.5px] sm:h-[4px] rounded-full bg-[#0F5D46]/10 overflow-hidden relative shadow-inner">
          
          {/* Smooth Progress Fill across 5.2 seconds */}
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-[#0F5D46] via-[#2A8568] to-[#D9B24A] rounded-full relative overflow-hidden shadow-[0_0_12px_rgba(217,178,74,0.6)]"
          >
            {/* Animated Shine Moving Across */}
            <motion.div 
              animate={{ x: ['-100%', '250%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent transform -skew-x-20"
            />
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}
