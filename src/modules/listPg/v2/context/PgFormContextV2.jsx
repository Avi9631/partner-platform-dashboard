import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { getTotalVisibleSteps, getVisibleSteps } from '../config/stepConfigurationPg';
import { draftApi } from '@/services/draftService';

const PgFormContextV2 = createContext(null);

/**
 * Helper function to determine which steps have data
 * Returns a Set of step indices that have completed data
 */
const getCompletedStepsFromData = (formData) => {
  const completedSteps = new Set();
  const visibleSteps = getVisibleSteps(formData);

  visibleSteps.forEach((step, index) => {
    let hasData = false;

    switch (step.id) {
      case 'basic-details':
        hasData = !!(formData.pgHostelName || formData.propertyFor || formData.pgHostelType);
        break;
      case 'location-details':
        hasData = !!(formData.address || formData.latitude || formData.longitude);
        break;
      case 'room-types':
        hasData = !!(formData.roomTypes && formData.roomTypes.length > 0);
        break;
      case 'amenities':
        hasData = !!(formData.amenities && Object.keys(formData.amenities).length > 0);
        break;
      case 'food-mess':
        hasData = !!(formData.foodAvailable !== undefined || formData.messAvailable !== undefined);
        break;
      case 'rules-restrictions':
        hasData = !!(formData.rules || formData.restrictions);
        break;
      case 'media-upload':
        hasData = !!(formData.images && formData.images.length > 0);
        break;
      default:
        hasData = false;
    }

    if (hasData) {
      completedSteps.add(index);
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
      console.log('Fetching PG draft data for ID:', id);
      
      const response = await draftApi.getListingDraftById(id);
      
      if (response.success && response.data) {
        console.log('PG draft data fetched successfully:', response.data);
        
        // Set form data from fetched draft
        if (response.data.draftData) {
          const draftData = response.data.draftData;
          setFormData(draftData);
          console.log('Form data populated from draft');
          
          // Calculate completed steps based on draft data
          const completed = getCompletedStepsFromData(draftData);
          setCompletedSteps(completed);
          console.log('Completed steps synced with draft data:', Array.from(completed));
        }
        
        // Start from the first step
        setCurrentStep(0);
      } else {
        console.error('Failed to fetch PG draft data:', response);
      }
    } catch (error) {
      console.error('Error fetching PG draft data:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  }, []);

  // Load draft data when editingDraft is provided (legacy support)
  const loadDraftData = useCallback(() => {
    if (editingDraft && editingDraft.draftData) {
      setIsLoadingDraft(true);
      console.log('Loading PG draft data for editing:', editingDraft);
      
      const draftData = editingDraft.draftData;
      // Set form data from draft
      setFormData(draftData);
  
      // Calculate completed steps based on draft data
      const completed = getCompletedStepsFromData(draftData);
      setCompletedSteps(completed);
      console.log('Completed steps synced with draft data:', Array.from(completed));
      
      // Start from the first step
      setCurrentStep(0);
      
      setIsLoadingDraft(false);
      console.log('PG draft data loaded successfully');
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

  // Memoize the form data with propertyType
  const formDataWithType = useMemo(() => ({
    ...formData,
   }), [formData,  ]);

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
        return { success: true, data: response, draftId: currentDraftId };
      } else {
        console.warn('⚠️ PG draft save returned unsuccessful response:', response);
        return { success: false, message: response.message || 'Unknown error' };
      }
    } catch (error) {
      console.error('❌ Failed to save PG draft:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData, sanitizeData]);

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
