import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const contactApi = {
  async sendMessage(payload) {
    const response = await axios.post(`${API_BASE_URL}/api/contact`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
    return response.data;
  },
};
