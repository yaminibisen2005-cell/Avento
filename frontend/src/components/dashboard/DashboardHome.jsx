import React from 'react'
import { motion } from 'framer-motion'
import StatsCard from './StatsCard'
import EventCard from './EventCard'

export default function DashboardHome({ 
  data, 
  onNavigateTab, 
  onRegisterEvent, 
  onViewTicket,
  onViewDetails
}) {
  const stats = data?.stats || {
    registeredEvents: 6,
    upcomingEvents: 2,
    certificatesEarned: 4,
    attendanceRate: 96
  }

  const upcomingEvents = data?.upcomingEvents || []
  const recommendedEvents = data?.recommendedEvents || []
  const recentActivity = data?.recentActivity || []

  return (
    <div className="space-y-10 text-left select-none pb-12">
      {/* ================= SECTION 1: 4 STATISTICS CARDS ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-[#0F5D46] tracking-tight">
            Overview Metrics
          </h2>
          <span className="text-xs font-semibold text-[#5E6A68]">
            Academic Year 2026-2027
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard
            title="Registered Events"
            value={stats.registeredEvents}
            icon="🎫"
            subtitle="Total all-time events"
            change="+2 this month"
            trend="up"
          />
          <StatsCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            icon="📅"
            subtitle="Next: Oct 14-16, 2026"
            change="Ready to Attend"
            trend="up"
          />
          <StatsCard
            title="Certificates Earned"
            value={stats.certificatesEarned}
            icon="🏆"
            subtitle="Blockchain Verified"
            change="4 Credentials"
            trend="up"
          />
          <StatsCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon="⚡"
            subtitle="0.3s QR Check-in Record"
            change="Top 5% Student"
            trend="up"
          />
        </div>
      </section>

      {/* ================= SECTION 2: UPCOMING EVENTS (HORIZONTAL CARDS) ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#0F5D46] tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-[#5E6A68]">
              Events you are confirmed to attend
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('registrations')}
            className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>View All Registrations</span>
            <span>→</span>
          </button>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((evt) => (
            <motion.div
              key={evt.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
              className="p-5 sm:p-6 rounded-[24px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.06)] hover:shadow-[0_16px_40px_rgba(15,93,70,0.12)] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
            >
              {/* Event Image & Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative w-full sm:w-28 h-24 rounded-[18px] overflow-hidden shrink-0 border border-white/60">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 text-[9.5px] uppercase font-extrabold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {evt.category}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#0F5D46]/15">
                      {evt.countdown}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Pass: {evt.ticketId}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#0F5D46] leading-snug">
                    {evt.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5E6A68]">
                    <span className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{evt.date} • {evt.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{evt.venue}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => onViewTicket && onViewTicket(evt)}
                  className="px-5 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>🎟</span>
                  <span>View Ticket QR</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 3: RECOMMENDED EVENTS (3-CARD GRID) ================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-[#0F5D46] tracking-tight">
              Recommended For You
            </h2>
            <p className="text-xs text-[#5E6A68]">
              Trending competitions and masterclasses matched to your interests
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Explore All</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recommendedEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegister={() => onRegisterEvent && onRegisterEvent(evt)}
              onDetails={() => onViewDetails && onViewDetails(evt.id)}
            />
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: RECENT ACTIVITY TIMELINE ================= */}
      <section>
        <div className="mb-4">
          <h2 className="font-display font-bold text-xl text-[#0F5D46] tracking-tight">
            Recent Activity
          </h2>
          <p className="text-xs text-[#5E6A68]">
            Audit timeline of your registrations, payments, and verified achievements
          </p>
        </div>

        <div 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(254, 252, 248, 0.70) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          className="p-6 rounded-[24px] border border-white/70 shadow-[0_10px_30px_rgba(15,93,70,0.05)]"
        >
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#0F5D46]/15">
            {recentActivity.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 pl-1">
                {/* Checkpoint Dot / Icon */}
                <div className="w-8 h-8 rounded-full bg-[#EAF7F1] border-2 border-[#0F5D46] text-sm flex items-center justify-center shrink-0 shadow-2xs z-10">
                  {act.icon}
                </div>

                <div className="flex-1 text-left pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#0F5D46]">
                      {act.title}
                    </h4>
                    <span className="text-[11px] text-[#5E6A68] font-medium">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#1F2937]/75 mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
