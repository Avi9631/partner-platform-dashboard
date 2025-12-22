import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps } from '../config/stepConfiguration';
import { developerDraftApi } from '@/services/developerDraftService';
import { developerApi } from '@/services/developerService';

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

export const DeveloperFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  
  // Store saved form data from all steps as JSON (empty initially, populated on save)
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form (not used for step forms, kept for compatibility)
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Fetch draft data from API when initialDraftId is provided
  const fetchDraftData = useCallback(async (id) => {
    try {
      setIsLoadingDraft(true);
      console.log('Fetching developer draft data for ID:', id);
      
      const response = await developerDraftApi.getDeveloperDraftById(id);
      
      if (response.success && response.data) {
        console.log('Developer draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft (backend returns draftData field)
        if (response.data.draftData) {
          setFormData(response.data.draftData);
          console.log('Form data populated from draft:', response.data.draftData);
        }
        
        // Mark all steps as not completed (user can edit any step)
        setCompletedSteps(new Set());
        
        // Start from the first step
        setCurrentStep(0);
      } else {
        console.error('Failed to fetch developer draft data:', response);
      }
    } catch (error) {
      console.error('Error fetching developer draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft) {
      setIsLoadingDraft(true);
      console.log('Loading developer draft data for editing:', editingDraft);
      
      // Set form data from draft (support both formData and draftData fields)
      const draftFormData = editingDraft.draftData || editingDraft.formData;
      if (draftFormData) {
        setFormData(draftFormData);
        console.log('Developer draft data loaded successfully:', draftFormData);
      }
  
      // Mark all steps as not completed (user can edit any step)
      setCompletedSteps(new Set());
      
      // Start from the first step
      setCurrentStep(0);
      
      setIsLoadingDraft(false);
    }
  }, [editingDraft]);

  // Load draft data on mount when initialDraftId or editingDraft changes
  useEffect(() => {
    if (initialDraftId && !editingDraft) {
      // Fetch draft data from API when draftId is in URL
      fetchDraftData(initialDraftId);
    } else if (editingDraft) {
      // Load draft data directly when provided as prop (legacy)
      loadDraftData();
    }
  }, [initialDraftId, editingDraft, fetchDraftData, loadDraftData]);

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
          draftData: updatedData || formData,
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
    setIsLoadingDraft(false);
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

  // Publish developer (update draft + call publish API)
  const publishDeveloper = useCallback(async (finalData) => {
    try {
      // Update form data in context
      const updatedFormData = { ...formData, ...finalData };
      
      if (finalData) {
        updateFormData(finalData);
      }
      
      // Save to backend (this will auto-create draft if draftId doesn't exist)
      console.log('Saving developer draft before publishing...', { draftId, finalData });
      const saveResult = await saveDraft(updatedFormData);
      
      if (!saveResult.success) {
        console.error('Failed to save draft before publishing');
        return { success: false, message: 'Failed to save draft' };
      }
      
      // Get the draftId (either existing or newly created)
      const publishDraftId = saveResult.draftId || draftId;
      
      if (!publishDraftId) {
        console.error('No draft ID available for publishing');
        return { success: false, message: 'No draft ID available' };
      }
      
      console.log('Calling publishDeveloper API...', { draftId: publishDraftId });
      
      // Call publish API
      const response = await developerApi.publishDeveloper({ draftId: publishDraftId });
      
      console.log('Publish API Response:', response);
      
      if (response.success) {
        console.log('✅ Developer published successfully');
        return { success: true, data: response };
      } else {
        console.warn('⚠️ Developer publish returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to publish developer:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData, updateFormData, saveDraft]);

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
    publishDeveloper,
    isCreatingDraft,
    isLoadingDraft,
  };

  return (
    <DeveloperFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </DeveloperFormContextV2.Provider>
  );
};
