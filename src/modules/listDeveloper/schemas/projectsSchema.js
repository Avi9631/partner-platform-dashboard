import { z } from 'zod';

export const projectsSchema = z.object({
  totalProjectsCompleted: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(10000, 'Value too large'),
  
  totalProjectsOngoing: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(1000, 'Value too large'),
  
  totalUnitsDelivered: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(1000000, 'Value too large')
    .optional(),
  
  totalSqftDeveloped: z.number()
    .min(0, 'Cannot be negative')
    .max(1000000000, 'Value too large')
    .optional(),
  
  projectTypes: z.array(z.enum([
    'Residential',
    'Commercial',
    'Mixed Use',
    'Plotted Development',
    'Integrated Township',
    'Villa Projects',
    'Affordable Housing',
    'Luxury Housing',
    'Retail',
    'IT Parks',
    'Industrial',
  ])).min(1, 'Select at least one project type'),
  
  specializations: z.array(z.string())
    .min(1, 'Add at least one specialization')
    .max(10, 'Maximum 10 specializations'),
  
  operatingCities: z.array(z.string())
    .min(1, 'Add at least one operating city')
    .max(50, 'Maximum 50 cities'),
  
  operatingStates: z.array(z.string())
    .min(1, 'Add at least one operating state')
    .max(35, 'Maximum 35 states'),
});

export default projectsSchema;
