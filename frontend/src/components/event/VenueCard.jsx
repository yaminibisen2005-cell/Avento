import React from 'react'

export default function VenueCard({ venue }) {
  if (!venue) return null

  const handleDirections = () => {
    const query = encodeURIComponent(`${venue.name}, ${venue.address}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] text-left select-none space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight">
            Event Venue & Location
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Official on-site venue details, navigation coordinates, and access gates
          </p>
        </div>

        <button
          type="button"
          onClick={handleDirections}
          className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>📍</span>
          <span>Get Directions</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Map Preview Placeholder */}
        <div className="lg:col-span-6 h-56 rounded-[22px] bg-gradient-to-tr from-[#EAF7F1] via-[#FAF8F2] to-[#D9B24A]/20 border border-[#0F5D46]/20 relative overflow-hidden flex items-center justify-center p-6 text-center shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#0F5D46_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#0F5D46] text-white text-xl mx-auto flex items-center justify-center shadow-md animate-bounce">
              📍
            </div>
            <span className="font-extrabold text-xs text-[#0F5D46] block">
              {venue.name}
            </span>
            <span className="text-[11px] text-[#5E6A68] block">
              {venue.coordinates}
            </span>
          </div>
        </div>

        {/* Venue Information List */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10">
            <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">FULL ADDRESS</span>
            <span className="font-bold text-sm text-[#1F2937] block leading-snug">{venue.address}</span>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10">
            <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">LANDMARK & GATES</span>
            <span className="font-medium text-[#1F2937] block">{venue.landmark}</span>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white/80 border border-[#0F5D46]/10">
            <span className="text-[10px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-0.5">PARKING & TRANSIT</span>
            <span className="font-medium text-[#1F2937] block">{venue.parking}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
