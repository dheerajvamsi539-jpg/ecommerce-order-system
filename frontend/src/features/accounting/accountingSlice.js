import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const ACCOUNTING_API = 'http://localhost:8081/api/accounting';

export const fetchAccounts = createAsyncThunk('accounting/fetchAccounts', async () => {
    const response = await fetch(`${ACCOUNTING_API}/accounts`);
    return response.json();
});

export const createAccount = createAsyncThunk('accounting/createAccount', async (name) => {
    const response = await fetch(`${ACCOUNTING_API}/accounts?name=${encodeURIComponent(name)}`, {
        method: 'POST',
    });
    return response.json();
});

export const recordTransaction = createAsyncThunk('accounting/recordTransaction', async (transactionData) => {
    const { accountId, description, amount, type } = transactionData;
    const response = await fetch(
        `${ACCOUNTING_API}/transactions?accountId=${accountId}&description=${encodeURIComponent(description)}&amount=${amount}&type=${type}`,
        { method: 'POST' }
    );
    return response.json();
});

export const fetchTransactions = createAsyncThunk('accounting/fetchTransactions', async (accountId) => {
    const response = await fetch(`${ACCOUNTING_API}/accounts/${accountId}/transactions`);
    return response.json();
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
                // Update account balance locally or refetch
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
