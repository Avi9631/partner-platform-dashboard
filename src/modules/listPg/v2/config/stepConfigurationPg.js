/**
 * PG/Hostel Step Configuration System
 * 
 * This configuration file defines all steps for PG/Hostel listing
 * All steps are visible for PG/Hostel types (no conditional steps like property)
 */

import BasicDetailsPgStep from '../components/steps/BasicDetailsPgStep';
import LocationDetailsPgStep from '../components/steps/LocationDetailsPgStep';
import RoomTypesPgStep from '../components/steps/RoomTypesPgStep';
import AmenitiesPgStep from '../components/steps/AmenitiesPgStep';
import FoodMessPgStep from '../components/steps/FoodMessPgStep';
import RulesRestrictionsPgStep from '../components/steps/RulesRestrictionsPgStep';
import MediaUploadPgStep from '../components/steps/MediaUploadPgStep';
import AvailabilityPgStep from '../components/steps/AvailabilityPgStep';
import SafetyCompliancePgStep from '../components/steps/SafetyCompliancePgStep';
import ReviewAndSubmitPgStep from '../components/steps/ReviewAndSubmitPgStep';

// Step categories for better organization
export const STEP_CATEGORIES = {
  CORE: 'core',
  DETAILS: 'details',
  MEDIA: 'media',
  FINAL: 'final',
};

/**
 * Step Configuration for PG/Hostel
 * 
 * All steps are always visible (no conditional logic like property types)
 */
const PG_STEPS = [
  {
    id: 'basic-details',
    name: 'Basic Details',
    component: BasicDetailsPgStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 0,
  },
  {
    id: 'location-details',
    name: 'Location Details',
    component: LocationDetailsPgStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 1,
  },
  {
    id: 'room-types',
    name: 'Room Types & Pricing',
    component: RoomTypesPgStep,
    category: STEP_CATEGORIES.CORE,
    isVisible: () => true,
    order: 2,
  },
  {
    id: 'amenities',
    name: 'Amenities',
    component: AmenitiesPgStep,
    category: STEP_CATEGORIES.DETAILS,
    isVisible: () => true,
    order: 3,
  },
  {
    id: 'food-mess',
    name: 'Food & Mess',
    component: FoodMessPgStep,
    category: STEP_CATEGORIES.DETAILS,
    isVisible: () => true,
    order: 4,
  },
  {
    id: 'rules-restrictions',
    name: 'Rules & Restrictions',
    component: RulesRestrictionsPgStep,
    category: STEP_CATEGORIES.DETAILS,
    isVisible: () => true,
    order: 5,
  },
  {
    id: 'media-upload',
    name: 'Media Upload',
    component: MediaUploadPgStep,
    category: STEP_CATEGORIES.MEDIA,
    isVisible: () => true,
    order: 6,
  },
  {
    id: 'review-submit',
    name: 'Review & Submit',
    component: ReviewAndSubmitPgStep,
    category: STEP_CATEGORIES.FINAL,
    isVisible: () => true,
    order: 7,
  },
];

// ============================================================================
// COMBINED STEP CONFIGURATION
// ============================================================================
export const STEP_CONFIG = PG_STEPS;

/**
 * Get visible steps based on current form data
 * For PG/Hostel, all steps are always visible
 * @param {Object} formData - Current form data (not used for PG but kept for consistency)
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
