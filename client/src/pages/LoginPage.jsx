import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import * as authApi from '../api/auth.api'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ErrorMessage from '../components/common/ErrorMessage'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authApi.login(form.email, form.password)
      const payload = res.data?.data || res.data
      login(payload.token, payload.doctor)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Credenciales incorrectas. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="var(--color-primary)"/>
              <path d="M20 10v20M10 20h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="auth-title">MedRecords</h1>
          <p className="auth-subtitle">Sistema de Fichas Médicas</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <Input
            label="Correo electrónico"
            type="email"
            required
            value={form.email}
            onChange={handleChange('email')}
            placeholder="doctor@clinica.com"
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            required
            value={form.password}
            onChange={handleChange('password')}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="auth-submit-btn"
          >
            Iniciar sesión
          </Button>
        </form>

        <div className="auth-footer-links">
          <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  )
}
