import React from 'react';
import { Star, StarHalf } from 'lucide-react';

/**
 * StarDisplay Component
 * Read-only star display for showing average ratings
 * Shows filled, half-filled, and empty stars based on rating value
 */
const StarDisplay = ({ rating = 0, totalStars = 5, size = 20, className = '' }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Render filled stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`filled-${i}`}
        size={size}
        className="fill-yellow-400 text-yellow-400"
      />
    );
  }
  
  // Render half star if needed
  if (hasHalfStar && fullStars < totalStars) {
    stars.push(
      <StarHalf
        key="half"
        size={size}
        className="fill-yellow-400 text-yellow-400"
      />
    );
  }
  
  // Render empty stars
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star
        key={`empty-${i}`}
        size={size}
        className="text-gray-300"
      />
    );
  }
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars}
    </div>
  );
};

export default StarDisplay;
