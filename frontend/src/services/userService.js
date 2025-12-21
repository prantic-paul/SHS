/**
 * User Service
 * Handles user profile and doctor application API calls
 */
import apiClient from './api';

export const userService = {
  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getProfile: async () => {
    const response = await apiClient.get('/users/profile/');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.patch('/users/profile/', profileData);
    if (response.data.success) {
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Submit doctor application
   * @param {Object} doctorData - Doctor application data
   * @returns {Promise} API response
   */
  applyAsDoctor: async (doctorData) => {
    const response = await apiClient.post('/doctors/apply/', doctorData);
    return response.data;
  },
};
