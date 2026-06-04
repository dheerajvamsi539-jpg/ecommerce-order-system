import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../app/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (params) => {
    const response = await api.get('/api/orders', { params });
    return response.data;
});

export const addOrder = createAsyncThunk('orders/addOrder', async (order) => {
    const response = await api.post('/api/orders', order);
    return response.data;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order) => {
    const response = await api.put(`/api/orders/${order.id}`, order);
    return response.data;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
    await api.delete(`/api/orders/${id}`);
    return id;
});

export const addOrderComment = createAsyncThunk('orders/addOrderComment', async ({ id, comment }) => {
    const response = await api.patch(`/api/orders/${id}/comment`, { comment });
    return response.data;
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content || action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.items.findIndex((order) => order.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.items = state.items.filter((order) => order.id !== action.payload);
            })
            .addCase(addOrderComment.fulfilled, (state, action) => {
                const index = state.items.findIndex((order) => order.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default ordersSlice.reducer;
