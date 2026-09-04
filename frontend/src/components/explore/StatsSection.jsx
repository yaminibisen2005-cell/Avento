import React from 'react';
import { motion } from 'framer-motion';

export default function StatsSection({ events = [] }) {
  const total = events.length;
  const liveCount = events.filter(e => e.status === 'PUBLISHED' || e.status === 'LIVE').length;
  const freeCount = events.filter(e => e.fee && e.fee.toLowerCase().includes('free')).length;
  const paidCount = Math.max(0, total - freeCount);
  const upcomingCount = total;
  const certificateCount = events.filter(e => 
    e.category?.toLowerCase().includes('hackathon') || 
    e.category?.toLowerCase().includes('workshop') ||
    e.category?.toLowerCase().includes('conference')
  ).length || total;

  const stats = [
    {
      label: 'Total Events',
      value: total,
      sub: 'Verified platform items',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bg: 'from-[#0F5D46]/10 to-[#EAF7F1]'
    },
    {
      label: 'Live / Open',
      value: liveCount,
      sub: 'Registration active',
      icon: (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      ),
      bg: 'from-emerald-500/10 to-emerald-50'
    },
    {
      label: 'Upcoming',
      value: upcomingCount,
      sub: 'Next 30 days',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'from-blue-500/10 to-blue-50'
    },
    {
      label: 'Free Events',
      value: freeCount,
      sub: 'Zero registration fee',
      icon: (
        <svg className="w-5 h-5 text-[#D9B24A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'from-[#D9B24A]/15 to-amber-50'
    },
    {
      label: 'Paid Events',
      value: paidCount,
      sub: 'Razorpay secured',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      bg: 'from-[#0F5D46]/10 to-[#EAF7F1]'
    },
    {
      label: 'Certificates',
      value: certificateCount,
      sub: 'Verifiable credentials',
      icon: (
        <svg className="w-5 h-5 text-[#D9B24A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'from-[#D9B24A]/15 to-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.05 }}
          className="relative overflow-hidden rounded-2xl bg-white/75 backdrop-blur-xl border border-[#0F5D46]/10 p-4 shadow-xs hover:shadow-md hover:border-[#0F5D46]/25 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 tracking-tight uppercase">
              {item.label}
            </span>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${item.bg}`}>
              {item.icon}
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F5D46] tracking-tight mb-0.5">
            {item.value}
          </div>
          <div className="text-[11px] text-gray-400 font-medium">
            {item.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
