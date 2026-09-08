import api from './api';

export const requestService = {
  getResourceRequests: (params) => api.get('/deliveries/requests', { params }),
  createResourceRequest: (data) => api.post('/deliveries/requests', data),
  createPublicResourceRequest: (data) => api.post('/deliveries/requests/public', data),
  getResourceRequestById: (requestId) => api.get(`/deliveries/requests/track/${requestId}`),
  updateResourceRequestStatus: (id, status) => api.put(`/deliveries/requests/${id}/status`, { status }),

  getRequestById: (requestId) =>
    api
      .get(`/blood-requests/track/${requestId}`)
      .catch(() => api.get(`/deliveries/requests/track/${requestId}`)),

  getDonations: () => api.get('/donations/mine'),
  createDonation: (data) => api.post('/donations', data),
  updateDonationStatus: (id, status) => api.put(`/donations/${id}/status`, { status }),

  getUsers: (params) => api.get('/users', { params }),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),

  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/notifications/read-all')
};
