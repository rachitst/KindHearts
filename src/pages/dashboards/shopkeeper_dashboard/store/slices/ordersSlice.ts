import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus } from '../../types';
import { config } from '../../../../../config/env';
import type { AppDispatch, RootState } from '..';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

type BackendOrderItem = { name: string; quantity: number; price: number };
type BackendOrder = {
  _id: string;
  shop?: { _id?: string; name?: string };
  items?: BackendOrderItem[];
  totalAmount?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  deliveryAddress?: string;
  contactPerson?: string;
  contactNumber?: string;
  paymentStatus?: string;
  notes?: string;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      const fetchedOrders = action.payload;
      
      // Keep existing local orders (IDs starting with PO-)
      const localOrders = state.orders.filter(o => o.id.startsWith('PO-'));
      
      // Create a map of current orders for comparison
      const currentOrdersMap = new Map(state.orders.map(o => [o.id, o]));
      
      const mergedOrders = fetchedOrders.map(fetchedOrder => {
          const currentOrder = currentOrdersMap.get(fetchedOrder.id);
          if (currentOrder && currentOrder.updatedAt) {
              // If current local order is newer (e.g. optimistic update), keep it
              // to prevent overwriting with stale data from an in-flight fetch
              if (fetchedOrder.updatedAt && currentOrder.updatedAt > fetchedOrder.updatedAt) {
                  return currentOrder;
              }
          }
          return fetchedOrder;
      });

      // Merge fetched orders with preserved local orders
      // Use a Map to ensure no duplicates if for some reason a local order has same ID as fetched (unlikely)
      const finalOrdersMap = new Map();
      mergedOrders.forEach(o => finalOrdersMap.set(o.id, o));
      localOrders.forEach(o => finalOrdersMap.set(o.id, o));
      
      state.orders = Array.from(finalOrdersMap.values());
      localStorage.setItem('orders', JSON.stringify(state.orders));
    },
    updateOrder: (state, action: PayloadAction<{ orderId: string; status: OrderStatus }>) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setOrders, updateOrder, setLoading, setError } = ordersSlice.actions;

// Async thunk for fetching orders
export const fetchOrders = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true));
  try {
    const state = getState();
    const user = state.auth.user;
    // Handle both direct shopId and Clerk metadata pattern
    const shopId: string | undefined = user?.shopId || (user?.publicMetadata as any)?.shopId;
    
    if (!shopId) {
      console.warn('Fetch Orders: No shop ID found in user profile');
      throw new Error('No shop associated with current user');
    }

    // Ensure we are hitting the correct backend route: /api/orders/:shopId
    const ordersRes = await fetch(`${config.apiBaseUrl}/api/orders/${shopId}`);
    if (!ordersRes.ok) {
      const err = await ordersRes.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch orders: ${ordersRes.statusText}`);
    }
    
    const data = await ordersRes.json();
    
    if (data.success && Array.isArray(data.orders)) {
      const mappedOrders: Order[] = data.orders.map((bo: BackendOrder) => ({
        id: bo._id,
        instituteId: bo.shop?._id || 'unknown',
        instituteName: bo.shop?.name || 'Unknown Institute',
        items: (bo.items || []).map((it: BackendOrderItem) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
        totalAmount: bo.totalAmount || 0,
        status: ((bo.status as string) || 'pending') as OrderStatus,
        createdAt: bo.createdAt || new Date().toISOString(),
        updatedAt: bo.updatedAt || new Date().toISOString(),
        deliveryAddress: bo.deliveryAddress || 'N/A',
        contactPerson: bo.contactPerson || 'N/A',
        contactNumber: bo.contactNumber || 'N/A',
        paymentStatus: (bo.paymentStatus as any) || 'pending',
        notes: bo.notes || undefined,
      }));
      dispatch(setOrders(mappedOrders));
    } else if (Array.isArray(data)) {
      const mappedOrders: Order[] = data.map((bo: BackendOrder) => ({
        id: bo._id,
        instituteId: bo.shop?._id || 'unknown',
        instituteName: bo.shop?.name || 'Unknown Institute',
        items: (bo.items || []).map((it: BackendOrderItem) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
        totalAmount: bo.totalAmount || 0,
        status: ((bo.status as string) || 'pending') as OrderStatus,
        createdAt: bo.createdAt || new Date().toISOString(),
        updatedAt: bo.updatedAt || new Date().toISOString(),
        deliveryAddress: bo.deliveryAddress || 'N/A',
        contactPerson: bo.contactPerson || 'N/A',
        contactNumber: bo.contactNumber || 'N/A',
        paymentStatus: (bo.paymentStatus as any) || 'pending',
        notes: bo.notes || undefined,
      }));
      dispatch(setOrders(mappedOrders));
    }
    
    dispatch(setLoading(false));
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    dispatch(setError(error.message || 'Failed to fetch orders'));
    dispatch(setLoading(false));
  }
};

// Async thunk for creating an order
export const createOrder = (orderData: Partial<Order>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true));
  try {
    const state = getState();
    const shopId = state.auth.user?.shopId;
    if (!shopId) {
      throw new Error('No shop associated with current user');
    }

    const payload = {
      shopId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      deliveryAddress: orderData.deliveryAddress,
      contactPerson: orderData.contactPerson,
      contactNumber: orderData.contactNumber,
      paymentStatus: orderData.paymentStatus,
      notes: orderData.notes
    };

    const res = await fetch(`${config.apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create order');
    }

    await dispatch(fetchOrders());
    return true;

  } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create order';
      dispatch(setError(message));
      return false;
  } finally {
      dispatch(setLoading(false));
  }
};

// Async thunk for updating order status
export const updateOrderStatus = ({ orderId, status }: { orderId: string; status: OrderStatus }) => 
  async (dispatch: AppDispatch) => {
    try {
      // If it's a local test order, skip backend call and update local state directly
      if (orderId.startsWith('PO-')) {
        dispatch(updateOrder({ orderId, status }));
        return true;
      }

      const toBackend = (s: OrderStatus) => {
        if (s === 'delivered') return 'completed';
        if (s === 'rejected') return 'cancelled';
        return s;
      };
      const res = await fetch(`${config.apiBaseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: toBackend(status) })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update order status');
      }
      dispatch(updateOrder({ orderId, status }));
      return true;
    } catch {
      dispatch(setError('Failed to update order status'));
      return false;
    }
  };

export default ordersSlice.reducer;
