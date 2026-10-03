import apiClient from './axiosClient';

export const authApi = {
  // Login directly to backend API
  async login(credentials) {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  // Register directly to backend API
  async register(data) {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  // Verify email OTP directly to backend API
  async verifyEmail(email, otp) {
    const response = await apiClient.post('/api/auth/verify-email', { email, otp });
    return response.data;
  },

  // Resend OTP
  async resendOtp(email) {
    const response = await apiClient.post('/api/auth/resend-verification-otp', { email });
    return response.data;
  },

  // Current user me
  async getMe() {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // Change password
  async changePassword(passwords) {
    const response = await apiClient.post('/api/auth/change-password', passwords);
    return response.data;
  },
};

export default authApi;
