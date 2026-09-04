import React from 'react'

export default function AventoDashboardScreen() {
  const sidebarItems = [
    { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', active: true },
    { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', active: false },
    { name: 'Registrations', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', active: false },
    { name: 'Check-ins', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', active: false },
    { name: 'Certificates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', active: false },
    { name: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', active: false },
    { name: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', active: false },
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z', active: false }
  ]

  return (
    <div className="w-full h-full bg-[#09120F] text-white flex flex-col font-sans select-none overflow-hidden text-[10.5px] leading-tight">
      {/* OS & App Topbar */}
      <div className="h-8 bg-[#070D0B] border-b border-[#162721] px-3 flex items-center justify-between">
        {/* Left: Window Controls + Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-sm"></span>
          </div>
          <div className="h-3.5 w-[1px] bg-[#162721] mx-1"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-[#0F4C3A] flex items-center justify-center font-extrabold text-[9px] text-[#C89B3C] border border-[#C89B3C]/30 shadow-xs">
              A
            </span>
            <span className="font-bold tracking-tight text-[11px] text-white">AVENTO</span>
            <span className="text-[8.5px] px-1.5 py-0.5 rounded-full bg-[#0F4C3A]/60 text-[#4ADE80] font-mono border border-[#0F4C3A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse"></span>
              LIVE SYNC
            </span>
          </div>
        </div>

        {/* Center: Search / Event Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-[#0F1E19] border border-[#1B352B] px-2.5 py-1 rounded-md text-[#94A3B8] text-[9.5px] w-52">
          <svg className="w-3 h-3 text-[#C89B3C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-white/80 font-medium truncate">National HackSummit 2026</span>
          <span className="ml-auto text-[8.5px] text-[#64748B]">⌘K</span>
        </div>

        {/* Right: Upcoming Events Pill & Scanner Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-[#162A22] text-[#C89B3C] text-[9px] border border-[#C89B3C]/30">
            <span>📅</span>
            <span>Next: AI Summit (48h)</span>
          </div>
          <div className="flex items-center gap-1 bg-[#0F4C3A]/60 border border-[#0F4C3A] px-2 py-0.5 rounded text-[9.5px] text-[#4ADE80]">
            <span>⚡</span>
            <span className="font-semibold text-white/90">Scanner 0.3s</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-[#18392B] border border-[#C89B3C]/40 flex items-center justify-center text-[9px] font-bold text-[#FAF8F3]">
            AR
          </div>
        </div>
      </div>

      {/* Main App Content Layout with 8-Item Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Full 8-Item Sidebar */}
        <div className="w-28 bg-[#070D0B] border-r border-[#162721] py-2 px-1.5 flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <div className="text-[8px] uppercase tracking-wider text-white/40 font-bold px-2 py-0.5">
              Workspace
            </div>
            {sidebarItems.map((item) => (
              <div 
                key={item.name}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9.5px] font-medium transition-colors cursor-pointer ${
                  item.active 
                    ? 'bg-gradient-to-r from-[#0F4C3A] to-[#0A3629] text-[#C89B3C] border border-[#C89B3C]/30 font-bold shadow-xs' 
                    : 'text-white/60 hover:text-white hover:bg-[#0F1E19]'
                }`}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="truncate">{item.name}</span>
                {item.active && (
                  <span className="w-1 h-1 rounded-full bg-[#C89B3C] ml-auto shrink-0"></span>
                )}
              </div>
            ))}
          </div>

          <div className="px-2 py-1 bg-[#0F1E19]/60 rounded border border-[#162721] text-[8px] text-white/50">
            <div className="text-[#C89B3C] font-bold">Avento v2.4</div>
            <div className="truncate">Enterprise Tier</div>
          </div>
        </div>

        {/* Dashboard Core Body */}
        <div className="flex-1 bg-[#09120F] p-2.5 overflow-hidden flex flex-col gap-2">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-white tracking-tight flex items-center gap-1.5">
                Live Event Control Deck
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-[#C89B3C]/15 text-[#C89B3C] border border-[#C89B3C]/30 font-medium">
                  Grand Hall • Online
                </span>
              </div>
              <p className="text-[8.5px] text-white/50">Real-time attendance & ticket gateway synchronization</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded bg-[#10241D] text-[#4ADE80] font-mono text-[8.5px] border border-[#18392E]">
                ⚡ 99.98% Gateway
              </span>
              <span className="px-2 py-0.5 rounded bg-[#0F4C3A] text-white font-medium text-[8.5px] border border-[#C89B3C]/30">
                Export CSV ▾
              </span>
            </div>
          </div>

          {/* 4 Analytics Cards: Total Registered, QR Attendance, Prize Pool, Certificates */}
          <div className="grid grid-cols-4 gap-1.5">
            {/* Card 1: Total Registered */}
            <div className="bg-[#0E1A16]/90 border border-[#183228] rounded-lg p-2 relative">
              <div className="text-[8px] uppercase tracking-wider text-white/50 font-semibold">Total Registered</div>
              <div className="text-[14px] font-extrabold text-white mt-0.5 tracking-tight flex items-baseline gap-1">
                1,248
                <span className="text-[8px] text-[#4ADE80] font-mono">+18%</span>
              </div>
              <div className="w-full bg-[#162D24] h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#4ADE80] h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            {/* Card 2: QR Attendance */}
            <div className="bg-[#0E1A16]/90 border border-[#183228] rounded-lg p-2 relative">
              <div className="text-[8px] uppercase tracking-wider text-white/50 font-semibold">QR Attendance</div>
              <div className="text-[14px] font-extrabold text-[#4ADE80] mt-0.5 tracking-tight flex items-baseline gap-1">
                842
                <span className="text-[8px] text-white/60 font-mono">67.5%</span>
              </div>
              <div className="w-full bg-[#162D24] h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#C89B3C] h-full rounded-full" style={{ width: '67.5%' }}></div>
              </div>
            </div>

            {/* Card 3: Prize Pool */}
            <div className="bg-[#0E1A16]/90 border border-[#183228] rounded-lg p-2 relative">
              <div className="text-[8px] uppercase tracking-wider text-[#C89B3C] font-semibold">Prize Pool</div>
              <div className="text-[14px] font-extrabold text-white mt-0.5 tracking-tight">
                ₹5,00,000
              </div>
              <div className="text-[7.5px] text-[#4ADE80] font-mono mt-0.5">● Escrow Locked</div>
            </div>

            {/* Card 4: Certificates */}
            <div className="bg-[#0E1A16]/90 border border-[#183228] rounded-lg p-2 relative">
              <div className="text-[8px] uppercase tracking-wider text-white/50 font-semibold">Certificates</div>
              <div className="text-[14px] font-extrabold text-white mt-0.5 tracking-tight flex items-baseline gap-1">
                1,248
                <span className="text-[8px] text-[#C89B3C]">Ready</span>
              </div>
              <div className="text-[7.5px] text-white/50 font-mono mt-0.5">Blockchain signed</div>
            </div>
          </div>

          {/* Dual Visuals: Attendance Velocity Chart & Revenue Graph */}
          <div className="grid grid-cols-12 gap-1.5">
            {/* Attendance Chart (7 cols) */}
            <div className="col-span-7 bg-[#0C1814] border border-[#183228] rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-bold text-white/90">Attendance Velocity</span>
                <span className="text-[8px] font-mono text-[#C89B3C]">Peak: 142/min</span>
              </div>

              <div className="relative w-full h-16 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="screenAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#0F4C3A" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0F4C3A" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="screenLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0F4C3A" />
                      <stop offset="50%" stopColor="#4ADE80" />
                      <stop offset="100%" stopColor="#C89B3C" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,60 Q 40,55 75,40 T 150,30 T 225,15 T 300,8 L 300,70 L 0,70 Z" fill="url(#screenAreaGrad)" />
                  <path d="M 0,60 Q 40,55 75,40 T 150,30 T 225,15 T 300,8" fill="none" stroke="url(#screenLineGrad)" strokeWidth="2" />
                  <circle cx="150" cy="30" r="2.5" fill="#4ADE80" />
                  <circle cx="300" cy="8" r="3" fill="#FAF8F3" stroke="#0F4C3A" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex justify-between text-[7.5px] text-white/40 font-mono pt-1 border-t border-[#142A22]">
                <span>08:00 AM</span>
                <span>10:30 AM</span>
                <span>01:00 PM</span>
                <span>NOW (LIVE)</span>
              </div>
            </div>

            {/* Revenue Graph (5 cols) */}
            <div className="col-span-5 bg-[#0C1814] border border-[#183228] rounded-lg p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-white/90">Revenue Graph</span>
                <span className="text-[8px] font-bold text-[#4ADE80]">₹8.42L</span>
              </div>

              {/* Bar Graph Visual */}
              <div className="flex items-end justify-between gap-1.5 h-14 pt-1">
                {[
                  { label: 'T-4', height: '40%' },
                  { label: 'T-3', height: '65%' },
                  { label: 'T-2', height: '50%' },
                  { label: 'T-1', height: '85%' },
                  { label: 'TODAY', height: '100%', highlight: true }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div 
                      className={`w-full rounded-t-sm transition-all ${
                        bar.highlight 
                          ? 'bg-gradient-to-t from-[#0F4C3A] to-[#C89B3C]' 
                          : 'bg-[#183228]'
                      }`}
                      style={{ height: bar.height }}
                    ></div>
                    <span className="text-[6.5px] text-white/40 font-mono">{bar.label}</span>
                  </div>
                ))}
              </div>

              <div className="text-[7.5px] text-[#C89B3C] font-mono pt-1 border-t border-[#142A22] flex items-center justify-between">
                <span>Razorpay Gateway</span>
                <span>100% Settled</span>
              </div>
            </div>
          </div>

          {/* Bottom Split: Recent Check-ins + Upcoming Events */}
          <div className="flex-1 grid grid-cols-12 gap-1.5 min-h-0">
            {/* Recent Check-ins Feed (8 cols) */}
            <div className="col-span-8 bg-[#0C1814] border border-[#183228] rounded-lg p-2 flex flex-col justify-around">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-white/90">Recent Check-ins (Live Scan)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-ping"></span>
              </div>

              <div className="flex items-center justify-between bg-[#11231D] px-2 py-0.5 rounded border border-[#1A372C]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0F4C3A] text-[7.5px] text-[#C89B3C] font-bold flex items-center justify-center">AS</span>
                  <span className="text-[8.5px] font-medium text-white">Arjun Sharma • VIP</span>
                </div>
                <span className="text-[7.5px] font-mono text-[#4ADE80]">✓ 0.2s</span>
              </div>

              <div className="flex items-center justify-between bg-[#11231D] px-2 py-0.5 rounded border border-[#1A372C]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#194E3C] text-[7.5px] text-[#4ADE80] font-bold flex items-center justify-center">PD</span>
                  <span className="text-[8.5px] font-medium text-white">Priya Deshmukh • Lead</span>
                </div>
                <span className="text-[7.5px] font-mono text-[#4ADE80]">✓ 0.3s</span>
              </div>
            </div>

            {/* Upcoming Events Preview (4 cols) */}
            <div className="col-span-4 bg-[#0C1814] border border-[#183228] rounded-lg p-2 flex flex-col justify-around">
              <div className="text-[9px] font-bold text-white/90">Upcoming</div>
              <div className="bg-[#11231D] p-1 rounded border border-[#1A372C]">
                <div className="text-[8px] font-bold text-[#C89B3C] truncate">Robotics Fest</div>
                <div className="text-[7px] text-white/50">Nov 02 • BITS</div>
              </div>
              <div className="bg-[#11231D] p-1 rounded border border-[#1A372C]">
                <div className="text-[8px] font-bold text-white/90 truncate">Web3 Hack</div>
                <div className="text-[7px] text-white/50">Jan 18 • Virtual</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
