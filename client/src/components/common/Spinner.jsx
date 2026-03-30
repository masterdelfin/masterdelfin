import React from 'react'

export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  return (
    <span className={`spinner spinner--${size} spinner--${color} ${className}`} role="status" aria-label="Cargando...">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          className="spinner-track"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
        />
        <path
          className="spinner-head"
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
