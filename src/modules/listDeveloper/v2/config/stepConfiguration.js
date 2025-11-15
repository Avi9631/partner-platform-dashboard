/**
 * Developer Form Step Configuration
 * 
 * This configuration defines all steps for the developer listing form.
 * Steps are shown sequentially with Save & Continue functionality.
 */

import BasicInfoStepV2 from '../components/steps/BasicInfoStepV2';
import ContactInfoStepV2 from '../components/steps/ContactInfoStepV2';
import ProjectsStepV2 from '../components/steps/ProjectsStepV2';
import CertificationsStepV2 from '../components/steps/CertificationsStepV2';
import MediaStepV2 from '../components/steps/MediaStepV2';
import ReviewAndSubmitV2 from '../components/steps/ReviewAndSubmitV2';

// Step categories for better organization
export const STEP_CATEGORIES = {
  CORE: 'core',
  OPTIONAL: 'optional',
};

/**
 * Step Configuration
 * 
 * Each step has:
 * - id: unique identifier
 * - name: display name
 * - component: React component to render
 * - category: step category
 * - isVisible: function that determines if step should be shown
 * - order: base order for sorting
 */

export const STEP_CONFIG = [
  {
    id: 'basic-info',
    name: 'Basic Information',
    component: BasicInfoStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 0,
  },
  {
    id: 'contact-info',
    name: 'Contact Information',
    component: ContactInfoStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 1,
  },
  {
    id: 'projects',
    name: 'Projects & Portfolio',
    component: ProjectsStepV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 2,
  },
  {
    id: 'certifications',
    name: 'Certifications & Awards',
    component: CertificationsStepV2,
    category: STEP_CATEGORIES.OPTIONAL,
    isVisible: () => true,
    order: 3,
  },
  {
    id: 'media',
    name: 'Media & Documents',
    component: MediaStepV2,
    category: STEP_CATEGORIES.OPTIONAL,
    isVisible: () => true,
    order: 4,
  },
  {
    id: 'review-submit',
    name: 'Review & Submit',
    component: ReviewAndSubmitV2,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 5,
  },
];

/**
 * Get visible steps based on current form data
 * @param {Object} formData - Current form data
 * @returns {Array} Array of visible step configurations
 */
export const getVisibleSteps = (formData = {}) => {
  return STEP_CONFIG
    .filter(step => step.isVisible(formData))
    .sort((a, b) => a.order - b.order);
};

/**
 * Get step component by index in visible steps
 * @param {number} stepIndex - Current step index
 * @param {Object} formData - Current form data
 * @returns {React.Component} Step component or null
 */
export const getStepComponent = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  const step = visibleSteps[stepIndex];
  return step ? step.component : null;
};

/**
 * Get total number of visible steps
 * @param {Object} formData - Current form data
 * @returns {number} Total visible steps
 */
export const getTotalVisibleSteps = (formData = {}) => {
  return getVisibleSteps(formData).length;
};

/**
 * Get step name by index
 * @param {number} stepIndex - Current step index
 * @param {Object} formData - Current form data
 * @returns {string} Step name
 */
export const getStepName = (stepIndex, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  const step = visibleSteps[stepIndex];
  return step ? step.name : '';
};

/**
 * Check if a specific step ID is currently visible
 * @param {string} stepId - Step ID to check
 * @param {Object} formData - Current form data
 * @returns {boolean} Whether step is visible
 */
export const isStepVisible = (stepId, formData = {}) => {
  const step = STEP_CONFIG.find(s => s.id === stepId);
  return step ? step.isVisible(formData) : false;
};

/**
 * Get step index by step ID (within visible steps)
 * @param {string} stepId - Step ID
 * @param {Object} formData - Current form data
 * @returns {number} Step index or -1 if not found
 */
export const getStepIndexById = (stepId, formData = {}) => {
  const visibleSteps = getVisibleSteps(formData);
  return visibleSteps.findIndex(step => step.id === stepId);
};

export default {
  STEP_CONFIG,
  STEP_CATEGORIES,
  getVisibleSteps,
  getStepComponent,
  getTotalVisibleSteps,
  getStepName,
  isStepVisible,
  getStepIndexById,
};
