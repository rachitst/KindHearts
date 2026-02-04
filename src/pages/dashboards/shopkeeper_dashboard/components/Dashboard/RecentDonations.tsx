import React, { useEffect } from 'react';
import { Order } from '../../types';
import { formatDistance, parseISO } from 'date-fns';

interface RecentDonationsProps {
  orders: Order[];
}

const RecentDonations: React.FC<RecentDonationsProps> = ({ orders }) => {
  useEffect(() => {
    if (orders?.length > 0) {
      console.log('Debug - First order:', orders[0]);
      console.log('Debug - Created at:', orders[0]?.createdAt);
      console.log('Debug - All orders:', orders);
    } else {
      console.log('Debug - No orders available');
    }
  }, [orders]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      console.warn('Debug - No date provided');
      return 'Date not available';
    }

    console.log('Debug - Attempting to format date:', dateString);

    try {
      // First try parsing as a timestamp
      if (typeof dateString === 'number' || !isNaN(Number(dateString))) {
        const date = new Date(Number(dateString));
        if (!isNaN(date.getTime())) {
          return formatDistance(date, new Date(), { addSuffix: true });
        }
      }

      // Then try parsing as ISO string
      const date = parseISO(dateString);
      if (!isNaN(date.getTime())) {
        return formatDistance(date, new Date(), { addSuffix: true });
      }

      console.warn('Debug - Invalid date value:', dateString);
      return 'Invalid date';
    } catch (error) {
      console.error('Debug - Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid date';
    }
  };

  // Filter out orders with invalid data
  const validOrders = orders?.filter(order => order && order.id) || [];

  return (
    <div className="space-y-4">
      {validOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg p-4 border border-purple-100 
          hover:border-purple-200 transition-all duration-200 
          shadow-sm hover:shadow group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-auto px-3
                  bg-gradient-to-r from-purple-100 to-purple-50
                  text-purple-700 text-sm font-medium rounded-md
                  border border-purple-200 shadow-sm"
                >
                  #{order.id?.slice(0, 8) || 'N/A'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-700 
                  transition-colors duration-200"
                >
                  {order.instituteName || 'Unknown Institute'}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${getStatusColor(order.status)}
              `}>
                {order.status || 'unknown'}
              </span>
              <span className="text-sm font-medium text-purple-900">
                ${order.totalAmount?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      ))}
      {validOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No orders available
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-blue-100 text-blue-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'packaging':
      return 'bg-purple-100 text-purple-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default RecentDonations; 