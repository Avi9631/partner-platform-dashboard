import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

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

  // Get comprehensive analytics for a property
  getPropertyAnalytics: async (draftId, timeRange = '7d') => {
    return apiCall(`${backendUrl}/api/listing-analytics/comprehensive/property/${draftId}?timeRange=${timeRange}`, {
      method: "GET",
    });
  },

  // Get leads for a property with filters and pagination
  getPropertyLeads: async (draftId, filters = {}) => {
    const queryParams = new URLSearchParams({
      listingType: 'PROPERTY',
      listingId: draftId,
      ...filters
    });

    const queryString = queryParams.toString();
    const url = `${backendUrl}/api/leads?${queryString}`;

    return apiCall(url, {
      method: "GET",
    });
  },

  // Get lead statistics for a property
  getPropertyLeadStats: async (draftId) => {
    return apiCall(`${backendUrl}/api/leads/stats?listingType=PROPERTY&listingId=${draftId}`, {
      method: "GET",
    });
  },

  // Update lead status
  updateLeadStatus: async (leadId, status) => {
    return apiCall(`${backendUrl}/api/leads/${leadId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
  },
};
