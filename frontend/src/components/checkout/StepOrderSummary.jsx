import React, { useState } from 'react'

export default function StepOrderSummary({ 
  event, 
  onBack, 
  onProceedToPayment 
}) {
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  // Parse base price
  const rawFee = event.fee ? event.fee.replace(/[^0-9]/g, '') : '0'
  const isFreeEvent = !rawFee || rawFee === '0'
  const basePrice = isFreeEvent ? 0 : parseInt(rawFee, 10)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (code === 'AVENTO100' || code === 'FREEPASS') {
      setDiscountPercent(100)
      setCouponMsg('100% Student Discount Applied! (₹' + basePrice + ' off)')
    } else if (code === 'STUDENT50' || code === 'AVENTO50') {
      setDiscountPercent(50)
      setCouponMsg('50% Student Discount Applied!')
    } else {
      setCouponMsg('Invalid coupon code. Try AVENTO100 or STUDENT50.')
    }
  }

  const discountAmount = Math.round((basePrice * discountPercent) / 100)
  const discountedBase = Math.max(0, basePrice - discountAmount)
  const platformFee = isFreeEvent || discountedBase === 0 ? 0 : 29
  const gst = isFreeEvent || discountedBase === 0 ? 0 : Math.round(discountedBase * 0.18)
  const grandTotal = discountedBase + platformFee + gst

  return (
    <div className="space-y-5 text-left select-none">
      {/* Event Mini Card */}
      <div className="p-4 rounded-[20px] bg-white/80 border border-[#0F5D46]/15 flex items-center gap-4 shadow-2xs">
        <div className="w-16 h-16 rounded-[16px] overflow-hidden shrink-0 border border-white">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F5D46] bg-[#EAF7F1] px-2 py-0.5 rounded-full">
            {event.category}
          </span>
          <h4 className="font-display font-bold text-sm text-[#0F5D46] truncate mt-1">
            {event.title}
          </h4>
          <p className="text-[11px] text-[#5E6A68] truncate">
            {event.venue?.name || event.venue} • {event.date}
          </p>
        </div>
      </div>

      {/* Coupon Code Input */}
      {!isFreeEvent && (
        <form onSubmit={handleApplyCoupon} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Enter Promo Code (e.g. AVENTO100)"
              className="flex-1 h-10 px-3.5 text-xs rounded-[14px] bg-white border border-[#0F5D46]/20 focus:outline-none uppercase font-mono tracking-wider"
            />
            <button
              type="submit"
              className="px-4 h-10 bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold rounded-[14px] transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {couponMsg && (
            <p className={`text-[11px] font-semibold ${couponMsg.includes('Applied') ? 'text-[#0F5D46]' : 'text-red-600'}`}>
              {couponMsg}
            </p>
          )}
        </form>
      )}

      {/* Itemized Pricing Breakdown */}
      <div className="p-5 rounded-[22px] bg-[#FAF8F2] border border-[#0F5D46]/12 space-y-3 text-xs">
        <div className="flex justify-between text-[#5E6A68]">
          <span>Standard Delegate Pass</span>
          <span className="font-semibold text-[#1F2937]">₹{basePrice}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Special Coupon Discount</span>
            <span>- ₹{discountAmount}</span>
          </div>
        )}

        <div className="flex justify-between text-[#5E6A68]">
          <span>Platform & Payment Processing</span>
          <span className="font-semibold text-[#1F2937]">
            {platformFee === 0 ? <span className="text-[#0F5D46] font-bold">Waived (₹0)</span> : `₹${platformFee}`}
          </span>
        </div>

        <div className="flex justify-between text-[#5E6A68]">
          <span>Applicable Taxes (18% GST)</span>
          <span className="font-semibold text-[#1F2937]">
            {gst === 0 ? '₹0' : `₹${gst}`}
          </span>
        </div>

        <div className="pt-3 border-t border-[#0F5D46]/15 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-extrabold text-[#0F5D46] block">Grand Total</span>
            <span className="text-[10.5px] text-[#5E6A68]">Instant Pass & Official Invoice</span>
          </div>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            {grandTotal === 0 ? '₹0 (Free)' : `₹${grandTotal}`}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-3.5 rounded-[16px] text-xs font-bold text-[#5E6A68] bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          ← Edit Form
        </button>

        <button
          type="button"
          onClick={() => onProceedToPayment(grandTotal)}
          className="flex-1 py-3.5 rounded-[16px] bg-[#0F5D46] hover:bg-[#126B51] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>{grandTotal === 0 ? 'Confirm Free Reservation' : `Pay ₹${grandTotal} Securely`}</span>
          <span className="text-[#D9B24A] group-hover:translate-x-1 transition-transform font-bold">→</span>
        </button>
      </div>
    </div>
  )
}
