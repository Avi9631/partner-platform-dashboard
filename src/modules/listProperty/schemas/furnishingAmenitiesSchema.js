import { z } from 'zod';

const furnishingAmenitiesSchema = z.object({
  furnishingStatus: z.enum(['unfurnished', 'semi', 'fully'], {
    required_error: 'Please select furnishing status',
  }),
  flooringTypes: z.array(z.string()).optional(),
  furnishingDetails: z.record(z.boolean()).optional(),
});

export default furnishingAmenitiesSchema;
