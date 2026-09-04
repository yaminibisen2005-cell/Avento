import React from 'react';
import Footer from '../Footer';

export default function ExploreFooter({
  onBackToLanding,
  onOpenAbout,
  onOpenEvents,
  onOpenAuth,
  showCta = true
}) {
  return (
    <Footer
      onBackToLanding={onBackToLanding}
      onOpenAbout={onOpenAbout}
      onOpenEvents={onOpenEvents}
      onOpenAuth={onOpenAuth}
      showCta={showCta}
    />
  );
}
