import { apiCall } from '../lib/apiClient';

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export const developerApi = {
  /**
   * Publish a developer profile
   * Triggers the Temporal workflow for publishing
   */
  publishDeveloper: async (developerData) => {
    return apiCall(`${backendUrl}/api/developer/publishDeveloper`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developerData),
    });
  },

  /**
   * Get current user's developer profiles
   */
  getMyDeveloperProfiles: async () => {
    return apiCall(`${backendUrl}/api/developer/my-profiles`);
  },

  /**
   * Get developer by ID
   */
  getDeveloperById: async (developerId) => {
    return apiCall(`${backendUrl}/api/developer/${developerId}`);
  },

  /**
   * Update developer profile
   */
  updateDeveloper: async (developerId, developerData) => {
    return apiCall(`${backendUrl}/api/developer/updateDeveloper/${developerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(developerData),
    });
  },
};

export default developerApi;
