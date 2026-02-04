import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from '../../types';
import { fetchPayments as fetchPaymentsApi } from '../../api/payments';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [],
  loading: false,
  error: null,
};

// Load payments from localStorage if available
const storedPayments = localStorage.getItem('payments');
if (storedPayments) {
  try {
    initialState.payments = JSON.parse(storedPayments);
  } catch (error) {
    console.error('Failed to parse payments from localStorage', error);
  }
}

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Access root state to get shopId
      // We need to cast getState to any or RootState if imported
      const state = getState() as any; 
      const shopId = state.auth.user?.shopId;
      
      if (!shopId) {
          // If no shopId, return empty or mock? 
          // For now, fail silently or return empty array
          return [];
      }

      const payments = await fetchPaymentsApi(shopId);
      return payments;
    } catch {
      return rejectWithValue('Failed to fetch payments');
    }
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
      localStorage.setItem('payments', JSON.stringify(state.payments));
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
        localStorage.setItem('payments', JSON.stringify(state.payments));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.loading = false;
        localStorage.setItem('payments', JSON.stringify(action.payload));
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addPayment, updatePayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
