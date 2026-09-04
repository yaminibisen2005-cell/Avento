import React from 'react'
import OrganizerStatsCard from '../cards/OrganizerStatsCard'

export default function TabDashboardOverview({ 
  overviewData, 
  onNavigateTab 
}) {
  const stats = overviewData?.stats || {
    totalEvents: 4,
    totalRegistrations: 1194,
    todayAttendance: 94,
    totalRevenue: 481454,
    certificatesIssued: 840,
    pendingApprovals: 3
  }

  const schedule = overviewData?.upcomingSchedule || []
  const activities = overviewData?.recentActivity || []

  return (
    <div className="space-y-8 text-left select-none pb-12">
      {/* 1. TOP STATS CARDS (6-Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <OrganizerStatsCard
          title="Total Events"
          value={stats.totalEvents}
          subtitle="3 Active • 1 Draft"
          icon="🗓"
          trend="+1"
          isPositive={true}
        />
        <OrganizerStatsCard
          title="Registrations"
          value={stats.totalRegistrations.toLocaleString()}
          subtitle="Across all formats"
          icon="👥"
          trend="+18%"
          isPositive={true}
        />
        <OrganizerStatsCard
          title="Attendance"
          value={`${stats.todayAttendance}%`}
          subtitle="Today's check-ins"
          icon="⚡"
          trend="+4%"
          isPositive={true}
        />
        <OrganizerStatsCard
          title="Total Revenue"
          value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`}
          subtitle="Direct settlements"
          icon="💳"
          trend="+22%"
          isPositive={true}
        />
        <OrganizerStatsCard
          title="Certificates"
          value={stats.certificatesIssued}
          subtitle="Blockchain verified"
          icon="🎓"
          trend="+120"
          isPositive={true}
        />
        <OrganizerStatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          subtitle="Review required"
          icon="⏳"
          trend="3 action"
          isPositive={false}
        />
      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="p-5 rounded-[24px] bg-white/85 border border-[#0F5D46]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display font-bold text-sm text-[#0F5D46]">
            Quick Management Actions
          </h3>
          <p className="text-xs text-[#5E6A68]">
            Direct shortcuts to high-frequency event desk operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('create-event')}
            className="px-4 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>+</span>
            <span>Create New Event</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2.5 bg-[#EAF7F1] hover:bg-[#d5eee2] text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>📷</span>
            <span>Open QR Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('certificates')}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#0F5D46] font-bold text-xs rounded-[14px] border border-gray-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>🎓</span>
            <span>Issue Certificates</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('revenue')}
            className="px-4 py-2.5 bg-white hover:bg-gray-50 text-[#5E6A68] font-bold text-xs rounded-[14px] border border-gray-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>📊</span>
            <span>Export Financials</span>
          </button>
        </div>
      </div>

      {/* 3. TWO-COLUMN LAYOUT: TODAY'S SCHEDULE & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Today's Schedule (7 Cols) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="lg:col-span-7 p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Today's Operations Schedule
              </h3>
              <p className="text-xs text-[#5E6A68]">
                Real-time milestone roadmap for on-premise coordinators
              </p>
            </div>
            <span className="text-xs font-bold text-[#D9B24A] bg-[#D9B24A]/10 border border-[#D9B24A]/30 px-2.5 py-1 rounded-full">
              Live Desk
            </span>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-[18px] bg-white/80 border border-[#0F5D46]/10 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-1 rounded-full text-[11px]">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#1F2937] leading-tight">{item.title}</h4>
                    <span className="text-[11px] text-[#5E6A68]">{item.event}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  item.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700'
                    : item.status === 'Ongoing'
                    ? 'bg-[#D9B24A]/20 text-[#8C6F1E] animate-pulse'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline (5 Cols) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="lg:col-span-5 p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Live Activity Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F5D46]">{act.text}</span>
                </div>
                <span className="text-[10.5px] text-[#5E6A68] block">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
