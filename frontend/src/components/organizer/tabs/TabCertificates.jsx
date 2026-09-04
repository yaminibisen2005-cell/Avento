import React, { useState } from 'react'
import { organizerService } from '../../../services/organizerService'

export default function TabCertificates({ registrations = [] }) {
  const [selectedIds, setSelectedIds] = useState(['REG-101', 'REG-103'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchNotice, setBatchNotice] = useState('')

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(registrations.map(r => r.id))
    }
  }

  const handleBulkGenerate = async () => {
    if (selectedIds.length === 0) return
    setIsGenerating(true)
    const res = await organizerService.generateCertificates(selectedIds)
    setIsGenerating(false)
    setBatchNotice(res.message)
    setTimeout(() => setBatchNotice(''), 4000)
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Certificate Generation & Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Sign and issue tamper-proof digital credentials for verified event attendees
          </p>
        </div>

        <button
          type="button"
          disabled={isGenerating || selectedIds.length === 0}
          onClick={handleBulkGenerate}
          className="px-5 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>🎓</span>
          <span>{isGenerating ? 'Generating Certificates...' : `Issue ${selectedIds.length} Certificates`}</span>
        </button>
      </div>

      {batchNotice && (
        <div className="p-4 rounded-[18px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {batchNotice}
        </div>
      )}

      {/* Attendee Checklist Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAllCert"
              checked={selectedIds.length === registrations.length && registrations.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
            />
            <label htmlFor="selectAllCert" className="font-bold text-[#0F5D46] cursor-pointer">
              Select All Verified Attendees ({selectedIds.length} selected)
            </label>
          </div>

          <span className="text-[11px] text-[#5E6A68]">
            Minimum 85% attendance required for issuance
          </span>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
              <th className="py-2 px-3">Select</th>
              <th className="py-2 px-4">Student</th>
              <th className="py-2 px-4">University</th>
              <th className="py-2 px-4">Event</th>
              <th className="py-2 px-4">Attendance</th>
              <th className="py-2 px-4 text-right">Certificate Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {registrations.map(r => {
              const isSelected = selectedIds.includes(r.id)
              const isEligible = r.attendance === 'Checked In'

              return (
                <tr key={r.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isEligible}
                      onChange={() => handleToggleSelect(r.id)}
                      className="w-4 h-4 accent-[#0F5D46] cursor-pointer disabled:opacity-40"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0F5D46]">
                    <div>{r.studentName}</div>
                    <div className="text-[10.5px] text-gray-400 font-normal">{r.email}</div>
                  </td>
                  <td className="py-3 px-4 text-[#1F2937] font-semibold">{r.college}</td>
                  <td className="py-3 px-4 text-[#5E6A68] truncate max-w-[160px]">{r.eventTitle}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isEligible ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {r.attendance}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isEligible ? (
                      <span className="text-[11px] font-bold text-[#0F5D46] hover:underline cursor-pointer">
                        Verify SHA-256 ↗
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Ineligible</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
