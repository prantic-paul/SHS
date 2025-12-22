/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import apiClient from './api';

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  register: async (userData) => {
    const response = await apiClient.post('/auth/register/', userData);
    if (response.data.success) {
      // Store tokens and user data
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise} API response
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    if (response.data.success) {
      // Store tokens and user data
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User data
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
