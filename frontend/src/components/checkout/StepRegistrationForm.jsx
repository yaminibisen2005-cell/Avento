import React, { useState } from 'react'

export default function StepRegistrationForm({ 
  formData, 
  setFormData, 
  onNext 
}) {
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Code of Conduct to register.')
      return
    }
    setErrorMsg('')
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left select-none">
      {errorMsg && (
        <div className="p-2.5 rounded-[12px] bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Row 1: Student Name & Email (Pre-filled / verified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={e => handleChange('fullName', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="Alex Morgan"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Student Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="alex@university.edu"
          />
        </div>
      </div>

      {/* Row 2: Phone & College */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={e => handleChange('phoneNumber', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            University / College
          </label>
          <input
            type="text"
            value={formData.college}
            onChange={e => handleChange('college', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="e.g. IIT Delhi, BITS Pilani"
          />
        </div>
      </div>

      {/* Row 3: Branch & Year of Study */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Department / Branch
          </label>
          <input
            type="text"
            value={formData.branch}
            onChange={e => handleChange('branch', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="e.g. Computer Science, AI/ML"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Academic Year
          </label>
          <select
            value={formData.year}
            onChange={e => handleChange('year', e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937] cursor-pointer"
          >
            <option value="1st Year">1st Year (Freshman)</option>
            <option value="2nd Year">2nd Year (Sophomore)</option>
            <option value="3rd Year">3rd Year (Junior)</option>
            <option value="4th Year">4th Year (Senior)</option>
            <option value="Postgraduate / Masters">Postgraduate / Masters</option>
          </select>
        </div>
      </div>

      {/* Row 4: Gender & Emergency Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={e => handleChange('gender', e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937] cursor-pointer"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-Binary">Non-Binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Emergency Contact
          </label>
          <input
            type="tel"
            value={formData.emergencyContact}
            onChange={e => handleChange('emergencyContact', e.target.value)}
            required
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="Parent / Guardian (+91)"
          />
        </div>
      </div>

      {/* Row 5: Team Name (Optional) & Special Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Team Name <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.teamName || ''}
            onChange={e => handleChange('teamName', e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="e.g. Neural Ninjas"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
            Dietary / Special Needs <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.specialRequirements || ''}
            onChange={e => handleChange('specialRequirements', e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-[12px] bg-white/90 border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46] text-[#1F2937]"
            placeholder="e.g. Vegetarian, Wheelchair access"
          />
        </div>
      </div>

      {/* Terms & Code of Conduct */}
      <div className="pt-2 flex items-start gap-2.5">
        <input
          type="checkbox"
          id="termsCheckModal"
          checked={agreeTerms}
          onChange={e => setAgreeTerms(e.target.checked)}
          className="w-4 h-4 rounded mt-0.5 text-[#0F5D46] accent-[#0F5D46] cursor-pointer"
        />
        <label htmlFor="termsCheckModal" className="text-xs text-[#5E6A68] cursor-pointer leading-tight">
          I confirm that all provided details are authentic, and I agree to the <strong className="text-[#0F5D46]">AVENTO Code of Conduct</strong> and Venue Rules.
        </label>
      </div>

      {/* Continue CTA */}
      <div className="pt-3">
        <button
          type="submit"
          className="w-full py-3.5 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs sm:text-sm rounded-[16px] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Continue to Order Summary</span>
          <span className="text-[#D9B24A] group-hover:translate-x-1 transition-transform font-bold">→</span>
        </button>
      </div>
    </form>
  )
}
