import React from 'react'
import AdminKpiCard from '../cards/AdminKpiCard'

export default function TabAdminOverview({ 
  overviewData, 
  onNavigateTab 
}) {
  const kpis = overviewData?.kpis || {
    totalUsers: 1842,
    students: 1620,
    organizers: 218,
    admins: 4,
    activeEvents: 12,
    pendingEvents: 3,
    todayRegistrations: 84,
    totalRevenue: 842500,
    certificatesIssued: 1280,
    attendanceRate: 92
  }

  const activities = overviewData?.recentActivity || []
  const registrations = overviewData?.latestRegistrations || []
  const _organizers = overviewData?.latestOrganizers || []
  const payments = overviewData?.latestPayments || []

  return (
    <div className="space-y-8 text-left select-none pb-12">
      {/* 1. TOP 10 KPI CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
              Ecosystem Overview & Pulse
            </h2>
            <p className="text-xs sm:text-sm text-[#5E6A68] mt-0.5">
              Live enterprise telemetry across university communities, ticketing, and verification
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>All Systems Operational</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <AdminKpiCard
            title="Total Users"
            value={kpis.totalUsers.toLocaleString()}
            subtitle="Platform-wide registered"
            icon="👥"
            trend="+14%"
            isPositive={true}
          />
          <AdminKpiCard
            title="Students"
            value={kpis.students.toLocaleString()}
            subtitle="Verified campus delegates"
            icon="🎓"
            trend="+18%"
            isPositive={true}
          />
          <AdminKpiCard
            title="Organizers"
            value={kpis.organizers}
            subtitle="Academic & technical clubs"
            icon="🏛"
            trend="+5"
            isPositive={true}
          />
          <AdminKpiCard
            title="Root Admins"
            value={kpis.admins}
            subtitle="Security personnel"
            icon="👑"
            isPositive={true}
          />
          <AdminKpiCard
            title="Active Events"
            value={kpis.activeEvents}
            subtitle="Public & registering"
            icon="🗓"
            trend="+3"
            isPositive={true}
          />
          <AdminKpiCard
            title="Pending Events"
            value={kpis.pendingEvents}
            subtitle="Compliance queue"
            icon="⏳"
            trend="Needs review"
            isPositive={false}
          />
          <AdminKpiCard
            title="Today's Regs"
            value={kpis.todayRegistrations}
            subtitle="24h checkout volume"
            icon="⚡"
            trend="+28%"
            isPositive={true}
          />
          <AdminKpiCard
            title="Total Revenue"
            value={`₹${(kpis.totalRevenue / 100000).toFixed(2)}L`}
            subtitle="Direct gate settlements"
            icon="💳"
            trend="+24%"
            isPositive={true}
          />
          <AdminKpiCard
            title="Certificates"
            value={kpis.certificatesIssued}
            subtitle="Tamper-proof credentials"
            icon="📜"
            trend="+120"
            isPositive={true}
          />
          <AdminKpiCard
            title="Avg Attendance"
            value={`${kpis.attendanceRate}%`}
            subtitle="Optical scan rate"
            icon="🎯"
            trend="+2.4%"
            isPositive={true}
          />
        </div>
      </div>

      {/* 2. PENDING APPROVALS ACTION BANNER */}
      <div className="p-5 rounded-[24px] bg-gradient-to-r from-amber-500/10 via-amber-50 to-white border border-amber-300/60 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-amber-500/15 text-amber-800 flex items-center justify-center text-2xl shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#0F5D46]">
              2 Organizers & 2 Events Awaiting Authorization
            </h3>
            <p className="text-xs text-[#5E6A68]">
              Verify institutional endorsement letters and competition rulebooks before unlocking public tickets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('organizer-approval')}
            className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs cursor-pointer transition-all"
          >
            Review Organizers →
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('events-approval')}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-[#0F5D46] font-bold text-xs rounded-[14px] border border-[#0F5D46]/20 shadow-2xs cursor-pointer transition-all"
          >
            Review Events →
          </button>
        </div>
      </div>

      {/* 3. FOUR-QUADRANT AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Activity Stream (6 Cols) */}
        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          className="lg:col-span-6 p-6 rounded-[28px] border border-white/80 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#0F5D46]">
              Real-time Administrative Audit Stream
            </h3>
            <span className="text-[10.5px] font-mono text-gray-400">Live Webhooks</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-[18px] bg-white/85 border border-[#0F5D46]/10 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{act.type === 'approval' ? '🏛' : act.type === 'payment' ? '💳' : act.type === 'event' ? '🗓' : '👤'}</span>
                  <div>
                    <span className="font-bold text-[#0F5D46] block">{act.title}</span>
                    <span className="text-[10.5px] text-[#5E6A68]">{act.time}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Registrations & Payments (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Latest Registrations */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
              backdropFilter: 'blur(20px)'
            }}
            className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#0F5D46]">
                Recent Attendee Registrations
              </h3>
              <button 
                type="button" 
                onClick={() => onNavigateTab('users')}
                className="text-[11px] font-bold text-[#D9B24A] hover:underline cursor-pointer"
              >
                View Roster →
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {registrations.map((r, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1F2937] block">{r.name}</span>
                    <span className="text-[11px] text-[#5E6A68]">{r.college} • {r.event}</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-gray-400">{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Transactions */}
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
              backdropFilter: 'blur(20px)'
            }}
            className="p-6 rounded-[28px] border border-white/80 shadow-xs space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#0F5D46]">
                Latest Settled Transactions
              </h3>
              <button 
                type="button" 
                onClick={() => onNavigateTab('payments')}
                className="text-[11px] font-bold text-[#D9B24A] hover:underline cursor-pointer"
              >
                Open Ledger →
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {payments.map((p, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0F5D46]">{p.txn}</span>
                    <span className="text-[11px] text-gray-400">via {p.gateway}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F5D46]">{p.amount}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
