import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1) // 1: Email, 4: Done
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { forgotPassword } = useAuth()
  const toast = useToast()

  if (!isOpen) return null

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      await forgotPassword(email.trim())
      toast.success('Password recovery link sent to ' + email)
      setStep(4)
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch recovery email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
          backdropFilter: 'blur(30px)'
        }}
        className="w-full max-w-md rounded-[28px] p-6 sm:p-8 border border-white shadow-2xl space-y-5 text-left relative"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F5D46] animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F5D46]">
              PASSWORD RECOVERY
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Reset Your Password</h3>
              <p className="text-gray-500 mt-1">
                Enter your registered AVENTO email address and we'll dispatch a secure password reset link.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#0F5D46] uppercase text-[10.5px] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[14px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold cursor-pointer transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Dispatching Reset Link...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center py-4 space-y-3">
            <span className="text-4xl block">📬</span>
            <h3 className="font-display font-bold text-lg text-[#0F5D46]">
              Recovery Email Dispatched
            </h3>
            <p className="text-xs text-[#5E6A68]">
              A secure password reset link has been dispatched to <strong className="text-[#0F5D46]">{email}</strong>. Follow the link in your email to choose a new password.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-[12px] bg-[#0F5D46] text-white font-bold text-xs cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
