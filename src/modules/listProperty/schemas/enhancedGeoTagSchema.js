import { z } from 'zod';

/**
 * Enhanced Geo Tag Schema
 * Phase 1 & 2 Enhancement - Step 2: Geo Tag
 * 
 * Adds verification mode, environment type, and optional verification photo
 */
export const enhancedGeoTagSchema = z.object({
  // Existing fields (from geoTagSchema)
  geoTagStatus: z.enum(['pending', 'success', 'failed']).default('pending'),
  geoTagCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
  geoTagDistance: z.number().optional(),
  geoTagTimestamp: z.string().optional(),
  
  // NEW: Phase 1 enhancements
  verificationMode: z.enum([
    'automatic',      // GPS-based automatic verification
    'manual',         // Manual verification (for agents with override)
  ]).default('automatic'),
  
  environmentType: z.enum([
    'urban',
    'semi_urban',
    'rural'
  ]).optional(),
  
  // NEW: Phase 2 enhancement
  verificationPhotoUrl: z.string().url().optional(),
  verificationPhotoUploadedAt: z.string().optional(),
}).refine((data) => {
  // If status is success, coordinates must be present
  if (data.geoTagStatus === 'success' && !data.geoTagCoordinates) {
    return false;
  }
  return true;
}, {
  message: 'Geo tag coordinates are required for successful verification',
  path: ['geoTagCoordinates'],
});

export default enhancedGeoTagSchema;
