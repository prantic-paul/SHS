/**
 * Today's Patients Modal Component
 * Shows doctor's appointments for today sorted by time priority
 */
import { useState, useEffect } from 'react';
import { X, Clock, User, Phone, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const TodayPatientsModal = ({ isOpen, onClose }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    missed: 0,
    noTime: 0,
  });

  useEffect(() => {
    if (isOpen) {
      fetchTodayAppointments();
    }
  }, [isOpen]);

  const fetchTodayAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await appointmentService.getTodayAppointments();
      setAppointments(response.data.appointments || []);
      setStats({
        total: response.data.total_appointments || 0,
        upcoming: response.data.upcoming_count || 0,
        missed: response.data.missed_count || 0,
        noTime: response.data.no_time_count || 0,
      });
    } catch (err) {
      console.error('Error fetching today appointments:', err);
      setError('Failed to load today\'s appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.label}
      </span>
    );
  };

  const formatTime = (time) => {
    if (!time) return 'No time set';
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTimeStatus = (appointment, index) => {
    const aptTime = appointment.approximate_time;
    if (!aptTime) {
      return { label: 'No Time', color: 'text-gray-600', icon: Clock };
    }
    
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (aptTime < currentTime) {
      return { label: 'Missed', color: 'text-red-600', icon: AlertCircle };
    } else {
      return { label: 'Upcoming', color: 'text-green-600', icon: CheckCircle };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Today's Patients</h3>
                <p className="text-green-100 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.upcoming}</div>
              <div className="text-sm text-gray-600 mt-1">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{stats.noTime}</div>
              <div className="text-sm text-gray-600 mt-1">No Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.missed}</div>
              <div className="text-sm text-gray-600 mt-1">Missed</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading appointments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment, index) => {
                  const timeStatus = getTimeStatus(appointment, index);
                  const TimeIcon = timeStatus.icon;
                  
                  return (
                    <div
                      key={appointment.id}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Serial Number Badge */}
                            <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-lg px-3 py-1 font-bold text-lg">
                              #{appointment.serial_number}
                            </div>
                            
                            {/* Patient Name */}
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {appointment.patient_name}
                              </h4>
                              <p className="text-sm text-gray-600">{appointment.patient_email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-3">
                            {/* Time */}
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 ${timeStatus.color}`} />
                              <div>
                                <p className="text-xs text-gray-600">Approximate Time</p>
                                <p className="font-semibold text-gray-900">
                                  {formatTime(appointment.approximate_time)}
                                </p>
                              </div>
                            </div>

                            {/* Time Status */}
                            <div className="flex items-center gap-2">
                              <TimeIcon className={`w-4 h-4 ${timeStatus.color}`} />
                              <div>
                                <p className="text-xs text-gray-600">Status</p>
                                <p className={`font-semibold ${timeStatus.color}`}>
                                  {timeStatus.label}
                                </p>
                              </div>
                            </div>

                            {/* Appointment Number */}
                            <div className="col-span-2">
                              <p className="text-xs text-gray-600">Appointment Number</p>
                              <p className="font-mono font-semibold text-gray-900 text-sm">
                                {appointment.appointment_number}
                              </p>
                            </div>

                            {/* Patient Notes */}
                            {appointment.patient_notes && (
                              <div className="col-span-2">
                                <div className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-blue-600 mt-1" />
                                  <div>
                                    <p className="text-xs text-gray-600">Notes</p>
                                    <p className="text-sm text-gray-700">{appointment.patient_notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="ml-4">
                          {getStatusBadge(appointment.status)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayPatientsModal;
