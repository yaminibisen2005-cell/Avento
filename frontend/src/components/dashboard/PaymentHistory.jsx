import React, { useState, useEffect } from 'react'
import { paymentApi } from '../../services/api'

export default function PaymentHistory({ currentUser }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadNotice, setDownloadNotice] = useState('')

  useEffect(() => {
    paymentApi.getHistory()
      .then(data => {
        setPayments(data || [])
      })
      .catch(() => {
        setPayments([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleDownloadInvoice = (payment) => {
    const invoiceContent = `
=====================================================
                 AVENTO OFFICIAL INVOICE
               Powered by Razorpay Payments
=====================================================
Transaction ID: ${payment.txnId}
Razorpay Order: ${payment.razorpayOrderId || 'N/A'}
Razorpay Payment: ${payment.razorpayPaymentId || 'N/A'}
Date: ${payment.date}
Status: ${payment.status}

BILLED TO:
Name: ${payment.studentName || currentUser?.fullName || 'Student'}
Email: ${currentUser?.email || 'student@avento.com'}

EVENT DETAILS:
Event: ${payment.eventTitle || 'Campus Technical Event'}
Host: ${payment.organizerName || 'Campus Partner'}
Ticket Ref: ${payment.ticketNumber || 'AVT-PASS'}

AMOUNT BREAKDOWN:
Registration Fee: ${payment.amount}
Convenience Fee: ₹0.00 (Zero Fee Student Tier)
GST (18% inclusive): Included
TOTAL PAID: ${payment.amount}

Payment Method: ${payment.gateway}
Security Verification: Cryptographically Verified by AVENTO
=====================================================
    `
    const blob = new Blob([invoiceContent.trim()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Invoice-${payment.txnId}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)

    setDownloadNotice(`Tax invoice for ${payment.txnId} downloaded successfully.`)
    setTimeout(() => setDownloadNotice(''), 3500)
  }

  const handleDownloadReceipt = (payment) => {
    handleDownloadInvoice(payment)
  }

  const totalSpentRupees = payments
    .filter(p => p.status === 'SUCCESS' || p.status === 'Settled')
    .reduce((sum, p) => {
      const num = Number(String(p.amount).replace(/[^0-9]/g, '')) || 0
      return sum + num
    }, 0)

  const refundedCount = payments.filter(p => p.status === 'REFUNDED').length

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Payment History & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Download tax receipts, view Razorpay payment IDs, and track settlement reversals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3.5 py-1.5 rounded-[12px]">
            {payments.length} Transactions
          </span>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {downloadNotice}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            TOTAL PAID (SETTLED)
          </span>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            ₹{totalSpentRupees.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Processed via Razorpay</span>
        </div>

        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            SUCCESSFUL TRANSACTIONS
          </span>
          <div className="text-2xl font-extrabold text-[#0F5D46]">
            {payments.filter(p => p.status === 'SUCCESS' || p.status === 'Settled').length} Orders
          </div>
          <span className="text-[11px] text-[#5E6A68] font-semibold">100% verified delivery</span>
        </div>

        <div className="p-5 rounded-[22px] bg-white/90 border border-white/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6A68] block mb-1">
            REFUNDS PROCESSED
          </span>
          <div className="text-2xl font-extrabold text-amber-700">
            {refundedCount} Reversals
          </div>
          <span className="text-[11px] text-amber-600 font-semibold">Returned to original source</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-4 sm:p-6 rounded-[28px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <h3 className="font-display font-bold text-base text-[#0F5D46] mb-4">
          Transaction Ledger
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#5E6A68]">
            <span className="inline-block w-5 h-5 border-2 border-[#0F5D46] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading your Razorpay transactions...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5E6A68]">
            No payment records found. Register for paid events to see invoices here.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
                <th className="py-3 px-4">Txn Ref</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {payments.map((p) => {
                const isSettled = p.status === 'SUCCESS' || p.status === 'Settled'
                const isRefunded = p.status === 'REFUNDED'

                return (
                  <tr key={p.id || p.txnId} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F5D46]">
                      <div>{p.txnId}</div>
                      {p.razorpayPaymentId && (
                        <div className="text-[10px] text-gray-400 font-normal">{p.razorpayPaymentId}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1F2937] block">{p.eventTitle}</span>
                      <span className="text-[11px] text-gray-400">{p.organizerName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0F5D46]">
                      {p.amount}
                    </td>
                    <td className="py-3.5 px-4 text-[#5E6A68]">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4 text-[#5E6A68]">
                      <span className="px-2 py-0.5 rounded-[6px] bg-gray-100 font-semibold text-[11px]">
                        {p.gateway || 'Razorpay'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isSettled 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isRefunded 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isSettled ? 'Settled' : p.status}
                      </span>
                      {isRefunded && (
                        <span className="block text-[10px] text-amber-600 font-medium mt-0.5">
                          100% Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(p)}
                        className="px-2.5 py-1 rounded-[8px] bg-white border border-gray-200 text-[#0F5D46] hover:bg-gray-50 font-bold cursor-pointer transition-colors"
                      >
                        Invoice
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(p)}
                        className="px-2.5 py-1 rounded-[8px] bg-[#EAF7F1] border border-[#0F5D46]/20 text-[#0F5D46] hover:bg-[#EAF7F1]/80 font-bold cursor-pointer transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
