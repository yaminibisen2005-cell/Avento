import React, { useState } from 'react'

export default function TabRegistrations({ registrations = [] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = registrations.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase()) ||
                          r.college.toLowerCase().includes(search.toLowerCase()) ||
                          r.ticketId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || r.attendance === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExportCSV = () => {
    const headers = ['Registration ID', 'Student Name', 'Email', 'College', 'Branch', 'Event', 'Ticket ID', 'Payment', 'Attendance', 'Date'];
    const rows = filtered.map(r => [
      r.id,
      `"${r.studentName}"`,
      r.email,
      `"${r.college}"`,
      `"${r.branch}"`,
      `"${r.eventTitle}"`,
      r.ticketId,
      r.paymentStatus,
      r.attendance,
      r.registeredOn
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `attendees-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Complete roster of verified participants across active event cohorts
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold rounded-[14px] shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>📥</span>
          <span>Export CSV Roster</span>
        </button>
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
            placeholder="Search attendee, email, ticket ID, college..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

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
                  <div>{r.studentName}</div>
                  <div className="text-[11px] text-gray-400 font-normal">{r.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#1F2937]">{r.college}</div>
                  <div className="text-[10.5px] text-[#5E6A68]">{r.branch}</div>
                </td>
                <td className="py-3.5 px-4 text-[#1F2937] font-medium truncate max-w-[180px]">
                  {r.eventTitle}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#0F5D46]">
                  {r.ticketId}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46]">
                    {r.paymentStatus}
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
      </div>
    </div>
  )
}
