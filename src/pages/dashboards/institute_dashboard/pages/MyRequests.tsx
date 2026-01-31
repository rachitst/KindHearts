import React, { useState, useEffect } from 'react';
import { mockRequests, getAllUserRequests } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import { Search, Filter, ExternalLink, X, Package, Clock, Store, MessageSquare, Star } from 'lucide-react';
import type { DonationRequest } from '../data/mockData';

const MyRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [requests, setRequests] = useState<DonationRequest[]>([]);

  useEffect(() => {
    // Load all requests when component mounts
    const loadRequests = () => {
      const allRequests = getAllUserRequests();
      setRequests(allRequests);
    };
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || request.status === statusFilter;
    const matchesCategory = categoryFilter === '' || request.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleShopClick = (shop: any) => {
    // You can add shop details modal here if needed
    console.log('Shop clicked:', shop);
  };

  const handleAutoFill = () => {
    // Sample data for auto-filling
    const sampleData = {
      itemName: "School Supplies Bundle",
      category: "Education Material",
      quantity: 50,
      urgencyLevel: "Medium",
      specifications: "Notebooks, pens, pencils, and other basic stationery items",
      expectedDeliveryDate: new Date().toISOString().split('T')[0], // Today's date
      requesterName: "John Doe",
      requesterPhone: "1234567890",
      requesterEmail: "john.doe@example.com",
      additionalNotes: "Please ensure all items are of standard quality"
    };

    // Update form data with sample data
    setFormData(prevData => ({
      ...prevData,
      ...sampleData
    }));
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests & Status</h1>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by item name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-400 mr-2" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Education Material">Education Material</option>
              </select>
            </div>
            
            {/* Add Auto Fill Button */}
            <button
              onClick={handleAutoFill}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#100e92] hover:bg-[#0d0940] transition-colors"
            >
              <span>Auto Fill Form</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UrgencyBadge level={request.urgencyLevel} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.shopAssigned ? (
                        <button 
                          onClick={() => handleShopClick(request.shopAssigned)}
                          className="text-blue-600 hover:text-blue-800 flex items-center hover:underline"
                        >
                          {request.shopAssigned.name}
                        </button>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                      >
                        <span>Details</span>
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                    No requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#100e92] text-white rounded-t-lg">
              <div>
                <h2 className="text-xl font-semibold">Request Details</h2>
                <p className="text-sm text-white/80">ID: {selectedRequest.id}</p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Request Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Package size={18} className="text-[#100e92]" />
                    Request Information
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Item Name</p>
                      <p className="font-medium">{selectedRequest.itemName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-medium">{selectedRequest.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Quantity</p>
                      <p className="font-medium">{selectedRequest.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Urgency Level</p>
                      <UrgencyBadge level={selectedRequest.urgencyLevel} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Specifications</p>
                      <p className="font-medium">{selectedRequest.specifications || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[#100e92]" />
                    Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created On</p>
                      <p className="font-medium">{selectedRequest.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                      <p className="font-medium">{selectedRequest.updatedAt}</p>
                    </div>
                    {selectedRequest.deliveryDate && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Delivery Date</p>
                        <p className="font-medium">{selectedRequest.deliveryDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shop Information - Only show if assigned */}
                {selectedRequest.shopAssigned && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Store size={18} className="text-[#100e92]" />
                      Shop Information
                    </h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Shop Name</p>
                        <p className="font-medium">{selectedRequest.shopAssigned.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                        <p className="font-medium">{selectedRequest.shopAssigned.contactPerson}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium">{selectedRequest.shopAssigned.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-medium">{selectedRequest.shopAssigned.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Information - Only show if feedback exists */}
                {selectedRequest.feedback && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare size={18} className="text-[#100e92]" />
                      Feedback
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < selectedRequest.feedback!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                          <span className="ml-2 font-medium">{selectedRequest.feedback.rating}/5</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Comment</p>
                        <p className="font-medium">{selectedRequest.feedback.comment}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                        <p className="font-medium">{selectedRequest.feedback.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;