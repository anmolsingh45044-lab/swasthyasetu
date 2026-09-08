import api from './api';

export const deliveryService = {
  getDeliveries: () => api.get('/deliveries'),
  getDeliveryById: (id) => api.get(`/deliveries/${id}`),
  updateDeliveryStatus: (id, status) => api.put(`/deliveries/${id}/status`, { status })
};

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getBloodByGroup: () => api.get('/analytics/blood-by-group'),
  getRequestsOverTime: () => api.get('/analytics/requests-over-time'),
  getRequestStatus: () => api.get('/analytics/request-status'),
  getBedAvailability: () => api.get('/analytics/bed-availability'),
  getFacilityDistribution: () => api.get('/analytics/facility-distribution')
};
