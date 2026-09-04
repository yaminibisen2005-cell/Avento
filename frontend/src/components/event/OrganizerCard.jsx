import React from 'react'

export default function OrganizerCard({ organizer }) {
  if (!organizer) return null

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
          Hosted By
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Verified academic and technical partner institution
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-[22px] bg-white/80 border border-white/80">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] overflow-hidden border-2 border-[#0F5D46]/20 shrink-0 shadow-2xs">
            <img src={organizer.logo} alt={organizer.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-[#0F5D46]">
                {organizer.name}
              </h3>
              {organizer.verified && (
                <span className="text-[10px] font-extrabold uppercase bg-[#EAF7F1] text-[#0F5D46] border border-[#0F5D46]/25 px-2 py-0.5 rounded-full">
                  ✓ Verified Host
                </span>
              )}
            </div>
            <p className="text-xs text-[#5E6A68] max-w-xl leading-relaxed">
              {organizer.bio}
            </p>
          </div>
        </div>

        {/* Contact buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
          <a
            href={`mailto:${organizer.email}`}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/20 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>✉</span>
            <span>Contact</span>
          </a>

          <a
            href={organizer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>🌐</span>
            <span>Website</span>
          </a>
        </div>
      </div>
    </div>
  )
}
