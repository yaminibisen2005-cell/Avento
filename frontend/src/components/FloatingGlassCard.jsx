import React from 'react'

export function QRAttendanceCard({ className = '', style = {} }) {
  const hasWidth = className.includes('w-')
  const hasHeight = className.includes('h-')

  return (
    <div 
      style={{
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.12)',
        ...style
      }}
      className={`rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3.5 select-none transition-all duration-300 hover:scale-[1.02] cursor-default ${!hasWidth ? 'w-[220px]' : ''} ${!hasHeight ? 'h-[90px]' : ''} ${className}`}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[15px] bg-[#0F5D46]/10 border border-[#0F5D46]/20 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs">
        📱
      </div>
      <div className="text-left overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-[13.5px] font-bold text-[#0F5D46] tracking-tight truncate">
            QR Attendance
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
        </div>
        <div className="text-[10px] sm:text-[11px] font-medium text-[#5E6A68] mt-0.5 truncate">
          Instant 0.3s Scan
        </div>
      </div>
    </div>
  )
}

export function CertificateCard({ className = '', style = {} }) {
  const hasWidth = className.includes('w-')
  const hasHeight = className.includes('h-')

  return (
    <div 
      style={{
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.12)',
        ...style
      }}
      className={`rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3.5 select-none transition-all duration-300 hover:scale-[1.02] cursor-default ${!hasWidth ? 'w-[220px]' : ''} ${!hasHeight ? 'h-[90px]' : ''} ${className}`}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[15px] bg-[#D9B24A]/15 border border-[#D9B24A]/30 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs">
        📄
      </div>
      <div className="text-left overflow-hidden">
        <div className="text-xs sm:text-[13.5px] font-bold text-[#0F5D46] tracking-tight truncate">
          Certificate Issued
        </div>
        <div className="text-[10px] sm:text-[11px] font-medium text-[#5E6A68] mt-0.5 truncate">
          Blockchain Verified
        </div>
      </div>
    </div>
  )
}

export function ParticipantsCard({ className = '', style = {} }) {
  const hasWidth = className.includes('w-')
  const hasHeight = className.includes('h-')

  return (
    <div 
      style={{
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.12)',
        ...style
      }}
      className={`rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3.5 select-none cursor-default ${!hasWidth ? 'w-[220px]' : ''} ${!hasHeight ? 'h-[90px]' : ''} ${className}`}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[15px] bg-[#0F5D46]/10 border border-[#0F5D46]/20 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs">
        👥
      </div>
      <div className="text-left overflow-hidden">
        <div className="text-xs sm:text-[13.5px] font-bold text-[#0F5D46] tracking-tight truncate">
          Participants
        </div>
        <div className="text-[10px] sm:text-[11px] font-bold text-[#0F5D46]/85 mt-0.5 truncate">
          1,248 Joined
        </div>
      </div>
    </div>
  )
}

export function PrizePoolCard({ className = '', style = {} }) {
  const hasWidth = className.includes('w-')
  const hasHeight = className.includes('h-')

  return (
    <div 
      style={{
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.12)',
        ...style
      }}
      className={`rounded-[22px] bg-white/85 backdrop-blur-[20px] border border-white/80 p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3.5 select-none cursor-default ${!hasWidth ? 'w-[220px]' : ''} ${!hasHeight ? 'h-[90px]' : ''} ${className}`}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[15px] bg-gradient-to-br from-[#FAF0D7] to-[#F3E5BE] border border-[#D9B24A]/40 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-xs">
        🏆
      </div>
      <div className="text-left overflow-hidden">
        <div className="text-xs sm:text-[13.5px] font-bold text-[#0F5D46] tracking-tight truncate">
          Prize Pool
        </div>
        <div className="text-[10px] sm:text-[11px] font-bold text-[#D9B24A] mt-0.5 truncate">
          ₹5,00,000 Guaranteed
        </div>
      </div>
    </div>
  )
}
