import { z } from 'zod';

export const certificationsSchema = z.object({
  isocertifications: z.array(z.string())
    .optional(),
  
  awards: z.array(z.object({
    title: z.string().min(5, 'Award title too short'),
    year: z.number().int().min(1900).max(new Date().getFullYear()),
    issuedBy: z.string().min(2, 'Issuer name too short'),
  })).optional(),
  
  greenBuildingCertifications: z.array(z.enum([
    'LEED',
    'IGBC',
    'GRIHA',
    'BEE Star Rating',
    'Other',
  ])).optional(),
  
  memberships: z.array(z.enum([
    'CREDAI',
    'NAREDCO',
    'FICCI',
    'CII',
    'Other',
  ])).optional(),
  
  otherCertifications: z.array(z.string())
    .optional(),
});

export default certificationsSchema;
