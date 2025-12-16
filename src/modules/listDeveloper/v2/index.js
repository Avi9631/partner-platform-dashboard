/**
 * ListDeveloper V2 - Multi-Step Form with Save & Continue
 * 
 * This is the developer listing form with:
 * - Multi-step navigation with "Save & Continue" buttons
 * - Progressive step completion tracking
 * - Enhanced sidebar with locked/unlocked steps
 * - Comprehensive review page with collapsible cards
 * - Ability to edit any completed section from the review page
 * - Consolidated step components (no separate form components)
 * - Draft loading support (URL-based or prop-based)
 * - Full-page and sheet overlay variants
 * 
 * Usage:
 * import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';
 * 
 * <DeveloperFormSheetV2 open={isOpen} onOpenChange={setIsOpen} />
 */

// Main form components
export { default as DeveloperFormSheetV2 } from './components/DeveloperFormSheetV2';
export { default as DeveloperFormPageV2 } from './components/DeveloperFormPageV2';

// Context and hooks
export { DeveloperFormProviderV2, useDeveloperFormV2 } from './context/DeveloperFormContextV2';

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
} from './config/stepConfiguration';

// Individual step components (if needed elsewhere)
export { default as BasicInfoStepV2 } from './components/steps/BasicInfoStepV2';
export { default as ContactInfoStepV2 } from './components/steps/ContactInfoStepV2';
export { default as ProjectsStepV2 } from './components/steps/ProjectsStepV2';

export { default as ReviewAndSubmitV2 } from './components/steps/ReviewAndSubmitV2';
