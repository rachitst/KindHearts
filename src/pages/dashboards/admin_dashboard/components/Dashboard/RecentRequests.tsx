import React from 'react';
import { DonationRequest } from '../../types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface RecentRequestsProps {
  requests: DonationRequest[];
}

const RecentRequests: React.FC<RecentRequestsProps> = ({ requests }) => {
  const getStatusIcon = (status: string, flagged: boolean) => {
    if (flagged) return <AlertTriangle size={18} className="text-amber-500" />;
    
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-blue-500" />;
      case 'approved':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'fulfilled':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'rejected':
        return <AlertTriangle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'fulfilled':
        return 'Fulfilled';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string, flagged: boolean) => {
    if (flagged) return 'bg-amber-100 text-amber-800';
    
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Requests</h3>
        <button className="text-blue-600 text-sm hover:underline">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institute
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Cost
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.slice(0, 5).map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{request.instituteName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {request.items.length > 1 
                      ? `${request.items[0].name} +${request.items.length - 1} more` 
                      : request.items[0].name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₹{request.items.reduce((sum, item) => sum + item.estimatedCost, 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status, request.flagged)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(request.status, request.flagged)}
                      <span className="ml-1">{request.flagged ? 'Flagged' : getStatusText(request.status)}</span>
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentRequests;