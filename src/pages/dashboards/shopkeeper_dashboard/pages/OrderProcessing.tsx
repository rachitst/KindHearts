import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchOrders, updateOrderStatus } from '../store/slices/ordersSlice';
import { Package, Search, Box, Truck } from 'lucide-react';
import PageHeader from '../components/Layout/PageHeader';
import PageTransition from '../components/Layout/PageTransition';
import { toast } from 'react-toastify';
import { Order, OrderStatus } from '../types';
import KanbanBoard from '../components/Kanban/KanbanBoard';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import OrderCard from '../components/Kanban/OrderCard';
import OrderDetailsModal from '../components/Orders/OrderDetailsModal';
import type { AppDispatch } from '../store';
import type { DragEndEvent } from '@dnd-kit/core';

const OrderProcessing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());

    const refreshInterval = setInterval(() => {
      dispatch(fetchOrders());
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  const matchesSearch = (order: Order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.instituteName.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    );
  };

  const columns = {
    accepted: {
      id: 'accepted',
      title: 'Pending Packaging',
      color: 'purple',
      icon: Package,
      orders: orders.filter(order => 
        order.status === 'accepted' &&
        matchesSearch(order)
      )
    },
    packaging: {
      id: 'packaging',
      title: 'Packaging in Progress',
      color: 'purple',
      icon: Box,
      orders: orders.filter(order => 
        order.status === 'packaging' &&
        matchesSearch(order)
      )
    },
    ready: {
      id: 'ready',
      title: 'Ready for Shipment',
      color: 'purple',
      icon: Truck,
      orders: orders.filter(order => 
        order.status === 'ready' &&
        matchesSearch(order)
      )
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const orderId = active.id;
    const newStatus = over.id as OrderStatus;
    const currentOrder = active.data.current;

    if (currentOrder.status !== newStatus) {
      try {
        await dispatch(updateOrderStatus({
          orderId,
          status: newStatus
        }));
        
        const columnTitle = columns[newStatus as keyof typeof columns].title;
        toast.success(`Order moved to ${columnTitle}`);
      } catch {
        toast.error('Failed to update order status');
      }
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await dispatch(updateOrderStatus({
        orderId,
        status: newStatus
      }));
      toast.success(`Order status updated to ${newStatus}`);
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to update order status');
    }
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
          title="Order Processing" 
          icon={Package}
          actions={
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
          }
        />

        <div className="bg-gradient-to-br from-purple-50/50 via-white to-purple-50/50 rounded-xl p-6 shadow-lg">
          <KanbanBoard onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(columns).map(([columnId, column]) => (
                <KanbanColumn
                  key={columnId}
                  id={columnId}
                  title={column.title}
                  count={column.orders.length}
                  color={column.color}
                  icon={column.icon}
                  className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-xl 
                  shadow-sm hover:shadow-md transition-all duration-300"
                  headerClassName="bg-gradient-to-r from-purple-50 to-transparent p-4 rounded-t-xl 
                  border-b border-purple-100"
                  bodyClassName="p-4 space-y-4"
                >
                  {column.orders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      onClick={() => handleOrderClick(order)}
                      color={column.color}
                      className="bg-white hover:bg-purple-50/80 border border-purple-100 
                      rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 
                      cursor-pointer group"
                      dragHandleClassName="absolute top-2 right-2 p-1 rounded-md 
                      bg-purple-100/50 text-purple-500 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-purple-900">
                              {order.instituteName}
                            </h3>
                            <p className="text-sm text-purple-600">
                              Order #{order.id.slice(-6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-700">
                            ${order.totalAmount?.toLocaleString()}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium 
                          bg-purple-100 text-purple-700">
                            {order.items.length} items
                          </span>
                        </div>
                        {order.notes?.includes('urgent') && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 
                            text-red-700 rounded-full">
                              Urgent
                            </span>
                          </div>
                        )}
                      </div>
                    </OrderCard>
                  ))}
                </KanbanColumn>
              ))}
            </div>
          </KanbanBoard>
        </div>

        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </PageTransition>
  );
};

export default OrderProcessing; 
