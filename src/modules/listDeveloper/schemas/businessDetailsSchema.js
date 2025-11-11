import { z } from 'zod';

const businessDetailsSchema = z.object({
  registrationNumber: z.string().min(5, 'Registration number is required'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)'),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/, 'Invalid GST format').optional().or(z.literal('')),
  incorporationDate: z.string().min(1, 'Incorporation date is required'),
  reraRegistrations: z.array(z.object({
    state: z.string().min(1, 'State is required'),
    reraNumber: z.string().min(1, 'RERA number is required'),
    validUpto: z.string().min(1, 'Validity date is required'),
  })).min(1, 'At least one RERA registration is required'),
});

export default businessDetailsSchema;
