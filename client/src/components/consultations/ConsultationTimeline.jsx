import React from 'react'
import ConsultationCard from './ConsultationCard'
import Spinner from '../common/Spinner'

export default function ConsultationTimeline({ consultations, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="consultation-timeline">
        <div className="timeline-loading">
          <Spinner size="lg" />
          <p>Cargando consultas...</p>
        </div>
      </div>
    )
  }

  if (!consultations || consultations.length === 0) {
    return (
      <div className="consultation-timeline">
        <div className="timeline-empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="8" width="40" height="36" rx="4" stroke="var(--color-border)" strokeWidth="2"/>
            <path d="M16 4v8M32 4v8M4 20h40" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 30h16M20 36h8" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h4>Sin consultas registradas</h4>
          <p>Crea la primera consulta con el botón "Nueva Consulta".</p>
        </div>
      </div>
    )
  }

  const sorted = [...consultations].sort((a, b) =>
    new Date(b.visit_date) - new Date(a.visit_date)
  )

  return (
    <div className="consultation-timeline">
      <div className="timeline-list">
        {sorted.map((consultation) => (
          <div key={consultation.id} className="timeline-item">
            <div className="timeline-line" />
            <ConsultationCard
              consultation={consultation}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
