import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabAdminReports() {
  const [format, setFormat] = useState('CSV')
  const [timeframe, setTimeframe] = useState('monthly')
  const [isExporting, setIsExporting] = useState(false)
  const [notice, setNotice] = useState('')

  const handleGenerate = async () => {
    setIsExporting(true)
    await adminService.generateReport(format, timeframe)
    setIsExporting(false)
    setNotice(`Official ${timeframe.toUpperCase()} platform report exported in ${format} format.`)
    setTimeout(() => setNotice(''), 4000)
  }

  return (
    <div className="max-w-3xl space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Executive Compliance & Data Exporter
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Generate comprehensive audit logs across attendance metrics, fee settlements, and organizer activity
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {notice}
        </div>
      )}

      {/* Generator Configuration Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-xs space-y-5"
      >
        <h3 className="font-display font-bold text-base text-[#0F5D46]">
          Configure Report Parameters
        </h3>

        {/* Format Selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-2">
            1. Select Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['CSV', 'Excel', 'PDF'].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`p-3 rounded-[16px] border text-xs font-bold transition-all cursor-pointer ${
                  format === f 
                    ? 'bg-[#0F5D46] text-white border-[#0F5D46] shadow-xs' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#0F5D46]/30'
                }`}
              >
                {f === 'CSV' ? '📄 CSV Document' : f === 'Excel' ? '📊 Excel Sheet' : '📑 Official PDF'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-2">
            2. Select Reporting Window
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['daily', 'weekly', 'monthly', 'yearly'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`p-2.5 rounded-[14px] border text-xs font-bold capitalize transition-all cursor-pointer ${
                  timeframe === t 
                    ? 'bg-[#D9B24A] text-white border-[#D9B24A] shadow-xs' 
                    : 'bg-white text-[#5E6A68] border-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-3">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleGenerate}
            className="w-full py-3.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs sm:text-sm rounded-[16px] shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span>📥</span>
            <span>{isExporting ? 'Compiling Platform Data...' : `Download ${timeframe.toUpperCase()} Report (${format})`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
