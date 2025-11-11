import { z } from 'zod';

const contactAddressSchema = z.object({
  registeredAddress: z.object({
    addressLine1: z.string().min(5, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  }),
  isCorporateSameAsRegistered: z.boolean(),
  corporateAddress: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
  }).optional(),
  primaryContact: z.object({
    name: z.string().min(2, 'Contact name is required'),
    designation: z.string().min(2, 'Designation is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  }),
  alternateContacts: z.array(z.object({
    name: z.string().min(2, 'Contact name is required'),
    designation: z.string().min(2, 'Designation is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  })).optional(),
});

export default contactAddressSchema;
