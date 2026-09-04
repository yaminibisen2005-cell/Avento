import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabOrganizerApproval({ 
  pendingOrganizers = [], 
  onOrganizersUpdated 
}) {
  const [organizers, setOrganizers] = useState(pendingOrganizers)
  const [processingId, setProcessingId] = useState(null)
  const [bannerNotice, setBannerNotice] = useState('')
  const [detailsModal, setDetailsModal] = useState(null) // Organizer object
  const [changesModal, setChangesModal] = useState(null) // Organizer object
  const [changeNotes, setChangeNotes] = useState('')

  const handleApprove = async (id, orgName) => {
    setProcessingId(id)
    await adminService.approveOrganizer(id)
    setOrganizers(prev => prev.filter(o => o.id !== id))
    setProcessingId(null)
    setDetailsModal(null)
    setBannerNotice(`✓ Organization "${orgName}" has been approved! They can now log in and manage campus symposiums.`)
    setTimeout(() => setBannerNotice(''), 4500)
    if (onOrganizersUpdated) onOrganizersUpdated()
  }

  const handleReject = async (id, orgName) => {
    if (!window.confirm(`Decline accreditation for "${orgName}"?`)) return
    setProcessingId(id)
    await adminService.rejectOrganizer(id)
    setOrganizers(prev => prev.filter(o => o.id !== id))
    setProcessingId(null)
    setDetailsModal(null)
    setBannerNotice(`Application for "${orgName}" has been rejected.`)
    setTimeout(() => setBannerNotice(''), 3500)
    if (onOrganizersUpdated) onOrganizersUpdated()
  }

  const handleSendChanges = (e) => {
    e.preventDefault()
    setBannerNotice(`Revision instructions dispatched to ${changesModal.email}.`)
    setChangesModal(null)
    setChangeNotes('')
    setTimeout(() => setBannerNotice(''), 4000)
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Organizer Accreditation & Compliance Queue
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Review academic council credentials, GST compliance, and institutional endorsement letters
        </p>
      </div>

      {bannerNotice && (
        <div className="p-4 rounded-[18px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          {bannerNotice}
        </div>
      )}

      {organizers.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] bg-white/80 border border-[#0F5D46]/10 space-y-3">
          <span className="text-4xl block">✨</span>
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">
            All Organizer Applications Processed!
          </h3>
          <p className="text-xs text-[#5E6A68] max-w-md mx-auto">
            There are no pending organizer requests in the queue. New university student councils will appear here upon signup.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizers.map(org => (
            <div
              key={org.id}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
                backdropFilter: 'blur(20px)'
              }}
              className="p-6 rounded-[26px] border border-white/80 shadow-xs flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[16px] bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-xl font-bold border border-[#0F5D46]/20">
                      🏛
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[#0F5D46] leading-snug">
                        {org.organization}
                      </h3>
                      <span className="text-xs text-[#5E6A68]">
                        {org.college}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                    Pending Review
                  </span>
                </div>

                {/* Details Grid */}
                <div className="p-3.5 rounded-[18px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#5E6A68]">Contact Email:</span>
                    <span className="font-medium text-[#1F2937]">{org.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6A68]">Support Phone:</span>
                    <span className="font-medium text-[#1F2937]">{org.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6A68]">GSTIN Number:</span>
                    <span className="font-mono font-bold text-[#0F5D46]">{org.gstin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5E6A68]">Applied On:</span>
                    <span className="font-medium text-[#1F2937]">{org.appliedOn}</span>
                  </div>
                </div>

                {/* Verification Document Badge */}
                <div className="p-3 rounded-[14px] bg-white border border-gray-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    <span className="font-bold text-[#1F2937]">Endorsement Document</span>
                  </div>
                  <a
                    href={org.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#0F5D46] hover:underline"
                  >
                    View PDF ↗
                  </a>
                </div>
              </div>

              {/* Action Buttons: View Details, Approve, Reject, Request Changes */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={processingId === org.id}
                    onClick={() => handleApprove(org.id, org.organization)}
                    className="flex-1 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-2xs transition-all cursor-pointer disabled:opacity-60 text-center"
                  >
                    {processingId === org.id ? 'Approving...' : '✓ Approve'}
                  </button>

                  <button
                    type="button"
                    disabled={processingId === org.id}
                    onClick={() => handleReject(org.id, org.organization)}
                    className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-red-700 font-bold text-xs rounded-[14px] border border-red-200 transition-all cursor-pointer"
                  >
                    ✕ Reject
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailsModal(org)}
                    className="flex-1 py-2 bg-[#FAF8F2] hover:bg-gray-100 text-[#0F5D46] font-bold text-xs rounded-[12px] border border-[#0F5D46]/15 transition-all cursor-pointer"
                  >
                    View Full Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setChangesModal(org)}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-[#8C6F1E] font-bold text-xs rounded-[12px] border border-[#D9B24A]/40 transition-all cursor-pointer"
                  >
                    Request Changes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDetailsModal(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg rounded-[28px] bg-white border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Organization Verification Dossier
              </h3>
              <button type="button" onClick={() => setDetailsModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-[16px] bg-[#FAF8F2] space-y-1">
                <span className="font-bold text-sm text-[#0F5D46] block">{detailsModal.organization}</span>
                <span className="text-gray-500">{detailsModal.college}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#5E6A68]">GST Number:</span>
                <span className="font-mono font-bold text-[#0F5D46]">{detailsModal.gstin}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#5E6A68]">Official Email:</span>
                <span className="font-semibold">{detailsModal.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#5E6A68]">Phone:</span>
                <span className="font-semibold">{detailsModal.phone}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#5E6A68]">Verification Docs:</span>
                <a href={detailsModal.docsUrl} target="_blank" rel="noreferrer" className="font-bold text-[#0F5D46] hover:underline">Download Official Letter ↗</a>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApprove(detailsModal.id, detailsModal.organization)}
                className="px-5 py-2.5 bg-[#0F5D46] text-white font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Approve Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {changesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setChangesModal(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <form onSubmit={handleSendChanges} className="relative w-full max-w-md rounded-[28px] bg-white border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                Request Document Revisions
              </h3>
              <button type="button" onClick={() => setChangesModal(null)} className="text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>
            <p className="text-xs text-[#5E6A68]">
              Send specific instructions to <strong className="text-[#0B4B3A]">{changesModal.organization}</strong> detailing required documentation.
            </p>
            <textarea
              rows={4}
              value={changeNotes}
              onChange={e => setChangeNotes(e.target.value)}
              placeholder="e.g. Please upload a signed university endorsement letter stamped by the Dean of Student Affairs."
              required
              className="w-full p-3.5 text-xs rounded-[14px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setChangesModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F5D46] text-white font-bold rounded-[12px] text-xs cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
