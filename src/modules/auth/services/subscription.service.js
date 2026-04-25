import api from "../../../api/api";

export const subscriptionService = {
  getSubscriptions: async () => {
    const response = await api.get("subscriptions");
    return response.data;
  },
  createSubscription: async (subscriptionData) => {
    const response = await api.post("subscriptions", subscriptionData);
    return response.data;
  },
  updateSubscription: async (id, subscriptionData) => {
    const response = await api.put(`subscriptions/${id}`, subscriptionData);
    return response.data;
  },
  cancelSubscription: async (id) => {
    const response = await api.post(`subscriptions/${id}/cancel`);
    return response.data;
  }
};
