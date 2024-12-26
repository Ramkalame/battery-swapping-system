import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  loading: false,
  shops: [],
  error: '',
  count: 0, 
};

export const fetchShops = createAsyncThunk('shops/fetchShops', async () => {
  const response = await axios.get(`${process.env.REACT_APP_URI}/shops/getAllShops`);
  return response.data; 
});


const shopSlice = createSlice({
  name: 'shops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.data; 
        state.count = action.payload.Count; 
        state.error = '';
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.shops = [];
        state.count = 0; 
        state.error = action.error.message;
      });
  },
});


export default shopSlice.reducer;
