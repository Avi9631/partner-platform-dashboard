const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const authApi = {
  // Check authentication status
  checkStatus: async () => {
    const response = await fetch(`${backendUrl}/auth/status`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Not authenticated");
    }
    return response.json();
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await fetch(`${backendUrl}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    return response.json();
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${backendUrl}/auth/logout`, {
      credentials: "include",
    });
    return response;
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
