import { z } from 'zod';

/**
 * Media Upload Schema
 * Unified schema for all media and document uploads
 * 
 * Handles photos, videos, floor plans, and documents in a single array
 */
export const mediaUploadSchema = z.object({
  mediaData: z.array(z.object({
    url: z.string(), // Made optional as it might not exist during upload
    docType: z.enum(['media', 'property_plan', 'document']).optional(),
    title: z.string().max(200, 'Title is too long').optional(),
    description: z.string().max(500, 'Description is too long').optional(),
    category: z.string().max(100, 'Category is too long').optional(),
    file: z.any().optional(),
    fileSize: z.number().optional(), // in bytes
  }))
    .min(1, 'At least 1 file is required')
    .refine((mediaData) => {
      // Check if at least one image exists and is successfully uploaded (has url)
      const validImages = mediaData.filter(m => m.url);
      return validImages.length >= 1;
    }, {
      message: 'At least 1 successfully uploaded image is required',
    }),
});

export default mediaUploadSchema;
