import React from 'react'
import Authentication from './Authentication'

export default function PremiumAuth({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  if (isOpen === false) return null
  return (
    <Authentication 
      initialIsLogin={initialMode === 'login'} 
      onBackToLanding={onClose}
      onLoginSuccess={(user) => {
        if (onLoginSuccess) onLoginSuccess(user)
        if (onClose) onClose()
      }}
    />
  )
}

export { Authentication }
