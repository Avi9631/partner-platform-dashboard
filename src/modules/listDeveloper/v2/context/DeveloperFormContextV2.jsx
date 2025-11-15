import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps } from '../config/stepConfiguration';
import { developerDraftApi } from '@/services/developerDraftService';

const DeveloperFormContextV2 = createContext(null);

export const useDeveloperFormV2 = () => {
  const context = useContext(DeveloperFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('useDeveloperFormV2 must be used within DeveloperFormProviderV2');
      return null;
    }
    throw new Error('useDeveloperFormV2 must be used within DeveloperFormProviderV2');
  }
  return context;
};

export const DeveloperFormProviderV2 = ({ children, onClose, initialDraftId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  
  // Store saved form data from all steps as JSON (empty initially, populated on save)
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form (not used for step forms, kept for compatibility)
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Memoize the form data for step configuration
  const formDataWithType = useMemo(() => ({
    ...formData,
  }), [formData]);

  // Get total steps dynamically based on current form data
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  // Update form data in context (called when save & continue is clicked)
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  // Save draft to backend
  const saveDraft = useCallback(async (updatedData) => {
    // If no draft ID exists, create a new draft first
    if (!draftId) {
      console.log('No draft ID exists, creating new draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await developerDraftApi.createDeveloperDraft({
          status: 'draft',
          formData: updatedData || formData,
        });
        
        if (createResponse.success && createResponse.data?.draftId) {
          const newDraftId = createResponse.data.draftId;
          console.log('✅ New developer draft created with ID:', newDraftId);
          setDraftId(newDraftId);
          setIsCreatingDraft(false);
          return { success: true, data: createResponse, draftId: newDraftId };
        } else {
          console.warn('⚠️ Failed to create developer draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating developer draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update existing draft
    try {
      console.log('Calling updateDeveloperDraft API...', {
        draftId,
        dataKeys: Object.keys(updatedData || formData),
      });
      
      const response = await developerDraftApi.updateDeveloperDraft(draftId, {
        draftData: updatedData || formData,
        status: 'draft',
      });
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ Developer draft saved successfully to backend');
        return { success: true, data: response };
      } else {
        console.warn('⚠️ Developer draft save returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save developer draft:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(async (stepData) => {
    try {
      // Update form data in context first
      const updatedFormData = { ...formData, ...stepData };
      
      if (stepData) {
        updateFormData(stepData);
      }
      
      // Save to backend (this will auto-create draft if draftId doesn't exist)
      console.log('Saving developer draft to backend...', { draftId, stepData });
      const saveResult = await saveDraft(updatedFormData);
      
      if (saveResult.success) {
        console.log('Developer draft saved successfully');
      } else {
        console.warn('Developer draft save unsuccessful, but continuing to next step');
      }
      
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Move to next step
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error in saveAndContinue:', error);
      // Still proceed to next step even if save fails
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft, draftId]);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Jump to a specific step (for review page editing)
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({});
    methods.reset({});
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setDraftId(null);
    setIsCreatingDraft(false);
  }, [methods]);

  // Check if a step is completed
  const isStepCompleted = useCallback((step) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  // Get step progress percentage
  const getProgress = useCallback(() => {
    const totalSteps = getTotalSteps();
    if (totalSteps <= 1) return 0;
    return Math.round((currentStep / (totalSteps - 1)) * 100);
  }, [currentStep, getTotalSteps]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData,
    updateFormData,
    formDataWithType,
    draftId,
    setDraftId,
    saveDraft,
    isCreatingDraft,
  };

  return (
    <DeveloperFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </DeveloperFormContextV2.Provider>
  );
};
