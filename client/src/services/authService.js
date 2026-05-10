import api from './axiosInstance';

const authService = {
  /**
   * Login with email + password
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { user, accessToken }
  },

  /**
   * Register a new user
   * @param {{ name: string, email: string, phone: string, password: string }} userData
   */
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    return data; // { user, accessToken }
  },

  /** Refresh access token using httpOnly refresh cookie */
  async refreshTokens() {
    const { data } = await api.post('/auth/refresh-token');
    return data; // { accessToken }
  },

  /** Logout - clears refresh token cookie on server */
  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  /** Send OTP to phone/email */
  async sendOtp(payload) {
    const { data } = await api.post('/auth/send-otp', payload);
    return data;
  },

  /** Verify OTP */
  async verifyOtp(payload) {
    const { data } = await api.post('/auth/verify-otp', payload);
    return data;
  },

  /** Get my profile */
  async getMyProfile() {
    const { data } = await api.get('/users/me');
    return data.user;
  },

  /** Forgot password */
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  /** Reset password */
  async resetPassword(payload) {
    const { data } = await api.post('/auth/reset-password', payload);
    return data;
  },
};

export default authService;
