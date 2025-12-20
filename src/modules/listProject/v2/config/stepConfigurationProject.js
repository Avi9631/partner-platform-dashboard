/**
 * Project Step Configuration System
 * 
 * This configuration file defines all steps for Project listing
 */

import BasicDetailsProjectStep from '../components/steps/BasicDetailsProjectStep';
import LocationDetailsProjectStep from '../components/steps/LocationDetailsProjectStep';
import ConfigurationsProjectStep from '../components/steps/ConfigurationsProjectStep';
 import AmenitiesProjectStep from '../components/steps/AmenitiesProjectStep';
import MediaUploadProjectStep from '../components/steps/MediaUploadProjectStep';
import LegalDocsProjectStep from '../components/steps/LegalDocsProjectStep';
 import ReviewAndSubmitProjectStep from '../components/steps/ReviewAndSubmitProjectStep';

// Step categories for better organization
export const STEP_CATEGORIES = {
  CORE: 'core',
  DETAILS: 'details',
  LEGAL: 'legal',
  MEDIA: 'media',
  FINAL: 'final',
};

/**
 * Step Configuration for Projects
 * 
 * All steps are always visible
 */
const PROJECT_STEPS = [
  {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsProjectStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 0,
  },
  {
    id: 'location-details',
    name: 'Location Details',
    component: LocationDetailsProjectStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 1,
  },
  {
    id: 'configurations',
    name: 'Unit Configurations',
    component: ConfigurationsProjectStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 2,
  },
  {
    id: 'amenities',
    name: 'Amenities & Facilities',
    component: AmenitiesProjectStep,
    category: STEP_CATEGORIES.DETAILS,
    isVisible: () => true,
    order: 3,
  },
  {
    id: 'media-upload',
    name: 'Media Gallery',
    component: MediaUploadProjectStep,
    category: STEP_CATEGORIES.MEDIA,
    isVisible: () => true,
    order: 4,
  },
  {
    id: 'legal-docs',
    name: 'Legal & RERA',
    component: LegalDocsProjectStep,
    category: STEP_CATEGORIES.LEGAL,
    isVisible: () => true,
    order: 5,
  },
  // {
  //   id: 'additional-info',
  //   name: 'Additional Information',
  //   component: AdditionalInfoProjectStep,
  //   category: STEP_CATEGORIES.DETAILS,
  //   isVisible: () => true,
  //   order: 7,
  // },
  {
    id: 'review-submit',
    name: 'Review & Submit',
    component: ReviewAndSubmitProjectStep,
    category: STEP_CATEGORIES.FINAL,
    isVisible: () => true,
    order: 6,
  },
];

/**
 * Get all visible steps based on form data
 */
export const getVisibleSteps = (formData = {}) => {
  return PROJECT_STEPS.filter(step => step.isVisible(formData))
    .sort((a, b) => a.order - b.order);
};

/**
 * Get total number of visible steps
 */
export const getTotalVisibleSteps = (formData = {}) => {
  return getVisibleSteps(formData).length;
};

/**
 * Get step component by index
 */
export const getStepComponent = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  const step = visibleSteps[stepIndex];
  return step ? step.component : null;
};

/**
 * Get step configuration by index
 */
export const getStepConfig = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  return visibleSteps[stepIndex];
};

/**
 * Get step index by id
 */
export const getStepIndexById = (stepId, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  return visibleSteps.findIndex(step => step.id === stepId);
};

export default PROJECT_STEPS;
