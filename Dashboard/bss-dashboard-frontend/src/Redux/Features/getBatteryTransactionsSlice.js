import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  transactions: [],
  error: '',
};

// Async thunk to fetch battery transactions
export const fetchBatteryTransactions = createAsyncThunk(
  'batteryTransactions/fetchBatteryTransactions',
  async () => {
    const response = await axios.get('http://localhost:4000/customers/getBatteryTransactions');
    return response.data; // Adjust based on your API's response structure
  }
);

// Create a slice
const batteryTransactionsSlice = createSlice({
  name: 'batteryTransactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatteryTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBatteryTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data; // Assuming data is in the `data` field
        state.error = '';
      })
      .addCase(fetchBatteryTransactions.rejected, (state, action) => {
        state.loading = false;
        state.transactions = [];
        state.error = action.error.message;
      });
  },
});

export default batteryTransactionsSlice.reducer;
