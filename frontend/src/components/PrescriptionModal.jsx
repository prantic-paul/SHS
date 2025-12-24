import { useState, useEffect } from 'react';
import { X, User, Activity, Pill, FileText, Calendar, AlertCircle } from 'lucide-react';
import { prescriptionService } from '../services/prescriptionService';

const PrescriptionModal = ({ isOpen, onClose, appointment, prescription, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const isEditMode = !!prescription;
  
  const [formData, setFormData] = useState({
    doctor: '',
    patient: '',
    appointment: '',
    chief_complaint: '',
    diagnosis: '',
    temperature: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    respiratory_rate: '',
    medications: '',
    dosage: '',
    instructions: '',
    doctor_notes: '',
    follow_up_required: false,
    follow_up_date: '',
  });

  useEffect(() => {
    if (isOpen && appointment) {
      console.log('Appointment object:', appointment);
      console.log('Doctor ID:', appointment.doctor);
      console.log('Patient ID:', appointment.patient);
      console.log('Appointment ID:', appointment.id);
      
      if (prescription) {
        // Edit mode: Load existing prescription data
        console.log('Loading prescription data:', prescription);
        setFormData({
          doctor: appointment.doctor,
          patient: appointment.patient,
          appointment: appointment.id,
          chief_complaint: prescription.chief_complaint || '',
          diagnosis: prescription.diagnosis || '',
          temperature: prescription.temperature || '',
          blood_pressure_systolic: prescription.blood_pressure_systolic || '',
          blood_pressure_diastolic: prescription.blood_pressure_diastolic || '',
          heart_rate: prescription.heart_rate || '',
          respiratory_rate: prescription.respiratory_rate || '',
          medications: prescription.medications || '',
          dosage: prescription.dosage || '',
          instructions: prescription.instructions || '',
          doctor_notes: prescription.doctor_notes || '',
          follow_up_required: prescription.follow_up_required || false,
          follow_up_date: prescription.follow_up_date || '',
        });
      } else {
        // Create mode: Set only IDs
        setFormData(prev => ({
          ...prev,
          doctor: appointment.doctor,
          patient: appointment.patient,
          appointment: appointment.id,
        }));
      }
    }
  }, [isOpen, appointment, prescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Prepare data for submission
      const submitData = {
        doctor: formData.doctor,
        patient: formData.patient,
        appointment: formData.appointment,
        chief_complaint: formData.chief_complaint,
        diagnosis: formData.diagnosis,
        medications: formData.medications,
        dosage: formData.dosage,
      };

      console.log('Submit data:', submitData);

      // Add optional fields only if they have values
      if (formData.temperature) {
        submitData.temperature = parseFloat(formData.temperature);
      }
      if (formData.blood_pressure_systolic) {
        submitData.blood_pressure_systolic = parseInt(formData.blood_pressure_systolic);
      }
      if (formData.blood_pressure_diastolic) {
        submitData.blood_pressure_diastolic = parseInt(formData.blood_pressure_diastolic);
      }
      if (formData.heart_rate) {
        submitData.heart_rate = parseInt(formData.heart_rate);
      }
      if (formData.respiratory_rate) {
        submitData.respiratory_rate = parseInt(formData.respiratory_rate);
      }
      if (formData.instructions) {
        submitData.instructions = formData.instructions;
      }
      if (formData.doctor_notes) {
        submitData.doctor_notes = formData.doctor_notes;
      }

      // Add follow-up data
      submitData.follow_up_required = formData.follow_up_required;
      if (formData.follow_up_required && formData.follow_up_date) {
        submitData.follow_up_date = formData.follow_up_date;
      }

      console.log('Final submit data:', submitData);

      if (isEditMode) {
        await prescriptionService.updatePrescription(prescription.id, submitData);
        setSuccessMessage('Prescription updated successfully!');
      } else {
        await prescriptionService.createPrescription(submitData);
        setSuccessMessage('Prescription saved successfully!');
      }
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors || 'Failed to save prescription. Please try again.';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : errorMessage);
      console.error('Error saving prescription:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold">{isEditMode ? 'Edit' : 'Create'} Medical Prescription</h2>
            <p className="text-blue-100 mt-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient: <span className="font-semibold">{appointment?.patient_name}</span>
            </p>
            <p className="text-blue-100 text-sm">
              Appointment: {appointment?.appointment_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <pre className="text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Patient Complaints Section */}
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Patient Complaints & Diagnosis
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chief Complaint <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="chief_complaint"
                  value={formData.chief_complaint}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Main reason for visit (e.g., Persistent cough, fever for 3 days)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Medical diagnosis and findings"
                />
              </div>
            </div>
          </div>

          {/* Vital Signs Section */}
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Vital Signs (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="98.6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BP Systolic (mmHg)
                </label>
                <input
                  type="number"
                  name="blood_pressure_systolic"
                  value={formData.blood_pressure_systolic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BP Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  name="blood_pressure_diastolic"
                  value={formData.blood_pressure_diastolic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  name="respiratory_rate"
                  value={formData.respiratory_rate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="16"
                />
              </div>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-purple-600" />
              Prescription Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medications <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="List all prescribed medications (e.g., Amoxicillin 500mg, Paracetamol 650mg)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage & Frequency <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="e.g., Take twice daily after meals for 7 days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions for Patient
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Special instructions (e.g., Take with food, Avoid alcohol, Rest advised)"
                />
              </div>
            </div>
          </div>

          {/* Doctor Notes Section */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Notes
            </h3>
            <textarea
              name="doctor_notes"
              value={formData.doctor_notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Any additional observations or recommendations for future reference"
            />
          </div>

          {/* Follow-up Section */}
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-yellow-600" />
              Follow-up Appointment
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Follow-up appointment required
                </label>
              </div>

              {formData.follow_up_required && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    name="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditMode ? 'Update Prescription' : 'Submit Prescription'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;
