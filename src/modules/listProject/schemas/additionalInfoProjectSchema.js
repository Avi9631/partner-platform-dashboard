import { z } from 'zod';

/**
 * Schema for Additional Project Information
 * Covers: Highlights, descriptions, investment potential
 */

const additionalInfoProjectSchema = z.object({
  // Project highlights (bullet points)
  projectHighlights: z.array(z.string().min(5, 'Highlight must be at least 5 characters'))
    .min(1, 'Add at least 1 project highlight')
    .max(15, 'Cannot add more than 15 highlights')
    .optional()
    .default([]),

  // About the project (detailed)
  aboutProject: z.string()
    .min(200, 'About project must be at least 200 characters')
    .max(5000, 'About project must be less than 5000 characters')
    .optional()
    .or(z.literal('')),

  // Target audience
  targetAudience: z.array(z.enum([
    'First Time Home Buyers',
    'Families',
    'Working Professionals',
    'Investors',
    'NRIs',
    'Senior Citizens',
    'Students',
    'Corporate Clients',
    'Small Businesses',
    'Large Enterprises'
  ]))
    .max(10, 'Cannot select more than 10 target audiences')
    .optional()
    .default([]),

  // Investment highlights
  investmentHighlights: z.string()
    .max(2000, 'Investment highlights must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  // Rental yield potential
  rentalYieldPotential: z.string()
    .max(500, 'Rental yield description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Appreciation potential
  appreciationPotential: z.string()
    .max(500, 'Appreciation description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Lifestyle description
  lifestyleDescription: z.string()
    .max(2000, 'Lifestyle description must be less than 2000 characters')
    .optional()
    .or(z.literal('')),

  // USPs (Unique Selling Points)
  uniqueSellingPoints: z.array(z.string().min(5, 'USP must be at least 5 characters'))
    .max(10, 'Cannot add more than 10 USPs')
    .optional()
    .default([]),

  // Awards and recognitions
  awards: z.array(z.object({
    name: z.string().min(3, 'Award name is required'),
    year: z.string().regex(/^\d{4}$/, 'Please enter a valid year').optional(),
    description: z.string().max(300, 'Description must be less than 300 characters').optional(),
  }))
    .max(10, 'Cannot add more than 10 awards')
    .optional()
    .default([]),
});

export default additionalInfoProjectSchema;
