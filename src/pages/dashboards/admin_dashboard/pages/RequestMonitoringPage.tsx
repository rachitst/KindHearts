import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../../config/env';
import { DonationRequest } from '../types';
import RequestTable from '../components/RequestMonitoring/RequestTable';
import Header from '../components/Header';
import { Loader2 } from 'lucide-react';

const RequestMonitoringPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<DonationRequest[]>([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/admin/requests`);
      if (response.data.success) {
        // Map backend requests to frontend DonationRequest type
        const mappedRequests = response.data.requests.map((req: any) => ({
          id: req._id,
          instituteName: req.requesterName || req.name || 'Unknown Institute',
          items: [{ 
            name: req.itemName, 
            quantity: req.quantity,
            estimatedCost: req.estimatedCost || 0 // Ensure estimatedCost is mapped
          }],
          status: req.status ? req.status.toLowerCase() : 'pending',
          urgency: req.urgency,
          createdAt: req.createdAt,
          location: req.deliveryAddress || 'Unknown',
          description: req.description || '',
          ...req
        }));
        setRequests(mappedRequests);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showNotification('Failed to fetch requests', 'error');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await axios.put(`${config.apiBaseUrl}/api/admin/requests/${requestId}`, {
        status: 'Processing'
      });
      
      // Update requests state locally or refetch
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: 'processing' }
            : request
        )
      );

      // Close modal
      setSelectedRequest(null);
      showNotification('Request approved successfully', 'success');
    } catch (error) {
      console.error('Error approving request:', error);
      showNotification('Failed to approve request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      await axios.put(`${config.apiBaseUrl}/api/admin/requests/${requestId}`, {
        status: 'Cancelled' // Mapping rejected to Cancelled
      });
      
      // Update requests state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: 'cancelled' }
            : request
        )
      );

      // Close modal
      setSelectedRequest(null);
      showNotification('Request rejected', 'success');
    } catch (error) {
      console.error('Error rejecting request:', error);
      showNotification('Failed to reject request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white z-50 transition-opacity duration-500`;
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);

    setTimeout(() => {
      notificationDiv.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notificationDiv), 500);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Request Monitoring</h1>
            <RequestTable 
              requests={requests}
              onViewDetails={setSelectedRequest}
            />
          </div>
        </main>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  {/* Icon placeholder or close button */}
                  X
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Institute</h3>
                  <p className="mt-1 text-lg text-gray-900">{selectedRequest.instituteName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Urgency</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                      ${selectedRequest.urgency === 'Critical' ? 'bg-red-100 text-red-800' : 
                        selectedRequest.urgency === 'High' ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                      ${selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedRequest.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Requested Items</h3>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {selectedRequest.items.map((item, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="font-medium text-gray-900">Qty: {item.quantity}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.description || "No description provided."}</p>
                </div>

                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Approve Request'}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      disabled={isLoading}
                      className="flex-1 bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Reject Request'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestMonitoringPage;
