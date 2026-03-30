import React, { useState, useEffect } from 'react'
import AppShell from '../components/layout/AppShell'
import TopBar from '../components/layout/TopBar'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ErrorMessage from '../components/common/ErrorMessage'
import useAuth from '../hooks/useAuth'
import apiClient from '../api/client'

export default function ProfilePage() {
  const { doctor, login, token } = useAuth()

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    specialty: '',
    license_no: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (doctor) {
      setProfileForm({
        full_name: doctor.full_name || '',
        email: doctor.email || '',
        specialty: doctor.specialty || '',
        license_no: doctor.license_no || '',
      })
    }
  }, [doctor])

  const setP = (field) => (e) => {
    setProfileForm(prev => ({ ...prev, [field]: e.target.value }))
    setProfileError('')
    setProfileSuccess('')
  }

  const setPw = (field) => (e) => {
    setPasswordForm(prev => ({ ...prev, [field]: e.target.value }))
    setPasswordError('')
    setPasswordSuccess('')
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profileForm.full_name.trim()) {
      setProfileError('El nombre completo es requerido.')
      return
    }
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      const res = await apiClient.put('/auth/profile', profileForm)
      const updatedDoctor = res.data?.data || res.data?.doctor || res.data
      login(token, { ...doctor, ...updatedDoctor })
      setProfileSuccess('Perfil actualizado correctamente.')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Error al actualizar el perfil.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!passwordForm.current_password) {
      setPasswordError('Ingresa tu contraseña actual.')
      return
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('Las contraseñas nuevas no coinciden.')
      return
    }
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      await apiClient.put('/auth/password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      })
      setPasswordSuccess('Contraseña actualizada correctamente.')
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Error al cambiar la contraseña.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const initials = doctor?.full_name
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'DR'

  return (
    <AppShell>
      <TopBar
        title="Mi Perfil"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Perfil' }]}
      />
      <main className="profile-main">
        <div className="profile-layout">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-lg">{initials}</div>
            <h2 className="profile-name">{doctor?.full_name || 'Doctor'}</h2>
            <p className="profile-specialty">{doctor?.specialty || 'Sin especialidad'}</p>
            {doctor?.license_no && (
              <p className="profile-license">Colegiatura: {doctor.license_no}</p>
            )}
          </div>

          <div className="profile-forms">
            {/* Edit Profile */}
            <div className="profile-section">
              <h3 className="profile-section-title">Información del perfil</h3>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <ErrorMessage message={profileError} onDismiss={() => setProfileError('')} />
                {profileSuccess && (
                  <div className="success-message">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="var(--color-success)" strokeWidth="1.5"/>
                      <path d="M5 8l2 2 4-4" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {profileSuccess}
                  </div>
                )}

                <div className="form-row">
                  <Input
                    label="Nombre completo"
                    required
                    value={profileForm.full_name}
                    onChange={setP('full_name')}
                    placeholder="Dr. Juan García"
                  />
                  <Input
                    label="Especialidad"
                    value={profileForm.specialty}
                    onChange={setP('specialty')}
                    placeholder="Medicina Interna"
                  />
                </div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={profileForm.email}
                  onChange={setP('email')}
                  placeholder="doctor@clinica.com"
                />
                <Input
                  label="Número de colegiatura"
                  value={profileForm.license_no}
                  onChange={setP('license_no')}
                  placeholder="CMP-12345"
                />

                <div className="profile-form-actions">
                  <Button type="submit" variant="primary" loading={profileLoading}>
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="profile-section">
              <h3 className="profile-section-title">Cambiar contraseña</h3>
              <form onSubmit={handlePasswordSubmit} className="profile-form">
                <ErrorMessage message={passwordError} onDismiss={() => setPasswordError('')} />
                {passwordSuccess && (
                  <div className="success-message">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="var(--color-success)" strokeWidth="1.5"/>
                      <path d="M5 8l2 2 4-4" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {passwordSuccess}
                  </div>
                )}

                <Input
                  label="Contraseña actual"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={setPw('current_password')}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <div className="form-row">
                  <Input
                    label="Nueva contraseña"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={setPw('new_password')}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                  <Input
                    label="Confirmar nueva contraseña"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={setPw('confirm_password')}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                  />
                </div>

                <div className="profile-form-actions">
                  <Button type="submit" variant="primary" loading={passwordLoading}>
                    Cambiar contraseña
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  )
}
