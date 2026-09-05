import React, { useState } from 'react'

export default function StepPaymentGateway({ 
  amount = 0, 
  onBack, 
  onPaymentComplete,
  isProcessing = false,
  errorMessage = '',
  onClearError
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [upiId, setUpiId] = useState('student@oksbi')
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '884',
    name: registrationData?.fullName || 'Attendee'
  })
  const [selectedBank, setSelectedBank] = useState('HDFC')

  const methods = [
    { id: 'upi', label: 'Instant UPI', icon: '⚡' },
    { id: 'card', label: 'Card (Credit/Debit)', icon: '💳' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
    { id: 'wallet', label: 'Wallets', icon: '👛' }
  ]

  const handlePay = (e) => {
    e.preventDefault()
    if (onClearError) onClearError()
    onPaymentComplete({
      method: selectedMethod,
      amount,
      upiId,
      cardData,
      selectedBank
    })
  }

  return (
    <div className="space-y-3.5 text-left select-none pb-1">
      {/* Razorpay Header Banner */}
      <div className="p-3 rounded-[16px] bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center font-extrabold text-xs text-[#D9B24A]">
            ₹
          </div>
          <div>
            <span className="text-[9.5px] uppercase font-bold text-[#D9B24A] tracking-wider block">
              RAZORPAY SECURE CHECKOUT
            </span>
            <span className="font-extrabold text-sm sm:text-base">
              ₹{amount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
          <span>🔒</span>
          <span>256-bit SSL</span>
        </div>
      </div>

      {/* Error / Cancellation Notification */}
      {errorMessage && (
        <div className="p-3 rounded-[14px] bg-red-50 text-red-700 border border-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          {onClearError && (
            <button 
              onClick={onClearError} 
              className="text-[11px] underline font-bold cursor-pointer hover:text-red-900 ml-2"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* Payment Method Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedMethod(m.id)}
            className={`p-2 rounded-[12px] text-xs font-bold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
              selectedMethod === m.id
                ? 'bg-[#0F5D46] text-white border-[#0F5D46] shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#5E6A68] border-gray-200'
            }`}
          >
            <span className="text-sm">{m.icon}</span>
            <span className="text-[10.5px] truncate">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Payment Method Details Form */}
      <div className="p-4 rounded-[18px] bg-white/85 border border-[#0F5D46]/15 shadow-xs">
        {/* UPI VIEW */}
        {selectedMethod === 'upi' && (
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Virtual Payment Address (UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full h-10 px-3.5 text-xs rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-around py-2 border-y border-gray-100 text-[11px] text-[#5E6A68]">
              <span className="font-bold">Google Pay</span>
              <span>•</span>
              <span className="font-bold">PhonePe</span>
              <span>•</span>
              <span className="font-bold">Paytm UPI</span>
            </div>

            <p className="text-[11px] text-gray-500">
              Collect request will be dispatched to your registered UPI application via Razorpay Standard Gateway.
            </p>
          </div>
        )}

        {/* CARD VIEW */}
        {selectedMethod === 'card' && (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardData.number}
                onChange={e => setCardData({ ...cardData, number: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  Valid Thru
                </label>
                <input
                  type="text"
                  value={cardData.expiry}
                  onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                  className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardData.name}
                onChange={e => setCardData({ ...cardData, name: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/20 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* NETBANKING VIEW */}
        {selectedMethod === 'netbanking' && (
          <div className="space-y-3 text-xs">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block">
              Select Popular Bank
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['HDFC', 'ICICI', 'SBI', 'Axis'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBank(b)}
                  className={`p-3 rounded-[12px] font-bold text-center border cursor-pointer ${
                    selectedBank === b
                      ? 'bg-[#EAF7F1] text-[#0F5D46] border-[#0F5D46]'
                      : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  {b} Bank
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WALLET VIEW */}
        {selectedMethod === 'wallet' && (
          <div className="space-y-3 text-xs">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F5D46] block">
              Supported Wallets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Amazon Pay', 'Mobikwik', 'Freecharge'].map((w) => (
                <div key={w} className="p-3 rounded-[12px] bg-[#FAF8F2] border border-[#0F5D46]/15 font-semibold text-center text-[#0F5D46]">
                  {w}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-4 py-3.5 rounded-[16px] text-xs font-bold text-[#5E6A68] bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePay}
          className="flex-1 py-3.5 rounded-[16px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying with Razorpay...</span>
            </>
          ) : (
            <>
              <span>Pay ₹{amount} via Razorpay {selectedMethod.toUpperCase()}</span>
              <span>🔒</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
