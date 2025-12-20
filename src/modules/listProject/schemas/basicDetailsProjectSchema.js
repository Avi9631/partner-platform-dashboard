import { z } from 'zod';

/**
 * Schema for Basic Project Details
 * Covers: Project name, developer, type, status, RERA, dates, units
 */
const basicDetailsProjectSchema = z.object({
  // Project name (required)
  projectName: z.string()
    .min(3, 'Project name must be at least 3 characters')
    .max(150, 'Project name must be less than 150 characters'),

  // Developer/Builder name (required)
  developerName: z.string()
    .min(2, 'Developer name must be at least 2 characters')
    .max(100, 'Developer name must be less than 100 characters'),

  // Project type (required)
  projectType: z.enum([
    'Residential Apartment',
    'Villa/Independent House',
    'Plotted Development',
    'Commercial Office',
    'Commercial Shop/Showroom',
    'Commercial Mall',
    'Mixed Use Development',
    'Township',
    'Farm House',
    'Studio Apartment'
  ], {
    required_error: 'Please select project type',
  }),

  // Project status (required)
  projectStatus: z.enum([
    'Upcoming',
    'Under Construction',
    'Ready to Move',
    'Completed'
  ], {
    required_error: 'Please select project status',
  }),

  // RERA registration number (required)
  reraNumber: z.string()
    .min(5, 'RERA number must be at least 5 characters')
    .max(50, 'RERA number must be less than 50 characters')
    .regex(/^[A-Z0-9\-\/]+$/, 'Please enter a valid RERA number'),

  // Launch date
  launchDate: z.string()
    .optional()
    .or(z.literal('')),

  // Possession date
  possessionDate: z.string()
    .optional()
    .or(z.literal('')),

  // Total project area
  totalProjectArea: z.string()
    .min(1, 'Total project area is required')
    .optional()
    .or(z.literal('')),

  // Total project area unit
  projectAreaUnit: z.enum(['Acres', 'Hectares', 'Sq.ft', 'Sq.m'], {
    required_error: 'Please select area unit',
  }).optional(),

  // Number of towers/blocks
  numberOfTowers: z.number()
    .int('Number of towers must be a whole number')
    .min(1, 'At least 1 tower is required')
    .max(100, 'Number of towers cannot exceed 100')
    .optional(),

  // Total units
  totalUnits: z.number()
    .int('Total units must be a whole number')
    .min(1, 'At least 1 unit is required')
    .max(10000, 'Total units cannot exceed 10000')
    .optional(),

  // Project description
  description: z.string()
    .min(100, 'Description must be at least 100 characters')
    .max(3000, 'Description must be less than 3000 characters'),
});

export default basicDetailsProjectSchema;
