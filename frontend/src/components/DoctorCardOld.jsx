import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Star } from 'lucide-react';
import StarDisplay from './StarDisplay';
import AvailabilityBadge from './AvailabilityBadge';

/**
 * DoctorCard Component
 * Displays a doctor's summary information in a card format
 */
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Doctor Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
        {doctor.profile_image ? (
          <img
            src={doctor.profile_image}
            alt={doctor.doctor_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {doctor.doctor_name?.charAt(0) || 'D'}
            </div>
          </div>
        )}
        
        {/* Availability Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <AvailabilityBadge status={doctor.availability_status} />
        </div>
      </div>
      
      {/* Doctor Info */}
      <div className="p-5">
        {/* Name and Specialization */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {doctor.doctor_name}
        </h3>
        <p className="text-blue-600 font-medium mb-3">
          {doctor.specialization}
        </p>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarDisplay rating={parseFloat(doctor.rating_avg)} size={18} />
          <span className="text-sm text-gray-600">
            {parseFloat(doctor.rating_avg).toFixed(1)}
          </span>
          {doctor.rating_count > 0 && (
            <span className="text-sm text-gray-500">
              ({doctor.rating_count} {doctor.rating_count === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </div>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Experience */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Briefcase size={16} className="text-gray-400" />
            <span>{doctor.experience_years} years experience</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} className="text-gray-400" />
            <span>{doctor.city}, {doctor.state}</span>
          </div>
          
          {/* Consultation Fee */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <DollarSign size={16} className="text-gray-400" />
            <span>৳{parseFloat(doctor.consultation_fee).toFixed(2)} consultation fee</span>
          </div>
        </div>
        
        {/* Availability Message */}
        {doctor.availability_status === 'unavailable' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Appointment booking coming soon in Sprint 3
            </p>
          </div>
        )}
        
        {/* View Profile Button */}
        <button
          onClick={handleViewProfile}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
