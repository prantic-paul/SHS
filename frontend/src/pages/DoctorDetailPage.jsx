/**
 * Doctor Detail Page
 * Displays complete doctor profile with ratings and review functionality
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Phone,
  Mail,
  Languages,
  Star,
  ArrowLeft,
  Calendar,
  Clock,
} from 'lucide-react';
import { getDoctorById, getDoctorRatings, submitRating, getRatingBreakdown } from '../services/doctorService';
import StarDisplay from '../components/StarDisplay';
import AvailabilityBadge from '../components/AvailabilityBadge';
import RatingForm from '../components/RatingForm';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [ratingsPage, setRatingsPage] = useState(1);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('access_token');
  const currentUserId = isAuthenticated ? JSON.parse(localStorage.getItem('user'))?.id : null;

  useEffect(() => {
    loadDoctorDetails();
    loadRatings();
    loadBreakdown();
  }, [id]);

  useEffect(() => {
    if (ratingsPage > 1) {
      loadRatings();
    }
  }, [ratingsPage]);

  const loadDoctorDetails = async () => {
    try {
      setLoading(true);
      const data = await getDoctorById(id);
      setDoctor(data);
      setError(null);
    } catch (err) {
      setError('Failed to load doctor details. Please try again.');
      console.error('Error loading doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      setRatingsLoading(true);
      const response = await getDoctorRatings(id, { page: ratingsPage, page_size: 5 });
      
      if (ratingsPage === 1) {
        setRatings(response.results || response);
        // Check if current user has already rated
        if (isAuthenticated && currentUserId) {
          const existingRating = (response.results || response).find(
            r => r.user?.id === currentUserId
          );
          setUserRating(existingRating);
        }
      } else {
        setRatings(prev => [...prev, ...(response.results || response)]);
      }
      
      setTotalRatings(response.count || (response.results || response).length);
    } catch (err) {
      console.error('Error loading ratings:', err);
    } finally {
      setRatingsLoading(false);
    }
  };

  const loadBreakdown = async () => {
    try {
      const data = await getRatingBreakdown(id);
      setBreakdown(data);
    } catch (err) {
      console.error('Error loading rating breakdown:', err);
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      const response = await submitRating(id, ratingData);
      
      // Refresh data
      await loadDoctorDetails();
      await loadRatings();
      await loadBreakdown();
      
      setShowRatingForm(false);
      setUserRating(response);
      
      // Show success message (you can replace with a toast notification)
      alert('Thank you for your review!');
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert(err.response?.data?.detail || 'Failed to submit rating. Please try again.');
    }
  };

  const handleLoadMoreRatings = () => {
    setRatingsPage(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Doctor not found'}</p>
          <button
            onClick={() => navigate('/doctors')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  const hasMoreRatings = ratings.length < totalRatings;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Doctors
        </button>

        {/* Doctor Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {doctor.profile_image ? (
                  <img
                    src={doctor.profile_image}
                    alt={doctor.doctor_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-blue-100">
                    <span className="text-4xl font-bold text-white">
                      {doctor.doctor_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {doctor.doctor_name}
                    </h1>
                    <p className="text-xl text-blue-600 font-medium mb-3">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center">
                        <StarDisplay rating={parseFloat(doctor.rating_avg)} size="lg" />
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          {parseFloat(doctor.rating_avg).toFixed(1)}
                        </span>
                        <span className="ml-1 text-gray-500">
                          ({doctor.rating_count} {doctor.rating_count === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    </div>
                  </div>
                  <AvailabilityBadge status={doctor.availability_status} />
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                    <span><strong>{doctor.experience_years}</strong> years of experience</span>
                  </div>
                  
                  {doctor.consultation_fee && parseFloat(doctor.consultation_fee) > 0 && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                      <span>₹{parseFloat(doctor.consultation_fee).toFixed(0)} consultation fee</span>
                    </div>
                  )}
                  
                  {doctor.city && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
                      <span>{doctor.city}{doctor.state && `, ${doctor.state}`}</span>
                    </div>
                  )}
                  
                  {doctor.languages && (
                    <div className="flex items-center text-gray-700">
                      <Languages className="w-5 h-5 mr-3 text-purple-600 flex-shrink-0" />
                      <span>{doctor.languages}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {(doctor.phone || doctor.email || doctor.clinic_address) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctor.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <a href={`tel:${doctor.phone}`} className="hover:text-blue-600 transition-colors">
                        {doctor.phone}
                      </a>
                    </div>
                  )}
                  
                  {doctor.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0" />
                      <a href={`mailto:${doctor.email}`} className="hover:text-blue-600 transition-colors">
                        {doctor.email}
                      </a>
                    </div>
                  )}
                  
                  {doctor.clinic_address && (
                    <div className="flex items-start text-gray-700 sm:col-span-2">
                      <MapPin className="w-5 h-5 mr-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{doctor.clinic_address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Book Appointment Button (Sprint 3 feature) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                disabled
                className="w-full sm:w-auto px-8 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                title="Appointment booking will be available in Sprint 3"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Appointment (Coming in Sprint 3)
              </button>
              <p className="text-sm text-gray-500 mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Online appointment booking will be available soon
              </p>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Breakdown */}
          {breakdown && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Overview</h2>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {parseFloat(doctor.rating_avg).toFixed(1)}
                  </div>
                  <StarDisplay rating={parseFloat(doctor.rating_avg)} size="lg" />
                  <p className="text-gray-600 mt-2">
                    Based on {doctor.rating_count} {doctor.rating_count === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = breakdown.breakdown[star] || 0;
                    const percentage = breakdown.total > 0 
                      ? (count / breakdown.total * 100).toFixed(0)
                      : 0;
                    
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">{star}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className={breakdown ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Patient Reviews ({totalRatings})
                </h2>
                
                {isAuthenticated && !userRating && (
                  <button
                    onClick={() => setShowRatingForm(!showRatingForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {showRatingForm ? 'Cancel' : 'Write a Review'}
                  </button>
                )}
              </div>

              {/* Rating Form */}
              {isAuthenticated && showRatingForm && !userRating && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <RatingForm
                    onSubmit={handleRatingSubmit}
                    onCancel={() => setShowRatingForm(false)}
                  />
                </div>
              )}

              {/* User's own rating (if exists) */}
              {userRating && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Your Review</span>
                    <StarDisplay rating={userRating.rating} />
                  </div>
                  {userRating.review_text && (
                    <p className="text-gray-700 mb-2">{userRating.review_text}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(userRating.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Login message for guests */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-gray-700">
                    Please{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                      log in
                    </button>
                    {' '}to write a review
                  </p>
                </div>
              )}

              {/* Reviews List */}
              {ratings.length > 0 ? (
                <div className="space-y-4">
                  {ratings.filter(r => r.id !== userRating?.id).map((rating) => (
                    <div key={rating.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {rating.user?.first_name || rating.user?.username || 'Anonymous'}
                          </p>
                          <div className="flex items-center mt-1">
                            <StarDisplay rating={rating.rating} size="sm" />
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(rating.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {rating.review_text && (
                        <p className="text-gray-700 mt-2">{rating.review_text}</p>
                      )}
                    </div>
                  ))}

                  {/* Load More Button */}
                  {hasMoreRatings && (
                    <div className="text-center pt-4">
                      <button
                        onClick={handleLoadMoreRatings}
                        disabled={ratingsLoading}
                        className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50"
                      >
                        {ratingsLoading ? 'Loading...' : 'Load More Reviews'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet. Be the first to review this doctor!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
