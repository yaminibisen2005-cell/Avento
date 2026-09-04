import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabEventApproval({ 
  pendingEvents = [], 
  onEventsUpdated 
}) {
  const [events, setEvents] = useState(pendingEvents)
  const [bannerNotice, setBannerNotice] = useState('')
  const [previewModal, setPreviewModal] = useState(null)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [feedbackNotes, setFeedbackNotes] = useState('')

  const handleApprove = async (id, title) => {
    await adminService.approveEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
    setPreviewModal(null)
    setBannerNotice(`✓ Event "${title}" has been authorized and published to the explore catalog!`)
    setTimeout(() => setBannerNotice(''), 4500)
    if (onEventsUpdated) onEventsUpdated()
  }

  const handleReject = async (id, title) => {
    if (!window.confirm(`Decline submission for "${title}"?`)) return
    await adminService.rejectEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
    setPreviewModal(null)
    setBannerNotice(`Event "${title}" has been declined.`)
    setTimeout(() => setBannerNotice(''), 3500)
    if (onEventsUpdated) onEventsUpdated()
  }

  const handleSendFeedback = (e) => {
    e.preventDefault()
    setBannerNotice(`Feedback note dispatched to host organizers of "${feedbackModal.title}".`)
    setFeedbackModal(null)
    setFeedbackNotes('')
    setTimeout(() => setBannerNotice(''), 4000)
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Event Vetting & Quality Review Queue
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Review syllabus, prize pool validity, and seat allocations before broadcasting to campus delegates
        </p>
      </div>

      {bannerNotice && (
        <div className="p-4 rounded-[18px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          {bannerNotice}
        </div>
      )}

      {events.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] bg-white/80 border border-[#0F5D46]/10 space-y-3">
          <span className="text-4xl block">✨</span>
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">
            All Event Submissions Reviewed!
          </h3>
          <p className="text-xs text-[#5E6A68] max-w-md mx-auto">
            The compliance queue is clear. Any new hackathons or symposiums created by organizers will appear here for verification.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(evt => (
            <div
              key={evt.id}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
                backdropFilter: 'blur(20px)'
              }}
              className="p-6 rounded-[26px] border border-white/80 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase bg-[#EAF7F1] text-[#0F5D46] px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-[#0F5D46]/20">
                      {evt.category} • {evt.mode}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-[#0F5D46] leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#5E6A68] mt-0.5">
                      Host: <strong className="text-[#1F2937]">{evt.organizer}</strong>
                    </p>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                    Awaiting Review
                  </span>
                </div>

                {/* Event Metadata Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-[18px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs">
                  <div>
                    <span className="text-[10px] text-[#5E6A68] block">Date:</span>
                    <span className="font-bold text-[#1F2937]">{evt.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5E6A68] block">Capacity:</span>
                    <span className="font-bold text-[#1F2937]">{evt.seats} Attendees</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5E6A68] block">Venue:</span>
                    <span className="font-semibold text-[#1F2937] truncate block">{evt.venue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5E6A68] block">Pass Price:</span>
                    <span className="font-extrabold text-[#0F5D46]">{evt.fee}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(evt.id, evt.title)}
                    className="flex-1 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs transition-all cursor-pointer text-center"
                  >
                    🚀 Approve & Publish
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReject(evt.id, evt.title)}
                    className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-red-700 font-bold text-xs rounded-[14px] border border-red-200 transition-all cursor-pointer"
                  >
                    ✕ Decline
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewModal(evt)}
                    className="flex-1 py-2 bg-[#FAF8F2] hover:bg-gray-100 text-[#0F5D46] font-bold text-xs rounded-[12px] border border-[#0F5D46]/15 transition-all cursor-pointer"
                  >
                    Preview Full Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackModal(evt)}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-[#8C6F1E] font-bold text-xs rounded-[12px] border border-[#D9B24A]/40 transition-all cursor-pointer"
                  >
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPreviewModal(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-[28px] bg-white border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Event Quality Preview & Compliance Review
              </h3>
              <button type="button" onClick={() => setPreviewModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-[18px] bg-[#FAF8F2] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#0F5D46] bg-[#EAF7F1] px-2 py-0.5 rounded-full">{previewModal.category}</span>
                <h4 className="font-display font-bold text-base text-[#0F5D46] pt-1">{previewModal.title}</h4>
                <p className="text-gray-500">Host Council: {previewModal.organizer}</p>
              </div>

              <div className="space-y-1.5 p-3 rounded-[16px] bg-white border border-gray-200">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#5E6A68]">Event Schedule:</span>
                  <span className="font-bold">{previewModal.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#5E6A68]">Venue / Mode:</span>
                  <span className="font-bold">{previewModal.venue} ({previewModal.mode})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-[#5E6A68]">Seat Quota:</span>
                  <span className="font-mono font-bold text-[#0F5D46]">{previewModal.seats} Seats</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#5E6A68]">Registration Fee:</span>
                  <span className="font-bold text-[#0F5D46]">{previewModal.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApprove(previewModal.id, previewModal.title)}
                className="px-5 py-2.5 bg-[#0F5D46] text-white font-bold rounded-[12px] text-xs cursor-pointer shadow-sm"
              >
                🚀 Approve & Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND FEEDBACK MODAL */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setFeedbackModal(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <form onSubmit={handleSendFeedback} className="relative w-full max-w-md rounded-[28px] bg-white border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Send Curatorial Feedback
              </h3>
              <button type="button" onClick={() => setFeedbackModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#5E6A68]">
              Send editorial remarks for <strong className="text-[#0B4B3A]">"{feedbackModal.title}"</strong>.
            </p>
            <textarea
              rows={4}
              value={feedbackNotes}
              onChange={e => setFeedbackNotes(e.target.value)}
              placeholder="e.g. Please clarify team size rules and specify the evaluation rubric for round 2."
              required
              className="w-full p-3.5 text-xs rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFeedbackModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F5D46] text-white font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Dispatch Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
