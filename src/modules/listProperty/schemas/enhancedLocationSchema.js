import { z } from 'zod';

/**
 * Enhanced Location Selection Schema
 * Phase 1 Enhancement - Step 1: Location Selection
 * 
 * Adds pincode, zone/region, and nearby landmarks
 */
export const enhancedLocationSchema = z.object({
  // Existing fields (from locationSelectionSchema)
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  addressText: z.string().min(1, 'Address is required'),
  landmark: z.string().optional(),
  showMapExact: z.boolean().default(false),
  
  // NEW: Phase 1 enhancements
  pincode: z.string()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits')
    .optional(),
  
  zone: z.enum([
    'north',
    'south', 
    'east',
    'west',
    'central',
    'north_east',
    'north_west',
    'south_east',
    'south_west',
    'suburban',
    'other'
  ]).optional(),
  
  nearbyLandmarks: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Landmark name is required').max(100, 'Max 100 characters'),
  })).max(5, 'Maximum 5 landmarks allowed').optional().default([]),
});

export default enhancedLocationSchema;
