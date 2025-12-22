/**
 * Doctor Application Page
 * Apply to join as a doctor
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { FiAward, FiBook, FiMapPin, FiClock, FiFileText, FiAlertCircle } from 'react-icons/fi';

const DoctorApplicationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    license_number: '',
    qualification: '',
    education: '',
    specialization: '',
    practice_location: '',
    experience_years: '',
    bio: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    consultation_fee: '',
    clinic_address: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userService.applyAsDoctor(formData);
      alert('Doctor application submitted successfully! Pending admin approval.');
      navigate('/profile');
    } catch (err) {
      console.error('Application error:', err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        'Failed to submit application'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <FiAward className="text-primary-600 text-3xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            Apply as Doctor
          </h2>
          <p className="text-primary-100 text-lg">
            Submit your professional information for verification
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    {typeof error === 'object' ? (
                      <ul className="text-sm text-red-700 space-y-1">
                        {Object.entries(error).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-semibold">{key}:</span>{' '}
                            {Array.isArray(value) ? value.join(', ') : value}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-700">{error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* License Number */}
            <div>
              <label htmlFor="license_number" className="label">
                <FiAward className="inline mr-2" />
                Medical License Number *
              </label>
              <input
                type="text"
                id="license_number"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                required
                placeholder="BM-12345"
                className="input-field"
              />
            </div>

            {/* Qualifications */}
            <div>
              <label htmlFor="qualification" className="label">
                <FiBook className="inline mr-2" />
                Qualifications *
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                placeholder="MBBS, MD (Cardiology)"
                className="input-field"
              />
            </div>

            {/* Education */}
            <div>
              <label htmlFor="education" className="label">
                <FiBook className="inline mr-2" />
                Education *
              </label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Medical college and institutions attended"
                className="input-field resize-none"
              />
            </div>

            {/* Specialization and Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="specialization" className="label">
                  <FiAward className="inline mr-2" />
                  Specialization *
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  placeholder="Cardiology"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="experience_years" className="label">
                  <FiClock className="inline mr-2" />
                  Years of Experience *
                </label>
                <input
                  type="number"
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  required
                  min="0"
                  max="70"
                  placeholder="10"
                  className="input-field"
                />
              </div>
            </div>

            {/* Practice Location */}
            <div>
              <label htmlFor="practice_location" className="label">
                <FiMapPin className="inline mr-2" />
                Practice Location *
              </label>
              <input
                type="text"
                id="practice_location"
                name="practice_location"
                value={formData.practice_location}
                onChange={handleChange}
                required
                placeholder="Dhaka Medical College Hospital"
                className="input-field"
              />
            </div>

            {/* City and State */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="label">
                  <FiMapPin className="inline mr-2" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="state" className="label">
                  <FiMapPin className="inline mr-2" />
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="input-field"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Professional Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@example.com"
                  className="input-field"
                />
              </div>
            </div>

            {/* Consultation Fee and Clinic Address */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="consultation_fee" className="label">
                  Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  id="consultation_fee"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  min="0"
                  placeholder="500"
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="clinic_address" className="label">
                  Clinic Address
                </label>
                <input
                  type="text"
                  id="clinic_address"
                  name="clinic_address"
                  value={formData.clinic_address}
                  onChange={handleChange}
                  placeholder="123 Medical Street"
                  className="input-field"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="label">
                <FiFileText className="inline mr-2" />
                Professional Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows="5"
                maxLength="1000"
                placeholder="Brief description of your experience and expertise (max 1000 characters)"
                className="input-field resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/1000 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Note */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Note:</span> Your application will be reviewed by our admin team. You will receive a notification once your application is approved or rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorApplicationPage;
