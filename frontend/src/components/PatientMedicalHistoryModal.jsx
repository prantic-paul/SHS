/**
 * Patient Medical History Modal
 * For doctors to view a patient's complete medical history
 */
import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiFileText, FiActivity, FiHeart, FiThermometer, FiEye, FiUser } from 'react-icons/fi';
import { prescriptionService } from '../services/prescriptionService';

const PatientMedicalHistoryModal = ({ isOpen, onClose, patientId, patientName }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchPatientHistory();
    }
  }, [isOpen, patientId]);

  const fetchPatientHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await prescriptionService.getPatientHistory(patientId);
      // Sort by created_at descending (most recent first)
      const sorted = Array.isArray(response) ? response.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ) : [];
      setPrescriptions(sorted);
    } catch (err) {
      console.error('Error fetching patient history:', err);
      setError('Failed to load patient medical history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setViewingPrescription(prescription);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
          <div>
            <h2 className="text-3xl font-bold">Patient Medical History</h2>
            <p className="text-blue-100 mt-2 flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              Patient: <span className="font-semibold">{patientName}</span>
            </p>
            <p className="text-blue-100 text-sm">Total Records: {prescriptions.length}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600">Loading medical history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <FiFileText className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medical History</h3>
              <p className="text-gray-600">This patient has no previous prescriptions on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-indigo-100 rounded-full p-3 flex-shrink-0">
                          <FiUser className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              Dr. {prescription.doctor_name}
                            </h3>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                              {prescription.appointment_number}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {new Date(prescription.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                          
                          {/* Quick Preview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                              <p className="text-xs text-gray-500">Diagnosis</p>
                              <p className="text-sm font-semibold text-gray-900 truncate" title={prescription.diagnosis}>
                                {prescription.diagnosis}
                              </p>
                            </div>
                            {prescription.temperature && (
                              <div className="bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiThermometer className="w-3 h-3" />
                                  Temp
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {prescription.temperature}°F
                                </p>
                              </div>
                            )}
                            {prescription.blood_pressure && (
                              <div className="bg-purple-50 rounded-lg px-3 py-2 border border-purple-100">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiActivity className="w-3 h-3" />
                                  BP
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {prescription.blood_pressure}
                                </p>
                              </div>
                            )}
                            {prescription.heart_rate && (
                              <div className="bg-pink-50 rounded-lg px-3 py-2 border border-pink-100">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiHeart className="w-3 h-3" />
                                  HR
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {prescription.heart_rate} bpm
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="lg:pl-4 lg:border-l border-gray-300">
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg"
                      >
                        <FiEye className="w-4 h-4" />
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-bold">Prescription Details</h2>
                <p className="text-blue-100 mt-2">Dr. {viewingPrescription.doctor_name}</p>
                <p className="text-blue-100 text-sm">
                  Date: {new Date(viewingPrescription.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setViewingPrescription(null)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Prescription Content */}
            <div className="p-6 space-y-6">
              {/* Chief Complaint & Diagnosis */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiFileText className="h-5 w-5 text-blue-600" />
                  Complaints & Diagnosis
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chief Complaint</p>
                    <p className="text-gray-900 mt-1">{viewingPrescription.chief_complaint}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Diagnosis</p>
                    <p className="text-gray-900 mt-1">{viewingPrescription.diagnosis}</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              {(viewingPrescription.temperature || viewingPrescription.blood_pressure_systolic || 
                viewingPrescription.heart_rate || viewingPrescription.respiratory_rate) && (
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {viewingPrescription.temperature && (
                      <div>
                        <p className="text-xs text-gray-600">Temperature</p>
                        <p className="font-semibold text-gray-900">{viewingPrescription.temperature}°F</p>
                      </div>
                    )}
                    {(viewingPrescription.blood_pressure_systolic && viewingPrescription.blood_pressure_diastolic) && (
                      <div>
                        <p className="text-xs text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-gray-900">
                          {viewingPrescription.blood_pressure_systolic}/{viewingPrescription.blood_pressure_diastolic} mmHg
                        </p>
                      </div>
                    )}
                    {viewingPrescription.heart_rate && (
                      <div>
                        <p className="text-xs text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-gray-900">{viewingPrescription.heart_rate} bpm</p>
                      </div>
                    )}
                    {viewingPrescription.respiratory_rate && (
                      <div>
                        <p className="text-xs text-gray-600">Respiratory Rate</p>
                        <p className="font-semibold text-gray-900">{viewingPrescription.respiratory_rate}/min</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medications */}
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Medications</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Medications</p>
                    <p className="text-gray-900 mt-1 whitespace-pre-line">{viewingPrescription.medications}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Dosage & Frequency</p>
                    <p className="text-gray-900 mt-1">{viewingPrescription.dosage}</p>
                  </div>
                  {viewingPrescription.instructions && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Instructions</p>
                      <p className="text-gray-900 mt-1 whitespace-pre-line">{viewingPrescription.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Notes */}
              {viewingPrescription.doctor_notes && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                  <p className="text-gray-900 whitespace-pre-line">{viewingPrescription.doctor_notes}</p>
                </div>
              )}

              {/* Follow-up */}
              {viewingPrescription.follow_up_required && (
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow-up Required</h3>
                  {viewingPrescription.follow_up_date && (
                    <p className="text-gray-900">
                      Date: {new Date(viewingPrescription.follow_up_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setViewingPrescription(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalHistoryModal;
