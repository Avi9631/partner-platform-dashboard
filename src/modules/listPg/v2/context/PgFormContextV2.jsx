import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps } from '../config/stepConfigurationPg';
import { draftApi } from '@/services/draftService';

const PgFormContextV2 = createContext(null);

export const usePgFormV2 = () => {
  const context = useContext(PgFormContextV2);
  if (!context) {
    if (import.meta.env.DEV) {
      console.error('usePgFormV2 must be used within PgFormProviderV2');
      return null;
    }
    throw new Error('usePgFormV2 must be used within PgFormProviderV2');
  }
  return context;
};

export const PgFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null); // pg, hostel, co_living, etc.
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  
  // Store saved form data from all steps as JSON
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Load draft data when editingDraft is provided
  const loadDraftData = useCallback(() => {
    if (editingDraft && editingDraft.draftData) {
      setIsLoadingDraft(true);
      console.log('Loading PG draft data for editing:', editingDraft);
      
      // Set form data from draft
      setFormData(editingDraft.draftData);
      
      // Set property type if available
      if (editingDraft.draftData.propertyType) {
        setPropertyType(editingDraft.draftData.propertyType);
      }
      
      // Mark all steps as not completed (user can edit any step)
      setCompletedSteps(new Set());
      
      // Start from the first step
      setCurrentStep(0);
      
      setIsLoadingDraft(false);
      console.log('PG draft data loaded successfully');
    }
  }, [editingDraft]);

  // Load draft data on mount when editingDraft changes
  useEffect(() => {
    if (editingDraft) {
      loadDraftData();
    }
  }, [editingDraft, loadDraftData]);

  // Memoize the form data with propertyType
  const formDataWithType = useMemo(() => ({
    ...formData,
    propertyType,
  }), [formData, propertyType]);

  // Get total steps
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  // Update form data in context
  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({
      ...prev,
      ...stepData,
    }));
  }, []);

  // Save draft to backend
  const saveDraft = useCallback(async (updatedData) => {
    let currentDraftId = draftId;
    
    // If no draft ID exists, create a new draft first
    if (!currentDraftId) {
      console.log('No draft ID exists, creating new PG draft...');
      try {
        setIsCreatingDraft(true);
        const createResponse = await draftApi.createListingDraft('PG');
        
        if (createResponse.success && createResponse.data?.draftId) {
          currentDraftId = createResponse.data.draftId;
          console.log('✅ New PG draft created with ID:', currentDraftId);
          setDraftId(currentDraftId);
          setIsCreatingDraft(false);
        } else {
          console.warn('⚠️ Failed to create PG draft:', createResponse);
          setIsCreatingDraft(false);
          return { success: false, message: 'Failed to create draft' };
        }
      } catch (error) {
        console.error('❌ Error creating PG draft:', error);
        setIsCreatingDraft(false);
        return { success: false, error: error.message };
      }
    }

    // Update draft with actual data
    try {
      console.log('Calling updateListingDraft API...', {
        draftId: currentDraftId,
        dataKeys: Object.keys(updatedData || formData),
      });
      
      const response = await draftApi.updateListingDraft(currentDraftId, updatedData || formData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ PG draft saved successfully to backend');
        return { success: true, data: response, draftId: currentDraftId };
      } else {
        console.warn('⚠️ PG draft save returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save PG draft:', error);
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
      
      // Save to backend
      console.log('Saving PG draft to backend...', { draftId, stepData });
      const saveResult = await saveDraft(updatedFormData);
      
      if (saveResult.success) {
        console.log('PG draft saved successfully');
      } else {
        console.warn('PG draft save unsuccessful, but continuing to next step');
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

  // Jump to a specific step
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

  const value = {
    currentStep,
    setCurrentStep,
    saveAndContinue,
    previousStep,
    goToStep,
    resetForm,
    getTotalSteps,
    propertyType,
    setPropertyType,
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
    isLoadingDraft,
  };

  return (
    <PgFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PgFormContextV2.Provider>
  );
};
