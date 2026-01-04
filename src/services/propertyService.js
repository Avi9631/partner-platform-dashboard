import { apiCall } from "../lib/apiClient";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export const propertyApi = {
  // Publish a property from draft
  publishProperty: async (draftId, propertyData) => {
    return apiCall(`${backendUrl}/api/property/publishProperty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draftId,
        ...propertyData
      }),
    });
  },

  // Get user's properties
  getMyProperties: async () => {
    return apiCall(`${backendUrl}/api/property/my-properties`, {
      method: "GET",
    });
  },

  // Get property by ID
  getPropertyById: async (propertyId) => {
    return apiCall(`${backendUrl}/api/property/${propertyId}`, {
      method: "GET",
    });
  },

  // Update property
  updateProperty: async (propertyId, propertyData) => {
    return apiCall(`${backendUrl}/api/property/${propertyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    });
  },

  // Delete property
  deleteProperty: async (propertyId) => {
    return apiCall(`${backendUrl}/api/property/${propertyId}`, {
      method: "DELETE",
    });
  },

  // List properties with filters
  listProperties: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = `${backendUrl}/api/property/list${queryString ? `?${queryString}` : ''}`;

    return apiCall(url, {
      method: "GET",
    });
  },
};
