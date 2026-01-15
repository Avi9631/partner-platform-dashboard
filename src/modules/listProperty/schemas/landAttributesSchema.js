import { z } from 'zod';

/**
 * Enhanced Land Attributes Schema
 * Phase 1 Enhancement - Step 10: Land Attributes (Plot/Farmhouse/Agricultural)
 */
export const landAttributesSchema = z.object({
  plotArea: z.string()
    .min(1, 'Plot area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Plot area must be a positive number',
    }),
  areaUnit: z.enum(['sqft', 'sqm', 'acre', 'bigha', 'kanal', 'gaj'], {
    errorMap: () => ({ message: 'Please select an area unit' }),
  }),
  plotDimension: z.string().optional(),
  roadWidth: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Road width must be a positive number',
    }),
  fencing: z.boolean().optional().default(false),
  irrigationSource: z.string().optional(),
  
  // Existing fields
  terrainLevel: z.enum(['flat', 'elevated', 'sloped']).optional(),
  soilType: z.enum(['black', 'red', 'sandy', 'clay', 'loamy']).optional(),
  
  // NEW: Phase 1 enhancements
  legalStatus: z.enum([
    'clear_title',       // Clean, undisputed title
    'disputed',          // Legal dispute ongoing
    'poa',               // Power of Attorney
    'under_litigation',  // Court case pending
    'encumbered',        // Has encumbrance
    'leasehold',         // Leasehold property
    'freehold',          // Freehold property
    'other'
  ]).optional(),
  
  boundaryWallType: z.enum([
    'brick',
    'concrete',
    'wire_fence',
    'iron_fence',
    'compound_wall',
    'none',
    'partial',
    'other'
  ]).optional(),
  
  hasDrainage: z.enum([
    'yes',
    'no',
    'planned'
  ]).optional(),
  
  surveyNumber: z.string()
    .max(100, 'Survey number is too long')
    .optional(),
  
  plotId: z.string()
    .max(100, 'Plot ID is too long')
    .optional(),
  
  // Documents (URLs will be stored after upload)
  landConversionCertificateUrl: z.string().url().optional(),
  ownershipProofUrl: z.string().url().optional(),
  topographyMapUrl: z.string().url().optional(),
  surveyDocumentUrl: z.string().url().optional(),
});

export default landAttributesSchema;
