/**
 * Validation Logger Utility
 * 
 * Provides logging utilities for form validation debugging.
 * Helps track validation errors and form submissions during development.
 */

/**
 * Creates a step-specific logger for validation tracking
 * @param {string} stepName - Name of the step (e.g., "Basic Details Step")
 * @returns {Object} Logger object with logging methods
 */
export const createStepLogger = (stepName) => {
  const isDevelopment = import.meta.env.DEV;

  return {
    /**
     * Log validation errors
     * @param {Object} errors - React Hook Form errors object
     */
    logErrors: (errors) => {
      if (!isDevelopment || Object.keys(errors).length === 0) return;

      console.group(`🔴 [${stepName}] Validation Errors`);
      Object.entries(errors).forEach(([field, error]) => {
        if (error?.message) {
          console.error(`  ❌ ${field}:`, error.message);
        } else if (Array.isArray(error)) {
          // Handle field array errors
          console.error(`  ❌ ${field}:`, error);
        } else if (error && typeof error === 'object') {
          // Handle nested errors
          console.error(`  ❌ ${field}:`, error);
        }
      });
      console.groupEnd();
    },

    /**
     * Log form submission attempt
     * @param {Object} data - Form data being submitted
     * @param {Object} errors - Validation errors (if any)
     */
    logSubmission: (data, errors = {}) => {
      if (!isDevelopment) return;

      const hasErrors = Object.keys(errors).length > 0;

      if (hasErrors) {
        console.group(`⚠️ [${stepName}] Submission Failed - Validation Errors`);
        console.log('Form Data:', data);
        console.log('Errors:', errors);
        console.groupEnd();
      } else {
        console.group(`✅ [${stepName}] Submission Successful`);
        console.log('Form Data:', data);
        console.groupEnd();
      }
    },

    /**
     * Log custom validation info
     * @param {string} message - Custom message
     * @param {*} data - Optional data to log
     */
    logInfo: (message, data = null) => {
      if (!isDevelopment) return;

      console.log(`ℹ️ [${stepName}] ${message}`, data || '');
    },

    /**
     * Log warning
     * @param {string} message - Warning message
     * @param {*} data - Optional data to log
     */
    logWarning: (message, data = null) => {
      if (!isDevelopment) return;

      console.warn(`⚠️ [${stepName}] ${message}`, data || '');
    },
  };
};

/**
 * Global validation logger (not step-specific)
 */
export const validationLogger = {
  logFieldError: (fieldName, error) => {
    if (!import.meta.env.DEV) return;
    console.error(`❌ Field "${fieldName}":`, error?.message || error);
  },

  logFormState: (formState) => {
    if (!import.meta.env.DEV) return;
    console.log('📋 Form State:', {
      isValid: formState.isValid,
      isDirty: formState.isDirty,
      isSubmitting: formState.isSubmitting,
      errors: formState.errors,
    });
  },

  logSchemaValidation: (schema, data) => {
    if (!import.meta.env.DEV) return;
    try {
      schema.parse(data);
      console.log('✅ Schema validation passed');
    } catch (error) {
      console.error('❌ Schema validation failed:', error);
    }
  },
};

export default {
  createStepLogger,
  validationLogger,
};
