import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
    const { auth } = getState();
    const response = await fetch('/api/orders', {
        headers: {
            'Authorization': auth.user.authHeader
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    return response.json();
});

export const addOrder = createAsyncThunk('orders/addOrder', async (order, { getState }) => {
    const { auth } = getState();
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth.user.authHeader
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error('Failed to add order');
    }
    return response.json();
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth.user.authHeader
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error('Failed to update order');
    }
    return response.json();
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': auth.user.authHeader
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete order');
    }
    return id;
});

export const addOrderComment = createAsyncThunk('orders/addOrderComment', async ({ id, comment }, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`/api/orders/${id}/comment`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth.user.authHeader
        },
        body: JSON.stringify({ comment }),
    });
    if (!response.ok) {
        throw new Error('Failed to add comment');
    }
    return response.json();
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
                state.items = action.payload;
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
