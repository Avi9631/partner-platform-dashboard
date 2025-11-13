import { z } from 'zod';

/**
 * Media Upload Schema
 * Phase 2 Enhancement - NEW Step: Media Upload
 * 
 * Handles photos, videos, floor plans, and virtual tour links
 */
export const mediaUploadSchema = z.object({
  photos: z.array(z.object({
    id: z.string(),
    url: z.string().url('Invalid image URL'),
    caption: z.string().max(100, 'Caption is too long').optional(),
    isPrimary: z.boolean().default(false),
    order: z.number().int().min(0),
    uploadedAt: z.string(),
    size: z.number().optional(), // in bytes
    mimeType: z.string().optional(),
  }))
    .min(5, 'Minimum 5 photos required')
    .max(20, 'Maximum 20 photos allowed')
    .refine((photos) => photos.filter(p => p.isPrimary).length === 1, {
      message: 'Exactly one photo must be marked as primary',
    })
    .optional()
    .default([]),
  
  videos: z.array(z.object({
    id: z.string(),
    url: z.string().url('Invalid video URL'),
    caption: z.string().max(100, 'Caption is too long').optional(),
    duration: z.number().int().min(1).max(600).optional(), // max 10 minutes
    size: z.number().max(100 * 1024 * 1024, 'Video size cannot exceed 100MB').optional(),
    uploadedAt: z.string(),
    mimeType: z.string().optional(),
  }))
    .max(2, 'Maximum 2 videos allowed')
    .optional()
    .default([]),
  
  floorPlan: z.object({
    id: z.string(),
    url: z.string().url('Invalid floor plan URL'),
    uploadedAt: z.string(),
    mimeType: z.string().optional(),
  }).optional(),
  
  virtualTourUrl: z.string()
    .url('Invalid virtual tour URL')
    .refine((url) => {
      // Optional: validate specific virtual tour platforms
      const validDomains = ['matterport.com', 'google.com/maps', 'youtube.com', 'youtu.be'];
      return validDomains.some(domain => url.includes(domain)) || true; // Allow all for now
    }, {
      message: 'Virtual tour URL should be from supported platforms',
    })
    .optional(),
  
  // Auto-generated field
  mediaCapturedDate: z.string().optional(),
});

export default mediaUploadSchema;
