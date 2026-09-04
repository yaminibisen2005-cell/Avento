import React from 'react';
import { motion } from 'framer-motion';

export default function CategorySection({ selectedCategory = 'All', onSelectCategory }) {
  const categories = [
    {
      id: 'All',
      name: 'All Events',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'Hackathons',
      name: 'Hackathons',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'Workshops',
      name: 'Workshops',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'Competitions',
      name: 'Competitions',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 'Tech Talk',
      name: 'Tech Talks',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      id: 'Cultural',
      name: 'Cultural',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      id: 'Robotics',
      name: 'Robotics',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    {
      id: 'Design',
      name: 'Design',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4 4 4 0 01-4 4H7zm0 0v-4m10 4a4 4 0 004-4 4 4 0 00-4-4h-4a4 4 0 00-4 4 4 4 0 004 4h4zm0 0v-4" />
        </svg>
      )
    },
    {
      id: 'Business',
      name: 'Business',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 'Social Impact',
      name: 'Social Impact',
      icon: (
        <svg className="w-5 h-5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-14" id="categories">
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Browse by Category
        </h2>

        <button
          onClick={() => onSelectCategory && onSelectCategory('All')}
          className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#0F5D46] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View All Categories</span>
          <span className="text-base leading-none">→</span>
        </button>
      </div>

      {/* Categories Grid (10 Columns responsive) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        {categories.map((cat, idx) => {
          const isSelected =
            (cat.id === 'All' && (!selectedCategory || selectedCategory === 'All')) ||
            (selectedCategory && selectedCategory.toLowerCase().includes(cat.id.toLowerCase()));

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelectCategory && onSelectCategory(cat.id === 'All' ? 'All' : cat.id)}
              className={`rounded-2xl p-3.5 flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-2 border-[#0F5D46] shadow-sm ring-1 ring-[#0F5D46]/20'
                  : 'bg-white border border-gray-100 hover:border-[#0F5D46]/30 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isSelected ? 'bg-[#EAF7F1]' : 'bg-gray-50 group-hover:bg-[#EAF7F1]'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-xs font-semibold truncate max-w-full ${
                isSelected ? 'text-[#0F5D46]' : 'text-gray-800'
              }`}>
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
