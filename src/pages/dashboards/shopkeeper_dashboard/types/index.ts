export interface User {
  id: string;
  name: string;
  email: string;
  role: 'shopkeeper' | 'admin';
  shopId?: string;
  shopName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'packaging' | 'ready' | 'delivered';

export interface Order {
  id: string;
  instituteId: string;
  instituteName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  contactPerson: string;
  contactNumber: string;
  paymentStatus: 'pending' | 'completed';
  notes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Feedback {
  id: string;
  orderId: string;
  instituteName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed';
  transactionId: string;
  createdAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  orderIds: string[];
}

export interface KanbanBoard {
  columns: {
    [key: string]: KanbanColumn;
  };
  columnOrder: string[];
}
