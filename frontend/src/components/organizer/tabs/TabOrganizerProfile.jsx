import React, { useState } from 'react'

export default function TabOrganizerProfile({ 
  organizerName = 'IIT Delhi Tech Council' 
}) {
  const [profile, setProfile] = useState({
    name: organizerName,
    email: 'techcouncil@iitd.ac.in',
    phone: '+91 11 2659 7135',
    website: 'https://iitd.ac.in',
    bio: 'The student-led technical council of IIT Delhi organizing national symposiums, developer hackathons, and research conferences since 2012.',
    gstin: '07AAAAI9928P1Z5',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '•••• •••• •••• 9104',
    ifsc: 'HDFC0000120'
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Organization Profile & Compliance
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Institutional identity, verified host badge credentials, and settlement account
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-[14px]">
          ✓ Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-5">
        {/* Organization Name & Verified Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[18px] bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-2xl border border-[#0F5D46]/20 shadow-2xs">
              🏛
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#0F5D46]">
                {profile.name}
              </h3>
              <span className="text-[10px] uppercase font-extrabold text-[#D9B24A] bg-[#D9B24A]/10 border border-[#D9B24A]/30 px-2 py-0.5 rounded-full">
                ✓ Verified Academic Host
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Support Phone
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="text-xs">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Organization Bio & Legacy
          </label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
          />
        </div>

        {/* Financial Settlement & GST */}
        <div className="pt-4 border-t border-gray-100 space-y-3 text-xs">
          <span className="font-bold text-xs text-[#0F5D46] block uppercase tracking-wider">
            GST & Payout Settlement Details
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                GSTIN Registration
              </label>
              <input
                type="text"
                value={profile.gstin}
                onChange={e => setProfile({ ...profile, gstin: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Settlement Bank
              </label>
              <input
                type="text"
                value={profile.bankName}
                onChange={e => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  )
}
