import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import useAuth from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SalaPage from './pages/SalaPage'
import PatientFormPage from './pages/PatientFormPage'
import ProfilePage from './pages/ProfilePage'
import Spinner from './components/common/Spinner'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="app-loading">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="app-loading">
        <Spinner size="lg" />
      </div>
    )
  }
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="app-loading">
        <Spinner size="lg" />
      </div>
    )
  }
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/salas/:id" element={<ProtectedRoute><SalaPage /></ProtectedRoute>} />
      <Route path="/patients/new" element={<ProtectedRoute><PatientFormPage /></ProtectedRoute>} />
      <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientFormPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
