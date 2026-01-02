import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const creditApi = {
  // Get credit balance
  getBalance: async () => {
    return apiCall(`${backendUrl}/api/credit/balance`);
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.transactionType) queryParams.append("transactionType", params.transactionType);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    const url = `${backendUrl}/api/credit/transactions${queryString ? `?${queryString}` : ""}`;
    return apiCall(url);
  },

  // Get credit statistics
  getStats: async () => {
    return apiCall(`${backendUrl}/api/credit/stats`);
  },

  // Add credits (Admin only)
  addCredits: async (userId, amount, reason, metadata = {}) => {
    return apiCall(`${backendUrl}/api/credit/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, reason, metadata }),
    });
  },

  // Deduct credits (Admin only)
  deductCredits: async (userId, amount, reason, metadata = {}) => {
    return apiCall(`${backendUrl}/api/credit/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, reason, metadata }),
    });
  },

  // Check if user has sufficient credits
  checkSufficientCredits: async (amount) => {
    return apiCall(`${backendUrl}/api/credit/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
  },
};

export default creditApi;
