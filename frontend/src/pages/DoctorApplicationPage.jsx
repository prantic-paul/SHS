/**
 * Doctor Application Page
 * Apply to join as a doctor
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import '../styles/doctor.css';

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
    <div className="doctor-container">
      <div className="doctor-card">
        <h2 className="doctor-title">Apply as Doctor</h2>
        <p className="doctor-subtitle">Submit your professional information for verification</p>

        <form onSubmit={handleSubmit} className="doctor-form">
          {error && (
            <div className="error-message">
              {typeof error === 'object' ? (
                <ul>
                  {Object.entries(error).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="license_number">Medical License Number *</label>
            <input
              type="text"
              id="license_number"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              required
              placeholder="BM-12345"
            />
          </div>

          <div className="form-group">
            <label htmlFor="qualification">Qualifications *</label>
            <input
              type="text"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              placeholder="MBBS, MD (Cardiology)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="education">Education *</label>
            <textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Medical college and institutions attended"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialization">Specialization *</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                placeholder="Cardiology"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience_years">Years of Experience *</label>
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
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="practice_location">Practice Location *</label>
            <input
              type="text"
              id="practice_location"
              name="practice_location"
              value={formData.practice_location}
              onChange={handleChange}
              required
              placeholder="Dhaka Medical College Hospital"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Professional Bio *</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows="5"
              maxLength="1000"
              placeholder="Brief description of your experience and expertise (max 1000 characters)"
            />
            <small>{formData.bio.length}/1000 characters</small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
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

        <div className="application-note">
          <p><strong>Note:</strong> Your application will be reviewed by our admin team. You will receive a notification once your application is approved or rejected.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorApplicationPage;
