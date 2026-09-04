import React, { useState } from 'react'
import { reviewApi } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function ReviewCard({ 
  eventId, 
  reviews = [], 
  averageRating = 4.9, 
  currentUser,
  onReviewAdded 
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyingReviewId, setReplyingReviewId] = useState(null)
  const [replyText, setReplyText] = useState('')
  const toast = useToast()

  const isOrganizer = currentUser?.role === 'ORGANIZER' || currentUser?.role === 'ADMIN'

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Please enter your review feedback')
      return
    }

    setIsSubmitting(true)
    try {
      await reviewApi.addReview(eventId, { rating, comment: comment.trim() })
      toast.success('Your verified review has been published!')
      setComment('')
      setShowAddForm(false)
      if (onReviewAdded) onReviewAdded()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return
    try {
      await reviewApi.replyReview(reviewId, { reply: replyText.trim() })
      toast.success('Organizer reply posted!')
      setReplyingReviewId(null)
      setReplyText('')
      if (onReviewAdded) onReviewAdded()
    } catch {
      toast.error('Failed to post reply')
    }
  }

  const handleReport = async (reviewId) => {
    try {
      await reviewApi.reportReview(reviewId)
      toast.info('Review reported for administrative review')
    } catch {
      toast.error('Report submission failed')
    }
  }

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] text-left select-none space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight">
              Verified Attendee Reviews
            </h2>
            <span className="text-xs font-bold text-[#D9B24A] bg-[#0F5D46] px-2 py-0.5 rounded-full">
              ★ {averageRating}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Experiences from verified student delegates and hackathon alumni
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-[14px] bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          {showAddForm ? 'Close Form' : '★ Write a Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitReview} className="p-5 rounded-[22px] bg-white border border-[#0F5D46]/20 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F5D46] uppercase tracking-wider">Select Star Rating</span>
            <div className="flex items-center gap-1.5 text-lg cursor-pointer">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-transform hover:scale-125 ${star <= rating ? 'text-[#D9B24A]' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience regarding speakers, mentors, organization, and networking..."
            className="w-full p-3 text-xs rounded-[14px] bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-[10px] text-xs font-bold text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-[10px] bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Review'}
            </button>
          </div>
        </form>
      )}

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-[22px] bg-white/85 border border-white/80 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#D9B24A] text-xs font-bold">
                  {'★'.repeat(r.rating || 5)}
                  {r.verifiedAttendee && (
                    <span className="ml-1 text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-[6px] bg-emerald-100 text-emerald-800">
                      ✓ Verified Attendee
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#5E6A68] font-medium">{r.date}</span>
                  <button
                    type="button"
                    onClick={() => handleReport(r.id)}
                    className="text-[10px] text-gray-400 hover:text-red-600 cursor-pointer"
                    title="Report review"
                  >
                    🚩
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-[13px] text-[#1F2937]/85 leading-relaxed italic">
                "{r.comment}"
              </p>

              {/* Organizer Reply */}
              {r.organizerReply && (
                <div className="p-3 rounded-[14px] bg-[#EAF7F1] border border-[#0F5D46]/15 text-xs text-[#0F5D46] space-y-1 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10.5px] uppercase tracking-wider">
                      Council Response
                    </span>
                    {r.organizerRepliedAt && (
                      <span className="text-[10px] text-gray-500">{r.organizerRepliedAt}</span>
                    )}
                  </div>
                  <p className="italic text-[11.5px]">{r.organizerReply}</p>
                </div>
              )}

              {/* Organizer Reply Trigger */}
              {isOrganizer && !r.organizerReply && replyingReviewId !== r.id && (
                <button
                  type="button"
                  onClick={() => setReplyingReviewId(r.id)}
                  className="text-[11px] font-bold text-[#0F5D46] hover:underline cursor-pointer pt-1"
                >
                  ↩ Reply as Organizer
                </button>
              )}

              {replyingReviewId === r.id && (
                <div className="pt-2 space-y-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write official response..."
                    className="w-full h-8 px-2.5 text-xs rounded-[10px] bg-[#FAF8F2] border border-gray-200"
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setReplyingReviewId(null)}
                      className="px-2 py-1 text-[10px] font-bold text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReply(r.id)}
                      className="px-3 py-1 text-[10px] font-bold rounded-[8px] bg-[#0F5D46] text-white cursor-pointer"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#0F5D46]/20 shrink-0 bg-gray-100 flex items-center justify-center text-xs font-bold text-[#0F5D46]">
                {r.studentAvatar ? (
                  <img src={r.studentAvatar} alt={r.studentName || r.name} className="w-full h-full object-cover" />
                ) : (
                  (r.studentName || r.name || 'S').charAt(0)
                )}
              </div>
              <div>
                <span className="font-bold text-xs text-[#0F5D46] block leading-tight">{r.studentName || r.name}</span>
                <span className="text-[10.5px] text-[#5E6A68] block">{r.college || 'Verified Student'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
