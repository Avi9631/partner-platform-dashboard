import { z } from 'zod';

export const areaDetailsSchema = z.object({
  carpetArea: z.string()
    .min(1, 'Carpet area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Carpet area must be a positive number',
    }),
  superArea: z.string()
    .min(1, 'Super area is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Super area must be a positive number',
    }),
}).refine((data) => {
  // Super area should be greater than or equal to carpet area
  if (Number(data.superArea) < Number(data.carpetArea)) {
    return false;
  }
  return true;
}, {
  message: 'Super area should be greater than or equal to carpet area',
  path: ['superArea'],
});

export default areaDetailsSchema;
