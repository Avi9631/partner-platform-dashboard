import { z } from 'zod';

export const listingInformationSchema = z.object({
  title: z.string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
});

export default listingInformationSchema;
