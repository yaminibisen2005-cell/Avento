import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories = ['All', 'Hackathons', 'Workshops', 'Competitions', 'Tech Talk', 'Cultural', 'Robotics', 'Design', 'Business', 'Social Impact'];
  const modes = ['All', 'Online', 'In-Person', 'Hybrid'];
  const prices = ['All', 'Free', 'Paid'];
  const dates = ['All', 'Today', 'Tomorrow', 'This Week', 'This Month'];
  const sortOptions = [
    { label: 'Latest', value: 'Newest' },
    { label: 'Popularity', value: 'Popularity' },
    { label: 'Rating', value: 'Rating' },
    { label: 'Price: Low to High', value: 'Price Low to High' },
    { label: 'Price: High to Low', value: 'Price High to Low' }
  ];

  const hasActiveFilters =
    (filters.category && filters.category !== 'All') ||
    (filters.mode && filters.mode !== 'All') ||
    (filters.priceTier && filters.priceTier !== 'All') ||
    (filters.date && filters.date !== 'All') ||
    (filters.sort && filters.sort !== 'Newest') ||
    (filters.query && filters.query.trim() !== '');

  return (
    <div className="mb-8">
      {/* Section Header Row matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            All Events
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Explore events that match your interests
          </p>
        </div>

        {/* Right side: Sort by + Filter button */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span className="hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={filters.sort || 'Newest'}
                onChange={(e) => onFilterChange('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-7 text-xs font-semibold text-gray-800 shadow-2xs hover:border-[#0F5D46]/40 focus:outline-none cursor-pointer"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
              showFilterDrawer || hasActiveFilters
                ? 'bg-[#0F5D46] text-white border-[#0F5D46]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0F5D46]/40'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#D9B24A]" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Drawer */}
      <AnimatePresence>
        {showFilterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-xs mb-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Category */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Category
                </label>
                <select
                  value={filters.category || 'All'}
                  onChange={(e) => onFilterChange('category', e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0F5D46]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Mode
                </label>
                <select
                  value={filters.mode || 'All'}
                  onChange={(e) => onFilterChange('mode', e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0F5D46]"
                >
                  {modes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Fee Tier */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Pricing
                </label>
                <select
                  value={filters.priceTier || 'All'}
                  onChange={(e) => onFilterChange('priceTier', e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0F5D46]"
                >
                  {prices.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Date
                </label>
                <select
                  value={filters.date || 'All'}
                  onChange={(e) => onFilterChange('date', e.target.value)}
                  className="w-full bg-[#FAF8F2] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#0F5D46]"
                >
                  {dates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Reset & Status bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                Found <strong className="text-[#0F5D46]">{totalResults}</strong> events
              </span>

              {hasActiveFilters && (
                <button
                  onClick={onResetFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
