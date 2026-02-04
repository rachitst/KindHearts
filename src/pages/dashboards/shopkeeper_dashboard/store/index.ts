import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';
import feedbackReducer from './slices/feedbackSlice';
import paymentsReducer from './slices/paymentsSlice';
import authReducer from './slices/authSlice';
import kanbanReducer from './slices/kanbanSlice';
import navigationReducer from './slices/navigationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    feedback: feedbackReducer,
    payments: paymentsReducer,
    kanban: kanbanReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;