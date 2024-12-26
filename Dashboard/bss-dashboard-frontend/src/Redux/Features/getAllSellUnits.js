import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  loading: false,
  data: [],  
  sellUnitsCount: 0, 
  error: '',
};

export const fetchSellUnits = createAsyncThunk('customers/fetchSellUnits', async () => {
  const response = await axios.get(`${process.env.REACT_APP_URI}/customers/getAllSellUnits`)
  return response.data;  
});


const sellUnitsSlice = createSlice({
  name: 'sellUnits',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;  
        state.sellUnitsCount = action.payload.sellUnitsCount;  
        state.error = '';
      })
      .addCase(fetchSellUnits.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.sellUnitsCount = 0;
        state.error = action.error.message;
      });
  },
});

export default sellUnitsSlice.reducer;
