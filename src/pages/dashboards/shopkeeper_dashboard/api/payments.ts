import { Payment } from '../types';
import axios from 'axios';

// Use localhost directly if config is not available or fix import path
const API_BASE_URL = 'http://localhost:5000';

export const fetchPayments = async (shopId: string): Promise<Payment[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/orders/${shopId}`);
    // Backend returns { success: true, orders: [...] }
    if (response.data.success) {
       const orders = response.data.orders;
       return orders
         .filter((o: any) => o.status === 'completed' || o.status === 'delivered')
         .map((o: any) => ({
             id: o._id,
             orderId: o._id,
             amount: o.totalAmount,
             status: 'completed',
             transactionId: `txn-${o._id.slice(-6)}`,
             createdAt: o.createdAt
         }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
};