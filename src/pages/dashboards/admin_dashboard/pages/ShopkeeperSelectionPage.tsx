import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Search, UserCheck, AlertTriangle, Clock, Bell, ChevronRight, X, Filter, Package } from 'lucide-react';

interface Shopkeeper {
  id: string;
  name: string;
  rating: number;
  completedRequests: number;
  activeRequests: number;
  availability: 'available' | 'busy' | 'offline';
  totalEarnings: number;
  area: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
  isRead: boolean;
}

interface Request {
  id: string;
  type: string;
  location: string;
  status: 'pending' | 'assigned' | 'completed';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock shopkeepers removed in favor of API


const mockNotifications: Notification[] = [
  {
    id: 'N001',
    message: 'New request assigned to Rajesh Kumar',
    time: '2 minutes ago',
    type: 'success',
    isRead: false
  },
  {
    id: 'N002',
    message: 'Priya Sharma completed request #REQ123',
    time: '10 minutes ago',
    type: 'info',
    isRead: false
  },
  {
    id: 'N003',
    message: 'Urgent: 3 pending requests need attention',
    time: '30 minutes ago',
    type: 'warning',
    isRead: false
  }
];

// Add mock requests data
const mockRequests: Request[] = [
  {
    id: 'REQ001',
    type: 'Food Donation',
    location: 'Andheri East',
    status: 'pending',
    timestamp: '2024-02-27 10:30 AM',
    priority: 'high'
  },
  {
    id: 'REQ002',
    type: 'Clothes Donation',
    location: 'Bandra West',
    status: 'pending',
    timestamp: '2024-02-27 11:45 AM',
    priority: 'medium'
  },
  {
    id: 'REQ003',
    type: 'Books Donation',
    location: 'Powai',
    status: 'pending',
    timestamp: '2024-02-27 09:15 AM',
    priority: 'low'
  },
  {
    id: 'REQ004',
    type: 'Food Donation',
    location: 'Malad West',
    status: 'pending',
    timestamp: '2024-02-27 12:00 PM',
    priority: 'high'
  }
];

const ShopkeeperSelectionPage: React.FC = () => {
  const [shopkeepers, setShopkeepers] = useState<Shopkeeper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopkeepers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shops');
        if (response.data.success) {
          const mappedShopkeepers = response.data.shops.map((shop: any) => ({
            id: shop._id,
            name: shop.owner,
            rating: parseFloat(shop.rating),
            completedRequests: shop.completedRequests,
            activeRequests: shop.activeRequests,
            availability: shop.availability ? 'available' : 'busy',
            totalEarnings: shop.totalEarnings,
            area: shop.location
          }));
          setShopkeepers(mappedShopkeepers);
        }
      } catch (error) {
        console.error("Error fetching shopkeepers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShopkeepers();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAutoAssign = () => {
    if (!selectedRequest) {
      setShowRequestModal(true);
      return;
    }

    const availableShopkeepers = shopkeepers.filter(sk => sk.availability === 'available');
    if (availableShopkeepers.length > 0) {
      const bestMatch = availableShopkeepers.sort((a, b) => {
        if (a.activeRequests !== b.activeRequests) {
          return a.activeRequests - b.activeRequests;
        }
        return b.rating - a.rating;
      })[0];

      handleAssignShopkeeper(bestMatch.id);
    } else {
      alert('No available shopkeepers at the moment');
    }
  };

  const handleAssignShopkeeper = (shopkeeperId: string) => {
    if (!selectedRequest) {
      setShowRequestModal(true);
      return;
    }

    const shopkeeper = shopkeepers.find(sk => sk.id === shopkeeperId);
    const request = mockRequests.find(req => req.id === selectedRequest);
    
    if (shopkeeper && request) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        message: `Request ${request.id} assigned to ${shopkeeper.name}`,
        time: 'Just now',
        type: 'success',
        isRead: false
      };
      setNotifications([newNotification, ...notifications]);
      alert(`Successfully assigned request ${request.id} to ${shopkeeper.name}`);
      setSelectedRequest(null);
      setShowRequestModal(false);
    }
  };

  // Filter and sort shopkeepers
  const filteredAndSortedShopkeepers = shopkeepers
    .filter(shopkeeper => {
      const matchesSearch = shopkeeper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shopkeeper.area.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || shopkeeper.availability === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'requests':
          return b.completedRequests - a.completedRequests;
        case 'earnings':
          return b.totalEarnings - a.totalEarnings;
        default:
          return 0;
      }
    });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Shopkeeper Selection</h1>
                <p className="mt-1 text-sm text-gray-500">Assign and manage shopkeepers for requests</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <Bell size={24} />
                    {notifications.some(n => !n.isRead) && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className="p-3 border-b hover:bg-gray-50"
                            onClick={() => {
                              const updatedNotifications = notifications.map(n =>
                                n.id === notification.id ? { ...n, isRead: true } : n
                              );
                              setNotifications(updatedNotifications);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-1 ${
                                notification.type === 'success' ? 'text-green-500' :
                                notification.type === 'warning' ? 'text-yellow-500' :
                                'text-blue-500'
                              }`}>
                                {notification.type === 'success' ? <UserCheck size={16} /> :
                                 notification.type === 'warning' ? <AlertTriangle size={16} /> :
                                 <Clock size={16} />}
                              </span>
                              <div>
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAutoAssign}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck size={20} />
                  Auto Assign Request
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Available Shopkeepers</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {shopkeepers.filter(sk => sk.availability === 'available').length}
                </p>
                <p className="mt-1 text-sm text-green-600">Ready for assignments</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Active Requests</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {shopkeepers.reduce((acc, sk) => acc + sk.activeRequests, 0)}
                </p>
                <p className="mt-1 text-sm text-blue-600">In progress</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {shopkeepers.length > 0 ? (shopkeepers.reduce((acc, sk) => acc + sk.rating, 0) / shopkeepers.length).toFixed(1) : '0.0'}
                </p>
                <p className="mt-1 text-sm text-yellow-600">Overall performance</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ₹{shopkeepers.reduce((acc, sk) => acc + sk.totalEarnings, 0).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-green-600">Cumulative earnings</p>
              </div>
            </div>

            {/* Request Selection Modal */}
            {showRequestModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Select a Request</h3>
                    <button
                      onClick={() => setShowRequestModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      {mockRequests.filter(req => req.status === 'pending').map((request) => (
                        <div
                          key={request.id}
                          onClick={() => {
                            setSelectedRequest(request.id);
                            setShowRequestModal(false);
                          }}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors
                            ${selectedRequest === request.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Package size={16} className="text-blue-600" />
                                <span className="font-medium text-gray-900">{request.id}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                  ${request.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'}`}>
                                  {request.priority} priority
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{request.type}</p>
                              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                                <span>{request.location}</span>
                                <span>{request.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Request Display */}
            {selectedRequest && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={20} className="text-blue-600" />
                    <span className="font-medium">Selected Request: </span>
                    <span>{mockRequests.find(req => req.id === selectedRequest)?.id}</span>
                    <span className="text-gray-600">({mockRequests.find(req => req.id === selectedRequest)?.type})</span>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by name or area..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="offline">Offline</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="rating">Sort by Rating</option>
                      <option value="requests">Sort by Requests</option>
                      <option value="earnings">Sort by Earnings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shopkeeper List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shopkeeper
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requests
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedShopkeepers.map((shopkeeper) => (
                      <tr key={shopkeeper.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {shopkeeper.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{shopkeeper.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shopkeeper.area}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{shopkeeper.rating}</span>
                            <span className="ml-1 text-yellow-400">★</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{shopkeeper.completedRequests}</span>
                          <span className="text-gray-500 mx-1">/</span>
                          <span className="text-sm text-gray-900">{shopkeeper.activeRequests}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${shopkeeper.availability === 'available' ? 'bg-green-100 text-green-800' : 
                              shopkeeper.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {shopkeeper.availability}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{shopkeeper.totalEarnings.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleAssignShopkeeper(shopkeeper.id)}
                            disabled={shopkeeper.availability !== 'available'}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                              ${shopkeeper.availability === 'available'
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopkeeperSelectionPage;