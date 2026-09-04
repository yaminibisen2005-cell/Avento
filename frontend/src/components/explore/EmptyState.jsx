import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ onResetFilters }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full py-20 px-6 flex flex-col items-center justify-center text-center rounded-3xl bg-white/60 backdrop-blur-xl border border-[#0F5D46]/10 shadow-sm my-8"
    >
      <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0F5D46]/15 via-[#D9B24A]/15 to-[#EAF7F1] blur-xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-white border border-[#0F5D46]/15 shadow-md flex items-center justify-center text-[#0F5D46]">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-[#0F5D46] mb-2 tracking-tight">
        No Events Found
      </h3>
      <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-7">
        We couldn't find any events matching your selected criteria. Try adjusting your filters, clearing your search query, or checking back soon!
      </p>

      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All Filters
        </button>
      )}
    </motion.div>
  );
}
