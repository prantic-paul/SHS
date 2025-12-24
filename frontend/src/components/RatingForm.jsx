import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import StarRating from './StarRating';

/**
 * RatingForm Component
 * Form for submitting doctor ratings with stars and optional review text
 */
const RatingForm = ({ 
  doctorId, 
  initialRating = 0, 
  initialReview = '', 
  onSubmit, 
  onCancel,
  isEditing = false,
  isLoading = false 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReview);
  const [errors, setErrors] = useState({});
  
  const MAX_REVIEW_LENGTH = 200;
  
  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (reviewText && reviewText.length > MAX_REVIEW_LENGTH) {
      newErrors.reviewText = `Review must be ${MAX_REVIEW_LENGTH} characters or less`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      rating,
      review_text: reviewText.trim(),
      doctor: doctorId,
    });
  };
  
  const handleReviewChange = (e) => {
    const value = e.target.value;
    setReviewText(value);
    
    // Clear error when user starts typing
    if (errors.reviewText) {
      setErrors(prev => ({ ...prev, reviewText: null }));
    }
  };
  
  const remainingChars = MAX_REVIEW_LENGTH - reviewText.length;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          size={32}
          disabled={isLoading}
        />
        {errors.rating && (
          <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
            <AlertCircle size={14} />
            <span>{errors.rating}</span>
          </div>
        )}
      </div>
      
      {/* Review Text */}
      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          id="review"
          rows={4}
          value={reviewText}
          onChange={handleReviewChange}
          disabled={isLoading}
          maxLength={MAX_REVIEW_LENGTH}
          placeholder="Share your experience with this doctor..."
          className={`
            w-full px-3 py-2 border rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${errors.reviewText ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        <div className="mt-1 flex items-center justify-between text-sm">
          {errors.reviewText ? (
            <div className="flex items-center gap-1 text-red-600">
              <AlertCircle size={14} />
              <span>{errors.reviewText}</span>
            </div>
          ) : (
            <span className="text-gray-500">Maximum 200 characters</span>
          )}
          <span className={`${remainingChars < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {remainingChars} remaining
          </span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="
            flex items-center gap-2 px-6 py-2.5 
            bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
          "
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="
              px-6 py-2.5 
              bg-gray-200 text-gray-700 font-medium rounded-lg
              hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RatingForm;
