import { apiCall } from "../lib/apiClient";

const backendUrl = import.meta.env.VITE_API_URL || "https://partner-platform-backend.onrender.com";

export const projectApi = {
  // Publish a project from draft
  publishProject: async (draftId, projectData) => {
    return apiCall(`${backendUrl}/api/project/publishProject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        draftId,
        ...projectData
      }),
    });
  },

  // Get user's projects
  getMyProjects: async () => {
    return apiCall(`${backendUrl}/api/project/my-projects`, {
      method: "GET",
    });
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    return apiCall(`${backendUrl}/api/project/${projectId}`, {
      method: "GET",
    });
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    return apiCall(`${backendUrl}/api/project/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  deleteProject: async (projectId) => {
    return apiCall(`${backendUrl}/api/project/${projectId}`, {
      method: "DELETE",
    });
  },

  // List projects with filters
  listProjects: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`${backendUrl}/api/project/list?${queryParams}`, {
      method: "GET",
    });
  },
};
