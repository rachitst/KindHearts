import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchOrders } from '../store/slices/ordersSlice';
import { MapPin, Package, Truck, CheckCircle2, Search, Filter, X, Navigation } from 'lucide-react';
import PageHeader from '../components/Layout/PageHeader';
import PageTransition from '../components/Layout/PageTransition';
import { Order } from '../types';
import { config } from '../../../../config/env';

const Delivery = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [activeTab, setActiveTab] = useState('ongoing');
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const deliveryStats = {
    ongoing: orders.filter(o => o.status === 'delivered').length,
    completed: orders.filter(o => o.status === 'delivered').length,
    delayed: orders.filter(o => 
      o.status === 'delivered' && 
      new Date(o.updatedAt).getTime() - new Date(o.createdAt).getTime() > 86400000
    ).length
  };

  const filteredOrders = orders.filter(order => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return order.instituteName.toLowerCase().includes(query) ||
             order.id.toLowerCase().includes(query) ||
             order.deliveryAddress.toLowerCase().includes(query);
    }
    return true;
  });

  const handleTrackOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const TrackingModal = () => {
    if (!selectedOrder) return null;

    // Static delivery progress state with fixed location
    const deliveryProgress = {
      currentLocation: { lat: 12.9616, lng: 77.5946 },
      estimatedTime: 25,
      status: 'On the way',
      lastUpdate: '11:30 AM',
      progressSteps: [
        { id: 1, title: 'Order Picked', time: '10:30 AM', completed: true },
        { id: 2, title: 'In Transit', time: '10:45 AM', completed: true },
        { id: 3, title: 'Near Destination', time: '11:05 AM', completed: false },
        { id: 4, title: 'Delivered', time: '11:55 AM', completed: false }
      ]
    };

    return (
      <>
        {/* Full screen blur overlay */}
        <div 
          className="fixed inset-0 min-h-screen w-full bg-gray-900/40 backdrop-blur-[4px] z-50 
          transition-all duration-300 ease-in-out"
          style={{ 
            minHeight: '100vh',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0
          }}
          onClick={() => setShowTrackingModal(false)}
        />
        
        {/* Modal Container - Clear and Above Blur */}
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="relative bg-white rounded-2xl shadow-2xl 
                overflow-hidden transform transition-all duration-300 ease-out">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Navigation className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Tracking Order #{selectedOrder.id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-500">Last updated: {deliveryProgress.lastUpdate}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowTrackingModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="text-gray-500" size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Live Tracking Status */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Truck size={18} className="text-gray-500" />
                          Live Tracking Status
                        </h4>
                        <div className="space-y-6">
                          {deliveryProgress.progressSteps.map((step, index) => (
                            <div key={step.id} className="relative">
                              {index !== deliveryProgress.progressSteps.length - 1 && (
                                <div className={`absolute left-[15px] top-[30px] w-[2px] h-[40px] 
                                  ${step.completed ? 'bg-purple-500' : 'bg-gray-200'}`} 
                                />
                              )}
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  step.completed 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-gray-200 text-gray-400'
                                }`}>
                                  <CheckCircle2 size={16} />
                                </div>
                                <div>
                                  <p className={`font-medium ${
                                    step.completed ? 'text-gray-900' : 'text-gray-500'
                                  }`}>{step.title}</p>
                                  <p className="text-sm text-gray-500">{step.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Status */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Package size={18} className="text-gray-500" />
                          Delivery Details
                        </h4>
                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-gray-500">Status</span>
                            <span className="font-medium text-purple-600">On the way</span>
                          </div>
                          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-gray-500">Estimated Time</span>
                            <span className="font-medium text-gray-900">25 mins</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Destination</span>
                            <span className="font-medium text-gray-900">{selectedOrder.deliveryAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Map with Static Marker */}
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 h-[500px]">
                      <img
                        src={
                          config.apiEndpoints?.staticMapKey
                            ? `https://maps.googleapis.com/maps/api/staticmap?center=${deliveryProgress.currentLocation.lat},${deliveryProgress.currentLocation.lng}&zoom=15&size=600x500&maptype=roadmap&markers=color:purple%7C${deliveryProgress.currentLocation.lat},${deliveryProgress.currentLocation.lng}&key=${config.apiEndpoints.staticMapKey}`
                            : `https://maps.googleapis.com/maps/api/staticmap?center=${deliveryProgress.currentLocation.lat},${deliveryProgress.currentLocation.lng}&zoom=15&size=600x500&maptype=roadmap&markers=color:purple%7C${deliveryProgress.currentLocation.lat},${deliveryProgress.currentLocation.lng}`
                        }
                        alt="Delivery Location"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
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
    <div className="space-y-6">
        <PageHeader 
          title="Delivery & Confirmation" 
          icon={Truck}
          actions={
            <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white 
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                  w-64 transition-all duration-200"
            />
          </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 
                rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filter
          </button>
        </div>
          }
        />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200
            shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 font-medium">Ongoing Deliveries</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{deliveryStats.ongoing}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Truck className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200
            shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 font-medium">Completed Today</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{deliveryStats.completed}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200
            shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 font-medium">Delayed Deliveries</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{deliveryStats.delayed}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Package className="text-amber-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
        <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {['ongoing', 'completed', 'delayed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium capitalize transition-colors ${
                activeTab === tab
                    ? 'border-b-2 border-purple-500 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-all duration-200 group">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-gray-900">{order.instituteName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'delivered' 
                        ? 'bg-purple-100 text-purple-700'
                        : order.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                    {order.status}
                  </span>
                </div>
                  <div className="flex items-center text-gray-600 text-sm gap-4">
                    <span>Order #{order.id.slice(-6)}</span>
                  <span>•</span>
                  <span>{order.items.length} items</span>
                  <span>•</span>
                    <span>${order.totalAmount?.toLocaleString()}</span>
                </div>
                  <div className="flex items-center text-gray-700 gap-2">
                    <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm">{order.deliveryAddress}</span>
                </div>
              </div>
                <button 
                  onClick={() => handleTrackOrder(order)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                  transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Navigation size={16} />
                Track
              </button>
            </div>
          </div>
        ))}
      </div>

        {/* Tracking Modal */}
        {showTrackingModal && <TrackingModal />}
    </div>
    </PageTransition>
  );
};

export default Delivery; 
