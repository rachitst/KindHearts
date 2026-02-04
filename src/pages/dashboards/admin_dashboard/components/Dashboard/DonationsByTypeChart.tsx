import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DonationsByTypeChart: React.FC = () => {
  // Sample data - replace with real data
  const data = [
    { name: 'Food', amount: 45000 },
    { name: 'Clothing', amount: 35000 },
    { name: 'Education', amount: 28000 },
    { name: 'Healthcare', amount: 52000 },
    { name: 'Other', amount: 19000 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`₹${value}`, 'Amount']}
          />
          <Legend />
          <Bar dataKey="amount" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationsByTypeChart; 