/**
 * PG/Hostel Module V2 - Exports
 * 
 * Main entry point for PG/Hostel listing module
 */

// Main form sheet component
export { default as PgFormSheetV2 } from './components/PgFormSheetV2';

// Context and hooks
export { PgFormProviderV2, usePgFormV2 } from './context/PgFormContextV2';

// Configuration
export {
  STEP_CONFIG,
  STEP_CATEGORIES,
  getVisibleSteps,
  getStepComponent,
  getTotalVisibleSteps,
  getStepName,
  isStepVisible,
  getStepIndexById,
} from './config/stepConfigurationPg';

// Individual step components (if needed elsewhere)
export { default as BasicDetailsPgStep } from './components/steps/BasicDetailsPgStep';
export { default as LocationDetailsPgStep } from './components/steps/LocationDetailsPgStep';
export { default as RoomTypesPgStep } from './components/steps/RoomTypesPgStep';
export { default as AmenitiesPgStep } from './components/steps/AmenitiesPgStep';
export { default as FoodMessPgStep } from './components/steps/FoodMessPgStep';
export { default as RulesRestrictionsPgStep } from './components/steps/RulesRestrictionsPgStep';
export { default as MediaUploadPgStep } from './components/steps/MediaUploadPgStep';
export { default as AvailabilityPgStep } from './components/steps/AvailabilityPgStep';
export { default as SafetyCompliancePgStep } from './components/steps/SafetyCompliancePgStep';
export { default as ReviewAndSubmitPgStep } from './components/steps/ReviewAndSubmitPgStep';
