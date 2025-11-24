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
    // If no draft ID exists, create a new draft first
    if (!draftId) {
      console.log('No draft ID exists, creating new draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await draftApi.createListingDraft({
          status: 'draft',
          formData: updatedData || formData,
        });
        
        if (createResponse.success && createResponse.data?.draftId) {
          const newDraftId = createResponse.data.draftId;
          console.log('✅ New draft created with ID:', newDraftId);
          setDraftId(newDraftId);
          setIsCreatingDraft(false);
          return { success: true, data: createResponse, draftId: newDraftId };
        } else {
          console.warn('⚠️ Failed to create draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update existing draft
    try {
      console.log('Calling updateListingDraft API...', {
        draftId,
        dataKeys: Object.keys(updatedData || formData),
      });
      
      // Pass the actual form data directly, not wrapped in draftData
      const response = await draftApi.updateListingDraft(draftId, updatedData || formData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ Draft saved successfully to backend');
        return { success: true, data: response };
      } else {
        console.warn('⚠️ Draft save returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save draft:', error);
      // Don't throw error, just log it and return failure
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
      console.log('Saving draft to backend...', { draftId, stepData });
      const saveResult = await saveDraft(updatedFormData);
      
      if (saveResult.success) {
        console.log('Draft saved successfully');
        // If a new draft was created, the draftId is already set by saveDraft
      } else {
        console.warn('Draft save unsuccessful, but continuing to next step');
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
    setDraftId, // Function to set draft ID (for auto-creation)
    saveDraft, // Function to save draft
    isCreatingDraft, // Loading state for draft creation
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PropertyFormContextV2.Provider>
  );
};
