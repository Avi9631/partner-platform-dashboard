import { z } from 'zod';

/**
 * Enhanced Location Attributes Schema
 * Phase 1 Enhancement - Step 8: Location Attributes
 */
const locationAttributesSchema = z.object({
  facing: z.string().min(1, 'Facing direction is required'),
  view: z.string().min(1, 'View is required'),
  
  // Property position type (replaces isCornerProperty)
  propertyPosition: z.enum([
    'corner',
    'middle',
    'end',
    'standalone',
    'front_facing',
    'rear'
  ], { required_error: 'Property position is required' }),
  
  overlooking: z.array(z.enum([
    'park',
    'main_road',
    'garden',
    'swimming_pool',
    'club_house',
    'other_buildings'
  ])).optional().default([]),
});

export default locationAttributesSchema;
