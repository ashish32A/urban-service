import api from './axiosInstance';

const bookingApiService = {
  async create(bookingData) {
    const { data } = await api.post('/bookings', bookingData);
    return data.booking;
  },

  async getMyBookings(params = {}) {
    const { data } = await api.get('/bookings/my', { params });
    return data.bookings;
  },

  async getById(id) {
    const { data } = await api.get(`/bookings/${id}`);
    return data.booking;
  },

  async cancel(id) {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data.booking;
  },

  async updateStatus(id, status) {
    const { data } = await api.patch(`/bookings/${id}/status`, { status });
    return data.booking;
  },

  async rateBooking(id, rating) {
    const { data } = await api.post(`/bookings/${id}/rate`, rating);
    return data;
  },

  // Vendor
  async getVendorBookings(params = {}) {
    const { data } = await api.get('/bookings/vendor', { params });
    return data.bookings;
  },

  // Admin
  async getAllBookings(params = {}) {
    const { data } = await api.get('/bookings', { params });
    return data;
  },
};

export default bookingApiService;
