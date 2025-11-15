import { z } from 'zod';

export const contactInfoSchema = z.object({
  primaryContactName: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name is too long'),
  
  primaryContactEmail: z.string()
    .email('Invalid email address'),
  
  primaryContactPhone: z.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number'),
  
  secondaryContactName: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name is too long')
    .optional(),
  
  secondaryContactEmail: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  
  secondaryContactPhone: z.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  
  officeAddress: z.string()
    .min(10, 'Office address must be at least 10 characters')
    .max(200, 'Office address is too long'),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters'),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters'),
  
  pincode: z.string()
    .regex(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  
  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
  
  linkedin: z.string()
    .url('Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
});

export default contactInfoSchema;
