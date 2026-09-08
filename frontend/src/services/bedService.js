import api from './api';

export const bedService = {
  getBeds: (params) => api.get('/beds', { params }),
  upsertBed: (data) => api.post('/beds', data),
  deleteBed: (id) => api.delete(`/beds/${id}`)
};
