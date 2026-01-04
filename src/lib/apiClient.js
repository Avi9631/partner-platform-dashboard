/**
 * API Client with automatic token refresh
 * Handles 401/403 errors by attempting to refresh the access token
 * and retrying the original request
 */

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

let isRefreshing = false;
let refreshPromise = null;

/**
 * Refresh the access token
 */
const refreshAccessToken = async () => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = fetch(`${backendUrl}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Token refresh failed");
      }
      return response.json();
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

/**
 * Enhanced fetch with automatic token refresh
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {boolean} skipRetry - Skip retry on 401/403 (used internally to prevent infinite loops)
 * @returns {Promise<Response>}
 */
export const apiFetch = async (url, options = {}, skipRetry = false) => {
  // Ensure credentials are included by default
  const fetchOptions = {
    ...options,
    credentials: options.credentials || "include",
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If we get 401 or 403, try to refresh the token and retry
    if ((response.status === 401 || response.status === 403) && !skipRetry) {
      // Skip retry for auth endpoints to avoid infinite loops
      const isAuthEndpoint = 
        url.includes("/auth/status") || 
        url.includes("/auth/refresh-token") || 
        url.includes("/auth/logout");

      if (isAuthEndpoint) {
        return response;
      }

      try {
        // Attempt to refresh the token
        await refreshAccessToken();

        // Retry the original request with skipRetry flag
        return apiFetch(url, options, true);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        
        // If refresh fails, redirect to login
        // This will be caught by AuthContext
        window.dispatchEvent(new CustomEvent("auth:logout"));
        
        return response;
      }
    }

    return response;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};

/**
 * Helper function to make API calls with automatic JSON parsing
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
export const apiCall = async (url, options = {}) => {
  const response = await apiFetch(url, options);

  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default error message
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response;
};

export default { apiFetch, apiCall };
