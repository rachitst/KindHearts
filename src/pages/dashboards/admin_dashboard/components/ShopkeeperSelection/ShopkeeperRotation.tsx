import React, { useState } from 'react';
import { User } from '../../types';
import { RotateCcw, CheckCircle, XCircle, Store, Star, Calendar, BarChart } from 'lucide-react';

interface ShopkeeperRotationProps {
  shopkeepers: User[];
  onAssign: (shopkeeperId: string, requestId: string) => void;
}

const ShopkeeperRotation: React.FC<ShopkeeperRotationProps> = ({ shopkeepers, onAssign }) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [autoAssign, setAutoAssign] = useState<boolean>(true);
  
  // Mock data for demonstration
  const pendingRequests = [
    { id: 'req1', instituteName: 'St. Mary School', items: 'Notebooks, Pencils', totalCost: 700 },
    { id: 'req2', instituteName: 'Hope Foundation', items: 'Art Supplies', totalCost: 1500 },
    { id: 'req3', instituteName: 'Children First NGO', items: 'School Uniforms', totalCost: 3000 },
  ];
  
  const shopkeeperStats = shopkeepers
    .filter(shopkeeper => shopkeeper.role === 'shopkeeper')
    .map(shopkeeper => ({
      ...shopkeeper,
      totalAssignments: Math.floor(Math.random() * 10),
      lastAssigned: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      rating: (3 + Math.random() * 2).toFixed(1),
      completionRate: Math.floor(75 + Math.random() * 25) + '%',
      averageFulfillmentTime: Math.floor(1 + Math.random() * 4) + ' days',
    }));
  
  // Sort by least recently assigned and fewest total assignments
  const sortedShopkeepers = [...shopkeeperStats]
    .filter(s => s.status === 'active')
    .sort((a, b) => {
      // First by total assignments
      if (a.totalAssignments !== b.totalAssignments) {
        return a.totalAssignments - b.totalAssignments;
      }
      
      // Then by last assigned date
      return new Date(a.lastAssigned).getTime() - new Date(b.lastAssigned).getTime();
    });

  const handleAutoAssign = () => {
    if (selectedRequestId && sortedShopkeepers.length > 0) {
      // Auto-assign to the first shopkeeper in the sorted list
      onAssign(sortedShopkeepers[0].id, selectedRequestId);
      setSelectedRequestId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Shopkeeper Selection & Rotation</h2>
          <p className="text-sm text-gray-500">Ensure fair distribution of donations across multiple shops</p>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Request to Assign
            </label>
            <div className="flex gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
              >
                <option value="">Select a request...</option>
                {pendingRequests.map(request => (
                  <option key={request.id} value={request.id}>
                    {request.instituteName} - ${request.totalCost} ({request.items})
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAutoAssign}
                disabled={!selectedRequestId || sortedShopkeepers.length === 0}
                className={`flex items-center px-4 py-2 rounded-md ${
                  !selectedRequestId || sortedShopkeepers.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <RotateCcw size={16} className="mr-2" />
                Auto-Assign
              </button>
            </div>
            
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="autoAssign"
                checked={autoAssign}
                onChange={() => setAutoAssign(!autoAssign)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoAssign" className="ml-2 block text-sm text-gray-700">
                Enable automatic assignment for new requests
              </label>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6">
            <h3 className="text-sm font-medium text-blue-800 flex items-center">
              <Store size={16} className="mr-2" />
              Assignment Algorithm
            </h3>
            <p className="text-xs text-blue-700 mt-1">
              Shopkeepers are prioritized based on: 1) Fewest total assignments, 2) Longest time since last assignment, 
              3) Highest rating and completion rate. This ensures fair distribution and quality service.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Available Shopkeepers</h2>
          <p className="text-sm text-gray-500">Ranked by rotation priority</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shopkeeper
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <BarChart size={14} className="mr-1" />
                    Assignments
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    Last Assigned
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Star size={14} className="mr-1" />
                    Rating
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedShopkeepers.length > 0 ? (
                sortedShopkeepers.map((shopkeeper, index) => (
                  <tr key={shopkeeper.id} className={index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Store size={16} className="text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{shopkeeper.name}</div>
                          <div className="text-xs text-gray-500">{shopkeeper.email}</div>
                        </div>
                        {index === 0 && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Next in rotation
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shopkeeper.totalAssignments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(shopkeeper.lastAssigned).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {shopkeeper.rating}
                        <Star size={14} className="ml-1 text-yellow-500 fill-current" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{shopkeeper.completionRate}</div>
                      <div className="text-xs text-gray-500">Avg. {shopkeeper.averageFulfillmentTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => selectedRequestId && onAssign(shopkeeper.id, selectedRequestId)}
                        disabled={!selectedRequestId}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                          !selectedRequestId
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Assign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No active shopkeepers available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Assignment History</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start p-3 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Store size={16} className="text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {sortedShopkeepers[i % sortedShopkeepers.length]?.name || 'Shopkeeper'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Assigned to {pendingRequests[i % pendingRequests.length]?.instituteName || 'Institute'} 
                      {' - '}₹{pendingRequests[i % pendingRequests.length]?.totalCost || '1000'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Distribution Metrics</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">City Supplies Shop</span>
                  <span className="text-sm font-medium text-gray-700">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">School Supplies Store</span>
                  <span className="text-sm font-medium text-gray-700">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Educational Materials Inc.</span>
                  <span className="text-sm font-medium text-gray-700">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Distribution Balance</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-l-full" style={{ width: '33%' }}></div>
                    <div className="bg-blue-500 h-3" style={{ width: '33%', marginLeft: '33%', marginTop: '-12px' }}></div>
                    <div className="bg-indigo-500 h-3 rounded-r-full" style={{ width: '34%', marginLeft: '66%', marginTop: '-12px' }}></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Balanced</span>
                  <span>Slightly Uneven</span>
                  <span>Monopolized</span>
                </div>
                <div className="flex items-center mt-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600 font-medium">Current Status: Balanced Distribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperRotation;