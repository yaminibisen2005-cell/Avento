import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RulesAccordion({ rules = [] }) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.90) 0%, rgba(254, 252, 248, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      className="p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-[0_12px_36px_rgba(15,93,70,0.06)] text-left select-none space-y-5"
    >
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0F5D46] tracking-tight">
          Guidelines & Official Rules
        </h2>
        <p className="text-xs sm:text-sm text-[#5E6A68] mt-1">
          Submission standards, fair play ethics, and institutional compliance
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule, idx) => {
          const isOpen = openIndex === idx

          return (
            <div
              key={idx}
              className="rounded-[20px] bg-white/80 border border-white/80 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#EAF7F1] text-[#0F5D46] font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[#1F2937]">
                    {rule.title}
                  </h4>
                </div>

                <span className={`text-[#0F5D46] text-xs font-bold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-[#5E6A68] leading-relaxed border-t border-gray-100/80">
                      {rule.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
