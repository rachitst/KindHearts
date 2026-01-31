import React from 'react';
import { UrgencyLevel } from '../types';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level }) => {
  const getUrgencyColor = () => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor()}`}>
      {level}
    </span>
  );
};

export default UrgencyBadge;