import api from './api';

export const bloodService = {
  getInventory: (params) => api.get('/blood', { params }),
  upsertInventory: (data) => api.post('/blood', data),
  deleteInventory: (id) => api.delete(`/blood/${id}`),

  getRequests: (params) => api.get('/blood-requests', { params }),
  createRequest: (data) => api.post('/blood-requests', data),
  createPublicRequest: (data) => api.post('/blood-requests/public', data),
  getRequestById: (requestId) => api.get(`/blood-requests/track/${requestId}`),
  acceptRequest: (id) => api.put(`/blood-requests/${id}/accept`),
  updateRequestStatus: (id, status) => api.put(`/blood-requests/${id}/status`, { status })
};
