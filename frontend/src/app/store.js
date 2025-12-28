import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from '../features/orders/ordersSlice';
import authReducer from '../features/auth/authSlice';
import accountingReducer from '../features/accounting/accountingSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    auth: authReducer,
    accounting: accountingReducer,
  },
});
