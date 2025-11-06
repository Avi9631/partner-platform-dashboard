import { z } from 'zod';

export const suitableForSchema = z.object({
  suitableFor: z.array(z.enum(['family', 'bachelors', 'company', 'students']))
    .optional()
    .default([]),
});

export default suitableForSchema;
