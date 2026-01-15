import { z } from 'zod';

/**
 * Enhanced Pricing Information Schema
 * Phase 1 Enhancement - Step 11: Pricing
 */
const pricingItemSchema = z.object({
  type: z.enum([
    'asking_price', 
    'monthly_rent', 
    'security_deposit', 
    'brokerage_fee', 
    'maintenance_charges',
    'lease_amount'
  ], {
    errorMap: () => ({ message: 'Please select a valid pricing type' }),
  }),
  value: z.string()
    .min(1, 'Value is required')
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: 'Value must be a positive number',
    }),
  unit: z.enum(['total', 'per_sqft', 'per_sqm', 'per_acre', 'percentage', 'monthly'], {
    errorMap: () => ({ message: 'Please select a valid unit' }),
  }).optional(),
});

export const pricingInformationSchema = z.object({
  pricing: z.array(pricingItemSchema)
    .min(1, 'At least one pricing item is required')
    .refine((items) => {
      // Ensure required pricing types based on listing type
      const types = new Set(items.map(item => item.type));
      return types.has('asking_price') || types.has('monthly_rent') || types.has('lease_amount');
    }, {
      message: 'Primary price (asking price, monthly rent, or lease amount) is required',
    }),
  isPriceNegotiable: z.boolean().optional(),
  
  // NEW: Phase 1 enhancements
  pricePerSqft: z.number().optional(), // Auto-calculated
  pricePerSqm: z.number().optional(),  // Auto-calculated
  
  maintenanceIncludes: z.array(z.enum([
    'electricity',
    'water',
    'gas',
    'common_area_maintenance',
    'security',
    'lift_maintenance',
    'garden_maintenance',
    'club_facilities',
    'waste_management',
    'pest_control',
    'none'
  ])).optional().default([]),
  
  taxStampDuty: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Tax/stamp duty must be a non-negative number',
    })
    .optional(),
  
  isPriceVerified: z.boolean().default(false),
  priceVerifiedBy: z.string().optional(), // Agent/Admin ID
  priceVerifiedAt: z.string().optional(),
});

export default pricingInformationSchema;
