import React from 'react'

export default function ErrorMessage({ message, onDismiss, className = '' }) {
  if (!message) return null

  return (
    <div className={`error-message ${className}`} role="alert">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="error-icon">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span>{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss} aria-label="Cerrar error">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
