import { z } from 'zod';

const pricingItemSchema = z.object({
  type: z.enum([
    'asking_price', 
    'monthly_rent', 
    'security_deposit', 
    'brokerage_fee', 
    'maintenance_charges',
    'lease_amount'
  ], {
    errorMap: () => ({ message: 'Please select a valid pricing type' }),
  }),
  value: z.string()
    .min(1, 'Value is required')
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: 'Value must be a positive number',
    }),
  unit: z.enum(['total', 'per_sqft', 'per_sqm', 'per_acre', 'percentage', 'monthly'], {
    errorMap: () => ({ message: 'Please select a valid unit' }),
  }).optional(),
});

export const pricingInformationSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'lease'], {
    errorMap: () => ({ message: 'Please select listing type' }),
  }),
  pricing: z.array(pricingItemSchema)
    .min(1, 'At least one pricing item is required')
    .refine((items) => {
      // Ensure required pricing types based on listing type
      const types = new Set(items.map(item => item.type));
      return types.has('asking_price') || types.has('monthly_rent') || types.has('lease_amount');
    }, {
      message: 'Primary price (asking price, monthly rent, or lease amount) is required',
    }),
  isPriceNegotiable: z.boolean().optional(),
  availableFrom: z.string().optional(),
});

export default pricingInformationSchema;
