import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  data:[],
  customers: [],
  error: '',
  customersCount: 0, 
};


export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {

  const response = await axios.get(`${process.env.REACT_APP_URI}/customers/getAllCustomers`);
  return response.data; 
  
});

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.data; 
        state.customersCount = action.payload.customersCount; 
        state.error = '';
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.customers = [];
        state.customersCount = 0;
        state.error = action.error.message;
      });
  },
});

export default customerSlice.reducer;
