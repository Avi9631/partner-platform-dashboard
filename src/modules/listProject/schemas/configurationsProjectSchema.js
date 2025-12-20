import { z } from 'zod';

/**
 * Property category enum - determines which fields are required
 */
const PROPERTY_CATEGORY = {
  RESIDENTIAL_APARTMENT: 'residential_apartment',
  RESIDENTIAL_INDEPENDENT: 'residential_independent',
  PLOT: 'plot',
  FARM: 'farm',
  COMMERCIAL: 'commercial',
};

/**
 * Configuration types mapped to categories
 */
const CONFIG_TYPE_TO_CATEGORY = {
  '1 RK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '1 BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '2 BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '3 BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '4 BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '5 BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  '6+ BHK': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  'Studio': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  'Penthouse': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  'Duplex': PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT,
  'Villa': PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT,
  'Row House': PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT,
  'Bungalow': PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT,
  'Residential Plot': PROPERTY_CATEGORY.PLOT,
  'Commercial Plot': PROPERTY_CATEGORY.PLOT,
  'Agricultural Plot': PROPERTY_CATEGORY.PLOT,
  'Industrial Plot': PROPERTY_CATEGORY.PLOT,
  'Farm Land': PROPERTY_CATEGORY.FARM,
  'Farm House': PROPERTY_CATEGORY.FARM,
  'Shop': PROPERTY_CATEGORY.COMMERCIAL,
  'Office Space': PROPERTY_CATEGORY.COMMERCIAL,
  'Showroom': PROPERTY_CATEGORY.COMMERCIAL,
  'Warehouse': PROPERTY_CATEGORY.COMMERCIAL,
  'Co-working Space': PROPERTY_CATEGORY.COMMERCIAL,
  'Commercial Building': PROPERTY_CATEGORY.COMMERCIAL,
};

/**
 * Schema for area details
 */
const areaDetailsSchema = z.object({
  min: z.number()
    .min(1, 'Minimum area must be at least 1')
    .max(100000, 'Minimum area cannot exceed 100000'),
  max: z.number()
    .min(1, 'Maximum area must be at least 1')
    .max(100000, 'Maximum area cannot exceed 100000'),
  unit: z.enum(['Sq.ft', 'Sq.m', 'Sq.yd', 'Acres', 'Hectares'], {
    required_error: 'Please select area unit',
  }).default('Sq.ft'),
}).refine(
  (data) => data.max >= data.min,
  {
    message: 'Maximum area must be greater than or equal to minimum area',
    path: ['max'],
  }
);

/**
 * Schema for parking spaces (for independent houses)
 */
const parkingSchema = z.object({
  covered: z.number().int().min(0).max(20).default(0),
  open: z.number().int().min(0).max(50).default(0),
});

/**
 * Simplified residential apartment/flat details (for unit showcase)
 */
const residentialDetailsSchema = z.object({
  bedrooms: z.number().int().min(0).max(10).optional(),
  bathrooms: z.number().int().min(0).max(15).optional(),
  balconies: z.number().int().min(0).max(10).optional(),
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional(),
  furnishing: z.enum(['Unfurnished', 'Semi-Furnished', 'Fully-Furnished']).optional(),
}).optional();

/**
 * Simplified independent house/villa details (for unit showcase)
 */
const independentDetailsSchema = z.object({
  bedrooms: z.number().int().min(1, 'At least 1 bedroom required').max(15),
  bathrooms: z.number().int().min(1, 'At least 1 bathroom required').max(20),
  floors: z.number().int().min(1, 'At least 1 floor required').max(5),
  parking: parkingSchema.optional(),
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional(),
}).optional();

/**
 * Simplified plot details (for unit showcase)
 */
const plotDetailsSchema = z.object({
  plotType: z.enum(['Residential', 'Commercial', 'Agricultural', 'Industrial'], {
    required_error: 'Plot type is required',
  }),
  facing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'], {
    required_error: 'Facing direction is required',
  }),
  cornerPlot: z.boolean().optional().default(false),
  dimensions: z.string().max(100).optional(), // e.g., "40x60 ft"
  approvedForConstruction: z.boolean().optional().default(false),
}).optional();

/**
 * Simplified farm land details (for unit showcase)
 */
const farmDetailsSchema = z.object({
  farmType: z.enum(['Agricultural', 'Recreational', 'Mixed Use'], {
    required_error: 'Farm type is required',
  }),
  waterSource: z.enum(['Borewell', 'River', 'Canal', 'Lake', 'Municipal', 'None']).optional(),
  electricityAvailable: z.boolean().optional().default(false),
  farmhouseIncluded: z.boolean().optional().default(false),
}).optional();

/**
 * Simplified commercial property details (for unit showcase)
 */
const commercialDetailsSchema = z.object({
  washrooms: z.number().int().min(0).max(50).optional(),
  parking: z.number().int().min(0).max(200).optional(),
  furnished: z.boolean().optional().default(false),
  powerBackup: z.boolean().optional().default(false),
  airConditioned: z.boolean().optional().default(false),
}).optional();

/**
 * Simplified pricing (for unit showcase)
 */
const pricingSchema = z.object({
  minPrice: z.number().positive('Minimum price must be positive').optional(),
  maxPrice: z.number().positive('Maximum price must be positive').optional(),
  priceOnRequest: z.boolean().optional().default(false),
}).refine(
  (data) => {
    if (data.minPrice && data.maxPrice) {
      return data.maxPrice >= data.minPrice;
    }
    return true;
  },
  {
    message: 'Maximum price must be greater than or equal to minimum price',
    path: ['maxPrice'],
  }
).optional();

/**
 * Schema for individual configuration - Simplified for unit showcase
 */
const baseConfigurationSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(), // For tracking in field array

  // Configuration type (required)
  configurationType: z.enum([
    '1 RK',
    '1 BHK',
    '2 BHK',
    '3 BHK',
    '4 BHK',
    '5 BHK',
    '6+ BHK',
    'Studio',
    'Penthouse',
    'Duplex',
    'Villa',
    'Row House',
    'Bungalow',
    'Residential Plot',
    'Commercial Plot',
    'Agricultural Plot',
    'Industrial Plot',
    'Farm Land',
    'Farm House',
    'Shop',
    'Office Space',
    'Showroom',
    'Warehouse',
    'Co-working Space',
    'Commercial Building',
  ], {
    required_error: 'Please select configuration type',
  }),

  // Number of units
  numberOfUnits: z.number()
    .int('Number of units must be a whole number')
    .min(1, 'At least 1 unit is required')
    .max(5000, 'Number of units cannot exceed 5000'),

  // Area details (conditional based on type)
  carpetArea: areaDetailsSchema.optional(),
  builtUpArea: areaDetailsSchema.optional(),
  superBuiltUpArea: areaDetailsSchema.optional(),
  plotArea: areaDetailsSchema.optional(),

  // Category-specific details
  residentialDetails: residentialDetailsSchema,
  independentDetails: independentDetailsSchema,
  plotDetails: plotDetailsSchema,
  farmDetails: farmDetailsSchema,
  commercialDetails: commercialDetailsSchema,

  // Simplified pricing (min/max range)
  pricing: pricingSchema,

  // Floor plan images (URLs after upload)
  floorPlanImages: z.array(z.string().url('Invalid URL'))
    .max(10, 'Cannot upload more than 10 floor plans')
    .optional()
    .default([]),

  // Key features/highlights
  keyFeatures: z.array(z.string().max(100))
    .max(5, 'Maximum 5 key features')
    .optional()
    .default([]),

  // Availability status
  available: z.boolean().default(true),
});

/**
 * Configuration schema with conditional validation
 */
const configurationSchema = baseConfigurationSchema.superRefine((data, ctx) => {
  const category = CONFIG_TYPE_TO_CATEGORY[data.configurationType];

  // Residential Apartment validations
  if (category === PROPERTY_CATEGORY.RESIDENTIAL_APARTMENT) {
    if (!data.superBuiltUpArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Super built-up area is required for apartments',
        path: ['superBuiltUpArea'],
      });
    }
    if (!data.residentialDetails?.bathrooms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Number of bathrooms is required',
        path: ['residentialDetails', 'bathrooms'],
      });
    }
  }

  // Residential Independent (Villa/Row House) validations
  if (category === PROPERTY_CATEGORY.RESIDENTIAL_INDEPENDENT) {
    if (!data.plotArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Plot area is required for independent properties',
        path: ['plotArea'],
      });
    }
    if (!data.builtUpArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Built-up area is required for independent properties',
        path: ['builtUpArea'],
      });
    }
    if (!data.independentDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Villa/Independent details are required',
        path: ['independentDetails'],
      });
    }
  }

  // Plot validations
  if (category === PROPERTY_CATEGORY.PLOT) {
    if (!data.plotArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Plot area is required',
        path: ['plotArea'],
      });
    }
    if (!data.plotDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Plot details are required',
        path: ['plotDetails'],
      });
    }
    // Plots should not have built-up area or bedrooms
    if (data.builtUpArea || data.carpetArea || data.superBuiltUpArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Plots should not have built-up areas',
        path: ['builtUpArea'],
      });
    }
  }

  // Farm validations
  if (category === PROPERTY_CATEGORY.FARM) {
    if (!data.plotArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Farm area is required',
        path: ['plotArea'],
      });
    }
    if (!data.farmDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Farm details are required',
        path: ['farmDetails'],
      });
    }
    // Farm land should use Acres or Hectares
    if (data.plotArea && !['Acres', 'Hectares'].includes(data.plotArea.unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Farm area should be in Acres or Hectares',
        path: ['plotArea', 'unit'],
      });
    }
  }

  // Commercial validations
  if (category === PROPERTY_CATEGORY.COMMERCIAL) {
    if (!data.builtUpArea && !data.carpetArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least carpet area or built-up area is required for commercial properties',
        path: ['builtUpArea'],
      });
    }
  }
});

/**
 * Main schema for Configurations step
 */
const configurationsProjectSchema = z.object({
  // Array of configurations
  configurations: z.array(configurationSchema)
    .min(1, 'Add at least 1 configuration')
    .max(20, 'Cannot add more than 20 configurations'),
});

export default configurationsProjectSchema;
export { 
  configurationSchema, 
  areaDetailsSchema,
  PROPERTY_CATEGORY,
  CONFIG_TYPE_TO_CATEGORY,
  residentialDetailsSchema,
  independentDetailsSchema,
  plotDetailsSchema,
  farmDetailsSchema,
  commercialDetailsSchema,
  pricingSchema,
};
