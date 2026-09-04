import React, { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import TabAdminOverview from './tabs/TabAdminOverview'
import TabUserManagement from './tabs/TabUserManagement'
import TabOrganizerApproval from './tabs/TabOrganizerApproval'
import TabEventApproval from './tabs/TabEventApproval'
import TabAllEventsAdmin from './tabs/TabAllEventsAdmin'
import TabAdminAnalytics from './tabs/TabAdminAnalytics'
import TabAdminPayments from './tabs/TabAdminPayments'
import TabAdminCertificates from './tabs/TabAdminCertificates'
import TabAdminReports from './tabs/TabAdminReports'
import TabAnnouncements from './tabs/TabAnnouncements'
import TabAdminSettings from './tabs/TabAdminSettings'
import { adminService } from '../../services/adminService'

export default function AdminDashboard({ 
  user, 
  onLogout, 
  onBackToLanding 
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [overviewData, setOverviewData] = useState(null)
  const [users, setUsers] = useState([])
  const [pendingOrganizers, setPendingOrganizers] = useState([])
  const [pendingEvents, setPendingEvents] = useState([])
  const [allEvents, setAllEvents] = useState([])
  const [payments, setPayments] = useState([])
  const [certificatesData, setCertificatesData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = () => {
    Promise.all([
      adminService.getDashboardOverview(),
      adminService.getUsers(),
      adminService.getPendingOrganizers(),
      adminService.getPendingEvents(),
      adminService.getAllEvents(),
      adminService.getPayments(),
      adminService.getCertificates(),
      adminService.getAnnouncements()
    ]).then(([ov, usrs, pOrgs, pEvts, allEvts, pays, certs, anns]) => {
      setOverviewData(ov)
      setUsers(usrs)
      setPendingOrganizers(pOrgs)
      setPendingEvents(pEvts)
      setAllEvents(allEvts)
      setPayments(pays)
      setCertificatesData(certs)
      setAnnouncements(anns)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const adminName = user?.fullName || 'AVENTO Administrator'

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
      {/* Ambient Atmospheric Glow Orbs */}
      <div className="fixed top-8 left-[290px] w-96 h-96 bg-[#0F5D46]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-8 right-12 w-[34rem] h-[34rem] bg-[#D9B24A]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#0F5D46_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />

      {/* 1. FIXED GLASS SIDEBAR (280px) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        onBackToLanding={onBackToLanding}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        pendingApprovalsCount={pendingOrganizers.length}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Sticky Header */}
        <AdminTopbar
          adminName={adminName}
          onNavigateTab={setActiveTab}
          onLogout={onLogout}
          onMenuToggle={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Tab Router Views */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <TabAdminOverview
              overviewData={overviewData}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'users' && (
            <TabUserManagement
              users={users}
              onUsersUpdated={loadData}
            />
          )}

          {activeTab === 'organizer-approval' && (
            <TabOrganizerApproval
              pendingOrganizers={pendingOrganizers}
              onOrganizersUpdated={loadData}
            />
          )}

          {activeTab === 'events-approval' && (
            <TabEventApproval
              pendingEvents={pendingEvents}
              onEventsUpdated={loadData}
            />
          )}

          {activeTab === 'all-events' && (
            <TabAllEventsAdmin
              events={allEvents}
              onEventsUpdated={loadData}
            />
          )}

          {activeTab === 'analytics' && (
            <TabAdminAnalytics />
          )}

          {activeTab === 'payments' && (
            <TabAdminPayments
              payments={payments}
              onPaymentsUpdated={loadData}
            />
          )}

          {activeTab === 'certificates' && (
            <TabAdminCertificates
              certificatesData={certificatesData}
            />
          )}

          {activeTab === 'reports' && (
            <TabAdminReports />
          )}

          {activeTab === 'announcements' && (
            <TabAnnouncements
              announcements={announcements}
              onAnnouncementsUpdated={loadData}
            />
          )}

          {activeTab === 'settings' && (
            <TabAdminSettings />
          )}
        </main>
      </div>
    </div>
  )
}
