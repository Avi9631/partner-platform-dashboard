import { apiCall, apiFetch } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
    // Check if draftData contains file upload fields
    const hasFiles = 
      (draftData.mediaData && Array.isArray(draftData.mediaData) && draftData.mediaData.some(m => m.file instanceof File)) ||
      (draftData.propertyPlans && Array.isArray(draftData.propertyPlans) && draftData.propertyPlans.some(p => p.file instanceof File)) ||
      (draftData.documents && Array.isArray(draftData.documents) && draftData.documents.some(d => d.file instanceof File));

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('draftId', draftId);
      
      // Add draftType if provided
      if (draftData.draftType) {
        formData.append('draftType', draftData.draftType);
      }

      // Prepare metadata arrays and files
      const mediaDataMetadata = [];
      const docMediaDataMetadata = [];
      const planMediaDataMetadata = [];

      // Process mediaData (images/videos)
      if (draftData.mediaData && Array.isArray(draftData.mediaData)) {
        draftData.mediaData.forEach((media) => {
          if (media.file instanceof File) {
            // Add metadata (excluding file)
            mediaDataMetadata.push({
              title: media.title || '',
              type: media.type || 'image',
              category: media.category || 'general',
              description: media.description || '',
              docType: media.docType || '',
            });
            // Add file
            formData.append('mediaData', media.file);
          }
        });
      }

      // Process documents
      if (draftData.documents && Array.isArray(draftData.documents)) {
        draftData.documents.forEach((doc) => {
          if (doc.file instanceof File) {
            // Add metadata (excluding file)
            docMediaDataMetadata.push({
              title: doc.title || '',
              type: doc.type || 'document',
              category: doc.category || 'legal',
              description: doc.description || '',
              docType: doc.docType || '',
            });
            // Add file
            formData.append('docMediaData', doc.file);
          }
        });
      }

      // Process property plans
      if (draftData.propertyPlans && Array.isArray(draftData.propertyPlans)) {
        draftData.propertyPlans.forEach((plan) => {
          if (plan.file instanceof File) {
            // Add metadata (excluding file)
            planMediaDataMetadata.push({
              title: plan.title || '',
              type: plan.type || 'floor-plan',
              category: plan.category || 'layout',
              description: plan.description || '',
              docType: plan.docType || '',
            });
            // Add file
            formData.append('planMediaData', plan.file);
          }
        });
      }

      // Build draftData JSON with metadata arrays
      const draftDataForAPI = {
        ...draftData,
        mediaData: mediaDataMetadata,
        docMediaData: docMediaDataMetadata,
        planMediaData: planMediaDataMetadata,
      };

      // Remove the original arrays with File objects (keeping the metadata-only versions)
      // No need to delete mediaData as we've already replaced it with metadata
      delete draftDataForAPI.documents;
      delete draftDataForAPI.propertyPlans;

      formData.append('draftData', JSON.stringify(draftDataForAPI));

      // Use apiFetch for FormData (handles auth with cookies, no Content-Type header needed for FormData)
      const response = await apiFetch(`${backendUrl}/updateListingDraft`, {
        method: 'PATCH',
        credentials: 'include', // Explicitly include cookies for authentication
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to update draft');
      }

      return await response.json();
    } else {
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
    }
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
