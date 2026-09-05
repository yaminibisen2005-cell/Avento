import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function CertificateCard({ certificate, studentName = 'Student' }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 2000)
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(254, 252, 248, 0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 rounded-[26px] border border-white/70 shadow-[0_12px_36px_rgba(15,93,70,0.06)] hover:shadow-[0_20px_50px_rgba(15,93,70,0.12)] flex flex-col justify-between group transition-all select-none relative overflow-hidden"
    >
      {/* Top Gold Corner Accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#D9B24A]/15 via-transparent to-transparent pointer-events-none" />

      {/* Certificate Frame Mini Preview */}
      <div className="p-4 rounded-[18px] bg-gradient-to-b from-[#FFFDF9] to-[#F9F7F0] border-2 border-[#D9B24A]/30 shadow-inner mb-5 relative text-center">
        {/* Decorative Gold Seal */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D9B24A] via-[#ECC968] to-[#B38C2A] mx-auto flex items-center justify-center text-white text-base shadow-xs mb-2">
          ★
        </div>

        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D9B24A] block">
          AVENTO CREDENTIAL NETWORK
        </span>
        <h4 className="font-display font-bold text-sm text-[#0F5D46] mt-1">
          {certificate.grade || 'Certificate of Excellence'}
        </h4>
        <p className="text-[11px] text-[#5E6A68] mt-0.5">Awarded to</p>
        <div className="font-extrabold text-sm text-[#1F2937] font-serif tracking-wide mt-0.5">
          {studentName}
        </div>
        <p className="text-[10px] text-[#6B7478] mt-1 truncate">
          For completing {certificate.eventTitle}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-5 text-left">
        <h3 className="font-display font-bold text-base text-[#0F5D46] leading-snug">
          {certificate.eventTitle}
        </h3>

        <div className="flex flex-col gap-1 text-xs text-[#5E6A68]">
          <div className="flex items-center justify-between">
            <span>Issuer:</span>
            <span className="font-semibold text-[#1F2937]">{certificate.organizer}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Issued Date:</span>
            <span className="font-medium">{certificate.issueDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>ID:</span>
            <span className="font-mono text-[11px] text-[#D9B24A] font-bold">{certificate.id}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-[#0F5D46]/[0.08] flex items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>📥</span>
          <span>{downloading ? 'Preparing PDF...' : 'Download PDF'}</span>
        </button>

        <a
          href={certificate.verifyUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2.5 bg-[#D9B24A]/10 hover:bg-[#D9B24A]/20 text-[#8C6F1E] font-bold text-xs rounded-[14px] border border-[#D9B24A]/30 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>✓</span>
          <span>Verify</span>
        </a>
      </div>
    </motion.div>
  )
}
