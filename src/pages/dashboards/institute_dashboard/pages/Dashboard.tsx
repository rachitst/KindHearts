import React, { useState } from 'react';
import { getDashboardStats, getRequestsByStatus } from '../data/mockData';
import StatCard from '../components/StatCard';
import RequestCard from '../components/RequestCard';
import UrgencyBadge from '../components/UrgencyBadge';
import StatusBadge from '../components/StatusBadge';
import { 
  Clock, 
  Truck, 
  CheckCircle, 
  Package, 
  AlertCircle, 
  X, 
  Bell, 
  Settings,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Globe,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  isNewlyRegistered?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isNewlyRegistered }) => {
  const stats = getDashboardStats();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusRequests, setStatusRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New Request Assigned',
      message: 'A new donation request has been assigned to you',
      time: '5 minutes ago',
      unread: true,
      type: 'request'
    },
    {
      id: 2,
      title: 'Delivery Update',
      message: 'Request #REQ-001 has been delivered successfully',
      time: '1 hour ago',
      unread: true,
      type: 'delivery'
    },
    {
      id: 3,
      title: 'Feedback Received',
      message: 'New feedback received for delivery #DEL-003',
      time: '2 hours ago',
      unread: false,
      type: 'feedback'
    }
  ];

  const [notificationList, setNotificationList] = useState(notifications);

  const handleStatusClick = async (status: string) => {
    setSelectedStatus(status);
    setIsLoading(true);
    try {
      const requests = await getRequestsByStatus(status);
      setStatusRequests(requests);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (id: number) => {
    setNotificationList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {isNewlyRegistered && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Welcome to the platform! Your institute has been successfully registered.
                You can now start using all the features.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Bell size={20} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
          <div className="w-96 bg-white h-full shadow-xl animate-slideIn">
            <div className="p-4 border-b flex justify-between items-center bg-[#100e92] text-white">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fadeIn">
            <div className="p-4 border-b flex justify-between items-center bg-[#100e92] text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Settings content */}
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="flex items-center space-x-3">
                      {key === 'darkMode' && <Moon size={20} className="text-gray-600" />}
                      {key === 'sound' && (value ? <Volume2 size={20} className="text-gray-600" /> : <VolumeX size={20} className="text-gray-600" />)}
                      <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                    {typeof value === 'boolean' ? (
                      <button
                        onClick={() => handleSettingChange(key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${value ? 'bg-[#100e92]' : 'bg-gray-200'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${value ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    ) : (
                      <select
                        value={value}
                        onChange={(e) => handleSettingChange(key, e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending Requests" 
          count={stats.pending}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-[#0f0a73]"
          textColor="text-white"
          onClick={() => handleStatusClick('Pending')}
        />
        <StatCard 
          title="Processing" 
          count={stats.processing}
          icon={<Truck className="h-6 w-6 text-white" />}
          color="bg-[#0f0a73]"
          textColor="text-white"
          onClick={() => handleStatusClick('Processing')}
        />
        <StatCard 
          title="Delivered" 
          count={stats.delivered}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-[#0f0a73]"
          textColor="text-white"
          onClick={() => handleStatusClick('Delivered')}
        />
        <StatCard 
          title="Completed" 
          count={stats.completed}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-[#0f0a73]"
          textColor="text-white"
          onClick={() => handleStatusClick('Completed')}
        />
      </div>

      {/* Updated Dashboard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#100e92] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <h2 className="text-lg font-medium">Pending Requests</h2>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-sm">
              {getRequestsByStatus('Pending').length} requests
            </span>
          </div>
          
          <div className="p-4 divide-y divide-gray-100">
            {getRequestsByStatus('Pending').length > 0 ? (
              getRequestsByStatus('Pending').map(request => (
                <div 
                  key={request.id} 
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => handleStatusClick('Pending')}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{request.itemName}</span>
                        <UrgencyBadge level={request.urgencyLevel} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Quantity: {request.quantity} • Requested on {request.createdAt}
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No pending requests at the moment
              </div>
            )}
          </div>
        </div>

        {/* In Progress Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#100e92] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={20} />
              <h2 className="text-lg font-medium">In Progress</h2>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-sm">
              {getRequestsByStatus('Processing').length} requests
            </span>
          </div>
          
          <div className="p-4 divide-y divide-gray-100">
            {getRequestsByStatus('Processing').length > 0 ? (
              getRequestsByStatus('Processing').map(request => (
                <div 
                  key={request.id} 
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => handleStatusClick('Processing')}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{request.itemName}</span>
                        <UrgencyBadge level={request.urgencyLevel} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Assigned to: {request.shopAssigned?.name}
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No requests in progress
              </div>
            )}
          </div>
        </div>

        {/* Delivered Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#100e92] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={20} />
              <h2 className="text-lg font-medium">Delivered Requests</h2>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-sm">
              {getRequestsByStatus('Delivered').length} requests
            </span>
          </div>
          
          <div className="p-4 divide-y divide-gray-100">
            {getRequestsByStatus('Delivered').length > 0 ? (
              getRequestsByStatus('Delivered').map(request => (
                <div 
                  key={request.id} 
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => handleStatusClick('Delivered')}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{request.itemName}</span>
                        <UrgencyBadge level={request.urgencyLevel} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Shop: {request.shopAssigned?.name} • Delivered on: {request.deliveryDate}
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No delivered requests
              </div>
            )}
          </div>
        </div>

        {/* Completed Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-[#100e92] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <h2 className="text-lg font-medium">Completed Requests</h2>
            </div>
            <span className="px-2.5 py-1 bg-white/20 rounded-full text-sm">
              {getRequestsByStatus('Completed').length} requests
            </span>
          </div>
          
          <div className="p-4 divide-y divide-gray-100">
            {getRequestsByStatus('Completed').length > 0 ? (
              getRequestsByStatus('Completed').map(request => (
                <div 
                  key={request.id} 
                  className="py-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-lg"
                  onClick={() => handleStatusClick('Completed')}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{request.itemName}</span>
                        <UrgencyBadge level={request.urgencyLevel} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Shop: {request.shopAssigned?.name}
                        {request.feedback && (
                          <span className="ml-2 text-green-600">• Rating: {request.feedback.rating}/5</span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No completed requests
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#100e92] text-white">
              <h2 className="text-xl font-semibold">
                {selectedStatus} Requests
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {statusRequests.length > 0 ? (
                <div className="space-y-4">
                  {statusRequests.map(request => (
                    <div 
                      key={request.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{request.itemName}</h3>
                          <p className="text-sm text-gray-500">{request.category}</p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Quantity: {request.quantity}</p>
                          <p className="text-gray-500">Created: {request.createdAt}</p>
                        </div>
                        {request.shopAssigned && (
                          <div>
                            <p className="font-medium text-gray-900">{request.shopAssigned.name}</p>
                            <p className="text-gray-500">{request.shopAssigned.contactPerson}</p>
                            <p className="text-gray-500">{request.shopAssigned.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No {selectedStatus?.toLowerCase()} requests at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;