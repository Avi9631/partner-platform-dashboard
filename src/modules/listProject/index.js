/**
 * List Project Module - Main Exports
 * 
 * This module provides project listing functionality for real estate projects
 * including apartment complexes, villa communities, townships, and commercial developments.
 */

// V2 Components and Context (Recommended)
export { 
  ProjectFormSheetV2,
  ProjectFormProviderV2, 
  useProjectFormV2,
  ProjectTypeStepV2,
  SaveAndContinueFooter as ProjectSaveAndContinueFooter
} from './v2';

// Constants
export { PROJECT_TYPES, PROJECT_STATUS, POSSESSION_STATUS, APPROVAL_AUTHORITIES, UNIT_CONFIGURATIONS } from './constants/projectTypes';
export { PROJECT_AMENITIES, AMENITY_CATEGORIES } from './constants/amenities';

// Note: Import the main page component directly if needed:
// import ListProjectV2Page from '@/modules/ListProjectV2';
