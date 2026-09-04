import React, { useState, useEffect } from 'react'
import { wishlistApi } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function Wishlist({ onSelectEvent }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    wishlistApi.getAll()
      .then(data => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (eventId, title) => {
    try {
      await wishlistApi.remove(eventId)
      setItems(prev => prev.filter(item => item.eventId !== eventId))
      toast.info(`Removed "${title}" from your wishlist`)
    } catch {
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <div className="space-y-6 text-left select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
            Saved Events & Wishlist
          </h2>
          <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
            Bookmarked hackathons, masterclasses, and tech symposiums saved for upcoming registration
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-[#0F5D46] bg-[#EAF7F1] border border-[#0F5D46]/20 px-3.5 py-1.5 rounded-[12px]">
          {items.length} Saved Events
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#5E6A68]">
          <span className="inline-block w-5 h-5 border-2 border-[#0F5D46] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading your saved events...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 rounded-[28px] bg-white/90 border border-white text-center space-y-3">
          <span className="text-4xl">💛</span>
          <h3 className="font-display font-bold text-lg text-gray-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#5E6A68] max-w-sm mx-auto">
            Browse the Explore Events catalog and tap the heart icon on any card to save events here for quick access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div
              key={item.id}
              className="rounded-[24px] bg-white/95 border border-white/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.eventId, item.title)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-amber-400 backdrop-blur-xs flex items-center justify-center text-sm cursor-pointer transition-all"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0F5D46]">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-base text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-xs text-[#5E6A68] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span>📅</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📍</span>
                      <span className="truncate">{item.venue} ({item.mode || 'In-Person'})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between mt-3">
                <span className="text-sm font-extrabold text-[#0F5D46]">
                  {item.fee}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectEvent && onSelectEvent(item.eventId)}
                  className="px-4 py-2 rounded-[12px] bg-[#0F5D46] hover:bg-[#126B51] text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
