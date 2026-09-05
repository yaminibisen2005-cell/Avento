import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StepRegistrationForm from './StepRegistrationForm'
import StepOrderSummary from './StepOrderSummary'
import StepPaymentGateway from './StepPaymentGateway'
import StepPaymentSuccess from './StepPaymentSuccess'
import { checkoutService } from '../../services/checkoutService'
import { loadRazorpayScript } from '../../utils/razorpay'
import { useAuth } from '../../context/AuthContext'
import { registrationApi } from '../../services/api'

export default function CheckoutModal({ 
  event, 
  currentUser, 
  isOpen, 
  onClose, 
  onCheckoutComplete,
  onGoToTickets 
}) {
  const [step, setStep] = useState(1) // 1: Form, 2: Summary, 3: Payment, 4: Success
  const [payableAmount, setPayableAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [createdRegistration, setCreatedRegistration] = useState(null)
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)

  const { isEventRegistered, addRegisteredEventId, refreshUserRegistrations } = useAuth()

  useEffect(() => {
    if (isOpen && event?.id) {
      if (isEventRegistered(event.id)) {
        setIsAlreadyRegistered(true)
      } else {
        registrationApi.checkRegistration(event.id).then(res => {
          if (res?.isRegistered) {
            setIsAlreadyRegistered(true)
            addRegisteredEventId(event.id)
          } else {
            setIsAlreadyRegistered(false)
          }
        }).catch(() => {})
      }
    } else {
      setIsAlreadyRegistered(false)
    }
  }, [isOpen, event?.id, isEventRegistered, addRegisteredEventId])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const getInitialFormData = (u) => ({
    fullName: u?.fullName || u?.name || '',
    email: u?.email || '',
    phoneNumber: u?.phoneNumber || '',
    college: u?.college || '',
    branch: u?.branch || '',
    year: u?.year || '',
    gender: '',
    emergencyContact: u?.emergencyContact || '',
    teamName: '',
    specialRequirements: ''
  })

  const [formData, setFormData] = useState(() => getInitialFormData(currentUser))

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
        phoneNumber: currentUser.phoneNumber || prev.phoneNumber,
        college: currentUser.college || prev.college,
        branch: currentUser.branch || prev.branch,
        year: currentUser.year || prev.year
      }))
    }
  }, [currentUser])

  if (!isOpen || !event) return null

  const stepsMeta = [
    { num: 1, title: 'Details' },
    { num: 2, title: 'Summary' },
    { num: 3, title: 'Payment' },
    { num: 4, title: 'Pass' }
  ]

  // Step 2 Proceed Handler
  const handleProceedToPayment = async (total) => {
    setPayableAmount(total)
    setPaymentError('')
    if (total === 0) {
      // Free reservation, bypass payment gateway directly to registration creation
      setIsProcessing(true)
      try {
        const res = await checkoutService.createRegistration(event, formData)
        setCreatedRegistration(res.data)
        setStep(4)
        addRegisteredEventId(event.id)
        refreshUserRegistrations()
        if (onCheckoutComplete) {
          onCheckoutComplete(res.data)
        }
      } catch (err) {
        setPaymentError(err.message || 'Registration failed')
      } finally {
        setIsProcessing(false)
      }
    } else {
      setStep(3)
    }
  }

  // Step 3 Razorpay Payment Handler
  const handlePaymentComplete = async (_paymentDetails) => {
    setIsProcessing(true)
    setPaymentError('')

    try {
      // 1. Create order on Spring Boot backend
      const orderData = await checkoutService.createPaymentOrder(event, formData)

      // If order is free, it directly issues ticket
      if (orderData.isFree && orderData.ticket) {
        const regRecord = {
          id: `REG-${orderData.ticket.ticketNumber}`,
          ticketId: orderData.ticket.ticketNumber,
          seatNumber: orderData.ticket.seatNumber,
          eventId: event.id,
          eventTitle: event.title,
          category: event.category,
          date: event.date,
          venue: event.venue,
          mode: event.mode || 'In-Person',
          image: event.image,
          status: 'Upcoming',
          paymentStatus: 'Paid (Free Tier)',
          fee: 'Free',
          qrCodeData: orderData.ticket.qrCodePayload,
          attendee: formData
        }
        setCreatedRegistration(regRecord)
        setStep(4)
        addRegisteredEventId(event.id)
        refreshUserRegistrations()
        if (onCheckoutComplete) onCheckoutComplete(regRecord)
        setIsProcessing(false)
        return
      }

      // 2. Load Razorpay Checkout SDK
      const keyId = (orderData.keyId && !orderData.keyId.includes('placeholder')) 
        ? orderData.keyId 
        : (import.meta.env.VITE_RAZORPAY_KEY_ID && !import.meta.env.VITE_RAZORPAY_KEY_ID.includes('placeholder') ? import.meta.env.VITE_RAZORPAY_KEY_ID : null)

      const scriptLoaded = keyId ? await loadRazorpayScript() : false

      if (keyId && scriptLoaded && typeof window !== 'undefined' && window.Razorpay) {
        try {
          const options = {
            key: keyId,
            amount: orderData.amountInPaise,
            currency: orderData.currency || 'INR',
            name: 'AVENTO',
            description: event.title,
            order_id: orderData.orderId,
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phoneNumber
            },
            theme: {
              color: '#0F5D46'
            },
            handler: async function (razorpayResponse) {
              try {
                // 3. Verify Payment on Spring Boot backend
                const verifyRes = await checkoutService.verifyPayment({
                  razorpayOrderId: razorpayResponse.razorpay_order_id,
                  razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                  razorpaySignature: razorpayResponse.razorpay_signature,
                  eventId: event.id,
                  ...formData
                })

                const ticket = verifyRes.ticket
                const regRecord = {
                  id: `REG-${ticket.ticketNumber}`,
                  ticketId: ticket.ticketNumber,
                  seatNumber: ticket.seatNumber || 'GA-A14',
                  eventId: event.id,
                  eventTitle: event.title,
                  category: event.category,
                  date: event.date,
                  time: event.time || '09:00 AM IST',
                  venue: event.venue,
                  mode: event.mode || 'In-Person',
                  image: event.image,
                  status: 'Upcoming',
                  paymentStatus: `Paid (${event.fee} Razorpay)`,
                  fee: event.fee,
                  qrCodeData: ticket.qrCodePayload,
                  attendee: formData
                }

                setCreatedRegistration(regRecord)
                setStep(4)
                addRegisteredEventId(event.id)
                refreshUserRegistrations()
                if (onCheckoutComplete) onCheckoutComplete(regRecord)
              } catch (err) {
                setPaymentError(err.message || 'Payment signature verification failed')
              } finally {
                setIsProcessing(false)
              }
            },
            modal: {
              ondismiss: function () {
                setIsProcessing(false)
                setPaymentError('Payment window closed by user. You can retry anytime.')
              }
            }
          }

          const rzp = new window.Razorpay(options)
          rzp.on('payment.failed', function (resp) {
            setIsProcessing(false)
            setPaymentError(resp.error?.description || 'Payment transaction failed. Please retry.')
          })
          rzp.open()
          return
        } catch (rzpErr) {
          console.warn('Razorpay SDK init warning, falling back to sandbox handler:', rzpErr.message)
        }
      }

      // Test Mode Sandbox Checkout Handler (used when real Razorpay keys are not yet configured or CDN is offline)
      const verifyRes = await checkoutService.verifyPayment({
        razorpayOrderId: orderData.orderId,
        razorpayPaymentId: 'pay_test_' + Date.now(),
        razorpaySignature: 'valid_signature',
        eventId: event.id,
        ...formData
      })

      const ticket = verifyRes.ticket
      const regRecord = {
        id: `REG-${ticket.ticketNumber}`,
        ticketId: ticket.ticketNumber,
        seatNumber: ticket.seatNumber || 'GA-A14',
        eventId: event.id,
        eventTitle: event.title,
        category: event.category,
        date: event.date,
        time: event.time || '09:00 AM IST',
        venue: event.venue,
        mode: event.mode || 'In-Person',
        image: event.image,
        status: 'Upcoming',
        paymentStatus: `Paid (${event.fee} Razorpay)`,
        fee: event.fee,
        qrCodeData: ticket.qrCodePayload,
        attendee: formData
      }

      setCreatedRegistration(regRecord)
      setStep(4)
      addRegisteredEventId(event.id)
      refreshUserRegistrations()
      if (onCheckoutComplete) onCheckoutComplete(regRecord)
      setIsProcessing(false)
    } catch (err) {
      setIsProcessing(false)
      setPaymentError(err.message || 'Payment initiation failed')
    }
  }

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm select-none overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)'
        }}
        className="w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-[24px] sm:rounded-[32px] p-4 sm:p-7 pb-8 border border-white shadow-2xl space-y-4 sm:space-y-5 relative my-auto custom-scrollbar"
      >
        {/* Top Header & Close */}
        <div className="flex items-center justify-between border-b border-[#0F5D46]/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F5D46] animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0F5D46]">
              AVENTO CHECKOUT
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* If user is already registered, show Already Registered Screen */}
        {isAlreadyRegistered && step < 4 ? (
          <div className="py-6 px-4 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center text-2xl mx-auto shadow-sm">
              ✓
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#D9B24A] bg-[#D9B24A]/15 px-3 py-1 rounded-full border border-[#D9B24A]/30">
                Already Registered
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F5D46] mt-2">
                You're already registered for this event!
              </h3>
              <p className="text-xs sm:text-sm text-[#5E6A68] max-w-md mx-auto leading-relaxed">
                Your delegate pass for <strong className="text-[#0F5D46]">{event.title}</strong> has already been issued. You do not need to register again.
              </p>
            </div>

            <div className="p-4 rounded-[20px] bg-[#FAF8F2] border border-[#0F5D46]/15 max-w-sm mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Event:</span>
                <span className="font-bold text-[#1F2937] truncate max-w-[180px]">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Date:</span>
                <span className="font-bold text-[#1F2937]">{event.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5E6A68]">Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onGoToTickets) onGoToTickets();
                }}
                className="w-full sm:flex-1 py-3 px-5 bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-bold text-xs rounded-[16px] shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <span>🎟 View Pass in My Tickets</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 bg-white hover:bg-gray-50 text-[#5E6A68] font-bold text-xs rounded-[16px] border border-gray-200 cursor-pointer shadow-2xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 4-Step Wizard Progress Indicator */}
            <div className="flex items-center justify-between px-2">
              {stepsMeta.map((s, idx) => (
                <React.Fragment key={s.num}>
                  <div className="flex flex-col items-center gap-1">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-[#0F5D46] text-white ring-4 ring-[#0F5D46]/15 shadow-sm'
                          : step > s.num
                            ? 'bg-[#D9B24A] text-white'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      step === s.num ? 'text-[#0F5D46]' : 'text-gray-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>

                  {idx < stepsMeta.length - 1 && (
                    <div 
                      className={`flex-1 h-[2px] mx-2 transition-colors ${
                        step > idx + 1 ? 'bg-[#D9B24A]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Views */}
            <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-left mb-4">
                <h3 className="font-display font-extrabold text-xl text-[#0F5D46]">
                  Participant Details
                </h3>
                <p className="text-xs text-[#5E6A68]">
                  Verify your student identity for official pass issuance
                </p>
              </div>

              <StepRegistrationForm
                formData={formData}
                setFormData={setFormData}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-left mb-4">
                <h3 className="font-display font-extrabold text-xl text-[#0F5D46]">
                  Order & Fee Breakdown
                </h3>
                <p className="text-xs text-[#5E6A68]">
                  Review items, apply institutional promo coupons, and confirm registration
                </p>
              </div>

              <StepOrderSummary
                event={event}
                onBack={() => setStep(1)}
                onProceedToPayment={handleProceedToPayment}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-left mb-4">
                <h3 className="font-display font-extrabold text-xl text-[#0F5D46]">
                  Select Payment Method
                </h3>
                <p className="text-xs text-[#5E6A68]">
                  Powered by bank-grade 256-bit encrypted Razorpay checkout
                </p>
              </div>

              <StepPaymentGateway
                amount={payableAmount}
                isProcessing={isProcessing}
                errorMessage={paymentError}
                onClearError={() => setPaymentError('')}
                onBack={() => setStep(2)}
                onPaymentComplete={handlePaymentComplete}
                registrationData={formData}
              />
            </motion.div>
          )}

          {step === 4 && createdRegistration && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StepPaymentSuccess
                registrationData={createdRegistration}
                onGoToTickets={() => {
                  onClose()
                  if (onGoToTickets) onGoToTickets()
                }}
                onCloseModal={onClose}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}
      </motion.div>
    </div>
  )
}
