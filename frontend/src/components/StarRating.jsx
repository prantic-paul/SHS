import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * Interactive star rating component with hover effects
 * Allows users to select a rating from 1 to 5 stars
 */
const StarRating = ({ 
  value = 0, 
  onChange, 
  totalStars = 5, 
  size = 24,
  disabled = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (rating) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };
  
  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  const stars = [];
  const activeRating = hoverRating || value;
  
  for (let i = 1; i <= totalStars; i++) {
    const isFilled = i <= activeRating;
    
    stars.push(
      <button
        key={i}
        type="button"
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={`
          transition-all duration-150 ease-in-out
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
          focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded
        `}
        title={`${i} star${i > 1 ? 's' : ''}`}
        aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
      >
        <Star
          size={size}
          className={`
            transition-colors duration-150
            ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            ${!disabled && 'hover:text-yellow-400'}
          `}
        />
      </button>
    );
  }
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {value} {value === 1 ? 'star' : 'stars'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
