import React, { useState } from 'react';

export default function EventSearch({ searchQuery = '', onSearchChange, onQuickCategorySelect }) {
  const [prevProp, setPrevProp] = useState(searchQuery);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  if (searchQuery !== prevProp) {
    setPrevProp(searchQuery);
    setLocalQuery(searchQuery);
  }

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  const trendingTags = ['Hackathons', 'AI & ML', 'Workshops', 'Free', 'IIT Delhi'];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Primary Input Container */}
      <div className="relative flex items-center w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-[#0F5D46]/20 shadow-[0_12px_36px_rgba(15,93,70,0.1)] p-2 transition-all duration-300 focus-within:border-[#0F5D46] focus-within:ring-4 focus-within:ring-[#0F5D46]/10">
        <div className="pl-3.5 pr-2 text-[#0F5D46]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search by title, organizer, venue, or category (e.g. AI Hackathon, BITS, Workshop)..."
          className="w-full text-sm sm:text-base bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none py-2 px-1 font-medium"
        />

        {localQuery && (
          <button
            onClick={handleClear}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mr-1"
            title="Clear search"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          onClick={() => onSearchChange && onSearchChange(localQuery)}
          className="px-5 py-2.5 rounded-xl bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Search
        </button>
      </div>

      {/* Suggested Search Chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap justify-center text-xs text-gray-500">
        <span className="font-medium text-[#0F5D46]">Trending:</span>
        {trendingTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onQuickCategorySelect && onQuickCategorySelect(tag)}
            className="px-2.5 py-1 rounded-full bg-white/70 hover:bg-white border border-[#0F5D46]/10 text-gray-600 hover:text-[#0F5D46] text-[11px] font-medium transition-colors cursor-pointer shadow-2xs"
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
