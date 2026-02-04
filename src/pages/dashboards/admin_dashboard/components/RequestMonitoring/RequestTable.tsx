import React, { useState } from 'react';
import { DonationRequest } from '../../types';
import { CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

interface RequestTableProps {
  requests: DonationRequest[];
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onViewDetails: (request: DonationRequest) => void;
}

const RequestTable: React.FC<RequestTableProps> = ({ 
  requests, 
  onApprove, 
  onReject, 
  onViewDetails 
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | null>(null);

  const filteredRequests = requests.filter(request => {
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    const flaggedMatch = flaggedFilter === null || request.flagged === flaggedFilter;
    return statusMatch && flaggedMatch;
  });

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          <AlertTriangle size={14} className="mr-1" /> Flagged
        </span>
      );
    }
    
    switch (status) {
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Pending</span>;
      case 'approved':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>;
      case 'fulfilled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Fulfilled</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const calculateTotalCost = (request: DonationRequest) => {
    return request.items.reduce((sum, item) => sum + item.estimatedCost, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Donation Requests</h2>
          <p className="text-sm text-gray-500">Monitor and manage all donation requests</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={flaggedFilter === null ? 'all' : flaggedFilter ? 'flagged' : 'not-flagged'}
            onChange={(e) => {
              if (e.target.value === 'all') setFlaggedFilter(null);
              else if (e.target.value === 'flagged') setFlaggedFilter(true);
              else setFlaggedFilter(false);
            }}
          >
            <option value="all">All Requests</option>
            <option value="flagged">Flagged Only</option>
            <option value="not-flagged">Not Flagged</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institute
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className={`hover:bg-gray-50 ${request.flagged ? 'bg-amber-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.instituteName}
                    {request.flagged && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Flagged
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    <ul className="list-disc list-inside">
                      {request.items.map((item, index) => (
                        <li key={item.id} className={index >= 2 ? 'hidden' : ''}>
                          {item.quantity} {item.unit} {item.name}
                        </li>
                      ))}
                    </ul>
                    {request.items.length > 2 && (
                      <span className="text-xs text-blue-500">+{request.items.length - 2} more items</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{calculateTotalCost(request)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(request)}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredRequests.length}</span> of <span className="font-medium">{requests.length}</span> requests
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestTable;