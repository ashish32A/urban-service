import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceApiService from '../../services/serviceApiService';

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await serviceApiService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await serviceApiService.getById(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Service not found');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    list: [],
    current: null,
    total: 0,
    page: 1,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentService(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.services;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(fetchServiceById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false; state.current = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      });
  },
});

export const { clearCurrentService } = serviceSlice.actions;
export const selectServices = (state) => state.services.list;
export const selectCurrentService = (state) => state.services.current;
export const selectServicesLoading = (state) => state.services.isLoading;

export default serviceSlice.reducer;
