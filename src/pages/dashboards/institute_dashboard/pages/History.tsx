import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import UrgencyBadge from '../components/UrgencyBadge';
import { useAuth } from '../context/AuthContext';

interface DonationRequest {
  _id: string;
  itemName: string;
  status: string;
  urgency: string;
  createdAt: string;
  shopAssigned?: { name: string };
}

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${config.apiBaseUrl}/api/institutes`, {
          params: { email: user.email }
        });
        if (response.data.success) {
           // Filter for completed requests
           const completedRequests = response.data.institutes.filter((req: any) => 
             req.status === 'Completed' || req.status === 'Delivered'
           );
           setRequests(completedRequests);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const filteredRequests = requests.filter((request) =>
    request.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Request History</h1>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#070530] focus:border-[#070530]"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#070530] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Request ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Shop Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Created Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Urgency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.itemName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={request.status as any} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.shopAssigned?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <UrgencyBadge level={request.urgency as any} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No requests found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 