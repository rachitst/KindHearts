import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KanbanBoard, Order } from '../../types';

interface KanbanState {
  board: KanbanBoard;
}

const initialColumns = {
  pending: {
    id: 'pending',
    title: 'Pending',
    orderIds: [],
  },
  accepted: {
    id: 'accepted',
    title: 'Accepted',
    orderIds: [],
  },
  processing: {
    id: 'processing',
    title: 'Processing',
    orderIds: [],
  },
  ready: {
    id: 'ready',
    title: 'Ready for Shipment',
    orderIds: [],
  },
  delivered: {
    id: 'delivered',
    title: 'Delivered',
    orderIds: [],
  },
  confirmed: {
    id: 'confirmed',
    title: 'Confirmed',
    orderIds: [],
  },
};

const initialState: KanbanState = {
  board: {
    columns: initialColumns,
    columnOrder: ['pending', 'accepted', 'processing', 'ready', 'delivered', 'confirmed'],
  },
};

// Load kanban board from localStorage if available
const storedKanban = localStorage.getItem('kanban');
if (storedKanban) {
  try {
    initialState.board = JSON.parse(storedKanban);
  } catch (error) {
    console.error('Failed to parse kanban from localStorage', error);
  }
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    initializeKanban: (state, action: PayloadAction<Order[]>) => {
      // Reset all columns
      state.board.columns = {
        pending: { ...initialColumns.pending, orderIds: [] },
        accepted: { ...initialColumns.accepted, orderIds: [] },
        processing: { ...initialColumns.processing, orderIds: [] },
        ready: { ...initialColumns.ready, orderIds: [] },
        delivered: { ...initialColumns.delivered, orderIds: [] },
        confirmed: { ...initialColumns.confirmed, orderIds: [] },
      };

      // Distribute orders to columns based on their status
      action.payload.forEach(order => {
        if (state.board.columns[order.status]) {
          state.board.columns[order.status].orderIds.push(order.id);
        }
      });

      localStorage.setItem('kanban', JSON.stringify(state.board));
    },
    moveOrder: (state, action: PayloadAction<{
      orderId: string;
      sourceColumnId: string;
      destinationColumnId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { orderId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;
      
      // Remove from source column
      state.board.columns[sourceColumnId].orderIds.splice(sourceIndex, 1);
      
      // Add to destination column
      state.board.columns[destinationColumnId].orderIds.splice(destinationIndex, 0, orderId);
      
      localStorage.setItem('kanban', JSON.stringify(state.board));
    },
    addOrderToKanban: (state, action: PayloadAction<{ order: Order }>) => {
      const { order } = action.payload;
      if (state.board.columns[order.status]) {
        state.board.columns[order.status].orderIds.push(order.id);
        localStorage.setItem('kanban', JSON.stringify(state.board));
      }
    },
    updateOrderInKanban: (state, action: PayloadAction<{ orderId: string; oldStatus: string; newStatus: string }>) => {
      const { orderId, oldStatus, newStatus } = action.payload;
      
      // Remove from old status column
      if (state.board.columns[oldStatus]) {
        state.board.columns[oldStatus].orderIds = state.board.columns[oldStatus].orderIds.filter(id => id !== orderId);
      }
      
      // Add to new status column
      if (state.board.columns[newStatus]) {
        state.board.columns[newStatus].orderIds.push(orderId);
      }
      
      localStorage.setItem('kanban', JSON.stringify(state.board));
    },
  },
});

export const { initializeKanban, moveOrder, addOrderToKanban, updateOrderInKanban } = kanbanSlice.actions;
export default kanbanSlice.reducer;