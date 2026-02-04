import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const OrdersChart = () => {
  const data = [
    { name: 'Jan', orders: 65 },
    { name: 'Feb', orders: 59 },
    { name: 'Mar', orders: 80 },
    { name: 'Apr', orders: 81 },
    { name: 'May', orders: 56 },
    { name: 'Jun', orders: 55 },
    { name: 'Jul', orders: 40 }
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ fill: '#4F46E5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart; 