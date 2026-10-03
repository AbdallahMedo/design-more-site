import apiClient from './axiosClient';

export const adsApi = {
  // Fetch active promotional banners and advertisements from backend API
  async getAdvertisements() {
    try {
      const response = await apiClient.get('/api/advertisements');
      return Array.isArray(response.data) ? response.data : [];
    } catch (err) {
      console.error('Failed to load advertisements from API:', err.message);
      return [];
    }
  },
};

export default adsApi;
