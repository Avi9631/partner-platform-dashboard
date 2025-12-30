import { useState } from 'react';
import { toast } from 'sonner';
import { propertyApi } from '@/services/propertyService';

/**
 * Hook to handle property publishing logic
 * Separated from UI components for better maintainability
 */
export function usePropertyPublish(draftId, formData) {
  const [isPublishing, setIsPublishing] = useState(false);

  const sanitizeData = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Error sanitizing data:', error);
      const sanitized = {};
      for (const key in obj) {
        const value = obj[key];
        if (
          value !== null && 
          value !== undefined &&
          typeof value !== 'function' &&
          !(value instanceof HTMLElement) &&
          !(value instanceof Window)
        ) {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
  };

  const publish = async () => {
    if (!draftId) {
      toast.error("No Draft Found", {
        description: "Please save your property details first before publishing.",
      });
      return { success: false };
    }

    try {
      setIsPublishing(true);
      
      const propertyData = sanitizeData({
        ...formData,
        propertyName: formData.title || formData.propertyName || formData.customPropertyName,
      });

      console.log('Publishing property with data:', propertyData);
      const response = await propertyApi.publishProperty(draftId, propertyData);

      if (response.success) {
        toast.success("🎉 Property Publishing Started!", {
          description: response.data?.message || "Your property is being processed. You'll be notified once it's live.",
          duration: 5000,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to publish property');
      }
    } catch (error) {
      console.error('Error publishing property:', error);
      toast.error("Publishing Failed", {
        description: error.message || "Failed to publish property. Please try again.",
      });
      return { success: false, error };
    } finally {
      setIsPublishing(false);
    }
  };

  return { publish, isPublishing };
}

export default usePropertyPublish;
