import { z } from 'zod';

/**
 * Schema for Basic PG/Hostel Details
 * Enhanced to match comprehensive JSON structure
 * Covers: Property name, type, gender, description, owner details, brand info, highlights, contact person
 */
const basicDetailsPgSchema = z.object({

    
  propertyName: z.string()
    .min(3, 'Property name must be at least 3 characters')
    .max(100, 'Property name must be less than 100 characters')
    .optional(),

  
  // Gender allowed
  genderAllowed: z.enum(['Gents', 'Ladies', 'Gents / Ladies / Unisex'], {
    required_error: 'Please select allowed gender',
  }),
  
  // Enhanced Description object matching JSON
  description: z.string()
      .min(50, 'Long description must be at least 50 characters')
      .max(2000, 'Long description must be less than 2000 characters'),
  
  
  isBrandManaged: z.boolean().default(false),
  
  brandName: z.string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  
  // Property age
  yearBuilt: z.string()
    .regex(/^\d{4}$/, 'Please enter a valid year (e.g., 2020)')
    .optional()
    .or(z.literal('')),
  
  lastRenovated: z.string()
    .regex(/^\d{4}$/, 'Please enter a valid year')
    .optional()
    .or(z.literal('')),
  
 

}).refine(
  (data) => {
    // If brand managed, brand name is required
    if ((data.isBrandManaged || data.managedByBrand) && !data.brandName) {
      return false;
    }
    return true;
  },
  {
    message: 'Brand name is required when property is brand managed',
    path: ['brandName'],
  }
);

export default basicDetailsPgSchema;
