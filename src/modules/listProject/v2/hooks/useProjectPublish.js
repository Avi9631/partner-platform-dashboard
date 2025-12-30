import { useState } from 'react';
import { toast } from 'sonner';
import { projectApi } from '@/services/projectService';

/**
 * Custom hook for publishing a Project
 * Handles the publish logic and API call
 */
export const useProjectPublish = (draftId, formData) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const sanitizeData = (data) => {
    // Remove any empty strings, null, or undefined values
    const sanitized = {};
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      // Skip null, undefined, or empty strings
      if (value === null || value === undefined || value === '') {
        return;
      }
      
      // Handle arrays
      if (Array.isArray(value)) {
        const sanitizedArray = value.filter(item => 
          item !== null && item !== undefined && item !== ''
        );
        if (sanitizedArray.length > 0) {
          sanitized[key] = sanitizedArray;
        }
        return;
      }
      
      // Handle objects (recursively)
      if (typeof value === 'object' && !Array.isArray(value)) {
        const sanitizedObj = sanitizeData(value);
        if (Object.keys(sanitizedObj).length > 0) {
          sanitized[key] = sanitizedObj;
        }
        return;
      }
      
      // Include all other values
      sanitized[key] = value;
    });
    
    return sanitized;
  };

  const publish = async () => {
    if (!draftId) {
      toast.error('No draft ID found. Please save your progress first.');
      return { success: false };
    }

    try {
      setIsPublishing(true);
      
      // Sanitize the form data before sending
      const sanitizedData = sanitizeData(formData);
      
      console.log('Publishing Project with data:', { draftId, sanitizedData });
      
      // Call the API to publish the project
      const response = await projectApi.publishProject(draftId, sanitizedData);
      
      if (response.success) {
        toast.success('Project published successfully! 🎉');
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to publish project');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error publishing project:', error);
      toast.error(error.message || 'An error occurred while publishing');
      return { success: false, error: error.message };
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    publish,
    isPublishing,
  };
};
