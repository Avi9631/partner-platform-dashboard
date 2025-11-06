import { z } from 'zod';

export const amenitiesSchema = z.object({
  amenities: z.array(z.string()).optional().default([]),
});

export default amenitiesSchema;
