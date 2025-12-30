import { useState } from 'react';
import { toast } from 'sonner';
import { pgHostelApi } from '@/services/pgHostelService';

/**
 * Hook to handle PG/Hostel publishing logic
 * Separated from UI components for better maintainability
 */
export function usePgPublish(draftId, formData) {
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
        description: "Please save your PG/Hostel details first before publishing.",
      });
      return { success: false };
    }

    try {
      setIsPublishing(true);
      
      const pgHostelData = sanitizeData({
        ...formData,
        draftId,
        pgHostelName: formData.pgHostelName || formData.propertyName || formData.title,
      });

      console.log('Publishing PG/Hostel with data:', pgHostelData);
      const response = await pgHostelApi.publishPgColiveHostel(pgHostelData);

      if (response.success) {
        toast.success("🎉 PG/Hostel Publishing Started!", {
          description: response.data?.message || "Your listing is being processed. You'll be notified once it's live.",
          duration: 5000,
        });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to publish PG/Hostel');
      }
    } catch (error) {
      console.error('Error publishing PG/Hostel:', error);
      toast.error("Publishing Failed", {
        description: error.message || "Failed to publish PG/Hostel. Please try again.",
      });
      return { success: false, error };
    } finally {
      setIsPublishing(false);
    }
  };

  return { publish, isPublishing };
}

export default usePgPublish;
