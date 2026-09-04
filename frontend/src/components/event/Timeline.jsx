import React from 'react'

export default function Timeline({ timeline = [] }) {
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
          Event Agenda & Schedule
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Structured roadmap of keynote sessions, workshops, and milestones
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 before:absolute before:inset-0 before:left-[11px] sm:before:left-[15px] before:w-0.5 before:bg-gradient-to-b before:from-[#0F5D46] before:via-[#D9B24A] before:to-[#0F5D46]/20 space-y-8">
        {timeline.map((item, index) => (
          <div key={index} className="relative flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 group">
            {/* Milestone Node */}
            <div className="absolute -left-[27px] sm:-left-[31px] top-1 w-6 h-6 rounded-full bg-white border-4 border-[#0F5D46] group-hover:border-[#D9B24A] transition-colors shadow-2xs z-10" />

            {/* Time Pill */}
            <div className="shrink-0 w-28">
              <span className="text-xs font-mono font-extrabold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-1 rounded-full border border-[#0F5D46]/20 inline-block">
                {item.time}
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex-1 space-y-1">
              <h4 className="font-display font-bold text-base text-[#1F2937] group-hover:text-[#0F5D46] transition-colors">
                {item.title}
              </h4>
              <p className="text-xs sm:text-[13px] text-[#5E6A68] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
