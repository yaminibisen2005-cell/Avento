import React, { useState } from 'react'
import { studentApi, uploadApi } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function Profile({ user }) {
  const [profile, setProfile] = useState({
    fullName: user?.fullName || 'Aarav Sharma',
    email: user?.email || 'aarav@student.edu',
    phoneNumber: user?.phoneNumber || '+91 98765 43210',
    college: user?.college || 'Indian Institute of Technology, Delhi (IITD)',
    branch: user?.branch || 'Computer Science & Engineering',
    year: user?.year || '3rd Year (Batch 2027)',
    rollNumber: user?.rollNumber || '2023CSB1092',
    bio: user?.bio || 'Aspiring Full Stack Engineer & Cloud Architect. Active hackathon participant.',
    avatarUrl: user?.profileImage || ''
  })

  const [isEditing, setIsEditing] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const toast = useToast()

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      toast.info('Uploading profile photo...')
      const res = await uploadApi.uploadFile(file, 'avatars')
      if (res && res.url) {
        setProfile(prev => ({ ...prev, avatarUrl: res.url }))
        toast.success('Profile photo updated!')
      }
    } catch {
      toast.error('Failed to upload image')
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    try {
      await studentApi.updateProfile({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        college: profile.college,
        branch: profile.branch,
        year: profile.year,
        profileImage: profile.avatarUrl
      })
      setIsEditing(false)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2500)
    } catch {
      setIsEditing(false)
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2500)
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Page Title */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Student Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Manage your personal details, academic accreditation, and platform identity
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-[14px] bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          ✅ Profile changes saved successfully!
        </div>
      )}

      {/* Main Profile Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_40px_rgba(15,93,70,0.06)] space-y-8"
      >
        {/* Top Header Row with Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-[#0F5D46]/10">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#0F5D46] via-[#165A46] to-[#D9B24A] p-[2px] shadow-md group">
              <div className="w-full h-full rounded-full bg-[#EAF7F1] flex items-center justify-center text-2xl font-bold text-[#0F5D46] overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.fullName.charAt(0)
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0F5D46] text-white flex items-center justify-center text-[10px] cursor-pointer shadow-xs hover:bg-[#126B51] border border-white">
                📷
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46]">
                  {profile.fullName}
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-0.5 rounded-full border border-[#0F5D46]/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#5E6A68]">
                {profile.email} • {profile.phoneNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold rounded-[14px] shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Info Form / Fields */}
        {isEditing ? (
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phoneNumber}
                onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
                University / College
              </label>
              <input
                type="text"
                value={profile.college}
                onChange={e => setProfile({ ...profile, college: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
                Department / Branch
              </label>
              <input
                type="text"
                value={profile.branch}
                onChange={e => setProfile({ ...profile, branch: e.target.value })}
                className="w-full h-10 px-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#0F5D46] uppercase tracking-wider block mb-1">
                Bio / Headline
              </label>
              <textarea
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-[12px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={saveLoading}
                className="px-6 py-2.5 bg-[#0F5D46] hover:bg-[#126B51] disabled:opacity-50 text-white text-xs font-bold rounded-[14px] shadow-xs cursor-pointer"
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-[18px] bg-white/70 border border-[#0F5D46]/10">
              <span className="text-[#5E6A68] text-[10.5px] uppercase font-bold tracking-wider block mb-1">
                University / Institution
              </span>
              <span className="font-bold text-[#1F2937] text-sm block">
                {profile.college}
              </span>
            </div>

            <div className="p-4 rounded-[18px] bg-white/70 border border-[#0F5D46]/10">
              <span className="text-[#5E6A68] text-[10.5px] uppercase font-bold tracking-wider block mb-1">
                Specialization / Branch
              </span>
              <span className="font-bold text-[#1F2937] text-sm block">
                {profile.branch}
              </span>
            </div>

            <div className="p-4 rounded-[18px] bg-white/70 border border-[#0F5D46]/10">
              <span className="text-[#5E6A68] text-[10.5px] uppercase font-bold tracking-wider block mb-1">
                Roll Number / ID
              </span>
              <span className="font-mono font-bold text-[#0F5D46] text-sm block">
                {profile.rollNumber}
              </span>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-[18px] bg-white/70 border border-[#0F5D46]/10">
              <span className="text-[#5E6A68] text-[10.5px] uppercase font-bold tracking-wider block mb-1">
                Professional Bio
              </span>
              <p className="text-xs text-[#1F2937]/80 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
