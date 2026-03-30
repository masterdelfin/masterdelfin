import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
    >
      <span className="sidebar-nav-icon">{icon}</span>
      <span className="sidebar-nav-label">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { doctor, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = doctor
    ? doctor.full_name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'DR'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--color-primary)"/>
            <path d="M14 7v14M7 14h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="sidebar-logo-text">MedRecords</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavItem
          to="/dashboard"
          label="Dashboard"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          }
        />
        <NavItem
          to="/patients/new"
          label="Nuevo Paciente"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13 3v4M11 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />
        <NavItem
          to="/profile"
          label="Perfil"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2.5 16c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-doctor">
          <div className="sidebar-doctor-avatar">{initials}</div>
          <div className="sidebar-doctor-info">
            <div className="sidebar-doctor-name">{doctor?.full_name || 'Doctor'}</div>
            <div className="sidebar-doctor-specialty">{doctor?.specialty || ''}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 13l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
