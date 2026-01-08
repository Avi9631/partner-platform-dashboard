/**
 * Example: Updated BasicDetailsStepV2.jsx to work with nested form structure
 * 
 * Key changes:
 * 1. Use getStepData('basic-details') instead of formData
 * 2. saveAndContinue automatically uses current step ID
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePropertyFormV2 } from '../../context/PropertyFormContextV2';
import basicDetailsSchema from '../../../schemas/basicDetailsSchema';
import SaveAndContinueFooter from '../SaveAndContinueFooter';
import { createStepLogger } from '../../../utils/validationLogger';

const STEP_ID = 'basic-details'; // Define step ID constant

export default function BasicDetailsStepV2() {
  // Get step-specific data using getStepData
  const { 
    saveAndContinue, 
    previousStep, 
    getStepData,  // ✅ NEW: Get nested step data
    setCurrentStepSubmitHandler, 
    setCurrentStepIsValid 
  } = usePropertyFormV2();

  // ✅ NEW: Get data for this specific step
  const stepData = getStepData(STEP_ID);

  const logger = useMemo(() => createStepLogger('Basic Details Step'), []);

  // ✅ UPDATED: Use stepData instead of formData
  const form = useForm({
    resolver: zodResolver(basicDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      listingType: stepData?.listingType || 'sale',
      ownershipType: stepData?.ownershipType || 'freehold',
      projectName: stepData?.projectName || '',
      customPropertyName: stepData?.customPropertyName || '',
      reraIds: stepData?.reraIds || [],
      ageOfProperty: stepData?.ageOfProperty || '',
      possessionStatus: stepData?.possessionStatus || 'ready',
      possessionDate: stepData?.possessionDate || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'reraIds',
  });

  // [... rest of your component state and logic ...]

  // ✅ UPDATED: saveAndContinue automatically uses current step ID
  const onSubmit = useCallback(async (data) => {
    try {
      logger.logSubmit('Basic Details', data);
      
      // No need to pass stepId - it's automatically determined
      await saveAndContinue(data);
      
      logger.logSuccess('Basic Details');
    } catch (error) {
      logger.logError('Basic Details submission failed', error);
    }
  }, [saveAndContinue, logger]);

  // Register submit handler
  useEffect(() => {
    setCurrentStepSubmitHandler(() => form.handleSubmit(onSubmit));
  }, [form, onSubmit, setCurrentStepSubmitHandler]);

  // Track form validity
  useEffect(() => {
    setCurrentStepIsValid(form.formState.isValid);
  }, [form.formState.isValid, setCurrentStepIsValid]);

  // Log validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      logger.logErrors(form.formState.errors);
    }
  }, [form.formState.errors, logger]);

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Your form fields here */}
        
        <SaveAndContinueFooter
          onBack={previousStep}
          isSubmitting={form.formState.isSubmitting}
          isValid={form.formState.isValid}
        />
      </form>
    </div>
  );
}

/**
 * Summary of Changes:
 * 
 * 1. Added STEP_ID constant at the top
 * 2. Replaced formData with getStepData(STEP_ID)
 * 3. Updated defaultValues to use stepData instead of formData
 * 4. onSubmit now just calls saveAndContinue(data) - no stepId needed
 * 5. Added logger for better debugging
 * 
 * Benefits:
 * - Data is properly scoped to this step
 * - Cleaner separation of concerns
 * - Easier to debug and maintain
 * - Draft saves are automatically structured correctly
 */
