import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import { organizerService } from '../../../services/organizerService'

// Web Audio API feedback synthesizer
const playSoundFeedback = (type, enabled = true) => {
  if (!enabled) return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === 'valid') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12) // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.start()
      osc.stop(ctx.currentTime + 0.35)
    } else if (type === 'duplicate') {
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440, ctx.currentTime) // A4
      osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.15) // F4
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else {
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(220, ctx.currentTime) // A3
      osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.15) // E3
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc.start()
      osc.stop(ctx.currentTime + 0.35)
    }
  } catch {
    // Ignore audio error
  }
}

export default function TabQRAttendance({
  events = [],
  registrations = [],
  onAttendanceMarked,
  onNavigateTab
}) {
  const [selectedEventId, setSelectedEventId] = useState('All')
  const [ticketInput, setTicketInput] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Camera & Scanner State
  const [isCameraRunning, setIsCameraRunning] = useState(false)
  const [cameraDevices, setCameraDevices] = useState([])
  const [selectedCameraId, setSelectedCameraId] = useState('')
  const [cameraError, setCameraError] = useState(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const scannerRef = useRef(null)
  const lastScannedCodeRef = useRef({ code: '', timestamp: 0 })
  const fileInputRef = useRef(null)

  // Calculate live statistics based on real registrations prop
  const currentRegistrations = (registrations || []).filter(r => {
    if (selectedEventId === 'All') return true
    return String(r.eventId) === String(selectedEventId)
  })

  const totalRegistered = currentRegistrations.length
  const totalAdmitted = currentRegistrations.filter(r => r.attendance === 'Checked In').length
  const totalRemaining = Math.max(0, totalRegistered - totalAdmitted)
  const checkInRate = totalRegistered > 0 ? Math.round((totalAdmitted / totalRegistered) * 100) : 0

  // Core verification function
  const processTicketVerification = useCallback(async (rawCode) => {
    if (!rawCode || !rawCode.trim() || isVerifying) return

    const trimmed = rawCode.trim()
    const now = Date.now()

    // Prevent immediate duplicate firing within 3 seconds for the same code
    if (lastScannedCodeRef.current.code === trimmed && (now - lastScannedCodeRef.current.timestamp < 3000)) {
      return
    }
    lastScannedCodeRef.current = { code: trimmed, timestamp: now }

    setIsVerifying(true)
    try {
      const result = await organizerService.scanTicket(trimmed, selectedEventId)
      setIsVerifying(false)
      setScanResult(result)

      // Audio feedback
      if (result.status === 'VALID') {
        playSoundFeedback('valid', soundEnabled)
      } else if (result.status === 'ALREADY_SCANNED') {
        playSoundFeedback('duplicate', soundEnabled)
      } else {
        playSoundFeedback('invalid', soundEnabled)
      }

      // Add to session audit log
      const logEntry = {
        id: `scan-${now}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ticketId: result.ticketId || trimmed,
        studentName: result.attendee?.studentName || (result.status === 'INVALID' ? 'Unknown' : 'Attendee'),
        college: result.attendee?.college || '',
        eventTitle: result.attendee?.eventTitle || (selectedEventId !== 'All' ? events.find(e => String(e.id) === String(selectedEventId))?.title : 'Event'),
        status: result.status,
        message: result.message
      }
      setScanHistory(prev => [logEntry, ...prev.slice(0, 49)])

      // Trigger dashboard & registrations synchronization
      if (result.status === 'VALID' && onAttendanceMarked) {
        onAttendanceMarked()
      }
    } catch (err) {
      setIsVerifying(false)
      playSoundFeedback('invalid', soundEnabled)
      const errResult = {
        status: 'INVALID',
        message: err.message || 'Check-in failed due to a network or server error.',
        ticketId: trimmed
      }
      setScanResult(errResult)
    }
  }, [events, isVerifying, onAttendanceMarked, selectedEventId, soundEnabled])

  // Stop active camera
  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop()
        }
      } catch (err) {
        console.warn('Error stopping scanner:', err)
      }
      setIsCameraRunning(false)
    }
  }, [])

  // Start active camera
  const startCamera = useCallback(async (cameraIdToUse) => {
    setCameraError(null)
    const readerElement = document.getElementById('qr-reader-viewport')
    if (!readerElement) return

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader-viewport')
      }

      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop()
      }

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.72)
          return { width: edge, height: edge }
        },
        aspectRatio: 1.0
      }

      const cameraConstraint = cameraIdToUse || (cameraDevices.length > 0 ? cameraDevices[0].id : { facingMode: 'environment' })

      try {
        await scannerRef.current.start(
          cameraConstraint,
          config,
          (decodedText) => {
            processTicketVerification(decodedText)
          },
          () => {
            // Ignore frame decode misses
          }
        )
      } catch (initialErr) {
        // Fallback: If device ID constraint failed, try generic user / environment facingMode
        console.warn('Initial camera constraint failed, attempting fallback:', initialErr)
        await scannerRef.current.start(
          { facingMode: 'user' },
          config,
          (decodedText) => {
            processTicketVerification(decodedText)
          },
          () => {}
        )
      }

      setIsCameraRunning(true)
    } catch (err) {
      console.error('Camera start failure:', err)
      const errName = err?.name || ''
      const errMsg = (err?.message || '').toLowerCase()

      if (errName === 'NotAllowedError' || errMsg.includes('permission') || errMsg.includes('denied')) {
        setCameraError('Camera permission was blocked. Please click the lock / camera icon in your browser address bar, toggle Camera to "Allow", and click "Start Camera". Also check Windows Settings > Privacy & Security > Camera.')
      } else if (errName === 'NotReadableError' || errName === 'TrackStartError' || errMsg.includes('in use') || errMsg.includes('readable') || errMsg.includes('could not start')) {
        setCameraError('Your camera (HP True Vision) is currently locked or in use by another program (such as Zoom, Teams, Windows Camera, or another browser tab). Please close other apps and click "Retry Camera".')
      } else if (errName === 'NotFoundError' || errMsg.includes('not found')) {
        setCameraError('No camera found on this device. You can upload pass image files or enter ticket numbers manually below.')
      } else {
        setCameraError(err.message || 'Unable to access camera device. Please verify permissions.')
      }
      setIsCameraRunning(false)
    }
  }, [cameraDevices, processTicketVerification])

  // Initialize camera list on mount
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length > 0) {
          setCameraDevices(devices)
          // Prefer back/rear camera if available
          const backCam = devices.find(d => /back|rear|environment/i.test(d.label))
          const chosenId = backCam ? backCam.id : devices[0].id
          setSelectedCameraId(chosenId)
          startCamera(chosenId)
        } else {
          setCameraError('No camera detected on this system. You can still scan ticket image files or enter codes manually.')
        }
      })
      .catch(() => {
        setCameraError('Camera access was denied or not supported in this browser context. You can use image upload or manual entry below.')
      })

    return () => {
      stopCamera()
    }
  }, [startCamera, stopCamera])

  // Handle switching camera
  const handleCameraChange = async (e) => {
    const newId = e.target.value
    setSelectedCameraId(newId)
    await stopCamera()
    await startCamera(newId)
  }

  // Handle image upload QR scan
  const handleImageFileScan = async (file) => {
    if (!file) return
    setIsUploadingImage(true)
    setCameraError(null)

    try {
      let qrEngine = scannerRef.current
      if (!qrEngine) {
        qrEngine = new Html5Qrcode('qr-reader-viewport')
        scannerRef.current = qrEngine
      }

      // If camera is currently streaming, pause it temporarily
      const wasScanning = qrEngine.isScanning
      if (wasScanning) {
        await qrEngine.stop()
        setIsCameraRunning(false)
      }

      const decodedText = await qrEngine.scanFile(file, true)
      setIsUploadingImage(false)
      if (decodedText) {
        processTicketVerification(decodedText)
      }

      // Resume camera if it was running before
      if (wasScanning) {
        await startCamera(selectedCameraId)
      }
    } catch (err) {
      setIsUploadingImage(false)
      playSoundFeedback('invalid', soundEnabled)
      setScanResult({
        status: 'INVALID',
        message: 'No readable QR code found in the uploaded image. Please ensure the code is clear.',
        ticketId: file.name
      })
    }
  }

  // Export scan history to CSV
  const handleExportHistoryCSV = () => {
    if (scanHistory.length === 0) return
    const headers = ['Time', 'Status', 'Ticket ID', 'Student Name', 'College', 'Event', 'Message']
    const rows = scanHistory.map(h => [
      `"${h.timestamp}"`,
      `"${h.status}"`,
      `"${h.ticketId}"`,
      `"${h.studentName}"`,
      `"${h.college}"`,
      `"${h.eventTitle}"`,
      `"${h.message}"`
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `avento-scan-log-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-left select-none pb-14">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight flex items-center gap-2.5">
            <span>📷</span>
            <span>QR Attendance & Gate Control</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time optical camera scanner with instant verification & duplicate prevention
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
            }`}
            title={soundEnabled ? 'Mute audio feedback' : 'Unmute audio feedback'}
          >
            <span>{soundEnabled ? '🔔 Chime On' : '🔕 Muted'}</span>
          </button>

          {/* Event Filter Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#0F5D46]/20 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase text-[#5E6A68]">Event:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-xs font-bold text-[#0F5D46] bg-transparent focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="All">All Events ({events.length})</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Live Session Metric Counters (3-Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Admitted */}
        <div className="p-4 rounded-[22px] bg-white/90 border border-white/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E6A68]">
              TOTAL ADMITTED
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Verified
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F5D46] mt-2">
            {totalAdmitted}
            <span className="text-xs font-semibold text-[#5E6A68] ml-1.5">
              / {totalRegistered}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0F5D46] h-full rounded-full transition-all duration-500"
              style={{ width: `${checkInRate}%` }}
            />
          </div>
        </div>

        {/* Pending Passes */}
        <div className="p-4 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E6A68]">
              PENDING PASSES
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              ⏳ Awaiting Scan
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#D9B24A] mt-2">
            {totalRemaining}
            <span className="text-xs font-semibold text-[#5E6A68] ml-1.5">Attendees</span>
          </div>
          <span className="text-[11px] text-[#5E6A68] mt-2 block">
            Expected at gate turnstiles
          </span>
        </div>

        {/* Check-in Rate */}
        <div className="p-4 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E6A68]">
              CHECK-IN RATE
            </span>
            <span className="text-xs font-bold text-[#0F5D46] bg-[#EAF7F1] px-2 py-0.5 rounded-full border border-[#0F5D46]/20">
              ⚡ Live Pace
            </span>
          </div>
          <div className="text-3xl font-extrabold text-[#0F5D46] mt-2">
            {checkInRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-2 block">
            Capacity attendance tracked
          </span>
        </div>
      </div>

      {/* 3. Main Scanner & Result Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Camera Viewfinder & File Scanner (7 Cols) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.88) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="lg:col-span-7 p-5 sm:p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          {/* Viewfinder Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isCameraRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-xs font-bold text-[#0F5D46]">
                {isCameraRunning ? 'Camera Active • Ready to Scan' : 'Camera Standby'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Camera Switcher */}
              {cameraDevices.length > 1 && (
                <select
                  value={selectedCameraId}
                  onChange={handleCameraChange}
                  className="text-[11px] font-bold text-[#0F5D46] bg-white border border-[#0F5D46]/20 rounded-lg px-2 py-1 focus:outline-none cursor-pointer max-w-[150px] truncate"
                >
                  {cameraDevices.map(cam => (
                    <option key={cam.id} value={cam.id}>
                      {cam.label || `Camera ${cam.id.slice(0, 5)}`}
                    </option>
                  ))}
                </select>
              )}

              {/* Camera On / Off Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isCameraRunning) {
                    stopCamera()
                  } else {
                    startCamera(selectedCameraId)
                  }
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  isCameraRunning
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isCameraRunning ? 'Pause Camera' : 'Start Camera'}
              </button>
            </div>
          </div>

          {/* Scanner Viewfinder Box */}
          <div className="relative w-full aspect-4/3 sm:h-80 rounded-[22px] bg-black/95 overflow-hidden flex flex-col items-center justify-center p-2 border-2 border-[#0F5D46]/30 shadow-inner">
            {/* HTML5 QR Code Container (video element will be injected here) */}
            <div
              id="qr-reader-viewport"
              className="w-full h-full flex items-center justify-center overflow-hidden [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
            />

            {/* Overlaid Animated Laser Sweep when Camera is Running */}
            {isCameraRunning && (
              <motion.div
                animate={{ y: [-110, 110, -110] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-[#D9B24A] to-transparent shadow-[0_0_12px_#D9B24A] pointer-events-none z-20"
              />
            )}

            {/* Corner Alignment Crosshairs Overlay */}
            <div className="absolute inset-8 pointer-events-none flex items-center justify-center z-10">
              <div className="w-52 h-52 border border-dashed border-white/30 rounded-[18px] relative flex flex-col items-center justify-center text-center p-4">
                {!isCameraRunning && (
                  <div className="space-y-1">
                    <span className="text-3xl block opacity-80">📷</span>
                    <span className="text-xs font-bold text-white/90 block">
                      Camera Paused or Standby
                    </span>
                    <button
                      type="button"
                      onClick={() => startCamera(selectedCameraId)}
                      className="mt-2 pointer-events-auto px-3 py-1 bg-[#D9B24A] hover:bg-[#c49f3e] text-stone-900 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Turn On Camera
                    </button>
                  </div>
                )}

                {/* Reticle corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D9B24A]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D9B24A]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D9B24A]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D9B24A]" />
              </div>
            </div>

            {/* Processing Indicator Badge */}
            {isVerifying && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-30">
                <div className="p-4 rounded-2xl bg-white text-[#0F5D46] shadow-xl flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-[#0F5D46] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold font-mono">Verifying Pass Registry...</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Permission / Error Warning */}
          {cameraError && (
            <div className="p-3.5 rounded-[18px] bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <span className="text-lg shrink-0">⚠️</span>
                <div>
                  <span className="font-bold block text-[#0F5D46]">Camera Notice:</span>
                  <span className="text-[11.5px] leading-relaxed text-stone-700">{cameraError}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => startCamera(selectedCameraId)}
                className="px-3.5 py-1.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[12px] shrink-0 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
              >
                🔄 Retry Camera
              </button>
            </div>
          )}

          {/* File Upload / Drag-and-Drop QR Scanner Option */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#5E6A68]">
              <span className="font-bold text-[#0F5D46] block">No webcam available?</span>
              <span>Upload a screenshot or photo of the attendee pass:</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageFileScan(file)
                e.target.value = ''
              }}
            />

            <button
              type="button"
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-white hover:bg-[#EAF7F1] text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/25 shadow-2xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
            >
              <span>🖼</span>
              <span>{isUploadingImage ? 'Scanning Image...' : 'Upload Pass Image'}</span>
            </button>
          </div>

          {/* Quick Test Barcodes (from actual registrations or demo passes) */}
          <div className="pt-2 text-xs">
            <span className="text-[11px] text-[#5E6A68] font-bold block mb-1.5">
              Quick Test Passes:
            </span>
            <div className="flex flex-wrap gap-2">
              {currentRegistrations.slice(0, 3).map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setTicketInput(r.ticketId)
                    processTicketVerification(r.ticketId)
                  }}
                  className="px-2.5 py-1 rounded-[8px] bg-white border border-[#0F5D46]/20 font-mono text-[11px] text-[#0F5D46] hover:bg-[#EAF7F1] cursor-pointer"
                >
                  {r.ticketId} ({r.studentName?.split(' ')[0] || 'Attendee'})
                </button>
              ))}

              {currentRegistrations.length === 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketInput('AVT-WRK-3109')
                      processTicketVerification('AVT-WRK-3109')
                    }}
                    className="px-2.5 py-1 rounded-[8px] bg-white border border-[#0F5D46]/20 font-mono text-[11px] text-[#0F5D46] hover:bg-[#EAF7F1] cursor-pointer"
                  >
                    AVT-WRK-3109 (Valid)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketInput('AVT-HACK-8492')
                      processTicketVerification('AVT-HACK-8492')
                    }}
                    className="px-2.5 py-1 rounded-[8px] bg-white border border-amber-300 font-mono text-[11px] text-amber-800 hover:bg-amber-50 cursor-pointer"
                  >
                    AVT-HACK-8492 (Duplicate)
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setTicketInput('AVT-FAKE-9999')
                  processTicketVerification('AVT-FAKE-9999')
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
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.88) 100%)',
              backdropFilter: 'blur(20px)'
            }}
            className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#0F5D46]">
                Manual Ticket Pass Entry
              </h3>
              <span className="text-[10px] font-mono text-[#5E6A68] uppercase">
                Desk Check-In
              </span>
            </div>
            <p className="text-xs text-[#5E6A68]">
              Type ticket ID or student email if smartphone screen is cracked or dim
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                processTicketVerification(ticketInput)
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={ticketInput}
                onChange={e => setTicketInput(e.target.value)}
                placeholder="e.g. AVT-HACK-8492 or Pass Payload"
                className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none uppercase"
              />

              <button
                type="submit"
                disabled={isVerifying || !ticketInput.trim()}
                className="w-full py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Checking Registry...</span>
                  </>
                ) : (
                  <span>Verify & Admit Attendee →</span>
                )}
              </button>
            </form>
          </div>

          {/* Validation Result Cards */}
          <AnimatePresence mode="wait">
            {scanResult && (
              <motion.div
                key={scanResult.ticketId + scanResult.status}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={`p-5 rounded-[24px] border text-xs text-left select-none space-y-3 shadow-md ${
                  scanResult.status === 'VALID'
                    ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                    : scanResult.status === 'ALREADY_SCANNED'
                    ? 'bg-amber-50/95 border-amber-300 text-amber-950'
                    : 'bg-red-50/95 border-red-300 text-red-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-2xs ${
                    scanResult.status === 'VALID'
                      ? 'bg-emerald-600 text-white'
                      : scanResult.status === 'ALREADY_SCANNED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}>
                    {scanResult.status === 'VALID'
                      ? '✓ ADMISSION GRANTED'
                      : scanResult.status === 'ALREADY_SCANNED'
                      ? '⚠️ DUPLICATE DETECTED'
                      : '✕ INVALID PASS'}
                  </span>
                  <span className="font-mono text-[11px] font-bold opacity-80">
                    {scanResult.ticketId}
                  </span>
                </div>

                <p className="font-semibold text-xs leading-relaxed">
                  {scanResult.message}
                </p>

                {scanResult.attendee && (
                  <div className="p-3 rounded-[16px] bg-white/90 border border-current/15 space-y-1.5 text-xs shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#5E6A68]">Attendee:</span>
                      <span className="font-bold text-[#0F5D46]">{scanResult.attendee.studentName}</span>
                    </div>

                    {scanResult.attendee.college && (
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-[#5E6A68]">Institution:</span>
                        <span className="font-medium text-[#1F2937] truncate max-w-[180px]">
                          {scanResult.attendee.college}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#5E6A68]">Event:</span>
                      <span className="font-medium text-[#1F2937] truncate max-w-[180px]">
                        {scanResult.attendee.eventTitle}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-[#5E6A68]">Seat / Zone:</span>
                      <span className="font-mono font-bold text-[#D9B24A]">
                        {scanResult.attendee.seatNumber || 'GA-Pass'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                      <span className="text-[11px] text-[#5E6A68]">Turnstile Stamp:</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-700">
                        {scanResult.attendee.checkedInTime}
                      </span>
                    </div>
                  </div>
                )}

                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('registrations')}
                    className="text-[11px] font-bold text-[#0F5D46] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>View in Registrations Roster</span>
                    <span>→</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Live Scan Activity Audit Trail Table */}
      <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Session Scan History & Gate Audit Log
            </h3>
            <p className="text-xs text-[#5E6A68]">
              Chronological log of passes processed at this station ({scanHistory.length} recorded)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={scanHistory.length === 0}
              onClick={handleExportHistoryCSV}
              className="px-3 py-1.5 bg-[#EAF7F1] hover:bg-[#0F5D46] text-[#0F5D46] hover:text-white disabled:opacity-50 text-xs font-bold rounded-lg border border-[#0F5D46]/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥 Export CSV</span>
            </button>

            <button
              type="button"
              disabled={scanHistory.length === 0}
              onClick={() => setScanHistory([])}
              className="px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-700 disabled:opacity-50 text-xs font-bold rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              Clear Log
            </button>
          </div>
        </div>

        {scanHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-[18px]">
            No tickets scanned in this session yet. Aim camera at a student ticket pass or upload a pass image.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Pass ID</th>
                  <th className="py-2.5 px-3">Attendee</th>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">Gate Pass Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {scanHistory.map(entry => (
                  <tr key={entry.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-gray-500 text-[11px]">
                      {entry.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        entry.status === 'VALID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : entry.status === 'ALREADY_SCANNED'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {entry.status === 'VALID' ? 'Admitted' : entry.status === 'ALREADY_SCANNED' ? 'Duplicate' : 'Rejected'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0F5D46]">
                      {entry.ticketId}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">
                      {entry.studentName}
                    </td>
                    <td className="py-2.5 px-3 text-[#5E6A68] truncate max-w-[150px]">
                      {entry.eventTitle}
                    </td>
                    <td className="py-2.5 px-3 text-[#5E6A68] truncate max-w-[200px]">
                      {entry.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
