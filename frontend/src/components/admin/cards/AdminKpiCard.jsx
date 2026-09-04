import React from 'react'
import { motion } from 'framer-motion'

export default function AdminKpiCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon = '📊', 
  isPositive = true 
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-4 sm:p-5 rounded-[22px] border border-white/80 shadow-[0_6px_20px_rgba(15,93,70,0.05)] hover:shadow-[0_14px_32px_rgba(15,93,70,0.10)] flex flex-col justify-between text-left select-none group transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="w-10 h-10 rounded-[14px] bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition-transform">
          {icon}
        </div>

        {trend && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
            isPositive 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </span>
        )}
      </div>

      <div>
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-0.5">
          {title}
        </span>
        <div className="text-xl sm:text-2xl font-extrabold font-display text-[#0F5D46] tracking-tight leading-none mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-[10.5px] text-[#5E6A68] truncate">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  )
}
