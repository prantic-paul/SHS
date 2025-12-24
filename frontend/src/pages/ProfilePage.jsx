/**
 * Profile Page
 * View and edit user profile with enhanced doctor section
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import { FiEdit, FiLogOut, FiUserPlus, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiAward, FiSave, FiX, FiBriefcase, FiBook, FiStar } from 'react-icons/fi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDoctorEditing, setIsDoctorEditing] = useState(false);
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
  const [doctorFormData, setDoctorFormData] = useState({
    qualification: '',
    education: '',
    specialization: '',
    practice_location: '',
    experience_years: '',
    bio: '',
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
      if (response.data.doctor_profile) {
        setDoctorFormData({
          qualification: response.data.doctor_profile.qualification || '',
          education: response.data.doctor_profile.education || '',
          specialization: response.data.doctor_profile.specialization || '',
          practice_location: response.data.doctor_profile.practice_location || '',
          experience_years: response.data.doctor_profile.experience_years || '',
          bio: response.data.doctor_profile.bio || '',
        });
      }
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

  const handleDoctorChange = (e) => {
    setDoctorFormData({
      ...doctorFormData,
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

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateDoctorProfile(doctorFormData);
      // Refresh profile to get updated doctor data
      await fetchProfile();
      setSuccess('Doctor profile updated successfully!');
      setIsDoctorEditing(false);
    } catch (err) {
      console.error('Doctor update error:', err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        'Failed to update doctor profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfilePictureUpload = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Uploading file:', file.name);
      const response = await userService.updateProfile({ profile_picture: file });
      console.log('Upload response:', response);
      
      // Update both profile data and auth context
      setProfileData(response.data);
      updateUser(response.data);
      
      // Force update localStorage to ensure persistence
      localStorage.setItem('user', JSON.stringify(response.data));
      
      console.log('Profile data updated, profile_picture:', response.data.profile_picture);
      
      setSuccess('Profile picture updated successfully!');
      
      // Refresh profile data to ensure we have the latest from server
      await fetchProfile();
    } catch (err) {
      console.error('Profile picture upload error:', err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        'Failed to upload profile picture'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorProfilePictureUpload = async (file) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateDoctorProfile({ profile_image: file });
      
      // Refresh profile to get updated doctor data
      await fetchProfile();
      
      setSuccess('Doctor profile picture updated successfully!');
    } catch (err) {
      console.error('Doctor profile picture upload error:', err);
      setError(
        err.response?.data?.errors || 
        err.response?.data?.message || 
        'Failed to upload doctor profile picture'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
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
            
            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-4xl font-extrabold mb-2">My Profile</h1>
                <p className="text-blue-100 text-lg">Manage your account information</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {profileData.role === 'PATIENT' && !profileData.doctor_profile && (
                  <button 
                    onClick={() => navigate('/apply-doctor')} 
                    className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-md"
                  >
                    <FiUserPlus className="mr-2" />
                    Apply as Doctor
                  </button>
                )}
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
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

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - User Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <FiEdit className="mr-2" />
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">
                        <FiUser className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="label">
                        <FiPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="label">
                      <FiMapPin className="inline mr-2" />
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="blood_group" className="label">
                        Blood Group
                      </label>
                      <select
                        id="blood_group"
                        name="blood_group"
                        value={formData.blood_group}
                        onChange={handleChange}
                        className="input-field"
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

                    <div>
                      <label htmlFor="gender" className="label">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="age" className="label">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="150"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button 
                      type="submit" 
                      className="btn-primary inline-flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary inline-flex items-center justify-center"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccess(null);
                        fetchProfile();
                      }}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FiUser className="text-primary-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-900 font-medium">{profileData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FiMail className="text-primary-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900 font-medium">{profileData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FiPhone className="text-primary-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900 font-medium">{profileData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FiMapPin className="text-primary-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900 font-medium">{profileData.location}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                      <p className="text-lg font-semibold text-gray-900">{profileData.blood_group || 'Not set'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="text-lg font-semibold text-gray-900">{profileData.gender || 'Not set'}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Age</p>
                      <p className="text-lg font-semibold text-gray-900">{profileData.age || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Profile Section */}
            {profileData.doctor_profile && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <FiAward className="text-blue-600 text-2xl" />
                    </div>
                    Doctor Profile
                  </h2>
                  {!isDoctorEditing && profileData.doctor_profile.status === 'APPROVED' && (
                    <button 
                      onClick={() => setIsDoctorEditing(true)} 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadge(profileData.doctor_profile.status)}`}>
                    Status: {profileData.doctor_profile.status}
                  </span>
                  {profileData.doctor_profile.is_verified && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                      <FiShield className="mr-1" />
                      Verified Doctor
                    </span>
                  )}
                  {profileData.doctor_profile.rating_avg > 0 && (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <FiStar className="mr-1" />
                      {profileData.doctor_profile.rating_avg} / 5.0
                    </span>
                  )}
                </div>

                {isDoctorEditing ? (
                  <form onSubmit={handleDoctorSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="specialization" className="label">
                          <FiBriefcase className="inline mr-2" />
                          Specialization
                        </label>
                        <input
                          type="text"
                          id="specialization"
                          name="specialization"
                          value={doctorFormData.specialization}
                          onChange={handleDoctorChange}
                          className="input-field"
                          placeholder="e.g., Cardiology"
                        />
                      </div>

                      <div>
                        <label htmlFor="experience_years" className="label">
                          <FiCalendar className="inline mr-2" />
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          id="experience_years"
                          name="experience_years"
                          value={doctorFormData.experience_years}
                          onChange={handleDoctorChange}
                          min="0"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="qualification" className="label">
                        <FiAward className="inline mr-2" />
                        Qualification
                      </label>
                      <input
                        type="text"
                        id="qualification"
                        name="qualification"
                        value={doctorFormData.qualification}
                        onChange={handleDoctorChange}
                        className="input-field"
                        placeholder="e.g., MBBS, MD"
                      />
                    </div>

                    <div>
                      <label htmlFor="education" className="label">
                        <FiBook className="inline mr-2" />
                        Education
                      </label>
                      <textarea
                        id="education"
                        name="education"
                        value={doctorFormData.education}
                        onChange={handleDoctorChange}
                        rows="3"
                        className="input-field"
                        placeholder="Educational background and institutions"
                      />
                    </div>

                    <div>
                      <label htmlFor="practice_location" className="label">
                        <FiMapPin className="inline mr-2" />
                        Practice Location
                      </label>
                      <input
                        type="text"
                        id="practice_location"
                        name="practice_location"
                        value={doctorFormData.practice_location}
                        onChange={handleDoctorChange}
                        className="input-field"
                        placeholder="Hospital/Clinic name and location"
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="label">
                        Professional Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={doctorFormData.bio}
                        onChange={handleDoctorChange}
                        rows="4"
                        maxLength="1000"
                        className="input-field"
                        placeholder="Tell patients about yourself and your practice..."
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {doctorFormData.bio.length} / 1000 characters
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button 
                        type="submit" 
                        className="btn-primary inline-flex items-center justify-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary inline-flex items-center justify-center"
                        onClick={() => {
                          setIsDoctorEditing(false);
                          setError(null);
                          setSuccess(null);
                          fetchProfile();
                        }}
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiShield className="text-blue-600 mr-2" />
                          <p className="text-sm text-blue-600 font-semibold">License Number</p>
                        </div>
                        <p className="text-gray-900 font-bold">{profileData.doctor_profile.license_number}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiBriefcase className="text-blue-600 mr-2" />
                          <p className="text-sm text-blue-600 font-semibold">Specialization</p>
                        </div>
                        <p className="text-gray-900 font-bold">{profileData.doctor_profile.specialization}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiAward className="text-blue-600 mr-2" />
                          <p className="text-sm text-blue-600 font-semibold">Qualification</p>
                        </div>
                        <p className="text-gray-900 font-bold">{profileData.doctor_profile.qualification}</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiCalendar className="text-blue-600 mr-2" />
                          <p className="text-sm text-blue-600 font-semibold">Experience</p>
                        </div>
                        <p className="text-gray-900 font-bold">
                          {profileData.doctor_profile.experience_years ? 
                            `${profileData.doctor_profile.experience_years} years` : 
                            'Not specified'}
                        </p>
                      </div>
                    </div>

                    {profileData.doctor_profile.education && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiBook className="text-blue-600 mr-2" />
                          <p className="text-sm text-blue-600 font-semibold">Education</p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{profileData.doctor_profile.education}</p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <FiMapPin className="text-purple-600 mr-2" />
                        <p className="text-sm text-purple-600 font-semibold">Practice Location</p>
                      </div>
                      <p className="text-gray-900 font-medium">{profileData.doctor_profile.practice_location}</p>
                    </div>

                    {profileData.doctor_profile.bio && (
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <FiUser className="text-green-600 mr-2" />
                          <p className="text-sm text-green-600 font-semibold">Professional Bio</p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line">{profileData.doctor_profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* User Profile Picture Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">User Profile Picture</h3>
              <p className="text-xs text-gray-500 mb-4">This appears in your account settings</p>
              {console.log('Rendering ProfilePictureUpload with:', profileData.profile_picture)}
              <ProfilePictureUpload
                currentImage={profileData.profile_picture ? `http://localhost:8000${profileData.profile_picture}` : null}
                onUpload={handleProfilePictureUpload}
                loading={loading}
              />
            </div>

            {/* Doctor Profile Picture Upload - Only for doctors */}
            {profileData.doctor_profile && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Doctor Profile Picture</h3>
                <p className="text-xs text-gray-500 mb-4">This appears in doctor search results</p>
                <ProfilePictureUpload
                  currentImage={
                    profileData.doctor_profile.profile_image 
                      ? `http://localhost:8000${profileData.doctor_profile.profile_image}` 
                      : (profileData.profile_picture ? `http://localhost:8000${profileData.profile_picture}` : null)
                  }
                  onUpload={handleDoctorProfilePictureUpload}
                  loading={loading}
                />
              </div>
            )}

            {/* Account Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FiShield className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="text-sm font-semibold text-gray-900">{profileData.user_id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiCalendar className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(profileData.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                      {profileData.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      profileData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {profileData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
