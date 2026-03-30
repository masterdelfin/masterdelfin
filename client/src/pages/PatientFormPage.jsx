import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import TopBar from '../components/layout/TopBar'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import ErrorMessage from '../components/common/ErrorMessage'
import Spinner from '../components/common/Spinner'
import * as patientsApi from '../api/patients.api'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const SEVERITIES = ['Leve', 'Moderada', 'Grave']

const EMPTY_ALLERGY = { name: '', severity: 'Leve' }
const EMPTY_MED = { name: '', dose: '', frequency: '' }

const DEFAULT_FORM = {
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  blood_type: '',
  email: '',
  phone: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  notes: '',
  allergies: [],
  current_medications: [],
}

export default function PatientFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(isEditing)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('personal')

  useEffect(() => {
    if (!isEditing) return
    const fetchPatient = async () => {
      try {
        const res = await patientsApi.getOne(id)
        const patient = res.data?.data || res.data
        setForm({
          first_name: patient.first_name || '',
          last_name: patient.last_name || '',
          date_of_birth: patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '',
          gender: patient.gender || '',
          blood_type: patient.blood_type || '',
          email: patient.email || '',
          phone: patient.phone || '',
          address: patient.address || '',
          emergency_contact_name: patient.emergency_contact_name || '',
          emergency_contact_phone: patient.emergency_contact_phone || '',
          notes: patient.notes || '',
          allergies: patient.allergies?.length ? patient.allergies : [],
          current_medications: patient.current_medications?.length ? patient.current_medications : [],
        })
      } catch {
        setError('Error al cargar los datos del paciente.')
      } finally {
        setLoadingData(false)
      }
    }
    fetchPatient()
  }, [id, isEditing])

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  // Allergies
  const addAllergy = () => setForm(prev => ({ ...prev, allergies: [...prev.allergies, { ...EMPTY_ALLERGY }] }))
  const removeAllergy = (i) => setForm(prev => ({ ...prev, allergies: prev.allergies.filter((_, idx) => idx !== i) }))
  const updateAllergy = (i, field, value) => {
    setForm(prev => {
      const allergies = [...prev.allergies]
      allergies[i] = { ...allergies[i], [field]: value }
      return { ...prev, allergies }
    })
  }

  // Medications
  const addMed = () => setForm(prev => ({ ...prev, current_medications: [...prev.current_medications, { ...EMPTY_MED }] }))
  const removeMed = (i) => setForm(prev => ({ ...prev, current_medications: prev.current_medications.filter((_, idx) => idx !== i) }))
  const updateMed = (i, field, value) => {
    setForm(prev => {
      const meds = [...prev.current_medications]
      meds[i] = { ...meds[i], [field]: value }
      return { ...prev, current_medications: meds }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('El nombre y apellido son requeridos.')
      setActiveSection('personal')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        allergies: form.allergies.filter(a => a.name.trim()),
        current_medications: form.current_medications.filter(m => m.name.trim()),
      }
      if (isEditing) {
        await patientsApi.update(id, payload)
      } else {
        await patientsApi.create(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el paciente.')
    } finally {
      setLoading(false)
    }
  }

  const SECTIONS = [
    { id: 'personal', label: 'Personal' },
    { id: 'contact', label: 'Contacto' },
    { id: 'emergency', label: 'Emergencia' },
    { id: 'medical', label: 'Médico' },
    { id: 'allergies', label: 'Alergias' },
    { id: 'medications', label: 'Medicamentos' },
  ]

  const breadcrumbs = isEditing
    ? [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Editar Paciente' }]
    : [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Nuevo Paciente' }]

  if (loadingData) {
    return (
      <AppShell>
        <TopBar title={isEditing ? 'Editar Paciente' : 'Nuevo Paciente'} breadcrumbs={breadcrumbs} />
        <main className="patient-form-loading">
          <Spinner size="lg" />
          <p>Cargando datos del paciente...</p>
        </main>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <TopBar
        title={isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
        breadcrumbs={breadcrumbs}
      />
      <main className="patient-form-main">
        <form onSubmit={handleSubmit} className="patient-form">
          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <div className="patient-form-layout">
            {/* Section Nav */}
            <nav className="patient-form-nav">
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`patient-form-nav-btn ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>

            {/* Form Content */}
            <div className="patient-form-content">
              {activeSection === 'personal' && (
                <div className="form-section">
                  <h3 className="form-section-title">Información Personal</h3>
                  <div className="form-row">
                    <Input label="Nombre" required value={form.first_name} onChange={set('first_name')} placeholder="Juan" />
                    <Input label="Apellido" required value={form.last_name} onChange={set('last_name')} placeholder="García" />
                  </div>
                  <div className="form-row">
                    <Input label="Fecha de nacimiento" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} />
                    <div className="form-field">
                      <label className="form-label">Género</label>
                      <select className="form-input form-select" value={form.gender} onChange={set('gender')}>
                        <option value="">Seleccionar</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Tipo de sangre</label>
                    <select className="form-input form-select" value={form.blood_type} onChange={set('blood_type')}>
                      <option value="">Seleccionar</option>
                      {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="form-section">
                  <h3 className="form-section-title">Información de Contacto</h3>
                  <Input label="Correo electrónico" type="email" value={form.email} onChange={set('email')} placeholder="paciente@email.com" />
                  <Input label="Teléfono" type="tel" value={form.phone} onChange={set('phone')} placeholder="+51 999 999 999" />
                  <Input label="Dirección" value={form.address} onChange={set('address')} placeholder="Av. Principal 123, Lima" />
                </div>
              )}

              {activeSection === 'emergency' && (
                <div className="form-section">
                  <h3 className="form-section-title">Contacto de Emergencia</h3>
                  <Input
                    label="Nombre del contacto"
                    value={form.emergency_contact_name}
                    onChange={set('emergency_contact_name')}
                    placeholder="María García"
                  />
                  <Input
                    label="Teléfono del contacto"
                    type="tel"
                    value={form.emergency_contact_phone}
                    onChange={set('emergency_contact_phone')}
                    placeholder="+51 999 999 999"
                  />
                </div>
              )}

              {activeSection === 'medical' && (
                <div className="form-section">
                  <h3 className="form-section-title">Notas Médicas</h3>
                  <div className="form-field">
                    <label className="form-label">Notas / Observaciones</label>
                    <textarea
                      className="form-input form-textarea form-textarea--tall"
                      value={form.notes}
                      onChange={set('notes')}
                      placeholder="Antecedentes, observaciones generales, condiciones crónicas..."
                      rows={8}
                    />
                  </div>
                </div>
              )}

              {activeSection === 'allergies' && (
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Alergias</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addAllergy}>
                      + Agregar alergia
                    </Button>
                  </div>
                  {form.allergies.length === 0 && (
                    <p className="form-empty-hint">Sin alergias registradas. Haz clic en "Agregar alergia".</p>
                  )}
                  {form.allergies.map((a, i) => (
                    <div key={i} className="dynamic-item">
                      <input
                        className="form-input"
                        placeholder="Nombre del alérgeno (ej: Penicilina)"
                        value={a.name}
                        onChange={(e) => updateAllergy(i, 'name', e.target.value)}
                      />
                      <select
                        className="form-input form-select dynamic-select"
                        value={a.severity}
                        onChange={(e) => updateAllergy(i, 'severity', e.target.value)}
                      >
                        {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm dynamic-remove"
                        onClick={() => removeAllergy(i)}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'medications' && (
                <div className="form-section">
                  <div className="form-section-header">
                    <h3 className="form-section-title">Medicamentos actuales</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addMed}>
                      + Agregar medicamento
                    </Button>
                  </div>
                  {form.current_medications.length === 0 && (
                    <p className="form-empty-hint">Sin medicamentos actuales. Haz clic en "Agregar medicamento".</p>
                  )}
                  {form.current_medications.map((m, i) => (
                    <div key={i} className="dynamic-item dynamic-item--3">
                      <input
                        className="form-input"
                        placeholder="Medicamento"
                        value={m.name}
                        onChange={(e) => updateMed(i, 'name', e.target.value)}
                      />
                      <input
                        className="form-input"
                        placeholder="Dosis"
                        value={m.dose}
                        onChange={(e) => updateMed(i, 'dose', e.target.value)}
                      />
                      <input
                        className="form-input"
                        placeholder="Frecuencia"
                        value={m.frequency}
                        onChange={(e) => updateMed(i, 'frequency', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm dynamic-remove"
                        onClick={() => removeMed(i)}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="patient-form-actions">
                <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                  {isEditing ? 'Guardar cambios' : 'Crear paciente'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </AppShell>
  )
}
