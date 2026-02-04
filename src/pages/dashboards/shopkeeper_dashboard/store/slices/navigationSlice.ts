import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Route = 
  | 'shopkeeper-portal'
  | 'dashboard'
  | 'incoming-orders'
  | 'order-processing'
  | 'delivery'
  | 'payments'
  | 'feedback'
  | 'settings';

interface NavigationState {
  currentRoute: Route;
  previousRoute: Route | null;
}

const initialState: NavigationState = {
  currentRoute: 'dashboard',
  previousRoute: null
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<Route>) => {
      state.previousRoute = state.currentRoute;
      state.currentRoute = action.payload;
    },
    goBack: (state) => {
      if (state.previousRoute) {
        state.currentRoute = state.previousRoute;
        state.previousRoute = null;
      }
    }
  }
});

export const { navigate, goBack } = navigationSlice.actions;
export default navigationSlice.reducer; 