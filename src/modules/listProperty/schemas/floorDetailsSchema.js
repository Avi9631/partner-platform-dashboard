import { z } from 'zod';

/**
 * Enhanced Floor Details Schema
 * Phase 1 Enhancement - Step 9: Floor Details (Apartment/Penthouse only)
 */
export const floorDetailsSchema = z.object({
  towerName: z.string().optional(),
  floorNumber: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Floor number must be a valid number',
    }),
  totalFloors: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Total floors must be a positive number',
    }),
  unitNumber: z.string().optional(),
  isUnitNumberPrivate: z.boolean().optional().default(false),
  
  // Existing fields
  liftAvailable: z.boolean().default(false),
  evCharging: z.boolean().default(false),
  
  // NEW: Phase 1 enhancements
  flatLayoutType: z.enum([
    'corner',        // Corner unit
    'middle',        // Middle unit
    'end_unit',      // End of corridor
    'duplex',        // Two-floor unit
    'penthouse',     // Top floor luxury
    'simplex',       // Single floor
    'triplex',       // Three floors
    'other'
  ]).optional(),
  
  fireExitProximity: z.enum([
    'very_near',     // Within 10m
    'near',          // Within 50m
    'moderate',      // Within 100m
    'far',           // Beyond 100m
    'not_available'
  ]).optional(),
  
  hasEmergencyExit: z.boolean().default(false),
  
  staircaseType: z.enum([
    'common',        // Shared staircase
    'private',       // Private staircase
    'both',          // Both common and private
    'none'           // No staircase (only lift)
  ]).optional(),
  
  hasIntercom: z.boolean().default(false),
}).refine((data) => {
  // If floor number is provided, total floors should also be provided
  if (data.floorNumber && !data.totalFloors) {
    return false;
  }
  // Floor number should not exceed total floors
  if (data.floorNumber && data.totalFloors && Number(data.floorNumber) > Number(data.totalFloors)) {
    return false;
  }
  return true;
}, {
  message: 'Please provide valid floor details',
  path: ['totalFloors'],
});

export default floorDetailsSchema;
