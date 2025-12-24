import { useState, useEffect } from 'react';
import { FiClock, FiSave, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';

const DoctorScheduleManager = ({ doctorId, onClose, onSave }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const weekdays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/doctors/schedules/my_schedules/');
      setSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      // Initialize empty schedule for each day if none exist
      setSchedules([]);
    }
  };

  const handleAddSchedule = (dayOfWeek) => {
    const existingSchedule = schedules.find(s => s.day_of_week === dayOfWeek);
    if (existingSchedule) {
      setError('Schedule for this day already exists. Please edit or delete it first.');
      return;
    }

    setSchedules([...schedules, {
      day_of_week: dayOfWeek,
      start_time: '09:00',
      end_time: '17:00',
      is_active: true,
      isNew: true
    }]);
  };

  const handleDeleteSchedule = async (scheduleId, index) => {
    try {
      if (scheduleId) {
        // Delete from server
        await api.delete(`/doctors/schedules/${scheduleId}/`);
        setSuccess('Schedule deleted successfully!');
      }
      // Remove from local state
      setSchedules(schedules.filter((_, i) => i !== index));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete schedule');
    }
  };

  const handleUpdateSchedule = (index, field, value) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate all schedules
      for (const schedule of schedules) {
        if (schedule.start_time >= schedule.end_time) {
          setError('End time must be after start time for all schedules');
          setLoading(false);
          return;
        }
      }

      // Save or update each schedule
      for (const schedule of schedules) {
        if (schedule.isNew) {
          // Create new schedule
          await api.post('/doctors/schedules/', {
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_active: schedule.is_active
          });
        } else if (schedule.id) {
          // Update existing schedule
          await api.put(`/doctors/schedules/${schedule.id}/`, {
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_active: schedule.is_active
          });
        }
      }

      setSuccess('Schedules saved successfully!');
      await fetchSchedules();
      if (onSave) onSave();
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.end_time?.[0] || 'Failed to save schedules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Manage Weekly Schedule</h2>
            <p className="text-blue-100 text-sm mt-1">Set your availability for appointments</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Weekday Schedule List */}
          <div className="space-y-4">
            {weekdays.map((day) => {
              const schedule = schedules.find(s => s.day_of_week === day.value);
              const index = schedules.findIndex(s => s.day_of_week === day.value);

              return (
                <div key={day.value} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FiClock className="text-blue-600 mr-2" />
                      <h3 className="font-bold text-gray-900">{day.label}</h3>
                    </div>
                    {!schedule && (
                      <button
                        onClick={() => handleAddSchedule(day.value)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        <FiPlus className="mr-1" size={16} />
                        Add Schedule
                      </button>
                    )}
                  </div>

                  {schedule && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={schedule.start_time}
                            onChange={(e) => handleUpdateSchedule(index, 'start_time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={schedule.end_time}
                            onChange={(e) => handleUpdateSchedule(index, 'end_time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.is_active}
                            onChange={(e) => handleUpdateSchedule(index, 'is_active', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>

                        <button
                          onClick={() => handleDeleteSchedule(schedule.id, index)}
                          className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                        >
                          <FiTrash2 className="mr-1" size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={loading || schedules.length === 0}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {loading ? 'Saving...' : 'Save All Schedules'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleManager;
