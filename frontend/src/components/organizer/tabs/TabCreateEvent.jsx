import React, { useState } from 'react'
import { organizerService } from '../../../services/organizerService'

export default function TabCreateEvent({ onEventCreated }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const [form, setForm] = useState({
    title: '',
    category: 'Hackathons',
    description: '',
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    mode: 'In-Person',
    venue: '',
    seats: '300',
    date: 'Nov 20 - 22, 2026',
    deadline: 'Nov 15, 2026',
    tags: 'AI, Agents, LLM',
    pricingType: 'Free',
    fee: 'Free',
    certificateAvailable: true,
    rules: 'All code must be authored during the hackathon window.',
    eligibility: 'All undergraduate and graduate university students'
  })

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handlePublish = async (status = 'Published') => {
    setIsSubmitting(true)
    const newEvt = await organizerService.createEvent({ ...form, status })
    setIsSubmitting(false)
    setSuccessMsg(`Event "${newEvt.title}" created successfully as ${status}!`)
    setTimeout(() => {
      setSuccessMsg('')
      if (onEventCreated) onEventCreated()
    }, 1500)
  }

  const stepsMeta = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Schedule & Speakers' },
    { num: 3, label: 'Rules & Guidelines' },
    { num: 4, label: 'Pricing & Publish' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left select-none pb-12">
      {/* Title & Wizard Header */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Create New Event
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Publish university hackathons, masterclasses, or research symposiums with instant QR passes
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-[18px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold text-center">
          ✅ {successMsg}
        </div>
      )}

      {/* Step Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stepsMeta.map((s) => (
          <div
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-[16px] border text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${
              step === s.num
                ? 'bg-[#0F5D46] text-white border-[#0F5D46] shadow-xs'
                : step > s.num
                ? 'bg-[#EAF7F1] text-[#0F5D46] border-[#0F5D46]/20'
                : 'bg-white text-gray-400 border-gray-200'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === s.num ? 'bg-white text-[#0F5D46]' : 'bg-gray-100 text-gray-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </span>
            <span className="truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Wizard Step Body */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 252, 248, 0.85) 100%)',
          backdropFilter: 'blur(20px)'
        }}
        className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-xs space-y-6"
      >
        {/* ================= STEP 1: BASIC INFORMATION ================= */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F5D46]">
              Step 1: Event Identity & Overview
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g. National Agentic AI Hackathon 2026"
                className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full h-11 px-3 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
                >
                  <option value="Hackathons">Hackathons</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Seminars">Seminars</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Conferences">Conferences</option>
                  <option value="Webinars">Webinars</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Event Mode
                </label>
                <select
                  value={form.mode}
                  onChange={e => handleChange('mode', e.target.value)}
                  className="w-full h-11 px-3 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
                >
                  <option value="In-Person">In-Person (On Campus)</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Virtual / Online</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Venue & Hall Details
                </label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={e => handleChange('venue', e.target.value)}
                  placeholder="e.g. Main Auditorium, IIT Delhi Campus"
                  className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Maximum Seat Capacity
                </label>
                <input
                  type="number"
                  value={form.seats}
                  onChange={e => handleChange('seats', e.target.value)}
                  placeholder="300"
                  className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Description & Outcomes
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Detail what attendees will build, mentors present, and awards..."
                className="w-full p-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
              >
                Next: Schedule & Speakers →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: TIMELINE & SPEAKERS ================= */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F5D46]">
              Step 2: Schedule & Keynote Speakers
            </h3>

            <div className="p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10 space-y-3">
              <span className="font-bold text-xs text-[#0F5D46] block">Session 1 Milestone</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  defaultValue="09:00 AM"
                  placeholder="Time"
                  className="h-10 px-3 text-xs rounded-[12px] bg-white border border-gray-200"
                />
                <input
                  type="text"
                  defaultValue="Turnstile QR Verification & Delegate Kit"
                  placeholder="Title"
                  className="h-10 px-3 text-xs rounded-[12px] bg-white border border-gray-200"
                />
              </div>
            </div>

            <div className="p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10 space-y-3">
              <span className="font-bold text-xs text-[#0F5D46] block">Session 2 Milestone</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  defaultValue="10:30 AM"
                  placeholder="Time"
                  className="h-10 px-3 text-xs rounded-[12px] bg-white border border-gray-200"
                />
                <input
                  type="text"
                  defaultValue="Keynote & Problem Statements Release"
                  placeholder="Title"
                  className="h-10 px-3 text-xs rounded-[12px] bg-white border border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-[14px] cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
              >
                Next: Rules & Guidelines →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: RULES & GUIDELINES ================= */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F5D46]">
              Step 3: Participation Rules & Eligibility
            </h3>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Eligibility Criteria
              </label>
              <input
                type="text"
                value={form.eligibility}
                onChange={e => handleChange('eligibility', e.target.value)}
                className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Competition & Submission Rules
              </label>
              <textarea
                rows={3}
                value={form.rules}
                onChange={e => handleChange('rules', e.target.value)}
                className="w-full p-3 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-[16px] bg-[#FAF8F2] border border-[#0F5D46]/10">
              <input
                type="checkbox"
                id="certCheck"
                checked={form.certificateAvailable}
                onChange={e => handleChange('certificateAvailable', e.target.checked)}
                className="w-4 h-4 accent-[#0F5D46]"
              />
              <label htmlFor="certCheck" className="text-xs font-bold text-[#0F5D46] cursor-pointer">
                Issue Blockchain-Backed Verifiable Digital Certificates to Attendees
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-[14px] cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
              >
                Next: Pricing & Publish →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: PRICING & PUBLISH ================= */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F5D46]">
              Step 4: Ticket Pricing & Review
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  handleChange('pricingType', 'Free')
                  handleChange('fee', 'Free')
                }}
                className={`p-4 rounded-[18px] border text-xs font-bold cursor-pointer transition-all ${
                  form.pricingType === 'Free' ? 'bg-[#0F5D46] text-white' : 'bg-white text-gray-700'
                }`}
              >
                Free Event Pass (₹0)
              </button>

              <button
                type="button"
                onClick={() => {
                  handleChange('pricingType', 'Paid')
                  handleChange('fee', '₹499')
                }}
                className={`p-4 rounded-[18px] border text-xs font-bold cursor-pointer transition-all ${
                  form.pricingType === 'Paid' ? 'bg-[#0F5D46] text-white' : 'bg-white text-gray-700'
                }`}
              >
                Paid Pass (Set Price)
              </button>
            </div>

            {form.pricingType === 'Paid' && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Ticket Base Price (₹)
                </label>
                <input
                  type="text"
                  value={form.fee}
                  onChange={e => handleChange('fee', e.target.value)}
                  placeholder="₹499"
                  className="w-full h-11 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 font-bold"
                />
              </div>
            )}

            {/* Live Review Card */}
            <div className="p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/10 text-xs space-y-1.5">
              <span className="font-bold text-[#0F5D46] block uppercase tracking-wider text-[10px]">
                LIVE REVIEW PREVIEW
              </span>
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Title:</span>
                <span className="font-bold text-[#1F2937]">{form.title || 'Untitled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Fee:</span>
                <span className="font-bold text-[#0F5D46]">{form.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Capacity:</span>
                <span className="font-bold text-[#1F2937]">{form.seats} seats</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-[14px] cursor-pointer"
              >
                ← Back
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePublish('Draft')}
                  className="px-4 py-3 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-[14px] cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePublish('Published')}
                  className="px-6 py-3 bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs rounded-[14px] shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Publishing...' : '🚀 Publish Event Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
