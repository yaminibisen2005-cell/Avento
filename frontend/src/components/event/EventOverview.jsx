import React from 'react'

export default function EventOverview({ event }) {
  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] space-y-8 text-left select-none"
    >
      {/* 1. Full Description */}
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight mb-3">
          About This Event
        </h2>
        <p className="text-sm sm:text-[15px] text-[#5E6A68] leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* 2. What Students Will Learn */}
      {event.learningOutcomes && (
        <div className="pt-6 border-t border-[#0F5D46]/10">
          <h3 className="font-display font-bold text-lg text-[#0F5D46] mb-4">
            What You Will Learn & Build
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {event.learningOutcomes.map((item, index) => (
              <div 
                key={index}
                className="p-3.5 rounded-[16px] bg-white/70 border border-[#0F5D46]/10 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="text-xs sm:text-sm text-[#1F2937]/85 font-medium leading-normal">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Why Attend & Key Benefits */}
      {event.whyAttend && (
        <div className="pt-6 border-t border-[#0F5D46]/10">
          <h3 className="font-display font-bold text-lg text-[#0F5D46] mb-4">
            Why Attend This Event
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {event.whyAttend.map((item, index) => (
              <div 
                key={index}
                className="p-3.5 rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/15 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#D9B24A]/20 text-[#8C6F1E] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ★
                </div>
                <span className="text-xs sm:text-sm text-[#1F2937]/85 font-medium leading-normal">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Event Highlights Grid */}
      {event.highlights && (
        <div className="pt-6 border-t border-[#0F5D46]/10">
          <h3 className="font-display font-bold text-lg text-[#0F5D46] mb-4">
            Event Highlights & Perks
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.highlights.map((h, i) => (
              <div
                key={i}
                className="p-4 rounded-[20px] bg-white/80 border border-white/80 shadow-2xs flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#EAF7F1] text-lg flex items-center justify-center mb-3">
                  {h.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F5D46] leading-tight mb-1">
                    {h.title}
                  </h4>
                  <p className="text-[11.5px] text-[#5E6A68] leading-relaxed">
                    {h.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
