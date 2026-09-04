import React from 'react';
import { motion } from 'framer-motion';

export default function EventTimeline({ events = [], onViewDetails, onRegister }) {
  // Sort events chronologically
  const timelineEvents = [...events].slice(0, 8);

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-[#0F5D46]/12 p-6 sm:p-8 shadow-sm mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0F5D46] animate-ping" />
            <span className="text-xs font-bold text-[#0F5D46] uppercase tracking-wider font-mono">
              NEXT 30 DAYS SCHEDULE
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F5D46] tracking-tight">
            Upcoming Events Timeline
          </h2>
        </div>

        <span className="hidden sm:inline-block text-xs font-medium text-gray-500 bg-[#FAF8F2] px-3 py-1.5 rounded-full border border-[#0F5D46]/10">
          Scroll horizontally →
        </span>
      </div>

      {/* Horizontal Timeline Container */}
      <div className="relative overflow-x-auto pb-6 scrollbar-none">
        {/* Horizontal Connector Line */}
        <div className="absolute top-7 left-4 right-4 h-1 bg-gradient-to-r from-[#0F5D46] via-[#2A8568] to-[#D9B24A] rounded-full opacity-40 z-0" />

        <div className="flex gap-8 min-w-[760px] relative z-10 px-2">
          {timelineEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center w-64 shrink-0"
            >
              {/* Timeline Milestone Dot */}
              <div className="w-14 h-14 rounded-full bg-white border-4 border-[#0F5D46] shadow-md flex items-center justify-center mb-4 transition-transform hover:scale-110">
                <span className="text-xs font-extrabold text-[#0F5D46]">
                  D-{idx + 1}
                </span>
              </div>

              {/* Event Card Node */}
              <div className="w-full p-4 rounded-2xl bg-white border border-[#0F5D46]/15 hover:border-[#0F5D46]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-48">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-1">
                    <span className="text-[#D9B24A] font-bold">{evt.date || 'Upcoming'}</span>
                    <span className="bg-[#0F5D46]/10 text-[#0F5D46] px-1.5 py-0.5 rounded text-[10px]">
                      {evt.category}
                    </span>
                  </div>

                  <h4 
                    onClick={() => onViewDetails && onViewDetails(evt.id)}
                    className="font-bold text-xs text-gray-900 hover:text-[#0F5D46] transition-colors line-clamp-2 cursor-pointer mb-1"
                    title={evt.title}
                  >
                    {evt.title}
                  </h4>

                  <p className="text-[11px] text-gray-500 line-clamp-2">
                    {evt.venue}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-2">
                  <span className="text-xs font-extrabold text-[#0F5D46]">
                    {evt.fee || 'Free'}
                  </span>

                  <button
                    onClick={() => onRegister && onRegister(evt)}
                    className="px-3 py-1 text-[11px] font-bold text-white bg-[#0F5D46] hover:bg-[#0B4B3A] rounded-lg transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
