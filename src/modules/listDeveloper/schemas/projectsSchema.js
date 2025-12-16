import { z } from 'zod';

export const projectsSchema = z.object({
  totalProjectsCompleted: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(10000, 'Value too large')
    .optional(),
  
  totalProjectsOngoing: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(1000, 'Value too large')
    .optional(),
  
  totalUnitsDelivered: z.number()
    .int('Must be a whole number')
    .min(0, 'Cannot be negative')
    .max(1000000, 'Value too large')
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
  ])).optional(),
  
 
  
  operatingStates: z.array(z.string())
    .max(35, 'Maximum 35 states')
    .optional(),
});

export default projectsSchema;
