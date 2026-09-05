import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { searchApi } from '../../services/api'

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('ALL')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      searchApi.search(query.trim(), type)
        .then(data => setResults(data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 250)

    return () => clearTimeout(timer)
  }, [query, type])

  if (!isOpen) return null

  const categories = [
    { id: 'ALL', label: 'All Results' },
    { id: 'EVENTS', label: 'Events' },
    { id: 'ORGANIZERS', label: 'Organizers' },
    { id: 'CERTIFICATES', label: 'Certificates' },
    { id: 'PAYMENTS', label: 'Payments' },
    { id: 'ANNOUNCEMENTS', label: 'Notices' }
  ]

  const getTypeIcon = (t) => {
    switch (t) {
      case 'EVENT': return '🎫'
      case 'ORGANIZER': return '🏛️'
      case 'CERTIFICATE': return '🏆'
      case 'PAYMENT': return '💳'
      case 'ANNOUNCEMENT': return '📢'
      default: return '🔍'
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -10 }}
        transition={{ duration: 0.18 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
          backdropFilter: 'blur(30px)'
        }}
        className="w-full max-w-2xl rounded-[28px] p-5 sm:p-6 border border-white shadow-2xl space-y-4"
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <span className="text-lg text-[#0F5D46]">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events, host colleges, certificates, payments... (Press Esc to close)"
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-[#0F5D46] border-t-transparent rounded-full animate-spin" />
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setType(c.id)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                type === c.id
                  ? 'bg-[#0F5D46] text-white shadow-xs'
                  : 'bg-gray-100 text-[#5E6A68] hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pt-1 text-left">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-xs text-[#5E6A68]">
              Type at least 2 characters to search across the entire AVENTO network.
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-8 text-center text-xs text-[#5E6A68]">
              No results found for "<span className="font-semibold text-gray-800">{query}</span>"
            </div>
          ) : (
            results.map((r, i) => (
              <div
                key={i}
                onClick={() => {
                  if (onSelectResult) onSelectResult(r)
                  onClose()
                }}
                className="p-3 rounded-[16px] bg-[#FAF8F2] hover:bg-[#EAF7F1] border border-[#0F5D46]/10 hover:border-[#0F5D46]/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[12px] bg-white text-base flex items-center justify-center shadow-2xs">
                    {getTypeIcon(r.type)}
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#0F5D46] transition-colors block">
                      {r.title}
                    </span>
                    <span className="text-[11px] text-[#5E6A68]">
                      {r.subtitle}
                    </span>
                  </div>
                </div>

                {r.badge && (
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white text-[#0F5D46] border border-[#0F5D46]/20">
                    {r.badge}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
