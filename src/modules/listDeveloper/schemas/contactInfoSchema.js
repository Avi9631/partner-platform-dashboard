import { z } from 'zod';

export const contactInfoSchema = z.object({

  primaryContactEmail: z.string()
    .email('Invalid email address'),
  
  primaryContactPhone: z.string()
    .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number'),

  socialLinks: z.array(
    z.object({
      type: z.enum(['website', 'facebook', 'instagram', 'linkedin', 'youtube', 'twitter', 'other']),
      url: z.string().url('Invalid URL')
    })
  ).optional().default([]),
});

export default contactInfoSchema;
