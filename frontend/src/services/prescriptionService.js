import apiClient from './api';

export const prescriptionService = {
  // Create a new prescription
  async createPrescription(data) {
    const response = await apiClient.post('/prescriptions/', data);
    return response.data;
  },

  // Update an existing prescription
  async updatePrescription(id, data) {
    const response = await apiClient.patch(`/prescriptions/${id}/`, data);
    return response.data;
  },

  // Get prescription by appointment ID
  async getPrescriptionByAppointment(appointmentId) {
    const response = await apiClient.get(`/prescriptions/by_appointment/?appointment_id=${appointmentId}`);
    return response.data;
  },

  // Get patient prescription history
  async getPatientHistory(patientId) {
    const response = await apiClient.get(`/prescriptions/patient_history/?patient_id=${patientId}`);
    return response.data;
  },

  // Get all prescriptions (for doctors)
  async getAllPrescriptions() {
    const response = await apiClient.get('/prescriptions/');
    return response.data;
  },

  // Get specific prescription details
  async getPrescriptionDetails(id) {
    const response = await apiClient.get(`/prescriptions/${id}/`);
    return response.data;
  },
};

export default prescriptionService;
