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

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpCode.trim()) return

    setLoading(true)
    try {
      await authApi.verifyOtp({ email: email.trim(), otpCode: otpCode.trim() })
      toast.success('Code verified successfully!')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({
        email: email.trim(),
        otpCode: otpCode.trim(),
        newPassword
      })
      toast.success('Password updated successfully!')
      setStep(4)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
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
                Enter your registered AVENTO email address and we'll dispatch a 6-digit verification code.
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
              {loading ? 'Dispatching OTP...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Enter 6-Digit Code</h3>
              <p className="text-gray-500 mt-1">
                We sent a one-time verification code to <strong>{email}</strong>.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#0F5D46] uppercase text-[10.5px] block mb-1">
                Verification OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full h-11 text-center font-mono font-bold text-lg tracking-widest rounded-[12px] bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3.5 py-2.5 rounded-[12px] bg-gray-100 text-gray-600 font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-[12px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold cursor-pointer transition-all shadow-xs disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Enter New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900">Create New Password</h3>
              <p className="text-gray-500 mt-1">
                Choose a strong password with at least 6 characters.
              </p>
            </div>

            <div>
              <label className="font-bold text-[#0F5D46] uppercase text-[10.5px] block mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0F5D46] uppercase text-[10.5px] block mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-[14px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold cursor-pointer transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Reset Password & Save'}
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
