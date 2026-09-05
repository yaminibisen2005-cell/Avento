import React, { useState } from 'react'

export default function EventCategoriesSection({ onCategoryClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const categories = [
    {
      title: 'Hackathons',
      icon: '💻',
      count: '45 Events',
      shortDesc: 'Overnight collaborative coding competitions with real-time judging and mentor sync.',
      features: [
        'Team Matching & Registration',
        'Real-time QR Attendance Check-in',
        'Live Scoreboard & Leaderboard',
        'Automated Digital Certificates'
      ]
    },
    {
      title: 'Workshops',
      icon: '🛠',
      count: '32 Sessions',
      shortDesc: 'Hands-on practical masterclasses and technical labs led by certified industry mentors.',
      features: [
        'Strict Seat Limit Management',
        'Instructor Course Dashboard',
        'Attendance Tracking & Logs',
        'Instant Feedback & Ratings'
      ]
    },
    {
      title: 'Seminars',
      icon: '🎤',
      count: '28 Events',
      shortDesc: 'Distinguished campus keynotes, guest speaker panels, and institutional symposiums.',
      features: [
        'Keynote Speaker Management',
        'Multi-session Agenda Scheduling',
        'Verifiable Digital Certificates',
        'Post-event Audience Analytics'
      ]
    },
    {
      title: 'Competitions',
      icon: '🏆',
      count: '24 Leagues',
      shortDesc: 'Structured multi-round tournaments with live brackets and jury evaluation decks.',
      features: [
        'Tournament Bracket Builder',
        'Jury Scoring & Deliberation Panel',
        'Real-time Public Leaderboards',
        'Instant Accolade & Prize Publishing'
      ]
    },
    {
      title: 'Conferences',
      icon: '🏛',
      count: '18 Summits',
      shortDesc: 'Flagship multi-day academic symposiums featuring parallel breakout tracks and expo hubs.',
      features: [
        'Multi-day & Multi-track Planner',
        'Printable NFC / QR Delegate Badges',
        'Sponsor Expo & Booth Directories',
        'Dynamic Session Schedule Updates'
      ]
    },
    {
      title: 'Webinars',
      icon: '🌐',
      count: '50+ Streams',
      shortDesc: 'High-concurrency virtual broadcasts with frictionless digital ticketing and streaming.',
      features: [
        'Frictionless 1-Click RSVP',
        'Zoom & Google Meet Integration',
        'Automated Timezone Reminders',
        'Cloud Video Replay Vaults'
      ]
    }
  ]

  return (
    <section 
      id="events"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(15,93,70,0.08), transparent 35%),
          radial-gradient(circle at bottom right, rgba(217,178,74,0.08), transparent 35%),
          linear-gradient(180deg, #FAF8F2 0%, #F7F8F5 50%, #FAF8F2 100%)
        `
      }}
      className="relative w-full pt-10 sm:pt-12 pb-12 sm:pb-14 overflow-visible select-none"
    >
      {/* ================= 1. CANVAS CONTINUATION GRADIENTS ================= */}
      <div 
        className="absolute top-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-b from-[#FAF8F2] to-transparent -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-t from-[#FAF8F2] to-transparent -z-10" 
        aria-hidden="true" 
      />

      {/* Gentle Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none -z-20 opacity-[0.024] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilterTailormade'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilterTailormade)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true" 
      />

      {/* Light Dotted Grid */}
      <div 
        className="absolute inset-0 bg-dot-grid pointer-events-none -z-30 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_75%)]" 
        aria-hidden="true" 
      />

      {/* Soft Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(244,242,236,0.85)_100%)]"
        aria-hidden="true" 
      />

      {/* Subtle Ambient Glows */}
      <div 
        className="absolute top-12 left-[5%] w-[620px] h-[520px] rounded-full bg-[#0F5D46] blur-[200px] pointer-events-none -z-20 opacity-[0.07]"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-10 right-[6%] w-[600px] h-[500px] rounded-full bg-[#D9B24A] blur-[190px] pointer-events-none -z-20 opacity-[0.07]"
        aria-hidden="true"
      />

      {/* ================= 2. SECTION HEADING (CENTERED) ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mb-12 sm:mb-14">
        <span className="text-[11px] font-extrabold text-[#0F5D46] tracking-[0.2em] uppercase bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#0F5D46]/15 shadow-xs inline-block mb-3.5">
          Event Infrastructure
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#0F5D46] tracking-tight leading-[1.08]">
          Tailormade For Every Event Format
        </h2>
        <p className="text-[#1F2937]/70 text-base sm:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
          From hackathons to conferences, workshops, seminars, competitions, and webinars — AVENTO supports every event.
        </p>
      </div>

      {/* ================= 3. 3x2 RESPONSIVE GRID (3 Desktop, 2 Tablet, 1 Mobile) ================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-y-12 items-start">
          {categories.map((cat, index) => {
            const isHovered = hoveredIndex === index

            return (
              /* Stable grid slot: Keeps the grid layout completely stable without shifting other cards */
              <div 
                key={index}
                className="relative min-h-[220px] sm:h-[250px]"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* 
                  Interactive Expanding Card:
                  - Default State: Compact height (icon, title, badge, short desc).
                  - Hover State: Expands downward smoothly to reveal features, CTA, and accent line.
                  - 300ms smooth animation duration.
                  - Sibling cards remain unblurred and at full opacity.
                */}
                <div 
                  style={{
                    transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0px)',
                    boxShadow: isHovered 
                      ? '0 30px 70px rgba(15, 93, 70, 0.15)' 
                      : '0 14px 35px rgba(15, 93, 70, 0.05)',
                    borderColor: isHovered ? 'rgba(15, 93, 70, 0.25)' : 'rgba(15, 93, 70, 0.08)',
                    background: isHovered 
                      ? 'linear-gradient(180deg, #ffffff 0%, #f7faf8 100%)' 
                      : '#ffffff',
                    zIndex: isHovered ? 30 : 10
                  }}
                  className="relative sm:absolute top-0 left-0 right-0 rounded-[24px] sm:rounded-[28px] border p-5 sm:p-8 flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-md"
                >
                  {/* Top Portion: Icon, Badge, Title, Short Description */}
                  <div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      
                      {/* Large Icon Container */}
                      <div 
                        className={`w-14 h-14 rounded-[20px] border flex items-center justify-center text-3xl shadow-xs transition-colors duration-300 ${
                          isHovered 
                            ? 'bg-[#0F5D46]/[0.08] border-[#0F5D46]/[0.15]' 
                            : 'bg-[#0F5D46]/[0.05] border-[#0F5D46]/[0.10]'
                        }`}
                      >
                        <span>{cat.icon}</span>
                      </div>

                      {/* Event Count Badge */}
                      <span 
                        className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                          isHovered 
                            ? 'bg-[#0F5D46] text-white border-[#0F5D46] shadow-sm' 
                            : 'bg-[#0F5D46]/[0.07] text-[#0F5D46] border-[#0F5D46]/[0.12]'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-2xl sm:text-[25px] text-[#0F5D46] tracking-tight mb-2">
                      {cat.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-[#1F2937]/75 text-[14px] leading-relaxed">
                      {cat.shortDesc}
                    </p>
                  </div>

                  {/* ================= REVEALED CONTENT ON HOVER (300ms SMOOTH EXPANSION) ================= */}
                  <div 
                    style={{
                      maxHeight: isHovered ? '240px' : '0px',
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? '16px' : '0px',
                      transition: 'max-height 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease, margin-top 250ms ease'
                    }}
                    className="overflow-hidden relative z-10"
                  >
                    {/* 4 Feature Bullet Points with Green Check Icons */}
                    <div className="pt-3 border-t border-[#0F5D46]/[0.08] space-y-2">
                      {cat.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#0F5D46]/10 flex items-center justify-center shrink-0">
                            <svg className="w-2.5 h-2.5 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[13px] font-semibold text-[#1F2937]/85">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA Button */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onCategoryClick) onCategoryClick(cat)
                      }}
                      className="mt-4 pt-3 border-t border-[#0F5D46]/[0.08] flex items-center justify-between group/cta"
                    >
                      <span className="text-xs font-bold text-[#0F5D46] tracking-wider uppercase group-hover/cta:text-[#D9B24A] transition-colors">
                        Explore Category
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#0F5D46] text-white flex items-center justify-center shadow-xs group-hover/cta:bg-[#D9B24A] transition-colors">
                        <svg className="w-3.5 h-3.5 transform group-hover/cta:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* ================= BOTTOM ACCENT HIGHLIGHT LINE ================= */}
                  <div 
                    style={{
                      width: isHovered ? '100%' : '0%',
                      transition: 'width 300ms cubic-bezier(0.22, 1, 0.36, 1)'
                    }}
                    className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#0F5D46] via-[#2A8568] to-[#D9B24A] rounded-b-[28px]"
                  />

                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
