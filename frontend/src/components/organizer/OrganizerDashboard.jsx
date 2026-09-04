import React, { useState, useEffect } from 'react'
import OrganizerSidebar from './OrganizerSidebar'
import OrganizerTopbar from './OrganizerTopbar'
import TabDashboardOverview from './tabs/TabDashboardOverview'
import TabCreateEvent from './tabs/TabCreateEvent'
import TabMyEvents from './tabs/TabMyEvents'
import TabRegistrations from './tabs/TabRegistrations'
import TabQRAttendance from './tabs/TabQRAttendance'
import TabCertificates from './tabs/TabCertificates'
import TabRevenueAnalytics from './tabs/TabRevenueAnalytics'
import TabNotifications from './tabs/TabNotifications'
import TabOrganizerProfile from './tabs/TabOrganizerProfile'
import TabSettings from './tabs/TabSettings'
import { organizerService } from '../../services/organizerService'

export default function OrganizerDashboard({ 
  user, 
  onLogout, 
  onBackToLanding 
}) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [overviewData, setOverviewData] = useState(null)
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    Promise.all([
      organizerService.getOverview(),
      organizerService.getEvents(),
      organizerService.getRegistrations()
    ]).then(([ov, evts, regs]) => {
      setOverviewData(ov)
      setEvents(evts)
      setRegistrations(regs)
    })
  }, [])

  const organizerName = user?.fullName || 'IIT Delhi Tech Council'

  const handleDeleteEvent = async (id) => {
    await organizerService.deleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const handleEventCreated = async () => {
    const updated = await organizerService.getEvents()
    setEvents(updated)
    setActiveTab('my-events')
  }

  return (
    <div 
      className="min-h-screen w-full relative flex text-[#1F2937] font-sans antialiased selection:bg-[#D9B24A]/25 selection:text-[#0F5D46] overflow-x-hidden"
      style={{
        backgroundColor: '#FAF8F2',
        backgroundImage: `
          radial-gradient(circle at 10% 15%, rgba(15, 93, 70, 0.08), transparent 35%),
          radial-gradient(circle at 90% 85%, rgba(217, 178, 74, 0.08), transparent 35%),
          radial-gradient(circle at 50% 50%, rgba(234, 247, 241, 0.45), transparent 50%),
          linear-gradient(180deg, #FAF8F2 0%, #F5F7F3 100%)
        `
      }}
    >
      {/* Ambient Gradient Orbs */}
      <div className="fixed top-12 left-[290px] w-96 h-96 bg-[#0F5D46]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-[32rem] h-[32rem] bg-[#D9B24A]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#0F5D46_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />

      {/* 1. SIDEBAR (280px Fixed) */}
      <OrganizerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={3}
        onLogout={onLogout}
        onBackToLanding={onBackToLanding}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Sticky Topbar (80px) */}
        <OrganizerTopbar
          organizerName={organizerName}
          unreadCount={3}
          onNavigateTab={setActiveTab}
          onLogout={onLogout}
          onMenuToggle={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Workspace Tab Views */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <TabDashboardOverview
              overviewData={overviewData}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'my-events' && (
            <TabMyEvents
              events={events}
              onNavigateTab={setActiveTab}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'create-event' && (
            <TabCreateEvent
              onEventCreated={handleEventCreated}
            />
          )}

          {activeTab === 'registrations' && (
            <TabRegistrations
              registrations={registrations}
            />
          )}

          {activeTab === 'attendance' && (
            <TabQRAttendance />
          )}

          {activeTab === 'certificates' && (
            <TabCertificates
              registrations={registrations}
            />
          )}

          {(activeTab === 'revenue' || activeTab === 'analytics') && (
            <TabRevenueAnalytics />
          )}

          {activeTab === 'notifications' && (
            <TabNotifications />
          )}

          {activeTab === 'profile' && (
            <TabOrganizerProfile
              organizerName={organizerName}
            />
          )}

          {activeTab === 'settings' && (
            <TabSettings />
          )}
        </main>
      </div>
    </div>
  )
}
