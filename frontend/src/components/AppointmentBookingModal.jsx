/**
 * AppointmentBookingModal Component
 * Modal for booking appointments with doctors
 */
import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { bookAppointment } from '../services/appointmentService';

const AppointmentBookingModal = ({ doctor, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    doctor: doctor.id,
    appointment_date: '',
    patient_notes: '',
  });

  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.appointment_date) {
      setError('Please select an appointment date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bookAppointment(formData);
      
      // Show confirmation
      setAppointmentDetails(response.appointment);
      setShowConfirmation(true);
      
      // Call success callback after 3 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Booking error:', err);
      setError(
        err.response?.data?.appointment_date?.[0] ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Failed to book appointment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation && appointmentDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-600">Your appointment has been successfully booked</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Appointment Number:</span>
                <span className="text-xl font-bold text-blue-600">
                  {appointmentDetails.appointment_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Serial Number:</span>
                <span className="text-2xl font-bold text-green-600">
                  #{appointmentDetails.serial_number}
                </span>
              </div>
              {appointmentDetails.approximate_time && (
                <div className="flex items-center justify-between bg-yellow-50 -mx-6 px-6 py-3">
                  <span className="text-gray-700 font-medium flex items-center">
                    <FiClock className="mr-2" />
                    Approximate Time:
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    {new Date('2000-01-01 ' + appointmentDetails.approximate_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>Doctor:</strong> {appointmentDetails.doctor_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(appointmentDetails.appointment_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">
            <strong>Note:</strong> The approximate time is calculated based on your serial number (10 minutes per patient).
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Please arrive 15 minutes before your approximate time. You will be called by your serial number.
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Book Appointment</h2>
            <p className="text-blue-100 text-sm mt-1">Schedule your visit with the doctor</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Doctor Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              {doctor.profile_image ? (
                <img
                  src={doctor.profile_image}
                  alt={doctor.doctor_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-blue-300">
                  {doctor.doctor_name?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{doctor.doctor_name}</h3>
                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-sm text-gray-600">{doctor.experience_years} years experience</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Appointment Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />
              Select Appointment Date *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer border-2 rounded-lg p-4 transition ${
                formData.appointment_date === todayStr
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name="appointment_date"
                  value={todayStr}
                  checked={formData.appointment_date === todayStr}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Today</p>
                  <p className="font-bold text-gray-900">
                    {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {today.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>
              </label>

              <label className={`cursor-pointer border-2 rounded-lg p-4 transition ${
                formData.appointment_date === tomorrowStr
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              }`}>
                <input
                  type="radio"
                  name="appointment_date"
                  value={tomorrowStr}
                  checked={formData.appointment_date === tomorrowStr}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Tomorrow</p>
                  <p className="font-bold text-gray-900">
                    {tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {tomorrow.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Information Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiClock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Appointment Time Calculation
                </p>
                <p className="text-xs text-blue-700">
                  You will be assigned a serial number. Your approximate appointment time will be calculated automatically (10 minutes per patient from doctor's start time).
                </p>
              </div>
            </div>
          </div>

          {/* Patient Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline mr-2" />
              Reason for Visit / Symptoms (Optional)
            </label>
            <textarea
              name="patient_notes"
              value={formData.patient_notes}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your symptoms or reason for consultation..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.appointment_date}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                <>
                  <FiCheckCircle className="mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> You will receive a serial number after booking. Please arrive on time and wait for your number to be called.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;
