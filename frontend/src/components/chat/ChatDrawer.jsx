import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatApi } from '../../services/api'

export default function ChatDrawer({ _currentUser }) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [activePartner, setActivePartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMsg, setInputMsg] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      chatApi.getConversations()
        .then(data => {
          setConversations(data || [])
          if (!activePartner && data && data.length > 0) {
            setActivePartner(data[0])
          }
        })
        .catch(() => {})
    }
  }, [isOpen])

  useEffect(() => {
    if (!activePartner) return

    setLoadingMessages(true)
    chatApi.getMessages(activePartner.partnerId)
      .then(data => setMessages(data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false))

    const interval = setInterval(() => {
      chatApi.getMessages(activePartner.partnerId)
        .then(data => setMessages(data || []))
        .catch(() => {})
    }, 5000)

    return () => clearInterval(interval)
  }, [activePartner])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputMsg.trim() || !activePartner) return

    const payload = {
      recipientId: activePartner.partnerId,
      message: inputMsg.trim()
    }
    setInputMsg('')

    try {
      const sent = await chatApi.send(payload)
      setMessages(prev => [...prev, sent])
    } catch {
      // optimistic fallback display
      setMessages(prev => [...prev, {
        id: Date.now(),
        message: payload.message,
        isSelf: true,
        timestamp: 'Just now',
        status: 'SENT'
      }])
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-gradient-to-r from-[#0F5D46] to-[#0B4B3A] text-white shadow-xl hover:shadow-2xl border-2 border-[#D9B24A]/40 flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-all"
          title="Open AVENTO Live Chat & Support"
        >
          {isOpen ? '✕' : '💬'}
        </button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 248, 0.95) 100%)',
              backdropFilter: 'blur(30px)'
            }}
            className="fixed bottom-22 right-6 z-40 w-96 max-w-[calc(100vw-32px)] h-[520px] rounded-[30px] border border-white shadow-2xl flex flex-col overflow-hidden select-none"
          >
            {/* Topbar */}
            <div className="p-4 bg-gradient-to-r from-[#0B4B3A] to-[#0F5D46] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-[#D9B24A]">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-xs">
                    {activePartner ? activePartner.name : 'AVENTO Live Support'}
                  </h4>
                  <span className="text-[10px] text-white/80 block">
                    {activePartner ? activePartner.college : 'Instant Assistance'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-300 bg-black/20 px-2 py-0.5 rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online</span>
              </div>
            </div>

            {/* Conversation Partner Switcher Tabs */}
            {conversations.length > 1 && (
              <div className="flex items-center gap-1 p-2 bg-[#FAF8F2] border-b border-gray-100 overflow-x-auto text-[11px]">
                {conversations.map(c => (
                  <button
                    key={c.partnerId}
                    type="button"
                    onClick={() => setActivePartner(c)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap font-bold cursor-pointer transition-all ${
                      activePartner?.partnerId === c.partnerId
                        ? 'bg-[#0F5D46] text-white shadow-2xs'
                        : 'bg-white text-[#5E6A68] hover:bg-gray-100'
                    }`}
                  >
                    {c.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {loadingMessages ? (
                <div className="py-12 text-center text-[#5E6A68]">
                  <span className="inline-block w-4 h-4 border-2 border-[#0F5D46] border-t-transparent rounded-full animate-spin mb-1" />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="py-12 text-center text-[#5E6A68]">
                  <span className="text-2xl block mb-1">👋</span>
                  <p className="font-medium">No messages yet.</p>
                  <p className="text-[11px] text-gray-400">Ask a question to the host council or support.</p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-[16px] text-xs leading-relaxed ${
                        m.isSelf
                          ? 'bg-[#0F5D46] text-white rounded-br-xs'
                          : 'bg-[#FAF8F2] text-gray-800 border border-gray-200/80 rounded-bl-xs'
                      }`}
                    >
                      {m.message}
                    </div>
                    <span className="text-[9.5px] text-gray-400 mt-1 px-1">
                      {m.timestamp} {m.isSelf && `• ${m.status}`}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type your question or query..."
                className="flex-1 h-9 px-3.5 text-xs rounded-full bg-[#FAF8F2] border border-gray-200 focus:outline-none focus:border-[#0F5D46]"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#0F5D46] hover:bg-[#126B51] text-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors shadow-xs"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
