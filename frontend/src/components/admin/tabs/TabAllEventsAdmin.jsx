import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabAllEventsAdmin({ 
  events = [], 
  onEventsUpdated 
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editModal, setEditModal] = useState(null)
  const [notice, setNotice] = useState('')

  const filtered = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                          e.organizer.toLowerCase().includes(search.toLowerCase()) ||
                          e.venue.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently remove "${title}"?`)) return
    await adminService.deleteEvent(id)
    setNotice(`Event "${title}" has been deleted.`)
    setTimeout(() => setNotice(''), 3000)
    if (onEventsUpdated) onEventsUpdated()
  }

  const handleArchive = (id, title) => {
    const target = events.find(e => e.id === id)
    if (target) target.status = 'Cancelled'
    setNotice(`Event "${title}" has been archived.`)
    setTimeout(() => setNotice(''), 3000)
    if (onEventsUpdated) onEventsUpdated()
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    const target = events.find(ev => ev.id === editModal.id)
    if (target) {
      target.title = editModal.title
      target.venue = editModal.venue
      target.fee = editModal.fee
      target.status = editModal.status
    }
    setNotice(`Changes to "${editModal.title}" saved.`)
    setEditModal(null)
    setTimeout(() => setNotice(''), 3000)
    if (onEventsUpdated) onEventsUpdated()
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Universal Event Catalog & Governance
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Global repository of every symposium, hackathon, and masterclass across all campus hosts
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3 py-1.5 rounded-[12px]">
          {filtered.length} of {events.length} Events Listed
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {notice}
        </div>
      )}

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
            placeholder="Search event title, organizer council, or campus hall..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Published', 'Draft', 'Completed', 'Cancelled'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s 
                  ? 'bg-[#0F5D46] text-white' 
                  : 'bg-white text-[#5E6A68] border border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
              <th className="py-3 px-4">Event Title</th>
              <th className="py-3 px-4">Host Council</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Fee Tier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {filtered.map(evt => (
              <tr key={evt.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#0F5D46]">
                  <div>{evt.title}</div>
                  <div className="text-[11px] text-gray-400 font-normal">{evt.date} • {evt.venue}</div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                  {evt.organizer}
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46]">
                    {evt.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-[#1F2937]">
                  {evt.seatsFilled || 0} / {evt.seatsTotal || 100}
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#0F5D46]">
                  {evt.fee}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    evt.status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : evt.status === 'Cancelled'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {evt.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setEditModal({ ...evt })}
                    className="px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-[#0F5D46] rounded-[8px] font-bold text-[11px] cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleArchive(evt.id, evt.title)}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-[8px] font-bold text-[11px] cursor-pointer"
                  >
                    Archive
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-[8px] cursor-pointer font-bold text-xs"
                    title="Delete Event"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setEditModal(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <form onSubmit={handleSaveEdit} className="relative w-full max-w-md rounded-[28px] bg-white border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Edit Platform Event
              </h3>
              <button type="button" onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#0F5D46] block mb-1">Event Title</label>
                <input
                  type="text"
                  value={editModal.title}
                  onChange={e => setEditModal({ ...editModal, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#0F5D46] block mb-1">Venue / Hall</label>
                <input
                  type="text"
                  value={editModal.venue}
                  onChange={e => setEditModal({ ...editModal, venue: e.target.value })}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#0F5D46] block mb-1">Fee Tier</label>
                  <input
                    type="text"
                    value={editModal.fee}
                    onChange={e => setEditModal({ ...editModal, fee: e.target.value })}
                    className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-[#0F5D46] block mb-1">Status</label>
                  <select
                    value={editModal.status}
                    onChange={e => setEditModal({ ...editModal, status: e.target.value })}
                    className="w-full h-10 px-2.5 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F5D46] text-white font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
