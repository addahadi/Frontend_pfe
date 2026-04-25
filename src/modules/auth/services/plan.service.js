import api from "../../../api/api";

export const planService = {
  getPlans: async () => {
    const response = await api.get("plans");
    return response.data;
  },
  createPlan: async (planData) => {
    const response = await api.post("plans", planData);
    return response.data;
  },
  updatePlan: async (id, planData) => {
    const response = await api.put(`plans/${id}`, planData);
    return response.data;
  },
  deletePlan: async (id) => {
    const response = await api.delete(`plans/${id}`);
    return response.data;
  }
};
