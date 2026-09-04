import React from 'react';
import { motion } from 'framer-motion';

export default function QuickStats({ events = [] }) {
  const totalCount = events.length > 0 ? Math.max(events.length, 438) : 438;
  const freeCount = events.length > 0
    ? Math.max(events.filter(e => !e.fee || e.fee.toLowerCase().includes('free') || e.fee === '0').length * 12, 120)
    : 120;

  const stats = [
    {
      title: 'Total Events',
      value: `${totalCount}+`,
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Students Joined',
      value: '3200+',
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Free Events',
      value: `${freeCount}+`,
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      )
    },
    {
      title: 'Student Satisfaction',
      value: '98%',
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-2xl bg-white border border-gray-100 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(15,93,70,0.08)] transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#EAF7F1] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <div className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight font-sans leading-none mb-1">
                {item.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {item.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
