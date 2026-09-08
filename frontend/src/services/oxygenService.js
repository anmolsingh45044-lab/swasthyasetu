import api from './api';

export const oxygenService = {
  getOxygen: (params) => api.get('/oxygen', { params }),
  upsertOxygen: (data) => api.post('/oxygen', data),
  deleteOxygen: (id) => api.delete(`/oxygen/${id}`)
};
