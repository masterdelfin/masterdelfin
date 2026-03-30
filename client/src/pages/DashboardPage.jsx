import React, { useState, useEffect, useCallback } from 'react'
import AppShell from '../components/layout/AppShell'
import TopBar from '../components/layout/TopBar'
import SalaCard from '../components/salas/SalaCard'
import CreateSalaModal from '../components/salas/CreateSalaModal'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import ErrorMessage from '../components/common/ErrorMessage'
import * as salasApi from '../api/salas.api'

export default function DashboardPage() {
  const [salas, setSalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSalas = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await salasApi.list()
      setSalas(res.data?.data || res.data || [])
    } catch {
      setError('Error al cargar las salas. Por favor recarga la página.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSalas()
  }, [fetchSalas])

  const filtered = salas.filter(s => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const patientName = s.patient
      ? `${s.patient.first_name} ${s.patient.last_name}`.toLowerCase()
      : ''
    return (
      s.name.toLowerCase().includes(term) ||
      patientName.includes(term)
    )
  })

  const handleCreated = (newSala) => {
    setSalas(prev => [newSala, ...prev])
  }

  return (
    <AppShell>
      <TopBar
        title="Dashboard"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />
      <main className="dashboard-main">
        <div className="dashboard-toolbar">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar sala o paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nueva Sala
          </Button>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError('')} />

        {loading ? (
          <div className="dashboard-loading">
            <Spinner size="lg" />
            <p>Cargando salas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dashboard-empty">
            {searchTerm ? (
              <>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="26" cy="26" r="18" stroke="var(--color-border)" strokeWidth="2"/>
                  <path d="M39 39l10 10" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 32s2-4 6-4 6 4 6 4M22 21h.01M30 21h.01" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3>Sin resultados</h3>
                <p>No se encontraron salas para "{searchTerm}".</p>
                <Button variant="secondary" onClick={() => setSearchTerm('')}>Limpiar búsqueda</Button>
              </>
            ) : (
              <>
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect x="4" y="4" width="48" height="48" rx="8" stroke="var(--color-border)" strokeWidth="2"/>
                  <rect x="12" y="12" width="14" height="14" rx="3" stroke="var(--color-border)" strokeWidth="1.5"/>
                  <rect x="30" y="12" width="14" height="14" rx="3" stroke="var(--color-border)" strokeWidth="1.5"/>
                  <rect x="12" y="30" width="14" height="14" rx="3" stroke="var(--color-border)" strokeWidth="1.5"/>
                  <rect x="30" y="30" width="14" height="14" rx="3" stroke="var(--color-border)" strokeWidth="1.5"/>
                </svg>
                <h3>No hay salas creadas</h3>
                <p>Crea tu primera sala para comenzar a registrar consultas.</p>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Crear primera sala
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="salas-grid">
            {filtered.map(sala => (
              <SalaCard key={sala.id} sala={sala} />
            ))}
          </div>
        )}
      </main>

      <CreateSalaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />
    </AppShell>
  )
}
