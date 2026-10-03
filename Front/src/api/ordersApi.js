import apiClient from './axiosClient';

export const ordersApi = {
  // Get Delivery Governorates directly from backend API
  async getGovernorates() {
    try {
      const response = await apiClient.get('/api/delivery-governorates');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load governorates from API:', err.message);
      return [];
    }
  },

  // Place Cash-on-Delivery or Authenticated Order directly to backend API
  async createOrder(orderPayload) {
    const response = await apiClient.post('/api/orders', orderPayload);
    return response.data;
  },

  // Client order history from backend API
  async getMyOrders() {
    try {
      const response = await apiClient.get('/api/orders');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load orders from API:', err.message);
      return [];
    }
  },

  // Single order lookup from backend API
  async getOrderById(id) {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },
};

export default ordersApi;
