import apiClient from './client'

export const list = (search = '') =>
  apiClient.get('/patients', { params: search ? { search } : {} })

export const create = (data) =>
  apiClient.post('/patients', data)

export const getOne = (id) =>
  apiClient.get(`/patients/${id}`)

export const update = (id, data) =>
  apiClient.put(`/patients/${id}`, data)

export const remove = (id) =>
  apiClient.delete(`/patients/${id}`)
