import { z } from 'zod';

/**
 * Safety measure categories with descriptions
 */
export const SAFETY_MEASURES = [
  {
    key: 'fireSafetyCertificate',
    name: 'Fire Safety Certificate',
    description: 'Valid fire safety certificate from local authorities',
    icon: 'Flame',
    category: 'Fire Safety',
    required: true,
    documents: ['Fire NOC', 'Fire Safety Audit Report', 'Fire Equipment Certificate']
  },
  {
    key: 'policeVerification',
    name: 'Police Verification',
    description: 'Police verification and clearance for property operation',
    icon: 'Shield',
    category: 'Legal Compliance',
    required: true,
    documents: ['Police NOC', 'Character Verification', 'Property Registration']
  },
  {
    key: 'firstAidKit',
    name: 'First Aid Kit',
    description: 'Medical first aid kit available on premises',
    icon: 'Heart',
    category: 'Medical Safety',
    required: false,
    items: ['Bandages', 'Antiseptic', 'Pain Relief Medication', 'Emergency Contact List']
  },
  {
    key: 'emergencyExit',
    name: 'Emergency Exit',
    description: 'Clearly marked emergency exits and evacuation routes',
    icon: 'DoorOpen',
    category: 'Emergency Preparedness',
    required: true,
    features: ['Exit Signage', 'Emergency Lighting', 'Unobstructed Pathways', 'Multiple Exits']
  },
  {
    key: 'nightGuard',
    name: 'Night Security Guard',
    description: '24/7 or night-time security personnel on duty',
    icon: 'UserCheck',
    category: 'Security',
    required: false,
    schedules: ['24x7', 'Night Only (9 PM - 6 AM)', 'Peak Hours', 'Weekends Only']
  }
];

/**
 * CCTV coverage options
 */
export const CCTV_COVERAGE_OPTIONS = [
  { value: '0%', label: 'No CCTV', description: 'No surveillance cameras installed' },
  { value: '25%', label: 'Basic Coverage', description: 'Main entrance and common areas' },
  { value: '50%', label: 'Moderate Coverage', description: 'All common areas and corridors' },
  { value: '75%', label: 'Good Coverage', description: 'Common areas, corridors, and outdoor spaces' },
  { value: '90%', label: 'Comprehensive Coverage', description: 'All areas except private rooms and bathrooms' },
  { value: '95%', label: 'Maximum Coverage', description: 'Complete property coverage with privacy compliance' }
];

/**
 * Safety compliance levels
 */
export const COMPLIANCE_LEVELS = {
  BASIC: { score: 0, label: 'Basic', color: 'red', requirements: ['Fire Safety Certificate'] },
  STANDARD: { score: 3, label: 'Standard', color: 'orange', requirements: ['Fire Safety', 'Police Verification', 'Emergency Exit'] },
  GOOD: { score: 4, label: 'Good', color: 'blue', requirements: ['Standard + First Aid Kit'] },
  EXCELLENT: { score: 5, label: 'Excellent', color: 'green', requirements: ['Good + Night Guard'] }
};

/**
 * Schema for Safety and Compliance
 */
const safetyCompliancePgSchema = z.object({
  // Main safety object (matches JSON format)
  safety: z.object({
    fireSafetyCertificate: z.boolean().default(false),
    policeVerification: z.boolean().default(false),
    firstAidKit: z.boolean().default(false),
    cctvCoverage: z.string()
      .regex(/^\d{1,3}%$/, 'CCTV coverage must be in percentage format (e.g., 95%)')
      .refine(val => {
        const num = parseInt(val.replace('%', ''));
        return num >= 0 && num <= 100;
      }, 'CCTV coverage must be between 0% and 100%')
      .default('0%'),
    emergencyExit: z.boolean().default(false),
    nightGuard: z.boolean().default(false),
  }).default({
    fireSafetyCertificate: false,
    policeVerification: false,
    firstAidKit: false,
    cctvCoverage: '0%',
    emergencyExit: false,
    nightGuard: false,
  }),
  
  // Additional details for each safety measure
  safetyDetails: z.object({
    fireSafetyCertificate: z.object({
      certificateNumber: z.string().max(100, 'Certificate number must be less than 100 characters').optional().or(z.literal('')),
      issueDate: z.string().optional().or(z.literal('')),
      expiryDate: z.string().optional().or(z.literal('')),
      issuingAuthority: z.string().max(200, 'Authority name must be less than 200 characters').optional().or(z.literal('')),
      documentUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    }).optional(),
    
    policeVerification: z.object({
      stationName: z.string().max(200, 'Station name must be less than 200 characters').optional().or(z.literal('')),
      verificationDate: z.string().optional().or(z.literal('')),
      referenceNumber: z.string().max(100, 'Reference number must be less than 100 characters').optional().or(z.literal('')),
      documentUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    }).optional(),
    
    firstAidKit: z.object({
      location: z.string().max(200, 'Location must be less than 200 characters').optional().or(z.literal('')),
      lastUpdated: z.string().optional().or(z.literal('')),
      contents: z.array(z.string()).optional().default([]),
    }).optional(),
    
    emergencyExit: z.object({
      exitCount: z.number().min(1, 'At least 1 emergency exit is required').max(10, 'Maximum 10 exits allowed').optional().default(1),
      exitLocations: z.array(z.string()).optional().default([]),
      evacuationPlan: z.boolean().default(false),
      emergencyLighting: z.boolean().default(false),
    }).optional(),
    
    nightGuard: z.object({
      schedule: z.string().max(100, 'Schedule must be less than 100 characters').optional().or(z.literal('')),
      guardName: z.string().max(100, 'Guard name must be less than 100 characters').optional().or(z.literal('')),
      contactNumber: z.string().max(20, 'Contact number must be less than 20 characters').optional().or(z.literal('')),
      agencyName: z.string().max(200, 'Agency name must be less than 200 characters').optional().or(z.literal('')),
    }).optional(),
    
    cctvDetails: z.object({
      cameraCount: z.number().min(0, 'Camera count cannot be negative').max(100, 'Maximum 100 cameras allowed').optional().default(0),
      recordingRetention: z.string().max(50, 'Retention period must be less than 50 characters').optional().or(z.literal('')),
      monitoringSystem: z.boolean().default(false),
      nightVision: z.boolean().default(false),
      coverageAreas: z.array(z.string()).optional().default([]),
    }).optional(),
  }).optional().default({}),
  
  // Legacy fields for backward compatibility
  hasFireSafetyCertificate: z.boolean().default(false),
  fireSafetyCertificate: z.boolean().default(false),
  fireSafetyCertificateUrl: z.string().url('Please enter a valid certificate URL').optional().or(z.literal('')),
  fireSafetyCertificateNumber: z.string().max(100, 'Certificate number must be less than 100 characters').optional().or(z.literal('')),
  
  policeVerificationRequired: z.boolean().default(false),
  policeVerification: z.boolean().default(false),
  policeVerificationDetails: z.string().max(300, 'Details must be less than 300 characters').optional().or(z.literal('')),
  
  hasFirstAidKit: z.boolean().default(false),
  firstAidKit: z.boolean().default(false),
  
  cctvCoveragePercentage: z.string().regex(/^\d+$/, 'Coverage must be a number').transform(Number).refine(val => val >= 0 && val <= 100, 'Coverage must be between 0 and 100%').optional().or(z.literal(0)),
  cctvCoverage: z.string().optional().or(z.literal('')),
  
  hasEmergencyExit: z.boolean().default(false),
  emergencyExit: z.boolean().default(false),
  emergencyExitCount: z.string().regex(/^\d+$/, 'Count must be a number').transform(Number).refine(val => val >= 0, 'Count cannot be negative').optional().or(z.literal(0)),
  
  hasNightGuard: z.boolean().default(false),
  nightGuard: z.boolean().default(false),
  nightGuardTimings: z.string().max(100, 'Timings must be less than 100 characters').optional().or(z.literal('')),
  
  additionalSafetyMeasures: z.string().max(500, 'Additional measures must be less than 500 characters').optional().or(z.literal('')),
});

export default safetyCompliancePgSchema;
