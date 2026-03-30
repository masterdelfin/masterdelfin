import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Input from '../common/Input'
import ErrorMessage from '../common/ErrorMessage'
import * as patientsApi from '../../api/patients.api'
import * as salasApi from '../../api/salas.api'

const PRESET_COLORS = [
  '#1A73E8', // blue
  '#2E7D32', // green
  '#F57C00', // orange
  '#C62828', // red
  '#6A1B9A', // purple
  '#00838F', // teal
]

export default function CreateSalaModal({ isOpen, onClose, onCreated }) {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [salaName, setSalaName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingPatients, setLoadingPatients] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadPatients('')
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(() => loadPatients(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadPatients = async (search) => {
    setLoadingPatients(true)
    try {
      const res = await patientsApi.list(search)
      setPatients(res.data?.data || res.data || [])
    } catch {
      setPatients([])
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
    const name = `${patient.first_name} ${patient.last_name}`
    setSalaName(name)
    setSearchTerm(name)
    setPatients([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPatient) {
      setError('Por favor selecciona un paciente.')
      return
    }
    if (!salaName.trim()) {
      setError('El nombre de la sala es requerido.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await salasApi.create({
        patient_id: selectedPatient.id,
        name: salaName.trim(),
        color
      })
      const sala = res.data?.data || res.data
      onCreated && onCreated(sala)
      handleClose()
      navigate(`/salas/${sala.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la sala.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedPatient(null)
    setSearchTerm('')
    setSalaName('')
    setColor(PRESET_COLORS[0])
    setError('')
    setPatients([])
    onClose()
  }

  const filteredPatients = selectedPatient ? [] : patients

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Sala" size="sm">
      <form onSubmit={handleSubmit} className="create-sala-form">
        <ErrorMessage message={error} onDismiss={() => setError('')} />

        <div className="form-field">
          <label className="form-label">
            Paciente <span className="form-required"> *</span>
          </label>
          <div className="patient-search-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="Buscar paciente por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (selectedPatient) setSelectedPatient(null)
              }}
              autoComplete="off"
            />
            {loadingPatients && <span className="patient-search-loading">Buscando...</span>}
            {filteredPatients.length > 0 && (
              <ul className="patient-dropdown">
                {filteredPatients.map(p => (
                  <li
                    key={p.id}
                    className="patient-dropdown-item"
                    onClick={() => handleSelectPatient(p)}
                    role="option"
                  >
                    <span className="patient-dropdown-name">{p.first_name} {p.last_name}</span>
                    {p.date_of_birth && (
                      <span className="patient-dropdown-sub">
                        {new Date(p.date_of_birth).toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedPatient && (
            <div className="selected-patient">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="var(--color-success)" strokeWidth="1.5"/>
                <path d="M4.5 7l2 2 3-3" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{selectedPatient.first_name} {selectedPatient.last_name}</span>
              <button type="button" className="selected-patient-clear" onClick={() => { setSelectedPatient(null); setSearchTerm('') }}>
                ×
              </button>
            </div>
          )}
          <div className="patient-search-hint">
            ¿No existe el paciente?{' '}
            <a href="/patients/new" onClick={(e) => { e.preventDefault(); handleClose(); navigate('/patients/new') }}>
              Crear nuevo paciente
            </a>
          </div>
        </div>

        <Input
          label="Nombre de la sala"
          required
          value={salaName}
          onChange={(e) => setSalaName(e.target.value)}
          placeholder="Nombre de la sala"
        />

        <div className="form-field">
          <label className="form-label">Color de la sala</label>
          <div className="color-picker">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`color-swatch ${color === c ? 'color-swatch--selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <Button variant="secondary" onClick={handleClose} type="button">Cancelar</Button>
          <Button variant="primary" type="submit" loading={loading}>Crear Sala</Button>
        </div>
      </form>
    </Modal>
  )
}
