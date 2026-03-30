import React from 'react'
import Spinner from './Spinner'

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading ? 'btn--loading' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner size="sm" color="inherit" />}
      <span>{children}</span>
    </button>
  )
}
