import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * AvailabilityBadge Component
 * Displays doctor's availability status with color-coded badge
 */
const AvailabilityBadge = ({ status = 'unavailable', className = '' }) => {
  const statusConfig = {
    available: {
      label: 'Available',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    busy: {
      label: 'Busy',
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    unavailable: {
      label: 'Not Accepting New Patients',
      icon: XCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
  };
  
  const config = statusConfig[status] || statusConfig.unavailable;
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bgColor} ${className}`}>
      <Icon size={16} className={config.iconColor} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default AvailabilityBadge;
