import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import DashboardHome from './DashboardHome'
import ExploreEvents from './ExploreEvents'
import MyRegistrations from './MyRegistrations'
import MyTickets from './MyTickets'
import Certificates from './Certificates'
import Notifications from './Notifications'
import Profile from './Profile'
import Settings from './Settings'
import PaymentHistory from './PaymentHistory'
import Wishlist from './Wishlist'
import EventDetails from '../event/EventDetails'
import ChatDrawer from '../chat/ChatDrawer'
import GlobalSearchModal from '../search/GlobalSearchModal'
import { studentDashboardApi } from '../../services/api'

export default function StudentDashboard({ user, onLogout, onBackToLanding, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    try { sessionStorage.setItem('avento_dashboard_tab', tab) } catch {}
    if (window.history) {
      window.history.replaceState({}, '', `/dashboard#${tab}`)
    }
  }

  useEffect(() => {
    studentDashboardApi.getDashboardData().then(data => {
      setDashboardData(data)
    })
  }, [])

  const studentName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'Student')

  const handleRegistrationCompleted = (_newReg) => {
    studentDashboardApi.getDashboardData().then(data => {
      setDashboardData(data)
    })
  }

  const unreadNotificationsCount = dashboardData?.notifications
    ? dashboardData.notifications.filter(n => !n.isRead).length
    : 0

  if (selectedEventId) {
    return (
      <EventDetails
        eventId={selectedEventId}
        onBack={() => setSelectedEventId(null)}
        currentUser={user}
        onRegisterSuccess={(reg) => {
          handleRegistrationCompleted(reg)
          setSelectedEventId(null)
          setActiveTab('tickets')
        }}
        onGoToTickets={() => {
          setSelectedEventId(null)
          setActiveTab('tickets')
        }}
      />
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#FAF8F2',
        color: '#1F2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif'
      }}
      className="min-h-screen flex relative overflow-x-hidden"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15"
          style={{ backgroundColor: '#0F5D46' }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10"
          style={{ backgroundColor: '#D9B24A' }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15"
          style={{ backgroundColor: '#EAF7F1' }}
        />
      </div>

      {/* 1. FIXED GLASS SIDEBAR (280px) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        unreadCount={unreadNotificationsCount}
        onLogout={onLogout}
        onBackToLanding={onBackToLanding}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Topbar (80px) */}
        <Topbar
          studentName={studentName}
          userEmail={user?.email || ''}
          unreadCount={unreadNotificationsCount}
          notifications={dashboardData?.notifications || []}
          onNavigateTab={handleTabChange}
          onLogout={onLogout}
          onBackToLanding={onBackToLanding}
          onMenuToggle={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenSearchModal={() => setSearchModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardHome
              data={dashboardData}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRegisterEvent={() => setActiveTab('explore')}
              onViewTicket={() => setActiveTab('tickets')}
              onViewDetails={(id) => setSelectedEventId(id)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreEvents
              events={dashboardData?.exploreEvents || []}
              currentUser={user}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onViewDetails={(id) => setSelectedEventId(id)}
              onRegisterSuccess={handleRegistrationCompleted}
              onGoToTickets={() => setActiveTab('tickets')}
            />
          )}

          {activeTab === 'wishlist' && (
            <Wishlist
              onSelectEvent={(id) => setSelectedEventId(id)}
            />
          )}

          {activeTab === 'registrations' && (
            <MyRegistrations
              registrations={dashboardData?.registrations || []}
              onViewTicket={() => setActiveTab('tickets')}
            />
          )}

          {activeTab === 'tickets' && (
            <MyTickets
              tickets={dashboardData?.upcomingEvents || []}
              studentName={studentName}
            />
          )}

          {activeTab === 'certificates' && (
            <Certificates
              certificates={dashboardData?.certificates || []}
              studentName={studentName}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentHistory
              currentUser={user}
            />
          )}

          {activeTab === 'notifications' && (
            <Notifications
              initialNotifications={dashboardData?.notifications || []}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              user={user}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              onLogout={onLogout}
            />
          )}
        </main>
      </div>

      {/* Floating Live Chat & Support Drawer */}
      <ChatDrawer currentUser={user} />

      {/* Global Command Palette / Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={(r) => {
          if (r.type === 'EVENT') setSelectedEventId(r.id)
        }}
      />
    </div>
  )
}
