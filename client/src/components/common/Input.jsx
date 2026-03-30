import React, { forwardRef } from 'react'

const Input = forwardRef(function Input(
  {
    label,
    error,
    required = false,
    id,
    className = '',
    type = 'text',
    as: As = 'input',
    ...rest
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="form-required"> *</span>}
        </label>
      )}
      {As === 'textarea' ? (
        <textarea
          ref={ref}
          id={inputId}
          className={`form-input form-textarea ${error ? 'form-input--error' : ''}`}
          {...rest}
        />
      ) : As === 'select' ? (
        <select
          ref={ref}
          id={inputId}
          className={`form-input form-select ${error ? 'form-input--error' : ''}`}
          {...rest}
        />
      ) : (
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`form-input ${error ? 'form-input--error' : ''}`}
          {...rest}
        />
      )}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
})

export default Input
