/**
 * My Appointments Page
 * Display user's upcoming and past appointments
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { getMyAppointments, cancelAppointment } from '../services/appointmentService';
import { prescriptionService } from '../services/prescriptionService';

const MyAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setCancellingId(id);
      await cancelAppointment(id);
      // Reload appointments
      await loadAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewPrescription = async (appointmentId) => {
    try {
      setLoadingPrescription(true);
      const prescription = await prescriptionService.getPrescriptionByAppointment(appointmentId);
      setViewingPrescription(prescription);
    } catch (err) {
      console.error('Error loading prescription:', err);
      alert('Failed to load prescription');
    } finally {
      setLoadingPrescription(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed', icon: FiCheckCircle },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: FiClock },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed', icon: FiCheckCircle },
    };
    return badges[status] || badges.PENDING;
  };

  const AppointmentCard = ({ appointment, showCancel }) => {
    const statusInfo = getStatusBadge(appointment.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {appointment.doctor_name}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-blue-600 font-medium">{appointment.doctor_specialization}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              #{appointment.serial_number}
            </div>
            <p className="text-xs text-gray-500">Serial No.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-700">
            <FiCalendar className="w-5 h-5 mr-2 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {appointment.approximate_time && (
            <div className="flex items-center text-gray-700">
              <FiClock className="w-5 h-5 mr-2 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Approximate Time</p>
                <p className="font-medium">{appointment.approximate_time}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Appointment Number</p>
          <p className="font-mono font-bold text-gray-900">
            {appointment.appointment_number}
          </p>
        </div>

        {appointment.patient_notes && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">
              <FiFileText className="inline w-3 h-3 mr-1" />
              Notes
            </p>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
              {appointment.patient_notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Booked on {new Date(appointment.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="flex gap-2">
            {appointment.status === 'COMPLETED' && appointment.has_prescription && (
              <button
                onClick={() => handleViewPrescription(appointment.id)}
                disabled={loadingPrescription}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                View Prescription
              </button>
            )}
            {showCancel && appointment.status !== 'COMPLETED' && (
              <button
                onClick={() => handleCancelAppointment(appointment.id)}
                disabled={cancellingId === appointment.id}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium disabled:opacity-50"
              >
                {cancellingId === appointment.id ? 'Deleting...' : 'Cancel Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading appointments...</p>
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
                <h1 className="text-4xl font-extrabold mb-2">My Appointments</h1>
                <p className="text-blue-100 text-lg">View and manage your appointments</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'upcoming'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming ({appointments.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'past'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past ({appointments.past.length})
              </button>
            </nav>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Appointments List */}
          {activeTab === 'upcoming' && (
            <div>
              {appointments.upcoming.length > 0 ? (
                <div className="grid gap-6">
                  {appointments.upcoming.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showCancel={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Appointments</h3>
                  <p className="text-gray-600 mb-6">You don't have any upcoming appointments</p>
                  <button
                    onClick={() => navigate('/doctors')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Find a Doctor
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div>
              {appointments.past.length > 0 ? (
                <div className="grid gap-6">
                  {appointments.past.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      showCancel={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md">
                  <FiCalendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Past Appointments</h3>
                  <p className="text-gray-600">You don't have any past appointments</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Viewing Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-3xl font-bold">Medical Prescription</h2>
                <p className="text-blue-100 mt-2">Doctor: {viewingPrescription.doctor_name}</p>
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

export default MyAppointmentsPage;
