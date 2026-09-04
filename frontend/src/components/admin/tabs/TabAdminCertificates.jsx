import React, { useState } from 'react'

export default function TabAdminCertificates({ certificatesData }) {
  const [search, setSearch] = useState('')

  const data = certificatesData || {
    totalIssued: 1280,
    verificationRequests: 432,
    invalidRevoked: 2,
    recentlyGenerated: [
      { id: 'CERT-AVT-9921', student: 'Aarav Sharma', event: 'National AI Hackathon', hash: 'SHA256-A841', issuedOn: 'Sep 30, 2026' },
      { id: 'CERT-AVT-9922', student: 'Sneha Patel', event: 'Global Tech Summit', hash: 'SHA256-B192', issuedOn: 'Oct 01, 2026' },
      { id: 'CERT-AVT-9923', student: 'Rohan Gupta', event: 'DevOps Masterclass', hash: 'SHA256-C441', issuedOn: 'Oct 02, 2026' }
    ]
  }

  const filtered = (data.recentlyGenerated || []).filter(c =>
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.student.toLowerCase().includes(search.toLowerCase()) ||
    c.hash.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Tamper-Proof Certificate & Credential Audit
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Cryptographic ledger of verifiable SHA-256 digital certificates issued to event attendees
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10.5px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-1">
            TOTAL ISSUED & ACTIVE
          </span>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            {data.totalIssued} Certificates
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Immutable on registry</span>
        </div>

        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10.5px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-1">
            EXTERNAL VERIFICATION CHECKS
          </span>
          <div className="text-2xl font-extrabold text-[#D9B24A]">
            {data.verificationRequests} Hits
          </div>
          <span className="text-[11px] text-[#5E6A68]">Recruiter & university lookups</span>
        </div>

        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10.5px] uppercase font-bold text-[#5E6A68] tracking-wider block mb-1">
            FLAGGED / REVOKED
          </span>
          <div className="text-2xl font-extrabold text-red-600">
            {data.invalidRevoked} Revoked
          </div>
          <span className="text-[11px] text-red-600 font-semibold">Attendance &lt; 85% audit</span>
        </div>
      </div>

      {/* Certificate Search */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-[#0F5D46]/15 flex items-center shadow-2xs">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search certificate ID, student name, or SHA-256 hash..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Recipient Student</th>
              <th className="py-3 px-4">Event Context</th>
              <th className="py-3 px-4">Security Hash</th>
              <th className="py-3 px-4">Issued On</th>
              <th className="py-3 px-4 text-right">Verification Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0F5D46]">
                  {c.id}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#1F2937]">
                  {c.student}
                </td>
                <td className="py-3.5 px-4 text-[#5E6A68]">
                  {c.event}
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-[#8C6F1E] bg-[#D9B24A]/10 px-2 py-0.5 rounded-full w-fit">
                  {c.hash}
                </td>
                <td className="py-3.5 px-4 text-[#5E6A68]">
                  {c.issuedOn}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[11px] font-bold text-[#0F5D46] hover:underline cursor-pointer">
                    Verify Public Seal ↗
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
