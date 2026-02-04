import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchPayments } from '../store/slices/paymentsSlice';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  ArrowUpRight,
  Download,
  Search,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  Share2
} from 'lucide-react';
import PageTransition from '../components/Layout/PageTransition';
import type { AppDispatch } from '../store';
import { Payment } from '../types';

const DONATION_TYPES = {
  FOOD_PACKAGE: [
    'Emergency Food Relief Package',
    'Monthly Nutrition Package',
    'Family Essential Package',
    'School Meal Program Package',
    'Senior Care Food Package'
  ],
  MEAL_KIT: [
    'Healthy Breakfast Kit',
    'Lunch Program Kit',
    'Weekend Food Support Kit',
    'Holiday Meal Package',
    'Fresh Produce Box'
  ],
  SPECIALTY: [
    'Dietary Restricted Package',
    'Baby & Infant Food Package',
    'Protein Rich Food Box',
    'Pantry Essentials Kit',
    'Disaster Relief Package'
  ]
};

const getTransactionName = (transaction: Payment) => {
  const type = DONATION_TYPES[
    ['FOOD_PACKAGE', 'MEAL_KIT', 'SPECIALTY'][Math.floor(Math.random() * 3)] as keyof typeof DONATION_TYPES
  ];
  const name = type[Math.floor(Math.random() * type.length)];
  const orderSuffix = transaction.orderId ? `#${transaction.orderId.slice(-6)}` : '';
  return `${name} ${orderSuffix}`;
};

const getTransactionDetails = (transaction: Payment) => {
  const details = {
    items: Math.floor(Math.random() * 20) + 5,
    beneficiaries: Math.floor(Math.random() * 50) + 10,
    category: ['Emergency', 'Regular', 'Special Program'][Math.floor(Math.random() * 3)],
    deliveryDate: new Date(transaction.createdAt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  };
  return details;
};

const Payments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading } = useSelector((state: RootState) => state.payments);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const stats = {
    totalEarnings: payments.reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter(p => p.status === 'completed').length,
    growth: 12.5
  };

  const filterPayments = (payments: Payment[]) => {
    return payments.filter(payment => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
      
      // Add date range filtering logic here if needed
      
      return matchesSearch && matchesStatus;
    });
  };

  const recentTransactions = filterPayments(payments).slice(0, 5);

  const handleExport = () => {
    // Add export functionality
    console.log('Exporting data...');
  };

  const handleShare = (transactionId: string) => {
    // Add share functionality
    console.log('Sharing transaction:', transactionId);
  };

  const handleViewDetails = (transactionId: string) => {
    // Add view details functionality
    console.log('Viewing details:', transactionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800">Payments & Earnings</h2>
            <p className="text-gray-500 mt-1">Track and manage your financial transactions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative animate-slide-in">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-200 
                rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <SlidersHorizontal size={20} className="text-gray-600 group-hover:text-purple-600" />
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 
                text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-sm 
                hover:shadow group animate-slide-in"
              >
                <Download size={20} />
                <span>Export Report</span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-down">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
                focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none 
                focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Earnings Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white
            shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300
            relative overflow-hidden group animate-fade-in">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-[100%] 
              transition-transform group-hover:scale-110 duration-300" />
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="opacity-80" />
              <TrendingUp size={24} className="opacity-80" />
            </div>
            <p className="text-purple-100 font-medium">Total Earnings</p>
            <h3 className="text-3xl font-bold mt-2">${stats.totalEarnings?.toLocaleString()}</h3>
            <div className="flex items-center mt-4 text-purple-100">
              <ArrowUpRight size={20} />
              <span className="ml-1">{stats.growth}% up from last month</span>
            </div>
          </div>

          {/* Pending Amount Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
            hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform">
                <CreditCard size={24} className="text-purple-600" />
              </div>
              <span className="text-purple-600 bg-purple-50 px-4 py-1 rounded-full text-sm font-medium">
                Pending
              </span>
            </div>
            <p className="text-gray-600">Pending Amount</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              ${stats.pendingAmount?.toLocaleString()}
            </h3>
            <div className="flex items-center mt-4 text-gray-500 text-sm">
              <Calendar size={16} />
              <span className="ml-2">Expected within 3 days</span>
            </div>
          </div>

          {/* Completed Payments Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
            hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-xl group-hover:scale-110 transition-transform">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <span className="text-green-600 bg-green-50 px-4 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
            <p className="text-gray-600">Completed Payments</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">
              {stats.completedPayments?.toLocaleString()}
            </h3>
            <div className="flex items-center mt-4 text-gray-500 text-sm">
              <ArrowUpRight size={16} className="text-green-500" />
              <span className="ml-2">All payments up to date</span>
            </div>
          </div>

          {/* Growth Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
            hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 transition-transform">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
              <span className="text-orange-600 bg-orange-50 px-4 py-1 rounded-full text-sm font-medium">
                Growth
              </span>
            </div>
            <p className="text-gray-600">Monthly Growth</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.growth}%</h3>
            <div className="flex items-center mt-4 text-gray-500 text-sm">
              <Calendar size={16} />
              <span className="ml-2">Compared to last month</span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium
                flex items-center gap-1 group">
                View All
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((transaction) => {
              const details = getTransactionDetails(transaction);
              return (
                <div key={transaction.id} 
                  className="p-6 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl shadow-sm ${
                        transaction.status === 'completed' 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-purple-50 text-purple-600'
                      } group-hover:scale-110 transition-transform`}>
                        <CreditCard size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-gray-900">
                          {getTransactionName(transaction)}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {details.items} items
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {details.beneficiaries} beneficiaries
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                            details.category === 'Emergency' 
                              ? 'bg-red-50 text-red-600'
                              : details.category === 'Special Program'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-green-50 text-green-600'
                          }`}>
                            {details.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar size={14} />
                          Delivery on {details.deliveryDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${transaction.amount?.toLocaleString()}
                        </p>
                        <span className={`text-sm font-medium ${
                          transaction.status === 'completed'
                            ? 'text-green-600'
                            : 'text-purple-600'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleViewDetails(transaction.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleShare(transaction.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Payments; 
