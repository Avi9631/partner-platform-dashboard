import { z } from 'zod';

/**
 * Enhanced Parking & Utilities Schema
 * Phase 1 Enhancement - Step 7: Parking
 */
const parkingUtilitiesSchema = z.object({
  coveredParking: z.string().optional(),
  openParking: z.string().optional(),
  powerBackup: z.enum(['none', 'partial', 'full']).optional(),
  
  // NEW: Phase 1 enhancements
  evChargingType: z.enum([
    'none',
    'ac_slow',       // AC Slow Charging (3-7 kW)
    'dc_fast',       // DC Fast Charging (50+ kW)
    'both'
  ]).default('none'),
  
  evChargingPoints: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Must be a non-negative number',
    })
    .optional(),
  
  hasVisitorParking: z.boolean().default(false),
  
  visitorParkingSpaces: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Must be a positive number',
    })
    .optional(),
  
  parkingType: z.enum([
    'reserved',      // Dedicated parking slot
    'shared',        // Shared parking
    'first_come'     // First come first serve
  ]).optional(),
  
  parkingSecurityType: z.enum([
    'guarded',
    'cctv',
    'gated',
    'none',
    'multiple'       // Combination of security measures
  ]).optional(),
});

export default parkingUtilitiesSchema;
