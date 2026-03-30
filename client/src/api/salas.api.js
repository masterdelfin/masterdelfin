import apiClient from './client'

export const list = () =>
  apiClient.get('/salas')

export const create = (data) =>
  apiClient.post('/salas', data)

export const getOne = (id) =>
  apiClient.get(`/salas/${id}`)

export const update = (id, data) =>
  apiClient.put(`/salas/${id}`, data)

export const remove = (id) =>
  apiClient.delete(`/salas/${id}`)
