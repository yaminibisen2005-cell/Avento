import React from 'react'
import EventCard from '../dashboard/EventCard'

export default function RelatedEvents({ relatedEvents = [], onSelectEvent }) {
  if (!relatedEvents || relatedEvents.length === 0) return null

  return (
    <div className="text-left select-none space-y-6 pt-4">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Related & Trending Events
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Explore complementary symposiums and developer challenges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedEvents.slice(0, 3).map((evt) => (
          <EventCard
            key={evt.id}
            event={evt}
            onRegister={() => onSelectEvent && onSelectEvent(evt.id)}
            onDetails={() => onSelectEvent && onSelectEvent(evt.id)}
          />
        ))}
      </div>
    </div>
  )
}
