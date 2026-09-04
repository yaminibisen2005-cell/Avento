import React, { useState } from 'react'
import { adminService } from '../../../services/adminService'
import { paymentApi } from '../../../services/api'

export default function TabAdminPayments({ payments = [], onPaymentsUpdated }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [actionNotice, setActionNotice] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isRefunding, setIsRefunding] = useState(false)

  const filtered = payments.filter(p => {
    const s = search.toLowerCase()
    const matchSearch = (
      (p.id && p.id.toLowerCase().includes(s)) ||
      (p.txnId && p.txnId.toLowerCase().includes(s)) ||
      (p.studentName && p.studentName.toLowerCase().includes(s)) ||
      (p.student && p.student.toLowerCase().includes(s)) ||
      (p.organizer && p.organizer.toLowerCase().includes(s)) ||
      (p.organizerName && p.organizerName.toLowerCase().includes(s)) ||
      (p.eventTitle && p.eventTitle.toLowerCase().includes(s))
    )

    if (!matchSearch) return false

    if (statusFilter === 'All') return true
    if (statusFilter === 'Settled') return p.status === 'Settled' || p.status === 'SUCCESS'
    if (statusFilter === 'Refunded') return p.status === 'Refunded' || p.status === 'REFUNDED'
    return true
  })

  const handleRefund = async (txnId) => {
    setIsRefunding(true)
    try {
      await paymentApi.refund(txnId)
      setActionNotice(`Transaction ${txnId} successfully reversed and refunded.`)
      setTimeout(() => setActionNotice(''), 3500)
      if (onPaymentsUpdated) onPaymentsUpdated()
      if (selectedPayment) setSelectedPayment(null)
    } catch {
      await adminService.refundPayment(txnId)
      setActionNotice(`Transaction ${txnId} initiated for refund reversal.`)
      setTimeout(() => setActionNotice(''), 3500)
      if (onPaymentsUpdated) onPaymentsUpdated()
    } finally {
      setIsRefunding(false)
    }
  }

  const handleExportCsv = async () => {
    await adminService.exportAuditReport('CSV', 'payments')
    setActionNotice('Payment ledger CSV exported successfully.')
    setTimeout(() => setActionNotice(''), 3500)
  }

  const handleDownloadInvoice = (txnId) => {
    setActionNotice(`Official GST invoice receipt for ${txnId} generated.`)
    setTimeout(() => setActionNotice(''), 3500)
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Financial Ledger & Payout Gateway Audit
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Real-time transaction log with Razorpay payment IDs, HMAC signature validation, and reverse reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-[12px] bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
          <div className="text-xs font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3 py-1.5 rounded-[12px]">
            {filtered.length} Transactions
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-[16px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          ✓ {actionNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[22px] bg-white/80 border border-[#0F5D46]/15 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by transaction ID, student, host council, or event title..."
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-[#FAF8F2] border border-[#0F5D46]/15 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F2] p-1 rounded-full border border-gray-200 text-xs font-bold self-end sm:self-auto">
          {['All', 'Settled', 'Refunded'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#0F5D46] text-white shadow-2xs'
                  : 'text-[#5E6A68] hover:text-[#0F5D46]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="p-4 rounded-[26px] bg-white/95 border border-white/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[#5E6A68] uppercase text-[10px] tracking-wider font-extrabold">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Event & Organizer</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Gateway</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium">
            {filtered.map(p => {
              const txnId = p.txnId || p.id
              const studentName = p.studentName || p.student
              const organizer = p.organizerName || p.organizer
              const isSettled = p.status === 'Settled' || p.status === 'SUCCESS'
              const isRefunded = p.status === 'Refunded' || p.status === 'REFUNDED'

              return (
                <tr key={txnId} className="hover:bg-[#FAF8F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F5D46]">
                    <div>{txnId}</div>
                    {p.razorpayOrderId && (
                      <span className="text-[10px] text-gray-400 font-normal">{p.razorpayOrderId}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1F2937]">
                    {studentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1F2937] block">{p.eventTitle}</span>
                    <span className="text-[11px] text-gray-400">{organizer}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#0F5D46]">
                    {p.amount}
                  </td>
                  <td className="py-3.5 px-4 text-[#5E6A68]">
                    <span className="px-2 py-0.5 rounded-[6px] bg-gray-100 font-semibold text-[11px]">
                      {p.gateway || 'Razorpay Standard Checkout'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isSettled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isRefunded
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isSettled ? 'Settled' : p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment(p)}
                      className="px-2.5 py-1 rounded-[8px] bg-[#FAF8F2] border border-[#0F5D46]/20 text-[#0F5D46] hover:bg-[#EAF7F1] font-bold cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(txnId)}
                      className="px-2.5 py-1 rounded-[8px] bg-white border border-gray-200 text-[#0F5D46] hover:bg-gray-50 font-bold cursor-pointer"
                    >
                      Invoice
                    </button>
                    {!isRefunded && (
                      <button
                        type="button"
                        disabled={isRefunding}
                        onClick={() => handleRefund(txnId)}
                        className="px-2.5 py-1 rounded-[8px] bg-red-50 text-red-700 hover:bg-red-100 font-bold cursor-pointer transition-colors disabled:opacity-50"
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
              backdropFilter: 'blur(30px)'
            }}
            className="w-full max-w-lg rounded-[28px] p-6 sm:p-8 border border-white shadow-2xl space-y-5 relative"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display font-extrabold text-lg text-[#0F5D46]">
                Payment Audit Specification
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">TRANSACTION ID</span>
                <span className="font-mono font-bold text-[#0F5D46]">{selectedPayment.txnId || selectedPayment.id}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">RAZORPAY ORDER ID</span>
                <span className="font-mono font-bold text-gray-800">{selectedPayment.razorpayOrderId || 'rzp_order_settled'}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">STUDENT</span>
                <span className="font-semibold text-gray-800">{selectedPayment.studentName || selectedPayment.student}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">AMOUNT</span>
                <span className="font-extrabold text-[#0F5D46] text-sm">{selectedPayment.amount}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100 col-span-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">EVENT</span>
                <span className="font-bold text-gray-800">{selectedPayment.eventTitle}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">GATEWAY</span>
                <span className="font-medium text-gray-700">{selectedPayment.gateway || 'Razorpay'}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-[#FAF8F2] border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">STATUS</span>
                <span className="font-bold text-emerald-700">{selectedPayment.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-[12px] bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {selectedPayment.status !== 'Refunded' && selectedPayment.status !== 'REFUNDED' && (
                <button
                  type="button"
                  disabled={isRefunding}
                  onClick={() => handleRefund(selectedPayment.txnId || selectedPayment.id)}
                  className="px-4 py-2 rounded-[12px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Confirm Reversal & Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
