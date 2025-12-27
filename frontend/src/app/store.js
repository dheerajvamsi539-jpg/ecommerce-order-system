import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from '../features/orders/ordersSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
  },
});
