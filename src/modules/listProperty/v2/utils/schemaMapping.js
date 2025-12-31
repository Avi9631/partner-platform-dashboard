/**
 * Schema Mapping Utility
 * Maps step IDs to their corresponding validation schemas
 */

import basicDetailsSchema from '../../schemas/basicDetailsSchema';
import basicConfigurationSchema from '../../schemas/basicConfigurationSchema';
import unitAmenitiesSchema from '../../schemas/unitAmenitiesSchema';
import locationSelectionSchema from '../../schemas/locationSelectionSchema';
import locationAttributesSchema from '../../schemas/locationAttributesSchema';
import floorDetailsSchema from '../../schemas/floorDetailsSchema';
import landAttributesSchema from '../../schemas/landAttributesSchema';
import pricingInformationSchema from '../../schemas/pricingInformationSchema';
import suitableForSchema from '../../schemas/suitableForSchema';
import listingInformationSchema from '../../schemas/listingInformationSchema';
import propertyAmenitiesSchema from '../../schemas/propertyAmenitiesSchema';
import mediaUploadSchema from '../../schemas/mediaUploadSchema';

/**
 * Map of step IDs to their validation schemas
 */
export const STEP_SCHEMA_MAP = {
  'location-selection': locationSelectionSchema,
  'basic-details': basicDetailsSchema,
  'basic-configuration': basicConfigurationSchema,
  'unit-amenities': unitAmenitiesSchema,
  'location-attributes': locationAttributesSchema,
  'floor-details': floorDetailsSchema,
  'land-attributes': landAttributesSchema,
  'pricing': pricingInformationSchema,
  'suitable-for': suitableForSchema,
  'listing-info': listingInformationSchema,
  'property-amenities': propertyAmenitiesSchema,
  'media-upload': mediaUploadSchema,
  // 'property-type' doesn't need validation as it's just a selection
};

/**
 * Validate form data against a specific step's schema
 * @param {string} stepId - The step ID
 * @param {Object} formData - The form data to validate
 * @returns {{ success: boolean, errors?: Object }} Validation result
 */
export const validateStep = (stepId, formData) => {
  const schema = STEP_SCHEMA_MAP[stepId];
  
  // If no schema exists for this step, consider it valid
  if (!schema) {
    return { success: true };
  }
  
  try {
    schema.parse(formData);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      errors: error.errors || error.issues || []
    };
  }
};

/**
 * Validate all visible steps
 * @param {Array} visibleSteps - Array of visible step configurations
 * @param {Object} formData - The complete form data
 * @returns {{ allValid: boolean, invalidSteps: Array, validationResults: Object }} Validation summary
 */
export const validateAllSteps = (visibleSteps, formData) => {
  const validationResults = {};
  const invalidSteps = [];
  
  visibleSteps.forEach((step, index) => {
    const result = validateStep(step.id, formData);
    validationResults[step.id] = result;
    
    if (!result.success) {
      invalidSteps.push({
        id: step.id,
        name: step.name,
        index,
        errors: result.errors
      });
    }
  });
  
  return {
    allValid: invalidSteps.length === 0,
    invalidSteps,
    validationResults
  };
};

/**
 * Check if a specific step is valid
 * @param {string} stepId - The step ID
 * @param {Object} formData - The form data to validate
 * @returns {boolean} Whether the step is valid
 */
export const isStepValid = (stepId, formData) => {
  const result = validateStep(stepId, formData);
  return result.success;
};

export default {
  STEP_SCHEMA_MAP,
  validateStep,
  validateAllSteps,
  isStepValid
};
