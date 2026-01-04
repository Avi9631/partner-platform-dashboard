import { apiCall, apiFetch } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const draftApi = {
  // Create a new listing draft
  createListingDraft: async (draftType = 'PROPERTY') => {
    return apiCall(`${backendUrl}/createListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftType }),
    });
  },

  // Update an existing listing draft (with file upload support)
  updateListingDraft: async (draftId, draftData) => {

    console.log(draftData);
 
      // No files, use regular JSON request
      const payload = { draftId, draftData };
      if (draftData.draftType) {
        payload.draftType = draftData.draftType;
      }
      return apiCall(`${backendUrl}/updateListingDraft`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
 
  },

  // Delete a listing draft
  deleteListingDraft: async (draftId) => {
    return apiCall(`${backendUrl}/deleteListingDraft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftId }),
    });
  },

  // Submit a listing draft
  submitListingDraft: async (draftId) => {
    return apiCall(`${backendUrl}/submitListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draftId }),
    });
  },

  // Get user's listing drafts
  getUserListingDrafts: async (draftType = null) => {
    const url = draftType 
      ? `${backendUrl}/listingDraft?draftType=${draftType}`
      : `${backendUrl}/listingDraft`;
    return apiCall(url);
  },

  // Get a listing draft by ID
  getListingDraftById: async (draftId) => {
    return apiCall(`${backendUrl}/listingDraft/${draftId}`);
  },
};

export default draftApi;
