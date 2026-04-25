import { apiClient } from "../../../api/api";

/**
 * Admin Service - Handles all admin-related API calls
 * This service manages requests for admin dashboard, users, modules, and subscriptions
 */

export const adminService = {
  /**
   * Get all users (admin dashboard)
   */
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Update user status (admin)
   */
  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  /**
   * Delete user (admin)
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  /**
   * Get all modules
   */
  getModules: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/modules", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  },

  /**
   * Create new module
   */
  createModule: async (moduleData) => {
    try {
      const response = await apiClient.post("/admin/modules", moduleData);
      return response.data;
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  },

  /**
   * Update module
   */
  updateModule: async (moduleId, moduleData) => {
    try {
      const response = await apiClient.put(`/admin/modules/${moduleId}`, moduleData);
      return response.data;
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  },

  /**
   * Delete module
   */
  deleteModule: async (moduleId) => {
    try {
      const response = await apiClient.delete(`/admin/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get("/admin/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  /**
   * Get all plan features (admin management)
   */
  getPlanFeatures: async (params = {}) => {
    try {
      const response = await apiClient.get("/admin/plans/features", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching plan features:", error);
      throw error;
    }
  },

  /**
   * Update plan features
   */
  updatePlanFeatures: async (featureId, featureData) => {
    try {
      const response = await apiClient.put(`/admin/plans/features/${featureId}`, featureData);
      return response.data;
    } catch (error) {
      console.error("Error updating plan features:", error);
      throw error;
    }
  },
};
