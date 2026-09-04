import React from 'react';
import { motion } from 'framer-motion';

export default function WhyChooseAvento() {
  const features = [
    {
      title: 'Verified Campus Events',
      desc: 'Every event, hackathon, and symposium is rigorously verified with registered college authorities and premier councils.',
      badge: '100% Verified',
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'from-emerald-500/10 to-teal-500/5'
    },
    {
      title: '0.3s Digital QR Turnstiles',
      desc: 'Zero manual attendance sheets. Scan passes via any mobile device camera with instant visual verification badges.',
      badge: 'Sub-Second Entry',
      icon: (
        <svg className="w-6 h-6 text-[#D9B24A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      bg: 'from-amber-500/10 to-yellow-500/5'
    },
    {
      title: 'Smart Verifiable Certificates',
      desc: 'Cryptographically secured PDF certificates generated and delivered directly to your inbox post turnstile verification.',
      badge: 'Verifiable Credential',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      bg: 'from-blue-500/10 to-indigo-500/5'
    },
    {
      title: 'Bank-Grade Razorpay Checkout',
      desc: 'Native PCI-DSS compliant payment processing with automatic tax invoice generation and instant refund management.',
      badge: 'Instant Settlement',
      icon: (
        <svg className="w-6 h-6 text-[#0F5D46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      bg: 'from-emerald-500/10 to-[#D9B24A]/10'
    }
  ];

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono">
          ENTERPRISE PLATFORM STANDARDS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight mt-1.5 mb-3">
          Why Students & Colleges Choose AVENTO
        </h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Engineered for frictionless campus event discovery, automated credentialing, and flawless venue gate operations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-white border border-[#0F5D46]/12 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.bg} border border-[#0F5D46]/10 flex items-center justify-center shadow-xs`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#FAF8F2] text-[#0F5D46] border border-[#0F5D46]/15 uppercase tracking-wider font-mono">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#0F5D46]">
              <span>Learn More</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
