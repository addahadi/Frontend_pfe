import api from './axiosConfig.js';

/**
 * materialsApi
 * All CRUD operations for resource_catalog (Materials)
 */

// GET /api/materials
export const getAllMaterials = async () => {
  const res = await api.get('/materials');
  return res.data?.data ?? res.data ?? [];
};

// POST /api/materials
export const createMaterial = async (payload) => {
  const res = await api.post('/materials', payload);
  return res.data?.data ?? res.data;
};

// PUT /api/materials/:id
export const updateMaterial = async (id, payload) => {
  const res = await api.put(`/materials/${id}`, payload);
  return res.data?.data ?? res.data;
};

// DELETE /api/materials/:id
export const deleteMaterial = async (id) => {
  const res = await api.delete(`/materials/${id}`);
  return res.data;
};
