/**
 * Doctor Dashboard Component
 * Shows Today's Patients, Tomorrow's Patients, and Prescribed Patients
 */
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'tomorrow', 'prescribed'
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayStats, setTodayStats] = useState({
    total: 0,
    upcoming: 0,
    missed: 0,
    noTime: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch today's appointments
      const todayResponse = await appointmentService.getTodayAppointments();
      
      // Filter out any appointments that should be deleted (optional client-side filtering)
      const validAppointments = todayResponse.appointments || [];
      
      setTodayAppointments(validAppointments);
      setTodayStats({
        total: todayResponse.total_appointments || 0,
        upcoming: todayResponse.upcoming_count || 0,
        missed: todayResponse.missed_count || 0,
        noTime: todayResponse.no_time_count || 0,
      });

      // Fetch tomorrow's appointments
      const tomorrowResponse = await appointmentService.getTomorrowAppointments();
      setTomorrowAppointments(tomorrowResponse.appointments || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load appointment data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMissed = async (appointmentId) => {
    try {
      await appointmentService.deleteMissedAppointment(appointmentId);
      // Refresh data after deletion
      fetchDashboardData();
    } catch (err) {
      console.error('Error deleting missed appointment:', err);
      // Optionally show error message
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
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getTimeStatus = (appointment) => {
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

  const AppointmentCard = ({ appointment, showTimeStatus = false }) => {
    const timeStatus = showTimeStatus ? getTimeStatus(appointment) : null;
    const TimeIcon = timeStatus?.icon;

    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {/* Serial Number Badge */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-lg px-3 py-1 font-bold text-lg">
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
                <Clock className={`w-4 h-4 ${timeStatus ? timeStatus.color : 'text-blue-600'}`} />
                <div>
                  <p className="text-xs text-gray-600">Approximate Time</p>
                  <p className="font-semibold text-gray-900">
                    {formatTime(appointment.approximate_time)}
                  </p>
                </div>
              </div>

              {/* Time Status (for today only) */}
              {showTimeStatus && timeStatus && (
                <div className="flex items-center gap-2">
                  <TimeIcon className={`w-4 h-4 ${timeStatus.color}`} />
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className={`font-semibold ${timeStatus.color}`}>
                      {timeStatus.label}
                    </p>
                  </div>
                </div>
              )}

              {/* Appointment Number */}
              <div className={showTimeStatus ? 'col-span-2' : 'col-span-1'}>
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
                      <p className="text-xs text-gray-600">Patient Notes</p>
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
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">Doctor Dashboard</h2>
        <p className="text-blue-100">Manage your appointments and patients</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'today'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Today's Patients</span>
              {todayStats.total > 0 && (
                <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {todayStats.total}
                </span>
              )}
            </div>
            {activeTab === 'today' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'tomorrow'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Tomorrow's Patients</span>
              {tomorrowAppointments.length > 0 && (
                <span className="bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
                  {tomorrowAppointments.length}
                </span>
              )}
            </div>
            {activeTab === 'tomorrow' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab('prescribed')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'prescribed'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Prescribed Patients</span>
            </div>
            {activeTab === 'prescribed' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Today's Patients Tab */}
            {activeTab === 'today' && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{todayStats.total}</div>
                    <div className="text-sm text-gray-600 mt-1">Total</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{todayStats.upcoming}</div>
                    <div className="text-sm text-gray-600 mt-1">Upcoming</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600">{todayStats.noTime}</div>
                    <div className="text-sm text-gray-600 mt-1">No Time</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-red-600">{todayStats.missed}</div>
                    <div className="text-sm text-gray-600 mt-1">Missed</div>
                  </div>
                </div>

                {/* Appointments List */}
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        showTimeStatus={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tomorrow's Patients Tab */}
            {activeTab === 'tomorrow' && (
              <div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600">{tomorrowAppointments.length}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Appointments Tomorrow</div>
                  </div>
                </div>

                {tomorrowAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled for tomorrow</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tomorrowAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        showTimeStatus={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Prescribed Patients Tab */}
            {activeTab === 'prescribed' && (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">Prescription Module</p>
                <p className="text-gray-500">This feature will be implemented in the next module</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
