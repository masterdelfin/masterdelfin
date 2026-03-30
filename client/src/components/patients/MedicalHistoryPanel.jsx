import React from 'react'

export default function MedicalHistoryPanel({ patient }) {
  if (!patient) return null

  const history = patient.medical_history || []
  const notes = patient.notes || ''

  return (
    <div className="medical-history-panel">
      {notes && (
        <div className="medical-section">
          <h4 className="medical-section-title">Notas del médico</h4>
          <p className="medical-notes">{notes}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="medical-section">
          <h4 className="medical-section-title">Historia médica</h4>
          <ul className="medical-history-list">
            {history.map((item, i) => (
              <li key={i} className="medical-history-item">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="medical-history-dot">
                  <circle cx="6" cy="6" r="4" fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth="1.5"/>
                </svg>
                <span>{typeof item === 'string' ? item : item.description || JSON.stringify(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!notes && history.length === 0 && (
        <div className="empty-panel">
          <p>Sin historia médica registrada.</p>
        </div>
      )}
    </div>
  )
}
