import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfigurationPg';
import { draftApi } from '@/services/draftService';
import { toast } from 'sonner';

const PgFormContextV2 = createContext(null);

import { validateStep } from '../utils/schemaMapping';

/**
 * Helper function to determine which steps are valid
 * Returns a Set of step indices that have valid data according to their Zod schemas
 * Uses pure Zod validation - schemas handle data structure internally
 */
const getCompletedStepsFromData = (formData) => {
  const completedSteps = new Set();
  const visibleSteps = getVisibleSteps(formData);

  // Let Zod schemas handle validation directly
  visibleSteps.forEach((step, index) => {
    const validationResult = validateStep(step.id, formData);
    
    if (validationResult.success) {
      completedSteps.add(index);
      console.log(`✅ Step ${step.id} is valid`);
    } else {
      console.log(`⚠️ Step ${step.id} validation failed:`, validationResult.errors);
    }
  });

  return completedSteps;
};

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
   const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [currentStepSubmitHandler, setCurrentStepSubmitHandler] = useState(null);
  
  // Store saved form data from all steps as JSON
  const [formData, setFormData] = useState({});
  
  // Initialize React Hook Form
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {},
  });

  // Fetch draft data from API when initialDraftId is provided
  const fetchDraftData = useCallback(async (id) => {
    try {
      setIsLoadingDraft(true);
      console.log('🔄 Fetching PG draft data for ID:', id);
      
      const response = await draftApi.getListingDraftById(id);
      
      if (response.success && response.data) {
        console.log('✅ PG draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft
        if (response.data.draftData) {
          const draftData = response.data.draftData;
          console.log('📝 Draft data fields:', Object.keys(draftData));
          setFormData(draftData);
          console.log('✅ Form data populated from draft');
          
          // Calculate completed steps based on draft data
          const completed = getCompletedStepsFromData(draftData);
          setCompletedSteps(completed);
          console.log('✅ Completed steps synced with draft data:', Array.from(completed));
          
          // Start from the first incomplete step to continue progress
          const visibleSteps = getVisibleSteps(draftData);
          let firstIncompleteStep = 0;
          for (let i = 0; i < visibleSteps.length; i++) {
            if (!completed.has(i)) {
              firstIncompleteStep = i;
              break;
            }
          }
          setCurrentStep(firstIncompleteStep);
          console.log('📍 Starting at step:', firstIncompleteStep, visibleSteps[firstIncompleteStep]?.name || 'Unknown');
        } else {
          console.warn('⚠️ No draftData found in response');
          setCurrentStep(0);
        }
      } else {
        console.error('❌ Failed to fetch PG draft data:', response);
      }
    } catch (error) {
      console.error('❌ Error fetching PG draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft && editingDraft.draftData) {
      setIsLoadingDraft(true);
      console.log('🔄 Loading PG draft data for editing:', editingDraft);
      
      const draftData = editingDraft.draftData;
      console.log('📝 Draft data fields:', Object.keys(draftData));
      
      // Set form data from draft
      setFormData(draftData);
  
      // Calculate completed steps based on draft data
      const completed = getCompletedStepsFromData(draftData);
      setCompletedSteps(completed);
      console.log('✅ Completed steps synced with draft data:', Array.from(completed));
      
      // Start from the first incomplete step to continue progress
      const visibleSteps = getVisibleSteps(draftData);
      let firstIncompleteStep = 0;
      for (let i = 0; i < visibleSteps.length; i++) {
        if (!completed.has(i)) {
          firstIncompleteStep = i;
          break;
        }
      }
      setCurrentStep(firstIncompleteStep);
      console.log('📍 Starting at step:', firstIncompleteStep, visibleSteps[firstIncompleteStep]?.name || 'Unknown');
      
      setIsLoadingDraft(false);
      console.log('✅ PG draft data loaded successfully');
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

  // Re-sync completed steps whenever formData changes (for update case)
  // This ensures the sidebar step status stays in sync with actual data
  useEffect(() => {
    // Only re-sync if we have form data (not during initial render)
    if (formData && Object.keys(formData).length > 0) {
      const completed = getCompletedStepsFromData(formData);
      
      // Only update if there's an actual difference to avoid infinite loops
      const currentCompleted = Array.from(completedSteps).sort().join(',');
      const newCompleted = Array.from(completed).sort().join(',');
      
      if (currentCompleted !== newCompleted) {
        setCompletedSteps(completed);
        console.log('🔄 Completed steps re-synced with form data:', Array.from(completed));
      }
    }
  }, [formData]);

  /**
   * Helper to flatten nested formData for backwards compatibility with validation
   * Converts { stepId: { field1: value1 } } to { field1: value1, field2: value2, ... }
   */
  const flattenFormData = useCallback((nestedData) => {
    const flattened = {};
    Object.entries(nestedData).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Merge step data into flattened object
        Object.assign(flattened, value);
      } else {
        // Keep top-level primitives (backwards compatibility)
        flattened[key] = value;
      }
    });
    return flattened;
  }, []);

  // Memoize the form data (flattened for validation)
  const formDataWithType = useMemo(() => {
    return flattenFormData(formData);
  }, [formData, flattenFormData]);

  // Get total steps
  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  /**
   * Update form data for a specific step
   * @param {string} stepId - The ID of the step (e.g., 'basic-details')
   * @param {Object} stepData - The data for that step
   */
  const updateFormData = useCallback((stepId, stepData) => {
    if (!stepId) {
      console.warn('updateFormData called without stepId, using flat structure');
      // Fallback to flat structure if no stepId provided (backwards compatibility)
      setFormData(prev => ({ ...prev, ...stepData }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...(prev[stepId] || {}),
        ...stepData,
      }
    }));
    
    console.log(`📝 Updated PG form data for step: ${stepId}`, stepData);
  }, []);

  // Sanitize data to remove circular references and non-serializable values
  const sanitizeData = useCallback((obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Error sanitizing data, manually filtering:', error);
      const sanitized = {};
      for (const key in obj) {
        const value = obj[key];
        if (
          value !== null && 
          value !== undefined &&
          typeof value !== 'function' &&
          !(value instanceof HTMLElement) &&
          !(value instanceof Window)
        ) {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
  }, []);

  // Save draft to backend
  const saveDraft = useCallback(async (updatedData, showToast = true) => {
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

    // Update draft with actual data (sanitized)
    try {
      const dataToSave = sanitizeData(updatedData || formData);
      
      console.log('Calling updateListingDraft API...', {
        draftId: currentDraftId,
        dataKeys: Object.keys(dataToSave),
      });
      
      const response = await draftApi.updateListingDraft(currentDraftId, dataToSave);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('✅ PG draft saved successfully to backend');
        if (showToast) {
          toast.success('Draft saved successfully', {
            description: 'Your changes have been saved',
            duration: 3000,
          });
        }
        return { success: true, data: response, draftId: currentDraftId };
      } else {
        console.warn('⚠️ PG draft save returned unsuccessful response:', response);
        if (showToast) {
          toast.error('Failed to save draft', {
            description: response.message || 'Unknown error occurred',
            duration: 4000,
          });
        }
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save PG draft:', error);
      if (showToast) {
        toast.error('Error saving draft', {
          description: error.message || 'An unexpected error occurred',
          duration: 4000,
        });
      }
      return { success: false, error: error.message };
    }
  }, [draftId, formData, sanitizeData]);

  // Navigate to next step with "Save & Continue"
  const saveAndContinue = useCallback(async (stepData, stepId) => {
    try {
      // Get current step ID from visible steps
      const visibleSteps = getVisibleSteps(formDataWithType);
      const currentStepId = stepId || visibleSteps[currentStep]?.id;
      
      if (!currentStepId) {
        console.error('Could not determine current step ID');
        return;
      }
      
      // Update form data with nested structure
      const updatedFormData = {
        ...formData,
        [currentStepId]: {
          ...(formData[currentStepId] || {}),
          ...stepData,
        }
      };
      
      updateFormData(currentStepId, stepData);
      
      // Save to backend
      console.log('Saving PG draft to backend...', { draftId, stepData });
      toast.loading('Saving draft...', { id: 'save-draft' });
      const saveResult = await saveDraft(updatedFormData, false); // Don't show toast from saveDraft
      
      if (saveResult.success) {
        console.log('PG draft saved successfully');
        toast.success('Progress saved!', {
          id: 'save-draft',
          description: 'Moving to next step',
          duration: 2000,
        });
      } else {
        console.warn('PG draft save unsuccessful, but continuing to next step');
        toast.error('Failed to save', {
          id: 'save-draft',
          description: saveResult.message || 'An error occurred',
          duration: 3000,
        });
      }
      
      // Recalculate completed steps based on the updated data
      const newCompletedSteps = getCompletedStepsFromData(updatedFormData);
      setCompletedSteps(newCompletedSteps);
      console.log('✅ Completed steps updated after save:', Array.from(newCompletedSteps));
      
      // Move to next step
      const totalSteps = getTotalSteps();
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error in saveAndContinue:', error);
      // Still proceed to next step even if save fails
      // Recalculate completed steps based on current formData
      const updatedFormData = { ...formData, ...stepData };
      const newCompletedSteps = getCompletedStepsFromData(updatedFormData);
      setCompletedSteps(newCompletedSteps);
      
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

  /**
   * Get data for a specific step
   * @param {string} stepId - The step ID
   * @returns {Object} The step's data
   */
  const getStepData = useCallback((stepId) => {
    return formData[stepId] || {};
  }, [formData]);

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
    getStepData,
    draftId,
    setDraftId,
    saveDraft,
    isCreatingDraft,
    isLoadingDraft,
    currentStepSubmitHandler,
    setCurrentStepSubmitHandler,
  };

  return (
    <PgFormContextV2.Provider value={value}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </PgFormContextV2.Provider>
  );
};
