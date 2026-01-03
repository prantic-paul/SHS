/**
 * Doctor Recommendation Component
 * Allows users to input symptoms and get doctor recommendations
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiAlertCircle, FiCheck, FiChevronDown, FiPlus, FiLoader, FiMapPin, FiStar, FiDollarSign, FiExternalLink } from 'react-icons/fi';
import axios from 'axios';
import symptomsData from '../data/symptoms_list.txt?raw';

const DoctorRecommendation = ({ onClose }) => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load symptoms from file
  useEffect(() => {
    const symptomsList = symptomsData
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    setAllSymptoms(symptomsList);
    setSymptoms(symptomsList);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter symptoms based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSymptoms(allSymptoms);
    } else {
      const filtered = allSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSymptoms(filtered);
    }
  }, [searchQuery, allSymptoms]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSymptomSelect = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearchQuery('');
    setShowDropdown(false);
    searchInputRef.current?.focus();
  };

  const handleSymptomRemove = (symptomToRemove) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomToRemove));
  };

  const handleGetRecommendations = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);
    setRecommendedDoctors([]);

    try {
      // Step 1: Predict disease from symptoms
      const predictionResponse = await axios.post('http://localhost:8002/predict/', {
        symptoms: selectedSymptoms
      });

      const predictedDisease = predictionResponse.data.prediction.disease;
      const confidence = predictionResponse.data.prediction.confidence;

      setPrediction({
        disease: predictedDisease,
        confidence: confidence
      });

      // Step 2: Get doctor recommendations from backend
      const token = localStorage.getItem('access_token');
      const recommendationResponse = await axios.post(
        'http://localhost:8000/api/v1/doctors/recommend/',
        { disease: predictedDisease },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRecommendedDoctors(recommendationResponse.data.doctors || []);

      if (recommendationResponse.data.doctors.length === 0) {
        setError(`No doctors found treating "${predictedDisease}". Please try searching manually.`);
      }

    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 401) {
        setError('Please login to get doctor recommendations');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to get doctor recommendations. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorClick = (doctorId) => {
    // Open doctor profile in new tab instead of navigating away from recommendation modal
    window.open(`/doctors/${doctorId}`, '_blank');
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Get Doctor Recommendation</h2>
              <p className="text-primary-100">Tell us about your symptoms and we'll recommend the right doctors</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Info Alert */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-start">
              <FiAlertCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-900">
                  Select the symptoms you're experiencing. You can add multiple symptoms to get more accurate recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Selected Symptoms ({selectedSymptoms.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <FiCheck className="mr-2" />
                    {symptom}
                    <button
                      onClick={() => handleSymptomRemove(symptom)}
                      className="ml-2 hover:bg-primary-200 rounded-full p-1 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="mb-6">
            <label htmlFor="symptomSearch" className="block text-sm font-semibold text-gray-700 mb-2">
              Search and Add Symptoms
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  id="symptomSearch"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder="Type to search symptoms... (e.g., fever, headache, cough)"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && symptoms.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                  {symptoms.slice(0, 50).map((symptom, index) => (
                    <button
                      key={index}
                      onClick={() => handleSymptomSelect(symptom)}
                      disabled={selectedSymptoms.includes(symptom)}
                      className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex items-center justify-between ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="flex-1">{symptom}</span>
                      {selectedSymptoms.includes(symptom) ? (
                        <FiCheck className="text-green-500 ml-2" />
                      ) : (
                        <FiPlus className="text-primary-500 ml-2" />
                      )}
                    </button>
                  ))}
                  {symptoms.length > 50 && (
                    <div className="px-4 py-2 text-sm text-gray-500 bg-gray-50 text-center">
                      Showing 50 of {symptoms.length} results. Keep typing to narrow down...
                    </div>
                  )}
                </div>
              )}

              {showDropdown && symptoms.length === 0 && searchQuery && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
                  No symptoms found matching "{searchQuery}"
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Total symptoms available: {allSymptoms.length}
            </p>
          </div>

          {/* Common Symptoms Quick Add */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Quick Add Common Symptoms
            </label>
            <div className="flex flex-wrap gap-2">
              {['fever', 'headache', 'cough', 'sore throat', 'fatigue', 'nausea', 'dizziness', 'chest pain'].map((symptom) => {
                const fullSymptom = allSymptoms.find(s => s.toLowerCase().includes(symptom));
                const isSelected = fullSymptom && selectedSymptoms.includes(fullSymptom);
                
                return (
                  <button
                    key={symptom}
                    onClick={() => fullSymptom && handleSymptomSelect(fullSymptom)}
                    disabled={isSelected}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 border-2 border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {isSelected && <FiCheck className="inline mr-1" />}
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start">
                <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Disease Prediction Result */}
          {prediction && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Predicted Disease</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-blue-600">{prediction.disease}</h4>
                    <p className="text-gray-600 mt-1">
                      Confidence: <span className="font-semibold text-green-600">
                        {(prediction.confidence * 100).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                  <FiCheck className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                ⚠️ This is an AI prediction. Please consult with a qualified doctor for proper diagnosis.
              </p>
            </div>
          )}

          {/* Recommended Doctors */}
          {recommendedDoctors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recommended Doctors ({recommendedDoctors.length})
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                💡 Click on any doctor card to view their full profile in a new tab
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recommendedDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorClick(doctor.id)}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer relative group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {doctor.profile_image ? (
                          <img
                            src={doctor.profile_image}
                            alt={doctor.user?.full_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                            {doctor.user?.full_name?.charAt(0) || 'D'}
                          </div>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              Dr. {doctor.user?.full_name}
                              <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                            </h4>
                            <p className="text-primary-600 font-medium">{doctor.specialization}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          {doctor.experience_years && (
                            <span>📋 {doctor.experience_years} years</span>
                          )}
                          {doctor.city && (
                            <span className="flex items-center gap-1">
                              <FiMapPin className="w-4 h-4" />
                              {doctor.city}
                            </span>
                          )}
                          {doctor.rating_avg > 0 && (
                            <span className="flex items-center gap-1">
                              <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              {doctor.rating_avg}
                            </span>
                          )}
                          {doctor.consultation_fee && (
                            <span className="flex items-center gap-1">
                              <FiDollarSign className="w-4 h-4" />
                              ₹{doctor.consultation_fee}
                            </span>
                          )}
                        </div>

                        {/* Diseases Treated */}
                        {doctor.diseases_treated && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {doctor.diseases_treated.split(',').slice(0, 4).map((disease, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  disease.trim().toLowerCase() === prediction.disease.toLowerCase()
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {disease.trim()}
                              </span>
                            ))}
                            {doctor.diseases_treated.split(',').length > 4 && (
                              <span className="px-2 py-1 text-xs text-gray-500">
                                +{doctor.diseases_treated.split(',').length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGetRecommendations}
              disabled={selectedSymptoms.length === 0 || loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                selectedSymptoms.length === 0 || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FiSearch className="mr-2" />
                  Get Doctor Recommendations
                  {selectedSymptoms.length > 0 && (
                    <span className="ml-2 bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {selectedSymptoms.length}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRecommendation;
