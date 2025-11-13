const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const draftApi = {
  // Create a new listing draft
  createListingDraft: async (draftData) => {
    const response = await fetch(`${backendUrl}/createListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(draftData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create listing draft");
    }
    
    return response.json();
  },

  // Update an existing listing draft
  updateListingDraft: async (draftId, draftData) => {
    const response = await fetch(`${backendUrl}/updateListingDraft`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: draftId, ...draftData }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update listing draft");
    }
    
    return response.json();
  },

  // Delete a listing draft
  deleteListingDraft: async (draftId) => {
    const response = await fetch(`${backendUrl}/deleteListingDraft`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: draftId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete listing draft");
    }
    
    return response.json();
  },

  // Submit a listing draft
  submitListingDraft: async (draftId) => {
    const response = await fetch(`${backendUrl}/submitListingDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id: draftId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit listing draft");
    }
    
    return response.json();
  },

  // Get user's listing drafts
  getUserListingDrafts: async () => {
    const response = await fetch(`${backendUrl}/listingDraft`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch listing drafts");
    }
    
    return response.json();
  },

  // Get a listing draft by ID
  getListingDraftById: async (draftId) => {
    const response = await fetch(`${backendUrl}/listingDraft/${draftId}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch listing draft");
    }
    
    return response.json();
  },
};

export default draftApi;
