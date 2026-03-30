import React from 'react'
import { useNavigate } from 'react-router-dom'

function formatDate(dateStr) {
  if (!dateStr) return 'Sin consultas'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SalaCard({ sala }) {
  const navigate = useNavigate()
  const patient = sala.patient

  const fullName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : 'Paciente desconocido'

  const accentColor = sala.color || '#1A73E8'

  return (
    <div
      className="sala-card"
      style={{ '--sala-accent': accentColor }}
      onClick={() => navigate(`/salas/${sala.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/salas/${sala.id}`)}
    >
      <div className="sala-card-accent" style={{ backgroundColor: accentColor }} />
      <div className="sala-card-body">
        <h3 className="sala-card-name">{sala.name}</h3>
        <p className="sala-card-patient">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1.5 13c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {fullName}
        </p>
        <p className="sala-card-date">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5 1v2M9 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {sala.last_consultation_date
            ? `Última: ${formatDate(sala.last_consultation_date)}`
            : 'Sin consultas'}
        </p>
      </div>
      <div className="sala-card-arrow">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}
