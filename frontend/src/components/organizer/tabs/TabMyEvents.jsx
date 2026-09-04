import React, { useState } from 'react'
import OrganizerEventCard from '../cards/OrganizerEventCard'

export default function TabMyEvents({ 
  events = [], 
  onNavigateTab, 
  onDeleteEvent 
}) {
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filtered = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.venue.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'All' || e.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            My Events & Symposiums
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Manage registrations, track capacity, and configure pass issuance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Card / Table Toggle */}
          <div className="p-1 rounded-[14px] bg-white border border-[#0F5D46]/20 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'card' ? 'bg-[#0F5D46] text-white shadow-2xs' : 'text-gray-500'
              }`}
            >
              ⊞ Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0F5D46] text-white shadow-2xs' : 'text-gray-500'
              }`}
            >
              ☰ Table
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('create-event')}
            className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold rounded-[14px] shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-[#0F5D46]/15 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by event name or campus venue..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Published', 'Draft'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filterStatus === st 
                  ? 'bg-[#0F5D46] text-white border-[#0F5D46]' 
                  : 'bg-white text-[#5E6A68] border-gray-200 hover:border-[#0F5D46]/30'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(evt => (
            <OrganizerEventCard
              key={evt.id}
              event={evt}
              onView={() => onNavigateTab('registrations')}
              onEdit={() => onNavigateTab('create-event')}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-[26px] bg-white/90 border border-white/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Seats Filled</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filtered.map(evt => (
                <tr key={evt.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F5D46]">
                    <div>{evt.title}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{evt.venue}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46]">
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{evt.mode}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1F2937]">
                    {evt.seatsFilled} / {evt.seatsTotal}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0F5D46]">
                    {evt.revenue > 0 ? `₹${evt.revenue.toLocaleString()}` : 'Free'}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('registrations')}
                      className="px-2.5 py-1 rounded-[8px] bg-[#EAF7F1] text-[#0F5D46] font-bold cursor-pointer"
                    >
                      Attendees
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEvent(evt.id)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
