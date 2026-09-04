import React from 'react'

export default function RequirementCard({ requirements = [] }) {
  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] text-left select-none space-y-5"
    >
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight">
          Eligibility & Participation Requirements
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Review necessary qualifications, team constraints, and required equipment
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className="p-4 rounded-[20px] bg-white/80 border border-white/80 shadow-2xs space-y-1"
          >
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#0F5D46] bg-[#EAF7F1] px-2 py-0.5 rounded-full inline-block mb-1">
              {req.label}
            </span>
            <p className="text-xs font-semibold text-[#1F2937] leading-relaxed">
              {req.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
