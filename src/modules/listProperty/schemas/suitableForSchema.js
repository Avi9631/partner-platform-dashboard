import { z } from 'zod';

/**
 * Enhanced Suitable For Schema
 * Phase 1 Enhancement - Step 12: Suitable For (Rent/Lease only)
 */
export const suitableForSchema = z.object({
  listingType: z.string().optional(),
  suitableFor: z.array(z.enum(['family', 'bachelors', 'company', 'students']))
    .optional()
    .default([]),
  
  // NEW: Phase 1 enhancements
  smokingAllowed: z.boolean().default(false),
  
  petsAllowed: z.boolean().default(false),
  
  petsType: z.array(z.enum([
    'dogs',
    'cats',
    'birds',
    'small_pets',
    'all_pets'
  ])).optional().default([]),
  
  subleasingAllowed: z.boolean().default(false),
  
  minimumStayDuration: z.enum([
    '1_month',
    '3_months',
    '6_months',
    '1_year',
    '2_years',
    '3_years',
    'negotiable'
  ]).optional(),
  
  visitingHoursRestriction: z.boolean().default(false),
  
  visitingHours: z.object({
    from: z.string().optional(), // Time in HH:mm format
    to: z.string().optional(),
  }).optional(),
  
  guestStayAllowed: z.boolean().default(true),
}).refine((data) => {
  // Make suitableFor mandatory for rent and lease
  if (data.listingType === 'rent' || data.listingType === 'lease') {
    return data.suitableFor && data.suitableFor.length > 0;
  }
  return true;
}, {
  message: 'Please select at least one option for suitable tenants',
  path: ['suitableFor'],
});

export default suitableForSchema;
