/**
 * Doctor Recommendation Component
 * Allows users to input symptoms and get doctor recommendations
 */
import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiAlertCircle, FiCheck, FiChevronDown, FiPlus } from 'react-icons/fi';
import symptomsData from '../data/symptoms_list.txt?raw';

const DoctorRecommendation = ({ onClose }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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

  const handleGetRecommendations = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    // TODO: Call API to get doctor recommendations
    console.log('Getting recommendations for symptoms:', selectedSymptoms);
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
              disabled={selectedSymptoms.length === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                selectedSymptoms.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <FiSearch className="mr-2" />
              Get Doctor Recommendations
              {selectedSymptoms.length > 0 && (
                <span className="ml-2 bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {selectedSymptoms.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRecommendation;
