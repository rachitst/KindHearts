import React from 'react';
import { RequestStatus } from '../types';
import { CheckCircle, Clock, Truck, Package } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          icon: <Clock size={14} className="mr-1" />,
          classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          animation: 'animate-pulse'
        };
      case 'processing':
        return {
          icon: <Truck size={14} className="mr-1" />,
          classes: 'bg-blue-100 text-blue-800 border border-blue-200',
          animation: ''
        };
      case 'delivered':
        return {
          icon: <Package size={14} className="mr-1" />,
          classes: 'bg-green-100 text-green-800 border border-green-200',
          animation: ''
        };
      case 'completed':
        return {
          icon: <CheckCircle size={14} className="mr-1" />,
          classes: 'bg-purple-100 text-purple-800 border border-purple-200',
          animation: ''
        };
      default:
        return {
          icon: null,
          classes: 'bg-gray-100 text-gray-800 border border-gray-200',
          animation: ''
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        transition-all duration-300 hover:shadow-md
        ${config.classes} ${config.animation}
      `}
    >
      {config.icon}
      {status}
    </span>
  );
};

export default StatusBadge;