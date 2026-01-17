/**
 * Schema Mapping Utility for PG/Hostel Listings
 * Maps step IDs to their corresponding validation schemas
 */

import { z } from 'zod';
import basicDetailsPgSchema from '../../schemas/basicDetailsPgSchema';
import locationDetailsPgSchema from '../../schemas/locationDetailsPgSchema';
import roomTypesPgSchema from '../../schemas/roomTypesPgSchema';
import amenitiesPgSchema from '../../schemas/amenitiesPgSchema';
import foodMessPgSchema from '../../schemas/foodMessPgSchema';
import rulesRestrictionsPgSchema from '../../schemas/rulesRestrictionsPgSchema';
import mediaUploadPgSchema from '../../schemas/mediaUploadPgSchema';
import availabilityPgSchema from '../../schemas/availabilityPgSchema';

/**
 * Map of step IDs to their validation schemas
 * Note: Some schemas are array schemas that need to be wrapped in objects
 * to match how the form saves data (e.g., { roomTypes: [...] })
 */
export const STEP_SCHEMA_MAP = {
  'basic-details': basicDetailsPgSchema,
  'location-details': locationDetailsPgSchema,
  'room-types': z.object({ roomTypes: roomTypesPgSchema }), // Wrapped to match form structure
  'amenities': z.object({ amenities: amenitiesPgSchema }), // Wrapped to match form structure
  'food-mess': foodMessPgSchema, // Already wrapped as z.object({ foodMess: {...} })
  'rules-restrictions': z.object({ rules: rulesRestrictionsPgSchema }), // Wrapped to match form structure
  'media-upload': mediaUploadPgSchema, // Already wrapped as z.object({ mediaData: [...] })
  'availability': availabilityPgSchema,
};

/**
 * Validate form data against a specific step's schema
 * Handles both nested (stepId: {fields}) and flat structures
 * 
 * Note: Form components wrap array schemas in objects (e.g., { amenities: [...] })
 * but save to formData as formData[stepId] = { amenities: [...] }
 * 
 * @param {string} stepId - The step ID
 * @param {Object} formData - The form data to validate
 * @returns {{ success: boolean, errors?: Object }} Validation result
 */
export const validateStep = (stepId, formData) => {
  const schema = STEP_SCHEMA_MAP[stepId];
  
  // If no schema exists for this step, consider it valid
  if (!schema) {
    console.log(`⚠️ No schema found for step: ${stepId}, considering it valid`);
    return { success: true };
  }
  
  // Extract step-specific data from nested structure
  // FormData structure: { stepId: { field1: value1, field2: value2 }, ... }
  const stepData = formData[stepId] || {};
  
  // Build validation data:
  // Start with step-specific nested data and include top-level properties
  let dataToValidate = { ...stepData };
  
  // Include top-level properties for backward compatibility
  Object.entries(formData).forEach(([key, value]) => {
    // Skip other step objects, but include primitives and arrays at top level
    if (key !== stepId && (typeof value !== 'object' || Array.isArray(value) || value === null)) {
      // Only add if not already present in stepData (stepData takes precedence)
      if (!(key in dataToValidate)) {
        dataToValidate[key] = value;
      }
    }
  });
  
  try {
    schema.parse(dataToValidate);
    console.log(`✅ Step ${stepId} validation passed`);
    return { success: true };
  } catch (error) {
    console.log(`❌ Step ${stepId} validation failed:`, error.errors || error.issues);
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
