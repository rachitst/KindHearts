import { Order } from '../types';

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: '1',
    instituteId: 'inst-1',
    instituteName: 'St. Mary School',
    items: [
      { id: 'item-1', name: 'Notebooks', quantity: 100, price: 2 },
      { id: 'item-2', name: 'Pencils', quantity: 200, price: 0.5 }
    ],
    status: 'pending',
    totalAmount: 300,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deliveryAddress: '123 School St, City',
    contactPerson: 'John Principal',
    contactNumber: '555-123-4567',
    paymentStatus: 'pending',
    notes: 'Please deliver before the new semester starts'
  },
  {
    id: '2',
    instituteId: 'inst-2',
    instituteName: 'Hope Orphanage',
    items: [
      { id: 'item-3', name: 'Blankets', quantity: 20, price: 15 },
      { id: 'item-4', name: 'Toys', quantity: 30, price: 10 }
    ],
    status: 'accepted',
    totalAmount: 600,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    deliveryAddress: '456 Hope Ave, Town',
    contactPerson: 'Sarah Manager',
    contactNumber: '555-987-6543',
    paymentStatus: 'completed',
    notes: 'The children are excited about the new toys'
  },
  {
    id: '3',
    instituteId: 'inst-3',
    instituteName: 'Community College',
    items: [
      { id: 'item-5', name: 'Textbooks', quantity: 50, price: 30 },
      { id: 'item-6', name: 'Laptops', quantity: 5, price: 500 }
    ],
    status: 'processing',
    totalAmount: 4000,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    deliveryAddress: '789 College Blvd, City',
    contactPerson: 'Prof. Williams',
    contactNumber: '555-456-7890',
    paymentStatus: 'completed',
    notes: 'These are for the scholarship students'
  },
  {
    id: '4',
    instituteId: 'inst-4',
    instituteName: 'Children\'s Hospital',
    items: [
      { id: 'item-7', name: 'Art Supplies', quantity: 100, price: 5 },
      { id: 'item-8', name: 'Books', quantity: 50, price: 8 }
    ],
    status: 'ready',
    totalAmount: 900,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deliveryAddress: '101 Health Way, City',
    contactPerson: 'Dr. Johnson',
    contactNumber: '555-789-0123',
    paymentStatus: 'completed',
    notes: 'For the children\'s recreation room'
  },
  {
    id: '5',
    instituteId: 'inst-5',
    instituteName: 'Senior Center',
    items: [
      { id: 'item-9', name: 'Board Games', quantity: 20, price: 15 },
      { id: 'item-10', name: 'Large Print Books', quantity: 30, price: 12 }
    ],
    status: 'delivered',
    totalAmount: 660,
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deliveryAddress: '202 Elder St, Town',
    contactPerson: 'Mary Coordinator',
    contactNumber: '555-321-6547',
    paymentStatus: 'completed',
    notes: 'Our seniors will appreciate these activities'
  },
  {
    id: '6',
    instituteId: 'inst-6',
    instituteName: 'Youth Center',
    items: [
      { id: 'item-11', name: 'Sports Equipment', quantity: 10, price: 50 },
      { id: 'item-12', name: 'Musical Instruments', quantity: 5, price: 200 }
    ],
    status: 'confirmed',
    totalAmount: 1500,
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deliveryAddress: '303 Youth Blvd, City',
    contactPerson: 'Coach Thompson',
    contactNumber: '555-654-9870',
    paymentStatus: 'completed',
    notes: 'Thank you for supporting our after-school programs'
  }
];

// Simulate API call to fetch orders
export const fetchOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrders);
    }, 500);
  });
};

// Simulate API call to update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        reject(new Error('Order not found'));
        return;
      }
      
      const updatedOrder = {
        ...mockOrders[orderIndex],
        status,
        updatedAt: new Date().toISOString()
      };
      
      mockOrders[orderIndex] = updatedOrder;
      resolve(updatedOrder);
    }, 500);
  });
};