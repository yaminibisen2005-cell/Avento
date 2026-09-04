import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabAnnouncements({ announcements = [], onAnnouncementsUpdated }) {
  const [items, setItems] = useState(announcements)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('Everyone')
  const [isSending, setIsSending] = useState(false)
  const [notice, setNotice] = useState('')

  const handleBroadcast = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    setIsSending(true)
    const newA = await adminService.createAnnouncement({ title, message, audience })
    setIsSending(false)
    setItems([newA, ...items])
    setTitle('')
    setMessage('')
    setNotice(`Announcement "${newA.title}" successfully dispatched to ${audience}!`)
    setTimeout(() => setNotice(''), 4000)
    if (onAnnouncementsUpdated) onAnnouncementsUpdated()
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          System Broadcasts & Announcements
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Deliver urgent platform alerts, turnstile protocol updates, and compliance notices
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {notice}
        </div>
      )}

      {/* Composer Card */}
      <form 
        onSubmit={handleBroadcast}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-xs space-y-4 text-xs"
      >
        <h3 className="font-display font-bold text-base text-[#0F5D46]">
          Compose Global Announcement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Broadcast Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Scheduled Infrastructure Maintenance Window"
              required
              className="w-full h-11 px-3.5 rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full h-11 px-3 rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none font-bold"
            >
              <option value="Everyone">Everyone (All Users)</option>
              <option value="Students">Students Only</option>
              <option value="Organizers">Organizers Only</option>
              <option value="Admins">Admins Only</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Message Body
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write clear, actionable details regarding turnstile gates, verification, or downtime..."
            required
            className="w-full p-3.5 rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer disabled:opacity-60"
        >
          {isSending ? 'Broadcasting...' : '📢 Send Global Announcement'}
        </button>
      </form>

      {/* History Feed */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-[#0F5D46]">
          Sent Broadcast History
        </h3>

        <div className="space-y-3">
          {items.map(a => (
            <div
              key={a.id}
              className="p-4 rounded-[20px] bg-white border border-[#0F5D46]/15 shadow-2xs text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F5D46] text-sm">{a.title}</span>
                <span className="text-[10px] uppercase font-extrabold bg-[#EAF7F1] text-[#0F5D46] px-2.5 py-0.5 rounded-full border border-[#0F5D46]/20">
                  {a.audience}
                </span>
              </div>
              <p className="text-[#5E6A68] leading-relaxed">{a.message}</p>
              <span className="text-[10px] text-gray-400 block pt-1">{a.sentAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
