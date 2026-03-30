import React, { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import ErrorMessage from '../common/ErrorMessage'
import * as consultationsApi from '../../api/consultations.api'

function toLocalDatetimeValue(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY_PRESCRIPTION = { drug_name: '', dose: '', frequency: '', duration: '' }

export default function ConsultationForm({ isOpen, onClose, salaId, consultation, onSaved }) {
  const isEditing = !!consultation

  const [form, setForm] = useState({
    visit_date: toLocalDatetimeValue(),
    chief_complaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    follow_up_date: '',
    is_draft: false,
    prescriptions: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (consultation) {
        setForm({
          visit_date: toLocalDatetimeValue(consultation.visit_date),
          chief_complaint: consultation.chief_complaint || '',
          subjective: consultation.subjective || '',
          objective: consultation.objective || '',
          assessment: consultation.assessment || '',
          plan: consultation.plan || '',
          follow_up_date: consultation.follow_up_date ? toLocalDatetimeValue(consultation.follow_up_date).split('T')[0] : '',
          is_draft: consultation.is_draft || false,
          prescriptions: consultation.prescriptions?.length > 0
            ? consultation.prescriptions.map(rx => ({
                drug_name: rx.drug_name || rx.name || '',
                dose: rx.dose || '',
                frequency: rx.frequency || '',
                duration: rx.duration || ''
              }))
            : [],
        })
      } else {
        setForm({
          visit_date: toLocalDatetimeValue(),
          chief_complaint: '',
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
          follow_up_date: '',
          is_draft: false,
          prescriptions: [],
        })
      }
      setError('')
    }
  }, [isOpen, consultation])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const addPrescription = () => {
    setForm(prev => ({ ...prev, prescriptions: [...prev.prescriptions, { ...EMPTY_PRESCRIPTION }] }))
  }

  const removePrescription = (index) => {
    setForm(prev => ({ ...prev, prescriptions: prev.prescriptions.filter((_, i) => i !== index) }))
  }

  const updatePrescription = (index, field, value) => {
    setForm(prev => {
      const prescriptions = [...prev.prescriptions]
      prescriptions[index] = { ...prescriptions[index], [field]: value }
      return { ...prev, prescriptions }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.chief_complaint.trim()) {
      setError('El motivo de consulta es requerido.')
      return
    }
    setError('')
    setLoading(true)

    const payload = {
      ...form,
      visit_date: new Date(form.visit_date).toISOString(),
      follow_up_date: form.follow_up_date ? new Date(form.follow_up_date).toISOString() : null,
      prescriptions: form.prescriptions.filter(rx => rx.drug_name.trim()),
    }

    try {
      let res
      if (isEditing) {
        res = await consultationsApi.update(salaId, consultation.id, payload)
      } else {
        res = await consultationsApi.create(salaId, payload)
      }
      onSaved(res.data?.data || res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la consulta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Consulta' : 'Nueva Consulta'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="consultation-form">
        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <div className="form-row">
          <Input
            label="Fecha y hora de la visita"
            type="datetime-local"
            required
            value={form.visit_date}
            onChange={set('visit_date')}
          />
          <Input
            label="Seguimiento"
            type="date"
            value={form.follow_up_date}
            onChange={set('follow_up_date')}
          />
        </div>

        <Input
          label="Motivo de consulta"
          required
          value={form.chief_complaint}
          onChange={set('chief_complaint')}
          placeholder="¿Por qué viene el paciente hoy?"
        />

        <div className="soap-grid">
          <div className="soap-field">
            <label className="form-label soap-label-tag soap-s">
              S — Subjetivo
              <span className="soap-hint">Síntomas reportados por el paciente</span>
            </label>
            <textarea
              className="form-input form-textarea"
              value={form.subjective}
              onChange={set('subjective')}
              placeholder="El paciente refiere..."
              rows={4}
            />
          </div>
          <div className="soap-field">
            <label className="form-label soap-label-tag soap-o">
              O — Objetivo
              <span className="soap-hint">Hallazgos del examen, signos vitales</span>
            </label>
            <textarea
              className="form-input form-textarea"
              value={form.objective}
              onChange={set('objective')}
              placeholder="Signos vitales, exploración física..."
              rows={4}
            />
          </div>
          <div className="soap-field">
            <label className="form-label soap-label-tag soap-a">
              A — Evaluación / Diagnóstico
            </label>
            <textarea
              className="form-input form-textarea"
              value={form.assessment}
              onChange={set('assessment')}
              placeholder="Impresión diagnóstica..."
              rows={4}
            />
          </div>
          <div className="soap-field">
            <label className="form-label soap-label-tag soap-p">
              P — Plan de tratamiento
            </label>
            <textarea
              className="form-input form-textarea"
              value={form.plan}
              onChange={set('plan')}
              placeholder="Indicaciones, tratamiento, próximos pasos..."
              rows={4}
            />
          </div>
        </div>

        <div className="prescriptions-section">
          <div className="prescriptions-header">
            <h4 className="prescriptions-title">Recetas</h4>
            <Button type="button" variant="secondary" size="sm" onClick={addPrescription}>
              + Agregar medicamento
            </Button>
          </div>
          {form.prescriptions.length === 0 && (
            <p className="prescriptions-empty">Sin recetas aún.</p>
          )}
          {form.prescriptions.map((rx, i) => (
            <div key={i} className="prescription-row">
              <input
                className="form-input"
                placeholder="Medicamento"
                value={rx.drug_name}
                onChange={(e) => updatePrescription(i, 'drug_name', e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Dosis"
                value={rx.dose}
                onChange={(e) => updatePrescription(i, 'dose', e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Frecuencia"
                value={rx.frequency}
                onChange={(e) => updatePrescription(i, 'frequency', e.target.value)}
              />
              <input
                className="form-input"
                placeholder="Duración"
                value={rx.duration}
                onChange={(e) => updatePrescription(i, 'duration', e.target.value)}
              />
              <button
                type="button"
                className="btn btn--ghost btn--sm prescription-remove"
                onClick={() => removePrescription(i)}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5 3.5V2h4v1.5M5.5 6v4.5M8.5 6v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="form-checkbox-row">
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={form.is_draft}
              onChange={set('is_draft')}
            />
            <span>Guardar como borrador</span>
          </label>
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
          <Button variant="primary" type="submit" loading={loading}>
            {isEditing ? 'Guardar cambios' : 'Guardar consulta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
