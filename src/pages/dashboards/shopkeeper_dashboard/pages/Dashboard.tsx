import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchOrders } from '../store/slices/ordersSlice';
import { navigate } from '../store/slices/navigationSlice';
import { config } from '../../../../config/env';
import { 
  ShoppingBag, TrendingUp, DollarSign, Star, 
  Package, Clock, CheckCircle, Calendar, RefreshCcw, Filter 
} from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';
import OrdersChart from '../components/Dashboard/OrdersChart';
import RecentDonations from '../components/Dashboard/RecentDonations';
import PageWrapper from '../components/Layout/PageWrapper';

import type { AppDispatch } from '../store';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [shopStats, setShopStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const fetchStats = async () => {
        const shopId = user?.shopId || (user?.publicMetadata as any)?.shopId;
        if (shopId) {
            try {
                const res = await fetch(`${config.apiBaseUrl}/api/shops/${shopId}/stats`);
                const data = await res.json();
                if (data.success) {
                    setShopStats(data.stats);
                }
            } catch (err) {
                console.error("Failed to fetch shop stats", err);
            }
        }
    };
    if (user) {
        fetchStats();
    }
  }, [user]);

  const stats = [
    {
      title: 'Total Donations',
      value: shopStats.totalOrders || orders.length,
      icon: <ShoppingBag className="text-purple-500" size={24} />,
      color: 'purple',
      change: { value: 12, isPositive: true }
    },
    {
      title: 'Total Impact',
      value: `${(shopStats.totalOrders || orders.length) * 10}+`,
      subtitle: 'Lives Touched',
      icon: <Star className="text-purple-400" size={24} />,
      color: 'purple',
      change: { value: 8, isPositive: true }
    },
    {
      title: 'Earnings',
      value: `$${(shopStats.totalEarnings || 0).toFixed(2)}`,
      icon: <DollarSign className="text-purple-600" size={24} />,
      color: 'purple',
      change: { value: 5, isPositive: true }
    },
    {
      title: 'Success Rate',
      value: '98%',
      icon: <TrendingUp className="text-purple-500" size={24} />,
      color: 'purple',
      change: { value: 2, isPositive: true }
    }
  ];

  const orderStatus = [
    {
      title: 'Pending Orders',
      count: shopStats.pendingOrders,
      icon: <Clock className="text-purple-300" size={32} />,
      color: 'purple-300',
      description: 'Awaiting processing',
      gradient: 'from-purple-100 to-purple-50'
    },
    {
      title: 'Processing',
      count: orders.filter(order => order.status === 'packaging').length,
      icon: <Package className="text-purple-500" size={32} />,
      color: 'purple-500',
      description: 'Currently packing',
      gradient: 'from-purple-200 to-purple-100'
    },
    {
      title: 'Completed',
      count: orders.filter(order => order.status === 'delivered').length,
      icon: <CheckCircle className="text-purple-700" size={32} />,
      color: 'purple-700',
      description: 'Successfully delivered',
      gradient: 'from-purple-300 to-purple-200'
    }
  ];

  const handleViewAllOrders = () => {
    dispatch(navigate('incoming-orders'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 md:p-6 rounded-xl">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900">
              Dashboard Overview
            </h1>
            <p className="text-sm md:text-base text-purple-600">
              Welcome back! Here's what's happening with your donations today
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-purple-200 
                rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 
                transition-colors duration-200 shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Last 7 days
              </button>
              
              <button className="inline-flex items-center p-2 border border-purple-200 
                rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 
                transition-colors duration-200 shadow-sm"
                title="Refresh Data"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
              
              <button className="inline-flex items-center p-2 border border-purple-200 
                rounded-lg text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 
                transition-colors duration-200 shadow-sm"
                title="Filter"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <p className="text-sm text-purple-600">Today's Donations</p>
            <p className="text-xl font-semibold text-purple-900 mt-1">
              {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <p className="text-sm text-purple-600">Pending Review</p>
            <p className="text-xl font-semibold text-purple-900 mt-1">
              {shopStats.pendingOrders}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <p className="text-sm text-purple-600">Success Rate</p>
            <p className="text-xl font-semibold text-purple-900 mt-1">98%</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <p className="text-sm text-purple-600">Total Value</p>
            <p className="text-xl font-semibold text-purple-900 mt-1">
              ₹{(shopStats.totalEarnings || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <PageWrapper>
        <div className="h-full grid grid-rows-[auto_1fr] gap-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Column - Charts */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {/* Order Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orderStatus.map((status, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${status.gradient} rounded-xl p-4 md:p-6 
                    border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 
                    transform hover:-translate-y-1 relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 
                      bg-gradient-to-br from-white/10 to-purple-100/20 rounded-full 
                      transform rotate-45 transition-transform group-hover:scale-110"
                    />
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm`}>
                          {status.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-purple-900">
                            {status.count}
                          </h3>
                          <p className="text-sm md:text-base font-medium text-purple-700">
                            {status.title}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-purple-600 mt-2 border-t border-purple-200/50 pt-2">
                        {status.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div 
                className="bg-white rounded-xl p-4 md:p-6 border border-purple-100 
                shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-900 mb-4">
                    Donation Trends
                  </h2>
                  <OrdersChart />
                </div>
              </div>
            </div>

            {/* Right Column - Recent Donations */}
            <div className="col-span-12 lg:col-span-4">
              <div 
                className="bg-white rounded-xl p-4 md:p-6 border border-purple-100 
                shadow-lg h-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-semibold text-purple-900">
                      Recent Orders
                    </h2>
                    <button
                      onClick={handleViewAllOrders}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Orders
                    </button>
                  </div>
                  <div className="max-h-[60vh] lg:h-[calc(100%-4rem)] overflow-auto 
                    scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100/50
                    pr-2"
                  >
                    <RecentDonations orders={orders.slice(0, 8)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Dashboard; 
