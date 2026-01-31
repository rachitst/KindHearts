import React from 'react';
import { DonationRequest } from '../types';
import StatusBadge from './StatusBadge';
import UrgencyBadge from './UrgencyBadge';
import { Calendar, Package, Store } from 'lucide-react';

interface RequestCardProps {
  request: DonationRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all duration-300 hover:shadow-xl hover:scale-102 cursor-pointer"
      onClick={() => {/* Add click handler for card details */}}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">{request.itemName}</h3>
          <p className="text-sm text-gray-500">{request.category}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Package size={16} className="mr-1" />
        <span>Quantity: {request.quantity}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <Calendar size={16} className="mr-1" />
        <span>Requested: {request.createdAt}</span>
      </div>
      
      {request.shopAssigned && (
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Store size={16} className="mr-1" />
          <span>Assigned to: {request.shopAssigned.name}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <UrgencyBadge level={request.urgencyLevel} />
        <span className="text-xs text-gray-500">ID: {request.id}</span>
      </div>
    </div>
  );
};

export default RequestCard;