/**
 * Profile Page
 * View and edit user profile
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import '../styles/profile.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    blood_group: '',
    gender: '',
    age: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfileData(response.data);
      setFormData({
        name: response.data.name || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        blood_group: response.data.blood_group || '',
        gender: response.data.gender || '',
        age: response.data.age || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile(formData);
      setProfileData(response.data);
      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!profileData) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <div className="profile-actions">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
            {profileData.role === 'PATIENT' && !profileData.doctor_profile && (
              <button 
                onClick={() => navigate('/apply-doctor')} 
                className="btn-primary"
              >
                Apply as Doctor
              </button>
            )}
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>

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

        {success && (
          <div className="success-message">
            <p>{success}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="blood_group">Blood Group</label>
                <select
                  id="blood_group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="150"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  setSuccess(null);
                  fetchProfile();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">User ID:</span>
              <span className="value">{profileData.user_id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{profileData.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{profileData.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{profileData.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{profileData.location}</span>
            </div>
            <div className="detail-item">
              <span className="label">Blood Group:</span>
              <span className="value">{profileData.blood_group || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gender:</span>
              <span className="value">{profileData.gender || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Age:</span>
              <span className="value">{profileData.age || 'Not set'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Role:</span>
              <span className="value role-badge">{profileData.role}</span>
            </div>
            <div className="detail-item">
              <span className="label">Account Status:</span>
              <span className={`value status-badge ${profileData.is_active ? 'active' : 'inactive'}`}>
                {profileData.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Member Since:</span>
              <span className="value">{new Date(profileData.created_at).toLocaleDateString()}</span>
            </div>

            {profileData.doctor_profile && (
              <div className="doctor-info">
                <h3>Doctor Information</h3>
                <div className="detail-item">
                  <span className="label">License Number:</span>
                  <span className="value">{profileData.doctor_profile.license_number}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Specialization:</span>
                  <span className="value">{profileData.doctor_profile.specialization}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`value status-badge ${profileData.doctor_profile.status.toLowerCase()}`}>
                    {profileData.doctor_profile.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Verification:</span>
                  <span className={`value status-badge ${profileData.doctor_profile.is_verified ? 'active' : 'inactive'}`}>
                    {profileData.doctor_profile.is_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
