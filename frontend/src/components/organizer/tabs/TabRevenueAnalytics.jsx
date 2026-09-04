import React, { useState, useEffect } from 'react'
import { organizerApi } from '../../../services/api'

export default function TabRevenueAnalytics() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [revenueData, setRevenueData] = useState({
    grossRevenue: 481454,
    netPayout: 457381,
    platformFee: 24073,
    nextPayoutDate: 'Nov 01, 2026',
    gatewayStatus: 'Razorpay Standard Checkout Connected'
  })

  useEffect(() => {
    organizerApi.getRevenue()
      .then(res => {
        if (res) {
          setRevenueData(prev => ({
            ...prev,
            ...res
          }))
        }
      })
      .catch(() => {})
  }, [])

  const metrics = [
    { 
      label: 'Gross Ticketing Volume', 
      value: '₹' + Number(revenueData.grossRevenue).toLocaleString('en-IN'), 
      change: '+22.4%', 
      icon: '💳' 
    },
    { 
      label: 'Net Organizer Payout', 
      value: '₹' + Number(revenueData.netPayout).toLocaleString('en-IN'), 
      change: '+18.1%', 
      icon: '💰' 
    },
    { 
      label: 'AVENTO Platform Fee (5%)', 
      value: '₹' + Number(revenueData.platformFee).toLocaleString('en-IN'), 
      change: 'Fixed Tier', 
      icon: '⚡' 
    },
    { 
      label: 'Checkout Conversion', 
      value: '18.4%', 
      change: '+2.3%', 
      icon: '📈' 
    }
  ]

  const chartBars = [
    { month: 'May', height: 25, rev: '₹42k' },
    { month: 'Jun', height: 42, rev: '₹78k' },
    { month: 'Jul', height: 58, rev: '₹1.1L' },
    { month: 'Aug', height: 74, rev: '₹1.6L' },
    { month: 'Sep', height: 86, rev: '₹2.1L' },
    { month: 'Oct', height: 100, rev: '₹' + (Math.round(revenueData.grossRevenue / 1000) / 10) + 'L' }
  ]

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Revenue & Financial Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time breakdown of ticketing revenue, Razorpay settlements, and net institutional payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['daily', 'weekly', 'monthly'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === t 
                  ? 'bg-[#0F5D46] text-white shadow-xs' 
                  : 'bg-white text-[#5E6A68] border border-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-[10.5px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-1">
                {m.label}
              </span>
              <div className="text-2xl font-extrabold text-[#0F5D46]">
                {m.value}
              </div>
              <span className="text-[10px] font-bold text-emerald-600">
                ↑ {m.change}
              </span>
            </div>
            <div className="w-10 h-10 rounded-[14px] bg-[#EAF7F1] text-lg flex items-center justify-center text-[#0F5D46]">
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Card */}
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
              Ticketing Volume & Revenue Trend
            </h3>
            <span className="text-xs text-[#5E6A68]">Cumulative gross proceeds from verified student registrations</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0F5D46]" />
            <span className="text-xs font-bold text-[#1F2937]">Gross Ticketing</span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2 px-4 border-b border-gray-100">
          {chartBars.map((b, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold font-mono text-[#0F5D46] opacity-0 group-hover:opacity-100 transition-opacity">
                {b.rev}
              </span>
              <div 
                className="w-full max-w-[48px] bg-gradient-to-t from-[#0F5D46] to-[#177A5D] rounded-t-[12px] group-hover:from-[#0B4B3A] group-hover:to-[#D9B24A] transition-all duration-300 shadow-xs"
                style={{ height: `${b.height}%` }}
              />
              <span className="text-xs font-bold text-[#5E6A68] mt-1">
                {b.month}
              </span>
            </div>
          ))}
        </div>

        {/* Settlement Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs">
          <div>
            <span className="text-[10.5px] text-[#5E6A68] block">Next Payout Cycle</span>
            <span className="font-bold text-[#1F2937]">{revenueData.nextPayoutDate || 'Automated Weekly'}</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[#5E6A68] block">Settlement Destination</span>
            <span className="font-mono font-bold text-[#0F5D46]">Razorpay Linked Account</span>
          </div>
          <div>
            <span className="text-[10.5px] text-[#5E6A68] block">Gateway Node</span>
            <span className="font-bold text-emerald-700">✓ {revenueData.gatewayStatus || 'Razorpay Active'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
