import { z } from 'zod';

export const mediaSchema = z.object({
  logo: z.string()
    .url('Invalid logo URL')
    .optional(),
  
  coverImage: z.string()
    .url('Invalid cover image URL')
    .optional(),
  
  brochure: z.string()
    .url('Invalid brochure URL')
    .optional(),
  
  companyProfile: z.string()
    .url('Invalid company profile URL')
    .optional(),
  
  projectImages: z.array(z.string().url('Invalid image URL'))
    .max(20, 'Maximum 20 images allowed')
    .optional(),
  
  videoLinks: z.array(z.string().url('Invalid video URL'))
    .max(5, 'Maximum 5 videos allowed')
    .optional(),
});

export default mediaSchema;
