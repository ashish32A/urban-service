import api from './axiosInstance';

const serviceApiService = {
  async getAll(params = {}) {
    const { data } = await api.get('/services', { params });
    return data; // { services, total, page, pages }
  },

  async getById(id) {
    const { data } = await api.get(`/services/${id}`);
    return data.service;
  },

  async getByCategory(categorySlug, params = {}) {
    const { data } = await api.get(`/services/category/${categorySlug}`, { params });
    return data;
  },

  async search(query) {
    const { data } = await api.get('/services/search', { params: { q: query } });
    return data;
  },

  // Admin only
  async create(serviceData) {
    const { data } = await api.post('/services', serviceData);
    return data.service;
  },

  async update(id, serviceData) {
    const { data } = await api.put(`/services/${id}`, serviceData);
    return data.service;
  },

  async remove(id) {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  },
};

export default serviceApiService;
