import { apiFetch } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

/**
 * Fetch all leads with optional filters
 * @param {Object} filters - Filters for leads (type, reason, status, dateRange)
 * @returns {Promise<Object>} - Leads data
 */
export const fetchLeads = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.reason) queryParams.append('reason', filters.reason);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    
    const url = `${backendUrl}/api/leads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leads: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

/**
 * Fetch leads statistics
 * @returns {Promise<Object>} - Leads statistics
 */
export const fetchLeadsStats = async () => {
  try {
    const response = await apiFetch(`${backendUrl}/api/leads/stats`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leads stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching leads stats:", error);
    throw error;
  }
};

/**
 * Update lead status
 * @param {string} leadId - Lead ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated lead
 */
export const updateLeadStatus = async (leadId, status) => {
  try {
    const response = await apiFetch(`${backendUrl}/api/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lead status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

/**
 * Fetch single lead details
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} - Lead details
 */
export const fetchLeadDetails = async (leadId) => {
  try {
    const response = await apiFetch(`${backendUrl}/api/leads/${leadId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lead details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching lead details:", error);
    throw error;
  }
};
