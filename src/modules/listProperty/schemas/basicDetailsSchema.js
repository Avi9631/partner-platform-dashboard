import { z } from 'zod';

export const basicDetailsSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'lease'], {
    errorMap: () => ({ message: 'Please select listing type' }),
  }),
  ownershipType: z.enum(['freehold', 'leasehold', 'poa', 'co_operative'], {
    errorMap: () => ({ message: 'Please select ownership type' }),
  }),
  projectName: z.string().optional().refine(
    (val) => !val || val.length >= 4,
    { message: 'Project name must be at least 4 characters' }
  ),
  customPropertyName: z.string().optional(),
  reraIds: z.array(z.object({
    id: z.string().min(1, 'RERA ID is required'),
  })).optional().default([]),
  ageOfProperty: z.string()
    .min(1, 'Age of property is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Age must be a positive number',
    }),
  possessionStatus: z.enum(['ready', 'under_construction', 'resale'], {
    errorMap: () => ({ message: 'Please select a possession status' }),
  }),
  possessionDate: z.string().optional(),
  availableFrom: z.string().optional(),
}).refine((data) => {
  // If under construction, possession date should be provided
  if (data.possessionStatus === 'under_construction' && !data.possessionDate) {
    return false;
  }
  return true;
}, {
  message: 'Expected possession date is required for properties under construction',
  path: ['possessionDate'],
});

export default basicDetailsSchema;
