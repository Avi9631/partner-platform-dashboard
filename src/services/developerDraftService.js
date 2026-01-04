import { apiCall } from "../lib/apiClient";

const backendUrl = process.env.VITE_API_URL || "http://localhost:3000";

export const developerDraftApi = {
  // Create a new developer draft using unified API
  createDeveloperDraft: async (draftData = {}) => {
    return apiCall(`${backendUrl}/createListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        draftType: 'DEVELOPER',
        ...draftData 
      }),
    });
  },

  // Update an existing developer draft using unified API
  updateDeveloperDraft: async (draftId, draftData) => {
    return apiCall(`${backendUrl}/updateListingDraft`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        draftId: draftId, 
        draftType: 'DEVELOPER',
        ...draftData 
      }),
    });
  },

  // Delete a developer draft using unified API
  deleteDeveloperDraft: async (draftId) => {
    return apiCall(`${backendUrl}/deleteListingDraft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        id: draftId,
        draftType: 'DEVELOPER'
      }),
    });
  },

  // Submit a developer draft using unified API
  submitDeveloperDraft: async (draftId) => {
    return apiCall(`${backendUrl}/submitListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        id: draftId,
        draftType: 'DEVELOPER'
      }),
    });
  },

  // Get user's developer drafts using unified API
  getUserDeveloperDrafts: async () => {
    return apiCall(`${backendUrl}/listingDraft?draftType=DEVELOPER`);
  },

  // Get a developer draft by ID using unified API
  getDeveloperDraftById: async (draftId) => {
    return apiCall(`${backendUrl}/listingDraft/${draftId}`);
  },
};

export default developerDraftApi;
