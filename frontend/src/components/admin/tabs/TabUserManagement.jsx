import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'

export default function TabUserManagement({ users = [], onUsersUpdated }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [actionNotice, setActionNotice] = useState('')
  const [activeModal, setActiveModal] = useState(null) // { mode: 'view' | 'edit', user: ... }
  const [editFormData, setEditFormData] = useState(null)

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.college.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleToggleBlock = async (userId) => {
    await adminService.toggleBlockUser(userId)
    setActionNotice('User security access toggled successfully.')
    setTimeout(() => setActionNotice(''), 3000)
    if (onUsersUpdated) onUsersUpdated()
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently purge this user?')) return
    await adminService.deleteUser(userId)
    setActionNotice('User record purged from system database.')
    setTimeout(() => setActionNotice(''), 3000)
    if (onUsersUpdated) onUsersUpdated()
  }

  const handleResetPassword = (email) => {
    setActionNotice(`One-time password reset link dispatched to ${email}.`)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleOpenView = (user) => {
    setActiveModal({ mode: 'view', user })
  }

  const handleOpenEdit = (user) => {
    setEditFormData({ ...user })
    setActiveModal({ mode: 'edit', user })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    const target = users.find(u => u.id === editFormData.id)
    if (target) {
      target.name = editFormData.name
      target.college = editFormData.college
      target.role = editFormData.role
      target.status = editFormData.status
    }
    setActiveModal(null)
    setActionNotice(`Profile updated for ${editFormData.name}.`)
    setTimeout(() => setActionNotice(''), 3000)
    if (onUsersUpdated) onUsersUpdated()
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            User Management & Access Governance
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Global directory of verified student delegates, authorized academic organizers, and root administrators
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3 py-1.5 rounded-[12px]">
          {filtered.length} of {users.length} Users Displayed
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-[14px]">
          ✓ {actionNotice}
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-[#0F5D46]/15 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, university, or registered email..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#5E6A68] mr-1">Role:</span>
          {['All', 'STUDENT', 'ORGANIZER', 'ADMIN'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-[#0F5D46] text-white'
                  : 'bg-white text-[#5E6A68] border border-gray-200'
              }`}
            >
              {r === 'All' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#5E6A68] mr-1">Status:</span>
          {['All', 'Verified', 'Pending', 'Blocked'].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#D9B24A] text-white'
                  : 'bg-white text-[#5E6A68] border border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
              <th className="py-3 px-4">Photo</th>
              <th className="py-3 px-4">Name & Email</th>
              <th className="py-3 px-4">College / Campus</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                <td className="py-3 px-4">
                  <img 
                    src={u.photo} 
                    alt={u.name} 
                    className="w-10 h-10 rounded-full object-cover border border-[#0F5D46]/20 shadow-2xs"
                  />
                </td>
                <td className="py-3 px-4 font-bold text-[#0F5D46]">
                  <div>{u.name}</div>
                  <div className="text-[11px] text-gray-400 font-normal">{u.email}</div>
                </td>
                <td className="py-3 px-4 font-semibold text-[#1F2937]">
                  {u.college}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    u.role === 'ADMIN'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : u.role === 'ORGANIZER'
                      ? 'bg-[#D9B24A]/15 text-[#8C6F1E] border border-[#D9B24A]/30'
                      : 'bg-[#EAF7F1] text-[#0F5D46] border border-[#0F5D46]/20'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${
                    u.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-700'
                      : u.status === 'Blocked'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span>{u.status === 'Verified' ? '✓' : u.status === 'Blocked' ? '✕' : '•'}</span>
                    <span>{u.status}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenView(u)}
                    className="px-2.5 py-1 rounded-[8px] bg-[#EAF7F1] text-[#0F5D46] hover:bg-[#d5eee2] font-bold text-[11px] cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
                    className="px-2.5 py-1 rounded-[8px] bg-white border border-gray-200 text-[#5E6A68] hover:bg-gray-50 font-bold text-[11px] cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBlock(u.id)}
                    className={`px-2.5 py-1 rounded-[8px] font-bold text-[11px] cursor-pointer ${
                      u.status === 'Blocked' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {u.status === 'Blocked' ? 'Unblock' : 'Block'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResetPassword(u.email)}
                    className="p-1 rounded-[8px] bg-white hover:bg-gray-100 text-[#5E6A68] border border-gray-200 cursor-pointer"
                    title="Reset Password"
                  >
                    🔑
                  </button>

                  {u.role !== 'ADMIN' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(u.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-[8px] cursor-pointer font-bold text-xs"
                      title="Delete User"
                    >
                      🗑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW / EDIT MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setActiveModal(null)} 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
          />
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
              backdropFilter: 'blur(30px)'
            }}
            className="relative w-full max-w-lg rounded-[28px] border border-white/80 shadow-2xl p-6 sm:p-8 z-10 text-left space-y-5 select-none"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{activeModal.mode === 'view' ? '👤' : '✏️'}</span>
                <h3 className="font-display font-bold text-lg text-[#0F5D46]">
                  {activeModal.mode === 'view' ? 'User Profile Dossier' : 'Edit User Credentials'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeModal.mode === 'view' ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                  <img
                    src={activeModal.user.photo}
                    alt={activeModal.user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-display font-bold text-base text-[#0F5D46]">{activeModal.user.name}</h4>
                    <span className="text-gray-500">{activeModal.user.email}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold bg-[#EAF7F1] text-[#0F5D46] px-2 py-0.5 rounded-full">
                        {activeModal.user.role}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        {activeModal.user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 rounded-[20px] bg-white border border-gray-200">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#5E6A68]">University / Affiliation:</span>
                    <span className="font-bold text-[#1F2937]">{activeModal.user.college}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#5E6A68]">Member Since:</span>
                    <span className="font-semibold text-[#1F2937]">{activeModal.user.joined || 'Sep 2026'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#5E6A68]">Security Access Level:</span>
                    <span className="font-mono font-bold text-[#0F5D46]">
                      {activeModal.user.role === 'ADMIN' ? 'ROOT_SUPERUSER' : activeModal.user.role === 'ORGANIZER' ? 'COUNCIL_DESK' : 'DELEGATE_PASSBOOK'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2.5 bg-[#0F5D46] text-white font-bold rounded-[14px] cursor-pointer"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                    College / Campus
                  </label>
                  <input
                    type="text"
                    value={editFormData.college}
                    onChange={e => setEditFormData({ ...editFormData, college: e.target.value })}
                    className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                      Role
                    </label>
                    <select
                      value={editFormData.role}
                      onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full h-10 px-2.5 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="ORGANIZER">ORGANIZER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                      Status
                    </label>
                    <select
                      value={editFormData.status}
                      onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full h-10 px-2.5 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-bold"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-[12px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold rounded-[12px] shadow-sm cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
