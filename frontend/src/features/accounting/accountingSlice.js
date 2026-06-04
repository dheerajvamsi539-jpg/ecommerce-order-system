import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const ACCOUNTING_API_BASE = 'http://localhost:8081';

// Separate axios instance for accounting-service since it might be on a different port/host
const accountingApi = axios.create({
    baseURL: ACCOUNTING_API_BASE,
});

accountingApi.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
});

accountingApi.interceptors.response.use(
    (response) => response,
    (error) => {
        toast.error(error.response?.data?.message || 'Accounting service error');
        return Promise.reject(error);
    }
);

export const fetchAccounts = createAsyncThunk('accounting/fetchAccounts', async () => {
    const response = await accountingApi.get('/api/accounting/accounts');
    return response.data;
});

export const createAccount = createAsyncThunk('accounting/createAccount', async (name) => {
    const response = await accountingApi.post(`/api/accounting/accounts?name=${encodeURIComponent(name)}`);
    return response.data;
});

export const recordTransaction = createAsyncThunk('accounting/recordTransaction', async (transactionData) => {
    const { accountId, description, amount, type } = transactionData;
    const response = await accountingApi.post(
        `/api/accounting/transactions?accountId=${accountId}&description=${encodeURIComponent(description)}&amount=${amount}&type=${type}`
    );
    return response.data;
});

export const fetchTransactions = createAsyncThunk('accounting/fetchTransactions', async (accountId) => {
    const response = await accountingApi.get(`/api/accounting/accounts/${accountId}/transactions`);
    return response.data;
});

const accountingSlice = createSlice({
    name: 'accounting',
    initialState: {
        accounts: [],
        currentTransactions: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.accounts = action.payload;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.accounts.push(action.payload);
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.currentTransactions = action.payload;
            })
            .addCase(recordTransaction.fulfilled, (state, action) => {
                const account = state.accounts.find(a => a.id === action.payload.account.id);
                if (account) {
                    if (action.payload.type === 'INCOME') {
                        account.balance += action.payload.amount;
                    } else {
                        account.balance -= action.payload.amount;
                    }
                }
                state.currentTransactions.unshift(action.payload);
            });
    },
});

export default accountingSlice.reducer;
