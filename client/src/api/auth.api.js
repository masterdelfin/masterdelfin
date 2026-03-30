import apiClient from './client'

export const login = (email, password) =>
  apiClient.post('/auth/login', { email, password })

export const register = (data) =>
  apiClient.post('/auth/register', data)
