import React, { useState } from 'react'
import RegistrationCard from './RegistrationCard'

export default function MyRegistrations({ registrations = [], onViewTicket }) {
  const [activeTab, setActiveTab] = useState('Upcoming')

  const tabs = ['Upcoming', 'Completed', 'Cancelled']

  const filtered = registrations.filter(r => r.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Title */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          My Event Registrations
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Manage your verified registrations, status logs, and entry passes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#0F5D46]/10 pb-3">
        {tabs.map((tab) => {
          const count = registrations.filter(r => r.status.toLowerCase() === tab.toLowerCase()).length
          const isActive = activeTab === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0F5D46] text-white shadow-2xs'
                  : 'text-[#5E6A68] hover:text-[#0F5D46] hover:bg-white/80'
              }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Registration Cards List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((reg) => (
            <RegistrationCard
              key={reg.id}
              registration={reg}
              onViewTicket={() => onViewTicket && onViewTicket(reg)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white/70 backdrop-blur-md rounded-[24px] border border-white/60">
          <span className="text-4xl block mb-2">📋</span>
          <h3 className="font-bold text-lg text-[#0F5D46]">No {activeTab} Registrations</h3>
          <p className="text-xs text-[#5E6A68] mt-1">
            You currently have no events marked as {activeTab.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  )
}
