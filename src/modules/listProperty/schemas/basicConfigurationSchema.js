import { z } from 'zod';

export const basicConfigurationSchema = z.object({
  bedrooms: z.string().min(1, 'Please select number of bedrooms'),
  bathrooms: z.string().min(1, 'Please select number of bathrooms'),
  balconies: z.string().optional(),
  additionalRooms: z.array(z.string()).optional().default([]),
});

export default basicConfigurationSchema;
