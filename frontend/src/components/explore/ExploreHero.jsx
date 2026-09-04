import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ExploreHero({
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onQuickTagClick
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const tags = ['#Hackathons', '#Workshops', '#AI', '#Competitions', '#Cultural'];

  const handleQueryChange = (e) => {
    setLocalQuery(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit(localQuery);
    }
  };

  const handleTagClick = (tag) => {
    const cleanTag = tag.replace('#', '');
    setLocalQuery(cleanTag);
    if (onSearchChange) onSearchChange(cleanTag);
    if (onQuickTagClick) onQuickTagClick(cleanTag);
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F2] pt-24 sm:pt-28 pb-14 sm:pb-16 px-4 sm:px-8 lg:px-12 border-b border-gray-100">
      
      {/* Soft mint / sage ambient gradient glow on the top-left */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EAF7F1] opacity-70 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-[#D9B24A]/10 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-[1480px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* ================= LEFT CONTENT COLUMN (7 COLS) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10">
            
            {/* Tracking Widest Label */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-3"
            >
              <span className="text-xs font-extrabold tracking-[0.22em] text-[#0F5D46] uppercase font-mono">
                EXPLORE EVENTS
              </span>
            </motion.div>

            {/* Monumental Title with Serif Gold Accent */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#111827] tracking-tight leading-[1.12] mb-4 font-sans"
            >
              Discover Events <br className="hidden sm:inline" />
              That <span className="font-serif italic font-normal text-[#D9B24A]">Inspire You</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-sm sm:text-base text-gray-600 max-w-xl mb-7 leading-relaxed"
            >
              Find, participate and be a part of amazing campus events. Learn new skills, meet like-minded people and create unforgettable memories.
            </motion.p>

            {/* ================= FLOATING PILL SEARCH BAR ================= */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-xl bg-white rounded-full p-1.5 pl-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-200/80 flex items-center justify-between gap-3 mb-4 focus-within:ring-2 focus-within:ring-[#0F5D46]/20 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={localQuery}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search events, skills, or keywords..."
                  className="w-full text-sm font-medium text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none truncate"
                />
              </div>

              <button
                onClick={() => onSearchSubmit && onSearchSubmit(localQuery)}
                className="px-6 py-2.5 rounded-full bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-medium text-sm transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0 active:scale-97"
              >
                Search
              </button>
            </motion.div>

            {/* ================= TRENDING PILLS ================= */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="flex flex-wrap items-center gap-2"
            >
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 rounded-full bg-[#EAF7F1] hover:bg-[#d8efe4] text-[#0F5D46] text-xs font-semibold transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </motion.div>

          </div>

          {/* ================= RIGHT HERO GRAPHIC / CAMPUS VISUAL (5 COLS) ================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[520px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white">
              {/* Campus Students Photography matching reference */}
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Students exploring campus events"
                className="w-full h-[340px] sm:h-[400px] object-cover"
              />

              {/* Gradient overlays for subtle blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F2]/30 via-transparent to-transparent pointer-events-none" />

              {/* Floating Cursive Script: "Learn Connect Grow" */}
              <div className="absolute top-4 left-5 z-10">
                <span className="font-serif italic text-white/95 text-lg sm:text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-light tracking-wide">
                  Learn • Connect • Grow
                </span>
              </div>

              {/* Campus Signpost Banner: "Good Ideas Brighter Tomorrows AVENTO" */}
              <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-md border border-white/60 max-w-[170px] text-right">
                <p className="text-[11px] font-serif font-bold text-gray-900 leading-tight">
                  Good Ideas
                </p>
                <p className="text-[11px] font-serif font-bold text-gray-800 leading-tight">
                  Brighter Tomorrows
                </p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] font-mono font-bold tracking-wider text-[#0F5D46]">
                  <span>▲</span> AVENTO
                </div>
              </div>

              {/* Bottom live stats pill */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-sm border border-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-800">50+ Universities Live</span>
                </div>
                <span className="text-xs font-semibold text-[#0F5D46]">Join Now →</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
