import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const draftApi = {
  // Create a new listing draft
  createListingDraft: async (draftData) => {
    return apiCall(`${backendUrl}/createListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draftData),
    });
  },

  // Update an existing listing draft
  updateListingDraft: async (draftId, draftData) => {
    return apiCall(`${backendUrl}/updateListingDraft`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftId: draftId, ...draftData }),
    });
  },

  // Delete a listing draft
  deleteListingDraft: async (draftId) => {
    return apiCall(`${backendUrl}/deleteListingDraft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: draftId }),
    });
  },

  // Submit a listing draft
  submitListingDraft: async (draftId) => {
    return apiCall(`${backendUrl}/submitListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: draftId }),
    });
  },

  // Get user's listing drafts
  getUserListingDrafts: async () => {
    return apiCall(`${backendUrl}/listingDraft`);
  },

  // Get a listing draft by ID
  getListingDraftById: async (draftId) => {
    return apiCall(`${backendUrl}/listingDraft/${draftId}`);
  },
};

export default draftApi;
