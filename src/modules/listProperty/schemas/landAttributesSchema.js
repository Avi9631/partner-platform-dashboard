import { z } from 'zod';

export const landAttributesSchema = z.object({
  plotArea: z.string()
    .min(1, 'Plot area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Plot area must be a positive number',
    }),
  areaUnit: z.enum(['sqft', 'sqm', 'acre', 'bigha', 'kanal', 'gaj'], {
    errorMap: () => ({ message: 'Please select an area unit' }),
  }),
  plotDimension: z.string().optional(),
  landUse: z.enum(['residential', 'commercial', 'agricultural', 'industrial'], {
    errorMap: () => ({ message: 'Please select land use type' }),
  }),
  roadWidth: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Road width must be a positive number',
    }),
  fencing: z.boolean().optional().default(false),
  irrigationSource: z.string().optional(),
});

export default landAttributesSchema;
