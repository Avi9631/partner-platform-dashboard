import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

export const walletApi = {
  // Get wallet balance
  getBalance: async () => {
    return apiCall(`${backendUrl}/api/wallet/balance`);
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
    const url = `${backendUrl}/api/wallet/transactions${queryString ? `?${queryString}` : ""}`;
    return apiCall(url);
  },

  // Get wallet statistics
  getStats: async () => {
    return apiCall(`${backendUrl}/api/wallet/stats`);
  },

  // Add funds (Admin only)
  addFunds: async (userId, amount, reason, metadata = {}) => {
    return apiCall(`${backendUrl}/api/wallet/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, reason, metadata }),
    });
  },

  // Deduct funds (Admin only)
  deductFunds: async (userId, amount, reason, metadata = {}) => {
    return apiCall(`${backendUrl}/api/wallet/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, reason, metadata }),
    });
  },

  // Check if user has sufficient funds
  checkSufficientFunds: async (amount) => {
    return apiCall(`${backendUrl}/api/wallet/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
  },
};

export default walletApi;
