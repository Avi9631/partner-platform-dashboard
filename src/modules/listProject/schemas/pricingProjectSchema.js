import { z } from 'zod';

/**
 * Schema for configuration-wise pricing
 */
const configurationPricingSchema = z.object({
  configurationId: z.union([z.string(), z.number()]),
  configurationType: z.string(),
  
  // Base price
  basePrice: z.number()
    .min(100000, 'Base price must be at least ₹1 Lakh')
    .max(10000000000, 'Base price cannot exceed ₹1000 Crores'),

  // Maximum price (for range)
  maxPrice: z.number()
    .min(100000, 'Maximum price must be at least ₹1 Lakh')
    .max(10000000000, 'Maximum price cannot exceed ₹1000 Crores')
    .optional(),

  // Price per sq.ft
  pricePerSqft: z.number()
    .min(100, 'Price per sq.ft must be at least ₹100')
    .max(100000, 'Price per sq.ft cannot exceed ₹1 Lakh')
    .optional(),
}).refine(
  (data) => !data.maxPrice || data.maxPrice >= data.basePrice,
  {
    message: 'Maximum price must be greater than or equal to base price',
    path: ['maxPrice'],
  }
);

/**
 * Schema for payment plan
 */
const paymentPlanSchema = z.object({
  name: z.string()
    .min(3, 'Payment plan name must be at least 3 characters')
    .max(100, 'Payment plan name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

/**
 * Main schema for Pricing step
 */
const pricingProjectSchema = z.object({
  // Configuration-wise pricing
  configurationPricing: z.array(configurationPricingSchema)
    .min(1, 'Add pricing for at least 1 configuration'),

  // Booking amount
  bookingAmount: z.number()
    .min(0, 'Booking amount cannot be negative')
    .max(10000000, 'Booking amount cannot exceed ₹1 Crore')
    .optional(),

  // Payment plans
  paymentPlans: z.array(paymentPlanSchema)
    .max(10, 'Cannot add more than 10 payment plans')
    .optional()
    .default([]),

  // Bank loan available
  bankLoanAvailable: z.boolean().default(true),

  // Bank tie-ups
  bankTieUps: z.array(z.string())
    .max(20, 'Cannot add more than 20 banks')
    .optional()
    .default([]),

  // GST applicable
  gstApplicable: z.boolean().default(true),

  // GST percentage
  gstPercentage: z.number()
    .min(0, 'GST percentage cannot be negative')
    .max(100, 'GST percentage cannot exceed 100')
    .optional(),

  // Registration charges (percentage)
  registrationCharges: z.number()
    .min(0, 'Registration charges cannot be negative')
    .max(100, 'Registration charges cannot exceed 100')
    .optional(),

  // Monthly maintenance charges
  maintenanceCharges: z.number()
    .min(0, 'Maintenance charges cannot be negative')
    .max(1000000, 'Maintenance charges cannot exceed ₹10 Lakhs')
    .optional(),

  // Parking charges
  parkingCharges: z.number()
    .min(0, 'Parking charges cannot be negative')
    .max(10000000, 'Parking charges cannot exceed ₹1 Crore')
    .optional(),

  // Club membership charges
  clubMembershipCharges: z.number()
    .min(0, 'Club membership charges cannot be negative')
    .max(10000000, 'Club membership charges cannot exceed ₹1 Crore')
    .optional(),

  // Other charges description
  otherChargesDescription: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
});

export default pricingProjectSchema;
export { configurationPricingSchema, paymentPlanSchema };
