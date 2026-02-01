import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchOrders, updateOrderStatus, setOrders } from '../store/slices/ordersSlice';
import { 
  ShoppingBag, Package, Clock, AlertCircle, 
  Search, Filter, X as XIcon, CheckCircle, Bell, Truck, DollarSign, User 
} from 'lucide-react';
import PageHeader from '../components/Layout/PageHeader';
import PageTransition from '../components/Layout/PageTransition';
import { toast } from 'react-toastify';
import { toast as hotToast } from 'react-hot-toast';
import { Order } from '../types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { navigate } from '../store/slices/navigationSlice';

const IncomingOrders = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '7days',
    priority: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const previousOrdersRef = useRef<Order[]>([]);
  const notificationSound = useRef(new Audio('/notification.mp3'));
  
  useEffect(() => {
    dispatch(fetchOrders());
    const interval = setInterval(() => {
      dispatch(fetchOrders());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const previousOrders = previousOrdersRef.current;
    const currentPendingOrders = orders.filter(order => order.status === 'pending');
    const previousPendingOrders = previousOrders.filter(order => order.status === 'pending');

    const newOrders = currentPendingOrders.filter(
      order => !previousPendingOrders.find(prev => prev.id === order.id)
    );

    if (newOrders.length > 0) {
      notificationSound.current.play().catch(error => console.log('Audio play failed:', error));

      newOrders.forEach(order => {
        hotToast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Bell className="h-10 w-10 text-blue-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New Order Received
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.instituteName} - ${order.totalAmount}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Order #{order.id.slice(-6)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => hotToast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      });

      if (document.hidden) {
        document.title = `(${newOrders.length}) New Orders! - Dashboard`;
      }
    }

    previousOrdersRef.current = orders;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        document.title = 'Dashboard';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [orders]);

  const handleStatusChange = async (orderId: string, status: 'accepted' | 'rejected') => {
    try {
      // Get the order before updating its status
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      await dispatch(updateOrderStatus({ orderId, status }));
      
      // If order is accepted, add it to the Kanban board
      if (status === 'accepted') {
        dispatch({
          type: 'kanban/updateOrderInKanban',
          payload: {
            orderId,
            oldStatus: 'pending',
            newStatus: 'accepted'
          }
        });

        hotToast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto 
            flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Order Accepted
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    The order has been moved to processing.
                  </p>
                  <button
                    className="mt-2 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    onClick={() => {
                      hotToast.dismiss(t.id);
                      dispatch(navigate('order-processing'));
                    }}
                  >
                    View in Kanban →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      } else {
        hotToast.success('Order rejected');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      hotToast.error('Failed to update order status');
    }
  };

  const pendingOrders = orders.filter(order => {
    if (order.status !== 'pending') return false;
    
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.instituteName.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Status filter
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    
    // Priority filter
    if (filters.priority === 'urgent' && !order.notes?.includes('urgent')) return false;
    if (filters.priority === 'normal' && order.notes?.includes('urgent')) return false;
    
    // Amount filter
    if (filters.minAmount && order.totalAmount < Number(filters.minAmount)) return false;
    if (filters.maxAmount && order.totalAmount > Number(filters.maxAmount)) return false;
    
    // Date filter
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
    
    switch (filters.dateRange) {
      case 'today':
        return daysDiff < 1;
      case '7days':
        return daysDiff <= 7;
      case '30days':
        return daysDiff <= 30;
      default:
        return true;
    }
  });

  const totalValue = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    {
      title: 'Pending Orders',
      value: pendingOrders.length,
      icon: <ShoppingBag className="text-purple-600" />,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
    },
    {
      title: 'In Processing',
      value: orders.filter(order => ['accepted', 'packaging'].includes(order.status)).length,
      icon: <Package className="text-purple-500" />,
      color: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300'
    },
    {
      title: 'Ready for Delivery',
      value: orders.filter(order => order.status === 'ready').length,
      icon: <Truck className="text-purple-700" />,
      color: 'bg-gradient-to-br from-purple-200 to-purple-300 border-purple-400'
    },
    {
      title: 'Total Value',
      value: `$${totalValue?.toLocaleString()}`,
      icon: <DollarSign className="text-purple-800" />,
      color: 'bg-gradient-to-br from-purple-300 to-purple-400 border-purple-500'
    }
  ];

  const addTestOrder = () => {
    const newOrder: Order = {
      id: `PO-${Math.floor(Math.random() * 1000)}`,
      instituteId: `INST${Math.floor(Math.random() * 1000)}`,
      instituteName: 'Test Institute',
      items: [
        { name: 'Test Item 1', quantity: 10, price: 100 },
        { name: 'Test Item 2', quantity: 5, price: 200 }
      ],
      totalAmount: 2000,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deliveryAddress: 'Test Address',
      contactPerson: 'Test Contact',
      contactNumber: '555-TEST',
      paymentStatus: 'pending',
      notes: Math.random() > 0.5 ? 'urgent delivery needed' : undefined
    };

    const currentOrders = [...orders];
    currentOrders.push(newOrder);
    dispatch(setOrders(currentOrders));
    
    notificationSound.current.play().catch(console.error);
    toast.success('New test order added!');
  };

  const headerActions = (
    <div className="flex items-center gap-4">
      <button
        onClick={addTestOrder}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg 
        hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md 
        hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Add Test Order
      </button>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search orders..."
          className="pl-10 pr-4 py-2 border border-purple-200 rounded-lg bg-white/50 
          backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 
          focus:border-purple-500 w-64 transition-all duration-200"
        />
      </div>
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-200 ${
          showFilters 
            ? 'bg-purple-100 text-purple-700 border-purple-300 shadow-inner' 
            : 'text-purple-600 border-purple-200 hover:bg-purple-50'
        }`}
      >
        {showFilters ? <XIcon size={20} /> : <Filter size={20} />}
        {showFilters ? 'Close Filters' : 'Filter'}
      </button>
    </div>
  );

  const handleOrderClick = (e: React.MouseEvent, orderId: string) => {
    e.preventDefault();
    dispatch(navigate('order-processing'));
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <PageHeader 
          title="Incoming Orders" 
          icon={ShoppingBag}
          actions={headerActions}
        />

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6 
          animate-fadeIn transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-900">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-purple-200 rounded-lg p-2.5 bg-white/50 
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-900">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(f => ({ ...f, dateRange: e.target.value }))}
                  className="w-full border border-purple-200 rounded-lg p-2.5 bg-white/50 
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-900">Priority</label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
                  className="w-full border border-purple-200 rounded-lg p-2.5 bg-white/50 
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent Only</option>
                  <option value="normal">Normal Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-900">Amount Range</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount}
                    onChange={(e) => setFilters(f => ({ ...f, minAmount: e.target.value }))}
                    className="w-1/2 border border-purple-200 rounded-lg p-2.5 bg-white/50 
                    focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters(f => ({ ...f, maxAmount: e.target.value }))}
                    className="w-1/2 border border-purple-200 rounded-lg p-2.5 bg-white/50 
                    focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
      </div>
        )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${stat.color} rounded-xl p-6 border transition-all duration-300 
              hover:scale-[1.02] hover:shadow-lg cursor-pointer group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between relative z-10">
              <div>
                  <p className="text-sm font-medium text-purple-900/70">{stat.title}</p>
                  <p className="text-2xl font-bold text-purple-900 mt-2">{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm 
                group-hover:shadow-md transition-all duration-300">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-900">
                Pending Orders ({pendingOrders.length})
              </h2>
              <div className="text-sm font-medium text-purple-600">
                Total Value: ${totalValue?.toLocaleString()}
              </div>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-purple-300" />
                <h3 className="mt-2 text-sm font-medium text-purple-900">No pending orders</h3>
                <p className="mt-1 text-sm text-purple-600">New orders will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingOrders.map((order) => (
                  <a
                    key={order.id}
                    href={`/order/${order.id}`}
                    onClick={(e) => handleOrderClick(e, order.id)}
                    className="block hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="border border-purple-100 rounded-xl p-6 hover:bg-purple-50/50 
                    transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium text-purple-900 text-lg">
                                {order.instituteName}
                              </h3>
                              {order.notes?.includes('urgent') && (
                                <span className="px-3 py-1 text-xs font-medium bg-red-100 
                                text-red-800 rounded-full shadow-sm">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-purple-600">
                              Order #{order.id.slice(-6)}
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => { e.preventDefault(); handleStatusChange(order.id, 'accepted'); }}
                              className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm 
                              font-medium hover:bg-purple-200 transition-colors duration-200 
                              shadow-sm hover:shadow flex items-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Accept
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); handleStatusChange(order.id, 'rejected'); }}
                              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm 
                              font-medium hover:bg-red-100 transition-colors duration-200 
                              shadow-sm hover:shadow flex items-center gap-2"
                            >
                              <XIcon size={16} />
                              Reject
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-purple-900 flex items-center gap-2">
                              <Package size={16} className="text-purple-500" />
                              Items
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm text-purple-700 bg-purple-50/50 
                                p-2 rounded-lg border border-purple-100">
                                  {item.quantity}x {item.name} 
                                  <span className="text-purple-500 ml-1">
                                    (${item.price})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-purple-900 flex items-center gap-2">
                              <User size={16} className="text-purple-500" />
                              Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-purple-700">Contact: {order.contactPerson}</p>
                              <p className="text-purple-700">Phone: {order.contactNumber}</p>
                              <p className="text-purple-700">Address: {order.deliveryAddress}</p>
                              <p className="font-medium text-purple-900 text-lg mt-4">
                                Total: ${order.totalAmount?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default IncomingOrders; 