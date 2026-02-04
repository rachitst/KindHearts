import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../../config/env';
import { 
  DollarSign, 
  Users, 
  ClipboardList, 
  AlertTriangle, 
  TrendingUp,
  BarChart2,
  PieChart,
  Calendar,
  ChevronRight,
  Settings,
  Target,
  CheckCircle2,
  IndianRupee
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import DonationChart from '../components/Dashboard/DonationChart';
import RecentRequests from '../components/Dashboard/RecentRequests';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigation } from '../context/NavigationContext';
import UserDistributionChart from '../components/Dashboard/UserDistributionChart';
import DonationsByTypeChart from '../components/Dashboard/DonationsByTypeChart';
import RequestTrendChart from '../components/Dashboard/RequestTrendChart';

type RequestCategory = 'all' | 'pending' | 'completed' | 'flagged';

const DashboardPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [timeRange, setTimeRange] = useState('7');
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory>('all');
  const [stats, setStats] = useState({
    totalDonations: 0,
    pendingRequests: 0,
    completedRequests: 0,
    flaggedRequests: 0,
    totalUsers: { institutes: 0, donors: 0, shopkeepers: 0 },
    monthlyDonations: []
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goal: '',
    current: '',
    progress: 0,
    donors: 0,
    daysLeft: 0,
    category: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, requestsRes, campaignsRes] = await Promise.all([
          axios.get(`${config.apiBaseUrl}/api/admin/dashboard`),
          axios.get(`${config.apiBaseUrl}/api/admin/requests`),
          axios.get(`${config.apiBaseUrl}/api/campaigns`)
        ]);

        if (statsRes.data) {
          setStats(statsRes.data);
        }
        if (requestsRes.data.success) {
          const mappedRequests = requestsRes.data.requests.map((req: any) => ({
             id: req._id,
             instituteName: req.name || req.requesterName || 'Unknown Institute',
             items: [{ name: req.itemName, quantity: req.quantity }],
             status: req.status ? req.status.toLowerCase() : 'pending',
             createdAt: req.createdAt,
             urgency: req.urgency,
             ...req
          }));
          setRequests(mappedRequests);
        }
        if (campaignsRes.data.success) {
          setCampaigns(campaignsRes.data.campaigns);
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Navigation handlers
  const handleViewAllUsers = () => setCurrentPage('users');
  const handleViewDonationDetails = () => setCurrentPage('transactions');
  const handleViewAllActivity = () => setCurrentPage('requests');

  // Modal handlers
  const handleSetGoals = () => setShowGoalsModal(true);
  const handleCampaignInput = (field: string, value: any) => {
    setCampaignForm(prev => ({ ...prev, [field]: value }));
  };
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${config.apiBaseUrl}/api/uploads`, formData);
      if (res.data?.fileUrl) {
        setCampaignForm(prev => ({ ...prev, imageUrl: res.data.fileUrl }));
      }
    } catch (e) {
      // silent fail
    } finally {
      setUploading(false);
    }
  };
  const handleCreateCampaign = async () => {
    setCreating(true);
    try {
      const payload = {
        title: campaignForm.title,
        description: campaignForm.description,
        goal: campaignForm.goal,
        current: campaignForm.current,
        progress: Number(campaignForm.progress) || 0,
        donors: Number(campaignForm.donors) || 0,
        daysLeft: Number(campaignForm.daysLeft) || 0,
        category: campaignForm.category,
        image: campaignForm.imageUrl
      };
      await axios.post(`${config.apiBaseUrl}/api/campaigns`, payload);
      setCampaignForm({
        title: '',
        description: '',
        goal: '',
        current: '',
        progress: 0,
        donors: 0,
        daysLeft: 0,
        category: '',
        imageUrl: ''
      });
    } catch (e) {
      // silent fail
    } finally {
      setCreating(false);
    }
  };
  const handleDeleteCampaign = async (id: string) => {
    try {
      await axios.delete(`${config.apiBaseUrl}/api/campaigns/${id}`);
      setCampaigns(prev => prev.filter((c) => c._id !== id));
    } catch (e) {
      // silent fail
    }
  };
  const handleUpdateCampaign = async (id: string, patch: any) => {
    try {
      const res = await axios.put(`${config.apiBaseUrl}/api/campaigns/${id}`, patch);
      if (res.data?.campaign) {
        setCampaigns(prev => prev.map(c => (c._id === id ? res.data.campaign : c)));
      }
    } catch (e) {
      // silent fail
    }
  };
  const [impactForm, setImpactForm] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  const handleImpactInput = (field: string, value: any) => {
    setImpactForm(prev => ({ ...prev, [field]: value }));
  };
  const handleImpactImageUpload = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${config.apiBaseUrl}/api/uploads`, fd);
      if (res.data?.fileUrl) {
        setImpactForm(prev => ({ ...prev, imageUrl: res.data.fileUrl }));
      }
    } catch {}
  };
  const [creatingImpact, setCreatingImpact] = useState(false);
  const handleCreateImpact = async () => {
    setCreatingImpact(true);
    try {
      const payload = {
        title: impactForm.title,
        description: impactForm.description,
        category: impactForm.category,
        image: impactForm.imageUrl
      };
      await axios.post(`${config.apiBaseUrl}/api/impact-stories`, payload);
      setImpactForm({ title: '', description: '', category: '', imageUrl: '' });
    } catch {} finally {
      setCreatingImpact(false);
    }
  };

  // Filter requests based on selected category
  const filteredRequests = requests.filter(request => {
    switch (selectedCategory) {
      case 'pending':
        return request.status === 'pending';
      case 'flagged':
        return request.urgency === 'Critical' || request.urgency === 'High';
      case 'completed':
        return request.status === 'completed';
      default:
        return true;
    }
  });

  // Handle card click
  const handleCardClick = (category: RequestCategory) => {
    setSelectedCategory(category);
  };
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
              <div className="mt-2 sm:mt-0">
                <select 
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <div 
                onClick={() => handleCardClick('all')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'all' ? 'ring-2 ring-[#7C3AED]' : ''
                }`}
              >
                <StatCard 
                  title="Total Donations" 
                  value={`₹${stats.totalDonations.toLocaleString()}`} 
                  icon={<IndianRupee size={24} className="text-white" />}
                  color="bg-[#7C3AED] hover:bg-[#6D28D9]"
                  change={{ value: 12, isPositive: true }}
                />
              </div>
              
              <div 
                onClick={() => handleCardClick('pending')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'pending' ? 'ring-2 ring-amber-500' : ''
                }`}
              >
                <StatCard 
                  title="Pending Requests" 
                  value={stats.pendingRequests.toString()} 
                  icon={<ClipboardList size={24} className="text-white" />}
                  color="bg-amber-500 hover:bg-amber-600"
                  change={{ value: 5, isPositive: false }}
                />
              </div>
              
              <div 
                onClick={() => handleCardClick('completed')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'completed' ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                <StatCard 
                  title="Completed Requests" 
                  value={stats.completedRequests.toString()} 
                  icon={<CheckCircle2 size={24} className="text-white" />}
                  color="bg-emerald-500 hover:bg-emerald-600"
                  change={{ value: 8, isPositive: true }}
                />
              </div>
              
              <div 
                onClick={() => handleCardClick('flagged')}
                className={`cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === 'flagged' ? 'ring-2 ring-red-500' : ''
                }`}
              >
                <StatCard 
                  title="Flagged Items" 
                  value={stats.flaggedRequests.toString()} 
                  icon={<AlertTriangle size={24} className="text-white" />}
                  color="bg-red-500 hover:bg-red-600"
                  change={{ value: 2, isPositive: false }}
                />
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DonationChart data={stats.monthlyDonations} />
              <UserDistributionChart data={stats.totalUsers} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DonationsByTypeChart />
              <RequestTrendChart />
            </div>
            
            {/* Campaign Creation */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Campaign</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Title"
                  value={campaignForm.title}
                  onChange={(e) => handleCampaignInput('title', e.target.value)}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Category"
                  value={campaignForm.category}
                  onChange={(e) => handleCampaignInput('category', e.target.value)}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Goal (e.g., ₹50,000)"
                  value={campaignForm.goal}
                  onChange={(e) => handleCampaignInput('goal', e.target.value)}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Current (e.g., ₹12,000)"
                  value={campaignForm.current}
                  onChange={(e) => handleCampaignInput('current', e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded-md px-3 py-2"
                  placeholder="Progress (%)"
                  value={campaignForm.progress}
                  onChange={(e) => handleCampaignInput('progress', e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded-md px-3 py-2"
                  placeholder="Donors"
                  value={campaignForm.donors}
                  onChange={(e) => handleCampaignInput('donors', e.target.value)}
                />
                <input
                  type="number"
                  className="border rounded-md px-3 py-2"
                  placeholder="Days Left"
                  value={campaignForm.daysLeft}
                  onChange={(e) => handleCampaignInput('daysLeft', e.target.value)}
                />
                <textarea
                  className="border rounded-md px-3 py-2 md:col-span-2"
                  placeholder="Description"
                  value={campaignForm.description}
                  onChange={(e) => handleCampaignInput('description', e.target.value)}
                />
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <span className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : (campaignForm.imageUrl ? 'Image uploaded' : 'No image')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleCreateCampaign}
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </div>
            
            {/* Campaign Management */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Campaigns</h2>
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c._id} className="flex items-center gap-3 border rounded-md p-3">
                    <div className="flex-1">
                      <div className="font-medium">{c.title}</div>
                      <div className="text-sm text-gray-500">{c.category} • {c.progress}% • {c.donors} donors</div>
                    </div>
                    <button
                      onClick={() => handleUpdateCampaign(c._id, { progress: Math.min(100, (c.progress || 0) + 5) })}
                      className="px-3 py-1 text-sm bg-amber-500 text-white rounded-md hover:bg-amber-600"
                    >
                      +5% Progress
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(c._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Impact Story Creation */}
            <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Impact Story</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Title"
                  value={impactForm.title}
                  onChange={(e) => handleImpactInput('title', e.target.value)}
                />
                <input
                  className="border rounded-md px-3 py-2"
                  placeholder="Category"
                  value={impactForm.category}
                  onChange={(e) => handleImpactInput('category', e.target.value)}
                />
                <textarea
                  className="border rounded-md px-3 py-2 md:col-span-2"
                  placeholder="Description"
                  value={impactForm.description}
                  onChange={(e) => handleImpactInput('description', e.target.value)}
                />
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImpactImageUpload(file);
                      }}
                    />
                    <span className="text-sm text-gray-500">
                      {impactForm.imageUrl ? 'Image uploaded' : 'No image'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleCreateImpact}
                  disabled={creatingImpact}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {creatingImpact ? 'Creating...' : 'Create Impact Story'}
                </button>
              </div>
            </div>
            
            {/* Recent Requests */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                <button 
                  onClick={handleViewAllActivity}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <RecentRequests requests={filteredRequests.slice(0, 5)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
