import { z } from 'zod';

const parkingUtilitiesSchema = z.object({
  coveredParking: z.string().optional(),
  openParking: z.string().optional(),
  powerBackup: z.enum(['none', 'partial', 'full']).optional(),
});

export default parkingUtilitiesSchema;
