import React from 'react';
import EventCard from './EventCard';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

export default function EventGrid({
  events = [],
  loading = false,
  onViewDetails,
  onRegister,
  wishlistIds = new Set(),
  onToggleWishlist,
  onShare,
  onResetFilters
}) {
  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  if (!events || events.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onViewDetails={onViewDetails}
          onRegister={onRegister}
          isWishlisted={wishlistIds.has(event.id)}
          onToggleWishlist={onToggleWishlist}
          onShare={onShare}
        />
      ))}
    </div>
  );
}
