/**
 * Doctor Service
 * API service for doctor-related operations (Sprint 2)
 */
import api from './api';

/**
 * Get list of doctors with optional filters
 * @param {Object} params - Query parameters (search, filters, pagination)
 * @returns {Promise} - Doctor list with pagination
 */
export const getDoctors = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Search
  if (params.search) {
    queryParams.append('search', params.search);
  }
  
  // Filters
  if (params.specialization) {
    queryParams.append('specialization', params.specialization);
  }
  if (params.city) {
    queryParams.append('city', params.city);
  }
  if (params.state) {
    queryParams.append('state', params.state);
  }
  if (params.min_experience) {
    queryParams.append('min_experience', params.min_experience);
  }
  if (params.max_experience) {
    queryParams.append('max_experience', params.max_experience);
  }
  if (params.min_rating) {
    queryParams.append('min_rating', params.min_rating);
  }
  if (params.max_rating) {
    queryParams.append('max_rating', params.max_rating);
  }
  if (params.min_fee) {
    queryParams.append('min_fee', params.min_fee);
  }
  if (params.max_fee) {
    queryParams.append('max_fee', params.max_fee);
  }
  if (params.availability_status) {
    queryParams.append('availability_status', params.availability_status);
  }
  
  // Ordering
  if (params.ordering) {
    queryParams.append('ordering', params.ordering);
  }
  
  // Pagination
  if (params.page) {
    queryParams.append('page', params.page);
  }
  if (params.page_size) {
    queryParams.append('page_size', params.page_size);
  }
  
  const response = await api.get(`/doctors/?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get doctor detail by ID
 * @param {number} doctorId - Doctor ID
 * @returns {Promise} - Doctor details
 */
export const getDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/`);
  return response.data;
};

/**
 * Get list of all specializations with doctor count
 * @returns {Promise} - List of specializations
 */
export const getSpecializations = async () => {
  const response = await api.get('/doctors/specializations/');
  return response.data;
};

/**
 * Get ratings for a doctor
 * @param {number} doctorId - Doctor ID
 * @param {Object} params - Query parameters (page, page_size)
 * @returns {Promise} - List of ratings
 */
export const getDoctorRatings = async (doctorId, params = {}) => {
  const queryParams = new URLSearchParams(params);
  const response = await api.get(`/doctors/${doctorId}/ratings/?${queryParams.toString()}`);
  return response.data;
};

/**
 * Submit a rating for a doctor (requires authentication)
 * @param {number} doctorId - Doctor ID
 * @param {Object} ratingData - { rating: 1-5, review_text: string }
 * @returns {Promise} - Created rating
 */
export const submitRating = async (doctorId, ratingData) => {
  const response = await api.post(`/doctors/${doctorId}/ratings/`, {
    doctor: doctorId,
    ...ratingData
  });
  return response.data;
};

/**
 * Update an existing rating (requires authentication)
 * @param {number} doctorId - Doctor ID
 * @param {number} ratingId - Rating ID
 * @param {Object} ratingData - { rating: 1-5, review_text: string }
 * @returns {Promise} - Updated rating
 */
export const updateRating = async (doctorId, ratingId, ratingData) => {
  const response = await api.put(`/doctors/${doctorId}/ratings/${ratingId}/`, {
    doctor: doctorId,
    ...ratingData
  });
  return response.data;
};

/**
 * Delete a rating (requires authentication)
 * @param {number} doctorId - Doctor ID
 * @param {number} ratingId - Rating ID
 * @returns {Promise} - Success message
 */
export const deleteRating = async (doctorId, ratingId) => {
  const response = await api.delete(`/doctors/${doctorId}/ratings/${ratingId}/`);
  return response.data;
};

/**
 * Get rating breakdown and statistics for a doctor
 * @param {number} doctorId - Doctor ID
 * @returns {Promise} - Rating breakdown with percentages
 */
export const getRatingBreakdown = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/ratings/breakdown/`);
  return response.data;
};

export default {
  getDoctors,
  getDoctorById,
  getSpecializations,
  getDoctorRatings,
  submitRating,
  updateRating,
  deleteRating,
  getRatingBreakdown,
};
