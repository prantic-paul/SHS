import apiClient from './api';

const API_URL = '/medical-records';

const medicalRecordService = {
  // Create a new prescription/medical record
  createMedicalRecord: async (data) => {
    const response = await apiClient.post(`${API_URL}/records/`, data);
    return response.data;
  },

  // Update existing medical record
  updateMedicalRecord: async (id, data) => {
    const response = await apiClient.patch(`${API_URL}/records/${id}/`, data);
    return response.data;
  },

  // Get medical record by appointment ID
  getMedicalRecordByAppointment: async (appointmentId) => {
    const response = await apiClient.get(`${API_URL}/records/by_appointment/`, {
      params: { appointment_id: appointmentId },
    });
    return response.data;
  },

  // Get patient's medical history
  getPatientHistory: async (patientId = null) => {
    const params = patientId ? { patient_id: patientId } : {};
    const response = await apiClient.get(`${API_URL}/records/patient_history/`, {
      params,
    });
    return response.data;
  },

  // Get all medical records (for doctor)
  getAllMedicalRecords: async () => {
    const response = await apiClient.get(`${API_URL}/records/`);
    return response.data;
  },

  // Get specific medical record details
  getMedicalRecordDetails: async (id) => {
    const response = await apiClient.get(`${API_URL}/records/${id}/`);
    return response.data;
  },
};

export default medicalRecordService;
