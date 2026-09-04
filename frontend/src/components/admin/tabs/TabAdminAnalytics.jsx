import React, { useState } from 'react'

export default function TabAdminAnalytics() {
  const [timeframe, setTimeframe] = useState('monthly')

  const chartBars = [
    { label: 'May', height: 28, value: '₹95k' },
    { label: 'Jun', height: 44, value: '₹1.6L' },
    { label: 'Jul', height: 62, value: '₹2.8L' },
    { label: 'Aug', height: 78, value: '₹4.9L' },
    { label: 'Sep', height: 88, value: '₹6.8L' },
    { label: 'Oct', height: 100, value: '₹8.4L' }
  ]

  const topColleges = [
    { name: 'IIT Delhi', attendees: 648, events: 4, rank: 1 },
    { name: 'BITS Pilani', attendees: 418, events: 3, rank: 2 },
    { name: 'IIT Bombay', attendees: 320, events: 2, rank: 3 },
    { name: 'NIT Trichy', attendees: 256, events: 2, rank: 4 }
  ]

  const topCategories = [
    { name: 'Hackathons', share: 44, color: '#0F5D46' },
    { name: 'Workshops', share: 26, color: '#177A5D' },
    { name: 'Conferences', share: 18, color: '#D9B24A' },
    { name: 'Competitions', share: 12, color: '#8C6F1E' }
  ]

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Ecosystem Analytics & Yield Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Macro analysis of delegate volume, university partnerships, and financial velocity
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-gray-200">
          {['weekly', 'monthly', 'yearly'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === t ? 'bg-[#0F5D46] text-white shadow-xs' : 'text-[#5E6A68]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Revenue Chart */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Gross Platform Ticketing Volume
            </h3>
            <span className="text-xs text-[#5E6A68]">Cumulative participant fee volume processed across connected campus gateways</span>
          </div>

          <span className="font-display font-extrabold text-2xl text-[#0F5D46]">
            ₹8,42,500
          </span>
        </div>

        <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2 px-4 border-b border-gray-100">
          {chartBars.map((b, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-mono font-bold text-[#0F5D46] opacity-0 group-hover:opacity-100 transition-opacity">
                {b.value}
              </span>
              <div 
                className="w-full max-w-[52px] bg-gradient-to-t from-[#0F5D46] to-[#177A5D] group-hover:from-[#0B4B3A] group-hover:to-[#D9B24A] rounded-t-[14px] transition-all duration-300 shadow-xs"
                style={{ height: `${b.height}%` }}
              />
              <span className="text-xs font-bold text-[#5E6A68] mt-1">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Top Colleges & Top Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Colleges */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Premier Campus Partner Rankings
            </h3>
            <span className="text-xs font-bold text-[#D9B24A]">By Attendance</span>
          </div>

          <div className="space-y-2.5">
            {topColleges.map((c) => (
              <div
                key={c.rank}
                className="p-3.5 rounded-[18px] bg-white/85 border border-[#0F5D46]/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center font-extrabold text-[11px]">
                    #{c.rank}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#1F2937]">{c.name}</h4>
                    <span className="text-[11px] text-[#5E6A68]">{c.events} Hosted Events</span>
                  </div>
                </div>

                <span className="font-extrabold text-[#0F5D46]">
                  {c.attendees} Delegates
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Category Demand Distribution
            </h3>
            <span className="text-xs font-bold text-[#0F5D46]">100% Total</span>
          </div>

          <div className="space-y-3">
            {topCategories.map((cat, i) => (
              <div key={i} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-[#1F2937]">{cat.name}</span>
                  <span className="text-[#0F5D46]">{cat.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${cat.share}%`, backgroundColor: cat.color }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
