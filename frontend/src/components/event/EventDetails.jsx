import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventService } from '../../services/eventService'
import { reviewApi, wishlistApi } from '../../services/api'
import HeroSection from './HeroSection'
import StickyRegistrationCard from './StickyRegistrationCard'
import EventOverview from './EventOverview'
import Timeline from './Timeline'
import SpeakerCard from './SpeakerCard'
import VenueCard from './VenueCard'
import OrganizerCard from './OrganizerCard'
import RequirementCard from './RequirementCard'
import RulesAccordion from './RulesAccordion'
import FAQAccordion from './FAQAccordion'
import ReviewCard from './ReviewCard'
import RelatedEvents from './RelatedEvents'
import CheckoutModal from '../checkout/CheckoutModal'

export default function EventDetails({ 
  eventId = 301, 
  currentUser,
  onBack, 
  onRegisterSuccess,
  onGoToTickets 
}) {
  const [event, setEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviewsData, setReviewsData] = useState({ reviews: [], totalReviews: 0, averageRating: 4.9 })
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [shareToast, setShareToast] = useState(false)

  const loadReviews = () => {
    reviewApi.getEventReviews(eventId)
      .then(res => {
        if (res && res.reviews) setReviewsData(res)
      })
      .catch(() => {})
  }

  useEffect(() => {
    let isMounted = true
    window.scrollTo({ top: 0, behavior: 'smooth' })

    Promise.all([
      eventService.getEventById(eventId),
      eventService.getRelatedEvents(eventId)
    ]).then(([evtData, related]) => {
      if (isMounted) {
        setEvent(evtData)
        setRelatedEvents(related)
        setLoading(false)
      }
    })

    wishlistApi.check(eventId)
      .then(res => {
        if (isMounted && res) setIsWishlisted(Boolean(res.isWishlisted))
      })
      .catch(() => {})

    loadReviews()

    return () => {
      isMounted = false
    }
  }, [eventId])

  const handleToggleWishlist = async () => {
    const next = !isWishlisted
    setIsWishlisted(next)
    try {
      if (next) {
        await wishlistApi.add(eventId)
      } else {
        await wishlistApi.remove(eventId)
      }
    } catch {
      setIsWishlisted(!next)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
    setShareToast(true)
    setTimeout(() => setShareToast(false), 2500)
  }

  if (loading || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-[#0F5D46]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#0F5D46] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#5E6A68]">
            Loading Event Workspace...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen w-full relative text-[#1F2937] font-sans antialiased selection:bg-[#D9B24A]/25 selection:text-[#0F5D46] overflow-x-hidden"
      style={{
        backgroundColor: '#FAF8F2',
        backgroundImage: `
          radial-gradient(circle at 15% 15%, rgba(15, 93, 70, 0.08), transparent 35%),
          radial-gradient(circle at 85% 75%, rgba(217, 178, 74, 0.08), transparent 35%),
          radial-gradient(circle at 50% 50%, rgba(234, 247, 241, 0.40), transparent 50%),
          linear-gradient(180deg, #FAF8F2 0%, #F5F7F3 100%)
        `
      }}
    >
      {/* Background Glows & Caustics */}
      <div className="fixed top-20 left-1/4 w-[32rem] h-[32rem] bg-[#0F5D46]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-[36rem] h-[36rem] bg-[#D9B24A]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(#0F5D46_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-[16px] bg-[#0F5D46] text-white text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <span>✅</span>
            <span>Event link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TOP BREADCRUMB & BACK HEADER ================= */}
      <nav 
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(250, 248, 242, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
        className="sticky top-0 z-30 h-16 w-full border-b border-[#0F5D46]/10 px-4 sm:px-8 lg:px-12 flex items-center justify-between select-none shadow-2xs"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0F5D46] hover:text-[#0B4B3A] bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-[#0F5D46]/15 transition-all cursor-pointer shadow-2xs"
        >
          <span>←</span>
          <span>Back to Events</span>
        </button>

        {/* Breadcrumb path */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#5E6A68]">
          <span className="hover:text-[#0F5D46] cursor-pointer" onClick={onBack}>Events</span>
          <span>/</span>
          <span className="text-[#0F5D46]">{event.category}</span>
          <span>/</span>
          <span className="text-[#1F2937] font-bold truncate max-w-[240px]">{event.title}</span>
        </div>

        {/* Quick Share & Wishlist */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/15 shadow-2xs text-xs cursor-pointer"
            title="Wishlist"
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#0F5D46] border border-[#0F5D46]/15 shadow-2xs text-xs cursor-pointer"
            title="Share"
          >
            🔗
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-12">
        
        {/* 1. HERO SECTION */}
        <HeroSection
          event={event}
          onRegister={() => setShowRegisterModal(true)}
          isWishlisted={isWishlisted}
          onToggleWishlist={handleToggleWishlist}
          onShare={handleShare}
        />

        {/* 2. TWO-COLUMN LAYOUT: MAIN CONTENT (8 Cols) + STICKY REGISTRATION RAIL (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Main Left Column (7-8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Event Overview & Learning */}
            <EventOverview event={event} />

            {/* Agenda & Timeline */}
            <Timeline timeline={event.timeline} />

            {/* Speakers & Mentors */}
            <SpeakerCard speakers={event.speakers} />

            {/* Venue & Location */}
            <VenueCard venue={event.venue} />

            {/* Host / Organizer */}
            <OrganizerCard organizer={event.organizer} />

            {/* Participation Requirements */}
            <RequirementCard requirements={event.requirements} />

            {/* Guidelines & Rules */}
            <RulesAccordion rules={event.rules} />

            {/* FAQs */}
            <FAQAccordion faqs={event.faqs} />

            {/* Student Reviews */}
            <ReviewCard 
              eventId={eventId} 
              reviews={reviewsData.reviews && reviewsData.reviews.length > 0 ? reviewsData.reviews : event.reviews} 
              averageRating={reviewsData.averageRating} 
              currentUser={currentUser} 
              onReviewAdded={loadReviews} 
            />
          </div>

          {/* Sticky Right Column (4 Cols on desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <StickyRegistrationCard
              event={event}
              onRegister={() => setShowRegisterModal(true)}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>

        </div>

        {/* 3. BOTTOM HIGH-CONVERSION CTA BANNER */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #0F5D46 0%, #0B4B3A 100%)',
            boxShadow: '0 24px 60px rgba(15,93,70,0.25)'
          }}
          className="p-8 sm:p-12 rounded-[32px] text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden border border-white/20"
        >
          {/* Ambient Gold Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9B24A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#D9B24A] bg-[#D9B24A]/20 px-3 py-1 rounded-full border border-[#D9B24A]/30 inline-block mb-1">
              Final Call for Registrations
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight">
              Ready to attend {event.title}?
            </h3>
            <p className="text-white/80 text-sm max-w-xl">
              Secure your verified entry badge today with 0.3s fast-track check-in and instant pass generation.
            </p>
          </div>

          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowRegisterModal(true)}
            className="px-8 py-4 bg-[#D9B24A] hover:bg-[#E5BF57] text-[#0B4B3A] font-extrabold text-sm sm:text-base rounded-[18px] shadow-[0_8px_30px_rgba(217,178,74,0.35)] flex items-center justify-center gap-2 shrink-0 cursor-pointer relative z-10 transition-all"
          >
            <span>Register Now • {event.fee}</span>
            <span>→</span>
          </motion.button>
        </div>

        {/* 4. RELATED & TRENDING EVENTS */}
        <RelatedEvents
          relatedEvents={relatedEvents}
          onSelectEvent={(id) => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setEvent(null)
            eventService.getEventById(id).then(e => setEvent(e))
          }}
        />

      </main>

      {/* ================= COMPLETE 4-STEP CHECKOUT WIZARD ================= */}
      <CheckoutModal
        isOpen={showRegisterModal}
        event={event}
        currentUser={currentUser}
        onClose={() => setShowRegisterModal(false)}
        onCheckoutComplete={(regData) => {
          if (onRegisterSuccess) onRegisterSuccess(regData)
        }}
        onGoToTickets={onGoToTickets}
      />
    </div>
  )
}
