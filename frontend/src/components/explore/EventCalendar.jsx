import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventCalendar({ events = [], onViewDetails, onRegister }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026 default for hackathons
  const [selectedDay, setSelectedDay] = useState(14); // AI hackathon default

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events by their approximate day of this month
  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter((e) => {
      if (!e.date) return false;
      const lowerDate = e.date.toLowerCase();
      const currentMonthStr = monthNames[month].toLowerCase().slice(0, 3);
      if (lowerDate.includes(currentMonthStr)) {
        // match date digit
        const match = lowerDate.match(/\d+/);
        if (match && parseInt(match[0], 10) === day) return true;
      }
      return false;
    });
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-[#0F5D46]/12 shadow-sm p-6 sm:p-8 mb-12">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-[#D9B24A] uppercase tracking-wider font-mono">
            CALENDAR SCHEDULE
          </span>
          <h2 className="text-2xl font-extrabold text-[#0F5D46] tracking-tight">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-[#0F5D46]/15 hover:bg-[#0F5D46]/10 text-[#0F5D46] transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 9, 1))}
            className="px-3 py-1.5 rounded-xl border border-[#0F5D46]/15 text-xs font-bold text-[#0F5D46] hover:bg-[#0F5D46]/10 transition-colors cursor-pointer"
          >
            Current Term
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-[#0F5D46]/15 hover:bg-[#0F5D46]/10 text-[#0F5D46] transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of the Week Grid */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days Cells Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-gray-50/50 opacity-40 border border-transparent" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`h-20 sm:h-24 p-2 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0F5D46]/10 border-[#0F5D46] ring-2 ring-[#0F5D46]/20'
                  : hasEvents
                  ? 'bg-white border-[#0F5D46]/25 hover:border-[#0F5D46] hover:shadow-sm'
                  : 'bg-white/40 border-gray-100 hover:bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isSelected ? 'text-[#0F5D46]' : 'text-gray-700'}`}>
                  {day}
                </span>
                {hasEvents && (
                  <span className="w-2 h-2 rounded-full bg-[#0F5D46]" />
                )}
              </div>

              {hasEvents ? (
                <div className="flex flex-col gap-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[10px] font-semibold text-[#0F5D46] bg-[#0F5D46]/10 px-1.5 py-0.5 rounded truncate"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] text-gray-400 font-medium">+{dayEvents.length - 2} more</span>
                  )}
                </div>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Events Sheet */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#0F5D46]">
                Events on {monthNames[month]} {selectedDay}, {year} ({selectedDayEvents.length})
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                Close Day View
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 italic">
                No scheduled events on this date. Click another highlighted date to explore events.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl bg-white border border-[#0F5D46]/15 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=200&q=80'}
                        alt={evt.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate" title={evt.title}>
                          {evt.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                          {evt.time} • {evt.venue}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onViewDetails && onViewDetails(evt.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#0F5D46] bg-[#0F5D46]/10 rounded-lg hover:bg-[#0F5D46]/20 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onRegister && onRegister(evt)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#0F5D46] rounded-lg hover:bg-[#0B4B3A] transition-colors cursor-pointer"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
