import React, { useState } from 'react';
import { motion } from 'framer-motion';
import aventoLogo from '../assets/logo.png';

export default function Footer({
  onBackToLanding,
  onOpenEvents,
  onOpenAbout,
  onOpenAuth
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="w-full relative bg-gradient-to-b from-[#0F5D46] to-[#176B56] border-t border-white/[0.08] text-[#F8FAF9] font-sans antialiased overflow-hidden pt-9 pb-6 px-4 sm:px-8 lg:px-12 selection:bg-[#D9B24A]/30 selection:text-white">
      {/* Subtle ambient light glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#D9B24A]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/3 w-96 h-32 bg-white/5 blur-3xl pointer-events-none -z-0" />

      <div className="w-full max-w-[1400px] mx-auto relative z-10">
        
        {/* ================= MAIN 4-COLUMN SaaS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 lg:gap-8 pb-7">
          
          {/* 1. LEFT SECTION (Logo, subtitle, desc, 4 social buttons) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:col-span-6 lg:col-span-4 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div 
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <img 
                src={aventoLogo} 
                alt="AVENTO Logo" 
                className="w-7 h-7 object-contain group-hover:scale-105 transition-transform" 
              />
              <span className="text-xl font-extrabold tracking-tight text-[#F8FAF9] font-sans flex items-center">
                AVENTO<span className="text-[#D9B24A]">.</span>
              </span>
            </div>

            {/* One short line only */}
            <p className="text-[11.5px] font-semibold text-[#D9B24A] uppercase tracking-wider font-mono mt-1">
              Smart Campus Event Platform
            </p>

            {/* One concise description */}
            <p className="text-xs text-white/70 leading-relaxed max-w-xs mt-2 mb-4">
              Connecting students, organizers and institutions.
            </p>

            {/* Only 4 social icons: LinkedIn, Instagram, GitHub, Twitter */}
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              <motion.a
                whileHover={{ y: -2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D9B24A] text-white/80 hover:text-[#0F5D46] border border-white/10 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" strokeWidth={2} />
                </svg>
              </motion.a>

              {/* Instagram */}
              <motion.a
                whileHover={{ y: -2 }}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D9B24A] text-white/80 hover:text-[#0F5D46] border border-white/10 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} strokeLinecap="round" />
                </svg>
              </motion.a>

              {/* GitHub */}
              <motion.a
                whileHover={{ y: -2 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D9B24A] text-white/80 hover:text-[#0F5D46] border border-white/10 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>

              {/* Twitter / X */}
              <motion.a
                whileHover={{ y: -2 }}
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D9B24A] text-white/80 hover:text-[#0F5D46] border border-white/10 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* 2. CENTER LINKS (Only 3 Columns: Platform, Company, Resources) */}
          <div className="md:col-span-6 lg:col-span-5 grid grid-cols-3 gap-4 sm:gap-6 text-left">
            
            {/* Column 1: Platform */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <h4 className="text-[11px] font-bold text-[#D9B24A] uppercase tracking-wider font-mono mb-2.5">
                Platform
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={onOpenEvents}
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Explore Events
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenAuth && onOpenAuth('signup')}
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Host Event
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenEvents}
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Certificates
                  </button>
                </li>
                <li>
                  <span className="text-white/70 hover:text-[#F8FAF9] transition-all duration-150 cursor-pointer inline-flex items-center gap-1.5">
                    Pricing
                    <span className="text-[8.5px] font-mono uppercase bg-[#D9B24A]/20 text-[#D9B24A] px-1 py-0.2 rounded font-bold">
                      Free
                    </span>
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Column 2: Company */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4 className="text-[11px] font-bold text-[#D9B24A] uppercase tracking-wider font-mono mb-2.5">
                Company
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={onOpenAbout}
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    About
                  </button>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@avento.io"
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@avento.io"
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Column 3: Resources */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h4 className="text-[11px] font-bold text-[#D9B24A] uppercase tracking-wider font-mono mb-2.5">
                Resources
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="#faq"
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <span className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block">
                    Privacy
                  </span>
                </li>
                <li>
                  <span className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block">
                    Terms
                  </span>
                </li>
                <li>
                  <a
                    href="mailto:support@avento.io"
                    className="text-white/70 hover:text-[#F8FAF9] hover:translate-x-0.5 transition-all duration-150 cursor-pointer block"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </motion.div>

          </div>

          {/* 3. RIGHT SECTION: Compact Newsletter Glass Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-12 lg:col-span-3"
          >
            <div className="rounded-2xl bg-white/[0.07] border border-white/[0.12] backdrop-blur-md p-4 shadow-sm text-left">
              {/* Title */}
              <h4 className="text-xs font-bold text-[#F8FAF9] tracking-tight">
                Stay Updated
              </h4>
              {/* One sentence only */}
              <p className="text-[11px] text-white/70 leading-relaxed mt-1 mb-3">
                Subscribe for curated tech events & hackathon invites.
              </p>

              {subscribed ? (
                <div className="py-2 px-3 rounded-xl bg-white/10 border border-[#D9B24A]/40 text-xs text-white flex items-center gap-1.5">
                  <span className="text-[#D9B24A] font-bold">✓</span> Subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/[0.08] border border-white/15 text-[#F8FAF9] placeholder:text-white/40 focus:outline-none focus:border-[#D9B24A] focus:bg-white/[0.12] transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-[#D9B24A] hover:bg-[#c9a23c] text-[#0F5D46] font-bold text-xs tracking-wide transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>

        {/* ================= BOTTOM STRIP ================= */}
        <div className="border-t border-white/[0.08] pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          {/* Left */}
          <div className="text-center sm:text-left">
            © 2026 AVENTO. All rights reserved.
          </div>

          {/* Center */}
          <div className="flex items-center gap-1 text-white/80 font-medium text-[11.5px]">
            <span>Made with</span>
            <span className="text-rose-400 animate-pulse text-xs">❤️</span>
            <span>for Campus Innovation</span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-white/70 text-[11.5px]">
            <button type="button" className="hover:text-white transition-colors cursor-pointer">
              Privacy
            </button>
            <span className="text-white/30">•</span>
            <button type="button" className="hover:text-white transition-colors cursor-pointer">
              Terms
            </button>
            <span className="text-white/30">•</span>
            <button type="button" className="hover:text-white transition-colors cursor-pointer">
              Cookies
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
