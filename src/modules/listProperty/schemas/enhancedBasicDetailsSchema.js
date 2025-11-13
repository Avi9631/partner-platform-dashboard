import { z } from 'zod';
import basicDetailsSchema from './basicDetailsSchema';

/**
 * Enhanced Basic Details Schema
 * Phase 1 Enhancement - Step 3: Basic Details
 * 
 * Extends existing schema with infrastructure and utility details
 */
export const enhancedBasicDetailsSchema = basicDetailsSchema.extend({
  // NEW: Phase 1 enhancements
  propertyFacingRoadWidth: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Road width must be a positive number',
    })
    .optional(),
  
  totalUnitsInProject: z.string()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Total units must be a positive number',
    })
    .optional(),
  
  builderDeveloperName: z.string()
    .max(200, 'Builder name is too long')
    .optional(),
  
  hasOccupancyCertificate: z.boolean().default(false),
  occupancyCertificateUrl: z.string().url().optional(),
  
  hasCompletionCertificate: z.boolean().default(false),
  completionCertificateUrl: z.string().url().optional(),
  
  waterSupplySource: z.enum([
    'municipal',
    'borewell',
    'both',
    'tanker',
    'well',
    'other'
  ]).optional(),
  
  electricityProvider: z.string()
    .max(100, 'Provider name is too long')
    .optional(),
  
  wasteManagement: z.enum([
    'municipal',
    'on_site',
    'septic_tank',
    'none',
    'other'
  ]).optional(),
  
  sewerageType: z.enum([
    'public_sewer',
    'septic_tank',
    'treatment_plant',
    'none',
    'other'
  ]).optional(),
});

export default enhancedBasicDetailsSchema;
