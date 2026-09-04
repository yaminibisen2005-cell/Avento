import React, { useState } from 'react'

export default function TabSettings() {
  const [notifications, setNotifications] = useState({
    emailOnSale: true,
    scanAlerts: false,
    dailyDigest: true
  })

  const [twoFactor, setTwoFactor] = useState(true)
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
          Desk & Security Settings
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Configure on-site check-in alerts, authentication security, and session policies
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-[14px]">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Notification Preferences */}
      <div className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4">
        <h3 className="font-display font-bold text-base text-[#0F5D46]">
          Real-time Event Notifications
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#FAF8F2]">
            <div>
              <span className="font-bold text-[#1F2937] block">Ticket Purchase Email Alerts</span>
              <span className="text-[11px] text-[#5E6A68]">Receive instant notification for every new pass registered.</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailOnSale}
              onChange={e => setNotifications({ ...notifications, emailOnSale: e.target.checked })}
              className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#FAF8F2]">
            <div>
              <span className="font-bold text-[#1F2937] block">Turnstile Gate Scan Alerts</span>
              <span className="text-[11px] text-[#5E6A68]">Ping sound and notification on successful QR check-in.</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.scanAlerts}
              onChange={e => setNotifications({ ...notifications, scanAlerts: e.target.checked })}
              className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#FAF8F2]">
            <div>
              <span className="font-bold text-[#1F2937] block">Daily Attendance Summary Digest</span>
              <span className="text-[11px] text-[#5E6A68]">Receive end-of-day analytics and export CSV in email.</span>
            </div>
            <input
              type="checkbox"
              checked={notifications.dailyDigest}
              onChange={e => setNotifications({ ...notifications, dailyDigest: e.target.checked })}
              className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Password & Security */}
      <form onSubmit={handleSave} className="p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs space-y-4 text-xs">
        <h3 className="font-display font-bold text-base text-[#0F5D46]">
          Password & Authorization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-[14px] bg-[#FAF8F2]">
          <div>
            <span className="font-bold text-[#1F2937] block">Two-Factor Authentication (2FA)</span>
            <span className="text-[11px] text-[#5E6A68]">Requires OTP verification for financial payouts.</span>
          </div>
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={e => setTwoFactor(e.target.checked)}
            className="w-4 h-4 accent-[#0F5D46] cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
        >
          Update Security Settings
        </button>
      </form>
    </div>
  )
}
