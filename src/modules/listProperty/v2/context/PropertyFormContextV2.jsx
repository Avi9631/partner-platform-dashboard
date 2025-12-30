import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getTotalVisibleSteps } from '../config/stepConfiguration';
import { draftApi } from '@/services/draftService';

const PropertyFormContextV2 = createContext(null);

export const usePropertyFormV2 = () => {
  const context = useContext(PropertyFormContextV2);
  if (!context) {
    throw new Error('usePropertyFormV2 must be used within PropertyFormProviderV2');
  }
  return context;
};

export const PropertyFormProviderV2 = ({ children, onClose, initialDraftId, editingDraft }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyType, setPropertyType] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [draftId, setDraftId] = useState(initialDraftId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [currentStepSubmitHandler, setCurrentStepSubmitHandler] = useState(null);

  // Load draft data on mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!initialDraftId && !editingDraft) return;

      try {
        setIsLoading(true);
        
        let draftData;
        if (initialDraftId) {
          const response = await draftApi.getListingDraftById(initialDraftId);
          draftData = response.success ? response.data?.draftData : null;
        } else if (editingDraft) {
          draftData = editingDraft.draftData || editingDraft.formData;
        }

        if (draftData) {
          setFormData(draftData);
          if (draftData.propertyType) {
            setPropertyType(draftData.propertyType);
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [initialDraftId, editingDraft]);

  const formDataWithType = useMemo(() => ({
    ...formData,
    propertyType,
  }), [formData, propertyType]);

  const getTotalSteps = useCallback(() => {
    return getTotalVisibleSteps(formDataWithType);
  }, [formDataWithType]);

  const updateFormData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  // Simplified draft save
  const saveDraft = useCallback(async (updatedData) => {
    try {
      const dataToSave = updatedData || formData;
      
      // Create draft if none exists
      if (!draftId) {
        const createResponse = await draftApi.createListingDraft({ status: 'draft' });
        if (createResponse.success && createResponse.data?.draftId) {
          const newDraftId = createResponse.data.draftId;
          setDraftId(newDraftId);
          const response = await draftApi.updateListingDraft(newDraftId, dataToSave);
          return { success: response.success, draftId: newDraftId };
        }
        return { success: false, message: 'Failed to create draft' };
      }
      
      // Update existing draft
      const response = await draftApi.updateListingDraft(draftId, dataToSave);
      return { success: response.success, draftId };
    } catch (error) {
      console.error('Save draft error:', error);
      return { success: false, error: error.message };
    }
  }, [draftId, formData]);

  const saveAndContinue = useCallback(async (stepData) => {
    const updatedFormData = { ...formData, ...stepData };
    updateFormData(stepData);
    
    // Wait for draft to save before proceeding
    const result = await saveDraft(updatedFormData);
    if (!result.success) {
      console.error('Failed to save draft:', result.error);
      // Still continue even if save fails (user can retry later)
    }
    
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, getTotalSteps, updateFormData, formData, saveDraft]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const goToStep = useCallback((step) => setCurrentStep(step), []);

  const resetForm = useCallback(() => {
    setFormData({});
    setCurrentStep(0);
    setPropertyType(null);
    setCompletedSteps(new Set());
    setDraftId(null);
  }, []);

  const isStepCompleted = useCallback((step) => completedSteps.has(step), [completedSteps]);

  const getProgress = useCallback(() => {
    const totalSteps = getTotalSteps();
    return totalSteps <= 1 ? 0 : Math.round((currentStep / (totalSteps - 1)) * 100);
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
    isLoading,
    currentStepSubmitHandler,
    setCurrentStepSubmitHandler,
  };

  return (
    <PropertyFormContextV2.Provider value={value}>
      {children}
    </PropertyFormContextV2.Provider>
  );
};
