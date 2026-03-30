import React, { useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEsc])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal modal--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
