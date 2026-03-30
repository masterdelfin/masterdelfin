import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [doctor, setDoctor] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedDoctor = localStorage.getItem('doctor')
    if (storedToken && storedDoctor) {
      try {
        setToken(storedToken)
        setDoctor(JSON.parse(storedDoctor))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('doctor')
      }
    }
    setLoading(false)
  }, [])

  const login = (newToken, newDoctor) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('doctor', JSON.stringify(newDoctor))
    setToken(newToken)
    setDoctor(newDoctor)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('doctor')
    setToken(null)
    setDoctor(null)
  }

  const isAuthenticated = !!token && !!doctor

  return (
    <AuthContext.Provider value={{ doctor, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
