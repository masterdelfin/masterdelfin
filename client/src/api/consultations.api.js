import apiClient from './client'

export const list = (salaId) =>
  apiClient.get(`/salas/${salaId}/consultations`)

export const create = (salaId, data) =>
  apiClient.post(`/salas/${salaId}/consultations`, data)

export const getOne = (salaId, id) =>
  apiClient.get(`/salas/${salaId}/consultations/${id}`)

export const update = (salaId, id, data) =>
  apiClient.put(`/salas/${salaId}/consultations/${id}`, data)

export const remove = (salaId, id) =>
  apiClient.delete(`/salas/${salaId}/consultations/${id}`)
