import React, { useState } from 'react'

export default function TabAdminSettings() {
  const [platformName, setPlatformName] = useState('AVENTO University Ecosystem')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [razorpayKey, setRazorpayKey] = useState('rzp_live_••••••••9104')
  const [razorpaySecret, setRazorpaySecret] = useState('••••••••••••••••')
  const [smtpHost, setSmtpHost] = useState('smtp.avento.io')
  const [sessionTimeout, setSessionTimeout] = useState('60')
  const [twoFactor, setTwoFactor] = useState(true)
  const [categories, setCategories] = useState(['Hackathons', 'Workshops', 'Conferences', 'Seminars', 'Competitions'])
  const [newCat, setNewCat] = useState('')
  const [certSignatory, setCertSignatory] = useState('Dr. S. K. Roy, Dean of Academic Affairs')
  const [saved, setSaved] = useState(false)

  const handleAddCat = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()])
      setNewCat('')
    }
  }

  const handleRemoveCat = (cat) => {
    setCategories(categories.filter(c => c !== cat))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-3xl space-y-6 text-left select-none pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Platform Architecture & System Governance
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Root configuration for payment settlement keys, cryptographic signing, and operational switches
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ All platform settings and cryptographic parameters persisted successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Core Identity & Maintenance */}
        <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0F5D46]">
            Platform Identity & Maintenance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Platform Brand Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Platform Logo Asset
              </label>
              <input
                type="text"
                readOnly
                value="/assets/logo.png (Vector Seal)"
                className="w-full h-10 px-3 rounded-[12px] bg-gray-50 border border-gray-200 text-gray-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
            <div>
              <span className="font-bold text-[#1F2937] block">Maintenance Mode</span>
              <span className="text-[11px] text-[#5E6A68]">Temporarily pauses student registrations for database migration.</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={e => setMaintenanceMode(e.target.checked)}
              className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
            />
          </div>
        </div>

        {/* 2. Category Taxonomy Manager */}
        <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-3">
          <h3 className="font-display font-bold text-base text-[#0F5D46]">
            Platform Event Taxonomy & Categories
          </h3>

          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <span key={c} className="px-3 py-1 bg-[#EAF7F1] text-[#0F5D46] font-bold rounded-full border border-[#0F5D46]/20 flex items-center gap-1.5">
                <span>{c}</span>
                <button type="button" onClick={() => handleRemoveCat(c)} className="hover:text-red-700 cursor-pointer font-bold">✕</button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add new category (e.g. Cultural Fests)..."
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              className="flex-1 h-9 px-3 text-xs rounded-[10px] bg-[#FAF8F2] border border-[#0F5D46]/20"
            />
            <button
              type="button"
              onClick={handleAddCat}
              className="px-4 py-2 bg-[#0F5D46] text-white font-bold rounded-[10px] cursor-pointer"
            >
              + Add
            </button>
          </div>
        </div>

        {/* 3. Payment Gateway & SMTP */}
        <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0F5D46]">
            Payment Gateways & Communications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Razorpay Live Key ID
              </label>
              <input
                type="text"
                value={razorpayKey}
                onChange={e => setRazorpayKey(e.target.value)}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                value={razorpaySecret}
                onChange={e => setRazorpaySecret(e.target.value)}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              SMTP Relay Host
            </label>
            <input
              type="text"
              value={smtpHost}
              onChange={e => setSmtpHost(e.target.value)}
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono"
            />
          </div>
        </div>

        {/* 4. Certificate Template Design */}
        <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-3">
          <h3 className="font-display font-bold text-base text-[#0F5D46]">
            Verifiable Certificate Template Specifications
          </h3>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Authorized Signatory Title
            </label>
            <input
              type="text"
              value={certSignatory}
              onChange={e => setCertSignatory(e.target.value)}
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-semibold"
            />
          </div>
        </div>

        {/* 5. Security & Authentication */}
        <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0F5D46]">
            Authentication & Security Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Session Inactivity Timeout (Minutes)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#FAF8F2] self-end">
              <div>
                <span className="font-bold text-[#1F2937] block">Enforce 2FA for Organizers</span>
                <span className="text-[10px] text-[#5E6A68]">Mandatory for financial actions</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={e => setTwoFactor(e.target.checked)}
                className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
        >
          Persist Platform Settings
        </button>
      </form>
    </div>
  )
}
