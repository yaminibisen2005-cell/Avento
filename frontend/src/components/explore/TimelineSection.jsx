import React from 'react';
import { motion } from 'framer-motion';

export default function TimelineSection({ events = [], onViewDetails, onRegister }) {
  const milestones = [
    { period: "Today's Releases", badge: 'Live Today', count: '3 Events' },
    { period: 'Tomorrow', badge: 'Next 24h', count: '5 Events' },
    { period: 'This Week', badge: 'Closing Soon', count: '12 Events' },
    { period: 'This Month', badge: 'Campus Summit', count: '28 Events' }
  ];

  const displayEvents = events.slice(0, 4);

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono">
            UPCOMING SCHEDULE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F5D46] tracking-tight">
            Chronological Campus Timeline
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Automated timetable for registrations and gate check-ins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {milestones.map((m, idx) => {
          const evt = displayEvents[idx % displayEvents.length];

          return (
            <motion.div
              key={m.period}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-3xl bg-white border border-[#0F5D46]/12 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#0F5D46]/10 text-[#0F5D46] font-mono uppercase">
                    {m.badge}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    {m.count}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                  {m.period}
                </h3>

                {evt ? (
                  <div className="mt-3 p-3 rounded-2xl bg-[#FAF8F2] border border-[#0F5D46]/8">
                    <span className="text-[10px] font-bold text-[#D9B24A] uppercase block mb-1 font-mono">
                      {evt.category}
                    </span>
                    <h4
                      onClick={() => { if (onViewDetails) onViewDetails(evt.id); }}
                      className="text-xs font-bold text-gray-900 hover:text-[#0F5D46] transition-colors line-clamp-2 cursor-pointer mb-1"
                    >
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate">
                      📍 {evt.venue}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-2">No pending items for this slot</p>
                )}
              </div>

              {evt && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F5D46]">
                    {evt.fee || 'Free'}
                  </span>
                  <button
                    onClick={() => { if (onRegister) onRegister(evt); }}
                    className="px-3 py-1 text-xs font-bold text-white bg-[#0F5D46] hover:bg-[#0B4B3A] rounded-xl transition-colors cursor-pointer"
                  >
                    Quick Pass
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
