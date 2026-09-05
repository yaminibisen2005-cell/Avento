import React from 'react'
import CertificateCard from './CertificateCard'

export default function Certificates({ certificates = [], studentName = 'Student' }) {
  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Title */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Verified Credentials & Certificates
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Cryptographically signed proof of attendance, participation, and accolades
        </p>
      </div>

      {/* Grid of Certificates */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              studentName={studentName}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/70 backdrop-blur-md rounded-[24px] border border-white/60">
          <span className="text-4xl block mb-2">🏆</span>
          <h3 className="font-bold text-lg text-[#0F5D46]">No Certificates Yet</h3>
          <p className="text-xs text-[#5E6A68] mt-1">
            Complete attended events and check in with your QR pass to earn official verifiable certificates.
          </p>
        </div>
      )}
    </div>
  )
}
