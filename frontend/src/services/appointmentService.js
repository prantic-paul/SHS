/**
 * Appointment Service
 * Handles all appointment-related API calls
 */
import api from './api';

/**
 * Book a new appointment
 */
export const bookAppointment = async (appointmentData) => {
  const response = await api.post('/appointments/', appointmentData);
  return response.data;
};

/**
 * Get all appointments for current user
 */
export const getMyAppointments = async () => {
  const response = await api.get('/appointments/my-appointments/');
  return response.data;
};

/**
 * Get list of appointments
 */
export const getAppointments = async (params) => {
  const response = await api.get('/appointments/', { params });
  return response.data;
};

/**
 * Get appointment details
 */
export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}/`);
  return response.data;
};

/**
 * Update appointment
 */
export const updateAppointment = async (id, data) => {
  const response = await api.patch(`/appointments/${id}/`, data);
  return response.data;
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}/`);
  return response.data;
};

/**
 * Get today's appointments for doctor
 */
export const getTodayAppointments = async () => {
  const response = await api.get('/appointments/doctor/today/');
  return response.data;
};

/**
 * Get tomorrow's appointments for doctor
 */
export const getTomorrowAppointments = async () => {
  const response = await api.get('/appointments/doctor/tomorrow/');
  return response.data;
};

/**
 * Delete a missed appointment
 */
export const deleteMissedAppointment = async (id) => {
  const response = await api.delete(`/appointments/${id}/delete-if-missed/`);
  return response.data;
};

/**
 * Cleanup all missed appointments (admin only)
 */
export const cleanupMissedAppointments = async () => {
  const response = await api.post('/appointments/cleanup-missed/');
  return response.data;
};

// Default export with all functions
const appointmentService = {
  bookAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getTodayAppointments,
  getTomorrowAppointments,
  deleteMissedAppointment,
  cleanupMissedAppointments,
};

export default appointmentService;
export { appointmentService };
