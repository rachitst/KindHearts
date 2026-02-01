import React, { useState } from 'react';
import { mockDonationRequests } from '../data/mockData';
import { DonationRequest } from '../types';
import RequestTable from '../components/RequestMonitoring/RequestTable';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { X, Eye, Loader2 } from 'lucide-react';

const RequestMonitoringPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState(mockDonationRequests);

  const handleApproveRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update requests state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: 'approved' }
            : request
        )
      );

      // Close modal
      setSelectedRequest(null);
      showNotification('Request approved successfully', 'success');
    } catch (error) {
      showNotification('Failed to approve request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update requests state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: 'rejected' }
            : request
        )
      );

      // Close modal
      setSelectedRequest(null);
      showNotification('Request rejected', 'success');
    } catch (error) {
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
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Request Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Institute</p>
                    <p className="font-medium">{selectedRequest.instituteName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium ${
                      selectedRequest.status === 'approved' ? 'text-green-600' : 
                      selectedRequest.status === 'rejected' ? 'text-red-600' :
                      selectedRequest.status === 'fulfilled' ? 'text-blue-600' : 'text-amber-600'
                    }`}>
                      {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      {selectedRequest.flagged && ' (Flagged)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(selectedRequest.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Flag Reason */}
                {selectedRequest.flagged && selectedRequest.flagReason && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-sm font-medium text-amber-800">Flag Reason:</p>
                    <p className="text-sm text-amber-700">{selectedRequest.flagReason}</p>
                  </div>
                )}

                {/* Items Table */}
                <div>
                  <h3 className="text-md font-medium mb-2">Requested Items</h3>
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedRequest.items.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{item.quantity} {item.unit}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">₹{item.estimatedCost}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900" colSpan={2}>Total</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            ₹{selectedRequest.items.reduce((sum, item) => sum + item.estimatedCost, 0)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-4 pt-4 border-t">
                    <button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Processing...
                        </span>
                      ) : (
                        'Approve Request'
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Processing...
                        </span>
                      ) : (
                        'Reject Request'
                      )}
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