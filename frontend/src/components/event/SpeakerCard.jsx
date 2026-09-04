import React from 'react'

export default function SpeakerCard({ speakers = [] }) {
  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] text-left select-none space-y-6"
    >
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight">
          Featured Keynote Speakers & Mentors
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Learn directly from researchers, tech leads, and founders
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {speakers.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-[22px] bg-white/80 border border-white/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#0F5D46]/20 shadow-2xs shrink-0">
                <img src={s.avatar} alt={s.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-sm sm:text-base text-[#0F5D46] truncate group-hover:text-[#0A3B2E] transition-colors">
                  {s.name}
                </h4>
                <p className="text-[11.5px] font-semibold text-[#1F2937]/80 truncate">
                  {s.designation}
                </p>
                <span className="text-[11px] text-[#D9B24A] font-bold block truncate">
                  {s.company}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#0F5D46]/10 flex justify-end">
              <a
                href={s.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Connect on LinkedIn</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
