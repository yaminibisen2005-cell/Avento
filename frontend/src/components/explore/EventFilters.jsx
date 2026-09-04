import React from 'react';

export default function EventFilters({
  filters,
  onFilterChange,
  onClearFilters,
  totalResults = 0,
  activeView = 'grid',
  onViewChange
}) {
  const categories = ['All', 'Hackathons', 'Workshops', 'Seminars', 'Conferences', 'Competitions', 'Bootcamp', 'Webinar'];
  const modes = ['All', 'Online', 'In-Person', 'Hybrid'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const priceTiers = ['All', 'Free', 'Paid'];
  const dates = ['All', 'Today', 'Tomorrow', 'This Week', 'This Month'];
  const sortOptions = [
    { label: 'Newest', value: 'Newest' },
    { label: 'Popularity', value: 'Popularity' },
    { label: 'Rating', value: 'Rating' },
    { label: 'Price: Low to High', value: 'Price Low to High' },
    { label: 'Price: High to Low', value: 'Price High to Low' }
  ];

  const hasActiveFilters = 
    (filters.category && filters.category !== 'All') ||
    (filters.mode && filters.mode !== 'All') ||
    (filters.difficulty && filters.difficulty !== 'All') ||
    (filters.priceTier && filters.priceTier !== 'All') ||
    (filters.date && filters.date !== 'All') ||
    (filters.sort && filters.sort !== 'Newest') ||
    (filters.query && filters.query !== '');

  return (
    <div className="sticky top-20 z-30 mb-8 py-3 px-4 sm:px-6 rounded-2xl bg-white/90 backdrop-blur-xl border border-[#0F5D46]/12 shadow-[0_8px_30px_rgba(15,93,70,0.06)] transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Scrollable Filters Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          
          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.category || 'All'}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Mode Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.mode || 'All'}
              onChange={(e) => onFilterChange('mode', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {modes.map((m) => (
                <option key={m} value={m}>{m === 'All' ? 'All Modes' : m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.difficulty || 'All'}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'Any Level' : d}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Price Tier Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.priceTier || 'All'}
              onChange={(e) => onFilterChange('priceTier', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {priceTiers.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Prices' : p}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date Timeframe Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.date || 'All'}
              onChange={(e) => onFilterChange('date', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {dates.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'Any Date' : d}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={filters.sort || 'Newest'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="appearance-none text-xs font-semibold px-3 py-2 pr-8 rounded-xl bg-[#FAF8F2] border border-[#0F5D46]/15 hover:border-[#0F5D46]/35 text-[#0F5D46] focus:outline-none cursor-pointer transition-colors"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Right Side: Total Results Count & View Switcher (Grid / Calendar / Timeline / Map) */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          <span className="text-xs font-semibold text-gray-500">
            <strong className="text-[#0F5D46]">{totalResults}</strong> events found
          </span>

          {/* View Mode Buttons */}
          <div className="flex items-center p-1 bg-[#FAF8F2] rounded-xl border border-[#0F5D46]/10">
            <button
              onClick={() => onViewChange && onViewChange('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'grid' 
                  ? 'bg-[#0F5D46] text-white shadow-2xs' 
                  : 'text-gray-600 hover:text-[#0F5D46]'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>

            <button
              onClick={() => onViewChange && onViewChange('timeline')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'timeline' 
                  ? 'bg-[#0F5D46] text-white shadow-2xs' 
                  : 'text-gray-600 hover:text-[#0F5D46]'
              }`}
              title="Timeline View"
              aria-label="Timeline view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button
              onClick={() => onViewChange && onViewChange('calendar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'calendar' 
                  ? 'bg-[#0F5D46] text-white shadow-2xs' 
                  : 'text-gray-600 hover:text-[#0F5D46]'
              }`}
              title="Calendar View"
              aria-label="Calendar view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button
              onClick={() => onViewChange && onViewChange('map')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'map' 
                  ? 'bg-[#0F5D46] text-white shadow-2xs' 
                  : 'text-gray-600 hover:text-[#0F5D46]'
              }`}
              title="Map View"
              aria-label="Map view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
