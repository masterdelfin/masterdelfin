import React, { useState } from 'react'
import Badge from '../common/Badge'
import Button from '../common/Button'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ConsultationCard({ consultation, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const prescriptions = consultation.prescriptions || []

  return (
    <div className={`consultation-card ${consultation.is_draft ? 'consultation-card--draft' : ''}`}>
      <div className="consultation-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="consultation-card-meta">
          <span className="consultation-date">{formatDate(consultation.visit_date)}</span>
          <div className="consultation-badges">
            {consultation.is_draft && <Badge variant="draft">Borrador</Badge>}
            {prescriptions.length > 0 && (
              <Badge variant="primary">
                {prescriptions.length} receta{prescriptions.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <button className={`consultation-expand-btn ${expanded ? 'expanded' : ''}`} aria-label="Expandir">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {consultation.chief_complaint && (
        <div className="consultation-complaint">
          <strong>Motivo:</strong> {consultation.chief_complaint}
        </div>
      )}

      {!expanded && consultation.assessment && (
        <div className="consultation-preview">
          <strong>Diagnóstico:</strong> {consultation.assessment.substring(0, 120)}{consultation.assessment.length > 120 ? '...' : ''}
        </div>
      )}

      {expanded && (
        <div className="consultation-details">
          {consultation.subjective && (
            <div className="soap-section">
              <h5 className="soap-label">S — Subjetivo</h5>
              <p className="soap-content">{consultation.subjective}</p>
            </div>
          )}
          {consultation.objective && (
            <div className="soap-section">
              <h5 className="soap-label">O — Objetivo</h5>
              <p className="soap-content">{consultation.objective}</p>
            </div>
          )}
          {consultation.assessment && (
            <div className="soap-section">
              <h5 className="soap-label">A — Evaluación / Diagnóstico</h5>
              <p className="soap-content">{consultation.assessment}</p>
            </div>
          )}
          {consultation.plan && (
            <div className="soap-section">
              <h5 className="soap-label">P — Plan de tratamiento</h5>
              <p className="soap-content">{consultation.plan}</p>
            </div>
          )}

          {prescriptions.length > 0 && (
            <div className="consultation-prescriptions">
              <h5 className="soap-label">Recetas</h5>
              <ul className="prescriptions-list">
                {prescriptions.map((rx, i) => (
                  <li key={i} className="prescription-item">
                    <span className="rx-drug">{rx.drug_name || rx.name}</span>
                    {rx.dose && <span className="rx-detail">{rx.dose}</span>}
                    {rx.frequency && <span className="rx-detail">{rx.frequency}</span>}
                    {rx.duration && <span className="rx-detail">{rx.duration}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {consultation.follow_up_date && (
            <div className="consultation-followup">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M4 1v2M10 1v2M1 5.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>Seguimiento: {formatDateShort(consultation.follow_up_date)}</span>
            </div>
          )}
        </div>
      )}

      <div className="consultation-card-actions">
        <Button variant="ghost" size="sm" onClick={() => onEdit(consultation)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(consultation)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Eliminar
        </Button>
      </div>
    </div>
  )
}
