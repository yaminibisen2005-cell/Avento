import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar';
import ExploreFooter from '../explore/ExploreFooter';

// 1. STATS DATA (Section 4)
const stats = [
  { value: '500+', label: 'Events Hosted', desc: 'Across India', icon: '🏆' },
  { value: '100+', label: 'Universities', desc: 'IITs, NITs & Premier Colleges', icon: '🏛️' },
  { value: '25K+', label: 'Students', desc: 'Active Campus Innovators', icon: '🎓' },
  { value: '10K+', label: 'Certificates', desc: 'Verifiable Credentials', icon: '📜' },
  { value: '50+', label: 'Organizers', desc: 'Verified Councils & Clubs', icon: '⭐' },
  { value: '95%', label: 'Success Rate', desc: 'Seamless Check-ins', icon: '⚡' }
];

// 2. WHY CHOOSE AVENTO (Section 5)
const features = [
  {
    title: 'Verified Events',
    description: 'Every hackathon, workshop, and conference is verified with university faculty leads and registered student societies.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Secure Payments',
    description: 'Bank-grade Razorpay checkout integration supporting UPI, Credit/Debit cards, Net Banking, and instant refunds.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    title: 'Digital QR Tickets',
    description: 'Sub-second 0.3s gate admission turnstiles with dynamic encrypted QR passes. Zero manual check-in lines.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    )
  },
  {
    title: 'Instant Certificates',
    description: 'Cryptographically verifiable PDF credentials auto-generated and dispatched immediately upon verified attendance.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'Live Notifications',
    description: 'Real-time multi-channel broadcast alerts for round announcements, venue directions, schedule updates, and spot results.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  {
    title: 'Organizer Dashboard',
    description: 'Deep analytics, live participant segmentation, exportable registration rosters, turnstile monitoring, and revenue velocity.',
    icon: (
      <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];

// 3. HOW AVENTO WORKS (Section 6)
const workflowSteps = [
  { number: '01', title: 'Discover', desc: 'Browse curated campus hackathons, workshops, and competitions.' },
  { number: '02', title: 'Register', desc: 'Quick 60-second registration with team and participant details.' },
  { number: '03', title: 'Pay Securely', desc: 'Zero-friction UPI, card, and net banking via bank-grade escrow.' },
  { number: '04', title: 'Receive QR Ticket', desc: 'Instant pass saved to your wallet with offline scanning support.' },
  { number: '05', title: 'Attend Event', desc: 'Scan your QR pass at the university turnstile gate in 0.3s.' },
  { number: '06', title: 'Download Certificate', desc: 'Verifiable cryptographic credential delivered to your inbox.' }
];

// 4. OUR TEAM (Section 7)
const teamMembers = [
  {
    name: 'Aryan Verma',
    role: 'Founder & CEO',
    bio: 'Visionary engineer passionate about decentralizing collegiate access to cutting-edge technology competitions.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'mailto:aryan@avento.io'
  },
  {
    name: 'Ananya Iyer',
    role: 'Co-Founder & Head of Product',
    bio: 'Product architect obsessed with frictionless student workflows, design elegance, and campus partnerships.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'mailto:ananya@avento.io'
  },
  {
    name: 'Kabir Mehta',
    role: 'Lead Developer',
    bio: 'High-concurrency systems specialist engineering sub-second turnstiles, secure payment escrow, and dynamic certificates.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'mailto:kabir@avento.io'
  },
  {
    name: 'Riya Sen',
    role: 'Community Manager',
    bio: 'Student advocate cultivating active student developer councils and hackathon squads across 100+ colleges.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    linkedin: '#',
    email: 'mailto:riya@avento.io'
  }
];

// 5. TRUSTED BY LOGOS (Section 8)
const universityLogos = [
  { name: 'IIT Delhi', label: 'Indian Institute of Technology' },
  { name: 'IIT Bombay', label: 'Indian Institute of Technology' },
  { name: 'NIT Trichy', label: 'National Institute of Technology' },
  { name: 'BITS Pilani', label: 'Birla Institute of Tech & Science' },
  { name: 'IIIT Hyderabad', label: 'International Institute of IT' },
  { name: 'VNIT Nagpur', label: 'Visvesvaraya National Institute' },
  { name: 'Government Universities', label: 'Central & State Universities' },
  { name: 'Private Universities', label: 'Accredited Academic Campuses' }
];

// 6. STUDENT TESTIMONIALS (Section 9)
const testimonials = [
  {
    name: 'Aarav Sharma',
    role: 'Hackathon Winner, 3rd Year CSE',
    university: 'IIT Delhi',
    stars: 5,
    review: 'AVENTO completely revolutionized our annual hackathon. Over 1,200 participants checked in with sub-second QR scanning, and our verifiable winner certificates arrived instantly in our inboxes.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Tech Fest Lead Coordinator',
    university: 'BITS Pilani',
    stars: 5,
    review: 'From an organizer perspective, AVENTO is lightyears ahead. Payment tracking via Razorpay escrow was completely automated, eliminating our reliance on manual spreadsheets and Google Forms.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Rohan Verma',
    role: 'President, Robotics Society',
    university: 'RV College of Engineering',
    stars: 5,
    review: 'Discovering national-level engineering bootcamps and competitions used to be fragmented across chaotic WhatsApp groups. AVENTO brings verified opportunities into one clean, Apple-level interface.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export default function AboutPage({
  currentUser,
  onBackToLanding,
  onOpenEvents,
  onOpenAuth,
  onLogout,
  onOpenDashboard,
  onOpenProfile
}) {
  // Testimonial carousel active index
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-sliding carousel for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#111827] font-sans antialiased selection:bg-[#D9B24A]/30 selection:text-[#0F5D46] relative overflow-hidden">
      
      {/* ================= 1. REUSABLE AVENTO NAVBAR ================= */}
      <Navbar
        onOpenAuth={onOpenAuth}
        isSplashing={false}
        currentUser={currentUser}
        onLogout={onLogout}
        onBackToLanding={onBackToLanding}
        onOpenDashboard={onOpenDashboard}
        onOpenProfile={onOpenProfile}
        onOpenEvents={onOpenEvents}
        onOpenAbout={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        activeTab="About"
      />

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8 lg:px-12 border-b border-gray-200/60">
        
        {/* Ambient Glows */}
        <div className="absolute top-12 left-10 w-[600px] h-[600px] rounded-full bg-[#EAF7F1] opacity-70 blur-[130px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] rounded-full bg-[#D9B24A]/10 blur-[150px] pointer-events-none -z-10" />

        <div className="w-full max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Hero Content (7 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              {/* Small Gold Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9B24A]/15 border border-[#D9B24A]/30 text-[#0F5D46] font-mono text-xs font-bold tracking-widest uppercase mb-4 w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B24A] animate-pulse" />
                ABOUT AVENTO
              </div>

              {/* Large Monumental Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111827] tracking-tight leading-[1.12] mb-5 sm:mb-6 font-sans">
                Empowering Every Student Through{' '}
                <span className="font-serif italic font-normal text-[#D9B24A]">Campus Innovation.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-lg text-gray-600 max-w-xl leading-relaxed mb-6 sm:mb-8">
                AVENTO is India's modern campus event platform where students discover competitions, hackathons, workshops, conferences, cultural festivals, and career opportunities from universities across the country.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4">
                <button
                  onClick={onOpenEvents}
                  className="px-7 py-3 sm:py-3.5 rounded-full bg-[#0F5D46] hover:bg-[#0B4B3A] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Events</span>
                  <span className="text-base leading-none">→</span>
                </button>

                <button
                  onClick={() => onOpenAuth && onOpenAuth('signup')}
                  className="px-7 py-3 sm:py-3.5 rounded-full bg-white hover:bg-[#EAF7F1]/60 border border-[#0F5D46]/25 text-[#0F5D46] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-2xs cursor-pointer hover:border-[#0F5D46] flex items-center justify-center"
                >
                  Become Organizer
                </button>
              </div>
            </motion.div>

            {/* Right Hero Graphic: Students + Laptops + Certificates + Floating Glass Badges (5 Cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-[500px] rounded-3xl overflow-hidden shadow-[0_24px_55px_rgba(15,93,70,0.12)] border border-white">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Students collaborating at campus hackathon"
                  className="w-full h-[380px] sm:h-[440px] object-cover"
                />

                {/* Ambient photo overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Floating Glass Card 1 (Top Left) */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-md border border-white/70 flex items-center gap-2.5"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-gray-900">50+ Universities Live</span>
                </motion.div>

                {/* Floating Glass Card 2 (Bottom Left) */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-md border border-white/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center font-bold text-base">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">0.3s QR Turnstiles</div>
                      <div className="text-[11px] text-gray-500">Automated Check-in System</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#0F5D46] bg-[#EAF7F1] px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= 2. OUR STORY ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Large Image Inspired by Reference (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80"
                alt="University campus and students"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-sm">
                <span className="text-xs font-bold text-[#D9B24A] font-mono tracking-wider uppercase block mb-0.5">
                  CAMPUS OPERATING SYSTEM
                </span>
                <p className="text-sm font-bold text-gray-900">
                  Engineered to eliminate paper queues & fragmented spreadsheets across 200+ universities.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Content & Timeline (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
              OUR JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight mb-4">
              Building the Future of Student Discovery
            </h2>
            <div className="space-y-3.5 text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
              <p>
                <strong>Why AVENTO started:</strong> Indian colleges host thousands of hackathons, technical symposiums, and cultural fests every year, but students were left stranded across scattered WhatsApp links, Google Forms, and expired payment QR codes.
              </p>
              <p>
                <strong>Problems students faced:</strong> Standing in 2-hour physical registration queues, delayed participation certificates, lack of verified organizer credentials, and no centralized way to discover national opportunities.
              </p>
              <p>
                <strong>How AVENTO solves them:</strong> We built an integrated campus platform that unites discovery, instant Razorpay bank-grade checkout, 0.3s QR gate turnstiles, and automated verifiable certificates into one seamless experience.
              </p>
            </div>

            {/* Glass Timeline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-2xs hover:border-[#0F5D46]/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46] text-xs font-extrabold">2025</span>
                  <span className="text-xs font-bold text-gray-900">Idea</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Identified the chaos of physical queues and manual spreadsheets at university hackathons.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-2xs hover:border-[#0F5D46]/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7F1] text-[#0F5D46] text-xs font-extrabold">Phase 2</span>
                  <span className="text-xs font-bold text-gray-900">Prototype</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Engineered sub-second QR mobile turnstiles and cryptographic certificate generators.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-2xs hover:border-[#0F5D46]/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D9B24A]/20 text-[#917124] text-xs font-extrabold">Phase 3</span>
                  <span className="text-xs font-bold text-gray-900">Launch</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Debuted across premier collegiate hackathons in IITs, NITs, and BITS campuses.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-2xs hover:border-[#0F5D46]/40 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0F5D46] text-white text-xs font-extrabold">Present</span>
                  <span className="text-xs font-bold text-gray-900">Growing Community</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Empowering over 25,000+ active students across 100+ partner universities nationwide.
                </p>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* ================= 3. OUR MISSION ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-transparent via-[#EAF7F1]/30 to-transparent">
        <div className="max-w-[1480px] mx-auto text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
            PURPOSE & PRINCIPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            Our Mission, Vision & Values
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-2">
            The driving principles behind India's premier campus event operating system.
          </p>
        </div>

        <div className="max-w-[1480px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-xl mb-5 shadow-2xs">
                🎯
              </div>
              <span className="text-xs font-bold text-[#D9B24A] uppercase tracking-wider font-mono block mb-1">
                OUR MISSION
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Making quality campus opportunities accessible.
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Breaking down geographical, financial, and institutional barriers so any student can compete, build real-world skills, and earn verifiable recognition regardless of their university tier.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0F5D46]">
              <span>Accessible to 100% of Students</span>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-xl mb-5 shadow-2xs">
                🌐
              </div>
              <span className="text-xs font-bold text-[#D9B24A] uppercase tracking-wider font-mono block mb-1">
                OUR VISION
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Connecting every college in India.
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Building a unified digital ecosystem where college clubs, hackathon organizers, and student innovators collaborate seamlessly across a synchronized national network.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0F5D46]">
              <span>National Campus Mesh Network</span>
            </div>
          </motion.div>

          {/* Values Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/80 p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EAF7F1] text-[#0F5D46] flex items-center justify-center text-xl mb-5 shadow-2xs">
                ⭐
              </div>
              <span className="text-xs font-bold text-[#D9B24A] uppercase tracking-wider font-mono block mb-1">
                OUR CORE VALUES
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Innovation, Trust & Community.
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                We believe in uncompromising integrity, rapid technological innovation, continuous student learning, and radical transparency.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Innovation', 'Trust', 'Learning', 'Community', 'Integrity'].map((val) => (
                  <span key={val} className="px-2.5 py-1 rounded-full bg-[#EAF7F1] text-[#0F5D46] text-xs font-semibold">
                    {val}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-[#0F5D46]">
              <span>Standards of Excellence</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= 4. PLATFORM STATS ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-1.5">
            IMPACT METRICS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F5D46] tracking-tight">
            AVENTO by the Numbers
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-md transition-all text-center flex flex-col justify-center items-center"
            >
              <span className="text-2xl mb-2">{s.icon}</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans leading-none mb-1.5">
                {s.value}
              </div>
              <div className="text-xs font-bold text-gray-800 leading-tight">
                {s.label}
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-0.5 truncate max-w-full">
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= 5. WHY CHOOSE AVENTO ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
            WHY CHOOSE AVENTO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            Enterprise Quality for Campus Innovators
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Six pillars engineered to make hosting and attending college events completely painless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#EAF7F1] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0F5D46] transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#0F5D46]">
                <span>Verified Platform Capability →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= 6. HOW AVENTO WORKS ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-transparent via-[#FAF8F2] to-transparent">
        <div className="max-w-[1480px] mx-auto text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
            SEAMLESS FLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            How AVENTO Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2">
            A frictionless 6-step journey from discovering an event to receiving cryptographic credentials.
          </p>
        </div>

        <div className="max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between text-center relative"
              >
                <div>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#0F5D46] text-white font-mono font-bold text-sm flex items-center justify-center mb-3.5 shadow-2xs">
                    {step.number}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Modern subtle connector arrow for large screens */}
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-[#0F5D46]/40 font-bold">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. OUR TEAM ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
            LEADERSHIP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            Meet the Builders Behind AVENTO
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Engineers, designers, and student advocates committed to modernizing campus technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
            >
              <div>
                {/* Circular image with gold/emerald ring */}
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#0F5D46] to-[#D9B24A] mx-auto mb-4 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {member.name}
                </h3>
                <span className="text-xs font-semibold text-[#0F5D46] block mt-0.5 mb-2.5">
                  {member.role}
                </span>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {member.bio}
                </p>
              </div>

              {/* Social action buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 w-full justify-center">
                <a
                  href={member.linkedin}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#0F5D46] hover:border-[#0F5D46] transition-colors"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href={member.email}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#0F5D46] hover:border-[#0F5D46] transition-colors"
                  aria-label={`${member.name} Email`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= 8. TRUSTED BY (Logo Wall) ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-white/70 border-y border-gray-200/60">
        <div className="max-w-[1480px] mx-auto text-center mb-8">
          <span className="text-xs font-bold tracking-widest text-[#0F5D46] uppercase font-mono">
            INSTITUTIONAL TRUST
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            Trusted by Student Councils from Premier Universities
          </h3>
        </div>

        <div className="max-w-[1480px] mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {universityLogos.map((u) => (
            <div
              key={u.name}
              className="p-4 rounded-2xl border border-gray-200/70 bg-white/80 hover:border-[#0F5D46] hover:bg-[#EAF7F1]/30 transition-all text-center flex flex-col justify-center items-center cursor-pointer group shadow-2xs"
            >
              <span className="text-sm font-extrabold text-gray-400 group-hover:text-[#0F5D46] transition-colors font-sans block">
                {u.name}
              </span>
              <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors leading-tight mt-0.5">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 9. STUDENT TESTIMONIALS (Auto Carousel) ================= */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono block mb-2">
            CAMPUS VOICES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight">
            Loved by Students & Organizers Nationwide
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Real feedback from student leaders who run high-velocity college symposiums with AVENTO.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-200/80 p-8 sm:p-12 shadow-sm text-center relative"
            >
              {/* Star Rating */}
              <div className="flex justify-center gap-1 text-[#D9B24A] text-lg mb-6">
                {'★★★★★'}
              </div>

              {/* Review Quote */}
              <p className="font-serif text-lg sm:text-2xl text-gray-800 leading-relaxed italic mb-8 max-w-2xl mx-auto">
                "{testimonials[activeTestimonial].review}"
              </p>

              {/* Author Details */}
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0F5D46] mb-3 shadow-xs"
                />
                <h4 className="text-base font-bold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  {testimonials[activeTestimonial].role} • <strong className="text-[#0F5D46]">{testimonials[activeTestimonial].university}</strong>
                </p>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeTestimonial === i ? 'w-8 bg-[#0F5D46]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ================= 10. CALL TO ACTION ================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1480px] mx-auto mb-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#072C22] via-[#0F5D46] to-[#0B4B3A] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-[0_25px_60px_rgba(15,93,70,0.25)] border border-white/10">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D9B24A]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#D9B24A] uppercase tracking-widest font-mono block mb-3">
              JOIN THE REVOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Ready to Join India's Smartest Student Community?
            </h2>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-8 max-w-xl mx-auto">
              Discover verified collegiate hackathons, attend workshops, receive verifiable certificates, and accelerate your tech career.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={onOpenEvents}
                className="px-8 py-3.5 rounded-full bg-[#D9B24A] hover:bg-[#c9a23c] text-gray-900 font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                Explore Events
              </button>

              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm tracking-wide transition-all shadow-xs cursor-pointer backdrop-blur-md"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. FOOTER ================= */}
      <ExploreFooter
        onBackToLanding={onBackToLanding}
        onOpenEvents={onOpenEvents}
        onOpenAbout={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAuth={onOpenAuth}
        showCta={false}
      />

    </div>
  );
}
