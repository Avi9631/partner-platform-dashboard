import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps } from '../config/stepConfiguration';
import { draftApi } from '@/services/draftService';

const PropertyFormContextV2 = createContext(null);

export const usePropertyFormV2 = () => {
  const context = useContext(PropertyFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('usePropertyFormV2 must be used within PropertyFormProviderV2');
      return null; // Return null in dev mode for better HMR support
    }
    throw new Error('usePropertyFormV2 must be used within PropertyFormProviderV2');
  }
  return context;
};

export const PropertyFormProviderV2 = ({ children, onClose, initialDraftId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
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

  // Memoize the form data with propertyType for step configuration
  const formDataWithType = useMemo(() => ({
    ...formData,
    propertyType,
  }), [formData, propertyType]);

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
    if (!draftId) {
      console.warn('No draft ID available, skipping save');
      return;
    }

    try {
      const response = await draftApi.updateListingDraft(draftId, {
        formData: updatedData || formData,
        status: 'draft',
      });
      
      if (response.success) {
        console.log('Draft saved successfully');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      // Don't throw error, just log it
    }
  }, [draftId, formData]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(async (stepData) => {
    // Update form data in context
    if (stepData) {
      updateFormData(stepData);
      
      // Save to backend if we have a draft ID
      const updatedFormData = { ...formData, ...stepData };
      await saveDraft(updatedFormData);
    }
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft]);

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
    setPropertyType(null);
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

  // Helper functions
  const isBuildingType = useCallback(() => {
    const buildingTypes = ['apartment', 'villa', 'duplex', 'independent_house', 
            'penthouse', 'studio', 'independent_floor'];
    return buildingTypes.includes(propertyType);
  }, [propertyType]);

  const isLandType = useCallback(() => {
    const landTypes = ['plot', 'farmhouse', 'agricultural_land'];
    return landTypes.includes(propertyType);
  }, [propertyType]);

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    isBuildingType,
    isLandType,
    propertyType,
    setPropertyType,
    completedSteps,
    isStepCompleted,
    getProgress,
    onClose,
    formData, // JSON object updated only on save & continue
    updateFormData, // Method to update form data
    formDataWithType, // Form data with propertyType for step configuration
    draftId, // Current draft ID
    saveDraft, // Function to save draft
    isCreatingDraft, // Loading state for draft creation
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContextV2.Provider>
  );
};
