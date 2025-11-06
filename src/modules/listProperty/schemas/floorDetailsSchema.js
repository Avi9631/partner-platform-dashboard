import { z } from 'zod';

export const floorDetailsSchema = z.object({
  towerName: z.string().optional(),
  floorNumber: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Floor number must be a valid number',
    }),
  totalFloors: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Total floors must be a positive number',
    }),
  unitNumber: z.string().optional(),
  isUnitNumberPrivate: z.boolean().optional().default(false),
}).refine((data) => {
  // If floor number is provided, total floors should also be provided
  if (data.floorNumber && !data.totalFloors) {
    return false;
  }
  // Floor number should not exceed total floors
  if (data.floorNumber && data.totalFloors && Number(data.floorNumber) > Number(data.totalFloors)) {
    return false;
  }
  return true;
}, {
  message: 'Please provide valid floor details',
  path: ['totalFloors'],
});

export default floorDetailsSchema;
