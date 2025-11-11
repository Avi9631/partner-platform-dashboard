import { z } from 'zod';

const basicInformationSchema = z.object({
  developerName: z.string().min(2, 'Developer name must be at least 2 characters'),
  brandName: z.string().optional(),
  establishedYear: z.string().min(4, 'Please enter a valid year').regex(/^\d{4}$/, 'Year must be 4 digits'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(50, 'Description must be at least 50 characters').max(1000, 'Description must not exceed 1000 characters'),
});

export default basicInformationSchema;
