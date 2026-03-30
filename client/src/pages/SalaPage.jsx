import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import TopBar from '../components/layout/TopBar'
import PatientHeader from '../components/patients/PatientHeader'
import PatientDemographics from '../components/patients/PatientDemographics'
import MedicalHistoryPanel from '../components/patients/MedicalHistoryPanel'
import AllergiesPanel from '../components/patients/AllergiesPanel'
import ConsultationTimeline from '../components/consultations/ConsultationTimeline'
import ConsultationForm from '../components/consultations/ConsultationForm'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Spinner from '../components/common/Spinner'
import ErrorMessage from '../components/common/ErrorMessage'
import * as salasApi from '../api/salas.api'
import * as consultationsApi from '../api/consultations.api'

const TABS = [
  { id: 'info', label: 'Info Personal' },
  { id: 'history', label: 'Historia Médica' },
  { id: 'allergies', label: 'Alergias' },
  { id: 'medications', label: 'Medicamentos' },
]

export default function SalaPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [sala, setSala] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [loadingSala, setLoadingSala] = useState(true)
  const [loadingConsultations, setLoadingConsultations] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('info')
  const [showForm, setShowForm] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)

  const fetchSala = useCallback(async () => {
    setLoadingSala(true)
    try {
      const res = await salasApi.getOne(id)
      setSala(res.data?.data || res.data)
    } catch {
      setError('No se pudo cargar la sala. Verifica que exista.')
    } finally {
      setLoadingSala(false)
    }
  }, [id])

  const fetchConsultations = useCallback(async () => {
    setLoadingConsultations(true)
    try {
      const res = await consultationsApi.list(id)
      setConsultations(res.data?.data || res.data || [])
    } catch {
      setConsultations([])
    } finally {
      setLoadingConsultations(false)
    }
  }, [id])

  useEffect(() => {
    fetchSala()
    fetchConsultations()
  }, [fetchSala, fetchConsultations])

  const handleSaved = (savedConsultation) => {
    setConsultations(prev => {
      const exists = prev.find(c => c.id === savedConsultation.id)
      if (exists) {
        return prev.map(c => c.id === savedConsultation.id ? savedConsultation : c)
      }
      return [savedConsultation, ...prev]
    })
    setEditingConsultation(null)
  }

  const handleEdit = (consultation) => {
    setEditingConsultation(consultation)
    setShowForm(true)
  }

  const handleDelete = async (consultation) => {
    if (!window.confirm(`¿Eliminar la consulta del ${new Date(consultation.visit_date).toLocaleDateString('es-ES')}?`)) return
    try {
      await consultationsApi.remove(id, consultation.id)
      setConsultations(prev => prev.filter(c => c.id !== consultation.id))
    } catch {
      setError('Error al eliminar la consulta.')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingConsultation(null)
  }

  const patient = sala?.patient
  const medications = patient?.current_medications || []

  if (loadingSala) {
    return (
      <AppShell>
        <TopBar title="Cargando..." breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Sala' }]} />
        <main className="sala-loading">
          <Spinner size="lg" />
          <p>Cargando sala...</p>
        </main>
      </AppShell>
    )
  }

  if (!sala) {
    return (
      <AppShell>
        <TopBar title="Sala no encontrada" breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]} />
        <main className="sala-error">
          <ErrorMessage message={error || 'Sala no encontrada.'} />
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Volver al Dashboard</Button>
        </main>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <TopBar
        title={sala.name}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: sala.name }
        ]}
      />
      <main className="sala-main">
        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <div className="sala-layout">
          {/* LEFT PANEL - Patient info */}
          <aside className="sala-patient-panel" style={{ '--sala-color': sala.color || 'var(--color-primary)' }}>
            <div className="sala-patient-panel-top" style={{ borderTopColor: sala.color || 'var(--color-primary)' }}>
              <PatientHeader patient={patient} />
              {patient && (
                <Link
                  to={`/patients/${patient.id}/edit`}
                  className="patient-edit-link"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Editar paciente
                </Link>
              )}
            </div>

            <div className="sala-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`sala-tab ${activeTab === tab.id ? 'sala-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="sala-tab-content">
              {activeTab === 'info' && <PatientDemographics patient={patient} />}
              {activeTab === 'history' && <MedicalHistoryPanel patient={patient} />}
              {activeTab === 'allergies' && <AllergiesPanel patient={patient} />}
              {activeTab === 'medications' && (
                <div className="medications-panel">
                  {medications.length === 0 ? (
                    <div className="empty-panel">
                      <p>Sin medicamentos registrados.</p>
                    </div>
                  ) : (
                    <ul className="medications-list">
                      {medications.map((med, i) => (
                        <li key={i} className="medication-item">
                          <span className="med-name">{med.name}</span>
                          {med.dose && <span className="med-detail">{med.dose}</span>}
                          {med.frequency && <span className="med-detail">{med.frequency}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL - Consultations */}
          <section className="sala-consultations-panel">
            <div className="consultations-panel-header">
              <div>
                <h2 className="consultations-panel-title">Historial de Consultas</h2>
                <p className="consultations-panel-count">
                  {consultations.length} consulta{consultations.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => { setEditingConsultation(null); setShowForm(true) }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Nueva Consulta
              </Button>
            </div>

            <ConsultationTimeline
              consultations={consultations}
              loading={loadingConsultations}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>

      <ConsultationForm
        isOpen={showForm}
        onClose={handleCloseForm}
        salaId={id}
        consultation={editingConsultation}
        onSaved={handleSaved}
      />
    </AppShell>
  )
}
