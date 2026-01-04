import { apiFetch, apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const authApi = {
  // Check authentication status
  checkStatus: async () => {
    return apiCall(`${backendUrl}/auth/status`);
  },

  // Refresh access token
  refreshToken: async () => {
    return apiCall(`${backendUrl}/auth/refresh-token`, {
      method: "POST",
    });
  },

  // Logout
  logout: async () => {
    return apiFetch(`${backendUrl}/auth/logout`);
  },

  // Get Google OAuth URL
  getGoogleAuthUrl: (redirectUri) => {
    const encodedRedirect = encodeURIComponent(redirectUri);
    return `${backendUrl}/auth/google?redirectUri=${encodedRedirect}`;
  },

  // Get Microsoft OAuth URL
  getMicrosoftAuthUrl: (redirectUri) => {
    const encodedRedirect = encodeURIComponent(redirectUri);
    return `${backendUrl}/auth/microsoft?redirectUri=${encodedRedirect}`;
  },
};

export default authApi;
