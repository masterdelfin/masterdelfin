import React from 'react'

const VARIANT_COLORS = {
  primary: 'badge--primary',
  success: 'badge--success',
  warning: 'badge--warning',
  danger: 'badge--danger',
  info: 'badge--info',
  neutral: 'badge--neutral',
  draft: 'badge--draft',
}

export default function Badge({ variant = 'neutral', color, children, className = '' }) {
  const variantClass = VARIANT_COLORS[variant] || VARIANT_COLORS[color] || 'badge--neutral'
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  )
}
