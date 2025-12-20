import { z } from 'zod';

/**
 * Schema for Legal Documents & RERA
 */

// Schema for approval document
const approvalDocumentSchema = z.object({
  type: z.enum([
    'Municipal Approval',
    'Fire NOC',
    'Environmental Clearance',
    'Occupancy Certificate',
    'Building Plan Approval',
    'Other'
  ]),
  documentUrl: z.string().url('Invalid document URL').optional(),
  issueDate: z.string().optional(),
  validUntil: z.string().optional(),
  remarks: z.string().max(500, 'Remarks must be less than 500 characters').optional(),
});

const legalDocsProjectSchema = z.object({
  // RERA details (already captured in basic details, this is for certificate)
  reraCertificateUrl: z.string()
    .url('Please upload RERA certificate')
    .optional()
    .or(z.literal('')),

  // RERA website link
  reraWebsiteLink: z.string()
    .url('Please enter a valid RERA website URL')
    .optional()
    .or(z.literal('')),

  // Approval documents
  approvalDocuments: z.array(approvalDocumentSchema)
    .max(20, 'Cannot upload more than 20 approval documents')
    .optional()
    .default([]),

  // Title clearance status
  titleClearance: z.enum([
    'Clear Title',
    'Pending Clearance',
    'Under Verification',
    'Not Applicable'
  ]).optional(),

  // Title clearance document
  titleClearanceDocumentUrl: z.string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),

  // Encumbrance certificate
  encumbranceCertificateUrl: z.string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),

  // Commencement certificate
  commencementCertificateUrl: z.string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),

  // Building plan approval
  buildingPlanApprovalUrl: z.string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),

  // Additional legal documents
  additionalLegalDocs: z.array(z.object({
    name: z.string().min(2, 'Document name is required'),
    url: z.string().url('Invalid document URL'),
  }))
    .max(10, 'Cannot upload more than 10 additional documents')
    .optional()
    .default([]),
});

export default legalDocsProjectSchema;
export { approvalDocumentSchema };
