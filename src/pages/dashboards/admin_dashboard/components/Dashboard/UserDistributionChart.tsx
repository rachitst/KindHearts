import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface UserDistributionChartProps {
  data: {
    institutes: number;
    donors: number;
    shopkeepers: number;
  };
}

const UserDistributionChart: React.FC<UserDistributionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Institutes', value: data.institutes },
    { name: 'Donors', value: data.donors },
    { name: 'Shopkeepers', value: data.shopkeepers },
  ];

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserDistributionChart; 