import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How do I register for an event on AVENTO?',
      a: 'Browse the event catalog, select any workshop, hackathon, or competition, click "Register Now", review ticket tier details, and proceed through our native Razorpay modal. Free events issue an instant QR pass with zero payment steps.'
    },
    {
      q: 'Where do I access my event entrance ticket and QR code?',
      a: 'Upon registration, your digital ticket is instantly generated and stored in your profile under "My Tickets". It is also dispatched to your verified university email with an embedded offline-ready QR pass.'
    },
    {
      q: 'How does automated certificate issuance work?',
      a: 'When event volunteers scan your QR code at the campus gate or workshop turnstile, your attendance is cryptographically verified in our database. Verifiable PDF certificates are automatically rendered and delivered to your portal credentials tab.'
    },
    {
      q: 'Can event organizers issue refunds if a symposium is rescheduled?',
      a: 'Yes. Authorized college clubs and organizers can trigger direct refunds through the AVENTO Organizer Dashboard. Razorpay processes the reversal directly back to your original payment source (UPI, NetBanking, or Card) within 3-5 banking days.'
    },
    {
      q: 'Are offline campus venue events verified for entry permissions?',
      a: 'All university physical venue listings require formal dean of student affairs or club faculty advisor validation prior to publication on the AVENTO network.'
    }
  ];

  return (
    <section className="w-full max-w-[1000px] mx-auto px-4 sm:px-8 mb-20">
      <div className="text-center mb-10">
        <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight mt-1.5 mb-2">
          Everything You Need to Know
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Clear answers about ticketing, QR check-ins, payments, and certificates.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((f, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div
              key={f.q}
              className="rounded-2xl bg-white border border-[#0F5D46]/12 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F2]/60 transition-colors"
              >
                <span className="text-sm font-bold text-gray-900 leading-snug">
                  {f.q}
                </span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#0F5D46] text-white border-[#0F5D46]' : 'bg-[#FAF8F2] text-gray-500 border-gray-200'
                }`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
