import React, { useState, useEffect, useCallback } from 'react';
import eventApi from '../../services/eventApi';
import { wishlistApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';

// Reuse Exact Same Landing Page Navbar
import Navbar from '../Navbar';
import ExploreHero from './ExploreHero';
import QuickStats from './QuickStats';
import FeaturedCarousel from './FeaturedCarousel';
import CategorySection from './CategorySection';
import FilterBar from './FilterBar';
import EventGrid from './EventGrid';
import ExploreFooter from './ExploreFooter';

// Connected Full Views / Modals
import EventDetails from '../event/EventDetails';
import CheckoutModal from '../checkout/CheckoutModal';

export default function EventListingPage({ currentUser, onBackToLanding, onOpenAuth, onLogout, onOpenAbout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    category: 'All',
    mode: 'All',
    priceTier: 'All',
    date: 'All',
    sort: 'Newest',
    query: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Selected event for Details or Checkout
  const [viewingEventId, setViewingEventId] = useState(null);
  const [registeringEvent, setRegisteringEvent] = useState(null);

  // Wishlist Syncing
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const toast = useToast();

  // Load backend events with filtering
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventApi.filterEvents({
        category: filters.category,
        mode: filters.mode,
        priceTier: filters.priceTier,
        sort: filters.sort,
        query: filters.query
      });
      setEvents(data || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to event catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    let active = true;
    eventApi.filterEvents({
      category: filters.category,
      mode: filters.mode,
      priceTier: filters.priceTier,
      sort: filters.sort,
      query: filters.query
    })
      .then(data => {
        if (active) {
          setEvents(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message || 'Failed to connect to event catalog. Please try again.');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [filters]);

  // Load wishlist IDs
  useEffect(() => {
    wishlistApi.getAll()
      .then((items) => {
        if (items) {
          const ids = new Set(items.map(i => i.eventId));
          setWishlistIds(ids);
        }
      })
      .catch(() => {});
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      mode: 'All',
      priceTier: 'All',
      date: 'All',
      sort: 'Newest',
      query: ''
    });
    setCurrentPage(1);
  };

  const handleToggleWishlist = async (event) => {
    const isSaved = wishlistIds.has(event.id);
    const next = new Set(wishlistIds);

    if (isSaved) {
      next.delete(event.id);
      setWishlistIds(next);
      try {
        await wishlistApi.remove(event.id);
        toast.info(`Removed "${event.title}" from Wishlist`);
      } catch {
        next.add(event.id);
        setWishlistIds(next);
      }
    } else {
      next.add(event.id);
      setWishlistIds(next);
      try {
        await wishlistApi.add(event.id);
        toast.success(`Saved "${event.title}" to Wishlist`);
      } catch {
        next.delete(event.id);
        setWishlistIds(next);
      }
    }
  };

  const handleShare = (event) => {
    const shareUrl = `${window.location.origin}/events#${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success(`Share link copied for "${event.title}"`);
    } else {
      toast.info(`Event URL: ${shareUrl}`);
    }
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const paginatedEvents = events.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // If user clicked an event, show full EventDetails view
  if (viewingEventId) {
    return (
      <EventDetails
        eventId={viewingEventId}
        currentUser={currentUser}
        onBack={() => setViewingEventId(null)}
        onRegisterSuccess={() => {
          setViewingEventId(null);
          toast.success('Registration completed successfully!');
          fetchEvents();
        }}
        onGoToTickets={() => {
          setViewingEventId(null);
          toast.info('Access your pass in My Tickets tab');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#1F2937] font-sans antialiased selection:bg-[#D9B24A]/30 selection:text-[#0F5D46] relative">
      
      {/* 1. EXACT SAME NAVBAR COMPONENT AS LANDING/HOME PAGE */}
      <Navbar
        onOpenAuth={onOpenAuth}
        isSplashing={false}
        currentUser={currentUser}
        onLogout={onLogout}
        onBackToLanding={onBackToLanding}
        onOpenEvents={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAbout={onOpenAbout}
        activeTab="Events"
      />

      {/* 2. CINEMATIC HERO BANNER */}
      <ExploreHero
        searchQuery={filters.query}
        onSearchChange={(q) => handleFilterChange('query', q)}
        onSearchSubmit={() => fetchEvents()}
        onQuickTagClick={(tag) => handleFilterChange('query', tag)}
      />

      {/* 3. FLOATING QUICK STATS (Directly Under Hero) */}
      <QuickStats events={events} />

      {/* 4. FEATURED EVENTS ("Handpicked Events For You") */}
      <FeaturedCarousel
        events={events}
        onViewDetails={(id) => setViewingEventId(id)}
        onRegister={(evt) => setRegisteringEvent(evt)}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 5. DOMAIN CATEGORIES STRIP */}
      <CategorySection
        selectedCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange('category', cat)}
      />

      {/* ================= MAIN EVENT EXPLORER SECTION ================= */}
      <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-20" id="events">
        
        {/* 6. FILTER BAR WITH REFERENCE DESIGN */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={events.length}
        />

        {/* Error Alert */}
        {error && (
          <div className="rounded-2xl p-6 bg-rose-50/90 border border-rose-200 text-rose-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold">Failed to load events</h4>
                <p className="text-xs text-rose-600">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* 7. EVENT GRID */}
        <div>
          <EventGrid
            events={paginatedEvents}
            loading={loading}
            onViewDetails={(id) => setViewingEventId(id)}
            onRegister={(evt) => setRegisteringEvent(evt)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onShare={handleShare}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Controls */}
          {!loading && events.length > pageSize && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentPage === 1
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-white hover:bg-[#0F5D46] text-gray-700 hover:text-white border border-[#0F5D46]/15 cursor-pointer shadow-2xs'
                }`}
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#0F5D46] text-white shadow-2xs'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border border-[#0F5D46]/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentPage === totalPages
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-white hover:bg-[#0F5D46] text-gray-700 hover:text-white border border-[#0F5D46]/15 cursor-pointer shadow-2xs'
                }`}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. CLEAN LIGHTWEIGHT FOOTER */}
      <ExploreFooter
        onBackToLanding={onBackToLanding}
        onOpenAbout={onOpenAbout}
        onOpenEvents={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={onOpenAuth}
      />

      {/* ================= CHECKOUT MODAL ================= */}
      {registeringEvent && (
        <CheckoutModal
          isOpen={!!registeringEvent}
          event={registeringEvent}
          currentUser={currentUser}
          onClose={() => setRegisteringEvent(null)}
          onCheckoutComplete={() => {
            setRegisteringEvent(null);
            toast.success(`Successfully registered for ${registeringEvent.title}!`);
            fetchEvents();
          }}
          onGoToTickets={() => {
            setRegisteringEvent(null);
            toast.info('Pass generated. View in My Tickets.');
          }}
        />
      )}

    </div>
  );
}
