import apiClient from './axiosClient';

export const customOrdersApi = {
  // Submit custom architectural / sheet metal commission directly to backend API
  async submitCustomOrder(formData) {
    const response = await apiClient.post('/api/custom-orders/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user custom orders from backend API
  async getMyCustomOrders() {
    try {
      const response = await apiClient.get('/api/custom-orders/my');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load custom orders from API:', err.message);
      return [];
    }
  },

  // Get single custom order by ID
  async getCustomOrderById(id) {
    const response = await apiClient.get(`/api/custom-orders/${id}`);
    return response.data;
  },
};

export default customOrdersApi;
