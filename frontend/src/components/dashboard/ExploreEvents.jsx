import React, { useState, useEffect } from 'react'
import EventCard from './EventCard'
import CheckoutModal from '../checkout/CheckoutModal'
import { wishlistApi } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function ExploreEvents({ 
  events = [], 
  currentUser,
  onRegisterSuccess, 
  onViewDetails,
  onGoToTickets,
  searchQuery = '', 
  setSearchQuery 
}) {
  const [internalSearch, setInternalSearch] = useState('')
  const search = setSearchQuery ? searchQuery : internalSearch
  const setSearch = setSearchQuery ? setSearchQuery : setInternalSearch
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMode, setSelectedMode] = useState('All')
  const [selectedFee, setSelectedFee] = useState('All')
  const [selectedSort, setSelectedSort] = useState('Newest')
  const [wishlistIds, setWishlistIds] = useState(new Set())
  const [registerModalEvent, setRegisterModalEvent] = useState(null)
  const toast = useToast()

  const categories = ['All', 'Hackathons', 'Workshops', 'Seminars', 'Competitions', 'Conferences', 'Webinars']
  const modes = ['All', 'In-Person', 'Online']
  const feeTypes = ['All', 'Free', 'Paid']
  const sortOptions = ['Newest', 'Popularity', 'Fee: Low to High', 'Fee: High to Low']

  useEffect(() => {
    wishlistApi.getAll()
      .then(items => {
        if (items) {
          const ids = new Set(items.map(i => i.eventId))
          setWishlistIds(ids)
        }
      })
      .catch(() => {})
  }, [])

  const handleToggleWishlist = async (event) => {
    const isSaved = wishlistIds.has(event.id)
    const nextSet = new Set(wishlistIds)

    if (isSaved) {
      nextSet.delete(event.id)
      setWishlistIds(nextSet)
      try {
        await wishlistApi.remove(event.id)
        toast.info(`Removed "${event.title}" from wishlist`)
      } catch {
        nextSet.add(event.id)
        setWishlistIds(nextSet)
      }
    } else {
      nextSet.add(event.id)
      setWishlistIds(nextSet)
      try {
        await wishlistApi.add(event.id)
        toast.success(`Saved "${event.title}" to your wishlist!`)
      } catch {
        nextSet.delete(event.id)
        setWishlistIds(nextSet)
      }
    }
  }

  const parseFeeToNum = (feeStr) => {
    if (!feeStr || feeStr === 'Free' || feeStr === '₹0') return 0
    return Number(String(feeStr).replace(/[^0-9]/g, '')) || 0
  }

  // Filter and Sort logic
  const filteredEvents = events
    .filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) ||
                            evt.venue.toLowerCase().includes(search.toLowerCase()) ||
                            (evt.organizer && evt.organizer.toLowerCase().includes(search.toLowerCase()))

      const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory
      const matchesMode = selectedMode === 'All' || evt.mode === selectedMode
      const matchesFee = selectedFee === 'All' || 
                         (selectedFee === 'Free' && (evt.fee === 'Free' || evt.fee === '₹0')) ||
                         (selectedFee === 'Paid' && evt.fee !== 'Free' && evt.fee !== '₹0')

      return matchesSearch && matchesCategory && matchesMode && matchesFee
    })
    .sort((a, b) => {
      if (selectedSort === 'Popularity') {
        return (b.seatsFilled || 0) - (a.seatsFilled || 0)
      }
      if (selectedSort === 'Fee: Low to High') {
        return parseFeeToNum(a.fee) - parseFeeToNum(b.fee)
      }
      if (selectedSort === 'Fee: High to Low') {
        return parseFeeToNum(b.fee) - parseFeeToNum(a.fee)
      }
      return 0 // Newest default
    })

  return (
    <div className="space-y-8 text-left select-none pb-12">
      {/* Page Heading */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0F5D46] tracking-tight">
          Explore Events & Competitions
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Discover certified hackathons, symposiums, and masterclasses across India
        </p>
      </div>

      {/* Filter Bar */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="p-5 sm:p-6 rounded-[24px] border border-white/80 shadow-[0_10px_30px_rgba(15,93,70,0.05)] space-y-4"
      >
        {/* Search & Mode Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by event title, organizer, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-9 pr-4 text-xs sm:text-sm rounded-[14px] bg-white border border-[#0F5D46]/15 focus:outline-none focus:border-[#0F5D46] focus:ring-2 focus:ring-[#0F5D46]/10 text-[#1F2937] placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* Mode Select */}
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="h-11 px-3 text-xs font-semibold rounded-[14px] bg-white border border-[#0F5D46]/15 text-[#0F5D46] focus:outline-none cursor-pointer"
            >
              {modes.map(m => <option key={m} value={m}>Mode: {m}</option>)}
            </select>

            {/* Fee Select */}
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="h-11 px-3 text-xs font-semibold rounded-[14px] bg-white border border-[#0F5D46]/15 text-[#0F5D46] focus:outline-none cursor-pointer"
            >
              {feeTypes.map(f => <option key={f} value={f}>Fee: {f}</option>)}
            </select>

            {/* Sort Select */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="h-11 px-3 text-xs font-semibold rounded-[14px] bg-white border border-[#0F5D46]/15 text-[#0F5D46] focus:outline-none cursor-pointer"
            >
              {sortOptions.map(s => <option key={s} value={s}>Sort: {s}</option>)}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F5D46] text-white shadow-xs'
                  : 'bg-white/80 hover:bg-white text-[#5E6A68] hover:text-[#0F5D46] border border-[#0F5D46]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#5E6A68]">
        <span>Showing <strong className="text-[#0F5D46]">{filteredEvents.length}</strong> events</span>
        {search && (
          <button 
            type="button" 
            onClick={() => setSearch('')}
            className="text-[#D9B24A] font-bold hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 rounded-[28px] bg-white/80 border border-[#0F5D46]/10 text-center space-y-3">
          <span className="text-3xl">🔍</span>
          <h3 className="font-display font-bold text-lg text-[#0F5D46]">No Events Found</h3>
          <p className="text-xs text-[#5E6A68] max-w-sm mx-auto">
            Try adjusting your search criteria, category pill, or fee filter to see more results.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
              setSelectedMode('All')
              setSelectedFee('All')
            }}
            className="px-4 py-2 text-xs font-bold rounded-full bg-[#0F5D46] text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard 
              key={evt.id} 
              event={evt} 
              isWishlisted={wishlistIds.has(evt.id)}
              onToggleWishlist={handleToggleWishlist}
              onDetails={(e) => {
                if (onViewDetails) {
                  onViewDetails(e.id)
                }
              }}
              onRegister={(e) => setRegisterModalEvent(e)}
            />
          ))}
        </div>
      )}

      {/* Modal Checkout Flow */}
      {registerModalEvent && (
        <CheckoutModal
          event={registerModalEvent}
          currentUser={currentUser}
          isOpen={Boolean(registerModalEvent)}
          onClose={() => setRegisterModalEvent(null)}
          onCheckoutComplete={(reg) => {
            if (onRegisterSuccess) onRegisterSuccess(reg)
          }}
          onGoToTickets={() => {
            setRegisterModalEvent(null)
            if (onGoToTickets) onGoToTickets()
          }}
        />
      )}
    </div>
  )
}
