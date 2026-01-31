import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color?: string;
  textColor?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  count, 
  icon, 
  color = "bg-[#0f0b52]",
  textColor = "text-white",
  onClick 
}) => {
  return (
    <div 
      className={`${color} rounded-xl shadow-sm p-6 cursor-pointer transition-transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`${textColor}`}>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <div className="bg-white/10 rounded-full p-3">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;