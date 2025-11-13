import { z } from 'zod';

/**
 * Enhanced Area Details Schema
 * Fixed fields: Carpet Area, Super Area, Measurement Method
 * Dynamic fields: Additional area types (terrace, garden, balcony, etc.)
 */
export const areaDetailsSchema = z.object({
  // Required fields
  carpetArea: z.string()
    .min(1, 'Carpet area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Carpet area must be a positive number',
    }),
  
  superArea: z.string()
    .min(1, 'Super area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Super area must be a positive number',
    }),
  
  measurementMethod: z.enum([
    'rera_verified',
    'self_measured',
    'architect_certified',
    'builder_provided',
    'not_verified'
  ], {
    required_error: 'Measurement method is required',
  }),
  
  // Optional: Dynamic area configuration for additional area types
  areaConfig: z.array(z.object({
    type: z.enum([
      'built_up',
      'plot',
      'terrace',
      'balcony',
      'garden',
      'parking',
      'common',
      'other'
    ]),
    value: z.string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Area must be a positive number',
      }),
  })).optional().default([]),
  
  // Auto-calculated field
  builtUpToCarpetRatio: z.number().optional(),
  
}).refine((data) => {
  // Super area should be greater than or equal to carpet area
  if (Number(data.superArea) < Number(data.carpetArea)) {
    return false;
  }
  return true;
}, {
  message: 'Super area should be greater than or equal to carpet area',
  path: ['superArea'],
});

export default areaDetailsSchema;
