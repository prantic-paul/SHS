import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Star, ArrowRight, Award } from 'lucide-react';
import StarDisplay from './StarDisplay';
import AvailabilityBadge from './AvailabilityBadge';

/**
 * Professional DoctorCard Component
 * Displays a doctor's summary information with modern design
 */
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };
  
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 hover:-translate-y-2">
      {/* Doctor Image */}
      <div className="relative h-56 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 overflow-hidden">
        {doctor.profile_image ? (
          <img
            src={doctor.profile_image}
            alt={doctor.doctor_name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>
            
            {/* Avatar */}
            <div className="relative w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30 shadow-2xl">
              {doctor.doctor_name?.charAt(0) || 'D'}
            </div>
          </div>
        )}
        
        {/* Availability Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <AvailabilityBadge status={doctor.is_available ? 'available' : 'unavailable'} />
        </div>
        
        {/* Verified Badge - Top Left */}
        {doctor.is_verified && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
            <Award className="w-3 h-3" />
            <span>Verified</span>
          </div>
        )}
      </div>
      
      {/* Doctor Info */}
      <div className="p-6">
        {/* Name and Specialization */}
        <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {doctor.doctor_name}
        </h3>
        <p className="text-lg text-blue-600 font-semibold mb-4">
          {doctor.specialization}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <StarDisplay rating={parseFloat(doctor.rating_avg)} size={20} />
          <span className="text-lg font-bold text-gray-900">
            {parseFloat(doctor.rating_avg).toFixed(1)}
          </span>
          {doctor.rating_count > 0 ? (
            <span className="text-sm text-gray-600">
              ({doctor.rating_count} {doctor.rating_count === 1 ? 'review' : 'reviews'})
            </span>
          ) : (
            <span className="text-sm text-gray-500">(No reviews yet)</span>
          )}
        </div>
        
        {/* Details */}
        <div className="space-y-3 mb-5">
          {/* Experience */}
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase size={16} className="text-blue-600" />
            </div>
            <span className="font-medium">{doctor.experience_years} years experience</span>
          </div>
          
          {/* Practice Location - Primary */}
          {doctor.practice_location && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-green-600" />
              </div>
              <span className="font-medium line-clamp-1" title={doctor.practice_location}>
                {doctor.practice_location}
              </span>
            </div>
          )}
          
          {/* User Location (from User table) */}
          {doctor.user_location && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-indigo-600" />
              </div>
              <span className="font-medium line-clamp-1" title={doctor.user_location}>
                {doctor.user_location}
              </span>
            </div>
          )}
          
          {/* City, State - Secondary Location */}
          {(doctor.city || doctor.state) && (
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                {/* Empty space for alignment */}
              </div>
              <span className="font-normal">
                {doctor.city}{doctor.city && doctor.state && ', '}{doctor.state}
              </span>
            </div>
          )}
          
          {/* Consultation Fee */}
          {doctor.consultation_fee && parseFloat(doctor.consultation_fee) > 0 && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign size={16} className="text-purple-600" />
              </div>
              <span className="font-medium">
                ৳{parseFloat(doctor.consultation_fee).toFixed(0)} consultation
              </span>
            </div>
          )}
        </div>
        
        {/* View Profile Button */}
        <button
          onClick={handleViewProfile}
          className="group/btn w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>View Full Profile</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
