import React from 'react'
import QRCode from 'react-qr-code'
import { motion } from 'framer-motion'

export default function QRCodeScannerBadge({ value = 'AVENTO:PASS:DEFAULT', size = 128 }) {
  return (
    <div className="flex flex-col items-center select-none">
      {/* QR Container with Laser Scan Animation */}
      <div className="relative p-3 rounded-[20px] bg-white border border-[#0F5D46]/20 shadow-[0_8px_20px_rgba(15,93,70,0.08)] overflow-hidden group">
        <QRCode
          value={value}
          size={size}
          fgColor="#0F5D46"
          bgColor="#FFFFFF"
          level="H"
        />

        {/* Animated Laser Scan Bar */}
        <motion.div
          animate={{
            y: [0, size, 0]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#D9B24A] to-transparent shadow-[0_0_8px_#D9B24A] pointer-events-none"
        />

        {/* Subtle Scanner Corner Guides */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#0F5D46]" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-[#0F5D46]" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-[#0F5D46]" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-[#0F5D46]" />
      </div>

      <div className="mt-2 text-center">
        <span className="text-[10px] uppercase font-mono font-extrabold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#0F5D46]/20">
          ⚡ 0.3s Fast-Track QR
        </span>
      </div>
    </div>
  )
}
