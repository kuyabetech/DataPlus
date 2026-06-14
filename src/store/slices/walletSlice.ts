import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/apiClient';

interface WalletState {
  balance: number;
  accountNumber: string | null;
  bankName: string | null;
  accountName: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: 0,
  accountNumber: null,
  bankName: null,
  accountName: null,
  isLoading: false,
  error: null,
};

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async () => {
    const response = await api.get('/wallet/balance');
    return response.data;
  }
);

export const generateVirtualAccount = createAsyncThunk(
  'wallet/generateAccount',
  async () => {
    const response = await api.post('/wallet/generate-account');
    return response.data;
  }
);

export const fundWallet = createAsyncThunk(
  'wallet/fund',
  async (amount: number) => {
    const response = await api.post('/wallet/fund', { amount });
    return response.data;
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch balance';
      })
      .addCase(generateVirtualAccount.fulfilled, (state, action) => {
        state.accountNumber = action.payload.accountNumber;
        state.bankName = action.payload.bankName;
        state.accountName = action.payload.accountName;
      });
  },
});

export const { updateBalance, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;