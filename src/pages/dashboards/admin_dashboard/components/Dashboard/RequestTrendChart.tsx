import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const RequestTrendChart: React.FC = () => {
  // Sample data - replace with real data
  const data = [
    { name: 'Mon', pending: 4, completed: 3, flagged: 1 },
    { name: 'Tue', pending: 3, completed: 5, flagged: 2 },
    { name: 'Wed', pending: 5, completed: 4, flagged: 0 },
    { name: 'Thu', pending: 6, completed: 3, flagged: 1 },
    { name: 'Fri', pending: 4, completed: 6, flagged: 2 },
    { name: 'Sat', pending: 3, completed: 4, flagged: 1 },
    { name: 'Sun', pending: 2, completed: 5, flagged: 0 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="flagged"
            stroke="#ef4444"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestTrendChart; 