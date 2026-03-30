import React from 'react'
import Badge from '../common/Badge'

const SEVERITY_VARIANTS = {
  mild: 'warning',
  moderate: 'warning',
  severe: 'danger',
  leve: 'warning',
  moderada: 'warning',
  grave: 'danger',
  alta: 'danger',
  media: 'warning',
  baja: 'neutral',
}

const SEVERITY_LABELS = {
  mild: 'Leve',
  moderate: 'Moderada',
  severe: 'Grave',
  leve: 'Leve',
  moderada: 'Moderada',
  grave: 'Grave',
}

export default function AllergiesPanel({ patient }) {
  if (!patient) return null

  const allergies = patient.allergies || []

  if (allergies.length === 0) {
    return (
      <div className="allergies-panel">
        <div className="empty-panel">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="var(--color-border)" strokeWidth="1.5"/>
            <path d="M12 20s1.5-2 4-2 4 2 4 2M12 13h.01M20 13h.01" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>Sin alergias registradas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="allergies-panel">
      <ul className="allergies-list">
        {allergies.map((allergy, i) => {
          const name = typeof allergy === 'string' ? allergy : allergy.name || allergy.allergen
          const severity = typeof allergy === 'object' ? allergy.severity : null
          const severityVariant = SEVERITY_VARIANTS[severity?.toLowerCase()] || 'neutral'
          const severityLabel = SEVERITY_LABELS[severity?.toLowerCase()] || severity

          return (
            <li key={i} className="allergy-item">
              <span className="allergy-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1l1.5 4.5H13L9.5 8.5l1.5 4.5L7 10.5 3 13l1.5-4.5L1 5.5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="allergy-name">{name}</span>
              {severityLabel && (
                <Badge variant={severityVariant}>{severityLabel}</Badge>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
