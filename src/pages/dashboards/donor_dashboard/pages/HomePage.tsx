import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../../../config/env';
import { 
  DollarSign, 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  Heart, 
  Target, 
  ArrowRight,
  Gift,
  Sparkles,
  HandHeart,
  Globe,
  Clock,
  ArrowUpRight,
  Activity,
  Timer,
  IndianRupee
} from 'lucide-react';
import { Button } from '../components/Button';
import { StatsCard } from '../components/StatsCard';
import { useUser } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

interface Campaign {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  goal: string;
  current: string;
  progress: number;
  donors: number;
  daysLeft: number;
  category: string;
  image: string;
}

const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [selectedCause, setSelectedCause] = useState('all');
  const [upcomingCampaigns, setUpcomingCampaigns] = useState<Campaign[]>([]);

  // Add sign out handler
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Navigation handlers
  const handleNewDonation = () => {
    setActiveTab('browse');
  };

  const handleViewImpact = () => {
    setActiveTab('impact');
  };

  const handleViewAllDonations = () => {
    setActiveTab('donations');
  };

  // Sample data
  const stats = [
    { 
      id: 1, 
      title: 'Total Donations', 
      value: '₹2,450', 
      change: '+12.5%', 
      icon: <DollarSign size={24} />,
      color: 'indigo'
    },
    { 
      id: 2, 
      title: 'Items Donated', 
      value: '38', 
      change: '+7.2%', 
      icon: <Package size={24} />,
      color: 'gold'
    },
    { 
      id: 3, 
      title: 'Recurring Donations', 
      value: '3', 
      change: '+2', 
      icon: <Calendar size={24} />,
      color: 'purple'
    },
    { 
      id: 4, 
      title: 'People Impacted', 
      value: '120+', 
      change: '+25', 
      icon: <Users size={24} />,
      color: 'emerald'
    }
  ];

  const recentDonations = [
    { id: 1, institute: 'Children\'s Hospital', amount: '₹150', date: 'May 15, 2025', status: 'Delivered' },
    { id: 2, institute: 'Food Bank', amount: '₹75', date: 'May 10, 2025', status: 'In Transit' },
    { id: 3, institute: 'Animal Shelter', amount: '₹100', date: 'May 5, 2025', status: 'Delivered' },
  ];

  const impactHighlights = [
    { 
      id: 1, 
      title: 'Medical Supplies', 
      description: 'Your donations helped provide essential medical supplies to 3 local hospitals.',
      image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'healthcare'
    },
    { 
      id: 2, 
      title: 'Education Support', 
      description: 'Funded 12 scholarships for underprivileged students in the community.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'education'
    },
    { 
      id: 3, 
      title: 'Disaster Relief', 
      description: 'Provided emergency supplies to 45 families affected by recent floods.',
      image: 'https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'emergency'
    },
  ];

  const causes = [
    { id: 'all', label: 'All Causes', icon: <Globe size={20} /> },
    { id: 'healthcare', label: 'Healthcare', icon: <Heart size={20} /> },
    { id: 'education', label: 'Education', icon: <Gift size={20} /> },
    { id: 'emergency', label: 'Emergency', icon: <Target size={20} /> },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${config.apiBaseUrl}/api/campaigns`);
        const data = Array.isArray(res?.data?.campaigns) ? res.data.campaigns : [];
        setUpcomingCampaigns(data as Campaign[]);
      } catch {
        setUpcomingCampaigns([]);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
          <HandHeart size={300} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Friend'}!
              </h2>
              <p className="opacity-90 mb-4 sm:mb-6 text-base sm:text-lg">
                Your generosity has impacted 120+ lives this month.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleNewDonation}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 
                text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 group"
            >
              <IndianRupee className="w-5 h-5" />
          Make a New Donation
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={handleViewImpact}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                text-white rounded-xl font-medium border border-white/20 backdrop-blur-sm
                transition-all duration-300 hover:scale-105 group"
            >
              <Activity className="w-5 h-5" />
              View Your Impact
              <TrendingUp className="w-5 h-5 transition-transform group-hover:translate-y-[-2px]" />
        </button>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Upcoming Campaigns */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
              <div>
            <h2 className="text-2xl font-semibold text-indigo-900">Upcoming Campaigns</h2>
            <p className="text-gray-600 mt-1">Support these upcoming initiatives</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 group">
            View All 
            <ArrowUpRight 
              size={16} 
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" 
            />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingCampaigns.map((campaign) => (
            <div 
              key={campaign._id || campaign.id} 
              className="group relative bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Campaign Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-indigo-900/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-indigo-600">
                    {campaign.category}
                  </span>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {campaign.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        {campaign.donors} donors
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer size={16} />
                        {campaign.daysLeft} days left
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="group/btn hover:bg-indigo-50 hover:border-indigo-200"
                  >
                    <Activity size={18} className="text-indigo-600 group-hover/btn:scale-110 transition-transform" />
                  </Button>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-indigo-900">{campaign.current}</span>
                    <span className="text-gray-600">Goal: {campaign.goal}</span>
                  </div>
                  <div className="relative h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {campaign.progress}% funded
                    </span>
                    <Button 
                      variant="secondary"
                      className="text-sm px-4 py-1.5 hover:scale-105 transition-transform"
                    >
                      Donate Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
      </div>
      
      {/* Recent Donations */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-indigo-900 mb-4">Recent Donations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-indigo-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-indigo-600">Institute</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-indigo-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-indigo-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-indigo-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-indigo-50 hover:bg-indigo-50/30">
                  <td className="py-3 px-4 text-sm text-gray-900">{donation.institute}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{donation.amount}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{donation.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      donation.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            onClick={handleViewAllDonations}
          >
            View All Donations
          </Button>
        </div>
      </div>
      
      {/* Impact Highlights */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-indigo-900">Your Impact Highlights</h2>
          <div className="flex flex-wrap gap-2">
            {causes.map((cause) => (
              <button
                key={cause.id}
                onClick={() => setSelectedCause(cause.id)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-300 flex-1 sm:flex-none justify-center sm:justify-start
                  hover:scale-105 ${
                  selectedCause === cause.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <span className="mr-2">{cause.icon}</span>
                {cause.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {impactHighlights
            .filter(highlight => selectedCause === 'all' || highlight.category === selectedCause)
            .map((highlight) => (
              <div key={highlight.id} 
                className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-indigo-100 
                  hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <img 
                    src={getHighlightImage(highlight.category)}
                alt={highlight.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-medium">{highlight.category}</p>
                    <h3 className="text-lg font-semibold mt-1">{highlight.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{highlight.description}</p>
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 
                      border border-indigo-200 text-indigo-600 rounded-lg font-medium
                      hover:bg-indigo-50 transition-colors group"
                  >
                    Learn More
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get relevant images based on category
const getHighlightImage = (category: string) => {
  const images = {
    healthcare: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80",
    education: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
    emergency: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80",
    community: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80",
    environment: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&q=80",
    default: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80"
  };
  return images[category.toLowerCase()] || images.default;
};

export default HomePage;
