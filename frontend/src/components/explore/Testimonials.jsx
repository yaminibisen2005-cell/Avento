import React from 'react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Aarav Sharma',
      role: 'B.Tech CSE, 3rd Year',
      university: 'IIT Delhi',
      rating: 5,
      comment: 'AVENTO completely eliminated ticket lines for our 48h Hackathon. QR scanning at the gate took under a second, and our verifiable participation certificates were in our inbox before the closing ceremony!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Rohan Verma',
      role: 'Head of Tech Club',
      university: 'BITS Pilani',
      rating: 5,
      comment: 'The Razorpay integration handles high registration velocity seamlessly. Managing 1,200+ workshop payments with real-time settlement and automated invoice receipts made our symposium effortless.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Robotics Society Lead',
      university: 'Delhi Technological University',
      rating: 5,
      comment: 'Finding relevant engineering bootcamps and verified competitions across NCR was always painful before AVENTO. Now everything is consolidated with genuine organizer seals and live seat counts.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <section className="w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-12 mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold tracking-widest text-[#D9B24A] uppercase font-mono">
          STUDENT VOICES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5D46] tracking-tight mt-1.5 mb-2">
          Trusted by 50,000+ College Students
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm">
          Hear from student leaders, developers, and campus innovators across India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-white border border-[#0F5D46]/12 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>

              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                "{r.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0F5D46]/20"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900 leading-tight">
                  {r.name}
                </h4>
                <p className="text-[11px] text-[#0F5D46] font-semibold">
                  {r.role} • {r.university}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
