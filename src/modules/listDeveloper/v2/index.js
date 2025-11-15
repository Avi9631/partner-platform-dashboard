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
 * 
 * Usage:
 * import { DeveloperFormSheetV2 } from '@/modules/listDeveloper/v2';
 * 
 * <DeveloperFormSheetV2 open={isOpen} onOpenChange={setIsOpen} />
 */

export { default as DeveloperFormSheetV2 } from './components/DeveloperFormSheetV2';
export { DeveloperFormProviderV2, useDeveloperFormV2 } from './context/DeveloperFormContextV2';

// Step components
export { default as BasicInfoStepV2 } from './components/steps/BasicInfoStepV2';
export { default as ContactInfoStepV2 } from './components/steps/ContactInfoStepV2';
export { default as ProjectsStepV2 } from './components/steps/ProjectsStepV2';
export { default as CertificationsStepV2 } from './components/steps/CertificationsStepV2';
export { default as MediaStepV2 } from './components/steps/MediaStepV2';
export { default as ReviewAndSubmitV2 } from './components/steps/ReviewAndSubmitV2';
