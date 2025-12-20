// Main exports for listProject v2 module

// Context
export { ProjectFormProviderV2, useProjectFormV2 } from './context/ProjectFormContextV2';

// Components
export { default as ProjectFormPageV2 } from './components/ProjectFormPageV2';
export { default as ProjectFormSheetV2 } from './components/ProjectFormSheetV2';

// Configuration
export { 
  default as PROJECT_STEPS,
  STEP_CATEGORIES,
  getVisibleSteps,
  getTotalVisibleSteps,
  getStepComponent,
  getStepConfig,
  getStepIndexById
} from './config/stepConfigurationProject';

// Steps
export { default as BasicDetailsProjectStep } from './components/steps/BasicDetailsProjectStep';
export { default as LocationDetailsProjectStep } from './components/steps/LocationDetailsProjectStep';
export { default as ConfigurationsProjectStep } from './components/steps/ConfigurationsProjectStep';
export { default as PricingProjectStep } from './components/steps/PricingProjectStep';
export { default as AmenitiesProjectStep } from './components/steps/AmenitiesProjectStep';
export { default as MediaUploadProjectStep } from './components/steps/MediaUploadProjectStep';
export { default as LegalDocsProjectStep } from './components/steps/LegalDocsProjectStep';
export { default as AdditionalInfoProjectStep } from './components/steps/AdditionalInfoProjectStep';
export { default as ReviewAndSubmitProjectStep } from './components/steps/ReviewAndSubmitProjectStep';
export { default as SaveAndContinueFooter } from './components/steps/SaveAndContinueFooter';
