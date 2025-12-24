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
    // Check if profileData contains a File (profile picture)
    const hasFile = Object.values(profileData).some(value => value instanceof File);
    
    let response;
    if (hasFile) {
      // Use FormData for file upload
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined && profileData[key] !== '') {
          formData.append(key, profileData[key]);
        }
      });
      response = await apiClient.patch('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Regular JSON request
      response = await apiClient.patch('/users/profile/', profileData);
    }
    
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

  /**
   * Get doctor profile
   * @returns {Promise} API response
   */
  getDoctorProfile: async () => {
    const response = await apiClient.get('/doctors/profile/');
    return response.data;
  },

  /**
   * Update doctor profile
   * @param {Object} doctorData - Updated doctor profile data
   * @returns {Promise} API response
   */
  updateDoctorProfile: async (doctorData) => {
    const response = await apiClient.patch('/doctors/profile/', doctorData);
    return response.data;
  },
};
