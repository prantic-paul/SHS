/**
 * Medical Records Page
 * Display all prescriptions and medical records for the patient
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiFileText, FiActivity, FiHeart, FiThermometer, FiAlertCircle, FiEye, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { prescriptionService } from '../services/prescriptionService';

const MedicalRecordsPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [filterBy, setFilterBy] = useState('all'); // all, mostRecent

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await prescriptionService.getAllPrescriptions();
      // Sort by created_at descending (most recent first)
      const sorted = Array.isArray(response) ? response.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ) : [];
      setPrescriptions(sorted);
      setError(null);
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setViewingPrescription(prescription);
  };

  const getFilteredPrescriptions = () => {
    switch (filterBy) {
      case 'mostRecent':
        // Show only the most recent prescription
        return prescriptions.length > 0 ? [prescriptions[0]] : [];
      default:
        return prescriptions;
    }
  };

  const filteredPrescriptions = getFilteredPrescriptions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading medical records...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center text-white hover:text-blue-100 transition mb-4"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Profile
                </button>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <div>
                    <h1 className="text-4xl font-extrabold mb-2">Medical Records</h1>
                    <p className="text-blue-100 text-lg">
                      View your complete prescription history
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                    <p className="text-sm text-blue-100">Total Records</p>
                    <p className="text-3xl font-bold">{prescriptions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
            <button
              onClick={() => setFilterBy('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterBy === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Records ({prescriptions.length})
            </button>
            <button
              onClick={() => setFilterBy('mostRecent')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterBy === 'mostRecent'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Most Recent
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Prescriptions List */}
          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filterBy === 'all' ? 'No Medical Records' : 'No record found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterBy === 'all' 
                  ? 'Your prescription history will appear here after your first appointment.'
                  : 'No prescription available to display.'}
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Find a Doctor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left Section - Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <FiUser className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Dr. {prescription.doctor_name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {new Date(prescription.created_at).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiFileText className="w-4 h-4" />
                              <span>Appointment: {prescription.appointment_number}</span>
                            </div>
                          </div>
                          
                          {/* Quick Preview */}
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <p className="text-xs text-gray-500">Diagnosis</p>
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {prescription.diagnosis}
                              </p>
                            </div>
                            {prescription.temperature && (
                              <div className="bg-red-50 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiThermometer className="w-3 h-3" />
                                  Temperature
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {prescription.temperature}°F
                                </p>
                              </div>
                            )}
                            {prescription.blood_pressure && (
                              <div className="bg-purple-50 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiActivity className="w-3 h-3" />
                                  Blood Pressure
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {prescription.blood_pressure}
                                </p>
                              </div>
                            )}
                            {prescription.heart_rate && (
                              <div className="bg-pink-50 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiHeart className="w-3 h-3" />
                                  Heart Rate
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
                    <div className="lg:pl-4 lg:border-l border-gray-200">
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Detail Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-bold">Medical Prescription</h2>
                <p className="text-blue-100 mt-2">Doctor: {viewingPrescription.doctor_name}</p>
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

export default MedicalRecordsPage;
