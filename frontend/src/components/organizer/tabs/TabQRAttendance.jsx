import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { organizerService } from '../../../services/organizerService'

export default function TabQRAttendance() {
  const [ticketInput, setTicketInput] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [liveStats, setLiveStats] = useState({
    checkedIn: 648,
    remaining: 52,
    rate: 94
  })

  const handleScan = async (ticketIdToScan) => {
    const id = ticketIdToScan || ticketInput
    if (!id.trim()) return

    setIsVerifying(true)
    const result = await organizerService.scanTicket(id)
    setIsVerifying(false)
    setScanResult(result)

    if (result.status === 'VALID') {
      setLiveStats(prev => ({
        checkedIn: prev.checkedIn + 1,
        remaining: Math.max(0, prev.remaining - 1),
        rate: Math.min(100, Math.round(((prev.checkedIn + 1) / 700) * 100))
      }))
    }
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Turnstile QR Attendance & Gate Control
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          High-throughput 0.3s QR code verification desk with duplicate admission prevention
        </p>
      </div>

      {/* Live Session Counters (3-Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[20px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            TOTAL ADMITTED
          </span>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            {liveStats.checkedIn} Attendees
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in venue</span>
        </div>

        <div className="p-4 rounded-[20px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            REMAINING PASSES
          </span>
          <div className="text-2xl font-extrabold text-[#D9B24A]">
            {liveStats.remaining} Pending
          </div>
          <span className="text-[11px] text-[#5E6A68]">Expected at entrance</span>
        </div>

        <div className="p-4 rounded-[20px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            CHECK-IN RATE
          </span>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            {liveStats.rate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Capacity verified</span>
        </div>
      </div>

      {/* Scanner & Manual Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Camera Scanner Interface (7 Cols) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="lg:col-span-7 p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-[#0F5D46]">
                Optical Scanner Active (Gate 1 Turnstile)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-gray-400">
              60 FPS • 0.3s Scan
            </span>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative h-72 rounded-[22px] bg-black/90 overflow-hidden flex items-center justify-center p-6 border-2 border-[#0F5D46]/30 shadow-inner">
            {/* Animated Laser Sweep */}
            <motion.div
              animate={{ y: [-100, 100, -100] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-[#D9B24A] to-transparent shadow-[0_0_15px_#D9B24A] pointer-events-none z-10"
            />

            {/* Corner Alignment Crosshairs */}
            <div className="w-48 h-48 border-2 border-dashed border-white/40 rounded-[20px] relative flex flex-col items-center justify-center text-center p-4">
              <span className="text-3xl block mb-2 opacity-70">📷</span>
              <span className="text-xs font-bold text-white/80">
                Align Attendee Pass QR Code Here
              </span>
              <span className="text-[10px] text-[#D9B24A] mt-1 font-mono">
                Auto-Scan Enabled
              </span>

              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D9B24A]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D9B24A]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D9B24A]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D9B24A]" />
            </div>
          </div>

          {/* Quick Test Barcodes */}
          <div className="pt-2 text-xs">
            <span className="text-[11px] text-[#5E6A68] font-bold block mb-1.5">
              Quick Test Passes:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setTicketInput('AVT-WRK-3109')
                  handleScan('AVT-WRK-3109')
                }}
                className="px-2.5 py-1 rounded-[8px] bg-white border border-[#0F5D46]/20 font-mono text-[11px] text-[#0F5D46] hover:bg-[#EAF7F1] cursor-pointer"
              >
                AVT-WRK-3109 (Valid)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTicketInput('AVT-HACK-8492')
                  handleScan('AVT-HACK-8492')
                }}
                className="px-2.5 py-1 rounded-[8px] bg-white border border-amber-300 font-mono text-[11px] text-amber-800 hover:bg-amber-50 cursor-pointer"
              >
                AVT-HACK-8492 (Already Scanned)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTicketInput('AVT-FAKE-9999')
                  handleScan('AVT-FAKE-9999')
                }}
                className="px-2.5 py-1 rounded-[8px] bg-white border border-red-300 font-mono text-[11px] text-red-700 hover:bg-red-50 cursor-pointer"
              >
                AVT-FAKE-9999 (Invalid)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Manual Entry & Result Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Manual Input Form */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
              backdropFilter: 'blur(20px)'
            }}
            className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-3"
          >
            <h3 className="font-display font-bold text-sm text-[#0F5D46]">
              Manual Ticket Pass Entry
            </h3>
            <p className="text-xs text-[#5E6A68]">
              Type ticket ID if physical smartphone screen is dim or damaged
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleScan(); }} className="space-y-3">
              <input
                type="text"
                value={ticketInput}
                onChange={e => setTicketInput(e.target.value)}
                placeholder="e.g. AVT-WRK-3109"
                className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none uppercase"
              />

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isVerifying ? 'Checking Registry...' : 'Verify & Admit Attendee →'}
              </button>
            </form>
          </div>

          {/* Validation Result Cards */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-[24px] border text-xs text-left select-none space-y-3 shadow-md ${
                  scanResult.status === 'VALID'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : scanResult.status === 'ALREADY_SCANNED'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    scanResult.status === 'VALID'
                      ? 'bg-emerald-600 text-white'
                      : scanResult.status === 'ALREADY_SCANNED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {scanResult.status === 'VALID' ? '✓ ADMISSION GRANTED' : scanResult.status === 'ALREADY_SCANNED' ? '⚠️ DUPLICATE DETECTED' : '✕ INVALID TICKET'}
                  </span>
                  <span className="font-mono text-[11px] font-bold opacity-80">
                    {scanResult.ticketId}
                  </span>
                </div>

                <p className="font-semibold leading-relaxed">
                  {scanResult.message}
                </p>

                {scanResult.attendee && (
                  <div className="p-3 rounded-[14px] bg-white/80 border border-current/20 space-y-1">
                    <div className="flex justify-between">
                      <span className="opacity-75">Attendee:</span>
                      <span className="font-bold">{scanResult.attendee.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">College:</span>
                      <span className="font-medium">{scanResult.attendee.college}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-75">Event:</span>
                      <span className="font-medium">{scanResult.attendee.eventTitle}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
