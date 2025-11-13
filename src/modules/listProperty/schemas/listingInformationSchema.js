import { z } from 'zod';

/**
 * Enhanced Listing Information Schema
 * Phase 1 Enhancement - Step 13: Listing Info
 */
export const listingInformationSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  
  // NEW: Phase 1 enhancements
  propertyCondition: z.enum([
    'new',               // Brand new, never occupied
    'excellent',         // Like new, well maintained
    'good',              // Well maintained, minor wear
    'average',           // Normal wear and tear
    'needs_renovation',  // Requires repair/renovation
    'under_renovation'   // Currently being renovated
  ]).optional(),
  
  reasonForSelling: z.string()
    .max(200, 'Reason must not exceed 200 characters')
    .optional(),
  
  uniqueSellingPoints: z.array(z.enum([
    'corner_plot',
    'park_facing',
    'metro_nearby',
    'gated_community',
    'high_roi',
    'premium_location',
    'vastu_compliant',
    'newly_renovated',
    'ready_to_move',
    'furnished',
    'low_maintenance',
    'investment_property',
    'rental_income',
    'close_to_schools',
    'close_to_hospitals',
    'close_to_shopping',
    'lake_view',
    'sea_view',
    'mountain_view',
    'green_certified',
    'smart_home',
    'other'
  ])).max(8, 'Maximum 8 USPs allowed').optional().default([]),
  
  customUSPs: z.array(z.object({
    id: z.string(),
    label: z.string().min(3).max(50),
  })).max(3, 'Maximum 3 custom USPs allowed').optional().default([]),
  
  listingVisibility: z.enum([
    'public',         // Visible to all
    'private',        // Only visible to invited users
    'broker_only',    // Only visible to registered brokers
    'premium'         // Premium listing with featured placement
  ]).default('public'),
  
  isFeatured: z.boolean().default(false),
  featuredUntil: z.string().optional(),
});

export default listingInformationSchema;
