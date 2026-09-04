import React from 'react'
import { motion } from 'framer-motion'

export default function StatsCard({ title, value, icon, change, subtitle, trend = 'up' }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(250, 248, 242, 0.65) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 rounded-[24px] border border-white/70 shadow-[0_12px_32px_rgba(15,93,70,0.06)] hover:shadow-[0_20px_45px_rgba(15,93,70,0.12)] flex flex-col justify-between transition-all duration-300 relative overflow-hidden group select-none"
    >
      {/* Top Subtle Emerald Light Caustic */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F5D46]/[0.05] rounded-full blur-2xl pointer-events-none group-hover:bg-[#0F5D46]/[0.08] transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11.5px] font-bold text-[#5E6A68] uppercase tracking-[0.1em] block mb-1">
            {title}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            {value}
          </div>
        </div>

        {/* Icon Badge */}
        <div className="w-12 h-12 rounded-[18px] bg-[#EAF7F1] border border-[#0F5D46]/15 flex items-center justify-center text-xl text-[#0F5D46] shadow-2xs group-hover:scale-110 transition-transform duration-300">
          <span>{icon}</span>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-[#0F5D46]/[0.08] flex items-center justify-between text-xs relative z-10">
        <span className="text-[#5E6A68] font-medium">{subtitle}</span>
        {change && (
          <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
            trend === 'up' 
              ? 'text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20' 
              : 'text-[#D9B24A] bg-[#D9B24A]/10 border border-[#D9B24A]/30'
          }`}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  )
}
