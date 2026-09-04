import { apiClient } from './api';

export const eventApi = {
  /**
   * Fetch all published events with optional filtering & sorting params
   * @param {Object} params - { category, query, mode, priceTier, college, sort }
   */
  async getAllEvents(params = {}) {
    const res = await apiClient.get('/events', { params });
    return res.data;
  },

  /**
   * Fetch single event details by its primary ID
   * @param {number|string} id 
   */
  async getEventById(id) {
    const res = await apiClient.get(`/events/${id}`);
    return res.data;
  },

  /**
   * Quick search events by query string
   * @param {string} query 
   */
  async searchEvents(query) {
    const res = await apiClient.get('/events', { params: { query } });
    return res.data;
  },

  /**
   * Filter events by multi-dimensional criteria
   * @param {Object} filters - { category, mode, priceTier, sort, query }
   */
  async filterEvents(filters = {}) {
    const params = {};
    if (filters.category && filters.category !== 'All') params.category = filters.category;
    if (filters.mode && filters.mode !== 'All') params.mode = filters.mode;
    if (filters.priceTier && filters.priceTier !== 'All') params.priceTier = filters.priceTier;
    if (filters.sort && filters.sort !== 'Default') params.sort = filters.sort;
    if (filters.query && filters.query.trim() !== '') params.query = filters.query.trim();

    const res = await apiClient.get('/events', { params });
    return res.data;
  }
};

export default eventApi;
