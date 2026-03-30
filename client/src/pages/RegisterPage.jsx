import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import * as authApi from '../api/auth.api'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ErrorMessage from '../components/common/ErrorMessage'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    specialty: '',
    license_no: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.full_name.trim()) {
      setError('El nombre completo es requerido.')
      return
    }
    if (!form.email.trim()) {
      setError('El correo electrónico es requerido.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (form.password !== form.confirm_password) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const { confirm_password, ...payload } = form
      const res = await authApi.register(payload)
      const data = res.data?.data || res.data
      login(data.token, data.doctor)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al registrarse. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <div className="auth-logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="var(--color-primary)"/>
              <path d="M20 10v20M10 20h20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="auth-title">MedRecords</h1>
          <p className="auth-subtitle">Crear cuenta de médico</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <div className="form-row">
            <Input
              label="Nombre completo"
              required
              value={form.full_name}
              onChange={handleChange('full_name')}
              placeholder="Dr. Juan García"
              autoComplete="name"
            />
            <Input
              label="Especialidad"
              value={form.specialty}
              onChange={handleChange('specialty')}
              placeholder="Ej: Medicina Interna"
            />
          </div>

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
            label="Número de colegiatura"
            value={form.license_no}
            onChange={handleChange('license_no')}
            placeholder="CMP-12345"
          />

          <div className="form-row">
            <Input
              label="Contraseña"
              type="password"
              required
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              required
              value={form.confirm_password}
              onChange={handleChange('confirm_password')}
              placeholder="Repite la contraseña"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="auth-submit-btn"
          >
            Crear cuenta
          </Button>
        </form>

        <div className="auth-footer-links">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}
