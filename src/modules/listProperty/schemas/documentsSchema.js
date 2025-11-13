import { z } from 'zod';

/**
 * Documents Upload Schema
 * Phase 2 Enhancement - NEW Step: Documents Upload
 * 
 * Legal and compliance documents for property verification
 */

const documentSchema = z.object({
  id: z.string(),
  url: z.string().url('Invalid document URL'),
  fileName: z.string(),
  fileSize: z.number().max(10 * 1024 * 1024, 'Document size cannot exceed 10MB'),
  mimeType: z.enum(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']),
  uploadedAt: z.string(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  verifiedAt: z.string().optional(),
  verifiedBy: z.string().optional(), // admin user ID
  rejectionReason: z.string().optional(),
  expiryDate: z.string().optional(), // for time-sensitive documents
});

export const documentsSchema = z.object({
  // Core ownership documents
  ownershipProof: documentSchema.optional(),
  
  saleDeedOrAllotment: documentSchema.optional(),
  
  // RERA compliance
  reraCertificate: documentSchema.optional(),
  
  // Utility bills for address proof
  electricityBill: documentSchema.optional(),
  
  waterBill: documentSchema.optional(),
  
  // Tax documents
  propertyTaxReceipt: documentSchema.optional(),
  
  // Building approvals
  buildersNOC: documentSchema.optional(),
  
  // Legal clearance
  encumbranceCertificate: documentSchema.optional(),
  
  // Land documents (for plots)
  landConversionCertificate: documentSchema.optional(),
  
  surveyDocument: documentSchema.optional(),
  
  // Other documents
  otherDocuments: z.array(z.object({
    documentType: z.string().max(100),
    document: documentSchema,
  })).max(5, 'Maximum 5 additional documents allowed').optional().default([]),
  
  // Summary fields
  totalDocumentsUploaded: z.number().int().min(0).default(0),
  verifiedDocumentsCount: z.number().int().min(0).default(0),
  hasAllRequiredDocuments: z.boolean().default(false),
});

export default documentsSchema;
