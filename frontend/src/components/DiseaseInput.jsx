/**
 * Disease Input Component with Autocomplete
 * Allows doctors to select diseases they treat from a predefined list
 */
import { useState, useEffect, useRef } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

const DiseaseInput = ({ value = '', onChange, disabled = false }) => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Load diseases from file
  useEffect(() => {
    const loadDiseases = async () => {
      try {
        const response = await fetch('/src/data/diseases_list.txt');
        const text = await response.text();
        const diseaseList = text
          .split('\n')
          .map((disease) => disease.trim())
          .filter((disease) => disease.length > 0);
        setDiseases(diseaseList);
      } catch (error) {
        console.error('Error loading diseases:', error);
      }
    };
    loadDiseases();
  }, []);

  // Initialize selected diseases from value prop
  useEffect(() => {
    if (value && typeof value === 'string') {
      const diseasesArray = value
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d.length > 0);
      setSelectedDiseases(diseasesArray);
    }
  }, [value]);

  // Filter diseases based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = diseases.filter(
        (disease) =>
          disease.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedDiseases.includes(disease)
      );
      setFilteredDiseases(filtered.slice(0, 10)); // Show top 10 matches
    } else {
      setFilteredDiseases([]);
    }
  }, [searchTerm, diseases, selectedDiseases]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddDisease = (disease) => {
    if (!selectedDiseases.includes(disease)) {
      const newDiseases = [...selectedDiseases, disease];
      setSelectedDiseases(newDiseases);
      onChange(newDiseases.join(', '));
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleRemoveDisease = (diseaseToRemove) => {
    const newDiseases = selectedDiseases.filter((d) => d !== diseaseToRemove);
    setSelectedDiseases(newDiseases);
    onChange(newDiseases.join(', '));
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text">
          Diseases Treated <span className="text-red-500">*</span>
        </span>
      </label>

      {/* Selected Diseases */}
      {selectedDiseases.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {selectedDiseases.map((disease, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {disease}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveDisease(disease)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input with Autocomplete */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            placeholder="Type to search for diseases..."
            className="input-field pr-10"
          />
          <FiChevronDown
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Dropdown */}
        {showDropdown && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredDiseases.length > 0 ? (
              <ul className="py-1">
                {filteredDiseases.map((disease, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleAddDisease(disease)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                    >
                      {disease}
                    </button>
                  </li>
                ))}
              </ul>
            ) : searchTerm.trim() ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No diseases found matching "{searchTerm}"
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Start typing to search for diseases...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 mt-2">
        Search and select all diseases you provide treatment for. Selected:{' '}
        <span className="font-semibold text-blue-600">
          {selectedDiseases.length}
        </span>
      </p>
    </div>
  );
};

export default DiseaseInput;
