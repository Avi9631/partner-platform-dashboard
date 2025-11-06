import { z } from 'zod';

const locationAttributesSchema = z.object({
  facing: z.string().optional(),
  view: z.string().optional(),
});

export default locationAttributesSchema;
