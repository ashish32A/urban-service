import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApiService from '../../services/bookingApiService';

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      return await bookingApiService.create(bookingData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMine',
  async (params, { rejectWithValue }) => {
    try {
      return await bookingApiService.getMyBookings(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      return await bookingApiService.cancel(bookingId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentBooking(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false; state.current = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(fetchMyBookings.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false; state.list = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false; state.error = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export const selectBookings = (state) => state.bookings.list;
export const selectCurrentBooking = (state) => state.bookings.current;
export const selectBookingsLoading = (state) => state.bookings.isLoading;

export default bookingSlice.reducer;
