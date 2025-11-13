import { z } from 'zod';

/**
 * Enhanced Parking & Utilities Schema
 * Phase 1 Enhancement - Step 7: Parking
 * Updated with mandatory field validations
 */
const parkingUtilitiesSchema = z.object({
  // MANDATORY: Basic parking information
  coveredParking: z.string()
    .min(1, 'Covered parking count is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Must be a non-negative number',
    }),
  
  openParking: z.string()
    .min(1, 'Open parking count is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Must be a non-negative number',
    }),
  
  // MANDATORY: Power backup information
  powerBackup: z.enum(['none', 'partial', 'full'], {
    required_error: 'Power backup information is required',
  }),
  
  // EV Charging Type - defaults to 'none'
  evChargingType: z.enum([
    'none',
    'ac_slow',       // AC Slow Charging (3-7 kW)
    'dc_fast',       // DC Fast Charging (50+ kW)
    'both'
  ]).default('none'),
  
  // MANDATORY when evChargingType is not 'none'
  evChargingPoints: z.string().optional(),
  
  // Visitor parking availability
  hasVisitorParking: z.boolean().default(false),
  
  // MANDATORY when hasVisitorParking is true
  visitorParkingSpaces: z.string().optional(),
  
  // MANDATORY: Parking allocation type
  parkingType: z.enum([
    'reserved',      // Dedicated parking slot
    'shared',        // Shared parking
    'first_come'     // First come first serve
  ], {
    required_error: 'Parking type is required',
  }),
  
  // OPTIONAL: Parking security type
  parkingSecurityType: z.enum([
    'guarded',
    'cctv',
    'gated',
    'none',
    'multiple'       // Combination of security measures
  ]).optional(),
})
.refine(
  (data) => {
    // If EV charging is enabled, charging points must be provided
    if (data.evChargingType !== 'none' && !data.evChargingPoints) {
      return false;
    }
    return true;
  },
  {
    message: 'EV charging points are required when EV charging is enabled',
    path: ['evChargingPoints'],
  }
)
.refine(
  (data) => {
    // If EV charging points provided, must be valid positive number
    if (data.evChargingType !== 'none' && data.evChargingPoints) {
      const num = Number(data.evChargingPoints);
      return !isNaN(num) && num > 0;
    }
    return true;
  },
  {
    message: 'EV charging points must be a positive number',
    path: ['evChargingPoints'],
  }
)
.refine(
  (data) => {
    // If visitor parking is enabled, spaces must be provided
    if (data.hasVisitorParking && !data.visitorParkingSpaces) {
      return false;
    }
    return true;
  },
  {
    message: 'Visitor parking spaces are required when visitor parking is enabled',
    path: ['visitorParkingSpaces'],
  }
)
.refine(
  (data) => {
    // If visitor parking spaces provided, must be valid positive number
    if (data.hasVisitorParking && data.visitorParkingSpaces) {
      const num = Number(data.visitorParkingSpaces);
      return !isNaN(num) && num > 0;
    }
    return true;
  },
  {
    message: 'Visitor parking spaces must be a positive number',
    path: ['visitorParkingSpaces'],
  }
);

export default parkingUtilitiesSchema;
