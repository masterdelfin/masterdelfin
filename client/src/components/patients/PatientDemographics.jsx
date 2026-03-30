import React from 'react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="info-row">
      <span className="info-row-icon">{icon}</span>
      <div className="info-row-content">
        <span className="info-row-label">{label}</span>
        <span className="info-row-value">{value}</span>
      </div>
    </div>
  )
}

export default function PatientDemographics({ patient }) {
  if (!patient) return null

  return (
    <div className="patient-demographics">
      <InfoRow
        label="Fecha de nacimiento"
        value={formatDate(patient.date_of_birth)}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 1v2M11 1v2M1 6h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
      />
      <InfoRow
        label="Correo electrónico"
        value={patient.email}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
      />
      <InfoRow
        label="Teléfono"
        value={patient.phone}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h3l1.5 3.5-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5L14 10v3a1 1 0 0 1-1 1C6.373 14 2 9.627 2 4a1 1 0 0 1 1-1v0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
      <InfoRow
        label="Dirección"
        value={patient.address}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5a5 5 0 0 0-5 5c0 3 5 8.5 5 8.5s5-5.5 5-8.5a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="8" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        }
      />
      <InfoRow
        label="Contacto de emergencia"
        value={patient.emergency_contact_name}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M2 14c0-3 2.686-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        }
      />
      <InfoRow
        label="Teléfono de emergencia"
        value={patient.emergency_contact_phone}
        icon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h3l1.5 3.5-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5L14 10v3a1 1 0 0 1-1 1C6.373 14 2 9.627 2 4a1 1 0 0 1 1-1v0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
    </div>
  )
}
