import api from './api';

export const facilityService = {
  getFacilities: (params) => api.get('/facilities', { params }),
  getFacilityById: (id) => api.get(`/facilities/${id}`),
  createFacility: (data) => api.post('/facilities', data),
  updateFacility: (id, data) => api.put(`/facilities/${id}`, data),
  deleteFacility: (id) => api.delete(`/facilities/${id}`)
};