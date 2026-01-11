import { apiCall } from '../lib/apiClient';

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

export const pgHostelApi = {
  /**
   * Publish a PG/Colive/Hostel listing
   * Triggers the Temporal workflow for publishing
   */
  publishPgColiveHostel: async (pgHostelData) => {
    return apiCall(`${backendUrl}/api/pg-hostel/publishPgColiveHostel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pgHostelData),
    });
  },

  /**
   * Get current user's PG/Hostel profiles
   */
  getMyPgHostelProfiles: async () => {
    return apiCall(`${backendUrl}/api/pg-hostel/my-profiles`);
  },

  /**
   * Get PG/Hostel by ID
   */
  getPgHostelById: async (pgHostelId) => {
    return apiCall(`${backendUrl}/api/pg-hostel/${pgHostelId}`);
  },

  /**
   * Get PG/Hostel by slug
   */
  getPgHostelBySlug: async (slug) => {
    return apiCall(`${backendUrl}/api/pg-hostel/slug/${slug}`);
  },

  /**
   * Update PG/Hostel profile
   */
  updatePgHostel: async (pgHostelId, pgHostelData) => {
    return apiCall(`${backendUrl}/api/pg-hostel/${pgHostelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pgHostelData),
    });
  },

  /**
   * List PG/Hostels with filters
   */
  listPgHostels: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`${backendUrl}/api/pg-hostel/list?${params.toString()}`);
  },

  /**
   * Get leads for a specific PG/Hostel listing
   */
  getPgLeads: async (draftId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    return apiCall(`${backendUrl}/api/listing-views/draft/${draftId}?${queryParams.toString()}`);
  },

  /**
   * Update lead status
   */
  updateLeadStatus: async (leadId, status) => {
    return apiCall(`${backendUrl}/api/listing-views/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  },
};

export default pgHostelApi;
