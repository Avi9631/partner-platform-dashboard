import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const developerDraftApi = {
  // Create a new developer draft
  createDeveloperDraft: async (draftData) => {
    return apiCall(`${backendUrl}/createDeveloperDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draftData),
    });
  },

  // Update an existing developer draft
  updateDeveloperDraft: async (draftId, draftData) => {
    return apiCall(`${backendUrl}/updateDeveloperDraft`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftId: draftId, ...draftData }),
    });
  },

  // Delete a developer draft
  deleteDeveloperDraft: async (draftId) => {
    return apiCall(`${backendUrl}/deleteDeveloperDraft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: draftId }),
    });
  },

  // Submit a developer draft
  submitDeveloperDraft: async (draftId) => {
    return apiCall(`${backendUrl}/submitDeveloperDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: draftId }),
    });
  },

  // Get user's developer drafts
  getUserDeveloperDrafts: async () => {
    return apiCall(`${backendUrl}/developerDraft`);
  },

  // Get a developer draft by ID
  getDeveloperDraftById: async (draftId) => {
    return apiCall(`${backendUrl}/developerDraft/${draftId}`);
  },
};

export default developerDraftApi;
