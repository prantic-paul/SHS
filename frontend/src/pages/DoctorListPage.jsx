import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Loader } from 'lucide-react';
import Navbar from '../components/Navbar';
import DoctorCard from '../components/DoctorCard';
import { getDoctors, getSpecializations } from '../services/doctorService';

/**
 * DoctorListPage Component
 * Sprint 2: Doctor Search & Discovery
 * Features: List, Search, Filter, Sort doctors
 */
const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    min_experience: '',
    max_experience: '',
    min_rating: '',
    availability_status: '',
  });
  const [sortBy, setSortBy] = useState('-rating_avg');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Load specializations on mount
  useEffect(() => {
    loadSpecializations();
  }, []);
  
  // Load doctors when filters change
  useEffect(() => {
    loadDoctors();
  }, [searchTerm, filters, sortBy, currentPage]);
  
  const loadSpecializations = async () => {
    try {
      const data = await getSpecializations();
      setSpecializations(data);
    } catch (err) {
      console.error('Failed to load specializations:', err);
    }
  };
  
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        search: searchTerm,
        ordering: sortBy,
        page: currentPage,
        page_size: 12,
        ...filters,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      const response = await getDoctors(params);
      
      setDoctors(response.results || response);
      setTotalCount(response.count || response.length);
      setTotalPages(response.total_pages || 1);
    } catch (err) {
      setError('Failed to load doctors. Please try again.');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      city: '',
      min_experience: '',
      max_experience: '',
      min_rating: '',
      availability_status: '',
    });
    setSearchTerm('');
    setSortBy('-rating_avg');
    setCurrentPage(1);
  };
  
  const hasActiveFilters = () => {
    return searchTerm || Object.values(filters).some(value => value !== '');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Find a Doctor
            </h1>
            <p className="text-gray-600">
              Search and discover qualified doctors near you
            </p>
          </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-6 py-3 rounded-lg font-medium flex items-center gap-2
                ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                transition-colors duration-200
              `}
            >
              <Filter size={20} />
              Filters
              {hasActiveFilters() && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  !
                </span>
              )}
            </button>
            
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 flex items-center gap-2 transition-colors duration-200"
              >
                <X size={20} />
                Clear
              </button>
            )}
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Specialization Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec.specialization} value={spec.specialization}>
                      {spec.specialization} ({spec.count})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Experience Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min. Experience (years)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={filters.min_experience}
                  onChange={(e) => handleFilterChange('min_experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Min Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min. Rating
                </label>
                <select
                  value={filters.min_rating}
                  onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
              
              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={filters.availability_status}
                  onChange={(e) => handleFilterChange('availability_status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="-rating_avg">Highest Rated</option>
                  <option value="rating_avg">Lowest Rated</option>
                  <option value="-experience_years">Most Experienced</option>
                  <option value="experience_years">Least Experienced</option>
                  <option value="consultation_fee">Lowest Fee</option>
                  <option value="-consultation_fee">Highest Fee</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Summary */}
        {!loading && (
          <div className="mb-6 text-gray-600">
            Found <span className="font-semibold">{totalCount}</span> doctor{totalCount !== 1 ? 's' : ''}
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-600" size={48} />
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadDoctors}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Doctors Grid */}
        {!loading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
        
        {/* No Results */}
        {!loading && !error && doctors.length === 0 && (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No doctors found matching your criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default DoctorListPage;
