import React, { useState } from 'react'

export default function TabRegistrations({ registrations = [], events = [], onSelectEvent }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState('All')

  const filtered = (registrations || []).filter(r => {
    const studentName = r.studentName || ''
    const email = r.email || ''
    const college = r.college || ''
    const ticketId = r.ticketId || ''
    const eventTitle = r.eventTitle || ''
    const eventId = r.eventId

    const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) ||
                          email.toLowerCase().includes(search.toLowerCase()) ||
                          college.toLowerCase().includes(search.toLowerCase()) ||
                          ticketId.toLowerCase().includes(search.toLowerCase()) ||
                          eventTitle.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'All' || r.attendance === statusFilter
    const matchesEvent = selectedEvent === 'All' || 
                         (selectedEvent && (String(eventId) === String(selectedEvent) || eventTitle === selectedEvent))

    return matchesSearch && matchesStatus && matchesEvent
  })

  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Student Name', 'Email', 'College', 'Branch', 'Event', 'Ticket ID', 'Payment', 'Attendance', 'Date']
    const rows = filtered.map(r => [
      r.id,
      `"${r.studentName || ''}"`,
      r.email || '',
      `"${r.college || ''}"`,
      `"${r.branch || ''}"`,
      `"${r.eventTitle || ''}"`,
      r.ticketId || '',
      r.paymentStatus || '',
      r.attendance || '',
      r.registeredOn || ''
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `attendees-export-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Registrations & Attendees
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time roster of verified participants across your hosted events
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="text-xs font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3 py-1.5 rounded-full">
            👥 {filtered.length} {filtered.length === 1 ? 'Attendee' : 'Attendees'}
          </span>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] disabled:opacity-50 text-white text-xs font-bold rounded-[14px] shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-[#0F5D46]/15 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search attendee, email, ticket ID, college..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

        {/* Event Selector */}
        {events && events.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#5E6A68]">Event:</span>
            <select
              value={selectedEvent}
              onChange={e => {
                setSelectedEvent(e.target.value)
                if (onSelectEvent) onSelectEvent(e.target.value === 'All' ? null : e.target.value)
              }}
              className="h-9 px-3 text-xs font-bold rounded-full bg-white border border-[#0F5D46]/20 text-[#0F5D46] focus:outline-none cursor-pointer"
            >
              <option value="All">All Events ({events.length})</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {['All', 'Checked In', 'Not Arrived'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                statusFilter === st 
                  ? 'bg-[#0F5D46] text-white border-[#0F5D46]' 
                  : 'bg-white text-[#5E6A68] border-gray-200 hover:border-[#0F5D46]/30'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Attendee Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF7F1] flex items-center justify-center text-2xl text-[#0F5D46]">
              📋
            </div>
            <h3 className="font-display font-bold text-base text-gray-900">
              No Registrations Found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {search || statusFilter !== 'All' || selectedEvent !== 'All'
                ? 'No attendee matches your filter criteria. Try clearing search filters.'
                : 'Your events currently have no registered attendees yet. Once students register, their live passes and check-in statuses will display here.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">University & Branch</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Ticket Pass</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0F5D46]">
                    <div>{r.studentName || 'Attendee'}</div>
                    <div className="text-[11px] text-gray-400 font-normal">{r.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1F2937]">{r.college || 'Campus Hub'}</div>
                    <div className="text-[10.5px] text-[#5E6A68]">{r.branch || 'Student'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#1F2937] font-medium truncate max-w-[180px]">
                    {r.eventTitle}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F5D46]">
                    {r.ticketId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46]">
                      {r.paymentStatus || 'Free'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                      r.attendance === 'Checked In'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span>{r.attendance === 'Checked In' ? '✓' : '•'}</span>
                      <span>{r.attendance}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
