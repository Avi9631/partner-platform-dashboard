import { z } from 'zod';

export const pricingInformationSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'lease'], {
    errorMap: () => ({ message: 'Please select listing type' }),
  }),
  price: z.string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a positive number',
    }),
  priceUnit: z.enum(['total', 'per_sqft', 'per_sqm', 'per_acre'], {
    errorMap: () => ({ message: 'Please select price unit' }),
  }),
  maintenanceCharges: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Maintenance charges must be a valid number',
    }),
  availableFrom: z.string().optional(),
});

export default pricingInformationSchema;
