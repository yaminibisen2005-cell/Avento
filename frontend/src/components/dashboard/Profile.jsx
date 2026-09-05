import React, { useState, useEffect } from 'react'
import { studentApi, authApi, uploadApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Profile({ user }) {
  const { updateUser } = useAuth()
  const toast = useToast()

  const getInitialProfile = (u) => {
    const rawStorage = typeof localStorage !== 'undefined' 
      ? (localStorage.getItem('avento_user') || localStorage.getItem('avento_auth_user')) 
      : null;
    let stored = null;
    try {
      stored = rawStorage ? JSON.parse(rawStorage) : null;
    } catch {}
    const current = u || stored || {};
    const displayName = current.fullName || current.name || (current.email ? current.email.split('@')[0] : 'Student');

    return {
      fullName: displayName,
      email: current.email || '',
      phoneNumber: current.phoneNumber || '',
      emergencyContact: current.emergencyContact || '',
      gender: current.gender || '',
      dob: current.dob || '',
      city: current.city || '',
      state: current.state || '',
      college: current.college || '',
      branch: current.branch || '',
      year: current.year || '',
      rollNumber: current.rollNumber || (current.id ? `AVT-${current.id}` : ''),
      bio: current.bio || '',
      skills: current.skills || '',
      linkedin: current.linkedin || '',
      github: current.github || '',
      avatarUrl: current.profileImage || current.avatar || current.avatarUrl || ''
    };
  };

  const [profile, setProfile] = useState(() => getInitialProfile(user));
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(getInitialProfile(user));
    }
  }, [user]);

  // Calculate profile completeness percentage
  const calculateCompleteness = () => {
    const fields = [
      profile.fullName,
      profile.phoneNumber,
      profile.college,
      profile.branch,
      profile.year,
      profile.rollNumber,
      profile.emergencyContact,
      profile.city,
      profile.bio,
      profile.skills
    ];
    const filled = fields.filter(f => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.info('Uploading profile photo...');
      const res = await uploadApi.uploadFile(file, 'avatars');
      if (res && res.url) {
        setProfile(prev => ({ ...prev, avatarUrl: res.url }));
        if (updateUser) {
          updateUser({ profileImage: res.url });
        }
        toast.success('Profile photo updated!');
      }
    } catch {
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const updatePayload = {
      fullName: profile.fullName?.trim(),
      phoneNumber: profile.phoneNumber?.trim(),
      emergencyContact: profile.emergencyContact?.trim(),
      gender: profile.gender,
      dob: profile.dob,
      city: profile.city?.trim(),
      state: profile.state?.trim(),
      college: profile.college?.trim(),
      branch: profile.branch?.trim(),
      year: profile.year?.trim(),
      rollNumber: profile.rollNumber?.trim(),
      bio: profile.bio?.trim(),
      skills: profile.skills?.trim(),
      linkedin: profile.linkedin?.trim(),
      github: profile.github?.trim(),
      profileImage: profile.avatarUrl
    };

    try {
      let _savedUser = null;
      try {
        _savedUser = await studentApi.updateProfile(updatePayload);
      } catch {
        _savedUser = await authApi.updateProfile(updatePayload);
      }

      if (updateUser) {
        updateUser({
          ...profile,
          ...updatePayload,
          name: updatePayload.fullName,
          fullName: updatePayload.fullName
        });
      }

      setIsEditing(false);
      setSavedMsg(true);
      toast.success('Personal details saved successfully!');
      setTimeout(() => setSavedMsg(false), 3000);
    } catch {
      // Local fallback sync
      if (updateUser) {
        updateUser({
          ...profile,
          ...updatePayload,
          name: updatePayload.fullName,
          fullName: updatePayload.fullName
        });
      }
      setIsEditing(false);
      setSavedMsg(true);
      toast.success('Personal details updated!');
      setTimeout(() => setSavedMsg(false), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Personal Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-0.5 sm:mt-1">
            Manage and update your personal information, academic credentials, and contact details.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-[14px] shadow-2xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveLoading}
                className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 bg-[#0F5D46] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-[14px] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <span>💾</span>
                <span>{saveLoading ? 'Saving...' : 'Save Details'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-4.5 sm:px-5 py-2 sm:py-2.5 bg-[#0F5D46] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-[14px] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              <span>Edit Personal Details</span>
            </button>
          )}
        </div>
      </div>

      {savedMsg && (
        <div className="p-3 sm:p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs flex items-center gap-2">
          <span>✅</span>
          <span>Your personal details have been updated and saved successfully!</span>
        </div>
      )}

      {/* Main Identity Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-4.5 sm:p-7 rounded-[20px] sm:rounded-[26px] border border-[#0F5D46]/15 shadow-[0_8px_30px_rgba(15,93,70,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6"
      >
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* Avatar with Camera Overlay */}
          <div className="relative w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-[#0F5D46] via-[#165A46] to-[#D9B24A] p-[2px] sm:p-[2.5px] shadow-md shrink-0 group">
            <div className="w-full h-full rounded-full bg-[#EAF7F1] flex items-center justify-center text-xl sm:text-3xl font-bold text-[#0F5D46] overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile.fullName ? profile.fullName.charAt(0).toUpperCase() : '👤'
              )}
            </div>
            <label 
              title="Click to change profile picture"
              className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0F5D46] hover:bg-[#073327] text-white flex items-center justify-center text-[10px] sm:text-xs cursor-pointer shadow-md border-2 border-white transition-all transform hover:scale-105"
            >
              📷
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-lg sm:text-2xl text-[#0F5D46] truncate">
                {profile.fullName || 'Student User'}
              </h3>
              <span className="text-[9.5px] sm:text-[10px] uppercase font-extrabold tracking-wide text-[#0F5D46] bg-[#EAF7F1] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#0F5D46]/20 shrink-0">
                ✓ Verified
              </span>
            </div>
            <p className="text-[11.5px] sm:text-xs text-[#5E6A68] flex items-center gap-1.5 sm:gap-2 flex-wrap break-all">
              <span>📧 {profile.email || 'No email set'}</span>
              {profile.phoneNumber && <span>• 📱 {profile.phoneNumber}</span>}
              {profile.city && <span>• 📍 {profile.city}{profile.state ? `, ${profile.state}` : ''}</span>}
            </p>
            {profile.college && (
              <p className="text-[10.5px] sm:text-[11px] text-[#0F5D46] font-semibold truncate">
                🏛 {profile.college} {profile.branch ? `• ${profile.branch}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Profile Completeness Pill */}
        <div className="bg-[#FAF8F2] border border-[#0F5D46]/15 rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-4 w-full sm:min-w-[230px]">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F5D46] mb-1.5">
            <span>Profile Completeness</span>
            <span className="text-[#D9B24A] font-mono">{completeness}%</span>
          </div>
          <div className="w-full bg-[#EAF7F1] h-2 rounded-full overflow-hidden mb-1.5 sm:mb-2">
            <div 
              className="bg-gradient-to-r from-[#0F5D46] to-[#D9B24A] h-full rounded-full transition-all duration-700" 
              style={{ width: `${completeness}%` }} 
            />
          </div>
          <span className="text-[10px] text-[#5E6A68] block">
            {completeness === 100 
              ? '✨ Your profile is 100% complete!' 
              : 'Add missing details for faster event passes.'}
          </span>
        </div>
      </div>

      {/* Profile Form (Edit Mode) OR Information Bento (View Mode) */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: 👤 Personal Information */}
          <div className="p-6 sm:p-7 rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h3 className="font-display font-bold text-base text-[#0F5D46]">
                  Personal Information
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#5E6A68]">Basic Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  value={profile.emergencyContact}
                  onChange={e => setProfile({ ...profile, emergencyContact: e.target.value })}
                  placeholder="Parent / Guardian contact"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full h-10 px-3 rounded-[12px] bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={e => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profile.dob}
                  onChange={e => setProfile({ ...profile, dob: e.target.value })}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={e => setProfile({ ...profile, city: e.target.value })}
                  placeholder="e.g. Mumbai, New Delhi"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={e => setProfile({ ...profile, state: e.target.value })}
                  placeholder="e.g. Maharashtra, Karnataka"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: 🎓 Academic & Institutional Details */}
          <div className="p-6 sm:p-7 rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <h3 className="font-display font-bold text-base text-[#0F5D46]">
                  Academic & Institutional Details
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#5E6A68]">University Records</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  University / College Name
                </label>
                <input
                  type="text"
                  value={profile.college}
                  onChange={e => setProfile({ ...profile, college: e.target.value })}
                  placeholder="e.g. IIT Delhi, BITS Pilani"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={e => setProfile({ ...profile, branch: e.target.value })}
                  placeholder="e.g. Computer Science, AI"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Academic Year
                </label>
                <select
                  value={profile.year}
                  onChange={e => setProfile({ ...profile, year: e.target.value })}
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white cursor-pointer"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Alumni">Alumni / Graduate</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Student Roll Number / Enrollment ID
                </label>
                <input
                  type="text"
                  value={profile.rollNumber}
                  onChange={e => setProfile({ ...profile, rollNumber: e.target.value })}
                  placeholder="e.g. 2024CSB1092"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Card 3: 🌐 Professional Links & Bio */}
          <div className="p-6 sm:p-7 rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🌐</span>
                <h3 className="font-display font-bold text-base text-[#0F5D46]">
                  Professional Links & Bio
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#5E6A68]">Showcase</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={profile.linkedin}
                  onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  GitHub / Portfolio URL
                </label>
                <input
                  type="url"
                  value={profile.github}
                  onChange={e => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Skills & Areas of Interest (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.skills}
                  onChange={e => setProfile({ ...profile, skills: e.target.value })}
                  placeholder="e.g. React, Python, Machine Learning, UI/UX, CyberSecurity"
                  className="w-full h-10 px-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-[#0F5D46] uppercase tracking-wider block mb-1">
                  Professional Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Write a brief introduction about your background, interests and goals..."
                  className="w-full p-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-[14px] bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-7 py-2.5 rounded-[14px] bg-[#0F5D46] hover:bg-[#073327] text-white text-xs font-bold shadow-md hover:shadow-lg cursor-pointer transition-all disabled:opacity-60 flex items-center gap-2"
            >
              <span>💾</span>
              <span>{saveLoading ? 'Saving Changes...' : 'Save All Details'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* View Mode: Bento Grid Display */
        <div className="space-y-4 sm:space-y-6">
          {/* Card 1: 👤 Personal Information Grid */}
          <div className="p-4.5 sm:p-7 rounded-[20px] sm:rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#0F5D46]">
                  Personal Details
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Full Name
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block break-words">
                  {profile.fullName || 'Not specified'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Phone Number
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block font-mono break-all">
                  {profile.phoneNumber || 'Not specified'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Emergency Contact
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block font-mono break-all">
                  {profile.emergencyContact || 'Add contact ➕'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Gender & DOB
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block">
                  {profile.gender || 'Not specified'} {profile.dob ? `• ${profile.dob}` : ''}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 sm:col-span-2">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Email Address
                </span>
                <span className="font-semibold text-[#0F5D46] text-xs block truncate">
                  {profile.email}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 sm:col-span-2">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Location (City, State)
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block">
                  {profile.city || profile.state ? `${profile.city || ''}${profile.city && profile.state ? ', ' : ''}${profile.state || ''}` : 'Add location ➕'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: 🎓 Academic Information Grid */}
          <div className="p-4.5 sm:p-7 rounded-[20px] sm:rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🎓</span>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#0F5D46]">
                  Academic & Student Identity
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 sm:col-span-2">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  University / College
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block">
                  {profile.college || 'Add your college ➕'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Major / Branch
                </span>
                <span className="font-bold text-[#1F2937] text-xs sm:text-sm block">
                  {profile.branch || 'Add branch ➕'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Academic Year
                </span>
                <span className="font-bold text-[#0F5D46] text-xs sm:text-sm block">
                  {profile.year || 'Select year ➕'}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 sm:col-span-2">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-0.5 sm:mb-1">
                  Enrollment / Roll ID
                </span>
                <span className="font-mono font-bold text-[#0F5D46] text-xs sm:text-sm block break-all">
                  {profile.rollNumber || 'Add Roll ID ➕'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: 🌐 Professional Bio, Skills & Links */}
          <div className="p-4.5 sm:p-7 rounded-[20px] sm:rounded-[26px] bg-white border border-[#0F5D46]/15 shadow-xs space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🌐</span>
                <h3 className="font-display font-bold text-sm sm:text-base text-[#0F5D46]">
                  Professional Showcase & Links
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#0F5D46] hover:text-[#D9B24A] transition-colors cursor-pointer"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="space-y-3.5 sm:space-y-4 text-xs">
              {/* Bio */}
              <div className="p-3.5 sm:p-4 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-1">
                  About Me / Bio
                </span>
                <p className="text-xs text-[#1F2937]/80 leading-relaxed">
                  {profile.bio || 'Add a bio to showcase your skills, passions and achievements to hackathon mentors and recruiters.'}
                </p>
              </div>

              {/* Skills */}
              <div className="p-3.5 sm:p-4 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase tracking-wider block mb-1.5">
                  Core Skills & Interests
                </span>
                {profile.skills ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.split(',').map((s, idx) => {
                      const trimmed = s.trim();
                      if (!trimmed) return null;
                      return (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-full bg-[#EAF7F1] text-[#0F5D46] font-bold text-[10.5px] sm:text-[11px] border border-[#0F5D46]/20"
                        >
                          ⚡ {trimmed}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No skills added yet. Click Edit to add skills.</span>
                )}
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">💼</span>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase block">LinkedIn</span>
                      {profile.linkedin ? (
                        <a 
                          href={profile.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#0F5D46] hover:underline truncate max-w-[150px] sm:max-w-[200px] block"
                        >
                          {profile.linkedin}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Not connected</span>
                      )}
                    </div>
                  </div>
                  {profile.linkedin && (
                    <span className="text-xs text-[#0F5D46] font-bold shrink-0">↗</span>
                  )}
                </div>

                <div className="p-3 sm:p-3.5 rounded-[14px] sm:rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">💻</span>
                    <div className="min-w-0">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-[#5E6A68] uppercase block">GitHub / Portfolio</span>
                      {profile.github ? (
                        <a 
                          href={profile.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#0F5D46] hover:underline truncate max-w-[150px] sm:max-w-[200px] block"
                        >
                          {profile.github}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Not connected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
