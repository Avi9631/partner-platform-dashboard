import { z } from 'zod';

/**
 * Transaction and Owner Type Schema
 * Phase 1 Enhancement - Step 0: Property Type Selection
 * 
 * Helps with filtering, pricing algorithms, and transparency
 */
export const transactionOwnerSchema = z.object({
  transactionType: z.enum([
    'new_booking',
    'resale', 
    'under_construction',
    'owner_listing',
    'agent_listing'
  ], {
    errorMap: () => ({ message: 'Please select transaction type' }),
  }).optional(),
  
  ownerType: z.enum([
    'owner',
    'builder',
    'broker',
    'developer',
    'co_operative_society'
  ], {
    errorMap: () => ({ message: 'Please select owner type' }),
  }).optional(),
});

export default transactionOwnerSchema;
