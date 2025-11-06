import { z } from 'zod';

export const basicDetailsSchema = z.object({
  projectName: z.string().optional(),
  city: z.string().min(1, 'City is required').trim(),
  addressText: z.string().min(5, 'Please enter a complete address').trim(),
  ageOfProperty: z.string()
    .min(1, 'Age of property is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Age must be a positive number',
    }),
  possessionStatus: z.enum(['ready', 'under_construction', 'resale'], {
    errorMap: () => ({ message: 'Please select a possession status' }),
  }),
  possessionDate: z.string().optional(),
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
