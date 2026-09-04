import React, { useState } from 'react'
import { ticketService } from '../../services/ticketService'

export default function TicketActions({ ticket }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [downloadingPng, setDownloadingPng] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true)
    await ticketService.downloadTicketPdf(ticket)
    setDownloadingPdf(false)
  }

  const handleDownloadPng = async () => {
    setDownloadingPng(true)
    await ticketService.downloadTicketPng(ticket)
    setDownloadingPng(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ticket.title || ticket.eventTitle,
        text: `Check out my verified ticket pass for ${ticket.title || ticket.eventTitle} on AVENTO!`,
        url: window.location.href
      }).catch(() => {})
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGoogleCalendar = () => {
    const url = ticketService.generateGoogleCalendarUrl(ticket)
    window.open(url, '_blank')
  }

  const handleAppleCalendar = () => {
    ticketService.downloadAppleCalendarIcs(ticket)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 select-none">
      {/* 1. Download PDF */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={downloadingPdf}
        className="px-3.5 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[12px] shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        <span>📄</span>
        <span>{downloadingPdf ? 'Saving PDF...' : 'Download PDF'}</span>
      </button>

      {/* 2. Download PNG */}
      <button
        type="button"
        onClick={handleDownloadPng}
        disabled={downloadingPng}
        className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#0F5D46] font-bold text-xs rounded-[12px] border border-[#0F5D46]/20 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        <span>🖼</span>
        <span>{downloadingPng ? 'Rendering...' : 'Download PNG'}</span>
      </button>

      {/* 3. Share Ticket */}
      <button
        type="button"
        onClick={handleShare}
        className="px-3 py-2 bg-white hover:bg-gray-50 text-[#5E6A68] hover:text-[#0F5D46] font-bold text-xs rounded-[12px] border border-gray-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <span>🔗</span>
        <span>{copied ? 'Copied!' : 'Share'}</span>
      </button>

      {/* 4. Google Calendar */}
      <button
        type="button"
        onClick={handleGoogleCalendar}
        className="px-3 py-2 bg-[#FAF8F2] hover:bg-[#F2EFE8] text-[#0F5D46] font-bold text-xs rounded-[12px] border border-[#0F5D46]/15 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        title="Add to Google Calendar"
      >
        <span>📅</span>
        <span className="hidden sm:inline">Google Cal</span>
      </button>

      {/* 5. Apple Calendar */}
      <button
        type="button"
        onClick={handleAppleCalendar}
        className="px-3 py-2 bg-[#FAF8F2] hover:bg-[#F2EFE8] text-[#0F5D46] font-bold text-xs rounded-[12px] border border-[#0F5D46]/15 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
        title="Add to Apple Calendar (.ics)"
      >
        <span>🍏</span>
        <span className="hidden sm:inline">Apple Cal</span>
      </button>
    </div>
  )
}
