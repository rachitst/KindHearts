import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../../../../config/env';
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
  User,
  PlusCircle,
  List,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  isNewlyRegistered?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isNewlyRegistered }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    completed: 0
  });
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusRequests, setStatusRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allRequests, setAllRequests] = useState<any[]>([]);

  // Settings state
  const [settings, setSettings] = useState({
    darkMode: false,
    sound: true,
    language: 'English'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchStatsAndRequests = async () => {
      const userEmail = user?.email || user?.basicInfo?.email;
      
      if (userEmail) {
        try {
          const [statsRes, requestsRes] = await Promise.all([
            axios.get(`${config.apiBaseUrl}/api/institutes/stats`, {
              params: { email: userEmail }
            }),
            axios.get(`${config.apiBaseUrl}/api/institutes`, {
              params: { email: userEmail }
            })
          ]);

          if (requestsRes.data?.success) {
            const mapped = requestsRes.data.institutes.map((req: any) => ({
              id: req._id,
              itemName: req.itemName,
              category: req.category,
              quantity: req.quantity,
              urgencyLevel: req.urgency,
              status: req.status,
              createdAt: req.createdAt,
              updatedAt: req.updatedAt,
              shopAssigned: req.shopAssigned,
              specifications: req.specifications,
              deliveryDate: req.expectedDeliveryDate,
              feedback: req.feedback,
              ...req
            }));
            // Sort by createdAt descending
            mapped.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setAllRequests(mapped);
            const computed = mapped.reduce(
              (acc: any, curr: any) => {
                acc.totalRequests += 1;
                if (curr.status === 'Pending') acc.pending += 1;
                if (curr.status === 'Processing') acc.processing += 1;
                if (curr.status === 'Delivered') acc.delivered += 1;
                if (curr.status === 'Completed') acc.completed += 1;
                return acc;
              },
              { totalRequests: 0, pending: 0, processing: 0, delivered: 0, completed: 0 }
            );
            setStats(computed);
          } else if (statsRes.data?.success) {
            const s = statsRes.data.stats;
            setStats({
              totalRequests: s.totalRequests || 0,
              pending: s.pendingRequests || 0,
              processing: 0,
              delivered: 0,
              completed: s.completedRequests || 0
            });
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        }
      }
    };
    fetchStatsAndRequests();
  }, [user]);

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
      const userEmail = user?.email || user?.basicInfo?.email;
      if (userEmail) {
        const filtered = allRequests.filter(r => r.status === status);
        setStatusRequests(filtered);
        setShowModal(true);
      }
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
    <div className="space-y-8 animate-fadeIn pb-8">
      {isNewlyRegistered && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your requests.</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notification Button */}
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 text-gray-600 hover:text-[#100e92] hover:bg-indigo-50 rounded-full transition-all duration-200"
          >
            <Bell size={22} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
            )}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2.5 text-gray-600 hover:text-[#100e92] hover:bg-indigo-50 rounded-full transition-all duration-200"
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Pending" 
          count={stats.pending}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-[#100e92] to-[#2a27b5]"
          textColor="text-white"
          onClick={() => handleStatusClick('Pending')}
        />
        <StatCard 
          title="Processing" 
          count={stats.processing}
          icon={<Truck className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-[#100e92] to-[#2a27b5]"
          textColor="text-white"
          onClick={() => handleStatusClick('Processing')}
        />
        <StatCard 
          title="Delivered" 
          count={stats.delivered}
          icon={<Package className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-[#100e92] to-[#2a27b5]"
          textColor="text-white"
          onClick={() => handleStatusClick('Delivered')}
        />
        <StatCard 
          title="Completed" 
          count={stats.completed}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-gradient-to-br from-[#100e92] to-[#2a27b5]"
          textColor="text-white"
          onClick={() => handleStatusClick('Completed')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => navigate('/institute/raise-request')}
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#100e92] rounded-lg group-hover:bg-[#100e92] group-hover:text-white transition-colors">
              <PlusCircle size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Raise Request</h3>
              <p className="text-sm text-gray-500">Create a new donation request</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-[#100e92] transition-colors" />
        </button>

        <button 
          onClick={() => navigate('/institute/my-requests')}
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#100e92] rounded-lg group-hover:bg-[#100e92] group-hover:text-white transition-colors">
              <List size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">My Requests</h3>
              <p className="text-sm text-gray-500">View all your requests</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-[#100e92] transition-colors" />
        </button>

        <button 
          onClick={() => navigate('/institute/confirm-delivery')}
          className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-[#100e92] rounded-lg group-hover:bg-[#100e92] group-hover:text-white transition-colors">
              <CheckSquare size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Confirm Delivery</h3>
              <p className="text-sm text-gray-500">Verify received items</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-300 group-hover:text-[#100e92] transition-colors" />
        </button>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-[#100e92]" />
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <button 
            onClick={() => navigate('/institute/my-requests')}
            className="text-sm font-medium text-[#100e92] hover:text-[#0a0860] hover:underline"
          >
            View All
          </button>
        </div>
        
        <div className="divide-y divide-gray-100">
          {allRequests.length > 0 ? (
            allRequests.slice(0, 5).map(request => (
              <div 
                key={request.id} 
                className="p-4 sm:px-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    request.category === 'Food' ? 'bg-orange-100 text-orange-600' :
                    request.category === 'Medical' ? 'bg-red-100 text-red-600' :
                    request.category === 'Education' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{request.itemName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{request.category}</span>
                      <span>•</span>
                      <span>Qty: {request.quantity}</span>
                      <span>•</span>
                      <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <UrgencyBadge level={request.urgencyLevel} />
                  <StatusBadge status={request.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No requests yet</h3>
              <p className="text-gray-500 mb-6">Start by creating your first donation request</p>
              <button
                onClick={() => navigate('/institute/raise-request')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#100e92] text-white rounded-lg hover:bg-[#0d0940] transition-colors shadow-sm hover:shadow"
              >
                <PlusCircle size={18} />
                Raise Request
              </button>
            </div>
          )}
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
                <div className="grid grid-cols-1 gap-4">
                  {statusRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
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
