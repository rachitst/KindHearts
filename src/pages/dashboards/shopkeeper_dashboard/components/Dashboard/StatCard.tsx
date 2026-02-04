import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  change: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  change 
}) => {
  return (
    <div className={`
      bg-white rounded-xl p-6 border border-gray-200 shadow-sm
      hover:shadow-md transition-all duration-300
    `}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg text-${color}-600`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`
          flex items-center text-sm
          ${change.isPositive ? 'text-green-600' : 'text-red-600'}
        `}>
          {change.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {change.value}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;