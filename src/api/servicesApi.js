import api from './axiosConfig.js';

/**
 * servicesApi
 * All CRUD operations for service_config (Services)
 */

// GET /api/services
export const getAllServices = async () => {
  const res = await api.get('/services');
  return res.data?.data ?? res.data ?? [];
};

// POST /api/services
export const createService = async (payload) => {
  const res = await api.post('/services', payload);
  return res.data?.data ?? res.data;
};

// PUT /api/services/:id  — uses service_id column
export const updateService = async (id, payload) => {
  const res = await api.put(`/services/${id}`, payload);
  return res.data?.data ?? res.data;
};

// DELETE /api/services/:id  — uses service_id column
export const deleteService = async (id) => {
  const res = await api.delete(`/services/${id}`);
  return res.data;
};
