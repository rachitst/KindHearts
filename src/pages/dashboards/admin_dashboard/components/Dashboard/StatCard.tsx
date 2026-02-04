import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  change,
  onClick 
}) => {
  return (
    <div 
      className={`rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`${color} p-4 h-full`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium mb-1 opacity-90">{title}</p>
            <h3 className="text-white text-2xl font-bold">{value}</h3>
          </div>
          <div className="rounded-lg bg-white bg-opacity-20 p-2">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {change ? (
            <>
              <div className={`flex items-center ${change.isPositive ? 'text-green-100' : 'text-red-100'}`}>
                {change.isPositive ? (
                  <TrendingUp size={16} className="mr-1" />
                ) : (
                  <TrendingDown size={16} className="mr-1" />
                )}
                <span className="text-sm font-medium">{change.value}%</span>
              </div>
              <span className="text-white text-sm ml-2 opacity-90">vs last period</span>
            </>
          ) : (
            <span className="text-white text-sm opacity-90">No change</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;