import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/apiClient';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

interface TransactionState {
  items: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async () => {
    const response = await api.get('/wallet/transactions');
    return response.data.transactions;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    addTransaction: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load transactions';
      });
  },
});

export const { clearTransactionError, addTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
