import React, { useState } from 'react'

export default function Settings({ onLogout }) {
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [marketingEnabled, setMarketingEnabled] = useState(false)
  const [publicProfile, setPublicProfile] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordState.newPassword.length < 8) {
      setStatusMsg('New password must be at least 8 characters long')
      return
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setStatusMsg('New passwords do not match')
      return
    }
    setStatusMsg('Password updated successfully!')
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setStatusMsg(''), 3000)
  }

  return (
    <div className="space-y-8 text-left select-none pb-12 max-w-4xl">
      {/* Page Title */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Account Settings & Security
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Configure security credentials, notification channels, and privacy preferences
        </p>
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-[14px] text-xs font-bold border ${
          statusMsg.includes('successfully') 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {statusMsg}
        </div>
      )}

      {/* SECTION 1: Password & Authentication */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-7 rounded-[26px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.05)] space-y-5"
      >
        <div className="border-b border-[#0F5D46]/10 pb-3">
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">
            Change Password
          </h3>
          <p className="text-xs text-[#5E6A68]">
            Ensure your account is protected with a strong, distinct password
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordState.currentPassword}
              onChange={e => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
              New Password (min. 8 chars)
            </label>
            <input
              type="password"
              value={passwordState.newPassword}
              onChange={e => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordState.confirmPassword}
              onChange={e => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              required
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold rounded-[14px] shadow-2xs transition-all cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* SECTION 2: Notification Preferences */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-7 rounded-[26px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.05)] space-y-4"
      >
        <div className="border-b border-[#0F5D46]/10 pb-3">
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">
            Notification Preferences
          </h3>
          <p className="text-xs text-[#5E6A68]">
            Manage where and how AVENTO communicates event alerts
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-[16px] bg-white/70 border border-[#0F5D46]/10 cursor-pointer">
            <div>
              <span className="font-bold text-[#1F2937] block">Event Reminders & QR Entry Passes</span>
              <span className="text-[#5E6A68] text-[11px]">Send instant pass alerts 24h prior to event commencement</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={e => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F5D46] accent-[#0F5D46] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-[16px] bg-white/70 border border-[#0F5D46]/10 cursor-pointer">
            <div>
              <span className="font-bold text-[#1F2937] block">Trending Hackathon Recommendations</span>
              <span className="text-[#5E6A68] text-[11px]">Weekly digest of curated events matching your engineering branch</span>
            </div>
            <input
              type="checkbox"
              checked={marketingEnabled}
              onChange={e => setMarketingEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F5D46] accent-[#0F5D46] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SECTION 3: Privacy & Session */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-7 rounded-[26px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.05)] space-y-4"
      >
        <div className="border-b border-[#0F5D46]/10 pb-3">
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">
            Privacy & Active Sessions
          </h3>
          <p className="text-xs text-[#5E6A68]">
            Manage credential visibility and terminate access across devices
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-center justify-between p-3 rounded-[16px] bg-white/70 border border-[#0F5D46]/10 cursor-pointer">
            <div>
              <span className="font-bold text-[#1F2937] block">Public Certificate Verification</span>
              <span className="text-[#5E6A68] text-[11px]">Allow recruiters and institutions to publicly verify your certificate URLs</span>
            </div>
            <input
              type="checkbox"
              checked={publicProfile}
              onChange={e => setPublicProfile(e.target.checked)}
              className="w-4 h-4 rounded text-[#0F5D46] accent-[#0F5D46] cursor-pointer"
            />
          </label>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#5E6A68]">
              Signed in on this browser (Chrome / Windows)
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-[12px] border border-red-200/80 transition-all cursor-pointer"
            >
              Terminate Session (Log Out)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
